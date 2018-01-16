import { IDatabaseConnector, DatabaseConnector } from '../../Database/DatabaseConnector';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { AdminData } from '../../../Entity/Admin/AdminData';
import { Person } from '../../../Entity/Person/Person';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';

export class AccountRegistrationModel {
    /**
     * private object needded to connect to database
     */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

    /**
     * Function to return details of the newly registered users who are not yet processed by Administrator
     * @class AccountRegistrationModel
     * @method ApproveRegisteredUser
     */
    public GetNewRegisteredUsers(): Promise<AdminData[]> {
        return new Promise((resolve, reject) => {
            try {
                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `call sp_GetNewRegisteredUsers();`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        //map each data to AdminData and return the array
                                        let _lstRequestsTobeProcessed: AdminData[] = _data.map((x) => {
                                            return new AdminData(x.PersonId, x.FirstName.concat(' ', x.LastName), x.RequestedDate);
                                        });

                                        resolve(_lstRequestsTobeProcessed);
                                    }
                                    else //nothing is returned from database
                                        reject(false);
                                })
                                .catch((error) => {//error in query execution
                                    reject(error);
                                });
                        }
                        else//error in connection
                            reject(false);
                    })
                    .catch((status: boolean) => {//error in intiating connection
                        reject(status);
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }

    /**
     * Function to return details of the newly registered users who are processed by Administrator
     * @class AccountRegistrationModel
     * @method ApproveRegisteredUser
     */
    public GetRegisteredProcessedUsers(): Promise<AdminData[]> {
        return new Promise((resolve, reject) => {
            try {

                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `call sp_GetRegisteredProcessedUsers();`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        //map each data to AdminData and return the array
                                        let _lstRequestsProcessed: AdminData[] = _data.map((x) => {
                                            return new AdminData(x.PersonId, x.FirstName.concat(' ', x.LastName), x.RequestedDate, x.ProcessedDate);
                                        });

                                        resolve(_lstRequestsProcessed);
                                    }
                                    else //nothing is returned from database
                                        reject(false);
                                })
                                .catch((error) => {//error in query execution
                                    reject(error);
                                });
                        }
                        else//error in connection
                            reject(false);
                    })
                    .catch((status: boolean) => {//error in intiating connection
                        reject(status);
                    });

            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }

    /**
     * Function to return details of the registered user by Id
     * @class AccountRegistrationModel
     * @method ApproveRegisteredUser
     * @param personId
     */
    public GetRegisteredUserDetails(personId: number): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `call sp_GetRegisteredUserDetails(?)`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values: Array<number> = [personId];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any = rows[0][0];
                                        if (_data) {
                                            resolve(_data);
                                        }
                                        else {
                                            ApplicationLog.LogError(new Error(`There was no data found in the response of user details inside GetRegisteredUserDetails for personId: ${personId}`));
                                            reject(null);
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
     * Marks the newly registered user as approved in the database and returns true or false as status
     * @class AccountRegistrationModel
     * @method ApproveRegisteredUser
     * @param personId
     */
    public ProcessRegisteredUser(personId: number, action: string, comments: string, industryName: string, industryCategory: number): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {

                //Since we need to execute multiple connection, setting ismultiplestatement = true.
                this._database = new DatabaseConnector(true);

                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `set @p_message = '';CALL sp_ProcessNewRegisteredUser(?,?,?,?,?,@p_message);SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values: Array<number | string> = [personId, action.trim().toLowerCase(), comments.trim(), industryName.trim(), industryCategory];

                            this._database.ExecuteQuery(query, values)
                                .then((rows) => {

                                    if (action.trim().toLowerCase() === 'approve') {
                                        //if the sp_returned 'SUCCESS' message then the record processing is done
                                        if (rows && rows[3] && rows[3][0]["@p_message"]) {
                                            if (rows[3][0]["@p_message"] === 'SUCCESS') {
                                                //TODO:: Map to user creds
                                                let _userData = {
                                                    Email: rows[1][0].Email,
                                                    FirstName: rows[1][0].FirstName,
                                                    LastName: rows[1][0].LastName
                                                };

                                                resolve(_userData);
                                            }
                                            else {
                                                ApplicationLog.LogError(new Error(rows[2][0]["@p_message"]));
                                                reject(false);
                                            }
                                        }
                                        else
                                            reject(false);
                                    }
                                    else {
                                        if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                            if (rows[2][0]["@p_message"] === 'SUCCESS') {
                                                resolve({ status: true });
                                            }
                                            else {
                                                ApplicationLog.LogError(new Error(rows[2][0]["@p_message"]));
                                                reject(false);
                                            }
                                        }
                                        else
                                            reject(false);
                                    }
                                })
                                .catch((status: boolean) => {//error in query execution
                                    reject(status);
                                });
                        }
                        else//error in connection
                            reject(false);
                    })
                    .catch((error) => {//error in intiating connection
                        reject(error);
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }

    public ProcessProfileRequest(personId: number, action: string, comments: string): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {

                //Since we need to execute multiple connection, setting ismultiplestatement = true.
                this._database = new DatabaseConnector(true);

                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {
                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `set @p_message = '';CALL sp_ProcessProfileRequest(?,?,?,@p_message);SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values: Array<number | string> = [personId, action.trim().toLowerCase(), comments.trim()];

                            this._database.ExecuteQuery(query, values)
                                .then((rows) => {

                                    if (action.trim().toLowerCase() === 'approve') {
                                        //if the sp_returned 'SUCCESS' message then the record processing is done
                                        if (rows && rows[3] && rows[3][0]["@p_message"]) {
                                            if (rows[3][0]["@p_message"] === 'SUCCESS') {
                                                //TODO:: Map to user creds
                                                let _userData = {
                                                    Email: rows[1][0].Email,
                                                    FirstName: rows[1][0].FirstName,
                                                    LastName: rows[1][0].LastName
                                                };

                                                resolve(_userData);
                                            }
                                            else {
                                                ApplicationLog.LogError(new Error(rows[2][0]["@p_message"]));
                                                reject(false);
                                            }
                                        }
                                        else
                                            reject(false);
                                    }
                                    else {
                                        if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                            if (rows[2][0]["@p_message"] === 'SUCCESS') {
                                                resolve({ status: true });
                                            }
                                            else {
                                                ApplicationLog.LogError(new Error(rows[2][0]["@p_message"]));
                                                reject(false);
                                            }
                                        }
                                        else
                                            reject(false);
                                    }
                                })
                                .catch((status: boolean) => {//error in query execution
                                    reject(status);
                                });
                        }
                        else//error in connection
                            reject(false);
                    })
                    .catch((error) => {//error in intiating connection
                        reject(error);
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }
}