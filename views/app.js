//STEP 1: STATE

//STEP 2: FUNCTIONS THAT MODIFY STATE (NO JQUERY)

//STEP 3: RENDER IN THE DOM FUNCTIONS

//STEP 4: JQUERY EVENT LISTENERS

$('form#askQuestion').on('submit', function(event) {
	event.preventDefault();
	var city = $('#questionTitle').val();
	var restaurant = $('#questionDetail').val();

//don't I use ajax here?
$.ajax({
	type: 'POST',
	data: JSON.stringify(data),
    contentType: 'application/json',
    url: 'http://localhost:3000/question-page.html',						
    success: function(data) {
    }
});

//then, update table via Mongoose... 