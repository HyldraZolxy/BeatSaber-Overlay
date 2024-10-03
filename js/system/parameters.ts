import { Globals }      from "../globals.js";
import { Tools }        from "./tools.js";
import { PlayerCard }   from "../modules/playerCard.js";
import { SongCard }     from "../modules/songCard.js";
import { Leaderboard }  from "../modules/leaderboard.js";

///////////////
// Interface //
///////////////

// Parameters allowed for the overlay
interface I_uriParamsAllowed {
    general: {
        [key: string]: string|number;

        ip              : string; // Local IP or External IP
        token           : string; // External token for parameters
        scoringSystem   : number; // Use the scoring system by Globals.E_SCORING_SYSTEM
    }

    games: Globals.I_gamesSupported;
    plugins: Globals.I_pluginsSupported;

    playerCard: {
        [key: string]: string|number|boolean;

        disabled        : boolean;  // PlayerCard is enabled ?
        alwaysEnabled   : boolean;  // PlayerCard is always displayed ?
        playerID        : string;   // PlayerID from ScoreSaber (string because the number is too long)
        skin            : string;   // Skin of PlayerCard
        position        : number;   // Position of PlayerCard
        scale           : number;   // Scale of PlayerCard
        pos_x           : number;   // Position of PlayerCard on the X axis
        pos_y           : number;   // Position of PlayerCard on the Y axis
    }

    songCard: {
        [key: string]: string|number|boolean;

        disabled        : boolean;  // SongCard is enabled ?
        alwaysEnabled   : boolean;  // SongCard is always displayed ?
        skin            : string;   // Skin of SongCard
        position        : number;   // Position of SongCard
        scale           : number;   // Scale of SongCard
        pos_x           : number;   // Position of SongCard on the X axis
        pos_y           : number;   // Position of SongCard on the Y axis
        missDisplay     : boolean;  // Display the miss system ?
        bigBSR          : boolean;  // Display the big BSR system ?
        ppMax           : boolean;  // Display the pp max system ?
        ppEstimated     : boolean;  // Display the pp estimated system ?
    }

    leaderboard: {
        [key: string]: string|number|boolean;

        disabled        : boolean;  // Leaderboard is enabled ?
        skin            : string;   // Skin of Leaderboard
        battleRoyal     : boolean;  // Is Battle Royal enabled?
        position        : number;   // Position of Leaderboard
        scale           : number;   // Scale of Leaderboard
        pos_x           : number;   // Position of the Leaderboard on the X axis
        pos_y           : number;   // Position of the Leaderboard on the Y axis
        playerRendering : number;   // Player number rendering on the Leaderboard
    }
}

// JSON representation of the parameters
interface I_uriParamsJSON {
    errorMessage    : string; // Error message from token script
    successMessage  : string; // Success message from token script
}
interface I_uriParamsJSONSearch extends I_uriParamsJSON, I_uriParamsAllowed {}
interface I_uriParamsJSONSave   extends I_uriParamsJSON {
    token: string; // Token saved in database
}
interface I_uriParamsJSONUpdate extends I_uriParamsJSON {}

export class Parameters {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Parameters;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools      : Tools;
    private _playerCard : PlayerCard;
    private _songCard   : SongCard;
    private _leaderboard: Leaderboard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private oldURIParams = {
        ip      : ["ip"],
        playerID: ["pid"],
        position: ["pcpos", "scpos"],
        scale   : ["pcsc", "scsc"],
        skin    : ["pcsk", "scsk"],
        boolean : ["md"]
    };
    private oldURIParamsConverter(key: string): string {
        switch (key) {
            case "pid"  : return "playerID";
            case "md"   : return "missDisplay";

            case "pcpos":
            case "scpos": return "position";

            case "pcsc" :
            case "scsc" : return "scale";

            case "pcsk" :
            case "scsk" : return "skin";

            default     : return key;
        }
    };
    private URIParamsModuleConverter(key: string): keyof I_uriParamsAllowed {
        switch (key) {
            case "ip"   :
            case "token": return "general";

            case "pid"  :
            case "pcpos":
            case "pcsc" :
            case "pcsk" : return "playerCard";

            case "scpos":
            case "scsc" :
            case "scsk" :
            case "md"   : return "songCard";

            default     : return "general";
        }
    }

