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

var fs = require("fs");
var process = require('process');
pidfile = module.exports = {
createpidfile:function(){
	try {
		fs.writeFileSync("/tmp/raspbee.pid", process.pid, "UTF-8");
		return 1;
	} catch (err) {
			return 0;
		}
	},
removepidfile: function(){
		fs.unlink('/tmp/raspbee.pid', (err) => {
			console.log('successfully deleted /tmp/hello');
		});
	},
checkpidfile: function (){
		try {
			return fs.readFileSync('/tmp/raspbee.pid', 'utf8');
		} catch (err) {
			return 0;
		}
	}
}

