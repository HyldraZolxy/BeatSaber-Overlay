/// TODO:   FOR FUTUR
///         Store those message from many function
///         Can store some notification

export class Debug {

    //////////////
    // INSTANCE //
    //////////////
    private static _instance: Debug;

    //////////////////////
    // PRIVATE VARIABLE //
    //////////////////////
    private _debugObject: Object = {};

    constructor() {}

    /////////////
    // GETTERS //
    /////////////
    public get debugObject(): Object {
        return this._debugObject;
    }

    public static get Instance(): Debug {
        return this._instance || (this._instance = new this());
    }

    /////////////
    // SETTERS //
    /////////////
    public set debugObject(object: Object) {}
}