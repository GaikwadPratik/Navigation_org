import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as Path from 'path';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';

import { RegistrationModel } from '../../Model/Registration/RegistrationModel';
import { MailerModel } from '../../Model/Mailer/MailerModel';
import { Person } from '../../../Entity/Person/Person';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';
import { IndustryAffiliation, IndustryCategory } from '../../../Entity/IndustryAffiliation/Index';
import { CommonModel } from '../../Model/Common/CommonModel';

export class RegistrationRoute extends BaseRoute {

    /**
     * Constructor
     * @class HomeRoute
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
        this.title = 'Registration';

        let _fetchBusinessCatgories: CommonModel = new CommonModel();
        let _fetchSercRoles: CommonModel = new CommonModel();

        Promise.all([_fetchBusinessCatgories.GetIndustryCategories(), _fetchSercRoles.GetSercRoles()])
            .then((data) => {

                //set options and custom objects
                let options: Object = {
                    BussinessCategories: data[0],
                    SercRoles: data[1]
                };

                //render view template
                this.Render(req, res, "Registration/registration", options);
            })
            .catch(() => {
                this.Render(req, res, 'Error/Error');
            })
    }

    /**
     * Register new user into the system
     * @class RegisterUser
     * @method RenderDefaultView
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public RegisterUser(req: Request, res: Response, next: NextFunction) {

        try {

            //Read the input from JSON data in AJAX call
            let _data = req.body.serverData;
            if (_data) {
                _data = JSON.parse(_data);
                //Create person and user credential objects
                let _person: Person = new Person();
                _person.FirstName = _data.firstName;
                _person.LastName = _data.lastName;
                _person.Caption = _data.caption;

                let _userCreds: UserCredential = new UserCredential();
                _userCreds.EmailId = _data.email;

                _userCreds.Password = ServerUtility.SaltHashPassword(_data.password);
                _userCreds.SercRoleId = parseInt(_data.userRole);
                _userCreds.Username = _data.userName;

                let _industryCategory = new IndustryCategory(parseInt(_data.industryAffl));
                let _industryAffiliation = new IndustryAffiliation(null, _data.industryName, _industryCategory);

                let _registerUser = new RegistrationModel();
                //Register user in database.
                _registerUser.RegisterNewUser(_person, _userCreds, _industryAffiliation)
                    .then((Response: any) => {
                        //if registration in database is successful
                        if (Response.Status) {
                            let _mailerModel = new MailerModel();

                            //Send mail to all the administrators.
                            let _data = null;
                            let _strAdminSubject: string = '';
                            let _strAdminBody: string = '';
                            let _strUserSubject: string = '';
                            let _strUserBody: string = '';

                            let _strAdminNewUser: string = Path.join(
                                Path.dirname(require.main.filename || process.mainModule.filename),
                                'ServerCode',
                                'EmailTemplates',
                                'AdminNewUser.json');

                            let _strNewUser: string = Path.join(
                                Path.dirname(require.main.filename || process.mainModule.filename),
                                'ServerCode',
                                'EmailTemplates',
                                'NewUserInformation.json');

                            Promise.all([ServerUtility.ReadFile(_strAdminNewUser)
                                , ServerUtility.ReadFile(_strNewUser)])
                                .then((data) => {
                                    
                                    try {
                                        let [_adminMailData, _userMailData] = data;
                                        let _adminMail = JSON.parse(_adminMailData);
                                        let _userMail = JSON.parse(_userMailData);
                                        _strAdminBody = _adminMail.body;
                                        _strAdminSubject = _adminMail.subject;

                                        _strUserBody = _userMail.body;
                                        _strUserSubject = _userMail.subject;

                                        _strUserBody = _strUserBody
                                            .replace(`<%USERFIRSTNAME%>`, _person.FirstName.trim());
                                        
                                        _mailerModel.SendMail(Response.Emails, _strAdminSubject, _strAdminBody)
                                            .catch((err) => {
                                                ApplicationLog.LogError(err);
                                            });
                                        //Send mail to user
                                        _mailerModel.SendMail(_userCreds.EmailId, _strUserSubject, _strUserBody)
                                            .catch((err) => {
                                                ApplicationLog.LogError(err);
                                            });
                                        res.send({ "status": "SUCCESS" });
                                    }
                                    catch (exception) {
                                        ApplicationLog.LogException(exception);
                                    }
                                });
                        }
                    })
                    .catch((errCode: string) => {
                        let _strErrorMessage = ServerUtility.GetErrorMessageFromConfig(errCode);
                        res.send({ "status": _strErrorMessage });
                    });
            }
            else
                return null;
        }
        catch (exception) {
            ApplicationLog.LogException(exception);
        }
    }
}