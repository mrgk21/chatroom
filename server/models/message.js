const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const messageSchema = new Schema({
	chatroom: ObjectId,
	sender: ObjectId,
	msg: {
		content: String,
		time: Date,
	},
});

const MessageModel = new mongoose.model("message", messageSchema);

module.exports = { MessageModel };
