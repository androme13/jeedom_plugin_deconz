
/* This file is part of Plugin DeCONZ for jeedom.
 *
 * Plugin DeCONZ for jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Plugin DeCONZ for jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Plugin DeCONZ for jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

$(document).ready(function () {
    //$('.progress-bar').css({ 'background': 'SteelBlue' });
    var form_count = 1, previous_form, next_form, total_forms;
    total_forms = 3;
    $(".next-form").click(function () {
        previous_form = $(this).parent();
        next_form = $(this).parent().next();
        next_form.show();
        previous_form.hide();
        setProgressBarValue(++form_count);
        initialStepAction(form_count);
    });
    $(".previous-form").click(function () {
        previous_form = $(this).parent();
        next_form = $(this).parent().prev();
        next_form.show();
        previous_form.hide();
        setProgressBarValue(--form_count);
        initialStepAction(form_count);
    });
    setProgressBarValue(form_count);
    function setProgressBarValue(value) {
        var percent = parseFloat(100 / total_forms) * value;
        percent = percent.toFixed();
        $(".progress-bar")
                .css("width", percent + "%")
                //.html(percent+"%");
                .html("Etape : " + form_count + "/3");
    }
    // Handle form submit and validation
    $("#register_form").submit(function (event) {
        var error_message = '';
        if (!$("#email").val()) {
            error_message += "Please Fill Email Address";
        }
        if (!$("#password").val()) {
            error_message += "<br>Please Fill Password";
        }
        if (!$("#mobile").val()) {
            error_message += "<br>Please Fill Mobile Number";
        }
        // Display error if any else submit form
        if (error_message) {
            $('.alert-success').removeClass('hide').html(error_message);
            return false;
        } else {
            return true;
        }
    });
    initialStepAction(form_count);
});

function initialStepAction(form_count) {
    // console.log(form_count);
    switch (form_count) {
        case 1 :
        {
            var deconzcall = new deconzCall();
            deconzcall.deconzSearch(step2Process);
            break;
        }
        case 2 :
        {
            break;
        }
        case 3 :
        {
            break;
        }
    }
}
