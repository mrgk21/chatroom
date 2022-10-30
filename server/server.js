const { createServer } = require("http");
const { Server } = require("socket.io");
const _ = require("lodash");
const Joi = require("joi");

const mongoose = require("mongoose");
const { UserModel } = require("./models/user");
const { ChatroomModel } = require("./models/chatroom");
const { MessageModel } = require("./models/message");
const { CredentialModel } = require("./models/credentials");

const authSchema = Joi.object().keys({
	user: Joi.string().max(20).required(),
	pass: Joi.string().max(20),
});

const server = createServer().listen(3001, () => {
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

io.of("auth").on("connection", (socket) => {
	socket.on("login", async (userDetails, func) => {
		//check if field data are of correct format
		let errObj = {};
		try {
			await authSchema.validateAsync(userDetails, { abortEarly: false });
		} catch (error) {
			for (const details of error.details) {
				errObj[details.path[0]] = details.message;
			}

			return func({
				message: "Validation error",
				error: errObj,
			});
		}

		// check if fields match database
		try {
			const result = await CredentialModel.exists(userDetails).exec();
			if (result === null)
				return func({ message: "Invalid username/password", error: { general: "Invalid credentials" } });

			console.log(`${userDetails.user} has joined.`);
			func({ message: "Logging in..." });
		} catch (error) {
			console.log(error);
		}
	});

	socket.on("register", async (userDetails, func) => {
		let errObj = {};
		try {
			await authSchema.validateAsync(userDetails, { abortEarly: false });
		} catch (error) {
			for (const details of error.details) {
				errObj[details.path[0]] = details.message;
			}

			return func({
				message: "Validation error",
				error: errObj,
			});
		}

		try {
			const result = await CredentialModel.exists(userDetails).exec();
			if (result !== null)
				return func({ message: "User already registered.", error: { general: "User already registered" } });

			await CredentialModel.create(userDetails);
			return func({ message: "User successfully registered." });
		} catch (error) {
			console.log(error);
		}
	});
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