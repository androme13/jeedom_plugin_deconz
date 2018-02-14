<?php

/* This file is part of Jeedom.
 *
 * Jeedom is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Jeedom is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with Jeedom. If not, see <http://www.gnu.org/licenses/>.
 */

try {
    require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';
    require_once dirname(__FILE__) . '/../php/deconzCom.class.php';
    include_file('core', 'authentification', 'php');

    if (!isConnect('admin')) {
        throw new Exception(__('401 - Accès non autorisé', __FILE__));
    }

    ajax::init();
    switch (init('action')) {
        case 'deconzSearch' :
            $com = new deconzCom();
            $resp = $com->findDeCONZ();
            //$resp = json_encode($donneesAEncoder, JSON_FORCE_OBJECT);
            //$resp = RaspBEE::createEqLogic(init('device'), init('syncType'));
            break;
    }
    if (!isset($resp)) {        
        ajax::error("no response");       
    } else {
       if ($resp->state === "nok") {
            ajax::error($resp->message);
        } else {
            ajax::success($resp->message);
        }
    }
    

    throw new Exception(__('Aucune méthode correspondante à : ', __FILE__) . init('action'));
    /*     * *********Catch exeption*************** */
} catch (Exception $e) {
    ajax::error(displayExeption($e), $e->getCode());
}

