<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$_POST = json_decode(file_get_contents('php://input'), true);
$numbers = $_POST['numbers'];
$city = $_POST['city'];
$email = $_COOKIE['email'];
if (!$email) {
    trigger_error("error", E_USER_ERROR);
}

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
if ($mysqli->connect_error) {
    die("Error" . $mysqli->error);
}

if ($result = $mysqli->query("SHOW TABLES LIKE '%$city%'")) {
    if($result->num_rows===0){
        if ($mysqli->query("CREATE TABLE $city (ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, PHONE VARCHAR(12), DATE_DUMP DATE)") === true) {
            echo 'table posted';
        } else {
            echo $mysqli->error;
        }
    }
}

foreach ($numbers as &$value) {
    if ($result = $mysqli->query("SELECT * FROM `$city` WHERE `PHONE` LIKE '%$value%'")) {
        echo $result->num_rows;
        if ($result->num_rows > 0){
            continue;
        }
        else {
            $sql = "INSERT INTO $city (`ID`, `PHONE`, `DATE_DUMP`) VALUES (NULL, '$value', '0000-00-00')";
            if ($mysqli->query($sql) === true) {
                echo 'row posted';
            } else {
                echo $mysqli->error;
            }
        }
    }
}

unset($value);

$mysqli->close();

