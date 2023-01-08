<?php
class DBFactory {
    private PDO $_PDOConnection;

    protected array $_configuration = array(
        "host"      => "localhost",
        "dbName"    => "overlay_multigames",
        "user"      => "root",
        "pass"      => ""
    );

    /**
     * Constructor
     */
    public function __construct() {
        $this->PDOConnection();
    }

    /////////////
    // Setters //
    /////////////

    /**
     * PDO Connection
     * @return void
     */
    private function PDOConnection(): void {
        $this->_PDOConnection = new PDO("mysql:host=" . $this->_configuration["host"] . ";dbname=" . $this->_configuration["dbName"] . ";charset=utf8", $this->_configuration["user"], $this->_configuration["pass"], array(PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION));
    }

    /////////////
    // Getters //
    /////////////

    /**
     * return PDOConnection
     * @return PDO
     */
    public function getPDO(): PDO {
        return $this->_PDOConnection;
    }
}