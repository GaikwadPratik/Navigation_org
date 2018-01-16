import { ResearchCategory } from './ResearchCategory';

export class ResearchProgram {

    /*
     * Gets or sets id of Reserach program
     */
    public ResearchProgramId: number = 0;

    /*
     * Gets or sets name of Reserach program
     */
    public ResearchProgramName: string = '';

    /*
     * Gets or sets research category of Reserach program
     */
    public ResearchCategory: ResearchCategory = null;

    /*
     * Gets or sets deleted of Reserach program
     */
    public IsDeleted: boolean = false;

    constructor(researchProgramId?: number, researchProgramName?: string) {
        if (researchProgramId)
            this.ResearchProgramId = researchProgramId;
        if (researchProgramName)
            this.ResearchProgramName = researchProgramName;
    }
}