const URL = location.search;
const PROXY_SCORESABER_URL = "../fetchingData.php";
const BEATSAVER_URL = "https://api.beatsaver.com/maps/hash/";
const TIMER_UPDATE_SCORESABER = 60000;
const TIMER_UPDATE_PLUGINS = 5000;
const NUMBER_OF_TRY_PLUGINS = 3;

const PARAMS = {
    debug: ["true", "false"],
    setup: ["true", "false"],
    skin: ["default", "fridayNightFunkin"], // <-- Leaking futur skin POG ?
    scale: ["1"],
    ip: ["127.0.0.1"],
    playerId: ["76561198235823594"] // Yep, it's me >:3
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

function getUrlParams() {
    const params = {};
    const queryString = new URLSearchParams(URL);

    for (let [paramName, value] of queryString) {
        if (validateParams(paramName, value)) {
            params[paramName] = value;
        }
    }

    return params;
}

function validateParams(paramName, value) {
    if (paramName === "ip") {
        validateIp(value);
    }

    if (paramName === "playerId") {
        validatePlayerId(value);
    }

    if (paramName === "scale") {
        validateScale(value);
    }

    if (PARAMS.hasOwnProperty(paramName) && PARAMS[paramName].includes(value)) {
        return true;
    }

    return false;
}

function validateIp(ip) {
    if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(ip)) {
        if (!PARAMS.ip.includes(ip)) {
            PARAMS.ip.push(ip);
        }

        return true;
    }

    return false;
}

function validatePlayerId(playerId) {
    if (/^-?\d+$/.test(playerId)) {
        if (!PARAMS.playerId.includes(playerId)) {
            PARAMS.playerId.push(playerId);
        }

        return true;
    }

    return false;
}

function validateScale(scale) {
    if (/^[+-]?\d+(\.\d+)?$/.test(scale)) {
        if (!PARAMS.scale.includes(scale)) {
            PARAMS.scale.push(scale);
        }

        return true;
    }

    return false;
}

function getJson(Url) {
    return fetch(Url).then((response) => response.json()).then((data) => { return data; });
}

function getText(Url) {
    return fetch(Url).then((response) => response.text()).then((data) => { return data; });
}
