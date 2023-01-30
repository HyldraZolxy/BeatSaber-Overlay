import { BSPlusLeaderboard } from "../games/beatSaber/bsPlusLeaderboard";

export class DebugLeaderboard {

    //////////////////////
    // @Class Variables //
    //////////////////////
    private _bsPlusLeaderboard: BSPlusLeaderboard;

    ///////////////////////
    // Private Variables //
    ///////////////////////
    private localUserID         = "";
    private roomLeaved          = false;
    private playerNumber        = 30;
    private playerTotalNumber   = 0;
    private loopTimer           : NodeJS.Timeout | undefined;

    private playerIdGenerator = (): string => {
        let playerId = "";

        for (let i = 0; i < 17; i++) {
            playerId += (Math.floor(Math.random() * 10)).toString();
        }

        return playerId;
    }
    private scoreGenerator = (): number => {
        return Math.floor(Math.random() * 922);
    }
    private accGenerator = (): number => {
        return Math.floor(Math.random() * 100) / 100;
    }

    constructor() {
        this._bsPlusLeaderboard = new BSPlusLeaderboard();
    }

    /////////////////////
    // Private Methods //
    /////////////////////
    private roomJoin(): void {
        this.roomLeaved = false;

        let dataHandshake = {
            _type           : "handshake",
            ProtocolVersion : 1,
            GameVersion     : "1.27.0",
            LocalUserName   : "Player #1",
            LocalUserID     : this.localUserID
        }

        this._bsPlusLeaderboard.dataParser(JSON.stringify(dataHandshake));

        let data = {
            _type       : "event",
            _event      : "RoomJoined",
            RoomState   : "None"
        };

        this._bsPlusLeaderboard.dataParser(JSON.stringify(data));
    }
    private roomLeave(): void {
        this.roomLeaved = true;

        let data = {
            _type       : "event",
            _event      : "RoomLeaved",
            RoomState   : "None"
        };

        this._bsPlusLeaderboard.dataParser(JSON.stringify(data));
    }
    private roomState(): void {
        let data = {
            _type       : "event",
            _event      : "RoomState",
            RoomState   : "Playing"
        }

        this._bsPlusLeaderboard.dataParser(JSON.stringify(data));
    }

    private playerJoin(playersLUID: number): void {
        let data = {
            _type       : "event",
            _event      : "PlayerJoined",
            RoomState   : "None",
            PlayerJoined: {
                LUID        : playersLUID,
                UserID      : (playersLUID === 1) ? this.localUserID : this.playerIdGenerator(),
                UserName    : "Player #" + playersLUID,
                Spectating  : false
            }
        };

        this.playerTotalNumber++;
        this._bsPlusLeaderboard.dataParser(JSON.stringify(data));
    }
    private playerScore() {
        for (let i = 1; i <= this.playerTotalNumber; i++) {
            const randomFailed = !!Math.floor(Math.random() * 2);

            let accuracy    = this.accGenerator();
            let score       = this.scoreGenerator();
            let combo       = score > 50 ? 1 : 0;
            let miss        = score < 50 ? 1 : 0;

            if (miss === 1) accuracy = (accuracy / 2) / 2;

            let data = {
                _type       : "event",
                _event      : "Score",
                RoomState   : "None",
                Score       : {
                    LUID        : i,
                    Score       : score,
                    Accuracy    : accuracy,
                    Combo       : combo,
                    MissCount   : miss,
                    Failed      : randomFailed,
                    Deleted     : false,
                    Missed      : miss === 1
                }
            };

            this._bsPlusLeaderboard.dataParser(JSON.stringify(data));
        }
    }

    private loop() {
        if (this.roomLeaved) {
            clearInterval(this.loopTimer);
            return;
        }

        this.roomState();

        this.loopTimer = setInterval(() => {
            this.playerScore();
        }, 2000);
    }

    ////////////////////
    // Public Methods //
    ////////////////////
    public play(playerUserId: string) {
        this.localUserID = playerUserId;
        this.roomJoin();

        for (let i = 1; i <= this.playerNumber; i++) {
            this.playerJoin(i);
        }

        this.loop();
    }
    public stop() {
        this.roomLeave();
        this.loop();
        this.playerTotalNumber = 0;
    }
}