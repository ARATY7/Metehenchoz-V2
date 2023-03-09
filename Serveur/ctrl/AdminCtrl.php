<?php

/*
  But     : Ctrl pour l'admin
  Auteur  : Noé Henchoz
  Date    : 27.02.2023 / v1.0
*/

require_once(PATH . "/wrk/DBReader.php");
require_once(PATH . "/wrk/DBWriter.php");

class AdminCtrl
{

    private DBReader $dbR;

    public function __construct()
    {
        $this->dbR = new DBReader();
    }

    /**
     * Permet de récupérer la liste de tous les utilisateurs et de les envoyer au client en JSON.
     *
     * @return void
     */
    public function getAllUserAccounts(): void
    {
        echo json_encode($this->dbR->getAllUserAccounts());
    }
}
