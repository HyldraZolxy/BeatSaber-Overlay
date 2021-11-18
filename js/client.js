import { HTTPStatus } from "./httpStatus.js";
import { DataPuller } from "./dataPuller.js";

var webSocketConnected = false;

export class Client {
    wsParams = {};
    endPoint;
    plugin;
    debug;

    webSocket;

    HTTPStatusClass;
    DataPullerClass;

    constructor(_wsParams, _endPoint, _plugin, _debug) {
        this.wsParams = _wsParams;
        this.endPoint = _endPoint;
        this.plugin = _plugin;
        this.debug = _debug;

        this.webSocket = this.Connect(this.endPoint);

        this.webSocket.onopen = () => {
            webSocketConnected = true;

            if (this.debug) {
                console.log("%cClient.js log...", "background-color:blue");
                console.log("%cConnected to " + this.wsParams.ip + ":" + this.wsParams.port + "...", "background-color: green");
                console.log("webSocketConnected set to: " + webSocketConnected);
                console.log("\n");
            }

            this.plugin == "HTTPStatus" ? (this.HTTPStatusClass = new HTTPStatus(this.debug)) : (this.DataPullerClass = new DataPuller(this.debug));
        };

        this.webSocket.onclose = () => {
            webSocketConnected = false;

            if (this.debug) {
                console.log("%cClient.js log...", "background-color:blue");
                console.log("%cConnection failed, retrying in 5 seconds...", "background-color: red");
                console.log("webSocketConnected set to: " + webSocketConnected);
                console.log("\n");
            }
        };

        this.webSocket.onmessage = (data) => {
            this.plugin == "HTTPStatus" ? this.HTTPStatusClass.eventHandler(data) : this.DataPullerClass.eventHandler(data, this.endPoint);
        };
    }

    getWebSocketStatus() {
        return webSocketConnected;
    }

    Connect(_endPoint) {
        if (this.debug) {
            console.log("%cClient.js log...", "background-color:blue");
            console.log("Trying connection on: ws://" + this.wsParams.ip + ":" + this.wsParams.port + this.wsParams.entry + _endPoint)
            console.log("\n");
        }

        return new WebSocket("ws://" + this.wsParams.ip + ":" + this.wsParams.port + this.wsParams.entry + _endPoint);
    }
}