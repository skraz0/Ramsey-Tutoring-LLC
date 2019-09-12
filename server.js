var express = require('express');
var socket = require('socket.io');

var app = express();
var server = app.listen(process.env.PORT || 3000, listen);

function listen() {
  var host = server.address().address;
  var port = server.address().port;
  console.log('App is listening at http://' + host + ':' + port);
}

app.use(express.static('public'));

var io = socket(server);

io.sockets.on('connection',
  function (socket) {
    console.log('A new user connected: ' + socket.id);

    socket.on('mouse',
      function (data) {
        console.log("Received: 'mouse' " + data.x + " " + data.y);

        socket.broadcast.emit('mouse', data);
      }
    );

    socket.on('disconnect', function() {
      console.log('User has disconnected.');
    });
  }
);
