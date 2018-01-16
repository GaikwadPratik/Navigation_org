import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';

import { Address, AddressType, Country, City, State } from '../../../../Entity/Profile/Address/Index';

export class AddressModel {

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
    public GetAddressesByPersonId(nPersonId: number): Promise<Array<Address>> {
        return new Promise((resolve, reject) => {
            try {
                //Initiate the connection with databasse
                this._database.InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, execute the query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `CALL sp_GetAddressByPersonId(?);`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.                            
                            let values = [nPersonId];

                            this._database.ExecuteQuery(query, values)
                                .then((rows: any[]) => {
                                    let _addressDetails: Array<Address> = null;

                                    if (rows) {
                                        let _data: any[] = rows[0];

                                        if (_data) {
                                            _addressDetails = _data.map((x) => {
                                                let _address: Address = new Address();
                                                _address.AddressId = x.AddressId;
                                                _address.AddressLine1 = x.AddressLine1;
                                                _address.AddressLine2 = x.AddressLine2;
                                                _address.Country = new Country(x.CountryId, x.CountryName);
                                                _address.State = new State(x.StateId, x.StateName);
                                                _address.City = new City(x.CityId, x.CityName);
                                                _address.Zip = x.Zip;
                                                _address.PersonId = nPersonId;
                                                _address.FromDate = x.StartDate;
                                                _address.ToDate = x.EndDate;
                                                _address.PreferredMailingAddress = x.PreferredMailing === 1;
                                                _address.AddressType = new AddressType(x.AddressTypeId, x.AddressTypeName);
                                                return _address;
                                            });

                                            resolve({ addresses: _addressDetails });
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
                reject(null);
            }
        });
    }

    /**
     * Function to get countries from the database. Returns Promise object with countries
     * returns a promise with result or error.
     * @returns Promise containing the array of countries
     */
    public GetCountries(): Promise<Array<Country>> {

        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = "CALL sp_GetCountries();";

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [];
                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                //if any data is returned from database
                                if (rows) {
                                    let _data: any[] = rows[0];

                                    //map each data to Country and return the array
                                    let _lstCountries: Country[] = _data.map((x) => {
                                        return new Country(x.countryId, x.countryName);
                                    })

                                    resolve(_lstCountries);
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetCountries`));
                                    reject(null);
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in GetCountries'));
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
     * Function to get states based on coutnry id from the database. Returns Promise object with states
     * returns a promise with result or error.
     * @returns Promise containing the array of states
     * @param nCountryId
     */
    public GetStates(nCountryId: number): Promise<Array<State>> {

        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = "CALL sp_GetStatesByCountryId(?);";

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nCountryId];
                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                //if any data is returned from database
                                if (rows) {
                                    let _data: any[] = rows[0];

                                    //map each data to Country and return the array
                                    let _lstStates: State[] = _data.map((x) => {
                                        return new State(x.stateId, x.stateName);
                                    })

                                    resolve(_lstStates);
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetStates`));
                                    reject(null);
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in GetStates'));
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
     * Function to get cities based on state id from the database. Returns Promise object with cities
     * returns a promise with result or error.
     * @returns Promise containing the array of cities
     * @param nStateId
     */
    public GetCities(nStateId: number): Promise<Array<City>> {

        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = "CALL sp_GetCitiesByStateId(?);";

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nStateId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                //if any data is returned from database
                                if (rows) {
                                    let _data: any[] = rows[0];

                                    //map each data to Country and return the array
                                    let _lstCities: City[] = _data.map((x) => {
                                        return new City(x.cityId, x.cityName);
                                    })

                                    resolve(_lstCities);
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetCities`));
                                    reject(null);
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in GetCities'));
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
     * Function to get address types. Returns Promise object with address types
     * returns a promise with result or error.
     * @returns Promise containing the array of address types
     */
    public GetAddressTypes(): Promise<Array<AddressType>> {

        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = "CALL sp_GetAddressTypes();";

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                //if any data is returned from database
                                if (rows) {
                                    let _data: any[] = rows[0];

                                    //map each data to Country and return the array
                                    let _lstAddressTypes: AddressType[] = _data.map((x) => {
                                        return new AddressType(x.addressTypeId, x.name);
                                    })

                                    resolve(_lstAddressTypes);
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetAddressTypes`));
                                    reject(null);
                                }
                            }).catch((message) => {//error in query execution
                                ApplicationLog.LogException(new Error('Error in query execution in GetAddressTypes'));
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

    public AddAddressInfo(address: Address) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `SET @p_message ='';CALL sp_AddUpdateAddress(?,?,?,?,?,?,?,?,?,?,?,@p_message);SELECT @p_message;`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [address.AddressId, address.AddressType.AddressTypeId, address.AddressLine1, address.AddressLine2, address.City.CityId, address.State.StateId, address.Country.CountryId, address.Zip, address.FromDate, address.ToDate, address.PersonId];

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
                                ApplicationLog.LogException(new Error('Error in query execution in GetAddressTypes'));
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
}