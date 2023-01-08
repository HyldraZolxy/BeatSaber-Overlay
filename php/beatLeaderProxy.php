<?php
require_once("./cache.php");

$cache_system                   = new Cache_System();
$_BEATLEADER_URL_API            = "https://api.beatleader.xyz/";
$_BEATLEADER_API_COOLDOWN       = 2 * 60;
$_BEATLEADER_DEFAULT_PLAYER_ID  = 0;
$_DEFAULT_MSG_ERROR             = '{ "errorMessage": "Player not found" }';

if (!isset($_GET["playerID"]) || $_GET["playerID"] === "0") {
    echo $_DEFAULT_MSG_ERROR;
    return;
}

$player_id  = (is_numeric($_GET["playerID"])) ? $_GET["playerID"] : $_BEATLEADER_DEFAULT_PLAYER_ID;
$cache_key  = "blprofile_" . $player_id;
$cache_data = "";

if (!$cache_system->NeedRebuild($cache_key, $_BEATLEADER_API_COOLDOWN)) {
    $cache_data = $cache_system->Get($cache_key);

    if ($cache_data !== null && json_encode($cache_data) !== "false") {
        echo $cache_data;
        return;
    }
}

$json_data = @file_get_contents( $_BEATLEADER_URL_API . "player/" . $player_id . "?stats=false" );

if (json_encode($json_data) !== "false") {
    $cache_system->Set($cache_key, $json_data);
    echo $json_data;
    return;
} else {
    $cache_data = $cache_system->Get($cache_key);

    if ($cache_data !== null && json_encode($cache_data) !== "false") {
        echo $cache_data;
        return;
    }
}

echo $_DEFAULT_MSG_ERROR;