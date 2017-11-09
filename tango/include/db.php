<?php

$DEBUG = 1;
error_reporting(E_ERROR | E_PARSE); # only show errors that count

$DB_NAME = "tango";
$DB_USER = "tango";
$DB_PASS = "tango";

$db = mysqli_connect(
	'localhost',
	$DB_USER,  /*user*/
	$DB_PASS,
	$DB_NAME  /*db name*/
);
define('DATA_SOURCE', 'TEST');

?>