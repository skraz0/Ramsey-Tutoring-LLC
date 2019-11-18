const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

const MongoClient = require('mongodb').MongoClient;
const url = process.env.MONGODB_URI || "mongodb://heroku_whtv069m:p69n37kqpkjoj5adi8qrln53jd@ds043338.mlab.com:43338/heroku_whtv069m";

app.use(express.static('public'));

// endpoints for all pages of the site
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/login.html');
});
app.get('/terms', function (req, res) {
  res.sendFile(__dirname + '/public/ToS.html');
});
app.get('/terms-preview', function (req, res) {
  res.sendFile(__dirname + '/public/ToS_preview.html');
});
app.get('/scheduler', function (req, res) {
  res.sendFile(__dirname + '/public/scheduler.html');
});
app.get('/session', function (req, res) {
  res.sendFile(__dirname + '/public/board.html');
});

// start of socket.io stuff
function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
  // socket.on('clear', clearCanvas) => socket.broadcast('clear', clearCanvas);
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

io.on('connection', function(socket){
  console.log(socket.id + ' has connected');
  socket.on('disconnect', function(){
    console.log(socket.id + ' has disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log(socket.id + ': ' + msg);
  });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
