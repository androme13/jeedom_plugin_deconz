
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

//var deconzList = new object();


function step1Process() {
    $(".next-form").prop("disabled", false);
    $('.progress-bar').css({'background': 'none'});
}

function step2Process(resp) {
    $(".next-form").prop("disabled", true);
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ trouvé}} : ' + resp.result.length + ' DeCONZ trouvé(s)', level: 'success'});
        $('.progress-bar').css({'background': 'SteelBlue'});
        if (resp.result.length > 0) {
            $("#deconzListTable>tbody:last").empty();
            for (var i = 0; i < resp.result.length; i++) {
                resp.result[0].action = true;
                var newRow = '<td style="padding: 8px;"><div title="Cliquez pour ne pas intègrer cet équipement" class="form-group" align="center">';
                newRow += '<i id="actionbutton' + i + '" ndx=' + i + ' class="fa fa-check" style="font-size: 2em;color : green;"></i>';
                newRow += '</td></div>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + resp.result[i].id + '"></td></div>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + resp.result[i].name + '"></td></div>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + resp.result[i].internalipaddress + '"></td></div>';
                newRow += '<td style="padding: 8px;" class="col-sm-2"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + resp.result[0].internalport + '"></td></div>';
                newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + resp.result[i].macaddress + '"></td></div>';
                $("#deconzListTable>tbody:last").append(newRow);
                $("#actionbutton" + i).click(function (handler) {
                    var nodeValue = handler.target.attributes['ndx'].nodeValue
                    console.dir(handler.target.attributes['ndx'].nodeValue);
                    if (resp.result[nodeValue].action) {
                        resp.result[nodeValue].action=false;
                        $("#" + handler.target.id).attr('class', 'fa fa-times');
                        $("#" + handler.target.id).css({'color': 'red'});
                    } else {
                        resp.result[nodeValue].action=true
                        $("#" + handler.target.id).attr('class', 'fa fa-check');
                        $("#" + handler.target.id).css({'color': 'green'});
                    }
                });
            }
            $(".next-form").prop("disabled", false);
        }
    } else {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ introuvable}} : ' + 'Erreur : ' + resp.url + ' ' + resp.error + ' (' + resp.code + ')', level: 'danger'});
        $('.progress-bar').css({'background': 'red'});
    }
}

function step3Process(resp) {
    $(".next-form").prop("disabled", true);
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{Clé API obtenue}} : ' + resp.result[0].name + ' ( {{Id}}=' + resp.result[0].id + ', {{Mac}}=' + resp.result[0].macaddress + ')', level: 'success'});
        $('.progress-bar').css({'background': 'SteelBlue'});
        if (resp.result.length === 1) {
            $(".next-form").prop("disabled", false);
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
        $("#" + handler.target.id).attr('class', 'fa fa-times');
        $("#" + handler.target.id).css({'color': 'red'});
    } else {
        $("#" + handler.target.id).attr('class', 'fa fa-check');
        $("#" + handler.target.id).css({'color': 'green'});
    }
}