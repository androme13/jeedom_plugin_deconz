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
    setHelp("");
    $(".next-form").removeClass("disabled");
    $(".progress-bar").css({"background": "none"});
}

function step2Process(resp) {
    deconzList = new Object();
    $("#add_manual_ctrl_but").removeClass("disabled");
    var help = '<b><span style="text-decoration: underline;">Etape 1:</span></b><br>';
    help += "Une recherche automatique des controleurs DeCONZ est effectuée.";
    help += " Si toutefois aucun controleur n'est trouvé, vous pouvez ajouter un contrôleur manuellement en cliquant";
    help += ' sur le bouton "Ajout manuel".';
    setHelp(help);
    $(".next-form").addClass("disabled");
    //console.log(resp);
    //console.dir(resp);
    if (resp.state === "ok") {
        deconzList = resp.result;
        $(".progress-bar").css({"background": "SteelBlue"});
        step2TableGen();
        $("#div_ctrlSearchConfigurationAlert").showAlert({message: '{{Controleur(s) trouvé}} : ' + deconzList.length + ' controleur(s) DeCONZ trouvé(s)', level: 'success'});
        
    } else {
        //console.dir(resp);
        if (resp.url) {
            $("#div_ctrlSearchConfigurationAlert").showAlert({message: "{{Controleur DeCONZ introuvable}} : " + "Erreur : " + resp.url + " " + resp.error + " (" + resp.code + ")", level: "danger"});
        } else {
            $("#div_ctrlSearchConfigurationAlert").showAlert({message: "{{Controleur DeCONZ introuvable}} : " + "Erreur : " + resp.result, level: "danger"});
        }
        $(".progress-bar").css({"background": "red"});
    }
}

function step2TableGen() {
    var versionMini = '2.5.35';
    var i;
    if (deconzList.length > 0) {
        $("#deconzListTable>tbody:last").empty();
        for (i = 0; i < deconzList.length; i++) {
            var checkVersion = versionCompare(deconzList[i].swversion, versionMini);
            deconzList[i].action = checkVersion;
            var typeComment, type;
            if (location.host === deconzList[i].internalipaddress) {
                typeComment = "Interne";
            } else {
                typeComment = "Externe";
            }
            if (typeComment === "Interne") {
                type = 'jeedom jeedom2-home';
            } else {
                type = 'jeedom fa fa-sitemap';
            }
            var newRow = '<tr>';
            newRow += '<td style="vertical-align:middle;"><div class="form-group" align="center">';
            if (checkVersion === true) {
                newRow += '<a id="actionbutton' + i + '" title="Cliquez pour ne pas intègrer ce controleur" ndx=' + i + ' class="add_manual_ctrl_but btn-default fa fa-check-circle-o " style="font-size: 2.3em;color : green;cursor:pointer;padding: 4px;text-decoration:none;"></a>';
            } else {
                newRow += '<a id="actionbuttonB' + i + '" title="La version de ce controleur n\'est pas correcte" ndx=' + i + ' class="add_manual_ctrl_but btn-default fa fa-times-circle-o" style="font-size: 2.3em;color : red;cursor:pointer;padding: 4px;text-decoration:none;"></a>';
            }
            newRow += '</div></td>';
            newRow += '<td>';
            newRow += '<i id="typebutton' + i + '" title="' + typeComment + '" ndx=' + i + ' class="' + type + '" style="font-size: 2.2em;color : SteelBlue;padding: 6px 0px 0px 0px;"></i>';
            newRow += '</td>';
            //La version de ce controleur n\'est pas correcte
            newRow +='<td';
            if (checkVersion === true) {
                newRow += ' style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + deconzList[i].bridgeid + '"></div>';
            } else {
                newRow += ' style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + deconzList[i].bridgeid + '"></div>';
                newRow += '<i class="fa fa-exclamation-triangle" style="color:red;"></i><font color="white"> Version incorrecte.<br>Version actuelle : '+deconzList[i].swversion+'<br>Version mini : '+versionMini+'</font>';
            }
            newRow +='</td>';

            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + deconzList[i].name + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + deconzList[i].internalipaddress + '"></div></td>';
            newRow += '<td style="padding: 8px;" class="col-sm-1"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + deconzList[i].internalport + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + deconzList[i].mac + '"></div></td>';
            newRow += '</tr>';
            $("#deconzListTable>tbody:last").append(newRow);
            $("#actionbutton" + i).click(function (handler) {
                var nodeValue = handler.target.attributes['ndx'].nodeValue;
                if (deconzList[nodeValue].action) {
                    deconzList[nodeValue].action = false;
                    $("#" + handler.target.id).removeClass("fa-check-circle-o");
                    $("#" + handler.target.id).addClass("fa-ban");
                    $("#" + handler.target.id).css({'color': 'red'});
                    $("#" + handler.target.id).attr("title", "Cliquez pour intègrer cet équipement");
                } else {
                    deconzList[nodeValue].action = true;
                    $("#" + handler.target.id).removeClass("fa-ban");
                    $("#" + handler.target.id).addClass("fa-check-circle-o");
                    $("#" + handler.target.id).css({"color": "green"});
                    $("#" + handler.target.id).attr("title", "Cliquez pour ne pas intègrer cet équipement");
                }
                step2Valid();
            });
            $(".next-form").removeClass("disabled");
        }
        step2Valid();
    }
}

