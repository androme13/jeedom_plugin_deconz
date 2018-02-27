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

var deconzList = new Object();

function step1Process() {
    setHelp('');
    $('.next-form').removeClass('disabled');
    $('.progress-bar').css({'background': 'none'});
}

function step2Process(resp) {
    var i = 0;
    $('.add_manual_ctrl_but').removeClass('disabled');
    var help = '<b><span style="text-decoration: underline;">Etape 1:</span></b><br>';
    help += 'Une recherche automatique de DeCONZ sera effectuée.';
    help += ' Vous pouvez toutefois ajouter un contrôleur manuellement en cliquant';
    help += ' sur le bouton "Ajout manuel".';
    setHelp(help);
    deconzList = resp.result;
    $('.next-form').addClass('disabled');
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ trouvé}} : ' + deconzList.length + ' DeCONZ trouvé(s)', level: 'success'});
        $('.progress-bar').css({'background': 'SteelBlue'});
        if (deconzList.length > 0) {
            $('#deconzListTable>tbody:last').empty();
            for (i = 0; i < deconzList.length; i++) {
                deconzList[0].action = true;
                var typeComment, type;
                if (location.host === deconzList[i].internalipaddress) {
                    typeComment = 'Interne';
                } else {
                    typeComment = 'Externe';
                }
                if (typeComment === 'Interne') {
                    type = 'jeedom jeedom2-home';
                } else {
                    type = 'jeedom fa fa-sitemap';
                }
                var newRow = '<tr>';
                newRow += '<td style="vertical-align:middle;"><div class="form-group" align="center">';
                newRow += '<a id="actionbutton' + i + '" title="Cliquez pour ne pas intègrer cet équipement" ndx=' + i + ' class="add_manual_ctrl_but btn btn-default fa fa-check-circle-o" style="font-size: 2.3em;color : green;cursor:pointer;padding: 4px;"></a>';
                newRow += '</div></td>';
                newRow += '<td>';
                newRow += '<i id="typebutton' + i + '" title="' + typeComment + '" ndx=' + i + ' class="' + type + '" style="font-size: 2.2em;color : SteelBlue;padding: 6px 0px 0px 0px;"></i>';
                newRow += '</td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + deconzList[i].id + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + deconzList[i].name + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + deconzList[i].internalipaddress + '"></div></td>';
                newRow += '<td style="padding: 8px;" class="col-sm-2"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + deconzList[i].internalport + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + deconzList[i].macaddress + '"></div></td>';
                newRow += '</tr>';
                $('#deconzListTable>tbody:last').append(newRow);
                $('#actionbutton' + i).click(function (handler) {
                    var nodeValue = handler.target.attributes['ndx'].nodeValue;
                    if (deconzList[nodeValue].action) {
                        deconzList[nodeValue].action = false;
                        $('#' + handler.target.id).removeClass('fa-check-circle-o');
                        $('#' + handler.target.id).addClass('fa-ban');
                        $('#' + handler.target.id).css({'color': 'red'});
                        $('#' + handler.target.id).attr('title', 'Cliquez pour intègrer cet équipement');
                    } else {
                        deconzList[nodeValue].action = true;
                        $('#' + handler.target.id).removeClass('fa-ban');
                        $('#' + handler.target.id).addClass('fa-check-circle-o');
                        $('#' + handler.target.id).css({'color': 'green'});
                        $('#' + handler.target.id).attr('title', 'Cliquez pour ne pas intègrer cet équipement');
                    }
                    step2Valid();
                });
                $('.next-form').removeClass('disabled');
            }
        }
    } else {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ introuvable}} : ' + 'Erreur : ' + resp.url + ' ' + resp.error + ' (' + resp.code + ')', level: 'danger'});
        $('.progress-bar').css({'background': 'red'});
    }
}

function step2Valid() {
    var i = 0;
    var letNext = false;
    for (i = 0; i < deconzList.length; i++) {
        if (deconzList[i].action) {
            letNext = true;
        }
    }
    if (letNext) {
        $('.next-form').removeClass('disabled');
        $('#cancelreason').empty();
    } else {
        $('#cancelreason').html('<i class="fa fa-exclamation-triangle" style="color:red;"></i><font color="white"> Aucun contrôleur intégrable.</font>');
        $('.next-form').addClass('disabled');
    }
    $(".add_manual_ctrl_but").removeClass("disabled");
}

