$('document').ready(() => {

    class Notification {
        // prompt if ajax request is success
        static domNotificationSuccess(elem1, notifContent, elem2){
			// append to the parent
            $(elem1).prepend(`<section class="notification">
                                                <div class="notif-container">
                                                    ${notifContent}
                                                </div>
                                            </section>`);
			// show notification
            $('.notification').fadeIn(400, "swing", () => {
                $('.notification').css("display", "flex");
                $('.notif-container').css("transform", "scale(1)");
            })
			// button click event
			// hide notification onclick
            $(elem2).on('click', () => {
                $('.notification').fadeOut(400, "swing", () => {
                    $('.notification').css("display", "none");
                   $(elem1).children(`${elem1} > :first-child`).remove();
                })
                $('.notif-container').css("transform", "scale(0)");
            })
        }
        // prompt if there is error in the input fields
        static domValidate(elem, hint, errorsArr, whichField){
            $(elem).next().remove();
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
            $(`${elem} ~ .errorHint`).fadeIn(500);
            errorsArr.push(whichField);
        }
        // prompt if ajax request return an error
        static domValidateAjax(elem, hint){
            $(elem).next().remove();
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
            $(`${elem} ~ .errorHint`).fadeIn(500);
        }
    }

    class SignUp {
        // validate all forms the return any errors
        formValidation = (errors) => {
			// email validation pattern
            const emailReg = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
            if($('#signUpFirstName').val() == "" || $('#signUpFirstName').val() == null){
				// empty input promp error
                Notification.domValidate('#signUpFirstName', "First Name is required.", errors, "FirstName");
            }else{
				// remove error notification if input is not empty
                $('#signUpFirstName').next().remove();
            }

            if($('#signUpLastName').val() == "" || $('#signUpLastName').val() == null){
				// empty input promp error
                Notification.domValidate('#signUpLastName', "Last Name is required.", errors, "LastName");
            }else{
				// remove error notification if input is not empty
                $('#signUpLastName').next().remove();
            }

            if($('#signUpNumber').val() == "" || $('#signUpNumber').val() == null){
				// empty input promp error
                Notification.domValidate('#signUpNumber', "Mobile Number is required.", errors, "mobileNumber");
            }else if(isNaN($('#signUpNumber').val())){
				// input value is not a number promp error
                Notification.domValidate('#signUpNumber', "Mobile Number is required.", errors, "mobileNumber");
            }else{
				// remove error notification if no errors
                $('#signUpNumber').next().remove();
            }

            if($('#signUpEmail').val() == "" || $('#signUpEmail').val() == null){
				// empty input promp error
                Notification.domValidate('#signUpEmail', "Email is required.", errors, "email");
            }else if(!emailReg.test($(signUpEmail).val())){
				// if not a valid email promp error
                Notification.domValidate('#signUpEmail', "Email is not valid.", errors, "email");
            }else{
				// remove error notification if no errors
                $('#signUpEmail').next().remove();
            }

            if($('#signUpPassword').val() == "" || $('#signUpPassword') == null){
				// empty input promp error
                Notification.domValidate('#signUpPassword', "Password is required.", errors, "password");
            }else if($('#signUpPassword').val().length > 8){
				// password characters is greater than 8 promp error
                Notification.domValidate('#signUpPassword', "Maximum of 8 characters only.", errors, "password");
            }else{
				// remove error notification if no errors
                $('#signUpPassword').next().remove();
            }

            if($('#signUpPasswordAgain').val() != $('#signUpPassword').val()){
				// password does'nt match with confirm password
                Notification.domValidate('#signUpPasswordAgain', "Password mismatch.", errors, "passwordAgain");
            }else{
				// remove error notification if no errors
                $('#signUpPasswordAgain ~ .errorHint').fadeIn(500);
            }

        }
        // make ajax request
        submitForm = (errors) => {
            // stop execution if there is error return by formValidation
            if(errors.length > 0){
                return;
            }else{
                // make a post request pass all input field values as a json 
                $.ajax({
                    type: "POST",
                    url: "../backend/signUpUser.php",
                    contentType: "application/json",
                    data: JSON.stringify({
                                            "firstName": $('#signUpFirstName').val(),
                                            "lastName": $('#signUpLastName').val(),
                                            "mobileNumber": $('#signUpNumber').val(),
                                            "email": $('#signUpEmail').val(),
                                            "password": $('#signUpPassword').val()
                                        }),
                    processData: false,
                    success: (data, textStatus, xhr) => {
                        if(xhr.status == 200){
                            if(data != "" || data == null){
                                // if the return value is an error
                                Notification.domValidateAjax('#signUpNumber', data);
                            }else{
                                // if the request is success
                                const notifContent = `<p>Welcome to our keyword service.<br>You can now proceed to <a class="blueLink" href="../pages/signIn.php">SIGN IN</a> your account.</p>`;

                                Notification.domNotificationSuccess('.registerContainer', notifContent);
								
								// scroll back to top
								$('html').animate({scrollTop: 0}, 200, "swing");

                                // clear all fields
                                $('#registerNumber').val("");
                                $('#signUpFirstName').val("");
                                $('#signUpLastName').val("");
                                $('#signUpNumber').val("");
                                $('#signUpEmail').val("");
                                $('#signUpPassword').val("");
                                $('#signUpPasswordAgain').val("");
                            }
                        }
                    },
                    error: (xhr, textStatus, errorThrown) => {
                        console.log(errorThrown);
                    }
                })
            }
        }

        signUpEvents = () => {
            $('#signUpBtn').on('click', (e) => {
                e.preventDefault();
				// error messages container
                let errors = [];
				// validate form then return errors if there is any errors
                this.formValidation(errors);
				// submit form but check first if there is any errors, if no errors submit form
                this.submitForm(errors)
            }) 
        }
    }

    class Registration {
        // validate all forms the return any errors
        formValidation(error){
            if($('#registerNumber').val() == "" || $('#registerNumber').val() == null){
				// input is empty promp error notification
                Notification.domValidate('#registerNumber', "Mobile Number is required.", error, "mobileNumber");
            }else if(isNaN($('#registerNumber').val())){
				// input is not a number prompt error
                Notification.domValidate('#registerNumber', "Mobile Number is required.", error, "mobileNumber");
            }else{
				// remove error notification
                $('#registerNumber').next().remove();
            }
        }
        // make ajax request
        submitForm(error){
            // stop execution if there is error return by formValidation
            if(error.length > 0){
                return;
            }else{
                // make a post request
                $.ajax({
                    type: "POST",
                    url: "../backend/registerNumber.php",
                    contentType: "application/x-www-form-urlencoded; charset=UTF-8",
                    data: "number="+$('#registerNumber').val(),
                    processData: true,
                    success: (data, textStatus, xhr) => {
                        if(xhr.status == 200){
                            if(data != ""){
                                if(data == "sub"){
                                    // if already subscribe promp error
                                    Notification.domValidateAjax('#registerNumber', "You're already subscribe to our service.");
                                }else if(data == "unsub"){
									// if returning client promp welcome back message
                                    const notifContent = `<p>Welcome back to our keyword service. You can now proceed to <a class="blueLink" href="../pages/signIn.php">SIGN IN</a> your account.</p>`;

                                    Notification.domNotificationSuccess('.registerContainer', notifContent);
									
									// scroll back to top
									$('html').animate({scrollTop: 0}, 200, "swing");
                                }
                            }else{
                                // if the request is success
                                const notifContent = `<p>You will receive a confirmation message via SMS. After that you can proceed in creating your account</p>
                                <button type="button" class="btnGray5 globalBtn" id="registerCloseBtn">CLOSE</button>`;

                                Notification.domNotificationSuccess('.registerContainer', notifContent, '#registerCloseBtn');
								
								// scroll back to top
								$('html').animate({scrollTop: 0}, 200, "swing");

                                // clear input fields
                                $('#registerNumber').val("");
                                $('#signUpFirstName').val("");
                                $('#signUpLastName').val("");
                                $('#signUpNumber').val("");
                                $('#signUpEmail').val("");
                                $('#signUpPassword').val("");
                                $('#signUpPasswordAgain').val("");
                            }
                        }
                    },
                    error: (xhr, textStatus, errorThrown) => {
                        console.log(errorThrown);
                    }
                })
            }
        }

        registrationEvents(){
            $('#registrationBtn').on('click', (e) => {
                e.preventDefault();
                let error = [];
				// validate then return errors if there is any errors
                this.formValidation(error);
				// submit form if error array is empty
                this.submitForm(error);
            })
        }
    }

    class SignIn{
        // validate all forms the return any errors
        formValidation(error){
            if($('#signInNumber').val() == "" || $('#signInNumber').val() == null){
				// input is empty
                Notification.domValidate('#signInNumber', "Mobile Number is required.", error, "mobileNumber");
            }else if(isNaN($('#signInNumber').val())){
				// input value id not a number
                Notification.domValidate('#signInNumber', "Mobile Number is required.", error, "mobileNumber");
            }else{
				// remove error message
                $('#signInNumber').next().remove();
            }

            if($('#signInPassword').val() == "" || $('#signInPassword').val() == null){
				// input empty
                Notification.domValidate('#signInPassword', "Password is required.", error, "password");
            }else{
				// remove error message
                $('#signInPassword').next().remove();
            }
        }
        // make ajax request
        submitForm(error){
            // stop execution if there is error return by formValidation
            if(error.length > 0){
                return;
            }else{
                // make a post request pass all input field values as a json 
                $.ajax({
                    type: "POST",
                    url: "../backend/signInUser.php",
                    contentType: "application/json",
                    data: JSON.stringify({
                                            "mobileNumber":$('#signInNumber').val(),
                                            "password":$('#signInPassword').val()
                                        }),
                    processData: false,
                    success: (data, textStatus, xhr) => {
                        if(xhr.status == 200){
                            if(data != ""){
                                // if the return value is an error
                                Notification.domValidateAjax('#signInNumber', data);
                            }else{
                                // redirect to index if sign in is success
                                window.location.href = `../index.php?mobilenumber=${$('#signInNumber').val()}`;
                            }
                        }
                    },
                    error: (xhr, textStatus, errorThrown) => {
                        console.log(errorThrown);
                    }
                })
            }
        }
        // forgot password
        smsPassword(error){
            $('#forgotBtn').on('click', (e) => {
                e.preventDefault();
                if($('#forgotNumber').val() == "" || $('#forgotNumber').val() == null){
					// input empty
                    Notification.domValidate('#forgotNumber', "Mobile Number is required.", error, "mobileNumber");
                }else if(isNaN($('#forgotNumber').val())){
					// input value is not a number
                    Notification.domValidate('#forgotNumber', "Mobile Number is required.", error, "mobileNumber");
                }else{
					// remove error message
                    $('#forgotNumber').next().remove();
                    const notifContent = `<p>You will receive a confirmation message via SMS. Please Follow the instruction.</p>
                                <button type="button" class="btnGray5 globalBtn" id="forgotCloseBtn">CLOSE</button>`;
					// show notification
                    Notification.domNotificationSuccess('.signInContainer', notifContent, '#forgotCloseBtn');
					
					// scroll back to top
					$('html').animate({scrollTop: 0}, 200, "swing");
					
                    $('#forgotPasswordWrapper').fadeOut(400, () => $('#forgotNumber').val(""));
                }
            })
        }

        signInEvents(){
            // sign in click event
            $('#signInBtn').on('click', (e) => {
                e.preventDefault();
                let error = [];
                this.formValidation(error);
                this.submitForm(error);
            })
            // forgot password click event
            $('#forgotPassword ').on('click', (e) => {
                e.preventDefault();
                let error = [];
                $('#forgotPasswordWrapper').fadeIn(400, () => this.smsPassword(error));
            })
        }
    }

    const registration = new Registration();
    const signUp = new SignUp();
    const signIn = new SignIn();

    signUp.signUpEvents();
    registration.registrationEvents();
    signIn.signInEvents();
})