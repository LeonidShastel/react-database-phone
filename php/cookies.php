<?php
header('Access-Control-Allow-Methods: GET');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
header('Access-Control-Allow-Origin: *');


$email = $_COOKIE['email'];
$password = $_COOKIE['password'];

echo $email.' '.$password;