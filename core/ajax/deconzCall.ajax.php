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
    $action = init('action');
    $params = json_decode(init('params'));
    $error = 'Aucune méthode correspondante à : ' . $action;
    $com = new deconzCom();
    switch ($action) {
        case 'confirmIP' :
            $resp = $com->confirmIP();
            $error = 'confirmIP Error';
            break;
        case 'search' :
            $resp = $com->findDeCONZ();
            $error = 'Search Error';
            break;
        case 'getAPIKey' :
            for ($i = 0; $i < count($params); $i++) {
                $com->setIpPort($params[$i]->ip, $params[$i]->port);
                $message = json_decode($com->getAPIAccess()->message);
                $arr[$params[$i]->ip] = [
                    'apikey' => $message[0]->success->username,
                    'error' => $com->getAPIAccess()->error,
                    'state' => $com->getAPIAccess()->state,
                ];
            }
            $resp->message = json_encode($arr);
            $resp->state = 'ok';
            $error = 'GetAPIKey Error';
            break;
    }
    unset($com);
    if (!isset($resp)) {
        log::add('deconz (deconzCall.ajax.php)', 'warning', __FILE__ . ' : ' . $error);
        ajax::error($error);
    } else {
        if ($resp->state === 'ok') {
            ajax::success($resp->message);
        } else {
            ajax::error($resp->message);
        }
    }
    throw new Exception(__('Aucune méthode correspondante à : ', __FILE__) . init('action'));
    /*     * *********Catch exeption*************** */
} catch (Exception $e) {
    ajax::error(displayExeption($e), $e->getCode());
}

