import { GlobalVariable } from "./global.js";
import { Template } from "./template.js";
import { Tools } from "./tools.js";

export class SongCard {

    //////////////
    // INSTANCE //
    //////////////
    private static _instance: SongCard;

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _template: Template;
    private _tools: Tools;

    ////////////////////////
    // PROTECTED VARIABLE //
    ////////////////////////
    protected skinUrl: string = "./skins/songCard/";

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public songCardParameters: {
        // disabled: boolean,
        // alwaysShown: boolean,

        position: string,
        skin: string,
        scale: number

        started: boolean;
        inProgress: boolean;
        paused: boolean;
        finished: boolean;
    } = {
        // disabled: false,
        // alwaysShown: false,

        position: GlobalVariable.DISPLAY_POSITION[0],
        skin: GlobalVariable.SKIN_PLAYER_CARD[0],
        scale: 1,

        started: false,
        inProgress: false,
        paused: false,
        finished: false
    };

    public songCardData: {
        cover: string;
        title: string;
        subTitle: string;
        mapper: string;
        author: string;

        bsrKey: string;
        bpm: number;

        difficulty: string;
        difficultyClass: string;

        ranked: boolean;
        qualified: boolean;

        time: number;
        totalTime: number;
        timeToLetters: string;
        timeToBarLength: number;

        accuracy: number;
        accuracyToLetters: string;

        speedModifier: number;
    } = {
        cover: "./pictures/default/defaultSong.jpg",
        title: "[BLEED BLOOD]",
        subTitle: "SubNameTest",
        mapper: "Jabob",
        author: "Camellia",

        bsrKey: "10217",
        bpm: 325.758,

        difficulty: "Easy",
        difficultyClass: "Easy",

        ranked: true,
        qualified: false,

        time: 60000,
        totalTime: 249000,
        timeToLetters: "2:25",
        timeToBarLength: 24.09,

        accuracy: 98.56,
        accuracyToLetters: "SS",

        speedModifier: 1
    };

