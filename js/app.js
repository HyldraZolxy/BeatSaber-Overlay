import { Template } from "./template.js";
import { ScoreSaber } from "./scoreSaber.js";
import { BeatSaberConnection } from "./beatSaberConnection.js";

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
const scoreSaber = new ScoreSaber();
const pluginConnection = new BeatSaberConnection();

template.loadSkin(urlParams.skin);
template.setScale(urlParams.scale);
template.setupMode(urlParams.setup);

if (urlParams.playerId) {
    scoreSaber.updatePlayerInfo();
}

pluginConnection.loopConnection();
