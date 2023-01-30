import { Globals }                      from "../globals";
import { Template }                     from "../system/template";
import { I_bsPlusLeaderboardObject }    from "../games/beatSaber/bsPlusLeaderboard";

export interface I_leaderboard {
    disabled            : boolean;                                                          // Is leaderboard enabled?
    display             : boolean;                                                          // Is leaderboard displayed?
    needUpdate          : boolean;                                                          // Is leaderboard need update?
    endedUpdate         : boolean;                                                          // Is leaderboard updated?
    skin                : string;                                                           // Skin of the leaderboard
    position            : number;                                                           // Position of the leaderboard
    scale               : number;                                                           // Scale of the leaderboard
    pos_x               : number;                                                           // Pos X of the leaderboard
    pos_y               : number;                                                           // Pos Y of the leaderboard
    playerRendering     : number;                                                           // Number of row rendered on the leaderboard

    playerLocalId       : string;                                                           // Local player ID
    playerLocalLUID     : number;                                                           // Local player UID
    playerLocalName     : string;                                                           // Local player name
    playerLocalPosition : number;                                                           // Local player position in the leaderboard

    roomState           : "None" | "SelectingSong" | "WarmingUp" | "Playing" | "Results";   // State of the room
}
export interface I_leaderboardPlayer {
    [key: string]       : string|number|boolean;

    UserID      : string;   // Player ID (ScoreSaber)
    UserName    : string;   // Player name
    UserAvatar  : string;   // Player avatar (ScoreSaber link)

    Position    : number;   // Player position in the leaderboard
    Score       : number;   // Player score
    Accuracy    : number;   // Player accuracy
    Combo       : number;   // Player combo
    MissCount   : number;   // Player miss count

    Joined      : boolean;  // Is player just joined?
    Leaved      : boolean;  // Is player just left?
    Failed      : boolean;  // Is player failed?
    Deleted     : boolean;  // Is player quit the map?
    Missed      : boolean;  // Is player just miss a note ?
    Spectating  : boolean;  // Is player spectating?
}

export class Leaderboard {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Leaderboard;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _template: Template;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private readonly _leaderboardMap: Map<number, I_leaderboardPlayer>;

    //////////////////////
    // Public Variables //
    //////////////////////
    public leaderboardGames: Globals.I_gamesSupported = {
        beatSaber     : true,
        synthRiders   : false,
        audioTrip     : false,
        audica        : false
    };
    public leaderboardData: I_leaderboard = {
        disabled            : true,
        display             : false,
        needUpdate          : true,
        endedUpdate         : false,
        skin                : "default",
        position            : 0,
        scale               : 1.0,
        pos_x               : 0,
        pos_y               : 0,
        playerRendering     : 5,

        playerLocalId       : "0",
        playerLocalLUID     : 0,
        playerLocalName     : "",
        playerLocalPosition : 0,

        roomState           : "None"
    };

    constructor() {
        this._template          = new Template();
        this._leaderboardMap    = new Map();
    }

    private playerAvatar(playerUserID: string): string {
        if (playerUserID === null || playerUserID === "") return "https://cdn.scoresaber.com/avatars/oculus.png";

        return "https://cdn.scoresaber.com/avatars/" + playerUserID + ".jpg";
    }
    private playerAccuracy(playerAccuracy: number, playerDeleted: boolean): number {
        return playerAccuracy * (playerDeleted ? 0.01 : 1);
    }

