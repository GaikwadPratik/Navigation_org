export class BusinessEntity{
     /**
     * Gets or Sets the id of entity
     */
    public entityId: number = 0;

    /**
     * Gets or Sets the first name of entity
     */
    public categoryId: number = 0;

    /**
     * Gets or Sets the entityName name of entity
     */
    public entityName: string = '';

    /**
     * Gets or Sets the isDeleted of entity
     */
    public isDeleted: boolean = false;

    constructor(ncategoryId?: number, nentityName?: string, nEntityId ?:number) {
        if (nentityName)
            this.entityName = nentityName;
        if (ncategoryId)
            this.categoryId = ncategoryId;
        if (nEntityId)
            this.entityId = nEntityId;

    }
   
}