<?php

/*
  But     : Script principal
  Auteur  : Noé Henchoz
  Date    : 31.01.2023 / v1.0
*/

// Variable racine de mon projet serveur. A permis de régler des problèmes d'hébergement.
const PATH = __DIR__;

require_once(PATH . '/conf/headers.php');
require_once(PATH . '/conf/cookies.php');

session_start();

require_once(PATH . '/ctrl/SignUpCtrl.php');
require_once(PATH . '/ctrl/SignInCtrl.php');
require_once(PATH . '/ctrl/FavStationsCtrl.php');
require_once(PATH . '/ctrl/UserCtrl.php');
require_once(PATH . '/ctrl/AdminCtrl.php');

// Switch case sur les méthodes HTTP autorisées
if (isset($_SERVER['REQUEST_METHOD'])) {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            if ($_GET['action'] == 'checkIfConnected') {
                (new FavStationsCtrl())->checkIfConnected();
            } else if ($_GET['action'] == 'getFavStations' && isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
                (new FavStationsCtrl())->getFavStations($_SESSION['mail']);
            } else if ($_GET['action'] == 'getUserInfos' && isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
                (new UserCtrl())->getUserInfos($_SESSION['mail']);
            } else if ($_GET['action'] == 'logout' && isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
                (new UserCtrl())->logout();
            } else if ($_GET['action'] == 'checkIfStationAlreadyFav' && isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
                (new FavStationsCtrl())->checkIfStationAlreadyFav($_GET['name']);
            } else if ($_GET['action'] == 'getAllUserAccounts' && isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($_SESSION['isAdmin']) && $_SESSION['isAdmin']) {
                (new AdminCtrl())->getAllUserAccounts();
            } else if ($_GET['action'] == 'checkIfAdmin' && isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
                (new FavStationsCtrl())->checkIfAdmin();
            }
            break;
        case 'POST':
            parse_str(file_get_contents('php://input'), $vars);
            switch ($vars['action']) {
                case 'sendCodeByMail':
                    $signUpCtrl = new SignUpCtrl();
                    $signUpCtrl->fillSession($vars);
                    $signUpCtrl->checkIfMailExists($_SESSION['mail']);
                    break;
                case 'checkCode':
                    $signUpCtrl = new SignUpCtrl();
                    $signUpCtrl->checkCode($vars);
                    break;
                case 'signIn':
                    $signInCtrl = new SignInCtrl();
                    $signInCtrl->fillSession($vars);
                    $signInCtrl->checkIfMailExists($_SESSION['mail']);
                    break;
                case 'addStationToFavorites':
                    (new FavStationsCtrl())->addStationToFavorites($vars);
                    break;
                case 'sendNewPasswordByMail':
                    (new SignUpCtrl())->sendNewPassword($vars['mail']);
                    break;
                default:
                    http_response_code(500);
                    break;
            }
            break;
        case 'PUT':
            parse_str(file_get_contents('php://input'), $vars);
            switch ($vars['action']) {
                case 'updatePassword':
                    (new UserCtrl())->updatePassword($vars);
                    break;
                case 'updateUser':
                    (new UserCtrl())->updateUser($vars);
                    break;
                default:
                    http_response_code(500);
                    break;
            }
            break;
        case 'DELETE':
            parse_str(file_get_contents('php://input'), $vars);
            switch ($vars['action']) {
                case 'removeStationToFavorites':
                    (new FavStationsCtrl())->removeStationToFavorites($vars);
                    break;
                case 'deleteUser':
                    (new UserCtrl())->deleteUser($vars);
                    break;
                default:
                    http_response_code(500);
                    break;
            }
            break;
        case 'OPTIONS':
            break;
        default:
            http_response_code(500);
            break;
    }
} else {
    http_response_code(500);
}