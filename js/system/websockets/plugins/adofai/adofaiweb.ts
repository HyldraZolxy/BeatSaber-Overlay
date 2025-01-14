import { WebSocketManager } from '../../websocketsManager';
import { Adofai }           from '../../../../games/adofai/adofai';

export class AdofaiWebPlugin {
    private readonly key: string;
    private manager     : WebSocketManager;
    private _adofai     = new Adofai();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'adofaiweb';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.key, 'ws://127.0.0.1:420/server', this.handleMessage.bind(this));
    }

    /**
     * Handles incoming messages for the AdofaiWeb WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMessage(message: string): void {
        console.log(`AdofaiWebPlugin Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._adofai.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}