class OccupationProfile {
    LoadInit() {
    //    alert("hi load init");

        let _objectsToLoad = '';
        Templates.Render('Profile.Occupation');

        let _utility = new Utility();

        if (!CachedObjects['Category'])
            _objectsToLoad += 'Category;';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/OccupationCategory/Initial', _objectsToLoad)
                .then((initialCategoryData) => {
                    if (initialCategoryData) {
                        if (_objectsToLoad.indexOf('Category') > -1) {
                            CachedObjects['Category'] = initialCategoryData.Category;
                        }
                        //this.LoadOccupationDiv();
                        ValidationRules();
                    }
                    else
                        location.href = "/Error/";
                });
        }

        _utility
            .CallServer('/Profile/Occupation/GetOccupation', null)
            .then((societys) => {
               
                if (societys.length > 0)
                    for (let society of societys)
                        this.LoadOccupationDiv(society);
                else
                    this.LoadOccupationDiv();
            });

       

    }

    LoadOccupationDiv(data) {
        
        
        Templates.Render('Profile.Occupation', (compiledTemplate) => {

            let _nDivCounts = $('[id^="divOccupations"]').length;            
            let _ndivCount = _nDivCounts + 1;            
            let _occupationCategoryObj = {
                CategoryType: CachedObjects['Category'],
                CategoryId: data && data.Entity.categoryId ? data.Entity.categoryId : 0,
                EntityId: data && data.Entity.entityId ? data.Entity.entityId : 0,
                EntityName: data && data.Entity.entityName ? data.Entity.entityName : '',
                Role: data && data.Role ? data.Role : '',
                Title: data && data.Title ? data.Title : '',
                StartDate: data && data.StartDate ? data.StartDate : '',
                EndDate: data && data.EndDate ? data.EndDate : '',
                Id: _ndivCount
            };
            let _strHtmlSource = compiledTemplate(_occupationCategoryObj);
           
            $('#occupation_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divOccupations${_ndivCount}`);
            $('.datetimepickerFromDate').datepicker();
            $('.open-datetimepickerFromDate').click(function (event) {
                $('.datetimepickerFromDate').focus();
            });

            $('.datetimepickerToDate').datepicker();
            $('.open-datetimepickerToDate').click(function (event) {
                $('.datetimepickerToDate').focus();
            });

        });
    }

    RemoveOccupationDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divOccupations${ctrlId}`)
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
                .ShowVerificationDialog('occupation_info', `divOccupations${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#occupation_info #divOccupations${ctrlId}`).remove();
                        })
                });
        }
        else
            $(`#occupation_info #divOccupations${ctrlId}`).remove();
    }
}

window["OccupationProfile"] = OccupationProfile;