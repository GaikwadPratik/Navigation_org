export class AddressType {
    /**
     * Gets or Sets the address type id
     */
    public AddressTypeId: number = 0;

    /**
     * Gets or Sets the address type name of the record     
     */
    public AddressTypeName: string = '';

    constructor(nAddressTypeId?: number, strAddressName?: string) {
        if (nAddressTypeId)
            this.AddressTypeId = nAddressTypeId;
        if (strAddressName)
            this.AddressTypeName = strAddressName;
    }
}