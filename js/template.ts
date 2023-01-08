import { Globals } from "./globals";
import { Tools } from "./tools";

export class Template {
    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools: Tools;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private _prefix(module: Globals.E_MODULES) {
        switch (module) {
            case 0:     return "playerCard-overlay";
            case 1:     return "songCard-overlay";
            case 2:     return "leaderboard-overlay";
            case 3:     return "menu-setup";
            case 4:     return "options-setup";
            default:    return "";
        }
    }

    constructor() {
        this._tools = new Tools();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async loadSkin(module: Globals.E_MODULES, skinName: string, fileName?: string): Promise<unknown> {
        return new Promise(resolve => {
            let skin        = (Globals.SKIN_AVAILABLE[module].hasOwnProperty(skinName) ? Globals.SKIN_AVAILABLE[module][skinName] : Globals.SKIN_AVAILABLE[module]["default"]);
            let skinPath    = skin[0];

            if (!fileName) {
                $("link[rel=stylesheet][href*=\"./skins/" + module + "\"]").remove();

                for (let i = 1; i < skin.length; i++) {
                    if (skin[i] === "style.css") {
                        $("head").append("<link rel=\"stylesheet\" href=\"" + skinPath + skin[i] + "\" type=\"text/css\" />");
                        continue;
                    }

                    if (module === Globals.E_MODULES.MENU_SETUP || module === Globals.E_MODULES.OPT_SETUP) {
                        if (skin[i] === "indexMenu.html" || skin[i] === "indexOptions.html") {
                            $("#" + this._prefix(module)).load(skinPath + skin[i]);
                        }
                    } else {
                        $("#" + this._prefix(module)).load(skinPath + skin[i]);
                    }
                }
            } else if (skin.includes(fileName)) $("#" + this._prefix(module)).load(skinPath + fileName);

            setTimeout(() => resolve(""), 5);
        });
    }

    public refreshUI(data: Globals.I_playerCard | Globals.I_songCard | Globals.I_songCardUpdate, module: Globals.E_MODULES): void {
        if (data.endedUpdate) {
            for (let[key, value] of Object.entries(data)) {
                let elementID       = $("#" + key);
                let elementClass    = $("." + key)

                switch (module) {
                    case Globals.E_MODULES.PLAYERCARD:
                        switch (key) {
                            case "playerName":
                            case "playerCountry":
                            case "topCountry":
                            case "topWorld":
                            case "performancePoint":
                                elementID.text(value);
                                break;

                            case "playerFlag":
                            case "avatar":
                                elementID.css("background-image", "url('" + value + "')");
                                break;

                            case "scoringSystem":
                                if      (value === Globals.E_SCORING_SYSTEM.SCORESABER) $("#logoLeaderboard").css("background-image", "url('../../../pictures/scoresaber_icon_32x32.png')");
                                else if (value === Globals.E_SCORING_SYSTEM.BEATLEADER) $("#logoLeaderboard").css("background-image", "url('../../../pictures/beatleader_icon_32x32.png')");
                                break;
                        }
                        break;

                    case Globals.E_MODULES.SONGCARD:
                        switch (key) {
                            case "title":
                            case "subTitle":
                            case "mapper":
                            case "author":
                            case "difficulty":
                            case "bsrKey":
                            case "bpm":
                            case "timeToLetters":
                            case "totalTimeToLetters":
                            case "accuracy":
                            case "accuracyToLetters":
                            case "score":
                            case "combo":
                            case "miss":
                                elementID.text(value);
                                break;

                            case "cover":
                                elementID.css("background-image", "url('" + value + "')");
                                break;

                            case "scoringSystem":
                                if      (value === Globals.E_SCORING_SYSTEM.SCORESABER) $("#logoLeaderboard").css("background-image", "url('../../../pictures/scoresaber_icon_32x32.png')");
                                else if (value === Globals.E_SCORING_SYSTEM.BEATLEADER) $("#logoLeaderboard").css("background-image", "url('../../../pictures/beatleader_icon_32x32.png')");
                                break;

                            case "qualified":
                                elementID.css("display", (value) ? "inline-block" : "none");
                                break;
                            case "ranked":
                                elementID.css("display", (value) ? "inline-block" : "none");
                                break;

                            case "accuracyToLetterClass":
                                elementClass.removeClass("ss s a b c de").addClass(value as string);
                                break;
                            case "difficultyClass":
                                elementClass.removeClass("ExpertPlus Expert Hard Normal Easy").addClass(value as string);
                                break;

                            case "health":
                            case "timeToPercentage":
                                elementID.css("width", value + "%");
                                break;
                        }
                        break;
                }
            }
        }
    }

    public moduleScale(module: Globals.E_MODULES, position: number, scale: number): void {
        let element = $("#" + this._prefix(module));

        element.css("transform-origin", this._tools.positionStringConverter(position));
        element.css("transform", "scale(" + scale + ")");
    }
    public moduleCorners(module: Globals.E_MODULES, position: number): void {
        let element = $("#" + this._prefix(module));

        element.removeClass(Globals.cssPosition.join(" "));
        element.addClass(this._tools.positionStringConverter(position));
    }
    public modulePosition(module: Globals.E_MODULES, pos_x: number, pos_y: number): void {
        let element = $("#" + this._prefix(module));

        element.css("margin", "calc(2% + " + pos_x + "px) calc(2% + " + pos_y + "px)");
    }

    public stopOrStart(module: Globals.E_MODULES, started: boolean, paused: boolean): void {
        let element = $("#" + this._prefix(module));

        element.removeClass("stop");
        if (!started || paused) element.addClass("stop");
    }

    public moduleToggleDisplay(playerCardData: Globals.I_playerCard, songCardData: Globals.I_songCard): void {
        let playerCardElement   = $("#" + this._prefix(Globals.E_MODULES.PLAYERCARD));
        let songCardElement     = $("#" + this._prefix(Globals.E_MODULES.SONGCARD));

        if (playerCardData.disabled)    playerCardElement.addClass("hidden");
        if (songCardData.disabled)      songCardElement.addClass("hidden");

        if (!songCardData.display)
            if (!songCardData.alwaysEnabled)    songCardElement.addClass("hidden");
            else                                songCardElement.addClass("reduced");

        if (!playerCardData.display)
            if (!playerCardData.alwaysEnabled)  playerCardElement.addClass("hidden");
            else                                playerCardElement.addClass("reduced");

        if (songCardData.display) {
            songCardElement.removeClass("hidden");
            songCardElement.removeClass("reduced");
        }

        if (playerCardData.display) {
            playerCardElement.removeClass("hidden");
            playerCardElement.removeClass("reduced");
        }
    }

    public missDisplay(display: boolean): void {
        if (display)    $(".missGroup").css("display", "block");
        else            $(".missGroup").css("display", "none");
    }

    /////////////////////////
    // Public Skin Methods //
    /////////////////////////
    public timerToCircleBar(percentage: number): void {
        const circumference = 30 * Math.PI * 2;
        $("#progress").css("stroke-dashoffset", ((1 - (percentage / 100)) * circumference) + "px");
    }

    public missChanger(missNumber: number): void {
        let element = $("#miss");

        if (missNumber === 0) {
            element.removeClass("ion-android-checkmark-circle ion-android-cancel");
            element.addClass("ion-android-checkmark-circle");
            element.text("FC");
        } else {
            element.removeClass("ion-android-checkmark-circle ion-android-cancel");
            element.addClass("ion-android-cancel");
        }
    }

    //////////////////////////
    // Public Setup Methods //
    //////////////////////////
    public hideSetup(display: boolean): void {
        if (display)    $("#games-setup").addClass("hidden");
        else            $("#games-setup").removeClass("hidden");
    }
    public makeElementActive(element?: JQuery): void {
        $("li").removeClass("active");
        if (element !== undefined) element.addClass("active");
    }
    public makeHidden(displayed: boolean): void {
        if (!displayed) $("#setup").removeClass("hidden");
        else            $("#setup").addClass("hidden");
    }
}