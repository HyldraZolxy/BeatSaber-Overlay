import { Globals }  from "../globals.js";
import { Tools }    from "./tools.js";

// JSON object always send by Proxy or API
interface I_JSONMessageFromAPI {
    errorMessage: string; // Provided by API or the proxy
    error       : string; // Provided by BeatSaver API
}

export interface I_scoreSaberPlayerJSON extends I_JSONMessageFromAPI {
    name            : string; // Player name
    profilePicture  : string; // Player avatar
    country         : string; // Player country (FR, US, UK, JP, etc ...)
    countryRank     : number; // Player rank in his country
    rank            : number; // Player rank in the world
    pp              : number; // Player pp (Nice :smirk:)
}
export interface I_beatLeaderPlayerJSON extends I_JSONMessageFromAPI {
    name        : string; // Player name
    avatar      : string; // Player avatar
    country     : string; // Player country (FR, US, UK, JP, etc ...)
    countryRank : number; // Player rank in his country
    rank        : number; // Player rank in the world
    pp          : number; // Player pp (Nice :smirk:)
}

export interface I_beatSaverSongJSON extends I_JSONMessageFromAPI {
    id          : string; // BSR Key
    name        : string; // Song name include "Song name" and "Song sub name"

    /// WARNING: Qualified and Ranked can be true at the same time ! If it appends, use qualified, not ranked
    qualified   : boolean; // Song is qualified ?
    ranked      : boolean; // Song is ranked ?

    metadata: {
        songName        : string; // Song name
        songSubName     : string; // Song sub name
        levelAuthorName : string; // Mapper name
        songAuthorName  : string; // Author name

        bpm             : number; // BPM of the song
        duration        : number; // Duration length of the song
    };

    versions: [{
        coverURL : string; // Song cover
    }];
}
export interface I_beatLeaderSongJSON extends I_JSONMessageFromAPI {
    author      : string;           // Author of the song
    mapper      : string;           // Mapper of the song
    name        : string;           // Name of the song
    subName     : string;           // Sub Name of the song
    bpm         : number;           // BPM of the song
    coverImage  : string;           // Cover of the song (URI)
    createdTime : string;           // Timestamp of when the map if created
    description : string | null;    // Description of the map
    downloadUrl : string;           // Download URI (.zip)
    hash        : string;           // Hash of the map
    id          : string;           // BSRKey of the map
    mapperId    : number;           // Mapper ID (Identification)
    tags        : string | null;    // Tags of the map (Like "Speed", "Acc", etc ...)
    uploadTime  : number;           // Timestamp of when the map is uploaded

    difficulties: I_beatLeaderSongArrayJSON[]; // See below interface I_beatLeaderSongArrayJSON
}
interface I_beatLeaderSongArrayJSON {
    bombs           : number; // How many bombs in the map
    difficultyName  : string; // Name of the difficulty
    duration        : number; // Duration of the song
    id              : number; // ID of the difficulty of the song
    maxScore        : number; // Max score possible of the song
    mode            : number; // ID Mode of the difficulty of the song ("Standard", "Lawless", etc ...)
    modeName        : string; // Name Mode of the difficulty of the song ("Standard", "Lawless", etc ...)
    njs             : number; // NJS of the map
    nominatedTime   : number; // ???
    notes           : number; // How many notes in the map
    nps             : number; // How many nps in the map

    /// WARNING: QualifiedTime and RankedTime can be 0 when stars can be more than 0 (I see that from old BL ranked)
    qualifiedTime   : number; // When the map is qualified
    rankedTime      : number; // When the map is Ranked
    stars           : number; // How many stars is the map

    status          : number; // ???
    type            : number; // ID Type of the map ???
    value           : number; // ???
    walls           : number; // How many walls in the map

    modifierValues: {         // MODIFIERS score value (How it can change the final score on the leaderboard, can be positive or negative)
        da          : number; // Disappearing arrows
        fs          : number; // Faster song
        gn          : number; // Ghost notes
        modifierId  : number; // ???
        na          : number; // No arrows
        nb          : number; // No bombs
        nf          : number; // No fail
        no          : number; // No obstacles
        pm          : number; // Pro mode
        sa          : number; // Strict angles
        sc          : number; // Strict cut
        sf          : number; // ???
        ss          : number; // ???
    };
}

export interface I_audioTripSong extends I_JSONMessageFromAPI {
    coverLink: string;
}

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
    public async getPlayerInfo(playerID: string): Promise<I_scoreSaberPlayerJSON> {
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
    public async getPlayerInfo(playerID: string): Promise<I_beatLeaderPlayerJSON> {
        return await this._tools.getMethod(Globals.BEATLEADER_API_PROXY_URI + "/?playerID=" + playerID);
    }

    public async getSongInfo(songHash: string): Promise<I_beatLeaderSongJSON> {
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
    public async getSongInfo(songHash: string): Promise<I_beatSaverSongJSON> {
        return await this._tools.getMethod(Globals.BEATSAVER_API_URI + "/maps/hash/" + songHash);
    }
}

export class AudioTripSong {

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
    public async getSongInfo(songHash: string): Promise<I_audioTripSong> {
        return await this._tools.getMethod(Globals.AUDIO_TRIP_SONG_PROXY + "/?hash=" + songHash);
    }
}