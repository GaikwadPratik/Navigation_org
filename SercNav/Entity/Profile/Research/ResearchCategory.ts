export class ResearchCategory {
    /*
     * Gets or sets reserach category id
     */
    public ResearchcategoryId: number = 0;

    /*
     * Gets or sets reserach category name
     */
    public ResearchCategoryName: string = '';

    constructor(researchCategoryId?: number, researchCategoryName?: string) {
        if (researchCategoryId)
            this.ResearchcategoryId = researchCategoryId;
        if (researchCategoryName)
            this.ResearchCategoryName = researchCategoryName;
    }
}