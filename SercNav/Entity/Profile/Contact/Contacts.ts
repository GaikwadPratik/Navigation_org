import { ContactType } from './ContactType';

export class Contacts {

    /*
     * Gets or Sets person id of the address
     */
    public PersonId: number = 0;

    /*
     * Gets or Sets id of the contact
     */
    public ContactId: number = 0;

    /*
    * Gets or sets Type of contact
    */
    public ContactType: ContactType = null;

     /*
    * Gets or sets value of contact
    */
    public ContactValue: string = '';

    /*
     * Gets or Sets IsDeleted for the contact
     */
    public IsDeleted: boolean = false;

    constructor(personId?: number, contactId?: number, contactType?: ContactType, contactValue?: string) {
        if (personId)
            this.PersonId = personId;
        if (contactId)
            this.ContactId = contactId;
        if (contactType)
            this.ContactType = contactType;
        if (contactValue)
            this.ContactValue = contactValue;
    }
}
