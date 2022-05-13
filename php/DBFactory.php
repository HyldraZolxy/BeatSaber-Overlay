<?php
class DBFactory {
    protected $_configuration = array(
            "host" => "localhost",
            "dbName" => "overlay",
            "user" => "root",
            "pass" => ""
        ),
        $_PDOConnection;

    /**
     * Constructor
     */
    public function __construct() {
        $this->PDOConnection();
    }

    // SETTERS //

    /**
     * PDO Connection
     * @return void
     */
    private function PDOConnection() {
        $this->_PDOConnection = new PDO("mysql:host=" . $this->_configuration["host"] . ";dbname=" . $this->_configuration["dbName"] . ";charset=utf8", $this->_configuration["user"], $this->_configuration["pass"], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    }

    // GETTERS //

    /**
     * return PDOConnection
     * @return PDO
     */
    public function getPDO() {
        return $this->_PDOConnection;
    }
}