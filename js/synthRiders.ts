import { Globals }      from "./globals";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";

export class SynthRiders {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent      = true;
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
            console.log("%cSynth Riders v?? | WebSocket v??", Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
        }
    }

    private eHandler(dataEvent: Globals.I_synthRidersObject): void {
        switch(dataEvent.eventType) {
            case "SongStart":
                this.mapInfoParser(dataEvent);

                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = true;
                    this._songCard.songCardData.started     = true;
                    this._songCard.songCardData.inProgress  = true;
                    this._songCard.songCardData.finished    = false;
                }

                this._playerCard.playerCardData.display = false;
                break;

            case "SongEnd":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = true;
                    this._songCard.songCardData.started     = true;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardData.finished    = true;
                }

                this._playerCard.playerCardData.display = false;
                break;

            case "NoteHit":
                this.scoreParser(dataEvent);
                break;

            case "NoteMiss":
                this.noteMiss++;
                break;

            case "ReturnToMenu":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = false;
                    this._songCard.songCardData.started     = false;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardData.finished    = true;
                }

                this._playerCard.playerCardData.display = false;
                break;
        }

        this.eHandshake();
    }

    private mapInfoParser(dataEvent: Globals.I_synthRidersObject): void {
        this._songCard.songCardData.needUpdate      = false;

        this._songCard.songCardPerformance.time     = 0;
        this._songCard.songCardPerformance.accuracy = 100;

        this._songCard.songCardData.title           = dataEvent.data.song;
        this._songCard.songCardData.subTitle        = "";
        this._songCard.songCardData.mapper          = dataEvent.data.beatMapper;
        this._songCard.songCardData.author          = dataEvent.data.author;
        this._songCard.songCardData.bpm             = dataEvent.data.bpm;
        this._songCard.songCardData.difficulty      = dataEvent.data.difficulty;
        this._songCard.songCardData.difficultyClass = dataEvent.data.difficulty;
        this._songCard.songCardData.hashMap         = "";
        this._songCard.songCardData.bsrKey          = "";
        this._songCard.songCardData.totalTime       = dataEvent.data.length * 1000;
        this._songCard.songCardData.speedModifier   = 1;

        this._songCard.songCardData.cover           = (dataEvent.data.albumArt !== null) ? "data:image/png;base64," + dataEvent.data.albumArt : "./pictures/default/notFound.jpg";
    }

    private scoreParser(dataEvent: Globals.I_synthRidersObject): void {
        this._songCard.songCardPerformance.combo    = dataEvent.data.combo;
        this._songCard.songCardPerformance.miss     = this.noteMiss;
        this._songCard.songCardPerformance.health   = dataEvent.data.lifeBarPercent;
        this._songCard.songCardPerformance.score    = dataEvent.data.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: Globals.I_synthRidersObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}