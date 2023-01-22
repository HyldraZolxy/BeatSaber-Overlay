import { Globals }                  from "./globals";
import { Template }                 from "./template";

export class Leaderboard {

    ///////////////
    // @Instance //
    ///////////////
    private static _instance: Leaderboard;

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _template:      Template;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private _leaderboardMap: Map<number, Globals.I_leaderboardPlayer>;

    //////////////////////
    // Public Variables //
    //////////////////////
    public leaderboardGames: Globals.I_gamesSupported = {
        g_beatSaber     : true,
        g_synthRiders   : false,
        g_audioTrip     : false,
        g_audica        : false
    };
    public leaderboardData: Globals.I_leaderboard = {
        disabled            : false,
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

    private playerAvatar(player: Globals.I_bsPlusLeaderboardObject) {
        if (player.PlayerJoined.UserID === null || player.PlayerJoined.UserID === "") return "https://cdn.scoresaber.com/avatars/oculus.png";

        return "https://cdn.scoresaber.com/avatars/" + player.PlayerJoined.UserID + ".jpg";
    }
    private playerAccuracy(playerAccuracy: number, playerDeleted: boolean): number {
        return playerAccuracy * (playerDeleted ? 0.01 : 1);
    }

    private sortLeaderboard(sortBy: keyof Globals.I_leaderboardPlayer, sortOrder: "asc" | "desc") {
        let rankPosition = 1;

        const leaderboardSorted = new Map([...this._leaderboardMap].sort((a, b) => sortOrder === "asc" ? (a[1][sortBy] as any) - (b[1][sortBy] as any) : (b[1][sortBy] as any) - (a[1][sortBy] as any)));

        for (const [key, value] of leaderboardSorted) {
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
        if (!this.leaderboardGames.g_beatSaber || this.leaderboardData.disabled) {
            this.leaderboardData.disabled = true;
            return;
        }

        if (this.leaderboardData.roomState === "None") return;
        if (this.leaderboardData.roomState === "Playing" || this.leaderboardData.roomState === "Results") this.sortLeaderboard("Accuracy", "desc");

        this._template.refreshUI(this.leaderboardData, Globals.E_MODULES.LEADERBOARD);

        this._template.moduleScale(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.position, this.leaderboardData.scale);
        this._template.moduleCorners(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.position);
        this._template.modulePosition(Globals.E_MODULES.LEADERBOARD, this.leaderboardData.pos_x, this.leaderboardData.pos_y);
    }

    public addPlayer(player: Globals.I_bsPlusLeaderboardObject) {
        this._leaderboardMap.set(player.PlayerJoined.LUID, {
            UserID      : player.PlayerJoined.UserID,
            UserName    : player.PlayerJoined.UserName,
            UserAvatar  : this.playerAvatar(player),

            Position    : 0,
            Score       : 0,
            Accuracy    : 1,
            Combo       : 0,
            MissCount   : 0,

            Joined      : true,
            Leaved      : false,
            Failed      : false,
            Deleted     : false,
            Missed      : false,
            Spectating  : player.PlayerJoined.Spectating
        });

        (player.PlayerJoined.UserName === this.leaderboardData.playerLocalName) ? this.leaderboardData.playerLocalLUID = player.PlayerJoined.LUID : null;
    }
    public deletePlayer(playerLUID: number) {
        this._leaderboardMap.delete(playerLUID);
    }
    public updatePlayer(player: Globals.I_bsPlusLeaderboardObject, event: "PlayerUpdated" | "Score") {
        const playerLUID = (event === "PlayerUpdated") ? player.PlayerUpdated.LUID : (event === "Score") ? player.Score.LUID : null;

        Object.entries(player).forEach(entry => {
            let [key, value] = entry;

            if (key === "LUID") return;
            if (playerLUID !== null) {
                if (key === "MissCount" && this._leaderboardMap.get(playerLUID)?.MissCount !== value) this._leaderboardMap.get(playerLUID)!.Missed = true;
                if (key === "Deleted") this._leaderboardMap.get(playerLUID)!.Accuracy = this.playerAccuracy(this._leaderboardMap.get(playerLUID)!.Accuracy, value);

                this._leaderboardMap.get(playerLUID)![key] = value;
            }
        });
    }

    public roomLeaved() {
        this._leaderboardMap.forEach((value: Globals.I_leaderboardPlayer, key) => {
            this.deletePlayer(key);
        });
    }

    /////////////
    // Getters //
    /////////////
    public static get Instance(): Leaderboard {
        return this._instance || (this._instance = new this());
    }
}