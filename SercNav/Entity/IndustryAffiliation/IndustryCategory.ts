export class IndustryCategory {

    /*
     * Gets or sets the category id
     */
    public CategoryId: number = -1;

    /*
     * Gets or sets the category name
     */
    public CategoryName: string = '';

    constructor(nCategoryId?: number, strCategoryName?: string) {
        if (nCategoryId)
            this.CategoryId = nCategoryId;
        if (strCategoryName)
            this.CategoryName = strCategoryName;
    }
}