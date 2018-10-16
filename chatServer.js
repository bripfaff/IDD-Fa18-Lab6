/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function() { // we wait until the client has loaded and contacted us that it is ready to go.

    socket.emit('answer', "Hey, hello I am no one a simple tax bot. \n Let's start with finding out about your income"); //We start with the introduction;
    setTimeout(timedQuestion, 5000, socket, "How much do you make per year from your job?"); // Wait a moment and respond with a question.

  });
  socket.on('message', (data) => { // If we get a new message from the client we process it;
    console.log(data);
    questionNum = bot(data, socket, questionNum); // run the bot function with the new message
  });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data, socket, questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;
  var income;

  /// These are the main statments that make up the conversation.
  if (questionNum == 0) {
    if (input <=91900){
      tax = input*.25;
      answer = 'Cool so for'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + tax; // output response
      waitTime = 7500;
      question = 'How much do you make from your short term (<1 year) investments?';
      income = 1;
    } else if (input <= 191650){
      tax = ((91900)*(.25)+ (input-91900)*(0.28));
      answer = 'Cool so for'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + tax; // output response
      waitTime = 7500;
      question = 'How much do you make from your short term (<1 year) investments?';
      income = 2;
    } else if (input <= 416700){
      tax = (91900*.25+ (191650-91900)*.28 +(input-191650)*.33);
      answer = 'Cool so for'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + tax; // output response
      waitTime = 7500;
      question = 'How much do you make from your short term (<1 year) investments?';
      income = 3;
    } else if (input <= 418400){
      tax= (91900*.25+ (191650-91900)*.28 +(416700-191650)*.33+ (input-416700)*.35);
      answer = 'Cool so for'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + tax; // output response
      waitTime = 7500;
      question = 'How much do you make from your short term (<1 year) investments?';
      income = 4;
    } else if (input > 418400){
      tax = (91900*.25+ (191650-91900)*.28 +(416700-191650)*.33 + (418400-416700)*.35 + (input-418400)*.396);
      answer = 'Cool so for'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + tax; // output response
      waitTime = 7500;
      question = 'How much do you make from your short term (<1 year) investments?';
      income = 5;
    } // load next question
  } else if (questionNum == 1) {
    if (income == 1){
      tax += input*.25;
      answer = 'On your short term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.25 ; // output response
      waitTime = 5000;
      question = 'How much do you make from your long term (>1 year) investments?';
    } else if (income == 2){
      tax += input*.28;
      answer = 'On your short term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.28 ; // output response
      waitTime = 5000;
      question = 'How much do you make from your long term (>1 year) investments?';
    } else if (input <= 416700){
      tax += input*.33;
      answer = 'On your short term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.33 ; // output response
      waitTime = 5000;
      question = 'How much do you make from your long term (>1 year) investments?';
    } else if (input <= 418400){
      tax += input*.35;
      answer = 'On your short term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.35 ; // output response
      waitTime = 5000;
      question = 'How much do you make from your long term (>1 year) investments?';
    } else if (input > 418400){
      tax += input*.35;
      answer = 'On your short term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.35 ; // output response
      waitTime = 5000;
      question = 'How much do you make from your long term (>1 year) investments?';
    } // load next question
  } else if (questionNum == 2) {
      tax += input*.15;
      answer = 'On your long term investments of'+ ' '+ '$' + input + ' ' + 'you owe:'+ '\n' + '$' + input*.15 ; // output response
      waitTime = 5000;
      question = 'Ready for how much you owe?';
  } else if (questionNum == 3) {
    if (input == 'yes'){
      answer = 'Ok, you owe $ ' + tax;
      waitTime = 50000;
    }
  } // load next question
  /// We take the changed data and distribute it across the required objects.
  socket.emit('answer', answer);
  setTimeout(timedQuestion, waitTime, socket, question);
  return (questionNum + 1);
}

function timedQuestion(socket, question) {
  if (question != '') {
    socket.emit('question', question);
  } else {
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
