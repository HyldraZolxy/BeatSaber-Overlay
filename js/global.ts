export namespace GlobalVariable {

    /////////////////////
    // GLOBAL VARIABLE //
    /////////////////////
    export const URL_NAV = window.location.search;
    export const URL_TOKEN_SCRIPT = "./php/token.php";
    export const BEATSAVER_API_URL = "https://api.beatsaver.com/";
    export const SCORESABER_API_PROXY_URL = "./php/scoreSaberProxy.php";
    export enum DISPLAY_POSITION_NAME {
        TOP_LEFT,
        TOP_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_RIGHT
    }
    export const DISPLAY_POSITION = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
    ];

    ////////////////////////////////
    // DEBUG MODE GLOBAL VARIABLE //
    ////////////////////////////////
    // export var DEBUG_MESSAGE = {}; // FOR FUTUR

    ////////////////////////////////
    // PARAMETERS GLOBAL VARIABLE //
    ////////////////////////////////
    export const TOKEN_LENGTH = 32;
    export const URL_PARAMS_ALLOWED = [
        //"token",  // Identifier of client configuration

        "ip",       // Local IP or External IP
        "pid",      // Player ID from ScoreSaber

        //"pcsk",   // Skin of Player Card
        "pcpos",    // Position of Player Card
        "pcsc",     // Scale of Player Card

        "scsk",     // Skin of Song Card
        "scpos",    // Position of Song Card
        "scsc"      // Scale of Song Card
    ];

    /////////////////////////////////
    // PLAYER CARD GLOBAL VARIABLE //
    /////////////////////////////////
    export enum SKIN_NAME_PLAYER_CARD {
        DEFAULT
    }
    export const SKIN_PLAYER_CARD = [
        "default"
    ];
    export const SkinFilesPlayerCard = {
        "default": ["index.html", "style.css"]
    };

    //////////////////////////////
    // SONGCARD GLOBAL VARIABLE //
    //////////////////////////////
    export const MS_TIMER = 100;
    export enum SKIN_NAME_SONG_CARD {
        DEFAULT,
        FREEMIUM,
        RESELIM
    }
    export const SKIN_SONG_CARD = [
        "default",
        "freemium",
        "reselim"
    ];
    export const SkinFilesSongCard = {
        default: ["index.html", "style.css"],
        freemium: ["index.html", "style.css"],
        reselim: ["index.html", "style.css"]
    };

    /////////////////////////////
    // PLUGINS GLOBAL VARIABLE //
    /////////////////////////////
    export const TIMEOUT_MS = 3500;
    export const TIME_BEFORE_RETRY = 10000;
    export const RETRY_NUMBER = 2;

    export const BeatSaberPlus = {
        port: "2947",
        entry: "/socket"
    };

    export const HttpStatus = {
        port: "6557",
        entry: "/socket"
    };

    export const DataPuller = {
        port: "2946",
        entry: "/BSDataPuller/",
        endPoint: {
            mapData: "MapData",
            liveData: "LiveData"
        }
    };

    export enum WEBSOCKET_STATE {
        CONNECTED,
        DISCONNECTED,
        ERROR
    }

    ///////////////////////////
    // SETUP GLOBAL VARIABLE //
    ///////////////////////////
    export const WAIT_TIME = 500;
    export enum SKIN_NAME_SETUP {
        DEFAULT
    }
    export const SKIN_SETUP = [
        "default"
    ];
    export const SkinFilesSetup = {
        home: ["home.html", "style.css"],
        general: ["general.html", "style.css"],
        playerCard: ["playerCard.html", "style.css"],
        songCard: ["songCard.html", "style.css"],
        empty: []
    };

    ////////////////////////
    // UI GLOBAL VARIABLE //
    ////////////////////////
    export const FPS_REFRESH_TICK = 1000 / 10;
}