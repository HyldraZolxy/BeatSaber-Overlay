import { Globals }  from "./globals";
import { Tools }    from "./tools";

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
                $("link[rel=stylesheet][href*=\"./skins/" + this._tools.moduleStringConverter(module) + "\"]").remove();

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

    public refreshUI(data: Globals.I_playerCard | Globals.I_songCard | Globals.I_songCardUpdate | Globals.I_leaderboard, module: Globals.E_MODULES): void {
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
                                if      (value === Globals.E_SCORING_SYSTEM.SCORESABER) $("#logoLeaderboardPlayer").css("background-image", "url('../../../pictures/scoresaber_icon_32x32.png')");
                                else if (value === Globals.E_SCORING_SYSTEM.BEATLEADER) $("#logoLeaderboardPlayer").css("background-image", "url('../../../pictures/beatleader_icon_32x32.png')");
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
                                if      (value === Globals.E_SCORING_SYSTEM.SCORESABER) $("#logoLeaderboardSong").css("background-image", "url('../../../pictures/scoresaber_icon_32x32.png')");
                                else if (value === Globals.E_SCORING_SYSTEM.BEATLEADER) $("#logoLeaderboardSong").css("background-image", "url('../../../pictures/beatleader_icon_32x32.png')");
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

                    case Globals.E_MODULES.LEADERBOARD:
                        break;
                }
            }
        }
    }
    public refreshUIMap(data: Map<number, Globals.I_leaderboardPlayer>, module: Globals.E_MODULES): void {
        for (let [key, value] of data) {
            let elementRow = $("#row-" + key);

            switch (module) {
                case Globals.E_MODULES.LEADERBOARD:
                    for (let [keyValue, valueValue] of Object.entries(value)) {
                        let elementClass = $("." + keyValue);

                        switch (keyValue) {
                            case "Position":
                            case "Score":
                                elementRow.find(elementClass).text(valueValue);
                                break;
                            case "Accuracy":
                                elementRow.find(elementClass).text((<number>valueValue * 100).toFixed(2));
                                break;
                            case "MissCount":
                                break;
                        }
                    }
                    break;
            }
        }
    }

    public moduleScale(module: Globals.E_MODULES, position: number, scale: number): void {
        let element = $("#" + this._prefix(module));

        element.css("transform-origin", this._tools.positionStringConverter(position).replace(/(-)/g, " "));
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
        const element = $(".missGroup");

        if (display)    element.css("display", "block");
        else            element.css("display", "none");
    }
    public bigBSR(bigBSR: boolean, skin: string): void {
        const element = $("#bsrKey");

        if (bigBSR) {
            if (skin === "default")     element.css("font-size", "1.4em");
            if (skin === "freemium")    element.css("font-size", "1em");
            if (skin === "reselim")     element.css("font-size", "1.2em");
        } else {
            if (skin === "default")     element.css("font-size", "1em");
            if (skin === "freemium")    element.css("font-size", "0.6em");
            if (skin === "reselim")     element.css("font-size", "0.7em");
        }
    }

    ////////////////////////////////
    // Public Leaderboard Methods //
    ////////////////////////////////
    public createRow(playerLUID: number, player: Globals.I_leaderboardPlayer, localPlayer: number, playerNumber: number, playerRender: number): void {
        const elementLd = $("#leaderboardTable");

        if (elementLd.find("#row-" + playerLUID).length) return;

        elementLd.append('<tr id="row-' + playerLUID + '" class="joined">'
                            + '<td class="Position ion-pound">' + player.Position + '</td>'
                            + '<td class="avatar">'
                                + '<div class="innerAvatar"></div>'
                            + '</td>'
                            + '<td class="UserName">' + player.UserName + '</td>'
                            + '<td class="Score">' + player.Score + '</td>'
                            + '<td class="Accuracy">' + player.Accuracy * 100 + '</td>'
                            + '<td class="fcMiss ion-android-checkmark-circle"> FC</td>'
                        + '</tr>'
        );

        const elementRow = $("#row-" + playerLUID);
        elementRow.find(".innerAvatar").css("background-image", "url('" + player.UserAvatar + "')");

        if (playerLUID === localPlayer) elementRow.find(".pseudo").addClass("localPlayer");

        (playerNumber > playerRender) ? this.createSeparatorRow() : this.deleteSeparatorRow();
    }
    public deleteRow(playerLUID: number, playerNumber: number, playerRender: number): void {
        const elementLd = $("#leaderboardTable");
        const elementRow = $("#row-" + playerLUID);

        if (!elementLd.find(elementRow).length) return;

        elementRow.addClass("leaved");
        elementRow.empty().remove();

        (playerNumber > playerRender) ? this.createSeparatorRow() : this.deleteSeparatorRow();
    }
    public createSeparatorRow(): void {
        const elementLd = $("#leaderboardTable");

        if (elementLd.find("#row-separator").length) return;

        elementLd.append('<tr id="row-separator">'
                            + '<td class="separator ion-more">'
                                + '<div class="playerLocalName localPlayer"></div>'
                            + '</td>'
                        + '</tr>'
        );
    }
    public deleteSeparatorRow(): void {
        const elementLd = $("#leaderboardTable");
        const elementRow = $("#row-separator");

        if (!elementLd.find(elementRow).length) return;

        elementRow.empty().remove();
    }

    public sortingRows(player: Map<number, Globals.I_leaderboardPlayer>, localPlayer: number, playerNumber: number, playerRender: number, positionCSS: number): void {
        const elementLd = $("#leaderboardTable");
        const positionCSSString = [Globals.E_POSITION.TOP_LEFT, Globals.E_POSITION.TOP_RIGHT].includes(positionCSS) ? "top" : "bottom";
        let iteration = 0;
        let rowTotalHeight = 0;

        for (let [key, value] of player) {
            iteration++;

            if (elementLd.find("#row-" + key).length) {
                let elementRow = $("#row-" + key);

                if (value.Spectating) {
                    elementRow.css("display", "none");
                    iteration--;
                    continue;
                }

                if (positionCSSString === "top") {
                    if (elementLd.find("#row-separator").length) $("#row-separator").css("bottom", "");

                    elementRow.css("bottom", "");
                } else {
                    if (elementLd.find("#row-separator").length) $("#row-separator").css("top", "");

                    elementRow.css("top", "");
                }

                if (playerRender > 1) {
                    if (iteration < playerRender || (iteration === playerRender && playerRender > playerNumber)) {
                        this.deleteSeparatorRow();

                        elementRow.css("display", "inline-flex");
                        elementRow.css(positionCSSString, rowTotalHeight);

                        rowTotalHeight += elementRow.height()! + 3;
                    } else if (iteration === playerRender && playerRender < playerNumber) {
                        this.createSeparatorRow();

                        const elementSeparatorRow = $("#row-separator");

                        elementSeparatorRow.css(positionCSSString, rowTotalHeight);
                        rowTotalHeight += elementSeparatorRow.height()! + 3;

                        elementRow.css("display", "none");
                    } else if (iteration > playerRender && iteration !== playerNumber) {
                        elementRow.css("display", "none");
                    } else if (iteration === playerNumber) {
                        elementRow.css("display", "inline-flex");
                        elementRow.css(positionCSSString, rowTotalHeight);

                        rowTotalHeight += elementRow.height()! + 3;
                    }
                } else {
                    if (localPlayer !== key) elementRow.css("display", "none");
                    else {
                        elementRow.css("display", "inline-flex");
                        elementRow.css(positionCSSString, rowTotalHeight);

                        if (playerNumber > 1) {
                            if (!elementLd.find("#row-separator").length) {
                                this.createSeparatorRow();
                                rowTotalHeight += $("#row-separator").height()! + 3;
                            }
                        } else this.deleteSeparatorRow();
                    }
                }
            }

            if (localPlayer === key) {
                if (elementLd.find("#row-separator").length) {
                    const elementLocalPlayer = $(".playerLocalName");

                    if (iteration > playerRender && iteration < playerNumber)   elementLocalPlayer.addClass("ion-pound").text(value.Position + " " + value.UserName);
                    else                                                        elementLocalPlayer.removeClass("ion-pound").text("");
                }
            }
        }
    }

    public joinClass(key: number, value: Globals.I_leaderboardPlayer) {
        const element = $("#row-" + key);

        if (value.Joined)   element.removeClass("joined").addClass("joined");
        else                element.removeClass("joined");
    }
    public missClass(key: number, value: Globals.I_leaderboardPlayer) {
        const element = $("#row-" + key);

        if (value.Missed)   element.removeClass("miss").addClass("miss");
        else                element.removeClass("miss");
    }
    public positionClass(key: number, value: Globals.I_leaderboardPlayer) {
        const element = $("#row-" + key);

        element.removeClass("first second third");

        if (value.Position === 1)   element.addClass("first");
        if (value.Position === 2)   element.addClass("second");
        if (value.Position === 3)   element.addClass("third");
    }

    public missCalculation(key: number, value: Globals.I_leaderboardPlayer) {
        const elementMiss = $("#row-" + key).find(".fcMiss");

        elementMiss.removeClass("ion-android-checkmark-circle ion-android-cancel")

        if (value.MissCount === 0)  elementMiss.addClass("ion-android-checkmark-circle").text(" FC");
        else                        elementMiss.addClass("ion-android-cancel").text(" " + value.MissCount);
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
        const element = $("#games-setup");

        if (display)    element.addClass("hidden");
        else            element.removeClass("hidden");
    }
    public makeElementActive(element?: JQuery): void {
        $("li").removeClass("active");
        if (element !== undefined) element.addClass("active");
    }
}