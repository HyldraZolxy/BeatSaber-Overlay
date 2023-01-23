import { Globals }      from "./globals";
import { Leaderboard }  from "./leaderboard";

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
    private eHandshake(dataHandshake: Globals.I_bsPlusLeaderboardObject): void {
        console.log("%cBeat Saber " + dataHandshake.GameVersion + " | Protocol Leaderboard Version " + dataHandshake.ProtocolVersion, Globals.SUCCESS_LOG);
        console.log("\n\n");

        this._leaderboard.leaderboardData.playerLocalId = dataHandshake.LocalUserID;
        this._leaderboard.leaderboardData.playerLocalName = dataHandshake.LocalUserName;
    }

    private eHandler(dataEvent: Globals.I_bsPlusLeaderboardObject): void {
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
        let dataParsed: Globals.I_bsPlusLeaderboardObject = JSON.parse(data);

        if (dataParsed._type === "handshake")   this.eHandshake(dataParsed);
        if (dataParsed._type === "event")       this.eHandler(dataParsed);
    }
}