function refreshOnSelect() {
  // Update helptext
  $('.help').html("Select enter input...");

 
  $('.submit').addClass('ready').removeClass('noselect');
 
}

function refreshOnSubmit() {
  // your note
  $('.play').empty();

  // https://stackoverflow.com/a/44078785/697126
  var newId = Math.random().toString(36).substring(2) + (new Date()).getTime().toString(36);
  $('<div data-id="' + newId
      +'" class="card black big"><div class="bold">' 
      + 'Your Topic' + '</div>' + '<textarea rows="6" cols="12"></textarea>' + '</div>')
    .css({opacity: 0, top:'300px'})
    .appendTo('.play')
    .animate({opacity: 1, top:'130px'}, 500);

  refreshOnSelect();
}

$(document).ready(function(){
  // Submit
  $('.submit').click(function() {
    var submission = $('.card textarea')[0].value;

    if (submission.length > 2) {
      $.ajax({
        type: "POST",
        url: "/submit",
        contentType: "application/json",
        data: JSON.stringify({ "black" : {}, "hand": {}, "blue": {}, "submission":submission }),
        success: function(response) {
 
          refreshOnSubmit();
        }
      });
    }
  });

  refreshOnSubmit();
});