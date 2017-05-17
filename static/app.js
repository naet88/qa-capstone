//HIGH PRIORITY Things to go over
//1. success callback - not sure why I can't factorize this.
//2. Next steps? What to work on? I think I can get the homepage to work properly...so anything aside from this. 
//I think it's the answer section...does the URL change for that?
//
//low priority:
// not a big deal, but "back" button doesn't work. I think I have to pushstate



//STEP 1: STATE

var state = {
	questionTitle: '',
	questionDetail: '',
	username: '',
	questionId: '',
	likeCount: ''
};

//STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

function updateQuestionState(object) {
	state.questionTitle = object.question.questionTitle;
	state.questionDetail = object.question.questionDetail;
	state.username = object.question.username;
	state.questionId = object.question.id;
	state.likeCount = object.question.likeCount;
}

function updateQuestionIdState(object) {
	state.questionId = object;
}

//STEP 3: RENDER IN THE DOM FUNCTIONS

//http://localhost:8080/question/5915f3bf106a4c196d413be1

function getQuestionData(currentUrl) {
//whole point is to fetch the Q 
//retrieve questionID from state and inect into url 
	// navigate(currentUrl);

	var Id = currentUrl.split("?")[1];

	state.questionId = Id;

	$.ajax({
		type: 'GET',
	    contentType: 'application/json',
	    url: '/api/questions/' + state.questionId,						
	    success: function(data) {
			$('main').find('.js-questionTitle').text(data.question.questionTitle);
			$('main').find('.js-questionDetail').text(data.question.questionDetail);
		}
	});
};

function getAllQuestions() {
	$.ajax({
		type: 'GET',
	    contentType: 'application/json',
	    url: '/api/',						
	    success: function(object) {
			for (i=0; i <= 10; i++) {
				// console.log(object.questions[i].questionTitle);
				var qtitle = object.questions[i].questionTitle;

				$('main').find('.js-table').append("<tr><td>" + object.questions[i].questionTitle + "</td></tr>");
			}
		}
	});
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
		questionDetail: questionDetail,
		questionLikeCount: 0
	};

	$.ajax({
		type: 'POST',
		data: JSON.stringify(data),
	    contentType: 'application/json',
	    url: '/api/questions',						
	    //need to handle errors at some point 
	    success: function(results) {
	    	//state is now updated 
	    	updateQuestionState(results);
	    	navigate("http://localhost:8080/question?" + state.questionId);
	    }
	});
});


$('form#answerQuestion').on('submit', function(event) {
	event.preventDefault();
	
});




//initially this was success callback but didn't work

// function postQuestionCallback(results) {
			
// 	updateQuestionState(results);

// 	navigate("http://localhost:8080/question?" + state.questionId);
// };


function navigate(url) {
	history.pushState({}, "", url); 
	renderPage();
};


//INITIALIZE APP

function renderPage() {

	var currentUrl = window.location.href;

	if (currentUrl === "http://localhost:8080/") {
		$('main').find('.js-main-page').show();
		$('main').find('.js-question-display-page').hide();
		$('main').find('.js-question-page').hide();	
		$('main').find('.js-answerQuestion').hide();	

		getAllQuestions()

	} else if (currentUrl === "http://localhost:8080/ask-question") {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').show();
		$('main').find('.js-question-display-page').hide();
		$('main').find('.js-answerQuestion').hide();
	
	} else if (window.location.href.match(new RegExp("^http://localhost:8080/question"))) {
		$('main').find('.js-main-page').hide();
		$('main').find('.js-question-page').hide();
		$('main').find('.js-question-display-page').show();
		$('main').find('.js-answerQuestion').hide();

		getQuestionData(currentUrl);
		
	} 
};

renderPage();

// function updateQuestionPageState() {
// 	if (window.location.href.match(new RegExp("^http://localhost:8080/question"))) {
// 		var currentUrl = window.location.href;
// 		var Id = currentUrl.split("?")[1];

// 		state.questionId = Id;
// 		console.log(state.questionId);

// 		//need function w/ a get request that injects the data from ID into the webpage

// 		history.pushState({}, "", "http://localhost:8080/question-display-page.html/"+state.questionId);
// 		renderQuestionDisplayPage(state, $('main'));
// 	}

// };


// updatePageState();



