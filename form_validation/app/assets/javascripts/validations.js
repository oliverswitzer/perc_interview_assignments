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

  function validateEmail(emailInput) {
    var emailVal = emailInput.val();
    if (checkCompanyEmail(emailVal)) { 
      emailInput.next().hide();
      $submit.removeAttr("disabled");
    } else {
      emailInput.next().show();
      $submit.attr("disabled", "disabled");
    }
  }

  function checkCompanyEmail(email) {
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