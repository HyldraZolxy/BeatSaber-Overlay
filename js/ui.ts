import { GlobalVariable } from "./global.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";

export class UI {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _playerCard: PlayerCard;
    private _songCard: SongCard;

    constructor() {
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public refreshUI(): void {
        setInterval(() => {
            this._playerCard.refreshPlayerCard(this._playerCard.playerCardData);
            this._songCard.refreshSongCard(this._songCard.songCardData);

            this._playerCard.toggleDisplay();
            this._songCard.toggleDisplay();

            this._playerCard.displayScale();
            this._songCard.displayScale();

            this._playerCard.cornerSwitch();
            this._songCard.cornerSwitch();
        }, GlobalVariable.FPS_REFRESH_TICK);
    }
}