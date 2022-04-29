<?php
/////////////
// REQUIRE //
/////////////
require_once "./DBFactory.php";
require_once "./SQLQuery.php";

////////////////
// CLASS INIT //
////////////////
$DBFactory = new DBFactory();
$SQLQuery = new SqlQuery($DBFactory->getPDO());

/////////////////////
// GLOBAL VARIABLE //
/////////////////////
define("INPUT", json_decode(file_get_contents("php://input"), true));
define("TOKEN", isExistsOrNotEmpty(INPUT, "token"));
define("METHOD", isExistsOrNotEmpty(INPUT, "function"));
define("DATA", isExistsOrNotEmpty(INPUT, "data"));

const TOKEN_LENGTH = 32;
const TOKEN_ALLOWED_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~";

///////////////////
// ERROR MESSAGE //
///////////////////
const TOKEN_EMPTY_OR_NOT_AVAILABLE = '{ "errorMessage": "Token not available or empty" }';
const TOKEN_FORMAT_NOT_GOOD = '{ "errorMessage": "Token format is not good" }';
const TOKEN_NOT_FOUND = '{ "errorMessage": "Token not found in database" }';
const TOKEN_NOT_FOUND_AFTER_SAVE = '{ "errorMessage": "Token not found in database after save" }';

const METHOD_EMPTY_OR_NOT_AVAILABLE = '{ "errorMessage": "Function not available or empty" }';
const METHOD_NOT_SUPPORTED_OR_CODED = '{ "errorMessage": "Function not supported or coded" }';

const DATA_EMPTY_OR_NOT_AVAILABLE = '{ "errorMessage": "Data not available or empty" }';
const DATA_FORMAT_NOT_GOOD = '{ "errorMessage": "Data format is not good" }';

/////////////////////
// SUCCESS MESSAGE //
/////////////////////
const DATA_READ_SUCCESS = array("successMessage" => "Data successfully read in database");
const DATA_SAVE_SUCCESS = array("successMessage" => "Data successfully added in database");
const DATA_UPDATE_SUCCESS = '{ "successMessage": "Data successfully updated in database" }';

//////////////////
// DEFAULT DATA //
//////////////////
const DEFAULT_DATA = array(
    "playerCard" => array(
        "alwaysShown" => false,
        "position" => array(
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
        ),
        "skin" => array(
            "default"
        ),
        "playerId" => array(
            "0"
        ),
    ),
    "songCard" => array(
        "alwaysShown" => false,
        "position" => array(
            "top-left",
            "top-right",
            "bottom-left",
            "bottom-right"
        ),
        "skin" => array(
            "default",
            "freemium"
        )
    )
);

///////////
// LOGIC //
///////////
eventFunction(METHOD, $SQLQuery);

//////////////
// FUNCTION //
//////////////
/**
 * @param array $input
 * @param String $name
 * @return String|Array|null
 */
function isExistsOrNotEmpty(Array $input, String $name): array|string|null {
    if (isset($input[$name]) && !empty($input[$name])) {
        return $input[$name];
    } else {
        return null;
    }
}

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
            if (empty($method)) {
                echo METHOD_EMPTY_OR_NOT_AVAILABLE;
                die;
            }

            echo METHOD_NOT_SUPPORTED_OR_CODED;
            die;
    }
}

/**
 * @param $SQLQuery
 * @return string
 */
function tokenMaking($SQLQuery): string {
    while(true) {
        $token = "";
        $token_length_input = strlen(TOKEN_ALLOWED_CHARS);

        for ($i = 0; $i < TOKEN_LENGTH; $i++) {
            $random_char = TOKEN_ALLOWED_CHARS[mt_rand(0, $token_length_input - 1)];
            $token .= $random_char;
        }

        if (strlen($token) == TOKEN_LENGTH || !preg_match("/[^-~._\w]/", $token)) {
            if (tokenExists($SQLQuery, $token) == null) {
                return $token;
            }
        }
    }
}

