import { Globals }                              from "../globals.js";
import { Tools }                                from "./tools.js";
import { I_leaderboard, I_leaderboardPlayer }   from "../modules/leaderboard.js";

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

    /////////////////////
    // Private Methods //
    /////////////////////
    private async filesRows(URI: string): Promise<string> {
        return await fetch(URI, {
            method: "GET"
        }).then(content => content.text());
    }
    private assocRowsData(data: string, player: I_leaderboardPlayer, playerLUID: number): string {
        let content = data;
        content = content.replace("{playerLUID}",       String(playerLUID));
        content = content.replace("{playerPosition}",   String(player.Position));
        content = content.replace("{playerUserName}",   player.UserName);
        content = content.replace("{playerScore}",      String(player.Score));
        content = content.replace("{playerAccuracy}",   String(player.Accuracy * 100));

        return content;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async loadSkin(module: Globals.E_MODULES, skinName: string, fileName?: string): Promise<unknown> {
        return new Promise(resolve => {
            let skinPath!: string;

            let skin = this._tools.getModuleSkin(this._tools.moduleStringConverter(module), skinName);
            if (skin) skinPath = skin[0];

            if (!fileName) {
                if (skin) {
                    $("link[rel=stylesheet][href*=\"./skins/" + this._tools.moduleStringConverter(module) + "\"]").remove();

                    for (let i = 1; i < skin.length; i++) {
                        if (skin[i] === "style.css") {
                            $("head").append("<link rel=\"stylesheet\" href=\"" + skinPath + skin[i] + "\" type=\"text/css\" />");
                            continue;
                        }

                        if (    skin[i] === "index.html"
                            ||  skin[i] === "indexMenu.html"
                            ||  skin[i] === "indexOptions.html"
                        ) $("#" + this._prefix(module)).load(skinPath + skin[i]);
                    }
                }
            } else {
                if (skin && fileName && skin.includes(fileName)) $("#" + this._prefix(module)).load(skinPath + fileName);
            }

            setTimeout(() => resolve(""), 5);
        });
    }

    public refreshUI(data: Globals.I_playerCard | Globals.I_songCard | Globals.I_songCardUpdate | I_leaderboard, module: Globals.E_MODULES): void {
        if (data.endedUpdate) {
            for (let [key, value] of Object.entries(data)) {
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
                            case "timeToPercentageLetter":
                            case "accuracy":
                            case "accuracyToLetters":
                            case "score":
                            case "combo":
                            case "miss":
                                // Adofai
                            case "te":
                            case "ve":
                            case "ep":
                            case "pp":
                            case "lp":
                            case "vl":
                            case "tl":
                                elementID.text(value);
                                break;

                                // Adofai
                            case "death":
                            case "checkpoint":
                            case "retry":
                                elementID.text(" " + value);
                                break;

                            case "cover":
                                elementID.css("background-image", "url('" + value + "')");
                                break;

                            case "scoringSystem":
                                if      (value === Globals.E_SCORING_SYSTEM.SCORESABER) $("#logoLeaderboardSong").css("background-image", "url('../../../pictures/scoresaber_icon_32x32.png')");
                                else if (value === Globals.E_SCORING_SYSTEM.BEATLEADER) $("#logoLeaderboardSong").css("background-image", "url('../../../pictures/beatleader_icon_32x32.png')");
                                break;

                            case "qualified":
                            case "ranked":
                                elementID.css("display", (value) ? "inline-block" : "none");
                                break;

                            case "accuracyToLetterClass":
                                elementClass.removeClass("ss s a b c de").addClass(value);
                                break;
                            case "difficultyClass":
                                elementClass.removeClass("ExpertPlus Expert Hard Normal Easy Beginner Regular Cardio Débutant Standard Avancé Advanced Master Hardcore").addClass(value);
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
    public refreshUIMap(data: Map<number, I_leaderboardPlayer>, module: Globals.E_MODULES): void {
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
                                elementRow.find(elementClass).text((Number(valueValue) * 100).toFixed(2));
                                break;
                            case "MissCount":
                                this.missCalculation(key, value);
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
        element.css("transform",        "scale(" + scale + ")");

        if (module === Globals.E_MODULES.LEADERBOARD) {
            element = $("#leaderboardTable");

            element.css("transform-origin", '');
            element.css("transform",        '');
        }
    }
    public moduleScaleLeaderboard(module: Globals.E_MODULES, position: number, scale: number): void {
        let element = $("#" + this._prefix(module));

        element.css("transform-origin", '');
        element.css("transform",        '');

        element = $("#leaderboardTable");

        element.css("transform-origin", this._tools.positionStringConverter(position).replace(/(-)/g, " "));
        element.css("transform",        "scale(" + scale + ")");
    }
    public moduleCorners(module: Globals.E_MODULES, position: number): void {
        let element = $("#" + this._prefix(module));

        element.removeClass(Globals.cssPosition.join(" "));
        element.addClass(this._tools.positionStringConverter(position));
    }
    public modulePosition(module: Globals.E_MODULES, pos_x: number, pos_y: number, margin: boolean): void {
        let element = $("#" + this._prefix(module));
        let marginFetch = (margin) ? '2% + ' : '';

        element.css("margin", "calc(" + marginFetch + pos_x + "px) calc(" + marginFetch + pos_y + "px)");
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
    public async createRow(playerLUID: number, player: I_leaderboardPlayer, localPlayer: number, playerNumber: number, playerRender: number, skinName: string): Promise<void> {
        const elementLd = $("#leaderboardTable");

        if (elementLd.find("#row-" + playerLUID).length) return;

        let skin = this._tools.getModuleSkin(this._tools.moduleStringConverter(Globals.E_MODULES.LEADERBOARD), skinName);

        if (skin?.includes("rows.html")) {
            let content = await this.filesRows(skin[0] + "rows.html");

            elementLd.append(this.assocRowsData(content, player, playerLUID));
        } else {
            skin = this._tools.getModuleSkin(this._tools.moduleStringConverter(Globals.E_MODULES.LEADERBOARD), "default");

            if (skin) {
                let content = await this.filesRows(skin[0] + "rows.html");
                elementLd.append(this.assocRowsData(content, player, playerLUID));
            }
        }

        const elementRow = $("#row-" + playerLUID);
        elementRow.find(".innerAvatar").css("background-image", "url('" + player.UserAvatar + "')");

        if (playerLUID === localPlayer) elementRow.find(".UserName").addClass("localPlayer");

        (playerNumber > playerRender) ? this.createSeparatorRow() : this.deleteSeparatorRow();
    }
    public deleteRow(playerLUID: number, playerNumber: number, playerRender: number): void {
        const elementLd     = $("#leaderboardTable");
        const elementRow    = $("#row-" + playerLUID);

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
                                + '<p class="playerLocalName localPlayer"></p>'
                            + '</td>'
                        + '</tr>'
        );
    }
    public deleteSeparatorRow(): void {
        const elementLd     = $("#leaderboardTable");
        const elementRow    = $("#row-separator");

        if (!elementLd.find(elementRow).length) return;

        elementRow.empty().remove();
    }

    public sortingRows(player: Map<number, I_leaderboardPlayer>, localPlayer: number, playerNumber: number, playerRender: number, positionCSS: number, skinName: string, battleRoyal: boolean, scale: number): void {
        const elementLd         = $("#leaderboardTable");
        const positionCSSString = [Globals.E_POSITION.TOP_LEFT, Globals.E_POSITION.TOP_RIGHT].includes(positionCSS) ? "top" : "bottom";
        let iteration           = 0;
        let rowTotalHeight      = 0;
        let marginBottom        = (skinName === "default") ? 3 : 15;
        let playerHideBefore = playerNumber - 15;

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

                if (battleRoyal) {
                    if (iteration >= 16) {
                        elementRow.css("right", this.getMargin(scale) + '%');
                        elementRow.css("left", '');
                    } else {
                        elementRow.css("left", 0);
                        elementRow.css("right", '');
                    }
                } else {
                    elementRow.css("left", 0);
                    elementRow.css("right", '');
                }

                if (battleRoyal) {
                    if (iteration < 16) {
                        elementRow.css("display", "inline-flex");
                        elementRow.css(positionCSSString, rowTotalHeight);

                        rowTotalHeight += elementRow.height()! + marginBottom;
                    }

                    if (iteration === 16) {
                        this.createSeparatorRow();

                        const elementSeparatorRow = $("#row-separator");

                        elementSeparatorRow.css(positionCSSString, rowTotalHeight);
                        rowTotalHeight += elementSeparatorRow.height()! + marginBottom;

                        rowTotalHeight = 0;

                        if (playerNumber <= playerRender) {
                            elementRow.css("display", "inline-flex");
                            elementRow.css(positionCSSString, rowTotalHeight);

                            rowTotalHeight += elementRow.height()! + marginBottom;
                        } else {
                            elementRow.css("display", "none");
                        }
                    }

                    if (iteration > 16 && iteration < playerHideBefore && playerNumber > 16) {
                        elementRow.css("display", "none");
                    } else if (iteration > 16 && iteration >= playerHideBefore) {
                        elementRow.css("display", "inline-flex");
                        elementRow.css(positionCSSString, rowTotalHeight);

                        rowTotalHeight += elementRow.height()! + marginBottom;
                    }

                    if (playerNumber <= playerRender) {
                        this.deleteSeparatorRow();
                    }

                    elementRow.removeClass('FourthLastPlayer ThirdLastPlayer SecondLastPlayer LastPlayer');

                    if (playerNumber > 3) {
                        if (iteration === playerNumber-3 && playerNumber > 6) {
                            elementRow.addClass('FourthLastPlayer');
                        }
                        if (iteration === playerNumber-2 && playerNumber > 5) {
                            elementRow.addClass('ThirdLastPlayer');
                        }
                        if (iteration === playerNumber-1 && playerNumber > 4) {
                            elementRow.addClass('SecondLastPlayer');
                        }
                        if (iteration === playerNumber) {
                            elementRow.addClass('LastPlayer');
                        }
                    }

                } else {
                    elementRow.removeClass('FourthLastPlayer ThirdLastPlayer SecondLastPlayer LastPlayer');

                    if (playerRender > 1) {
                        if (iteration < playerRender || (iteration === playerRender && playerRender > playerNumber)) {
                            this.deleteSeparatorRow();

                            elementRow.css("display", "inline-flex");
                            elementRow.css(positionCSSString, rowTotalHeight);

                            rowTotalHeight += elementRow.height()! + marginBottom;
                        } else if (iteration === playerRender && playerRender < playerNumber) {
                            this.createSeparatorRow();

                            const elementSeparatorRow = $("#row-separator");

                            elementSeparatorRow.css(positionCSSString, rowTotalHeight);
                            rowTotalHeight += elementSeparatorRow.height()! + marginBottom;

                            elementRow.css("display", "none");
                        } else if (iteration > playerRender && iteration !== playerNumber) {
                            elementRow.css("display", "none");
                        } else if (iteration === playerNumber) {
                            elementRow.css("display", "inline-flex");
                            elementRow.css(positionCSSString, rowTotalHeight);

                            rowTotalHeight += elementRow.height()! + marginBottom;
                        }
                    } else {
                        if (localPlayer !== key) elementRow.css("display", "none");
                        else {
                            elementRow.css("display", "inline-flex");
                            elementRow.css(positionCSSString, rowTotalHeight);

                            rowTotalHeight += elementRow.height()! + marginBottom;

                            if (playerNumber > 1) {
                                if (!elementLd.find("#row-separator").length) {
                                    this.createSeparatorRow();
                                    rowTotalHeight += $("#row-separator").height()! + marginBottom;
                                } else {
                                    const elementSeparatorRow = $("#row-separator");

                                    elementSeparatorRow.css(positionCSSString, rowTotalHeight);

                                    rowTotalHeight += elementSeparatorRow.height()! + marginBottom;
                                }
                            } else this.deleteSeparatorRow();
                        }
                    }
                }
            }

            if (localPlayer === key) {
                if (elementLd.find("#row-separator").length) {
                    const elementLocalPlayer = $(".playerLocalName");

                    if ((iteration > playerRender || iteration === playerRender)
                        && iteration < playerNumber
                        && playerRender > 1)    elementLocalPlayer.addClass("ion-pound").text(value.Position + " " + value.UserName);
                    else                        elementLocalPlayer.removeClass("ion-pound").text("");
                }
            }
        }
    }

    public joinClass(key: number, value: I_leaderboardPlayer) {
        const element = $("#row-" + key);

        if (value.Joined)   element.removeClass("joined").addClass("joined");
        else                element.removeClass("joined");
    }
    public missClass(key: number, value: I_leaderboardPlayer) {
        const element = $("#row-" + key);

        if (value.Missed)   element.removeClass("miss").addClass("miss");
        else                element.removeClass("miss");
    }
    public positionClass(key: number, value: I_leaderboardPlayer) {
        const element = $("#row-" + key);

        element.removeClass("first second third");

        if (value.Position === 1)   element.addClass("first");
        if (value.Position === 2)   element.addClass("second");
        if (value.Position === 3)   element.addClass("third");
    }

    public missCalculation(key: number, value: I_leaderboardPlayer) {
        const elementMiss = $("#row-" + key).find(".fcMiss");

        elementMiss.removeClass("ion-android-checkmark-circle ion-android-cancel");

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
            element.removeClass("ion-android-checkmark-circle ion-android-cancel fcColor missColor");
            element.addClass("ion-android-checkmark-circle fcColor");
            element.text("FC");
        } else {
            element.removeClass("ion-android-checkmark-circle ion-android-cancel fcColor missColor");
            element.addClass("ion-android-cancel missColor");
        }
    }

    public changeWithPluginUse(module: Globals.E_MODULES, skinName: string, pluginUsed: Globals.WEBSOCKET_MODS): void {
        let elementBase = $("#songCard-overlay");
        switch(module) {
            case Globals.E_MODULES.PLAYERCARD: break;

            case Globals.E_MODULES.SONGCARD:
                switch(skinName) {
                    case "default":
                        switch(pluginUsed) {
                            case Globals.WEBSOCKET_MODS.AUDICA:
                            case Globals.WEBSOCKET_MODS.AUDIOTRIP:
                            case Globals.WEBSOCKET_MODS.SYNTHRIDERS:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#score").css("display", "block");
                                break;
                            case Globals.WEBSOCKET_MODS.ADOFAI:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#score").css("display", "none");
                                elementBase.find("#performanceGroup").css("display", "flex");
                                break;

                            default:
                                elementBase.find("#logoLeaderboardSong").css("display", "block");
                                elementBase.find("#bsrKey").css("display", "block");
                                elementBase.find("#accuracy").css("display", "block");
                                elementBase.find("#score").css("display", "none");
                                elementBase.find("#performanceGroup").css("display", "none");
                                break;
                        }
                        break;
                    case "freemium":
                        switch(pluginUsed) {
                            case Globals.WEBSOCKET_MODS.AUDICA:
                            case Globals.WEBSOCKET_MODS.AUDIOTRIP:
                            case Globals.WEBSOCKET_MODS.SYNTHRIDERS:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#songAccuracyDiv").css("display", "none");
                                elementBase.find("#songAccuracyLetterDiv").css("display", "none");
                                elementBase.find("#bpm").css("display", "none");
                                elementBase.find("#score").css("display", "inline-block");
                                break;
                            case Globals.WEBSOCKET_MODS.ADOFAI:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#songAccuracyDiv").css("display", "none");
                                elementBase.find("#songAccuracyLetterDiv").css("display", "none");
                                elementBase.find("#bpm").css("display", "none");
                                elementBase.find("#score").css("display", "none");
                                elementBase.find("#progression").css("display", "flex");
                                elementBase.find("#hits").css("display", "flex");
                                break;

                            default:
                                elementBase.find("#logoLeaderboardSong").css("display", "block");
                                elementBase.find("#bsrKey").css("display", "inline-block");
                                elementBase.find("#songAccuracyDiv").css("display", "block");
                                elementBase.find("#songAccuracyLetterDiv").css("display", "block");
                                elementBase.find("#bpm").css("display", "inline-block");
                                elementBase.find("#score").css("display", "none");
                                elementBase.find("#progression").css("display", "none");
                                elementBase.find("#hits").css("display", "none");
                                break;
                        }
                        break;
                    case "reselim":
                        switch(pluginUsed) {
                            case Globals.WEBSOCKET_MODS.AUDICA:
                            case Globals.WEBSOCKET_MODS.AUDIOTRIP:
                            case Globals.WEBSOCKET_MODS.SYNTHRIDERS:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#accuracyToLetters").css("display", "none");
                                elementBase.find("#combo").css("display", "none");
                                elementBase.find("#comboText").css("display", "none");
                                elementBase.find("#bpm").css("display", "none");
                                break;
                            case Globals.WEBSOCKET_MODS.ADOFAI:
                                elementBase.find("#logoLeaderboardSong").css("display", "none");
                                elementBase.find("#timeToLetters").css("display", "none");
                                elementBase.find("#timeToPercentageLetter").css("display", "flex");
                                elementBase.find("#bsrKey").css("display", "none");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#accuracyToLetters").css("display", "none");
                                elementBase.find("#combo").css("display", "none");
                                elementBase.find("#comboText").css("display", "none");
                                elementBase.find("#bpm").css("display", "none");
                                elementBase.find("#score").css("display", "none");
                                elementBase.find("#progression").css("display", "flex");
                                elementBase.find("#hits").css("display", "flex");
                                break;

                            default:
                                elementBase.find("#logoLeaderboardSong").css("display", "block");
                                elementBase.find("#timeToLetters").css("display", "flex");
                                elementBase.find("#timeToPercentageLetter").css("display", "none");
                                elementBase.find("#bsrKey").css("display", "inline-block");
                                elementBase.find("#accuracy").css("display", "inline-block");
                                elementBase.find("#accuracyToLetters").css("display", "inline-block");
                                elementBase.find("#combo").css("display", "inline-block");
                                elementBase.find("#comboText").css("display", "inline-block");
                                elementBase.find("#bpm").css("display", "inline-block");
                                elementBase.find("#score").css("display", "block");
                                elementBase.find("#progression").css("display", "none");
                                elementBase.find("#hits").css("display", "none");
                                break;
                        }
                        break;

                    case "dietah":
                        switch(pluginUsed) {
                            case Globals.WEBSOCKET_MODS.AUDICA:
                            case Globals.WEBSOCKET_MODS.AUDIOTRIP:
                                elementBase.find("#bsrKey").val("");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#score").css("display", "block");
                                break;
                            case Globals.WEBSOCKET_MODS.SYNTHRIDERS:
                                elementBase.find("#bsrKey").val("");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#score").css("display", "none");
                                break;
                            case Globals.WEBSOCKET_MODS.ADOFAI:
                                elementBase.find("#bsrKey").val("");
                                elementBase.find("#accuracy").css("display", "none");
                                elementBase.find("#score").css("display", "none");
                                break;

                            default:
                                elementBase.find("#accuracy").css("display", "block");
                                elementBase.find("#score").css("display", "none");
                                break;
                        }
                        break;
                }
                break;
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

    ///////////////////////////
    private getMargin(scale: number) {
        if (scale <= 0.5)  return -100;
        if (scale <= 0.55) return this.interpolate(scale, 0.5,  -100,  0.55, -81.6);
        if (scale <= 0.6)  return this.interpolate(scale, 0.55, -81.6, 0.6,  -66.5);
        if (scale <= 0.65) return this.interpolate(scale, 0.6,  -66.5, 0.65, -53.7);
        if (scale <= 0.7)  return this.interpolate(scale, 0.65, -53.7, 0.7,  -42.8);
        if (scale <= 0.75) return this.interpolate(scale, 0.70, -42.8, 0.75, -33.2);
        if (scale <= 0.8)  return this.interpolate(scale, 0.75, -33.2, 0.8,  -24.9);
        if (scale <= 0.85) return this.interpolate(scale, 0.80, -24.9, 0.85, -17.6);
        if (scale <= 0.9)  return this.interpolate(scale, 0.85, -17.6, 0.9,  -11);
        if (scale <= 0.95) return this.interpolate(scale, 0.9,  -11,   0.95, -5.2);
        if (scale <= 1.0)  return this.interpolate(scale, 0.95, -5.2,  1.0,   0);
        return 0;
    }

    private interpolate(x: number, x1: number, y1: number, x2: number, y2: number) {
        return y1 + ((y2 - y1) * ((x - x1) / (x2 - x1)));
    }
}