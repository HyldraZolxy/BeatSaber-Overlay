import { Globals }  from "./globals";
import { Tools }    from "./tools";

export class ScoreSaber {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools: Tools;

    constructor() {
        this._tools = new Tools();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async getPlayerInfo(playerID: string): Promise<Globals.I_scoreSaberPlayerJSON> {
        return await this._tools.getMethod(Globals.SCORESABER_API_PROXY_URI + "/?playerID=" + playerID);
    }
}

export class BeatLeader {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools: Tools;

    constructor() {
        this._tools = new Tools();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async getPlayerInfo(playerID: string): Promise<Globals.I_beatLeaderPlayerJSON> {
        return await this._tools.getMethod(Globals.BEATLEADER_API_PROXY_URI + "/?playerID=" + playerID);
    }

    public async getSongInfo(songHash: string): Promise<Globals.I_beatLeaderSongJSON> {
        return await this._tools.getMethod(Globals.BEATLEADER_SONG_API_PROXY_URI + "/?hash=" + songHash);
    }
}

export class BeatSaver {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _tools: Tools;

    constructor() {
        this._tools = new Tools();
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public async getSongInfo(songHash: string): Promise<Globals.I_beatSaverSongJSON> {
        return await this._tools.getMethod(Globals.BEATSAVER_API_URI + "/maps/hash/" + songHash);
    }
}