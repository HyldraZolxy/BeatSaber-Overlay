import { BSPlus } from '../../../games/beatSaber/BSPlus';
export class BsPlusPlugin {
    constructor(manager) {
        this._bsPlus = new BSPlus();
        this.manager = manager;
        this.key = 'bsplus';
        this.manager.initialize(this.key, 'ws://127.0.0.1:2947/socket', this.handleMessage.bind(this));
    }
    handleMessage(message) {
        console.log(`BsPlusPlugin Message: ${message}`);
        this._bsPlus.dataParser(message);
    }
    sendMessage(data) {
        this.manager.sendMessage(this.key, data);
    }
}
