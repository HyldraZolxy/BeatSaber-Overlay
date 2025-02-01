import { WebSocketManager } from '../../websocketsManager.js';
import { SynthRiders }      from '../../../../games/synthRiders/synthRiders.js';

export class SynthRidersWebsocketModPlugin {
    private readonly key : string;
    private manager      : WebSocketManager;
    private _synthriders = new SynthRiders();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'synthriderswebsocketmod';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}`, 'ws://127.0.0.1:9000/', this.handlePrimaryMessage.bind(this));
    }

    /**
     * Handles incoming messages for the SynthRidersWebsocketMod WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        console.log(`[SynthRidersWebsocketMod] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._synthriders.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendPrimaryMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}