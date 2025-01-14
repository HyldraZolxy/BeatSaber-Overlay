import { WebSocketManager } from '../../websocketsManager';
import { BSPlus }           from '../../../../games/beatSaber/BSPlus';

export class BsPlusPlugin {
    private readonly key: string;
    private manager     : WebSocketManager;
    private _bsPlus     = new BSPlus();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'bsplus';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.key, 'ws://127.0.0.1:2947/socket', this.handleMessage.bind(this));
    }

    /**
     * Handles incoming messages for the BSPlus WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMessage(message: string): void {
        console.log(`BsPlusPlugin Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._bsPlus.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}