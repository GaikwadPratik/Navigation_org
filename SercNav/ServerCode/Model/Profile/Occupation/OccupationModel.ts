import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';
import { Person } from '../../../../Entity/Person/Person';
import { Assignment } from '../../../../Entity/Profile/Occupation/Index';
import { BusinessEntity } from '../../../../Entity/Profile/BusinessEntity/BusinessEntity';
export class OccupationModel {
    /**
 * private object needded to connect to database
 */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

     /**
    * Get contact details by person id
    * @param nPersonId{number}
    */
    public GetOccupationbyPersonId(nPersonId: number): Promise<{}> {
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
                            let query: string = `CALL sp_GetOccupationByPersonId(?);`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [nPersonId];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {
                                   ;
                                    let _contactsDetails: Array<any> = null;
                                    
                                    if (rows) {
                                        let _data: any = rows[0];

                                        if (_data) {
                                            if (Array.isArray(_data)) {
                                                _contactsDetails = _data.map((x) => {
                                                    // constructor(npersonId?: number, nRole?: String, nTitle?: String, nstartDate?: Date, nendDate?: Date) {
                                                    //let _entity = new Entity(x.categoryId, x.entityName);
                                                    let _asssignment = new Assignment(nPersonId,x.Role, x.Title, x.StartDate, x.EndDate);
                                                    _asssignment.Entity = new BusinessEntity(x.categoryId, x.entityName,x.EntityId);
                                                    return _asssignment;
                                                });
                                            }
                                            else {
                                                let _asssignment = new Assignment(nPersonId, _data.Role, _data.Title, _data.StartDate, _data.EndDate);
                                                _asssignment.Entity = new BusinessEntity(_data.categoryId, _data.entityName, _data.EntityId);
                                                _contactsDetails.push(_asssignment);
                                            }
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

    public AddOccupationInfo(entity: BusinessEntity, assignment: Assignment) {
        
        return new Promise((resolve, reject) => {
            try {
               ;
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database
                    .InitiateConnection()
                    .then((connected: boolean) => {
                       ;
                        //if the connection is successful, then execute query
                        if (connected) {
                           
                            //Preparing query statements
                            let query: string = `SET @p_message ='';CALL sp_AddOccupation(?,?,?,?,?,?,?,?,@p_message);SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [assignment.PersonId, entity.entityId, entity.entityName, assignment.StartDate, assignment.EndDate, assignment.Role, assignment.Title, entity.categoryId];

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
                                            ApplicationLog.LogError(new Error(`Unknown error in adding/updating Occupation details.`));
                                            reject("EH0001");
                                        }
                                    }
                                }).catch((message) => {//error in query execution
                                    ApplicationLog.LogException(new Error('Error in query execution in adding/updating Occupation details.'));
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