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

require_once dirname(__FILE__) . '/../../../core/php/core.inc.php';
include_file('core', 'authentification', 'php');
if (!isConnect()) {
    include_file('desktop', '404', 'php');
    die();
}
?>
<div id='div_configurationAlert' style="display: none;"></div>
<div class="container">
    <center><h2>Aide à la configuration de DeCONZ</h2></center>
    <div class="progress">
        <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
    </div>
    <div class="alert alert-success hide"></div>
    <table class="table">
        <td>
            <form id="register_form" novalidate action="form_action.php" method="post">
                <fieldset>
                    <h2>Configuration: 3 étapes pour configurer le plugin</h2>
                    <div class="form-group">
                        La configuration se déroule en 3 étapes, un assistant vous y aidant.<br>
                        <br><b><span style="text-decoration: underline;">Etape 1:</span></b><br>
                        Une recherche automatique de DeCONZ sera effectuée,<br>
                        si la recherche automatique echoue vous serez invité<br>
                        à saisir l'ip et le port de DeCONZ manuellement.<br>
                        <br><b><span style="text-decoration: underline;">Etape 2:</span></b><br>
                        Une demande automatique de la clé sera effectuée,<br>
                        si la demande automatique echoue vous serez invité<br>
                        à obtenir et à saisir la clé APIKEY de DeCONZ manuellement.<br>
                        <br><b><span style="text-decoration: underline;">Etape 3:</span></b><br>
                        Verification et validation des informations avant la sauvegarde<br>
                        des règlages.<br>
                    </div>
                    <input type="button" class="next-form btn btn-info" value="Commencer" />
                </fieldset>
                <fieldset>
                    <h2>Etape 1: Recherche des contrôleurs DeCONZ</h2>
                    <table class="table" id="deconzListTable">
                        <tr>
                            <th>Action</th>
                            <th>Id</th>
                            <th>Nom</th>
                            <th>Ip</th>
                            <th>Port</th>
                            <th>Mac</th>
                        </tr>
                        <tbody>
                        </tbody>
                    </table>
                    <input type="button" name="previous" class="previous-form btn btn-default" value="Précedent" />            
                    <input type="button" class="next-form btn btn-info" value="suivant" />
                </fieldset>
                <fieldset>
                    <h2> Etape 2: Obtenir une clé d'accès</h2>
                    <div class="form-group">
                        <label for="key">Clé API</label>
                        <input type="text" class="form-control" name="key" id="key" placeholder="Clé API">
                    </div>
                    <input type="button" name="previous" class="previous-form btn btn-default" value="Précedent" />
                    <input type="button" name="next" class="next-form btn btn-info" value="suivant" />
                </fieldset>
                <fieldset>
                    <h2>Etape 3: Validation des informations</h2>

                    <table class="table">
                        <tr><td class="col-sm-2"><span class="label control-label" style="font-size : 1em;">Adresse IP de DeCONZ</span></td><td><span class="label label-default" style="font-size : 1em;">value</span></tr>
                        <tr><td class="col-sm-2"><span class="label control-label" style="font-size : 1em;">Port DeCONZ</span></td><td><span class="label label-default" style="font-size : 1em;">value</span></tr>
                        <tr><td class="col-sm-2"><span class="label control-label" style="font-size : 1em;">Clé API de DeCONZ</span></td><td><span class="label label-default" style="font-size : 1em;">value</span></tr>
                    </table>

                    <input type="button" name="previous" class="previous-form btn btn-default" value="Précedent" />
                    <input type="submit" name="next" class="submit btn btn-success" value="Verifier les informations" />
                </fieldset>
            </form>
        </td>
        <td>
            <b><span style="text-decoration: underline;">Etape 1:</span></b><br>
            Une recherche automatique de DeCONZ sera effectuée,<br>
            si la recherche automatique echoue vous serez invité<br>
            à saisir l'ip et le port de DeCONZ manuellement.
        </td>
    </table>
</div>

<?php include_file('core', 'deconzCall', 'js', 'deconz'); ?>
<?php include_file('core', 'jeedomHelper', 'js', 'deconz'); ?>
<?php include_file('plugin_info', 'guiHelper', 'js', 'deconz'); ?>
<?php include_file('plugin_info', 'configurationHelper', 'js', 'deconz'); ?>

<style type="text/css">
    #register_form fieldset:not(:first-of-type) {
        display: none;
    }

</style>


