<?php

require_once(PATH . "/wrk/DBConnection.php");

class DBWriter
{

    private DBConnection $db;

    public function __construct()
    {
        $this->db = new DBConnection();
    }

    /**
     * Demande à la base de données d'inscrire un utilisateur. Hache tout d'abord le mot de passe.
     *
     * @param string $name Le nom de l'utilisateur
     * @param string $firstName Le prénom de l'utilisateur
     * @param string $mail L'adresse mail de l'utilisateur
     * @param string $password Le mot de passe de l'utilisateur
     * @return bool Vrai si l'utilisateur a bien été inscrit, sinon faux
     */
    public function signUp(string $name, string $firstName, string $mail, string $password): bool
    {
        $password = password_hash($password, PASSWORD_DEFAULT);
        $param = compact('name', 'firstName', 'mail', 'password');
        return $this->db->executeQuery("INSERT into t_user (name, firstName, mail, password) VALUES (:name, :firstName, :mail, :password);", $param);
    }

    /**
     * Demande à la base de données d'ajouter une station météo.
     *
     * @param string $name Le nom de la station
     * @return bool Vrai si la station a bien été insérée, sinon faux
     */
    public function addStationToDB(string $name): bool
    {
        $param = compact('name');
        return $this->db->executeQuery("INSERT into t_station (name) VALUES (:name);", $param);
    }

    /**
     * Demande à la base de données d'ajouter une station météo à un utilisateur.
     *
     * @param string $name Le nom de la station
     * @return bool Vrai si la station a bien été liée à l'utilisateur, sinon faux
     */
    public function addStationToFavorites(string $mail, string $name): bool
    {
        $param = compact('name', 'mail');
        return $this->db->executeQuery("INSERT INTO tr_user_station (pfk_user, pfk_station) SELECT t_user.pk_user, t_station.pk_station FROM t_user INNER JOIN t_station ON t_station.name = :name WHERE t_user.mail = :mail;", $param);
    }

    /**
     * Demande à la base de données de supprimer une station météo d'un utilisateur.
     *
     * @param string $mail L'adresse mail de l'utilisateur auquel supprimer une station favorite
     * @param string $name Le nom de la station
     * @return bool Vrai si la station a bien été supprimée, sinon faux
     */
    public function removeStationToFavorites($mail, string $name): bool
    {
        $param = compact('name', 'mail');
        return $this->db->executeQuery("DELETE FROM tr_user_station WHERE pfk_user = (SELECT pk_user FROM t_user WHERE mail = :mail) AND pfk_station = (SELECT pk_station FROM t_station WHERE name = :name);", $param);
    }

    /**
     * Demande à la base de données de mettre à jour le mot de passe de l'utilisateur associé au mail fourni. Hache tout
     * d'abord le mot de passe.
     *
     * @param string $mail L'adresse mail de l'utilisateur duquel modifier le mot de passe
     * @param string $newPassword Le nouveau mot de passe
     * @return bool Vrai si le mot de passe a bien été modifié, sinon faux
     */
    public function updatePassword(string $mail, string $newPassword): bool
    {
        $newPassword = password_hash($newPassword, PASSWORD_DEFAULT);
        $param = compact('mail', 'newPassword');
        return $this->db->executeQuery("UPDATE t_user SET password = :newPassword WHERE mail = :mail", $param);
    }

    /**
     * Demande à la base de données de modifier un utilisateur.
     *
     * @param string $name Le nom de l'utilisateur
     * @param string $firstName Le prénom de l'utilisateur
     * @param string $mail L'adresse mail de l'utilisateur
     * @return bool Vrai si l'utilisateur a bien été modifié, sinon faux
     */
    public function updateUser(string $name, string $firstName, string $mail): bool
    {
        $param = compact('name', 'firstName', 'mail');
        return $this->db->executeQuery("UPDATE t_user SET name = :name, firstName = :firstName WHERE mail = :mail;", $param);
    }

    /**
     * Demande à la base de données de supprimer un utilisateur.
     *
     * @param string $mail L'adresse mail de l'utilisateur à supprimer
     * @return bool Vrai si l'utilisateur a bien été supprimée, sinon faux
     */
    public function deleteUser(string $mail): bool
    {
        return $this->db->deleteUser($mail);
    }

}