import { IDatabaseConnector, DatabaseConnector } from '../../Database/DatabaseConnector';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { Person } from '../../../Entity/Person/Person';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';
import { IndustryAffiliation, IndustryCategory } from '../../../Entity/IndustryAffiliation/Index';

export class RegistrationModel {

    /**
     * private object needded to connect to database
     */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

    /**
     * Function to register a new user.
     * @param person
     * @param userCreds
     * @returns Promise
     * @function RegisterNewUser
     * @class RegistrationModel
     */
    public RegisterNewUser(person: Person, userCreds: UserCredential, industryAff: IndustryAffiliation): Promise<{}> {

        return new Promise((resolve, reject) => {

            try {
                //Since we need to execute multiple connection, setting ismultiplestatement = true.
                this._database = new DatabaseConnector(true);

                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, execute the query
                        if (connected) {

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [person.Caption, person.FirstName, person.LastName, userCreds.EmailId, userCreds.SercRoleId, userCreds.Password, userCreds.Username, industryAff.EntityName, industryAff.IndustryCategory.CategoryId];

                            //Preparing query statements
                            let query: string = `SET @p_message ='';CALL sp_RegisterNewPerson(?,?,?,?,?,?,?,?,?,@p_message);SELECT @p_message;`;

                            this._database.ExecuteQuery(query, values)
                                .then((rows) => {

                                    if (rows && rows[3] && rows[3][0]["@p_message"]) {
                                        //read the out message from stored procedure.
                                        let _message = rows[3][0]["@p_message"];

                                        //if the sp_returned 'SUCCESS' message then the record insertion is done
                                        if (_message === 'SUCCESS') {
                                            let _adminEmails = [];
                                            for (let _index = 0, _len = rows[1].length; _index < _len; _index++)
                                                _adminEmails.push(rows[1][_index].AdminEmail);

                                            resolve({
                                                Status: true,
                                                Emails: _adminEmails
                                            });
                                        }
                                        else {
                                            ApplicationLog.LogError(new Error(_message));
                                            reject(_message);
                                        }
                                    }
                                    else {
                                        if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                            let _message = rows[2][0]["@p_message"];
                                            ApplicationLog.LogError(new Error(_message));
                                            reject(_message);
                                        }
                                        else {
                                            ApplicationLog.LogError(new Error(`Unknown error in registration process.`));
                                            reject("EU0000");
                                        }
                                    }
                                })
                                .catch((status: boolean) => {//error in query execution
                                    reject(status);
                                });
                        }
                        else
                            reject(false);
                    })
                    .catch((message) => {//error in intiating connection
                        reject(message);
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }
}