export class City {
    /**
     * Gets or Sets the city Id
     */
    public CityId: number = 0;

    /**
     * Gets or Sets the City name of the record     
     */
    public CityName: string = '';

    constructor(nCityId?: number, strCityName?: string) {
        if (nCityId)
            this.CityId = nCityId;
        if (strCityName)
            this.CityName = strCityName;
    }
}