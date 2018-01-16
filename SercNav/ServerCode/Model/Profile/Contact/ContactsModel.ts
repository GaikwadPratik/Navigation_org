import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';
import { ContactType, Contacts } from '../../../../Entity/Profile/Contact/Index';

export class ContactModel {

    /**
     * Get contact details by person id
     * @param nPersonId{number}
     */
    public GetContactsbyPersonId(nPersonId: number): Promise<{}> {
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
                            let query: string = `CALL sp_GetContactsByPersonId(?);`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [nPersonId];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    let _contactsDetails: Array<Contacts> = null;

                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        if (_data) {
                                            _contactsDetails = _data.map((x) => {
                                                return new Contacts(nPersonId, x.ContactId, new ContactType(x.ContactTypeId, x.ContactTypeName), x.ContactValue);
                                            });

                                            resolve({ contacts: _contactsDetails });
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
     * Save or update contact details in database
     * @param education{Education}
     */
    public AddContactInfo(contact: Contacts) {
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
                            let query: string = `SET @p_message ='';CALL sp_AddUpdateContact(?,?,?,?,?,@p_message);SELECT @p_message;`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [contact.ContactId, contact.PersonId, contact.ContactType.ContactTypeId, contact.ContactValue, contact.IsDeleted];

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

    /**
     * Function to get contct types. Returns Promise object with contact types
     * returns a promise with result or error.
     * @returns Promise containing the array of address types
     */
    public GetContactTypes(): Promise<Array<ContactType>> {

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
                            let query: string = "CALL sp_GetContactTypes();";

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    //if any data is returned from database
                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        //map each data to Country and return the array
                                        let _lstContactTypes: ContactType[] = _data.map((x) => {
                                            return new ContactType(x.ContactTypeId, x.ContactTypeName);
                                        });

                                        resolve(_lstContactTypes);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetAddressTypes`));
                                        reject("EC0001");
                                    }
                                }).catch((message) => {//error in query execution
                                    ApplicationLog.LogException(new Error('Error in query execution in GetAddressTypes'));
                                    reject("EC0001");
                                });
                        }
                        else //error in connection
                            reject("EC0001");
                    }).catch(() => {
                        ApplicationLog.LogError(new Error(`Database connecting issue`));
                        reject("EC0001");
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(null);
            }
        });
    }
}