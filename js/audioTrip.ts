import { Globals }      from "./globals";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";

export class AudioTrip {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent      = true;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(dataEvent: Globals.I_audioTripObject): void {
        if (this.helloEvent) {
            console.log("%cAudioTrip " + dataEvent.gameVersion + " | WebSocket v??", Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
        }
    }

    private eHandler(dataEvent: Globals.I_audioTripObject): void {
        if (dataEvent.inSong) {
            this.mapInfoParser(dataEvent);
            this.scoreParser(dataEvent);

            if (!this._songCard.songCardData.disabled) {
                this._songCard.songCardData.display     = true;
                this._songCard.songCardData.started     = true;
                this._songCard.songCardData.inProgress  = true;
                this._songCard.songCardData.finished    = false;
            }

            this._playerCard.playerCardData.display = false;
        } else {
            if (!this._songCard.songCardData.disabled) {
                this._songCard.songCardData.display     = false;
                this._songCard.songCardData.started     = false;
                this._songCard.songCardData.inProgress  = false;
                this._songCard.songCardData.finished    = true;
            }

            this._playerCard.playerCardData.display = false;
        }

        this.eHandshake(dataEvent);
    }

    private mapInfoParser(dataEvent: Globals.I_audioTripObject): void {
        this._songCard.songCardData.needUpdate      = false;

        this._songCard.songCardPerformance.time     = 0;
        this._songCard.songCardPerformance.accuracy = 100;

        this._songCard.songCardData.title           = dataEvent.songTitle;
        this._songCard.songCardData.subTitle        = "";
        this._songCard.songCardData.mapper          = dataEvent.choreographer;
        this._songCard.songCardData.author          = dataEvent.songArtist;
        this._songCard.songCardData.bpm             = 0;
        this._songCard.songCardData.difficulty      = dataEvent.choreoName;
        this._songCard.songCardData.difficultyClass = dataEvent.choreoName;
        this._songCard.songCardData.hashMap         = "";
        this._songCard.songCardData.bsrKey          = "";
        this._songCard.songCardData.totalTime       = dataEvent.songLength * 1000;
        this._songCard.songCardData.speedModifier   = 1;

        this._songCard.songCardData.cover           = "./pictures/default/notFound.jpg";
    }

    private scoreParser(dataEvent: Globals.I_audioTripObject): void {
        this._songCard.songCardPerformance.combo    = 0;
        this._songCard.songCardPerformance.miss     = 0;
        this._songCard.songCardPerformance.health   = (dataEvent.playerHealth !== -1) ? dataEvent.playerHealth : 0;
        this._songCard.songCardPerformance.score    = dataEvent.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: Globals.I_audioTripObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}