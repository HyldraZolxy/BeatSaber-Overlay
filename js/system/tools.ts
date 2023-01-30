import { Globals } from "../globals";

export class Tools {

    ////////////////////
    // Public Methods //
    ////////////////////
    public async getMethod(URI: string, options?: any): Promise<any> {
        return await fetch(URI, {
            method: "GET",
            headers: options
        })
        .then(response => response.json());
    }
    public async postMethod(URI: string, parameters: any, options?: any): Promise<any> {
        return await fetch(URI, {
            method: "POST",
            headers: options,
            body: JSON.stringify(parameters)
        })
        .then(response => response.json());
    }

    public moduleStringConverter(module: number): string {
        switch (module) {
            case 0:     return "playerCard";
            case 1:     return "songCard";
            case 2:     return "leaderboard";
            case 3:     return "menuSetup";
            case 4:     return "optionSetup";
            default:    return "";
        }
    }

    public positionStringConverter(position: number): string {
        switch (position) {
            case Globals.E_POSITION.TOP_LEFT:       return "top-left";
            case Globals.E_POSITION.TOP_RIGHT:      return "top-right";
            case Globals.E_POSITION.BOTTOM_LEFT:    return "bottom-left";
            case Globals.E_POSITION.BOTTOM_RIGHT:   return "bottom-right";
            default:                                return "top-right";
        }
    }
    public positionNumberConverter(position: string): number {
        switch (position) {
            case "top-left":        return Globals.E_POSITION.TOP_LEFT;
            case "top-right":       return Globals.E_POSITION.TOP_RIGHT;
            case "bottom-left":     return Globals.E_POSITION.BOTTOM_LEFT;
            case "bottom-right":    return Globals.E_POSITION.BOTTOM_RIGHT;
            default:                return Globals.E_POSITION.TOP_LEFT;
        }
    }

    // Thanks, @HardCPP, for the function :thumb:
    public getModuleSkin(module: string, skin: string): string[] | null {
        let moduleSkins: {} | null = null;

        switch (module) {
            case "playerCard"   : moduleSkins = Globals.SKIN_AVAILABLE[Globals.E_MODULES.PLAYERCARD];   break;
            case "songCard"     : moduleSkins = Globals.SKIN_AVAILABLE[Globals.E_MODULES.SONGCARD];     break;
            case "leaderboard"  : moduleSkins = Globals.SKIN_AVAILABLE[Globals.E_MODULES.LEADERBOARD];  break;
            case "menuSetup"    : moduleSkins = Globals.SKIN_AVAILABLE[Globals.E_MODULES.MENU_SETUP];   break;
            case "optionSetup"  : moduleSkins = Globals.SKIN_AVAILABLE[Globals.E_MODULES.OPT_SETUP];    break;
        }

        if (moduleSkins === null) return null;
        if (moduleSkins.hasOwnProperty(skin)) return moduleSkins[skin as keyof typeof moduleSkins];
        if (moduleSkins.hasOwnProperty("default")) return moduleSkins["default" as keyof typeof moduleSkins];

        return null;
    }
}