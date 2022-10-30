const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const ObjectId = Schema.ObjectId;

const credSchema = new Schema({
	user: String,
	pass: String,
});

const CredentialModel = new mongoose.model("credentials", credSchema);

module.exports = { CredentialModel };
