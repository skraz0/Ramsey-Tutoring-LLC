var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', function(req, res){
  res.sendFile(__dirname + '/chattest.html');
});
//
// io.on('connection', function(socket){
//   console.log('a user connected');
//   socket.on('disconnect', function(){
//     console.log('user disconnected');
//   });
// });
// http.listen(3000, function(){
//   console.log('listening on *:3000');
// });
//
// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     console.log('message: ' + msg);
//   });
// });
// io.on('connection', function(socket){
//   socket.on('chat message', function(msg){
//     io.emit('chat message', msg);
//   });
// });
// io.emit('some event', { for: 'everyone' });

//Chat stuff
const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendBtn = document.getElementById('sendBtn');

const messages = []; // { author, date, content, type }

//Connect to socket.io - automatically tries to connect on same port app was served from
var socket = io();

socket.on('message', message => {
	//Update type of message based on username
	if (message.type !== messageTypes.LOGIN) {
		if (message.author === username) {
			message.type = messageTypes.RIGHT;
		} else {
			message.type = messageTypes.LEFT;
		}
	}

	messages.push(message);
	displayMessages();

	//scroll to the bottom
	chatWindow.scrollTop = chatWindow.scrollHeight;
});

createMessageHTML = message => {

	return `
	<div class="message ${
		message.type === messageTypes.LEFT ? 'message-left' : 'message-right'
	}">
		<div class="message-details flex">
			<p class="message-date">${message.date}</p>
		</div>
		<p class="message-content">${message.content}</p>
	</div>
	`;
};

displayMessages = () => {
	const messagesHTML = messages
		.map(message => createMessageHTML(message))
		.join('');
	messagesList.innerHTML = messagesHTML;
};

sendBtn.addEventListener('click', e => {
	e.preventDefault();
	if (!messageInput.value) {
		return console.log('Invalid input');
	}

	const date = new Date();
	const month = ('0' + date.getMonth()).slice(0, 2);
	const day = date.getDate();
	const year = date.getFullYear();
	const dateString = `${month}/${day}/${year}`;

	const message = {
		date: dateString,
		content: messageInput.value
	};
	sendMessage(message);
	//clear input
	messageInput.value = '';
});

sendMessage = message => {
	socket.emit('message', message);
};
