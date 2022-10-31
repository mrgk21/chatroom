const express = require("express");
const cors = require("cors");
const { createServer } = require("http");
const { Server } = require("socket.io");
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

const io = new Server(server, {
	cors: {
		origin: "http://localhost:3000",
		methods: ["GET", "POST"],
	},
});

const authSchema = Joi.object().keys({
	user: Joi.string().max(20).required(),
	pass: Joi.string().max(20),
});

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
		res.status(200).send({ message: "Logging in...", _id: result._id });
	} catch (error) {
		console.log(error);
	}
});

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

app.get("/chat/:userId/group", async (req, res) => {
	try {
		const { userId } = req.params;
		const { name: userName, chatrooms: chatroomIds } = await UserModel.findOne({ _id: userId }).exec();
		if (chatroomIds === null) return res.send(400);
		console.log(chatroomIds);
		let names = [];
		for (const roomId of chatroomIds) {
			const { picture, name: groupName, _id: groupId } = await ChatroomModel.findOne({ _id: roomId }).exec();
			const { content } = (
				await MessageModel.aggregate()
					.sort({ msg: { time: -1 } })
					.limit(1)
					.project({ content: "$msg.content" })
			)[0];
			const obj = { picture, groupName, groupId, message: { userName, content } };
			names.push(obj);
		}
		console.log("sent names to", userName);
		res.status(200).send(names);
	} catch (error) {
		console.log(error);
		return res.status(500);
	}
});

app.get("/chat/:user/group/:groupId", async (req, res) => {
	try {
		const { user, groupId } = req.params;
	} catch (error) {
		console.log(error);
		return res.status(500);
	}
});

io.on("connection", (socket) => {
	console.log(socket.id);

	socket.on("disconnect", (reason) => console.log(reason));

	socket.on("client-register", (userDetails, func) => {
		const { user, pass } = userDetails;
		if (user === "") return func({ loginAccess: false, message: "Username cannot be empty" });

		const regUsers = users.map((details) => details.user);
		if (regUsers.find((regUser) => regUser === user))
			return func({ loginAccess: false, message: "User already registered." });

		func({ loginAccess: true, message: "User successfully registered." });
		users.push({ user, pass, socketID: socket.socketID, loggedIn: true });
		console.log(`${userDetails.user} has joined.`);
	});

	socket.on("client-login", (userDetails, func) => {
		console.log(socket.id);
		if (
			users.find((userProfile) => {
				const { user, pass } = userProfile;
				return _.isEqual({ user, pass }, userDetails);
			})
		) {
			func({ loginAccess: true, message: "User found, logging in..." });
		} else {
			func({ loginAccess: false, message: "No user found" });
		}
	});
});

// app.get("/search-room", (req, res) => {
// 	if (!req.message) return res.status(400).json({ name: room.name, message: "Invalid request" });
// 	const room = rooms.find((room) => room.name === req.message.name);
// 	if (typeof room === "undefined") {
// 		return res.status(404).json({ name: room.name, message: "Room not found." });
// 	} else {
// 		room.activeUsers.push(req.message.user);
// 		return res.status(200).json({ name: room.name, message: "Room found. Joining..." });
// 	}
// });

// app.post("/create-room/:roomName", (req, res) => {
// 	const { roomName } = req.params;
// 	if (!roomName) return res.status(400).json({ name: roomName, message: "Invalid request" });
// 	if (typeof rooms.find((room) => room.name === roomName) === "undefined") {
// 		rooms.push({ name: roomName, image: "default", users: [] });
// 		res.status(201).json({ name: roomName, message: "Room created." });
// 	} else res.status(400).json({ name: null, message: "Room already exists." });
// 	console.log(rooms);
// });

//track users using session ID npm package: express-session
//read up on cookies
