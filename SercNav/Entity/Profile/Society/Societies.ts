import { SocietyType } from './Society_Type';

export class Societies {

    /*
     * Gets or Sets person id of the society
     */
    public PersonId: number = 0;

    /*
     * Gets or Sets id of the society
     */
    public SocietyId: number = 0;

    /*
    * Gets or sets Type of society
    */
    public SocietyType: SocietyType = null;

    /*
   * Gets or sets value of society
   */
    public SocietyValue: string = '';

    /*
     * Gets or Sets IsDeleted for the society
     */
    public IsDeleted: boolean = false;

    constructor(personId?: number, societyId?: number, societyType?: SocietyType, societyValue?: string) {
        if (personId)
            this.PersonId = personId;
        if (societyId)
            this.SocietyId = societyId;
        if (societyType)
            this.SocietyType = societyType;
        if (societyValue)
            this.SocietyValue = societyValue;
    }
}
