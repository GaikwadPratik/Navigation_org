"use strict"

/**
 * Common class to serve as utility provider in the application.
 * All the common functionality should be in this class
 */
class Utility {

    /**
     * Function to make AJAX call
     * @param {string} url
     * @param {any} dataToSend
     */
    CallServer(url, dataToSend) {
        return new Promise((resolve, reject) => {
            let serverData = JSON.stringify(dataToSend);
            $.ajax({
                url: url,
                method: 'POST',
                data: { serverData: serverData },
                success: function (data, textStatus, jqXHR) {
                    if (data.textStatus !== null)
                        resolve(data);
                    else
                        reject();
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    reject(errorThrown);
                    //TODO:: redirect to error page
                }
            });
        });
    }

    

    /**
     * Invokes the function by its name
     * @param {string} functionName
     */
    ExecuteFunctionByName(functionName) {

        let _argsRegEx = /\(([^)]+)\)/;
        let _args = Array.prototype.slice.call(arguments).splice(1);
        let _namespaces = functionName.split(".");
        let _func = _namespaces.pop();
        let _mainNS = window;

        for (let _index = 0; _index < _namespaces.length; ++_index) {
            _mainNS = new _mainNS[_namespaces[_index]]();
        }

        _args = _func.match(_argsRegEx);
        if (_args)
            _args = _args[1].split(',');
        _func = _func.replace(/\s*\([^)]*\)/g, '').replace(';', '');

        if (typeof (_mainNS[_func]) === 'function')
            return _mainNS[_func].apply(_mainNS, _args);
        else
            return null;
    }

    AttachClickEventPlus(id) {

        $(`.btn-add, .btn-remove`, `${id}`).on('click', function (e) {

            let _ctrl = $(this);
            if (_ctrl.length > 0) {
                let _fnTocall = _ctrl.data('clickFunction');
                if (_fnTocall) {
                    new Utility().ExecuteFunctionByName(_fnTocall);
                }
                else {
                    console.log(`click function not defined for ${_ctrl}`);
                }
            }
        });
    }

    GetStates(ctrl, nextCtrlId) {

        if (ctrl) {
            let _nCountryId = parseInt($(ctrl).val());

            let _utility = new Utility();

            _utility.CallServer('/Profile/Address/GetState', _nCountryId)
                .then((data) => {

                    if (data) {
                        let _strStateSourceHtml = Handlebars.helpers.generateOption(data, "StateId", "StateName", stateId);
                        $(`#${nextCtrlId}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                        if (stateId && stateId !== 'none')
                            $(`#${nextCtrlId}`).trigger('change');
                    }
                    else
                        location.href = "/Error/";
                });
        }
    }

    GetCities(ctrl, nextCtrlId) {

        if (ctrl) {
            let _nStateId = parseInt($(ctrl).val());
            if (_nStateId) {
                let _utility = new Utility();

                _utility.CallServer('/Profile/Address/GetCity', _nStateId)
                    .then((data) => {

                        if (data) {
                            let _strStateSourceHtml = Handlebars.helpers.generateOption(data, "CityId", "CityName", cityId);
                            $(`#${nextCtrlId}`).prop('disabled', false).html(Handlebars.Utils.escapeExpression(_strStateSourceHtml));
                        }
                        else
                            location.href = "/Error/";
                    });
            }
            else
                $(`#${nextCtrlId}`).val("none").prop('disabled', true);
        }
    }

    ShowVerificationDialog(ctrlId, childCntrl = "", isDelete = false) {
        return new Promise((resolve, reject) => {

            //Object into which values from page has to be added from the UI
            let _serverObject = {};

            //clone the object so dom is not modified
            let _sourceControl = $(`#${ctrlId}`).clone();
            let _mainDivName = _sourceControl.attr('name');

            _serverObject[_mainDivName] = {};

            //get the title so that it can be title of dialog
            let _titleFromControl = _sourceControl.find(`h3:first`);

            //remove title
            _sourceControl.find(_titleFromControl).remove();

            //remove unncessary components
            _sourceControl.find('h4:first').remove();

            let _childDivs = null;
            let _dialogType = BootstrapDialog.TYPE_INFO;

            if (!isDelete)
                //get elements by 'data-child-div' attributes
                _childDivs = _sourceControl.find('div[data-child-div]');
            else {
                _childDivs = _sourceControl.find(`[id="${childCntrl}"]`).find('div[data-child-div]');
                _dialogType = BootstrapDialog.TYPE_DANGER;
            }

            if (_childDivs && _childDivs.length > 0) {
                let _strHtmlSource = '<table><tbody>';

                let _childDivServerobject = {};

                for (let _childDiv of _childDivs) {
                    let _div = $(_childDiv);
                    //get all the labels with 'for' attribute
                    let _childLabels = _div.find('label[for]');

                    if (_childLabels && _childLabels.length > 0) {

                        let _childLabelObjects = {};

                        for (let _childLabel of _childLabels) {
                            let _label = $(_childLabel);

                            //get the value of label's for attribute from which value has to be extracted.
                            let _valueCtrlId = _label.prop('for');
                            if (_valueCtrlId) {
                                let _valueControl = $(`#${_valueCtrlId}`);
                                if (_valueControl && _valueControl.length > 0) {
                                    let _value = '';

                                    //get the tag name of the element.
                                    let _valueCtrlType = _valueControl.prop('tagName').toLowerCase();

                                    //if the tag is input then get the type i.e. text, checkbox, radio
                                    if (_valueCtrlType === 'input')
                                        _valueCtrlType = $(_valueControl).prop('type').toLowerCase();

                                    //extract value from the control
                                    switch (_valueCtrlType) {
                                        case 'text':
                                            _value = _valueControl.val();
                                            //TODO:: Add attribute as date and convert before assigning.
                                            _childLabelObjects[_label.attr('id')] = _value;
                                            break;

                                        case 'select':
                                            //only get the text if the dropdown value is selected
                                            if (_valueControl.val() !== '') {
                                                _value = _valueControl.find('option').filter(':selected').text();
                                                _childLabelObjects[_label.attr('id')] = _valueControl.val();
                                            }
                                            break;
                                    }

                                    //if control value is empty then don't for row
                                    if (_value === '' || _valueControl.is(':not(:visible)'))
                                        continue;

                                    //else form the row in the lable-text: control-value format
                                    _strHtmlSource += `<tr><td style="font-weight:bold;">${_label.text()}</td><td style="padding-left: 40px;">${_value}</td>`;
                                }
                            }
                        }
                        if (isDelete)
                            _childLabelObjects['isDeleted'] = true;
                        else
                            _childLabelObjects['isDeleted'] = false;

                        _childDivServerobject[_div.attr('name')] = _childLabelObjects;
                    }
                    _serverObject[_mainDivName] = _childDivServerobject;
                }


                _strHtmlSource += '</tbody></table>'

                let _buttons = [];

                let _btnOk = {
                    label: !isDelete ? 'Submit' : 'Remove',
                    id: 'btnDialogClose',
                    cssClass: 'btn btn-info pull-right',
                    action: function (dialogRef) {
                        dialogRef.close();
                        resolve(_serverObject);
                    }
                };
                _buttons.push(_btnOk);



                BootstrapDialog.show({
                    type: _dialogType,
                    title: _titleFromControl.text(),
                    message: _strHtmlSource,
                    closable: true,
                    closeByBackdrop: false,
                    closeByKeyboard: false,
                    buttons: _buttons,
                    onshow: function (dialogRef) {
                        let _body = dialogRef.getModalBody();
                        _body.find(":input").attr('disabled', true);
                    },
                    nl2br: false//To avoid converting line break to br in message
                });
            }
        });

    }
}

