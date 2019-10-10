const express = require('express');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;

app.use(express.static('public'));

function onConnection(socket){
  socket.on('drawing', (data) => socket.broadcast.emit('drawing', data));
<<<<<<< HEAD
  // socket.on('clear', clearCanvas) => socket.broadcast('clear', clearCanvas);
=======
//  socket.on('clear', clearCanvas) => socket.broadcast('clear', clearCanvas);
>>>>>>> d5f63738ebfbcb80f7c4615bd6f8232b1d3f5f14
}

io.on('connection', onConnection);

http.listen(port, () => console.log('listening on port ' + port));

<<<<<<< HEAD
app.get('/', function(req, res){
  res.sendFile(__dirname + '/chattest.html');
});

io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });
});

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    console.log('message: ' + msg);
  });
});
io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});
=======
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
async function verify() {
  const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
      // Or, if multiple clients access the backend:
      //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  // If request specified a G Suite domain:
  //const domain = payload['hd'];
}
verify().catch(console.error);
>>>>>>> 7aa4c3029670fbc5c82a6323f0c47087292c227b
