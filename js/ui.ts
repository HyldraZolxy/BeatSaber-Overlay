import { Globals }      from "./globals";
import { Template }     from "./template";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";
import { Leaderboard }  from "./leaderboard";

export class UI {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _template:      Template;
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;
    private _leaderboard:   Leaderboard;

    constructor() {
        this._template      = new Template();
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
        this._leaderboard   = Leaderboard.Instance;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async initUI() {
        if (!this._playerCard.playerCardData.disabled)      await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
        if (!this._songCard.songCardData.disabled)          await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
        if (!this._leaderboard.leaderboardData.disabled)    await this._template.loadSkin(Globals.E_MODULES.LEADERBOARD, this._leaderboard.leaderboardData.skin);
    }

    public refreshUI(): void {
        setInterval(() => {
            if (!this._playerCard.playerCardData.disabled)      this._playerCard.refreshPlayerCard();
            if (!this._songCard.songCardData.disabled)          this._songCard.refreshSongCard();
            if (!this._leaderboard.leaderboardData.disabled)    this._leaderboard.refreshLeaderboard();

            if (!this._playerCard.playerCardData.disabled
                || !this._songCard.songCardData.disabled)
                this._template.moduleToggleDisplay(this._playerCard.playerCardData, this._songCard.songCardData);
        }, Globals.FPS_REFRESH);
    }
}