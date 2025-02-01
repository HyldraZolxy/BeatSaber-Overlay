// Primary WebSocket (Solo Data)
export interface WebsocketPrimaryMessage extends HandshakeEvent_P, GameStateEvent_P, PauseEvent_P, ResumeEvent_P {
    _type : 'handshake' | 'event';
    _event: 'gameState' | 'mapInfo' | 'resume' | 'score' | 'pause';

    // handshake
    // See HandshakeEvent_P

    // _event
    // See GameStateEvent_P

    // _event: mapInfo
    mapInfoEvent: MapInfoEvent_P;

    // _event: score
    scoreEvent: ScoreEvent_P;

    // _event: pause
    // See PauseEvent_P

    // _event: resume
    // See ResumeEvent_P
}

export interface HandshakeEvent_P {
    protocolVersion : number;
    gameVersion     : string;
    playerPlatformId: string;
    playerName      : string;
}
export interface GameStateEvent_P {
    gameStateChanged: 'none' | 'Menu' | 'Playing';
}
export interface MapInfoEvent_P {
    name    : string;
    sub_name: string;
    artist  : string;
    mapper  : string; // Can be empty
    coverRaw: string; // Base64 (data:image/png;base64)
    BPM     : number;
    duration: number; // seconds

    BSRKey  : string; // Always empty
    level_id: string; // raw level_id (custom_level_)

    characteristic: string;
    difficulty    : string;

    PP: number; // Always empty

    time          : number;
    timeMultiplier: number;
}
export interface ScoreEvent_P {
    score        : number;
    accuracy     : number; // 0 to 1
    combo        : number;
    missCount    : number;
    currentHealth: number; // 0 to 1

    time: number; // seconds
}
export interface PauseEvent_P {
    pauseTime: number; // seconds
}
export interface ResumeEvent_P {
    resumeTime: number; // seconds
}

// Secondary WebSocket (Multiplayer Data)
export interface WebsocketSecondaryMessage extends HandshakeEvent_S, RoomStateEvent_S {
    _type : 'handshake' | 'event';
    _event: 'RoomJoined' | 'RoomLeaved' | 'RoomState' | 'PlayerJoined' | 'PlayerLeaved' | 'PlayerUpdated' | 'Score';

    // handshake
    // See HandshakeEvent_S

    // _event RoomState
    // See RoomStateEvent_S

    // _event PlayerJoined
    playerJoinedEvent: PlayerJoinedEvent_S;

    // _event PlayerUpdated
    playerUpdatedEvent: PlayerUpdatedEvent_S;

    // _event: Score
    scoreEvent: ScoreEvent_S;
}

export interface HandshakeEvent_S {
    ProtocolVersion : number;
    GameVersion     : string;
    LocalUserID     : string;
    LocalUserName   : string;
}
export interface RoomStateEvent_S {
    RoomState: 'SelectingSong' | 'WarmingUp' | 'Playing' | 'Results';
}
export interface PlayerJoinedEvent_S {
    LUID    : number;
    UserID  : string;
    UserName: string;

    Spectating: boolean;
}
export interface PlayerUpdatedEvent_S {
    LUID: number;

    Spectating: boolean;
}
export interface ScoreEvent_S {
    LUID: number;

    Score    : number;
    Accuracy : number; // 0 to 1
    Combo    : number;
    MissCount: number;

    Failed : boolean;
    Deleted: boolean;

    Spectating: boolean;
}