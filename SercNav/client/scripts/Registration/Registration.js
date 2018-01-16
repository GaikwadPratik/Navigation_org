"use strict";

$('#signupSubmit').on('click', function (e) {
   
    var chkFormValid = $("#registrationForm").valid();
    e.preventDefault();
    if (chkFormValid) {
        let _data = {
            "firstName": $("#txtFirstName").val(),
            "lastName": $("#txtLastName").val(),
            "email": $("#txtSignupEmail").val(),
            "caption": $("#caption").val(),
            "password": $("#txtSignupPassword").val(),
            "userRole": $("#userRole").val(),
            "userName": $("#txtUsername").val(),
            "industryAffl": $('#industryAffl').val(),
            "industryName": $('#txtIndustryName').val()
        };


        let _utility = new Utility();
        _utility.CallServer('/Register/RegisterUser', _data)
            .then((msg) => {
               
                $('#registerMsg').removeClass("hide");
                window.scrollTo(0, 0);
                $("#txtFirstName, #txtLastName, #txtSignupEmail, #txtSignupPassword, #signupPasswordagain, #txtIndustryName, #txtUsername").val("");
                $("#caption, #industryAffl, #userRole").val("none");

            }).catch((err) => {
                console.log(err);
                // console.log(_data);
            });
    }
});

$(function () {
  //var  $successMsg = $(".alert");
    $.validator.addMethod("alphanumeric", function (value, element) {
        return this.optional(element) || /^\w+$/i.test(value);
    }, "Letters, numbers, and underscores only please");

    $.validator.addMethod("nowhitespace", function (value, element) {
        return this.optional(element) || /^\S+$/i.test(value);
    }, "No white space please");

    $.validator.addMethod("dropdownSelectValidate", function (value, element) {
        if (value == "none")
            return false;
        else
            return true;
    }, "Please select Value");

    //The password must be at least 7 characters, have at least 1 upper case, have at least 1 lower case, and at least 1 number OR special character.
    $.validator.addMethod("PasswordMinRequirement", function (value) {
        return /[A-Z]+/.test(value) && /[a-z]+/.test(value) &&
            /[\d\W]/.test(value) && /\S{7,}/.test(value)
    }, "Password must contain at least 7 characters, have at least 1 upper case, have at least 1 lower case, and at least 1 number OR special character.");

    $('#registrationForm').validate({

        rules: {
            firstName: {
                required: true,
                alphanumeric: true,
                nowhitespace: true
            },
            lastName: {
                required: true,
                alphanumeric: true,
                nowhitespace: true
            },
            email: {
                required: true,
                email: true
            },
            password: {
                required: true,
                PasswordMinRequirement: true
            },
            industryName: {
                required: true
            },
            confirmPassword: {
                required: true,
                equalTo: '#txtSignupPassword'
            },
            AccessType: {
                dropdownSelectValidate: true
            },
            industryAffl: {
                dropdownSelectValidate: true
            },
            caption: {
                dropdownSelectValidate: true
            }
        },
        messages: {
            firstName: {
                required: 'Please enter first Name'
            },
            email: {
                required: 'Please enter email address',
                email: 'Please enter a <em>valid</em> email address.'
            },
            confirmPassword: {
                required: 'Please enter confirm password',
                equalTo: 'Enter confirm password same as password'
            },
            password: {
                required: 'Please enter password'
            },
            industryName: {
                required: 'Please enter industry name'
            }
        },

        //submitHandler: function () {
        //    $successMsg.show();
        //}

    });
});