    private sortLeaderboard(sortBy: keyof I_leaderboardPlayer, sortOrder: "asc" | "desc"): Map<number, I_leaderboardPlayer> {
        let rankPosition = 1;

        const leaderboardSorted = new Map([...this._leaderboardMap].sort((a, b) => sortOrder === "asc" ? (a[1][sortBy] as any) - (b[1][sortBy] as any) : (b[1][sortBy] as any) - (a[1][sortBy] as any)));

        for (let [key, value] of leaderboardSorted) {
            if (value.Accuracy === 0 && value.Score === 0 || value.Accuracy === 1 && value.Score  === 0) {
                this._leaderboardMap.get(key)!.Position = 0;
                continue;
            }

            this._leaderboardMap.get(key)!.Position = rankPosition;

            rankPosition++;
        }

        return leaderboardSorted;
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public refreshLeaderboard(): void {
        let leaderboardSorted = this._leaderboardMap;

        if (!this.leaderboardGames.beatSaber || this.leaderboardData.disabled) {
            this.leaderboardData.disabled = true;
            return;
        }

        if (this.leaderboardData.roomState === "None") return;
        if (this.leaderboardData.roomState === "Playing" || this.leaderboardData.roomState === "Results") leaderboardSorted = this.sortLeaderboard("Accuracy", "desc");

        this._template.refreshUIMap(this._leaderboardMap, Globals.E_MODULES.LEADERBOARD);

        this._template.sortingRows(leaderboardSorted, this.leaderboardData.playerLocalLUID, this._leaderboardMap.size, this.leaderboardData.playerRendering, this.leaderboardData.position);

        this._template.moduleScale(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.position, this.leaderboardData.scale);
        this._template.moduleCorners(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.position);
        this._template.modulePosition(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.pos_x, this.leaderboardData.pos_y);

        for (let [key, value] of this._leaderboardMap) {
            this._template.joinClass(key, value);
            this._template.missClass(key, value);
            this._template.positionClass(key, value);

            this._leaderboardMap.get(key)!.Joined = false;
            this._leaderboardMap.get(key)!.Missed = false;
        }
    }

    public addPlayer(player: I_bsPlusLeaderboardObject): void {
        this._leaderboardMap.set(player.PlayerJoined.LUID, {
            UserID      : player.PlayerJoined.UserID,
            UserName    : player.PlayerJoined.UserName,
            UserAvatar  : this.playerAvatar(player.PlayerJoined.UserID),

            Position    : 0,
            Score       : 0,
            Accuracy    : 0,
            Combo       : 0,
            MissCount   : 0,

            Joined      : true,
            Leaved      : false,
            Failed      : false,
            Deleted     : false,
            Missed      : false,
            Spectating  : player.PlayerJoined.Spectating
        });

        if (player.PlayerJoined.UserName === this.leaderboardData.playerLocalName) this.leaderboardData.playerLocalLUID = player.PlayerJoined.LUID;

        setTimeout(() => {
            this._template.createRow(player.PlayerJoined.LUID,
                this._leaderboardMap.get(player.PlayerJoined.LUID)!,
                this.leaderboardData.playerLocalLUID,
                this._leaderboardMap.size,
                this.leaderboardData.playerRendering,
                this.leaderboardData.skin
            );
        }, Globals.MS_TIMER);
    }
    public deletePlayer(playerLUID: number): void {
        this._leaderboardMap.delete(playerLUID);
        this._template.deleteRow(playerLUID, this._leaderboardMap.size, this.leaderboardData.playerRendering);
    }
    public updatePlayer(player: I_bsPlusLeaderboardObject["PlayerUpdated"] | I_bsPlusLeaderboardObject["Score"], event: "PlayerUpdated" | "Score"): void {
        const playerLUID = (event === "PlayerUpdated" || event === "Score") ? player.LUID : null;

        Object.entries(player).forEach(entry => {
            let [key, value] = entry;

            if (key === "LUID") return;
            if (playerLUID !== null) {
                if (key === "MissCount" && this._leaderboardMap.get(playerLUID)?.MissCount !== value) this._leaderboardMap.get(playerLUID)!.Missed = true;
                if (key === "Deleted") this._leaderboardMap.get(playerLUID)!.Accuracy = this.playerAccuracy(this._leaderboardMap.get(playerLUID)!.Accuracy, <boolean>value);

                this._leaderboardMap.get(playerLUID)![key] = value;
            }
        });
    }

    public roomLeaved(): void {
        for (let [key] of this._leaderboardMap) {
            this.deletePlayer(key);
        }
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Leaderboard {
        return this._instance || (this._instance = new this());
    }
}