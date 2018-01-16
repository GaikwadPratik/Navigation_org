class SocietyProfile {
    LoadInit() {
        
        let _objectsToLoad = '';
        Templates.Render('Profile.Society');

        let _utility = new Utility();

        if (!CachedObjects['SocietyTypes'])
            _objectsToLoad += 'SocietyTypes;';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/Society/Initial', _objectsToLoad)
                .then((initialSocietyData) => {
                    
                    if (initialSocietyData) {

                        if (_objectsToLoad.indexOf('SocietyTypes') > -1) {
                            CachedObjects['SocietyTypes'] = initialSocietyData.SocietyTypes;
                            console.log(CachedObjects['SocietyTypes']);
                        }
                            
                    }
                    else
                        location.href = "/Error/";
                });
        }

      

        _utility
            .CallServer('/Profile/Society/GetSociety')
            .then((societys) => {
              console.log(societys);
                if (societys.length > 0)
                    for (let society of societys)                        
                        this.LoadEducationDiv(society);
                else
                    this.LoadEducationDiv();
                ValidationRules();
            });
       
       
        
    }

    LoadEducationDiv(data) {
        //divSocieties

        Templates.Render('Profile.Society', (compiledTemplate) => {
          

            let _nDivCounts = $('[id^="divSocieties"]').length;
            console.log(_nDivCounts);
            let _ndivCount = _nDivCounts + 1;
            console.log(_ndivCount);
            let _societyObject = {
                SocietyType: CachedObjects['SocietyTypes'],
                SocietyId: data && data.SocietyId ? data.SocietyId : 0,
                SocietyTypeId: data && data.SocietyId ? data.SocietyId : 0,
                //SocietyTypeName: data && data.SocietyId.ContactTypeId ? data.ContactType.ContactTypeId : "none",
                SocietyTypeName: data && data.SocietyValue ? data.SocietyValue : '',
                Id: _ndivCount
            };

            let _strHtmlSource = compiledTemplate(_societyObject);

            $('#professional_society_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divSocieties${_ndivCount}`);
            

        });

    }

    RemoveSocietyDiv(ctrlId) {
       
        let _bAllFilled = true;
        $(`#divSocieties${ctrlId}`)
            .find('input[type=text],textarea,select')
            .filter(':visible')
            .each(function (index, value) {
                if (($(value).prop('tagName') !== 'SELECT' && $(value).val() !== '')
                    || ($(value).prop('tagName') === 'SELECT' && $(value).val() !== 'none')) {
                    _bAllFilled = false;
                    return false;
                }
            });

        let _utility = new Utility();

        if (!_bAllFilled) {
            _utility
                .ShowVerificationDialog('professional_society_info', `divSocieties${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#professional_society_info #divSocieties${ctrlId}`).remove();
                        })
                });
        }
        else
            $(`#professional_society_info #divSocieties${ctrlId}`).remove();
    }
}

window["SocietyProfile"] = SocietyProfile;