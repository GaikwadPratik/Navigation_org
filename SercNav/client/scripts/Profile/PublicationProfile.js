class PublicationProfile {
    LoadInit() {
        alert("hi load init");

        let _objectsToLoad = '';
        Templates.Render('Profile.Publication');

        let _utility = new Utility();

        if (!CachedObjects['Role'])
            _objectsToLoad += 'PublicationTypes;';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/Publication/Initial', _objectsToLoad)
                .then((initialSocietyData) => {

                    if (initialSocietyData) {

                        if (_objectsToLoad.indexOf('PublicationTypes') > -1) {
                            CachedObjects['PublicationTypes'] = initialSocietyData.PublicationTypes;
                            console.log(CachedObjects['PublicationTypes']);
                        }

                    }
                    else
                        location.href = "/Error/";
                });
        }



        _utility
            .CallServer('/Profile/Society/GetSociety', null)
            .then((societys) => {


                console.log(societys);
                if (societys.length > 0)
                    for (let society of societys)
                        this.LoadPublicationDiv(society);
                else
                    this.LoadPublicationDiv();
            });

        this.LoadPublicationDiv();

    }

    LoadPublicationDiv() {
        //divSocieties

        Templates.Render('Profile.Publication', (compiledTemplate) => {
            alert("hi");

            //let _nDivCounts = $('[id^="divSocieties"]').length;
            //console.log(_nDivCounts);
            //let _ndivCount = _nDivCounts + 1;
            //console.log(_ndivCount);
            let _societyObject = {
            //    SocietyType: CachedObjects['PublicationTypes'],
                //RoleId: data && data.SocietyId ? data.SocietyId : 0,
                //RoleName: data && data.SocietyId ? data.SocietyId : 0,
                RoleId: 0,
                RoleName: 0,
            //    //SocietyTypeName: data && data.SocietyId.ContactTypeId ? data.ContactType.ContactTypeId : "none",
            //    SocietyTypeName: data && data.SocietyValue ? data.SocietyValue : '',
                Id: 1
            };
           ;

            let _strHtmlSource = compiledTemplate();
            console.log(_strHtmlSource);
            $('#publication_info').append(_strHtmlSource);
            //new Utility().AttachClickEventPlus(`#divSocieties${_ndivCount}`);


        });

    }

    RemoveSocietyDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divSocieties${ctrlId}`)
            .find('input[type=text],textarea,select')
            .filter(':visible')
            .each(function (index, value) {
                if ($(value).val() !== '') {
                    _bAllFilled = false;
                    return false;
                }
            });

        //let _utility = new Utility();

        //if (!_bAllFilled) {
        //    _utility
        //        .ShowVerificationDialog('SocietyInfo', `divSocieties${ctrlId}`, true)
        //        .then((serverObject) => {
        //            _utility
        //                .CallServer('/Profile/StoreData', serverObject)
        //                .then((response) => {
        //                    $(`#professional_society_info #divSocieties${ctrlId}`).remove();
        //                })
        //        });
        //}
        //else
        $(`#professional_society_info #divSocieties${ctrlId}`).remove();
    }
}

window["PublicationProfile"] = PublicationProfile;