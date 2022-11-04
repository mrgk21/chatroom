const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
// const { Server } = require("socket.io");
// const socketServer = require("./socket-server");
const _ = require("lodash");
const Joi = require("joi");

const mongoose = require("mongoose");
const { UserModel } = require("./models/user");
const { ChatroomModel } = require("./models/chatroom");
const { MessageModel } = require("./models/message");
const { CredentialModel } = require("./models/credentials");

const app = express();
app.use(cors());
app.use(express.json());

const server = createServer(app).listen(3001, () => {
	console.log("socket server running on port 3001...");
	mongoose.connect("mongodb://localhost:27017/chat-app", (err) => {
		if (err) console.log("connection failed");
		console.log("mongodb server running on port 27017...");
	});
});

// const io = new Server(server, {
// 	cors: {
// 		origin: "http://localhost:3000",
// 		methods: ["GET", "POST"],
// 	},
// });

// socketServer.createSocketServer(socket);
// socketServer.useNamespace("/chat");

const authSchema = Joi.object().keys({
	user: Joi.string().max(20).required(),
	pass: Joi.string().max(20),
});

//authorize login
app.post("/auth/login", async (req, res) => {
	const userDetails = req.body.auth;

	let errObj = {};
	try {
		await authSchema.validateAsync(userDetails, { abortEarly: false });
	} catch (error) {
		for (const details of error.details) {
			errObj[details.path[0]] = details.message;
		}

		return res.status(400).send({
			message: "Validation error",
			error: errObj,
		});
	}

	// check if fields match database
	try {
		const result = await CredentialModel.exists(userDetails).exec();
		if (result === null)
			return res
				.status(400)
				.send({ message: "Invalid username/password", error: { general: "Invalid credentials" } });

		console.log(`${userDetails.user} has joined.`);
		const { _id: userId } = await UserModel.findOne({ credentials: result._id }).exec();
		res.status(200).send({ message: "Logging in...", _id: userId });
	} catch (error) {
		console.log(error);
	}
});

//handle new user registration
app.post("/auth/register", async (req, res) => {
	const userDetails = req.body.auth;

	let errObj = {};
	try {
		await authSchema.validateAsync(userDetails, { abortEarly: false });
	} catch (error) {
		for (const details of error.details) {
			errObj[details.path[0]] = details.message;
		}

		return res.status(400).send({
			message: "Validation error",
			error: errObj,
		});
	}

	try {
		const result = await CredentialModel.exists(userDetails).exec();
		if (result !== null)
			return res
				.status(400)
				.send({ message: "User already registered.", error: { general: "User already registered" } });

		const userObj = await CredentialModel.create(userDetails);
		console.log(userObj);
		const userProfile = {
			name: userObj.user,
			credentials: userObj._id,
		};
		await UserModel.create(userProfile);
		return res.status(201).send({ message: "User successfully registered." });
	} catch (error) {
		console.log(error);
	}
});

//find all groups of a user
app.get("/chat/:userId/group", async (req, res) => {
	try {
		const { userId } = req.params;
		const { name: userName, chatrooms: chatroomIds } = await UserModel.findOne({ _id: userId }).exec();
		if (chatroomIds === null) return res.send(400);
		const { users } = await ChatroomModel.findOne({ users: userId }).exec();
		if (users === null) return res.send(400);

		let names = [];
		for (const roomId of chatroomIds) {
			const {
				picture,
				name: groupName,
				_id: groupId,
			} = await ChatroomModel.findOne({ _id: roomId, users: userId }).exec();

			const { content } = (
				await MessageModel.aggregate().sort({ "msg.time": -1 }).limit(1).project({ content: "$msg.content" })
			)[0];

			names.push({ picture, groupName, groupId, message: { userName, content } });
		}
		console.log("sent names to", userName);
		res.status(200).send(names);
	} catch (error) {
		console.log(error);
		return res.status(500);
	}
});

//get messages of a group
app.get("/chat/:userId/group/:groupId", async (req, res) => {
	try {
		const { userId, groupId } = req.params;
		const { recentMsgId } = req.query;

		if (recentMsgId !== undefined) {
			const message = await MessageModel.findOne({ _id: recentMsgId }).exec();
			if (message === null) return res.sendStatus(204);

			const { _id, sender, msg } = message;
			return res.status(200).send({ _id, sender, content: msg.content });
		}

		const user = await UserModel.findOne({ chatrooms: groupId }).exec();
		if (user === null) return res.sendStatus(400);

		const room = await ChatroomModel.findOne({ users: userId }).exec();
		if (room === null) return res.sendStatus(400);

		const messages = await MessageModel.aggregate()
			.sort({ "msg.time": -1 })
			.limit(50)
			.project({ _id: "$_id", sender: "$sender", content: "$msg.content" });

		for (const msgIndex in messages) {
			const { name } = await UserModel.findOne({ _id: messages[msgIndex].sender }).exec();
			messages[msgIndex].sender = name;
		}

		return res.status(200).send(messages);
	} catch (error) {
		console.log(error);
		return res.status(500);
	}
});

