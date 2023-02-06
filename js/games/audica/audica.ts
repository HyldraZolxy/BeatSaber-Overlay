import { Globals }      from "../../globals";
import { PlayerCard }   from "../../modules/playerCard";
import { SongCard }     from "../../modules/songCard";

interface I_audicaObject {
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
        isNoFailMode        : boolean;  // No-fail mode is enabled ?
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

export class Audica {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard : PlayerCard;
    private _songCard   : SongCard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent      = true;
    private map!            : I_audicaObject;
    private noteMiss        = 0;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(): void {
        if (this.helloEvent) {
            console.log("%cAudica v?? | WebSocket v??", Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
        }
    }

    private eHandler(dataEvent: I_audicaObject): void {
        switch(dataEvent.eventType) {
            case "SongSelected":
                this.map = dataEvent;
                this.mapInfoParser(dataEvent);

                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = true;
                    this._songCard.songCardData.started     = true;
                    this._songCard.songCardData.inProgress  = true;
                    this._songCard.songCardData.finished    = false;
                }
                break;

            case "SongRestart":
                this.mapInfoParser(this.map);
                break;

            case "SongPlayerStatus":
                this.scoreParser(dataEvent);
                break;

            case "SongProgress":
                this.infoParser(dataEvent);
                break;

            case "TargetMiss":
                this.noteMiss++;
                break;

            case "ReturnToSongList":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = false;
                    this._songCard.songCardData.started     = false;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardData.finished    = true;
                }
                break;
        }

        this.eHandshake();
    }

    private mapInfoParser(dataEvent: I_audicaObject): void {
        this._songCard.songCardData.needUpdate      = false;

        this._songCard.songCardPerformance.time     = 0;
        this._songCard.songCardPerformance.accuracy = 100;
        this._songCard.songCardPerformance.score    = "0";

        this._songCard.songCardData.title           = dataEvent.data.songName;
        this._songCard.songCardData.subTitle        = "";
        this._songCard.songCardData.mapper          = (dataEvent.data.songAuthor !== "") ? "[" + dataEvent.data.songAuthor.trim() + "]" : "";
        this._songCard.songCardData.author          = dataEvent.data.songArtist;
        this._songCard.songCardData.bpm             = 0;
        this._songCard.songCardData.difficulty      = dataEvent.data.difficulty;
        this._songCard.songCardData.difficultyClass = dataEvent.data.difficulty;
        this._songCard.songCardData.hashMap         = "";
        this._songCard.songCardData.bsrKey          = "";
        this._songCard.songCardData.totalTime       = dataEvent.data.songLengthSeconds * 1000;
        this._songCard.songCardData.speedModifier   = 1;

        this._songCard.songCardData.cover           = (dataEvent.data.albumArtData !== null) ? "data:image/png;base64," + dataEvent.data.albumArtData : "./pictures/default/notFound.jpg";
    }

    private scoreParser(dataEvent: I_audicaObject): void {
        this._songCard.songCardPerformance.combo    = dataEvent.data.streak;
        this._songCard.songCardPerformance.miss     = this.noteMiss;
        this._songCard.songCardPerformance.health   = dataEvent.data.health;
        this._songCard.songCardPerformance.score    = dataEvent.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    private infoParser(dataEvent: I_audicaObject): void {
        this._songCard.songCardPerformance.time = dataEvent.data.timeElapsedSeconds * 1000;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: I_audicaObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}