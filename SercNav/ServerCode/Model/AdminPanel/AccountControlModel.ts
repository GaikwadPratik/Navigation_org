import { IDatabaseConnector, DatabaseConnector } from '../../Database/DatabaseConnector';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { AdminData } from '../../../Entity/Admin/AdminData';

export class AccountControlModel {
    /**
     * private object needded to connect to database
     */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

    /**
     * Function to get all the users whos profile has been approved by Admin for Changes
     */
    public GetProcessedUserProfiles() {

        return new Promise((resolve, reject) => {
            try {
                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `call sp_GetProcessedProfileRequest();`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values: Array<number> = [];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any = rows[0][0];
                                        if (_data) {
                                            let _lstRequestsProcessed: AdminData[] = [];
                                            if (Array.isArray(_data)) {
                                                _data.map((x) => {
                                                    return new AdminData(x.PersonId, x.FirstName.concat(' ', x.LastName), x.RequestedDate, x.ProcessedDate);
                                                });
                                            }
                                            else {
                                                _lstRequestsProcessed.push(new AdminData(_data.PersonId, _data.FirstName.concat(' ', _data.LastName), _data.RequestedDate, _data.ProcessedDate));
                                            }
                                            resolve(_lstRequestsProcessed);
                                        }
                                        else {//In case no errors and no data returned.
                                            resolve();
                                        }
                                    }
                                    else //nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetRegisteredUserDetails`));
                                    reject(null);
                                })
                                .catch((error) => {//error in query execution
                                    ApplicationLog.LogException(new Error('Error in query execution in GetRegisteredUserDetails'));
                                    reject(null);
                                });
                        }
                        else//error in connection
                            reject(null);
                    })
                    .catch((status) => {//error in intiating connection
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
     * Function to get all the users whos profile has not been approved by Admin for Changes
     */
    public GetUnProcessedUserProfiles() {

        return new Promise((resolve, reject) => {
            try {
                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `call sp_GetUnprocessedProfileRequest();`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values: Array<number> = [];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any = rows[0];
                                        if (_data) {
                                            
                                            let _lstRequestsProcessed: AdminData[] = [];
                                            if (Array.isArray(_data)) {
                                                _lstRequestsProcessed = _data.map((x) => {
                                                    return new AdminData(x.PersonId, x.FirstName.concat(' ', x.LastName), x.RequestedDate);
                                                });
                                            }
                                            else {
                                                _lstRequestsProcessed.push(new AdminData(_data.PersonId, _data.FirstName.concat(' ', _data.LastName), _data.RequestedDate));
                                            }
                                            resolve(_lstRequestsProcessed);
                                        }
                                        else {
                                            resolve();
                                        }
                                    }
                                    else //nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetRegisteredUserDetails`));
                                    reject(null);
                                })
                                .catch((error) => {//error in query execution
                                    ApplicationLog.LogException(new Error(`Error in query execution in GetRegisteredUserDetails: ${error}`));
                                    reject(null);
                                });
                        }
                        else//error in connection
                            reject(null);
                    })
                    .catch((status) => {//error in intiating connection
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
}