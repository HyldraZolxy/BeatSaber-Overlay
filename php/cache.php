<?php
/// Cache system
/// Thanks to HardCPP for that Class
class Cache_System
{
    private $CACHE_FOLDER = "Cache";

    //////////////////////////////////////
    /// Set cache
    /// @p_ID               : Cache name
    /// @p_Data             : Cache data
    /// @p_ExpireSeconds    : Expiracy in seconds
    public function Set($p_ID, $p_Data)
    {
        $l_CacheID = $this->GetCacheHash($p_ID);

        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        $this->CreateDirectories($l_FilePath);

        if (is_file($l_FilePath . $l_FileName))
            unlink($l_FilePath . $l_FileName);

        $l_Content = str_replace("'", "\'", serialize($p_Data));
        $l_Content = '<?php' . "\n" . '$' . 'Cache = unserialize(\'' .  $l_Content . '\');' . "\n" . '?>';

        $l_FileInstance = fopen($l_FilePath . $l_FileName, 'w');

        flock($l_FileInstance, LOCK_EX);
        fwrite($l_FileInstance, $l_Content);
        fflush($l_FileInstance);
        flock($l_FileInstance, LOCK_UN);
        fclose($l_FileInstance);
    }

    /// Get cache
    /// @p_ID               : Cache name
    /// @p_ExpireSeconds    : Expiracy in seconds
    /// @p_NoExpire         : Ignore expiration
    public function Get($p_ID)
    {
        $l_CacheID = $this->GetCacheHash($p_ID);

        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        if (!file_exists($l_FilePath . $l_FileName))
        {
            if (is_file($l_FilePath . $l_FileName))
                unlink($l_FilePath . $l_FileName);

            return null;
        }

        @include($l_FilePath . $l_FileName);
        return @$Cache;
    }

    /// Does the cache need a rebuild ?
    /// @p_ID               : Cache name
    /// @p_ExpireSeconds    : Expiracy in seconds
    public function NeedRebuild($p_ID, $p_ExpireSeconds)
    {
        $l_CacheID = $this->GetCacheHash($p_ID);

        $l_FilePath = $this->CACHE_FOLDER . "/" . $this->GetCachePath($l_CacheID);
        $l_FileName = $l_CacheID . ".php";

        if (!is_file($l_FilePath . $l_FileName))
            return true;

        if (is_file($l_FilePath . $l_FileName) && (time() - filemtime($l_FilePath . $l_FileName)) > $p_ExpireSeconds)
            return true;

        return false;
    }

    //////////////////////////////////////
    /// Get cache filename by hashing the ID
    /// @p_ID : Cache ID
    private function GetCacheHash($p_ID)
    {
        return sha1("Hyldraverlay_" . $p_ID);
    }

    /// Get cache file path from hash
    /// @p_Hash : Cache hash
    private function GetCachePath($p_Hash)
    {
        return substr($p_Hash, 0, 2) . "/" . substr($p_Hash, 2, 2) . "/";
    }

    /// Create recursively directories
    /// @p_DirectoryName : Path to create
    private function CreateDirectories($p_DirectoryName)
    {
        if (!is_dir($p_DirectoryName))
        {
            mkdir($p_DirectoryName, 0775, true);
            return true;
        }

        return false;
    }
}

/// Init
$cache_system = new Cache_System();