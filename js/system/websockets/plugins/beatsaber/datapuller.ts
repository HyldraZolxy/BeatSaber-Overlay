import { WebSocketManager } from '../../websocketsManager.js';
import { DataPuller }       from '../../../../games/beatSaber/dataPuller.js';

export class DataPullerPlugin {
    private readonly key : string;
    private manager      : WebSocketManager;
    private _dataPuller  = new DataPuller();

    private secondaryWebsocketLaunched: boolean = false;

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'datapuller';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}-primary`, 'ws://127.0.0.1:2946/BSDataPuller/MapData', this.handlePrimaryMessage.bind(this));
    }

    private secondarySocketLauncher(): void {
        if (!this.secondaryWebsocketLaunched) {
            this.manager.initialize(`${this.key}-secondary`, 'ws://127.0.0.1:2946/BSDataPuller/LiveData', this.handleSecondaryMessage.bind(this));
            this.secondaryWebsocketLaunched = true;

            setTimeout(() => {
                this.secondaryWebsocketLaunched = false;
            }, 5000);
        }
    }

    /**
     * Handles incoming messages for the DataPuller MapData WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        this.secondarySocketLauncher(); // Launch the secondary socket of DataPuller

        console.log(`[DataPuller][Primary] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._dataPuller.dataParser(message, "mapData");
    }

    /**
     * Handles incoming messages for the DataPuller LiveData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleSecondaryMessage(message: string): void {
        console.log(`[DataPuller][Secondary] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._dataPuller.dataParser(message, "liveData");
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendPrimaryMessage(data: string): void {
        this.manager.sendMessage(`${this.key}-primary`, data);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendSecondaryMessage(data: string): void {
        this.manager.sendMessage(`${this.key}-primary`, data);
    }
}