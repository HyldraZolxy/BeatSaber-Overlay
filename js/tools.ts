export class Tools {

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async getMethod(URL: string, options?: any): Promise<any> {
        const response = await fetch(URL, {
            method: "GET",
            headers: options
        });

        return await response.json();
    }
}