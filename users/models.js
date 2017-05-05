const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//need to use Mongoose to store user data!

const userSchema = mongoose.Schema({
	username: {
		type: String,
		required: true,
		unique: true
	},
	password: {
		type: String,
		required: true
	},
	firstName: {type: String, default: ""},
	lastName: {type: String, default: ""}
});

userSchema.methods.apiRepr = function() {
	//why return empty string 
	return {
		username: this.username || '',
		firstName: this.firstName || '',
		lastName: this.lastName || ''
	};
}

// userSchema.methods.validatePassword = function