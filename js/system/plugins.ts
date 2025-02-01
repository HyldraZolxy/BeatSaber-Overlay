import { WebSocketManager } from "./websockets/websocketsManager.js";

// Beat Saber Plugin
import { BsPlusPlugin }         from './websockets/plugins/beatsaber/bsplus.js';
import { HttpSiraStatusPlugin } from './websockets/plugins/beatsaber/httpsirastatus.js';
import { DataPullerPlugin }     from './websockets/plugins/beatsaber/datapuller.js';
// Adofai Plugin
import { AdofaiWebPlugin } from './websockets/plugins/adofai/adofaiweb.js';
// Audica Plugin
import { AudicaWebsocketServerPlugin } from './websockets/plugins/audica/audicawebsocketserver.js';
// AudioTrip Plugin
import { AtsTypesPlugin } from './websockets/plugins/audiotrip/atstypes.js';
// SynthRiders Plugin
import { SynthRidersWebsocketModPlugin } from './websockets/plugins/synthriders/synthriderswebsocketmod.js';

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
        // Beat Saber Websocket
        new BsPlusPlugin(this.manager);
        new HttpSiraStatusPlugin(this.manager);
        new DataPullerPlugin(this.manager);

        // Adofai Websocket
        new AdofaiWebPlugin(this.manager);

        // Audica Websocket
        new AudicaWebsocketServerPlugin(this.manager);

        // AudioTrip Websocket
        new AtsTypesPlugin(this.manager);

        // SynthRiders Websocket
        new SynthRidersWebsocketModPlugin(this.manager);
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