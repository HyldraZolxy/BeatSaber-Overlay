import { Globals }          from "./globals";
import { Parameters }       from "./parameters";
import { WebSocketManager } from './websocket-manager';
import { PlayerCard }       from "./playerCard";
import { BSPlus }           from "./BSPlus";
import { HTTP_sira_Status } from "./HTTP_sira_Status";
import { DataPuller }       from "./dataPuller";

export class Plugins {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Plugins;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _parameters:        Parameters;
    private _websocketManager:  WebSocketManager;
    private _playerCard:        PlayerCard;
    private _bsPlus:            BSPlus;
    private _httpSiraStatus:    HTTP_sira_Status;
    private _dataPuller:        DataPuller;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private websocketVersion = 0;

    constructor() {
        this._parameters        = Parameters.Instance;
        this._websocketManager  = new WebSocketManager();
        this._playerCard        = PlayerCard.Instance;
        this._bsPlus            = new BSPlus();
        this._httpSiraStatus    = new HTTP_sira_Status();
        this._dataPuller        = new DataPuller();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async connection(): Promise<void> {
        this.websocketVersion++;

        if (this._parameters.uriParams.g_beatSaber) {
            if (this._parameters.uriParams.p_beatSaberPlus) {
                this._websocketManager.add("BSPlus" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":2947/socket",
                    (data) => { this._bsPlus.dataParser(data); },
                    () => {
                        console.log("%csocket initialized on BeatSaberPlus!", Globals.SUCCESS_LOG);

                        this._websocketManager.add("BSPlusLeaderboard" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":2948/socket",
                            (data) => { this._bsPlus.dataParser(data); },
                            () => {},
                            () => {},
                            () => {},
                            true
                        );
                    },
                    () => { this._websocketManager.remove("BSPlusLeaderboard" + this.websocketVersion); },
                    () => { console.log("%cinit of BeatSaberPlus socket failed!", Globals.WARN_LOG); }
                );
            }

            if (this._parameters.uriParams.p_dataPuller) {
                this._websocketManager.add("DataPullerMapData" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":2946/BSDataPuller/MapData",
                    (data) => { this._dataPuller.dataParser(data, "MapData"); },
                    () => {
                        console.log("%csocket initialized on DataPuller!", Globals.SUCCESS_LOG);

                        this._websocketManager.add("DataPullerLiveData" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":2946/BSDataPuller/LiveData",
                            (data) => { this._dataPuller.dataParser(data, "LiveData"); },
                            () => {},
                            () => {},
                            () => {},
                            true
                        );
                    },
                    () => { this._websocketManager.remove("DataPullerLiveData" + this.websocketVersion); },
                    () => { console.log("%cinit of DataPuller socket failed!", Globals.WARN_LOG); }
                );
            }

            if (this._parameters.uriParams.p_httpSiraStatus) {
                this._websocketManager.add("HttpSiraStatus" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":6557/socket",
                    (data) => { this._httpSiraStatus.dataParser(data); },
                    () => { console.log("%csocket initialized on HttpSiraStatus!", Globals.SUCCESS_LOG); },
                    () => {},
                    () => { console.log("%cinit of HttpSiraStatus socket failed!", Globals.WARN_LOG); }
                );
            }
        }

        if (this._parameters.uriParams.g_synthRiders) {
            this._websocketManager.add("SynthRiders" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":9000/",
                (data) => { console.log(data); },
                () => { console.log("%csocket initialized on SynthRiders!", Globals.SUCCESS_LOG); },
                () => {},
                () => { console.log("%cinit of SynthRiders socket failed!", Globals.WARN_LOG); }
            );
        }

        if (this._parameters.uriParams.g_audioTrip) {
            this._websocketManager.add("AudioTrip" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":48998/",
                (data) => { console.log(data); },
                () => { console.log("%csocket initialized on AudioTrip!", Globals.SUCCESS_LOG); },
                () => {},
                () => { console.log("%cinit of AudioTrip socket failed!", Globals.WARN_LOG); }
            );
        }

        if (this._parameters.uriParams.g_audica) {
            this._websocketManager.add("Audica" + this.websocketVersion, "ws://" + this._parameters.uriParams.ip + ":8085/AudicaStats",
                (data) => { console.log(data); },
                () => { console.log("%csocket initialized on Audica!", Globals.SUCCESS_LOG); },
                () => {},
                () => { console.log("%cinit of Audica socket failed!", Globals.WARN_LOG); }
            );
        }
    }

    public removeConnection(): void {
        this._websocketManager.remove("BSPlus" + this.websocketVersion);
        this._websocketManager.remove("BSPlusLeaderboard" + this.websocketVersion);
        this._websocketManager.remove("DataPullerMapData" + this.websocketVersion);
        this._websocketManager.remove("DataPullerLiveData" + this.websocketVersion);
        this._websocketManager.remove("HttpSiraStatus" + this.websocketVersion);
        this._websocketManager.remove("SynthRiders" + this.websocketVersion);
        this._websocketManager.remove("AudioTrip" + this.websocketVersion);
        this._websocketManager.remove("Audica" + this.websocketVersion);
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Plugins {
        return this._instance || (this._instance = new this());
    }
}