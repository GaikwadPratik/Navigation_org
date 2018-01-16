import * as fs from 'fs';
import * as path from 'path';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';

import { DatabaseConfiguration } from '../../../Entity/DatabaseConfiguration/DatabaseConfiguration';

export class DatabaseConfig {

    private _fileName = 'dbconfig.config';

    /**
     * Function to read database configuration from file instead of hardcoding in the server code.
     * @method
     * @class DatabaseConfig
     */
    public GetConfiguration() {
        //Read from file.
        let _filePath = path.join(__dirname, this._fileName);
        return new Promise((resolve, reject) => {
            fs.readFile(_filePath, 'utf-8', (err: NodeJS.ErrnoException, data: string) => {
                if (err) {
                    //if the error is specifically file not found
                    if (err.code === 'ENOENT')
                        ApplicationLog.LogError(new Error(`The file with name '${this._fileName}' is not found in directory '${__dirname}'. Please check if config file is present.`));
                    else
                        ApplicationLog.LogError(err);
                    //in case of error reject the promise
                    reject(false);
                }
                else {
                    //Convert json data into configuration object and return
                    let _config: DatabaseConfiguration = JSON.parse(data);
                    resolve(_config);
                }
            });
        });
    }
}