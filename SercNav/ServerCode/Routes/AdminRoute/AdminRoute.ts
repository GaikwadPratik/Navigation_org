import { NextFunction, Request, Response } from 'express';
import * as Path from 'path';
import * as applicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';

import { BaseRoute } from '../BaseRoute/BaseRoute';
import { AccountRegistrationModel } from '../../Model/AdminPanel/AccountRegistrationModel';
import { AccountControlModel } from '../../Model/AdminPanel/AccountControlModel';
import { MailerModel } from '../../Model/Mailer/MailerModel';
import { CommonModel } from '../../Model/Common/CommonModel';

import { PersonalModel } from '../../Model/Profile/Personal/PersonalModel';
import { AddressModel } from '../../Model/Profile/Address/AddressModel';
import { ContactModel } from '../../Model/Profile/Contact/ContactsModel';
import { EducationModel } from '../../Model/Profile/Education/EducationModel';
import { OccupationModel } from '../../Model/Profile/Occupation/OccupationModel';
import { ResearchModel } from '../../Model/Profile/Research/ResearchModel';
import { SocietyModel } from '../../Model/Profile/Society/SocietyModel';

/**
 * HomeRoute class
 * @class HomeRoute
 */
export class AdminRoute extends BaseRoute {

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
     * @class HomeRoute
     * @method AccountControl
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public AccountControl(req: Request, res: Response, next: NextFunction) {
        //Set custom title
        this.title = 'Account Control';

        let _fetchNewUsers: AccountRegistrationModel = new AccountRegistrationModel();
        let _fetchApprovedUsers: AccountRegistrationModel = new AccountRegistrationModel();

        Promise.all([_fetchNewUsers.GetNewRegisteredUsers(), _fetchApprovedUsers.GetRegisteredProcessedUsers()])
            .then((response) => {

                let [_lstRequestsTobeProcessedUsers, _lstRequestsProcessedUsers] = response;

                //set options and custom objects
                let _options: Object = {
                    LstToProcess: _lstRequestsTobeProcessedUsers,
                    LstProcessed: _lstRequestsProcessedUsers
                }

                //render view template
                this.Render(req, res, "AdminPanel/accountControl", _options);
            })
            .catch(() => {
                this.Render(req, res, "Error/error");
            });
    }

