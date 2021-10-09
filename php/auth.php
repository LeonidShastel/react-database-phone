<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$email = $_GET['email'];
$password = $_GET['password'];

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
if ($mysqli->connect_error) {
    die("Error" . $mysqli->error);
}

if ($result = $mysqli->query("SELECT * FROM `AuthKeys` WHERE `EMAIL` LIKE '".$email."' AND `PASSWORD` LIKE '".$password."'")) {
    if ($result->num_rows > 0) {
        echo $result->fetch_object()->PRIVILEGES;
    } else {
        echo 'denied';
    }
}
