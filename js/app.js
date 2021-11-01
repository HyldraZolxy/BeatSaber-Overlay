import { Client } from "./client.js";

const wsParams = {
    "HTTPStatus":
    {
        "port": "6557",
        "entry": "/socket"
    },
    "DataPuller":
    {
        "port": "2946",
        "entry": "/BSDataPuller/",
        "endPoint":
        {
            "mapData": "MapData",
            "liveData": "LiveData"
        }
    }  
};

class App {
    urlParams = new URLSearchParams(location.search);
    debug = false;
    ip = "127.0.0.1";
    client = [];
    try = 0;
    tryConnection = 3;
    pluginChanged = false;

    constructor() {
        this.debug = this.urlParams.has("debug") ? this.urlParams.get("debug") === "true" ? this.urlParams.get("debug") : false : false;

        if (this.debug) {
            console.log("%cWarning! Debug mode activated! You risk being spammed in the log console\n", "background-color:red");
        }

        this.ip = (this.urlParams.get("ip") != (null || undefined) && RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(this.urlParams.get("ip"))) ? this.urlParams.get("ip") : "127.0.0.1";

        /**
         * First i try to connect HTTPStatus, then i try DataPuller
         */

         let loop = setInterval(() => {
            this.client.push(new Client(this.ip, wsParams.HTTPStatus, "", true, "HTTPStatus", this.debug));
            
            if (this.debug) {
                console.log("%cApp.js log...", "background-color:blue");
                console.log(this.client);
                console.log("Change plugin ? (HTTPStatus to DataPuller) ... " + this.pluginChanged);
                console.log("Try number: " + (this.try + 1));
                console.log("\n");
            }

            if (this.try == this.tryConnection) {
                if (this.debug) {
                    console.log("%cApp.js log...", "background-color:blue");
                    console.log("Number of try is over, change the plugin");
                    console.log("And set try to 0");
                    console.log("\n");
                }

                if (this.pluginChanged) {
                    this.pluginChanged = false;
                } else {
                    this.pluginChanged = true;
                }

                this.try = 0;
            }

            if (this.try < this.tryConnection && !this.pluginChanged) {
                if (this.debug) {
                    console.log("%cApp.js log...", "background-color:blue");
                    console.log("Try connection to HTTPStatus plugin...");
                    console.log("\n");
                }

                if (!this.client[0].getWebSocketStatus) {
                    this.try++;
                    this.client = [];
                    this.client.push(new Client(this.ip, wsParams.HTTPStatus, "", false, "HTTPStatus", this.debug));
                }

                if (this.client[0].getWebSocketStatus) {
                    if (this.debug) {
                        console.log("%cApp.js log...", "background-color:blue");
                        console.log("Connection to HTTPStatus is ok, so i kill the loop");
                        console.log("\n");
                    }

                    clearInterval(loop);
                }
            }

            if (this.try < this.tryConnection && this.pluginChanged) {
                if (!this.client[0].getWebSocketStatus) {
                    this.try++;
                    this.client = [];
                    this.client.push(new Client(this.ip, wsParams.DataPuller, wsParams.DataPuller.endPoint.mapData, false, "DataPuller", this.debug));
                    this.client.push(new Client(this.ip, wsParams.DataPuller, wsParams.DataPuller.endPoint.liveData, false, "DataPuller", this.debug));
                }

                if (this.client[0].getWebSocketStatus) {
                    if (this.debug) {
                        console.log("%cApp.js log...", "background-color:blue");
                        console.log("Connection to DataPuller is ok, so i kill the loop");
                        console.log("\n");
                    }

                    clearInterval(loop);
                }
             }
        }, 5000);
    }
}

new App();