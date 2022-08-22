import { Globals } from "./global.js";
import { Template } from "./template.js";
import { ScoreSaber } from "./scoreSaber.js";

export class PlayerCard {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: PlayerCard;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _template: Template;
    private _scoreSaber: ScoreSaber;

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public playerCardData: Globals.I_playerCard = {
        disabled: true,
        display: false,
        alwaysDisplayed: false,
        needUpdate: false,
        position: "top-right",
        skin: "default",
        scale: 1.0,

        playerId: "0",
        avatar: "./pictures/default/notFound.jpg",
        playerFlag: "./pictures/country/FR.svg",
        topWorld: 0,
        topCountry: 0,
        performancePoint: 0
    };

    constructor() {
        this._template = new Template();
        this._scoreSaber = new ScoreSaber();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private async updatePlayerInfo(): Promise<void> {
        if (this.playerCardData.disabled
            || !this.playerCardData.display
            || !this.playerCardData.needUpdate
            || this.playerCardData.playerId === "0")
            return;

        this.playerCardData.needUpdate = false;
        const data = await this._scoreSaber.getPlayerInfo(this.playerCardData.playerId);

        if (data.errorMessage !== undefined)
            return;

        this.playerCardData.avatar = data.profilePicture;
        this.playerCardData.playerFlag = "./pictures/country/" + data.country + ".svg";
        this.playerCardData.topWorld = data.rank;
        this.playerCardData.topCountry = data.countryRank;
        this.playerCardData.performancePoint = data.pp;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async loadSkin(skinName: string) {
        if (this.playerCardData.playerId !== "0")
            this.playerCardData.disabled = false;

        if (this.playerCardData.disabled)
            return;

        if (skinName !== undefined)
            await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, skinName);
    }

    public refreshPlayerCard(): void {
        this.updatePlayerInfo().then(() => {
            this._template.refreshUI(this.playerCardData, Globals.E_MODULES.PLAYERCARD);
            this._template.moduleScale(Globals.E_MODULES.PLAYERCARD, this.playerCardData.position, this.playerCardData.scale);
            this._template.moduleCorners(Globals.E_MODULES.PLAYERCARD, this.playerCardData.position);
        });
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): PlayerCard {
        return this._instance || (this._instance = new this());
    }
}