    /**
     * Get user profiles for Account control page 
     * @class AdminRoute
     * @method GetUserProfiles
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public GetUserProfiles(req: Request, res: Response, next: NextFunction) {
        //Set custom title
        //this.title = 'Account Control';

        let _fetchNewUsers: AccountControlModel = new AccountControlModel();
        let _fetchApprovedUsers: AccountControlModel = new AccountControlModel();

        Promise.all([_fetchNewUsers.GetUnProcessedUserProfiles(), _fetchApprovedUsers.GetProcessedUserProfiles()])
            .then((response) => {

                let [_lstRequestsTobeProcessedUsers, _lstRequestsProcessedUsers] = response;

                //set options and custom objects
                let _options: Object = {
                    LstToProcess: _lstRequestsTobeProcessedUsers,
                    LstProcessed: _lstRequestsProcessedUsers
                }

                //render view template
                res.send({ response: _options });
            })
            .catch(() => {

                this.Render(req, res, "Error/error");
            });
        //this.Render(req, res, "AdminPanel/accountControl");
    }

    /**
     * Function to get users details by user id. Returns JSON object of details
     * @class HomeRoute
     * @method GetUserDetails
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public GetUserDetails(req: Request, res: Response, nest: NextFunction) {
        if (req.body && req.body.serverData) {
            let _data = JSON.parse(req.body.serverData);

            let _nPersonId = <number>_data.PersonId;

            let _fetchUserDetails: AccountRegistrationModel = new AccountRegistrationModel();

            let _promiseArray = [_fetchUserDetails.GetRegisteredUserDetails(_nPersonId)];

            if (_data.GetCategories) {
                let _commonModel: CommonModel = new CommonModel();
                _promiseArray.push(_commonModel.GetIndustryCategories());
            }

            Promise.all(_promiseArray)
                .then((data) => {
                    res.send(data);
                }).catch(() => {
                    res.send({ textStatus: null });
                });
        }
        else
            return null;
    }

    /**
     * Function to approve or reject the registration request by admin
     * @param {Request} req
     * @param {Response} res
     * @param {Function} next
     */
    public ProcessUserRegistration(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.serverData) {

            let _serverData = JSON.parse(req.body.serverData);
            let _personId = <number>_serverData.personId;
            let _action = <string>_serverData.action;
            let _comments = <string>_serverData.comments;
            let _industryName = <string>_serverData.industryName;
            let _industryCategoryName = <number>_serverData.industryCategoryName;

            if (_personId && _action) {
                if (_action.trim().toLowerCase() === 'reject' && (!_comments || _comments === ''))
                    return null;
                let _fetchUserDetails: AccountRegistrationModel = new AccountRegistrationModel();

                _fetchUserDetails.ProcessRegisteredUser(_personId, _action.trim().toLowerCase(), _comments.trim(), _industryName.trim(), _industryCategoryName)
                    .then((data: any) => {

                        if (data) {
                            if (_action.trim().toLowerCase() === 'approve') {

                                let _strNewApprovalUser: string = Path.join(
                                    Path.dirname(require.main.filename || process.mainModule.filename),
                                    'ServerCode',
                                    'EmailTemplates',
                                    'RegistrationApprovedUser.json');

                                ServerUtility.ReadFile(_strNewApprovalUser)
                                    .then((fileData) => {
                                        try {

                                            let _userMail = JSON.parse(fileData);
                                            let _strUserBody = _userMail.body;
                                            let _strUserSubject = _userMail.subject;
                                            _strUserBody = _strUserBody
                                                .replace(`<%USERFIRSTNAME%>`, data.FirstName.trim());

                                            let _mailerModel = new MailerModel();
                                            _mailerModel.SendMail(data.Email, _strUserSubject, _strUserBody)
                                                .catch((err) => {
                                                    applicationLog.LogError(err);
                                                });
                                        }
                                        catch (exception) {
                                            applicationLog.LogException(exception);
                                        }
                                    });
                            }

                            res.send({ 'Status': 'PROCESSED' });
                        }
                    })
                    .catch(() => {
                        res.send({ textStatus: null });
                    });
            }
            else
                return null;
        }
        else
            return null;
    }

    /**
     * Function to get users profile details by user id. Returns JSON object of details
     * @class HomeRoute
     * @method GetUserDetails
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public GetUserProfileDetails(req: Request, res: Response, nest: NextFunction) {
        if (req.body && req.body.serverData) {

            let _data = JSON.parse(req.body.serverData);
            let _nPersonId = parseInt(_data.PersonId);
            let _personalModel = new PersonalModel();
            let _addressModel = new AddressModel();
            let _contactModel = new ContactModel();
            let _educationModel = new EducationModel();
            let _occupationModel = new OccupationModel();
            let _researchModel = new ResearchModel();
            let _societyModel = new SocietyModel();

            Promise.all([_personalModel.GetPersonalProfileData(_nPersonId),
            _contactModel.GetContactsbyPersonId(_nPersonId),
            _addressModel.GetAddressesByPersonId(_nPersonId),
            _educationModel.GetEducationbyPersonId(_nPersonId),
            _occupationModel.GetOccupationbyPersonId(_nPersonId),
            _researchModel.GetReserachesbyPersonId(_nPersonId),
            _societyModel.GetSocietybyPersonId(_nPersonId)])
                .then((data) => {

                    let _rtnObject = {
                        PersonalDetails: data[0],
                        ContactDetails: data[1],
                        AddressDetails: data[2],
                        EducationDetails: data[3],
                        OccupationDetails: data[4],
                        ResearchDetails: data[5],
                        SocientyDetails: data[6]
                    };
                    res.send(_rtnObject);
                })
                .catch(() => {
                    return null;
                });
        }
        else
            return null;
    }

    /**
     * Function to approve or reject the profile request by admin
     * @param req
     * @param res
     * @param next
     */
    public ProcessUserProfile(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.serverData) {

            let _serverData = JSON.parse(req.body.serverData);
            let _personId = parseInt(_serverData.personId);
            let _action = <string>_serverData.action;
            let _comments = <string>_serverData.comments;

            if (_personId && _action) {
                if (_action.trim().toLowerCase() === 'reject' && (!_comments || _comments === ''))
                    return null;
                let _fetchUserDetails: AccountRegistrationModel = new AccountRegistrationModel();

                _fetchUserDetails.ProcessProfileRequest(_personId, _action.trim().toLowerCase(), _comments.trim())
                    .then((data: any) => {

                        if (data) {
                            if (_action.trim().toLowerCase() === 'approve') {

                                let _strNewApprovalUser: string = Path.join(
                                    Path.dirname(require.main.filename || process.mainModule.filename),
                                    'ServerCode',
                                    'EmailTemplates',
                                    'ProfileApprovedUser.json');

                                ServerUtility.ReadFile(_strNewApprovalUser)
                                    .then((fileData) => {
                                        try {

                                            let _userMail = JSON.parse(fileData);
                                            let _strUserBody = _userMail.body;
                                            let _strUserSubject = _userMail.subject;
                                            _strUserBody = _strUserBody
                                                .replace(`<%USERFIRSTNAME%>`, data.FirstName.trim());

                                            let _mailerModel = new MailerModel();
                                            _mailerModel.SendMail(data.Email, _strUserSubject, _strUserBody)
                                                .catch((err) => {
                                                    applicationLog.LogError(err);
                                                });
                                        }
                                        catch (exception) {
                                            applicationLog.LogException(exception);
                                        }
                                    });
                            }

                            res.send({ 'Status': 'PROCESSED' });
                        }
                    })
                    .catch(() => {
                        res.send({ textStatus: null });
                    });
            }
            else
                return null;
        }
        else
            return null;
    }
}