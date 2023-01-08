import { Globals } from "./globals";

export class WebSocketManager {

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private sockets:                    Map<string, WebSocket>;
    private reconnectInterval:          Map<string, number>;
    private reconnecting:               Map<string, boolean>;

    constructor() {
        this.sockets            = new Map();
        this.reconnectInterval  = new Map();
        this.reconnecting       = new Map();
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private anyOpen(): boolean {
        for (const socket of this.sockets.values()) if (socket.readyState === WebSocket.OPEN) return true;
        return false;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public add(key: string,
               url: string,
               messageHandler: (data: any) => void,
               openHandler: (event: Event) => void,
               closeHandler: (event: CloseEvent) => void,
               errorHandler: (event: Event) => void,
               reconnectIfAnyOpen: boolean = false,
               reconnectInterval: number = Globals.TIME_BEFORE_RETRY
    ) {
        const socket        = new WebSocket(url);
        socket.onopen       = (event) => openHandler(event);
        socket.onmessage    = (event) => messageHandler(event.data);
        socket.onclose      = (event) => {
            closeHandler(event);
            if (this.sockets.get(key)) this.reconnect(key,url, messageHandler, openHandler, closeHandler, errorHandler, reconnectIfAnyOpen, reconnectInterval);
        };
        socket.onerror      = (event) => errorHandler(event);

        this.sockets.           set(key, socket);
        this.reconnectInterval. set(key, reconnectInterval);
        this.reconnecting.      set(key, false);
    }

    public reconnect(key: string,
                     url: string,
                     messageHandler: (data: any) => void,
                     openHandler: (event: Event) => void,
                     closeHandler: (event: CloseEvent) => void,
                     errorHandler: (event: Event) => void,
                     reconnectIfAnyOpen: boolean,
                     reconnectInterval: number
    ) {
        if ((!reconnectIfAnyOpen && !this.anyOpen()) || reconnectIfAnyOpen) {
            if (!this.reconnecting.get(key) && this.sockets.get(key)) {
                this.reconnecting.set(key, true);

                console.log("%c" + key + " WebSocket reconnecting in " + this.reconnectInterval.get(key) + "ms", Globals.INFO_LOG);

                setTimeout(() => {
                    this.reconnecting.set(key, false);
                    if (this.sockets.get(key)) this.add(key, url, messageHandler, openHandler, closeHandler, errorHandler, reconnectIfAnyOpen, reconnectInterval);
                }, reconnectInterval);
            }
        } else {
            if (!this.reconnecting.get(key)) {
                setTimeout(() => {
                    this.reconnecting.set(key, false);
                    if (this.sockets.get(key)) this.reconnect(key, url, messageHandler, openHandler, closeHandler, errorHandler, reconnectIfAnyOpen, reconnectInterval);
                }, reconnectInterval);
            }
        }
    }

    public remove(key: string) {
        this.sockets.get(key)?.close();

        this.sockets.delete(key);
        this.reconnectInterval.delete(key);
        this.reconnecting.delete(key);
    }

    public get(key: string) { return this.sockets.get(key); }

    public send(key: string, data: any) {
        const socket = this.sockets.get(key);
        if (socket) socket.send(data);
    }
}