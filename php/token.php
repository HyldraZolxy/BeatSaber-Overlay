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
    "general" => array(
        "ip"            => "127.0.0.1",
        "token"         => "",
        "scoringSystem" => 1
    ),

    "games" => array(
        "beatSaber"     => true,
        "synthRiders"   => false,
        "audioTrip"     => false,
        "audica"        => false,
        "adofai"        => false
    ),

    "plugins" => array(
        "beatSaberPlugins"              => array(
            "beatSaberPlus"             => true,
            "beatSaberPlusLeaderboard"  => false,
            "dataPuller"                => true,
            "httpSiraStatus"            => true
        ),

        "synthRidersPlugins" => array(
            "synthRiders" => false
        ),

        "audioTripPlugins" => array(
            "audioTrip" => false
        ),

        "audicaPlugins" => array(
            "audica" => false
        ),

        "adofaiPlugins" => array(
            "adofai" => false
        )
    ),

    "playerCard" => array(
        "disabled"                  => false,
        "alwaysEnabled"             => false,
        "playerID"                  => "0",
        "skin"                      => "default",
        "position"                  => 0,
        "scale"                     => 1.0,
        "pos_x"                     => 0,
        "pos_y"                     => 0
    ),

    "songCard" => array(
        "disabled"                  => false,
        "alwaysEnabled"             => false,
        "skin"                      => "default",
        "position"                  => 3,
        "scale"                     => 1.0,
        "pos_x"                     => 0,
        "pos_y"                     => 0,
        "missDisplay"               => false,
        "bigBSR"                    => false,
        "ppMax"                     => false,
        "ppEstimated"               => false
    ),

    "leaderboard" => array(
        "disabled"                  => false,
        "skin"                      => "default",
        "position"                  => 0,
        "scale"                     => 1.0,
        "pos_x"                     => 0,
        "pos_y"                     => 0,
        "playerRendering"           => 5,
	    "battleRoyal"               => false
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

        $data["general"] = $SQLQuery->sqlFetch();
        unset($data["general"]["id"]);
        unset($data["general"]["token"]);

        $SQLQuery->sqlSelect($fields, "games_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["games"] = $SQLQuery->sqlFetch();
        unset($data["games"]["id"]);
        unset($data["games"]["token"]);

        $SQLQuery->sqlSelect($fields, "plugins_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["plugins"] = $SQLQuery->sqlFetch();
        unset($data["plugins"]["id"]);
        unset($data["plugins"]["token"]);

        $SQLQuery->sqlSelect($fields, "playercard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["playerCard"] = $SQLQuery->sqlFetch();
        unset($data["playerCard"]["id"]);
        unset($data["playerCard"]["token"]);

        $SQLQuery->sqlSelect($fields, "songcard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["songCard"] = $SQLQuery->sqlFetch();
        unset($data["songCard"]["id"]);
        unset($data["songCard"]["token"]);

        $SQLQuery->sqlSelect($fields, "leaderboard_data", $where);

        if ($SQLQuery->sqlCount() === 0) {
            echo json_encode(DATA_NOT_IN_DATABASE);
            die;
        }

        $data["leaderboard"] = $SQLQuery->sqlFetch();
        unset($data["leaderboard"]["id"]);
        unset($data["leaderboard"]["token"]);

        $data = dataConverter($data);

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

        $data["general"]["token"]   = $token;
        $data["games"]              += array("token" => $token);
        $data["plugins"]            += array("token" => $token);
        $data["playerCard"]         += array("token" => $token);
        $data["songCard"]           += array("token" => $token);
        $data["leaderboard"]        += array("token" => $token);

        $SQLQuery->sqlAdd($data["general"],        "general_data");
        $SQLQuery->sqlAdd($data["games"],          "games_data");
        $SQLQuery->sqlAdd($data["playerCard"],     "playercard_data");
        $SQLQuery->sqlAdd($data["songCard"],       "songcard_data");
        $SQLQuery->sqlAdd($data["leaderboard"],    "leaderboard_data");

        if (count($data["plugins"]) > 0) {
            $pluginsData = array();
            $pluginsData += array("token" => $token);

            if (count($data["plugins"]["beatSaberPlugins"]) > 0)    $pluginsData += $data["plugins"]["beatSaberPlugins"];
            if (count($data["plugins"]["synthRidersPlugins"]) > 0)  $pluginsData += $data["plugins"]["synthRidersPlugins"];
            if (count($data["plugins"]["audioTripPlugins"]) > 0)    $pluginsData += $data["plugins"]["audioTripPlugins"];
            if (count($data["plugins"]["audicaPlugins"]) > 0)       $pluginsData += $data["plugins"]["audicaPlugins"];
            if (count($data["plugins"]["adofaiPlugins"]) > 0)       $pluginsData += $data["plugins"]["adofaiPlugins"];

            $SQLQuery->sqlAdd($pluginsData, "plugins_data");
        }

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

            if (count($data["general"]) > 0)        $SQLQuery->sqlUpdate(TOKEN, $data["general"],      "general_data");
            if (count($data["games"]) > 0)          $SQLQuery->sqlUpdate(TOKEN, $data["games"],        "games_data");
            if (count($data["playerCard"]) > 0)     $SQLQuery->sqlUpdate(TOKEN, $data["playerCard"],   "playercard_data");
            if (count($data["songCard"]) > 0)       $SQLQuery->sqlUpdate(TOKEN, $data["songCard"],     "songcard_data");
            if (count($data["leaderboard"]) > 0)    $SQLQuery->sqlUpdate(TOKEN, $data["leaderboard"],  "leaderboard_data");

            if (count($data["plugins"]) > 0) {
                $pluginsData = array();

                if (count($data["plugins"]["beatSaberPlugins"]) > 0)    $pluginsData += $data["plugins"]["beatSaberPlugins"];
                if (count($data["plugins"]["synthRidersPlugins"]) > 0)  $pluginsData += $data["plugins"]["synthRidersPlugins"];
                if (count($data["plugins"]["audioTripPlugins"]) > 0)    $pluginsData += $data["plugins"]["audioTripPlugins"];
                if (count($data["plugins"]["audicaPlugins"]) > 0)       $pluginsData += $data["plugins"]["audicaPlugins"];
                if (count($data["plugins"]["adofaiPlugins"]) > 0)       $pluginsData += $data["plugins"]["adofaiPlugins"];

                $SQLQuery->sqlUpdate(TOKEN, $pluginsData, "plugins_data");
            }

            echo json_encode(DATA_UPDATE_SUCCESS);
        }
    }
}

/**
 * @param $data
 * @return array|array[]|void
 */
function dataConverter($data) {
    $module = "";
    $pluginsModule = "";

    $dataConverted = array(
        "general"       => array(),
        "games"         => array(),
        "plugins"       => array(
            "beatSaberPlugins"      => array(),
            "synthRidersPlugins"    => array(),
            "audioTripPlugins"      => array(),
            "audicaPlugins"         => array(),
            "adofaiPlugins"         => array()
        ),
        "playerCard"    => array(),
        "songCard"      => array(),
        "leaderboard"   => array()
    );

    foreach ($data as $key => $value) {
        switch($key) {
            case "general":
                $module = "general";
                break;

            case "games":
                $module = "games";
                break;

            case "plugins":
                $module = "plugins";
                break;

            case "playerCard":
                $module = "playerCard";
                break;

            case "songCard":
                $module = "songCard";
                break;

            case "leaderboard":
                $module = "leaderboard";
                break;
        }

        if ($module && $module !== "plugins") {
            foreach ($value as $moduleKey => $moduleValue) {
                if (!array_key_exists($moduleKey, DEFAULT_DATA[$module])) {
                    echo json_encode(DATA_FORMAT_NOT_GOOD);
                    die;
                }

                if (gettype($moduleValue) === "boolean") {
                    if (gettype(DEFAULT_DATA[$module][$moduleKey]) === "boolean")   $dataConverted[$module][$moduleKey] = ($moduleValue) ? 1 : 0;
                    else                                                            $dataConverted[$module][$moduleKey] = $moduleValue;
                } else {
                    if (gettype(DEFAULT_DATA[$module][$moduleKey]) === "boolean")   $dataConverted[$module][$moduleKey] = ($moduleValue);
                    else                                                            $dataConverted[$module][$moduleKey] = $moduleValue;
                }
            }
        } else if ($module) {
            foreach ($value as $pluginsKey => $valuePlugins) {
                switch($pluginsKey) {
                    case "beatSaberPlus":
                    case "beatSaberPlusLeaderboard":
                    case "dataPuller":
                    case "httpSiraStatus":
                    case "beatSaberPlugins":
                        $pluginsModule = "beatSaberPlugins";
                        break;
                    case "synthRiders":
                    case "synthRidersPlugins":
                        $pluginsModule = "synthRidersPlugins";
                        break;
                    case "audioTrip":
                    case "audioTripPlugins":
                        $pluginsModule = "audioTripPlugins";
                        break;
                    case "audica":
                    case "audicaPlugins":
                        $pluginsModule = "audicaPlugins";
                        break;
                    case "adofai":
                    case "adofaiPlugins":
                        $pluginsModule = "adofaiPlugins";
                        break;
                }

                if (is_array($valuePlugins)) {
                    foreach ($valuePlugins as $pluginsValueKey => $valueValuePlugins) {
                        if (!array_key_exists($pluginsValueKey, DEFAULT_DATA[$module][$pluginsModule])) {
                            echo json_encode(DATA_FORMAT_NOT_GOOD);
                            die;
                        }

                        if (gettype($valueValuePlugins) === "boolean") {
                            if (gettype(DEFAULT_DATA[$module][$pluginsModule][$pluginsValueKey]) === "boolean") $dataConverted[$module][$pluginsModule][$pluginsValueKey] = ($valueValuePlugins) ? 1 : 0;
                            else                                                                                $dataConverted[$module][$pluginsModule][$pluginsValueKey] = $valueValuePlugins;
                        } else {
                            if (gettype(DEFAULT_DATA[$module][$pluginsModule][$pluginsValueKey]))   $dataConverted[$module][$pluginsModule][$pluginsValueKey] = ($valueValuePlugins);
                            else                                                                    $dataConverted[$module][$pluginsModule][$pluginsValueKey] = $valueValuePlugins;
                        }
                    }
                } else {
                    if (!array_key_exists($pluginsKey, DEFAULT_DATA[$module][$pluginsModule])) {
                        echo json_encode(DATA_FORMAT_NOT_GOOD);
                        die;
                    }

                    if (gettype($valuePlugins) === "boolean") {
                        if (gettype(DEFAULT_DATA[$module][$pluginsModule][$pluginsKey]) === "boolean")  $dataConverted[$module][$pluginsModule][$pluginsKey] = ($valuePlugins) ? 1 : 0;
                        else                                                                            $dataConverted[$module][$pluginsModule][$pluginsKey] = $valuePlugins;
                    } else {
                        if (gettype(DEFAULT_DATA[$module][$pluginsModule][$pluginsKey]) === "boolean")  $dataConverted[$module][$pluginsModule][$pluginsKey] = ($valuePlugins);
                        else                                                                            $dataConverted[$module][$pluginsModule][$pluginsKey] = $valuePlugins;
                    }
                }
            }
        }
    }

    return $dataConverted;
}