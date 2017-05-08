//STEP 1: STATE

var state = {
	questionTitle: '',
	questionDetail: '',
	username: '',
	QuestionId: ''
};

//STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

function updateQuestionConfig(object) {
	state.questionTitle = object.questionTitle;
	state.questionDetail = object.questionDetail;
	state.username = object.username;
	state.questionId = object.question.id;
}

//STEP 3: RENDER IN THE DOM FUNCTIONS

function renderQuestionDisplayPage(state, element) {
	$(element).find('.js-questionTitle').text(state.questionTitle);
	$(element).find('.js-questionDetail').text(state.questionDetail);
}

//STEP 4: JQUERY EVENT LISTENERS

$('form#askQuestion').on('submit', function(event) {
	event.preventDefault();
	var question = $('#questionTitle').val();
	var questionDetail = $('#questionDetail').val();
	var username = 'username';

	var data = {
		questionTitle: question,
		username: username,
		questionDetail: questionDetail
	};

	updateQuestionConfig(data);

	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
	    contentType: 'application/json',
	    url: '/questions',						
	    success: function(results) {
	    	console.log(results);
	    	var questionId = results.question.id;

	    	window.location.href = 'http://localhost:8080/questions/' + questionId;
	    	

	    	//be able to route the user to their question 
	    	//but to do this, need to create a url JUST for that question...
	    	//for instance, domain.com/example-question-1
	    }
	});
});

