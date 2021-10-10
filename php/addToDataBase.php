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
    trigger_error($mysqli->error, E_USER_ERROR);
}

if ($result = $mysqli->query("SHOW TABLES LIKE '%$city%'")) {
    if ($result->num_rows === 0) {
        if ($mysqli->query("CREATE TABLE $city (ID INT UNSIGNED AUTO_INCREMENT PRIMARY KEY, PHONE VARCHAR(12) UNIQUE, DATE_DUMP DATE)") === true) {
            echo '';
        } else {
            trigger_error($mysqli->error, E_USER_ERROR);
        }
    }
}
$count_dubl = 0;

foreach ($numbers as &$value) {
    $sql = "INSERT INTO $city (`ID`, `PHONE`, `DATE_DUMP`) VALUES (NULL, '$value', '0000-00-00')";
    if ($mysqli->query($sql) !== true) {
        $count_dubl++;
    }
}

echo $count_dubl;

unset($value);

$mysqli->close();

