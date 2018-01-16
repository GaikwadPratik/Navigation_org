//export * from './AdminRoute/AdminRoute';
//export * from './RegistrationRoute/RegistrationRoute';
import { NextFunction, Request, Response, Router } from 'express';
import * as ApplicationLog from '../ApplicationLog/ApplicationLog';
import * as passport from 'passport';

import { AdminRoute } from './AdminRoute/AdminRoute';
import { RegistrationRoute } from './RegistrationRoute/RegistrationRoute';
import { LoginRoute } from './LoginRoute/LoginRoute';

import { AddressRoute } from './ProfileRoute/AddressRoute';
import { ProfileRoute } from './ProfileRoute/ProfileRoute';
import { EducationRoute } from './ProfileRoute/EducationRoute';
import { SocietyRoute } from './ProfileRoute/SocietyRoute';
import { ContactRoute } from './ProfileRoute/ContactRoute';
import { ResearchRoute } from './ProfileRoute/ResearchRoute';
import { CommonRoute } from './CommonRoute/CommonRoute';
import { PublicationRoute } from './ProfileRoute/PublicationRoute';
import { OccupationRoute } from './ProfileRoute/OccupationRoute';

export class Routes {

    /**
     * Create the routes SercNav application.
     * Define all the routes in this method
     * @class Routes
     * @method CreateRoutes
     * @param router
     * @param passport
     */
    public CreateRoutes(router: Router, passport: passport.PassportStatic) {
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Starting creation of Admin routes');

        router.get('/Admin/AccountControl', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().AccountControl(req, res, next);
        }]);

        router.post('/Admin/GetUserRegistrationDetails', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().GetUserDetails(req, res, next);
        }]);

        router.post('/Admin/ProcessUserRegistration', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().ProcessUserRegistration(req, res, next);
        }]);

        router.post('/Admin/GetUserProfiles', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().GetUserProfiles(req, res, next);
        }]);

        router.post('/Admin/GetUserProfileDetails', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().GetUserProfileDetails(req, res, next);
        }]);

        router.post('/Admin/ProcessUserProfile', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AdminRoute().ProcessUserProfile(req, res, next);
        }]);

        ApplicationLog.LogDebug('[AdminRoute::CreateRoute] Completed creation of Admin routes');

        ApplicationLog.LogDebug('[Routes::CreateRoutes] Starting creation of Registration routes');

        router.get('/Register/', (req: Request, res: Response, next: NextFunction) => {
            new RegistrationRoute().RenderDefaultView(req, res, next);
        });

        router.post('/Register/RegisterUser', (req: Request, res: Response, next: NextFunction) => {
            new RegistrationRoute().RegisterUser(req, res, next);
        });
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Completed creation of Registration routes');

        //Sign In route
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Starting creation of Login routes');

        router.get('/Login/', (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().Login(req, res, next);
        });

        router.get('/Home/', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().RedirectToHome(req, res, next);
        }]);

        //Authenticate user from database using Passport.
        router.post('/Login/', passport.authenticate('local-login', { successRedirect: '/Home', failureRedirect: '/login', failureFlash: true, failureMessage: "Invalid email Id or password." }));

        router.get('/Logout/', (req: Request, res: Response, next: NextFunction) => {
            new LoginRoute().Logout(req, res, next);
        });
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Completed creation of Login routes');

        //profile routes
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Starting creation of Profile routes');
        router.get('/Profile/UserDashboard', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ProfileRoute().RenderDefaultView(req, res, next);
        }]);

        router.get('/Profile/CreateProfile', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ProfileRoute().RenderCreateProfile(req, res, next);
        }]);

        router.post('/Profile/StoreData', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ProfileRoute().SaveProfileData(req, res, next);
        }])
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Completed creation of Profile routes');
        //profile routes

        //Personal data route
        router.post('/Profile/Personal/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ProfileRoute().GetPersonalData(req, res, next);
        }]);

        //AddressRoutes
        ApplicationLog.LogDebug('[Routes::CreateRoutes] Starting creation of Profile/address routes');
        router.post('/Profile/Address/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AddressRoute().InitialAddressLoad(req, res, next);
        }]);

        router.post('/Profile/Address/GetState', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AddressRoute().GetStateByCountryId(req, res, next);
        }]);

        router.post('/Profile/Address/GetCity', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AddressRoute().GetCityByStateId(req, res, next);
        }]);

        router.post('/Profile/Address/GetAddresses', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new AddressRoute().GetAddressesByPersonId(req, res, next);
        }]);       

        ApplicationLog.LogDebug('[Routes::CreateRoutes] Completed creation of Profile/Address routes');
        //AddressRoutes

        //ContactRoutes
        router.post('/Profile/Contact/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ContactRoute().InitialContactLoad(req, res, next);
        }]);

        router.post('/Profile/Contact/GetContacts', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ContactRoute().GetContactByPersonId(req, res, next);
        }]);
        //ContactRoutes

        //Education routes
        router.post('/Profile/Education/GetEducations', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new EducationRoute().GetEducationByPersonId(req, res, next);
        }]);
        //Education routes

        
        //Research
        router.post('/Profile/Research/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ResearchRoute().InitialResearchLoad(req, res, next);
        }]);

        router.post('/Profile/Research/GetResearchTasksByPersonId', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ResearchRoute().GetResearchTasks(req, res, next);
        }]);

        router.post('/Profile/Research/GetProgramsByCategory', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ResearchRoute().GetProgramsByCategory(req, res, next);
        }]);

        router.post('/Profile/Research/GetProjectsByProgram', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new ResearchRoute().GetProjectsByProgram(req, res, next);
        }]);
        //Research

        // Professional Society Routes
        router.post('/Profile/Society/GetSociety', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new SocietyRoute().GetSocietyByPersonId(req, res, next);
        }]);
        router.post('/Profile/Society/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new SocietyRoute().InitialSocietyLoad(req, res, next);
        }]);
        //Professional Society Routes

        //Common routes
        router.post('/GetPartialViewByName', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {
            new CommonRoute().GetPartialViewByName(req, res, next);
        }])

        //Common routes
        router.post('/Profile/OccupationCategory/Initial', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {

            new OccupationRoute().GetCategories(req, res, next);
        }]);
        // /Profile/Occupation/GetOccupation
        router.post('/Profile/Occupation/GetOccupation', [this.IsAuthenticated, (req: Request, res: Response, next: NextFunction) => {

            new OccupationRoute().GetOccupationbyPersonId(req, res, next);
        }]);
    }

    /**
     * This function should be called on every route for which authentication is needed to access.
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    private IsAuthenticated(req: Request, res: Response, next: NextFunction): NextFunction | void {
        try {
            //if user is authenticated in session, let them proceed with request
            if (req.isAuthenticated()) {
                res.locals.isAuthenticated = true;
                return next();
            }
            else { //else rediect to login page
                delete res.locals;
                req.logOut();

                if (!req.xhr)
                    res.redirect(`/Login/`);
                else
                    res.send({ textStatus: null });
            }
        }
        catch (exception) {
            ApplicationLog.LogException(exception);
        }
    }
}