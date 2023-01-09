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
                await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP,  this.skinSettings);

                await (async () => {
                    this.setupAction();
                })();
            }
        });
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private setupAction() {
        this.elementsBuilder();
        this.fillParameters();
        this.menuAction();
        this.elementsOffEvent();
        this.elementsOnEvent();
    }

    private menuAction() {
        this.elements.get("closeButton")?.on("click", async () => {
            if (this.isDisplayed) {
                this.isDisplayed = false;

                this._template.hideSetup(true);
                this.elements.get("optionsSetup")?.empty();
                this.elements.get("menuSetup")?.empty();
                this._template.makeElementActive();
            }
        });

        this.elements.get("returnButton")?.on("click", async () => {
            if (this.isDisplayed) {
                this.elements.get("menuSetup")?.empty();
                await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "indexMenu.html");

                this.elements.get("optionsSetup")?.empty();
                await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "indexOptions.html");

                await (async () => {
                    console.log("3");
                    this.setupAction();
                    this._template.makeElementActive();
                })();
            }
        });

        this.elements.get("generalSettings")?.on("click", async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("generalSettings")?.hasClass("active")) {
                    this.elements.get("menuSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "indexMenu.html");

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "generalOptions.html");

                    await (async () => {
                        this.setupAction();
                        this._template.makeElementActive(this.elements.get("generalSettings"));
                    })();
                }
            }
        });

        this.elements.get("gamesAndPluginsSettings")?.on("click", async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("gamesAndPluginsSettings")?.hasClass("active")) {
                    this.elements.get("menuSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "indexMenu.html");

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "gamesAndPluginsOptions.html");

                    await (async () => {
                        this.setupAction();
                        this._template.makeElementActive(this.elements.get("gamesAndPluginsSettings"));
                    })();
                }
            }
        });

        this.elements.get("overlaySettings")?.on("click", async () => {
            if (this.isDisplayed) {
                if (!this.elements.get("overlaySettings")?.hasClass("active")) {
                    this.elements.get("menuSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

                    this.elements.get("optionsSetup")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "overlayOptions.html");

                    await (async () => {
                        this.setupAction();
                        this._template.makeElementActive(this.elements.get("overlaySettings"));
                    })();
                }
            }
        });

        if (!this._parameters.uriParams.pc_disabled) {
            this.elements.get("playerSettings")?.removeClass("disabled");

            this.elements.get("playerSettings")?.on("click", async () => {
                if (this.isDisplayed) {
                    if (!this.elements.get("playerSettings")?.hasClass("active")) {
                        this.elements.get("menuSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

                        this.elements.get("optionsSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "playerCardOptions.html");

                        await (async () => {
                            this.setupAction();
                            this._template.makeElementActive(this.elements.get("playerSettings"));
                        })();
                    }
                }
            });
        } else {
            this.elements.get("playerSettings")?.addClass("disabled");
        }

        if (!this._parameters.uriParams.sc_disabled) {
            this.elements.get("songSettings")?.removeClass("disabled");

            this.elements.get("songSettings")?.on("click", async () => {
                if (this.isDisplayed) {
                    if (!this.elements.get("songSettings")?.hasClass("active")) {
                        this.elements.get("menuSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

                        this.elements.get("optionsSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "songCardOptions.html");

                        await (async () => {
                            this.setupAction();
                            this._template.makeElementActive(this.elements.get("songSettings"));
                        })();
                    }
                }
            });
        } else {
            this.elements.get("songSettings")?.addClass("disabled");
        }

        /*if (!this._parameters.uriParams.ld_disabled) {
            this.elements.get("leaderboardSettings")?.removeClass("disabled");

            this.elements.get("leaderboardSettings")?.on("click", async () => {
                if (this.isDisplayed) {
                    if (!this.elements.get("leaderboardSettings")?.hasClass("active")) {
                        this.elements.get("menuSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

                        this.elements.get("optionsSetup")?.empty();
                        await this._template.loadSkin(Globals.E_MODULES.OPT_SETUP, this.skinSettings, "leaderboardOptions.html");

                        await (async () => {
                            this.setupAction();
                            this._template.makeElementActive(this.elements.get("leaderboardSettings"));
                        })();
                    }
                }
            });
        } else {
            this.elements.get("leaderboardSettings")?.addClass("disabled");
        }*/
    }

    private elementsBuilder() {
        // Global Overlay
        /*--------------------------------------------------------------------------------------------------------------*/
        // Global filled elements
        this.elements.set("playerCard-overlay",   $("#playerCard-overlay"));
        this.elements.set("songCard-overlay",   $("#songCard-overlay"));
        /*this.elements.set("leaderboard-overlay",   $("#leaderboard-overlay"));*/
        /*--------------------------------------------------------------------------------------------------------------*/

        // Globals Setup
        /*--------------------------------------------------------------------------------------------------------------*/
        // Global filled elements
        this.elements.set("optionsSetup",   $("#options-setup"));
        this.elements.set("menuSetup",      $("#menu-setup"));
        /*--------------------------------------------------------------------------------------------------------------*/

        // Menu Setup
        /*--------------------------------------------------------------------------------------------------------------*/
        // Close and return button of the setup
        this.elements.set("closeButton",    $(".closeButton"));
        this.elements.set("returnButton",   $(".returnButton"));

        // Menu
        this.elements.set("generalSettings",            $(".generalSettings"));
        this.elements.set("gamesAndPluginsSettings",    $(".gamesAndPluginsSettings"));
        this.elements.set("overlaySettings",            $(".overlaySettings"));
        this.elements.set("playerSettings",             $(".playerSettings"));
        this.elements.set("songSettings",               $(".songSettings"));
        /*this.elements.set("leaderboardSettings",        $(".leaderboardSettings"));*/

        // Other menu button
        this.elements.set("customURITypeScript", $("#customURITypeScript"));
        /*--------------------------------------------------------------------------------------------------------------*/

        // Options Setup
        /*--------------------------------------------------------------------------------------------------------------*/
        // General Settings
        /*==========================================================================================*/
        this.elements.set("ip",                 $("#ip"));
        this.elements.set("ipChanger",          $("#ipChanger"));
        this.elements.set("ScoringSystemSS",    $("#ScoringSystemSS"));
        this.elements.set("ScoringSystemBL",    $("#ScoringSystemBL"));
        /*==========================================================================================*/

        // Games and Plugins Settings
        /*==========================================================================================*/
        this.elements.set("switchBeatSaber",        $("#switchBeatSaber"));
        this.elements.set("checkBsPlus",            $("#checkBsPlus"));
        this.elements.set("checkBsPlusMp",          $("#checkBsPlusMp"));
        this.elements.set("checkDatapuller",        $("#checkDatapuller"));
        this.elements.set("checkHttpSiraStatus",    $("#checkHttpSiraStatus"));
        this.elements.set("switchSynthRiders",      $("#switchSynthRiders"));
        this.elements.set("switchAudioTrip",        $("#switchAudioTrip"));
        this.elements.set("switchAudica",           $("#switchAudica"));
        /*==========================================================================================*/

        // Overlay Settings
        /*==========================================================================================*/

        // General Settings
        /******************************************************************************/
        this.elements.set("playerCardSwitch",   $("#playerCardSwitch"));
        this.elements.set("songCardSwitch",     $("#songCardSwitch"));
        /*this.elements.set("leaderboardSwitch",  $("#leaderboardSwitch"));*/
        /******************************************************************************/

        // Player Card Settings
        /******************************************************************************/
        this.elements.set("switchPlayerCardPreview",    $("#switchPlayerCardPreview"));
        this.elements.set("playerId",                   $("#playerId"));
        this.elements.set("playerIdChanger",            $("#playerIdChanger"));
        this.elements.set("playerCardSkin",             $("#playerCardSkin"));
        this.elements.set("playerCardPosition",         $("#playerCardPosition"));
        this.elements.set("playerCardPosX",             $("#playerCardPosX"));
        this.elements.set("playerCardPosY",             $("#playerCardPosY"));
        this.elements.set("playerCardScale",            $("#playerCardScale"));
        /******************************************************************************/

        // Song Card Settings
        /******************************************************************************/
        this.elements.set("switchSongCardPreview",  $("#switchSongCardPreview"));
        this.elements.set("songCardSkin",           $("#songCardSkin"));
        this.elements.set("songCardPosition",       $("#songCardPosition"));
        this.elements.set("songCardPosX",           $("#songCardPosX"));
        this.elements.set("songCardPosY",           $("#songCardPosY"));
        this.elements.set("songCardScale",          $("#songCardScale"));
        this.elements.set("missDisplay",            $("#missDisplay"));
        this.elements.set("bigBSR",                 $("#bigBSR"));
        /*this.elements.set("ppMax",                $("#ppMax"));
        this.elements.set("ppEstimated",            $("#ppEstimated"));*/
        /******************************************************************************/

        // Leaderboard Settings
        /******************************************************************************/
        /*this.elements.set("switchLeaderboardPreview",   $("#switchLeaderboardPreview"));
        this.elements.set("leaderboardPosition",        $("#leaderboardPosition"));
        this.elements.set("leaderboardPosX",            $("#leaderboardPosX"));
        this.elements.set("leaderboardPosY",            $("#leaderboardPosY"));
        this.elements.set("leaderboardScale",           $("#leaderboardScale"));*/
        /******************************************************************************/
        /*==========================================================================================*/
        /*--------------------------------------------------------------------------------------------------------------*/
    }

    private fillParameters() {
        // Options Setup
        /*--------------------------------------------------------------------------------------------------------------*/
        // General Settings
        /*==========================================================================================*/
        this.elements.get("ip")?.               attr("placeholder", this._parameters.uriParams.ip);
        this.elements.get("ScoringSystemSS")?.  prop("checked",     (this._parameters.uriParams.scoringSystem === 1));
        this.elements.get("ScoringSystemBL")?.  prop("checked",     (this._parameters.uriParams.scoringSystem === 2));
        /*==========================================================================================*/

        // Games and Plugins Settings
        /*==========================================================================================*/
        this.elements.get("switchBeatSaber")?.      prop("checked", this._parameters.uriParams.g_beatSaber);
        this.elements.get("checkBsPlus")?.          prop("checked", this._parameters.uriParams.p_beatSaberPlus);
        this.elements.get("checkBsPlusMp")?.        prop("checked", this._parameters.uriParams.p_beatSaberPlusLeaderboard);
        this.elements.get("checkDatapuller")?.      prop("checked", this._parameters.uriParams.p_dataPuller);
        this.elements.get("checkHttpSiraStatus")?.  prop("checked", this._parameters.uriParams.p_httpSiraStatus);
        this.elements.get("switchSynthRiders")?.    prop("checked", this._parameters.uriParams.g_synthRiders);
        this.elements.get("switchAudioTrip")?.      prop("checked", this._parameters.uriParams.g_audioTrip);
        this.elements.get("switchAudica")?.         prop("checked", this._parameters.uriParams.g_audica);
        /*==========================================================================================*/

        // Overlay Settings
        /*==========================================================================================*/

        // General Settings
        /******************************************************************************/
        this.elements.get("playerCardSwitch")?. prop("checked", !this._parameters.uriParams.pc_disabled);
        this.elements.get("songCardSwitch")?.   prop("checked", !this._parameters.uriParams.sc_disabled);
        this.elements.get("leaderboardSwitch")?.prop("checked", !this._parameters.uriParams.ld_disabled);
        /******************************************************************************/

        // Player Card Settings
        /******************************************************************************/
        this.elements.get("switchPlayerCardPreview")?.  prop("checked",     this._playerCard.playerCardData.display);
        this.elements.get("playerId")?.                 attr("placeholder", (this._parameters.uriParams.pc_playerID === "0") ? "https://scoresaber.com/u/" + this._parameters.uriParams.pc_playerID : this._parameters.uriParams.pc_playerID);
        this.elements.get("playerCardSkin")?.           val(this._parameters.uriParams.pc_skin);
        this.elements.get("playerCardPosition")?.       val(this._parameters.uriParams.pc_position);
        this.elements.get("playerCardPosX")?.           val(this._parameters.uriParams.pc_pos_x);
        this.elements.get("playerCardPosY")?.           val(this._parameters.uriParams.pc_pos_y);
        this.elements.get("playerCardScale")?.          val(this._parameters.uriParams.pc_scale);
        /******************************************************************************/

        // Song Card Settings
        /******************************************************************************/
        this.elements.get("switchSongCardPreview")?.prop("checked", this._songCard.songCardData.display);
        this.elements.get("songCardSkin")?.         val(this._parameters.uriParams.sc_skin);
        this.elements.get("songCardPosition")?.     val(this._parameters.uriParams.sc_position);
        this.elements.get("songCardPosX")?.         val(this._parameters.uriParams.sc_pos_x);
        this.elements.get("songCardPosY")?.         val(this._parameters.uriParams.sc_pos_y);
        this.elements.get("songCardScale")?.        val(this._parameters.uriParams.sc_scale);
        this.elements.get("missDisplay")?.          prop("checked", this._parameters.uriParams.sc_missDisplay);
        this.elements.get("bigBSR")?.               prop("checked", this._parameters.uriParams.sc_bigBSR);
        this.elements.get("ppMax")?.                prop("checked", this._parameters.uriParams.sc_ppMax);
        this.elements.get("ppEstimated")?.          prop("checked", this._parameters.uriParams.sc_ppEstimated);
        /******************************************************************************/

        // Leaderboard Settings
        /******************************************************************************/
        this.elements.get("leaderboardPosition")?.  val(this._parameters.uriParams.ld_position);
        this.elements.get("leaderboardPosX")?.      val(this._parameters.uriParams.ld_pos_x);
        this.elements.get("leaderboardPosY")?.      val(this._parameters.uriParams.ld_pos_y);
        this.elements.get("leaderboardScale")?.     val(this._parameters.uriParams.ld_scale);
        /******************************************************************************/
        /*==========================================================================================*/
        /*--------------------------------------------------------------------------------------------------------------*/
    }

    private elementsOffEvent() {
        this.elements.get("ipChanger")?.off("click");

        this.elements.get("ScoringSystemSS")?.off("click");
        this.elements.get("ScoringSystemBL")?.off("click");

        this.elements.get("switchBeatSaber")?.off("click");
        this.elements.get("switchSynthRiders")?.off("click");
        this.elements.get("switchAudioTrip")?.off("click");
        this.elements.get("switchAudica")?.off("click");

        this.elements.get("checkBsPlus")?.off("click");
        this.elements.get("checkDatapuller")?.off("click");
        this.elements.get("checkHttpSiraStatus")?.off("click");

        this.elements.get("playerCardSwitch")?.off("click");
        this.elements.get("songCardSwitch")?.off("click");
        /*this.elements.get("leaderboardSwitch")?.off("click");*/

        this.elements.get("switchPlayerCardPreview")?.off("click");
        this.elements.get("playerIdChanger")?.off("click");
        this.elements.get("playerCardSkin")?.off("change");
        this.elements.get("playerCardPosition")?.off("change");
        this.elements.get("playerCardPosX")?.off("input");
        this.elements.get("playerCardPosY")?.off("input");
        this.elements.get("playerCardScale")?.off("input");

        this.elements.get("switchSongCardPreview")?.off("click");
        this.elements.get("songCardSkin")?.off("change");
        this.elements.get("songCardPosition")?.off("change");
        this.elements.get("songCardPosX")?.off("input");
        this.elements.get("songCardPosY")?.off("input");
        this.elements.get("songCardScale")?.off("input");

        this.elements.get("customURITypeScript")?.off("click");
    }
    private elementsOnEvent() {
        this.elements.get("ipChanger")?.on("click", async () => {
            let ipValue = this.elements.get("ip")?.val();

            if ((ipValue !== undefined) && (typeof ipValue === "string")) {
                if (this._parameters.parseParameters("ip", ipValue)) {
                    this._parameters.uriParams.ip = ipValue;

                    this._parameters.assocValue();

                    await this._plugins.removeConnection();
                    await this._plugins.connection();
                }
            }
        });

        this.elements.get("ScoringSystemSS")?.on("click", async () => {
            if (this.elements.get("ScoringSystemSS")?.prop("checked") === true) {
                this._parameters.uriParams.scoringSystem = 1;
                this._parameters.assocValue();
                this.elements.get("ScoringSystemBL")?.prop("checked", false);
            } else {
                this._parameters.uriParams.scoringSystem = 2;
                this._parameters.assocValue();
                this.elements.get("ScoringSystemBL")?.prop("checked", true);
            }

            this.elements.get("playerCard-overlay")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
            if (this._playerCard.playerCardData.display) this._playerCard.playerCardData.needUpdate = true;

            this.elements.get("songCard-overlay")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
            if (this._songCard.songCardData.display) this._songCard.songCardData.needUpdate = true;
        });
        this.elements.get("ScoringSystemBL")?.on("click", async () => {
            if (this.elements.get("ScoringSystemBL")?.prop("checked") === true) {
                this._parameters.uriParams.scoringSystem = 2;
                this._parameters.assocValue();
                this.elements.get("ScoringSystemSS")?.prop("checked", false);
            } else {
                this._parameters.uriParams.scoringSystem = 1;
                this._parameters.assocValue();
                this.elements.get("ScoringSystemSS")?.prop("checked", true);
            }

            this.elements.get("playerCard-overlay")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
            if (this._playerCard.playerCardData.display) this._playerCard.playerCardData.needUpdate = true;

            this.elements.get("songCard-overlay")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
            if (this._songCard.songCardData.display) this._songCard.songCardData.needUpdate = true;
        });

        this.elements.get("switchBeatSaber")?.on("click", async () => {
            this._parameters.uriParams.g_beatSaber = this.elements.get("switchBeatSaber")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });
        this.elements.get("switchSynthRiders")?.on("click", async () => {
            this._parameters.uriParams.g_synthRiders = this.elements.get("switchSynthRiders")?.prop("checked") === true;
            this._parameters.uriParams.p_synthRiders = this.elements.get("switchSynthRiders")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });
        this.elements.get("switchAudioTrip")?.on("click", async () => {
            this._parameters.uriParams.g_audioTrip = this.elements.get("switchAudioTrip")?.prop("checked") === true;
            this._parameters.uriParams.p_audioTrip = this.elements.get("switchAudioTrip")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });
        this.elements.get("switchAudica")?.on("click", async () => {
            this._parameters.uriParams.g_audica = this.elements.get("switchAudica")?.prop("checked") === true;
            this._parameters.uriParams.p_audica = this.elements.get("switchAudica")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });

        this.elements.get("checkBsPlus")?.on("click", async () => {
            this._parameters.uriParams.p_beatSaberPlus              = this.elements.get("checkBsPlus")?.prop("checked") === true;
            this._parameters.uriParams.p_beatSaberPlusLeaderboard   = false;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });
        this.elements.get("checkDatapuller")?.on("click", async () => {
            this._parameters.uriParams.p_dataPuller = this.elements.get("checkDatapuller")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });
        this.elements.get("checkHttpSiraStatus")?.on("click", async () => {
            this._parameters.uriParams.p_httpSiraStatus = this.elements.get("checkHttpSiraStatus")?.prop("checked") === true;

            await this._plugins.removeConnection();
            await this._plugins.connection();
        });

        this.elements.get("playerCardSwitch")?.on("click", async () => {
            this._parameters.uriParams.pc_disabled = !this.elements.get("playerCardSwitch")?.prop("checked");
            this._parameters.assocValue();

            if (this._playerCard.playerCardData.display) this._playerCard.playerCardData.display = this.elements.get("playerCardSwitch")?.prop("checked");

            this.elements.get("menuSetup")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

            this.elementsBuilder();
            this.menuAction();
        });
        this.elements.get("songCardSwitch")?.on("click", async () => {
            this._parameters.uriParams.sc_disabled = !this.elements.get("songCardSwitch")?.prop("checked");
            this._parameters.assocValue();

            if (this._songCard.songCardData.display) {
                this._songCard.songCardData.inProgress = this.elements.get("songCardSwitch")?.prop("checked");
                this._songCard.songCardData.started = this.elements.get("songCardSwitch")?.prop("checked")
                this._songCard.songCardData.display = this.elements.get("songCardSwitch")?.prop("checked");
            }

            this.elements.get("menuSetup")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");

            this.elementsBuilder();
            this.menuAction();
        });
        /*this.elements.get("leaderboardSwitch")?.on("click", async () => {
            this._parameters.uriParams.ld_disabled = !this.elements.get("leaderboardSwitch")?.prop("checked");
            this._parameters.assocValue();

            if (this._leaderboard.leaderboardData.display) this._leaderboard.leaderboardData.display = this.elements.get("leaderboardSwitch")?.prop("checked");

            this.elements.get("menuSetup")?.empty();
            await this._template.loadSkin(Globals.E_MODULES.MENU_SETUP, this.skinSettings, "overlayMenu.html");
        });*/

        this.elements.get("switchPlayerCardPreview")?.on("click", async () => {
            if (this.elements.get("switchPlayerCardPreview")?.prop("checked")) {
                if (this._parameters.uriParams.pc_playerID === "0") this.elements.get("switchPlayerCardPreview")?.prop("checked", false);
                else {
                    await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
                    this._playerCard.playerCardData.display = true;
                    this._playerCard.playerCardData.needUpdate = true;
                }
            } else {
                this._playerCard.playerCardData.display = false;
                this._playerCard.playerCardData.needUpdate = false;
            }
        });
        this.elements.get("playerIdChanger")?.on("click", async () => {
            let playerIdValue = this.elements.get("playerId")?.val();

            if ((playerIdValue !== undefined) && (typeof playerIdValue === "string")) {
                if (RegExp(/\bhttps:\/\/scoresaber.com\/u\/\b/).test(playerIdValue)) playerIdValue = playerIdValue.replace("https://scoresaber.com/u/", "");

                if (this._parameters.parseParameters("pc_playerID", playerIdValue)) {
                    this._parameters.uriParams.pc_playerID = playerIdValue;
                    this._parameters.assocValue();

                    if (this._playerCard.playerCardData.display) this._playerCard.playerCardData.needUpdate = true;
                }
            }
        });
        this.elements.get("playerCardSkin")?.on("change", async () => {
            let playerCardSkinValue = this.elements.get("playerCardSkin")?.val();

            if ((playerCardSkinValue !== undefined) && (typeof playerCardSkinValue === "string")) {
                if (this._parameters.parseParameters("pc_skin", playerCardSkinValue)) {
                    this._parameters.uriParams.pc_skin = playerCardSkinValue;
                    this._parameters.assocValue();

                    this.elements.get("playerCard-overlay")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.PLAYERCARD, this._playerCard.playerCardData.skin);
                    if (this._playerCard.playerCardData.display) this._playerCard.playerCardData.needUpdate = true;
                }
            }
        });
        this.elements.get("playerCardPosition")?.on("change", async () => {
            let playerCardPositionValue = this.elements.get("playerCardPosition")?.val();

            if ((playerCardPositionValue !== undefined) && (typeof playerCardPositionValue === "string")) {
                if (this._parameters.parseParameters("pc_position", playerCardPositionValue)) {
                    this._parameters.uriParams.pc_position = Number(playerCardPositionValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("playerCardPosX")?.on("input", () => {
            let playerCardPosXValue = this.elements.get("playerCardPosX")?.val();

            if ((playerCardPosXValue !== undefined) && (typeof playerCardPosXValue === "string")) {
                if (this._parameters.parseParameters("pc_pos_x", playerCardPosXValue)) {
                    this._parameters.uriParams.pc_pos_x = Number(playerCardPosXValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("playerCardPosY")?.on("input", () => {
            let playerCardPosYValue = this.elements.get("playerCardPosY")?.val();

            if ((playerCardPosYValue !== undefined) && (typeof playerCardPosYValue === "string")) {
                if (this._parameters.parseParameters("pc_pos_y", playerCardPosYValue)) {
                    this._parameters.uriParams.pc_pos_y = Number(playerCardPosYValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("playerCardScale")?.on("input", () => {
            let playerCardScaleValue = this.elements.get("playerCardScale")?.val();

            if ((playerCardScaleValue !== undefined) && (typeof playerCardScaleValue === "string")) {
                if (this._parameters.parseParameters("pc_scale", playerCardScaleValue)) {
                    this._parameters.uriParams.pc_scale = Number(playerCardScaleValue);
                    this._parameters.assocValue();
                }
            }
        });

        this.elements.get("switchSongCardPreview")?.on("click", async () => {
            if (this.elements.get("switchSongCardPreview")?.prop("checked")) {
                await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
                this._songCard.songCardData.display     = true;
                this._songCard.songCardData.started     = true;
                this._songCard.songCardData.inProgress  = true;
                this._songCard.songCardData.needUpdate  = true;
            } else {
                this._songCard.songCardData.display     = false;
                this._songCard.songCardData.started     = false;
                this._songCard.songCardData.inProgress  = false;
                this._songCard.songCardData.needUpdate  = false;
            }
        });
        this.elements.get("songCardSkin")?.on("change", async () => {
            let songCardSkinValue = this.elements.get("songCardSkin")?.val();

            if ((songCardSkinValue !== undefined) && (typeof songCardSkinValue === "string")) {
                if (this._parameters.parseParameters("sc_skin", songCardSkinValue)) {
                    this._parameters.uriParams.sc_skin = songCardSkinValue;
                    this._parameters.assocValue();

                    this.elements.get("songCard-overlay")?.empty();
                    await this._template.loadSkin(Globals.E_MODULES.SONGCARD, this._songCard.songCardData.skin);
                    if (this._songCard.songCardData.display) this._songCard.songCardData.needUpdate = true;
                }
            }
        });
        this.elements.get("songCardPosition")?.on("change", async () => {
            let songCardPositionValue = this.elements.get("songCardPosition")?.val();

            if ((songCardPositionValue !== undefined) && (typeof songCardPositionValue === "string")) {
                if (this._parameters.parseParameters("sc_position", songCardPositionValue)) {
                    this._parameters.uriParams.sc_position = Number(songCardPositionValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("songCardPosX")?.on("input", () => {
            let songCardPosXValue = this.elements.get("songCardPosX")?.val();

            if ((songCardPosXValue !== undefined) && (typeof songCardPosXValue === "string")) {
                if (this._parameters.parseParameters("sc_pos_x", songCardPosXValue)) {
                    this._parameters.uriParams.sc_pos_x = Number(songCardPosXValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("songCardPosY")?.on("input", () => {
            let songCardPosYValue = this.elements.get("songCardPosY")?.val();

            if ((songCardPosYValue !== undefined) && (typeof songCardPosYValue === "string")) {
                if (this._parameters.parseParameters("sc_pos_y", songCardPosYValue)) {
                    this._parameters.uriParams.sc_pos_y = Number(songCardPosYValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("songCardScale")?.on("input", () => {
            let songCardScaleValue = this.elements.get("songCardScale")?.val();

            if ((songCardScaleValue !== undefined) && (typeof songCardScaleValue === "string")) {
                if (this._parameters.parseParameters("sc_scale", songCardScaleValue)) {
                    this._parameters.uriParams.sc_scale = Number(songCardScaleValue);
                    this._parameters.assocValue();
                }
            }
        });
        this.elements.get("missDisplay")?.on("click", async () => {
            this._parameters.uriParams.sc_missDisplay = this.elements.get("missDisplay")?.prop("checked") === true;
            this._parameters.assocValue();
        });
        this.elements.get("bigBSR")?.on("click", async () => {
            this._parameters.uriParams.sc_bigBSR = this.elements.get("bigBSR")?.prop("checked") === true;
            this._parameters.assocValue();
        });
        /*this.elements.get("ppMax")?.on("click", async () => {
            this._parameters.uriParams.sc_ppMax = this.elements.get("ppMax")?.prop("checked") === true;
            this._parameters.assocValue();
        });
        this.elements.get("ppEstimated")?.on("click", async () => {
            this._parameters.uriParams.sc_ppEstimated = this.elements.get("ppEstimated")?.prop("checked") === true;
            this._parameters.assocValue();
        });*/

        this.elements.get("customURITypeScript")?.on("click", async () => {
            await this.urlTextBuilder();
            let value = this.elements.get("customURITypeScript")?.data("clipboardtext");
            await navigator.clipboard.writeText(value);
        });
    }

    private async urlTextBuilder() {
        let url = (this._parameters.uriParams.ip === "127.0.0.1") ? "https://overlay.hyldrazolxy.fr/" : "http://overlay.hyldrazolxy.fr/";

        if (this._parameters.uriParams.token !== "")    await this._parameters.updateTokenParameters();
        else                                            await this._parameters.saveTokenParameters();

        url += (this._parameters.uriParams.token === "") ? "" : "?token=" + this._parameters.uriParams.token;

        this.elements.get("customURITypeScript")?.data("clipboardtext", url);
    }
}