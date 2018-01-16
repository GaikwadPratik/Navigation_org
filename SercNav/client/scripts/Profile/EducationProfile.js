class EducationProfile {
    LoadInit() {
        Templates.Render('Profile.Education');
        new Utility().CallServer('/Profile/Education/GetEducations')
            .then((data) => {

                if (data) {
                    let _schoolPresent = false;
                    let _collegePresent = false;
                    if (data.School && data.School.length > 0) {
                        _schoolPresent = true;
                        for (let school of data.School)
                            this.LoadEducationDiv('HighSchool', school);
                    }

                    if (data.College && data.College.length > 0) {
                        _collegePresent = true;
                        for (let college of data.College)
                            this.LoadEducationDiv('College', college);
                    }

                    if (!_schoolPresent)
                        this.LoadEducationDiv('HighSchool');
                    if (!_collegePresent)
                        this.LoadEducationDiv('College');
                }
            });
    }

    LoadEducationDiv(viewName, data) {

        Templates.Render('Profile.Education', (compiledTemplate) => {

            let _nDivCounts = $('[id^="divEducations"]').length;
            let _ndivCount = _nDivCounts + 1;
            let _addressObject = {
                EducationHistoryId: data && data.EducationHistoryId ? data.EducationHistoryId : 0,
                DegreeType: data && data.DegreeType ? data.DegreeType : viewName,
                SchoolName: data && data.SchoolName ? data.SchoolName : '',
                DegreeYear: data && data.DegreeYear ? data.DegreeYear : '',
                DegreeName: data && data.Degree ? data.Degree : '',
                Id: _ndivCount
            };

            let _strHtmlSource = compiledTemplate(_addressObject);

            $('#education_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divEducations${_ndivCount}`);
            ValidationRules();

        });

    }

    RemoveEducationDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divEducations${ctrlId}`)
            .find('input[type=text],textarea,select')
            .filter(':visible')
            .each(function (index, value) {
                if ($(value).val() !== '') {
                    _bAllFilled = false;
                    return false;
                }
            });

        let _utility = new Utility();

        if (!_bAllFilled) {
            _utility
                .ShowVerificationDialog('education_info', `divEducations${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#education_info #divEducations${ctrlId}`).remove();
                        });
                });
        }
        else
            $(`#education_info #divEducations${ctrlId}`).remove();
    }
}

window["EducationProfile"] = EducationProfile;