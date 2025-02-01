import {WebSocketManager} from '../../websocketsManager.js';
import {LoggerService} from '../../../utils/logger.js';
import {GameStateEvent_P, HandshakeEvent_P, HandshakeEvent_S, MapInfoEvent_P, PauseEvent_P, PlayerJoinedEvent_S, PlayerUpdatedEvent_S, ResumeEvent_P, RoomStateEvent_S, ScoreEvent_P, ScoreEvent_S, WebsocketPrimaryMessage, WebsocketSecondaryMessage} from '../types/beatsaber/bsplus';

export class BsPlusPlugin {
    private readonly key: string;
    private manager     : WebSocketManager;
    private logger      : LoggerService;

    ///TODO: This thing is in "songCard.ts", when the rewrite is done for "songCard.ts", delete that
    private songCardMapInfo: Map<string, MapInfoEvent_P>;
    private songCardStatus: {
        isPlaying: boolean;
        isPaused : boolean;
    } = {
        isPlaying: false,
        isPaused : false,
    };
    private songCardPerformance: {
        time: number;

        score   : number;
        accuracy: number;
        combo   : number;
        miss    : number;

        currentHealth: number;
    } = {
        time: 0,

        score   : 0,
        accuracy: 100,
        combo   : 0,
        miss    : 0,

        currentHealth: 50,
    };
    ///TODO: This thing is in "leaderboardCard.ts", when the rewrite is done for "leaderboardCard.ts", delete that
    private leaderboardCardPlayerInfo: Map<number, PlayerJoinedEvent_S>;
    private leaderboardCardPlayerPerformanceInfo: Map<number, ScoreEvent_S>;
    private leaderboardCardStatus: {
        isJoined: boolean;
        status: RoomStateEvent_S['RoomState'];
    } = {
        isJoined: false,
        status: 'SelectingSong'
    };


    constructor(manager: WebSocketManager) {
        this.manager = manager;
        this.logger  = new LoggerService('debug'); ///TODO: Need a settings for that
        this.key     = 'bsplus';

        // Initialize the WebSocket with plugin-specific message handler
        this.manager.initialize(`${this.key}-primary`, 'ws://192.168.1.153:2947/socket', this.handlePrimaryMessage.bind(this));
        this.manager.initialize(`${this.key}-secondary`, 'ws://192.168.1.153:2948/socket', this.handleSecondaryMessage.bind(this));

        this.songCardMapInfo = new Map();

        this.leaderboardCardPlayerInfo            = new Map();
        this.leaderboardCardPlayerPerformanceInfo = new Map();
    }

    /**
     * Handles incoming messages for the BSPlus SoloData WebSocket.
     * @param message The received WebSocket message.
     */
    private handlePrimaryMessage(message: string): void {
        let messageParsed: WebsocketPrimaryMessage = JSON.parse(message);
        this.routePrimaryMessage(messageParsed);
    }

    private routePrimaryMessage(message: WebsocketPrimaryMessage): void {
        switch(message._type) {
            case 'handshake':
                this.handshakePrimaryMessage(message as HandshakeEvent_P);
                break;
            case 'event':
                switch(message._event) {
                    case 'gameState':
                        this.gameStatePrimaryMessage(message as GameStateEvent_P);
                        break;
                    case 'mapInfo':
                        this.mapInfoPrimaryMessage(message.mapInfoEvent);
                        break;
                    case 'score':
                        this.scorePrimaryMessage(message.scoreEvent);
                        break;
                    case 'pause':
                        this.pausePrimaryMessage(message as PauseEvent_P);
                        break;
                    case 'resume':
                        this.resumePrimaryMessage(message as ResumeEvent_P);
                        break;
                    default:
                        this.logger.warn(`[BsPlusPlugin][Primary] Unknown _event : ${message._event}`);
                        break;
                }
                break;
            default:
                this.logger.warn(`[BsPlusPlugin][Primary] Unknown _type : ${message._type}`);
                break;
        }
    }

