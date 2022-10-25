import { Globals } from "./global.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";

export class DataPuller {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _playerCard: PlayerCard;
    private _songCard: SongCard;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private helloEvent = true;
    private oldVersion = false;
    private timeResolve = false;

    constructor() {
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private eHandshake(dataEvent: Globals.I_dataPullerMapDataObject): void {
        if (this.helloEvent) {
            console.log("%cBeat Saber " + dataEvent.GameVersion + " | DataPuller " + dataEvent.PluginVersion, "background-color: green;");
            console.log("\n\n");

            this.helloEvent = false;
            this.oldVersion = (["2.0.12"].includes(dataEvent.PluginVersion)) ? true : false;
        }
    }

    private eHandlerMapData(dataEvent: Globals.I_dataPullerMapDataObject): void {
        if (dataEvent.InLevel) {
            if (!this._songCard.songCardData.started) {
                this.mapInfoParser(dataEvent);
            }

            this._songCard.songCardData.started = true;
            this._songCard.songCardData.paused = false;
            this._songCard.songCardData.inProgress = true;
            this._songCard.songCardData.finished = false;

            if (!this._playerCard.playerCardData.disabled)
                this._playerCard.playerCardData.display = false;

            if (this.helloEvent || dataEvent.PracticeMode) {
                this.timeResolve = true;
            }
        } else {
            this._songCard.songCardData.started = false;
            this._songCard.songCardData.paused = false;
            this._songCard.songCardData.inProgress = false;
            this._songCard.songCardData.finished = true;

            if (!this._playerCard.playerCardData.disabled) {
                this._playerCard.playerCardData.needUpdate = true;
                this._playerCard.playerCardData.display = true;
            }
        }

        if (dataEvent.LevelPaused) {
            this._songCard.songCardData.paused = true;
            this._songCard.songCardData.inProgress = false;
        }

        if (dataEvent.LevelFinished) {
            this._songCard.songCardData.finished = true;

            if (!this._playerCard.playerCardData.disabled)
                this._playerCard.playerCardData.needUpdate = true;
        }

        if (dataEvent.LevelQuit) {
            this._songCard.songCardData.finished = false;
        }

        this.eHandshake(dataEvent);
    }
    private eHandlerLiveData(dataEvent: Globals.I_dataPullerLiveDataObject): void {
        this.scoreParser(dataEvent);

        if (this.timeResolve) {
            this._songCard.songCardData.time = dataEvent.TimeElapsed * 1000;

            this.timeResolve = false;
        }
    }

    private mapInfoParser(dataEvent: Globals.I_dataPullerMapDataObject): void {
        if (dataEvent.coverImage !== null)
            this._songCard.songCardData.cover = "data:image/png;base64," + dataEvent.coverImage;
        else
            this._songCard.songCardData.cover = "./pictures/default/notFound.jpg";

        this._songCard.songCardData.title = dataEvent.SongName;
        this._songCard.songCardData.subTitle = dataEvent.SongSubName;
        this._songCard.songCardData.mapper = dataEvent.Mapper;
        this._songCard.songCardData.author = dataEvent.SongAuthor;

        if (dataEvent.BSRKey !== null)
            this._songCard.songCardData.bsrKey = dataEvent.BSRKey;
        else
            this._songCard.songCardData.bsrKey = "";

        this._songCard.songCardData.bpm = dataEvent.BPM;

        this._songCard.songCardData.difficulty = (dataEvent.Difficulty === "ExpertPlus") ? "Expert +" : dataEvent.Difficulty;
        this._songCard.songCardData.difficultyClass = dataEvent.Difficulty;

        this._songCard.songCardData.time = 0;
        this._songCard.songCardData.totalTime = (this.oldVersion) ? dataEvent.Length * 1000 : dataEvent.Duration * 1000;

        this._songCard.songCardData.accuracy = 100;

        this._songCard.songCardData.speedModifier = this.speedParser(dataEvent);

        this._songCard.songCardData.hashMap = dataEvent.Hash;

        this._songCard.songCardData.needUpdate = true;
    }

    private speedParser(dataEvent: Globals.I_dataPullerMapDataObject) {
        if (dataEvent.PracticeMode) {
            return (this.oldVersion) ? dataEvent.PracticeModeModifiers.songSpeedMul : dataEvent.PracticeModeModifiers.SongSpeedMul;
        }

        if (this.oldVersion) {
            if (dataEvent.Modifiers.fasterSong) {
                return 1.20;
            }

            if (dataEvent.Modifiers.superFastSong) {
                return 1.50;
            }

            if (dataEvent.Modifiers.slowerSong) {
                return 0.85;
            }
        } else {
            if (dataEvent.Modifiers.FasterSong) {
                return 1.20;
            }

            if (dataEvent.Modifiers.SuperFastSong) {
                return 1.50;
            }

            if (dataEvent.Modifiers.SlowerSong) {
                return 0.85;
            }
        }

        return 1;
    }

    private scoreParser(dataEvent: Globals.I_dataPullerLiveDataObject): void {
        this._songCard.songCardData.accuracy = +((dataEvent.Accuracy).toFixed(1));
        this._songCard.songCardData.score = dataEvent.Score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this._songCard.songCardData.combo = dataEvent.Combo;
        this._songCard.songCardData.miss = dataEvent.Misses;

        this._songCard.songCardData.health = dataEvent.PlayerHealth;
    }

    public dataParser(data: string, endPoint: string): void {
        if (endPoint === Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.mapData) {
            let dataParsed: Globals.I_dataPullerMapDataObject = JSON.parse(data);

            this.eHandlerMapData(dataParsed);
        }

        if (endPoint === Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.liveData) {
            let dataParsed: Globals.I_dataPullerLiveDataObject = JSON.parse(data);

            this.eHandlerLiveData(dataParsed);
        }
    }
}