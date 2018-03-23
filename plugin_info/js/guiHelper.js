
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

"use strict";
var me = this;
var deconzcall = new deconzCall();
$(document).ready(function () {
    var form_count = 1, previous_form, next_form, total_forms;

    total_forms = 3;
    $(".progress-bar").hide();
    $(".add_manual_ctrl_but").click(function (handler) {
        step2AddCtrl(handler);
    });
    $(".next-form").click(function () {
        previous_form = $(this).parent();
        next_form = $(this).parent().next();
        next_form.show();
        previous_form.hide();
        setProgressBarValue(++form_count);
        if (form_count === 1) {
            $(".progress-bar").hide();
        } else {
            $(".progress-bar").show();
        }
        initialStepAction(form_count);
    });
    $(".previous-form").click(function () {
        previous_form = $(this).parent();
        next_form = $(this).parent().prev();
        next_form.show();
        previous_form.hide();
        setProgressBarValue(--form_count);
        if (form_count === 1) {
            $(".progress-bar").hide();
        } else {
            $(".progress-bar").show();
        }
        initialStepAction(form_count);
    });
    setProgressBarValue(form_count);
    function setProgressBarValue(value) {
        if (value > 1) {
            value--;
        }
        var percent = parseFloat(100 / total_forms) * value;
        percent = percent.toFixed();
        $(".progress-bar")
                .css("width", percent + "%")
                .html("Etape : " + (form_count - 1) + "/3");
    }
    $("#ipform").submit(function (event) {
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
    createTab("fa fa-download", "Installer un contrôleur<br>DeconZ localement", "localinstall");
    createTab("fa fa-search", "Detecter et configurer les <br>contrôleurs DeconZ", "detectandconfig");

    initialStepAction(form_count);
});

function initialStepAction(form_count) {
    //me = this;
    //deconzcall = new deconzCall();
    switch (form_count) {
        case 1 :
        {
            $('#div_configurationAlert').hideAlert();
            step1Process();
            break;
        }
        case 2 :
        {
            $('#div_configurationAlert').hideAlert();
            $('#div_configurationAlert').showAlert({message: 'Veuillez patienter, recherche de DeCONZ en cours ...', level: 'info'});
            deconzcall.call('search', null, step2Process);
            break;
        }
        case 3 :
        {
            $('#div_configurationAlert').hideAlert();
            $('#div_configurationAlert').showAlert({message: 'Veuillez patienter, tentative d\'obtention de la clé API de DeCONZ en cours ...', level: 'info'});
            var srv = [{'ip': '10.0.0.19', 'port': '80'}];
            deconzcall.call('getAPIKey', srv, step3Process);
            break;
        }
        case 4 :
        {
            $('#div_configurationAlert').hideAlert();
            break;
        }
    }
}

function openTab(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    evt.currentTarget.className += " active";
}

function createTab(icon, text, action) {
    var str;
    str = '<button class="tablinks" onclick="openTab(event, \'' + action + '\')">';
    str += '<table style="background-color:rgba(0, 0, 0, 0);"><td>';
    str += '<i class="' + icon + '" style="font-size: 2.2em;color : SteelBlue;padding: 6px 0px 0px 0px;"><i>';
    str += '</td><td>' + text + '</td></table></button>';
    $("#deconz_config_tab").append(str);
}

function formKey() {
    if ($("#ctrl_form").valid()) {
        console.log("Valid");
        $("#valid_manual_ctrl_but").removeClass("disabled");
    } else {
        console.log("pas Valid");
        $("#valid_manual_ctrl_but").addClass("disabled");
    }
}