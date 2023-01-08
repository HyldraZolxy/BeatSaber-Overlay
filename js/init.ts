console.time("Load time");

import { Globals }      from "./globals";
import { Parameters }   from "./parameters";
import { UI }           from "./ui";
import { Plugins }      from "./plugins";
import { Setup }        from "./setup";

class Init {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _parameters:    Parameters;
    private _ui!:           UI;
    private _plugins:       Plugins;
    private _setup:         Setup;

    constructor() {
        console.info("%cWelcome to your new Multigames Overlay !", Globals.TITLE_LOG);
        console.info("Overlay work with: Beat Saber, Synth Riders, Audio Trip and Audica !");
        console.info("Plugins:", Globals.E_PLUGINS_BS, Globals.E_PLUGINS_SR, Globals.E_PLUGINS_AT, Globals.E_PLUGINS_ADC, "\n\n(for more information, see globals.ts, section \"Plugins Global Variable\", enum E_PLUGINS or Readme.md on https://github.com/HyldraZolxy/BeatSaber-Overlay#readme)");

        this._parameters    = Parameters.Instance;
        this._ui            = new UI();
        this._plugins       = Plugins.Instance;
        this._setup         = new Setup();

        (async () => {
            await this.appInit();
            this._ui.refreshUI();

            console.timeEnd("Load time");
        })();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async appInit() {
        await this._parameters.searchTokenParameters().then(() => {
            this._parameters.assocValue();
        });
        await this._ui.initUI();

        this._plugins.connection();
    }
}

new Init();