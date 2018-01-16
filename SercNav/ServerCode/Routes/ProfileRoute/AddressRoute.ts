import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import { AddressModel } from '../../Model/Profile/Address/AddressModel';
import { Address, AddressType, City, Country, State } from '../../../Entity/Profile/Address/Index';

export class AddressRoute extends BaseRoute {

    /**
     * Constructor
     * @class AddressRoute
     * @constructor
     */
    constructor() {
        super();
    }

    /**
     * Function to get all the addresses of the person by personId
     * @returns JSON object of the address array
     * @param req
     * @param res
     * @param next
     */
    public GetAddressesByPersonId(req: Request, res: Response, next: NextFunction) {
        if (req && req.user.Person) {
            let _nPersonId = <number>req.user.Person.PersonId;

            let _addressModel: AddressModel = new AddressModel();
            _addressModel.GetAddressesByPersonId(_nPersonId)
                .then((addresses) => {
                    
                    if (addresses) {
                        res.send(addresses);
                    }
                    else
                        return null;
                })
                .catch(() => {
                    return null;
                });
        }
        else
            return null;
    }

    /**
     * Function to get Countries and address types
     * @returns JSON object of the countries array
     * @param req
     * @param res
     * @param next
     */
    public InitialAddressLoad(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {

            let _objectsToLoad: string = <string>JSON.parse(req.body.serverData);

            let _promiseArray = [];
            if (_objectsToLoad.indexOf('Countries') > -1) {
                let _fetchCountris: AddressModel = new AddressModel();
                _promiseArray.push(_fetchCountris.GetCountries());
            }

            if (_objectsToLoad.indexOf('AddressTypes') > -1) {
                let _fetchAddressTypes: AddressModel = new AddressModel();
                _promiseArray.push(_fetchAddressTypes.GetAddressTypes());
            }

            Promise.all(_promiseArray)
                .then((data: [Array<Country>, Array<AddressType>]) => {

                    let [_countries, _addressTypes] = data;

                    if (_countries || _addressTypes) {
                        let _rtnObject: Object = {};

                        if (_objectsToLoad.indexOf('Countries') > -1 && _objectsToLoad.indexOf('AddressTypes') > -1) {
                            _rtnObject['Countries'] = _countries;
                            _rtnObject['AddressTypes'] = _addressTypes;
                        }
                        else if (_objectsToLoad.indexOf('Countries') > -1)
                            _rtnObject['Countries'] = data[0];
                        else if (_objectsToLoad.indexOf('AddressTypes') > -1)
                            _rtnObject['AddressTypes'] = data[0];

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
        else
            res.send({ textstatus: null });
    }

    /**
     * Function to get Countries
     * @returns JSON object of the state
     * @param req
     * @param res
     * @param next
     */
    public GetStateByCountryId(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.serverData) {
            let _nCountryId = <number>req.body.serverData;

            let _addressModel: AddressModel = new AddressModel();
            _addressModel.GetStates(_nCountryId)
                .then((states: Array<State>) => {
                    if (states) {
                        res.send(states);
                    }
                    else
                        return null;
                })
                .catch(() => {
                    return null;
                });
        }
        else
            return null;
    }

    /**
     * Function to get Countries
     * @returns JSON object of the city
     * @param req
     * @param res
     * @param next
     */
    public GetCityByStateId(req: Request, res: Response, next: NextFunction) {
        if (req.body && req.body.serverData) {
            let _nStateId = <number>req.body.serverData;

            let _addressModel: AddressModel = new AddressModel();
            _addressModel.GetCities(_nStateId)
                .then((cities: Array<City>) => {
                    if (cities) {
                        res.send(cities);
                    }
                    else
                        return null;
                })
                .catch(() => {
                    return null;
                });
        }
        else
            return null;
    }
}