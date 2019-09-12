var socket;

window.addEventListener('load', () => {
  const canvas = document.querySelector('canvas');
  const c = canvas.getContext('2d');

  // Resize the canvas to fill the screen
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  let drawing = false;

  function startPosition(e){
    drawing = true;
    draw(e);
  }
  function endPosition(){
    drawing = false;
    c.beginPath();
  }

  socket = socket.io.connect('http://localhost:3000');

  /*socket.on('mouse',
    function (data) {
      console.log('Got: ' + data.x + ' ' + data.y);
      c.lineWidth = 5;
      c.lineCap = 'round';

      c.lineTo(data.x, data.y);
      c.stroke();
      c.beginPath();
      c.moveTo(data.x, data.y);
      sendMouse(data.x, data.y);
    });*/

  function draw (e){
    if(!drawing) return;
    c.lineWidth = 5;
    c.lineCap = 'round';

    c.lineTo(e.clientX, e.clientY);
    c.stroke();
    c.beginPath();
    c.moveTo(e.clientX, e.clientY);
    sendMouse(e.clientX, e.clientY);
  }

  function sendMouse (xPos, yPos) {
    //console.log('sendMouse: ' + xPos + ' ' + yPos);

    var data = {
      x: xPos,
      y: yPos
    };

    socket.emit('mouse', data);
  }

  document.getElementById('clear').addEventListener('click', function(){
    c.clearRect(0, 0, canvas.width, canvas.height);
  }, false);

  document.getElementById('blackPen').addEventListener('click', function(){
    c.strokeStyle = '#000000';
  }, false);

  document.getElementById('bluePen').addEventListener('click', function(){
    c.strokeStyle = '#115bbd';
  }, false);

  document.getElementById('redPen').addEventListener('click', function(){
    c.strokeStyle = '#ff0000';
  }, false);

  // Event Listeners
  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', draw);
});
