import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';
import { Person } from '../../../../Entity/Person/Person';
import { SocietyType, Societies } from '../../../../Entity/Profile/Society/Index';

export class SocietyModel {
    /**
 * private object needded to connect to database
 */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

    /**
     * Function to extract user address based on personId.
     * @returns Promise containing the user address
     * @param nPersonId
     */
    public GetSocieties(): Promise<Array<SocietyType>> {

        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = "CALL sp_GetSocietyTypes();";

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [];
                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {
                              
                                //if any data is returned from database
                                if (rows) {
                                    
                                    let _data: any[] = rows[0];

                                    //map each data to Country and return the array
                                    let _lstSocieties: SocietyType[] = _data.map((x) => {
                                        return new SocietyType(x.SocietyTypeId, x.SocietyTypeName);
                                    })

                                    resolve(_lstSocieties);
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in Society`));
                                    reject(null);
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in Society'));
                                reject(null);
                            });
                    }
                    else //error in connection
                        reject(null);
                }).catch(() => {
                    ApplicationLog.LogError(new Error(`Database connecting issue`));
                    reject(null);
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(null);
            }
        });
    }

    /**
    * Get contact details by person id
    * @param nPersonId{number}
    */
    public GetSocietybyPersonId(nPersonId: number): Promise<{}> {
        return new Promise((resolve, reject) => {
           
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database
                    .InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `CALL sp_GetSocietyByPersonId(?);`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [nPersonId];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {
                                 
                                    let _contactsDetails: Array<Societies> = null;

                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        if (_data) {
                                            _contactsDetails = _data.map((x) => {
                                                return new Societies(nPersonId, x.SocietyId, new SocietyType(x.SocietyTypeId), x.SocietyValue);
                                            });

                                            resolve(_contactsDetails);
                                        }
                                        else {//nothing is returned from database
                                            ApplicationLog.LogError(new Error(`No result is returned in GetSocietybyPersonId`));
                                            reject("EH0002");
                                        }
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetSocietybyPersonId`));
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
    * Save or update contact details in database
    * @param education{Education}
    */
    public AddSocietyInfo(societies: Societies) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database
                    .InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `SET @p_message ='';CALL sp_AddUpdateSociety(?,?,?,?,?,@p_message);SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [societies.SocietyId, societies.PersonId, societies.SocietyType.SocietyTypeId, societies.SocietyValue, societies.IsDeleted];

                            _database
                                .ExecuteQuery(query, values)
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