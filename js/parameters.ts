import { Globals } from "./global.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";

export class Parameters {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: Parameters;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _playerCard: PlayerCard;
    private _songCard: SongCard;

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public _uriParams: Globals.I_uriParamsAllowed = {
        ip: "localhost",
        pid: "0",

        pcsk: "default",
        pcpos: "top-right",
        pcsc: 1.0,

        scsk: "default",
        scpos: "bottom-left",
        scsc: 1.0
    };

    constructor() {
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;

        this.findParameters(new URLSearchParams(Globals.URI_NAV_SEARCH));
        this.giveParametersToClass();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private findParameters(uri_search: URLSearchParams): void {
        for (const [key, value] of uri_search.entries()) {
            if (decodeURI(key) in this._uriParams)
                if (this.parseParameters(decodeURI(key), decodeURI(value)))
                    this._uriParams[decodeURI(key)] = ["pcsc", "scsc"].includes(decodeURI(key)) ? +(decodeURI(value)) : decodeURI(value);
        }
    }

    private giveParametersToClass(): void {
        this._playerCard.playerCardData.skin = this._uriParams.pcsk;
        this._playerCard.playerCardData.position = this._uriParams.pcpos;
        this._playerCard.playerCardData.scale = this._uriParams.pcsc;
        this._playerCard.playerCardData.playerId = this._uriParams.pid;

        this._songCard.songCardData.skin = this._uriParams.scsk;
        this._songCard.songCardData.position = this._uriParams.scpos;
        this._songCard.songCardData.scale = this._uriParams.scsc;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public parseParameters(key: string, value: string): boolean {
        switch(key) {
            case "ip":
                if (RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(value) || value === "localhost")
                    return true;
                return false;

            case "pid":
                if (RegExp(/^-?\d+$/).test(value))
                    return true;
                return false;

            case "pcsk":
                if (Globals.SKIN_AVAILABLE[Globals.E_MODULES.PLAYERCARD].hasOwnProperty(value))
                    return true;
                return false;
            case "scsk":
                if (Globals.SKIN_AVAILABLE[Globals.E_MODULES.SONGCARD].hasOwnProperty(value))
                    return true;
                return false;

            case "pcpos":
            case "scpos":
                if (Globals.DISPLAY_POSITION.includes(value))
                    return true;
                return false;

            case "pcsc":
            case "scsc":
                if (RegExp(/^[+-]?\d+(\.\d+)?$/).test(value))
                    return true;
                return false;

            default: return false;
        }
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }
}