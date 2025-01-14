import { WebSocketManager } from '../../websocketsManager';
import { HTTP_sira_Status } from '../../../../games/beatSaber/HTTP_sira_Status';

export class HttpSiraStatusPlugin {
    private readonly key    : string;
    private manager         : WebSocketManager;
    private _httpSiraStatus = new HTTP_sira_Status();

    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.key     = 'httpsirastatus';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(this.key, 'ws://127.0.0.1:6557/socket', this.handleMessage.bind(this));
    }

    /**
     * Handles incoming messages for the HttpSiraStatus WebSocket.
     * @param message The received WebSocket message.
     */
    private handleMessage(message: string): void {
        console.log(`HttpSiraStatus Message: ${message}`);
        // Handle plugin-specific WebSocket message logic here
        this._httpSiraStatus.dataParser(message);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendMessage(data: string): void {
        this.manager.sendMessage(this.key, data);
    }
}