import { Globals }                          from "../../globals";
import { PlayerCard }                       from "../../modules/playerCard";
import { SongCard }                         from "../../modules/songCard";
import { AudioTripSong, I_audioTripSong }   from "../../system/api-call";

interface I_audioTripObject {
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

    playerStatus    : "Playing" | "Finished" | "Failed";    // If you in playing time, or you finish the map, or maybe you fail the map

    score           : number;                               // Player score
    multiplier      : number;                               // Score multiplier
    playerHealth    : number;                               // Player health (-1 if no-fail enabled, else between 1 and 0)
    curSongTime     : number;                               // Current song time in seconds
}

export class AudioTrip {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard     : PlayerCard;
    private _songCard       : SongCard;
    private _audioTripSong  : AudioTripSong;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent = true;
    private alreadyDid = false;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
        this._audioTripSong = new AudioTripSong();
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(dataEvent: I_audioTripObject): void {
        if (this.helloEvent) {
            console.log("%cAudioTrip " + dataEvent.gameVersion + " | WebSocket v??", Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
        }
    }

    private eHandler(dataEvent: I_audioTripObject): void {
        if (dataEvent.inSong) {
            if (!this.alreadyDid) this.mapInfoParser(dataEvent);

            this.scoreParser(dataEvent);
            this.infoParser(dataEvent);

            if (!this._songCard.songCardData.disabled) {
                this._songCard.songCardData.display     = true;
                this._songCard.songCardData.started     = true;
                this._songCard.songCardData.inProgress  = true;
                this._songCard.songCardData.finished    = false;
            }
        } else {
            this.alreadyDid = false;

            if (!this._songCard.songCardData.disabled) {
                this._songCard.songCardData.display     = false;
                this._songCard.songCardData.started     = false;
                this._songCard.songCardData.inProgress  = false;
                this._songCard.songCardData.finished    = true;
            }
        }

        this.eHandshake(dataEvent);
    }

    private async mapInfoParser(dataEvent: I_audioTripObject): Promise<void> {
        this._songCard.songCardPerformance.time         = 0;
        this._songCard.songCardPerformance.accuracy     = 100;

        this._songCard.songCardData.title               = dataEvent.songTitle;
        this._songCard.songCardData.subTitle            = "";
        this._songCard.songCardData.mapper              = dataEvent.choreographer;
        this._songCard.songCardData.author              = dataEvent.songArtist;
        this._songCard.songCardData.bpm                 = 0;
        this._songCard.songCardData.difficulty          = dataEvent.choreoName;
        this._songCard.songCardData.difficultyClass     = dataEvent.choreoName;
        this._songCard.songCardData.hashMap             = "";
        this._songCard.songCardData.bsrKey              = "";
        this._songCard.songCardData.totalTime           = dataEvent.songLength * 1000;
        this._songCard.songCardData.totalTimeToLetters  = this._songCard.timeToLetters(this._songCard.songCardData.totalTime);
        this._songCard.songCardData.speedModifier       = 1;

        this._songCard.songCardData.cover               = await this.getCover(dataEvent.songID);

        this._songCard.songCardData.needUpdate          = true;
        this.alreadyDid                                 = true;
    }
    private async getCover(hash: string): Promise<string> {
        let data: I_audioTripSong = await this._audioTripSong.getSongInfo(hash);
        let coverLink = "./pictures/default/notFound.jpg";

        if (data.coverLink !== undefined) {
            coverLink = "./pictures/coverSong/" + data.coverLink;
        }

        return coverLink;
    }

    private scoreParser(dataEvent: I_audioTripObject): void {
        this._songCard.songCardPerformance.combo    = 0;
        this._songCard.songCardPerformance.miss     = 0;
        this._songCard.songCardPerformance.health   = (dataEvent.playerHealth !== -1) ? dataEvent.playerHealth : 0;
        this._songCard.songCardPerformance.score    = dataEvent.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }
    private infoParser(dataEvent: I_audioTripObject): void {
        this._songCard.songCardPerformance.time = dataEvent.curSongTime * 1000;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: I_audioTripObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}