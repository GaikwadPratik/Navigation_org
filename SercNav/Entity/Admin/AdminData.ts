export class AdminData {

    /**
     * Gets or Sets the person Id of the record     
     */
    public PersonId: number = 0;

    /**
     * Gets or Sets the account name of the record
     */
    public AccountName: string = '';

    /**
     * Gets or Sets the requested date of the record
     */
    public RequestedDate: Date = null;

    /**
     * Gets or Sets the approved date of the record
     */
    public ProcessedDate: Date = null;

    constructor(nPersonId?: number, strAccountName?: string, dtRequestedDate?: Date, dtProcessedDate?: Date) {
        if (nPersonId)
            this.PersonId = nPersonId;
        if (strAccountName)
            this.AccountName = strAccountName;
        if (dtRequestedDate)
            this.RequestedDate = dtRequestedDate;
        if (dtProcessedDate)
            this.ProcessedDate = dtProcessedDate;
    }
}