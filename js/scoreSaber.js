import { Template } from "./template.js";

export class ScoreSaber {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    constructor() {}

    updatePlayerInfo() {
        this.getPlayerInfo(this.urlParams.playerId).then((playerScoreSaberInfo) => {
            var playerInfo = {
                playerAvatar: ["#", "modify", "background-image", "url('" + playerScoreSaberInfo.profilePicture + "')"],
                playerCountry: ["#", "modify", "background-image", "url('../images/country/" + playerScoreSaberInfo.country + ".svg')"],
            
                playerCountryTop: playerScoreSaberInfo.countryRank,
                playerWorldTop: playerScoreSaberInfo.rank,
                playerPerformancePoint: playerScoreSaberInfo.pp
            }
        
            setTimeout(function() {
                const template = new Template();
                template.updateSkin(playerInfo);
            }, 100);
        });
    }

    getPlayerInfo(playerId) {
        return getJson(PROXY_SCORESABER_URL + "?playerId=" + playerId);
    }
}
