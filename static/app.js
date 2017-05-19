/* global $ */

// STEP 1: STATE

var state = {
  questionTitle: '',
  questionDetail: '',
  username: '',
  questionId: '',
  likeCount: ''
};

// STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

function updateQuestionState(object) {
  state.questionTitle = object.question.questionTitle;
  state.questionDetail = object.question.questionDetail;
  state.username = object.question.username;
  state.questionId = object.question.id;
  state.likeCount = object.question.likeCount;
}

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
  var Id = currentUrl.split('?')[1];

  state.questionId = Id;

  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/questions/' + state.questionId,       
    // This success callback doesn't work if I factorize this bit (starts line 100)
    success: function (data) {
      $('main').find('.js-questionTitle').text(data.question.questionTitle);
      $('main').find('.js-questionDetail').text(data.question.questionDetail);

      //if this data exists -- is this correct?
      if (data.question.answers.length > 0) {
        console.log('there is an answer', data.question.answers.content)
        $('main').find('.js-answerDisplay').show();
          // I'm sure this is not the best way to do this. 
          data.question.answers.forEach(function (item) {
            console.log(item.content);
            $('main').find('.js-answer-panel').append(
              '<div class="panel-body">\
              <p>' + item.content + '</p>\
              <strong><p>' + item.username + '</p></strong>\
              </div>');
          });
      }
    }
  });
}

// function getQADataCallback (data) {
//   $('main').find('.js-questionTitle').text(data.question.questionTitle);
//   $('main').find('.js-questionDetail').text(data.question.questionDetail);

//   //if this data exists -- is this correct?
//   if (data.question.answers.length > 0) {
//     console.log('there is an answer', data.question.answers.content)

//     $('main').find('.js-answerDisplay').show();
      
//       // I'm sure this is not the best way to do this. 
//       data.question.answers.forEach(function (item) {
//         console.log(item.content);
//         $('main').find('.js-answer-panel').append(
//           '<div class="panel-body">\
//           <p>' + item.content + '</p>\
//           <strong><p>' + item.username + '</p></strong>\
//           </div>');
//       });
//   }
// }


// FRONT PAGE
function getAllQuestions() {
  $.ajax({
    type: 'GET',
    contentType: 'application/json',
    url: '/api/',        
    success: function (object) {
      for (var i = 0; i <= 10; i++) {
        var qtitle = object.questions[i].questionTitle;
        // console.log(object.questions[i].questionTitle);
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
    success: postQACallback
  });
});

function postQACallback(results) {
  updateQuestionState(results);
  navigate('http://localhost:8080/question?' + state.questionId);
}

$('form#answerQuestion').on('submit', function (event) {
  event.preventDefault();
  var currentUrl = window.location.href;
  var qId = getQuestionId(currentUrl);

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

  $('main').find('p.js-answer').text(data.answers.content);
  $('main').find('p.js-answer-username').text(data.answers.username);
}

//where should these two go in terms of organizing the code "best practice"


function navigate(url) {
  history.pushState({}, '', url);
  renderPage();
}

// INITIALIZE APP

renderPage();

