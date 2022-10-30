const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const userSchema = new Schema({
	name: String,
	credentials: ObjectId,
	currentlyActive: Boolean,
	lastActive: Number,
	chatrooms: [ObjectId],
	friends: [ObjectId],
	banned: [ObjectId],
});

const UserModel = new mongoose.model("users", userSchema);

module.exports = { UserModel };
