import { Globals }      from "../../globals";
import { PlayerCard }   from "../../modules/playerCard";
import { SongCard }     from "../../modules/songCard";

interface I_dataPullerMapDataObject {
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
    Modifiers: {                                    // CAN BE EMPTY
        /// (Version < 2.1.0)
        fourLives                   : boolean;          // Four lives ?
        oneLife                     : boolean;          // One life ?
        disappearingArrows          : boolean;          // Disappearing arrows ?
        ghostNotes                  : boolean;          // Ghost Notes ?
        fasterSong                  : boolean;          // Faster song ?
        superFastSong               : boolean;          // Super faster song ?
        zenMode                     : boolean;          // Zen Mode ?
        noFailOn0Energy             : boolean;          // No fail when 0 energy ? (Soft-failed)
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
        NoFailOn0Energy             : boolean;          // No fail when 0 energy ? (Soft-failed)
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
    PracticeModeModifiers: {                        // CAN BE EMPTY
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
interface I_dataPullerLiveDataObject {
    Score                   : number;                   // Player score
    ScoreWithMultipliers    : number;                   // Player score with multipliers
    MaxScore                : number;                   // Maximum score of the actual song at the moment
    MaxScoreWithMultipliers : number;                   // Maximum score with multipliers of the actual song at the moment
    Rank                    : string;                   // Player rank (SS, S, etc ...)
    FullCombo               : boolean;                  // Is in full combo ?
    Combo                   : number;                   // Player combo
    Misses                  : number;                   // Player miss
    Accuracy                : number;                   // Player accuracy
    BlockHitScore           : [number, number, number], // Score cut [Pre-swing, Post-swing, Accuracy]
    PlayerHealth            : number;                   // Player health
    TimeElapsed             : number;                   // Time elapsed in seconds
    unixTimestamp           : number;                   // Time of the event
}

export class DataPuller {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard : PlayerCard;
    private _songCard   : SongCard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent      = true;
    private oldVersion      = false;
    private timeResolve     = false;
    private oldVersionArray = ["2.0.12"];

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(dataEvent: I_dataPullerMapDataObject): void {
        if (this.helloEvent) {
            console.log("%cBeat Saber " + dataEvent.GameVersion + " | DataPuller " + dataEvent.PluginVersion, Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
            this.oldVersion = (this.oldVersionArray.includes(dataEvent.PluginVersion));
        }
    }

    private eHandlerMapData(dataEvent: I_dataPullerMapDataObject): void {
        if (dataEvent.InLevel) {
            if (!this._songCard.songCardData.started)       this.mapInfoParser(dataEvent);
            if (!this._playerCard.playerCardData.disabled)  this._playerCard.playerCardData.display = false;
            if (this.helloEvent || dataEvent.PracticeMode)  this.timeResolve = true;

            this._songCard.songCardData.display     = true;
            this._songCard.songCardData.started     = true;
            this._songCard.songCardData.paused      = false;
            this._songCard.songCardData.inProgress  = true;
            this._songCard.songCardData.finished    = false;
        } else {
            setTimeout(() => {
                this._songCard.songCardData.display = false;
            }, Globals.MS_TIMER);

            this._songCard.songCardData.started     = false;
            this._songCard.songCardData.paused      = false;
            this._songCard.songCardData.inProgress  = false;
            this._songCard.songCardData.finished    = true;

            if (!this._playerCard.playerCardData.disabled) {
                this._playerCard.playerCardData.needUpdate  = true;
                this._playerCard.playerCardData.display     = true;
            }
        }

        if (dataEvent.LevelPaused) {
            this._songCard.songCardData.paused      = true;
            this._songCard.songCardData.inProgress  = false;
        }

        if (dataEvent.LevelFinished) {
            if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.needUpdate = true;

            this._songCard.songCardData.finished = true;
        }

        if (dataEvent.LevelQuit) this._songCard.songCardData.finished = false;

        this.eHandshake(dataEvent);
    }
    private eHandlerLiveData(dataEvent: I_dataPullerLiveDataObject): void {
        this.scoreParser(dataEvent);

        if (this.timeResolve) {
            this._songCard.songCardPerformance.time = dataEvent.TimeElapsed * 1000;
            this.timeResolve                        = false;
        }
    }

    private mapInfoParser(dataEvent: I_dataPullerMapDataObject): void {
        this._songCard.songCardData.needUpdate      = true;

        this._songCard.songCardPerformance.time     = 0;
        this._songCard.songCardPerformance.accuracy = 100;

        this._songCard.songCardData.title           = dataEvent.SongName;
        this._songCard.songCardData.subTitle        = dataEvent.SongSubName;
        this._songCard.songCardData.mapper          = dataEvent.Mapper;
        this._songCard.songCardData.author          = dataEvent.SongAuthor;
        this._songCard.songCardData.bpm             = dataEvent.BPM;
        this._songCard.songCardData.difficultyClass = dataEvent.Difficulty;
        this._songCard.songCardData.hashMap         = dataEvent.Hash;

        this._songCard.songCardData.cover           = (dataEvent.coverImage !== null) ? "data:image/png;base64," + dataEvent.coverImage : "./pictures/default/notFound.jpg";
        this._songCard.songCardData.bsrKey          = (dataEvent.BSRKey !== null) ? dataEvent.BSRKey : "";
        this._songCard.songCardData.difficulty      = (dataEvent.Difficulty === "ExpertPlus") ? "Expert +" : dataEvent.Difficulty;
        this._songCard.songCardData.totalTime       = (this.oldVersion) ? dataEvent.Length * 1000 : dataEvent.Duration * 1000;

        this._songCard.songCardData.speedModifier   = this.speedParser(dataEvent);
    }

    private speedParser(dataEvent: I_dataPullerMapDataObject) {
        if (dataEvent.PracticeMode) return (this.oldVersion) ? dataEvent.PracticeModeModifiers.songSpeedMul : dataEvent.PracticeModeModifiers.SongSpeedMul;

        if (this.oldVersion) {
            if (dataEvent.Modifiers.fasterSong)     return 1.20;
            if (dataEvent.Modifiers.superFastSong)  return 1.50;
            if (dataEvent.Modifiers.slowerSong)     return 0.85;
        } else {
            if (dataEvent.Modifiers.FasterSong)     return 1.20;
            if (dataEvent.Modifiers.SuperFastSong)  return 1.50;
            if (dataEvent.Modifiers.SlowerSong)     return 0.85;
        }

        return 1;
    }

    private scoreParser(dataEvent: I_dataPullerLiveDataObject): void {
        this._songCard.songCardPerformance.combo    = dataEvent.Combo;
        this._songCard.songCardPerformance.miss     = dataEvent.Misses;
        this._songCard.songCardPerformance.health   = dataEvent.PlayerHealth;
        this._songCard.songCardPerformance.accuracy = Number((dataEvent.Accuracy).toFixed(1));
        this._songCard.songCardPerformance.score    = dataEvent.Score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string, endPoint: string): void {
        if (endPoint === "MapData") {
            let dataParsed: I_dataPullerMapDataObject = JSON.parse(data);
            this.eHandlerMapData(dataParsed);
        }

        if (endPoint === "LiveData") {
            let dataParsed: I_dataPullerLiveDataObject = JSON.parse(data);
            this.eHandlerLiveData(dataParsed);
        }
    }
}