import { Globals } from "./globals";

export class Tools {

    ////////////////////
    // Public Methods //
    ////////////////////
    public async getMethod(URI: string, options?: any): Promise<any> {
        const response = await fetch(URI, {
            method: "GET",
            headers: options
        });

        return await response.json();
    }

    public async postMethod(URI: string, parameters: any, options?: any): Promise<any> {
        const response = await fetch(URI, {
            method: "POST",
            headers: options,
            body: JSON.stringify(parameters)
        });

        return await response.json();
    }

    public moduleStringConverter(module: number): string {
        switch (module) {
            case 0:     return "playerCard";
            case 1:     return "songCard";
            case 2:     return "leaderboard";
            case 3:     return "setup";
            case 4:     return "setup";
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
}