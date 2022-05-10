export class Template {

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public loadFile(skinPath: string, skinFiles: string[], classCall: string): Promise<any> {
        return new Promise(resolve => {
            $(`link[rel=stylesheet][href*="./skins/${classCall}/"]`).remove();
            $(`script[src*="./skins/${classCall}/"]`).remove();

            for (let i = 0; i < skinFiles.length; i++) {
                if (skinFiles[i] == "style.css") {
                    $("head").append(`<link rel="stylesheet" href="${skinPath}${skinFiles[i]}" type="text/css" />`);
                }
                
                if (skinFiles[i] == "script.js") {
                    $("head").append(`<script type="text/javascript" src="${skinPath}${skinFiles[i]}"></script>`);
                }

                if (
                    skinFiles[i] == "index.html"
                    || skinFiles[i] == "home.html"
                    || skinFiles[i] == "general.html"
                    || skinFiles[i] == "playerCard.html"
                    || skinFiles[i] == "songCard.html"
                ) {
                    $(`#${classCall}`).load(`${skinPath}${skinFiles[i]}`);
                }
            }

            setTimeout(() => resolve(""), 0);
        });
    }

    public refreshUI(data: object, classCall: string): void {
        Object.entries(data).forEach(entry => {
            const [key, value] = entry;

            switch(classCall) {
                case "playerCard":
                    switch(key) {
                        // PLAYER TEXT
                        case "topCountry":
                        case "topWorld":
                        case "performancePoint":
                            $("#" + key).text(value);
                        break;

                        // PLAYER PICTURE
                        case "playerFlag":
                            $("#" + key).css("background-image", "url('./pictures/country/" + value + ".svg')");
                            break;

                        case "avatar":
                            $("#" + key).css("background-image", "url('" + value + "')");
                            break;
                        
                    }
                    break;
                
                case "songCard":
                    switch(key) {
                        // SONG TEXT
                        case "title":
                        case "subTitle":
                        case "mapper":
                        case "author":
                        case "difficulty":
                        case "bsrKey":
                        case "bpm":
                        case "time":
                        case "totalTime":
                        case "timeToLetters":
                        case "accuracy":
                        case "accuracyToLetters":
                        case "score":
                        case "combo":
                            $("#" + key).text(value);
                            break;
                        
                        // SONG PICTURE
                        case "cover":
                            $("#" + key).css("background-image", "url('" + value + "')");
                            break;
                        
                        // SONG CSS
                        case "qualified":
                        case "ranked":
                            $("#" + key).css("display", (value) ? "inline-block" : "none");
                            break;

                        case "difficultyClass":
                            $("." + key).removeClass("ExpertPlus Expert Hard Normal Easy").addClass(value);
                            break;

                        case "timeToBarLength":
                            $("#" + key).css("width", value + "%");
                            break;
                    }
                    break;
            }
        });
    }

    public refreshUITemplate(order: object) {
        let htmlElement: any;

        Object.entries<any>(order).forEach(entry => {
            const [key, value] = entry;

            Object.entries<any>(value).forEach(entry => {
                const [key, value] = entry;

                switch(key) {
                    case "element":
                        htmlElement = value;
                        break;

                    case "removeClass":
                        $(htmlElement).removeClass(value);
                        break;

                    case "addClass":
                        $(htmlElement).addClass(value);
                        break;

                    case "modify":
                        Object.entries<string>(value).forEach(entry => {
                            let [key, value] = entry;

                            key = key.replace(/(_)/g, "-");
                            $(htmlElement).css(key, value);
                        });
                        break;
                }
            });
        });
    }

    public accuracyToLetter(accuracy: number): string {
        if (accuracy >= 90) {
            return "SS";
        }

        if (accuracy < 90 && accuracy >= 80) {
            return "S";
        }

        if (accuracy < 80 && accuracy >= 65) {
            return "A";
        }

        if (accuracy < 65 && accuracy >= 50) {
            return "B";
        }

        if (accuracy < 50 && accuracy >= 35) {
            return "C";
        }

        if (accuracy < 35 && accuracy >= 20) {
            return "D";
        }

        if (accuracy < 20) {
            return "E";
        }

        return "E";
    }
}