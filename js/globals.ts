export namespace Globals {
    //////////////////////
    // Global Variables //
    //////////////////////

    // Modules
    export enum E_MODULES {
        PLAYERCARD,
        SONGCARD,
        LEADERBOARD,
        MENU_SETUP,
        OPT_SETUP
    }

    // Scoring system
    export enum E_SCORING_SYSTEM {
        NONE,
        SCORESABER,
        BEATLEADER,
        BOTH /// TODO: FUTUR PURPOSE
    }

    // Games and Plugins
    export interface I_gamesSupported {
        g_beatSaber     : boolean;  // Beat Saber is enabled ?
        g_synthRiders   : boolean;  // Synth Riders is enabled ?
        g_audioTrip     : boolean;  // Audio Trip is enabled ?
        g_audica        : boolean;  // Audica is enabled ?
    }
    export interface I_pluginsSupported {
        // Beat Saber
        p_beatSaberPlus             : boolean;  // BeatSaberPlus is enabled ?
        p_beatSaberPlusLeaderboard  : boolean;  // BeatSaberPlus Leaderboard is enabled ?
        p_dataPuller                : boolean;  // DataPuller is enabled ?
        p_httpSiraStatus            : boolean;  // HttpStatus is enabled ?

        // Synth Riders
        p_synthRiders               : boolean;  // Synth Riders is enabled ?

        // Audio Trip
        p_audioTrip                 : boolean;  // Audio Trip is enabled ?

        // Audica
        p_audica                    : boolean;  // Audica is enabled ?
    }
    export interface I_gamesSupportedJSON {
        games_data: {
            beatSaber   : boolean;  // Beat Saber is enabled ?
            synthRiders : boolean;  // Synth Riders is enabled ?
            audioTrip   : boolean;  // Audio Trip is enabled ?
            audica      : boolean;  // Audica is enabled ?
        }
    }
    export interface I_pluginsSupportedJSON {
        plugins_data: {
            // Beat Saber
            beatSaberPlus           : boolean;  // BeatSaberPlus is enabled ?
            beatSaberPlusLeaderboard: boolean;  // BeatSaberPlus Leaderboard is enabled ?
            dataPuller              : boolean;  // DataPuller is enabled ?
            httpSiraStatus          : boolean;  // HttpStatus is enabled ?

            // Synth Riders
            synthRiders             : boolean;  // Synth Riders is enabled ?

            // Audio Trip
            audioTrip               : boolean;  // Audio Trip is enabled ?

            // Audica
            audica                  : boolean;  // Audica is enabled ?
        }
    }

    // Skin available interfaced by enum E_MODULES
    export interface I_skinSupported {
        // PlayerCard
        0: {
            [key: string]   : string[];

            default         : string[];
            freemium        : string[];
        }

        // SongCard
        1: {
            [key: string]   : string[];

            default         : string[];
            freemium        : string[];
            reselim         : string[];
            dietah          : string[];
        }

        // Leaderboard
        2: {
            [key: string]   : string[];

            default         : string[];
        }

        // Setup
        3: {
            [key: string]   : string[];

            default         : string[];
        }
        4: {
            [key: string]   : string[];

            default         : string[];
        }
    }

    // JSON object always send by API
    interface I_JSONMessageFromAPI {
        errorMessage:   string; // Provided by API or the proxy
        error:          string; // Provided by BeatSaver API
    }

    // Console Log
    export const TITLE_LOG      = "color: purple; font-size: 1.5em; background-color: white; padding: 2px 4px; border-radius: 2px;";
    export const WARN_LOG       = "color: white; font-size: 1em; background-color: orange; padding: 2px 4px; border-radius: 2px";
    export const ERROR_LOG      = "color: white; font-size: 1em; background-color: red; padding: 2px 4px; border-radius: 2px";
    export const SUCCESS_LOG    = "color: white; font-size: 1em; background-color: green; padding: 2px 4px; border-radius: 2px";
    export const INFO_LOG       = "color: white; font-size: 1em; background-color: blue; padding: 2px 4px; border-radius: 2px";

    // General
    export const URI_NAV_SEARCH                     = window.location.search;
    export const URI_TOKEN_SCRIPT                   = "./php/token.php";
    export const SCORESABER_API_PROXY_URI           = "./php/scoreSaberProxy.php";
    export const BEATLEADER_API_PROXY_URI           = "./php/beatLeaderProxy.php";
    export const BEATLEADER_SONG_API_PROXY_URI      = "./php/beatLeaderSongProxy.php";
    export const BEATSAVER_API_URI                  = "https://api.beatsaver.com";
    export const MS_TIMER                           = 100;
    export const WAIT_TIME_BEFORE_UPDATE_PLAYERCARD = 2000;

    //////////////////////////
    // Parameters Variables //
    //////////////////////////

    // Parameters allowed for the overlay
    export interface I_uriParamsAllowed extends I_gamesSupported, I_pluginsSupported {
        [key: string]       : string|number|boolean;

        // General
        ip                  : string;   // Local IP or External IP
        token               : string;   // External token for parameters
        scoringSystem       : number;   // Use the scoring system by the number (0: Disabled, 1: ScoreSaber, 2: BeatLeader)

        // PlayerCard
        pc_disabled         : boolean;  // PlayerCard is enabled ?
        pc_alwaysEnabled    : boolean;  // PlayerCard is always displayed ?
        pc_playerID         : string;   // Player ID from ScoreSaber (string because the number is too long)
        pc_skin             : string;   // Skin of Player Card
        pc_position         : number;   // Position of Player Card
        pc_scale            : number;   // Scale of Player Card
        pc_pos_x            : number;   // Position of Player Card on the X axis
        pc_pos_y            : number;   // Position of Player Card on the Y axis

        // SongCard
        sc_disabled         : boolean;  // SongCard is enabled ?
        sc_alwaysEnabled    : boolean;  // SongCard is always displayed ?
        sc_skin             : string;   // Skin of Song Card
        sc_position         : number;   // Position of Song Card
        sc_scale            : number;   // Scale of Song Card
        sc_pos_x            : number;   // Position of Song Card on the X axis
        sc_pos_y            : number;   // Position of Song Card on the Y axis
        sc_missDisplay      : boolean;  // If display the miss system
        sc_bigBSR           : boolean;  // If display the big BSR system
        sc_ppMax            : boolean;  // If display the pp max system
        sc_ppEstimated      : boolean;  // If display the pp estimated system

        // Leaderboard
        ld_disabled         : boolean;  // Leaderboard is enabled ?
        ld_alwaysEnabled    : boolean;  // Leaderboard is always displayed ?
        ld_skin             : string;   // Skin of Leaderboard
        ld_position         : number;   // Position of Leaderboard
        ld_scale            : number;   // Scale of Leaderboard
        ld_pos_x            : number;   // Position of the Leaderboard on the X axis
        ld_pos_y            : number;   // Position of the Leaderboard on the Y axis
        ld_playerRendering  : number;   // Player rendering on the Leaderboard
    }

    // JSON representation of the parameters
    export interface I_uriParamsJSON {
        errorMessage    : string;   // Error message from token script
        successMessage  : string;   // Success message from token script
    }
    export interface I_uriParamsJSONSearch extends I_uriParamsJSON, I_gamesSupportedJSON, I_pluginsSupportedJSON {
        general_data: {
            ip              : string;   // Local IP or External IP
        }

        playercard_data: {
            disabled        : boolean;  // PlayerCard is enabled ?
            alwaysEnabled   : boolean;  // PlayerCard is always displayed ?
            playerID        : string;   // Player ID from ScoreSaber (string because the number is too long)
            skin            : string;   // Skin of Player Card
            position        : string;   // Position of Player Card
            scale           : number;   // Scale of Player Card
            pos_x           : number;   // Position of Player Card on the X axis
            pos_y           : number;   // Position of Player Card on the Y axis
            pc_scoringSystem: number;   // Use the scoring system by the number (0: Disabled, 1: ScoreSaber, 2: BeatLeader)
        }

        songcard_data: {
            disabled        : boolean;  // SongCard is enabled ?
            alwaysEnabled   : boolean;  // SongCard is always displayed ?
            skin            : string;   // Skin of Song Card
            position        : string;   // Position of Song Card
            scale           : number;   // Scale of Song Card
            pos_x           : number;   // Position of Song Card on the X axis
            pos_y           : number;   // Position of Song Card on the Y axis
            missDisplay     : boolean;  // If display the miss system
            bigBSR          : boolean;  // If display the big BSR system
            ppMax           : boolean;  // If display the pp max system
            ppEstimated     : boolean;  // If display the pp estimated system
        }

        leaderboard_data: {
            disabled        : boolean;  // Leaderboard is enabled ?
            alwaysEnabled   : boolean;  // Leaderboard is always displayed ?
            skin            : string;   // Skin of Leaderboard
            position        : string;   // Position of Leaderboard
            scale           : number;   // Scale of Leaderboard
            pos_x           : number;   // Position of the Leaderboard on the X axis
            pos_y           : number;   // Position of the Leaderboard on the Y axis
            playerRendering : number;   // Player rendering on the Leaderboard
        }
    }
    export interface I_uriParamsJSONSave extends I_uriParamsJSON {
        token: string;  // Token saved in database
    }
    export interface I_uriParamsJSONUpdate extends I_uriParamsJSON {}

    // Length of the token
    export const TOKEN_LENGTH = 32;

    ////////////////////////
    // Template Variables //
    ////////////////////////

    // Possible module position (PlayerCard, SongCard, etc ...)
    export enum E_POSITION {
        TOP_LEFT,
        TOP_RIGHT,
        BOTTOM_LEFT,
        BOTTOM_RIGHT
    }
    export const cssPosition = ["top-left", "top-right", "bottom-left", "bottom-right"];

    // Interfaced by enum E_MODULES
    // Skin module available
    export const SKIN_AVAILABLE: I_skinSupported = {
        // Skin for Player Card module
        0:  {
            default : ["./skins/playerCard/default/", "index.html", "style.css"],
            freemium: ["./skins/playerCard/freemium/", "index.html", "style.css"]
        },

        // Skin for Song Card module
        1: {
            default : ["./skins/songCard/default/", "index.html", "style.css"],
            freemium: ["./skins/songCard/freemium/", "index.html", "style.css"],
            reselim : ["./skins/songCard/reselim/", "index.html", "style.css"],
            dietah  : ["./skins/songCard/dietah/", "index.html", "style.css"]
        },

        // Skin for Leaderboard module
        2: {
            default : []
        },

        // Skin for SetupMenu module
        3: {
            default : ["./skins/setup/default/", "indexMenu.html", "generalMenu.html", "gamesAndPluginsMenu.html", "playerCard.html", "songCard.html", "style.css"]
        },
        // Skin for SetupOptions module
        4: {
            default : ["./skins/setup/default/", "indexOptions.html", "generalOptions.html", "gamesAndPluginsOptions.html", "playerCard.html", "songCard.html", "style.css"]
        }
    };

    //////////////////
    // UI Variables //
    //////////////////

    // FPS Refresh of the module data
    export const FPS_REFRESH = 1000 / 5;

    //////////////////////////
    // ScoreSaber Variables //
    //////////////////////////

    // JSON representation of the ScoreSaber Player data
    export interface I_scoreSaberPlayerJSON {
        errorMessage    : string;   // Provided by ScoreSaber API or the proxy
        name            : string;   // Player name
        profilePicture  : string;   // Player avatar

        country         : string;   // Player country (FR, US, UK, JP, etc ...)
        countryRank     : number;   // Player rank in his country
        rank            : number;   // Player rank in the world
        pp              : number;   // Player pp (Nice :smirk:)
    }

    //////////////////////////
    // BeatLeader Variables //
    //////////////////////////

    // JSON representation of the BeatLeader Player data
    export interface I_beatLeaderPlayerJSON extends I_JSONMessageFromAPI {
        name        : string;   // Player name
        avatar      : string;   // Player avatar

        country     : string;   // Player country (FR, US, UK, JP, etc ...)
        countryRank : number;   // Player rank in his country
        rank        : number;   // Player rank in the world
        pp          : number;   // Player pp (Nice :smirk:)
    }

    // JSON representation of the BeatLeader Song data
    export interface I_beatLeaderSongJSON extends I_JSONMessageFromAPI {
        author      : string;                       // Author of the song
        mapper      : string;                       // Mapper of the song
        name        : string;                       // Name of the song
        subName     : string;                       // Sub Name of the song
        bpm         : number;                       // BPM of the song
        coverImage  : string;                       // Cover of the song (URI)
        createdTime : string;                       // Timestamp of when the map if created
        description : string | null;                // Description of the map
        downloadUrl : string;                       // Download URI (.zip)
        hash        : string;                       // Hash of the map
        id          : string;                       // BSRKey of the map
        mapperId    : number;                       // Mapper ID (Identification)
        tags        : null;                         // Tags of the map (Like "Speed", "Acc", etc ...)
        uploadTime  : number;                       // Timestamp of when the map is uploaded

        difficulties: I_beatLeaderSongArrayJSON[];  // See below interface I_beatLeaderSongArrayJSON
    }
    interface I_beatLeaderSongArrayJSON {
        bombs           : number;   // How many bombs in the map
        difficultyName  : string;   // Name of the difficulty
        duration        : number;   // Duration of the song
        id              : number;   // ID of the difficulty of the song
        maxScore        : number;   // Maxscore posible of the song
        mode            : number;   // ID Mode of the difficulty of the song ("Standard", "Lawless", etc ...)
        modeName        : string;   // Name Mode of the difficulty of the song ("Standard", "Lawless", etc ...)
        njs             : number;   // NJS of the map
        nominatedTime   : number;   // ???
        notes           : number;   // How many notes in the map
        nps             : number;   // How many nps in the map

        /// WARNING: QualifiedTime and RankedTime can be 0 when stars can be more than 0 (I see that from old BL ranked)
        qualifiedTime   : number;   // When the map is qualified
        rankedTime      : number;   // When the map is Ranked
        stars           : number;   // How many stars is the map

        status          : number;   // ???
        type            : number;   // ID Type of the map ???
        value           : number;   // ???
        walls           : number;   // How many walls in the map

        modifierValues: {           // MODIFIERS score value (How it can change the final score on the leaderboard, can be positive or negative)
            da          : number;
            fs          : number;
            gn          : number;
            modifierId  : number;
            na          : number;
            nb          : number;
            nf          : number;
            no          : number;
            pm          : number;
            sa          : number;
            sc          : number;
            sf          : number;
            ss          : number;
        };
    }

    /////////////////////////
    // BeatSaver Variables //
    /////////////////////////

    // JSON representation of the BeatSaver Song data
    export interface I_beatSaverSongJSON extends I_JSONMessageFromAPI {
        id                  : string;   // BSR Key
        metadata: {
            songName        : string;   // Song name
            songSubName     : string;   // Song subname
            levelAuthorName : string;   // Mapper name
            songAuthorName  : string;   // Author name

            bpm             : number;   // BPM of the song
            duration        : number;   // Duration length of the song
        };
        name                : string;   // Song name include "Song name" and "Song subname"

        /// WARNING: Qualified and Ranked can be true at the same time ! If it appends, use qualified, not ranked
        qualified           : boolean;  // Song is qualified ?
        ranked              : boolean;  // Song is ranked ?

        versions: [{
            coverURL        : string;   // Song cover
        }];
    }

    ///////////////////////////
    // Player Card Variables //
    ///////////////////////////

    // Parameters for the Player Card module
    export interface I_playerCard {
        disabled        : boolean;  // Player Card is disabled ?
        display         : boolean;  // Player Card is displayed ?
        alwaysEnabled   : boolean;  // Player Card is always displayed ?
        needUpdate      : boolean;  // Player Card need an update ?
        endedUpdate     : boolean;  // Player Card is updated ?
        skin            : string;   // Skin of Player Card (see SKIN_AVAILABLE.playerCard)
        position        : number;   // Position of Player Card (see DISPLAY_POSITION)
        scale           : number;   // Scale of Player Card
        pos_x           : number;   // Position of Player Card on the X axis
        pos_y           : number;   // Position of Player Card on the Y axis
        scoringSystem   : number;   // ScoringSystem used (0: Disabled, 1: ScoreSaber, 2: BeatLeader)

        playerID        : string;   // ScoreSaber ID of the player
        playerName      : string;   // ScoreSaber name of the player
        playerCountry   : string;   // ScoreSaber country of the player
        avatar          : string;   // Avatar of the player
        playerFlag      : string;   // Country flag of the player (./pictures/country/COUNTRYCODE.svg)
        topWorld        : string;   // World rank of the player (String for commat support)
        topCountry      : string;   // Country rank if the player (String for commat support)
        performancePoint: string;   // PP of the player (Nice again :OwO:) (String for commat support)
    }

    // Default value of Player ID
    export const DEFAULT_PLAYERID = "0";

    /////////////////////////
    // Song Card Variables //
    /////////////////////////

    // Parameters for the Song Card module
    export interface I_songCard {
        disabled            : boolean;  // Song Card is disabled ?
        display             : boolean;  // Song Card is displayed ?
        alwaysEnabled       : boolean;  // Song Card is always displayed ?
        needUpdate          : boolean;  // Song Card need an update ?
        endedUpdate         : boolean;  // Song Card is updated ?
        position            : number;   // Position of Song Card (see DISPLAY_POSITION)
        skin                : string;   // Skin of Song Card (see SKIN_AVAILABLE.songCard)
        scale               : number;   // Scale of Song Card
        pos_x               : number;   // Position of Song Card on the X axis
        pos_y               : number;   // Position of Song Card on the Y axis
        scoringSystem       : number;   // ScoringSystem used (0: Disabled, 1: ScoreSaber, 2: BeatLeader)

        displayMiss         : boolean;  // Song Card display miss count ?
        bigBSR              : boolean;  // Song Card display the BSR bigger ?
        ppMax               : boolean;  // Song Card display the max PP of the map ?
        ppEstimated         : boolean;  // Song Card display the estimated PP of the actual map and score ?

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
        endedUpdate             : boolean;  // Song Card Performance is updated ?
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

    ///////////////////////
    // Plugins Variables //
    ///////////////////////

    // Globals
    export enum E_WEBSOCKET_STATES {
        CONNECTED,
        DISCONNECTED,
        ERROR
    }
    export enum E_GAMES {
        BEAT_SABER      = "beatSaber",      // https://www.beatsaber.com/
        SYNTH_RIDERS    = "synthRiders",    // https://synthridersvr.com/
        AUDIO_TRIP      = "audioTrip",      // http://www.kinemotik.com/audiotrip/
        AUDICA          = "audica"          // https://www.audicagame.com/
    }
    export enum E_PLUGINS_BS {
        BSPLUS              = "bsPlus",             // https://github.com/hardcpp/BeatSaberPlus
        BSPLUSLEADERBOARD   = "bsPlusLeaderboard",  // https://github.com/hardcpp/BeatSaberPlus
        HTTP_sira_STATUS    = "http_sira_Status",   // https://github.com/opl-/beatsaber-http-status/ & https://github.com/denpadokei/HttpSiraStatus
        DataPuller          = "dataPuller",         // https://github.com/opl-/beatsaber-http-status/
    }
    export enum E_PLUGINS_SR {
        SynthRiders = "synthRiders",        // https://github.com/KK964/SynthRiders-Websockets-Mod
    }
    export enum E_PLUGINS_AT {
        AudioTrip = "audioTrip",          // https://github.com/hn3000/ats-types
    }
    export enum E_PLUGINS_ADC {
        Audica = "audica"              // https://github.com/steglasaurous/audica-websocket-server
    }

    // Plugins connection schema
    export interface I_modsConnection {
        // Beat Saber Mods
        beatSaber: {
            bsPlus: {
                port        : number;
                entry       : string;
            };
            bsPlusLeaderboard: {
                port        : number;
                entry       : string;
            };
            http_sira_Status: {
                port        : number;
                entry       : string;
            };
            dataPuller: {
                port        : number;
                entry       : string;
                endPoint: {
                    mapData : string;
                    liveData: string;
                };
            };
        },

        // Synth Riders Mod
        synthRiders: {
            synthRiders: {
                port        : number;
                entry       : string;
            };
        },

        // Audio Trip Mod
        audioTrip: {
            audioTrip: {
                port        : number;
                entry       : string;
            };
        },

        // Audica Mod
        audica: {
            audica: {
                port        : number;
                entry       : string;
            };
        },

        // Adofai TODO: Work on when other game is ready
        adofai: {
            adofai: {
                port        : number;
                entry       : string;
            }
        }
    }

    export const TIMEOUT_MS                         = 4500;
    export const TIME_BEFORE_RETRY                  = 10000;
    export const RETRY_NUMBER                       = 1;
    export const PLUGINS_INFOS: I_modsConnection    = {
        // Beat Saber Mods
        beatSaber: {
            bsPlus: {
                port        : 2947,
                entry       : "/socket"
            },
            bsPlusLeaderboard: {
                port        : 2948,
                entry       : "/socket"
            },
            http_sira_Status: {
                port        : 6557,
                entry       : "/socket"
            },
            dataPuller: {
                port: 2946,
                entry       : "/BSDataPuller",
                endPoint: {
                    mapData : "/MapData",
                    liveData: "/LiveData"
                }
            }
        },

        // Synth Riders Mod
        synthRiders: {
            synthRiders: {
                port        : 9000,
                entry       : ""
            }
        },

        // Audio Trip Mod
        audioTrip: {
            audioTrip: {
                port        : 48998,
                entry       : ""
            }
        },

        // Audica Mod
        audica: {
            audica: {
                port        : 8085,
                entry       : "/AudicaStats"
            }
        },

        // Adofai TODO: Work on when other game is ready
        adofai: {
            adofai: {
                port        : 420,
                entry       : "/server"
            }
        }
    }

    ////////////////
    // Beat Saber //
    ////////////////

    ////////////////////// BSPLUS //////////////////////
    // Object representation of the BSPlus data
    export interface I_bsPlusObject {
        gameVersion         : string;               // Version of Beat Saber
        playerName          : string;               // Player name
        playerPlatformId    : string;               // Player platform ID (ScoreSaber ID here)
        protocolVersion     : number;               // Protocol version of the plugin
        _type               : string;               // Type of the message
        _event              : string;               // Event of the message

        gameStateChanged    : string;               // State of the game (Menu, Playing)
        mapInfoChanged: {
            BPM             : number;               // BPM of the actual song
            BSRKey          : string;               // BSR key of the actual song
            PP              : number;               // PP Max of the actual song
            artist          : string;               // Author of the actual song
            characteristic  : string;               // Type of the actual song (Lawless, Normal, OneHand, etc ...)
            coverRaw        : string;               // Cover of the actual song but in Base64
            difficulty      : string;               // Difficulty of the actual song (Easy, Normal, Hard, Expert, Expert+)
            duration        : number;               // Time length of the actual song
            level_id        : string;               // Hash of the actual song
            mapper          : string;               // Mapper of the actual song
            name            : string;               // Title of the actual song
            sub_name        : string;               // Subtitle of the actual song
            time            : undefined | number;   // Actual time of the actual song
            timeMultiplier  : undefined | number;   // Time multiplier of the actual song (If player play the map in 125%, multiplier is 1.25)
        };
        resumeTime          : number;               // Time when the song is resumed in the game
        pauseTime           : number;               // Time when the song is paused in the game

        scoreEvent: {
            accuracy        : number;               // Player accuracy of the actual song
            combo           : number;               // Player combo of the actual song
            currentHealth   : number;               // Player health of the actual song
            missCount       : number;               // Player miss of the actual song
            score           : number;               // Player score of the actual song
            time            : number;               // Actual time of the actual song
        };
    }

    ///////////////// HTTP_sira_STATUS /////////////////
    // Object representation of the HttpSiraStatus data
    export interface I_http_Sira_StatusObject {
        event                           : string;                                                                                                       // Name of the event
        time                            : number;                                                                                                       // UNIX timestamp in milliseconds of the moment this event happened

        status: {                                                                                                                                       // Possibly empty object {}
            beatmap: null | {
                songName                : string;                                                                                                       // Song name
                songSubName             : string;                                                                                                       // Song sub name
                songAuthorName          : string;                                                                                                       // Song author name
                levelAuthorName         : string;                                                                                                       // Beatmap author name
                songCover               : null | string;                                                                                                // Base64 encoded PNG image of the song cover
                songHash                : null | string;                                                                                                // Unique beatmap identifier. Same for all difficulties. Is extracted from the levelId and will return null for OST and WIP songs.
                levelId                 : string;                                                                                                       // Raw levelId for a song. Same for all difficulties.
                songBPM                 : number;                                                                                                       // Song Beats Per Minute
                noteJumpSpeed           : number;                                                                                                       // Song note jump movement speed, determines how fast the notes move towards the player.
                noteJumpStartBeatOffset : number;                                                                                                       // Offset in beats for the Half Jump Duration, tweaks how far away notes spawn from the player.
                songTimeOffset          : number;                                                                                                       // Time in milliseconds of where in the song the beatmap starts. Adjusted for song speed multiplier.
                start                   : null | number;                                                                                                // UNIX timestamp in milliseconds of when the map was started. Changes if the game is resumed. Might be altered by practice settings.
                paused                  : null | number;                                                                                                // If game is paused, UNIX timestamp in milliseconds of when the map was paused. null otherwise.
                length                  : number;                                                                                                       // Length of map in milliseconds. Adjusted for song speed multiplier.
                difficulty              : string;                                                                                                       // Translated beatmap difficulty name. If SongCore is installed, this may contain a custom difficulty label defined by the beatmap.
                difficultyEnum          : "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";                                                         // Beatmap difficulty
                characteristic          : "Standard" | "NoArrows" | "OneSaber" | "360Degree" | "90Degree" | "Lightshow" | "Lawless" | string;           // Characteristic of the set this beatmap belongs to. See https://bsmg.wiki/mapping/map-format.html#beatmapcharacteristicname for a current list of characteristics.
                notesCount              : number;                                                                                                       // Map cube count
                bombsCount              : number;                                                                                                       // Map bomb count. Set even with No Bombs modifier enabled.
                obstaclesCount          : number;                                                                                                       // Map obstacle count. Set even with No Obstacles modifier enabled.
                maxScore                : number;                                                                                                       // Max score obtainable on the map with the current modifier multiplier
                maxRank                 : "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";                                                             // Max rank obtainable using current modifiers
                environmentName         : string;                                                                                                       // Name of the environment this beatmap requested. See https://bsmg.wiki/mapping/basic-lighting.html#environment-previews for a current list of environments.
                color: {                                                                                                                                // Contains colors used by this environment. If overrides were set by the player, they replace the values provided by the environment. SongCore may override the colors based on beatmap settings, including player overrides. Each color is stored as an array of three integers in the range [0..255] representing the red, green, and blue values in order.
                    saberA              : [number, number, number];                                                                                     // Color of the left saber and its notes
                    saberB              : [number, number, number];                                                                                     // Color of the left saber and its notes
                    environment0        : [number, number, number];                                                                                     // First environment color
                    environment1        : [number, number, number];                                                                                     // Second environment color
                    environment0Boost   : null | [number, number, number],                                                                              // First environment boost color. If a boost color isn't set, this property will be `null`, and the value of `environment0` should be used instead.
                    environment1Boost   : null | [number, number, number],                                                                              // Second environment boost color. If a boost color isn't set, this property will be `null`, and the value of `environment1` should be used instead.
                    obstacle            : [number, number, number];                                                                                     // Color of obstacles
                }
            };

            game: {
                pluginVersion           : string;                                                                                                       // Currently running version of the plugin
                gameVersion             : string;                                                                                                       // Version of the game the current plugin version is targetting
                scene                   : "Menu" | "Song" | "Spectator";                                                                                // Indicates player's current activity
                mode                    : null | "Standard" | "NoArrows" | "OneSaber" | "360Degree" | "90Degree" | "Lightshow" | "Lawless" | string;    // Composed of game mode and map characteristic.
            };

            mod: {
                multiplier              : number;                                                                                                       // Current score multiplier for gameplay modifiers
                obstacles               : false | "FullHeightOnly" | "All";                                                                             // No Walls (FullHeightOnly is not possible from UI, formerly "No Obstacles")
                instaFail               : boolean;                                                                                                      // 1 Life (formerly "Insta Fail")
                noFail                  : boolean;                                                                                                      // No Fail
                batteryEnergy           : boolean;                                                                                                      // 4 Lives (formerly "Battery Energy")
                batteryLives            : null | number;                                                                                                // Amount of battery energy available. 4 with Battery Energy, 1 with Insta Fail, null with neither enabled.
                disappearingArrows      : boolean;                                                                                                      // Disappearing Arrows
                noBombs                 : boolean;                                                                                                      // No Bombs
                songSpeed               : "Normal" | "Slower" | "Faster" | "SuperFast";                                                                 // Song Speed (Slower = 85%, Faster = 120%, SuperFast = 150%)
                songSpeedMultiplier     : number;                                                                                                       // Song speed multiplier. Might be altered by practice settings.
                noArrows                : boolean;                                                                                                      // No Arrows
                ghostNotes              : boolean;                                                                                                      // Ghost Notes
                failOnSaberClash        : boolean;                                                                                                      // Fail on Saber Clash (Hidden)
                strictAngles            : boolean;                                                                                                      // Strict Angles (Requires more precise cut direction; changes max deviation from 60deg to 15deg)
                fastNotes               : boolean;                                                                                                      // Does something (Hidden)
                smallNotes              : boolean;                                                                                                      // Small Notes
                proMode                 : boolean;                                                                                                      // Pro Mode
                zenMode                 : boolean;                                                                                                      // Zen Mode
            };

            performance: null | {
                rawScore                : number;                                                                                                       // Current score without the modifier multiplier
                score                   : number;                                                                                                       // Current score with modifier multiplier
                currentMaxScore         : number;                                                                                                       // Maximum score with modifier multiplier achievable at current passed notes
                rank                    : "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";                                                             // Current rank
                relativeScore           : number;                                                                                                   // SiraStatus 精度, translated to: Accuracy
                passedNotes             : number;                                                                                                       // Amount of hit or missed cubes
                hitNotes                : number;                                                                                                       // Amount of hit cubes
                missedNotes             : number;                                                                                                       // Amount of missed cubes
                lastNoteScore           : number;                                                                                                       // Score of the last note
                passedBombs             : number;                                                                                                       // Amount of hit or missed bombs
                hitBombs                : number;                                                                                                       // Amount of hit bombs
                combo                   : number;                                                                                                       // Current combo
                maxCombo                : number;                                                                                                       // Max obtained combo
                multiplier              : number;                                                                                                       // Current combo multiplier {1, 2, 4, 8}
                multiplierProgress      : number;                                                                                                       // Current combo multiplier progress [0..1)
                batteryEnergy           : null | number;                                                                                                // Current amount of battery lives left. null if Battery Energy and Insta Fail are disabled.
                currentSongTime         : number;                                                                                                   // SiraStatus 現在の曲の秒数です。1秒おきに更新されます。, translated to: The number of seconds in the current song, updated every second.
                softFailed              : boolean;                                                                                                      // Set to `true` when the player's energy reaches 0, but they can continue playing. See the `softFailed` event.
            };

            playerSettings: {
                staticLights            : boolean;                                                                                                      // `true` if `environmentEffects` is not `AllEffects`. (formerly "Static lights", backwards compat)
                leftHanded              : boolean;                                                                                                      // Left handed
                playerHeight            : number;                                                                                                       // Player's height
                sfxVolume               : number;                                                                                                       // Disable sound effects [0..1]
                reduceDebris            : boolean;                                                                                                      // Reduce debris
                noHUD                   : boolean;                                                                                                      // No text and HUDs
                advancedHUD             : boolean;                                                                                                      // Advanced HUD
                autoRestart             : boolean;                                                                                                      // Auto Restart on Fail
                saberTrailIntensity     : number;                                                                                                       // Trail Intensity [0..1]
                environmentEffects      : "AllEffects" | "StrobeFilter" | "NoEffects";                                                                  // Environment effects
                hideNoteSpawningEffect  : boolean;                                                                                                      // Hide note spawning effect
            };
        };

        noteCut: {
            noteID                      : number;                                                                                                       // ID of the note
            noteType                    : "NoteA" | "NoteB" | "Bomb";                                                                                   // Type of note
            noteCutDirection            : "Up" | "Down" | "Left" | "Right" | "UpLeft" | "UpRight" | "DownLeft" | "DownRight" | "Any" | "None";          // Direction the note is supposed to be cut in
            noteLine                    : number;                                                                                                       // The horizontal position of the note, from left to right [0..3]
            noteLayer                   : number;                                                                                                       // The vertical position of the note, from bottom to top [0..2]
            speedOK                     : boolean;                                                                                                      // Cut speed was fast enough
            directionOK                 : null | boolean;                                                                                               // Note was cut in the correct direction. null for bombs.
            saberTypeOK                 : null | boolean;                                                                                               // Note was cut with the correct saber. null for bombs.
            wasCutTooSoon               : boolean;                                                                                                      // Note was cut too early
            initialScore                : null | number;                                                                                                // Score without multipliers for the cut. It contains the prehit swing score and the cutDistanceScore, but doesn't include the score for swinging after cut. [0..85] null for bombs.
            finalScore                  : null | number;                                                                                                // Score without multipliers for the entire cut, including score for swinging after cut. [0..115] Available in [`noteFullyCut` event](#notefullycut-event). null for bombs.
            cutDistanceScore            : null | number;                                                                                                // Score for how close the cut plane was to the note center. [0..15]
            multiplier                  : number;                                                                                                       // Combo multiplier at the time of cut
            saberSpeed                  : number;                                                                                                       // Speed of the saber when the note was cut
            saberDir                    : [number, number, number];                                                                                     // Direction in note space that the saber was moving in on the collision frame, calculated by subtracting the position of the saber's tip on the previous frame from its current position (current - previous). [X, Y, Z]
            saberType                   : "SaberA" | "SaberB";                                                                                          // Saber used to cut this note
            swingRating                 : number;                                                                                                       // Game's swing rating. Uses the before cut rating in noteCut events and after cut rating for noteFullyCut events. -1 for bombs.
            timeDeviation               : number;                                                                                                       // Time offset in seconds from the perfect time to cut the note
            cutDirectionDeviation       : number;                                                                                                       // Offset from the perfect cut angle in degrees
            cutPoint                    : [number, number, number];                                                                                     // Position in note space of the point on the cut plane closests to the note center [X, Y, Z]
            cutNormal                   : [number, number, number];                                                                                     // Normalized vector describing the normal of the cut plane in note space. Points towards negative X on a correct cut of a directional note. [X, Y Z]
            cutDistanceToCenter         : number;                                                                                                       // Distance from the center of the note to the cut plane
            timeToNextBasicNote         : number;                                                                                                       // Time until next note in seconds
        }
    }

    //////////////////// DATAPULLER ////////////////////
    // Object representation of the DataPuller Map data
    export interface I_dataPullerMapDataObject {
        GameVersion                     : string;           // Game version
        PluginVersion                   : string;           // Plugin version
        InLevel                         : boolean;          // Is in level ?
        LevelPaused                     : boolean;          // Level is paused ?
        LevelFinished                   : boolean;          // Level is finished ?
        LevelFailed                     : boolean;          // Level is failed ?
        LevelQuit                       : boolean;          // Level is quited ?
        Hash                            : string;           // Hash of the song
        SongName                        : string;           // Name of the song
        SongSubName                     : string;           // Subtitle of the song
        SongAuthor                      : string;           // Author of the song
        Mapper                          : string;           // Mapper name of the song
        BSRKey                          : null | string;    // BSR key of the song
        coverImage                      : null | string;    // Cover URL of the song (cdn beatsaver, .jpg)
        Length                          : number;           // Length in seconds of the song (Version < 2.1.0)
        Duration                        : number;           // Length in seconds of the song (Version >= 2.1.0)
        TimeScale                       : number;           // Speed of time for the song (Version < 2.1.0)
        MapType                         : string;           // Type of map "Standard", etc ...
        Difficulty                      : string;           // Difficulty of the map
        CustomDifficultyLabel           : string;           // Custom name of the difficulty
        BPM                             : number;           // BPM of the song
        NJS                             : number;           // NJS of the song
        Modifiers: {                                    // CAN BE EMTPY
            /// (Version < 2.1.0)
            fourLives                   : boolean;          // Four lives ?
            oneLife                     : boolean;          // One life ?
            disappearingArrows          : boolean;          // Disappearing arrows ?
            ghostNotes                  : boolean;          // Ghost Notes ?
            fasterSong                  : boolean;          // Faster song ?
            superFastSong               : boolean;          // Super faster song ?
            zenMode                     : boolean;          // Zen Mode ?
            noFailOn0Energy             : boolean;          // No fail when 0 energy ? (Softfailed)
            noBombs                     : boolean;          // No bombs ?
            slowerSong                  : boolean;          // Slower song ?
            noArrows                    : boolean;          // No arrows ?
            noWalls                     : boolean;          // No walls ?
            proMode                     : boolean;          // Pro mode ?
            smallNotes                  : boolean;          // Small notes ?
            strictAngles                : boolean;          // Strict Angles ?

            /// (Version >= 2.1.0)
            FourLives                   : boolean;          // Four lives ?
            OneLife                     : boolean;          // One life ?
            DisappearingArrows          : boolean;          // Disappearing arrows ?
            GhostNotes                  : boolean;          // Ghost Notes ?
            FasterSong                  : boolean;          // Faster song ?
            SuperFastSong               : boolean;          // Super faster song ?
            ZenMode                     : boolean;          // Zen Mode ?
            NoFailOn0Energy             : boolean;          // No fail when 0 energy ? (Softfailed)
            NoBombs                     : boolean;          // No bombs ?
            SlowerSong                  : boolean;          // Slower song ?
            NoArrows                    : boolean;          // No arrows ?
            NoWalls                     : boolean;          // No walls ?
            ProMode                     : boolean;          // Pro mode ?
            SmallNotes                  : boolean;          // Small notes ?
            StrictAngles                : boolean;          // Strict Angles ?
        };
        ModifiersMultiplier             : number;           // Multiplier when modifier is enabled (1, 1.2, 0.8, etc ...)
        PracticeMode                    : boolean;          // Is in practice ?
        PracticeModeModifiers: {                        // CAN BE EMTPY
            /// (Version < 2.1.0)
            songSpeedMul                : number;           // Speed multiplier in Practice mode
            startInAdvanceAndClearNotes : number;           // I don't know really what is this ????
            startSongTime               : number;           // Time in number where the song start

            /// (Version >= 2.1.0)
            SongSpeedMul                : number;           // Speed multiplier in Practice mode
            StartInAdvanceAndClearNotes : number;           // I don't know really what is this ????
            SongStartTime               : number;           // Time in number where the song start (Version >= 2.1.0)
        };
        PP                              : number;           // Performance point of the map
        Star                            : number;           // Stars of the map
        IsMultiplayer                   : boolean;          // Is in multiplayer ?
        PreviousRecord                  : number;           // Previous score of the previous song
        PreviousBSR                     : null | string;    // Previous BSR of the previous map
        unixTimestamp                   : number;           // Time of the event (Version < 2.1.0)
        UnixTimestamp                   : number;           // Time of the event (Version >= 2.1.0)
    }

    // Object representation of the DataPuller Live data
    export interface I_dataPullerLiveDataObject {
        Score                   : number;                   // Player score
        ScoreWithMultipliers    : number;                   // Player score with multipliers
        MaxScore                : number;                   // Maximum score of the actual song at the moment
        MaxScoreWithMultipliers : number;                   // Maximum score with multipliers of the actual song at the moment
        Rank                    : string;                   // Player rank (SS, S, etc ...)
        FullCombo               : boolean;                  // Is in full combo ?
        Combo                   : number;                   // Player combo
        Misses                  : number;                   // Player miss
        Accuracy                : number;                   // Player accuracy
        BlockHitScore           : [number, number, number], // Score cut [Pre-swing, Post-siwng, Accuracy]
        PlayerHealth            : number;                   // Player health
        TimeElapsed             : number;                   // Time elapsed in seconds
        unixTimestamp           : number;                   // Time of the event
    }

    //////////////////
    // Synth Riders //
    //////////////////

    // Object representation of the SynthRiders data
    export interface I_synthRidersObject {
        eventType           : "SongStart" | "SongEnd" | "PlayTime" | "NoteHit" | "NoteMiss" | "EnterSpecial" | "CompleteSpecial" | "FailSpecial" | "SceneChange" | "ReturnToMenu";
        data: {                                 // Possibly empty object {}
            song            : string;           // Song title
            difficulty      : string;           // Song difficulty
            author          : string;           // Song artist/author
            beatMapper      : string;           // Map creator
            length          : number;           // Song length in seconds
            bpm             : number;           // Song beats per minute
            albumArt        : null | string;    // Album URL (Can be empty if the covert is not available)

            perfect         : number;           // Number of perfect hits
            normal          : number;           // Number of normal hits
            bad             : number;           // Number of bad hits
            fail            : number;           // Number of failed hits
            highestCombo    : number;           // Highest number of consecutive hits during song

            playTimeMS      : number;           // Current play time position, in milliseconds.

            combo           : number;           // Number of consecutive hits made so far. This resets after a note miss.
            multiplier      : number;           // Current score multiplier. Runs from 1 to 6.
            completed       : number;           // Running total of all notes hit (perfect + normal + bad, no fails)
            lifeBarPercent  : number;           // A number between 0 and 1 indicating life bar percentage.

            sceneName       : string;           // Name of scene being entered
        };
    }

    ////////////////
    // Audio Trip //
    ////////////////

    // Object representation of the Audio Trip data
    export interface I_audioTripObject {
        gameVersion     : string;                               // Game version

        inSong          : boolean;                              // True or false
        tripType        : "QuickTrip" | "FullTrip" | "Custom";  // The type of the gameplay (like beat saber and "One hand", "360", etc ...)

        songLength      : number;                               // The length of the map in seconds
        songTitle       : string;                               // Song name
        songArtist      : string;                               // Song author
        choreoName      : string;                               // Song difficulty
        choreographer   : string;                               // Mapper name ?
        songID          : string;                               // ID of the song
        choreoID        : string;                               // ID of the map difficulty ???????????????

        playerStatus    : "Playing" | "Finished" | "Failed";    // If you in playing time, or you finish the map or maybe you fail the map

        score           : number;                               // Player score
        multiplier      : number;                               // Score multiplier
        playerHealth    : number;                               // Player health (-1 if nofail enabled, else between 1 and 0)
        curSongTime     : number;                               // Current song time in seconds
    }

    ////////////
    // Audica //
    ////////////

    // Object representation of the Audica data
    export interface I_audicaObject {
        eventType               : "SongSelected" | "SongRestart" | "SongProgress" | "SongPlayerStatus" | "TargetHit" | "TargetMiss" | "ReturnToSongList";

        data: {                         // Can be null
            songId              : string;   // ID of the song
            songName            : string;   // Name of the song
            songArtist          : string;   // Artist of the song
            songAuthor          : string;   // Mapper of the song
            difficulty          : string;   // Difficulty of the song
            classification      : string;   // ????
            songLength          : string;   // The length of the song string formatted
            songLengthSeconds   : number;   // The length of the song number formatted (Seconds)
            ticksTotal          : number;   // Number of target in the song
            albumArtData        : string;   // Album art encoded in Base64-PNG (Can be null if not available)

            progress            : number;   // ????
            timeElapsed         : string;   // Time elapsed string formatted
            timeElapsedSeconds  : number;   // Time elapsed number formatted (seconds)
            timeRemaining       : string;   // Time remaining string formatted
            timeRemainingSeconds: number;   // Time remaining number formatted (seconds)
            currentTick         : number;   // ????

            health              : number;   // Player health (between 1.0 and 0.0)
            score               : number;   // Player score
            scoreMultiplier     : number;   // Score multiplier
            streak              : number;   // Player combo
            highScore           : number;   // Best score on the song by the player ????
            isFullComboSoFar    : boolean;  // Player is in full combo ?
            isNoFailMode        : boolean;  // Nofail mode is enabled ?
            isPracticeMode      : boolean;  // Player is in practice mode ?
            songSpeed           : number;   // Song time multiplier
            modifiers           : [];       // Modifiers enabled (????)

            targetIndex         : number;   // ????
            type                : string;   // Type of the target
            hand                : string;   // Hand for the target
            timingScore         : number;   // ???? (-1.0 in the github)
            aimScore            : number;   // Score hit on the target
            tick                : number;   // The number of the target in the map ????
            targetHitPosition   : string;   // The position of the target (x, y)

            reason              : string;   // The reason of the miss
        }
    }

    /////////////////////
    // Setup Variables //
    /////////////////////
    export enum E_SETUP_FILES {
        INDEX = 1,
        GENERAL = 2,
        PLAYER = 3,
        SONG = 4
    }
}