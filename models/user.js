const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
	firstName: {type: String},
	lastName: {type: String},
	username: {type: String},
	password: {type: String}
});

userSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		firstName: this.firstName,
		lastName: this.lastName,
		username: this.username,
	};
}

const User = mongoose.model('User', userSchema);

module.exports = {User};
