import { Globals }      from "./globals";
import { Tools }        from "./tools";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";
import { Leaderboard }  from "./leaderboard";

export class Parameters {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Parameters;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _Tools:         Tools;
    private _PlayerCard:    PlayerCard;
    private _SongCard:      SongCard;
    private _Leaderboard:   Leaderboard

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private _uriParamsPos       = [
        "pcpos",
        "scpos"
    ];
    private _uriParamsNumber    = [
        "pcsc",
        "scsc"
    ];
    private _uriParamsBoolean   = [
        "md"
    ];
    private _convertURIParamsKey(key: string): string {
        switch (key) {
            case "pid":     return "pc_playerID";
            case "pcsk":    return "pc_skin";
            case "pcpos":   return "pc_position";
            case "pcsc":    return "pc_scale";
            case "scsk":    return "sc_skin";
            case "scpos":   return "sc_position";
            case "scsc":    return "sc_scale";
            case "md":      return "sc_missDisplay";
            default:        return key;
        }
    };

    //////////////////////
    // Public Variables //
    //////////////////////
    public uriParams: Globals.I_uriParamsAllowed = {
        // General
        ip:                         "127.0.0.1",
        token:                      "v-rFZp2Hg1B4M6ZEtaL3bNx9fS8Elpvy", // Token debug mode: v-rFZp2Hg1B4M6ZEtaL3bNx9fS8Elpvy
        scoringSystem:              1,

        // PlayerCard
        pc_disabled:                false,
        pc_alwaysEnabled:           false,
        pc_playerID:                "0",
        pc_skin:                    "default",
        pc_position:                0,
        pc_scale:                   1.0,
        pc_pos_x:                   0,
        pc_pos_y:                   0,

        // SongCard
        sc_disabled:                false,
        sc_alwaysEnabled:           false,
        sc_skin:                    "default",
        sc_position:                3,
        sc_scale:                   1.0,
        sc_pos_x:                   0,
        sc_pos_y:                   0,
        sc_missDisplay:             true,
        sc_bigBSR:                  false,
        sc_ppMax:                   false,
        sc_ppEstimated:             false,

        // Leaderboard
        ld_disabled:                false,
        ld_skin:                    "default",
        ld_position:                0,
        ld_scale:                   1.0,
        ld_pos_x:                   0,
        ld_pos_y:                   0,
        ld_playerRendering:         5,

        // Games
        g_beatSaber:                true,
        g_synthRiders:              false,
        g_audioTrip:                false,
        g_audica:                   false,

        // Plugins
            // Beat Saber
        p_beatSaberPlus:            true,
        p_beatSaberPlusLeaderboard: true,
        p_dataPuller:               true,
        p_httpSiraStatus:           true,
            // Synth Riders
        p_synthRiders:              false,
            // Audio Trip
        p_audioTrip:                false,
            // Audica
        p_audica:                   false
    };

