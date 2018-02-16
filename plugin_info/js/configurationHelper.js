
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

function step1Process(){
    $(".next-form").prop("disabled",false);
}

function step2Process(resp) {
    $(".next-form").prop("disabled",true);
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ trouvé}} : ' + resp.result[0].name + ' ( {{Id}}=' + resp.result[0].id + ', {{Mac}}=' + resp.result[0].macaddress + ')', level: 'success'});
        if (resp.result.length===1){
            $('#ip').val(resp.result[0].internalipaddress);
            $('#port').val(resp.result[0].internalport);
            $(".next-form").prop("disabled",false);
        }      
    } else {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ introuvable}} : ' + 'Erreur : ' + resp.url + ' ' + resp.error+' (' + resp.code + ')', level: 'danger'});       
    }
}

function step3Process(resp){
    $(".next-form").prop("disabled",true);
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{Clé API obtenue}} : ' + resp.result[0].name + ' ( {{Id}}=' + resp.result[0].id + ', {{Mac}}=' + resp.result[0].macaddress + ')', level: 'success'});
        if (resp.result.length===1){
          //  $('#ip').val(resp.result[0].internalipaddress);
          //  $('#port').val(resp.result[0].internalport);
            $(".next-form").prop("disabled",false);
        }      
    } else if (resp.state === 'nok') {
        $('#div_configurationAlert').showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.error+' (' + resp.code + ')', level: 'danger'});       
    } else if (resp.state === 'error') {
        $('#div_configurationAlert').showAlert({message: '{{Impossible d\'obtenir une clé API}} : ' + 'Erreur : ' + resp.url + ' : ' + resp.result, level: 'warning'});               
    }
}

function step4Process(){
    $(".next-form").prop("disabled",false);
}