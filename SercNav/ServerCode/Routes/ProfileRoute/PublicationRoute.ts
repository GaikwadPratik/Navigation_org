import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { Person } from '../../../Entity/Person/Person';
import { PublicationModel } from '../../Model/Profile/Publication/PublicationModel';
import {  } from '../../../Entity/Profile/Publication/Index';

export class PublicationRoute extends BaseRoute {

    /**
     * Constructor
     * @class AddressRoute
     * @constructor
     */
    constructor() {
        super();
    }
    /**
     * Renders the view based on executing route 
     * @class RegistrationRoute
     * @method RenderDefaultView
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public RenderDefaultView(req: Request, res: Response, next: NextFunction) {
        //Set custom title
        this.title = 'Profile';
        let _sessionUser = req.user;

        //set options and custom objects
        let options: Object = {
            UserDetails: _sessionUser.Person
        };

        //render view template
        this.Render(req, res, "Profile/Publication", options);
    }



    /**
     * Function to get all the addresses of the person by personId
     * @returns JSON object of the address array
     * @param req
     * @param res
     * @param next
     */
    /**
   * Function to get Countries and address types
   * @returns JSON object of the countries array
   * @param req
   * @param res
   * @param next
   */
    public InitialSocietyLoad(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {

            let _objectsToLoad: string = <string>JSON.parse(req.body.serverData);

            //if (_objectsToLoad.indexOf('SocietyTypes') > -1) {
            //    let _fetchContactTypes: PublicationModel = new PublicationModel();

            //    _fetchContactTypes
            //        .GetSocieties()
            //        .then((data: Array<SocietyType>) => {

            //            if (data) {
            //                let _rtnObject: Object = {
            //                    'SocietyTypes': data
            //                };
            //                //render view template
            //                res.send(_rtnObject);
            //            }
            //            else
            //                res.send({ textstatus: null });
            //        })
            //        .catch(() => {
            //            res.send({ textstatus: null });
            //        });
            //}
        }
        else
            res.send({ textstatus: null });
    }


    /**
    * Function to get all the education details of the person by personId
    * @returns JSON object of the education array
    * @param req {Request}
    * @param res {Response}
    * @param next {NextFunction}
    */
    public GetSocietyByPersonId(req: Request, res: Response, next: NextFunction) {

        if (req && req.user.Person) {
            //let _nPersonId = <number>req.user.Person.PersonId;

            //let _societyModel: PublicationModel = new PublicationModel();
            //_societyModel
            //    .GetSocietybyPersonId(_nPersonId)
            //    .then((contacts: Array<Societies>) => {


            //        if (contacts) {
            //            res.send(contacts);
            //        }
            //        else
            //            return null;
            //    })
            //    .catch((errcode) => {
            //        ServerUtility.GetErrorMessageFromConfig(errcode);
            //        return null;
            //    });
        }
        else
            return null;
    }


    /**
 * Register new user into the system
 * @class RegisterUser
 * @method RenderDefaultView
 * @param req {Request} The express request object
 * @param res {Respnse} The express response object
 * @param next {NextFunction} Execute the next method
 */


}