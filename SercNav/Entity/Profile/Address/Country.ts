export class Country {
    /**
     * Gets or Sets the country Id
     */
    public CountryId: number = 0;

    /**
     * Gets or Sets the country name of the record     
     */
    public CountryName: string = '';

    constructor(nCountryId?: number, strCountryName?: string) {
        if (nCountryId)
            this.CountryId = nCountryId;
        if (strCountryName)
            this.CountryName = strCountryName;
    }
}