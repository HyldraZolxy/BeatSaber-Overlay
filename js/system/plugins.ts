import { WebSocketManager } from "./websockets/websocketsManager";
import { BsPlusPlugin } from './websockets/plugins/beatsaber_bsplus';
import { HttpSiraStatus } from './websockets/plugins/beatsaber_httpsirastatus';
import { DataPuller } from './websockets/plugins/beatsaber_datapuller';

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
    public setupDisplay     = false;

    constructor() {}

    ////////////////////
    // Public Methods //
    ////////////////////
    public async connection(): Promise<void> {
        new BsPlusPlugin(this.manager);
        new HttpSiraStatus(this.manager);
        new DataPuller(this.manager);
    }

    ///TODO: Remove it when setup is on rework process
    public removeConnection(): Promise<unknown> {
        return new Promise(resolve => {
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