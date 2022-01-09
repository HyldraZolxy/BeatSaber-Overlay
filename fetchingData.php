<?php
$_SCORESABER_API_PLAYER_DATA = "https://scoresaber.com/api/player/";
$_SCORESABER_API_PLAYER_DATA_ENDPOINT = "/basic";

$_JSON_BASE = '{
    "id": "0",
    "name": "NaN",
    "profilePicture": "../../images/not_found.jpg",
    "country": "FR",
    "pp": "NaN",
    "rank": "NaN",
    "countryRank": "NaN",
    "role": "",
    "badges": null,
    "histories": "0",
    "permissions": 0,
    "banned": false,
    "inactive": false,
    "scoreStats": null
}';

if (isset($_GET["playerId"]) && !empty($_GET["playerId"]) && is_numeric($_GET["playerId"])) {
    $json_data = @file_get_contents($_SCORESABER_API_PLAYER_DATA . $_GET["playerId"] . $_SCORESABER_API_PLAYER_DATA_ENDPOINT);
    if ($json_data !== false) {
        print_r($json_data);
    } else {
        print_r($_JSON_BASE);
    }
} else {
    print_r($_JSON_BASE);
}
