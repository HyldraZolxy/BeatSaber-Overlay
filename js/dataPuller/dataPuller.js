import { Template } from "../template.js";
import { ScoreSaber } from "../scoreSaber.js";

export class DataPuller {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));
    helloEventParam = true;

    template = new Template();
    scoreSaber = new ScoreSaber();

    songLength = 0;
    elapsedTime = 0;
    percentage = 100;

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

    isInLevel(value) {
        if (value) {
            this.template.showSong();
        } else {
            this.songLength = 0;
            this.elapsedTime = 0;
            this.percentage = 100;
            this.scoreSaber.updatePlayerInfo();
            this.template.showPlayer();
        }
    }

    songData(mapData) {
        console.log(mapData);
        this.songLength = mapData.Length;

        let songInfo = {
            songCover: {
                selector: "#",
                modify: {
                    background_image: (mapData.coverImage != null) ? "url(" + mapData.coverImage + ")" : "url('../images/not_found.jpg')"
                }
            },
            songTitle: {
                selector: "#",
                value: mapData.SongName + " " + mapData.SongSubName
            },
            songArtisteMapper: {
                selector: "#",
                value: mapData.SongAuthor + " [" + mapData.Mapper +"]"
            },
            songDifficulty: {
                selector: "#",
                removeClass: "",
                addClass: mapData.Difficulty,
                value: (mapData.Difficulty == "ExpertPlus" ? "Expert+" : mapData.Difficulty)
            },
            songStatus: {
                selector: "#",
                modify: {
                    opacity: ((mapData.PP != "0") ? "1" : "0")
                }
            },
            songKey: {
                selector: "#",
                value: mapData.BSRKey
            },
            songElapsed: {
                selector: "#",
                modify: {
                    width: (this.elapsedTime != 0) ? this.elapsedTime + "%" : "0" + "%"
                }
            },
            songPercentage: {
                selector: "#",
                value: (this.percentage != 100) ? this.percentage : "100"
            }
        }

        this.template.updateSkin(songInfo);
    }

    songUpdate(liveData) {
        let songInfo = {
            songElapsed: {
                selector: "#",
                modify: {
                    width: this.updateElapsed(liveData.TimeElapsed) + "%"
                }
            },
            songPercentage: {
                selector: "#",
                value: this.updatePercentage(liveData.Accuracy)
            }
        }

        this.template.updateSkin(songInfo);
    }

    updatePercentage(value) {
        if (value != 100) {
            this.percentage = value.toFixed(2);
            return this.percentage;
        } else {
            return "100";
        }
    }

    updateElapsed(value) {
        if (value != 0) {
            this.elapsedTime = (value / this.songLength) * 100;
            return this.elapsedTime;
        } else {
            return 0;
        }
    }
}
