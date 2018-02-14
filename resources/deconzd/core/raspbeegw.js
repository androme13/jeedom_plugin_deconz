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

const util = require('util');
var WebSocketClient = require('websocket').client;
var WebSocketClientParser = require('./websocketclientparser.js');
var WSclient = new WebSocketClient();

raspbeegw = module.exports = {
	connect : function (host, port, callback) {
		raspbeegw.setup(callback);
		WSclient.connect('ws://'+host+':'+port);
	},
	close : function() {
		
	},
	setup : function(callback){		
		WSclient.on('connectFailed', function(error) {
			console.log('Connect Error: ' + error.toString());
		});
		WSclient.on('connect', function(connection) {
			console.log('Client WebSocket connecté à la passerelle RaspBee');
			connection.on('error', function(error) {
				console.log("Connection Error}}: " + error.toString());
			});
			connection.on('close', function() {
				console.log('Connection Closed');
			});
			connection.on('message', function(message) {
				if (message.type === 'utf8') {					
						try{
						callback(WebSocketClientParser.process(JSON.parse(message.utf8Data)));
						}
						catch (err){
							console.log(err);
						}
				}
			});
		});		
		}
};