function step2Valid() {
    var i;
    var letNext = false;
    for (i = 0; i < deconzList.length; i++) {
        if (deconzList[i].action) {
            letNext = true;
        }
    }
    if (letNext) {
        $(".next-form").removeClass("disabled");
        $("#cancelreason").empty();
        $(".progress-bar").css({"background": "SteelBlue"});
    } else {
        $("#cancelreason").html('<i class="fa fa-exclamation-triangle" style="color:red;"></i><font color="white"> Aucun contrôleur intégrable.</font>');
        $(".next-form").addClass("disabled");
        $(".progress-bar").css({"background": "red"});
    }
    $("#add_manual_ctrl_but").removeClass("disabled");
}

function step2AddCtrl(handler) {
    $(".next-form").addClass("disabled");
    $("#valid_manual_ctrl_but").addClass("disabled");
    $("#add_manual_ctrl_but").addClass("disabled");
    var newRow = '<tr><td></td><td></td><td></td><td></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><input title="Veuillez saisir une adresse IP V4 valide." class= "form-control ipman" name="ipman" placeholder="xxx.xxx.xxx.xxx" ></div></td>';
    newRow += '<td style="padding: 8px;"><div class="form-group"><input title="Veuillez saisir un port valide."  class="form-control" name="portman" placeholder="xxxxx"></input></div></td>';
    newRow += '<td style="padding: 8px;"><a id="valid_manual_ctrl_but" class="valid-ctrl btn btn-default fa fa-plus disabled" style="color:green"><font color="white"> Ajouter</font></a><a id="cancel_manual_ctrl_but" class="cancel-ctrl btn btn-default fa fa-minus" style="color:red"><font color="white"> Supprimer</font></a></td>';
    newRow += '</tr>';
    $("#deconzListTable>tbody:last").append(newRow);
    $.validator.addMethod("ipv4", function (value, element) {
        return this.optional(element) || /^(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)$/i.test(value);
    }, "Veuillez saisir une adresse IP V4 valide.");
    $("#ctrl_form").validate({
        rules: {
            errorPlacement: function () {
                return false;
            },
            ipman: {
                required: true,
                ipv4: true
            },
            portman: {
                required: true,
                range: [1, 65535]
            }
        }
    });
    $("#ipman").focus();
    $("#cancel_manual_ctrl_but").click(function (context) {
        $("#ctrl_form").blur();
        $("#deconzListTable tr:last").remove();
        $("#add_manual_ctrl_but").removeClass("disabled");
        $("#div_ctrlSearchConfigurationAlert").hide();
        step2Valid();
    });
    $("#valid_manual_ctrl_but").click(function (context) {
        $("#ctrl_form").blur();
        $("input[name=ipman]").val();
        var srv = {'ip': $("input[name=ipman]").val(), 'port': $("input[name=portman]").val()};
        deconzcall.call('confirmIP', srv, validCtrl);
    });
    $("#ctrl_form").valid();
}

