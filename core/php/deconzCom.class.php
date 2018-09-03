<?php

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

require_once dirname(__FILE__) . "/../../../../core/php/core.inc.php";

// interactions vers le contrôleur DeConz

class deconzCom {

    private $default_CURLOPT = [
        CURLOPT_CONNECTTIMEOUT => 30,
        CURLOPT_PORT => 80,
        CURLOPT_FORBID_REUSE => true,
        CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
        CURLOPT_FRESH_CONNECT => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_SSL_VERIFYPEER => false,
        //CURLOPT_SSLVERSION => 3,
        CURLOPT_TIMEOUT => 5
    ];
    private $apikey = null;
    private $ip = null;
    private $port = null;
    private $responseHelper = array('error' => 0, 'message' => '', 'state' => '');
    private $deconzHTTPErrors = [
        '200' => ['name' => 'OK', 'desc' => 'Request succeded'],
        '201' => ['name' => 'Created', 'desc' => 'A new resource was created'],
        '202' => ['name' => 'Accepted', 'desc' => 'Request will be processed but isn\'t finished yet'],
        '304' => ['name' => 'Not Modified', 'desc' => 'Is returned if the request had the If-None-Match header and the ETag on the resource was the same.'],
        '400' => ['name' => 'Bad request', 'desc' => 'The request was not formated as expected or missing parameters'],
        '401' => ['name' => 'Unauthorized', 'desc' => 'Authorization failed'],
        '403' => ['name' => 'Forbidden', 'desc' => 'The caller has no rights to access the requested URI'],
        '404' => ['name' => 'Resource Not Found', 'desc' => 'The requested resource (light, group, ...) was not found'],
        '503' => ['name' => 'Service Unavailable', 'desc' => 'The device is not connected to the network or too busy to handle further requests'],
    ];
    private $deconzOBJECTErrors = [
        '1' => ['desc' => 'unauthorized user', 'details' => 'This will be returned if the request had no valid apikey or if the apikey has not the rights to access a resource.'],
        '2' => ['desc' => 'body contains invalid JSON', 'details' => 'This will be returned if the JSON in the body couldn\'t be parsed.'],
        '3' => ['desc' => 'resource, <resource>, not available', 'details' => 'This will be returned if the requestet resource like a light or a group does not exist.'],
        '4' => ['desc' => 'method, <method>, not available for resource, <resource>', 'details' => 'This will be returned if the requested method (GET, PUT, POST or DELETE) is not supported for the resource.d'],
        '5' => ['desc' => 'missing parameters in body', 'details' => 'This will be returned if the request didn\'t contain all required parameters.'],
        '6' => ['desc' => 'parameter, <parameter>, not available', 'details' => 'This will be returned if a parameter sent in the request is not supported.'],
        '7' => ['desc' => 'invalid value, <value>, for parameter, <parameter>', 'details' => 'This will be returned if a parameter hasn\'t the expected format or is out of range.'],
        '8' => ['desc' => 'parameter, <parameter>, is not modifiable', 'details' => 'This will be returned in an attempt to change a read only parameter.'],
    ];

    public function __construct($ip = null, $apikey = null) {
        if (isset($ip)) {
            $this->ip = $ip;
        } else {
            $this->ip = config::byKey('DeConzIP', 'DeConz');
        }
        if (isset($apikey)) {
            $this->apikey = $apikey;
        } else {
            $this->apikey = config::byKey('DeConzAPIKEY', 'DeConz');
        }
    }

    public function confirmIP($ip = null, $port = null) {
        if ($ip == null) {
            $ip = $this->ip;
        }
        if ($port == null) {
            $port = $this->port;
        }
        $opts = $this->default_CURLOPT;
        $opts[CURLOPT_URL] = 'http://' . $ip . '/api/config';
        $opts[CURLOPT_PORT] = $port;
        $resp = self::genericResponseProcess($opts);
        if ($resp->state === 'ok') {
            $jsonObj = json_decode($resp->message);
            $jsonObj->internalipaddress = $ip;
            $jsonObj->internalport = $port;
            $resp->message = json_encode($jsonObj);
        }
        return $resp;
    }

    public function deleteDeConzUser($user = '') {
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_URL => 'http://' . $this->ip . '/api/' . $this->apikey . '/config/whitelist/' . $user,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        return self::genericResponseProcess($opts);
    }

    public function findDeConz() {
        $opts = $this->default_CURLOPT;
        $opts[CURLOPT_URL] = 'http://dresden-light.appspot.com/discover';
        $opts[CURLOPT_PORT] = 80;
        $response = self::genericResponseProcess($opts);
        $datas = json_decode($response->message);
        for ($i = 0; $i < count($datas); $i++) {
            $datas[$i] = json_decode(self::confirmIP($datas[$i]->internalipaddress, $datas[$i]->internalport)->message);
        }
        $response->message = json_encode($datas);
        return $response;
    }

    private function genericDelete($url = null, $param = null) {
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_CUSTOMREQUEST => "DELETE",
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_POSTFIELDS => $param,
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        return self::genericResponseProcess($opts);
    }

    private function genericGet($url = null) {
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        return self::genericResponseProcess($opts);
    }

    private function genericPost($url = null, $param = null) {
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_POSTFIELDS => $param,
            CURLOPT_URL => $url,
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        return self::genericResponseProcess($opts);
    }

