"use strict"

class ContactProfile {

    LoadInit() {
        let _objectsToLoad = '';

        Templates.Render('Profile.Contact');
        let _utility = new Utility();

        if (!CachedObjects['ContactTypes'])
            _objectsToLoad += 'ContactTypes;';
        if (_objectsToLoad !== '') {

            _utility.CallServer('/Profile/Contact/Initial', _objectsToLoad)
                .then((initialAddressData) => {

                    if (initialAddressData) {

                        if (_objectsToLoad.indexOf('ContactTypes') > -1)
                            CachedObjects['ContactTypes'] = initialAddressData.ContactTypes;
                    }
                    else
                        location.href = "/Error/";
                });
        }

        _utility
            .CallServer('/Profile/Contact/GetContacts')
            .then((contacts) => {
                if (contacts.contacts.length > 0)
                    for (let contact of contacts.contacts)
                        this.LoadContactDiv(contact);
                else
                    this.LoadContactDiv();
			  ValidationRules();
            });
    }

    LoadContactDiv(data) {

        Templates.Render('Profile.Contact', (compiledTemplate) => {

            let _nDivCounts = $('[id^="divContacts"]').length;
            let _ndivCount = _nDivCounts + 1;
            let _contactObject = {
                ContactTypes: CachedObjects['ContactTypes'],
                ContactId: data && data.ContactId ? data.ContactId : 0,
                ContactTypeId: data && data.ContactType.ContactTypeId ? data.ContactType.ContactTypeId : "none",
                ContactValue: data && data.ContactValue ? data.ContactValue : '',
                Id: _ndivCount
            };

            let _strHtmlSource = compiledTemplate(_contactObject);

            $('#contact_info').append(_strHtmlSource);
            new Utility().AttachClickEventPlus(`#divContacts${_ndivCount}`);
        });
    }

    RemoveContactDiv(ctrlId) {

        let _bAllFilled = true;
        $(`#divContacts${ctrlId}`)
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
                .ShowVerificationDialog('contact_info', `divContacts${ctrlId}`, true)
                .then((serverObject) => {
                    _utility
                        .CallServer('/Profile/StoreData', serverObject)
                        .then((response) => {
                            $(`#contact_info #divContacts${ctrlId}`).remove();
                        })
                });
        }
        else
            $(`#contact_info #divContacts${ctrlId}`).remove();
    }
}
window["ContactProfile"] = ContactProfile;