/**
 * Class representating the education history of the person
 */
export class Education {
    /*
     * Sets or gets education history id of the record
    */
    public EducationHistoryId: number = 0;

    /*
     * Sets or gets person id of the record
    */
    public PersonId: number = 0;

    /*
     * Sets or gets education Degree of the record
    */
    public Degree: string = '';

    /*
     * Sets or gets education degree type of the record
    */
    public DegreeType: string = '';

    /*
     * Sets or gets education degree type of the record
    */
    public DegreeYear: number = 0;

    /*
     * Sets or gets education school name of the record
    */
    public SchoolName: string = '';

    /*
     * Sets or gets education delete status of the record
    */
    public IsDeleted: boolean = false;

    constructor(educationHistoryId?: number, personId?: number, degree?: string, degreeType?: string, degreeYear?: number, schoolName?: string) {

        if (educationHistoryId)
            this.EducationHistoryId = educationHistoryId;
        if (personId)
            this.PersonId = personId;
        if (degree)
            this.Degree = degree;
        if (degreeType)
            this.DegreeType = degreeType;
        if (degreeYear)
            this.DegreeYear = degreeYear;
        if (schoolName)
            this.SchoolName = schoolName;
    }
}