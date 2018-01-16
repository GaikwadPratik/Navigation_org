import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { Person } from '../../../Entity/Person/Person';
import { OccupationModel } from '../../Model/Profile/Occupation/OccupationModel';
import { Assignment } from '../../../Entity/Profile/Occupation/Index';
import { BusinessEntity } from '../../../Entity/Profile/BusinessEntity/BusinessEntity';
import { CommonModel } from '../../Model/Common/CommonModel';


export class OccupationRoute extends BaseRoute {

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
        this.Render(req, res, "Profile/Occupation", options);
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
    public GetCategories(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {

            let _fetchBusinessCatgories: CommonModel = new CommonModel();

            _fetchBusinessCatgories
                .GetIndustryCategories()
                    .then((data: Array<any>) => {

                        if (data) {
                            let _rtnObject: Object = {
                                'Category': data
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


    /**
    * Function to get all the education details of the person by personId
    * @returns JSON object of the education array
    * @param req {Request}
    * @param res {Response}
    * @param next {NextFunction}
    */
    public GetOccupationbyPersonId(req: Request, res: Response, next: NextFunction) {

        if (req && req.user.Person) {
            let _nPersonId = <number>req.user.Person.PersonId;

            let _occupationModel: OccupationModel= new OccupationModel();
            _occupationModel
                .GetOccupationbyPersonId(_nPersonId)
                .then((contacts: Array<any>) => {


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
 * Register new user into the system
 * @class RegisterUser
 * @method RenderDefaultView
 * @param req {Request} The express request object
 * @param res {Respnse} The express response object
 * @param next {NextFunction} Execute the next method
 */


}