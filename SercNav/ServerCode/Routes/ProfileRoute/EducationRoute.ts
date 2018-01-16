import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { Person } from '../../../Entity/Person/Person';
import { Education } from '../../../Entity/Profile/Education/Education';
import { EducationModel } from '../../Model/Profile/Education/EducationModel';

export class EducationRoute extends BaseRoute {

    /**
     * Constructor
     * @class EducationRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Function to get all the education details of the person by personId
     * @returns JSON object of the education array
     * @param req {Request}
     * @param res {Response}
     * @param next {NextFunction}
     */
    public GetEducationByPersonId(req: Request, res: Response, next: NextFunction) {
        if (req && req.user.Person) {
            let _nPersonId = <number>req.user.Person.PersonId;

            let _educationModel: EducationModel = new EducationModel();
            _educationModel.GetEducationbyPersonId(_nPersonId)
                .then((education: Array<Education>) => {

                    if (education) {
                        res.send(education);
                    }
                    else
                        return null;
                })
                .catch((errcode) => {
                    ServerUtility.GetErrorMessageFromConfig(errcode);
                    return null;
                });
        }
        else
            return null;
    }
}