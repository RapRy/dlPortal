$('document').ready(() => {
    class Notification{
        // error notification
        static domValidate(elem, hint, errorsArr, whichField){
            $(elem).next().remove();
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
            if(whichField == "picInput"){
				// upload image error notification
                $(`${elem} ~ .errorHint`).fadeIn(500).css({display:"block"});
            }else{
				// global error notification
                $(`${elem} ~ .errorHint`).fadeIn(500);
            }
            errorsArr.push(whichField);
        }
    }

    class EditProfile{
        // validate notification for first name and last name input fields
        static validateForm(errors){
            if($("#editFirstName").val() == "" || $("#editFirstName").val() == null){
				// input empty
                Notification.domValidate('#editFirstName', "First Name is required", errors, "FirstName");
            }else{
				// remove error notif
                $("#editFirstName").next().remove();
            }

            if($("#editLastName").val() == "" || $("#editLastName").val() == null){
				// input empty
                Notification.domValidate('#editLastName', "Last Name is required", errors, "LastName");
            }else{
				// remove error notif
                $("#editLastName").next().remove();
            }
        }

        updateProfilePic(){
            $('#picInput').on('change', function(){
				// create new form
                const data = new FormData();
				// get the value of the file input
                const fileInput = this.files[0];
                // append the image to the new FormData and other datas
                data.append("picInput", fileInput);
                data.append("editUserId", $('#editUserId').val());
                data.append("editFirstName", $('#editFirstName').val())
				data.append("mobileNumber", $('#editUserMobileNumber').val())

                $.ajax({
                    type:"POST",
                    url:"../../backend/uploadProPic.php",
                    data: data,
                    contentType: false,
                    cache:false,
                    processData:false,
                    beforeSend: function(){
                        // check image file type
                        if(fileInput.type == "image/jpg" || fileInput.type == "image/jpeg" || fileInput.type == "image/png"){
                            // append upload loader
                            $('.profilePic').prepend(`
                                <div class="loaderContainer">
                                    <div class="loader"></div>
                                </div>
                            `)
                        }else{
                            // if image file type is not supported, show error and dont send the form
                            let errors = [];
                            Notification.domValidate("#picInput", "Image format not supported", errors, "picInput")
                            return false;
                        }
                    },
                    success: function(data, textStatus, xhr){
                        if(xhr.status == 200){
							// convert data to object
                            const bodyData = JSON.parse(data);
                            // append the uploaded image if the return data is image file name
                            if(bodyData.hasOwnProperty("image")){
								// remove the loader
                                $('.loaderContainer').remove();
								// change the src attribute of img tag
                                $('.profilePic img').attr("src", `../../uploads/avatars/${$('#editUserMobileNumber').val()}/${bodyData.image}`);
								// remove error notif if there is an error notif
								if($('.changeProfPic .errorHint') != undefined){
									$('.errorHint').remove();
								}
                            }else if(bodyData.hasOwnProperty("error")){
                                // if the return data is error message show error notif
                                $('.loaderContainer').remove();
								let errors = [];
                                Notification.domValidate("#picInput", bodyData.error, errors, "picInput")
                            }
                            // update the recent activity in account overview
                            if(bodyData.hasOwnProperty("activityDate")){
                                $(".accountDetails ul li:nth-child(5) span").text(bodyData.activityDate);
                            }
                        }
                    },
                    error: function(err){
                        console.log(err);
                    }
                })
            })
        }

        saveChanges(){
            // get initial value of the user
            const fNameCurrentVal = $('#editFirstName').val();
            const lNameCurrentVal = $('#editLastName').val();
            // container for new value of inputs
            let fNameNewVal = "";
            let lNameNewVal = "";
            // error container
            let errors = [];
            // assign new input value of the fNameNewVal when the user change the initial value of the input
            $('#editFirstName').on('change', function(){
                fNameNewVal = $(this).val();
            })
            // assign new input value of the lNameNewVal when the user change the initial value of the input
            $('#editLastName').on('change', function(){
                fNameNewVal = $(this).val();
            })

            $('#editProfileForm').on('submit', function(e){
                e.preventDefault();
                const data = new FormData();
                // append user id
                data.append("userId", $('#editUserId').val());
                if(fNameCurrentVal === fNameNewVal || fNameCurrentVal === $('#editFirstName').val()){
                    // if initial value is equal to the new value or user didn't change the value of input then dont append the value of input
                    // empty errors array if last name input is empty
                    if($('#editLastName').val() != ""){
                        errors = [];
                    }
                    // remove notification if there is any error
                    $('#editFirstName').next().remove();
                }else if($('#editFirstName').val() === ""){
                    // if first name input is empty
                    // display error
                    EditProfile.validateForm(errors);
                }
                else if(fNameCurrentVal !== fNameNewVal || fNameNewVal != "" || fNameNewVal != null){
					// user change the initial value and input is not empty
                    // if initial value is not equal to the new value or fNameNewVal variable is not empty or null
                    // set empty errors array
                    errors = [];
                    // remove notification
                    $('#editFirstName').next().remove();
                    // append value of input to the new form
                    data.append("firstName", $('#editFirstName').val());
                }

                if(lNameCurrentVal === lNameNewVal || lNameCurrentVal === $('#editLastName').val()){
                    // if initial value is equal to the new value or user didn't change the value of input then dont append the value of input
                    // empty errors array if last name input is empty
                    if($('#editFirstName').val() != ""){
                        errors = [];
                    } 
                    // remove notification if there is any error
                    $('#editLastName').next().remove();
                }else if($('#editLastName').val() === ""){
                    // if last name input is empty
                    // display error
                    EditProfile.validateForm(errors);
                }
                else if(lNameCurrentVal !== lNameNewVal || lNameNewVal != "" || lNameNewVal != null){
					// user change the initial value and input is not empty
                    // if initial value is not equal to the new value or lNameNewVal variable is not empty or null
                    // set empty errors array
                    errors = [];
                    // remove notification
                    $('#editLastName').next().remove();
                    // append value of input to the new form
                    data.append("lastName", $('#editLastName').val());
                }

                $.ajax({
                    type:"POST",
                    url: "../../backend/saveChanges.php",
                    contentType: false,
                    processData: false,
                    data: data,
                    beforeSend: function(){
                        if(errors.length > 0){
                            // is errors array is not empty, don't make a request
                            return false;
                        }else if($('#editFirstName').val() == "" || $('#editLastName').val() == ""){
                            // if both first name and last name are empty, don't make request
                            return false;
                        }else if((fNameCurrentVal === $('#editFirstName').val() && lNameCurrentVal === $('#editLastName').val()) && $('#picInput')[0].files.length == 0){
							// if user click the save button but did'nt change anything
                            // don't make request if there is no changes
                            return false;
                        }else if(($('#picInput')[0].files.length == 1) && (fNameCurrentVal === $('#editFirstName').val() && lNameCurrentVal === $('#editLastName').val())){
                            // if the user only change the profile picture, don't make request and send a dummy success notification
                            $('.profileContainer').prepend(`
                                <section class="notification">
                                    <div class="notif-container">
                                        <p>Saving Changes..</p>
                                        <div class="saveLoader">
                                            <div class="saveSpinner"></div>
                                        </div>
                                    </div>
                                </section>
                            `);
							// show notification
                            $('.notification').fadeIn(400, "swing", function(){
                                $('.notif-container').css({transform:"scale(1)"})
                            }).css({display:"flex"});
                            // remove the loader then show the success message after the timeout
                            setTimeout(function(){
                                $('.saveLoader').remove();
                                $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                                $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                                $('.notif-container p').text("Profile succesfully updated.");
                            }, 500);
                            // remove the notification after timeout
                            setTimeout(function(){
                                $('.notification').fadeOut(400, "swing", function(){
                                    $('.profileContainer').children(".notification").remove();
                                })
                                $('.notif-container').css("transform", "scale(0)");
                            }, 2000);

                            return false;
                        }else{
                            // if there are no errors, show loader before make request
                            $('.profileContainer').prepend(`
                                <section class="notification">
                                    <div class="notif-container">
                                        <p>Saving Changes..</p>
                                        <div class="saveLoader">
                                            <div class="saveSpinner"></div>
                                        </div>
                                    </div>
                                </section>
                            `);

                            $('.notification').fadeIn(400, "swing", function(){
                                $('.notif-container').css({transform:"scale(1)"})
                            }).css({display:"flex"});
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
                        }
                    },
                    success: (data, textStatus, xhr) => {
                        if(xhr.status == 200){
                            // split the string date via ":" then convert it to array 
                            const getDate = data.split(':');
                            // remove the loader then show the success message
                            $('.saveLoader').remove();
                            $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                            $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                            $('.notif-container p').text("Profile succesfully updated.");
                            // remove the notification after timeout
                            setTimeout(function(){
                                $('.notification').fadeOut(400, "swing", function(){
                                    $('.profileContainer').children(".notification").remove();
                                })
                                $('.notif-container').css("transform", "scale(0)");
                            }, 1000)
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
							
                            // update the name in the account overview
                            $(".accountDetails ul li:nth-child(2) span").text(`
                                ${$('#editFirstName').val()} ${$('#editLastName').val()}
                            `)
                            // update the recent activity in account overview
							// get the first index
                            $(".accountDetails ul li:nth-child(5) span").text(getDate[0]);
                            
                        }
                    },
                    error: (err) => console.log(err)
                })
            })
        }
    }

    class AccountSecurity{
        static validateForm(errors){
            if($("#newPassword").val() == "" || $("#newPassword").val() == null){
				// input empty
                Notification.domValidate('#newPassword', "Password is required", errors, "newPassword");
            }else if($('#newPassword').val().length > 8){
				// password characters is greater than 8 promp error
                Notification.domValidate('#newPassword', "Maximum of 8 characters only.", errors, "newPassword");
			}else{
				// remove error notif
                $("#newPassword").next().remove();
            }

            if($("#confirmPassword").val() == "" || $("#confirmPassword").val() == null){
				// input empty
                Notification.domValidate('#confirmPassword', "Please confirm your password", errors, "confirmPassword");
            }else{
				// remove error notif
                $("#confirmPassword").next().remove();
            }
			
			if($('#confirmPassword').val() != $('#newPassword').val()){
				// passwords doesnt match
				Notification.domValidate('#confirmPassword', "Password did'nt match", errors, "confirmPassword");
			}else{
				$("#confirmPassword").next().remove();
			}
        }
		
		saveChanges(){
			let errors = [];
			
			$('#accountSecurityForm').on('submit', function(e){
                e.preventDefault();
                // check for errors
				AccountSecurity.validateForm();
				
				if(errors.length > 0){
                    // don't make request if there are any error
					return false;
				}else{
                    // create new form
					const formData = new FormData();
					
					$.ajax({
						type: 'POST',
						url: "../../backend/saveChangesSecurity.php",
						contentType: false,
						processData: false,
						data: formData,
						beforeSend: function(){
                            // append all the needed data into the new form
							formData.append("userId", $('#accSecUserId').val())
                            formData.append("password", $('#confirmPassword').val())
                            
                            // if there are no errors, show loader before make request
                            $('.profileContainer').prepend(`
                                <section class="notification">
                                    <div class="notif-container">
                                        <p>Saving Changes..</p>
                                        <div class="saveLoader">
                                            <div class="saveSpinner"></div>
                                        </div>
                                    </div>
                                </section>
                            `);

                            $('.notification').fadeIn(400, "swing", function(){
                                $('.notif-container').css({transform:"scale(1)"})
                            }).css({display:"flex"});
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
						},
						success: function(data, textStatus, xhr){
							if(xhr.status == 200){
                                if(data == "success"){
                                    // remove the loader then show the success message
                                    $('.saveLoader').remove();
                                    $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                                    $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                                    $('.notif-container p').text("Password succesfully updated.");
                                    // remove the notification after timeout
                                    setTimeout(function(){
                                        $('.notification').fadeOut(400, "swing", function(){
                                            $('.profileContainer').children(".notification").remove();
                                        })
                                        $('.notif-container').css("transform", "scale(0)");
                                    }, 2000)
									
									// scroll back to top
									$('html').animate({scrollTop: 0}, 200, "swing");
                                    
                                    // remove input values
                                    $("#newPassword").val("");
                                    $("#confirmPassword").val("")
                                }
                            }
						},
						error: (err) => console.log(err)
					})
				}
			})
		}
    }

    class AccountSettings{
        checkboxEvent(){
            $('.checkboxSettings').on('change', function(e){
                const inputVal = $(this).val();
                const userId = $(`.hiddenInput${inputVal}`).val();
                const formData = new FormData;

                $.each($('.checkboxSettings'), function(key, elem){
                    // remove checkmark of the previous checkbox
                    if($(elem).prop('checked')){
                        $(elem).prop('checked', false);
                    }
                })
                // add checkmark to the selected checkbox
                $(this).prop('checked', true)

                $.ajax({
                    type:'POST',
                    url:'../../backend/accountSettingsCheckbox.php',
					contentType: false,
                    processData: false,
                    data: formData,
                    beforeSend: function(){
                        // attached values to the new form
                        formData.append("inputVal", inputVal);
                        formData.append("userId", userId);

                        // if there are no errors, show loader before make request
                        $('.profileContainer').prepend(`
							<section class="notification">
								<div class="notif-container">
									<p>Saving Changes..</p>
									<div class="saveLoader">
										<div class="saveSpinner"></div>
									</div>
								</div>
							</section>
						`);

						$('.notification').fadeIn(400, "swing", function(){
							$('.notif-container').css({transform:"scale(1)"})
						}).css({display:"flex"});
						
						// scroll back to top
						$('html').animate({scrollTop: 0}, 200, "swing");
                    },
                    success: function(data, textStatus, xhr){
                        if(xhr.status == 200){
                            // split the string date via ":" then convert it to array 
                            const getDate = data.split(':');
                            // remove the loader then show the success message
                            $('.saveLoader').remove();
                            $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                            $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                            $('.notif-container p').text("Succesfully updated.");
                            // remove the notification after timeout
                            setTimeout(function(){
                                $('.notification').fadeOut(400, "swing", function(){
                                    $('.profileContainer').children(".notification").remove();
                                })
                                $('.notif-container').css("transform", "scale(0)");
                            }, 2000)
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");

                            // update text in account overview
                            $('.receiveUpdate span').text(`*Receiving updates via ${inputVal}`);
                            // update the recent activity in account overview
							// get the first index
                            $(".accountDetails ul li:nth-child(5) span").text(getDate[0]);
                        }
                    },
                    error: (err) => console.log(err)
                })
            })
        }

        deactivateBtnEvent(){
            $('#deactivateBtn').on('click', function(e){
                e.preventDefault();
                const userId = $(this).prev().val();

                // deactivate notification
                $('.profileContainer').prepend(`
                    <section class="notification">
                        <div class="notif-container">
                            <p>Please tap or click on the Confirm Button to deactivate your account.</p>
                            <div class="twoBtnContainer container">
                                <div class="row">
                                <button type="button" class="btnRedConfirm twoBtnGlobal col mr-3" id="deactivateConfirmBtn">
                                    CONFIRM
                                </button>
                                <button type="button" class="btnGray5 twoBtnGlobal col" id="deactivateCloseBtn">
                                    CLOSE
                                </button>
                                </div>
                            </div>
                        </div>
                    </section>
                `)

                // show notification
                $('.notification').fadeIn(400, "swing", () => {
                    $('.notification').css("display", "flex");
                    $('.notif-container').css("transform", "scale(1)");
                })
                // close btn hide notification
                $('#deactivateCloseBtn').on('click', function(){
                    $('.notification').fadeOut(400, "swing", () => {
                        $('.notification').css("display", "none");
                        $('.profileContainer').children('.profileContainer > :first-child').remove();
                    })
                    $('.notif-container').css("transform", "scale(0)");
                })
				
				// scroll back to top
				$('html').animate({scrollTop: 0}, 200, "swing");
				
                // deactivate confirm btn fully deactivate account
                $('#deactivateConfirmBtn').on('click', function(){

                    const formData = new FormData();

                    $.ajax({
                        type:'POST',
                        url: "../../backend/deactivateAccount.php",
						contentType: false,
						processData: false,
                        data: formData,
                        beforeSend: function(){
                            // attach user id to form
                            formData.append('userId', userId);
							// attached the one who make request
							formData.append('sender', 'user');
                            // show loader
                            $('.notif-container').html(`
                                <p>Deactivating Account..</p>
                                <div class="deactivateLoader">
                                    <div class="deactivateSpinner"></div>
                                </div>
                            `)
                        },
                        success: function(data, textStatus, xhr){
                            if(xhr.status == 200){
                                if(data != ""){
                                    // remove the loader then show the deactivate message
                                    $('.deactivateLoader').remove();
                                    $('.notif-container').append(`<i class="fas fa-check deactivateSuccess"></i>`);
                                    $('.deactivateSuccess').css({display:"none"}).fadeIn(400, "swing");
                                    $('.notif-container p').text("Account succesfully deactivated.");

                                    // remove the notification after timeout
                                    setTimeout(function(){
                                        $('.notification').fadeOut(400, "swing", function(){
                                            $('.profileContainer').children(".notification").remove();

                                            // redirect to sign in page after animation is finished
                                            window.location.href = "../signIn.php";
                                        })
                                        $('.notif-container').css("transform", "scale(0)");
                                        
                                    }, 2000)
                                }
                            }
                        },
                        error: (err) => console.log(err)
                    })
                })

            })
        }
    }

    class AccountOverview{
        // signout current user
        logout(){
            $('#logoutBtn').on('click', function(e){
                e.preventDefault();

                const userId = $(this).children('input').val();

                const formData = new FormData();

                formData.append("userId", userId);

                $.ajax({
                    type: "POST",
                    contentType: false,
                    processData: false,
                    data: formData,
                    url: "../../backend/signOutUser.php",
                    success: (data, textStatus, xhr) => {
                        if(xhr.status == 200){
                            if(data != ""){
                                // if the data returned is not empty
                                // redirect to sign in page
                                window.location.href = "../signIn.php";
                            }else{
                                return;
                            }
                        }else{
                            return;
                        }
                    },
                    error:(xhr, textStatus, errorThrown) => console.log(errorThrown)
                })
            })
        }

        accountMenu(){
            $('.acctBtn').on('click', function(){
                // get the inner text of the acctbtn child span then remove white spaces
                let acctBtnSpan = $(this).find("span").text().replace(/\s+/g, '');
                // convert first letter to lowercase
                let spanValue = acctBtnSpan.charAt(0).toLowerCase() + acctBtnSpan.replace(acctBtnSpan.charAt(0), "");
                // fetch html elements
				// use the name of the menu as filename of php files
                $.ajax({
                    type:"POST",
                    dataType:"html",
                    url:spanValue+".php",
                    success: (html) => {
                        $('.accountOverviewWrapper').animate({right:"100%"})
                        // add the html elements
                        $('.profileWrapper').append(html)
                        // insert the content of the selected menu
                        $('.menuProfileDivs').animate({left:"0"}, () => {
                            // remove the href attribute of back btn then add event
                            $('#profileBackBtn').removeAttr("href").on('click', () => {
                                // remove current page then show the menu
                                $('.accountOverviewWrapper').animate({right:0});
                                $('.menuProfileDivs').animate({left: "100%"}, () => {
                                    $('.profileWrapper').children('.menuProfileDivs').remove();
                                    // add href attribb to the button
                                    $('#profileBackBtn').attr("href", "../../index.php");
                                })
                            })
                        })
						
						if(spanValue === "editProfile"){
							const editProfile = new EditProfile;
							editProfile.saveChanges();
							editProfile.updateProfilePic();
						}
						
						if(spanValue === "accountSecurity"){
							const accountSecurity = new AccountSecurity;
							accountSecurity.saveChanges();
                        }
                        
                        if(spanValue === "accountSettings"){
                            const accountSettings = new AccountSettings;
                            accountSettings.checkboxEvent();
                            accountSettings.deactivateBtnEvent();
                        }
						
						// scroll back to top
						$('html').animate({scrollTop: 0}, 200, "swing");
						
						// if(spanValue === "activityHistory"){
						// 	// account menu if edit profile
						// 	const activityHistory = new ActivityHistory;
						// 	activityHistory.getUserActivities();
						// }
                    },
                    error: (errorThrown) => console.log(errorThrown)
                })
            })
        }
    }
	
    const accountOverview = new AccountOverview;
    accountOverview.logout();
    accountOverview.accountMenu();
})