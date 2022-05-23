import { SongCard } from "./songCard.js";
import { PlayerCard } from "./playerCard.js";

export class BSPlus {

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
    private eHandshake(dataHandshake: any) {
        console.log("%cBeat Saber " + dataHandshake.gameVersion + " | Protocol Version " + dataHandshake.protocolVersion, "background-color: green;");
        console.log("\n\n");

        this._playerCard.playerCardParameters.needUpdate = true;
    }

    private eHandler(dataEvent: any) {
        switch(dataEvent._event) {
            case "gameState":
                switch(dataEvent.gameStateChanged) {
                    case "Menu":
                        this._songCard.songCardParameters.started = false;
                        this._songCard.songCardParameters.inProgress = false;
                        this._songCard.songCardParameters.finished = true;

                        this._playerCard.playerCardParameters.needUpdate = true;
                        this._playerCard.playerCardParameters.display = true;
                        break;

                    case "Playing":
                        this._songCard.songCardParameters.started = true;
                        this._songCard.songCardParameters.finished = false;

                        this._playerCard.playerCardParameters.display = false;
                        break;
                }
                break;

            case "mapInfo":
                this.mapInfoParser(dataEvent.mapInfoChanged);
                break;

            case "score":
                this.scoreParser(dataEvent.scoreEvent);
                break;

            case "pause":
                this._songCard.songCardParameters.paused = true;
                this._songCard.songCardParameters.inProgress = false;
                break;

            case "resume":
                this._songCard.songCardParameters.paused = false;
                this._songCard.songCardParameters.inProgress = true;
                break;
        }
    }

    private mapInfoParser(mapInfoData: any) {
        this._songCard.songCardData.cover = "data:image/png;base64," + mapInfoData.coverRaw;
        this._songCard.songCardData.title = mapInfoData.name;
        this._songCard.songCardData.subTitle = mapInfoData.sub_name;
        this._songCard.songCardData.mapper = mapInfoData.mapper;
        this._songCard.songCardData.author = mapInfoData.artist;

        this._songCard.songCardData.bsrKey = mapInfoData.BSRKey;
        this._songCard.songCardData.bpm = mapInfoData.BPM;

        this._songCard.songCardData.difficulty = (mapInfoData.difficulty === "ExpertPlus") ? "Expert +" : mapInfoData.difficulty;
        this._songCard.songCardData.difficultyClass = mapInfoData.difficulty;

        this._songCard.songCardData.ranked = false;
        this._songCard.songCardData.qualified = false;

        this._songCard.songCardData.time = 0; /// TODO: IMPLEMENT TIME ELAPSED IN BSPLUS_MOD
        this._songCard.songCardData.totalTime = mapInfoData.duration;
        this._songCard.songCardData.timeToLetters = "0:00";
        this._songCard.songCardData.timeToBarLength = 0;

        this._songCard.songCardData.accuracy = 100;
        this._songCard.songCardData.accuracyToLetters = "SS";

        this._songCard.songCardData.speedModifier = 1; /// TODO: SEE this.speedParser()

        if ((mapInfoData.level_id.indexOf("custom_level") === 0) && (mapInfoData.level_id.substring(13).length === 40)) {
            this._songCard.beatSaverInfo(mapInfoData.level_id.substring(13));
        }
    }

    private scoreParser(scoreInfo: any) {
        this._songCard.songCardData.accuracy = +((scoreInfo.accuracy * 100).toFixed(1));
        this._songCard.songCardData.score = scoreInfo.score.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this._songCard.songCardData.combo = scoreInfo.combo;
    }

    // private speedParser(speedInfo: any) {
    //     /// TODO: IMPLEMENT SPEED MULTIPLIER IN BSPLUS_MOD
    // }

    public dataParser(data: any): void {
        let dataParsed = JSON.parse(data.data);

        if (dataParsed._type === "handshake") {
            this.eHandshake(dataParsed);
        }

        if (dataParsed._type === "event") {
            this.eHandler(dataParsed);
        }
    }
}