import { Template } from "./template.js";
import { BeatSaberConnection } from "./beatSaberConnection.js";
import { ScoreSaber } from "./scoreSaber.js";

var urlParams;

class App {
    constructor() {
        urlParams = getUrlParams();
        sessionStorage.setItem("urlParams", JSON.stringify(urlParams));

        if (urlParams.debug) {
            console.log("%cWarning! Debug mode activated! You risk being spammed in the log console\n\n", "background-color:red");

            console.log("%cApp.js", "background-color:cyan");
            console.log("URL Parameters validated:");
            console.log(urlParams);
            console.log("\n\n");
        }
    }
}

new App();

const template = new Template();
template.loadSkin();
template.setScale(urlParams.scale);

const pluginConnection = new BeatSaberConnection();
pluginConnection.loopConnection();

setInterval(() => {
    if (pluginConnection.isConnected && urlParams.playerId) {
        new ScoreSaber().updatePlayerInfo();
    }
}, TIMER_UPDATE_SCORESABER);

// TODO: Change that for better use, because in app.js is ugly ...
if (urlParams.setup) {
    new ScoreSaber().updatePlayerInfo();

    setTimeout(() => {
        let setupSong = {
            songCover: ["#", "modify", "background-image", "url(https://eu.cdn.beatsaver.com/eed7fc6935a86b9ad1248107ae6b2f65d9da7a1f.jpg)"],

            songStatus: ["#", "modify", "opacity", "1"],

            songTitle: "[BLEED BLOOD]",
            songArtisteMapper: "Camellia [jabob]",

            songDifficulty: "Expert+",
            songDifficulty2: ["#", "remove"],
            songDifficulty3: ["#", "add", "ExpertPlus"],

            songKey: "10217",

            songElapsed: ["#", "modify", "width", "23%"],

            songPercentage: "97.26"
        }
        template.updateSkin(setupSong);
    }, 100);

    setTimeout(() => {
        const playerShow = {
            player: ["#", "remove"],
            player2: ["#", "add", "showFirst"],
    
            playerInfo: ["#", "remove"],
            playerInfo2: ["#", "add", "showSecond"]
        }
    
        template.updateSkin(playerShow);
    }, 100);

    setInterval(() => {
        let songShow = {
            player: ["#", "remove"],
            player2: ["#", "add", "hiddenSecond"],
            playerInfo: ["#", "remove"],
            playerInfo2: ["#", "add", "hiddenFirst"],

            songOverlay: ["#", "remove"],
            songOverlay2: ["#", "add", "showFirst"],
            songInfo: ["#", "remove"],
            songInfo2: ["#", "add", "showSecond"]
        }

        template.updateSkin(songShow);

        setTimeout(() => {
            const playerShow = {
                player: ["#", "remove"],
                player2: ["#", "add", "showFirst"],
                playerInfo: ["#", "remove"],
                playerInfo2: ["#", "add", "showSecond"],

                songOverlay: ["#", "remove"],
                songOverlay2: ["#", "add", "hiddenSecond"],
                songInfo: ["#", "remove"],
                songInfo2: ["#", "add", "hiddenFirst"]
            }
        
            template.updateSkin(playerShow);
        }, 5000);
    }, 10000);
}