    constructor() {
        this._template = new Template();
        this._tools = new Tools();

        this.timerSong();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private songAccuracyLetterToClass() {
        let accuracyLetterToClass: string;
        let tasks = {};

        this.songCardData.accuracyToLetters = this._template.accuracyToLetter(this.songCardData.accuracy);

        switch(this.songCardData.accuracyToLetters) {
            case "SS":
                accuracyLetterToClass = "ssClass";
                break;

            case "S":
                accuracyLetterToClass =  "sClass";
                break;

            case "A":
                accuracyLetterToClass =  "aClass";
                break;

            case "B":
                accuracyLetterToClass =  "bClass";
                break;

            case "C":
                accuracyLetterToClass =  "cClass";
                break;

            case "D":
            case "E":
                accuracyLetterToClass =  "deClass";
                break

            default:
                accuracyLetterToClass =  "sClass";
                break;
        }

        switch(this.songCardParameters.skin) {
            case GlobalVariable.SKIN_SONG_CARD[1]:
                tasks = {
                    task_1: {
                        element: $("#accuracyToLetters"),
                        removeClass: "ssClass sClass aClass bClass cClass deClass",
                        addClass: accuracyLetterToClass
                    }
                };
                break;
        }

        this._template.refreshUITemplate(tasks);
    }

    private stopOrStartClass() {
        let tasks = {};

        switch(this.songCardParameters.skin) {
            case GlobalVariable.SKIN_SONG_CARD[1]:
                tasks = {
                    task_1: {
                        element: $("#songCard"),
                        removeClass: "stop start",
                        addClass: (this.songCardParameters.inProgress) ? "start" : "stop"
                    }
                }
                break;
        }

        this._template.refreshUITemplate(tasks);
    }

    private timerSong() {
        setInterval(() => {
            if (this.songCardParameters.started) {
                if (this.songCardParameters.inProgress) {
                    this.songCardData.time += 100;
                    this.timerToBar();
                }
            } else {
                this.songCardData.time = 0;
                this.songCardData.timeToBarLength = 0;
            }
        }, GlobalVariable.MS_TIMER);
    }

    public timerToBar() {
        this.songCardData.timeToBarLength = ((100 * this.songCardData.time) / this.songCardData.totalTime) * this.songCardData.speedModifier;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async loadSkin(skin: string) {
        const skinPath = this.skinUrl + skin + "/";
        if (skin in GlobalVariable.SkinFilesSongCard) {
            for (const entries of Object.entries(GlobalVariable.SkinFilesSongCard)) {
                const [key, value] = entries;

                if (key === skin) {
                    await this._template.loadFile(skinPath, value, "songCard");
                }
            }
        }
    }
    
    public refreshSongCard(data: object) {
        this._template.refreshUI(data, "songCard");
    }

    public toggleDisplay() {
        let tasks = {};

        switch(this.songCardParameters.skin) {
            case GlobalVariable.SKIN_SONG_CARD[1]:
                if (this.songCardParameters.started) {
                    tasks = {
                        task_1: {
                            element: $("#songCard"),
                            removeClass: "hidden",
                            addClass: "show"
                        },
                        task_2: {
                            element: $("#songDataCover"),
                            removeClass: "hiddenDescBarLeft hiddenDescBarRight",
                            addClass: (
                                (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
                            ) ? "showDescBarRight" : "showDescBarLeft"
                        },
                        task_3: {
                            element: $("#songData"),
                            removeClass: "hidden",
                            addClass: "show"
                        }
                    }
                } else {
                    tasks = {
                        task_1: {
                            element: $("#songCard"),
                            removeClass: "show",
                            addClass: "hidden"
                        },
                        task_2: {
                            element: $("#songDataCover"),
                            removeClass: "showDescBarLeft showDescBarRight",
                            addClass: (
                                (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
                            ) ? "hiddenDescBarRight" : "hiddenDescBarLeft"
                        },
                        task_3: {
                            element: $("#songData"),
                            removeClass: "show",
                            addClass: "hidden"
                        }
                    }
                }

                this.songAccuracyLetterToClass();
                this.stopOrStartClass();
                this._template.refreshUITemplate(tasks);
                break;

            case GlobalVariable.SKIN_SONG_CARD[0]:
                if (this.songCardParameters.started) {
                    tasks = {
                        task_1: {
                            element: $("#songCard"),
                            removeClass: "hiddenSecond",
                            addClass: "showFirst"
                        },
                        task_2: {
                            element: $("#songData"),
                            removeClass: "hiddenFirstLeft hiddenFirstRight",
                            addClass: (
                                (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
                            ) ? "showSecondRight" : "showSecondLeft"
                        }
                    };
                } else {
                    tasks = {
                        task_1: {
                            element: $("#songCard"),
                            removeClass: "showFirst",
                            addClass: "hiddenSecond"
                        },
                        task_2: {
                            element: $("#songData"),
                            removeClass: "showSecondLeft showSecondRight",
                            addClass: (
                                (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[1])
                                || (this.songCardParameters.position === GlobalVariable.DISPLAY_POSITION[3])
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
                element: $("#songCard"),
                modify: {
                    transform_origin: this.songCardParameters.position.replace(/(-)/g, " "),
                    transform: "scale(" + this.songCardParameters.scale + ")"
                }
            }
        }

        this._template.refreshUITemplate(tasks);
    }

    public cornerSwitch() {
        let tasks = {};

        tasks = {
            task_1: {
                element: $("#songCard"),
                removeClass: "top-left top-right bottom-left bottom-right",
                addClass: this.songCardParameters.position
            }
        }

        this._template.refreshUITemplate(tasks);

        switch(this.songCardParameters.skin) {
            case GlobalVariable.SKIN_SONG_CARD[1]:
                switch(this.songCardParameters.position) {
                    case GlobalVariable.DISPLAY_POSITION[1]:
                    case GlobalVariable.DISPLAY_POSITION[3]:
                        tasks = {
                            task_1: {
                                element: $("#songCard"),
                                modify: {
                                    flex_direction: "row-reverse",
                                    text_align: "right"
                                }
                            },
                            task_2: {
                                element: $(".descBar"),
                                modify: {
                                    float: "right",
                                    clear: "right",
                                    padding: "3px 5px 2px 15px",
                                    clip_path: "polygon(0 0, 100% 0, 100% 100%, 10% 100%)"
                                }
                            },
                            task_3: {
                                element: $("#songAccuracyDiv"),
                                modify: {
                                    clip_path: "polygon(0 0, 100% 0, 100% 100%, 100% 100%)",
                                    border_top_left_radius: "",
                                    border_top_right_radius: "5px"
                                }
                            },
                            task_4: {
                                element: $("#accuracy"),
                                modify: {
                                    transform: "rotate(45deg)",
                                    margin_left: "0",
                                    margin_right: "-15px"
                                }
                            },
                            task_5: {
                                element: $("#songAccuracyLetterDiv"),
                                modify: {
                                    margin_top: "-20px",
                                    margin_left: "0",
                                    margin_right: "-20px"
                                }
                            },
                            task_6: {
                                element: $("#accuracyToLetters"),
                                modify: {
                                    transform: "rotate(45deg)"
                                }
                            }
                        }
                        break;

                    default:
                        tasks = {
                            task_1: {
                                element: $("#songCard"),
                                modify: {
                                    flex_direction: "row",
                                    text_align: "left"
                                }
                            },
                            task_2: {
                                element: $(".descBar"),
                                modify: {
                                    float: "left",
                                    clear: "left",
                                    padding: "3px 15px 2px 5px",
                                    clip_path: "polygon(0 0, 100% 0, 90% 100%, 0% 100%)"
                                }
                            },
                            task_3: {
                                element: $("#songAccuracyDiv"),
                                modify: {
                                    clip_path: "polygon(0 0, 100% 0, 0 100%, 0% 100%)",
                                    border_top_left_radius: "5px",
                                    border_top_right_radius: ""
                                }
                            },
                            task_4: {
                                element: $("#accuracy"),
                                modify: {
                                    transform: "rotate(-45deg)",
                                    margin_left: "-15px",
                                    margin_right: ""
                                }
                            },
                            task_5: {
                                element: $("#songAccuracyLetterDiv"),
                                modify: {
                                    margin_top: "-20px",
                                    margin_left: "-20px",
                                    margin_right: "0"
                                }
                            },
                            task_6: {
                                element: $("#accuracyToLetters"),
                                modify: {
                                    transform: "rotate(-45deg)"
                                }
                            }
                        }
                        break;
                }
                break;

            case GlobalVariable.SKIN_SONG_CARD[0]:
                switch(this.songCardParameters.position) {
                    case GlobalVariable.DISPLAY_POSITION[1]:
                    case GlobalVariable.DISPLAY_POSITION[3]:
                        tasks = {
                            task_1: {
                                element: $("#songCard"),
                                modify: {
                                    flex_direction: "row-reverse",
                                    text_align: "right"
                                }
                            }
                        }
                        break;

                    default:
                        tasks = {
                            task_1: {
                                element: $("#songCard"),
                                modify: {
                                    flex_direction: "row",
                                    text_align: "left"
                                }
                            }
                        }
                        break;
                }
                break;
        }

        this._template.refreshUITemplate(tasks);
    }

    public async beatSaverInfo(levelId: string) {
        if (levelId.length === 40) {
            let dataJson: any = await this._tools.getMethod(GlobalVariable.BEATSAVER_API_URL + "maps/hash/" + levelId);

            if (!("error" in dataJson)) {
                this.songCardData.bsrKey = dataJson.id;
                this.songCardData.ranked = dataJson.ranked;
                this.songCardData.qualified = dataJson.qualified;
                this.songCardData.cover = dataJson.versions[0].coverURL;
            } else {
                this.songCardData.bsrKey = "NotFound";
            }
        }
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): SongCard {
        return this._instance || (this._instance = new this());
    }
}