/* global $ */

// req --> state --> DOM render 

// STEP 1: STATE

// state = memory. 
// keeping track of the page user is on. 
// homepage state

//render (state, element)
//what does it mean when a user is on the homepage...? list of questions?

/// Render functions:
// The HTML should reflect the state. 
// You should have a single function 
// for each part of the page which you want to update.

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

// STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

// the success callback should be modifying the state
function storeQuesData(quesObject) {
  state.quesDisplayPage.question = quesObject;
}

// END STEP 2

function getQuestionId(url) {
  var Id = url.split('?')[1];
  state.questionId = Id;
  return Id;
}

// STEP 3: RENDER IN THE DOM FUNCTIONS

function renderPage() {
  var currentUrl = window.location.href;

  if (currentUrl === 'http://localhost:8080/') {
    $('main').find('.js-main-page').show();
    $('main').find('.js-question-display-page').hide();
    $('main').find('.js-question-page').hide();
    $('main').find('.js-answerQuestion').hide();
    $('main').find('.js-answerDisplay').hide();

    getAllQuestions();

  } else if (currentUrl === 'http://localhost:8080/ask-question') {
    $('main').find('.js-main-page').hide();
    $('main').find('.js-question-page').show();
    $('main').find('.js-question-display-page').hide();
    $('main').find('.js-answerQuestion').hide();
    $('main').find('.js-answerDisplay').hide();
 
  } else if (window.location.href.match(new RegExp('^http://localhost:8080/question'))) {
    $('main').find('.js-main-page').hide();
    $('main').find('.js-question-page').hide();
    $('main').find('.js-question-display-page').show();
    $('main').find('.js-answerQuestion').hide();
    $('main').find('.js-answerDisplay').hide();

    getQAData(currentUrl);
  }
}

$('button.js-answer-button').on('click', function (event) {
  event.preventDefault();
  $('main').find('button.js-answer-button').hide();
  $('main').find('.js-answerQuestion').show();
  $('main').find('.js-answerDisplay').hide();
});

function getQAData(currentUrl) {
  getQuestionId(currentUrl);

  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/questions/' + state.questionId,       
    // This success callback doesn't work if I factorize this bit (starts line 100)
    success: getQADataCallback
    }
  );
}

function getQADataCallback(data) {
  $('main').find('.js-questionTitle').text(data.question.questionTitle);
  $('main').find('.js-questionDetail').text(data.question.questionDetail);

  // if this data exists
  if (data.question.answers.length > 0) {
    $('main').find('.js-answerDisplay').show();   
    // DO THIS
    // $('main').find('.js-answerDisplay').clear()
    data.question.answers.forEach(function (item) {   
      $('main').find('.js-answer-panel').append(
        '<div class="panel-body">\
        <p>' + item.content + '</p>\
        <strong><p>' + item.username + '</p></strong>\
        </div>');
    });
}
}


// FRONT PAGE
function getAllQuestions() {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/',        
    success: function (object) {
      var cappedQuestions = Math.min(object.questions.length, 10);
      for (var i = 0; i < cappedQuestions; i++) {
        var qtitle = object.questions[i].questionTitle;
        $('main').find('.js-table').append('<tr><td>' + object.questions[i].questionTitle + '</td></tr>');
      }
    }
  });
}

// STEP 4: JQUERY EVENT LISTENERS

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

  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/questions',
    // need to handle errors at some point
    success: postUpdateState,
    complete: afterPostRender
  });
});

//how do I force this function to run AFTER the success callback only? 
function afterPostRender(state, element) {
  // navigate('http://localhost:8080/question?' + state.quesPage.quesId);
  console.log('this is the state', state);
  console.log('this is the state.quesPage', state.quesPage);
  console.log('this is the state.quesPage.formSubmit', state.quesPage.quesTitle);
  var url = 'http://localhost:8080/question?' + state.quesPage.quesId;

  history.pushState({}, '', url);
  renderPages(state, 'main');

  $(element).find('.js-questionTitle').text(state.quesPage.quesTitle);
  $(element).find('.js-questionDetail').text(state.quesPage.quesDetail);
}


function renderPages(state, element) {
  if (window.location.href.match(new RegExp('^http://localhost:8080/question'))) {
    $(element).find('.js-main-page').hide();
    $(element).find('.js-question-page').hide();
    $(element).find('.js-question-display-page').show();
    $(element).find('.js-answerQuestion').hide();
    $(element).find('.js-answerDisplay').hide();
  }
}

$('form#answerQuestion').on('submit', function (event) {
  event.preventDefault();
  var currentUrl = window.location.href;
  getQuestionId(currentUrl);

  var answer = $('#answerDetail').val();
  var username = 'username';

  var data = {
        answers: {
          content: answer,
          likeCount: 0,
          username: username
        }
  };

  $.ajax({
    type: 'PUT',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: '/api/questions/' + state.questionId,
    success: answerQuestionCallback
  });
});

function answerQuestionCallback(data) {
  $('main').find('form#answerQuestion').hide();
  $('main').find('.js-answerDisplay').show();

  $('main').find('p.js-answer').text(data.answers.content);//foreach 
  $('main').find('p.js-answer-username').text(data.answers.username);
}

//where should these two go in terms of organizing the code "best practice"

function navigate(url) {
  history.pushState({}, '', url);
  renderPage();
}

// INITIALIZE APP

renderPage();

