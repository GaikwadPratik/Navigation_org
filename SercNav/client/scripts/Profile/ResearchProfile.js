"use strict";

class ResearchProfile {
    LoadInit() {
        // Templates.Render('Profile.Research');
        let _utility = new Utility();
        let _objectsToLoad = '';
        if (!CachedObjects['ResearchCategories'])
            _objectsToLoad += 'ResearchCategories;';
        if (!CachedObjects['IndustryAffiliations'])
            _objectsToLoad += 'IndustryAffiliations';
        if (!CachedObjects['ResearchRoles'])
            _objectsToLoad += 'ResearchRoles';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/Research/Initial', _objectsToLoad)
                .then((initialAddressData) => {
                    if (initialAddressData) {
                        if (_objectsToLoad.indexOf('ResearchCategories') > -1)
                            CachedObjects['ResearchCategories'] = initialAddressData.ResearchCategories.ReserachCategories;
                        if (_objectsToLoad.indexOf('IndustryAffiliations') > -1)
                            CachedObjects['IndustryAffiliations'] = initialAddressData.IndustryAffiliation.Industries;
                        if (_objectsToLoad.indexOf('ResearchRoles') > -1)
                            CachedObjects['ResearchRoles'] = initialAddressData.ReserachRoles.ReserachRoles;
                        ValidationRules();
                    }
                    else
                        location.href = "/Error/";
                });
        }

        _utility
            .CallServer('/Profile/Research/GetResearchTasksByPersonId')
            .then((researchTasks) => {

                if (researchTasks.researchTasks.length > 0)
                    for (let task of researchTasks.researchTasks)
                        this.LoadTaskDiv(task);
                else
                    this.LoadTaskDiv();
            });
    }

    LoadTaskDiv(data) {
        Templates.Render('Profile.Research', (compiledTemplate) => {

            let _nDivCounts = $('[id^="divResearchTasks"]').length;
            let _ndivCount = _nDivCounts + 1;
            let _ReserachObject = {
                ResearchRoles: CachedObjects['ResearchRoles'],
                ResearchCategories: CachedObjects['ResearchCategories'],
                UniversityAffiliations: CachedObjects['IndustryAffiliations'],
                ResearchTaskId: data && data.ResearchTaskId ? data.ResearchTaskId : 0,
                ResearchRoleId: data && data.ResearchRole ? data.ResearchRole.ResearchRoleId : 0,
                ResearchTaskNumber: data && data.ResearchTaskNumber ? data.ResearchTaskNumber : '',
                EntityId: data && data.BussinessEntity ? data.BussinessEntity.entityId : 0,
                Id: _ndivCount
            };

            let _strHtmlSource = compiledTemplate(_ReserachObject);

            $('#research_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divResearchTasks${_ndivCount}`);

            $(`#ddnResearchCategory${_ndivCount}`).on('change', function (event, programId) {
                let _nCategoryId = parseInt($(this).val());
                let _utility = new Utility();
                _utility.CallServer('/Profile/Research/GetProgramsByCategory', _nCategoryId)
                    .then((programs) => {

                        if (programs) {
                            let _strStateSourceHtml = Handlebars.helpers.generateOption(programs.ResearchPrograms, "ResearchProgramId", "ResearchProgramName", programId);
                            $(`#ddnReseachProgram${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                            if (data && data.ResearchProject)
                                $(`#ddnReseachProgram${_ndivCount}`).trigger('change', [data.ResearchProject.ResearchProjectId]);
                        }
                        else
                            location.href = "/Error/";
                    });
            });

            $(`#ddnReseachProgram${_ndivCount}`).on('change', function (event, projectId) {
                let _nProgramId = parseInt($(this).val());
                let _utility = new Utility();
                _utility.CallServer('/Profile/Research/GetProjectsByProgram', _nProgramId)
                    .then((data) => {

                        if (data && data.ReserachProjects) {
                            let _strStateSourceHtml = Handlebars.helpers.generateOption(data.ReserachProjects, "ResearchProjectId", "ResearchProjectName", projectId);
                            $(`#ddnReseachProject${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                        }
                        else
                            location.href = "/Error/";
                    });
            });
            if (data && data.ResearchProject && data.ResearchProject.ResearchProgram && data.ResearchProject.ResearchProgram.ResearchCategory) {
                $(`#ddnResearchCategory${_ndivCount}`).val(data.ResearchProject.ResearchProgram.ResearchCategory.ResearchcategoryId);
                $(`#ddnResearchCategory${_ndivCount}`).trigger('change', [data.ResearchProject.ResearchProgram.ResearchProgramId]);
            }
        });
    }

    RemoveTaskDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divResearchTasks${ctrlId}`)
            .find('input[type=text],textarea,select')
            .filter(':visible')
            .each(function (index, value) {
                if (($(value).prop('tagName') !== 'SELECT' && $(value).val() !== '')
                    || ($(value).prop('tagName') === 'SELECT' && ($(value).val() !== null && $(value).val() !== 'none'))) {
                    _bAllFilled = false;
                    return false;
                }
            });

        let _utility = new Utility();

        if (!_bAllFilled) {
            _utility
                .ShowVerificationDialog('research_info', `divResearchTasks${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#research_info #divResearchTasks${ctrlId}`).remove();
                        })
                });
        }
        else
            $(`#research_info #divResearchTasks${ctrlId}`).remove();
    }
}
window["ResearchProfile"] = ResearchProfile;