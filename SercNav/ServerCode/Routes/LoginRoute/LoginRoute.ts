import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { LoginModel } from '../../Model/Login/LoginModel';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';
import * as passport from 'passport';

export class LoginRoute extends BaseRoute {

    /**
     * Constructor
     * @class LoginRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Renders the Login view based on executing route 
     * @class LoginRoute
     * @method Login
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public Login(req: Request, res: Response, next: NextFunction) {
        //Set custom title
        this.title = 'Log In';

        //render view template
        this.Render(req, res, `Registration/signIn`);
    }

    /**
     * Renders the Login view based on executing route 
     * @class LoginRoute
     * @method Logout
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public Logout(req: Request, res: Response, next: NextFunction) {

        //Destroy session in the request
        req.logOut();

        //render view template
        res.redirect(`/Login`);
    }

    /**
     * Renders the view based on User's role if User is properly authenticated.
     * If the user is not found or authentication failed then redirect to login page again
     * @class LoginRoute
     * @method Login
     * @param req {Request} The express request object
     * @param res {Respnse} The express response object
     * @param next {NextFunction} Execute the next method
     */
    public RedirectToHome(req: Request, res: Response, next: NextFunction) {
        
        let _redirectUrl = `/Login/`;
        if (req.user) {
            let _sessionUser = <any>req.user;

            if (_sessionUser) {
                
                //Redirect user based on role
                if (_sessionUser.UserCredential.SercRoleName.toUpperCase() === 'ADMINUSER') {
                    _redirectUrl = '/Admin/AccountControl';
                }
                else if (_sessionUser.UserCredential.SercRoleName.toUpperCase() === 'TRUSTEDUSER') {
                    _redirectUrl = '/Profile/UserDashboard'
                    // _redirectUrl = '/Profile/CreateProfile';
                }
            }
            else {
                ApplicationLog.LogWarning(`Something went wrong in populating user info after login`);
            }
        }
        res.redirect(_redirectUrl);
    }
}