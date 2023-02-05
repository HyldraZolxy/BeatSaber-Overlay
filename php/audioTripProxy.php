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

$_DEFAULT_MSG_ERROR     = '{ "errorMessage": "Song not found" }';

if (!isset($_GET["hash"]) || $_GET["hash"] === "") {
    echo $_DEFAULT_MSG_ERROR;
    return;
}

$hash = $_GET["hash"];

$fields = array("coverLink");
$where  = array(
    "hash" => $hash
);

$data = array();

$SQLQuery->sqlSelect($fields, "audioTrip_song", $where);

if ($SQLQuery->sqlCount() === 0) {
    echo json_encode($_DEFAULT_MSG_ERROR);
    die;
}

$data = $SQLQuery->sqlFetch();

echo json_encode($data);