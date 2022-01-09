import { DataPuller } from "./dataPuller/dataPuller.js";
import { HTTPStatus } from "./httpStatus/httpStatus.js";
import { Template } from "./template.js";

export class BeatSaberConnection {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    isConnected = false;
    plugin = "HTTPStatus";
    numberOfTry = 1;

    constructor() {}

    loopConnection() {
        let numberOfAlreadyConnected = 0;

        setInterval(() => {
            if (this.isConnected) {
                if (numberOfAlreadyConnected == 0) {
                    if (this.urlParams.debug) {
                        console.log("%cbeatSaberConnection.js", "background-color:cyan");
                        console.log("%cWebSocket is already connected !", "background-color:green");
                        console.log("\n\n");
                    }

                    numberOfAlreadyConnected++;
                }
            } else {
                if (this.urlParams.debug) {
                    console.log("%cbeatSaberConnection.js", "background-color:cyan");
                    console.log("%cWebSokect is not connected !", "background-color:red");
                    console.log("Let's try to connect it ...");
                    console.log("\n\n");
                }

                numberOfAlreadyConnected = 0;
                this.webSocketConnection();
                this.pluginChanger();
            }
        }, TIMER_UPDATE_PLUGINS);
    }

    webSocketConnection() {
        switch(this.plugin) {
            case "HTTPStatus":
                let httpStatus = new HTTPStatus();
                let HTTPStatusWebSocket = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.HTTPStatus.port + WEBSOCKET_PARAMS.HTTPStatus.entry);
                
                HTTPStatusWebSocket.onopen = () => {
                    this.isConnected = true;
                };

                HTTPStatusWebSocket.onclose = () => {
                    this.isConnected = false;
                    httpStatus.stopTimer();
                    this.hiddingElement();
                };

                HTTPStatusWebSocket.onmessage = (data) => {
                    httpStatus.eventHandler(data);
                };
                break;
            case "DataPuller":
                let dataPuller = new DataPuller();
                let DataPullerWebSocket = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.DataPuller.port + WEBSOCKET_PARAMS.DataPuller.entry + WEBSOCKET_PARAMS.DataPuller.endpoint.mapData);
                let DataPullerWebSocket2 = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.DataPuller.port + WEBSOCKET_PARAMS.DataPuller.entry + WEBSOCKET_PARAMS.DataPuller.endpoint.liveData);
                
                DataPullerWebSocket.onopen = () => {
                    this.isConnected = true;
                };

                DataPullerWebSocket.onclose = () => {
                    this.isConnected = false;
                    this.hiddingElement();
                };

                DataPullerWebSocket.onmessage = (data) => {
                    dataPuller.eventHandler(data, "mapData");
                };

                DataPullerWebSocket2.onmessage = (data) => {
                    dataPuller.eventHandler(data, "liveData");
                };
                break;
            default:
                break;
        }
    }

    pluginChanger() {
        if (this.numberOfTry >= NUMBER_OF_TRY_PLUGINS) {
            if (this.urlParams.debug) {
                console.log("%cbeatSaberConnection.js", "background-color:cyan");
                console.log("Number of try is reached, change the plugin to " + this.plugin + " from " + (this.plugin == "HTTPStatus" ? "DataPuller" : "HTTPStatus"));
                console.log("\n\n");
            }

            this.numberOfTry = 1;
            this.plugin = this.plugin == "HTTPStatus" ? this.plugin = "DataPuller" : this.plugin = "HTTPStatus";
        } else {
            this.numberOfTry++;
        }
    }

    hiddingElement() {
        if (this.urlParams.playerId) {
            const hiddingElement = {
                player: ["#", "remove"],
                player2: ["#", "add", "hiddenSecond"],
                playerInfo: ["#", "remove"],
                playerInfo2: ["#", "add", "hiddenFirst"],

                songOverlay: ["#", "remove"],
                songOverlay2: ["#", "add", "hiddenSecond"],
                songInfo: ["#", "remove"],
                songInfo2: ["#", "add", "hiddenFirst"]
            }

            new Template().updateSkin(hiddingElement);
        }
    }
}