function step3Process(resp) {
    console.dir("step", resp);
    console.dir("deconzList", deconzList);
    var i;
    var help = '<b><span style="text-decoration: underline;">Etape 2:</span></b><br>';
    help += 'Une demande automatique de la clé sera effectuée,';
    help += 'si la demande automatique echoue vous serez invité';
    help += ' à obtenir et à saisir la clé APIKEY de DeCONZ manuellement.';
    setHelp(help);
    $(".next-form").addClass("disabled");
    if (resp.state === "ok") {
        $("#apiKeyTable>tbody:last").empty();
        $("#div_configurationAlert").showAlert({message: '{{Clé(s) API obtenue(s)}}', level: 'success'});
        $(".progress-bar").css({'background': 'SteelBlue'});
        for (i = 0; i < deconzList.length; i++) {
            deconzList[i].apikey = resp.result[deconzList[i].internalipaddress].apikey;
            var newRow = '<tr>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<a id="actionbuttonapikey' + i + '" title="Cliquez pour lancer une demande de clé manuelle" ndx=' + i + ' class="add_manual_ctrl_but btn btn-default fa fa-refresh disabled" style="font-size: 2.3em;color : SteelBlue;cursor:pointer;padding: 4px;text-decoration:none;"></a>';
            newRow += '</div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group" align="center">';
            newRow += '<i id="apikeyStatus' + i + '" title="Contrôleur prêt à être intégré" ndx=' + i + ' class="add_manual_ctrl_but fa fa-exclamation-circle" style="font-size: 2.3em;color : ForestGreen;cursor:pointer;padding: 4px;"></i>';
            newRow += '</div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="id' + i + '" class="form-control" required id="id' + i + '" name="id" placeholder="Id" value="' + deconzList[i].bridgeid + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="name' + i + '" class="form-control" required id="name' + i + '" name="name" placeholder="Nom" value="' + deconzList[i].name + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="internalipaddress' + i + '" class="form-control" required id="internalipaddress' + i + '" name="internalipaddress" placeholder="Ip" value="' + deconzList[i].internalipaddress + '"></div></td>';
            newRow += '<td style="padding: 8px;"><div class="form-group"><input readonly type="macaddress" class="form-control" required id="macaddress" name="macaddress' + i + '" placeholder="macaddress" value="' + deconzList[i].mac + '"></div></td>';
            newRow += '<td style="padding: 8px;" class="col-sm-2"><div class="form-group"><input readonly type="internalport" class="form-control" required id="internalport' + i + '" name="internalport" placeholder="Port" value="' + deconzList[i].apikey + '"></div></td>';
            newRow += '</tr>';
            $("#apiKeyTable>tbody:last").append(newRow);
        }
        $(".next-form").removeClass("disabled");
    } else if (resp.state === "nok") {
        $("#div_configurationAlert").showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.error + ' (" + resp.code + ")', level: 'danger'});
        $(".progress-bar").css({'background': 'red'});
    } else if (resp.state === "error") {
        $("#div_configurationAlert").showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.result, level: 'warning'});
        $(".progress-bar").css({'background': 'orange'});
    }
}

function step4Process() {
    $(".next-form").prop("disabled", false);
}

function validCtrl(resp) {
    if (resp.state === "ok") {
        /* if (deconzList.indexOf(resp.result.bridgeid)!==-1) {
         deconzList.push(resp.result);
         step2TableGen();
         $("#div_ctrlSearchConfigurationAlert").showAlert({message: 'Controleur ajouté manuellement Trouvé : ' + resp.result.name + ' (' + resp.result.internalipaddress + ')', level: 'info'});
         
         } else
         {
         step2TableGen();
         $("#div_ctrlSearchConfigurationAlert").showAlert({message: 'Controleur ajouté manuellement déja présent dans la liste ('+resp.result.bridgeid+')', level: 'warning'});
         }*/
        deconzList.push(resp.result);
        step2TableGen();
        $("#div_ctrlSearchConfigurationAlert").showAlert({message: 'Controleur ajouté manuellement Trouvé : ' + resp.result.name + ' (' + resp.result.internalipaddress + ')', level: 'info'});

    } else
    {
        $("#div_ctrlSearchConfigurationAlert").showAlert({message: 'Impossible d\'ajouter le controleur, erreur : ' + resp.result, level: 'danger'});
    }

}

function setHelp(help) {
    $("#stepHelp").html(help);
}

function versionCompare(actualStr, miniStr) {
    var pass = true;
    var actual = actualStr.split('.');
    var mini = miniStr.split('.');
    actual.splice(mini.length);
    for (var i = 0; i < actual.length; i++) {
        if (parseInt(mini[i]) > parseInt(actual[i])) {
            pass = false;
            break;
        }
        if (parseInt(mini[i]) < parseInt(actual[i])) {
            break;
        }
    }
    return pass;
}