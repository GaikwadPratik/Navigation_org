export class UserCredential {

    /**
     * Gets or Sets the email id of person
     */
    public EmailId: string = '';

    /**
     * Gets or Sets the email id of person
     */
    public Username: string = '';

    /**
     * Gets or Sets the password of person     
     */
    public Password:string = '';
    
    /**
     * Gets or Sets the SercRole id of person
     */
    public SercRoleId: number = -1;

    /**
    * Gets or sets the SercRole name of person
    */
    public SercRoleName: string = '';

    constructor(emailId?: string, username?: string) {
        this.EmailId = emailId;
        this.Username = username;
    }
}