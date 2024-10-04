import { Globals }      from "../../globals.js";
import { PlayerCard }   from "../../modules/playerCard.js";
import { SongCard }     from "../../modules/songCard.js";

interface I_http_Sira_StatusObject {
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
            gameVersion             : string;                                                                                                       // Version of the game the current plugin version is targeting
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
        initialScore                : null | number;                                                                                                // Score without multipliers for the cut. It contains the pre-hit swing score and the cutDistanceScore, but doesn't include the score for swinging after cut. [0..85] null for bombs.
        finalScore                  : null | number;                                                                                                // Score without multipliers for the entire cut, including score for swinging after cut. [0..115] Available in [`noteFullyCut` event](#notefullycut-event). null for bombs.
        cutDistanceScore            : null | number;                                                                                                // Score for how close the cut plane was to the note center. [0..15]
        multiplier                  : number;                                                                                                       // Combo multiplier at the time of cut
        saberSpeed                  : number;                                                                                                       // Speed of the saber when the note was cut
        saberDir                    : [number, number, number];                                                                                     // Direction in note space that the saber was moving in on the collision frame, calculated by subtracting the position of the saber's tip on the previous frame from its current position (current - previous). [X, Y, Z]
        saberType                   : "SaberA" | "SaberB";                                                                                          // Saber used to cut this note
        swingRating                 : number;                                                                                                       // Game's swing rating. Uses the before cut rating in noteCut events and after cut rating for noteFullyCut events. -1 for bombs.
        timeDeviation               : number;                                                                                                       // Time offset in seconds from the perfect time to cut the note
        cutDirectionDeviation       : number;                                                                                                       // Offset from the perfect cut angle in degrees
        cutPoint                    : [number, number, number];                                                                                     // Position in note space of the point on the cut plane closest to the note center [X, Y, Z]
        cutNormal                   : [number, number, number];                                                                                     // Normalized vector describing the normal of the cut plane in note space. Points towards negative X on a correct cut of a directional note. [X, Y Z]
        cutDistanceToCenter         : number;                                                                                                       // Distance from the center of the note to the cut plane
        timeToNextBasicNote         : number;                                                                                                       // Time until next note in seconds
    }
}

export class HTTP_sira_Status {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard : PlayerCard;
    private _songCard   : SongCard;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandler(dataEvent: I_http_Sira_StatusObject): void {
        switch(dataEvent.event) {
            case "hello":
                console.log("%cBeat Saber " + dataEvent.status.game.gameVersion + " | HTTP(sira)Status " + dataEvent.status.game.pluginVersion, "background-color: green;");
                console.log("\n\n");

                this._songCard.songCardData.display     = false;
                this._songCard.songCardData.started     = false;
                this._songCard.songCardData.paused      = false;
                this._songCard.songCardData.inProgress  = false;
                this._songCard.songCardData.finished    = false;

                if (!this._playerCard.playerCardData.disabled) {
                    this._playerCard.playerCardData.needUpdate  = true;
                    this._playerCard.playerCardData.display     = true;
                }

                if (dataEvent.status.beatmap !== null) {
                    this._songCard.songCardData.display     = true;
                    this._songCard.songCardData.started     = true;
                    this._songCard.songCardData.finished    = false;

                    if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.display = false;

                    this.mapInfoParser(dataEvent);

                    if (dataEvent.status.beatmap.paused !== null) {
                        if (dataEvent.status.beatmap.start !== null) this._songCard.songCardPerformance.time = dataEvent.status.beatmap.paused - dataEvent.status.beatmap.start;

                        this._songCard.songCardData.paused      = true;
                        this._songCard.songCardData.inProgress  = false;
                    } else {
                        if (dataEvent.status.beatmap.start !== null) this._songCard.songCardPerformance.time = dataEvent.time - dataEvent.status.beatmap.start;

                        this._songCard.songCardData.paused      = false;
                        this._songCard.songCardData.inProgress  = true;
                    }

                    this.scoreParser(dataEvent);
                }
                break;

            case "songStart":
                this._songCard.songCardData.display     = true;
                this._songCard.songCardData.started     = true;
                this._songCard.songCardData.paused      = false;
                this._songCard.songCardData.inProgress  = true;
                this._songCard.songCardData.finished    = false;

                if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.display = false;

                this.mapInfoParser(dataEvent);
                break;

            case "pause":
                this._songCard.songCardData.paused      = true;
                this._songCard.songCardData.inProgress  = false;
                break;

            case "resume":
                this._songCard.songCardData.paused      = false;
                this._songCard.songCardData.inProgress  = true;
                break;

            case "finished":
                if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.needUpdate = true;

                this._songCard.songCardData.finished = true;
                break;

            case "menu":
                setTimeout(() => {
                    this._songCard.songCardData.display = false;
                }, Globals.MS_TIMER);

                if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.display = true;

                this._songCard.songCardData.started     = false;
                this._songCard.songCardData.paused      = false;
                this._songCard.songCardData.inProgress  = false;
                break;

            case "noteMissed":
            case "scoreChanged":
                this.scoreParser(dataEvent);
                break;
        }
    }

