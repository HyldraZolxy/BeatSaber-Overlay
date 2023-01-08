<?php
/////////////
// Require //
/////////////
require_once "./DBFactory.php";
require_once "./SQLQuery.php";

/////////////////
// @Class Init //
/////////////////
$DBFactory  = new DBFactory();
$SQLQuery   = new SqlQuery($DBFactory->getPDO());

//////////////////////
// Global Variables //
//////////////////////
define("INPUT",     json_decode(file_get_contents("php://input"), true));
define("TOKEN",     isExistsAndNotEmpty(INPUT, "token"));
define("METHOD",    isExistsAndNotEmpty(INPUT, "function"));
define("DATA",      isExistsAndNotEmpty(INPUT, "data"));

const TOKEN_LENGTH          = 32;
const TOKEN_ALLOWED_CHARS   = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~";

////////////////////
// Error Messages //
////////////////////

// Token
const TOKEN_EMPTY_OR_NOT_AVAILABLE  = array("errorMessage" => "Token not available or empty");
const TOKEN_FORMAT_NOT_GOOD         = array("errorMessage" => "Token format is not good");
const TOKEN_NOT_FOUND               = array("errorMessage" => "Token not found in database");
const TOKEN_NOT_FOUND_AFTER_SAVE    = array("errorMessage" => "Token not found in database after save");

// Method
const METHOD_EMPTY_OR_NOT_AVAILABLE = array("errorMessage" => "Function not available or empty");
const METHOD_NOT_SUPPORTED_OR_CODED = array("errorMessage" => "Function not supported or coded");

// Data
const DATA_EMPTY_OR_NOT_AVAILABLE   = array("errorMessage" => "Data not available or empty");
const DATA_NOT_IN_DATABASE          = array("errorMessage" => "Data not in database");
const DATA_FORMAT_NOT_GOOD          = array("errorMessage" => "Data format is not good");

//////////////////////
// Success Messages //
//////////////////////
const DATA_READ_SUCCESS             = array("successMessage" => "Data successfully read in database");
const DATA_SAVE_SUCCESS             = array("successMessage" => "Data successfully added in database");
const DATA_UPDATE_SUCCESS           = array("successMessage" => "Data successfully updated in database");

//////////////////
// DEFAULT DATA //
//////////////////

const DEFAULT_DATA = array(
    "general_data" => array(
        "ip"                        => "127.0.0.1",
        "token"                     => "",
        "scoringSystem"             => 1
    ),
    "playercard_data" => array(
        "disabled"                  => true,
        "alwaysEnabled"             => false,
        "playerID"                  => "0",
        "skin"                      => "default",
        "position"                  => 1,
        "scale"                     => 1,
        "pos_x"                     => 0,
        "pos_y"                     => 0
    ),
    "songcard_data" => array(
        "disabled"                  => false,
        "alwaysEnabled"             => false,
        "skin"                      => "default",
        "position"                  => 1,
        "scale"                     => 1,
        "pos_x"                     => 0,
        "pos_y"                     => 0,
        "missDisplay"               => false,
        "bigBSR"                    => false,
        "ppMax"                     => false,
        "ppEstimated"               => false
    ),
    "leaderboard_data" => array(
        "disabled"                  => false,
        "alwaysEnabled"             => false,
        "skin"                      => "default",
        "position"                  => 1,
        "scale"                     => 1,
        "pos_x"                     => 0,
        "pos_y"                     => 0,
        "playerRendering"           => 5
    ),
    "games_data" => array(
        "beatSaber"                 => true,
        "synthRiders"               => true,
        "audioTrip"                 => true,
        "audica"                    => true
    ),
    "plugins_data" => array(
        "beatSaberPlus"             => true,
        "beatSaberPlusLeaderboard"  => true,
        "dataPuller"                => true,
        "httpSiraStatus"            => true,
        "synthRiders"               => true,
        "audioTrip"                 => true,
        "audica"                    => true
    )
);

///////////
// Logic //
///////////
eventFunction(METHOD, $SQLQuery);

///////////////
// Functions //
///////////////
/**
 * @param $method
 * @param $SQLQuery
 * @return void
 */
function eventFunction($method, $SQLQuery): void {
    switch($method) {
        case "search":
            tokenSearch($SQLQuery);
            break;
        case "save":
            tokenSave($SQLQuery);
            break;
        case "update":
            tokenUpdate($SQLQuery);
            break;
        default:
            if (empty($method)) echo json_encode(METHOD_EMPTY_OR_NOT_AVAILABLE);
            echo json_encode(METHOD_NOT_SUPPORTED_OR_CODED);
            break;
    }
}

