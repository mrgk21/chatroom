const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
	name: String,
	credentials: ObjectId,
	lastActive: {
		type: Date,
		default: Date.now(),
	},
	chatrooms: [ObjectId],
	friends: [ObjectId],
});

const UserModel = new mongoose.model("users", userSchema);

module.exports = { UserModel };
