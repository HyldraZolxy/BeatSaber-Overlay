import { HTTP_sira_Status } from '../../../games/beatSaber/HTTP_sira_Status';
export class HttpSiraStatus {
    constructor(manager) {
        this._httpSiraStatus = new HTTP_sira_Status();
        this.manager = manager;
        this.key = 'httpsirastatus';
        this.manager.initialize(this.key, 'ws://127.0.0.1:6557/socket', this.handleMessage.bind(this));
    }
    handleMessage(message) {
        this._httpSiraStatus.dataParser(message);
    }
    sendMessage(data) {
        this.manager.sendMessage(this.key, data);
    }
}
