const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
//is this even right...
const {router: usersRouter} = require('./users/router');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Question} = require('./models/question');
const {User} = require('./models/user');

const app = express();

function serveIndex (req, res) {
  res.sendFile(__dirname + '/static/index.html'); 
}

app.get('/', serveIndex);

app.get('/ask-question', serveIndex);

app.get('/question', serveIndex);

app.use(express.static('static'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//is this even right...
app.use('/users/', usersRouter);

// Begin CRUD operations - QUESTIONS

// app.get('/api/users', (req, res) => {
//   User
//     .find()
//     .exec()
//     .then(users => {
//       res.json({
//         users: users.map(user => {return user.apiRepr();})
//       })
//     })

//     .catch(
//       err => {
//         console.error(err);
//         return res.status(500).json({message: 'Internal server error'});
//       });
// });

// //bcrypt.hash("B4c0/\/", salt, function(err, hash) {
//         // Store hash in your password DB.
//     // });
//     //https://github.com/dcodeIO/bcrypt.js#hashs-salt-callback-progresscallback

// app.post('/api/users', (req, res) => {
//   User
//     .create({
//       firstName: req.body.firstname,
//       lastName: req.body.lastname,
//       username: req.body.username,
//       password: 
//     })
//     .then(newUser => {
//       res.json({
//         user: newUser.apiRepr()
//       })
//     })
//     .catch(
//       err => {
//         console.error(err);
//         return res.status(500).json({message: 'Internal server error'});
//       });
// });

app.get('/api/questions', (req, res) => {
  Question
    .find()
    .exec()
    .then(questions => {
      res.json({
        questions: questions.map(question => {return question.apiRepr();})
      })
    })

    .catch(
      err => {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
      });
});

app.get('/api/questions/:id', (req, res) => {
  Question 
    .findById(req.params.id)
    .exec()
    .then(questions => {
      res.json({
        question: questions.apiRepr()
      });
    })
    .catch(
      err => {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
      });
}); 

app.post('/api/questions', (req, res) => {
  //check required fields 
  const requiredFields = ['questionTitle', 'username', 'questionDetail'];
  for (let i = 0; i < requiredFields.length; i++) {
    const field = requiredFields[i];
    if (!(field in req.body)) {
      const errorMessage = `Missing \`${field}\` in request body`
      console.error(errorMessage);
      return res.status(400).send(errorMessage);
    }
  }
  //if required fields are there, this executes:
  Question 
    .create({
      questionTitle: req.body.questionTitle,
      username: req.body.username,
      questionDetail: req.body.questionDetail
    })
    .then(newQuestion => {
      res.json({
        question: newQuestion.apiRepr()
      })
    })
    .catch(
      err => {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
      });
});

app.put('/api/questions/:id', (req, res) => {
  //assuming ids match for now
  //force minimum word count  
  const userAnswer = req.body.answers;
  // console.log('this is the answer: ', userAnswer);
  Question
    .findByIdAndUpdate(req.params.id, {$push: {answers: userAnswer}}, {'new': true})
    .then(questions => {
     const question = questions.apiRepr()
     res.json({question})
    })
    .catch(
      err => {
        console.error(err);
        return res.status(500).json({message: 'Internal server error'});
      });
});

// End CRUD operations - QUESTIONS/ANSWERS

let server;

// connects to database, then starts server
function runServer (databaseUrl = DATABASE_URL, port = PORT) {

  return new Promise((resolve, reject) => {
    mongoose.connect(databaseUrl, err => {
      if (err) {
        return reject(err);
      }
      server = app.listen(port, () => {
        console.log(`your app is listening on port ${port}`);
        resolve();
      })

      .on('error', err => {
        mongoose.disconnect();
        reject(err);
      });
    });
  });
}

function closeServer() {
  return mongoose.disconnect().then(() => {
    return new Promise((resolve, reject) => {
      console.log('closing server');
      server.close(err => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  });
}

if (require.main === module) {
  runServer().catch(err => console.error(err));
};

//need this so that other files can have access to this. 
module.exports = {runServer, closeServer};