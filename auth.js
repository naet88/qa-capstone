const { BasicStrategy } = require('passport-http');
const passport = require('passport');

const { User } = require('./models/user');

const basicStrategy = new BasicStrategy(function(username, password, callback) {
  let user;
  User
    .findOne({ username: username })
    .exec()
    .then(_user => {
      user = _user;
      if (!user) {
        return callback(null, false, { message: 'Incorrect username' });
      }
      return user.validatePassword(password);
    })
    .then(isValid => {
      if (!isValid) {
        return callback(null, false, { message: 'Incorrect password' });
      }
      return callback(null, user);
    });
});

passport.use(basicStrategy);

const initialize = passport.initialize();
const authenticate = passport.authenticate('basic', { session: false });

module.exports = { initialize, authenticate };