    //////////////////////
    // Public Variables //
    //////////////////////
    public uriParams: I_uriParamsAllowed = {
        general: {
            ip              : "127.0.0.1",
            token           : "", // Token debug mode: v-rFZp2Hg1B4M6ZEtaL3bNx9fS8Elpvy
            scoringSystem   : 1
        },

        games: {
            beatSaber   : true,
            synthRiders : false,
            audioTrip   : false,
            audica      : false,
            adofai      : false
        },

        plugins: {
            beatSaberPlugins: {
                beatSaberPlus             : true,
                beatSaberPlusLeaderboard  : false,
                dataPuller                : true,
                httpSiraStatus            : true
            },

            synthRidersPlugins: {
                synthRiders : false
            },

            audioTripPlugins: {
                audioTrip : false
            },

            audicaPlugins: {
                audica : false
            },

            adofaiPlugins: {
                adofai : false
            }
        },

        playerCard: {
            disabled        : false,
            alwaysEnabled   : false,
            playerID        : Globals.DEFAULT_PLAYERID,
            skin            : "default",
            position        : 1,
            scale           : 1.0,
            pos_x           : 0,
            pos_y           : 0,
        },

        songCard: {
            disabled        : false,
            alwaysEnabled   : false,
            skin            : "default",
            position        : 2,
            scale           : 1.0,
            pos_x           : 0,
            pos_y           : 0,
            missDisplay     : false,
            bigBSR          : false,
            ppMax           : false,
            ppEstimated     : false,
        },

        leaderboard: {
            disabled        : true,
            skin            : "default",
            battleRoyal     : false,
            position        : 0,
            scale           : 1.0,
            pos_x           : 0,
            pos_y           : 0,
            playerRendering : 5,
        }
    };

    constructor() {
        this._tools         = new Tools();
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
        this._leaderboard   = Leaderboard.Instance;

        this.findParameters(new URLSearchParams(Globals.URI_NAV_SEARCH));
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private findParameters(uri_search: URLSearchParams): void {
        for (let [key, value] of uri_search.entries()) {
            let keyDecoded      = decodeURI(key);
            let valueDecoded    = decodeURI(value);
            let keyConverted    = this.oldURIParamsConverter(keyDecoded);
            let moduleByKey     = this.URIParamsModuleConverter(key);

            if (keyConverted in this.uriParams[this.URIParamsModuleConverter(key)]) {
                if (this.parseParameters(keyConverted, this.oldURIParams.position.includes(keyDecoded) ? this._tools.positionNumberConverter(valueDecoded) : valueDecoded, moduleByKey)) {
                    this.uriParams[moduleByKey][keyConverted] = this.oldURIParams.scale.includes(keyDecoded) ? Number(valueDecoded) :
                        this.oldURIParams.boolean.includes(keyDecoded) ? (valueDecoded === "true") :
                            this.oldURIParams.position.includes(keyDecoded) ? this._tools.positionNumberConverter(valueDecoded) : // Converting old positions values to new ones
                                valueDecoded;
                }
            }
        }
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public parseParameters(key: string, value: string|boolean|number, module?: keyof I_uriParamsAllowed): boolean {
        switch(key) {
            case "token":
                if (typeof value !== "boolean" && typeof value !== "number" && value.length === Globals.TOKEN_LENGTH)
                    return !RegExp(/[^-~._\w]/).test(value); // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~
                return false;

            case "ip":
                return RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(<string>value) || <string>value === "localhost";

            case "playerID":
            case "playerRendering":
            case "scoringSystem":
            case "pos_x":
            case "pos_y":
                return RegExp(/^-?\d+$/).test(<string>value);

            case "disabled":
            case "alwaysEnabled":
            case "beatSaber":
            case "beatSaberPlus":
            case "beatSaberPlusLeaderboard":
            case "dataPuller":
            case "httpSiraStatus":
            case "synthRiders":
            case "audioTrip":
            case "audica":
            case "adofai":
            case "missDisplay":
            case "bigBSR":
            case "ppMax":
            case "ppEstimated":
            case "battleRoyal":
                return (<string>value === "true" || <string>value === "false") || typeof value === "boolean";

            case "skin":
                if (module !== undefined)
                    return this._tools.getModuleSkin(module, <string>value) !== null;
                return false;

            case "position":
                return <string>value in Globals.E_POSITION;

            case "scale":
                return RegExp(/^[+-]?\d+(\.\d+)?$/).test(<string>value);

            default: return false;
        }
    }

    public async searchTokenParameters(): Promise<boolean> {
        if ((this.uriParams.general.token !== null) && (this.uriParams.general.token.length === Globals.TOKEN_LENGTH)) {
            const formData = {
                token   : this.uriParams.general.token,
                function: "search"
            };

            let dataJson: I_uriParamsJSONSearch = await this._tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson) console.log("%c" + dataJson.errorMessage, Globals.ERROR_LOG);

            if ("successMessage" in dataJson) {
                console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);

                for (let [key, value] of Object.entries(dataJson)) {
                    let module: keyof I_uriParamsAllowed;

                    if (key === "successMessage") continue;

                    switch(key) {
                        case "general"      : module = "general";       break;
                        case "playerCard"   : module = "playerCard";    break;
                        case "songCard"     : module = "songCard";      break;
                        case "leaderboard"  : module = "leaderboard";   break;
                        case "games"        : module = "games";         break;
                        case "plugins"      : module = "plugins";       break;
                        default             : module = "general";       break;
                    }

                    for (let [keyValue, valueValue] of Object.entries<string>(value)) {
                        switch(keyValue) {
                            case "beatSaberPlugins":
                            case "synthRidersPlugins":
                            case "audioTripPlugins":
                            case "audicaPlugins":
                            case "adofaiPlugins":
                                let pluginsModule = keyValue;

                                for (let [keyPluginsValue, valuePluginsValue] of Object.entries<string>(valueValue)) {
                                    if (typeof this.uriParams.plugins[pluginsModule][keyPluginsValue] === "boolean")  if ((keyPluginsValue) in this.uriParams.plugins[pluginsModule]) this.uriParams.plugins[pluginsModule][keyPluginsValue] = (Number(valuePluginsValue) === 1);
                                }
                                break;

                            default:
                                if (typeof this.uriParams[module][keyValue] === "string")   if ((keyValue) in this.uriParams[module]) this.uriParams[module][keyValue] = valueValue;
                                if (typeof this.uriParams[module][keyValue] === "number")   if ((keyValue) in this.uriParams[module]) this.uriParams[module][keyValue] = Number(valueValue);
                                if (typeof this.uriParams[module][keyValue] === "boolean")  if ((keyValue) in this.uriParams[module]) this.uriParams[module][keyValue] = (Number(valueValue) === 1);
                                break;
                        }
                    }
                }

                return true;
            }
        }

        return false;
    }
    public async saveTokenParameters(): Promise<boolean> {
        const formData = {
            token   : this.uriParams.general.token,
            function: "save",
            data    : this.uriParams
        };

        let dataJson: I_uriParamsJSONSave = await this._tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

        if ("errorMessage" in dataJson) console.log("%c" + dataJson.errorMessage, Globals.ERROR_LOG);

        if ("successMessage" in dataJson) {
            console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);

            this.uriParams.general.token = dataJson.token;
        }

