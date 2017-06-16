/* global $ */

// need to handle errors in ajax calls at some point

// UTILITY FUNCTIONS
var appOrigin = 'http://localhost:8080';

function appUrl(path) {
  return appOrigin + path;
}

// STATE
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

// STATE MODIFICATION (API requests modify state only )

function storeQues(quesObject) {
  state.quesDisplayPage.question = quesObject.question;
  // console.log('This is the updated state: ', state.quesDisplayPage.question);
}

function storeAllQues(quesObject) {
  state.homePage.questions = quesObject.questions;
  // console.log('this is state.homePage', state.homePage);
}

function postQues(question, callback) {
  $.ajax({
    type: 'POST',
    data: JSON.stringify(question),
    contentType: 'application/json',
    url: '/api/questions',
    success: callback
  });
}

function getQues(quesId, callback) {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/questions/' + quesId,
    success: callback
  });
}

function getAllQues(callback) {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/questions',
    success: callback
  });
}

function updateQues(question, quesId, callback) {
  $.ajax({
    type: 'PUT',
    data: JSON.stringify(question),
    contentType: 'application/json',
    url: '/api/questions/' + quesId,
    success: callback
  });
}

// RENDER IN THE DOM

function quesRender(state, element) {
  $(element).find('.js-main-page').hide();
  $(element).find('.js-question-page').hide();
  $(element).find('.js-question-display-page').show();
  $(element).find('.js-answerQuestion').hide();
  $(element).find('.js-answerDisplay').hide();

  $(element).find('.js-questionTitle').text(state.quesDisplayPage.question.questionTitle);
  $(element).find('.js-questionDetail').text(state.quesDisplayPage.question.questionDetail);

  // works if there are answers
  // appending is the issue 
  if (state.quesDisplayPage.question.answers.length > 0) {
    $(element).find('.js-answerDisplay').show();

    state.quesDisplayPage.question.answers.forEach(function (item) {
      $(element).find('.js-answer-panel').append(
          "<div class='panel panel-default'>\
            <div class='panel-body'>\
              <p>" + item.content + "</p>\
              <strong><p>Says: " + item.username + "</p></strong>\
            </div>\
          </div>");
    });
  }
}

function homepageRender(state, element) {
  $(element).find('.js-main-page').show();
  $(element).find('.js-question-display-page').hide();
  $(element).find('.js-question-page').hide();
  $(element).find('.js-answerQuestion').hide();
  $(element).find('.js-answerDisplay').hide();

  var cappedQuestions = Math.min(state.homePage.questions.length, 10);

  // I want to order by the highest number of likes first.
  // Also, I don't think hardcoding href=localhost is a good idea.
  // Lodash?
  // Best Practice: Server-side. Limit 10 and sort
  for (var i = 0; i < cappedQuestions; i++) {
    var quesTitle = state.homePage.questions[i].questionTitle;
    var likeCount = state.homePage.questions[i].likeCount;
    var quesID = state.homePage.questions[i].id;
    $(element).find('.js-question-table').append("<tbody>\
      <tr>\
      <td><a href='http://localhost:8080/question?" + quesID + "'>"
      + quesTitle + "</a>\
      </td>\
      <td>"
       + likeCount + " Likes </td>\
      </tr>\
      </tbody>");
  }
}

function answerRender(state, element) {
  $(element).find('button.js-answer-button').hide();
  $(element).find('.js-answerQuestion').show();
  $(element).find('.js-answerDisplay').hide();
}

function askQuesRender(state, element) {
  $(element).find('.js-main-page').hide();
  $(element).find('.js-question-page').show();
  $(element).find('.js-question-display-page').hide();
  $(element).find('.js-answerQuestion').hide();
  $(element).find('.js-answerDisplay').hide();
}

// STEP 4: JQUERY EVENT LISTENERS

function handlePage(state, element) {
  var currentUrl = window.location.href;

  if (currentUrl === 'http://localhost:8080/') {
    function getAllQuesCallback(allQues) {
      storeAllQues(allQues);
      homepageRender(state, element);
    }
    getAllQues(getAllQuesCallback);
  } else if (currentUrl === 'http://localhost:8080/ask-question') {
    askQuesRender(state, element);
  } else if (window.location.href.match(new RegExp('^http://localhost:8080/question'))) {
    function quesQuesCallback(ques) {
      storeQues(ques);
      quesRender(state, element);
    }

    getQues(extractQuesId(currentUrl), quesQuesCallback);
  }
}

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

  function postQuesCallback(postedQuestion) {
    storeQues(postedQuestion);
    pushState();
    quesRender(state, $('main'));
  }

  postQues(data, postQuesCallback);
});

$('button.js-answer-button').on('click', function (event) {
  event.preventDefault();
  answerRender(state, $('main'));
});

$('form#answerQuestion').on('submit', function (event) {
  event.preventDefault();
  var currentUrl = window.location.href;

  var answer = $('#answerDetail').val();
  var username = 'username';

  var data = {
    answers: {
      content: answer,
      likeCount: 0,
      username: username
    }
  };

  function updateQuesCallback(updatedObject) {
    storeQues(updatedObject);
    quesRender(state, $('main'));
  }

  updateQues(data, extractQuesId(currentUrl), updateQuesCallback);
});

$('.js-signup').on('click', function (event) {
  // show create account
  console.log(event);
  // $('main').find('form#register-form').hide();
  $('form#register-form').css("display", "none");
});

$('.js-login').on('click', function (event) {
   // show create account
  console.log(event);
  $('form#register-form').css("display", "none");
});
// UTILITY FUNCTIONS

function pushState() {
  var qId = state.quesDisplayPage.question.id;
  var url = 'http://localhost:8080/question?' + qId;
  history.pushState({}, '', url);
  handlePage(state, $('main'));
}

function extractQuesId(url) {
  return url.split('?')[1];
}

// INITIALIZE APP

handlePage(state, $('main'));
