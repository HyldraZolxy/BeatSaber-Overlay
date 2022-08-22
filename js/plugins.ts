import { Globals } from "./global.js";
import { Parameters } from "./parameters.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { BSPlus } from "./BSPlus.js";
import { HTTP_sira_Status } from "./HTTP_sira_Status.js";
import { DataPuller } from "./dataPuller.js";

export class Plugins {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: Plugins;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _parameters: Parameters;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _bsPlus: BSPlus;
    private _http_sira_Status: HTTP_sira_Status;
    private _dataPuller: DataPuller;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isConnected = Globals.E_WEBSOCKET_STATES.DISCONNECTED;

    constructor() {
        this._parameters = Parameters.Instance;
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._bsPlus = new BSPlus();
        this._http_sira_Status = new HTTP_sira_Status();
        this._dataPuller = new DataPuller();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private webSocketConnection(pluginName: Globals.E_PLUGINS, retryNumber: number, endPoint?: string): Promise<WebSocket> {
        const numberOfRetries = retryNumber;
        let hasReturned = false;
        let websocket: WebSocket;
        let webSocketEndPoint = "";

        if (endPoint !== undefined)
            webSocketEndPoint = endPoint;

        let promise: Promise<WebSocket> = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(!hasReturned) {
                    websocket.close(1000, "Timeout");
                    rejectInternal();
                }
            }, Globals.TIMEOUT_MS);

            websocket = new WebSocket("ws://" +
                this._parameters._uriParams.ip +
                ":" +
                Globals.PLUGINS_CONNECTIONS[pluginName].port +
                Globals.PLUGINS_CONNECTIONS[pluginName].entry +
                webSocketEndPoint
            );

            websocket.onopen = () => {
                if(hasReturned) {
                    websocket.close(1000, "Already Open");
                } else {
                    this.isConnected = Globals.E_WEBSOCKET_STATES.CONNECTED;

                    resolve(websocket);
                }
            };

            websocket.onclose = () => {
                if (this.isConnected === Globals.E_WEBSOCKET_STATES.CONNECTED) {
                    this.isConnected = Globals.E_WEBSOCKET_STATES.DISCONNECTED;
                    this._songCard.songCardData.started = false;
                    this._songCard.songCardData.inProgress = false;

                    this._playerCard.playerCardData.display = false;
                }
                rejectInternal();
            };

            websocket.onerror = () => {
                this.isConnected = Globals.E_WEBSOCKET_STATES.ERROR;
                rejectInternal();
            };

            const rejectInternal = () => {
                if(numberOfRetries <= 1) {
                    reject();
                } else if (!hasReturned) {
                    hasReturned = true;
                    this.webSocketConnection(pluginName, numberOfRetries-1, endPoint).then(resolve, reject);
                } else if (this.isConnected === Globals.E_WEBSOCKET_STATES.DISCONNECTED) {
                    if (endPoint !== undefined) {
                        if (endPoint === Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.mapData) {
                            this.beatSaberConnection();
                        }
                    } else {
                        this.beatSaberConnection();
                    }
                }
            }
        });

        promise.then(function () { hasReturned = true; }, function () { hasReturned = true; });
        return promise;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async beatSaberConnection(): Promise<void> {
        await this.webSocketConnection(Globals.E_PLUGINS.BSPLUS, Globals.RETRY_NUMBER).then((socket: WebSocket) => {
            console.log("socket initialized on BeatSaberPlus!");
            console.log("\n\n");

            socket.onmessage = (data) => {
                this._bsPlus.dataParser(data.data);
            }
        }, async () => {
            console.log("init of BeatSaberPlus socket failed!");
            console.log("\n\n");

            await this.webSocketConnection(Globals.E_PLUGINS.HTTP_sira_STATUS, Globals.RETRY_NUMBER).then((socket: WebSocket) => {
                console.log("socket initialized on HTTP_sira_Status!");
                console.log("\n\n");

                socket.onmessage = (data) => {
                    this._http_sira_Status.dataParser(data.data);
                }
            }, async () => {
                console.log("init of HTTP_sira_Status socket failed!");
                console.log("\n\n");

                await this.webSocketConnection(Globals.E_PLUGINS.DataPuller, Globals.RETRY_NUMBER, Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.mapData).then((socket: WebSocket) => {
                    console.log("socket initialized on DataPuller MapData!");
                    console.log("\n\n");

                    this.webSocketConnection(Globals.E_PLUGINS.DataPuller, Globals.RETRY_NUMBER, Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.liveData).then((socket2: WebSocket) => {
                        console.log("socket initialized on DataPuller LiveData!");
                        console.log("\n\n");

                        socket2.onmessage = (data) => {
                            this._dataPuller.dataParser(data.data, Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.liveData);
                        }
                    });

                    socket.onmessage = (data) => {
                        this._dataPuller.dataParser(data.data, Globals.PLUGINS_CONNECTIONS.dataPuller.endPoint.mapData);
                    }
                }, () => {
                    console.log("init of DataPuller socket failed!");
                    console.log("\n\n");

                    setTimeout(() => {
                        this.beatSaberConnection();
                    }, Globals.TIME_BEFORE_RETRY);
                });
            });
        });
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Plugins {
        return this._instance || (this._instance = new this());
    }

    public get IsConnected(): Globals.E_WEBSOCKET_STATES {
        return this.isConnected;
    }
}