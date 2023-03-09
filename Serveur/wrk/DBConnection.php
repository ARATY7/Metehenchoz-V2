<?php

require_once(PATH . "/const/dbConsts.php");

class DBConnection
{

    private PDO $pdo;

    /**
     * Constructeur de la classe. Etabli la connexion à la base de données.
     */
    public function __construct()
    {
        try {
            $this->pdo = new PDO('mysql:host=' . DB_HOST . ';port=' . DB_PORT . ';dbname=' . DB_NAME, DB_USER, DB_PASS, array(PDO::MYSQL_ATTR_INIT_COMMAND => 'SET NAMES utf8'));
        } catch (PDOException $ex) {
            echo json_encode(array('PDO Error' => $ex->getMessage()));
            die();
        }
    }

    /**
     * Permet d'exécuter une requête SQL préparée.
     *
     * @param string $query La requête SQL à exécuter
     * @param array $params Les paramètres à utiliser
     * @return bool Vrai si la requête a bien été exécutée, sinon faux
     */
    public function executeQuery(string $query, array $params): bool
    {
        $queryPrepared = $this->pdo->prepare($query);
        return $queryPrepared->execute($params);
    }

    /**
     * Permet de rechercher une seule entrée via une requête SQL préparée.
     *
     * @param string $query La requête SQL à exécuter
     * @param array $params Les paramètres à utiliser
     * @return array Tableau contenant l'entrée trouvée dans la base de données
     */
    public function selectSingleQuery($query, $params): array
    {
        $queryPrepared = $this->pdo->prepare($query);
        $queryPrepared->execute($params);
        return $queryPrepared->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Permet de rechercher des entrées via une requête SQL préparée.
     *
     * @param string $query La requête SQL à exécuter
     * @param array $params Les paramètres à utiliser
     * @return array Tableau contenant les entrées trouvée dans la base de données
     */
    public function selectQuery(string $query, array $params): array
    {
        $queryPrepared = $this->pdo->prepare($query);
        $queryPrepared->execute($params);
        return $queryPrepared->fetchAll(PDO::FETCH_ASSOC);
    }

    /**
     * Permet de rechercher si un mail existe dans la base de données.
     *
     * @param string $query La requête SQL à exécuter
     * @param array $params Les paramètres à utiliser
     * @return bool Vrai si le mail a été trouvé, sinon faux
     */
    public function checkIfExists(string $query, array $params): bool
    {
        $queryPrepared = $this->pdo->prepare($query);
        $queryPrepared->execute($params);
        $count = $queryPrepared->fetchColumn();
        return ($count > 0);
    }

    /**
     * Permet de supprimer un utilisateur via son adresse mail. Utilise la transaction pour d'abord supprimer ses
     * favoris dans la table de relation et supprime ensuite l'utilisateur si la requête précédante s'est bien effectuée.
     *
     * @param string $mail L'adresse mail de l'utilisateur à supprimer
     * @return bool Vrai si l'utilisateur a été supprimé', sinon faux
     */
    public function deleteUser(string $mail): bool
    {
        $ok = false;
        try {
            $this->pdo->beginTransaction();

            $stmt1 = $this->pdo->prepare('DELETE FROM tr_user_station WHERE pfk_user = (SELECT pk_user FROM t_user WHERE mail = :mail)');
            $stmt1->bindParam(':mail', $mail);
            $stmt1->execute();

            $stmt2 = $this->pdo->prepare("DELETE FROM t_user WHERE mail = :mail");
            $stmt2->bindParam(':mail', $mail);
            $stmt2->execute();

            $ok = $this->pdo->commit();
        } catch (PDOException $ex) {
            $this->pdo->rollback();
        }
        return $ok;
    }

}