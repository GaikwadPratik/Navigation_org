import { NextFunction, Request, Response } from 'express';
import * as Path from 'path';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';

import { BaseRoute } from '../BaseRoute/BaseRoute';

export class CommonRoute extends BaseRoute {
    /**
     * Constructor
     * @class HomeRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Function to get the partial view by its name. The accepted name is Directoryname.ViewName.
     * @param req{Request}
     * @param res{Response}
     * @param next{NextFunction}
     * @returns Raw HTML{string}
     */
    public GetPartialViewByName(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.serverData) {

            let _serverData = JSON.parse(req.body.serverData);

            let _strName = <string>_serverData.ViewName;

            let _strDirectory = _strName.split('.')[0];
            let _strViewName = _strName.split('.')[1];
            
            let _strFilePath: string = Path.join(
                Path.dirname(require.main.filename || process.mainModule.filename),
                'Views',
                'Partials',
                _strDirectory,
                _strViewName + '.handlebars');
            ServerUtility.ReadFile(_strFilePath)
                .then((fileData: string) => {
                    res.send(fileData);
                })
                .catch((err) => {
                    ApplicationLog.LogError(err);
                    return null;
                });
        }
    }
}