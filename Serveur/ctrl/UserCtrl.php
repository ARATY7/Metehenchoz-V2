<?php

require_once(PATH . "/wrk/DBReader.php");
require_once(PATH . "/wrk/DBWriter.php");

class UserCtrl
{

    private DBReader $dbR;
    private DBWriter $dbW;

    public function __construct()
    {
        $this->dbR = new DBReader();
        $this->dbW = new DBWriter();
    }

    /**
     * Permet de récupérer les infos de l'utilisateur associé au mail fourni.
     *
     * @param string $mail Le mail du compte auquel extraire les infos
     * @return void
     */
    public function getUserInfos(string $mail): void
    {
        echo json_encode($this->dbR->getUserInfos($mail));
    }

    /**
     * Permet de détruire la session en cours.
     *
     * @return void
     */
    public function logout(): void
    {
        session_destroy();
        echo json_encode(array('successfullyLogout' => true));
    }

    /**
     * Permet de mettre à jour le mot de passe de l'utilisateur connecté. On vérifie d'abord qu'il est connecté et
     * qu'il a fourni son mot de passe et un nouveau mot de passe.
     *
     * @param array $vars Tableau contenant le mot de passe courant et le nouveau mot de passe
     * @return void
     */
    public function updatePassword(array $vars): void
    {
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($vars['currentPassword']) && isset($vars['newPassword'])) {
            if (password_verify($vars['currentPassword'], $this->dbR->getPassword($_SESSION['mail'])['password'])) {
                if ($this->dbW->updatePassword($_SESSION['mail'], $vars['newPassword'])) {
                    $_SESSION['password'] = $vars['newPassword'];
                    echo json_encode(array('passwordUpdated' => true));
                } else {
                    echo json_encode(array('passwordUpdated' => false));
                }
            } else {
                echo json_encode(array('passwordMatch' => false));
            }
        }
    }

    /**
     * Permet de mettre à jour un utilisateur. On contrôle tout d'abord que l'utilisateur est connecté et qu'il est
     * administrateur. Ensuite, on met à jour l'utilisateur avec les nouvelles infos fournies.
     *
     * @param array $vars Tableau contenant
     * @return void
     */
    public function updateUser(array $vars): void
    {
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($_SESSION['isAdmin']) && $_SESSION['isAdmin']) {
            if ($this->dbW->updateUser($vars['name'], $vars['firstName'], $vars['mail'])) {
                echo json_encode(array('userUpdated' => true));
            } else {
                echo json_encode(array('userUpdated' => false));
            }
        } else {
            echo json_encode(array('userUpdated' => false));
        }
    }

    /**
     * Permet de supprimer un utilisateur. On contrôle tout d'abord que l'utilisateur est connecté et qu'il est
     * administrateur. Ensuite, on supprime l'utilisateur associé au mail fourni.
     *
     * @param array $vars Tableau contenant
     * @return void
     */
    public function deleteUser(array $vars): void
    {
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($_SESSION['isAdmin']) && $_SESSION['isAdmin']) {
            if ($this->dbW->deleteUser($vars['mail'])) {
                echo json_encode(array('userDeleted' => true));
            } else {
                echo json_encode(array('userDeleted' => false));
            }
        } else {
            echo json_encode(array('userDeleted' => false));
        }
    }

}