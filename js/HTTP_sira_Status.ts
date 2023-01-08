import { Globals }      from "./globals";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";

export class HTTP_sira_Status {

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
    private eHandler(dataEvent: Globals.I_http_Sira_StatusObject): void {
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

    private mapInfoParser(dataEvent: Globals.I_http_Sira_StatusObject): void {
        this._songCard.songCardData.needUpdate      = true;

        this._songCard.songCardPerformance.combo    = 0;
        this._songCard.songCardPerformance.miss     = 0;
        this._songCard.songCardPerformance.accuracy = 100;
        this._songCard.songCardData.speedModifier   = 1;  // To 1 because the mod calculate the length automatically with the speed

        this._songCard.songCardPerformance.score    = "0";
        this._songCard.songCardData.bsrKey          = "";

        this._songCard.songCardData.title           = <string>dataEvent.status.beatmap?.songName;
        this._songCard.songCardData.subTitle        = <string>dataEvent.status.beatmap?.songSubName;
        this._songCard.songCardData.mapper          = <string>dataEvent.status.beatmap?.levelAuthorName;
        this._songCard.songCardData.author          = <string>dataEvent.status.beatmap?.songAuthorName;
        this._songCard.songCardData.hashMap         = <string>dataEvent.status.beatmap?.songHash;
        this._songCard.songCardData.difficulty      = <string>dataEvent.status.beatmap?.difficulty;
        this._songCard.songCardData.difficultyClass = <string>dataEvent.status.beatmap?.difficultyEnum;
        this._songCard.songCardData.bpm             = <number>dataEvent.status.beatmap?.songBPM;
        this._songCard.songCardData.totalTime       = <number>dataEvent.status.beatmap?.length;

        this._songCard.songCardData.cover           = (dataEvent.status.beatmap?.songCover !== null) ? "data:image/png;base64," + <string>dataEvent.status.beatmap?.songCover : "./pictures/default/notFound.jpg";
        this._songCard.songCardPerformance.time     = (dataEvent.status.beatmap?.start !== null && dataEvent.status.beatmap?.start !== undefined) ? dataEvent.time - dataEvent.status.beatmap?.start : 0;
    }

    private scoreParser(dataEvent: Globals.I_http_Sira_StatusObject): void {
        this._songCard.songCardPerformance.health = 1; // Not implemented

        this._songCard.songCardPerformance.combo = <number>dataEvent.status.performance?.combo;
        this._songCard.songCardPerformance.miss = <number>dataEvent.status.performance?.missedNotes;

        this._songCard.songCardPerformance.accuracy = (dataEvent.status.performance?.relativeScore !== undefined) ? +((dataEvent.status.performance.relativeScore * 100).toFixed(1)) : +(((<number>dataEvent.status.performance?.score * 100) / <number>dataEvent.status.performance?.currentMaxScore).toFixed(1));
        this._songCard.songCardPerformance.score = (<number>dataEvent.status.performance?.score).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: Globals.I_http_Sira_StatusObject = JSON.parse(data);

        this.eHandler(dataParsed);
    }
}