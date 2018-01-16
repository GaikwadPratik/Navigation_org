export class ResearchRole {
    /*
     * Gets or sets id of the research role
     */
    public ResearchRoleId: number = 0;

    /*
     * Gets or sets name of the research role
     */
    public ResearchRoleName: string = '';

    constructor(researchRoleId?: number, researchRoleName?: string) {
        if (researchRoleId)
            this.ResearchRoleId = researchRoleId;
        if (researchRoleName)
            this.ResearchRoleName = researchRoleName;
    }
}