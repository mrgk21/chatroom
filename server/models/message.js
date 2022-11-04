const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const messageSchema = new Schema({
	chatroom: ObjectId,
	sender: ObjectId,
	msg: {
		content: String,
		time: {
			type: Date,
			default: Date.now(),
		},
	},
});

const MessageModel = new mongoose.model("message", messageSchema);

module.exports = { MessageModel };