/**
 * @param array $input
 * @param String $name
 * @return String|Array|null
 */
function isExistsAndNotEmpty(Array $input, String $name): array|string|null {
    if (isset($input[$name]) && !empty($input[$name]))  return $input[$name];
    else                                                return null;
}

/**
 * @param $data
 * @return bool|void
 */
function dataExists($data) {
    if (empty($data) && !is_array($data)) {
        echo json_encode(DATA_EMPTY_OR_NOT_AVAILABLE);
        die;
    }

    return true;
}

/**
 * @param $SQLQuery
 * @return string
 */
function tokenMaking($SQLQuery): string {
    while(true) {
        $token                      = "";
        $token_allowed_chars_length = strlen(TOKEN_ALLOWED_CHARS);

        for ($i = 0; $i < TOKEN_LENGTH; $i++) {
            $random_char    = TOKEN_ALLOWED_CHARS[mt_rand(0, $token_allowed_chars_length - 1)];
            $token          .= $random_char;
        }

        if (strlen($token) === TOKEN_LENGTH || !preg_match("/[^-~._\w]/", $token)) {
            if (tokenExists($SQLQuery, $token) === null) return $token;
        }
    }
}

/**
 * @return bool|void
 */
function tokenFormat($token) {
    if (empty($token)) {
        echo json_encode(TOKEN_EMPTY_OR_NOT_AVAILABLE);
        die;
    }

    if (strlen($token) !== TOKEN_LENGTH || preg_match("/[^-~._\w]/", $token)) {
        echo json_encode(TOKEN_FORMAT_NOT_GOOD);
        die;
    }

    return true;
}

/**
 * @param $SQLQuery
 * @param $token
 * @return int|null
 */
function tokenExists($SQLQuery, $token): ?int {
    $fields = array("*");
    $where  = array(
        "token" => $token
    );

    $SQLQuery->sqlSelect($fields, "tokens", $where);

    if ($SQLQuery->sqlCount() === 0) return null;

    $result = $SQLQuery->sqlFetch();
    return $result["id"];
}

/**
 * @param $SQLQuery
 * @return void
 */