/**
 * Class to store comiled templates of partial view so that they can be easily served from the client side
 */
let Templates = function () {
    let cached = {};

    /**
     * Render the partial view by name. Returns compiled handlebar view template
     * @param {string} name
     * @param {Function} callback
     * @returns {Handlebars} view templeate
     */
    let Render = function (name, callback) {
        //Check if the template is present in cache or not.         
        if (IsCached(name) && callback)
            callback(cached[name]);
        else if (!IsCached(name)) {//if template is not present then get it from server
            let _utility = new Utility();
            _utility.CallServer('/GetPartialViewByName', { ViewName: name })
                .then((rawHtml) => {
                    Store(name, rawHtml);
                    Render(name, callback);
                })
                .catch((ex) => {
                    alert('Error');
                    console.log(ex);
                });
        }
    }
    /**
     * Function to check if the template is present in the cache or not
     * @param {string} name
     */
    let IsCached = function (name) {
        return !!cached[name];
    }

    /**
     * Function to store the raw template in the cache after compilation
     * @param {string} name
     * @param {string} rawHtml
     */
    let Store = function (name, rawHtml) {
        cached[name] = Handlebars.compile(rawHtml);
    }

    return {
        Render: Render
    }
}();

Handlebars.registerHelper('generateOption', function (arrObjects, valuePropertyName, textPropertyName, selectedValue) {

    let options = arrObjects.reduce((accumulator, currentValue, currentIndex, arrObjects) => {
        let selectedProperty = '';
        if (selectedValue)
            selectedProperty = currentValue[valuePropertyName] === selectedValue ? ' selected' : '';
        return accumulator += `<option value='${currentValue[valuePropertyName]}'${selectedProperty}>${currentValue[textPropertyName]}</option>`;
    }, `<option value='none'>Select One</option>`);

    return new Handlebars.SafeString(options);
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '!=':
            return (v1 != v2) ? options.fn(this) : options.inverse(this);
        case '!==':
            return (v1 !== v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});

let CachedObjects = {
};