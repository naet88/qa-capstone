const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

mongoose.Promise = global.Promise;

const userSchema = mongoose.Schema({
  firstName: { type: String },
	lastName: { type: String },
	username: { type: String },
	password: { type: String },
});

userSchema.methods.apiRepr = function () {
  return {
  	id: this._id,
  	firstName: this.firstName,
    lastName: this.lastName,
    username: this.username,
};
};

userSchema.methods.validatePassword = function (password) {
  return bcrypt
    .compare(password, this.password)
    .then(isValid => isValid);
}

userSchema.statics.hashPassword = function(password) {
  return bcrypt
    .hash(password, 10);
    // .then(hash => hash);
}

const User = mongoose.model('User', userSchema);

module.exports = {User};
