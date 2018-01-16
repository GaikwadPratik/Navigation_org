"use strict";



$(document).ready(function () {
    $('#toBeProcessed').tablesorter();
    $('#processedTable').tablesorter();
}
);
let adminPanel = function () {

    let BussinessCatgories = [];


    let GetUserRegistartionDetails = function (personId, bProcessedUser) {
        let _data = {};
        if (!bProcessedUser && BussinessCatgories.length === 0)
            _data.GetCategories = true;
        _data.PersonId = personId;

        let _utility = new Utility();
        _utility.CallServer('/Admin/GetUserRegistrationDetails', _data)
            .then((details) => {

                if (_data.GetCategories)
                    BussinessCatgories = details[1];

                let personDetails = details[0];
                if (personDetails) {
                    personDetails.ProcessedUser = bProcessedUser;

                    let data = {
                        BussinessCatgories: BussinessCatgories,
                        PersonalDetails: personDetails
                    };


                    Templates.Render('AdminPanel.AccountRegDetails', (compiledTemplate) => {

                        let _strHtmlSource = compiledTemplate(data);

                        let _strTempTitle = `${personDetails.FirstName} ${personDetails.LastName}`;

                        let _strTitle = !bProcessedUser
                            ? _strTempTitle
                            : personDetails.Comments === 'Approved'
                                ? _strTempTitle + ' - Approved'
                                : _strTempTitle + ' - Rejected';

                        _strTempTitle = null;

                        let _buttons = [];

                        if (bProcessedUser) {
                            let _btnOk = {
                                label: 'Close',
                                id: 'btnDialogClose',
                                cssClass: 'btn btn-info pull-right',
                                action: function (dialogRef) {
                                    dialogRef.close();
                                }
                            };
                            _buttons.push(_btnOk);
                        }
                        else {
                            let _btnApprove = {
                                label: 'Approve',
                                id: 'btnDialogApprove',
                                cssClass: 'btn btn-success pull-right',
                                action: function (dialogRef) {
                                    dialogRef.close();
                                    adminPanel.ApproveUserRegistrationRequest(personId, dialogRef);
                                }
                            };

                            let _btnDeny = {
                                label: 'Deny',
                                id: 'btnDialogDeny',
                                cssClass: 'btn btn-danger pull-left',
                                action: function (dialogRef) {
                                    return adminPanel.DenyUserRegistrationRequest(personId, dialogRef);
                                }
                            };

                            _buttons.push(_btnApprove);
                            _buttons.push(_btnDeny);
                        }

                        BootstrapDialog.show({
                            title: _strTitle,
                            message: _strHtmlSource,
                            closable: true,
                            closeByBackdrop: false,
                            closeByKeyboard: false,
                            buttons: _buttons,
                            onshow: function (dialogRef) {
                                let _btnCommentsClose = dialogRef.getModalBody().find(`[id='btnCloseIcon']`);
                                if (_btnCommentsClose && _btnCommentsClose.length > 0)
                                    _btnCommentsClose.on('click', function (e) {
                                        adminPanel.ResetStatusButton(dialogRef);
                                    });
                            },
                            nl2br: false//To avoid converting line break to br in message
                        });
                    });
                }
                else
                    location.href = '/Login';
            })
            .catch(() => {
                alert('No user detail found');
            });
    };

    /**
     * Function to hide comments box in the dialog
     * @param {BootstrapDialog} dialogRef
     */
    let ResetStatusButton = function (dialogRef) {

        //Enable the approval button
        let _btnApprove = dialogRef.getButton(`btnDialogApprove`).enable();

        let _dialogContent = dialogRef.getModalBody();

        //Get the comments div
        let _divComments = _dialogContent.find(`[id='commentDiv']`);

        if (_divComments && _divComments.length > 0) {
            //get the commnets textbox and empty it
            let _txtCommnets = _divComments.find(`[id='txtComments']`);

            if (_txtCommnets && _txtCommnets.length > 0)
                _txtCommnets.val('');

            //hide commnets div
            _divComments.addClass('hidden');
        }
    };

    /**
     * Function called on click of deny button
     * @param {number} nPersonId
     * @param {BootstrapDialog} dialogRef
     */
    let DenyUserRegistrationRequest = function (nPersonId, dialogRef) {
        /* On first click make comments div visible
         * On second click check if the comments are entered or not.
         * If not entered show alert
         else make server call*/

        let _closeDialog = false;
        let _strComments = '';

        //Disable the approval button
        let _btnApprove = dialogRef.getButton(`btnDialogApprove`).disable();

        let _dialogContent = dialogRef.getModalBody();

        //Get the comments div
        let _divComments = _dialogContent.find(`[id='commentDiv']`);

        if (_divComments && _divComments.length > 0) {
            //If the div is hidden, then make it visible
            if (_divComments.hasClass('hidden'))
                _divComments.removeClass('hidden');
            else {
                //Get the comments textbox
                let _txtCommnets = _divComments.find(`[id='txtComments']`);

                //if the comments are not entered then show alert
                if (_txtCommnets && _txtCommnets.length > 0 && _txtCommnets.val() === '')
                    alert('Comments are mandatory while denying request');
                else {//collect the commnets
                    _strComments = _txtCommnets.val();
                    _closeDialog = true;
                }
            }
        }

        let _ddnIndustryAff = _dialogContent.find(`[id='industryAffl']`);
        let _txtEntityName = _dialogContent.find(`[id='txtEntityName']`);

        if (_closeDialog) {//if everything is ok, then hide the dialog and make server call
            dialogRef.close();

            let _data = {
                personId: nPersonId,
                action: "reject",
                comments: _strComments,
                industryName: _txtEntityName.val(),
                industryCategoryName: _ddnIndustryAff.val()
            };

            let _utitlity = new Utility();
            _utitlity.CallServer('/Admin/ProcessUserRegistration', _data)
                .then((msg) => {

                    if (msg.Status && msg.Status === 'PROCESSED') {
                        location.reload();
                    }
                    else {
                        alert('Internal server error');
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
        return _closeDialog;
    };

    /**
     * Function called on click of approve button
     * @param {number} nPersonId
     * @param {BootstrapDialog} dialogRef
     */
    let ApproveUserRegistrationRequest = function (nPersonId, dialogRef) {

        let _dialogContent = dialogRef.getModalBody();

        //Get the comments div
        let _ddnIndustryAff = _dialogContent.find(`[id='industryAffl']`);
        let _txtEntityName = _dialogContent.find(`[id='txtEntityName']`);

        //_personId, _action, _comments
        let _data = {
            personId: nPersonId,
            action: "approve",
            comments: "Approved",
            industryName: _txtEntityName.val(),
            industryCategoryName: _ddnIndustryAff.val()
        };

        let _utitlity = new Utility();

        //make server call to update the request
        _utitlity.CallServer('/Admin/ProcessUserRegistration', _data)
            .then((msg) => {
                if (msg.Status && msg.Status === 'PROCESSED') {
                    location.reload();
                }
                else {
                    alert('Internal error');
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    let GetProfiles = function () {
        new Utility().CallServer('/Admin/GetUserProfiles')
            .then((profiles) => {

                if (profiles) {
                    Templates.Render('AdminPanel.AccountProfile', (compiledTemplate) => {

                        let _object = {
                            LstToProcess: profiles.response.LstToProcess,
                            LstProcessed: profiles.response.LstProcessed
                        };
                        let _strHtmlSource = compiledTemplate(_object);
                        $('#Control').html(_strHtmlSource);
                    });
                }
            });
    };

    let GetUserProfileDetails = function (personId, bProcessedUser) {
        let _data = {};
        _data.PersonId = personId;
        new Utility().CallServer('/Admin/GetUserProfileDetails', _data)
            .then((profileData) => {

                if (profileData) {
                    Templates.Render('AdminPanel.AccountProfileDetails', (compiledTemplate) => {

                        let _strHtmlSource = compiledTemplate(profileData);

                        let _strTitle = `${profileData.PersonalDetails.Person.FirstName} ${profileData.PersonalDetails.Person.LastName}`;

                        let _buttons = [];

                        if (bProcessedUser) {
                            let _btnOk = {
                                label: 'Close',
                                id: 'btnDialogClose',
                                cssClass: 'btn btn-info pull-right',
                                action: function (dialogRef) {
                                    dialogRef.close();
                                }
                            };
                            _buttons.push(_btnOk);
                        }
                        else {
                            let _btnApprove = {
                                label: 'Approve',
                                id: 'btnDialogApprove',
                                cssClass: 'btn btn-success pull-right',
                                action: function (dialogRef) {
                                    dialogRef.close();
                                    adminPanel.ApproveUserProfileRequest(personId, dialogRef);
                                }
                            };

                            let _btnDeny = {
                                label: 'Deny',
                                id: 'btnDialogDeny',
                                cssClass: 'btn btn-danger pull-left',
                                action: function (dialogRef) {
                                    return adminPanel.DenyUserProfileRequest(personId, dialogRef);
                                }
                            };

                            _buttons.push(_btnApprove);
                            _buttons.push(_btnDeny);
                        }

                        BootstrapDialog.show({
                            title: _strTitle,
                            message: _strHtmlSource,
                            closable: true,
                            closeByBackdrop: false,
                            closeByKeyboard: false,
                            buttons: _buttons,
                            onshow: function (dialogRef) {
                                let _btnCommentsClose = dialogRef.getModalBody().find(`[id='btnCloseIcon']`);
                                if (_btnCommentsClose && _btnCommentsClose.length > 0)
                                    _btnCommentsClose.on('click', function (e) {
                                        adminPanel.ResetStatusButton(dialogRef);
                                    });
                            },
                            nl2br: false//To avoid converting line break to br in message
                        });
                    });
                }
            });
    };

    /**
     * Function called on click of deny button in Profile dialog
     * @param {number} nPersonId
     * @param {BootstrapDialog} dialogRef
     */
    let DenyUserProfileRequest = function (nPersonId, dialogRef) {
        /* On first click make comments div visible
         * On second click check if the comments are entered or not.
         * If not entered show alert
         else make server call*/

        let _closeDialog = false;
        let _strComments = '';

        //Disable the approval button
        let _btnApprove = dialogRef.getButton(`btnDialogApprove`).disable();

        let _dialogContent = dialogRef.getModalBody();

        //Get the comments div
        let _divComments = _dialogContent.find(`[id='commentDiv']`);

        if (_divComments && _divComments.length > 0) {
            //If the div is hidden, then make it visible
            if (_divComments.hasClass('hidden'))
                _divComments.removeClass('hidden');
            else {
                //Get the comments textbox
                let _txtCommnets = _divComments.find(`[id='txtComments']`);

                //if the comments are not entered then show alert
                if (_txtCommnets && _txtCommnets.length > 0 && _txtCommnets.val() === '')
                    alert('Comments are mandatory while denying request');
                else {//collect the commnets
                    _strComments = _txtCommnets.val();
                    _closeDialog = true;
                }
            }
        }

        if (_closeDialog) {//if everything is ok, then hide the dialog and make server call
            dialogRef.close();

            let _data = {
                personId: nPersonId,
                action: "reject",
                comments: _strComments
            };

            let _utitlity = new Utility();
            _utitlity.CallServer('/Admin/ProcessUserProfile', _data)
                .then((msg) => {

                    if (msg.Status && msg.Status === 'PROCESSED') {
                        $('#aAccountControl').trigger('click');
                    }
                    else {
                        alert('Internal server error');
                    }
                }).catch((err) => {
                    console.log(err);
                });
        }
        return _closeDialog;
    };

    /**
     * Function called on click of approve button in Profile dialog
     * @param {number} nPersonId
     * @param {BootstrapDialog} dialogRef
     */
    let ApproveUserProfileRequest = function (nPersonId, dialogRef) {

        let _dialogContent = dialogRef.getModalBody();

        //_personId, _action, _comments
        let _data = {
            personId: nPersonId,
            action: "approve",
            comments: "Approved"
        };

        let _utitlity = new Utility();

        //make server call to update the request
        _utitlity.CallServer('/Admin/ProcessUserProfile', _data)
            .then((msg) => {
                if (msg.Status && msg.Status === 'PROCESSED') {
                    $('#aAccountControl').trigger('click');
                }
                else {
                    alert('Internal error');
                }
            }).catch((err) => {
                console.log(err);
            });
    };

    return {
        ResetStatusButton: ResetStatusButton,
        getUserRegistrationDetails: GetUserRegistartionDetails,
        DenyUserRegistrationRequest: DenyUserRegistrationRequest,
        ApproveUserRegistrationRequest: ApproveUserRegistrationRequest,
        ApproveUserProfileRequest: ApproveUserProfileRequest,
        DenyUserProfileRequest: DenyUserProfileRequest,
        GetUserProfileDetails: GetUserProfileDetails,
        getProfiles: GetProfiles
    };
}();