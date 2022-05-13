import { GlobalVariable } from "./global.js";
import { Tools } from "./tools.js";

export class ScoreSaber {

    ////////////////////////////
    // PRIVATE CLASS VARIABLE //
    ////////////////////////////
    private _tools: Tools;

    constructor() {
        this._tools = new Tools();
    }

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async getPlayerInfo(playerId: string) {
        let dataJson: any = await this._tools.getMethod(GlobalVariable.SCORESABER_API_PROXY_URL + "/?playerId=" + playerId);

        if (!("errorMessage" in dataJson)) {
            return dataJson;
        }
    }
}