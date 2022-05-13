import { SongCard } from "./songCard.js";
import { PlayerCard } from "./playerCard.js";

export class DataPuller {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _songCard: SongCard;
    private _playerCard: PlayerCard;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private helloEvent = true;
    private timeResolve = false;

    constructor() {
        this._songCard = SongCard.Instance;
        this._playerCard = PlayerCard.Instance;
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private eHandler(dataEvent: any, endPoint: string) {
        switch(endPoint) {
            case "MapData":
                if (dataEvent.InLevel) {
                    if (!this._songCard.songCardParameters.started) {
                        this.mapInfoParser(dataEvent);
                    }

                    this._songCard.songCardParameters.started = true;
                    this._songCard.songCardParameters.inProgress = true;
                    this._songCard.songCardParameters.finished = false;

                    this._playerCard.playerCardParameters.display = false;

                    if (this.helloEvent) {
                        this.timeResolve = true;
                    }
                } else { // MENU
                    this._songCard.songCardParameters.started = false;
                    this._songCard.songCardParameters.inProgress = false;

                    this._playerCard.playerCardParameters.display = true;
                }

                if (dataEvent.LevelPaused) {
                    this._songCard.songCardParameters.paused = true;
                    this._songCard.songCardParameters.inProgress = false;
                }

                if (dataEvent.LevelFinished) {
                    this._songCard.songCardParameters.finished = true;

                    this._playerCard.playerCardParameters.needUpdate = true;
                }

                if (dataEvent.LevelQuit) {
                    this._songCard.songCardParameters.finished = false;
                }

                if (this.helloEvent) {
                    console.log("%cBeat Saber " + dataEvent.GameVersion + " | DataPuller " + dataEvent.PluginVersion, "background-color: green;");
                    console.log("\n\n");

                    this._songCard.songCardParameters.finished = true;

                    this._playerCard.playerCardParameters.needUpdate = true;

                    this.helloEvent = false;
                }
                break;

            case "LiveData":
                this.scoreParser(dataEvent);

                if (this.timeResolve) {
                    this._songCard.songCardData.time = dataEvent.TimeElapsed * 1000;

                    this.timeResolve = false;

                    if (this._songCard.songCardParameters.paused) {
                        this._songCard.timerToBar();
                    }
                }
                break;
        }
    }

    private mapInfoParser(mapInfoData: any) {
        this._songCard.songCardData.cover = mapInfoData.coverImage;
        this._songCard.songCardData.title = mapInfoData.SongName;
        this._songCard.songCardData.subTitle = mapInfoData.SongSubName;
        this._songCard.songCardData.mapper = mapInfoData.Mapper;
        this._songCard.songCardData.author = mapInfoData.SongAuthor;

        this._songCard.songCardData.bpm = mapInfoData.BPM;

        this._songCard.songCardData.difficulty = (mapInfoData.Difficulty === "ExpertPlus") ? "Expert +" : mapInfoData.Difficulty;
        this._songCard.songCardData.difficultyClass = mapInfoData.Difficulty;

        this._songCard.songCardData.time = 0;
        this._songCard.songCardData.totalTime = mapInfoData.Length * 1000;
        this._songCard.songCardData.timeToLetters = "0:00";
        this._songCard.songCardData.timeToBarLength = 0;

        this._songCard.songCardData.accuracy = 100;
        this._songCard.songCardData.accuracyToLetters = "SS";

        this._songCard.songCardData.speedModifier = 1;

        if (mapInfoData.Hash.length === 40) {
            this._songCard.beatSaverInfo(mapInfoData.Hash);
        }

        this.speedParser(mapInfoData);
    }

    private scoreParser(scoreInfo: any) {
        this._songCard.songCardData.accuracy = +((scoreInfo.Accuracy).toFixed(2));
        this._songCard.songCardData.score = scoreInfo.Score;
        this._songCard.songCardData.combo = scoreInfo.Combo;
    }

    private speedParser(speedInfo: any) {
        if (speedInfo.PracticeMode) {
            this._songCard.songCardData.speedModifier = speedInfo.PracticeModeModifiers.songSpeedMul;
        }

        if (speedInfo.Modifiers.fasterSong) {
            this._songCard.songCardData.speedModifier = 1.20;
        }

        if (speedInfo.Modifiers.superFastSong) {
            this._songCard.songCardData.speedModifier = 1.50;
        }

        if (speedInfo.Modifiers.slowerSong) {
            this._songCard.songCardData.speedModifier = 0.85;
        }
    }

    public dataParser(data: any, endPoint: string): void {
        let dataParsed = JSON.parse(data.data);
        this.eHandler(dataParsed, endPoint);
    }
}