<?php

header('Access-Control-Allow-Methods: POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');

$count = $_GET['count'];
$city = $_GET['city'];
$email = $_COOKIE['email'];
if(!$email){
    die("not auth");
}

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
if($mysqli->connect_error){
    die("Error".$mysqli->error);
}

if($count){
    if($result = $mysqli->query("SELECT * FROM $city WHERE `DATE_DUMP` LIKE '0000-00-00' LIMIT ".$count)){
        $date = date("Y-m-d H:i:s");
        $filename = "dump_files/dump_".date("Y_m_d_H_i_s").".txt";
        while($row = $result->fetch_object()){
            $mysqli->query("UPDATE $city SET DATE_DUMP = '$date' WHERE ID = '$row->ID'");
            file_put_contents($filename,$row->PHONE."\n",FILE_APPEND);
        }
        if(createLogs($email, $count, $city)){
            print("http://thelax67.beget.tech/$filename");
        }else{
            print("Logs create error");
        }
    }
    else{
        die($mysqli->error);
    }
}

function createLogs($email, $count, $table){
    global $mysqli;
    $date = date('Y-m-d');
    $sql = "INSERT INTO Logs (`ID`, `EMAIL`, `COUNT`, `TABLE_OUT`, `DATE_DUMP`) VALUES   (NULL, '$email', '$count', '$table', '$date')";
    if($mysqli->query($sql)){
        return true;
    }else{
        return false;
    }
}

$mysqli->close();