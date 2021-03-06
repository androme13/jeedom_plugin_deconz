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

class jeedomHelper {
    log(logName, level, message) {
        var url = "plugins/deconz/core/ajax/jeedom4JS.ajax.php";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                action: "log",
                logName: logName,
                level: level,
                message: message
            },
            dataType: 'json',
            error: function (resp, status, erreur) {
                var consoleMessage = 'jeedom4JS ' + '(' + new Date + ') : impossible d\'inscrire un log (Nom : "' + logName + '", Level : "' + level + '", Msg : "' + message + '")';
                consoleMessage += "\n";
                consoleMessage += "\tCause : " + url + ' ' + erreur + ' (' + resp.status + ')';
                console.log(consoleMessage);
            },
            success: function (resp, status) {
                if (resp.state !== 'ok') {                    
                    var consoleMessage = 'jeedom4JS ' + '(' + new Date + ') : impossible d\'inscrire un log (Nom : "' + logName + '", Level : "' + level + '", Msg : "' + message + '")';                    
                    consoleMessage += "\n";
                    consoleMessage += "\tCause : " + ' (' + resp.status + ')';
                    //  callback(resp);
                }
            }
        });
    }

}

