export class Tools {

    /////////////////////
    // PUBLIC FUNCTION //
    /////////////////////
    // public async postMethod(URL: string, params: object): Promise<Object> {
    //     const response = await fetch(URL, {
    //         method: "POST",
    //         body: JSON.stringify(params)
    //     });
    //
    //     return await response.json();
    // }

    public async getMethod(URL: string): Promise<Object> {
        const response = await fetch(URL, {
            method: "GET"
        });

        return await response.json();
    }
}