function tokenSearch($SQLQuery): void {
    if (tokenFormat(TOKEN)) {
        $tokenId = tokenExists($SQLQuery, TOKEN);

        if ($tokenId === null) {
            echo json_encode(TOKEN_NOT_FOUND);
            die;
        }

        $fields = array("*");
        $where  = array(
            "token" => TOKEN
        );

        $data = array();

        $SQLQuery->sqlSelect($fields, "general_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["general_data"] = $SQLQuery->sqlFetch();
        unset($data["general_data"]["id"]);
        unset($data["general_data"]["token"]);

        $SQLQuery->sqlSelect($fields, "playercard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["playercard_data"] = $SQLQuery->sqlFetch();
        unset($data["playercard_data"]["id"]);
        unset($data["playercard_data"]["token"]);

        $SQLQuery->sqlSelect($fields, "songcard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["songcard_data"] = $SQLQuery->sqlFetch();
        unset($data["songcard_data"]["id"]);
        unset($data["songcard_data"]["token"]);

        $SQLQuery->sqlSelect($fields, "leaderboard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["leaderboard_data"] = $SQLQuery->sqlFetch();
        unset($data["leaderboard_data"]["id"]);
        unset($data["leaderboard_data"]["token"]);

        $SQLQuery->sqlSelect($fields, "games_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["games_data"] = $SQLQuery->sqlFetch();
        unset($data["games_data"]["id"]);
        unset($data["games_data"]["token"]);

        $SQLQuery->sqlSelect($fields, "plugins_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["plugins_data"] = $SQLQuery->sqlFetch();
        unset($data["plugins_data"]["id"]);
        unset($data["plugins_data"]["token"]);

        $data += DATA_READ_SUCCESS;

        echo json_encode($data);
    }
}

/**
 * @param $SQLQuery
 * @return void
 */
function tokenSave($SQLQuery): void {
    $token = tokenMaking($SQLQuery);

    if (dataExists(DATA)) {
        $data       = dataConverter(DATA);
        $dataToken  = array(
            "token" => $token
        );
        $SQLQuery->sqlAdd($dataToken, "tokens");

        $tokenId = tokenExists($SQLQuery, $token);
        if($tokenId === null) {
            echo json_encode(TOKEN_NOT_FOUND_AFTER_SAVE);
            die;
        }

        $data["general_data"]       += array("token" => $token);
        $data["playercard_data"]    += array("token" => $token);
        $data["songcard_data"]      += array("token" => $token);
        $data["leaderboard_data"]   += array("token" => $token);
        $data["games_data"]         += array("token" => $token);
        $data["plugins_data"]       += array("token" => $token);

        $SQLQuery->sqlAdd($data["general_data"],        "general_data");
        $SQLQuery->sqlAdd($data["playercard_data"],     "playercard_data");
        $SQLQuery->sqlAdd($data["songcard_data"],       "songcard_data");
        $SQLQuery->sqlAdd($data["leaderboard_data"],    "leaderboard_data");
        $SQLQuery->sqlAdd($data["games_data"],          "games_data");
        $SQLQuery->sqlAdd($data["plugins_data"],        "plugins_data");

        $json = array("token" => $token);
        $json += DATA_SAVE_SUCCESS;

        echo json_encode($json);
    }
}

/**
 * @param $SQLQuery
 * @return void
 */
function tokenUpdate($SQLQuery): void {
    if (tokenFormat(TOKEN)) {
        $tokenId = tokenExists($SQLQuery, TOKEN);

        if ($tokenId === null) {
            echo json_encode(TOKEN_NOT_FOUND);
            die;
        }

        if (dataExists(DATA)) {
            $data = dataConverter(DATA);

            if (count($data["general_data"]) > 0)       $SQLQuery->sqlUpdate(TOKEN, $data["general_data"],      "general_data");
            if (count($data["playercard_data"]) > 0)    $SQLQuery->sqlUpdate(TOKEN, $data["playercard_data"],   "playercard_data");
            if (count($data["songcard_data"]) > 0)      $SQLQuery->sqlUpdate(TOKEN, $data["songcard_data"],     "songcard_data");
            if (count($data["leaderboard_data"]) > 0)   $SQLQuery->sqlUpdate(TOKEN, $data["leaderboard_data"],  "leaderboard_data");
            if (count($data["games_data"]) > 0)         $SQLQuery->sqlUpdate(TOKEN, $data["games_data"],        "games_data");
            if (count($data["plugins_data"]) > 0)       $SQLQuery->sqlUpdate(TOKEN, $data["plugins_data"],      "plugins_data");

            echo json_encode(DATA_UPDATE_SUCCESS);
        }
    }
}

/**
 * @param $data
 * @return array|array[]|void
 */
function dataConverter($data) {
    $dataConverted = array(
        "general_data"      => array(),
        "playercard_data"   => array(),
        "songcard_data"     => array(),
        "leaderboard_data"  => array(),
        "games_data"        => array(),
        "plugins_data"      => array()
    );

    foreach ($data as $key => $value) {
        if ($key !== "token") {
            if (str_contains($key, "pc_")) {
                $databaseName   = "playercard_data";
                $key            = str_replace("pc_", "", $key);
            } else if (str_contains($key, "sc_")) {
                $databaseName   = "songcard_data";
                $key            = str_replace("sc_", "", $key);
            } else if (str_contains($key, "ld_")) {
                $databaseName   = "leaderboard_data";
                $key            = str_replace("ld_", "", $key);
            } else if (str_contains($key, "g_")) {
                $databaseName   = "games_data";
                $key            = str_replace("g_", "", $key);
            } else if (str_contains($key, "p_")) {
                $databaseName   = "plugins_data";
                $key            = str_replace("p_", "", $key);
            } else $databaseName   = "general_data";

            if (!array_key_exists($key, DEFAULT_DATA[$databaseName])) {
                echo json_encode(DATA_FORMAT_NOT_GOOD);
                die;
            }

            if (gettype($value) === gettype(DEFAULT_DATA[$databaseName][$key])) $dataConverted[$databaseName][$key] = (gettype($value) === "boolean") ? ($value) ? 1 : 0 : $value;
            else                                                                $dataConverted[$databaseName][$key] = (gettype(DEFAULT_DATA[$databaseName][$key]) === "boolean") ? (DEFAULT_DATA[$databaseName][$key]) ? 1 : 0 : DEFAULT_DATA[$databaseName][$key];
        }
    }

    return $dataConverted;
}