import { WebSocketManager } from '../../websocketsManager.js';
import { AudioTrip }        from '../../../../games/audioTrip/audioTrip.js';

export class AtsTypesPlugin {
    private readonly key: string;
    private manager     : WebSocketManager;
    private _audiotrip  = new AudioTrip();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'atstypes';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}`, 'ws://127.0.0.1:48998/', this.handlePrimaryMessage.bind(this));
    }

    /**
     * Handles incoming messages for the AtsTypes WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        console.log(`[AtsTypes] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._audiotrip.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendPrimaryMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}