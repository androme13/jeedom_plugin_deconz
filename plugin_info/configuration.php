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

<div id="deconz_config_tab" class="tab">
</div>

<div id="localinstall" class="tabcontent">

</div>

<div id="detectandconfig" class="tabcontent">
    <div id='div_configurationAlert' style="display: none;"></div>
    <div class="container">
        <center><h2>Aide à la configuration de DeCONZ</h2></center>
        <div class="progress">
            <div class="progress-bar progress-bar-striped active" role="progressbar" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
        <div class="alert alert-success hide"></div>
        <table class="table">
            <td class="col-sm-11">
                <form id="ctrl_form" onkeyup="formKey()">
                    <fieldset>
                        <h2>Configuration: 3 étapes pour configurer le plugin</h2>
                        <div class="form-group">
                            <br><b><span style="text-decoration: underline;">Etape 1:</span></b><br>
                            Recherche et ajout manuel des contrôleurs DeCONZ.<br>
                            <br><b><span style="text-decoration: underline;">Etape 2:</span></b><br>
                            Configuration des clés API des contrôleurs.<br>
                            <br><b><span style="text-decoration: underline;">Etape 3:</span></b><br>
                            Verification et validation des informations avant la sauvegarde<br>
                            des règlages.<br>
                        </div>
                        <a class="next-form btn btn-info fa fa-play"> Commencer</a>
                    </fieldset>
                    <fieldset>
                        <h2>Etape 1: Recherche et ajout manuel des contrôleurs DeCONZ.</h2>
                        <table class="table" id="deconzListTable">
                            <tr><div id="div_ctrlSearchConfigurationAlert" style="display: none;"></div></tr>
                            <tr>
                                <th>Action</th>
                                <th>Type</th>
                                <th>Id</th>
                                <th>Nom</th>
                                <th>Ip</th>
                                <th>Port</th>
                                <th>Mac</th>
                            </tr>
                            <tbody>
                            </tbody>
                        </table>
                        <table padding="0px 0px 0px 0px" style="width:100%;">
                            <tr valign="top">
                                <td>
                                    <div align="left" id="cancelreason"></div>
                                </td>
                                <td>
                                    <div align="right"><a class="add_manual_ctrl_but btn btn-default fa fa-plus-circle" style="color:green;"><font color="white">  Ajout manuel</font></a></div>
                                </td>
                            </tr>
                        </table>
                        <a name="previous" id="" class="previous-form btn btn-default fa fa-step-backward"> Précédent</a>
                        <a name="next" id="next-form" class="next-form btn btn-default fa fa-step-forward"> Suivant</a>
                    </fieldset>
                    <fieldset>
                        <h2> Etape 2: Obtenir une clé d'accès.</h2>
                        <table class="table" id="apiKeyTable">
                            <tr><div id="div_apikeySearchConfigurationAlert" style="display: none;"></div></tr>
                            <tr>
                                <th>Action</th>
                                <th>Status</th>
                                <th>Id</th>
                                <th>Nom</th>
                                <th>Ip</th>
                                <th>Mac</th>
                                <th>Api Key</th>
                            </tr>
                            <tbody>
                            </tbody>
                        </table>
                        <table padding="0px 0px 0px 0px" style="width:100%;">
                            <tr valign="top">
                                <td>
                                    <div align="left" id="apicancelreason"></div>
                                </td>
                            </tr>
                        </table>
                        <br>
                        <a name="previous" class="previous-form btn btn-default fa fa-step-backward"> Précédent</a>
                        <a name="next" class="next-form btn btn-default fa fa-step-forward"> Suivant</a>
                    </fieldset>
                    <fieldset>
                        <h2>Etape 3: Validation des informations.</h2>
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
                <div id="stepHelp" style="width:200px;">
                </div>
            </td>
        </table>
    </div>
</div>
<?php include_file('3rparty', 'jquery.validate.min', 'js', 'deconz'); ?>
<?php include_file('core', 'deconzCall', 'js', 'deconz'); ?>
<?php include_file('core', 'jeedomHelper', 'js', 'deconz'); ?>
<?php include_file('plugin_info', 'guiHelper', 'js', 'deconz'); ?>
<?php include_file('plugin_info', 'configurationHelper', 'js', 'deconz'); ?>
<style type="text/css">
    #ctrl_form fieldset:not(:first-of-type) {
        display: none;
    }
    .disabled {
        pointer-events: none;
        cursor: not-allowed;
        opacity: 0.6;
    }
    .error {
        box-shadow: 0 0 5px 1px red;
    }

    .valid {
        box-shadow: 0 0 5px 1px greenyellow;
    }


    .tab {
        overflow: hidden;
        border: 0px solid #ccc;
    }


    .tab button {
        background-color: rgba(96,197,225,.35);
        padding: 6px 12px;
        float: left;
        border: none;
        color: white;
        outline: none;
        cursor: pointer;
        margin : 10px;
        transition: 0.3s;
    }

    .tab:nth-child(1) { margin-left: 30%; }


    .tab button:hover {
        background-color: rgba(64,163,192,.3);
    }


    .tab button.active {
        background-color: green;
    }


    .tabcontent {
        display: none;
        padding: 6px 12px;
        border: 0px solid #ccc;
        border-top: none;
        animation: fadeEffect 1s; /* Fading effect takes 1 second */



    } 
    /* Go from zero to full opacity */
    @keyframes fadeEffect {
        from {opacity: 0;}
        to {opacity: 1;}
    }

    .my-error-class {
        color:#FF0000;  /* red */
    }
    .my-valid-class {
        color:#00CC00; /* green */
    }
</style>


