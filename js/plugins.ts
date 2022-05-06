import { GlobalVariable } from "./global.js";
import { BSPlus } from "./BSPlus.js";
import { HTTPStatus } from "./HTTPStatus.js";
import { DataPuller } from "./dataPuller.js";
import { SongCard } from "./songCard.js";
import { PlayerCard } from "./playerCard.js";

export class Plugins {

    //////////////
    // INSTANCE //
    //////////////
    private static _instance: Plugins;

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _songCard: SongCard;
    private _playerCard: PlayerCard;
    private _bsPlus: BSPlus;
    private _httpStatus: HTTPStatus;
    private _dataPuller: DataPuller;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isConnected = GlobalVariable.WEBSOCKET_STATE.DISCONNECTED;

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public pluginsParameters: {
        ip: string;
    } = {
        ip: "127.0.0.1"
    };

    constructor() {
        this._songCard = SongCard.Instance;
        this._playerCard = PlayerCard.Instance;
        this._bsPlus = new BSPlus();
        this._httpStatus = new HTTPStatus();
        this._dataPuller = new DataPuller();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private webSocketConnection(pluginEntryData: any, retryNumber: number, endPoint?: string) {
        const timeoutMs = GlobalVariable.TIMEOUT_MS;
        const numberOfRetries = retryNumber;
        let hasReturned = false;
        let websocket: WebSocket;

        let promise: any = new Promise((resolve, reject) => {
            setTimeout(() => {
                if(!hasReturned) {
                    websocket.close(1000, "Timeout");
                    rejectInternal();
                }
            }, timeoutMs);

            if (endPoint != null) {
                websocket = new WebSocket("ws://" +
                    this.pluginsParameters.ip +
                    ":" +
                    pluginEntryData.port +
                    pluginEntryData.entry +
                    endPoint
                );
            } else {
                websocket = new WebSocket("ws://" +
                    this.pluginsParameters.ip +
                    ":" +
                    pluginEntryData.port +
                    pluginEntryData.entry
                );
            }

            websocket.onopen = () => {
                if(hasReturned) {
                    websocket.close(1000, "Already Open");
                } else {
                    this.isConnected = GlobalVariable.WEBSOCKET_STATE.CONNECTED;

                    resolve(websocket);
                }
            };
            websocket.onclose = () => {
                if (this.isConnected == GlobalVariable.WEBSOCKET_STATE.CONNECTED) {
                    this.isConnected = GlobalVariable.WEBSOCKET_STATE.DISCONNECTED;
                    this._songCard.songCardParameters.started = false;
                    this._songCard.songCardParameters.inProgress = false;

                    this._playerCard.playerCardParameters.display = false;
                }
                rejectInternal();
            };
            websocket.onerror = () => {
                this.isConnected = GlobalVariable.WEBSOCKET_STATE.ERROR;
                rejectInternal();
            };

            const rejectInternal = () => {
                if(numberOfRetries <= 1) {
                    reject();
                } else if (!hasReturned) {
                    hasReturned = true;
                    this.webSocketConnection(pluginEntryData, numberOfRetries-1, endPoint).then(resolve, reject);
                } else if (this.isConnected === GlobalVariable.WEBSOCKET_STATE.DISCONNECTED) {
                    if (endPoint != null) {
                        if (endPoint === "MapData") {
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
    public beatSaberConnection(): void {
        this.webSocketConnection(GlobalVariable.BeatSaberPlus, GlobalVariable.RETRY_NUMBER).then((socket: WebSocket) => {
            console.log("socket initialized on BeatSaberPlus!");
            console.log("\n\n");

            socket.onmessage = (data) => {
                this._bsPlus.dataParser(data);
            }
        }, () => {
            console.log("init of BeatSaberPlus socket failed!");
            console.log("\n\n");

            this.webSocketConnection(GlobalVariable.HttpStatus, GlobalVariable.RETRY_NUMBER).then((socket: WebSocket) => {
                console.log("socket initialized on HTTPSstatus!");
                console.log("\n\n");

                socket.onmessage = (data) => {
                    this._httpStatus.dataParser(data);
                }
            }, () => {
                console.log("init of HTTPSstatus socket failed!");
                console.log("\n\n");

                this.webSocketConnection(GlobalVariable.DataPuller, GlobalVariable.RETRY_NUMBER, GlobalVariable.DataPuller.endPoint.mapData).then((socket: WebSocket) => {
                    console.log("socket initialized on DataPuller MapData!");
                    console.log("\n\n");

                    this.webSocketConnection(GlobalVariable.DataPuller, GlobalVariable.RETRY_NUMBER, GlobalVariable.DataPuller.endPoint.liveData).then((socket: WebSocket) => {
                        console.log("socket initialized on DataPuller LiveData!");
                        console.log("\n\n");

                        socket.onmessage = (data) => {
                            this._dataPuller.dataParser(data, "LiveData");
                        }
                    });

                    socket.onmessage = (data) => {
                        this._dataPuller.dataParser(data, "MapData");
                    }
                }, () => {
                    console.log("init of DataPuller socket failed!");
                    console.log("\n\n");

                    setTimeout(() => {
                        this.beatSaberConnection();
                    }, GlobalVariable.TIME_BEFORE_RETRY);
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
}