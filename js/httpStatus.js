export class HTTPStatus {
    urlParams = new URLSearchParams(location.search);
    debug;

    beatsaverURL = "https://api.beatsaver.com/maps/hash";

    elapsed = 0;
    elapsedTimer;
    npsTimer;
    score;
    nps = 0;

    constructor(_debug) {
        this.debug = _debug;
        if (this.urlParams.has("debug") && (this.urlParams.get("debug") === "HTTPStatus")) {
            this.debug = true;
        }
    
        if (this.debug) {
            console.log("%cWarning! Debug mode for HTTPStatus activated! You risk being spammed in the log console\n", "background-color:red");
        }
    }

    eventHandler(value) {
        let dataParsed = JSON.parse(value.data);

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
                    this.songStart(dataParsed.status);
                }
                break;
            case "songStart":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is started");
                    console.log("\n");
                }

                this.songStart(dataParsed.status);
                break;
            case "scoreChanged":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The score is changed");
                    console.log("\n");
                }

                this.scoreChanged(dataParsed.status);
                break;
            case "noteCut":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The note is cuted");
                    console.log("\n");
                }

                this.noteCut(dataParsed.status);
                break;
            case "noteMissed":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The note is missed");
                    console.log("\n");
                }

                this.noteMissed(dataParsed.status);
                break;
            case "pause":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is paused");
                    console.log("\n");
                }

                this.pause();
                break;
            case "resume":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("The song is resumed");
                    console.log("\n");
                }

                this.resume();
                break;
            case "menu":
                if (this.debug) {
                    console.log("%cHTTPStatus.js log...", "background-color:blue");
                    console.log("In menu");
                    console.log("\n");
                }

                this.menu();
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

    songStart(data) {
        this.elapsed = Math.floor((Date.now() - data.beatmap.start) / 1000);
        this.setScore(data.performance.score);
        this.setSongData(data.beatmap);
        this.startTimers();
        document.getElementById("box").style.opacity = 1;
        document.getElementById("scoreInformations").style.opacity = 1;
    }

    scoreChanged(data) {
        this.updateScore(data.performance.score);
        this.performance(data.performance);
    }

    noteCut(data) {
        this.performance(data.performance, true);
    }

    noteMissed(data) {
        this.performance(data.performance, true);
    }

    pause() {
        this.stopTimers();
    }

    resume() {
        this.elapsed++;
        this.startTimers();
    }

    menu() {
        this.stopTimers();
        document.getElementById("box").style.opacity = 0;
        document.getElementById("scoreInformations").style.opacity = 0;
    }

    /**
     * Other function
     */

     setScore(value) {
        this.score = value;
        this.updateScore();
    }

    updateScore(score) {
        let millions = null;
        let thousands = null;
        let other = 0;
    
        if (score > 0) {
            other = (score % 1000).toString();
        }
        if (score >= 1000) {
            thousands = (Math.floor(score / 1000) % 1000).toString();
            other = other.padStart(3, '0');
        }
        if (score >= 1000000) {
            millions = (Math.floor(score / 1000000)).toString();
            thousands = thousands.padStart(3, '0');
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
        this.getHTTP(this.beatsaverURL + "/" + data.songHash, function(response) {
            let bsJSON = JSON.parse(response);
            $("#mapIdJS").text(bsJSON.id);
        });
    
        $("#songTitle").text(data.songName);
        $("#songArtist").text("By " + data.songAuthorName);
        $("#songMapper").text(data.levelAuthorName);
        $("#mapDifficulty").removeClass();
        $("#mapDifficulty").addClass(data.difficultyEnum);
        $("#mapDifficultyJS").text(data.difficulty);
        $("#cover").css("background-image", "url(data:image/png;base64," + data.songCover + ")");
        $("#bgInfoCoverPos").css("background-image", "url(data:image/png;base64," + data.songCover + ")");
        $("#mapDurationElapsed").text("0:00");
        $("#mapDurationLenght").text(this.formatTime(Math.round(data.length / 1000)));
        $("#percentageJS").text("100");
        $("#comboJS").text("0");
        $("#hitNotesJS").text("0");
        $("#missNotesJS").text("0");
        $("#notesPerSecondsJS").text("0");
    }

    getHTTP(url, callback) {
        let xH = new XMLHttpRequest();
    
        xH.onreadystatechange = function() {
            if (xH.readyState === 4 && xH.status === 200) {
                callback(xH.responseText);
            }
        }
    
        xH.open("GET", url, true);
        xH.send(null);
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