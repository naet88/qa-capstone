// BEGIN SNIPPET 1
function storeQues(quesObject) {
  state.quesDisplayPage.question = quesObject.question;
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

function quesRender(state, element) {
	//DOM RENDERING
}

$('form#askQuestion').on('submit', function (event) {
	// creates variable called data, which is user's 
	// form submission data 

  function postQuesCallback(postedQuestion) {
    storeQues(postedQuestion);
    quesRender(state, $('main'));
  }

  postQues(data, postQuesCallback);
});
// Comments: 
// - Line 26 seems to be a problem b/c quesRender needs to happen AFTER storeQues (state needs to be updated). Am I crazy?
//END SNIPPET 1

//BEGIN SNIPPET 2

function storeQues(quesObject) {
  state.quesDisplayPage.question = quesObject.question;
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

function quesRender(state, element) {
	//DOM RENDERING
}

$('form#askQuestion').on('submit', function (event) {
	// creates variable called data, which is user's 
	// form submission data 

  function postQuesCallback(postedQuestion, callback) {
    storeQues(postedQuestion);
    callback();
  }

  postQues(data, postQuesCallback);

  // postQues(data, postQuesCallback(postedQuestion, quesRender){
  //})

  // postQues(data, postQuesCallback(postedQuestion, quesRender(state, element)){
  //})

  } 
});

// Comments:
// - I *thought* line 59 was on the right track. 
// - But then the issue is when I call postQuesCallback on line 64, it needs a callback...so then I do  line 66. But then quesRender takes a (state,element). 
// So then I have to do line 69. And, that doesnt work b/c quesRender will execute first and that's not what we want at all. 
// - So then I don't think this works either.
//END SNIPPET 2
