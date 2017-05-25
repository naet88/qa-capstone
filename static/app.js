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

// how do i make quesRender  a callback function to run after this GET request? 
// tried doing this but it wouldn't work.... 
// success: function(response, quesRender) {
//       storeQues(response);
//       quesRender(); 
//     }

function getQues(url, callback) {
  var quesId = url.split('?')[1];

  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/questions/' + quesId, 
    success: function (response) {
      storeAllQues(response);
      callback(); // want to run homepageRender
    }
  });
}
// how do I make homepageRender a callback function to run after this GET request?

// need an event handler that fires when at the homepage
function getAllQues(url, callback) {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/',      
    success: function (response) {
      storeQues(response);
      callback();
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

function homepageRender(state, element) {
  var cappedQuestions = Math.min(state.homePage.questions.length, 10);
  for (var i = 0; i < cappedQuestions; i++) {
    $(element).find('js-question-table').append(
      '<tbody>\
        <tr>\
          <td>' + state.homepage.questions[i].questionTitle + 'Likes </td>\
          <td>' + state.homepage.questions[i].questionTitle + 'Answers</td>\
          <td><a href="http://localhost:8080/question?' + state.homepage.questions[i].id + '">' + state.homepage.questions[i].questionTitle +
          '</a></td>\
        </tr>\
      </tbody>');
  }
}

function answerRender(state, element) {
  $(element).find('button.js-answer-button').hide();
  $(element).find('.js-answerQuestion').show();
  $(element).find('.js-answerDisplay').hide();
}

// Is there a way to make this shorter?
function pageRender(state, element) {
  var currentUrl = window.location.href;

  if (currentUrl === 'http://localhost:8080/') {
    element.find('.js-main-page').show();
    element.find('.js-question-display-page').hide();
    element.find('.js-question-page').hide();
    element.find('.js-answerQuestion').hide();
    element.find('.js-answerDisplay').hide();

    //I DON'T THINK THIS IS THE BEST PLACE FOR THIS 
    getAllQues(currentUrl);

  } else if (currentUrl === 'http://localhost:8080/ask-question') {
    element.find('.js-main-page').hide();
    element.find('.js-question-page').show();
    element.find('.js-question-display-page').hide();
    element.find('.js-answerQuestion').hide();
    element.find('.js-answerDisplay').hide();
 
  } else if (window.location.href.match(new RegExp('^http://localhost:8080/question'))) {
    element.find('.js-main-page').hide();
    element.find('.js-question-page').hide();
    element.find('.js-question-display-page').show();
    element.find('.js-answerQuestion').hide();
    element.find('.js-answerDisplay').hide();
  }
}

// STEP 4: JQUERY EVENT LISTENERS
// Is there a function that is an "event listener for new browser url"

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
    quesRender(state, $('main'));
  }

  postQues(data, postQuesCallback);
});

$('button.js-answer-button').on('click', function (event) {
  event.preventDefault();
  answerRender(state, $('main'));
});

// INITIALIZE APP

pageRender(state, $('main'));
