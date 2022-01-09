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

                if (dataParsed.status.beatmap == null) {
                    this.showPlayer();
                } else {
                    if (dataParsed.status.beatmap.paused != null) {
                        this.songElapsedTime = ((dataParsed.status.beatmap.paused - dataParsed.status.beatmap.start) / 100);
                    } else {
                        this.songElapsedTime = ((Date.now() - dataParsed.status.beatmap.start) / 100);
                        this.startTimer(dataParsed.status.beatmap.length);
                    }
                    this.songData(dataParsed.status.beatmap);
                    this.showSong();
                }
                break;
            case "songStart":
                this.startTimer(dataParsed.status.beatmap.length);
                this.songData(dataParsed.status.beatmap);
                this.showSong();
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
                this.showPlayer();
                this.songElapsedTime = 0;
                break;
            case "scoreChanged":
                this.updatePercentage(dataParsed.status.performance);
                break;
            case "failed":
                this.stopTimer();
                break;
            case "finished":
                this.stopTimer();
                break;
            default:
                // For development and testing
                //console.log(dataParsed.event);
                //console.log("\n");
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

    songData(beatmapData) {
        getJson(BEATSAVER_URL + beatmapData.songHash).then((response) => {
            let bsrKey = response.id;
            let ranked = response.ranked;

            let song = {
                songStatus: ["#", "modify", "opacity", ((ranked) ? "1" : "0")],
                songKey: bsrKey
            }
    
            this.template.updateSkin(song);
        });

        let song = {
            songCover: ["#", "modify", "background-image", "url(data:image/png;base64," + beatmapData.songCover + ")"],

            songTitle: beatmapData.songName + " " + beatmapData.songSubName,
            songArtisteMapper: beatmapData.songAuthorName + " [" + beatmapData.levelAuthorName +"]",

            songDifficulty: beatmapData.difficulty,
            songDifficulty2: ["#", "remove"],
            songDifficulty3: ["#", "add", beatmapData.difficultyEnum],

            songElapsed: ["#", "modify", "width", this.formatElapsedTime(beatmapData.length, this.songElapsedTime) + "%"],

            songPercentage: "100"
        }

        this.template.updateSkin(song);
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

            let song = {
                songElapsed: ["#", "modify", "width", this.formatElapsedTime(songLenght, this.songElapsedTime) + "%"]
            }

            this.template.updateSkin(song);
        }, 100);
    }

    stopTimer() {
        clearInterval(this.songTimer);
    }

    updatePercentage(performanceData) {
        let percentage = {
            songPercentage: Math.round((performanceData.score.toFixed(2) / performanceData.currentMaxScore.toFixed(2)) * 10000) / 100
        }

        this.template.updateSkin(percentage);
    }
}
