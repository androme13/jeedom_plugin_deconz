<?php

/* This file is part of Plugin RaspBEE for jeedom.
 *
 * Plugin RaspBEE for jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Plugin RaspBEE for jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Plugin DeCONZ for jeedom. If not, see <http://www.gnu.org/licenses/>.
 */
require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';

class eqLogicOperate extends eqLogic {

    public function createGenericDevice($path, $eqLogic = null, $device, $eqLogicMode) {
        if (!is_file(dirname(__FILE__) . $path)) {
            return false;
        };
        $configFile = file_get_contents(dirname(__FILE__) . $path);
        if (!is_json($configFile)) {
            return false;
        }
        $eqLogic = self::setGenericEqLogic($eqLogic, $device, $eqLogicMode);
        return self::setGenericCmdList(basename($path), $eqLogic, $eqLogicMode);
    }

    public function createController($controller) {
        $eqLogic = new eqLogic();
        $eqLogic->setIsEnable(1);
        $eqLogic->setIsVisible(1);
        $_logical_id = null;
        $eqLogic->setLogicalId($_logical_id);
        $eqLogic->setEqType_name('deconz');
        $eqLogic->setName($controller[name]);
        $eqLogic->setConfiguration('type', 'ctrl');
        $eqLogic->save();
    }

    function setGenericEqLogic($eqLogic = null, $device, $syncType = "basic", $eqLogicMode) {
        //error_log("setGenericEqLogic: " . json_encode($device), 3, "/tmp/prob.txt");
        if ($eqLogicMode == false && $eqLogic == null) {
            $eqLogic = new eqLogic();
            $eqLogic->setIsEnable(1);
            $eqLogic->setIsVisible(1);
            $_logical_id = null;
            //$eqLogic->setLogicalId($_logical_id);
            $eqLogic->setEqType_name('deconz');
            $eqLogic->setName($device[name]);
            $eqLogic->save();
            // if (array_key_exists('battery', $device[config]))
            //    $eqLogic->batteryStatus($device[config][battery]);
        }
      /*  switch ($syncType) {
            case "limited" :
            case "basic" :
                $eqLogic = self::setGenericEqLogicConf($eqLogic, $device, $syncType, $eqLogicMode);
                $eqLogic->save();
                break;
            case "renew" :
                break;
            case "renewbutidandname" :
                $eqLogic = self::setGenericEqLogicConf($eqLogic, $device, $syncType, $eqLogicMode);
                $eqLogic->save();
                break;
        }*/
        return $eqLogic;
    }

    function setGenericEqLogicConf($eqLogic = null, $device, $syncType = "basic", $eqLogicMode) {
        //error_log("synctype: ".$syncType,3,"/tmp/prob.text");
        switch ($syncType) {
            case "limited" :
            case "basic" :
                self::checkAndSetEqLogicConfiguration($eqLogic, 'origid', $device[origid], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'manufacturername', $device[manufacturername], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'modelid', $device[modelid], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'reachable', $device[reachable], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'swversion', $device[swversion], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'type', $device[type], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'uniqueid', $device[uniqueid], $syncType);
                break;
            case "renew" :
                break;
            case "renewbutidandname" :
                self::checkAndSetEqLogicConfiguration($eqLogic, 'origid', $device[origid], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'manufacturername', $device[manufacturername], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'modelid', $device[modelid], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'reachable', $device[reachable], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'swversion', $device[swversion], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'type', $device[type], $syncType);
                self::checkAndSetEqLogicConfiguration($eqLogic, 'uniqueid', $device[uniqueid], $syncType);
                break;
        }
        return $eqLogic;
    }

}

?>
