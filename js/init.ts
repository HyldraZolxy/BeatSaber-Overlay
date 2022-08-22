console.time("Load time");

import { Parameters } from "./parameters.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { UI } from "./ui.js";
import { Plugins } from "./plugins.js";
import { Setup } from "./setup.js";

class Init {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _parameters: Parameters;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _ui: UI;
    private _plugins: Plugins;
    private _setup: Setup;

    constructor() {
        this._parameters = Parameters.Instance;
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._ui = new UI();
        this._plugins = Plugins.Instance;
        this._setup = new Setup();

        (async () => {
            await this.appInit();
        })();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async appInit() {
        await this._playerCard.loadSkin(this._playerCard.playerCardData.skin);
        await this._songCard.loadSkin(this._songCard.songCardData.skin);

        this._ui.refreshUI();

        console.timeEnd("Load time");

        await this._plugins.beatSaberConnection();
    }
}

new Init();