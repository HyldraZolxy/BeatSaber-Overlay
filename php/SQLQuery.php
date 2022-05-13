<?php
class SqlQuery {
    protected $_PDOConnection,
              $_result;

    /**
     * Constructor
     * @param PDO
     */
    public function __construct($PDOConnection) {
        $this->_PDOConnection = $PDOConnection;
    }

    // SETTERS //

    /**
     * Adding a data in database
     * @param array
     * @param string
     */
    public function sqlAdd($data, $table): void {
        foreach ($data as $key => $value) {
            $keys[] = $key;
            $values[] = $value;
        }

        $sql = "INSERT INTO " . $table . " (";
        for ($i = 0; $i < count($data); $i++) {
            if ($i == count($data) - 1) {
                $sql .= $keys[$i] . ") ";
            } else {
                $sql .= $keys[$i] . ", ";
            }
        }

        $sql .= " VALUES (";
        for ($i = 0; $i < count($data); $i++) {
            if ($i == count($data) - 1) {
                $sql .= ":" . $keys[$i] . ")";
            } else {
                $sql .= ":" . $keys[$i] . ", ";
            }
        }

        $sqlAdd = $this->_PDOConnection->prepare($sql);
        for ($i = 0; $i < count($data); $i++) {
            $sqlAdd->bindValue($keys[$i], $values[$i], PDO::PARAM_STR);
        }

        $sqlAdd->execute();

        $this->_result = $sqlAdd;
    }

    /**
     * Deleting a data in database
     * @param int
     * @param string
     */
    public function sqlDelete($id, $table): void {
        $sql = "DELETE FROM " . $table . " WHERE id = :id";
        $sqlDelete = $this->_PDOConnection->prepare($sql);
        $sqlDelete->bindValue(":id", $id, PDO::PARAM_INT);

        $sqlDelete->execute();

        $this->_result = $sqlDelete;
    }

    /**
     * Updating a data in database
     * @param int - $id ID of data
     * @param array - $data The data
     * @param string - $table The name of table
     */
    public function sqlUpdate($id, $data, $table): void {
        foreach ($data as $key => $value) {
            $keys[] = $key;
            $values[] = $value;
        }

        $sql = "UPDATE " . $table . " SET ";
        for ($i = 0; $i < count($data); $i++) {
            if (count($data) > 1) {
                if ($i == count($data) - 1) {
                    $sql .= $keys[$i] . " = :" . $keys[$i] . " ";
                } else {
                    $sql .= $keys[$i] . " = :" . $keys[$i] . ", ";
                }
            } else {
                $sql .= $keys[$i] . " = :" . $keys[$i] . " ";
            }
        }

        $sql .= "WHERE id = :id";

        $sqlUpdate = $this->_PDOConnection->prepare($sql);
        for ($i = 0; $i < count($data); $i++) {
            $sqlUpdate->bindValue($keys[$i], $values[$i], PDO::PARAM_STR);
        }

        $sqlUpdate->bindValue(":id", $id, PDO::PARAM_INT);

        $sqlUpdate->execute();

        $this->_result = $sqlUpdate;
    }

    /**
     * Selecting a data in database
     * @param array - $champs Cols of Database
     * @param string - $table The name of table
     * @param array - $where The data of Database
     * @param string - $and Conditions of selecting
     * @param array - $order Order of selecting
     * @param array - $limit Limit of selecting
     * @param string - $operator The operator for selecting data (=, >, <, >=, etc ...)
     */
    public function sqlSelect($champs, $table, $where = NULL, $and = NULL, $order = NULL, $limit = NULL, $operator = "="): void {
        foreach ($champs as $cKey) {
            $cKeys[] = $cKey;
        }

        $sql = "SELECT ";
        for ($i = 0; $i < count($champs); $i++) {
            if (count($champs) > 1) {
                if ($i == count($champs) - 1) {
                    $sql .= $cKeys[$i] . " ";
                } else {
                    $sql .= $cKeys[$i] . ", ";
                }
            } else {
                $sql .= $cKeys[$i] . " ";
            }
        }

        $sql .= "FROM " . $table;

        if ($where != NULL) {
            $sql .= " WHERE ";

            foreach ($where as $wKey => $wValue) {
                $wKeys[] = $wKey;
                $wValues[] = $wValue;
            }

            for ($i = 0; $i < count($where); $i++) {
                if (count($where) > 1) {
                    if ($i == count($where) - 1) {
                        $sql .= $wKeys[$i] . " " . $operator . " :" . $wKeys[$i] . " ";
                    } else {
                        $sql .= $wKeys[$i] . " " . $operator . " :" . $wKeys[$i] . " " . $and ." ";
                    }
                } else {
                    $sql .= $wKeys[$i] . " " . $operator . " :" . $wKeys[$i] . " ";
                }
            }
        }

        if ($order != NULL) {
            $sql .= " ORDER BY ";

            foreach ($order as $oKey => $oValue) {
                $oKeys[] = $oKey;
                $oValues[] = $oValue;
            }

            for ($i = 0; $i < count($order); $i++) {
                if (count($order) > 1) {
                    if ($i == count($order) - 1) {
                        if (!empty($oValues[$i])) {
                            $sql .= $oKeys[$i] . " " . $oValues[$i];
                        } else {
                            $sql .= $oKeys[$i];
                        }
                    } else {
                        if (!empty($oValues[$i])) {
                            $sql .= $oKeys[$i] . " " . $oValues[$i] . ", ";
                        } else {
                            $sql .= $oKeys[$i] . ", ";
                        }

                    }
                } else {
                    $sql .= $oKeys[$i] . " ";
                }
            }
        }

        if ($limit != NULL) {
            $sql .= " LIMIT ";

            foreach ($limit as $lValue) {
                $lValues[] = $lValue;
            }

            for ($i = 0; $i < count($limit); $i++) {
                if (count($limit) > 1) {
                    if ($i == count($limit) - 1) {
                        $sql .= $lValues[$i];
                    } else {
                        $sql .= $lValues[$i] . ", ";
                    }
                } else {
                    $sql .= $lValues[$i];
                }
            }
        }

        $sqlSelect = $this->_PDOConnection->prepare($sql);
        if ($where != NULL) {
            for ($i = 0; $i < count($where); $i++) {
                $sqlSelect->bindValue($wKeys[$i], $wValues[$i], PDO::PARAM_STR);
            }
        }

        $sqlSelect->execute();

        $this->_result = $sqlSelect;
    }

    // GETTERS //

    /**
     * Fetching a data
     * @return array
     */
    public function sqlFetch(): array {
        return $this->_result->fetch(PDO::FETCH_ASSOC);
    }

    /**
     * Counting a data
     * @return int
     */
    public function sqlCount(): int {
        return $this->_result->rowCount();
    }
}