const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
	questionTitle: {type: String},
	username: {type: String},
	questionDetail: {type: String},
	questionLikeCount: {type: Number},
	answers: [{
		content: {type: String},
		likeCount: {type: Number},
		username: {type: String}
	}]
});

questionSchema.methods.apiRepr = function() {
	return {
		id: this._id,
		questionTitle: this.questionTitle,
		username: this.username,
		questionDetail: this.questionDetail,
		likeCount: this.questionLikeCount,
		answers: this.answers
	};
}

const Question = mongoose.model('Question', questionSchema);

module.exports = {Question};
