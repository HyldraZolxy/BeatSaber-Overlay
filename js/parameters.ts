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
    // private _tools: Tools;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _plugins: Plugins;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private _urlParameters: URLSearchParams;
    private _isParametersExist!: boolean;
    // private _token!: string;

    constructor() {
        // this._tools = new Tools();
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._plugins = Plugins.Instance;

        this._urlParameters = new URLSearchParams(GlobalVariable.URL_NAV);
        this.findParameters();
        this.findParameters(GlobalVariable.URL_PARAMS_ALLOWED);

        // (async () => {
        //     await this.setTokenParameters();
        // })();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private findParameters(parameter?: Array<string>): void {
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
            // case "token":
            //     if (parametersValue.length === GlobalVariable.TOKEN_LENGTH) {
            //         if (!RegExp(/[^-~._\w]/).test(parametersValue)) {
            //             return true;
            //         }
            //     }
            //     return false;

            case "ip":
                return RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(parametersValue);

            case "pid":
                return RegExp(/^-?\d+$/).test(parametersValue);

            // case "playerCardSkin":
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
            // case "token":
            //     this.token = parametersValue;
            //     break;

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

    /*private async setTokenParameters() {
        if ((this._token !== null) && (this._token.length === GlobalVariable.TOKEN_LENGTH)) {
            const formData = {
                token: this._token,
                function: "search"
            };

            let dataJson = await this._tools.postMethod(GlobalVariable.URL_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson) {
                /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER
            }

            if ("successMessage" in dataJson) {
                /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER

                Object.entries(dataJson).forEach(entry => {
                    const [key, value] = entry;
                    
                    switch(key) {
                        case "playerCard":
                            Object.entries<string>(value).forEach(entry => {
                                const [key, value] = entry;

                                if (key in this._playerCard.playerCardParameters) {
                                    switch(key) {
                                        // case "disabled":
                                        // case "alwaysShown":
                                        //     this._playerCard.playerCardParameters[key] = (value === "true");
                                        //     break;

                                        case "position":
                                        case "skin":
                                        case "playerId":
                                            this._playerCard.playerCardParameters[key] = value;
                                            break;
                                        case "scale":
                                            this._playerCard.playerCardParameters[key] = +(value);
                                            break;
                                    }
                                }
                            });
                            break;
                        case "songCard":
                            Object.entries<string>(value).forEach(entry => {
                                const [key, value] = entry;
        
                                if (key in this._songCard.songCardParameters) {
                                    switch(key) {
                                        // case "disabled":
                                        // case "alwaysShown":
                                        //     this._songCard.songCardParameters[key] = (value === "true");
                                        //     break;

                                        case "position":
                                        case "skin":
                                            this._playerCard.playerCardParameters[key] = value;
                                            break;
                                        case "scale":
                                            this._playerCard.playerCardParameters[key] = +(value);
                                            break;
                                    }
                                }
                            });
                            break;
                    }
                });
            }
        }
    }*/

    /*private async saveTokenParameters() {
        const dataObject = {
            playerCard: this._playerCard.playerCardParameters,
            songCard: this._songCard.songCardParameters
        };

        const formData = {
            token: this._token,
            function: "save",
            data: dataObject
        };

        let dataJson = await this._tools.postMethod(GlobalVariable.URL_TOKEN_SCRIPT, formData);

        if ("errorMessage" in dataJson) {
            /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER
        }

        if ("successMessage" in dataJson) {
            /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER

            Object.entries(dataJson).forEach(entry => {
                const [key, value] = entry;

                if (key === "token") {
                    this.token = value;
                }
            });
        }
    }*/

    /*private async updateTokenParameters() {
        if ((this._token !== null) && (this._token.length === GlobalVariable.TOKEN_LENGTH)) {
            const dataObject = {
                playerCard: this._playerCard.playerCardParameters,
                songCard: this._songCard.songCardParameters
            };

            const formData = {
                token: this._token,
                function: "update",
                data: dataObject
            };

            let dataJson = await this._tools.postMethod(GlobalVariable.URL_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson) {
                /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER
            }

            if ("successMessage" in dataJson) {
                /// TODO: USE DEBUG CLASS FOR SAVE THE MESSAGE LATER
            }
        }
    }*/

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }

    /////////////
    // SETTERS //
    /////////////
    // private set token(tokenValue: string) {
    //     this._token = tokenValue;
    // }

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