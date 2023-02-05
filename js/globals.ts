export namespace Globals {

    //////////////////////
    // Global Variables //
    //////////////////////

    // Console Log
    export const TITLE_LOG      = "color: purple;   font-size: 1.5em;   background-color: white;    padding: 2px 4px; border-radius: 2px;";
    export const WARN_LOG       = "color: white;    font-size: 1em;     background-color: orange;   padding: 2px 4px; border-radius: 2px;";
    export const ERROR_LOG      = "color: white;    font-size: 1em;     background-color: red;      padding: 2px 4px; border-radius: 2px;";
    export const SUCCESS_LOG    = "color: white;    font-size: 1em;     background-color: green;    padding: 2px 4px; border-radius: 2px;";
    export const INFO_LOG       = "color: white;    font-size: 1em;     background-color: blue;     padding: 2px 4px; border-radius: 2px;";

    // Overlay modules
    export enum E_MODULES {
        PLAYERCARD,
        SONGCARD,
        LEADERBOARD,
        MENU_SETUP,
        OPT_SETUP
    }

    // Scoring System in the games
    export enum E_SCORING_SYSTEM {
        SCORESABER = 1, // BeatSaber
        BEATLEADER  // BeatSaber
    }

    // Games and plugins supported by the overlay
    export interface I_gamesSupported {
        [key: string]: boolean;

        beatSaber     : boolean; // BeatSaber is enabled ?
        synthRiders   : boolean; // SynthRiders is enabled ?
        audioTrip     : boolean; // AudioTrip is enabled ?
        audica        : boolean; // Audica is enabled ?
    }
    export interface I_pluginsSupported {
        [key: string]: {}

        beatSaberPlugins: {
            [key: string]: boolean;

            beatSaberPlus             : boolean; // https://github.com/hardcpp/BeatSaberPlus
            beatSaberPlusLeaderboard  : boolean; // https://github.com/hardcpp/BeatSaberPlus
            dataPuller                : boolean; // https://github.com/ReadieFur/BSDataPuller
            httpSiraStatus            : boolean; // https://github.com/denpadokei/HttpSiraStatus
        }

        synthRidersPlugins: {
            [key: string]: boolean;

            synthRiders : boolean; // https://github.com/KK964/SynthRiders-Websockets-Mod
        }

        audioTripPlugins: {
            [key: string]: boolean;

            audioTrip : boolean; // https://github.com/hn3000/ats-types
        }

        audicaPlugins: {
            [key: string]: boolean;

            audica : boolean; // https://github.com/steglasaurous/audica-websocket-server
        }
    }

    // Plugins and Mods for plugins system
    export enum WEBSOCKET_STATUS {
        DISCONNECTED,
        CONNECTED
    }
    export enum WEBSOCKET_MODS {
        NONE,
        BSPLUS,
        DATAPULLER,
        HTTPSIRASTATUS,
        SYNTHRIDERS,
        AUDIOTRIP,
        AUDICA
    }

    // General
    export const URI_NAV_SEARCH     = window.location.search;
    export const MS_TIMER           = 100;
    export const TOKEN_LENGTH       = 32;
    export const TIME_BEFORE_RETRY  = 5000;
    export const DEFAULT_PLAYERID   = "0";

    // Proxy files or API URIs
    export const URI_TOKEN_SCRIPT               = "./php/token.php";
    export const SCORESABER_API_PROXY_URI       = "./php/scoreSaberProxy.php";
    export const BEATLEADER_API_PROXY_URI       = "./php/beatLeaderPlayerProxy.php";
    export const BEATLEADER_SONG_API_PROXY_URI  = "./php/beatLeaderSongProxy.php";
    export const BEATSAVER_API_URI              = "https://api.beatsaver.com";
    export const AUDIO_TRIP_SONG_PROXY          = "./php/audioTripProxy.php";

    //////////////////
    // UI Variables //
    //////////////////

    // FPS Refresh of the module data
    export const FPS_REFRESH = 1000 / 5;

    // Possible module position (PlayerCard, SongCard, etc ...)
    export enum E_POSITION {
        TOP_LEFT,
        TOP_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_RIGHT
    }
    export const cssPosition = ["top-left", "top-right", "bottom-left", "bottom-right"];

    // Interfaced by E_MODULES
    // Skins modules available
    export const SKIN_AVAILABLE = {
        // Skin for E_MODULES.PLAYERCARD
        0:  {
            default : ["./skins/playerCard/default/", "index.html", "style.css"],
            freemium: ["./skins/playerCard/freemium/", "index.html", "style.css"]
        },

        // Skin for E_MODULES.SONGCARD
        1: {
            default : ["./skins/songCard/default/", "index.html", "style.css"],
            freemium: ["./skins/songCard/freemium/", "index.html", "style.css"],
            reselim : ["./skins/songCard/reselim/", "index.html", "style.css"],
            dietah  : ["./skins/songCard/dietah/", "index.html", "style.css"]
        },

        // Skin for E_MODULES.LEADERBOARD
        2: {
            default : ["./skins/leaderboard/default/", "index.html", "rows.html", "style.css"],
            minify  : ["./skins/leaderboard/minify/", "index.html", "rows.html", "style.css"]
        },

        // Skin for E_MODULES.MENU_SETUP
        3: {
            default : ["./skins/setup/default/", "indexMenu.html", "generalMenu.html", "gamesAndPluginsMenu.html", "overlayMenu.html", "style.css"]
        },
        // Skin for E_MODULES.OPT_SETUP
        4: {
            default : ["./skins/setup/default/", "indexOptions.html", "generalOptions.html", "gamesAndPluginsOptions.html", "overlayOptions.html", "playerCardOptions.html", "songCardOptions.html", "leaderboardOptions.html", "style.css"]
        }
    };

    //////////////////////////
    // PlayerCard Variables //
    //////////////////////////

    export interface I_playerCard {
        disabled        : boolean;  // PlayerCard is disabled ?
        display         : boolean;  // PlayerCard is displayed ?
        alwaysEnabled   : boolean;  // PlayerCard is always displayed ?
        needUpdate      : boolean;  // PlayerCard need an update ?
        endedUpdate     : boolean;  // PlayerCard is updated ?
        skin            : string;   // Skin of PlayerCard (see SKIN_AVAILABLE.playerCard)
        position        : number;   // Position of PlayerCard (see DISPLAY_POSITION)
        scale           : number;   // Scale of PlayerCard
        pos_x           : number;   // Position of PlayerCard on the X axis
        pos_y           : number;   // Position of PlayerCard on the Y axis
        scoringSystem   : number;   // ScoringSystem used (see SCORING_SYSTEM)

        playerID        : string;   // ScoreSaber ID of the player
        playerName      : string;   // ScoreSaber name of the player
        playerCountry   : string;   // ScoreSaber country of the player
        avatar          : string;   // Avatar of the player
        playerFlag      : string;   // Country flag of the player (./pictures/country/COUNTRYCODE.svg)
        topWorld        : string;   // World rank of the player (String for comma support)
        topCountry      : string;   // Country rank if the player (String for comma support)
        performancePoint: string;   // PP of the player (Nice again :OwO:) (String for comma support)
    }

    ////////////////////////
    // SongCard Variables //
    ////////////////////////

    export interface I_songCard {
        disabled            : boolean;  // SongCard is disabled ?
        display             : boolean;  // SongCard is displayed ?
        alwaysEnabled       : boolean;  // SongCard is always displayed ?
        needUpdate          : boolean;  // SongCard need an update ?
        endedUpdate         : boolean;  // SongCard is updated ?
        position            : number;   // Position of SongCard (see DISPLAY_POSITION)
        skin                : string;   // Skin of SongCard (see SKIN_AVAILABLE.songCard)
        scale               : number;   // Scale of SongCard
        pos_x               : number;   // Position of SongCard on the X axis
        pos_y               : number;   // Position of SongCard on the Y axis
        scoringSystem       : number;   // ScoringSystem used (see SCORING_SYSTEM)

        displayMiss         : boolean;  // SongCard display miss count ?
        bigBSR              : boolean;  // SongCard display the BSR bigger ?
        ppMax               : boolean;  // SongCard display the max PP of the map ?
        ppEstimated         : boolean;  // SongCard display the estimated PP of the actual map and score ?

        started             : boolean;  // Song is started ?
        inProgress          : boolean;  // Song is in progress ?
        paused              : boolean;  // Song is paused ?
        finished            : boolean;  // Song is finished ?

        cover               : string;   // Cover of the actual song
        title               : string;   // Title of the actual song
        subTitle            : string;   // Subtitle of the actual song
        mapper              : string;   // Mapper of the actual song
        author              : string;   // Author of the actual song

        bsrKey              : string;   // BSR key of the actual song
        hashMap             : string;   // Hash ID of the actual song
        bpm                 : number;   // BPM of the actual song

        difficulty          : string;   // Difficulty of the actual song (Easy, Normal, Hard, Expert, Expert+)
        difficultyClass     : string;   // Class Difficulty of the actual song (Easy, Normal, Hard, Expert, ExpertPlus)

        ranked              : boolean;  // Song is ranked ?
        qualified           : boolean;  // Song is qualified ?
        ppByStars           : number;   // PP max of the actual song

        totalTime           : number;   // Time length of the actual song
        totalTimeToLetters  : string;   // Total time in letter of the actual song

        speedModifier       : number;   // Time multiplier of the actual song (If player play the map in 125%, multiplier is 1.25)
    }
    export interface I_songCardUpdate {
        endedUpdate             : boolean;  // SongCard Performance is updated ?
        time                    : number;   // Actual time of the actual song
        timeToLetters           : string;   // Time in letter of the actual song
        timeToPercentage        : number;   // Time in percentage of the actual song

        accuracy                : number;   // Player accuracy of the actual song
        accuracyToLetters       : string;   // Player accuracy in letter of the actual song
        accuracyToLetterClass   : string;   // Player accuracy in class of the actual song

        score                   : string;   // Player score of the actual song (In string for commas support)
        ppActual                : number;   // Player PP value of the actual song
        combo                   : number;   // Player combo of the actual song
        miss                    : number;   // Player miss of the actual song

        health                  : number;   // Player health of the actual song
    }
}