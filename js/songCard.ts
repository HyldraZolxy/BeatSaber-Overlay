import { Globals } from "./global.js";
import { Template } from "./template.js";
import { BeatSaver } from "./beatSaver.js";

export class SongCard {

    ///////////////
    // @INSTANCE //
    ///////////////
    private static _instance: SongCard;

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _template: Template;
    private _beatSaver: BeatSaver;

    /////////////////////
    // PUBLIC VARIABLE //
    /////////////////////
    public songCardData: Globals.I_songCard = {
        disabled: false,
        alwaysDisplayed: false,
        needUpdate: false,
        position: "bottom-left",
        skin: "default",
        scale: 1.0,

        started: false,
        inProgress: false,
        paused: false,
        finished: false,

        displayMiss: false,

        cover: "https://eu.cdn.beatsaver.com/280378d7157542f5b160e8a464f0dcfdc3a1de56.jpg",
        title: "Love yiff!",
        subTitle: "Subtitle",
        mapper: "Yasu",
        author: "Camellia",

        bsrKey: "2319e",
        hashMap: "280378d7157542f5b160e8a464f0dcfdc3a1de56",
        bpm: 272,

        difficulty: "Expert+",
        difficultyClass: "ExpertPlus",

        ranked: false,
        qualified: false,
        pp: 0,

        time: 137000,
        totalTime: 274000,
        timeToLetters: "2:17",
        totalTimeToLetters: "4:24",
        timeToPercentage: 50,

        accuracy: 69.69,
        accuracyToLetters: "A",
        accuracyToLetterClass: "a",

        score: "124,256",
        combo: 234,
        miss: 2,

        health: 100,

        speedModifier: 1
    };

    constructor() {
        this._template = new Template();
        this._beatSaver = new BeatSaver();

        this.timerSong();
    }

    //////////////////////
    // PRIVATE FUNCTION //
    //////////////////////
    private timerSong(): void {
        setInterval(() => {
            if (this.songCardData.disabled
                || this.songCardData.paused
                || !this.songCardData.inProgress)
                return;

            if (!this.songCardData.started) {
                this.songCardData.time = 0;
                this.songCardData.totalTime = 0;
                this.songCardData.timeToLetters = "0:00";
                this.songCardData.timeToPercentage = 0;
                return;
            }

            if (this.songCardData.finished) {
                this.songCardData.time = this.songCardData.totalTime;
                this.songCardData.timeToLetters = this.timeToLetters(this.songCardData.time);
                this.songCardData.timeToPercentage = 100;
                return;
            }

            if (this.songCardData.inProgress) {
                this.songCardData.time += (100 * this.songCardData.speedModifier);
                this.songCardData.timeToLetters = this.timeToLetters(this.songCardData.time);
                this.songCardData.timeToPercentage = this.timeToPercentage();
            }
        }, Globals.MS_TIMER);
    }

    private accuracyToLetter(): "A" | "SS" | "S" | "B" | "C" | "D" | "E" {
        if (this.songCardData.accuracy >= 90)
            return "SS";

        if (this.songCardData.accuracy < 90 && this.songCardData.accuracy >= 80)
            return "S";

        if (this.songCardData.accuracy < 80 && this.songCardData.accuracy >= 65)
            return "A";

        if (this.songCardData.accuracy < 65 && this.songCardData.accuracy >= 50)
            return "B";

        if (this.songCardData.accuracy < 50 && this.songCardData.accuracy >= 35)
            return "C";

        if (this.songCardData.accuracy < 35 && this.songCardData.accuracy >= 20)
            return "D";

        if (this.songCardData.accuracy < 20)
            return "E";

        return "E";
    }

    private accuracyToLetterClass(): "a" | "ss" | "s" | "b" | "c" | "de" {
        if (["SS"].includes(this.songCardData.accuracyToLetters))
            return "ss";

        if (["S"].includes(this.songCardData.accuracyToLetters))
            return "s";

        if (["A"].includes(this.songCardData.accuracyToLetters))
            return "a";

        if (["B"].includes(this.songCardData.accuracyToLetters))
            return "b";

        if (["C"].includes(this.songCardData.accuracyToLetters))
            return "c";

        if (["D", "E"].includes(this.songCardData.accuracyToLetters))
            return "de";

        return "de";
    }

    private timeToLetters(time: number): string {
            let minutes = Math.floor((time / 1000) / 60).toFixed(0);
            let seconds = ((time / 1000) % 60).toFixed(0);

            if (+(seconds) < 10) {
                seconds = "0" + seconds;
            }

            return minutes + ":" + seconds;
    }

    private timeToPercentage(): number {
        return Math.min(this.songCardData.time / this.songCardData.totalTime) * 100;
    }

    private async updateSongInfo(): Promise<void> {
        if (this.songCardData.disabled
            || !this.songCardData.needUpdate)
            return;

        this.songCardData.needUpdate = false;
        this.songCardData.totalTimeToLetters = this.timeToLetters(this.songCardData.totalTime);
        const data = await this._beatSaver.getSongInfo(this.songCardData.hashMap);

        if (data.error !== undefined) {
            this.songCardData.ranked = false;
            this.songCardData.qualified = false;
            this.songCardData.bsrKey = "NotFound";
            return;
        }

        this.songCardData.cover = data.versions[0].coverURL;
        this.songCardData.ranked = data.ranked;
        this.songCardData.qualified = (data.ranked) ? false : data.qualified;
        this.songCardData.bsrKey = data.id;
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async loadSkin(skinName: string): Promise<void> {
        if (this.songCardData.disabled)
            return;

        if (skinName !== undefined)
            await this._template.loadSkin(Globals.E_MODULES.SONGCARD, skinName);
    }

    public refreshSongCard(): void {
        this.updateSongInfo().then(() => {
            this.songCardData.accuracyToLetters = this.accuracyToLetter();
            this.songCardData.accuracyToLetterClass = this.accuracyToLetterClass();

            this._template.refreshUI(this.songCardData, Globals.E_MODULES.SONGCARD);
            this._template.moduleScale(Globals.E_MODULES.SONGCARD, this.songCardData.position, this.songCardData.scale);
            this._template.moduleCorners(Globals.E_MODULES.SONGCARD, this.songCardData.position);

            this._template.stopOrStart(this.songCardData.started, this.songCardData.paused);
            this._template.missDisplay(this.songCardData.displayMiss);

            /* Plugin details */
            if (this.songCardData.skin === "reselim")
                this._template.timerToCircleBar(this.songCardData.timeToPercentage);

            if (this.songCardData.skin === "dietah")
                this._template.missChanger(this.songCardData.miss);
        });
    }

    /////////////
    // GETTERS //
    /////////////
    public static get Instance(): SongCard {
        return this._instance || (this._instance = new this());
    }
}