    private handshakePrimaryMessage(message: HandshakeEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] Handshake:', message);
        this.logger.info('%c[BSPlus][Primary] Beat Saber v.' + message.gameVersion + ' | Protocol Plugin Version v.' + message.protocolVersion, 'color: green;');
    }
    ///TODO: Finish every function here after SongCard rewrite
    private gameStatePrimaryMessage(message: GameStateEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] GameState:', message);

        switch(message.gameStateChanged) {
            case 'Playing':
                this.resetScorePrimary();
                this.songCardStatus.isPlaying = true;
                // this.playerCard.updateState(false);
                break;
            case 'none':
            case 'Menu':
            default:
                this.songCardStatus.isPlaying = false;
                // this.playerCard.updateState(true);
                break;
        }
    }
    private mapInfoPrimaryMessage(message: MapInfoEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] MapInfo:', message);

        const currentMap = this.songCardMapInfo.get('currentMap');

        if (!currentMap) {
            this.logger.debug('[BSPlus][Primary] No current map, setting current map to new map');
            this.songCardMapInfo.set('currentMap', message);
            return;
        }

        const keys: (keyof MapInfoEvent_P)[] = ['level_id', 'characteristic', 'difficulty'];
        const isSameMap = keys.every((key) => currentMap[key] === message[key]);

        if (isSameMap) {
            this.logger.debug('[BSPlus][Primary] Map is not changed');
            return;
        }

        this.logger.debug('[BSPlus][Primary] Map is changed, copy previous map to current map');
        this.songCardMapInfo.set('previousMap', currentMap);

        this.logger.debug('[BSPlus][Primary] Set current map to new map');
        this.songCardMapInfo.set('currentMap', message);

        this.logger.debug('[BSPlus][Primary] SongsCard:', this.songCardMapInfo);
    }
    private resetScorePrimary(): void {
        this.logger.debug('[BsPlusPlugin][Primary] Reset performance for new map');
        this.songCardPerformance.time = 0;

        this.songCardPerformance.score    = 0;
        this.songCardPerformance.accuracy = 100;
        this.songCardPerformance.combo    = 0;
        this.songCardPerformance.miss     = 0;

        this.songCardPerformance.currentHealth = 50;
    }
    private scorePrimaryMessage(message: ScoreEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] Score:', message);
        this.songCardPerformance.time = message.time;

        this.songCardPerformance.score    = message.score;
        this.songCardPerformance.accuracy = Math.round((message.accuracy * 100 + Number.EPSILON) * 100) / 100;
        this.songCardPerformance.combo    = message.combo;
        this.songCardPerformance.miss     = message.missCount;

        this.songCardPerformance.currentHealth = message.currentHealth * 100;
        this.logger.debug('[BsPlusPlugin][Primary] SongCardPerformance:', this.songCardPerformance);
    }
    private pausePrimaryMessage(message: PauseEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] Pause:', message);
        this.songCardStatus.isPaused  = true;
        this.songCardPerformance.time = message.pauseTime;
    }
    private resumePrimaryMessage(message: ResumeEvent_P): void {
        this.logger.debug('[BsPlusPlugin][Primary] Resume:', message);
        this.songCardStatus.isPaused  = false;
        this.songCardPerformance.time = message.resumeTime;
    }

    /**
     * Handles incoming messages for the BSPlus MultiplayerData WebSocket.
     * @param message The received WebSocket message.
     */
    private handleSecondaryMessage(message: string): void {
        let messageParsed: WebsocketSecondaryMessage = JSON.parse(message);
        this.routeSecondaryMessage(messageParsed);
    }

    private routeSecondaryMessage(message: WebsocketSecondaryMessage): void {
        switch(message._type) {
            case 'handshake':
                this.handshakeSecondaryMessage(message as HandshakeEvent_S);
                break;
            case 'event':
                switch(message._event) {
                    case 'RoomJoined':
                        this.roomJoinedSecondaryMessage(message);
                        break;
                    case 'RoomLeaved':
                        this.roomLeavedSecondaryMessage(message);
                        break;
                    case 'RoomState':
                        this.roomStateSecondaryMessage(message)
                        break;
                    case 'PlayerJoined':
                        this.playerJoinedSecondaryMessage(message.playerJoinedEvent)
                        break;
                    case 'PlayerLeaved':
                        this.playerLeavedSecondaryMessage(message);
                        break;
                    case 'PlayerUpdated':
                        this.playerUpdatedSecondaryMessage(message.playerUpdatedEvent);
                        break;
                    case 'Score':
                        this.scoreSecondaryMessage(message.scoreEvent);
                        break;
                    default:
                        this.logger.debug(`[BsPlusPlugin][Secondary] Unknown _event : ${message._event}`);
                        break;
                }
                break;
            default:
                this.logger.debug(`[BsPlusPlugin][Secondary] Unknown _type : ${message._type}`);
                break;
        }
    }

    private handshakeSecondaryMessage(message: HandshakeEvent_S): void {
        this.logger.debug('[BsPlusPlugin][Secondary] Handshake:', message);
        this.logger.info('%c[BSPlus][Secondary] Beat Saber v.' + message.GameVersion + ' | Protocol Plugin Version v.' + message.ProtocolVersion, 'color: green;');
    }
    ///TODO: Finish every function here after LeaderboardCard rewrite
    private roomJoinedSecondaryMessage(message: WebsocketSecondaryMessage): void {
        this.logger.debug('[BsPlusPlugin][Secondary] RoomJoined:', message);
        this.leaderboardCardStatus.isJoined = true;
    }
    private roomLeavedSecondaryMessage(message: WebsocketSecondaryMessage): void {
        this.logger.debug('[BsPlusPlugin][Secondary] RoomLeaved:', message);
        this.leaderboardCardStatus.isJoined = false;
    }
    private roomStateSecondaryMessage(message: RoomStateEvent_S): void {
        this.logger.debug('[BsPlusPlugin][Secondary] RoomState:', message);
        this.leaderboardCardStatus.status = message.RoomState;
        switch(message.RoomState) {
            case 'WarmingUp':
                this.resetScoreSecondary();
                break;
            default:
                break;
        }
    }
    private playerJoinedSecondaryMessage(message: PlayerJoinedEvent_S): void {
        this.logger.debug('[BsPlusPlugin][Secondary] PlayerJoined:', message);
        this.leaderboardCardPlayerInfo.set(message.LUID, message);
    }
    private playerLeavedSecondaryMessage(message: WebsocketSecondaryMessage): void {
        this.logger.debug('[BsPlusPlugin][Secondary] PlayerDeleted:', message);
        //this.leaderboardCardPlayerInfo.delete(message.LUID);
    }
    private playerUpdatedSecondaryMessage(message: PlayerUpdatedEvent_S): void {
        this.logger.debug('[BsPlusPlugin][Secondary] PlayerUpdated:', message);
        let player = this.leaderboardCardPlayerInfo.get(message.LUID);
        if (player) {
            player.Spectating = message.Spectating;

            this.leaderboardCardPlayerInfo.set(message.LUID, player);
        }
    }
    private resetScoreSecondary(): void {
        this.logger.debug('[BsPlusPlugin][Secondary] Reset performance for new map');
        this.leaderboardCardPlayerPerformanceInfo.forEach((player, key) => {
            this.leaderboardCardPlayerPerformanceInfo.set(key, {
                ...player,
                Score    : 0,
                Accuracy : 50,
                Combo    : 0,
                MissCount: 0,
                Failed   : false,
                Deleted  : false
            });
        });
    }
    private scoreSecondaryMessage(message: ScoreEvent_S): void {
        this.logger.debug('[BsPlusPlugin][Secondary] Score:', message);
        let player = {
            ...message,
            Accuracy: Math.round((message.Accuracy * 100 + Number.EPSILON) * 100) / 100,
        }

        this.leaderboardCardPlayerPerformanceInfo.set(message.LUID, player);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendPrimaryMessage(data: string): void {
        this.manager.sendMessage(`${this.key}-primary`, data);
    }

    /**
     * Sends a message through the WebSocket.
     * @param data The data to send.
     */
    public sendSecondaryMessage(data: string): void {
        this.manager.sendMessage(`${this.key}-secondary`, data);
    }
}