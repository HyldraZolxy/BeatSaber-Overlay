import { Globals }      from "./globals";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";

export class BSPlus {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(dataHandshake: Globals.I_bsPlusObject): void {
        console.log("%cBeat Saber " + dataHandshake.gameVersion + " | Protocol Version " + dataHandshake.protocolVersion, "background-color: green;");
        console.log("\n\n");

        if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.needUpdate = true;
    }

    private eHandler(dataEvent: Globals.I_bsPlusObject): void {
        switch(dataEvent._event) {
            case "gameState":
                switch(dataEvent.gameStateChanged) {
                    case "Menu":
                        setTimeout(() => {
                            this._songCard.songCardData.display = false;
                        }, Globals.MS_TIMER);

                        if (!this._songCard.songCardData.disabled) {
                            this._songCard.songCardData.finished    = true;
                            this._songCard.songCardData.inProgress  = false;
                            this._songCard.songCardData.started     = false;
                            this._songCard.songCardData.paused      = false;
                        }

                        if (!this._playerCard.playerCardData.disabled) {
                            this._playerCard.playerCardData.needUpdate  = true;
                            this._playerCard.playerCardData.display     = true;
                        }
                        break;

                    case "Playing":
                        if (!this._songCard.songCardData.disabled) {
                            this._songCard.songCardData.display     = true;
                            this._songCard.songCardData.started     = true;
                            this._songCard.songCardData.finished    = false;
                        }

                        if (!this._playerCard.playerCardData.disabled) this._playerCard.playerCardData.display = false;
                        break;
                }
                break;

            case "mapInfo":
                this.mapInfoParser(dataEvent);
                break;

            case "score":
                this.scoreParser(dataEvent);
                break;

            case "pause":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.paused      = true;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardPerformance.time = Number.isSafeInteger(dataEvent.pauseTime) ? dataEvent.pauseTime : dataEvent.pauseTime * 1000;
                }
                break;

            case "resume":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.paused      = false;
                    this._songCard.songCardData.inProgress  = true;
                    this._songCard.songCardPerformance.time = Number.isSafeInteger(dataEvent.resumeTime) ? dataEvent.resumeTime : dataEvent.resumeTime * 1000;
                }
                break;
        }
    }

    private mapInfoParser(dataEvent: Globals.I_bsPlusObject): void {
        this._songCard.songCardData.needUpdate      = true;

        this._songCard.songCardPerformance.accuracy = 100;

        this._songCard.songCardData.cover           = "data:image/png;base64," + dataEvent.mapInfoChanged.coverRaw;
        this._songCard.songCardData.title           = dataEvent.mapInfoChanged.name;
        this._songCard.songCardData.subTitle        = dataEvent.mapInfoChanged.sub_name;
        this._songCard.songCardData.mapper          = dataEvent.mapInfoChanged.mapper;
        this._songCard.songCardData.author          = dataEvent.mapInfoChanged.artist;
        this._songCard.songCardData.bsrKey          = dataEvent.mapInfoChanged.BSRKey;
        this._songCard.songCardData.bpm             = dataEvent.mapInfoChanged.BPM;
        this._songCard.songCardData.difficultyClass = dataEvent.mapInfoChanged.difficulty;
        this._songCard.songCardData.totalTime       = dataEvent.mapInfoChanged.duration;
        this._songCard.songCardData.hashMap         = dataEvent.mapInfoChanged.level_id.replace("custom_level_", "");

        this._songCard.songCardData.difficulty      = (dataEvent.mapInfoChanged.difficulty === "ExpertPlus") ? "Expert +" : dataEvent.mapInfoChanged.difficulty;
        this._songCard.songCardPerformance.time     = (dataEvent.mapInfoChanged.time !== undefined) ? dataEvent.mapInfoChanged.time * 1000 : 0;
        this._songCard.songCardData.speedModifier   = (dataEvent.mapInfoChanged.timeMultiplier !== undefined) ? dataEvent.mapInfoChanged.timeMultiplier : 1;
    }

    private scoreParser(dataEvent: Globals.I_bsPlusObject): void {
        this._songCard.songCardPerformance.combo    = dataEvent.scoreEvent.combo;
        this._songCard.songCardPerformance.miss     = dataEvent.scoreEvent.missCount;
        this._songCard.songCardPerformance.health   = dataEvent.scoreEvent.currentHealth;
        this._songCard.songCardPerformance.accuracy = +((dataEvent.scoreEvent.accuracy * 100).toFixed(1));
        this._songCard.songCardPerformance.score    = dataEvent.scoreEvent.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: Globals.I_bsPlusObject = JSON.parse(data);

        if (dataParsed._type === "handshake")   this.eHandshake(dataParsed);
        if (dataParsed._type === "event")       this.eHandler(dataParsed);
    }
}