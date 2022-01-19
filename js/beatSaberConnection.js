import { Template } from "./template.js";
import { DataPuller } from "./dataPuller/dataPuller.js";
import { HTTPStatus } from "./httpStatus/httpStatus.js";

export class BeatSaberConnection {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    isConnected = false;
    plugin = "HTTPStatus";
    numberOfTry = 1;

    template = new Template();
    httpStatus = new HTTPStatus();
    dataPuller = new DataPuller();

    constructor() {}

    loopConnection() {
        setInterval(() => {
            if (this.isConnected) {
                if (this.urlParams.debug) {
                    console.log("%cbeatSaberConnection.js", "background-color:cyan");
                    console.log("%cWebSocket is already connected !", "background-color:green");
                    console.log("\n\n");
                }
            } else {
                if (this.urlParams.debug) {
                    console.log("%cbeatSaberConnection.js", "background-color:cyan");
                    console.log("%cWebSokect is not connected !", "background-color:red");
                    console.log("Let's try to connect it ...");
                    console.log("\n\n");
                }

                this.webSocketConnection();
                this.pluginChanger();
            }
        }, TIMER_UPDATE_PLUGINS);
    }

    webSocketConnection() {
        switch(this.plugin) {
            case "HTTPStatus":
                let HTTPStatusWebSocket = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : URL_PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.HTTPStatus.port + WEBSOCKET_PARAMS.HTTPStatus.entry);
                
                HTTPStatusWebSocket.onopen = () => {
                    this.isConnected = true;
                    this.template.showPlayer();
                };

                HTTPStatusWebSocket.onclose = () => {
                    this.isConnected = false;
                    this.httpStatus.stopTimer(true); // Prevent of multiple timer
                    this.template.hiddenEverythings();
                };

                HTTPStatusWebSocket.onmessage = (data) => {
                    this.httpStatus.eventHandler(data);
                };
                break;
            case "DataPuller":
                let DataPullerWebSocket = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : URL_PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.DataPuller.port + WEBSOCKET_PARAMS.DataPuller.entry + WEBSOCKET_PARAMS.DataPuller.endpoint.mapData);
                let DataPullerWebSocket2 = new WebSocket("ws://" + ((this.urlParams.ip) ? this.urlParams.ip : URL_PARAMS.ip[0]) + ":" + WEBSOCKET_PARAMS.DataPuller.port + WEBSOCKET_PARAMS.DataPuller.entry + WEBSOCKET_PARAMS.DataPuller.endpoint.liveData);
                
                DataPullerWebSocket.onopen = () => {
                    this.isConnected = true;
                    this.template.showPlayer();
                };

                DataPullerWebSocket.onclose = () => {
                    this.isConnected = false;
                    this.template.hiddenEverythings();
                };

                DataPullerWebSocket.onmessage = (data) => {
                    this.dataPuller.eventHandler(data, "mapData");
                };

                DataPullerWebSocket2.onmessage = (data) => {
                    this.dataPuller.eventHandler(data, "liveData");
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
}
