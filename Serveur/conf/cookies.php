<?php

/*
  But     : Paramètres des cookies
  Auteur  : Valentino Iliev
  Date    : 31.01.2023 / v1.0
*/

$lifetime = 86400;
$path = "/";
$domain = "metehenchoz.ch";
$secure = true;
$httponly = true;
$samesite = 'Strict';

session_set_cookie_params(compact('lifetime', 'path', 'domain', 'secure', 'httponly', 'samesite'));