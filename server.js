const bodyParser = require('body-parser');
const express = require('express');
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

const {PORT, DATABASE_URL} = require('./config');
const {Question} = require('./models');

const app = express();
app.use(bodyParser.json());

//Begin CRUD operations

app.get('/questions', (req, res) => {
	Question
		.find()
		.exec()
		.then(questions => {
			res.json({
				questions: questions
			})
		})

		.catch(
			err => {
				console.error(err);
				return res.status(500).json({message: 'Internal server error'});
			});
});

app.post('/questions', (req, res) => {
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

app.put('/questions/:id', (req, res) => {
	//assuming ids match for now 
	const userAnswer = req.body.answer;

	Question
		.findOneAndUpdate({_id: req.params.id}, {$push: {answer: userAnswer}})
		.then(answer => {
			res.json({
				answer: userAnswer
			})
		})
		.catch(
			err => {
				console.error(err);
				return res.status(500).json({message: 'Internal server error'});
			});
});

let server;

//connects to database, then starts server
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