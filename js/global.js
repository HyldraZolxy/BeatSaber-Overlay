const URL = location.search;

const PROXY_SCORESABER_URL = "../fetchingData.php";
const BEATSAVER_URL = "https://api.beatsaver.com/maps/hash/";

const TIMER_UPDATE_PLUGINS = 5000;
const TIMER_UPDATE_TEMPLATE = 50;

const NUMBER_OF_TRY_PLUGINS = 3;

const URL_PARAMS = {
    debug: ["true", "false"],
    setup: ["true", "false"],
    ip: ["127.0.0.1"],
    skin: ["default", "fridayNightFunkin"],
    scale: ["1"],
    playerId: ["76561198235823594"]
};

const SKIN_PATH = {
    default: "../skin/default/default",
    fridayNightFunkin: "../skin/fridayNightFunkin/fridayNightFunkin"
}

const WEBSOCKET_PARAMS = {
    HTTPStatus: {
        port: "6557",
        entry: "/socket"
    },
    DataPuller: {
        port: "2946",
        entry: "/BSDataPuller/",
        endpoint: {
            mapData: "MapData",
            liveData: "LiveData"
        }
    }
}

const DEFAULT_SONG = {
    songCover: {
        selector: "#",
        modify: {
            background_image: "url(https://eu.cdn.beatsaver.com/eed7fc6935a86b9ad1248107ae6b2f65d9da7a1f.jpg)"
        }
    },
    songStatus: {
        selector: "#",
        modify: {
            opacity: "1"
        }
    },
    songTitle: {
        selector: "#",
        value: "[BLEED BLOOD]"
    },
    songArtisteMapper: {
        selector: "#",
        value: "Camellia [jabob]"
    },
    songDifficulty: {
        selector: "#",
        removeClass: "",
        addClass: "ExpertPlus",
        value: "Expert+"
    },
    songKey: {
        selector: "#",
        value: "10217"
    },
    songElapsed: {
        selector: "#",
        modify: {
            width: "23%"
        }
    },
    songPercentage: {
        selector: "#",
        value: "97.26"
    }
}

const DEFAULT_PLAYER = {
    playerAvatar: {
        selector: "#",
        modify: {
            background_image: "url('../images/not_found.jpg')"
        }
    },
    playerCountry: {
        selector: "#",
        modify: {
            background_image: "url('../images/country/FR.svg')"
        }
    },
    playerCountryTop: {
        selector: "#",
        value: "NaN"
    },
    playerWorldTop: {
        selector: "#",
        value: "NaN"
    },
    playerPerformancePoint: {
        selector: "#",
        value: "NaN"
    }
}

function getUrlParams() {
    const params = {};
    const queryString = new URLSearchParams(URL);

    for (let [paramName, value] of queryString) {
        if (URL_PARAMS.hasOwnProperty(paramName)) {
            if (validateValue(paramName, value)) {
                params[paramName] = validateValue(paramName, value);
            }
        }
    }

    return params;
}

function validateValue(paramName, value) {
    switch(paramName) {
        case "debug":
        case "setup":
            if (URL_PARAMS[paramName].includes(value)) {
                return (value == "true");
            }
            break;
        case "ip":
            if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(value)) {
                if (!URL_PARAMS.ip.includes(value)) {
                    URL_PARAMS.ip.push(value);
                }

                return value;
            }
            break;
        case "skin":
            if (URL_PARAMS[paramName].includes(value)) {
                return value;
            }
            break;
        case "scale":
            if (RegExp(/^[+-]?\d+(\.\d+)?$/).test(value)) {
                if (!URL_PARAMS.scale.includes(value)) {
                    URL_PARAMS.scale.push(value);
                }

                return value;
            }
            break;
        case "playerId":
            if (RegExp(/^-?\d+$/).test(value)) {
                if (!URL_PARAMS.playerId.includes(value)) {
                    URL_PARAMS.playerId.push(value);
                }

                return value;
            }
            break;
        default:
            break;
    }
}

function getJson(Url) {
    return fetch(Url)
        .then((response) => response.json())
        .then((data) => {
            return data;
        });
}