        return this.uriParams.general.token !== "";
    }
    public async updateTokenParameters(): Promise<boolean> {
        if ((this.uriParams.general.token !== null) && (this.uriParams.general.token.length === Globals.TOKEN_LENGTH)) {
            const formData = {
                token   : this.uriParams.general.token,
                function: "update",
                data    : this.uriParams
            };

            let dataJson: I_uriParamsJSONUpdate = await this._tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson) console.log("%c" + dataJson.errorMessage, Globals.ERROR_LOG);
            if ("successMessage" in dataJson) {
                console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);
                return true;
            }
        }

        return false;
    }

    public assocValue(): void {
        // PlayerCard
        this._playerCard.playerCardData.disabled            = this.uriParams.playerCard.disabled;
        this._playerCard.playerCardData.alwaysEnabled       = this.uriParams.playerCard.alwaysEnabled;
        this._playerCard.playerCardData.skin                = this.uriParams.playerCard.skin;
        this._playerCard.playerCardData.position            = this.uriParams.playerCard.position;
        this._playerCard.playerCardData.scale               = this.uriParams.playerCard.scale;
        this._playerCard.playerCardData.pos_x               = this.uriParams.playerCard.pos_x;
        this._playerCard.playerCardData.pos_y               = this.uriParams.playerCard.pos_y;
        this._playerCard.playerCardData.scoringSystem       = this.uriParams.general.scoringSystem;

        this._playerCard.playerCardData.playerID            = this.uriParams.playerCard.playerID;

        // SongCard
        this._songCard.songCardData.disabled                = this.uriParams.songCard.disabled;
        this._songCard.songCardData.alwaysEnabled           = this.uriParams.songCard.alwaysEnabled;
        this._songCard.songCardData.skin                    = this.uriParams.songCard.skin;
        this._songCard.songCardData.position                = this.uriParams.songCard.position;
        this._songCard.songCardData.scale                   = this.uriParams.songCard.scale;
        this._songCard.songCardData.pos_x                   = this.uriParams.songCard.pos_x;
        this._songCard.songCardData.pos_y                   = this.uriParams.songCard.pos_y;
        this._songCard.songCardData.scoringSystem           = this.uriParams.general.scoringSystem;

        this._songCard.songCardData.displayMiss             = this.uriParams.songCard.missDisplay;
        this._songCard.songCardData.bigBSR                  = this.uriParams.songCard.bigBSR;
        this._songCard.songCardData.ppMax                   = this.uriParams.songCard.ppMax;
        this._songCard.songCardData.ppEstimated             = this.uriParams.songCard.ppEstimated;

        // Leaderboard
        this._leaderboard.leaderboardData.disabled          = this.uriParams.leaderboard.disabled;
        this._leaderboard.leaderboardData.skin              = this.uriParams.leaderboard.skin;
        this._leaderboard.leaderboardData.position          = this.uriParams.leaderboard.position;
        this._leaderboard.leaderboardData.scale             = this.uriParams.leaderboard.scale;
        this._leaderboard.leaderboardData.pos_x             = this.uriParams.leaderboard.pos_x;
        this._leaderboard.leaderboardData.pos_y             = this.uriParams.leaderboard.pos_y;
        this._leaderboard.leaderboardData.playerRendering   = this.uriParams.leaderboard.playerRendering;
        this._leaderboard.leaderboardData.battleRoyal       = this.uriParams.leaderboard.battleRoyal;
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }
}