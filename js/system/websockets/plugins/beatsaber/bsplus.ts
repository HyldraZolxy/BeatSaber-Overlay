import { WebSocketManager } from '../../websocketsManager';
import { BSPlus }           from '../../../../games/beatSaber/BSPlus';

export class BsPlusPlugin {
    private readonly soloData       : string;
    private readonly multiplayerData: string;
    private manager                 : WebSocketManager;
    private _bsPlus                 = new BSPlus();

    constructor(manager: WebSocketManager) {
        this.manager         = manager;
        this.soloData        = 'bsplus_solodata';
        this.multiplayerData = 'bsplus_multiplayerdata';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.soloData, 'ws://127.0.0.1:2947/socket', this.handleSoloDataMessage.bind(this));

        ///TODO: Make it work ... Actually, i don't know how to make it connect along side the first one
        this.manager.initialize(this.multiplayerData, 'ws://127.0.0.1:2948/socket', this.handleMultiplayerDataMessage.bind(this));
    }

    /**
     * Handles incoming messages for the BSPlus SoloData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleSoloDataMessage(message: string): void {
        console.log(`BsPlusPlugin SoloData Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._bsPlus.dataParser(message)
    }

    /**
     * Handles incoming messages for the BSPlus MultiplayerData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMultiplayerDataMessage(message: string): void {
        console.log(`BsPlusPlugin MultiplayerData Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._bsPlus.dataParser(message)
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendSoloDataMessage(data: string): void {
        this.manager.sendMessage(this.soloData, data);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMultiplayerDataMessage(data: string): void {
        this.manager.sendMessage(this.multiplayerData, data);
    }
}