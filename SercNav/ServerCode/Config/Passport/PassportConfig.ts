import * as express from 'express';
import * as passport from 'passport';
import * as PassportStrategy from 'passport-local';
import * as bcrypt from 'bcrypt-nodejs';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { DatabaseConnector } from '../../Database/DatabaseConnector';
import { LoginModel } from '../../Model/Login/LoginModel';
import { UserCredential } from '../../../Entity/UserCredential/UserCredential';
import * as ServerUtility from '../../ServerUtility/ServerUtility';

export class PassportConfig {
    private _localStrategy: PassportStrategy.Strategy = null;
    private _strategyOption: PassportStrategy.IStrategyOptionsWithRequest = { usernameField: 'email', passwordField: 'password', passReqToCallback: true };

    constructor() {
    }

    public InitializeStrategy(passport: passport.Passport) {
        passport.serializeUser(this.SerializeUser);
        passport.deserializeUser(this.DeserializeUser);
        this._localStrategy = new PassportStrategy.Strategy(this._strategyOption, this.SignIn);
        passport.use('local-login', this._localStrategy);
    }

    private SerializeUser(user: UserCredential, done: Function) {
        done(null, user);
    }

    private DeserializeUser(user: UserCredential, done: Function) {
        //TODO:: Before verification from database verify token also
        done(null, user);
    }

    private SignIn(req: express.Request, username: string, password: string, done: Function) {
        //Initiate the connection with databasse
        let _loginModel: LoginModel = new LoginModel();
        _loginModel.AuthenticateUser(username, ServerUtility.SaltHashPassword(password))
            .then((user: UserCredential) => {
                //TODO:: Set verification token
                done(null, user);
            })
            .catch((err) => {
                done(err, false, { message: 'Invalid username or password' });
            });
    }
}