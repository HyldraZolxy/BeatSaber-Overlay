export class Template {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    constructor() {}

    loadSkin(skinName = "default") {
        if (this.urlParams.debug) {
            console.log("%cTemplate.js", "background-color:cyan");
            console.log("Template is: " + skinName);
            console.log("\n\n");
        }

        if (URL_PARAMS.skin.includes(skinName)) {
            $('link[rel=stylesheet][href*="/skin/"]').remove();

            $("head").append('<link rel="stylesheet" href="' + SKIN_PATH[skinName] + ".css" + '" type="text/css" />');
            $("body").load(SKIN_PATH[skinName] + ".html");
        }
    }

    updateSkin(objectValues) {
        if (this.urlParams.debug) {
            console.log("%cTemplate.js", "background-color:cyan");
        }

        for(var [key, valueKey] of Object.entries(objectValues)) {
            // ClassName + [object Object]
            let selector;

            for(var [keyOfKey, valueKeyOfKey] of Object.entries(valueKey)) {
                // Selector + value, addClass + value, [object Object], etc ...

                switch(keyOfKey) {
                    case "selector":
                        selector = valueKeyOfKey;
                        if (this.urlParams.debug) {
                            console.log("Selector is: " + selector);
                        }
                        break;
                    case "removeClass":
                        $(selector + key).removeClass();
                        if (this.urlParams.debug) {
                            console.log(selector + key + ", Removing all class");
                        }
                        break;
                    case "addClass":
                        $(selector + key).addClass(valueKeyOfKey);
                        if (this.urlParams.debug) {
                            console.log(selector + key + ", Adding class: " + valueKeyOfKey);
                        }
                        break;
                    case "value":
                        $(selector + key).text(valueKeyOfKey);
                        if (this.urlParams.debug) {
                            console.log(selector + key + ", Adding/Modifying value: " + valueKeyOfKey);
                        }
                        break;
                    case "modify":
                        for(var [keyOfModify, valueKeyOfModify] of Object.entries(valueKeyOfKey)) {
                            // Opacity + value, Background-color + value, etc ...

                            keyOfModify = keyOfModify.replace(/(_)/g, "-");
                            $(selector + key).css(keyOfModify, valueKeyOfModify);
                            if (this.urlParams.debug) {
                                console.log(selector + key + ", " + keyOfModify + ", " + valueKeyOfModify);
                            }
                        }
                        break;
                    default:
                        if (this.urlParams.debug) {
                            console.log("%cThis parameter is not supported: " + keyOfKey, "background-color:red");
                        }
                        break;
                }
            }

            if (this.urlParams.debug) {
                console.log("\n");
            }
        }

        if (this.urlParams.debug) {
            console.log("\n\n");
        }
    }

    setScale(scaleValue = "1") {
        var scale = {
            player: {
                selector: "#",
                modify: {
                    transform: "scale(" + scaleValue + ")"
                }
            },
            songOverlay: {
                selector: "#",
                modify: {
                    transform: "scale(" + scaleValue + ")"
                }
            }
        };
    
        setTimeout(() => {
            this.updateSkin(scale);
        }, TIMER_UPDATE_TEMPLATE);
    }

    setupMode(setupMode = false) {
        if (setupMode) {
            setTimeout(() => {
                this.updateSkin(DEFAULT_PLAYER);
                this.updateSkin(DEFAULT_SONG);
            }, TIMER_UPDATE_TEMPLATE);
            
            setInterval(() => {
                this.showPlayer(true);
        
                setTimeout(() => {
                    this.showSong(true);
                }, 5000);
            }, 10000);
        }
    }

    showPlayer(setupMode = false) {
        const player = {
            player: {
                selector: "#",
                removeClass: "",
                addClass: "showFirst"
            },
            playerInfo: {
                selector: "#",
                removeClass: "",
                addClass: "showSecond"
            }
        };

        const song = {
            songOverlay: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenSecond"
            },
            songInfo: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenFirst"
            }
        };

        if (this.urlParams.playerId || setupMode) {
            this.updateSkin(player);
        }

        this.updateSkin(song);
    }

    showSong(setupMode = false) {
        const song = {
            songOverlay: {
                selector: "#",
                removeClass: "",
                addClass: "showFirst"
            },
            songInfo: {
                selector: "#",
                removeClass: "",
                addClass: "showSecond"
            }
        };

        const player = {
            player: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenSecond"
            },
            playerInfo: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenFirst"
            }
        };

        if (this.urlParams.playerId || setupMode) {
            this.updateSkin(player);
        }

        this.updateSkin(song);
    }

    hiddenEverythings() {
        const song = {
            songOverlay: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenSecond"
            },
            songInfo: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenFirst"
            }
        };

        const player = {
            player: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenSecond"
            },
            playerInfo: {
                selector: "#",
                removeClass: "",
                addClass: "hiddenFirst"
            }
        };

        if (this.urlParams.playerId || setupMode) {
            this.updateSkin(player);
        }

        this.updateSkin(song);
    }
}
