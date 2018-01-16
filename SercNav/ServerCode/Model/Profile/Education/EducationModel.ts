import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';

import { Education } from '../../../../Entity/Profile/Education/Education';

export class EducationModel {
    /**
     * Get education details by person id
     * @param nPersonId{number}
     */
    public GetEducationbyPersonId(nPersonId: number): Promise<{}> {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetEducationHistoryByPersonId(?);`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nPersonId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _educationSchoolDetails: Array<Education> = null;
                                let _educationCollegeDetails: Array<Education> = null;

                                let _rtnObject = {
                                    School: null,
                                    College: null
                                };

                                if (rows) {
                                    let _data: any[] = rows[0];

                                    if (_data) {
                                        _educationSchoolDetails = _data.filter((x) => {
                                            if (x.DegreeType === 'HighSchool')
                                                return new Education(x.EducationHistoryId, nPersonId, x.Degree, x.DegreeType, x.DegreeYear, x.SchoolName);
                                        });
                                        _rtnObject.School = _educationSchoolDetails;

                                        _educationCollegeDetails = _data.filter(function (x) {
                                            if (x.DegreeType === 'College')
                                                return new Education(x.EducationHistoryId, nPersonId, x.Degree, x.DegreeType, x.DegreeYear, x.SchoolName);
                                        });
                                        _rtnObject.College = _educationCollegeDetails;
                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetEducationbyPersonId`));
                                        reject("EH0002");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetEducationbyPersonId`));
                                    reject("EH0002");
                                }
                            });
                    }
                    else //error in connection
                        reject("EH0002");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("EH0002");
            }

        });
    }

    /**
     * Save or update education details in database
     * @param education{Education}
     */
    public AddEducationInfo(education: Education) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `SET @p_message ='';CALL sp_AddUpdateEducation(?,?,?,?,?,?,?,@p_message);SELECT @p_message;`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [education.EducationHistoryId, education.PersonId, education.Degree, education.DegreeType, education.DegreeYear, education.SchoolName, education.IsDeleted];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                //if any data is returned from database
                                if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                    //read the out message from stored procedure.
                                    let _message = rows[2][0]["@p_message"];

                                    //if the sp_returned 'SUCCESS' message then the record insertion is done
                                    if (_message !== 'S0000') {
                                        ApplicationLog.LogError(new Error(_message));
                                        reject(_message);
                                    }
                                    else
                                        resolve(_message);
                                }
                                else {
                                    if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                        let _message = rows[2][0]["@p_message"];
                                        ApplicationLog.LogError(new Error(_message));
                                        reject(_message);
                                    }
                                    else {
                                        ApplicationLog.LogError(new Error(`Unknown error in adding/updating education details.`));
                                        reject("EH0001");
                                    }
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in adding/updating education details.'));
                                reject("EH0001");
                            });
                    }
                    else //error in connection
                        reject("EU0000");
                }).catch(() => {
                    ApplicationLog.LogError(new Error(`Database connecting issue`));
                    reject("EU0000");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("EU0000");
            }
        });
    }
}