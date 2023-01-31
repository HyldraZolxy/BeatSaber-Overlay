import { Globals }      from "./globals";
import { Parameters }   from "./system/parameters";
import { UI }           from "./system/ui";
import { Plugins }      from "./system/plugins";
import { Setup }        from "./modules/setup";

declare global {
    interface Window {
        timeStamp: number;
    }
}

class Init {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _parameters : Parameters;
    private _ui!        : UI;
    private _plugins    : Plugins;
    private _setup      : Setup;

    constructor() {
        console.info("%cWelcome to your new Multigames Overlay !", Globals.TITLE_LOG);
        console.info("Overlay work with: Beat Saber, Synth Riders, Audio Trip and Audica !");
        console.info("Plugins: BeatSaberPlus, DataPuller, HttpSiraStatus, SynthRiders-Websocket-Integration, ATS-types, Audica-Websocket-Server", "\n\n(for more information, see \"globals.ts\" or Readme.md on https://github.com/HyldraZolxy/BeatSaber-Overlay#readme)");

        this._parameters    = Parameters.Instance;
        this._ui            = new UI();
        this._plugins       = Plugins.Instance;
        this._setup         = new Setup();

        (async () => {
            await this.appInit();
            this._ui.refreshUI();

            // Try to catch the performance of the internet connection (for the Setup panel)
            window.timeStamp = window.timeStamp + performance.now();
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
        await this._plugins.connection();
    }
}

new Init();