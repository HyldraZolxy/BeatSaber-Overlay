import { Globals } from "./global.js";
import { Tools } from "./tools.js";

export class BeatSaver {

    /////////////////////
    // @CLASS VARIABLE //
    /////////////////////
    private _tools: Tools;

    constructor() {
        this._tools = new Tools();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async getSongInfo(songHash: string): Promise<Globals.I_beatSaverSongJSON> {
        return await this._tools.getMethod(Globals.BEATSAVER_API_URL + "/maps/hash/" + songHash);
    }
}