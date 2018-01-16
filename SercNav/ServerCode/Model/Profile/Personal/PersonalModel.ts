import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';
import { Person } from '../../../../Entity/Person/Person';
import { Address, AddressType, Country, City, State } from '../../../../Entity/Profile/Address/Index';

export class PersonalModel {

    public UpdatePersonalDetails(person: Person) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `set @p_message = '';CALL sp_UpdatePersonalProfile(?,?,?,?,?,?,@p_message);SELECT @p_message;`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [person.PersonId, person.FirstName, person.LastName, person.Caption, person.MiddleName, person.DateofBirth];

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
                                        ApplicationLog.LogError(new Error(`Unknown error in registration process.`));
                                        reject("EU0000");
                                    }
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('error in query execution in getaddresstypes'));
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

    public GetPersonalProfileData(personId: number) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetPersonalProfile(?);`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [personId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {
                                let _data: any = rows[0][0];
                                let _person: Person = null;
                                let _address: Address = null;

                                if (_data) {
                                    _person = new Person(personId, _data.FirstName, _data.MiddleName, _data.LastName, _data.DOB);
                                    _person.IsProfileApproved = _data.ProfileApproved;
                                    _person.Caption = _data.Saluation;

                                };
                                _data = rows[1][0];
                                if (_data) {
                                    _address = new Address();
                                    _address.AddressId = parseInt(_data.AddressId);
                                    _address.City = new City(_data.CityId, _data.CityName);
                                    _address.State = new State(_data.StateId, _data.StateName);
                                    _address.Country = new Country(_data.CountryId, _data.CountryName);
                                };
                                resolve({ Person: _person, Address: _address });

                            });
                    }
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("PU0002");
            }
        });
    }
}