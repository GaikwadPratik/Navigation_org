import * as mysql from 'mysql';
import * as ApplicationLog from '../ApplicationLog/ApplicationLog';

export interface IDatabaseConnector {
    ExecuteQuery(query: string, values: Array<Object>): Promise<any[]>;
    InitiateConnection(): Promise<{}>;
}

export class DatabaseConnector implements IDatabaseConnector {

    /*
     * https://github.com/mysqljs/mysql/issues/383
     * _connection is used to do handshaking with server, and hence needs to be destroyed if configuration has to be changed.
     */

    private _connection: mysql.IConnection = null;

    /**
     * Configuration to connect the database.
     * The data should be read from an external encrypted file. 
     */
    private static _connectionConfig: mysql.IConnectionConfig = {
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'root',
        database: 'sercDB'
    }

    /**
     * Returns the connection instance to the database
     * @class DatabaseConnector
     * @property
     */
    //public get Connection() {
    //    return this._connection;
    //}

    /**
    * Funtion to end the active database connection.
    * @param isMultiStatement
    * @constructor
    * @class DatabaseConnector
    */
    constructor(isMultiStatement: boolean = false) {
        //modifying the flags so that multiple statemenst are allowed for this query.
        if (isMultiStatement)
            DatabaseConnector._connectionConfig.multipleStatements = true;
        else
            DatabaseConnector._connectionConfig.multipleStatements = false;
    }

    /**
    * Funtion to initiate database connection.
    * @param connection
    * @function InitiateConnection
    * @class DatabaseConnector
    */
    public InitiateConnection(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            try {
                this._connection = mysql.createConnection(DatabaseConnector._connectionConfig);

                this._connection.connect((err) => {
                    if (err) {
                        this.HandleSQLError(err);
                        reject(false);
                    }
                    else
                        ApplicationLog.LogDebug(`Connection started on thread ${this._connection.threadId}`);

                    resolve(true);
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject(false);
            }
        });
    }


    /**
     * Funtion to end the active database connection.
     * @param connection
     * @function EndConnection
     * @class DatabaseConnector
     */
    private EndConnection(connection: mysql.IConnection): void {
        try {
            if (connection) {
                //Killing the connection so as to return thread to threadpool so that overhead is reduced.
                connection.end();
                ApplicationLog.LogDebug(`Connection killed on thread ${this._connection.threadId}`);
            }
            else
                ApplicationLog.LogWarning('Connection was not active');
        }
        catch (exception) {
            ApplicationLog.LogError(exception);
        }
    }

    /**
     * Funtion to handle errors in  database connection.
     * @param connection
     * @function EndConnection
     * @class DatabaseConnector
     */
    private HandleSQLError(error: mysql.IError) {
        let errString: string = '';
        if (error.fatal)
            errString += 'A fatal error ';
        else
            errString += 'An error ';
        errString += `occurred with code: "${error.code}", error no: "${error.errno}", message: "${error.message} ", stack trace: "${error.stack} "`;
        let err = new Error(errString);
        ApplicationLog.LogError(err);
    }

    /**
     * Function to execute the query on database. Accepts query string and array of values.
     * DON'T INCLUDE VALUES IN THE QUERY. Send it in value array to avoid SQL Injection attack.
     * @function ExecuteQuery
     * @param query
     * @param values
     * @class DatabaseConnector
     * @returns Promise of object
     */
    public ExecuteQuery(query: string, values: Array<Object>): Promise<any[]> {
        return new Promise((resolve, reject) => {
            try {
                this._connection.query(query, values, (error: mysql.IError, rows) => {
                    // `rows` is an array with one element for every statement(separated by ';') in the query:

                    if (error) {
                        //Log error and then reject the promise so that caller can handle it
                        this.HandleSQLError(error);
                        reject(false);
                    }
                    else {
                        //Return the result to caller and let them handle the error in the query
                        resolve(rows);
                    }

                    //End connection
                    this.EndConnection(this._connection);
                });
            }
            catch (exception) {
                ApplicationLog.LogError(exception);
                reject(false);
            }
        });
    }
}