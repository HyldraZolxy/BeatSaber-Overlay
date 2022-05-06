export class Tools {

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    public async getMethod(URL: string): Promise<Object> {
        const response = await fetch(URL, {
            method: "GET"
        });

        return await response.json();
    }
}