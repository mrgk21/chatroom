const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const chatroomSchema = new Schema({
	name: String,
	picture: String,
	lastActive: Date,
	users: [ObjectId],
	admins: [ObjectId],
});

const ChatroomModel = new mongoose.model("chatroom", chatroomSchema);

module.exports = { ChatroomModel };
