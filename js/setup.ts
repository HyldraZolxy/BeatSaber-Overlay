import { Globals } from "./global.js";
import { Template } from "./template.js";
import { Parameters } from "./parameters.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { Plugins } from "./plugins.js";

export class Setup {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _template:  Template;
    private _parameters: Parameters;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _plugins: Plugins;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isDisplayed = false;
    private isPlayerChecked = false;
    private isSongChecked = false;

    constructor() {
        this._template = new Template();
        this._parameters = Parameters.Instance;
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._plugins = Plugins.Instance;

        $("#setupButton").on("click", async () => {
            if (!this.isDisplayed) {
                this.isDisplayed = true;

                this._template.setupHide(false);
                await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.INDEX]);

                setTimeout(() => {
                    this.setupAction();
                }, Globals.MS_TIMER);
            }
        });
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private async loadSkin(skinName: string, fileName: string): Promise<void> {
        if (skinName !== undefined && fileName !== undefined)
            await this._template.loadSkin(Globals.E_MODULES.SETUP, skinName, fileName);
    }

    private setupAction() {
        $(".closeButton").on("click",() => {
            if (this.isDisplayed) {
                this.isDisplayed = false;

                this._template.setupHide(true);
                $("#setup").empty();
                this._template.makeActive();

                setTimeout(() => {
                    this.setupAction();
                }, Globals.MS_TIMER);
            }
        });

        $(".generalSettings").on("click",async () => {
            if (this.isDisplayed) {
                if (!$(".generalSettings").hasClass("active")) {
                    this._template.makeActive($(".generalSettings"));
                    this._template.makeHidden(true);

                    setTimeout(async () => {
                        $("#setup").empty();
                        await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.GENERAL]);
                        this._template.makeHidden(false);

                        setTimeout(() => {
                            this.setupAction();
                        }, Globals.MS_TIMER);
                    }, 300);
                }
            }
        });

        $(".playerSettings").on("click",async () => {
            if (this.isDisplayed) {
                if (!$(".playerSettings").hasClass("active")) {
                    this._template.makeActive($(".playerSettings"));
                    this._template.makeHidden(true);

                    setTimeout(async () => {
                        $("#setup").empty();
                        await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.PLAYER]);
                        this._template.makeHidden(false);

                        setTimeout(() => {
                            this.setupAction();
                            $("#switchPlayerPreview").prop("checked", this.isPlayerChecked);
                        }, Globals.MS_TIMER);
                    }, 300);
                }
            }
        });

        $(".songSettings").on("click",async () => {
            if (this.isDisplayed) {
                if (!$(".songSettings").hasClass("active")) {
                    this._template.makeActive($(".songSettings"));
                    this._template.makeHidden(true);

                    setTimeout(async () => {
                        $("#setup").empty();
                        await this.loadSkin("default", Globals.SKIN_AVAILABLE.setup.default[Globals.E_SETUP_FILES.SONG]);
                        this._template.makeHidden(false);

                        setTimeout(() => {
                            this.setupAction();
                            $("#switchSongPreview").prop("checked", this.isSongChecked);
                        }, Globals.MS_TIMER);
                    }, 300);
                }
            }
        });

        $("#setupURL").on("click", async () => {
            await this.urlTextBuilder();
            let value = $("#Urldescription").data("clipboardtext");
            navigator.clipboard.writeText(value);
        });

        $("#ipChanger").on("click", () => {
            let ipValue = $("#ip").val();

            if ((ipValue !== undefined) && (typeof ipValue === "string")) {
                if (this._parameters.parseParameters("ip", ipValue)) {
                    this._parameters._uriParams.ip = ipValue;
                }
            }
        });

        $("#switchPlayerPreview").on("click", async () => {
            if ($("#switchPlayerPreview").prop("checked") === true) {
                if (this._playerCard.playerCardData.playerId === "0") {
                    $("#switchPlayerPreview").prop("checked", false);
                    this.isPlayerChecked = false;
                }
                else {
                    if (this._plugins.IsConnected !== Globals.E_WEBSOCKET_STATES.CONNECTED) {
                        this._playerCard.playerCardData.disabled = false;
                        await this._playerCard.loadSkin(this._playerCard.playerCardData.skin);
                        this._playerCard.playerCardData.display = true;
                        this.isPlayerChecked = true;
                    }
                }
            } else {
                if (this._plugins.IsConnected !== Globals.E_WEBSOCKET_STATES.CONNECTED) {
                    this._playerCard.playerCardData.disabled = true;
                    this._playerCard.playerCardData.display = false;
                    this.isPlayerChecked = false;
                }
            }
        });

        $("#switchSongPreview").on("click", async () => {
            if ($("#switchSongPreview").prop("checked") === true) {
                if (this._plugins.IsConnected !== Globals.E_WEBSOCKET_STATES.CONNECTED) {
                    await this._songCard.loadSkin(this._songCard.songCardData.skin);
                    this._songCard.songCardData.started = true;
                    this.isSongChecked = true;
                }
            } else {
                if (this._plugins.IsConnected !== Globals.E_WEBSOCKET_STATES.CONNECTED) {
                    this._songCard.songCardData.started = false;
                    this.isSongChecked = false;
                }
            }
        });

        $("#playerIdChanger").on("click", () => {
            let playerIdValue = $("#playerId").val();

            if ((playerIdValue !== undefined) && (typeof playerIdValue === "string")) {
                if (RegExp(/\bhttps:\/\/scoresaber.com\/u\/\b/).test(playerIdValue)) {
                    playerIdValue = playerIdValue.replace("https://scoresaber.com/u/", "");
                }

                if (this._parameters.parseParameters("pid", playerIdValue)) {
                    this._playerCard.playerCardData.playerId = playerIdValue;
                    this._playerCard.playerCardData.needUpdate = true;
                }
            }
        });

        $("#playerCardPosition").on("change", () => {
            let playerCardPositionValue = $("#playerCardPosition").val();

            if ((playerCardPositionValue !== undefined) && (typeof playerCardPositionValue === "string")) {
                if (this._parameters.parseParameters("pcpos", playerCardPositionValue)) {
                    this._playerCard.playerCardData.position = playerCardPositionValue;
                }
            }
        });

        $("#playerCardScale").on("input", () => {
            let playerCardScaleValue = $("#playerCardScale").val();

            if ((playerCardScaleValue !== undefined) && (typeof playerCardScaleValue === "string")) {
                if (this._parameters.parseParameters("pcsc", playerCardScaleValue)) {
                    this._playerCard.playerCardData.scale = +(playerCardScaleValue);
                }
            }
        });

        $("#songCardSkin").on("change", async () => {
            let songCardSkinValue = $("#songCardSkin").val();

            if ((songCardSkinValue !== undefined) && (typeof songCardSkinValue === "string")) {
                if (this._parameters.parseParameters("scsk", songCardSkinValue)) {
                    this._songCard.songCardData.skin = songCardSkinValue;

                    await this._songCard.loadSkin(this._songCard.songCardData.skin);
                }
            }
        });

        $("#songCardPosition").on("change", () => {
            let songCardPositionValue = $("#songCardPosition").val();

            if ((songCardPositionValue !== undefined) && (typeof songCardPositionValue === "string")) {
                if (this._parameters.parseParameters("scpos", songCardPositionValue)) {
                    this._songCard.songCardData.position = songCardPositionValue;
                }
            }
        });

        $("#songCardScale").on("input", () => {
            let songCardScaleValue = $("#songCardScale").val();

            if ((songCardScaleValue !== undefined) && (typeof songCardScaleValue === "string")) {
                if (this._parameters.parseParameters("scsc", songCardScaleValue)) {
                    this._songCard.songCardData.scale = +(songCardScaleValue);
                }
            }
        });
    }

    private async urlTextBuilder() {
        let url = "https://overlay.hyldrazolxy.fr/";
        let parameters = [];
        let firstParameter = true;
        let toggled = true;

        if (this._parameters._uriParams.ip !== "localhost") {
            parameters.push("ip", this._parameters._uriParams.ip);
        }

        if (this._playerCard.playerCardData.playerId !== "0") {
            parameters.push("pid", this._playerCard.playerCardData.playerId);
        }

        if (this._playerCard.playerCardData.position !== "top-right") {
            parameters.push("pcpos", this._playerCard.playerCardData.position);
        }

        if (this._playerCard.playerCardData.scale !== 1) {
            parameters.push("pcsc", this._playerCard.playerCardData.scale);
        }

        if (this._songCard.songCardData.skin !== "default") {
            parameters.push("scsk", this._songCard.songCardData.skin);
        }

        if (this._songCard.songCardData.position !== "bottom-left") {
            parameters.push("scpos", this._songCard.songCardData.position);
        }

        if (this._songCard.songCardData.scale !== 1) {
            parameters.push("scsc", this._songCard.songCardData.scale);
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