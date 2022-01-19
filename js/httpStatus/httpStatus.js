import { Template } from "../template.js";
import { ScoreSaber } from "../scoreSaber.js";

export class HTTPStatus {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    template = new Template();
    scoreSaber = new ScoreSaber();

    songTimer;
    songElapsedTime = 0;

    constructor() {}

    eventHandler(data) {
        let dataParsed = JSON.parse(data.data);

        switch(dataParsed.event) {
            case "hello":
                console.log("%cConnected to HTTPStatus Plugin", "background-color: green");
                console.log("%cBeat Saber " + dataParsed.status.game.gameVersion + " | HTTPStatus " + dataParsed.status.game.pluginVersion, "background-color: green");
                console.log("\n\n");

                if (dataParsed.status.beatmap != null) {
                    if (dataParsed.status.beatmap.paused != null) {
                        this.songElapsedTime = ((dataParsed.status.beatmap.paused - dataParsed.status.beatmap.start) / 100);
                    } else {
                        this.songElapsedTime = ((Date.now() - dataParsed.status.beatmap.start) / 100);
                        this.startTimer(dataParsed.status.beatmap.length);
                    }
                    this.songData(dataParsed.status.beatmap);
                    this.template.showSong();
                }
                break;
            case "songStart":
                this.startTimer(dataParsed.status.beatmap.length);
                this.songData(dataParsed.status.beatmap);
                this.template.showSong();
                break;
            case "pause":
                this.stopTimer();
                break;
            case "resume":
                this.songElapsedTime++;
                this.startTimer(dataParsed.status.beatmap.length);
                break;
            case "menu":
                this.stopTimer();
                this.scoreSaber.updatePlayerInfo();
                this.template.showPlayer();
                this.songElapsedTime = 0;
                break;
            case "scoreChanged":
                this.updatePercentage(dataParsed.status.performance);
                break;
            default:
                // For development and testing
                //console.log(dataParsed.event);
                //console.log("\n");
                break;
        }
    }

    songData(beatmapData) {
        getJson(BEATSAVER_URL + beatmapData.songHash).then((response) => {
            let bsrKey = response.id;
            let ranked = response.ranked;

            let songInfo = {
                songStatus: {
                    selector: "#",
                    modify: {
                        opacity: ((ranked) ? "1" : "0")
                    }
                },
                songKey: {
                    selector: "#",
                    value: bsrKey
                }
            }
    
            this.template.updateSkin(songInfo);
        });

        let songInfo = {
            songCover: {
                selector: "#",
                modify: {
                    background_image: "url(data:image/png;base64," + beatmapData.songCover + ")"
                }
            },
            songTitle: {
                selector: "#",
                value: beatmapData.songName + " " + beatmapData.songSubName
            },
            songArtisteMapper: {
                selector: "#",
                value: beatmapData.songAuthorName + " [" + beatmapData.levelAuthorName +"]"
            },
            songDifficulty: {
                selector: "#",
                removeClass: "",
                addClass: beatmapData.difficultyEnum,
                value: beatmapData.difficulty
            },
            songElapsed: {
                selector: "#",
                modify: {
                    width: this.formatElapsedTime(beatmapData.length, this.songElapsedTime) + "%"
                }
            },
            songPercentage: {
                selector: "#",
                value: "100"
            }
        }

        this.template.updateSkin(songInfo);
    }

    formatElapsedTime(songLenght, elapsedTime) {
        if (elapsedTime != 0) {
            return ((elapsedTime * 10) / songLenght) * 1000;
        } else {
            return 0;
        }
    }

    startTimer(songLenght) {
        this.songTimer = setInterval(() => {
            this.songElapsedTime++;

            let songInfo = {
                songElapsed: {
                    selector: "#",
                    modify: {
                        width: this.formatElapsedTime(songLenght, this.songElapsedTime) + "%"
                    }
                }
            }
    
            this.template.updateSkin(songInfo);
        }, 100);
    }

    stopTimer(preventDualTimer = false) {
        clearInterval(this.songTimer);

        if (preventDualTimer) {
            this.songElapsedTime = 0;
        }
    }

    updatePercentage(performanceData) {
        let songInfo = {
            songPercentage: {
                selector: "#",
                value: Math.round((performanceData.score.toFixed(2) / performanceData.currentMaxScore.toFixed(2)) * 10000) / 100
            }
        }

        this.template.updateSkin(songInfo);
    }
}
