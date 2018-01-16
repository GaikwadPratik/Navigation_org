import { IndustryCategory } from './IndustryCategory';

export class IndustryAffiliation {

    /**
     * Gets or Sets the id of person
     */
    public PersonId: number = 0;

    /*
     * Gets or Sets the id of industry
     */
    public EntityId: number = 0;

    /**
     * Gets or Sets the name of industry
     */
    public EntityName: string = '';

    /**
     * Gets or Sets the first name of person
     */
    public IndustryCategory: IndustryCategory = null;

    constructor(nPersonId?: number, strEntityName?: string, category?: IndustryCategory) {
        if (nPersonId)
            this.PersonId = nPersonId;
        if (strEntityName)
            this.EntityName = strEntityName;
        if (category)
            this.IndustryCategory = category;
    }
}