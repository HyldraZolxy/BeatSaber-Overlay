import { WebSocketManager }     from "./websockets/websocketsManager";
import { BsPlusPlugin }         from './websockets/plugins/beatsaber/bsplus';
import { HttpSiraStatusPlugin } from './websockets/plugins/beatsaber/httpsirastatus';
import { DataPullerPlugin }     from './websockets/plugins/beatsaber/datapuller';

export class Plugins {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Plugins;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private manager = new WebSocketManager();

    //////////////////////
    // Public Variables //
    //////////////////////
    ///TODO: Remove it when setup is on rework process
    public setupDisplay = false;

    constructor() {}

    ////////////////////
    // Public Methods //
    ////////////////////
    public async connection(): Promise<void> {
        new BsPlusPlugin(this.manager);
        new HttpSiraStatusPlugin(this.manager);
        new DataPullerPlugin(this.manager);
    }

    ///TODO: Remove it when setup is on rework process, or maybe make the WebSocketManager an unique instance and use it into the setup 🤔
    public removeConnection(): Promise<unknown> {
        return new Promise(resolve => {
            this.manager.disconnectAll();

            setTimeout(() => resolve(""), 250);
        });
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Plugins {
        return this._instance || (this._instance = new this());
    }
}