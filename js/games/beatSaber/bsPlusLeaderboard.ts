import { Globals }      from "../../globals";
import { Leaderboard }  from "../../modules/leaderboard";

export interface I_bsPlusLeaderboardObject {
    GameVersion     : string;                                                                                                   // Version of Beat Saber
    ProtocolVersion : number;                                                                                                   // Protocol version of the plugin
    LocalUserName   : string;                                                                                                   // Player name
    LocalUserID     : string;                                                                                                   // Player platform ID (ScoreSaber ID here)

    _type           : "handshake" | "event";                                                                                    // Type of the message
    _event          : "RoomJoined" | "RoomLeaved" | "RoomState" | "PlayerJoined" | "PlayerLeaved" | "PlayerUpdated" | "Score";  // Event of the message

    RoomState       : "None" | "SelectingSong" | "WarmingUp" | "Playing" | "Results";                                           // State of the room

    PlayerJoined: {
        LUID        : number;                                                                                                   // Player UID
        UserID      : string;                                                                                                   // Player ID (Platform ID [ScoreSaber])
        UserName    : string;                                                                                                   // Player name
        Spectating  : boolean;                                                                                                  // is Player spectating?
    }

    PlayerLeaved: {
        LUID        : number;                                                                                                   // Player UID
    }

    PlayerUpdated: {
        LUID        : number;                                                                                                   // Player UID
        Spectating  : boolean;                                                                                                  // is Player spectating?
    }

    Score: {
        LUID        : number;                                                                                                   // Player UID
        Score       : number;                                                                                                   // Player score
        Accuracy    : number;                                                                                                   // Player accuracy
        Combo       : number;                                                                                                   // Player combo
        MissCount   : number;                                                                                                   // Player miss count
        Failed      : boolean;                                                                                                  // is player failed the song ?
        Deleted     : boolean;                                                                                                  // is player quit the song ?
    }
}

export class BSPlusLeaderboard {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _leaderboard: Leaderboard;

    constructor() {
        this._leaderboard = Leaderboard.Instance;
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private eHandshake(dataHandshake: I_bsPlusLeaderboardObject): void {
        console.log("%cBeat Saber " + dataHandshake.GameVersion + " | Protocol Leaderboard Version " + dataHandshake.ProtocolVersion, Globals.SUCCESS_LOG);
        console.log("\n\n");

        this._leaderboard.leaderboardData.playerLocalId     = dataHandshake.LocalUserID;
        this._leaderboard.leaderboardData.playerLocalName   = dataHandshake.LocalUserName;
    }

    private eHandler(dataEvent: I_bsPlusLeaderboardObject): void {
        switch(dataEvent._event) {
            case "RoomJoined":
                this._leaderboard.leaderboardData.display = true;
                break;

            case "RoomLeaved":
                this._leaderboard.leaderboardData.display = false;
                this._leaderboard.roomLeaved();
                break;

            case "RoomState":
                this._leaderboard.leaderboardData.roomState = dataEvent.RoomState;
                break;

            case "PlayerJoined":
                this._leaderboard.addPlayer(dataEvent);
                break;
            case "PlayerLeaved":
                this._leaderboard.deletePlayer(dataEvent.PlayerLeaved.LUID);
                break;

            case "PlayerUpdated":
                this._leaderboard.updatePlayer(dataEvent.PlayerUpdated, dataEvent._event);
                break;
            case "Score":
                this._leaderboard.updatePlayer(dataEvent.Score, dataEvent._event);
                break;
        }
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public dataParser(data: string): void {
        let dataParsed: I_bsPlusLeaderboardObject = JSON.parse(data);

        if (dataParsed._type === "handshake")   this.eHandshake(dataParsed);
        if (dataParsed._type === "event")       this.eHandler(dataParsed);
    }
}