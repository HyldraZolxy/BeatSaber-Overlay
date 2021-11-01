/**
 * That class is not finished, so DataPuller is not supported for now
 */

export class DataPuller {
    urlParams = new URLSearchParams(location.search);
    debug;
    firstTime = true;

    constructor(_debug) {
        this.debug = _debug;
        if (this.urlParams.has("debug") && (this.urlParams.get("debug") === "DataPuller")) {
            this.debug = true;
        }
    
        if (this.debug) {
            console.log("%cWarning! Debug mode for DataPuller activated! You risk being spammed in the log console\n", "background-color:red");
        }
    }

    eventHandler(value, _endPoint) {
        switch(_endPoint) {
            case "MapData":
                let mapDataParsed = JSON.parse(value.data);

                console.log(mapDataParsed);

                if (this.firstTime) {
                    console.log("%cConnected to DataPuller Plugin", "background-color: green");
                    console.log("%cBeat Saber " + mapDataParsed.GameVersion + " | Data " + mapDataParsed.PluginVersion, "background-color: green");        
                    console.log("%cDataPuller is not supported", "background-color: orange");
                    console.log("\n");
                    this.firstTime = false;
                }

                if (mapDataParsed.InLevel) {
                    document.getElementById("box").style.opacity = 1;
                    document.getElementById("scoreInformations").style.opacity = 1;
                } else {
                    document.getElementById("box").style.opacity = 0;
                    document.getElementById("scoreInformations").style.opacity = 0;
                }

                console.log("MapData");
                break;
            case "LiveData":
                let liveDataParsed = JSON.parse(value.data);

                console.log(liveDataParsed);
                console.log("LiveData");
                break;
            default:
                break;
        }
    }
}