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

try{
	var request = require('ajax-request');
}
catch (err){
	Console.log(err);
}

ajaxclient = module.exports = {
	
	
sendPOST: function (DATA){
					console.log("sendpost"+global.jurl+"?apikey="+global.apikey);
		request.post({
url: global.jurl+"?apikey="+global.apikey,
data: DATA,
headers: {}
		},function(err, res, body){
			try{
				//console.log("data:"+JSON.stringify(DATA));
				//console.log("ajax client jeedom return body:",JSON.stringify(body));
				//console.log("ajax client jeedom return err:",err);
				//console.log(res);
				//console.log(res.statusCode);
				//console.log(res.statusMessage);
				//console.log(res.rawHeaders);
				//console.log(body);
			}
			catch(err){
				console.log("ajaxclient error",err);
			}
		});
		
	}
}