/**
 * @return bool|void
 */
function tokenFormat($token) {
    if (empty($token)) {
        echo TOKEN_EMPTY_OR_NOT_AVAILABLE;
        die;
    }

    if (strlen($token) != TOKEN_LENGTH || preg_match("/[^-~._\w]/", $token)) {
        echo TOKEN_FORMAT_NOT_GOOD;
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
    $where = array(
        "token" => $token
    );

    $SQLQuery->sqlSelect($fields, "token", $where);

    if ($SQLQuery->sqlCount() == "0") {
        return null;
    }

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

        if ($tokenId == null) {
            echo TOKEN_NOT_FOUND;
            die;
        }

        $fields = array("*");
        $where = array(
            "id" => $tokenId
        );

        $data = array();

        $SQLQuery->sqlSelect($fields, "playercard", $where);
        $data["playerCard"] = $SQLQuery->sqlFetch();
        unset($data["playerCard"]["id"]);

        $SQLQuery->sqlSelect($fields, "songcard", $where);
        $data["songCard"] = $SQLQuery->sqlFetch();
        unset($data["songCard"]["id"]);

        $data = dataParse($data);

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
        $data = dataParse(DATA);

        $dataToken = array(
            "token" => $token
        );
        $SQLQuery->sqlAdd($dataToken, "token");

        $tokenId = tokenExists($SQLQuery, $token);
        if($tokenId == null) {
            echo TOKEN_NOT_FOUND_AFTER_SAVE;
            die;
        }

        $data["playerCard"] += array("id" => $tokenId);
        $data["songCard"] += array("id" => $tokenId);

        $SQLQuery->sqlAdd($data["playerCard"], "playercard");
        $SQLQuery->sqlAdd($data["songCard"], "songcard");

        unset($data["playerCard"]["id"]);
        unset($data["songCard"]["id"]);

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

        if ($tokenId == null) {
            echo TOKEN_NOT_FOUND;
            die;
        }

        if (dataExists(DATA)) {
            $data = dataParse(DATA);

            $SQLQuery->sqlUpdate($tokenId, $data["playerCard"], "playercard");
            $SQLQuery->sqlUpdate($tokenId, $data["songCard"], "songcard");

            echo DATA_UPDATE_SUCCESS;
        }
    }
}

/**
 * @param $data
 * @return bool|void
 */
function dataExists($data) {
    if (empty($data) && !is_array($data)) {
        echo DATA_EMPTY_OR_NOT_AVAILABLE;
        die;
    }

    return true;
}

/**
 * @param $data
 * @return mixed|void
 */
function dataParse($data) {
    foreach($data as $key => $value) {
        if (!array_key_exists($key, DEFAULT_DATA)) {
            echo DATA_FORMAT_NOT_GOOD;
            die;
        }

        foreach($value as $key2 => $value2) {
            // REMOVED BREAK TO OPTIMIZE THE LOOP
            switch($key) {
                case "playerCard":
                case "songCard":
                    switch($key2) {
                        case "firstTimeUsed":
                        case "alwaysShown":
                            if (gettype($value2) != "boolean") {
                                $data[$key][$key2] = DEFAULT_DATA[$key][$key2];
                            }
                            break;
                        case "position":
                        case "skin":
                        case "playerId":
                            if (!in_array($value2, DEFAULT_DATA[$key][$key2])) {
                                $data[$key][$key2] = DEFAULT_DATA[$key][$key2][0];
                            }
                            break;
                        case "scale":
                            if ((gettype($value2) != "double") && (gettype($value2) != "integer")) {
                                $data[$key][$key2] = DEFAULT_DATA[$key][$key2];
                            }
                            break;
                        default:
                            unset($data[$key][$key2]);
                            break;
                    }
                    break;
                default:
                    echo DATA_FORMAT_NOT_GOOD;
                    die;
            }
        }
    }

    return $data;
}