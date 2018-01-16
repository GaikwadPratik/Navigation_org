import { IDatabaseConnector, DatabaseConnector } from '../../Database/DatabaseConnector';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { IndustryCategory } from '../../../Entity/IndustryAffiliation/IndustryCategory';

export class CommonModel {
    public GetIndustryCategories(): Promise<Array<IndustryCategory>> {
        return new Promise((resolve, reject) => {

            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = "CALL sp_GetBussinessCategories();";

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [];
                            _database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        //map each data to Country and return the array
                                        let _lstCategories: Array<IndustryCategory> = _data.map((x) => {
                                            return new IndustryCategory(x.Id, x.CategoryName);
                                        });

                                        resolve(_lstCategories);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetIndustryCategories`));
                                        reject(null);
                                    }
                                }).catch((message) => {//error in query execution
                                    ApplicationLog.LogException(new Error('Error in query execution in GetIndustryCategories'));
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

    public GetSercRoles(): Promise<Array<{}>> {
        return new Promise((resolve, reject) => {

            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = "CALL sp_GetSercUserRoles();";

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [];
                            _database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        resolve(_data);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetSercRoles`));
                                        reject(null);
                                    }
                                }).catch((message) => {//error in query execution
                                    ApplicationLog.LogException(new Error('Error in query execution in GetSercRoles'));
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
        })
    }
}