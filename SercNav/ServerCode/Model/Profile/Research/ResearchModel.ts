import * as ApplicationLog from '../../../ApplicationLog/ApplicationLog';
import { IDatabaseConnector, DatabaseConnector } from '../../../Database/DatabaseConnector';
import { IndustryAffiliation } from '../../../../Entity/IndustryAffiliation/IndustryAffiliation';
import { ResearchCategory, ResearchProgram, ResearchProject, ResearchTask, ResearchRole } from '../../../../Entity/Profile/Research/Index';
import { BusinessEntity } from '../../../../Entity/Profile/BusinessEntity/BusinessEntity';

export class ResearchModel {

    /**
     * Get industry relations for Research page
     * @param nPersonId
     */
    public GetIndustryAffiliations(nPersonId: number) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetIndustryAffiliationByPersonId(?);`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nPersonId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _industryAffiliations: Array<IndustryAffiliation> = null;

                                let _rtnObject = {
                                    Industries: null
                                };

                                if (rows) {
                                    let _data: any[] = rows[0];

                                    if (_data) {
                                        _industryAffiliations = _data.filter((x) => {
                                            let _industry = new IndustryAffiliation(nPersonId, x.EntityName);
                                            _industry.EntityId = x.EntityId;
                                            return _industry;
                                        });
                                        _rtnObject.Industries = _industryAffiliations;

                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetIndustryAffiliations`));
                                        reject("RH0002");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetIndustryAffiliations`));
                                    reject("RH0002");
                                }
                            });
                    }
                    else //error in connection
                        reject("RH0002");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("EH0002");
            }

        });
    }

    public GetResearchCategories() {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetResearchCategories();`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _reserachCategories: Array<ResearchCategory> = [];

                                let _rtnObject = {
                                    ReserachCategories: null
                                };

                                if (rows) {
                                    let _data: any = rows[0];

                                    if (_data) {
                                        if (Array.isArray(_data)) {
                                            _reserachCategories = _data.filter((x) => {
                                                return new ResearchCategory(x.ResearchcategoryId, x.ResearchCategoryName);
                                            });
                                        }
                                        else
                                            _reserachCategories.push(new ResearchCategory(_data.ResearchcategoryId, _data.ResearchCategoryName));

                                        _rtnObject.ReserachCategories = _reserachCategories;

                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetIndustryAffiliations`));
                                        reject("RH0002");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetIndustryAffiliations`));
                                    reject("RH0002");
                                }
                            });
                    }
                    else //error in connection
                        reject("RH0002");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0002");
            }
        });
    }

    public GetResearchRoles() {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetResearchRoles();`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _reserachRoles: Array<ResearchRole> = null;

                                let _rtnObject = {
                                    ReserachRoles: null
                                };

                                if (rows) {
                                    let _data: any[] = rows[0];

                                    if (_data) {
                                        _reserachRoles = _data.filter((x) => {
                                            return new ResearchRole(x.ResearchRoleId, x.ResearchRoleName);
                                        });
                                        _rtnObject.ReserachRoles = _reserachRoles;

                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetResearchRoles`));
                                        reject("RH0003");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetResearchRoles`));
                                    reject("RH0003");
                                }
                            });
                    }
                    else //error in connection
                        reject("RH0003");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0003");
            }
        });
    }

    public GetReserachesbyPersonId(nPersonId: number) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database
                    .InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `CALL sp_GetReseachTasksByPersonId(?);`;

                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [nPersonId];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {

                                    let _researchTasks: Array<ResearchTask> = [];

                                    if (rows) {
                                        let _data: any = rows[0];

                                        if (_data) {                                            
                                            if (Array.isArray(_data)) {
                                                _researchTasks = _data.map((x) => {
                                                    let _reserach = new ResearchTask(nPersonId, x.ResearchTaskId, x.ResearchTaskNumber, x.StartDate, x.EndDate);
                                                    _reserach.BussinessEntity = new BusinessEntity(null, x.BusinessEntityName, x.BusinessEntityId);
                                                    _reserach.ResearchProject = new ResearchProject(x.ResearchProjectId, x.ResearchProjectName);
                                                    _reserach.ResearchProject.ResearchProgram = new ResearchProgram(x.ResearchProgramId, x.ResearchProgramName);
                                                    _reserach.ResearchProject.ResearchProgram.ResearchCategory = new ResearchCategory(x.ResearchcategoryId, x.ResearchCategoryName);
                                                    _reserach.ResearchRole = new ResearchRole(x.ResearchRoleId, x.ResearchRoleName);
                                                    return _reserach;
                                                });
                                            }
                                            else {
                                                let _reserach = new ResearchTask(nPersonId, _data.ResearchTaskId, _data.ResearchTaskNumber, _data.StartDate, _data.EndDate);
                                                _reserach.BussinessEntity = new BusinessEntity(null, _data.BusinessEntityName, _data.BusinessEntityId);
                                                _reserach.ResearchProject = new ResearchProject(_data.ResearchProjectId, _data.ResearchProjectName);
                                                _reserach.ResearchProject.ResearchProgram = new ResearchProgram(_data.ResearchProgramId, _data.ResearchProgramName);
                                                _reserach.ResearchProject.ResearchProgram.ResearchCategory = new ResearchCategory(_data.ResearchcategoryId, _data.ResearchCategoryName);
                                                _reserach.ResearchRole = new ResearchRole(_data.ResearchRoleId, _data.ResearchRoleName);
                                                _researchTasks.push(_reserach);
                                            }

                                            resolve({ researchTasks: _researchTasks });
                                        }
                                        else {//nothing is returned from database
                                            ApplicationLog.LogError(new Error(`No result is returned in GetReserachesbyPersonId`));
                                            reject("RH0001");
                                        }
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetReserachesbyPersonId`));
                                        reject("RH0001");
                                    }
                                });
                        }
                        else //error in connection
                            reject("RH0001");
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0001");
            }
        });
    }

    public AddUpdateResearchTaskInfo(researchTask: ResearchTask) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector(true);

                _database
                    .InitiateConnection()
                    .then((connected: boolean) => {

                        //if the connection is successful, then execute query
                        if (connected) {

                            //Preparing query statements
                            let query: string = `SET @p_message ='';CALL sp_AddUpdateResearchTask(?,?,?,?,?,?,?,?,?,@p_message);SELECT @p_message;`;
                            
                            //Generating array so that mysql connector will escape values to avoid SQL injection.
                            let values = [researchTask.PersonId, researchTask.ResearchTaskId, researchTask.ResearchTaskNumber, researchTask.StartDate, researchTask.EndDate, researchTask.BussinessEntity.entityId, researchTask.ResearchProject.ResearchProjectId, researchTask.ResearchProject.ResearchProgram.ResearchCategory.ResearchcategoryId, researchTask.IsDeleted];

                            _database
                                .ExecuteQuery(query, values)
                                .then((rows: any[]) => {
                                    
                                    if (rows) {
                                        //if any data is returned from database
                                        if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                            //read the out message from stored procedure.
                                            let _message = rows[2][0]["@p_message"];

                                            //if the sp_returned 'SUCCESS' message then the record insertion is done
                                            if (_message !== 'S0000') {
                                                ApplicationLog.LogError(new Error(_message));
                                                reject(_message);
                                            }
                                            else
                                                resolve(_message);
                                        }
                                        else {
                                            if (rows && rows[2] && rows[2][0]["@p_message"]) {
                                                let _message = rows[2][0]["@p_message"];
                                                ApplicationLog.LogError(new Error(_message));
                                                reject(_message);
                                            }
                                            else {
                                                ApplicationLog.LogError(new Error(`Unknown error in AddUpdateResearchTaskInfo`));
                                                reject("EU0000");
                                            }
                                        }
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in AddUpdateResearchTaskInfo`));
                                        reject("RH0003");
                                    }
                                });
                        }
                        else //error in connection
                            reject("RH0003");
                    });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0003");
            }
        });
    }

    public GetResearchProgramsByCategory(nCategoryId: number) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetResearchPrograms(?);`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nCategoryId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _reserachPrograms: Array<ResearchProgram> = [];

                                let _rtnObject = {
                                    ResearchPrograms: null
                                };

                                if (rows) {
                                    let _data: any = rows[0];

                                    if (_data) {
                                        if (Array.isArray(_data)) {
                                            _reserachPrograms = _data.filter((x) => {
                                                return new ResearchProgram(x.ResearchProgramId, x.ResearchProgramName);
                                            });
                                        }
                                        else {
                                            _reserachPrograms.push(new ResearchProgram(_data.ResearchProgramId, _data.ResearchProgramName))
                                        }
                                        _rtnObject.ResearchPrograms = _reserachPrograms;

                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetResearchProgramsByCategory`));
                                        reject("RH0003");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetResearchProgramsByCategory`));
                                    reject("RH0003");
                                }
                            });
                    }
                    else //error in connection
                        reject("RH0003");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0003");
            }
        });
    }

    public GetResearchProjectsByProgramId(nProgramId: number) {
        return new Promise((resolve, reject) => {
            try {
                //Create the database object
                let _database: IDatabaseConnector = new DatabaseConnector();

                _database.InitiateConnection().then((connected: boolean) => {

                    //if the connection is successful, then execute query
                    if (connected) {

                        //Preparing query statements
                        let query: string = `CALL sp_GetResearchProjects(?);`;

                        //Generating array so that mysql connector will escape values to avoid SQL injection.
                        let values = [nProgramId];

                        _database.ExecuteQuery(query, values)
                            .then((rows: any[]) => {

                                let _reserachProjects: Array<ResearchProject> = [];

                                let _rtnObject = {
                                    ReserachProjects: null
                                };

                                if (rows) {
                                    let _data: any = rows[0];

                                    if (_data) {
                                        if (Array.isArray(_data)) {
                                            _reserachProjects = _data.filter((x) => {
                                                return new ResearchProject(x.ResearchProjectId, x.ResearchProjectName);
                                            });
                                        }
                                        else
                                            _reserachProjects.push(new ResearchProject(_data.ResearchProjectId, _data.ResearchProjectName));
                                        _rtnObject.ReserachProjects = _reserachProjects;
                                        resolve(_rtnObject);
                                    }
                                    else {//nothing is returned from database
                                        ApplicationLog.LogError(new Error(`No result is returned in GetResearchProjectsByProgramId`));
                                        reject("RH0003");
                                    }
                                }
                                else {//nothing is returned from database
                                    ApplicationLog.LogError(new Error(`No result is returned in GetResearchProjectsByProgramId`));
                                    reject("RH0003");
                                }
                            });
                    }
                    else //error in connection
                        reject("RH0003");
                });
            }
            catch (exception) {
                ApplicationLog.LogException(exception);
                reject("RH0003");
            }
        });
    }
}