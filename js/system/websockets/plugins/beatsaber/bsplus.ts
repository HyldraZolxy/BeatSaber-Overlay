import { WebSocketManager } from '../../websocketsManager';
import { BSPlus }           from '../../../../games/beatSaber/BSPlus';

export class BsPlusPlugin {
    private readonly key : string;
    private manager      : WebSocketManager;
    private _bsPlus      = new BSPlus();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'bsplus';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}-primary`, 'ws://127.0.0.1:2947/socket', this.handlePrimaryMessage.bind(this));

        ///TODO: Make it work ... Actually, i don't know how to make it connect along side the first one
        this.manager.initialize(`${this.key}-secondary`, 'ws://127.0.0.1:2948/socket', this.handleSecondaryMessage.bind(this));
    }

    /**
     * Handles incoming messages for the BSPlus SoloData WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        console.log(`[BsPlusPlugin][Primary] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._bsPlus.dataParser(message)
    }

    /**
     * Handles incoming messages for the BSPlus MultiplayerData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleSecondaryMessage(message: string): void {
        console.log(`[BsPlusPlugin][Secondary] Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._bsPlus.dataParser(message)
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
        this.manager.sendMessage(`${this.key}-secondary`, data);
    }
}