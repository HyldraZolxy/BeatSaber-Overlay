import { Globals }      from "./globals";
import { Tools }        from "./tools";
import { Template }     from "./template";
import { Parameters }   from "./parameters";
import { PlayerCard }   from "./playerCard";
import { SongCard }     from "./songCard";
import { Plugins }      from "./plugins";

export class Setup {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools:         Tools;
    private _template:      Template;
    private _parameters:    Parameters;
    private _playerCard:    PlayerCard;
    private _songCard:      SongCard;
    private _plugins:       Plugins;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private skinSettings    = "default";
    private isDisplayed     = false;
    private isPlayerChecked = false;
    private isSongChecked   = false;
    private elements:       Map<string, JQuery>;

    constructor() {
        this._tools         = new Tools();
        this._template      = new Template();
        this._parameters    = Parameters.Instance;
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
        this._plugins       = Plugins.Instance;
        this.elements       = new Map();

        $("#setupButton").on("click", async () => {
            if (!this.isDisplayed) {
                this.isDisplayed = true;

                this._template.hideSetup(false);
                await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings);
                await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings);

                await (async () => {
                    this.setupAction();
                })();
            }
        });
    }

    /////////////////////
    // Private Methods //
    /////////////////////

    private elementsBuilder() {
        this.elements.set("optionsSetup", $("options-setup"));
        this.elements.set("menuSetup", $("menu-setup"));

        this.elements.set("closeButton", $(".closeButton"));

        this.elements.set("generalSettings", $(".generalSettings"));
        this.elements.set("gamesAndPlugins", $(".gamesAndPlugins"));
        this.elements.set("playerSettings", $(".playerSettings"));
        this.elements.set("songSettings", $(".songSettings"));

        this.elements.set("setupURL", $("#setupURL"));
        this.elements.set("Urldescription", $("#Urldescription"));

        this.elements.set("ipChanger", $("#ipChanger"));
        this.elements.set("ip", $("#ip"));

        this.elements.set("switchBeatSaber", $("#switchBeatSaber"));
        this.elements.set("switchSynthRiders", $("#switchSynthRiders"));
        this.elements.set("switchAudioTrip", $("#switchAudioTrip"));
        this.elements.set("switchAudica", $("#switchAudica"));
        this.elements.set("checkBsPlus", $("#checkBsPlus"));
        this.elements.set("checkBsPlusMp", $("#checkBsPlusMp"));
        this.elements.set("checkDatapuller", $("#checkDatapuller"));
        this.elements.set("checkHttpSiraStatus", $("#checkHttpSiraStatus"));

        this.elements.set("switchPlayerPreview", $("#switchPlayerPreview"));
        this.elements.set("switchSongPreview", $("#switchSongPreview"));

        this.elements.set("playerIdChanger", $("#playerIdChanger"));
        this.elements.set("playerId", $("#playerId"));
        this.elements.set("playerCardPosition", $("#playerCardPosition"));
        this.elements.set("playerCardScale", $("#playerCardScale"));

        this.elements.set("songCardSkin", $("#songCardSkin"));
        this.elements.set("songCardPosition", $("#songCardPosition"));
        this.elements.set("songCardScale", $("#songCardScale"));
    }

    private setupAction() {
        this.elementsBuilder();
        this.fillParameters();
        this.menuAction();

        this.elements.get("closeButton")?.on("click",() => {
            if (this.isDisplayed) {
                this.isDisplayed = false;

                this._template.hideSetup(true);
                this.elements.get("optionsSetup")?.empty();
                this.elements.get("menuSetup")?.empty();
                this._template.makeElementActive();

                (async () => {
                    this.setupAction();
                })();
            }
        });

        this.elements.get("setupURL")?.on("click", async () => {
            await this.urlTextBuilder();
            let value = this.elements.get("Urldescription")?.data("clipboardtext");
            await navigator.clipboard.writeText(value);
        });

        this.elements.get("ipChanger")?.on("click", () => {
            let ipValue = this.elements.get("ip")?.val();

            if ((ipValue !== undefined) && (typeof ipValue === "string")) {
                if (this._parameters.parseParameters("ip", ipValue)) {
                    this._parameters.uriParams.ip = ipValue;

                    this._plugins.removeConnection();

                    setTimeout(() => this._plugins.connection(), Globals.MS_TIMER);
                }
            }
        });

        this.elements.get("switchPlayerPreview")?.on("click", async () => {
            if (this.elements.get("switchPlayerPreview")?.prop("checked") === true) {
                if (this._playerCard.playerCardData.playerID === "0") {
                    this.elements.get("switchPlayerPreview")?.prop("checked", false);
                    this.isPlayerChecked = false;
                }
                else {
                    this._playerCard.playerCardData.disabled = false;
                    await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
                    this._playerCard.playerCardData.display = true;
                    this.isPlayerChecked = true;
                }
            } else {
                this._playerCard.playerCardData.disabled = true;
                this._playerCard.playerCardData.display = false;
                this.isPlayerChecked = false;
            }
        });

        this.elements.get("switchSongPreview")?.on("click", async () => {
            if (this.elements.get("switchSongPreview")?.prop("checked") === true) {
                await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
                this._songCard.songCardData.started = true;
                this.isSongChecked = true;
            } else {
                this._songCard.songCardData.started = false;
                this.isSongChecked = false;
            }
        });

        this.elements.get("playerIdChanger")?.on("click", () => {
            let playerIdValue = this.elements.get("playerId")?.val();

            if ((playerIdValue !== undefined) && (typeof playerIdValue === "string")) {
                if (RegExp(/\bhttps:\/\/scoresaber.com\/u\/\b/).test(playerIdValue)) {
                    playerIdValue = playerIdValue.replace("https://scoresaber.com/u/", "");
                }

                if (this._parameters.parseParameters("pc_playerID", playerIdValue)) {
                    this._playerCard.playerCardData.playerID = playerIdValue;
                    this._playerCard.playerCardData.needUpdate = true;
                }
            }
        });

        this.elements.get("playerCardPosition")?.on("change", () => {
            let playerCardPositionValue = this.elements.get("playerCardPosition")?.val();

            if ((playerCardPositionValue !== undefined) && (typeof playerCardPositionValue === "string")) {
                if (this._parameters.parseParameters("pc_position", this._tools.positionNumberConverter(playerCardPositionValue))) {
                    this._playerCard.playerCardData.position = this._tools.positionNumberConverter(playerCardPositionValue);
                }
            }
        });

        this.elements.get("playerCardScale")?.on("input", () => {
            let playerCardScaleValue = this.elements.get("playerCardScale")?.val();

            if ((playerCardScaleValue !== undefined) && (typeof playerCardScaleValue === "string")) {
                if (this._parameters.parseParameters("pc_scale", playerCardScaleValue)) {
                    this._playerCard.playerCardData.scale = +(playerCardScaleValue);
                }
            }
        });

        this.elements.get("songCardSkin")?.on("change", async () => {
            let songCardSkinValue = this.elements.get("songCardSkin")?.val();

            if ((songCardSkinValue !== undefined) && (typeof songCardSkinValue === "string")) {
                if (this._parameters.parseParameters("sc_skin", songCardSkinValue)) {
                    this._songCard.songCardData.skin = songCardSkinValue;

                    await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
                }
            }
        });

        this.elements.get("songCardPosition")?.on("change", () => {
            let songCardPositionValue = this.elements.get("songCardPosition")?.val();

            if ((songCardPositionValue !== undefined) && (typeof songCardPositionValue === "string")) {
                if (this._parameters.parseParameters("sc_position", this._tools.positionNumberConverter(songCardPositionValue))) {
                    this._songCard.songCardData.position = this._tools.positionNumberConverter(songCardPositionValue);
                }
            }
        });

        this.elements.get("songCardScale")?.on("input", () => {
            let songCardScaleValue = this.elements.get("songCardScale")?.val();

            if ((songCardScaleValue !== undefined) && (typeof songCardScaleValue === "string")) {
                if (this._parameters.parseParameters("sc_scale", songCardScaleValue)) {
                    this._songCard.songCardData.scale = +(songCardScaleValue);
                }
            }
        });
    }

    private menuAction() {
        this.elements.get("generalSettings")?.on("click", async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("generalSettings")?.hasClass("active")) {
                    await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "generalMenu.html");

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "generalOptions.html");

                    await (async () => {
                        this.setupAction();
                        this._template.makeElementActive(this.elements.get("generalSettings"));
                    })();
                }
            }
        });

        this.elements.get("gamesAndPlugins")?.on("click",async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("gamesAndPlugins")?.hasClass("active")) {
                    await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "gamesAndPluginsMenu.html");

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "gamesAndPluginsOptions.html");

                    await (async () => {
                        this.setupAction();
                        this._template.makeElementActive(this.elements.get("gamesAndPlugins"));
                    })();
                }
            }
        });

        this.elements.get("playerSettings")?.on("click",async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("playerSettings")?.hasClass("active")) {
                    this._template.makeElementActive($(".playerSettings"));
                    this._template.makeHidden(true);

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "playerCard.html");
                    this._template.makeHidden(false);

                    await (async () => {
                        this.setupAction();
                        this.elements.get("switchPlayerPreview")?.prop("checked", this.isPlayerChecked);
                    })();
                }
            }
        });

        this.elements.get("songSettings")?.on("click",async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("songSettings")?.hasClass("active")) {
                    this._template.makeElementActive($(".songSettings"));
                    this._template.makeHidden(true);

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "songCard.html");
                    this._template.makeHidden(false);

                    await (async () => {
                        this.setupAction();
                        this.elements.get("switchSongPreview")?.prop("checked", this.isSongChecked);
                    })();
                }
            }
        });
    }

    private fillParameters() {
        this.elements.get("ip")?.attr("placeholder", this._parameters.uriParams.ip);

        this.elements.get("switchBeatSaber")?.prop("checked", this._parameters.uriParams.g_beatSaber);
        this.elements.get("switchSynthRiders")?.prop("checked", this._parameters.uriParams.g_synthRiders);
        this.elements.get("switchAudioTrip")?.prop("checked", this._parameters.uriParams.g_audioTrip);
        this.elements.get("switchAudica")?.prop("checked", this._parameters.uriParams.g_audica);
        this.elements.get("checkBsPlus")?.prop("checked", this._parameters.uriParams.p_beatSaberPlus);
        this.elements.get("checkBsPlusMp")?.prop("checked", this._parameters.uriParams.p_beatSaberPlusLeaderboard);
        this.elements.get("checkDatapuller")?.prop("checked", this._parameters.uriParams.p_dataPuller);
        this.elements.get("checkHttpSiraStatus")?.prop("checked", this._parameters.uriParams.p_httpSiraStatus);
    }

    private async urlTextBuilder() {
        let url = "https://overlay.hyldrazolxy.fr/";
        let parameters = [];
        let firstParameter = true;
        let toggled = true;

        if (this._parameters.uriParams.ip !== "localhost") {
            parameters.push("ip", this._parameters.uriParams.ip);
        }

        if (this._playerCard.playerCardData.playerID !== "0") {
            parameters.push("pid", this._playerCard.playerCardData.playerID);
        }

        if (this._playerCard.playerCardData.position !== Globals.E_POSITION.TOP_RIGHT) {
            parameters.push("pc_position", this._playerCard.playerCardData.position);
        }

        if (this._playerCard.playerCardData.scale !== 1) {
            parameters.push("pc_scale", this._playerCard.playerCardData.scale);
        }

        if (this._songCard.songCardData.skin !== "default") {
            parameters.push("sc_skin", this._songCard.songCardData.skin);
        }

        if (this._songCard.songCardData.position !== Globals.E_POSITION.BOTTOM_LEFT) {
            parameters.push("sc_position", this._songCard.songCardData.position);
        }

        if (this._songCard.songCardData.scale !== 1) {
            parameters.push("sc_scale", this._songCard.songCardData.scale);
        }

        for (let i = 0; i < parameters.length; i++) {
            if (firstParameter) {
                firstParameter = false;
                url = url + "?" + parameters[i];

                if (parameters[i] === "ip") {
                    url = url.replace("https", "http");
                }
            } else {
                if (toggled) {
                    toggled = false;
                    url = url + "=" + parameters[i];
                } else {
                    toggled = true;
                    url = url + "&" + parameters[i];

                    if (parameters[i] === "ip") {
                        url = url.replace("https", "http");
                    }
                }
            }
        }

        $("#Urldescription").data("clipboardtext", url);
    }
}
