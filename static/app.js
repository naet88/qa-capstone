//QUESTIONS
//1. LINES 63-67 --> post request + URL. Is this remotely correct?
//2. GET request for initialize page. Should this go in the "render in DOM piece?" Am I even in the right trac here?

//STEP 1: STATE

var state = {
	questionTitle: '',
	questionDetail: '',
	username: '',
	questionId: ''
};

//STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

function updateQuestionConfig(object) {
	state.questionTitle = object.question.questionTitle;
	state.questionDetail = object.question.questionDetail;
	state.username = object.question.username;
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

	// updateQuestionConfig(data);

	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
	    contentType: 'application/json',
	    url: '/api/questions',						
	    success: function(results) {
			
			updateQuestionConfig(results);

	    	var questionId = results.question.id;
	    	var questionTitle = results.question.questionTitle;
	    	var questionDetail = results.question.questionDetail;

	    	history.pushState({}, "", "http://localhost:8080/question-display-page.html?id="+questionId); 

	    	//if i refresh, this doesn't work. sigh. 
	    	if (window.location.href === "http://localhost:8080/question-display-page.html?id="+questionId) {
				$('main').find('.js-main-page').hide();
				$('main').find('.js-question-page').hide();
				$('main').find('.js-question-display-page').show();
				$('main').find('.js-questionTitle').text(questionTitle);
				$('main').find('.js-questionDetail').text(questionDetail);
			};
	    }
	});
});



//INITIALIZE APP
function intializePage() {
	if (window.location.href === "http://localhost:8080/index.html") {
		$('main').find('.js-main-page').show();
		$('main').find('.js-question-display-page').hide();
		$('main').find('.js-question-page').hide();
		//need to do a get request

		// $.ajax({
		// type: 'GET',
		// data: JSON.stringify(data),
	 //    contentType: 'application/json',
	 //    url: '/api/',						
	 //    success: function(results) {
	 //    	//displays the results somehow in the DOM? 
		// };

	} else if (window.location.href === "http://localhost:8080/question-page.html") {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').show();
		$('main').find('.js-question-display-page').hide();
	
	} else if (window.location.href === "http://localhost:8080/question-display-page.html") {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').hide();
		$('main').find('.js-question-display-page').show();
	}
};

intializePage();



// if (window.location.href === "http://localhost:8080/question-page.html") {
// 	$('.js-question-page').show();
// };

// else (window.location.href === "http://localhost:8080/question-display-page")
// // INITIALIZE APP 

// if (window.location.href === "http://localhost:8080/question-page.html") { $('.js-question-page').show(); } 
// else (window.location.href === "http://localhost:8080/question-display-page.html") 
// { // Somehow fetch the id of the question we want to display 
// // http://localhost:8080/question-display-page.html?id=5ab4538643563456534 $('.js-question-display-page').show(); }