function step3Process(resp) {
    console.dir("setp3", resp);
    var i = 0
    var help = '<b><span style="text-decoration: underline;">Etape 2:</span></b><br>';
    help += 'Une demande automatique de la clé sera effectuée,';
    help += 'si la demande automatique echoue vous serez invité';
    help += ' à obtenir et à saisir la clé APIKEY de DeCONZ manuellement.';
    setHelp(help);
    $('.next-form').addClass('disabled');
    if (resp.state === 'ok') {
        $('#apiKeyTable>tbody:last').empty();
        $('#div_configurationAlert').showAlert({message: '{{Clé(s) API obtenue(s)}}', level: 'success'});
        $('.progress-bar').css({'background': 'SteelBlue'});
        for (i = 0; i < deconzList.length; i++) {
            deconzList[i].apikey = resp.result[deconzList[i].internalipaddress].apikey;
            var newRow = '<tr>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<a id="actionbuttonapikey' + i + '" title="Cliquez pour lancer une demande de clé manuelle" ndx=' + i + ' class="add_manual_ctrl_but btn btn-default fa fa-refresh disabled" style="font-size: 2.3em;color : SteelBlue;cursor:pointer;padding: 4px;"></a>';
            newRow += '</div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<i id="apikeyStatus' + i + '" title="Contrôleur prêt à être intégré" ndx=' + i + ' class="add_manual_ctrl_but fa fa-exclamation-circle" style="font-size: 2.3em;color : ForestGreen;cursor:pointer;padding: 4px;"></i>';
            newRow += '</div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + this.deconzList[i].id + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + this.deconzList[i].name + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + this.deconzList[i].internalipaddress + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + this.deconzList[i].macaddress + '"></div></td>';
            newRow += '<td style="padding: 8px;" class="col-sm-2"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + this.deconzList[i].apikey + '"></div></td>';
            newRow += '</tr>';
            $('#apiKeyTable>tbody:last').append(newRow);
        }
    } else if (resp.state === 'nok') {
        $('#div_configurationAlert').showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.error + ' (' + resp.code + ')', level: 'danger'});
        $('.progress-bar').css({'background': 'red'});
    } else if (resp.state === 'error') {
        $('#div_configurationAlert').showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.result, level: 'warning'});
        $('.progress-bar').css({'background': 'orange'});
    }
}

function step4Process() {
    $(".next-form").prop("disabled", false);
}

function validCheck() {
    if ($('#ctrl_form')[0][0].validity.valid) {
        $('.valid_manual_ctrl_but').removeClass('disabled');
    } else {
        $('.valid_manual_ctrl_but').addClass('disabled');
    }
}
function addCtrl(handler) {
    $(".next-form").addClass('disabled');
    $('.valid_manual_ctrl_but').addClass('disabled');
    $('.add_manual_ctrl_but').addClass('disabled');
    var newRow = '<tr><td></td><td></td><td></td><td></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><input title="Adresse IP du contrôleur" type="ipman" class="form-control buttoninput" required id="ipman" name="ipman" placeholder="xxx.xxx.xxx.xxx" value="" pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"></div></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><input title="Port réseau du contrôleur"  type="portman" class="form-control buttoninput" required id="portman" name="portman" placeholder="xxxxx" value="" pattern="^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$"></div></td>';
    newRow += '<td style="padding: 8px;"><a class="valid_manual_ctrl_but btn btn-default fa fa-plus disabled" style="color:green"><font color="white"> Ajouter</font></a><a id="cancel_manual_ctrl_but" class="cancel-ctrl btn btn-default fa fa-minus" style="color:red"><font color="white"> Supprimer</font></a></td>';
    newRow += '</tr>';
    $("#deconzListTable>tbody:last").append(newRow);
    $("#ipman").focus();
    $('<input type="submit" value="Submit">').hide().appendTo('#ctrl_form').click().remove();
    prepareInputValidate("#ipman");
    prepareInputValidate("#portman");
    $("#cancel_manual_ctrl_but").click(function (context) {
        console.log("cancel");
        $('#ctrl_form').blur();
        $('#deconzListTable tr:last').remove();
        $('.add_manual_ctrl_but').removeClass('disabled');
        step2Valid();
    });
}

function prepareInputValidate(input) {
    var field = $(input);
    var form = field.closest("form");
    field.blur(function () {
        virtualsubmit(form);
    });
    field.focus(function (event) {
        virtualsubmit(form);
    });
    field.keypress(function () {
        virtualsubmit(form);
    });
}

function setHelp(help) {
    $('#stepHelp').html(help);
}

function virtualsubmit(form) {
    $('<input type="submit" value="Submit">').hide().appendTo(form).click().remove();
}
;