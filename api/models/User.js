const mongoose = require("mongoose");

//* Схема пользователя
const userSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		max: 255,
		min: 2,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		max: 255,
		min: 6,
		trim: true
	},
	password: {
		type: String,
		required: true,
		max: 1024,
		min: 6,
	},
	deleted: {
		type: Boolean,
		default: false,
		required: true
	}
},
	{
		timestamps: true
	}
);

module.exports = mongoose.model("User", userSchema);
