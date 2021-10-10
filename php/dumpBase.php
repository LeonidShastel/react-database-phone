<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');
mb_internal_encoding("UTF-8");

$count = $_GET['count'];
$city = $_GET['city'];
$email = $_COOKIE['email'];
if (!$email) {
    die("not auth");
}

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
if ($mysqli->connect_error) {
    die("Error" . $mysqli->error);
}
$mysqli->query("SET CHARACTER SET 'utf8'");


if ($count) {
    $user = checkUser($email);

    if ($user->PRIVILEGES !== 'admin') {
        $access = json_decode($user->ACCESS_CITIES);
        for ($i = 0; $i < count($access); $i++) {
            if ($access[$i]->city === $city) {
                editUserAccess($user, $i);
                break;
            }
        }
    }
    getFiles();
}

function createLogs($email, $count, $table)
{
    global $mysqli;
    $date = date("Y-m-d H:i:s");
    $sql = "INSERT INTO Logs (`ID`, `EMAIL`, `COUNT`, `TABLE_OUT`, `DATE_DUMP`) VALUES   (NULL, '$email', '$count', '$table', '$date')";
    if ($mysqli->query($sql)) {
        return true;
    } else {
        return false;
    }
}

function checkUser($email)
{
    global $mysqli;
    if ($result = $mysqli->query("SELECT * FROM `AuthKeys` WHERE `EMAIL` LIKE '%$email%'")) {
        return $result->fetch_object();
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}

function getFiles()
{
    global $mysqli, $count, $email, $city;
    if ($result = $mysqli->query("SELECT * FROM $city WHERE `DATE_DUMP` LIKE '0000-00-00' LIMIT " . $count)) {
        $date = date("Y-m-d H:i:s");
        $filename = "dump_files/dump_" . date("Y_m_d_H_i_s") . ".txt";
        while ($row = $result->fetch_object()) {
            $mysqli->query("UPDATE $city SET DATE_DUMP = '$date' WHERE ID = '$row->ID'");
            file_put_contents($filename, $row->PHONE . "\n", FILE_APPEND);
        }
        if (createLogs($email, $count, $city)) {
            print("http://thelax67.beget.tech/$filename");
        } else {
            trigger_error("error", E_USER_ERROR);
        }
    } else {
        die($mysqli->error);
    }
}

function editUserAccess($user, $indexCity)
{
    global $count, $mysqli;
    $access = json_decode($user->ACCESS_CITIES);
    echo json_encode($access);
    if ($access[$indexCity]->count - $count === 0) {
        $newAccess = array();
        for ($i = 0; $i < count($access); $i++)
            if ($i !== $indexCity)
                array_push($newAccess, $access[$i]);
        $access = $newAccess;
    } else {
        $access[$indexCity]->count = $access[$indexCity]->count - $count;
    }
    $access_push = json_encode($access, JSON_UNESCAPED_UNICODE);
    echo $access_push;
    if ($mysqli->query("UPDATE `AuthKeys` SET  `ACCESS_CITIES` = '$access_push' WHERE `ID` = '$user->ID'")) {
        echo true;
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}

$mysqli->close();