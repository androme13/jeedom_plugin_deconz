
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

var deconzList = new Object();

function step1Process() {
    setHelp('');
    $('.next-form').removeClass('disabled');
    $('.progress-bar').css({'background': 'none'});
}

function step2Process(resp) {
    console.dir(resp);
    $('.add-ctrl').removeClass('disabled');
    var help = '<b><span style="text-decoration: underline;">Etape 1:</span></b><br>';
    help += 'Une recherche automatique de DeCONZ sera effectuée.';
    help += ' Vous pouvez toutefois ajouter un contrôleur manuellement en cliquant';
    help += ' sur le bouton "Ajout manuel".';
    setHelp(help);
    this.deconzList = resp.result;
    $('.next-form').addClass('disabled');
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ trouvé}} : ' + this.deconzList.length + ' DeCONZ trouvé(s)', level: 'success'});
        $('.progress-bar').css({'background': 'SteelBlue'});
        if (this.deconzList.length > 0) {
            $('#deconzListTable>tbody:last').empty();
            for (var i = 0; i < this.deconzList.length; i++) {
                this.deconzList[0].action = true;
                var typeComment, type;
                if (location.host === this.deconzList[i].internalipaddress) {
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
                newRow += '<a id="actionbutton' + i + '" title="Cliquez pour ne pas intègrer cet équipement" ndx=' + i + ' class="add-ctrl btn btn-default fa fa-check-circle-o" style="font-size: 2.3em;color : green;cursor:pointer;padding: 4px;"></a>';
                newRow += '</div></td>';
                newRow += '<td>';
                newRow += '<i id="typebutton' + i + '" title="' + typeComment + '" ndx=' + i + ' class="' + type + '" style="font-size: 2.2em;color : SteelBlue;padding: 6px 0px 0px 0px;"></i>';
                newRow += '</td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + this.deconzList[i].id + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + this.deconzList[i].name + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + this.deconzList[i].internalipaddress + '"></div></td>';
                newRow += '<td style="padding: 8px;" class="col-sm-2"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + this.deconzList[i].internalport + '"></div></td>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + this.deconzList[i].macaddress + '"></div></td>';
                newRow += '</tr>';
                $('#deconzListTable>tbody:last').append(newRow);
                $('#actionbutton' + i).click(function (handler) {
                    var nodeValue = handler.target.attributes['ndx'].nodeValue;
                    if (deconzList[nodeValue].action) {
                        deconzList[nodeValue].action = false;
                        $('#' + handler.target.id).attr('class', 'fa fa-ban');
                        $('#' + handler.target.id).css({'color': 'red'});
                        $('#' + handler.target.id).attr('title', 'Cliquez pour intègrer cet équipement');
                    } else {
                        deconzList[nodeValue].action = true;
                        $('#' + handler.target.id).attr('class', 'fa fa-check-circle-o');
                        $('#' + handler.target.id).css({'color': 'green'});
                        $('#' + handler.target.id).attr('title', 'Cliquez pour ne pas intègrer cet équipement');
                    }
                    var letNext = false;
                    for (var i = 0; i < deconzList.length; i++) {
                        if (deconzList[i].action) {
                            letNext = true;
                        }
                    }
                    if (letNext) {
                        $('.next-form').removeClass('disabled');
                    } else {
                        $('.next-form').addClass('disabled');
                    }
                });
                $('.next-form').removeClass('disabled');
            }
        }
    } else {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ introuvable}} : ' + 'Erreur : ' + resp.url + ' ' + resp.error + ' (' + resp.code + ')', level: 'danger'});
        $('.progress-bar').css({'background': 'red'});
    }
}

function step3Process(resp) {
    console.dir("setp3", resp);
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
        for (var i = 0; i < deconzList.length; i++) {
            deconzList[i].apikey = resp.result[deconzList[i].internalipaddress].apikey;
            var newRow = '<tr>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<a id="actionbuttonapikey' + i + '" title="Cliquez pour lancer une demande de clé manuelle" ndx=' + i + ' class="add-ctrl btn btn-default fa fa-refresh disabled" style="font-size: 2.3em;color : SteelBlue;cursor:pointer;padding: 4px;"></a>';
            newRow += '</div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<i id="apikeyStatus' + i + '" title="Contrôleur prêt à être intégré" ndx=' + i + ' class="add-ctrl fa fa-exclamation-circle" style="font-size: 2.3em;color : ForestGreen;cursor:pointer;padding: 4px;"></i>';
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

function actionClick(handler) {
    var nodeValue = handler.target.attributes['ndx'].nodeValue;
    if (resp.result[nodeValue].action) {
        $('#' + handler.target.id).attr('class', 'fa fa-times');
        $('#' + handler.target.id).css({'color': 'red'});
    } else {
        $('#' + handler.target.id).attr('class', 'fa fa-check');
        $('#' + handler.target.id).css({'color': 'green'});
    }
}

function valid() {
    var a = true;
    var b = true;
    var ipform = $("#ipform");
    var portform = $("#portform");
    console.dir("valid",ipform[0][0].validity.valid);
    if (ipform[0][0].validity.valid && portform[0][0].validity.valid) {
        $('.valid-ctrl').removeClass('disabled');
    }
}
function addCtrl(handler) {
    $(".next-form").addClass("disabled");
    var i = 0;
    var newRow = '<tr><td></td><td></td><td></td><td></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><form id="ipform" class="inputform" action="javascript:valid()"><input title="Adresse IP du contrôleur" type="ipman" class="form-control" required id="ipman" name="ipman" placeholder="xxx.xxx.xxx.xxx" value="" pattern="^([0-9]{1,3}\.){3}[0-9]{1,3}$"></form></div></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><form id="portform" class="inputform" action="javascript:valid()"><input title="Port réseau du contrôleur"  type="portman" class="form-control" required id="portman" name="portman" placeholder="xxxxx" value="" pattern="^([0-9]{1,4}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5])$"></form></div></td>';
    newRow += '<td style="padding: 8px;"><a class="valid-ctrl btn btn-success fa fa-plus disabled"> Valider</a><a class="cancel-ctrl btn btn-danger fa fa-minus"> Annuler</a></td>';
    newRow += '</tr>';
    $("#deconzListTable>tbody:last").append(newRow);
    $("#ipman").focus();
    $('<input type="submit" value="Submit">').hide().appendTo('#ipform').click().remove();
    prepareInputValidate("#ipman");
    prepareInputValidate("#portman");
    $(".add-ctrl").addClass("disabled");
}

function prepareInputValidate(input) {
    var field = $(input);
    var form = field.closest("form");
    //  var element = $("#portman")[0];
    //  element.setCustomValidity('Veuillez un port réseau valide (0-65535)');
    field.blur(function (event) {
    });
    field.focus(function (event) {
        virtualsubmit();
    });
    field.keypress(function () {
        virtualsubmit();
    });
    virtualsubmit = function () {
        $('<input type="submit" value="Submit">').hide().appendTo(form).click().remove();
    };
}

function setHelp(help) {
    $('#stepHelp').html(help);
}