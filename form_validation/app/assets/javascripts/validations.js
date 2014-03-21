// validations.js

$(function() {
  var $submit = $('#submit');
  var $form = $('form');
  var $form_messages = $('form span');
  var $emailInput = $form.find("#email"); 

  $form_messages.hide();
  $submit.attr("disabled", "disabled");

  $emailInput.keyup(function(){
    validateEmail($(this));
  });

  $submit.on("click", function(e) { // click event validator on submit to make sure that people can't just re-enable the submit
    if( !checkCompanyEmail($emailInput.val()) ) {
      e.preventDefault()
      validateEmail($emailInput);
    }
  });

  function validateEmail(emailInput) {   // called both on keyup and on click of submit
    var emailVal = emailInput.val();
    if (checkCompanyEmail(emailVal)) { 
      emailInput.next().fadeOut();
      $submit.removeAttr("disabled");
      return true
    } else {
      emailInput.next().fadeIn();
      $submit.attr("disabled", "disabled");
      return false
    }
  }

  function checkCompanyEmail(email) {  // use try/catch block so that errors produced when there are no matches are handled
    re = /@(percolate).com+/
    try 
      {
        match = re.exec(email);
        if (match[1] == "percolate") {
          return true
        } else {
          return false
        }
      } 
    catch(err) 
      {
        return false
      }
  }
});