export class WebSocketManager {
    private sockets           : Map<string, WebSocket>; // Active WebSocket connections
    private reconnectionTimers: Map<string, NodeJS.Timeout>; // Reconnection timers per WebSocket
    private pendingConnections: Map<string, { url: string; onMessage: (msg: string) => void }>; // Store connection info
    private activeSocketKey   : string | null; // Track active WebSocket

    private readonly reconnectionInterval = 5000; // Interval for retries in milliseconds

    constructor() {
        this.sockets            = new Map();
        this.reconnectionTimers = new Map();
        this.pendingConnections = new Map();
        this.activeSocketKey    = null;
    }

    /**
     * Initializes a WebSocket for a given plugin.
     * Schedules reconnection attempts if the WebSocket fails or closes.
     *
     * @param key The unique key/ID for the WebSocket (e.g., plugin ID).
     * @param url The WebSocket server URL.
     * @param onMessage Callback to handle WebSocket messages.
     */
    public initialize(key: string, url: string, onMessage: (message: string) => void): void {
        console.log(`Initializing WebSocket "${key}"...`);

        // If a WebSocket already exists for this key, avoid reinitializing it
        if (this.sockets.has(key)) {
            console.warn(`WebSocket "${key}" is already active.`);
            return;
        }

        // Save the connection details for possible reinitialization
        this.pendingConnections.set(key, { url, onMessage });

        const socket = new WebSocket(url);

        socket.onopen = () => {
            console.log(`WebSocket "${key}" successfully connected.`);
            this.handleSocketSuccess(key);
        };

        socket.onmessage = (event: MessageEvent) => {
            onMessage(event.data); // Forward incoming messages to the plugin's handler
        };

        socket.onerror = (error) => {
            console.error(`WebSocket "${key}" encountered an error:`, error);
        };

        socket.onclose = () => {
            console.log(`WebSocket "${key}" closed.`);
            this.sockets.delete(key); // Ensure the socket is removed from active connections

            // If the closed socket was the active one, reinitialize all connections
            if (this.activeSocketKey === key) {
                console.log(`The active WebSocket "${key}" was closed. Reinitializing all WebSockets...`);
                this.activeSocketKey = null; // Reset active socket
                this.reinitializeAll(); // Reinitialize all WebSockets
            } else {
                // Otherwise, schedule reconnection for the closed WebSocket if no active connections
                if (!this.activeSocketKey) this.scheduleReconnection(key, url, onMessage);
            }
        };

        this.sockets.set(key, socket); // Add to active WebSockets map
    }

    /**
     * Called when a WebSocket successfully opens.
     * Disconnects all other WebSockets and cancels reconnection attempts for them.
     *
     * @param key Identifier for the successful WebSocket.
     */
    private handleSocketSuccess(key: string): void {
        console.log(`WebSocket "${key}" is now the active connection.`);
        this.activeSocketKey = key;

        // Disconnect all other WebSockets
        this.disconnectAllExcept(key);

        // Clear all scheduled reconnection attempts for other WebSockets
        this.clearReconnectionTimers(key);
    }

    /**
     * Schedules reconnection attempts for a failed WebSocket.
     *
     * @param key Identifier for the WebSocket to reconnect.
     * @param url WebSocket server URL.
     * @param onMessage Callback to handle WebSocket messages on reconnection.
     */
    private scheduleReconnection(key: string, url: string, onMessage: (message: string) => void): void {
        // If a reconnection attempt is already pending, do nothing
        if (this.reconnectionTimers.has(key)) return;

        console.log(`Scheduling reconnection for WebSocket "${key}" in ${this.reconnectionInterval}ms.`);

        const timer = setTimeout(() => {
            console.log(`Reconnecting WebSocket "${key}"...`);
            this.initialize(key, url, onMessage); // Re-initialize the WebSocket
            this.reconnectionTimers.delete(key); // Remove the timer reference once attempted
        }, this.reconnectionInterval);

        this.reconnectionTimers.set(key, timer);
    }

    /**
     * Disconnects all WebSockets except the one specified by `key`.
     *
     * @param key Identifier of the WebSocket to keep active.
     */
    private disconnectAllExcept(key: string): void {
        const processedSocketKey = key.split('-')[0];

        this.sockets.forEach((socket, socketKey) => {
            if (socketKey !== key && !socketKey.startsWith(processedSocketKey)) {
                console.log(`Closing WebSocket "${socketKey}" because "${key}" is now active.`);
                socket.close();
                this.sockets.delete(socketKey); // Clean up the map
            }
        });
    }

    /**
     * Clears the reconnection timers associated with the specified key or all timers if no key is provided.
     *
     * @param key - An optional key to specify which timers to clear. If provided, only timers that do not match the
     * key or its base socket key are cleared.
     */
    private clearReconnectionTimers(key?: string): void {
        if (key) {
            const processedSocketKey = key.split('-')[0];

            this.reconnectionTimers.forEach((timer, timerKey) => {
                if (timerKey !== key && !timerKey.startsWith(processedSocketKey)) {
                    clearTimeout(timer);
                }
            });
        } else {
            this.reconnectionTimers.forEach((timer) => clearTimeout(timer));
        }

        this.reconnectionTimers.clear();
    }

    /**
     * Reinitializes all WebSocket plugins using the stored connection information.
     * This is triggered when the active WebSocket disconnects.
     */
    private reinitializeAll(): void {
        console.log(`Reinitializing all WebSockets...`);
        this.pendingConnections.forEach((connection, key) => {
            this.initialize(key, connection.url, connection.onMessage);
        });
    }

    /**
     * Sends a message to a WebSocket by key, if connected.
     *
     * @param key Identifier of the WebSocket.
     * @param message The message to send.
     */
    public sendMessage(key: string, message: string): void {
        const socket = this.sockets.get(key);

        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error(`Cannot send message. WebSocket "${key}" is not connected.`);
            return;
        }

        socket.send(message);
        console.log(`Message sent to WebSocket "${key}": ${message}`);
    }

    /**
     * Fully disconnects and clears all WebSocket connections and reconnection attempts.
     */
    public disconnectAll(): void {
        console.log(`Disconnecting all WebSockets.`);
        this.sockets.forEach((socket, key) => {
            console.log(`Closing WebSocket "${key}".`);
            socket.close();
        });

        this.sockets.clear();
        this.activeSocketKey = null;

        // Clear reconnection timers
        this.clearReconnectionTimers();
    }
}