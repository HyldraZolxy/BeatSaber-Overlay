export class HTTPStatus {
    urlParams = new URLSearchParams(location.search);
    debug;

    beatSaverURL = "https://api.beatsaver.com/maps/hash/";

    elapsedTimer;
    npsTimer;

    elapsed = 0;
    nps = 0;

    constructor(_debug) {
        if (this.urlParams.has("debug") && (this.urlParams.get("debug") === "HTTPStatus")) {
            this.debug = true;
        } else {
            this.debug = _debug;
        }

        if (this.debug) {
            console.log("%cWarning! Debug mode for HTTPStatus activated! You risk being spammed in the log console", "background-color:red");
            console.log("\n");
        }
    }

    eventHandler(value) {
        let dataParsed = JSON.parse(value.data);

        if (this.debug) {
            console.log("%cHTTPStatus.js log...", "background-color:blue");
            console.log("Data : ");
            console.log(dataParsed);
            console.log("\n");
        }

        switch(dataParsed.event) {
            case "hello":
                console.log("%cConnected to HTTPStatus Plugin", "background-color: green")
                console.log("%cBeat Saber " + dataParsed.status.game.gameVersion + " | HTTPStatus " + dataParsed.status.game.pluginVersion, "background-color: green");
                
                if (dataParsed.status.beatmap && dataParsed.status.performance) {
                    if (this.debug) {
                        console.log("%cHTTPStatus.js log...", "background-color:blue");
                        console.log("The song is already started !");
                        console.log("\n");
                    }
                    
                    if (dataParsed.status.beatmap.paused != null) {
                        this.elapsed = (Math.floor((Date.now() - dataParsed.status.beatmap.start) / 1000) - Math.floor((Date.now() - dataParsed.status.beatmap.paused) / 1000)) - 1;
                    } else {
                        this.startTimers();
                    }

                    this.updateScore(dataParsed.status.performance.score);
                    this.setSongData(dataParsed.status.beatmap);
                    
                    document.getElementById("box").style.opacity = 1;
                    document.getElementById("scoreInformations").style.opacity = 1;
                }
                break;
            case "songStart":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is started");
                    console.log("\n");
                }

                this.elapsed = Math.floor((Date.now() - dataParsed.status.beatmap.start) / 1000);

                this.updateScore(dataParsed.status.performance.score);
                this.setSongData(dataParsed.status.beatmap);

                this.startTimers();

                document.getElementById("box").style.opacity = 1;
                document.getElementById("scoreInformations").style.opacity = 1;
                break;
            case "scoreChanged":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The score is changed");
                    console.log("\n");
                }

                this.updateScore(dataParsed.status.performance.score);
                this.performance(dataParsed.status.performance);
                break;
            case "noteCut":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("Data : ");
                    console.log(dataParsed);
                    console.log("\n");
                }

                this.performance(dataParsed.status.performance, true);
                break;
            case "noteMissed":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The note is missed");
                    console.log("\n");
                }

                this.performance(dataParsed.status.performance, true);
                break;
            case "pause":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is paused");
                    console.log("\n");
                }

                this.stopTimers();
                break;
            case "resume":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is resumed");
                    console.log("\n");
                }

                this.elapsed++;
                this.startTimers();
                break;
            case "menu":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("In menu");
                    console.log("\n");
                }

                this.stopTimers();

                document.getElementById("box").style.opacity = 0;
                document.getElementById("scoreInformations").style.opacity = 0;
                break;
            default:
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("%cEvent not supported", "background-color: red");
                    console.log("\n");
                }
                break;
        }
    }

    /**
     * Other function
     */
    updateScore(score) {
        let millions = null;
        let thousands = null;
        let other = 0;
    
        if (score > 0) {
            other = (score % 1000).toString();
        }
        if (score >= 1000) {
            thousands = (Math.floor(score / 1000) % 1000).toString();
            other = other.padStart(3, "0");
        }
        if (score >= 1000000) {
            millions = (Math.floor(score / 1000000)).toString();
            thousands = thousands.padStart(3, "0");
        }
    
        $("#millions").text(millions);
        $("#thousands").text(thousands);
        $("#other").text(other);
    }

    performance(data, isNote = false) {
        $("#percentageJS").text(Math.floor((data.score / data.currentMaxScore) * 1000) / 10);
        $("#comboJS").text(data.combo);
        $("#hitNotesJS").text(data.hitNotes);
        $("#missNotesJS").text(data.missedNotes);
    
        if (isNote) {
            this.nps++;
    
            setTimeout(() => {
                this.nps--;
                $("#notesPerSecondsJS").text(this.nps);
            }, 1000);
    
            $("#notesPerSecondsJS").text(this.nps);
        }
    }

    setSongData(data) {
        fetch(this.beatSaverURL + data.songHash).then(function(response) {
            response.json().then(function(json) {
                $("#mapIdJS").text(json.id);
            });
        });

        $("#songTitle").text(data.songName);
        $("#songArtist").text("By " + data.songAuthorName);
        $("#songMapper").text(data.levelAuthorName);

        $("#mapDifficulty").removeClass();
        $("#mapDifficulty").addClass(data.difficultyEnum);
        $("#mapDifficultyJS").text(data.difficulty);

        $("#cover").css("background-image", "url(data:image/png;base64," + data.songCover + ")");
        $("#bgInfoCoverPos").css("background-image", "url(data:image/png;base64," + data.songCover + ")");

        if (this.elapsed != 0) {
            $("#mapDurationElapsed").text(this.formatTime(this.elapsed));
        } else {
            $("#mapDurationElapsed").text("0:00");
        }
        $("#mapDurationLenght").text(this.formatTime(Math.round(data.length / 1000)));

        $("#percentageJS").text("100");
        $("#comboJS").text("0");
        $("#hitNotesJS").text("0");
        $("#missNotesJS").text("0");
        $("#notesPerSecondsJS").text("0");
    }

    formatTime(value) {
        let secs = value % 60;
        let mins = Math.floor(value / 60);
    
        return mins + ":" + secs.toString().padStart(2, "0");
    }
    
    startTimers() {
        this.elapsedTimer = setInterval(() => {
            this.elapsed++;
            $("#mapDurationElapsed").text(this.formatTime(this.elapsed));
        }, 1000);
    
        this.npsTimer = setInterval(() => {
            $("#calcNPSValue").text(this.nps);
        }, 1000);
    }
    
    stopTimers() {
        clearInterval(this.elapsedTimer);
    }
}