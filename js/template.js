export class Template {
    urlParams = JSON.parse(sessionStorage.getItem("urlParams"));

    constructor() {}

    loadSkin(skinName = "default") {
        $('link[rel=stylesheet][href*="/skin/"]').remove();

        if (this.urlParams.skin !== undefined) {
            skinName = this.urlParams.skin;
        }

        if (this.urlParams.debug) {
            console.log("%cTemplate.js", "background-color:cyan");
            console.log("Template is: " + skinName);
            console.log("\n\n");
        }

        if (PARAMS.skin.includes(skinName)) {
            $("head").append('<link rel="stylesheet" href="' + SKIN_PATH[skinName] + ".css" + '" type="text/css" />');
            $("body").load(SKIN_PATH[skinName] + ".html");
        }
    }

    updateSkin(skinName) {
        if (this.urlParams.debug) {
            console.log("%cTemplate.js", "background-color:cyan");
        }

        for(var [key, value] of Object.entries(skinName)) {

            key = key.replace(/\d+/g, "");

            if (Array.isArray(value)) {
                switch(value[1]) {
                    case "remove":
                        $(value[0] + key).removeClass();
                        break;
                    case "add":
                        $(value[0] + key).addClass(value[2]);
                        break;
                    case "modify":
                        $(value[0] + key).css(value[2], value[3]);
                        break;
                    default:
                        break;
                }
            } else {
                $("#" + key).text(value);
            }

            if (this.urlParams.debug) {
                if (Array.isArray(value)) {
                    console.log(value[0] + key + " = " + value);
                } else {
                    console.log("#" + key + " = " + value);
                }
            }
        }

        if (this.urlParams.debug) {
            console.log("\n\n");
        }
    }

    setScale(scaleValue = "1") {
        var scale = {
            player: ["#", "modify", "transform", "scale(" + scaleValue + ")"],
            songOverlay: ["#", "modify", "transform", "scale(" + scaleValue + ")"]
        }
    
        setTimeout(() => {
            this.updateSkin(scale);
        }, 10);
    }
}
