"use strict";

class AddressProfile {

    LoadInit() {
        Templates.Render('Profile.Address');
        let _utility = new Utility();
        let _objectsToLoad = '';
        if (!CachedObjects['Countries'])
            _objectsToLoad += 'Countries;';
        if (!CachedObjects['AddressTypes'])
            _objectsToLoad += 'AddressTypes;';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/Address/Initial', _objectsToLoad)
                .then((initialAddressData) => {

                    if (initialAddressData) {
                        if (_objectsToLoad.indexOf('Countries') > -1)
                            CachedObjects['Countries'] = initialAddressData.Countries;
                        if (_objectsToLoad.indexOf('AddressTypes') > -1)
                            CachedObjects['AddressTypes'] = initialAddressData.AddressTypes;
                    }
                    else
                        location.href = "/Error/";
                });
        }
        _utility
            .CallServer('/Profile/Address/GetAddresses')
            .then((addresses) => {
                if (addresses.addresses.length > 0)
                    for (let address of addresses.addresses)
                        this.LoadAddressDiv(address);
                else {
                    this.LoadAddressDiv();
                    ValidationRules();
                  
                }
            });
    }

    LoadAddressDiv(data) {

        Templates.Render('Profile.Address', (compiledTemplate) => {

            let _nDivCounts = $('[id^="divAddress"]').length;
            let _ndivCount = _nDivCounts + 1;
            let _addressObject = {
                Countries: CachedObjects['Countries'],
                AddressTypes: CachedObjects['AddressTypes'],
                Id: _ndivCount,
                AddressId: data && data.AddressId ? data.AddressId : 0,
                AddressTypeId: data && data.AddressType ? data.AddressType.AddressTypeId : 0,
                AddressLine1: data && data.AddressLine1 ? data.AddressLine1 : '',
                AddressLine2: data && data.AddressLine2 ? data.AddressLine2 : '',
                CountryId: data && data.Country.CountryId ? data.Country.CountryId : 0,
                Zip: data && data.Zip ? data.Zip : '',
                FromDate: data && data.FromDate ? data.FromDate : '',
                ToDate: data && data.ToDate ? data.ToDate : ''
            };

            let _strHtmlSource = compiledTemplate(_addressObject);

            $('#address_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divAddress${_ndivCount}`);

            if (data && data.Country && data.Country.CountryId !== 0) {


                cityId = data.City.CityId;
                // onchange="new Utility().GetStates(this,'ddnAddressState{{Id}}');"
                $(`#ddnAddressCountry${_ndivCount}`).on('change', function (event, stateid) {

                    let _nCountryId = parseInt($(this).val());
                    let _utility = new Utility();
                    _utility.CallServer('/Profile/Address/GetState', _nCountryId)
                        .then((states) => {

                            if (states) {
                                let _strStateSourceHtml = Handlebars.helpers.generateOption(states, "StateId", "StateName", stateid);
                                $(`#ddnAddressState${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                                $(`#ddnAddressState${_ndivCount}`).trigger('change', [data.City.CityId]);
                            }
                            else
                                location.href = "/Error/";
                        });
                   

                });
                $(`#ddnAddressState${_ndivCount}`).on('change', function (event, cityid) {

                    let _nStateId = parseInt($(this).val());
                    if (_nStateId) {
                        let _utility = new Utility();

                        _utility.CallServer('/Profile/Address/GetCity', _nStateId)
                            .then((cities) => {

                                if (cities) {
                                    let _strStateSourceHtml = Handlebars.helpers.generateOption(cities, "CityId", "CityName", cityid);
                                    $(`#ddnAddressCity${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                                }
                                else
                                    location.href = "/Error/";
                            });
                    }
                    else
                        $(`#ddnAddressCity${_ndivCount}`).val("none").prop('disabled', true);
                });
                $(`#ddnAddressCountry${_ndivCount}`).trigger('change', [data.State.StateId]);
                $(`#ddnAddressState${_ndivCount}`).trigger('change', [data.City.CityId]);
            }
            else {
                $(`#ddnAddressCountry${_ndivCount}`).on('change', function (event) {

                    let _nCountryId = parseInt($(this).val());
                    let _utility = new Utility();
                    _utility.CallServer('/Profile/Address/GetState', _nCountryId)
                        .then((states) => {

                            if (states) {
                                let _strStateSourceHtml = Handlebars.helpers.generateOption(states, "StateId", "StateName");
                                $(`#ddnAddressState${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                                $(`#ddnAddressState${_ndivCount}`).trigger('change', [data.City.CityId]);
                            }
                            else
                                location.href = "/Error/";
                        });

                });
                $(`#ddnAddressState${_ndivCount}`).on('change', function (event) {

                    let _nStateId = parseInt($(this).val());
                    if (_nStateId) {
                        let _utility = new Utility();

                        _utility.CallServer('/Profile/Address/GetCity', _nStateId)
                            .then((cities) => {

                                if (cities) {
                                    let _strStateSourceHtml = Handlebars.helpers.generateOption(cities, "CityId", "CityName");
                                    $(`#ddnAddressCity${_ndivCount}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                                }
                                else
                                    location.href = "/Error/";
                            });
                    }
                    else
                        $(`#ddnAddressCity${_ndivCount}`).val("none").prop('disabled', true);
                });
            }
        });

        $('.datetimepickerFromDate').datepicker();
        $('.open-datetimepickerFromDate').click(function (event) {
            $('.datetimepickerFromDate').focus();
        });

        $('.datetimepickerToDate').datepicker();
        $('.open-datetimepickerToDate').click(function (event) {
            $('.datetimepickerToDate').focus();
        });
    }

    RemoveAddressDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divAddress${ctrlId}`)
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
                .ShowVerificationDialog('contact_info', `divAddress${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#address_info #divAddress${ctrlId}`).remove();
                        })
                });
        }
        else
            $(`#address_info #divAddress${ctrlId}`).remove();
    }
}
window["AddressProfile"] = AddressProfile;