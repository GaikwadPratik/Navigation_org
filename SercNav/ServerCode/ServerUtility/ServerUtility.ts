import * as fs from 'fs';
import * as path from 'path';
import * as ApplicationLog from '../ApplicationLog/ApplicationLog';
import * as crypto from 'crypto';

/**
 * Function to read the data from file.
 * The first parameter is array of the strings containing folder and file name with extension
 * @param filePaths
 */
export function ReadFile(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
        try {

            fs.readFile(filePath, 'utf-8', (err: NodeJS.ErrnoException, data: string) => {

                if (err) {
                    //if the error is specifically file not found
                    if (err.code === 'ENOENT')
                        ApplicationLog.LogError(new Error(`The file with name '${filePath}' is not found. Please check if config file is present.`));
                    else
                        ApplicationLog.LogError(err);
                    //in case of error reject the promise
                    reject(false);
                }
                else {
                    resolve(data);
                }
            });
        }
        catch (exception) {
            ApplicationLog.LogException(exception);
            reject(false);
        }
    });
}

//TODO:: Call this function in Application to write logs in file.
/**
 * Function to write the data to file.
 * The first parameter is array of the strings containing folder and file name with extension
 * the second parameter is data to be written to file.
 * @param filePaths
 * @param data
 */
export function WriteFile(filePaths: string[], data: any): Promise<boolean> {
    return new Promise((resolve, reject) => {
        try {

            let _filePath: string = path.join(filePaths.join('\\'));
            fs.writeFile(_filePath, data, { encoding: 'utf-8' }, (err: NodeJS.ErrnoException) => {

                if (err) {
                    //Showing error on console to reduce circular dependency since this is called from Application Log
                    console.error(err);
                    //in case of error reject the promise
                    reject(false);
                }
                else {
                    resolve(true);
                }
            });
        }
        catch (exception) {
            //Showing error on console to reduce circular dependency since this is called from Application Log
            console.error(exception);
            reject(false);
        }
    });
}

/**
 * generates random string of characters i.e salt
 * @function
 * @param {number} length - Length of the random string.
 */
function GenRandomString(length) {
    return crypto.randomBytes(Math.ceil(length / 2))
        .toString('hex') /** convert to hexadecimal format */
        .slice(0, length);   /** return required number of characters */
};

/**
 * hash password with sha512.
 * @function
 * @param {string} password - List of required fields.
 * @param {string} salt - Data to be validated.
 */
function sha512(password, salt) {
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');
    return {
        salt: salt,
        passwordHash: value
    };
};

/**
 * Function to hash the password
 * @param {string} userpassword
 */
export function SaltHashPassword(userpassword: string) {

    //var salt = GenRandomString(16); /** Gives us salt of length 16 */
    let _salt = "510F234E05AB43CAAD764E92192F9D07FE7CA68BD19349679768B327EF9647C3";
    let _passwordData = sha512(userpassword, _salt);
    //console.log('UserPassword = ' + userpassword);
    //console.log('Passwordhash = ' + _passwordData.passwordHash);
    //console.log('nSalt = ' + _passwordData.salt);
    return _passwordData.passwordHash;
}

/**
 * Function to get error message from code
 * @param errCode {string}
 */
export function GetErrorMessageFromConfig(errCode: string) {
    return new Promise((resolve, reject) => {
        try {
            let _fileName = path.join(
                path.dirname(require.main.filename || process.mainModule.filename),
                'ServerCode',
                'Constants',
                'ErrorCode.json');

            ReadFile(_fileName)
                .then((fileContents: string) => {

                    try {
                        let _contants = JSON.parse(fileContents);
                        resolve(_contants[errCode]);
                    }
                    catch (exception) {

                        ApplicationLog.LogException(exception);
                    }
                });
        }
        catch (exception) {

            ApplicationLog.LogError(exception);
        }
    });
}
