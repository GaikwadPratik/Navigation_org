import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { Person } from '../../../Entity/Person/Person';
import { ContactType, Contacts } from '../../../Entity/Profile/Contact/Index';
import { Address, Country, State, City, AddressType } from '../../../Entity/Profile/Address/Index';
import { SocietyType, Societies } from '../../../Entity/Profile/Society/Index';
import { Assignment } from '../../../Entity/Profile/Occupation/Index';
import { BusinessEntity } from '../../../Entity/Profile/BusinessEntity/BusinessEntity';
import { Education } from '../../../Entity/Profile/Education/Education';
import { ResearchCategory, ResearchProgram, ResearchProject, ResearchRole, ResearchTask } from '../../../Entity/Profile/Research/Index';
import { PersonalModel } from '../../Model/Profile/Personal/PersonalModel';
import { ContactModel } from '../../Model/Profile/Contact/ContactsModel';
import { AddressModel } from '../../Model/Profile/Address/AddressModel';
import { EducationModel } from '../../Model/Profile/Education/EducationModel';
import { SocietyModel } from '../../Model/Profile/Society/SocietyModel';
import { OccupationModel } from '../../Model/Profile/Occupation/OccupationModel';
import { ResearchModel } from '../../Model/Profile/Research/ResearchModel';

/*import { RegistrationModel } from '../../Model/Registration/RegistrationModel';
import { MailerModel } from '../../Model/Mailer/MailerModel';
import { Person } from '../../../Entity/Person/Person';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';*/

export class ProfileRoute extends BaseRoute {

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
        this.title = 'Profile';
        let _sessionUser = req.user;

