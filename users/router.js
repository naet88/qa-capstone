// const { BasicStrategy } = require('passport-http');
const express = require('express');
const jsonParser = require('body-parser').json();
// const passport = require('passport');

const { initialize, authenticate } = require('../auth');

const { User } = require('../models/user');

const router = express.Router();

router.use(jsonParser);
router.use(initialize);

router.post('/api/users', (req, res) => {
  if (!req.body) {
    return res.status(400).json({ message: 'No request body' });
  }

  if (!('username' in req.body)) {
    return res.status(422).json({ message: 'Missing field: username' });
  }

  let { username, password, firstName, lastName } = req.body;

  if (typeof username !== 'string') {
    return res.status(422).json({ message: 'Incorrect field type: username' });
  }

  username = username.trim();

  if (username === '') {
    return res.status(422).json({ message: 'Incorrect field length: username' });
  }

  if (!(password)) {
    return res.status(422).json({ message: 'Missing field: password' });
  }

  if (typeof password !== 'string') {
    return res.status(422).json({ message: 'Incorrect field type: password' });
  }

  password = password.trim();

  if (password === '') {
    return res.status(422).json({ message: 'Incorrect field length: password' });
  }

  // check for existing user
  return User
    .find({ username })
    .count()
    .exec()
    .then(count => {
      if (count > 0) {
        return Promise.reject({
          name: 'AuthenticationError',
          message: 'username already taken',
        });
      }
      // if no existing user, hash password
      return User.hashPassword(password);
    })
    .then(hash => {
      return User
        .create({
          username: username,
          password: hash,
          firstName: firstName,
          lastName: lastName,
        });
    })
    .then(user => {
      return res.status(201).json(user.apiRepr());
    })
    .catch(err => {
      if (err.name === 'AuthenticationError') {
        return res.status(422).json({ message: err.message });
      }
      res.status(500).json({ message: 'Internal server error' });
    });
});

router.get('/api/users', (req, res) => {
  return User
    .find()
    .exec()
    .then(users => res.json(users.map(user => user.apiRepr())))
    .catch(err => console.log(err) && res.status(500).json({ message: 'Internal server error' }));
});

router.get('/me',
  authenticate,
  (req, res) => res.json({ user: req.user.apiRepr(), })
);

module.exports = { router };
