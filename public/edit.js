var theContent = $('#editTerms');

$('#saveTerms').on('click', function() {
  var editedContent   = theContent.html();
  localStorage.newContent = editedContent;
});

if (localStorage.getItem('newContent')) {
  theContent.html(localStorage.getItem('newContent'));
};
