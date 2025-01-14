export class WebSocketManager {
    constructor() {
        this.reconnectionInterval = 5000;
        this.sockets = new Map();
        this.reconnectionTimers = new Map();
        this.pendingConnections = new Map();
        this.activeSocketKey = null;
    }
    initialize(key, url, onMessage) {
        console.log(`Initializing WebSocket "${key}"...`);
        if (this.sockets.has(key)) {
            console.warn(`WebSocket "${key}" is already active.`);
            return;
        }
        this.pendingConnections.set(key, { url, onMessage });
        const socket = new WebSocket(url);
        socket.onopen = () => {
            console.log(`WebSocket "${key}" successfully connected.`);
            this.handleSocketSuccess(key);
        };
        socket.onmessage = (event) => {
            onMessage(event.data);
        };
        socket.onerror = (error) => {
            console.error(`WebSocket "${key}" encountered an error:`, error);
        };
        socket.onclose = () => {
            console.log(`WebSocket "${key}" closed.`);
            this.sockets.delete(key);
            if (this.activeSocketKey === key) {
                console.log(`The active WebSocket "${key}" was closed. Reinitializing all WebSockets...`);
                this.activeSocketKey = null;
                this.reinitializeAll();
            }
            else {
                if (!this.activeSocketKey) {
                    this.scheduleReconnection(key, url, onMessage);
                }
            }
        };
        this.sockets.set(key, socket);
    }
    handleSocketSuccess(key) {
        console.log(`WebSocket "${key}" is now the active connection.`);
        this.activeSocketKey = key;
        this.disconnectAllExcept(key);
        this.clearReconnectionTimers();
    }
    scheduleReconnection(key, url, onMessage) {
        if (this.reconnectionTimers.has(key)) {
            return;
        }
        console.log(`Scheduling reconnection for WebSocket "${key}" in ${this.reconnectionInterval}ms.`);
        const timer = setTimeout(() => {
            console.log(`Reconnecting WebSocket "${key}"...`);
            this.initialize(key, url, onMessage);
            this.reconnectionTimers.delete(key);
        }, this.reconnectionInterval);
        this.reconnectionTimers.set(key, timer);
    }
    disconnectAllExcept(key) {
        this.sockets.forEach((socket, socketKey) => {
            if (socketKey !== key) {
                console.log(`Closing WebSocket "${socketKey}" because "${key}" is now active.`);
                socket.close();
                this.sockets.delete(socketKey);
            }
        });
    }
    clearReconnectionTimers() {
        this.reconnectionTimers.forEach((timer) => clearTimeout(timer));
        this.reconnectionTimers.clear();
    }
    reinitializeAll() {
        console.log(`Reinitializing all WebSockets...`);
        this.pendingConnections.forEach((connection, key) => {
            this.initialize(key, connection.url, connection.onMessage);
        });
    }
    sendMessage(key, message) {
        const socket = this.sockets.get(key);
        if (!socket || socket.readyState !== WebSocket.OPEN) {
            console.error(`Cannot send message. WebSocket "${key}" is not connected.`);
            return;
        }
        socket.send(message);
        console.log(`Message sent to WebSocket "${key}": ${message}`);
    }
    disconnectAll() {
        console.log(`Disconnecting all WebSockets.`);
        this.sockets.forEach((socket, key) => {
            console.log(`Closing WebSocket "${key}".`);
            socket.close();
        });
        this.sockets.clear();
        this.activeSocketKey = null;
        this.clearReconnectionTimers();
    }
}
