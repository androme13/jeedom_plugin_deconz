
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

function step2Process(resp) {
    if (resp.state === 'ok') {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ trouvé}} : ' + resp.result[0].name + ' ( {{Id}}=' + resp.result[0].id + ', {{Mac}}=' + resp.result[0].macaddress + ')', level: 'success'});
    } else {
        $('#div_configurationAlert').showAlert({message: '{{DeCONZ introuvable}} : ' + 'Erreur : ' + resp.url + ' ' + resp.error+' (' + resp.code + ')', level: 'danger'});
       
    }
}