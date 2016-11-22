$(document).ready(function() {
  //jQuery time
  var current_fs, next_fs, previous_fs; //fieldsets
  var left, opacity, scale; //fieldset properties which we will animate
  var animating; //flag to prevent quick multi-click glitches

  $(".next").click(function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    next_fs = $(this).parent().next();

    //activate next step on progressbar using the index of next_fs
    $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

    //show the next fieldset
    next_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale current_fs down to 80%
        scale = 1 - (1 - now) * 0.2;
        //2. bring next_fs from the right(50%)
        left = (now * 50)+"%";
        //3. increase opacity of next_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({'transform': 'scale('+scale+')'});
        next_fs.css({'left': left, 'opacity': opacity});
      },
      duration: 800,
      complete: function(){
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
    });
  });

  $(".previous").click(function(){
    if(animating) return false;
    animating = true;

    current_fs = $(this).parent();
    previous_fs = $(this).parent().prev();

    //de-activate current step on progressbar
    $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

    //show the previous fieldset
    previous_fs.show();
    //hide the current fieldset with style
    current_fs.animate({opacity: 0}, {
      step: function(now, mx) {
        //as the opacity of current_fs reduces to 0 - stored in "now"
        //1. scale previous_fs from 80% to 100%
        scale = 0.8 + (1 - now) * 0.2;
        //2. take current_fs to the right(50%) - from 0%
        left = ((1-now) * 50)+"%";
        //3. increase opacity of previous_fs to 1 as it moves in
        opacity = 1 - now;
        current_fs.css({'left': left});
        previous_fs.css({'transform': 'scale('+scale+')', 'opacity': opacity});
      },
      duration: 800,
      complete: function(){
        current_fs.hide();
        animating = false;
      },
      //this comes from the custom easing plugin
      easing: 'easeInOutBack'
    });
  });

  $(".submit").click(function(){
    return false;
  })
});

$("input").on('change', function(){
  var form = $(this).closest('form'),
     data = form.serialize(),
     results = $("#results");

  results.text(data);
});


$(".step-by-step").each(function(){
      var container = $(this),
        numSteps = container.children('.step').length - 1,
        ratio = 100 / numSteps ,
        determinate = $("<div></div>")
          .addClass('determinate')
          .css('width', '0%'),
        progress = $("<div></div>")
          .addClass('progress')
          .append( determinate );

      for( i=1; i<=numSteps; i++){
        var dot = $("<span></span>")
          .addClass('dot')
          .css('left', (ratio * i) + "%");
        progress.append( dot );
      }
      progress.hide();

      container.after( progress );
    });
    $(".step-by-step .btn").on('click', function(event){
      event.stopPropagation();
      event.preventDefault();

      var container = $(this).closest('.step-by-step'),
        numSteps = container.children('.step').length - 1,
        current = $(this).closest('.step'),
        index = current.index(),
        next = current.next('.step'),
        progress = container.siblings('.progress').first(),
        determinate = progress.find('.determinate'),
        require = $(this).data('require'),
        currentWidth = current.width(),
        marginLeft = current.css('margin-left').replace("px", "") - (currentWidth * (index + 1)) - (8 * (index + 1));

      if( require !== undefined ){
        if( $("#"+require).val().length == 0 ){
          $("#holder-"+require).addClass('require-notice');
          return;
        }
      }

      progress.show();

      if( next.length > 0 ){
        var width = ((index + 1) / numSteps) * 100;

        progress.children('.dot').removeClass('hit');

        progress.children('.dot').eq(index).delay(300).queue(function(next) {
          $(this).addClass('hit');
          next();
        });

        determinate.css('width', width+'%')
        container.css('margin-left', marginLeft + 'px');
        display_clauses();
      }
    });

    $(".dot").on('click', function(event){
      var container = $(this).closest('form').children('.step-by-step').eq(0);
         index = $(this).index(),
         current = container.children('.step').eq(index-1),
         button = current.find('.btn').eq(0);

      button.trigger('click');
    });

$("#reset").on("click", function(e){
  e.preventDefault();
  $(".step-by-step").css('margin-left', 0);
});

$(".holder").on('click', function(e){
  e.preventDefault();

  var element = $("<input>"),
     holder = $(this),
     name = $(this).attr('id').replace('holder-',''),
     input = $("#"+name),
     container = $("#opty_recform_modal_container"),
     modal = $("#opty_recform_modal"),
     helper = $("#opty_recform_modal_helper"),
     helper_text = $(this).data('helper'),
     type = $(this).data('type');

  if( type == 'select' ){
    type = 'hidden';
    var options = $(this).data('options').split('|'),
       fake = $("<div></div>"),
       list = $("<ul></ul>");

    fake.addClass('fake-input').text('Pick a State');
    list.appendTo(fake);

    options.forEach(function(option){
      var item = $("<li></li>");
      item.text(option).addClass('select-option').appendTo(list);
      item.on('click', function(){
        console.log(option);
        element.val(option).trigger('keyup');
        modal.trigger('click');
      });
    })

    fake.appendTo(container);
  }
  element.attr('type', type).attr('name', name).attr('autocomplete', 'off');
  helper.text(helper_text);

  element.appendTo(container);
  element.on('keyup', function(){
    holder.text($(this).val());
    input.val($(this).val()).trigger('change');
  });



  modal.fadeIn('slow').queue( function(next){
    element.focus();
    next();
  });
  modal.on('click', function(em){
    // if( em.target.is() ){
    //  console.log(em.target.type);
    // }
    $(this).fadeOut('slow').queue( function(next){
      element.remove();
      if( fake !== undefined ){
        fake.remove();
      }
      next();
    });
  }).children().on('focus click', function(){
    return false;
  });

  $("#opty_recform_wrap .fa-check").unbind('click').on('click', function(){
    modal.trigger('click');
  });
  $(document).unbind('click').on('keyup', function(e){
    if (e.keyCode == 13 || e.keyCode == 27) {
      modal.trigger('click');
    }
  });
});

var display_clauses = function (){
  $(".clause").each(function(){
    var dep = $(this).data('dependency').split('|'),
       clause = $(this);

    dep.forEach(function( d ){
      if( $("#"+d).val().length > 0 ){
        $("#info-"+d).text($("#"+d).val());
        clause.show();
        return false;
      }
      else {
        clause.hide();
      }
    });
  });
}
;
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



