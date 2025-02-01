import { WebSocketManager } from '../../websocketsManager.js';
import { Audica }           from '../../../../games/audica/audica.js';

export class AudicaWebsocketServerPlugin {
    private readonly key: string;
    private manager     : WebSocketManager;
    private _audica     = new Audica();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'audicawebsocketserver';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}`, 'ws://127.0.0.1:8085/AudicaStats', this.handlePrimaryMessage.bind(this));
    }

    /**
     * Handles incoming messages for the AudicaWebsocketServer WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        console.log(`[AudicaWebsocketServerPlugin] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._audica.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendPrimaryMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}