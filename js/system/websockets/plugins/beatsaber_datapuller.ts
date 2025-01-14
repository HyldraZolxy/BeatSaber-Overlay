import { WebSocketManager } from '../websocketsManager';

export class DataPuller {
    private readonly key: string;
    private manager: WebSocketManager;

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key = 'datapuller_mapdata';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.key, 'ws://127.0.0.1:2946/BSDataPuller/MapData', this.handleMessage.bind(this));
    }

    /**
     * Handles incoming messages for the BSPlus WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMessage(message: string): void {
        console.log(`DataPuller MapData Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}