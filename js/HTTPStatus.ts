import { SongCard } from "./songCard.js";
import { PlayerCard } from "./playerCard.js";

export class HTTPStatus {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _songCard: SongCard;
    private _playerCard: PlayerCard;

    constructor() {
        this._songCard = SongCard.Instance;
        this._playerCard = PlayerCard.Instance;
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private eHandler(dataEvent: any) {
        switch(dataEvent.event) {
            case "hello":
                console.log("%cBeat Saber " + dataEvent.status.game.gameVersion + " | HTTPStatus " + dataEvent.status.game.pluginVersion, "background-color: green;");
                console.log("\n\n");

                this._songCard.songCardParameters.finished = true;

                this._playerCard.playerCardParameters.needUpdate = true;
                this._playerCard.playerCardParameters.display = true;

                if (dataEvent.status.beatmap !== null) {
                    this._songCard.songCardParameters.started = true;
                    this._songCard.songCardParameters.finished = false;

                    this._playerCard.playerCardParameters.display = false;

                    this.mapInfoParser(dataEvent.status.beatmap);

                    if (dataEvent.status.beatmap.paused !== null) {
                        this._songCard.songCardParameters.paused = true;
                        this._songCard.songCardParameters.inProgress = false;

                        this._songCard.songCardData.time = dataEvent.status.beatmap.paused - dataEvent.status.beatmap.start;
                    } else {
                        this._songCard.songCardParameters.paused = false;
                        this._songCard.songCardParameters.inProgress = true;

                        this._songCard.songCardData.time = dataEvent.time - dataEvent.status.beatmap.start;
                    }

                    this._songCard.timerToBar();
                    this.scoreParser(dataEvent.status.performance);
                }
                break;

            case "songStart":
                this._songCard.songCardParameters.started = true;
                this._songCard.songCardParameters.inProgress = true;

                this._playerCard.playerCardParameters.display = false;

                this.mapInfoParser(dataEvent.status.beatmap);
                break;

            case "pause":
                this._songCard.songCardParameters.paused = true;
                this._songCard.songCardParameters.inProgress = false;
                break;

            case "resume":
                this._songCard.songCardParameters.paused = false;
                this._songCard.songCardParameters.inProgress = true;
                break;

            case "finished":
                this._songCard.songCardParameters.finished = true;

                this._playerCard.playerCardParameters.needUpdate = true;
                break;

            case "menu":
                this._songCard.songCardParameters.started = false;
                this._songCard.songCardParameters.inProgress = false;

                this._playerCard.playerCardParameters.display = true;
                break;

            case "scoreChanged":
                this.scoreParser(dataEvent.status.performance);
                break;
        }
    }

    private mapInfoParser(mapInfoData: any) {
        this._songCard.songCardData.cover = "data:image/png;base64," + mapInfoData.songCover;
        this._songCard.songCardData.title = mapInfoData.songName;
        this._songCard.songCardData.subTitle = mapInfoData.songSubName;
        this._songCard.songCardData.mapper = mapInfoData.levelAuthorName;
        this._songCard.songCardData.author = mapInfoData.songAuthorName;

        this._songCard.songCardData.bpm = mapInfoData.songBPM;

        this._songCard.songCardData.difficulty = mapInfoData.difficulty;
        this._songCard.songCardData.difficultyClass = mapInfoData.difficultyEnum;

        this._songCard.songCardData.time = 0;
        this._songCard.songCardData.totalTime = mapInfoData.length;
        this._songCard.songCardData.timeToLetters = "0:00";
        this._songCard.songCardData.timeToBarLength = 0;

        this._songCard.songCardData.accuracy = 100;
        this._songCard.songCardData.accuracyToLetters = "SS";

        this._songCard.songCardData.speedModifier = 1; // To 1 because the mod calculate the length automatically with the speed

        if (mapInfoData.songHash.length === 40) {
            this._songCard.beatSaverInfo(mapInfoData.songHash);
        }
    }

    private scoreParser(scoreInfo: any) {
        this._songCard.songCardData.accuracy = +(((scoreInfo.score * 100) / scoreInfo.currentMaxScore).toFixed(1));
        this._songCard.songCardData.score = scoreInfo.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this._songCard.songCardData.combo = scoreInfo.combo;
    }

    public dataParser(data: any): void {
        let dataParsed = JSON.parse(data.data);
        this.eHandler(dataParsed);
    }
}