    constructor() {
        this._Tools         = new Tools();
        this._PlayerCard    = PlayerCard.Instance;
        this._SongCard      = SongCard.Instance;
        this._Leaderboard   = Leaderboard.Instance;

        this.findParameters(new URLSearchParams(Globals.URI_NAV_SEARCH));

        (async () => {
            console.log(this.uriParams);
        })();
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private findParameters(uri_search: URLSearchParams): void {
        for (const [key, value] of uri_search.entries()) {
            let keyDecoded      = decodeURI(key);
            let valueDecoded    = decodeURI(value);
            let keyConverted    = this._convertURIParamsKey(decodeURI(key)); // Converting old keys to new ones

            if (keyConverted in this.uriParams)
                if (this.parseParameters(keyConverted, this._uriParamsPos.includes(keyDecoded) ? this._Tools.positionNumberConverter(valueDecoded) : valueDecoded)) {
                    this.uriParams[keyConverted] = this._uriParamsNumber.includes(keyDecoded) ? +valueDecoded :
                        this._uriParamsBoolean.includes(keyDecoded) ? (valueDecoded === "true") :
                            this._uriParamsPos.includes(keyDecoded) ? this._Tools.positionNumberConverter(valueDecoded) : // Converting old positions values to new ones
                                valueDecoded;
                }
        }
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public parseParameters(key: string, value: string|boolean|number): boolean {
        switch(key) {
            case "token":
                if (typeof value !== "boolean" && typeof value !== "number" && value.length === Globals.TOKEN_LENGTH)
                    return !RegExp(/[^-~._\w]/).test(value); // ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_-.~
                return false;

            case "ip":
                return RegExp(/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/).test(<string>value) || <string>value === "localhost";

            case "pid": // OLD KEY
            case "scoringSystem":
            case "pc_playerID":
            case "pc_pos_x":
            case "pc_pos_y":
            case "sc_pos_x":
            case "sc_pos_y":
            case "ld_pos_x":
            case "ld_pos_y":
            case "ld_playerRendering":
                return RegExp(/^-?\d+$/).test(<string>value);

            case "md": // OLD KEY
            case "sc_missDisplay":
            case "pc_disabled":
            case "pc_alwaysEnabled":
            case "sc_disabled":
            case "sc_alwaysEnabled":
            case "sc_bigBSR":
            case "sc_ppMax":
            case "sc_ppEstimated":
            case "ld_disabled":
            case "ld_alwaysEnabled":
            case "g_beatSaber":
            case "g_synthRiders":
            case "g_audioTrip":
            case "g_audica":
            case "p_beatSaberPlus":
            case "p_beatSaberPlusLeaderboard":
            case "p_dataPuller":
            case "p_httpSiraStatus":
            case "p_synthRiders":
            case "p_audioTrip":
            case "p_audica":
                return (<string>value === "true" || <string>value === "false") || typeof value === "boolean";

            case "pcsk": // OLD
            case "scsk": // OLD
            case "pc_skin":
            case "sc_skin":
                return Globals.SKIN_AVAILABLE[Globals.E_MODULES.PLAYERCARD].hasOwnProperty(<string>value) || Globals.SKIN_AVAILABLE[Globals.E_MODULES.SONGCARD].hasOwnProperty(<string>value);

            case "pcpos": // OLD
            case "scpos": // OLD
            case "pc_position":
            case "sc_position":
                return <string>value in Globals.E_POSITION;

            case "pcsc": // OLD
            case "scsc": // OLD
            case "pc_scale":
            case "sc_scale":
                return RegExp(/^[+-]?\d+(\.\d+)?$/).test(<string>value);

            default: return false;
        }
    }

    public async searchTokenParameters(): Promise<void> {
        if ((this.uriParams.token !== null) && (this.uriParams.token.length === Globals.TOKEN_LENGTH)) {
            const formData = {
                token:      this.uriParams.token,
                function:   "search"
            };

            let dataJson: Globals.I_uriParamsJSONSearch = await this._Tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson) {
                console.log("%c" + dataJson.errorMessage, Globals.WARN_LOG);
            }

            if ("successMessage" in dataJson) {
                console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);

                Object.entries(dataJson).forEach(entry => {
                    let prefix          = "";
                    const [key, value]  = entry;

                    if (key === "successMessage")
                        return;

                    switch(key) {
                        case "general_data":
                            prefix = "";
                            break;

                        case "playercard_data":
                            prefix = "pc_";
                            break;

                        case "songcard_data":
                            prefix = "sc_";
                            break;

                        case "leaderboard_data":
                            prefix = "ld_";
                            break;

                        case "games_data":
                            prefix = "g_";
                            break;

                        case "plugins_data":
                            prefix = "p_";
                            break;

                        default: break;
                    }

                    Object.entries<string>(value).forEach(entry => {
                        const [key, value] = entry;

                        if (typeof this.uriParams[prefix + key] === "string") {
                            if ((prefix + key) in this.uriParams) this.uriParams[prefix + key] = value;
                        } else if (typeof this.uriParams[prefix + key] === "number") {
                            if ((prefix + key) in this.uriParams) this.uriParams[prefix + key] = +value;
                        } else if (typeof this.uriParams[prefix + key] === "boolean") {
                            if ((prefix + key) in this.uriParams) this.uriParams[prefix + key] = (+value === 1);
                        }
                    });
                });
            }
        }
    }

    public async saveTokenParameters(): Promise<boolean> {
        const formData = {
            token:      this.uriParams.token,
            function:   "save",
            data:       this.uriParams
        };

        let dataJson: Globals.I_uriParamsJSONSave = await this._Tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

        if ("errorMessage" in dataJson) console.log("%c" + dataJson.errorMessage, Globals.WARN_LOG);

        if ("successMessage" in dataJson) {
            console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);

            this.uriParams.token = dataJson.token;
        }

