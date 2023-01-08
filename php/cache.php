<?php
/**
 * Cache System
 * Description: That system cache the data from php result, it allows to avoid API calls that are not useful especially when the API have rate limits
 *
 * Thanks: @HardCPP | https://github.com/hardcpp
 * Adapted for PHP 8
 */
class Cache_System {
    private string $CACHE_FOLDER = "Cache";

    //////////////////////
    /// Private Methods //
    //////////////////////

    /**
     * Get cache filename by hashing the ID
     */
    private function GetCacheHash(string $p_ID): string {
        return sha1("Hyldraverlay_" . $p_ID);
    }

    /**
     * Get cache file path from hash
     */
    private function GetCachePath(string $p_Hash): string {
        return substr($p_Hash, 0, 2) . "/" . substr($p_Hash, 2, 2) . "/";
    }

    /**
     * Create recursively directories
     */
    private function CreateDirectories(string $p_DirectoryName): void {
        if (!is_dir($p_DirectoryName)) mkdir($p_DirectoryName, 0775, true);
    }

    /////////////////////
    /// Public Methods //
    /////////////////////

    /**
     * Set the cache
     */
    public function Set(string $p_ID, string $p_Data): void {
        $l_CacheID  = $this->GetCacheHash($p_ID);
        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        $this->CreateDirectories($l_FilePath);

        if (is_file($l_FilePath . $l_FileName)) unlink($l_FilePath . $l_FileName);

        $l_Content      = str_replace("'", "\'", serialize($p_Data));
        $l_Content      = "<?php" . "\n" . "$" . "cache = unserialize('" . $l_Content . "')" . ";";
        $l_FileInstance = fopen($l_FilePath . $l_FileName, "w");

        flock($l_FileInstance, LOCK_EX);
        fwrite($l_FileInstance, $l_Content);
        fflush($l_FileInstance);
        flock($l_FileInstance, LOCK_UN);
        fclose($l_FileInstance);
    }

    /**
     * Get the cache
     */
    public function Get(string $p_ID): null|string {
        $l_CacheID  = $this->GetCacheHash($p_ID);
        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        if (!file_exists($l_FilePath . $l_FileName)) {
            if (is_file($l_FilePath . $l_FileName)) unlink($l_FilePath . $l_FileName);

            return null;
        }

        @include($l_FilePath . $l_FileName);
        return @$cache;
    }

    /**
     * Does the cache need a rebuild ?
     */
    public function NeedRebuild(string $p_ID, float|int $p_ExpireSeconds): bool {
        $l_CacheID  = $this->GetCacheHash($p_ID);
        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        if (!is_file($l_FilePath . $l_FileName)) return true;

        if (is_file($l_FilePath . $l_FileName) && (time() - filemtime($l_FilePath . $l_FileName)) > $p_ExpireSeconds) return true;

        return false;
    }
}