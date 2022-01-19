import { Template } from "./template.js";

export class ScoreSaber {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    template = new Template();

    constructor() {}

    updatePlayerInfo() {
        this.getPlayerInfo(this.urlParams.playerId).then((playerScoreSaberInfo) => {
            var playerInfo = DEFAULT_PLAYER;
            if (!playerScoreSaberInfo.errorMessage) {
                playerInfo = {
                    playerAvatar: {
                        selector: "#",
                        modify: {
                            background_image: "url('" + playerScoreSaberInfo.profilePicture + "')"
                        }
                    },
                    playerCountry: {
                        selector: "#",
                        modify: {
                            background_image: "url('../images/country/" + playerScoreSaberInfo.country + ".svg')"
                        }
                    },
                    playerCountryTop: {
                        selector: "#",
                        value: playerScoreSaberInfo.countryRank
                    },
                    playerWorldTop: {
                        selector: "#",
                        value: playerScoreSaberInfo.rank
                    },
                    playerPerformancePoint: {
                        selector: "#",
                        value: playerScoreSaberInfo.pp
                    }
                }
            }
            
            setTimeout(() => {
                this.template.updateSkin(playerInfo);
            }, TIMER_UPDATE_TEMPLATE);
        });
    }

    getPlayerInfo(playerId) {
        return getJson(PROXY_SCORESABER_URL + "/?params=player" + "&playerId=" + playerId + "&endPoint=basic");
    }
}
