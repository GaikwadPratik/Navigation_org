import { ResearchProgram } from './ResearchProgram';

export class ResearchProject {
    /*
    * Gets or sets id of Reserach project
    */
    public ResearchProjectId: number = 0;

    /*
     * Gets or sets name of Reserach project
     */
    public ResearchProjectName: string = '';

    /*
     * Gets or sets research program of Reserach project
     */
    public ResearchProgram: ResearchProgram = null;

    /*
     * Gets or sets deleted of Reserach project
     */
    public IsDeleted: boolean = false;

    constructor(researchProjectId?: number, researchProjectName?: string) {
        if (researchProjectId)
            this.ResearchProjectId = researchProjectId;
        if (researchProjectName)
            this.ResearchProjectName = researchProjectName;
    }
}