    private mapInfoParser(dataEvent: I_http_Sira_StatusObject): void {
        this._songCard.songCardData.needUpdate      = true;

        this._songCard.songCardPerformance.combo    = 0;
        this._songCard.songCardPerformance.miss     = 0;
        this._songCard.songCardPerformance.accuracy = 100;
        this._songCard.songCardData.speedModifier   = 1;  // To 1 because the mod calculate the length automatically with the speed

        this._songCard.songCardPerformance.score    = "0";
        this._songCard.songCardData.bsrKey          = "";

        this._songCard.songCardData.title           = <string>dataEvent.status.beatmap?.songName;
        this._songCard.songCardData.subTitle        = <string>dataEvent.status.beatmap?.songSubName;
        this._songCard.songCardData.mapper          = (<string>dataEvent.status.beatmap?.levelAuthorName !== "") ? "[" + <string>dataEvent.status.beatmap?.levelAuthorName.trim() + "]" : "";
        this._songCard.songCardData.author          = <string>dataEvent.status.beatmap?.songAuthorName;
        this._songCard.songCardData.hashMap         = <string>dataEvent.status.beatmap?.songHash;
        this._songCard.songCardData.difficulty      = <string>dataEvent.status.beatmap?.difficulty;
        this._songCard.songCardData.difficultyClass = <string>dataEvent.status.beatmap?.difficultyEnum;
        this._songCard.songCardData.bpm             = <number>dataEvent.status.beatmap?.songBPM;
        this._songCard.songCardData.totalTime       = <number>dataEvent.status.beatmap?.length;

        this._songCard.songCardData.cover           = (dataEvent.status.beatmap?.songCover !== null) ? "data:image/png;base64," + <string>dataEvent.status.beatmap?.songCover : "./pictures/default/notFound.jpg";
        this._songCard.songCardPerformance.time     = (dataEvent.status.beatmap?.start !== null && dataEvent.status.beatmap?.start !== undefined) ? dataEvent.time - dataEvent.status.beatmap?.start : 0;
    }

    private scoreParser(dataEvent: I_http_Sira_StatusObject): void {
        this._songCard.songCardPerformance.health = 1; // Not implemented

        this._songCard.songCardPerformance.combo = <number>dataEvent.status.performance?.combo;
        this._songCard.songCardPerformance.miss = <number>dataEvent.status.performance?.missedNotes;

        this._songCard.songCardPerformance.accuracy = (dataEvent.status.performance?.relativeScore !== undefined) ?
            Number(Math.round((dataEvent.status.performance.relativeScore * 100 + Number.EPSILON) * 100) / 100)
            : Number(Math.round(((<number>dataEvent.status.performance?.score * 100 + Number.EPSILON) * 100) / <number>dataEvent.status.performance?.currentMaxScore) / 100);
        this._songCard.songCardPerformance.score = (<number>dataEvent.status.performance?.score).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: I_http_Sira_StatusObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}