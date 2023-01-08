import { Globals }                  from "./globals";
import { Template }                 from "./template";
import { ScoreSaber, BeatLeader }   from "./api-call";

export class PlayerCard {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: PlayerCard;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _template:      Template;
    private _scoreSaber:    ScoreSaber;
    private _beatLeader:    BeatLeader;

    //////////////////////
    // Public Variables //
    //////////////////////
    public playerCardGames: Globals.I_gamesSupported = {
        g_beatSaber     : true,
        g_synthRiders   : true,
        g_audioTrip     : true,
        g_audica        : true
    };
    public playerCardData: Globals.I_playerCard = {
        disabled        : false,
        display         : false,
        alwaysEnabled   : false,
        needUpdate      : true,
        endedUpdate     : false,
        skin            : "default",
        position        : 1,
        scale           : 1.0,
        pos_x           : 0,
        pos_y           : 0,
        scoringSystem   : 1,

        playerID        : Globals.DEFAULT_PLAYERID,
        playerName      : "Default Player",
        playerCountry   : "FR",
        avatar          : "./pictures/default/notFound.jpg",
        playerFlag      : "./pictures/country/FR.svg",
        topWorld        : "336",
        topCountry      : "9",
        performancePoint: "17,357.35"
    };

    constructor() {
        this._template      = new Template();
        this._scoreSaber    = new ScoreSaber();
        this._beatLeader    = new BeatLeader();
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private async updatePlayerInfo(): Promise<void> {
        if (!this.playerCardData.needUpdate || this.playerCardData.playerID === Globals.DEFAULT_PLAYERID) return;

        this.playerCardData.needUpdate = false;

        let data: Globals.I_scoreSaberPlayerJSON | Globals.I_beatLeaderPlayerJSON;

        if (this.playerCardData.scoringSystem === Globals.E_SCORING_SYSTEM.BEATLEADER)  data = await this._beatLeader.getPlayerInfo(this.playerCardData.playerID);
        else                                                                            data = await this._scoreSaber.getPlayerInfo(this.playerCardData.playerID);

        if (data.errorMessage !== undefined) return;

        this.playerCardData.playerName          = data.name;
        this.playerCardData.playerCountry       = data.country;
        this.playerCardData.avatar              = ("profilePicture" in data) ? data.profilePicture : data.avatar;
        this.playerCardData.playerFlag          = "./pictures/country/" + data.country + ".svg";
        this.playerCardData.topWorld            = data.rank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.playerCardData.topCountry          = data.countryRank.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.playerCardData.performancePoint    = data.pp.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        this.playerCardData.endedUpdate         = true;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public refreshPlayerCard(): void {
        if (!this.playerCardGames.g_beatSaber || this.playerCardData.disabled) {
            this.playerCardData.disabled = true;
            return;
        }

        this.updatePlayerInfo().then(() => {
            this._template.refreshUI(this.playerCardData, Globals.E_MODULES.PLAYERCARD);
            this.playerCardData.endedUpdate = false;

            this._template.moduleScale(Globals.E_MODULES.PLAYERCARD, this.playerCardData.position, this.playerCardData.scale);
            this._template.moduleCorners(Globals.E_MODULES.PLAYERCARD, this.playerCardData.position);
            this._template.modulePosition(Globals.E_MODULES.PLAYERCARD, this.playerCardData.pos_x, this.playerCardData.pos_y);
        });
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): PlayerCard {
        return this._instance || (this._instance = new this());
    }
}