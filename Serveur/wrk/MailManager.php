<?php

class MailManager
{

    public function __construct()
    {
    }

    /**
     * Permet d'envoyer un mail contenant un code de vérification au mail fourni.
     *
     * @param string $mail L'adresse mail du destinataire
     * @param int $code Le code aléatoire généré
     * @return bool Vrai si le mail a bien été envoyé, sinon faux
     */
    public function sendCodeByMail(string $mail, int $code): bool
    {
        $ok = false;
        $subject = "Météhenchoz - Code : " . $code;
        $message = "
            <html lang='en'>
                <head>
                    <title>Verification code</title>
                </head>
                <body>
                    <p>To complete the creation of your account, use this code :</p>
                    <h2>" . $code . "</h2>
                </body>
            </html>
        ";
        $headers = "From: no-reply@metehenchoz.ch\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=utf-8\r\n";
        $headers .= "X-Priority: 1 (Highest)\n";
        $headers .= "X-MSMail-Priority: High\n";
        $headers .= "Importance: High\n";
        if (mail($mail, $subject, $message, $headers)) {
            $ok = true;
        }
        return $ok;
    }

    /**
     * Permet d'envoyer un mail contenant un nouveau mot de passe pour l'utilisateur associé  au mail fourni.
     *
     * @param string $mail L'adresse mail du destinataire
     * @param string $newPassword Le nouveau mot de passe généré
     * @return bool Vrai si le mail a bien été envoyé, sinon faux
     */
    public function sendNewPassword(string $mail, string $newPassword): bool
    {
        $ok = false;
        $subject = "Météhenchoz - Forgotten password";
        $message = "
            <html lang='en'>
                <head>
                    <title>Forgotten password</title>
                </head>
                <body>
                    <p>Here is your new password for metehenchoz.ch :</p>
                    <h2>" . $newPassword . "</h2>
                    <p>If you didn't ask that, ignore this email</p>
                </body>
            </html>
        ";
        $headers = "From: no-reply@metehenchoz.ch\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion() . "\r\n";
        $headers .= "MIME-Version: 1.0\r\n";
        $headers .= "Content-Type: text/html; charset=utf-8\r\n";
        $headers .= "X-Priority: 1 (Highest)\n";
        $headers .= "X-MSMail-Priority: High\n";
        $headers .= "Importance: High\n";
        if (mail($mail, $subject, $message, $headers)) {
            $ok = true;
        }
        return $ok;
    }

}