function changeBlack()
{
   document.getElementById("paletteIcon").src="/icons/palette-solid-black.svg";
}

function changeRed()
{
   document.getElementById("paletteIcon").src="/icons/palette-solid-red.svg";
}

function changeGreen()
{
   document.getElementById("paletteIcon").src="/icons/palette-solid-green.svg";
}

function changeBlue()
{
   document.getElementById("paletteIcon").src="/icons/palette-solid-blue.svg";
}

function eraserToast(){
  // Get the snackbar DIV
var x = document.getElementById("snackbar");

// Add the "show" class to DIV
x.className = "show";

// After 3 seconds, remove the show class from DIV
setTimeout(function(){ x.className = x.className.replace("show", ""); }, 3000);
}
