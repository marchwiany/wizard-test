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