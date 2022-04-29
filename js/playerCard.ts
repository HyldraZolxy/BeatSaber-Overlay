import { GlobalVariable } from "./global.js";
import { Template } from "./template.js";
import { ScoreSaber } from "./scoreSaber.js";
import { SongCard } from "./songCard.js";

export class PlayerCard {

    //////////////
    // INSTANCE //
    //////////////
    private static _instance: PlayerCard;

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _template: Template;
    private _scoreSaber: ScoreSaber;
    private _songCard: SongCard;

    ////////////////////////
    // PROTECTED VARIABLE //
    ////////////////////////
    protected skinUrl: string = "./skins/playerCard/";

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public playerCardParameters: {
        // disabled: boolean,
        // alwaysShown: boolean,
        display: boolean,
        needUpdate: boolean;

        position: string,
        skin: string,
        playerId: string,
        scale: number
    } = {
        // disabled: false,
        // alwaysShown: false,
        display: false,
        needUpdate: false,

        position: GlobalVariable.DISPLAY_POSITION[0],
        skin: GlobalVariable.SKIN_PLAYER_CARD[0],
        playerId: "0",
        scale: 1
    };

    public playerCardData: {
        avatar: string;
        playerFlag: string;
        topWorld: number;
        topCountry: number;
        performancePoint: number;
    } = {
        avatar: "./pictures/default/playerNotFound.jpg",
        playerFlag: "FR",
        topWorld: 0,
        topCountry: 0,
        performancePoint: 0,
    };

    constructor() {
        this._template = new Template();
        this._scoreSaber = new ScoreSaber();
        this._songCard = SongCard.Instance;

        this.updatePlayerInfo();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private async updatePlayerInfo() {
        setInterval(() => {
            if (
                this.playerCardParameters.needUpdate
                && this._songCard.songCardParameters.finished
                && (this.playerCardParameters.playerId !== "0")
            ) {
                this.playerCardParameters.needUpdate = false;

                this._scoreSaber.getPlayerInfo(this.playerCardParameters.playerId).then((data: any) => {
                    if (data !== undefined) {
                        this.playerCardData.avatar = data.profilePicture;
                        this.playerCardData.playerFlag = data.country;
                        this.playerCardData.topCountry = data.countryRank;
                        this.playerCardData.topWorld = data.rank;
                        this.playerCardData.performancePoint = data.pp;
                    } else {
                        this.playerCardData.avatar = "./pictures/default/playerNotFound.jpg";
                        this.playerCardData.playerFlag = "FR";
                        this.playerCardData.topCountry = 0;
                        this.playerCardData.topWorld = 0;
                        this.playerCardData.performancePoint = 0;
                    }
                });
            }
        }, GlobalVariable.FPS_REFRESH_TICK);
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async loadSkin(skin: string) {
        const skinPath = this.skinUrl + skin + "/";
        if (skin in GlobalVariable.SkinFilesPlayerCard) {
            for (const entries of Object.entries(GlobalVariable.SkinFilesPlayerCard)) {
                const [key, value] = entries;

                if (key === skin) {
                    await this._template.loadFile(skinPath, value, "playerCard");
                }
            }
        }
    }

    public refreshPlayerCard(data: object) {
        this._template.refreshUI(data, "playerCard");
    }

    public toggleDisplay() {
        switch(this.playerCardParameters.skin) {
            case GlobalVariable.SKIN_PLAYER_CARD[0]:
                let tasks = {};

                if (this.playerCardParameters.display && (this.playerCardParameters.playerId !== "0")) {
                    tasks = {
                        task_1: {
                            element: $("#playerCard"),
                            removeClass: "hiddenSecond",
                            addClass: "showFirst"
                        },
                        task_2: {
                            element: $("#playerData"),
                            removeClass: "hiddenFirstLeft hiddenFirstRight",
                            addClass: (
                                (this.playerCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.playerCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
                            ) ? "showSecondRight" : "showSecondLeft"
                        }
                    };
                } else {
                    tasks = {
                        task_1: {
                            element: $("#playerCard"),
                            removeClass: "showFirst",
                            addClass: "hiddenSecond"
                        },
                        task_2: {
                            element: $("#playerData"),
                            removeClass: "showSecondLeft showSecondRight",
                            addClass: (
                                (this.playerCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.playerCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
                            ) ? "hiddenFirstRight" : "hiddenFirstLeft"
                        }
                    };
                }

                this._template.refreshUITemplate(tasks);
                break;
        }
    }

    public displayScale() {
        let tasks = {
            task_1: {
                element: $("#playerCard"),
                modify: {
                    transform_origin: this.playerCardParameters.position.replace(/(-)/g, " "),
                    transform: "scale(" + this.playerCardParameters.scale + ")"
                }
            }
        }

        this._template.refreshUITemplate(tasks);
    }

    public cornerSwitch() {
        let tasks = {};

        tasks = {
            task_1: {
                element: $("#playerCard"),
                removeClass: "top-left top-right bottom-left bottom-right",
                addClass: this.playerCardParameters.position
            }
        }

        this._template.refreshUITemplate(tasks);

        switch(this.playerCardParameters.skin) {
            case GlobalVariable.SKIN_PLAYER_CARD[0]:
                switch(this.playerCardParameters.position) {
                    case GlobalVariable.DISPLAY_POSITION[1]:
                    case GlobalVariable.DISPLAY_POSITION[3]:
                        tasks = {
                            task_1: {
                                element: $("#playerCard"),
                                modify: {
                                    flex_direction: "row-reverse"
                                }
                            },
                            task_2: {
                                element: $("#playerFlag"),
                                modify: {
                                    animation: "rotateCountryRight 20s ease infinite",
                                    transform_origin: "left",
                                    float: "left"
                                }
                            },
                            task_3: {
                                element: $("#playerData"),
                                modify: {
                                    text_align: "right"
                                }
                            },
                            task_4: {
                                element: $("#topCountry"),
                                removeClass: "",
                                addClass: "playerTopCountryRight"
                            },
                            task_5: {
                                element: $("#topWorld"),
                                removeClass: "",
                                addClass: "playerTopWorldRight"
                            }
                        }
                        break;

                    default:
                        tasks = {
                            task_1: {
                                element: $("#playerCard"),
                                modify: {
                                    flex_direction: "row"
                                }
                            },
                            task_2: {
                                element: $("#playerFlag"),
                                modify: {
                                    animation: "rotateCountryLeft 20s ease infinite",
                                    transform_origin: "right",
                                    float: "right"
                                }
                            },
                            task_3: {
                                element: $("#playerData"),
                                modify: {
                                    text_align: "left"
                                }
                            },
                            task_4: {
                                element: $("#topCountry"),
                                removeClass: "",
                                addClass: "playerTopCountryLeft"
                            },
                            task_5: {
                                element: $("#topWorld"),
                                removeClass: "",
                                addClass: "playerTopWorldLeft"
                            }
                        }
                        break;
                }
                break;
        }

        this._template.refreshUITemplate(tasks);
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): PlayerCard {
        return this._instance || (this._instance = new this());
    }
}