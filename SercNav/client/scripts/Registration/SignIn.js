$(function () {
    $('#signInForm').validate({
        rules: {
            email: {
                required: true,
                email: true,
            },
            password: {
                required: true
            }

        },
        messages: {
            email: {
                required: 'Please enter email address',
                email: 'Please enter a <em>valid</em> email address.'

            },
            password: {
                required: 'Please enter password'
            }
        }
    });
});
