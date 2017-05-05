const mongoose = require('mongoose');

//Mongoose models need to have a Schema defined!

const questionSchema = mongoose.Schema({
	questionTitle: {type: String, required: true},
	username: {type: String, required: true},
	questionDetail: {type: String, required: true},
	answer: {
		content: {type: Array},
		likeCount: {type: Number}
	}
});

questionSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		questionTitle: this.questionTitle,
		username: this.username,
		questionDetail: this.questionDetail,
		answer: {
			content: this.answer.content,
			likeCount: this.answer.likeCount
		}
	};
}

//Ah...what do w/ the answer?!?!
const Question = mongoose.model('Question', questionSchema);

module.exports = {Question};
