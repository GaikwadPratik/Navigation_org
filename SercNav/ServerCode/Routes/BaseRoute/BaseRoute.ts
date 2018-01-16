import { NextFunction, Request, Response } from 'express';

/**
 * The BaseRoute class
 * @class BaseRoute
 * To be used as base for all the routes
 */
export class BaseRoute {

    /**
     * Default title of the route.
     * @field
     * @class BaseRoute
     */
    protected title: string = '';

    /**
    * Array to include any external Javascript files
    * @field
    * @class BaseRoute
    */
    private scripts: Array<string> = null;

    /**
     * Constructor
     * @class BaseRoute
     * @constructor
     */
    constructor() {
        //initialize with default values
        this.title = 'SERC Navigation';
        this.scripts = [];
    }

    /**
     * Add a JS external file to the request.
     *
     * @class BaseRoute
     * @method addScript
     * @param src {string} The source path to the external JS file.
     * @return {BaseRoute} Self for chaining
     */
    public AddScript(src: string): BaseRoute {
        this.scripts.push(src);
        return this;
    }

    /**
     * Render a page.
     *
     * @class BaseRoute
     * @method render
     * @param req {Request} The request object.
     * @param res {Response} The response object.
     * @param view {String} The view to render.
     * @param options {Object} Additional options to append to the view's local scope.
     * @return void
     */
    public Render(req: Request, res: Response, view: string, options?: Object): void {
        //add constants
        res.locals.BASE_URL = "/";
        
        //add scripts
        res.locals.scripts = this.scripts;

        //add title
        res.locals.Title = this.title;

        //Handle errors in flash
        if (req.session && req.session['flash'] && req.session['flash'].error) {
            res.locals.ErrorMessages = req.session['flash'].error;
            delete req.session['flash'];
        }

        //render view
        res.render(view, options);
    }
}