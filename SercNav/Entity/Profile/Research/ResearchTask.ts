import { BusinessEntity } from '../BusinessEntity/BusinessEntity';
import { ResearchProject } from './ResearchProject';
import { ResearchRole } from './ResearchRole';

export class ResearchTask {

    /*
     * Gets or sets person id for reserach task
     */
    public PersonId: number = 0;

    /*
     * Gets or sets task id of the Research task
     */
    public ResearchTaskId: number = 0;

    /*
     * Gets or sets task number of the Research task
     */
    public ResearchTaskNumber: string = '';

    /*
     * Gets or sets start date of the Research task
     */
    public StartDate: Date = null;

    /*
     * Gets or sets end date of the Research task
     */
    public EndDate: Date = null;

    /*
     * Gets or sets bussiness entity of the research task
     */
    public BussinessEntity: BusinessEntity = null;

    /*
     * Gets or sets research project of the research task
     */
    public ResearchProject: ResearchProject = null;

    /*
     * Gets or sets research role of the research task
     */
    public ResearchRole: ResearchRole = null;

    /*
     * Gets or sets deleted of the research task
     */
    public IsDeleted: boolean = false;

    constructor(personId?: number, researchTaskId?: number, researchTaskNumber?: string, startDate?: Date, endDate?: Date) {
        if (personId)
            this.PersonId = personId;
        if (researchTaskId)
            this.ResearchTaskId = researchTaskId;
        if (researchTaskNumber)
            this.ResearchTaskNumber = researchTaskNumber;
        if (startDate)
            this.StartDate = startDate;
        if (endDate)
            this.EndDate = endDate;
    }
}