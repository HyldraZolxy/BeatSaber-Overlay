<?php
$_SCORESABER_URL_API = "https://scoresaber.com/api/";
$_SCORESABER_ALLOWED_PARAMS = ["player"]; // To support other ScoreSaber API features

$_SCORESABER_ALLOWED_PLAYER_ENDPOINT = ["basic", "full"];
$_SCORESABER_DEFAULT_PLAYER_ID = 0;

$_DEFAULT_MSG_ERROR =
'{
    "errorMessage": "Information not found"
}';

if (isset($_GET["params"]) && !empty($_GET["params"]) && in_array($_GET["params"], $_SCORESABER_ALLOWED_PARAMS)) {
    switch($_GET["params"]) {
        case "player":
            $player_id =
            (
                isset($_GET["playerId"])
                && !empty(["playerId"])
                && is_numeric($_GET["playerId"])
            )
            ? $_GET["playerId"] : $_SCORESABER_DEFAULT_PLAYER_ID;

            $player_endPoint =
            (
                isset($_GET["endPoint"])
                && !empty($_GET["endPoint"])
                && in_array($_GET["endPoint"], $_SCORESABER_ALLOWED_PLAYER_ENDPOINT)
            )
            ? $_GET["endPoint"] : $_SCORESABER_ALLOWED_PLAYER_ENDPOINT[0];

            $json_data = @file_get_contents(
                $_SCORESABER_URL_API . $_GET["params"] . "/" . $player_id . "/" . $player_endPoint
            );

            if (json_encode($json_data) != "false") {
                echo $json_data;
            } else {
                print_r($_DEFAULT_MSG_ERROR);
            }
            break;

        default:
            print_r($_DEFAULT_MSG_ERROR);
            break;
    }
}
