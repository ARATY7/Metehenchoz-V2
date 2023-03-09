<?php

require_once(PATH . "/wrk/DBConnection.php");

class DBReader
{

    private DBConnection $db;

    public function __construct()
    {
        $this->db = new DBConnection();
    }

    /**
     * Permet de contrôler si le mail se trouve dans la base de données.
     *
     * @param string $mail Le mail à rechercher
     * @return bool Vrai si le mail est trouvé, sinon false
     */
    public function checkIfMailExists(string $mail): bool
    {
        $params = compact('mail');
        return $this->db->checkIfExists("SELECT COUNT(*) FROM t_user WHERE mail = :mail;", $params);
    }

    /**
     * Permet de récupérer le mot de passe haché d'un utilisateur via son adresse mail.
     *
     * @param string $mail Le mail utilisé pour retrouver le mot de passe
     * @return array Tableau contenant le mot de passe
     */
    public function getPasswordFromMail(string $mail): array
    {
        $params = compact('mail');
        return $this->db->selectSingleQuery("SELECT password FROM t_user WHERE mail = :mail;", $params);
    }

    /**
     * Permet de récupérer toutes les stations favorites d'un utilisateur trouvé via son mail.
     *
     * @param string $mail L'adresse mail du compte auquel extraire toutes ses stations favorites
     * @return array Tableau contenant toutes les stations favorites
     */
    public function getFavStations(string $mail): array
    {
        $params = compact('mail');
        return $this->db->selectQuery("SELECT t_station.name FROM t_station JOIN tr_user_station ON t_station.pk_station = tr_user_station.pfk_station JOIN t_user ON tr_user_station.pfk_user = t_user.pk_user WHERE t_user.mail = :mail;", $params);
    }

    /**
     * Permet de récupérer les infos d'un utilisateur via son mail.
     *
     * @param string $mail L'adresse mail du compte auquel extraire les infos
     * @return array Tableau contenant les informations de l'utilisateur
     */
    public function getUserInfos(string $mail): array
    {
        $params = compact('mail');
        return $this->db->selectSingleQuery("SELECT name, firstName, mail FROM t_user WHERE mail = :mail;", $params);
    }

    /**
     * Permet de vérifier si une station est déjà dans la base de données.
     *
     * @param string $name Le nom de la station
     * @return bool Vrai si elle est déjà, sinon faux
     */
    public function checkIfStationExists(string $name): bool
    {
        $params = compact('name');
        return $this->db->checkIfExists("SELECT COUNT(*) FROM t_station WHERE name = :name;", $params);
    }

    /**
     * Permet de vérifier si une station est déjà dans les favoris d'un utilisateur trouvé via son mail.
     *
     * @param string $mail Le mail de l'utilisateur
     * @param string $name Le nom de la station à rechercher
     * @return bool Vrai si elle est déjà, sinon faux
     */
    public function checkIfStationAlreadyFav(string $mail, string $name): bool
    {
        $params = compact('name', 'mail');
        return $this->db->checkIfExists("SELECT COUNT(*) FROM tr_user_station INNER JOIN t_user ON tr_user_station.pfk_user = t_user.pk_user INNER JOIN t_station ON tr_user_station.pfk_station = t_station.pk_station WHERE t_user.mail = :mail AND t_station.name = :name", $params);
    }

    /**
     * Permet de récupérer le mot de passe d'un utilisateur trouvé via son adresse mail.
     *
     * @param string $mail Le mail de l'utilisateur
     * @return array Tableau contenant le mot de passe de l'utilisateur
     */
    public function getPassword(string $mail): array
    {
        $params = compact('mail');
        return $this->db->selectSingleQuery("SELECT password FROM t_user WHERE mail = :mail", $params);
    }

    /**
     * Permet de récupérer les infos de tous les comptes de la base de données.
     *
     * @return array Tableau contenant tous les comptes de la base de données.
     */
    public function getAllUserAccounts(): array
    {
        return $this->db->selectQuery("SELECT name, firstName, mail FROM t_user ORDER BY name ASC;", []);
    }

}