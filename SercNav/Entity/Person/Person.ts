export class Person {

    /**
     * Gets or Sets the id of person
     */
    public PersonId: number = 0;

    /**
     * Gets or Sets the first name of person
     */
    public FirstName: string = '';

    /**
     * Gets or Sets the first name of person
     */
    public Caption: string = '';

    /**
     * Gets or Sets the middle name of person
     */
    public MiddleName: string = '';

    /**
     * Gets or Sets the last name of person
     */
    public LastName: string = '';

    /**
     * Gets or sets the date of birth of person
     */
    public DateofBirth: Date = null;

    /**
     * Gets or sets the status as Serc researcher
     */
    public IsSercResearcher: Boolean = false;

    /**
     * Gets or sets the status of the approval of profile updates by Admin
     */
    public IsProfileApproved: Boolean = false;

    /*
     * Gets or sets the profile complete status of the person
     */
    public IsProfileComplete: Boolean = false;

    /**
     * Gets or sets the status of the approval of profile updates by Admin
     */
    public profileProcessDt: Date = null;

    constructor(nPersonId?: number, strFirstName?: string, strMiddleName?: string, strLastName?: string, dtDateofBirth?: Date) {
        if (nPersonId)
            this.PersonId = nPersonId;
        if (strFirstName)
            this.FirstName = strFirstName;
        if (strMiddleName)
            this.MiddleName = strMiddleName;
        if (strLastName)
            this.LastName = strLastName;
        if (dtDateofBirth)
            this.DateofBirth = dtDateofBirth;
    }
}