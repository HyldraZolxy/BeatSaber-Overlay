import { Globals }      from "../../globals.js";
import { PlayerCard }   from "../../modules/playerCard.js";
import { SongCard }     from "../../modules/songCard.js";

interface I_adofaiObject {
    type: "default" | "loadLevel" | "levelImage" | "update";

    data: undefined | {
        "previewImage"              : string;   // Base64 encoded image
        "previewImageExtension"     : string;   // Extension of the image

        "paused"                    : boolean;  // Paused ?
        "noFail"                    : boolean;  // Nofail enabled ?
        "planets"                   : number;   // ???
        "checkpoints"               : number;   // Checkpoints used
        "hitMode"                   : string;   // The hit mode (lenient, normal, strict)
        "deaths"                    : number;   // Number of death
        "attempts"                  : number;   // Number of attempts
        "speed"                     : number;   // Actual speed
        "percentComplete"           : number;   // Percent complete
        "tooEarly"                  : number;   // Number of too early hits
        "veryEarly"                 : number;   // Number of very early hits
        "earlyPerfect"              : number;   // Number of early perfect hits
        "perfect"                   : number;   // Number of perfect hits
        "latePerfect"               : number;   // Number of late perfect hits
        "veryLate"                  : number;   // Number of very late hits
        "tooLate"                   : number;   // Number of too late hits
        "tileBPM"                   : number;   // ???
        "currentBPM"                : number;   // Current bpm
        "startProgress"             : number;   // ???
        "recKPS"                    : number;   // ???

        "calibration_i"             : number;   // ???
        "calibration_v"             : number;   // ???
        "beatNumber"                : number;   // ???
        "angleData"                 : number[]; // ???
        "artist"                    : string;   // Song author
        "artistLinks"               : string;   // Link of the author
        "artistPermission"          : string;   // Author permission
        "author"                    : string;   // Mapper
        "backgroundColor"           : string;   // Background color of the map
        "bgFitScreen"               : boolean;  // Fit screen ?
        "bgImage"                   : string;   // Background image (URI ??? BaseEncoded ???)
        "bgImageColor"              : string;   // Background image color ???
        "bgLockRot"                 : boolean;  // ???
        "bgLooping"                 : boolean;  // ???
        "bgParallax"                : string;   // ???
        "bgShowDefaultBGIfNoImage"  : boolean;  // ???
        "bgTiling"                  : boolean;  // ???
        "bgVideo"                   : string;   // ???
        "bpm"                       : number;   // BPM of the song
        "camPosition"               : string;   // ???
        "camRelativeTo"             : string;   // ???
        "camRotation"               : number;   // ???
        "camZoom"                   : number;   // ???
        "countdownTicks"            : number;   // ???
        "difficulty"                : number;   // ???
        "floorIconOutlines"         : boolean;  // ???
        "fullCaption"               : string;   // ???
        "fullCaptionTagged"         : string;   // ???
        "Hash"                      : string;   // ???
        "hitsound"                  : string;   // ???
        "hitsoundVolume"            : number;   // ???
        "isOldLevel"                : boolean;  // Is the map is in old version ?
        "legacyFlash"               : boolean;  // ???
        "levelDesc"                 : string;   // Description of the map
        "levelTags"                 : string[]; // Maybe tech, speed, etc ... ???
        "offset"                    : number;   // ???
        "oldCameraFollowStyle"      : boolean;  // ???
        "pathData"                  : string;   // ???
        "pitch"                     : number;   // ???
        "planetEase"                : string;   // ???
        "planetEaseParts"           : number;   // ???
        "previewIcon"               : string;   // ???
        "previewIconColor"          : string;   // ???
        "previewSongDuration"       : number;   // ???
        "previewSongStart"          : number;   // ???
        "requiredDLC"               : string;   // ???
        "secondaryTrackColor"       : string;   // ???
        "seizureWarning"            : boolean;  // ???
        "separateCountdownTime"     : boolean;  // ???
        "song"                      : string;   // Song title
        "songFilename"              : string;   // ???
        "specialArtistType"         : string;   // ???
        "stickToFloors"             : boolean;  // ???
        "trackAnimation"            : string;   // ???
        "trackBeatsAhead"           : number;   // ???
        "trackBeatsBehind"          : number;   // ???
        "trackColor"                : string;   // ???
        "trackColorAnimDuration"    : number;   // ???
        "trackColorPulse"           : string;   // ???
        "trackColorType"            : string;   // ???
        "trackDisappearAnimation"   : string;   // ???
        "trackPulseLength"          : number;   // ???
        "trackStyle"                : string;   // ???
        "unscaledSize"              : number;   // ???
        "version"                   : number;   // Map version
        "volume"                    : number;   // Actual volume used in game
    };
}

export class Adofai {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _playerCard : PlayerCard;
    private _songCard   : SongCard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private helloEvent = true;

