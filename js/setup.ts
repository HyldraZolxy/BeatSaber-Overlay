import { GlobalVariable } from "./global.js";
import { Template } from "./template.js";
import { PlayerCard } from "./playerCard.js";
import { SongCard } from "./songCard.js";
import { Plugins } from "./plugins.js";
import { Parameters } from "./parameters.js";

export class Setup {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _template:  Template;
    private _playerCard: PlayerCard;
    private _songCard: SongCard;
    private _plugins: Plugins;
    private _parameters: Parameters;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private isDisplayed = false;

    ////////////////////////
    // PROTECTED VARIABLE //
    ////////////////////////
    protected skinUrl: string = "./skins/setup/";

    constructor() {
        this._template = new Template();
        this._playerCard = PlayerCard.Instance;
        this._songCard = SongCard.Instance;
        this._plugins = Plugins.Instance;
        this._parameters = Parameters.Instance;

        $("body").on("dblclick", () => {
            (async () => {
                if (!this.isDisplayed) {
                    await this.loadSkin(GlobalVariable.SKIN_SETUP[0], "setup");

                    this._playerCard.playerCardParameters.display = true;
                    this._songCard.songCardParameters.started = true;
                    this._songCard.songCardParameters.inProgress = true;

                    setTimeout(() => {
                        this.isDisplayed = true;
                        this.setupAction();
                    }, 1000);
                }
            })();
        });
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private async loadSkin(skin: string, file: string) {
        const skinPath = this.skinUrl + skin + "/";
        if (file in GlobalVariable.SkinFilesSetup) {
            for (const entries of Object.entries(GlobalVariable.SkinFilesSetup)) {
                const [key, value] = entries;

                if (key === file) {
                    await this._template.loadFile(skinPath, value, "setup");
                }
            }
        }
    }

    private setupAction() {
        $("#closeButton").on("click",() => {
            if (this.isDisplayed) {
                this._playerCard.playerCardParameters.display = false;
                this._songCard.songCardParameters.started = false;
                this._songCard.songCardParameters.inProgress = false;

                (async () => {
                    this.isDisplayed = false;
                    $("#setup").empty();
                    await this.loadSkin(GlobalVariable.SKIN_SETUP[0], "empty");
                })();
            }
        });

        $("#ipChanger").on("click", () => {
            let ipValue = $("#ip").val();
            if ((ipValue !== undefined) && (typeof ipValue === "string")) {
                if (this._parameters.parseParameters("ip", ipValue)) {
                    this._plugins.pluginsParameters.ip = ipValue;
                    this.urlTextBuilder();
                }
            }
        });

        $("#playerIdChanger").on("click", () => {
            let playerIdValue = $("#playerId").val();
            if ((playerIdValue !== undefined) && (typeof playerIdValue === "string")) {
                if (RegExp(/\bhttps:\/\/scoresaber.com\/u\/\b/).test(playerIdValue)) {
                    playerIdValue = playerIdValue.slice(25);
                    playerIdValue = playerIdValue.split("?")[0];
                }

                if (this._parameters.parseParameters("pid", playerIdValue)) {
                    this._playerCard.playerCardParameters.playerId = playerIdValue;
                    this._playerCard.playerCardParameters.needUpdate = true;
                    this._songCard.songCardParameters.finished = true;

                    this.urlTextBuilder();
                }
            }
        });

        $("#playerCardPosition").on("change", () => {
            let playerCardPositionValue = $("#playerCardPosition").val();
            if ((playerCardPositionValue !== undefined) && (typeof playerCardPositionValue === "string")) {
                if (this._parameters.parseParameters("pcpos", playerCardPositionValue)) {
                    switch(playerCardPositionValue) {
                        case "top-left":
                            this._playerCard.playerCardParameters.position = GlobalVariable.DISPLAY_POSITION[0];
                            break;
                        case "top-right":
                            this._playerCard.playerCardParameters.position = GlobalVariable.DISPLAY_POSITION[1];
                            break;
                        case "bottom-left":
                            this._playerCard.playerCardParameters.position = GlobalVariable.DISPLAY_POSITION[2];
                            break;
                        case "bottom-right":
                            this._playerCard.playerCardParameters.position = GlobalVariable.DISPLAY_POSITION[3];
                            break;
                    }
                    this.urlTextBuilder();
                }
            }
        });

        $("#playerCardScale").on("input", () => {
            let playerCardScaleValue = $("#playerCardScale").val();
            if ((playerCardScaleValue !== undefined) && (typeof playerCardScaleValue === "string")) {
                if (this._parameters.parseParameters("pcsc", playerCardScaleValue)) {
                    this._playerCard.playerCardParameters.scale = +(playerCardScaleValue);
                    this.urlTextBuilder();
                }
            }
        });

        $("#songCardSkin").on("change", () => {
            let songCardSkinValue = $("#songCardSkin").val();
            if ((songCardSkinValue !== undefined) && (typeof songCardSkinValue === "string")) {
                if (this._parameters.parseParameters("scsk", songCardSkinValue)) {
                    switch(songCardSkinValue) {
                        case "default":
                            this._songCard.songCardParameters.skin = GlobalVariable.SKIN_SONG_CARD[0];
                            break;
                        case "freemium":
                            this._songCard.songCardParameters.skin = GlobalVariable.SKIN_SONG_CARD[1];
                            break;
                    }

                    (async () => {
                        $("#songCard").removeClass();
                        await this._songCard.loadSkin(this._songCard.songCardParameters.skin);
                        this.urlTextBuilder();
                    })();
                }
            }
        });

        $("#songCardPosition").on("change", () => {
            let songCardPositionValue = $("#songCardPosition").val();
            if ((songCardPositionValue !== undefined) && (typeof songCardPositionValue === "string")) {
                if (this._parameters.parseParameters("scpos", songCardPositionValue)) {
                    switch(songCardPositionValue) {
                        case "top-left":
                            this._songCard.songCardParameters.position = GlobalVariable.DISPLAY_POSITION[0];
                            break;
                        case "top-right":
                            this._songCard.songCardParameters.position = GlobalVariable.DISPLAY_POSITION[1];
                            break;
                        case "bottom-left":
                            this._songCard.songCardParameters.position = GlobalVariable.DISPLAY_POSITION[2];
                            break;
                        case "bottom-right":
                            this._songCard.songCardParameters.position = GlobalVariable.DISPLAY_POSITION[3];
                            break;
                    }
                    this.urlTextBuilder();
                }
            }
        });

        $("#songCardScale").on("input", () => {
            let songCardScaleValue = $("#songCardScale").val();
            if ((songCardScaleValue !== undefined) && (typeof songCardScaleValue === "string")) {
                if (this._parameters.parseParameters("scsc", songCardScaleValue)) {
                    this._songCard.songCardParameters.scale = +(songCardScaleValue);
                    this.urlTextBuilder();
                }
            }
        });
    }

    private urlTextBuilder() {
        let url = "https://testoverlay.hyldrazolxy.fr/";
        let parameters = [];
        let firstParameter = true;
        let toggled = true;

        if (this._plugins.pluginsParameters.ip !== "127.0.0.1") {
            parameters.push("ip", this._plugins.pluginsParameters.ip);
        }

        if (this._playerCard.playerCardParameters.playerId !== "0") {
            parameters.push("pid", this._playerCard.playerCardParameters.playerId);
        }

        if (this._playerCard.playerCardParameters.position !== GlobalVariable.DISPLAY_POSITION[0]) {
            parameters.push("pcpos", this._playerCard.playerCardParameters.position);
        }

        if (this._playerCard.playerCardParameters.scale !== 1) {
            parameters.push("pcsc", this._playerCard.playerCardParameters.scale);
        }

        if (this._songCard.songCardParameters.skin !== GlobalVariable.SKIN_SONG_CARD[0]) {
            parameters.push("scsk", this._songCard.songCardParameters.skin);
        }

        if (this._songCard.songCardParameters.position !== GlobalVariable.DISPLAY_POSITION[0]) {
            parameters.push("scpos", this._songCard.songCardParameters.position);
        }

        if (this._songCard.songCardParameters.scale !== 1) {
            parameters.push("scsc", this._songCard.songCardParameters.scale);
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

        $("#urlText").text(url);
    }
}