import { GlobalVariable } from "./global.js";
// import { Tools } from "./tools.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { Plugins } from "./plugins.js";

export class Parameters {

    //////////////
    // INSTANCE //
    //////////////
    private static _instance: Parameters;

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _plugins: Plugins;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private _urlParameters: URLSearchParams;
    private _isParametersExist!: boolean;

    constructor() {
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._plugins = Plugins.Instance;

        this._urlParameters = new URLSearchParams(GlobalVariable.URL_NAV);
        this.findParameters();
        this.findParameters(GlobalVariable.URL_PARAMS_ALLOWED);
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private findParameters(parameter?: Array<string>) {
        if (parameter == undefined) {
            (GlobalVariable.URL_NAV) ? this._isParametersExist = true : this._isParametersExist = false;
        } else {
            if (this._isParametersExist) {
                for (let i = 0; i < parameter.length; i++) {
                    if (this._urlParameters.has(parameter[i])) {
                        let parameterValue = this._urlParameters.get(parameter[i]);

                        if (parameterValue !== null) {
                            if (this.parseParameters(parameter[i], parameterValue)) {
                                this.addParameters(parameter[i], parameterValue);
                            }
                        }
                    }
                }
            }
        }
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public parseParameters(parametersName: string, parametersValue: string): boolean {
        switch(parametersName) {
            case "ip":
                return RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(parametersValue);

            case "pid":
                return RegExp(/^-?\d+$/).test(parametersValue);

            // case "pcsk":
            //     return GlobalVariable.SKIN_PLAYER_CARD.hasOwnProperty(parametersValue);

            case "scsk":
                return GlobalVariable.SKIN_SONG_CARD.includes(parametersValue);

            case "pcpos":
            case "scpos":
                return GlobalVariable.DISPLAY_POSITION.includes(parametersValue);

            case "pcsc":
            case "scsc":
                return RegExp(/^[+-]?\d+(\.\d+)?$/).test(parametersValue);

            default:
                return false;
        }
    }

    public addParameters(parametersName: string, parametersValue: string): void {
        switch(parametersName) {
            case "ip":
                this.ip = parametersValue;
                break;

            case "pid":
                this.playerId = parametersValue;
                break;

            // case "pcsk":
            //     this.playerCardSkin = parametersValue;
            //     break;

            case "scsk":
                this.songCardSkin = parametersValue;
                break;

            case "pcpos":
                this.playerCardPosition = parametersValue;
                break;

            case "scpos":
                this.songCardPosition = parametersValue;
                break;

            case "pcsc":
                this.playerCardScale = +(parametersValue);
                break;

            case "scsc":
                this.songCardScale = +(parametersValue);
                break;
        }
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }

    /////////////
    // SETTERS //
    /////////////
    private set ip(ipValue: string) {
        this._plugins.pluginsParameters.ip = ipValue;
    }

    private set playerId(playerIdValue: string) {
        this._playerCard.playerCardParameters.playerId = playerIdValue;
    }

    // private set playerCardSkin(skinValue: string) {
    //     this._playerCard.playerCardParameters.skin = skinValue;
    // }

    private set songCardSkin(skinValue: string) {
        this._songCard.songCardParameters.skin = skinValue;
    }

    private set playerCardPosition(positionValue: string) {
        this._playerCard.playerCardParameters.position = positionValue;
    }

    private set songCardPosition(positionValue: string) {
        this._songCard.songCardParameters.position = positionValue;
    }

    private set playerCardScale(scaleValue: number) {
        this._playerCard.playerCardParameters.scale = scaleValue;
    }

    private set songCardScale(scaleValue: number) {
        this._songCard.songCardParameters.scale = scaleValue;
    }
}