//post the most recent message onto the group
app.post("/chat/:userId/group/:groupId", async (req, res) => {
	console.log("inside get messages");
	try {
		const { userId, groupId } = req.params;
		const { content } = req.body;
		const user = await UserModel.findOne({ chatrooms: groupId }).exec();
		if (user === null) return res.sendStatus(400);

		const room = await ChatroomModel.findOne({ users: userId }).exec();
		if (room === null) return res.sendStatus(400);

		const newMessage = {
			chatroom: groupId,
			sender: userId,
			msg: { content },
		};
		await MessageModel.create(newMessage);
		return res.sendStatus(200);
	} catch (error) {
		console.log(error);
	}
});

//search for people or groups
app.get("/chat/:userId/search/:searchString", async (req, res) => {
	const { userId, searchString } = req.params;
	const searchRegEx = new RegExp(`^${searchString}`, "i");
	const userIdRegEx = new RegExp(`^(?!${userId})`);
	console.log(searchRegEx, userIdRegEx);
	try {
		const users = (
			await UserModel.find({ name: { $regex: searchRegEx }, _id: { $not: { $eq: userId } } }).limit(5)
		).map((user) => {
			const userObj = { name: user.name, userId: user._id };
			return userObj;
		});

		const chatrooms = (await ChatroomModel.find({ name: { $regex: searchRegEx } }).limit(5)).map((room) => {
			const roomObj = { name: room.name, groupId: room._id };
			return roomObj;
		});
		console.log(users);
		res.status(200).send([...users, ...chatrooms]);
	} catch (error) {
		console.log(error);
	}
});

//add friends or join groups
app.put("/chat/:userId/:id", async (req, res) => {
	const { userId, id } = req.params;
	try {
		const user = await UserModel.findOne({ _id: userId }).exec();

		if (user.friends.find((personId) => personId.toString() === id) !== undefined) return res.sendStatus(204);

		if (user.chatrooms.find((roomId) => roomId.toString() === id) !== undefined) return res.sendStatus(204);
		const friendId = await UserModel.exists({ _id: id });
		if (friendId !== null) {
			await UserModel.updateOne({ _id: userId }, { $push: { friends: friendId } });

			return res.status(200).send({ message: "Added a friend!" });
		}

		const chatroomId = await ChatroomModel.exists({ _id: id });
		if (chatroomId !== null) {
			await UserModel.updateOne({ _id: userId }, { $push: { chatrooms: chatroomId } });
			return res.status(200).send({ message: "Joined a group!" });
		}

		return res.status(404).send({ message: "Not found" });
	} catch (error) {
		console.log(error);
	}
});

// chatNsp.on("connection", async (socket) => {
// 	socket.on("msg", (item) => {
// 		const newMessage = {
// 			chatroom: item.groupId,
// 			sender: item.sender,
// 			msg: {
// 				content: item.content,
// 			},
// 		};

// 		MessageModel.create(newMessage, (err) => console.log(err));
// 	});
// });

// io.on("connection", (socket) => {
// 	console.log(socket.id);

// 	socket.on("disconnect", (reason) => console.log(reason));

// 	socket.on("client-register", (userDetails, func) => {
// 		const { user, pass } = userDetails;
// 		if (user === "") return func({ loginAccess: false, message: "Username cannot be empty" });

// 		const regUsers = users.map((details) => details.user);
// 		if (regUsers.find((regUser) => regUser === user))
// 			return func({ loginAccess: false, message: "User already registered." });

// 		func({ loginAccess: true, message: "User successfully registered." });
// 		users.push({ user, pass, socketID: socket.socketID, loggedIn: true });
// 		console.log(`${userDetails.user} has joined.`);
// 	});

// 	socket.on("client-login", (userDetails, func) => {
// 		console.log(socket.id);
// 		if (
// 			users.find((userProfile) => {
// 				const { user, pass } = userProfile;
// 				return _.isEqual({ user, pass }, userDetails);
// 			})
// 		) {
// 			func({ loginAccess: true, message: "User found, logging in..." });
// 		} else {
// 			func({ loginAccess: false, message: "No user found" });
// 		}
// 	});
// });