    private function genericPut($url = null, $param = null) {
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_POSTFIELDS => $param,
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        return self::genericResponseProcess($opts);
    }

    private function genericResponseProcess($opts) {
        $ch = curl_init();
        curl_setopt_array($ch, $opts);
        $result = curl_exec($ch);
        $error = curl_error($ch);
        $httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        if ($result === false) {
            $response->state = 'nok';
            $response->error = $httpcode;
            $response->message = $error;
        } else {
            $response->state = 'ok';
            $response->error = $httpcode;
            if ($response->error != '200') {
                $response->state = 'nok';
            }
            $response->message = $result;
            if ($response->message === '') {
                $response->message = strval($response->error);
            }
        }
        return $response;
    }

    public function getAPIAccess() {
// méthode 1
        $opts = $this->default_CURLOPT;
        $opts[CURLOPT_POST] = true;
        $opts[CURLOPT_POSTFIELDS] = '{"devicetype":"jeedom_DeConz_Plugin"}';
        $opts[CURLOPT_URL] = 'http://' . $this->ip . '/api';
        $response = self::genericResponseProcess($opts);
        if ($response->state === 'ok') {
            return $response;
        }
// si la premère méthode échoue on passe à la seconde
//user et pwd par défaut
        $usr = "delight";
        $pwd = "delight";
        $opts[CURLOPT_HTTPHEADER] = array('Content-Type: application/json', 'Authorization: Basic ' . base64_encode(utf8_encode($usr . ':' . $pwd)));
        return self::genericResponseProcess($opts);
        //$response = self::genericResponseProcess($opts);
        //return $response;
    }

    public function getConf() {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/config");
    }

    public function getSensors() {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/sensors");
    }

    public function getGroups() {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/groups");
    }

    public function getGroupAttributes($groupId) {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/groups/" . $groupId);
    }

    public function getLights() {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/lights");
    }

    public function getTouchlink() {
        return self::genericGet("http://" . $this->ip . "/api/" . $this->apikey . "/touchlink/scan");
    }

    public function getTouchlinkIdentify($id) {
        return self::genericPost("http://" . $this->ip . "/api/" . $this->apikey . "/touchlink/" . $id . "/identify");
    }

    public function getTouchlinkRefresh($id) {
        return self::genericPost("http://" . $this->ip . "/api/" . $this->apikey . "/touchlink/scan");
    }

    public function groupCreate($name) {
        return self::genericPost("http://" . $this->ip . "/api/" . $this->apikey . "/groups", '{"name":"' . $name . '"}');
    }

    public function setGroupAttributes($groupId, $attributesJSON) {
        return self::genericPut("http://" . $this->ip . "/api/" . $this->apikey . "/groups/" . $groupId, $attributesJSON);
    }

    public function setLightAttributes($groupId, $attributesJSON) {
        return self::genericPut("http://" . $this->ip . "/api/" . $this->apikey . "/lights/" . $groupId, $attributesJSON);
    }

    public function setSensorAttributes($sensorId, $attributesJSON) {
        return self::genericPut("http://" . $this->ip . "/api/" . $this->apikey . "/sensors/" . $sensorId, $attributesJSON);
    }

    public function groupDelete($id) {
        return self::genericDelete("http://" . $this->ip . "/api/" . $this->apikey . "/groups/" . $id);
    }

    public function permitJoin($state = 254) {
        $state = intval($state);
        if ($state < 0) {
            $state = 0;
        }
        if ($state > 255) {
            $state = 255;
        }
        $command = '{permitjoin:' . $state . '}';
        return self::genericPut("http://" . $this->ip . "/api/" . $this->apikey . "/config/", $state);
    }

    public function setDeconzConfig($config) {
        return self::genericPut("http://" . $this->ip . "/api/" . $this->apikey . "/config/", $config);
    }

    public function sendCommand($type = null, $id = null, $command = null) {
//error_log("sendLightCommand(".$id.":".$command.")",3,"/tmp/prob.txt");
        $url = 'http://' . $this->ip . '/api/' . $this->apikey . '/' . $type . '/' . $id;
        if ($type == "groups") {
            $url = $url . "/action";
        }
        if ($type != "groups") {
            $url = $url . "/state";
        }
        error_log("url :" . $url, 3, "/tmp/prob.txt");
        if ($id === null || $command === null || $type === null) {
            return false;
        }
        $ch = curl_init();
        $opts = [
            CURLOPT_SSL_VERIFYPEER => false,
            CURLOPT_FORBID_REUSE => true,
            CURLOPT_POSTFIELDS => $command,
            CURLOPT_CUSTOMREQUEST => "PUT",
            CURLOPT_HTTPHEADER => array('Content-Type: application/json'),
            CURLOPT_URL => $url,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_CONNECTTIMEOUT => 30
        ];
        curl_setopt_array($ch, $opts);
        $result = curl_exec($ch);
        curl_close($ch);
        if ($result === false) {
            return false;
        } else {
            return $result;
        }
    }

    public function setIpPort($newip = null, $newport = null) {
        
        if ($newip != null) {
            $this->ip = $newip;
           // $GLOBALS['ip'] = $ip;
        }
        if ($newport != null) {
            $this->port = $newport;
           // $GLOBALS['port'] = $port;
        }
    }

}