        //set options and custom objects
        let options: Object = {
            UserDetails: _sessionUser.Person
        };
        this.Render(req, res, "Profile/UserDashboard", options);
        //render view template
        //this.Render(req, res, "Profile/CreateProfile", options);
    }

    /**
    * Renders the view based on executing route 
    * @class RegistrationRoute
    * @method RenderDefaultView
    * @param req {Request} The express request object
    * @param res {Respnse} The express response object
    * @param next {NextFunction} Execute the next method
    */
    public RenderCreateProfile(req: Request, res: Response, next: NextFunction) {
        //Set custom title
        this.title = 'Profile';
        let _sessionUser = req.user;

        //set options and custom objects
        let options: Object = {
            UserDetails: _sessionUser.Person
        };
        this.Render(req, res, "Profile/CreateProfile", options);
    }

    /**
     * Saves the data from Profile to database.
     * This function calls different model based on incoming object
     * @class RegistrationRoute
     * @method RenderDefaultView
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public SaveProfileData(req: Request, res: Response, next: NextFunction) {

        if (req.body && req.body.serverData) {
            let _clientObject = JSON.parse(req.body.serverData);
            if (_clientObject) {
                let _person = <Person>req.user.Person;
                if (_person) {
                    let _strModelToCall: string = Object.getOwnPropertyNames(_clientObject)[0];
                    switch (_strModelToCall.toUpperCase()) {
                        case 'PERSONALINFO':
                            _clientObject = _clientObject.PersonalInfo.PersonalInformation;
                            _person.Caption = _clientObject.lblProfileSalutation;
                            _person.FirstName = _clientObject.lblProfileFirstName;
                            _person.MiddleName = _clientObject.lblProfileMiddleName;
                            _person.LastName = _clientObject.lblProfileLastName;
                            _person.IsSercResearcher = _clientObject.lblProfileSercResearch.toUpperCase() === 'YES';
                            _person.DateofBirth = new Date(_clientObject.lblProfileDateofBirth);

                            let _address = new Address();
                            _address.City = new City(parseInt(_clientObject.lblProfileBirthCity));
                            _address.State = new State(parseInt(_clientObject.lblProfileBirthState));
                            _address.Country = new Country(parseInt(_clientObject.lblProfileBirthCountry));
                            _address.AddressType = new AddressType(parseInt(_clientObject.lblhdnAddressType));
                            _address.AddressId = _clientObject.lblhdnAddressId ? parseInt(_clientObject.lblhdnAddressId) : 0;
                            _address.PersonId = _person.PersonId;

                            let _personalModel: PersonalModel = new PersonalModel();
                            let _addressModel: AddressModel = new AddressModel();

                            Promise.all([_personalModel.UpdatePersonalDetails(_person), _addressModel.AddAddressInfo(_address)])
                                .then((data) => {
                                    //TODO:: work on passing the message to client
                                    //let _response = {};
                                    //let [personResponse, addressResponse] = data;
                                    //_response["Status"] = ServerUtility.GetErrorMessageFromConfig("S0000");
                                    //if (personResponse !== 'S0000')
                                    //    _response["PersonalUpdate"] = ServerUtility.GetErrorMessageFromConfig("PU0001");
                                    //if (addressResponse !== 'S0000')
                                    //    _response["AddressUpdate"] = ServerUtility.GetErrorMessageFromConfig("AU0001");
                                    res.send({ "status": "Success" });
                                });
                            break;

                        case 'EDUCATIONINFO':

                            _clientObject = _clientObject.EducationInfo;
                            if (_clientObject) {
                                let _nCount = 1;//Object.keys(_clientObject).length;

                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _educationDiv in _clientObject) {
                                    _nCount = parseInt(_educationDiv.replace("divEducation", ''));
                                    let _educationModel: EducationModel = new EducationModel();
                                    let _divObject = _clientObject[_educationDiv];
                                    if (_divObject) {
                                        let _education: Education = new Education(parseInt(_divObject[`lblEducationID${_nCount}`]), _person.PersonId, _divObject[`lblEducationDegreeName${_nCount}`], _divObject[`lblEducationType${_nCount}`], parseInt(_divObject[`lblEducationGradYear${_nCount}`]), _divObject[`lblEducationInstitutionName${_nCount}`]);
                                        _education.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_educationModel.AddEducationInfo(_education));
                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;

                        case 'CONTACTINFO':
                            _clientObject = _clientObject.ContactInfo;
                            if (_clientObject) {
                                let _nCount = 1;//Object.keys(_clientObject).length;
                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _contactDiv in _clientObject) {
                                    _nCount = parseInt(_contactDiv.replace("divContact", ''));
                                    let _contactModel: ContactModel = new ContactModel();
                                    let _divObject = _clientObject[_contactDiv];
                                    if (_divObject) {
                                        let _contact: Contacts = new Contacts(_person.PersonId, parseInt(_divObject[`lblContactId${_nCount}`]), new ContactType(parseInt(_divObject[`lblContactType${_nCount}`])), _divObject[`lblContactValue${_nCount}`]);
                                        _contact.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_contactModel.AddContactInfo(_contact));
                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;

                        case 'ADDRESSINFO':
                            _clientObject = _clientObject.AddressInfo;
                            if (_clientObject) {
                                let _nCount = 1;//Object.keys(_clientObject).length;
                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _addressDiv in _clientObject) {
                                    _nCount = parseInt(_addressDiv.replace("divAddress", ''));
                                    let _addressModel: AddressModel = new AddressModel();
                                    let _divObject = _clientObject[_addressDiv];
                                    if (_divObject) {
                                        let _address: Address = new Address();

                                        _address.PersonId = _person.PersonId;
                                        _address.AddressId = parseInt(_divObject[`lblAddressId${_nCount}`]);
                                        _address.AddressType = new AddressType(parseInt(_divObject[`lblAddressType${_nCount}`]));
                                        _address.AddressLine1 = _divObject[`lblAddressFirstLine${_nCount}`];
                                        _address.AddressLine2 = _divObject[`lblAddressSecondLine${_nCount}`];
                                        _address.Country = new Country(parseInt(_divObject[`lblAddressCountry${_nCount}`]));
                                        _address.State = new State(parseInt(_divObject[`lblAddressState${_nCount}`]));
                                        _address.City = new City(parseInt(_divObject[`lblAddressCity${_nCount}`]));
                                        _address.Zip = parseInt(_divObject[`lblZip${_nCount}`]) || parseInt('0000');
                                        _address.FromDate = new Date(_divObject[`lblAddressFromDate${_nCount}`].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                                        _address.ToDate = _divObject[`lblAddressToDate${_nCount}`] ? new Date(_divObject[`lblAddressToDate${_nCount}`].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")) : null;
                                        _address.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_addressModel.AddAddressInfo(_address));
                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;

                        case 'SOCIETYINFO':
                            _clientObject = _clientObject.SocietyInfo;
                            if (_clientObject) {

                                let _nCount = 1;//Object.keys(_clientObject).length;
                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _contactDiv in _clientObject) {
                                    _nCount = parseInt(_contactDiv.replace("divSociety", ''));
                                    let _societyModel: SocietyModel = new SocietyModel();
                                    let _divObject = _clientObject[_contactDiv];
                                    if (_divObject) {
                                        let _societies: Societies = new Societies(_person.PersonId, parseInt(_divObject[`lblSocietyId${_nCount}`]), new SocietyType(parseInt(_divObject[`lblSocietyType${_nCount}`])), _divObject[`lblSocietyType${_nCount}`]);
                                        _societies.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_societyModel.AddSocietyInfo(_societies));


                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;


                        case 'OCCUPATIONINFO':
                            _clientObject = _clientObject.OccupationInfo;
                            if (_clientObject) {
                                ;
                                let _nCount = 1;//Object.keys(_clientObject).length;
                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _occupationDiv in _clientObject) {
                                    _nCount = parseInt(_occupationDiv.replace("divOccupation", ''));
                                    let _occupationModel: OccupationModel = new OccupationModel();
                                    let _divObject = _clientObject[_occupationDiv];
                                    if (_divObject) {
                                       
                                        let _entity: BusinessEntity = new BusinessEntity(parseInt(_divObject[`lblIndustryAff${_nCount}`]), _divObject[`lblOrganizationName${_nCount}`], _divObject[`lblEntityId${_nCount}`] );
                                        let _assignment: Assignment = new Assignment(_person.PersonId, _divObject[`lblRole${_nCount}`], _divObject[`lblTitle${_nCount}`], _divObject[`lblStartDate${_nCount}`], _divObject[`lblEndDate${_nCount}`]);
                                        _assignment.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_occupationModel.AddOccupationInfo(_entity, _assignment));


                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;

                        case 'RESEARCHINFO':
                            _clientObject = _clientObject.ResearchInfo;
                            if (_clientObject) {
                                let _nCount = 1;//Object.keys(_clientObject).length;
                                let _resultArray = [];
                                let _promiseArray = [];
                                for (let _researchDiv in _clientObject) {
                                    _nCount = parseInt(_researchDiv.replace("divResearchTask", ''));
                                    let _researchModel: ResearchModel = new ResearchModel();
                                    let _divObject = _clientObject[_researchDiv];
                                    if (_divObject) {
                                        let _researchTask: ResearchTask = new ResearchTask();

                                        _researchTask.PersonId = _person.PersonId;
                                        _researchTask.ResearchTaskId = parseInt(_divObject[`lblResearchTaskId${_nCount}`]);
                                        _researchTask.BussinessEntity = new BusinessEntity();
                                        _researchTask.BussinessEntity.entityId = parseInt(_divObject[`lblUniversityAffiliation${_nCount}`]);
                                        _researchTask.ResearchProject = new ResearchProject(parseInt(_divObject[`lblReseachProject${_nCount}`]));
                                        _researchTask.ResearchProject.ResearchProgram = new ResearchProgram(parseInt(_divObject[`lblReseachProgram${_nCount}`]));
                                        _researchTask.ResearchProject.ResearchProgram.ResearchCategory = new ResearchCategory(parseInt(_divObject[`lblResearchCategory${_nCount}`]));
                                        _researchTask.ResearchTaskNumber = _divObject[`lblReseachTaskName${_nCount}`];
                                        _researchTask.ResearchRole = _divObject[`lblUserTaskRole${_nCount}`];
                                        //_researchTask.StartDate = new Date(_divObject[`lblAddressFromDate${_nCount}`].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
                                        //_researchTask.EndDate = _divObject[`lblAddressToDate${_nCount}`] ? new Date(_divObject[`lblAddressToDate${_nCount}`].replace(/(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3")) : null;
                                        _researchTask.IsDeleted = _divObject[`isDeleted`];
                                        _promiseArray.push(_researchModel.AddUpdateResearchTaskInfo(_researchTask));
                                    }
                                }

                                _promiseArray.reduce((cur, next) => {
                                    return cur.then(next);
                                }).then((data) => {
                                    _resultArray.push(data);
                                });

                                if (_resultArray.indexOf("S0000") < 0)
                                    res.send({ "status": "Success" });
                                else
                                    res.send(null);
                            }
                            break;
                    }

                }
            }
        }
    }

    /**
     * Register new user into the system
     * @class RegisterUser
     * @method RenderDefaultView
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public GetPersonalData(req: Request, res: Response, next: NextFunction) {

        try {
            new PersonalModel()
                .GetPersonalProfileData(req.user.Person.PersonId)
                .then((userData: any) => {
                    //set options and custom objects
                    let options: Object = {
                        UserDetails: userData.Person,
                        BirthAddressDetails: userData.Address
                    };

                    //render view template
                    res.send(options);
                });
        }
        catch (exception) {
            ApplicationLog.LogException(exception);
        }
    }
}