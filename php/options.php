<?php
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');
mb_internal_encoding("UTF-8");

$option = $_GET['option'];
if (!$option) {
    $_POST = json_decode(file_get_contents('php://input'), true);
    $option = $_POST['option'];
}

$mysqli = new mysqli('localhost', 'thelax67_dbase', 'xT7zI&tK', 'thelax67_dbase');
if ($mysqli->connect_error) {
    die("Error" . $mysqli->error);
}
$mysqli->query("SET CHARACTER SET 'utf8'");

if ($option === "cities") {
    if ($result = $mysqli->query("SHOW TABLES")) {
        $json = array();
        while ($row = $result->fetch_object()) {
            $table = $row->Tables_in_thelax67_dbase;
            if ($table === 'AuthKeys' || $table === 'Logs') {
                continue;
            }
            $temp_obj = array();
            $numberPhones = '';
            $numberAvailablePhones = '';
            if ($result_count = $mysqli->query("SELECT COUNT(*) FROM $table")) {
                $numberPhones = $result_count->fetch_row()[0];
            }
            if ($result_count = $mysqli->query("SELECT COUNT(*) FROM $table WHERE `DATE_DUMP` LIKE '0000-00-00'")) {
                $numberAvailablePhones = $result_count->fetch_row()[0];
            }
            $temp_obj = [
                'title' => $table,
                'numberPhones' => $numberPhones,
                'numberAvailablePhones' => $numberAvailablePhones
            ];

            array_push($json, $temp_obj);
        }
        echo json_encode($json);
    }
}
else if ($option === "table_clear") {
    $table = $_GET['table'];
    if ($result = $mysqli->query("TRUNCATE TABLE $table")) {
        print(true);
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}
else if ($option === "table_remove") {
    $table = $_GET['table'];
    if ($result = $mysqli->query("DROP TABLE `$table`")) {
        print(true);
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}
else if ($option === "table_clearUsed"){
    $table = $_GET['table'];
    if($result = $mysqli->query("DELETE FROM `$table` WHERE `DATE_DUMP`!='0000-00-00'")){
        print(true);
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}
else if ($option === "users") {
    if ($result = $mysqli->query("SELECT * FROM AuthKeys")) {
        $json = array();
        while ($row = $result->fetch_object()) {
            $object = [
                'id' => $row->ID,
                'email' => $row->EMAIL,
                'password' => $row->PASSWORD,
                'privileges' => $row->PRIVILEGES,
                'accessCities' => $row->ACCESS_CITIES
            ];
            array_push($json, $object);
        }
        echo json_encode($json);
    }
}
else if ($option === "currentUser"){
    $email = $_GET['email'];
    if($result=$mysqli->query("SELECT * FROM `AuthKeys` WHERE `EMAIL` LIKE '%$email%'")){
        echo json_encode($result->fetch_object());
    }else{
        trigger_error("error", E_USER_ERROR);
    }

}
else if ($option === "delete_user") {
    $email = $_GET['email'];
    if ($result = $mysqli->query("SELECT ID FROM `AuthKeys` WHERE `EMAIL` LIKE '%" . $email . "%'")) {
        if ($mysqli->query("DELETE FROM `AuthKeys` WHERE `ID` = " . $result->fetch_row()[0])) {
            echo true;
        } else {
            trigger_error("error", E_USER_ERROR);
        }
    }
}
else if ($option === 'add_user') {
    $email = $_GET['email'];
    $password = $_GET['password'];
    $privileges = $_GET['privileges'];
    if ($result = $mysqli->query("INSERT INTO `AuthKeys` (`ID`, `EMAIL`, `PASSWORD`, `PRIVILEGES`, `ACCESS_CITIES`) VALUES (NULL, '$email', '$password', '$privileges', '[]')")) {
        echo true;
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}
else if ($option === 'save_user') {
    $body = $_POST['body'];

    $id = $body['id'];
    $email = $body['email'];
    $password = $body['password'];
    $privileges = $body['privileges'];
    $accessCities = $body['accessCities'];
    if ($result = $mysqli->query("UPDATE `AuthKeys` SET `EMAIL` = '$email', `PASSWORD` = '$password', `PRIVILEGES` = '$privileges', `ACCESS_CITIES` = '$accessCities' WHERE `ID` = '$id'")) {
        echo true;
    } else {
        trigger_error("error", E_USER_ERROR);
    }
}
else if ($option === 'logs') {
    if ($result = $mysqli->query("SELECT * FROM `Logs` ORDER BY ID DESC LIMIT 25")) {
        $json = array();
        while ($row = $result->fetch_object()) {
            $object = [
                'id' => $row->ID,
                'email' => $row->EMAIL,
                'count' => $row->COUNT,
                'tableOut' => $row->TABLE_OUT,
                'dateDump' => $row->DATE_DUMP
            ];
            array_push($json, $object);
        }
        echo json_encode($json);
    }else{
        trigger_error("error", E_USER_ERROR);
    }
}