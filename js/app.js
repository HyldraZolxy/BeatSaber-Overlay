import { Client } from "./client.js";

const wsParams = {
    "HTTPStatus":
    {
        "ip": "127.0.0.1",
        "port": "6557",
        "entry": "/socket"
    },
    "DataPuller":
    {
        "ip": "127.0.0.1",
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
    setup = false;

    connected = false;
    try = 0;
    plugin = "HTTPStatus";

    client = [];

    constructor() {
        /// TODO: IP Param is removed, maybe let user set a other IP later ? (For Dual PC Stream)
        this.debug = this.urlParams.has("debug") ? this.urlParams.get("debug") === "true" ? this.urlParams.get("debug") : false : false;
        this.setup = this.urlParams.has("setup") ? this.urlParams.get("setup") === "true" ? this.urlParams.get("setup") : false : false;

        if (this.debug) {
            console.log("%cWarning! Debug mode activated! You risk being spammed in the log console\n", "background-color:red");
        }

        setInterval(() => {
            try {
                this.connected = this.client[0].getWebSocketStatus();
            } catch {
                if (this.debug) {
                    console.log("%cApp.js log...", "background-color:blue");
                    console.log("%cWebSocket client doesn't exist, this is the first try...", "background-color:orange");
                    console.log("\n");
                }
            }

            if (!this.connected) {
                if (this.debug) {
                    console.log("%cApp.js log...", "background-color:blue");
                    console.log("%cWebSocket is not connected !", "background-color:red");
                    console.log("Let's try to connect it ...");
                    console.log("\n");
                }

                if (this.try >= 3) {
                    if (this.debug) {
                        console.log("%cApp.js log...", "background-color:blue");
                        console.log("Number of try is reached, change the plugin...");
                        console.log("\n");
                    }

                    this.try = 0;
                    this.plugin = this.plugin == "HTTPStatus" ? this.plugin = "DataPuller" : this.plugin = "HTTPStatus";
                }

                this.try++;

                switch(this.plugin) {
                    case "HTTPStatus":
                        if (this.debug) {
                            console.log("%cApp.js log...", "background-color:blue");
                            console.log("Trying connection for HTTPStatus...");
                            console.log("\n");
                        }

                        this.client = [];
                        this.client.push(new Client(wsParams.HTTPStatus, "", this.plugin, this.debug));

                        break;

                    case "DataPuller":
                        if (this.debug) {
                            console.log("%cApp.js log...", "background-color:blue");
                            console.log("Trying connection for DataPuller...");
                            console.log("\n");
                        }

                        this.client = [];
                        this.client.push(new Client(wsParams.DataPuller, wsParams.DataPuller.endPoint.mapData, this.plugin, this.debug));
                        this.client.push(new Client(wsParams.DataPuller, wsParams.DataPuller.endPoint.liveData, this.plugin, this.debug));

                        break;

                    default:
                        break;
                }
            } else {
                if (this.debug) {
                    console.log("%cApp.js log...", "background-color:blue");
                    console.log("%cWebSocket is already connected !", "background-color:green");
                    console.log("\n");
                }
            }
        }, 5000);
    }
}

new App();