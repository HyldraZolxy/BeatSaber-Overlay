import { Template } from "../template.js";
import { ScoreSaber } from "../scoreSaber.js";

export class DataPuller {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));
    helloEventParam = true;

    template = new Template();
    scoreSaber = new ScoreSaber();

    songLength = 0;

    constructor() {}

    helloEvent(dataParsed) {
        console.log("%cConnected to DataPuller Plugin", "background-color: green");
        console.log("%cBeat Saber " + dataParsed.GameVersion + " | DataPuller " + dataParsed.PluginVersion, "background-color: green");        
        console.log("\n\n");
        this.helloEventParam = false;
    }

    eventHandler(data, endPoint) {
        let dataParsed = JSON.parse(data.data);

        switch(endPoint) {
            case "mapData":
                if (this.helloEventParam) {
                    this.helloEvent(dataParsed);
                }

                this.songData(dataParsed);
                this.isInLevel(dataParsed.InLevel);
                break;
            case "liveData":
                this.songUpdate(dataParsed);
                break;
            default:
                break;
        }
    }

    showPlayer() {
        if (this.urlParams.playerId) {
            this.scoreSaber.updatePlayerInfo();
            const playerShow = {
                player: ["#", "remove"],
                player2: ["#", "add", "showFirst"],

                playerInfo: ["#", "remove"],
                playerInfo2: ["#", "add", "showSecond"]
            }

            this.template.updateSkin(playerShow);
        }

        const songHidden = {
            songOverlay: ["#", "remove"],
            songOverlay2: ["#", "add", "hiddenSecond"],

            songInfo: ["#", "remove"],
            songInfo2: ["#", "add", "hiddenFirst"]
        }

        this.template.updateSkin(songHidden);
    }

    showSong() {
        if (this.urlParams.playerId) {
            const playerHidden = {
                player: ["#", "remove"],
                player2: ["#", "add", "hiddenSecond"],

                playerInfo: ["#", "remove"],
                playerInfo2: ["#", "add", "hiddenFirst"]
            }

            this.template.updateSkin(playerHidden);
        }

        const songShow = {
            songOverlay: ["#", "remove"],
            songOverlay2: ["#", "add", "showFirst"],

            songInfo: ["#", "remove"],
            songInfo2: ["#", "add", "showSecond"]
        }

        this.template.updateSkin(songShow);
    }

    isInLevel(value) {
        if (value) {
            this.showSong();
        } else {
            this.songLength = 0;
            this.showPlayer();
        }
    }

    songData(mapData) {
        this.songLength = mapData.Length;

        let song = {
            songCover: ["#", "modify", "background-image", "url(" + mapData.coverImage + ")"],

            songStatus: ["#", "modify", "opacity", ((mapData.PP != "0") ? "1" : "0")],

            songTitle: mapData.SongName + " " + mapData.SongSubName,
            songArtisteMapper: mapData.SongAuthor + " [" + mapData.Mapper +"]",

            songDifficulty: (mapData.Difficulty == "ExpertPlus" ? "Expert+" : mapData.Difficulty),
            songDifficulty2: ["#", "remove"],
            songDifficulty3: ["#", "add", mapData.Difficulty],

            songKey: mapData.BSRKey,

            songElapsed: ["#", "modify", "width", "0%"],

            songPercentage: "100"
        }

        this.template.updateSkin(song);
    }

    songUpdate(liveData) {
        let song = {
            songElapsed: ["#", "modify", "width", this.updateElapsed(liveData.TimeElapsed) + "%"],

            songPercentage: this.updatePercentage(liveData.Accuracy)
        }

        this.template.updateSkin(song);
    }

    updatePercentage(value) {
        if (value != 100) {
            return value.toFixed(2);
        } else {
            return "100";
        }
    }

    updateElapsed(value) {
        if (value != 0) {
            return (value / this.songLength) * 100;
        } else {
            return 0;
        }
    }
}
