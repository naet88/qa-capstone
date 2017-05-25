/* global $ */

var state = {

  askQuesPage: {
    // maybe: isQuestionPosting
  },
  quesDisplayPage: {
    // hold api post state
    // as well as the get request data
    question: {}
  },
  homePage: {
    questions: []
  }
};


// STATE MODIFICATION

function storeQues(quesObject) {
  state.quesDisplayPage.question = quesObject.question;
  console.log('This is the updated state: ', state.quesDisplayPage.question);
}

function storeAllQues(quesObject) {
  state.homePage.questions = quesObject.questions;
  console.log('this is the homepage state', state.homePage.questions);
}

function postQues(question, callback) {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(question),
    contentType: 'application/json',
    url: '/api/questions',
    // need to handle errors at some point
    success: function(response) {
      callback(response); // want to run quesRender
    // success: callback (apparently the same thing)
    }
  });
}

// RENDER IN THE DOM

function quesRender(state, element) {
  var url = 'http://localhost:8080/question?' + state.quesDisplayPage.question.id;
  history.pushState({}, '', url);
  pageRender(state, element);

  $(element).find('.js-questionTitle').text(state.quesDisplayPage.question.questionTitle);
  $(element).find('.js-questionDetail').text(state.quesDisplayPage.question.questionDetail);

  if (state.quesDisplayPage.question.answers.length > 0) {
    $(element).find('.js-answerDisplay').show();  
    // DO something like this:
    // $('main').find('.js-answerDisplay').clear()
    state.quesDisplayPage.question.answers.forEach(function (item) {  
      $(element).find('.js-answer-panel').append(
        '<div class="panel-body">\
        <p>' + item.content + '</p>\
        <strong><p>' + item.username + '</p></strong>\
        </div>');
    });
  }
}

// Event 
$('form#askQuestion').on('submit', function (event) {
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

  // Original:
  // function postQuesCallback(postedQuestion) {
  //   storeQues(postedQuestion);
  //   quesRender(state, $('main'));
  // }

  // postQues(data, postQuesCallback);

  // New:

  function postQuesCallback(postedQuestion, callback) {
    storeQues(postedQuestion);
    callback();
  }
  //i want this to be my callback
  quesRender(state, $('main'))

  postQues(data, function(postedQuestion, callback) {
    storeQues(postedQuestion);
    callback();
  }); 

 postQues(data, function(postedQuestion, callback) {
    storeQues(postedQuestion, function(state, $('main')) {

    });
    
  }); 

});



// STEP 4: JQUERY EVENT LISTENERS
// Is there a function that is an "event listener for new browser url"


