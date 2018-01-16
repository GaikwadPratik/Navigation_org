export class ContactType {

    /**
    *Gets or Sets Contact Type Id
    */
    public ContactTypeId: number = 0;
    /**
    *Gets or Sets Contact name
    */
    public ContactTypeName: string = '';

    constructor(contactTypeId?: number, contactTypeName?: string) {
        if (contactTypeId)
            this.ContactTypeId = contactTypeId;
        if (contactTypeName)
            this.ContactTypeName = contactTypeName;
    }
}