    constructor() {
        this._playerCard    = PlayerCard.Instance;
        this._songCard      = SongCard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(): void {
        if (this.helloEvent) {
            console.log("%cAudica v?? | WebSocket v??", Globals.INFO_LOG);
            console.log("\n\n");

            this.helloEvent = false;
        }
    }

    private eHandler(dataEvent: I_adofaiObject): void {
        switch(dataEvent.type) {
            case "loadLevel":
                this.mapInfoParser(dataEvent);

                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = true;
                    this._songCard.songCardData.started     = true;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardData.finished    = false;
                }
                break;

            case "levelImage":
                this.coverInfoParser(dataEvent);
                break;

            case "update":
                this.infoParser(dataEvent);
                this.scoreParser(dataEvent);
                break;

            case "default":
                if (!this._songCard.songCardData.disabled) {
                    this._songCard.songCardData.display     = false;
                    this._songCard.songCardData.started     = false;
                    this._songCard.songCardData.inProgress  = false;
                    this._songCard.songCardData.finished    = true;
                }
                break;
        }

        this.eHandshake();
    }

    private mapInfoParser(dataEvent: I_adofaiObject): void {
        this._songCard.songCardData.needUpdate = false;

        this._songCard.songCardPerformance.time         = 0;
        this._songCard.songCardPerformance.accuracy     = 100;
        this._songCard.songCardPerformance.score        = "0";
        this._songCard.songCardPerformance.death        = 0;
        this._songCard.songCardPerformance.checkpoint   = 0;
        this._songCard.songCardPerformance.retry        = 0;
        this._songCard.songCardPerformance.te           = 0;
        this._songCard.songCardPerformance.ve           = 0;
        this._songCard.songCardPerformance.ep           = 0;
        this._songCard.songCardPerformance.pp           = 0;
        this._songCard.songCardPerformance.lp           = 0;
        this._songCard.songCardPerformance.vl           = 0;
        this._songCard.songCardPerformance.tl           = 0;

        this._songCard.songCardData.title           = <string>dataEvent.data?.song.replace(/<\/?[^>]+(>|$)/g, "");
        this._songCard.songCardData.subTitle        = "";
        this._songCard.songCardData.mapper          = (dataEvent.data?.author !== "") ? "[" + dataEvent.data?.author.trim().replace(/<\/?[^>]+(>|$)/g, "") + "]" : "";
        this._songCard.songCardData.author          = <string>dataEvent.data?.artist.replace(/<\/?[^>]+(>|$)/g, "");
        this._songCard.songCardData.bpm             = <number>dataEvent.data?.bpm;
        this._songCard.songCardData.difficulty      = this.getDifficulty(<number>dataEvent.data?.difficulty);
        this._songCard.songCardData.difficultyClass = this.getDifficulty(<number>dataEvent.data?.difficulty);
        this._songCard.songCardData.hashMap         = "";
        this._songCard.songCardData.bsrKey          = "";
        this._songCard.songCardData.totalTime       = 100;
        this._songCard.songCardData.speedModifier   = 1;
    }
    private coverInfoParser(dataEvent: I_adofaiObject): void {
        this._songCard.songCardData.cover = (dataEvent.data?.previewImage !== null) ? "data:image/" + dataEvent.data?.previewImageExtension + ";base64," + dataEvent.data?.previewImage : "./pictures/default/notFound.jpg";
    }

    private getDifficulty(difficulty: number): string {
        switch(difficulty) {
            case 10:                            return "Hardcore";
            case 9: case 8: case 7:             return "Expert";
            case 6: case 5: case 4:             return "Hard";
            case 3: case 2: case 1: default:    return "Easy";
        }
    }
    private infoParser(dataEvent: I_adofaiObject): void {
        this._songCard.songCardPerformance.time = <number>dataEvent.data?.percentComplete * 100;
        this._songCard.timerSongManual();
    }
    private scoreParser(dataEvent: I_adofaiObject): void {
        this._songCard.songCardPerformance.death        = <number>dataEvent.data?.deaths;
        this._songCard.songCardPerformance.checkpoint   = <number>dataEvent.data?.checkpoints;
        this._songCard.songCardPerformance.retry        = <number>dataEvent.data?.attempts;
        this._songCard.songCardPerformance.te           = <number>dataEvent.data?.tooEarly;
        this._songCard.songCardPerformance.ve           = <number>dataEvent.data?.veryEarly;
        this._songCard.songCardPerformance.ep           = <number>dataEvent.data?.earlyPerfect;
        this._songCard.songCardPerformance.pp           = <number>dataEvent.data?.perfect;
        this._songCard.songCardPerformance.lp           = <number>dataEvent.data?.latePerfect;
        this._songCard.songCardPerformance.vl           = <number>dataEvent.data?.veryLate;
        this._songCard.songCardPerformance.tl           = <number>dataEvent.data?.tooLate;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: I_adofaiObject = JSON.parse(data);
        this.eHandler(dataParsed);
    }
}