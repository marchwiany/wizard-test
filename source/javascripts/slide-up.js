var active = 2;
/****************************************
Hide the current form element,
Make it inline to show at the top,
Bring the next element in.
*****************************************/
function continueForm(input) {
  //Store the parent object for timeout purposes
  var item = $(input).parent();
  console.log(item);
  //Increase the container to make space for the rest of the form items
  $('.container').css({
    'height': '200vh'
  });
  //Scroll to the bottom of the page
  $('html, body').animate({
    scrollTop: window.innerHeight
  }, 1000);

  //Class changes to handle showing/hiding
  item.removeClass('show');
  item.addClass('hide');
  //Adding 'top' converts the input into a relative element, to be viewed by the user if scrolling up
  setTimeout(function() {
    item.addClass('top');
  }, 750);

  $('.step:nth-child(' + active +')').removeClass('active')


  //Check if there's another element
  if (item.next().length > 0) {
    active++;
    $('.step:nth-child(' + active +')').addClass('active');
    item.next().addClass('show');
    setTimeout(function() {
      item.next().find('input').focus()
    }, 1100);
  } else {
    //Unbind the enter key from the inputs
    $('.input input').unbind("enterKey");
    //Wait for animations to finish
    setTimeout(function() {
      //Return to the initial height
      $('.container').css({
        'height': '100vh'
      });
      //Scroll back to the top
      $('html, body').animate({
        scrollTop: 0
      }, 800);
    }, 800);
  }
};

/********************************
Bind the enter key to each input
*********************************/
$('.input input').bind("enterKey", function(e) {
  continueForm(this);
});
$('.input input').keyup(function(e) {
  if (e.keyCode == 13) {
    $(this).trigger("enterKey");
  }
});

/**************************************
Also continue the form on button press
***************************************/
$('.input button').click(function() {
  continueForm(this);
});

/*************************************
Focus the first text input by default
**************************************/
$('.input.show input')[0].focus();