import { Globals }      from "./globals";
import { Template }     from "./template";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";

export class UI {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _template:      Template;
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;

    constructor() {
        this._template      = new Template();
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async initUI() {
        await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
        await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
    }

    public refreshUI(): void {
        setInterval(() => {
            this._playerCard.refreshPlayerCard();
            this._songCard.refreshSongCard();
            this._template.moduleToggleDisplay(this._playerCard.playerCardData, this._songCard.songCardData);
        }, Globals.FPS_REFRESH);
    }
}