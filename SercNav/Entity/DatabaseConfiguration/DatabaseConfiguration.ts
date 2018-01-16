export class DatabaseConfiguration {
    private _host = 'localhost';
    private _port = 3306;
    private _username = 'root';
    private _password = 'root';
    private _database = 'sercdb';

    public get Host() {
        return this._host;
    }

    public get Port() {
        return this._port;
    }

    public get UserName() {
        return this._username;
    }

    public get Password() {
        return this._password;
    }

    public get Database() {
        return this._database;
    }

    constructor(host: string, port: number, username: string, password: string, database: string) {
        this._host = host;
        this._port = port;
        this._username = username;
        this._password = password;
        this._database = database;
    }
}