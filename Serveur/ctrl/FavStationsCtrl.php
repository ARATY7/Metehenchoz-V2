<?php

/*
  But     : Ctrl pour les stations favorites
  Auteur  : Noé Henchoz
  Date    : 07.02.2023 / v1.0
*/

require_once(PATH . "/wrk/DBReader.php");
require_once(PATH . "/wrk/DBWriter.php");

class FavStationsCtrl
{

    private DBReader $dbR;
    private DBWriter $dbW;

    public function __construct()
    {
        $this->dbR = new DBReader();
        $this->dbW = new DBWriter();
    }

    /**
     * Permet de vérifier dans la session si l'utilisateur est connecté et d'envoyer la réponse au client en JSON.
     *
     * @return void
     */
    public function checkIfConnected(): void
    {
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected']) {
            echo json_encode(array('isConnected' => true));
        } else {
            echo json_encode(array('isConnected' => false));
        }
    }

    /**
     * Permet de vérifier dans la session si l'utilisateur est admin et d'envoyer la réponse au client en JSON.
     *
     * @return void
     */
    public function checkIfAdmin(): void
    {
        if (isset($_SESSION['isAdmin']) && $_SESSION['isAdmin']) {
            echo json_encode(array('isAdmin' => true));
        } else {
            echo json_encode(array('isAdmin' => false));
        }
    }

    /**
     * Permet d'ajouter une station au favoris. Contrôle tout d'abord que l'utilisateur soit connecté, contrôle si la
     * station n'existe pas puis l'ajoute. Contrôle si la station n'est pas déjà liée à cet utilisateur puis l'ajoute et
     * envoie la réponse au client en JSON.
     *
     * @param array $vars Les variables reçues dans la requêtes HTTP
     * @return void
     */
    public function addStationToFavorites(array $vars): void
    {
        $station = htmlspecialchars($vars['name']);
        $regex = "/^[\p{L}\p{Mn}'`\s-]{1,64}$/u";
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($vars['name']) && preg_match($regex, $station)) {
            if (!$this->dbR->checkIfStationExists($station)) {
                $this->dbW->addStationToDB($station);
            }
            if (!$this->dbR->checkIfStationAlreadyFav($_SESSION['mail'], $station)) {
                if ($this->dbW->addStationToFavorites($_SESSION['mail'], $station)) {
                    echo json_encode(array('isStationAddedToUser' => true));
                }
            } else {
                echo json_encode(array('stationAlreadyFav' => true));
            }
        } else {
            http_response_code(500);
        }
    }

    /**
     * Permet de contrôler si une station est déjà en favoris pour l'utilisateur dans la base de données.
     *
     * @param string $name Le nom de la station à rechercher
     * @return void
     */
    public function checkIfStationAlreadyFav(string $name): void
    {
        $found = false;
        for ($i = 0; $i < sizeof($this->dbR->getFavStations($_SESSION['mail'])); $i++) {
            if ($this->dbR->getFavStations($_SESSION['mail'])[$i]['name'] == $name) {
                $found = true;
            }
        }
        if ($found) {
            echo json_encode(array('isAlreadyFav' => true));
        }
    }

    /**
     * Permet de récupérer la liste des stations favorites de l'utilisateur et de l'envoyer au client.
     *
     * @param string $mail Le mail de l'utilisateur
     * @return void
     */
    public function getFavStations(string $mail): void
    {
        echo json_encode($this->dbR->getFavStations($mail));
    }

    /**
     * Permet de supprimer une station des favoris pour l'utilisateur.
     *
     * @param array $vars Tableau contenant le nom de la station à supprimer
     * @return void
     */
    public function removeStationToFavorites(array $vars): void
    {
        if (isset($_SESSION['isConnected']) && $_SESSION['isConnected'] && isset($vars['name'])) {
            if ($this->dbW->removeStationToFavorites($_SESSION['mail'], $vars['name'])) {
                echo json_encode(array('successfullyRemoved' => true));
            }
        }
    }

}