import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { Person } from '../../../Entity/Person/Person';
import { ContactType, Contacts } from '../../../Entity/Profile/Contact/Index';
import { ContactModel } from '../../Model/Profile/Contact/ContactsModel';

export class ContactRoute extends BaseRoute {

    /**
     * Constructor
     * @class ContactRoute{ContactRoute}
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
    public GetContactByPersonId(req: Request, res: Response, next: NextFunction) {
        if (req && req.user.Person) {
            let _nPersonId = <number>req.user.Person.PersonId;

            let _contactModel: ContactModel = new ContactModel();
            _contactModel
                .GetContactsbyPersonId(_nPersonId)
                .then((contacts) => {

                    if (contacts) {
                        res.send(contacts);
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

    /**
     * Function to get Countries and address types
     * @returns JSON object of the countries array
     * @param req
     * @param res
     * @param next
     */
    public InitialContactLoad(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {

            let _objectsToLoad: string = <string>JSON.parse(req.body.serverData);

            if (_objectsToLoad.indexOf('ContactTypes') > -1) {
                let _fetchContactTypes: ContactModel = new ContactModel();

                _fetchContactTypes
                    .GetContactTypes()
                    .then((data: Array<ContactType>) => {

                        if (data) {
                            let _rtnObject: Object = {
                                'ContactTypes': data
                            };
                            //render view template
                            res.send(_rtnObject);
                        }
                        else
                            res.send({ textstatus: null });
                    })
                    .catch(() => {
                        res.send({ textstatus: null });
                    });
            }
        }
        else
            res.send({ textstatus: null });
    }
}