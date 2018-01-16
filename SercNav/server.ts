/*
The body- parser middleware will parse JSON payload data into the req.body object that will be available in our express application.
The cookie- parser middleware is similar to the body- parser in that it parses the user’s cookie data and makes this available in the req.cookies object.
*/

import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as handleBars from 'express-handlebars';
import * as http from 'http';
import * as path from 'path';
import * as applicationLog from './ServerCode/ApplicationLog/ApplicationLog';
import { Routes } from './ServerCode/Routes/Routes';
import * as passport from 'passport';
import * as expressSession from 'express-session';
import { PassportConfig } from './ServerCode/Config/Passport/PassportConfig';
import flash = require('connect-flash');

/**
 * The server class
 * @class Server
 */
export class Server {

    /**
     * private instance of express app
     * @class Server
     * @field
     */
    private expressApp: express.Application = null;

    private passport: passport.PassportStatic = passport;

    /**
     * returns instance of express application
     * @class Server
     * @property
     */
    public get ExpressApp() {
        return this.expressApp;
    }

    /**
     * Constructor
     * @class Server
     * @constructor
     */
    constructor() {
        //Initiate instance of express app
        this.expressApp = express();

        //Configure application for the first use.
        this.Config();

        //Initialize passport for session
        this.InitializePassport();

        //Add routes
        this.Routes();
    }

    /**
     * To configure application
     * @class Server
     * @method Config
     */
    private Config() {
        //add static paths
        this.expressApp.use(express.static(path.join(__dirname, 'client')));

        //configure pug(formerly jade) view engine
        this.expressApp.set('views', path.join(__dirname, 'Views'));
        this.expressApp.engine('handlebars', handleBars({
            layoutsDir: path.join(__dirname, 'Views', 'Layout'),//Layout directory
            defaultLayout: 'layout', //Default layout property
            partialsDir: path.join(__dirname, 'Views', 'Partials')//Partial view directory
        }));
        this.expressApp.set('view engine', 'handlebars');

        //use json form parser middleware
        this.expressApp.use(bodyParser.json());

        //use query string parser middleware
        this.expressApp.use(bodyParser.urlencoded({
            extended: true
        }));

        //forward 404 to error handler
        this.expressApp.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
            err.status = 404;
            next(err);
            applicationLog.LogError(err);
        });
    }

    /**
     * Routes of the  application
     * @class Server
     * @method Routes
     */
    private Routes() {
        let router: express.Router = express.Router();
        new Routes().CreateRoutes(router, this.passport);
        this.expressApp.use(router);

        //static routes for JS
        //this.expressApp.use('/ExternalJavascript/jquery', express.static(path.join('node_modules', 'jquery', 'dist')));
        //this.expressApp.use('/ExternalJavascript/jquery-ui', express.static(path.join('node_modules', 'bootstrap', 'dist', 'js')));
        //this.expressApp.use('/ExternalJavascript/bootstrap', express.static(path.join('node_modules', 'bootstrap', 'dist', 'js')));
        this.expressApp.use('/ExternalJavascript/bootstrap-dialog', express.static(path.join('node_modules', 'bootstrap3-dialog', 'dist', 'js')));
        //this.expressApp.use('/ExternalJavascript/handlebars', express.static(path.join('node_modules', 'handlebars', 'dist')));

        //static routes for CSS
        //this.expressApp.use('/ExternalStyleSheet/bootstrap', express.static(path.join('node_modules', 'bootstrap', 'dist', 'css')));
        this.expressApp.use('/ExternalStyleSheet/bootstrap-dialog', express.static(path.join('node_modules', 'bootstrap3-dialog', 'dist', 'css')));

    }

    /**
     * Authentication done using PassportJS
     * @class Server
     * @method InitializePassport
     */
    private InitializePassport() {

        //TODO:: change default cookie settings 
        let _expressSessionOption: expressSession.SessionOptions =
            {
                secret: "THISISSESSIONSECRET",
                saveUninitialized: true,
                resave: false,
                cookie: {
                    httpOnly: true,
                    //secure: true, Need to check
                    maxAge: 30 * 60 * 1000
                }
            };
        this.expressApp.use(expressSession(_expressSessionOption));
        new PassportConfig().InitializeStrategy(passport);
        this.expressApp.use(this.passport.initialize());
        this.expressApp.use(this.passport.session());
        this.expressApp.use(flash());
        //let _expressSessionOptions: expressSession.SessionOptions = {
        //    secret: "510F234E-05AB-43CA-AD76-4E92192F9D07-FE7CA68B-D193-4967-9768-B327EF9647C3",
        //    saveUninitialized: true,
        //    resave: true,
        //    cookie: {
        //        httpOnly: true,
        //        //secure: true, Need to check
        //        maxAge: 5 * 60 * 1000
        //    }
        //};

        //if (this.expressApp.get(`env`) === `production`) {
        //    this.expressApp.set('trust proxy', 1);
        //    _expressSessionOptions.cookie.secure = true;
        //}

        //this.expressApp.use(expressSession(_expressSessionOptions));
        //this.expressApp.use(passport.initialize());
        //this.expressApp.use(passport.session());
    }

    // Enable CORS from client-side
    //app.use(function(req, res, next) {
    //    res.header("Access-Control-Allow-Origin", "*");
    //    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    //    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    //    res.header("Access-Control-Allow-Credentials", "true");
    //    next();
    //});
}

let expressApp: express.Application = new Server().ExpressApp;

//calculate port to work on.
let httpPort = 3333;//process.env.PORT || 8080;

//set application port
expressApp.set('port', httpPort);

//Start the server and listen on the port
let httpServer = http.createServer(expressApp);

httpServer.listen(httpPort, function () {
    let addr = httpServer.address();
    let listeningPort = typeof (addr) === 'string' ? `pipe ${addr}` : `port ${addr.port}`;
    applicationLog.LogInfo(`Listening on port ${listeningPort}`);
});

//if any errors in the server
httpServer.on('error', (error: Error) => {
    applicationLog.LogException(error);
});