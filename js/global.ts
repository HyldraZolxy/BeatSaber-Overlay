export namespace Globals {

    /////////////////////
    // GLOBAL VARIABLE //
    /////////////////////
    export enum E_MODULES {
        PLAYERCARD = "playerCard",
        SONGCARD = "songCard",
        SETUP = "setup"
    }

    export const URI_NAV_SEARCH = window.location.search;
    export const SCORESABER_API_PROXY_URL = "./php/scoreSaberProxy.php";
    export const BEATSAVER_API_URL = "https://api.beatsaver.com";
    export const MS_TIMER = 100;

    ////////////////////////////////
    // PARAMETERS GLOBAL VARIABLE //
    ////////////////////////////////
    export interface I_uriParamsAllowed {
        [key: string]: string|number|boolean;

        ip: string;         // Local IP or External IP
        pid: string;        // Player ID from ScoreSaber (string because the number is too long)
        md: boolean;        // If display the miss system

        pcsk: string;       // Skin of Player Card
        pcpos: string;      // Position of Player Card
        pcsc: number;       // Scale of Player Card

        scsk: string;       // Skin of Song Card
        scpos: string;      // Position of Song Card
        scsc: number;       // Scale of Song Card
    }

    //////////////////////////////
    // TEMPLATE GLOBAL VARIABLE //
    //////////////////////////////
    export interface I_skinAvailable {
        playerCard: {
            [key: string]: string[];

            default: string[];
        };
        songCard: {
            [key: string]: string[];

            default: string[];
            freemium: string[];
            reselim: string[];
        };
        setup: {
            [key: string]: string[];

            default: string[];
        }
    }

    export const DISPLAY_POSITION = [
        "top-left",
        "top-right",
        "bottom-left",
        "bottom-right"
    ];
    export const SKIN_AVAILABLE: I_skinAvailable = {
        playerCard:  {
            default: ["./skins/playerCard/default/", "index.html", "style.css"]
        },
        songCard: {
            default: ["./skins/songCard/default/", "index.html", "style.css"],
            freemium: ["./skins/songCard/freemium/", "index.html", "style.css"],
            reselim: ["./skins/songCard/reselim/", "index.html", "style.css"],
            dietah: ["./skins/songCard/dietah/", "index.html", "style.css"]
        },
        setup: {
            default: ["./skins/setup/default/", "index.html", "general.html", "playerCard.html", "songCard.html", "style.css"]
        }
    }

    ////////////////////////
    // UI GLOBAL VARIABLE //
    ////////////////////////
    export const FPS_REFRESH = 1000 / 10;

    ////////////////////////////////
    // SCORESABER GLOBAL VARIABLE //
    ////////////////////////////////
    export interface I_scoreSaberPlayerJSON {
        errorMessage: string;       // Provided by ScoreSaber API or the proxy
        name: string;               // Player name
        profilePicture: string;     // Player avatar

        country: string;            // Player country (FR, US, UK, JP, etc ...)
        countryRank: number;        // Player rank in his country
        rank: number;               // Player rank in the world
        pp: number;                 // Player pp (Nice :smirk:)
    }

    ///////////////////////////////
    // BEATSAVER GLOBAL VARIABLE //
    ///////////////////////////////
    export interface I_beatSaverSongJSON {
        error: string;                  // Provided by BeatSaver API

        id: string;                     // BSR Key
        metadata: {
            songName: string;           // Song name
            songSubName: string;        // Song subname
            levelAuthorName: string;    // Mapper name
            songAuthorName: string;     // Author name

            bpm: number;                // BPM of the song
            duration: number;           // Duration length of the song
        };
        name: string;                   // Song name include "Song name" and "Song subname"

                                        /// WARNING: Qualified and Ranked can be true at the same time ! If it appends, use qualified, not ranked
        qualified: boolean;             // Song is qualified ?
        ranked: boolean;                // Song is ranked ?

        versions: [{
            coverURL: string;           // Song cover
        }];
    }

    ////////////////////////////////
    // PLAYERCARD GLOBAL VARIABLE //
    ////////////////////////////////
    export interface I_playerCard {
        disabled: boolean;          // Player Card is disabled ?
        display: boolean;           // Player Card is displayed ?
        alwaysDisplayed: boolean;   // Player Card is always displayed ?
        needUpdate: boolean;        // Player Card need an update ?
        position: string;           // Position of Player Card (see DISPLAY_POSITION)
        skin: string;               // Skin of Player Card (see SKIN_AVAILABLE.playerCard)
        scale: number;              // Scale of Player Card

        playerId: string;           // ScoreSaber ID of the player
        avatar: string;             // Avatar of the player
        playerFlag: string;         // Country flag of the player (./pictures/country/COUNTRYCODE.svg)
        topWorld: number;           // World rank of the player
        topCountry: number;         // Country rank if the player
        performancePoint: number;   // PP of the player (Nice again :OwO:)
    }

    //////////////////////////////
    // SONGCARD GLOBAL VARIABLE //
    //////////////////////////////
    export interface I_songCard {
        disabled: boolean;              // Song Card is disabled ?
        alwaysDisplayed: boolean;       // Song Card is always displayed ?
        needUpdate: boolean;            // Song Card need an update ?
        position: string;               // Position of Song Card (see DISPLAY_POSITION)
        skin: string;                   // Skin of Song Card (see SKIN_AVAILABLE.songCard)
        scale: number;                  // Scale of Song Card

        started: boolean;               // Song is started ?
        inProgress: boolean;            // Song is in progress ?
        paused: boolean;                // Song is paused ?
        finished: boolean;              // Song is finished ?

        displayMiss: boolean;           // Song Card display miss count ?

        cover: string;                  // Cover of the actual song
        title: string;                  // Title of the actual song
        subTitle: string;               // Subtitle of the actual song
        mapper: string;                 // Mapper of the actual song
        author: string;                 // Author of the actual song

        bsrKey: string;                 // BSR key of the actual song
        hashMap: string;                // Hash ID of the actual song
        bpm: number;                    // BPM of the actual song

        difficulty: string;             // Difficulty of the actual song (Easy, Normal, Hard, Expert, Expert+)
        difficultyClass: string;        // Class Difficulty of the actual song (Easy, Normal, Hard, Expert, ExpertPlus)

        ranked: boolean;                // Song is ranked ?
        qualified: boolean;             // Song is qualified ?
        pp: number;                     // PP max of the actual song

        time: number;                   // Actual time of the actual song
        totalTime: number;              // Time length of the actual song
        timeToLetters: string;          // Time in letter of the actual song
        totalTimeToLetters: string;     // Total time in letter of the actual song
        timeToPercentage: number;       // Time in percentage of the actual song

        accuracy: number;               // Player accuracy of the actual song
        accuracyToLetters: string;      // Player accuracy in letter of the actual song
        accuracyToLetterClass: string; // Player accuracy in class of the actual song

        score: string;                  // Player score of the actual song (In string for commas support)
        combo: number;                  // Player combo of the actual song
        miss: number;                   // Player miss of the actual song

        health: number;                 // Player health of the actual song

        speedModifier: number;          // Time multiplier of the actual song (If player play the map in 125%, multiplier is 1.25)
    }

    /////////////////////////////
    // PLUGINS GLOBAL VARIABLE //
    /////////////////////////////
    export enum E_WEBSOCKET_STATES {
        CONNECTED,
        DISCONNECTED,
        ERROR
    }
    export enum E_PLUGINS {
        BSPLUS = "bsPlus",
        HTTP_sira_STATUS = "http_sira_Status",
        DataPuller = "dataPuller"
    }

    export interface I_pluginsConnection {
        bsPlus: {
            port: number;
            entry: string;
        };
        http_sira_Status: {
            port: number;
            entry: string;
        };
        dataPuller: {
            port: number;
            entry: string;
            endPoint: {
                mapData: string;
                liveData: string;
            };
        };
    }

    export const TIMEOUT_MS = 4500;
    export const TIME_BEFORE_RETRY = 10000;
    export const RETRY_NUMBER = 2;
    export const PLUGINS_CONNECTIONS: I_pluginsConnection = {
        bsPlus: {
            port: 2947,
            entry: "/socket"
        },
        http_sira_Status: {
            port: 6557,
            entry: "/socket"
        },
        dataPuller: {
            port: 2946,
            entry: "/BSDataPuller/",
            endPoint: {
                mapData: "MapData",
                liveData: "LiveData"
            }
        }
    }

    /////////////////////////////
    // BSPLUS GLOBAL VARIABLE //
    /////////////////////////////
    export interface I_bsPlusObject {
        gameVersion: string;            // Version of Beat Saber
        playerName: string;             // Player name
        playerPlatformId: string;       // Player platform ID (ScoreSaber ID here)
        protocolVersion: number;        // Protocol version of the plugin
        _type: string;                  // Type of the message
        _event: string;                 // Event of the message

        gameStateChanged: string;       // State of the game (Menu, Playing)
        mapInfoChanged: {
            BPM: number;                            // BPM of the actual song
            BSRKey: string;                         // BSR key of the actual song
            PP: number;                             // PP Max of the actual song
            artist: string;                         // Author of the actual song
            characteristic: string;                 // Type of the actual song (Lawless, Normal, OneHand, etc ...)
            coverRaw: string;                       // Cover of the actual song but in Base64
            difficulty: string;                     // Difficulty of the actual song (Easy, Normal, Hard, Expert, Expert+)
            duration: number;                       // Time length of the actual song
            level_id: string;                       // Hash of the actual song
            mapper: string;                         // Mapper of the actual song
            name: string;                           // Title of the actual song
            sub_name: string;                       // Subtitle of the actual song
            time: undefined | number;               // Actual time of the actual song
            timeMultiplier: undefined | number;     // Time multiplier of the actual song (If player play the map in 125%, multiplier is 1.25)
        };
        resumeTime: number;             // Time when the song is resumed in the game
        pauseTime: number;              // Time when the song is paused in the game

        scoreEvent: {
            accuracy: number;           // Player accuracy of the actual song
            combo: number;              // Player combo of the actual song
            currentHealth: number;      // Player health of the actual song
            missCount: number;          // Player miss of the actual song
            score: number;              // Player score of the actual song
            time: number;               // Actual time of the actual song
        };
    }

    //////////////////////////////////////////////////
    // HTTPSTATUS && HTTPSIRASTATUS GLOBAL VARIABLE //
    //////////////////////////////////////////////////
    export interface I_http_Sira_StatusObject {
        event: string;                                                                                                                  // Name of the event
        time: number;                                                                                                                   // UNIX timestamp in milliseconds of the moment this event happened

        status: {                                                                                                                       // Possibly empty object {}
            beatmap: null | {
                songName: string;                                                                                                       // Song name
                songSubName: string;                                                                                                    // Song sub name
                songAuthorName: string;                                                                                                 // Song author name
                levelAuthorName: string;                                                                                                // Beatmap author name
                songCover: null | string;                                                                                               // Base64 encoded PNG image of the song cover
                songHash: null | string;                                                                                                // Unique beatmap identifier. Same for all difficulties. Is extracted from the levelId and will return null for OST and WIP songs.
                levelId: string;                                                                                                        // Raw levelId for a song. Same for all difficulties.
                songBPM: number;                                                                                                        // Song Beats Per Minute
                noteJumpSpeed: number;                                                                                                  // Song note jump movement speed, determines how fast the notes move towards the player.
                noteJumpStartBeatOffset: number;                                                                                        // Offset in beats for the Half Jump Duration, tweaks how far away notes spawn from the player.
                songTimeOffset: number;                                                                                                 // Time in milliseconds of where in the song the beatmap starts. Adjusted for song speed multiplier.
                start: null | number;                                                                                                   // UNIX timestamp in milliseconds of when the map was started. Changes if the game is resumed. Might be altered by practice settings.
                paused: null | number;                                                                                                  // If game is paused, UNIX timestamp in milliseconds of when the map was paused. null otherwise.
                length: number;                                                                                                         // Length of map in milliseconds. Adjusted for song speed multiplier.
                difficulty: string;                                                                                                     // Translated beatmap difficulty name. If SongCore is installed, this may contain a custom difficulty label defined by the beatmap.
                difficultyEnum: "Easy" | "Normal" | "Hard" | "Expert" | "ExpertPlus";                                                   // Beatmap difficulty
                characteristic: "Standard" | "NoArrows" | "OneSaber" | "360Degree" | "90Degree" | "Lightshow" | "Lawless" | string;     // Characteristic of the set this beatmap belongs to. See https://bsmg.wiki/mapping/map-format.html#beatmapcharacteristicname for a current list of characteristics.
                notesCount: number;                                                                                                     // Map cube count
                bombsCount: number;                                                                                                     // Map bomb count. Set even with No Bombs modifier enabled.
                obstaclesCount: number;                                                                                                 // Map obstacle count. Set even with No Obstacles modifier enabled.
                maxScore: number;                                                                                                       // Max score obtainable on the map with the current modifier multiplier
                maxRank: "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";                                                              // Max rank obtainable using current modifiers
                environmentName: string;                                                                                                // Name of the environment this beatmap requested. See https://bsmg.wiki/mapping/basic-lighting.html#environment-previews for a current list of environments.
                color: {                                                                                                                // Contains colors used by this environment. If overrides were set by the player, they replace the values provided by the environment. SongCore may override the colors based on beatmap settings, including player overrides. Each color is stored as an array of three integers in the range [0..255] representing the red, green, and blue values in order.
                    saberA: [number, number, number];                                                                                   // Color of the left saber and its notes
                    saberB: [number, number, number];                                                                                   // Color of the left saber and its notes
                    environment0: [number, number, number];                                                                             // First environment color
                    environment1: [number, number, number];                                                                             // Second environment color
                    environment0Boost: null | [number, number, number],                                                                 // First environment boost color. If a boost color isn't set, this property will be `null`, and the value of `environment0` should be used instead.
                    environment1Boost: null | [number, number, number],                                                                 // Second environment boost color. If a boost color isn't set, this property will be `null`, and the value of `environment1` should be used instead.
                    obstacle: [number, number, number];                                                                                 // Color of obstacles
                }
            };

            game: {
                pluginVersion: string;                                                                                                  // Currently running version of the plugin
                gameVersion: string;                                                                                                    // Version of the game the current plugin version is targetting
                scene: "Menu" | "Song" | "Spectator";                                                                                   // Indicates player's current activity
                mode: null | "Standard" | "NoArrows" | "OneSaber" | "360Degree" | "90Degree" | "Lightshow" | "Lawless" | string;        // Composed of game mode and map characteristic.
            };

            mod: {
                multiplier: number;                                                                                                     // Current score multiplier for gameplay modifiers
                obstacles: false | "FullHeightOnly" | "All";                                                                            // No Walls (FullHeightOnly is not possible from UI, formerly "No Obstacles")
                instaFail: boolean;                                                                                                     // 1 Life (formerly "Insta Fail")
                noFail: boolean;                                                                                                        // No Fail
                batteryEnergy: boolean;                                                                                                 // 4 Lives (formerly "Battery Energy")
                batteryLives: null | number;                                                                                            // Amount of battery energy available. 4 with Battery Energy, 1 with Insta Fail, null with neither enabled.
                disappearingArrows: boolean;                                                                                            // Disappearing Arrows
                noBombs: boolean;                                                                                                       // No Bombs
                songSpeed: "Normal" | "Slower" | "Faster" | "SuperFast";                                                                // Song Speed (Slower = 85%, Faster = 120%, SuperFast = 150%)
                songSpeedMultiplier: number;                                                                                            // Song speed multiplier. Might be altered by practice settings.
                noArrows: boolean;                                                                                                      // No Arrows
                ghostNotes: boolean;                                                                                                    // Ghost Notes
                failOnSaberClash: boolean;                                                                                              // Fail on Saber Clash (Hidden)
                strictAngles: boolean;                                                                                                  // Strict Angles (Requires more precise cut direction; changes max deviation from 60deg to 15deg)
                fastNotes: boolean;                                                                                                     // Does something (Hidden)
                smallNotes: boolean;                                                                                                    // Small Notes
                proMode: boolean;                                                                                                       // Pro Mode
                zenMode: boolean;                                                                                                       // Zen Mode
            };

            performance: null | {
                rawScore: number;                                                                                                       // Current score without the modifier multiplier
                score: number;                                                                                                          // Current score with modifier multiplier
                currentMaxScore: number;                                                                                                // Maximum score with modifier multiplier achievable at current passed notes
                rank: "SSS" | "SS" | "S" | "A" | "B" | "C" | "D" | "E";                                                                 // Current rank
                relativeScore: number;                                                                                  // SiraStatus 精度, translated to: Accuracy
                passedNotes: number;                                                                                                    // Amount of hit or missed cubes
                hitNotes: number;                                                                                                       // Amount of hit cubes
                missedNotes: number;                                                                                                    // Amount of missed cubes
                lastNoteScore: number;                                                                                                  // Score of the last note
                passedBombs: number;                                                                                                    // Amount of hit or missed bombs
                hitBombs: number;                                                                                                       // Amount of hit bombs
                combo: number;                                                                                                          // Current combo
                maxCombo: number;                                                                                                       // Max obtained combo
                multiplier: number;                                                                                                     // Current combo multiplier {1, 2, 4, 8}
                multiplierProgress: number;                                                                                             // Current combo multiplier progress [0..1)
                batteryEnergy: null | number;                                                                                           // Current amount of battery lives left. null if Battery Energy and Insta Fail are disabled.
                currentSongTime: number;                                                                                // SiraStatus 現在の曲の秒数です。1秒おきに更新されます。, translated to: The number of seconds in the current song, updated every second.
                softFailed: boolean;                                                                                                    // Set to `true` when the player's energy reaches 0, but they can continue playing. See the `softFailed` event.
            };

            playerSettings: {
                staticLights: boolean;                                                                                                  // `true` if `environmentEffects` is not `AllEffects`. (formerly "Static lights", backwards compat)
                leftHanded: boolean;                                                                                                    // Left handed
                playerHeight: number;                                                                                                   // Player's height
                sfxVolume: number;                                                                                                      // Disable sound effects [0..1]
                reduceDebris: boolean;                                                                                                  // Reduce debris
                noHUD: boolean;                                                                                                         // No text and HUDs
                advancedHUD: boolean;                                                                                                   // Advanced HUD
                autoRestart: boolean;                                                                                                   // Auto Restart on Fail
                saberTrailIntensity: number;                                                                                            // Trail Intensity [0..1]
                environmentEffects: "AllEffects" | "StrobeFilter" | "NoEffects";                                                        // Environment effects
                hideNoteSpawningEffect: boolean;                                                                                        // Hide note spawning effect
            };
        };

        noteCut: {
            noteID: number;                                                                                                             // ID of the note
            noteType: "NoteA" | "NoteB" | "Bomb";                                                                                       // Type of note
            noteCutDirection: "Up" | "Down" | "Left" | "Right" | "UpLeft" | "UpRight" | "DownLeft" | "DownRight" | "Any" | "None";      // Direction the note is supposed to be cut in
            noteLine: number;                                                                                                           // The horizontal position of the note, from left to right [0..3]
            noteLayer: number;                                                                                                          // The vertical position of the note, from bottom to top [0..2]
            speedOK: boolean;                                                                                                           // Cut speed was fast enough
            directionOK: null | boolean;                                                                                                // Note was cut in the correct direction. null for bombs.
            saberTypeOK: null | boolean;                                                                                                // Note was cut with the correct saber. null for bombs.
            wasCutTooSoon: boolean;                                                                                                     // Note was cut too early
            initialScore: null | number;                                                                                                // Score without multipliers for the cut. It contains the prehit swing score and the cutDistanceScore, but doesn't include the score for swinging after cut. [0..85] null for bombs.
            finalScore: null | number;                                                                                                  // Score without multipliers for the entire cut, including score for swinging after cut. [0..115] Available in [`noteFullyCut` event](#notefullycut-event). null for bombs.
            cutDistanceScore: null | number;                                                                                            // Score for how close the cut plane was to the note center. [0..15]
            multiplier: number;                                                                                                         // Combo multiplier at the time of cut
            saberSpeed: number;                                                                                                         // Speed of the saber when the note was cut
            saberDir: [number, number, number];                                                                                         // Direction in note space that the saber was moving in on the collision frame, calculated by subtracting the position of the saber's tip on the previous frame from its current position (current - previous). [X, Y, Z]
            saberType: "SaberA" | "SaberB";                                                                                             // Saber used to cut this note
            swingRating: number;                                                                                                        // Game's swing rating. Uses the before cut rating in noteCut events and after cut rating for noteFullyCut events. -1 for bombs.
            timeDeviation: number;                                                                                                      // Time offset in seconds from the perfect time to cut the note
            cutDirectionDeviation: number;                                                                                              // Offset from the perfect cut angle in degrees
            cutPoint: [number, number, number];                                                                                         // Position in note space of the point on the cut plane closests to the note center [X, Y, Z]
            cutNormal: [number, number, number];                                                                                        // Normalized vector describing the normal of the cut plane in note space. Points towards negative X on a correct cut of a directional note. [X, Y Z]
            cutDistanceToCenter: number;                                                                                                // Distance from the center of the note to the cut plane
            timeToNextBasicNote: number;                                                                                                // Time until next note in seconds
        }
    }

    ////////////////////////////////
    // DATAPULLER GLOBAL VARIABLE //
    ////////////////////////////////
    export interface I_dataPullerMapDataObject {
        GameVersion: string;                        // Game version
        PluginVersion: string;                      // Plugin version
        InLevel: boolean;                           // Is in level ?
        LevelPaused: boolean;                       // Level is paused ?
        LevelFinished: boolean;                     // Level is finished ?
        LevelFailed: boolean;                       // Level is failed ?
        LevelQuit: boolean;                         // Level is quited ?
        Hash: string;                               // Hash of the song
        SongName: string;                           // Name of the song
        SongSubName: string;                        // Subtitle of the song
        SongAuthor: string;                         // Author of the song
        Mapper: string;                             // Mapper name of the song
        BSRKey: null | string;                      // BSR key of the song
        coverImage: null | string;                  // Cover URL of the song (cdn beatsaver, .jpg)
        Length: number;                             // Lenght in seconds of the song (Version < 2.1.0)
        Duration: number;                           // Length in seconds of the song (Version >= 2.1.0)
        TimeScale: number;                          // Speed of time for the song (Version < 2.1.0)
        MapType: string;                            // Type of map "Standard", etc ...
        Difficulty: string;                         // Difficulty of the map
        CustomDifficultyLabel: string;              // Custom name of the difficulty
        BPM: number;                                // BPM of the song
        NJS: number;                                // NJS of the song
        Modifiers: {                            // CAN BE EMTPY
            /// (Version < 2.1.0)
            fourLives: boolean;                     // Four lives ?
            oneLife: boolean;                       // One life ?
            disappearingArrows: boolean;            // Disappearing arrows ?
            ghostNotes: boolean;                    // Ghost Notes ?
            fasterSong: boolean;                    // Faster song ?
            superFastSong: boolean;                 // Super faster song ?
            zenMode: boolean;                       // Zen Mode ?
            noFailOn0Energy: boolean;               // No fail when 0 energy ? (Softfailed)
            noBombs: boolean;                       // No bombs ?
            slowerSong: boolean;                    // Slower song ?
            noArrows: boolean;                      // No arrows ?
            noWalls: boolean;                       // No walls ?
            proMode: boolean;                       // Pro mode ?
            smallNotes: boolean;                    // Small notes ?
            strictAngles: boolean;                  // Strict Angles ?

            /// (Version >= 2.1.0)
            FourLives: boolean;                     // Four lives ?
            OneLife: boolean;                       // One life ?
            DisappearingArrows: boolean;            // Disappearing arrows ?
            GhostNotes: boolean;                    // Ghost Notes ?
            FasterSong: boolean;                    // Faster song ?
            SuperFastSong: boolean;                 // Super faster song ?
            ZenMode: boolean;                       // Zen Mode ?
            NoFailOn0Energy: boolean;               // No fail when 0 energy ? (Softfailed)
            NoBombs: boolean;                       // No bombs ?
            SlowerSong: boolean;                    // Slower song ?
            NoArrows: boolean;                      // No arrows ?
            NoWalls: boolean;                       // No walls ?
            ProMode: boolean;                       // Pro mode ?
            SmallNotes: boolean;                    // Small notes ?
            StrictAngles: boolean;                  // Strict Angles ?
        };
        ModifiersMultiplier: number;                // Multiplier when modifier is enabled (1, 1.2, 0.8, etc ...)
        PracticeMode: boolean;                      // Is in practice ?
        PracticeModeModifiers: {                // CAN BE EMTPY
            /// (Version < 2.1.0)
            songSpeedMul: number;                   // Speed multiplier in Practice mode
            startInAdvanceAndClearNotes: number;    // I don't know really what is this ????
            startSongTime: number;                  // Time in number where the song start

            /// (Version >= 2.1.0)
            SongSpeedMul: number;                   // Speed multiplier in Practice mode
            StartInAdvanceAndClearNotes: number;    // I don't know really what is this ????
            SongStartTime: number;                  // Time in number where the song start (Version >= 2.1.0)
        };
        PP: number;                                 // Performance point of the map
        Star: number;                               // Stars of the map
        IsMultiplayer: boolean;                     // Is in multiplayer ?
        PreviousRecord: number;                     // Previous score of the previous song
        PreviousBSR: null | string;                 // Previous BSR of the previous map
        unixTimestamp: number;                      // Time of the event (Version < 2.1.0)
        UnixTimestamp: number;                      // Time of the event (Version >= 2.1.0)
    }
    export interface I_dataPullerLiveDataObject {
        Score: number;                              // Player score
        ScoreWithMultipliers: number;               // Player score with multipliers
        MaxScore: number;                           // Maximum score of the actual song at the moment
        MaxScoreWithMultipliers: number;            // Maximum score with multipliers of the actual song at the moment
        Rank: string;                               // Player rank (SS, S, etc ...)
        FullCombo: boolean;                         // Is in full combo ?
        Combo: number;                              // Player combo
        Misses: number;                             // Player miss
        Accuracy: number;                           // Player accuracy
        BlockHitScore: [number, number, number],    // Score cut [Pre-swing, Post-siwng, Accuracy]
        PlayerHealth: number;                       // Player health
        TimeElapsed: number;                        // Time elapsed in seconds
        unixTimestamp: number;                      // Time of the event
    }

    ///////////////////////////
    // SETUP GLOBAL VARIABLE //
    ///////////////////////////
    export enum E_SETUP_FILES {
        INDEX = 1,
        GENERAL = 2,
        PLAYER = 3,
        SONG = 4
    }
}