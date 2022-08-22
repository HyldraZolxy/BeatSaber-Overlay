import { Globals } from "./global.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { Template } from "./template.js";

export class UI {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _template: Template;

    constructor() {
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._template = new Template();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public refreshUI(): void {
        setInterval(() => {
            this._playerCard.refreshPlayerCard();
            this._songCard.refreshSongCard();
            this._template.moduleToggleDisplay(this._playerCard.playerCardData, this._songCard.songCardData);
        }, Globals.FPS_REFRESH);
    }
}