"use strict"

let current_step = '';
let stateId = 'none';
let cityId = 'none';

$(function () {

    if (current_step === '') {
        let _currentDiv = 'personal_info';
        $(`#${_currentDiv}`).removeClass('hide');
        $(`#${_currentDiv}`).addClass('show');
        $(`#${_currentDiv}`).addClass('current_step');
        $(`#${_currentDiv}_step`).removeClass('disabled');
        $(`#${_currentDiv}_step`).addClass('active');
        let _strFnTocall = $(`#${_currentDiv}`).data('loadFunction');
        if (_strFnTocall)
            new Utility().ExecuteFunctionByName(_strFnTocall);
    }


});

function ValidationRules() {

    $.validator.addMethod("dropdownSelectValidate", function (value, element) {
        if (value == "none")
            return false;
        else
            return true;
    }, "Please select Value");


    jQuery.validator.addClassRules({
        requireValidate: {
            required: true
        }
    });

    jQuery.validator.addClassRules('ddRequire', {
        dropdownSelectValidate: true,
    });

}
$('#createProfile').click(function (e) {

    if ($('#IsProfileApproved').val() === "false" && $('#profileProcessDt').val() === "") {
        window.location.href = "/Profile/CreateProfile";
    }

    else {
        let _buttons = [];
        let _btnOk = {
            label: 'Close',
            id: 'btnDialogClose',
            cssClass: 'btn btn-warning pull-right',
            action: function (dialogRef) {
                dialogRef.close();
            }
        };
        _buttons.push(_btnOk);
        BootstrapDialog.show({
            title: "Profile Update",
            message: "Your Profile is under review.",
            closable: true,
            closeByBackdrop: false,
            closeByKeyboard: false,
            buttons: _buttons,
            type: BootstrapDialog.TYPE_WARNING,
            //onshow: function (dialogRef) {
            //    let _btnCommentsClose = dialogRef.getModalBody().find(`[id='btnCloseIcon']`);
            //    if (_btnCommentsClose && _btnCommentsClose.length > 0)
            //        _btnCommentsClose.on('click', function (e) {
            //            adminPanel.ResetStatusButton(dialogRef);
            //        });
            //},
            nl2br: false//To avoid converting line break to br in message
        });
    }
});


$('#nextProfileBtn').click(function (e) {
    e.preventDefault();
    /* current Step */
    current_step = $('.current_step').attr('id');
    if (checkform($(`.current_step`).attr(`id`))) {
        console.log("validated");
        new Utility().ShowVerificationDialog(current_step)
            .then((ServerObject) => {

                new Utility().CallServer('/Profile/StoreData', ServerObject)
                    .then((response) => {
                        let _bShowNextStep = true;

                        if (_bShowNextStep) {
                            $(`#${$('.current_step').attr('id')}`).removeClass('show');
                            $(`#${$('.current_step').attr('id')}`).addClass('hide');
                            $(`#${$('.current_step').attr('id')}_step`).removeClass('active');
                            $(`#${$('.current_step').attr('id')}_step`).addClass('complete');

                            /*Show Next Step */

                            let next_step = $('.current_step').attr('next');
                            if (next_step) {
                                $(`#${$('.current_step').attr('next')}`).removeClass('hide');
                                $(`#${$('.current_step').attr('next')}_step`).removeClass('disabled');
                                $(`#${$('.current_step').attr('next')}_step`).addClass('active');

                                /* add current class */
                                $(`#${$('.current_step').attr('next')}`).addClass('show current_step');

                                /* Remove current steps current_step */
                                $(`#${$('.current_step').attr('id')}`).removeClass('current_step');

                                if ($('.current_step').attr('id') !== 'personal_info') {
                                    $('#backProfileBtn').removeClass('hide');
                                    $('#backProfileBtn').addClass('show');

                                    let _strFnTocall = $('.current_step').data('loadFunction');
                                    new Utility().ExecuteFunctionByName(_strFnTocall);
                                }
                                else {
                                    $('#backProfileBtn').removeClass('hide');
                                    $('#backProfileBtn').addClass('hide');
                                }
                                if ($('.current_step').attr('id') === 'professional_society_info') {
                                    $("#nextProfileBtn").text("Submit");
                                }
                            }
                            else
                                location.href = '/Profile/UserDashboard';
                        }
                    });
            });
    }
    else {
        console.log("not validated");
    }

});



