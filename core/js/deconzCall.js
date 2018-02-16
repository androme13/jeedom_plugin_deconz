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
    string2JSON(string) {

        try
        {
            return JSON.parse(string.replace('\"', '"'));
        } catch (e)
        {
            return 'Chaine json invalide';
        }
    }
    deconzSearch(callback) {
        var me = this;
        var url = "plugins/deconz/core/ajax/deconzCall.ajax.php";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                action: "deconzSearch"
            },
            dataType: 'json',
            error: function (resp, status, error) {
                me.deconzGenericAjaxError(url, resp, status, error, callback)
            },
            success: function (resp, status) {
                me.deconzGenericAjaxSuccess(resp, callback);
            }
        });
    }

    deconzGetAPIKey(callback) {
        var me = this;
        var url = "plugins/deconz/core/ajax/deconzCall.ajax.php";
        $.ajax({
            type: "POST",
            url: url,
            data: {
                action: "getAPIKey",
            },
            dataType: 'json',
            error: function (resp, status, error) {
                me.deconzGenericAjaxError(url, resp, status, error, callback)
            },
            success: function (resp) {
                me.deconzGenericAjaxSuccess(resp, callback, url);
            }
        });
    }

    deconzGenericAjaxError(url, resp, status, error, callback) {
        var jeedomTools = new jeedomHelper();
        jeedomTools.log('deconz', 'error', url + ' : ' + error + ' (' + resp.status + ')');
        var response = new Object();
        response.state = "nok";
        response.status = status;
        response.error = error;
        response.code = resp.status;
        response.url = url;
        callback(response);
    }

    deconzGenericAjaxSuccess(resp, callback, url) {
        console.log("deconzGenericAjaxSuccess", resp);
        if (resp.state === "ok") {
            resp.result = this.string2JSON(resp.result);
        }
        resp.url = url;
        callback(resp);
    }

}