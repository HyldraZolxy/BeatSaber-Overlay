export class DataPuller {
    constructor(manager) {
        this.manager = manager;
        this.key = 'datapuller_mapdata';
        this.manager.initialize(this.key, 'ws://127.0.0.1:2946/BSDataPuller/MapData', this.handleMessage.bind(this));
    }
    handleMessage(message) {
        console.log(`DataPuller MapData Message: ${message}`);
    }
    sendMessage(data) {
        this.manager.sendMessage(this.key, data);
    }
}
