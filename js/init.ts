console.time("Load time");

import { Parameters } from "./parameters.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { UI } from "./ui.js";
import { Plugins } from "./plugins.js";
import { Setup } from "./setup.js";

class Init {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _parameters: Parameters;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _ui: UI;
    private _plugins: Plugins;

    constructor() {
        this._parameters = Parameters.Instance;
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._ui = new UI();
        this._plugins = Plugins.Instance;
        new Setup();

        (async () => {
            await this.appInit();

            console.timeEnd("Load time");
        })();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async appInit() {
        await this._songCard.loadSkin(this._songCard.songCardParameters.skin);
        await this._playerCard.loadSkin(this._playerCard.playerCardParameters.skin);

        this._ui.refreshUI();
        this._plugins.beatSaberConnection();
    }
}

new Init();