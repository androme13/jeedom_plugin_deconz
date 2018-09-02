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

    public function createController($controller) {
        $eqLogic = new eqLogic();
        $eqLogic->setIsEnable(1);
        $eqLogic->setIsVisible(1);
        $_logical_id = null;
        $eqLogic->setLogicalId($_logical_id);
        $eqLogic->setEqType_name('deconz');
        $eqLogic->setName($controller[name]);
        $eqLogic->setConfiguration('type','ctrl');
        $eqLogic->save();
    }

}

?>
