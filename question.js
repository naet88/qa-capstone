const mongoose = require('mongoose');

//Mongoose models need to have a Schema defined!

// const questionSchema = mongoose.Schema({
// 	questionTitle: {type: String, required: true},
// 	username: {type: String, required: true},
// 	questionDetail: {type: String, required: true},
// 	questionLikeCount: {type: Number},
// 	answers: [{
// 		content: {type: String, required: true},
// 		likeCount: {type: Number},
// 		username: {type: String, required: true}
// 	}]
// });

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
