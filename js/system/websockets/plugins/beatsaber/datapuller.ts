import { WebSocketManager } from '../../websocketsManager';
import { DataPuller }       from '../../../../games/beatSaber/dataPuller';

export class DataPullerPlugin {
    private readonly mapData : string;
    private readonly liveData: string;
    private manager          : WebSocketManager;
    private _dataPuller      = new DataPuller();

    constructor(manager: WebSocketManager) {
        this.manager  = manager;
        this.mapData  = 'datapuller_mapdata';
        this.liveData = 'datapuller_livedata';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.mapData, 'ws://127.0.0.1:2946/BSDataPuller/MapData', this.handleMapDataMessage.bind(this));

        ///TODO: Make it work ... Actually, i don't know how to make it connect along side the first one
        this.manager.initialize(this.liveData, 'ws://127.0.0.1:2946/BSDataPuller/LiveData', this.handleLiveDataMessage.bind(this));
    }

    /**
     * Handles incoming messages for the DataPuller MapData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMapDataMessage(message: string): void {
        console.log(`DataPuller MapData Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._dataPuller.dataParser(message, "mapData");
    }

    /**
     * Handles incoming messages for the DataPuller LiveData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleLiveDataMessage(message: string): void {
        console.log(`DataPuller LiveData Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._dataPuller.dataParser(message, "liveData");
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMapDataMessage(data: string): void {
        this.manager.sendMessage(this.mapData, data);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendLiveDataMessage(data: string): void {
        this.manager.sendMessage(this.liveData, data);
    }
}