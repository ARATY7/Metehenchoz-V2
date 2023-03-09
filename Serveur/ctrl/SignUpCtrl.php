<?php

require_once(PATH . "/wrk/DBReader.php");
require_once(PATH . "/wrk/DBWriter.php");
require_once(PATH . "/wrk/MailManager.php");

class SignUpCtrl
{

    private DBReader $dbR;
    private DBWriter $dbW;
    private MailManager $mailMan;

    public function __construct()
    {
        $this->dbR = new DBReader();
        $this->dbW = new DBWriter();
        $this->mailMan = new MailManager();
    }

    /**
     * Permet de remplir la session avec les infos de l'utilisateur qui s'inscrit.
     *
     * @param array $vars Tableau contenant les infos de l'utilisateur
     * @return void
     */
    public function fillSession(array $vars): void
    {
        if (isset($vars['name']) && isset($vars['firstName']) && isset($vars['mail']) && isset($vars['password'])) {
            $_SESSION['name'] = htmlspecialchars($vars['name']);
            $_SESSION['firstName'] = htmlspecialchars($vars['firstName']);
            $_SESSION['mail'] = htmlspecialchars($vars['mail']);
            $_SESSION['password'] = $vars['password'];
            $_SESSION['isConnected'] = false;
            $_SESSION['code'] = rand(100000, 999999);
        } else {
            http_response_code(503);
        }
    }

    /**
     * Contrôle le code de vérification de création de compte. Si le code est bon, on crée l'utilisateur.
     *
     * @param array $vars Tableau contenant le code de vérification entré par l'utilisateur
     * @return void
     */
    public function checkCode(array $vars): void
    {
        if (isset($vars['code']) && ($vars['code'] == $_SESSION['code'])) {
            if ($this->createNewUser()) {
                echo json_encode(array('accountSuccessfullyCreated' => true));
            } else {
                echo json_encode(array('accountSuccessfullyCreated' => false));
            }
        } else {
            echo json_encode(array('accountSuccessfullyCreated' => false));
        }
    }

    /**
     * Permet d'inscrire un utilisateur.
     *
     * @return bool Vrai si l'utilisateur a bien été créé, sinon faux
     */
    public function createNewUser(): bool
    {
        return $this->dbW->signUp($_SESSION['name'], $_SESSION['firstName'], $_SESSION['mail'], $_SESSION['password']);
    }

    /**
     * Permet d'envoyer à un mail passé en paramètre un nouveau mot de passe pour son compte en cas d'oubli. On
     * contrôle tout d'abord que le mail est bien associé à un compte utilisateur, puis on génère un nouveau mot de
     * passe, on met à jour le nouveau mot de passe dans la base de données et on l'envoie par mail à l'utilisateur.
     *
     * @param string $mail Le mail sur lequel envoyer le nouveau mot passe
     * @return void
     */
    public function sendNewPassword(string $mail): void
    {
        if ($this->dbR->checkIfMailExists($mail)) {
            $newPassword = $this->generatePassword(8);
            if ($this->dbW->updatePassword($mail, $newPassword)) {
                if ($this->mailMan->sendNewPassword($mail, $newPassword)) {
                    $_SESSION['password'] = $newPassword;
                    echo json_encode(array('accountExists' => true));
                }
            }
        } else {
            echo json_encode(array('accountExists' => false));
        }
    }

    /**
     * Permet de contrôler si un certain mail existe dans la base de données. S'il n'existe pas, on envoie un mail avec
     * le code.
     *
     * @param string $mail Le mail à contrôler
     * @return void
     */
    public function checkIfMailExists(string $mail): void
    {
        if ($this->dbR->checkIfMailExists($mail)) {
            echo json_encode(array('accountAlreadyExists' => true));
        } else {
            if ($this->sendCodeByMail($_SESSION['mail'], $_SESSION['code'])) {
                echo json_encode(array('accountAlreadyExists' => false));
            }
        }
    }

    /**
     * Permet d'envoyer un code au mail fourni.
     *
     * @param string $mail Le mail fourni
     * @param int $code Le code de vérification
     * @return bool Vrai si le mail a bien été envoyé, sinon faux
     */
    public function sendCodeByMail(string $mail, int $code): bool
    {
        return $this->mailMan->sendCodeByMail($mail, $code);
    }

    /**
     * Permet de générer un nouveau mot de passe qui respecte ces conditions : une minuscule minimum, une majuscule
     * minimum, un chiffre minimum, un caractère spécial et une longueur donnée en paramètre.
     *
     * @param int $length Une longueur de mot passe
     * @return string Le nouveau mot de passe généré
     */
    public function generatePassword(int $length): string
    {
        $uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $lowercase = 'abcdefghijklmnopqrstuvwxyz';
        $numbers = '0123456789';
        $specialChars = '!@#$%^&*()_-=+;:,.?';
        $chars = $uppercase . $lowercase . $numbers . $specialChars;
        $password = $lowercase[rand(0, strlen($lowercase) - 1)];
        $password .= $uppercase[rand(0, strlen($uppercase) - 1)];
        $password .= $specialChars[rand(0, strlen($specialChars) - 1)];
        $password .= $numbers[rand(0, strlen($numbers) - 1)];
        $password_length = $length - 4;
        for ($i = 0; $i < $password_length; $i++) {
            $password .= $chars[rand(0, strlen($chars) - 1)];
        }
        return str_shuffle($password);
    }

}