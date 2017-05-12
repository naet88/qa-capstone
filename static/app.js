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

function updateQuestionIdState(object) {
	state.questionId = object;
}

//STEP 3: RENDER IN THE DOM FUNCTIONS


// function renderQuestionDisplayPage(state, element) {
// 	$(element).find('.js-questionTitle').text(state.questionTitle);
// 	$(element).find('.js-questionDetail').text(state.questionDetail);

// 	//use this id: 5915f3bf106a4c196d413be1
// 	$.ajax({
// 		type: 'GET',
// 	    contentType: 'application/json',
// 	    url: '/api/questions/'+ state.questionId,						
// 	    success: function(question) {
// 	    	$(element).find('.js-questionTitle').text(question.questionTitle);
// 			$(element).find('.js-questionDetail').text(question.questionDetail);

// 		}
// 	});

// };

//http://localhost:8080/question-display-page.html/5915f3bf106a4c196d413be1

function renderQuestionDisplayPage() {

	if (window.location.href.match(new RegExp("^http://localhost:8080/question-display-page.html"))) {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').hide();
		$('main').find('.js-question-display-page').show();

		//use this id: 5915f3bf106a4c196d413be1
		$.ajax({
			type: 'GET',
		    contentType: 'application/json',
		    url: '/api/questions/5915f3bf106a4c196d413be1',						
		    success: function(data) {
		    	console.log(data);
			}
		});
	};

};

renderQuestionDisplayPage();


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


	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
	    contentType: 'application/json',
	    url: '/api/questions',						
	    //need to handle errors at some point 
	    success: function(results) {
			
			updateQuestionConfig(results);

	    	var questionId = results.question.id;
	    	var questionTitle = results.question.questionTitle;
	    	var questionDetail = results.question.questionDetail;


	    	
	    	$('main').find('.js-questionTitle').text(questionTitle);
			$('main').find('.js-questionDetail').text(questionDetail);

	    	//if i refresh, this doesn't work. sigh. 
	    	navigate("http://localhost:8080/question-display-page.html?"+questionId);
	    }
	});
});

//INITIALIZE APP
function navigate(url) {
	history.pushState({}, "", url); 
	refreshPage();
};

function refreshPage() {

	if (window.location.href === "http://localhost:8080/index") {
		$('main').find('.js-main-page').show();
		$('main').find('.js-question-display-page').hide();
		$('main').find('.js-question-page').hide();	

	} else if (window.location.href === "http://localhost:8080/question-page.html") {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').show();
		$('main').find('.js-question-display-page').hide();
	
	} else if (window.location.href.match(new RegExp("^http://localhost:8080/question-display-page.html"))) {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').hide();
		$('main').find('.js-question-display-page').show();

		var currentUrl = window.location.href;

		var Id = currentUrl.split("?")[1];

		state.questionId = Id;
		console.log(state.questionId);

		//need function w/ a get request that injects the data from ID into the webpage

		history.pushState({}, "", "http://localhost:8080/question-display-page.html/"+state.questionId);
		renderQuestionDisplayPage(state, $('main'));
		
		// var testregex = window.location.href.match(new RegExp("^http://localhost:8080/question-display-page.html((\w+))"))
		
	} 

};

// refreshPage();



