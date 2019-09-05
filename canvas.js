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

  function draw (e){
    if(!drawing) return;
    c.lineWidth = 5;
    c.lineCap = 'round';

    c.lineTo(e.clientX, e.clientY);
    c.stroke();
    c.beginPath();
    c.moveTo(e.clientX, e.clientY);
  }

  document.getElementById('clear').addEventListener('click', function(){
    c.clearRect(0, 0, canvas.width, canvas.height);
  }, false);

  // Event Listeners
  canvas.addEventListener('mousedown', startPosition);
  canvas.addEventListener('mouseup', endPosition);
  canvas.addEventListener('mousemove', draw);
});
