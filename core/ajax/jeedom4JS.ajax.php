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
// helper jeedom pour javascript

try {
    require_once dirname(__FILE__) . '/../../../../core/php/core.inc.php';
    include_file('core', 'authentification', 'php');

    if (!isConnect('admin')) {
        throw new Exception(__('401 - Accès non autorisé', __FILE__));
    }

    ajax::init();
    switch (init('action')) {
        case 'log' :
            $logName = init('logName');
            $level = init('level');
            $message = init('message');
            if (isset($logName) && isset($level) && isset($message)) {
                sendToLog(init('logName'), init('level'), init('message'));
                $resp->state = "ok";                
            } else {
                $resp->state = "nok";
                $resp->message = "Veuillez fournir les paramètres : logName,level,message";
            }
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

function sendToLog($logName = "jeedom4JS", $level = "danger", $message = "4eedom4JS erreur de log") {
    log::add($logName, $level, $message);
}
