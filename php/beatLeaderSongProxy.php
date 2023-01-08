<?php
$_BEATLEADER_URL_API    = "https://api.beatleader.xyz/map/hash/";
$_DEFAULT_MSG_ERROR     = '{ "errorMessage": "Song not found" }';

if (!isset($_GET["hash"]) || $_GET["hash"] === "") {
    echo $_DEFAULT_MSG_ERROR;
    return;
}

$hash = $_GET["hash"];

$json_data = @file_get_contents( $_BEATLEADER_URL_API . $hash );

if (json_encode($json_data) !== "false") {
    echo $json_data;
    return;
}

echo $_DEFAULT_MSG_ERROR;