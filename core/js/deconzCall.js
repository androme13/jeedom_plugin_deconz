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

class deconzCall {
    deconzSearch(callback) {
        var url = "plugins/deconz/core/ajax/deconzCall.ajax.php";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                action: "deconzSearch"
            },
            dataType: 'json',
            error: function (resp, status, erreur) {
                $('#div_configurationAlert').showAlert({message: '{{Erreur}} : ' + url + ' ' + erreur + ' (' + resp.status + ')', level: 'danger'});
                var jeedomTools = new jeedomHelper();
                jeedomTools.log('deconz', 'error', url + ' ' + erreur + ' (' + resp.status + ')');
            },
            success: function (resp, status) {
                try
                {
                    var cleanResp = JSON.parse(resp.result.replace('\"', '"'));
                } catch (e)
                {
                    var cleanResp = 'invalid json';
                }
                if (resp.state === 'ok') {
                    callback(resp);
                    $('#div_configurationAlert').showAlert({message: '{{Passerelle trouvée}} : ' + cleanResp[0].name + ' ( {{Id}}=' + cleanResp[0].id + ', {{Mac}}=' + cleanResp[0].macaddress + ')', level: 'success'});
                } else {
                    callback(resp);
                    $('#div_configurationAlert').showAlert({message: '{{Passerelle introuvable}} : ' + HTMLClean(resp.result), level: 'danger'});
                }
            }
        });
    }
}