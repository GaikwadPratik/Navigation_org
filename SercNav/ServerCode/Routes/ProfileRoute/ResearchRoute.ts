import { NextFunction, Request, Response, Router } from 'express';
import { BaseRoute } from '../BaseRoute/BaseRoute';
import * as ApplicationLog from '../../ApplicationLog/ApplicationLog';
import * as ServerUtility from '../../ServerUtility/ServerUtility';
import { ResearchModel } from '../../Model/Profile/Research/ResearchModel';
import { Person } from '../../../Entity/Person/Person';

export class ResearchRoute {

    public InitialResearchLoad(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {

            let _person: Person = <Person>req.user;

            if (_person) {
                let _objectsToLoad: string = <string>JSON.parse(req.body.serverData);

                let _promiseArray = [];

                if (_objectsToLoad.indexOf('IndustryAffiliations') > -1) {
                    let _fetchAffiliation: ResearchModel = new ResearchModel();
                    _promiseArray.push(_fetchAffiliation.GetIndustryAffiliations(_person.PersonId));
                }

                if (_objectsToLoad.indexOf('ResearchCategories') > -1) {
                    let _fetchCategories: ResearchModel = new ResearchModel();
                    _promiseArray.push(_fetchCategories.GetResearchCategories());
                }

                if (_objectsToLoad.indexOf('ResearchRoles') > -1) {
                    let _fetchCategories: ResearchModel = new ResearchModel();
                    _promiseArray.push(_fetchCategories.GetResearchRoles());
                }

                Promise.all(_promiseArray)
                    .then((data) => {
                        let _rtnObject = {
                            IndustryAffiliation: null,
                            ResearchCategories: null,
                            ReserachRoles: null
                        };

                        //TODO:: Work on this logic
                        if (_objectsToLoad.indexOf('IndustryAffiliations') > -1)
                            _rtnObject.IndustryAffiliation = data[0];

                        if (_objectsToLoad.indexOf('ResearchCategories') > -1)
                            _rtnObject.ResearchCategories = data[1];

                        if (_objectsToLoad.indexOf('ResearchRoles') > -1)
                            _rtnObject.ReserachRoles = data[2];

                        res.send(_rtnObject);
                    })
                    .catch(() => {
                        res.send({ textStatus: null });
                    });
            }
            else
                res.send({ textStatus: null });
        }
        else
            res.send({ textStatus: null });
    }

    public GetResearchTasks(req: Request, res: Response, next: NextFunction) {
        if (req && req.user.Person) {
            let _nPersonId = parseInt(req.user.Person.PersonId);

            let _reserachModel: ResearchModel = new ResearchModel();
            _reserachModel
                .GetReserachesbyPersonId(_nPersonId)
                .then((contacts) => {

                    if (contacts) {
                        res.send(contacts);
                    }
                    else
                        res.send({ textStatus: null });
                })
                .catch((errcode) => {
                    ServerUtility.GetErrorMessageFromConfig(errcode);
                    res.send({ textStatus: null });
                });
        }
        else
            res.send({ textStatus: null });
    }

    public GetProjectsByProgram(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {
            let _nProgramId = parseInt(req.body.serverData);

            let _researchModel: ResearchModel = new ResearchModel();
            _researchModel
                .GetResearchProjectsByProgramId(_nProgramId)
                .then((categories) => {
                    res.send(categories);
                })
                .catch(() => {
                    res.send({ textStatus: null });
                });
        }
        else
            res.send({ textStatus: null });
    }

    public GetProgramsByCategory(req: Request, res: Response, next: NextFunction) {
        if (req && req.body && req.body.serverData) {
            let _nCategoryId = parseInt(req.body.serverData);

            let _researchModel: ResearchModel = new ResearchModel();
            _researchModel
                .GetResearchProgramsByCategory(_nCategoryId)
                .then((categories) => {
                    res.send(categories);
                })
                .catch(() => {
                    res.send({ textStatus: null });
                });
        }
        else
            res.send({ textStatus: null });
    }
}