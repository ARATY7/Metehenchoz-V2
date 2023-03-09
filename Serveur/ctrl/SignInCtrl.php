<?php

require_once(PATH . "/wrk/DBReader.php");

class SignInCtrl
{

    private DBReader $dbR;

    public function __construct()
    {
        $this->dbR = new DBReader();
    }

    /**
     * Permet de remplir la session avec les infos de l'utilisateur qui se connecte.
     *
     * @param array $vars Tableau contenant les infos de l'utilisateur
     * @return void
     */
    public function fillSession(array $vars): void
    {
        if (isset($vars['mail']) && isset($vars['password'])) {
            $_SESSION['mail'] = htmlspecialchars($vars['mail']);
            $_SESSION['password'] = $vars['password'];
            $_SESSION['isConnected'] = false;
            $vars['mail'] == 'admin@metehenchoz.ch' ? $_SESSION['isAdmin'] = true : $_SESSION['isAdmin'] = false;
        }
    }

    /**
     * Permet de contrôler si l'adresse mail fournie existe déjà dans la base de données. Contrôle ensuite le mot de
     * passe s'il est bon.
     *
     * @param string $mail L'adresse mail à contrôler
     * @return void
     */
    public function checkIfMailExists(string $mail): void
    {
        if (!$this->dbR->checkIfMailExists($mail)) {
            echo json_encode(array('accountExists' => false));
        } else {
            if (!$this->checkPassword($mail, $_SESSION['password'])) {
                echo json_encode(array('loginOk' => false));
            } else {
                $_SESSION['isConnected'] = true;
                if ($_SESSION['isAdmin']) {
                    echo json_encode(array('loginAdmin' => true));
                } else {
                    echo json_encode(array('loginOk' => true));
                }
            }
        }
    }

    /**
     * Permet de contrôler le mot de passe. On récupère tout d'abord le password haché qui est lié au mail fourni et on
     * le contrôle avec le mot de passe fourni.
     *
     * @param string $mail Le mail du compte auquel contrôler le mot passe
     * @param string $password Le mot de passe entré par l'utilisateur
     * @return bool Vrai si c'est le bon mot de passe, sinon faux
     */
    public function checkPassword(string $mail, string $password): bool
    {
        $ok = false;
        if (password_verify($password, $this->dbR->getPasswordFromMail($mail)['password'])) {
            $ok = true;
        }
        return $ok;
    }

}