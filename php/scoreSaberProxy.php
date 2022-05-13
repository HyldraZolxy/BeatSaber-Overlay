<?php
require_once("./cache.php");

$_SCORESABER_URL_API = "https://scoresaber.com/api/";
$_SCORESABER_API_COOLDOWN = 2 * 60;

$_SCORESABER_DEFAULT_PLAYER_ID = 0;

$_DEFAULT_MSG_ERROR = '{
    "errorMessage": "Information not found"
}';

if (isset($_GET["playerId"]) && !empty($_GET["playerId"])) {
    $player_id = ( is_numeric($_GET["playerId"]) ) ? $_GET["playerId"] : $_SCORESABER_DEFAULT_PLAYER_ID;

    if ($player_id == $_SCORESABER_DEFAULT_PLAYER_ID) {
        echo $_DEFAULT_MSG_ERROR;
        return;
    }

    $cache_key = "ssprofile_" . $player_id;

    if (!$cache_system->NeedRebuild($cache_key, $_SCORESABER_API_COOLDOWN)) {
        $cache_data = $cache_system->Get($cache_key);

        if ($cache_data != null && json_encode($cache_data) != "false") {
            echo $cache_data;
            return;
        }
    }

    $json_data = @file_get_contents(
        $_SCORESABER_URL_API . "player/" . $player_id . "/full"
    );

    if (json_encode($json_data) != "false") {
        $cache_system->Set($cache_key, $json_data);
        echo $json_data;
    } else {
        $cache_data = $cache_system->Get($cache_key);

        if ($cache_data != null && json_encode($cache_data) != "false") {
            echo $cache_data;
        } else {
            echo $_DEFAULT_MSG_ERROR;
        }
    }
}