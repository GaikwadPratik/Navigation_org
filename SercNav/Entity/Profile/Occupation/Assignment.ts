import { BusinessEntity } from '../BusinessEntity/BusinessEntity';

export class Assignment {

    public PersonId: number = 0;

    /**
     * Gets or Sets the occupation type id
     */
    public EntityId: number = 0;

    /**
     * Gets or Sets the occupation type name of the record     
     */
   
    public Role: String = ' ';
    public Title: String = ' ';
    public AssignmentId: number= 0;
    public StartDate: Date = null;

    public EndDate: Date = null;

    public isCollab: boolean = false;

    public IsDeleted: boolean = false;

    public Entity: BusinessEntity = null;

    constructor(npersonId?: number, nRole?: String, nTitle?: String, nstartDate?: Date, nendDate?: Date) {
        //nstartDate?: Date, nendDate?: Date, 
        if (npersonId)
            this.PersonId = npersonId;
        //if (nentityName)
        //    this.EntityName = nentityName;
       if (nstartDate)
            this.StartDate = nstartDate;
        if (nendDate)
           this.EndDate = nendDate;
        if (nRole)
            this.Role = nRole;
        if (nTitle)
            this.Title = nTitle;
        //if (nCatId)
        //    this.CategoryId = nCatId;

       
       // this.isCollab = true;
        
    }

   
}