$('#backProfileBtn').click(function (e) {
    e.preventDefault();
    /* current Step */
    current_step = $('.current_step').attr('id');
    $(`#${$('.current_step').attr('id')}`).removeClass('show');
    $(`#${$('.current_step').attr('id')}`).addClass('hide');
    $(`#${$('.current_step').attr('id')}_step`).removeClass('active');
    $(`#${$('.current_step').attr('id')}_step`).addClass('disabled');

    /*Show Previous Step */
    // prev_step = $('.current_step').attr('prev');
    $(`#${$('.current_step').attr('prev')}`).removeClass('hide');
    $(`#${$('.current_step').attr('prev')}_step`).removeClass('complete');
    $(`#${$('.current_step').attr('prev')}_step`).addClass('active');

    /* add current class */
    $(`#${$('.current_step').attr('prev')}`).addClass('show current_step');

    /* Remove current steps current_step */
    $(`#${current_step}`).removeClass('current_step');

    if ($('.current_step').attr('prev') === '') {
        /* Remove current steps current_step */
        $('#backProfileBtn').removeClass('show').addClass('hide');
    }

});

function checkform(id) {
    console.log(id);
    let a = $(`#${id}`).valid({});
    console.log(a);
    return a;
}
class PersonalProfile {
    LoadInit() {

        /** Date Picker **/
        let _objectsToLoad = '';

        if (!CachedObjects['Countries'])
            _objectsToLoad += 'Countries;';
        if (!CachedObjects['AddressTypes'])
            _objectsToLoad += 'AddressTypes;';

        if (_objectsToLoad !== '') {
            let _utility = new Utility();

            _utility.CallServer('/Profile/Address/Initial', _objectsToLoad)
                .then((initialAddressData) => {

                    if (initialAddressData) {

                        if (_objectsToLoad.indexOf('Countries') > -1)
                            CachedObjects['Countries'] = initialAddressData.Countries;
                        if (_objectsToLoad.indexOf('AddressTypes') > -1)
                            CachedObjects['AddressTypes'] = initialAddressData.AddressTypes;

                        this.BindCountryDropDown();
                        ValidationRules();
                    }
                    else
                        location.href = "/Error/";
                });
        }
        else
            this.BindCountryDropDown();
    }

    BindCountryDropDown() {

        Templates.Render('Profile.Personal', (compiledTemplate) => {
            let _nAddressType = -1;

            for (let _nIndex = 0, _nlen = CachedObjects['AddressTypes'].length; _nIndex < _nlen; _nIndex++) {
                let _currentType = CachedObjects['AddressTypes'][_nIndex];
                if (_currentType['AddressTypeName'] === 'Birth Address') {
                    _nAddressType = _currentType['AddressTypeId'];
                    break;
                }
            }

            new Utility().CallServer('/Profile/Personal/Initial')
                .then((value) => {

                    let _addressObject = {
                        Countries: CachedObjects['Countries'],
                        AddressType: _nAddressType,
                        UserData: value.UserDetails,
                        BirthAddress: value.BirthAddressDetails
                    };

                    let _strHtmlSource = compiledTemplate(_addressObject);

                    $('#personal_info').append(_strHtmlSource);
                    if (value.BirthAddressDetails && value.BirthAddressDetails.Country && value.BirthAddressDetails.Country.CountryId !== 0) {
                        stateId = value.BirthAddressDetails.State.StateId;
                        cityId = value.BirthAddressDetails.City.CityId;
                        $('#ddnProfileBirthCountry').trigger('change');
                    }
                    $('#ddnProfileSalutation').val(value.UserDetails.Caption);
                    $('#ddnProfileSercResearch').val(value.UserDetails.IsSercResearcher ? 'Yes' : 'No');
                    $('.datetimepicker').datepicker();
                    $('.open-datetimepicker').click(function (event) {
                        $('.datetimepicker').focus();
                    });

                });
        });
    }
}
window["PersonalProfile"] = PersonalProfile;