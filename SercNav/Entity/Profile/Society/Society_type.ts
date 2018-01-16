export class SocietyType {
    /**
     * Gets or Sets the Society type id
     */
    public SocietyTypeId: number = 0;

    /**
     * Gets or Sets the Society type name of the record     
     */
    public SocietyTypeName: string = '';

    constructor(nSocietyTypeId?: number, strSocietyName?: string) {
        if (nSocietyTypeId)
            this.SocietyTypeId = nSocietyTypeId;
        if (strSocietyName)
            this.SocietyTypeName = strSocietyName;
    }
}