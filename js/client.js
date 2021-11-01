import { HTTPStatus } from "./httpStatus.js";
import { DataPuller } from "./dataPuller.js";

var webSocketStatus = false;

export class Client {
    ip;
    wsParams = {};
    endPoint;
    firstCall;
    plugin;
    debug;
    webSocket;

    HTTPStatusClass;
    DataPullerClass;

    constructor(_ip, _wsParams, _endPoint, _firstCall, _plugin, _debug) {
        this.ip = _ip;
        this.wsParams = _wsParams;
        this.endPoint = _endPoint;
        this.firstCall = _firstCall;
        this.plugin = _plugin;
        this.debug = _debug;

        this.HTTPStatusClass = new HTTPStatus(this.debug);
        this.DataPullerClass = new DataPuller(this.debug);

        if (this.debug) {
            console.log("%cClient.js log...", "background-color:blue");
            console.log(this.ip);
            console.log(this.wsParams);
            console.log(this.endPoint);
            console.log(this.firstCall);
            console.log(this.plugin);
            if (this.firstCall) {
                console.log("This is the first call !");
            } else {
                console.log("This is not the first call !");
            }
            console.log("\n");
        }

        if (!this.firstCall) {
            this.webSocket = this.Connect(this.endPoint);

            this.webSocket.onopen = () => {
                webSocketStatus = true;

                if (this.debug) {
                    console.log("%cClient.js log...", "background-color:blue");
                    console.log("%cConnected to " + this.ip + ":" + this.wsParams.port + "...", "background-color: green");
                    console.log("webSocketStatus set to: " + webSocketStatus);
                    console.log("\n");
                }
            };

            this.webSocket.onclose = () => {
                webSocketStatus = false;

                if (this.debug) {
                    console.log("%cClient.js log...", "background-color:blue");
                    console.log("%cConnection failed, retrying in 5 seconds...", "background-color: red");
                    console.log("webSocketStatus set to: " + webSocketStatus);
                    console.log("\n");
                }
            };

            this.webSocket.onmessage = (data) => {
                if (this.debug) {
                    console.log("%cClient.js log...", "background-color:blue");
                    console.log(data);
                    console.log("\n");
                }

                if (this.plugin == "HTTPStatus") {
                    this.HTTPStatusClass.eventHandler(data);
                } else {
                    this.DataPullerClass.eventHandler(data, this.endPoint);
                }
            };
        }
    }

    get getWebSocketStatus() {
        return webSocketStatus;
    }

    Connect(_endPoint) {
        if (this.debug) {
            console.log("%cClient.js log...", "background-color:blue");
            console.log("Trying connection on: ws://" + this.ip + ":" + this.wsParams.port + this.wsParams.entry + _endPoint)
            console.log("\n");
        }

        return new WebSocket("ws://" + this.ip + ":" + this.wsParams.port + this.wsParams.entry + _endPoint);
    }
}