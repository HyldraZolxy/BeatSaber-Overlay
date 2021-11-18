export class DataPuller {
    urlParams = new URLSearchParams(location.search);
    debug;
    firstTime = true;

    combo = 0;
    noteHit = 0;
    score = 0;

    constructor(_debug) {
        if (this.urlParams.has("debug") && (this.urlParams.get("debug") === "DataPuller")) {
            this.debug = true;
        } else {
            this.debug = _debug;
        }
    
        if (this.debug) {
            console.log("%cWarning! Debug mode for DataPuller activated! You risk being spammed in the log console\n", "background-color:red");
        }
    }

    eventHandler(value, _endPoint) {
        switch(_endPoint) {
            case "MapData":
                let mapDataParsed = JSON.parse(value.data);

                if (this.firstTime) {
                    console.log("%cConnected to DataPuller Plugin", "background-color: green");
                    console.log("%cBeat Saber " + mapDataParsed.GameVersion + " | Data " + mapDataParsed.PluginVersion, "background-color: green");        
                    console.log("\n");
                    this.firstTime = false;
                }

                this.InLevel(mapDataParsed.InLevel);
                this.setSongData(mapDataParsed);
                break;
            case "LiveData":
                let liveDataParsed = JSON.parse(value.data);

                this.updateScore(liveDataParsed.Score);
                this.updateElapsed(liveDataParsed.TimeElapsed);
                this.updatePerformance(liveDataParsed);
                break;
            default:
                break;
        }
    }

    InLevel(value) {
        if (value) {
            document.getElementById("box").style.opacity = 1;
            document.getElementById("scoreInformations").style.opacity = 1;

            /// TODO: Notes per Seconds need more research, so for now just disable it ...
            document.getElementById("notesPerSeconds").style.display = "none";
        } else {
            document.getElementById("box").style.opacity = 0;
            document.getElementById("scoreInformations").style.opacity = 0;

            document.getElementById("notesPerSeconds").style.display = "none";
        }
    }

    setSongData(data) {
        $("#mapIdJS").text(data.BSRKey);

        $("#songTitle").text(data.SongName);
        $("#songArtist").text("By " + data.SongAuthor);
        $("#songMapper").text(data.Mapper);

        $("#mapDifficulty").removeClass();
        $("#mapDifficulty").addClass(data.Difficulty);
        $("#mapDifficultyJS").text(data.Difficulty == "ExpertPlus" ? "Expert +" : data.Difficulty);

        $("#cover").css("background-image", "url(" + data.coverImage + ")");
        $("#bgInfoCoverPos").css("background-image", "url(" + data.coverImage + ")");

        $("#mapDurationLenght").text(this.formatTime(data.Length));

        if (!data.LevelPaused) {
            $("#mapDurationElapsed").text("0:00");
            $("#percentageJS").text("100");
            $("#comboJS").text("0");
            $("#hitNotesJS").text("0");
            $("#missNotesJS").text("0");
        }
    }

    formatTime(value) {
        let secs = value % 60;
        let mins = Math.floor(value / 60);
    
        return mins + ":" + secs.toString().padStart(2, "0");
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

    updateElapsed(value) {
        $("#mapDurationElapsed").text(this.formatTime(value));
    }

    updatePerformance(data) {
        $("#percentageJS").text(Math.floor(data.Accuracy * 100) / 100);
        $("#comboJS").text(data.Combo);
        $("#hitNotesJS").text(this.noteHit);
        $("#missNotesJS").text(data.Misses);

        this.updateNote(data);
    }

    updateNote(data) {
        /// TODO: This is not really accurate, need some research
        if (data.Score == 0) {
            this.combo = 0;
            this.noteHit = 0;
        }

        if (data.Combo == 0) {
            this.combo = 0;
        }

        if (data.Combo > this.combo) {
            this.noteHit = this.noteHit + (data.Combo - this.combo);
            this.combo = data.Combo;
        }
    }
}