        return this.uriParams.token !== "";
    }

    public async updateTokenParameters(): Promise<boolean> {
        if ((this.uriParams.token !== null) && (this.uriParams.token.length === Globals.TOKEN_LENGTH)) {
            const formData = {
                token:      this.uriParams.token,
                function:   "update",
                data:       this.uriParams
            };

            let dataJson: Globals.I_uriParamsJSONUpdate = await this._Tools.postMethod(Globals.URI_TOKEN_SCRIPT, formData);

            if ("errorMessage" in dataJson)     console.log("%c" + dataJson.errorMessage,   Globals.WARN_LOG);
            if ("successMessage" in dataJson) {
                console.log("%c" + dataJson.successMessage, Globals.INFO_LOG);
                return true;
            }

            return false;
        }

        return false;
    }

    public assocValue(): void {
        // PlayerCard
        this._PlayerCard.playerCardGames.g_beatSaber        = this.uriParams.g_beatSaber;
        this._PlayerCard.playerCardGames.g_synthRiders      = this.uriParams.g_synthRiders;
        this._PlayerCard.playerCardGames.g_audioTrip        = this.uriParams.g_audioTrip;
        this._PlayerCard.playerCardGames.g_audica           = this.uriParams.g_audica;

        this._PlayerCard.playerCardData.disabled            = this.uriParams.pc_disabled;
        this._PlayerCard.playerCardData.alwaysEnabled       = this.uriParams.pc_alwaysEnabled;
        this._PlayerCard.playerCardData.skin                = this.uriParams.pc_skin;
        this._PlayerCard.playerCardData.position            = this.uriParams.pc_position;
        this._PlayerCard.playerCardData.scale               = this.uriParams.pc_scale;
        this._PlayerCard.playerCardData.pos_x               = this.uriParams.pc_pos_x;
        this._PlayerCard.playerCardData.pos_y               = this.uriParams.pc_pos_y;
        this._PlayerCard.playerCardData.scoringSystem       = this.uriParams.scoringSystem;

        this._PlayerCard.playerCardData.playerID            = this.uriParams.pc_playerID;

        // SongCard
        this._SongCard.songCardGames.g_beatSaber            = this.uriParams.g_beatSaber;
        this._SongCard.songCardGames.g_synthRiders          = this.uriParams.g_synthRiders;
        this._SongCard.songCardGames.g_audioTrip            = this.uriParams.g_synthRiders;
        this._SongCard.songCardGames.g_audica               = this.uriParams.g_audica;

        this._SongCard.songCardData.disabled                = this.uriParams.sc_disabled;
        this._SongCard.songCardData.alwaysEnabled           = this.uriParams.sc_alwaysEnabled;
        this._SongCard.songCardData.skin                    = this.uriParams.sc_skin;
        this._SongCard.songCardData.position                = this.uriParams.sc_position;
        this._SongCard.songCardData.scale                   = this.uriParams.sc_scale;
        this._SongCard.songCardData.pos_x                   = this.uriParams.sc_pos_x;
        this._SongCard.songCardData.pos_y                   = this.uriParams.sc_pos_y;
        this._SongCard.songCardData.scoringSystem           = this.uriParams.scoringSystem;

        this._SongCard.songCardData.displayMiss             = this.uriParams.sc_missDisplay;
        this._SongCard.songCardData.bigBSR                  = this.uriParams.sc_bigBSR;
        this._SongCard.songCardData.ppMax                   = this.uriParams.sc_ppMax;
        this._SongCard.songCardData.ppEstimated             = this.uriParams.sc_ppEstimated;

        // Leaderboard
        this._Leaderboard.leaderboardData.disabled          = this.uriParams.ld_disabled;
        this._Leaderboard.leaderboardData.skin              = this.uriParams.ld_skin;
        this._Leaderboard.leaderboardData.position          = this.uriParams.ld_position;
        this._Leaderboard.leaderboardData.scale             = this.uriParams.ld_scale;
        this._Leaderboard.leaderboardData.pos_x             = this.uriParams.ld_pos_x;
        this._Leaderboard.leaderboardData.pos_y             = this.uriParams.ld_pos_y;
        this._Leaderboard.leaderboardData.playerRendering   = this.uriParams.ld_playerRendering;
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Parameters {
        return this._instance || (this._instance = new this());
    }
}