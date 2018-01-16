import { IDatabaseConnector, DatabaseConnector } from '../../Database/DatabaseConnector';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';
import { Person } from '../../../Entity/Person/Person';


/**
 * Class for login module. This class will contain all the functionality related to login
 */
export class LoginModel {

    /**
     * private object needded to connect to database
     */
    private _database: IDatabaseConnector = null;

    constructor() {
        //Create the database object
        this._database = new DatabaseConnector();
    }

    /**
     * Function to authenticate user based on username and password.
     * @returns Promise containing the user data needed for redirection
     * @param username
     * @param password
     */
    public AuthenticateUser(username: string, password: string): Promise<any> {
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
                            let query: string = `set @p_message = ''; CALL sp_AuthenticateUsers(?,?,@p_message); SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            //TODO:: Encrypt password before sending
                            let values = [username.trim(), password.trim()];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows
                                        && rows[3]
                                        && rows[3][0]
                                        && rows[3][0]["@p_message"]) {
                                        if (rows[3][0]["@p_message"] === 'AUTHENTICATED') {
                                            //User authentication successful
                                            let _data: any = rows[1][0];
                                            let _userCredential: UserCredential = new UserCredential();
                                            let _person: Person = new Person();
                                            _userCredential.EmailId = username;
                                            _userCredential.SercRoleName = _data.SercRole;
                                            _person.FirstName = _data.FirstName;
                                            _person.LastName = _data.LastName;
                                            _person.Caption = _data.Salutation;
                                            _person.PersonId = _data.PersonId;
                                            _person.IsProfileComplete = _data.ProfileComplete === 1;
                                            delete _userCredential.Password;
                                            resolve({ UserCredential: _userCredential, Person: _person });
                                        }
                                        else {// in case authentication fails
                                            ApplicationLog.LogError(new Error(`User authentication failed for ${username}`));
                                            reject(false);
                                        }
                                    }
                                    else { //nothing is returned from database
                                        ApplicationLog.LogError(new Error(`User authentication failed for ${username}`));
                                        reject(false);
                                    }
                                })
                                .catch((error) => {//error in query execution
                                    ApplicationLog.LogError(error);
                                    reject(false);
                                });
                        }
                        else {//error in connection
                            ApplicationLog.LogException(new Error(`Error in connection`));
                            reject(false);
                        }
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
}