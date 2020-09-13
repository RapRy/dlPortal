$('document').ready(function(){
    class Notification{
        // prompt if ajax request is success
        static domNotification(elem1, notifContent, elem2){
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
		
		static confirmNotification(msg){
			$('.adminProfileContainer').prepend(`
				<section class="notification">
					<div class="notif-container">
						<p>${msg}</p>
						<div class="twoBtnContainer container">
							<div class="row">
							<button type="button" class="btnRedConfirm twoBtnGlobal col mr-3" id="confirmBtn">
								CONFIRM
							</button>
							<button type="button" class="btnGray5 twoBtnGlobal col" id="closeBtn">
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
			$('#closeBtn').on('click', function(){
				$('.notification').fadeOut(400, "swing", () => {
					$('.notification').css("display", "none");
					$('.adminProfileContainer').children('.adminProfileContainer > :first-child').remove();
				})
				$('.notif-container').css("transform", "scale(0)");
			})
			// scroll back to top
			$('html').animate({scrollTop: 0}, 200, "swing");
		}

		static notifContainer(msg){
			// show notification
			$('.notif-container').html(`
				<p>${msg}</p>
				<div class="deactivateDeleteLoader">
					<div class="deactivateDeleteSpinner"></div>
				</div>
			`)
		}

		static removeNotif(){
			// remove the loader then show the deactivate message
			$('.deactivateDeleteLoader').remove();
			$('.notif-container').append(`<i class="fas fa-check deactivateDeleteSuccess"></i>`);
			$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
			$('.notif-container p').text("Account succesfully deleted.");
			
			// remove the notification after timeout
			setTimeout(function(){
				$('.notification').fadeOut(400, "swing", function(){
					$('.adminProfileContainer').children(".notification").remove();
				})
				$('.notif-container').css("transform", "scale(0)");
				
			}, 2000)
		}
    }

    class UserDetails{
		deleteUser(userId, currentElem, callback){
			// delete notification
			Notification.confirmNotification("Please tap or click on the Confirm Button to delete the user.");
			
			$('#confirmBtn').on('click', function(){
				const dataForm = new FormData();
				$.ajax({
					type:'POST',
					url: "../../backend/deleteUser.php",
					contentType: false,
					processData: false,
					data: dataForm,
					beforeSend: function(){
						dataForm.append('userId', userId);
						Notification.notifContainer("Deleting User..");
						
					},
					success: function(data, textStatus, xhr){
						if(xhr.status == 200){
							if(data != ""){

								// remove Notification
								Notification.removeNotif();

								//remove current user
								$(currentElem).parent().parent().parent().parent().remove();
								
								// set the toggle to close status
								callback();
							}
						}
					},
					error: (err) => console.log(err)
				})
			})
		}
		
		unsubscribeUser(userId, currentElem){
			Notification.confirmNotification("Please tap or click on the Confirm Button to deactivate the account.");
			// deactivate notification
			
			// deactivate confirm btn fully deactivate account
			$('#confirmBtn').on('click', function(){
				const dataForm = new FormData();
				$.ajax({
					type:'POST',
					url: "../../backend/deactivateAccount.php",
					contentType: false,
					processData: false,
					data: dataForm,
					beforeSend: function(){
						dataForm.append('userId', userId);
						// attached the one who make request
						dataForm.append('sender', "Admin");
						// show loader
						Notification.notifContainer("Deactivating Account..");
					},
					success: function(data, textStatus, xhr){
						if(xhr.status == 200){
							if(data != ""){
								
								// remove Notification
								Notification.removeNotif();

								// change subscription icon
								$(currentElem).parent().parent().parent().prev().children('.userSubStatus').children('span').children('i').removeClass(['fa-user-check', 'userSub']).addClass(['fa-user-times', 'userUnsub'])

								//add opacity class
								$(currentElem).addClass('opacity50').prop('disabled', true);
							}
						}
					},
					error: (err) => console.log(err)
				})
			})
		}
		
		viewActivities(userId, currentElem){
            const dataForm = new FormData();
            dataForm.append('userId', userId);

            $.ajax({
                type:'POST',
                url: '../../backend/viewUserActivities.php',
                data:dataForm,
                dataType: 'json',
                contentType:false,
				processData:false,
				beforeSend: function(){
					if($('.userActivityHistory').length > 0){
						$('.userActivityHistory').remove();
					}
				},
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200){
                        if(data.hasOwnProperty('result')){
							// show no activities notification
                            const notifContent = `
                                <p id="noHistoryP">No Activities</p>
                                <button type="button" class="btnGray5 globalBtn" id="noHistoryCloseBtn">CLOSE</button>
                            `
                            Notification.domNotification('.adminProfileContainer', notifContent, '#noHistoryCloseBtn');
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
                        }else{
                            // append history to userDetails
                            $(currentElem).parent().prev().append(`<div class="userActivityHistory container"></div>`)

                            data.forEach((activity, actI) => {
                                const dateRef = activity.dateRef.split("-");

                                $('.userActivityHistory').append(`
                                    <div class="userActivityWrap row">
                                        <div class="userActivityDate col-3 h-25">
                                            <span class="userActivityDateDate">
                                                ${dateRef[1]}
                                            </span>
                                            <span class="userActivityDateMonth">
                                                ${dateRef[0]}
                                            </span>
                                            <span class="userActivityDateYear">
                                                ${dateRef[2]}
                                            </span>
                                        </div>
                                        <div class="userActivityDescWrap col-9" id="userActivityDescWrap${actI}">

                                        </div>
                                    </div>
                                `)
								
								activity.data.forEach((val) => {
									const { activityDate, activityType, activityId, userActivity, userActivityDesc, userId } = val;
									const { hour, minutes, ampm } = activityDate;

									let message = "";

									if(activityType == "updateProfile"){
										switch(userActivity){
											case "lastName":
												message = `
													Changed Last Name to <span class="userActivityHighlight">${userActivityDesc}</span>
												` ;
												break;
											case "firstName":
												message = `
													Changed First Name to <span class="userActivityHighlight">${userActivityDesc}</span>
												` ;
												break;
											case "profilePicture":
												message = `<span class="userChangedProfilePic">Changed profile picture.</span>`
												break;
											default:
												message = 'Updated Profile';
												break;
										}
									}else if(activityType == "changePassword"){
										message = "Changed password.";
									}else if(activityType == "receiveUpdate"){
										message = `Changed receiving updates. User now be receiving updates via <span class="activityHighlight">${userActivity}</span>.`
									}else if(activityType == "subscriptionStatus"){
										if(userActivityDesc == "userUnsubscribed"){
											message = `<span class="userUnsub">User unsubscribed to our service</span>`;
										}else{
											message = `<span class="userUnsub">Admin unsubscribed user to our service</span>`;
										}
										
									}

									$(`#userActivityDescWrap${actI}`).append(`
										<div class="userActivityDesc">
											<span class="userActivityTime">
												${hour}:${minutes} ${ampm}
											</span>
											<p>${message}</p>
										</div>
									`)
								})
							})
							

							
                            
                            // hide userDetails ul
                            $(currentElem).parent().prev().children('ul').fadeOut(200, "swing", function(){
                                // show history
                                $('.userActivityHistory').fadeIn(200, "swing", function(){
                                    // $(currentElem).parent().parent().parent().animate({height: `${(heightOfHistory + heightOfCTAContainer) + 20}px`}, 200, "swing")
									// set height of userAccountDetails
                                    $(currentElem).parent().parent().parent().animate({height: "91vh"}, 200, "swing", function(){
                                        // get the new height of userAccountDetails
                                        const newHeightOfUserAccountDetails = $(currentElem).parent().parent().parent().outerHeight();
                                        // get height of userCtaBtnsContainer
                                        const heightOfCTAContainer = $(currentElem).outerHeight();
                                        // set height of userActivityHistory
                                        // $('.userActivityHistory').css({height: `${newHeightOfUserAccountDetails - (heightOfCTAContainer + 30)}px`})
										
										if($('.userActivityHistory').outerHeight() < newHeightOfUserAccountDetails){
											// if userActivityHistory height is less than 91vh
											// set userAccountDetails height to 100%
											$(currentElem).parent().parent().parent().css({height: "100%"});
											// set userActivityHistory height to the height itself
											$('.userActivityHistory').css({height: `${$('.userActivityHistory').outerHeight()}px`})
										}else{
											// set userActivityHistory height to 91vh minus the height of the ctaContainer and minus 30
											$('.userActivityHistory').css({height: `${newHeightOfUserAccountDetails - (heightOfCTAContainer + 30)}px`})
										}

                                        let isDown = false;
                                        let startY;
                                        let scrollTop;
                                        // userActivityHistory mouse events
                                        $('.userActivityHistory').on('mousedown', function(e){
                                            isDown = true;
                                            startY = e.pageY - $(this).offset().top;
                                            scrollTop = $(this).scrollTop();
                                            $(this).css({cursor:"grabbing"})
                                        }).on('mousemove', function(e){
                                            if(!isDown) return;
                                            const y = e.pageY - $(this).offset().top;
                                            const walk = (y - startY);
                                            $(this).scrollTop(scrollTop - walk).css({cursor:"grabbing"});
                                        }).on('mouseup', function(){
                                            isDown = false;
                                            $(this).css({cursor:"grab"})
                                        }).on('mouseleave', function(){
                                            isDown = false;
                                            $(this).css({cursor:"grab"})
                                        })

                                        // userActivityHistory touch events
                                        $('.userActivityHistory').on('touchstart', function(e){
                                            isDown = true;
                                            startY = e.pageY - $(this).offset().top;
                                            scrollTop = $(this).scrollTop();
                                            $(this).css({cursor:"grabbing"})
                                        }).on('touchmove', function(e){
                                            if(!isDown) return;
                                            const y = e.pageY - $(this).offset().top;
                                            const walk = (y - startY);
                                            $(this).scrollTop(scrollTop - walk).css({cursor:"grabbing"});
                                        }).on('touchend', function(){
                                            isDown = false;
                                            $(this).css({cursor:"grab"})
                                        }).on('touchcancel', function(){
                                            isDown = false;
                                            $(this).css({cursor:"grab"})
                                        })
                                    });
                                    // get the offset top of userContainer
                                    const userContainerOffset = $(currentElem).parents('.userContainer').offset().top;
                                    // add scroll animation to windows
                                    $('html').animate({scrollTop: userContainerOffset - 10}, 200, "swing");
                                })
                            })
                        }
                    }
                },
                error:(err) => console.log(err)
            })
		}

		searchMobileNumber(mobileNum){
			// new form
			const dataForm = new FormData();
			// ajax req
			$.ajax({
				type:'POST',
				url:"../../backend/searchMobileNumber.php",
				data:dataForm,
				dataType: "json",
				contentType:false,
				processData:false,
				beforeSend: function(){
					// form validation
					if($('#userSearchInput').val() === ""){
						// remove error notif if it is existing
						if($('#searchUserForm').children('small') != undefined){
							$('#searchUserForm small').remove();
						}
						// show erorr notif
						$('#searchUserForm').append(`
							<small class="formHint errorHint">Mobile Number is required!</small>
						`)
						
						$('.errorHint').fadeIn(500).css({display:"block"});
						
						return false;
					}else if(isNaN($('#userSearchInput').val())){
						// remove error notif if it is existing
						if($('#searchUserForm').children('small') != undefined){
							$('#searchUserForm small').remove();
						}
						// show erorr notif
						$('#searchUserForm').append(`
							<small class="formHint errorHint">Mobile Number is required!</small>
						`)
						
						$('.errorHint').fadeIn(500).css({display:"block"});
						
						return false;
					}else{
						// remove error notif if it is existing
						if($('#searchUserForm').children('small') != undefined){
							$('#searchUserForm small').remove();
						}
						// append new data to the new form
						dataForm.append("mobileNumber", mobileNum);
					}
				},
				success:function(data, textStatus, xhr){
					if(xhr.status == 200){
						if(data.hasOwnProperty('result')){
							// no search result
							$('#usersList').html(`<p><span>${mobileNum}</span> did not match any registered numbers</p>`)
						}else{
							// append the user
							$('#usersList').html(`
								<div class="userContainer container">
									<input type="hidden" value="${data[0].userId}" />
									<div class="user row no-gutters align-items-center">
										<div class="userProPic col-2">
											<img src="${(data[0].profilePicture != "")? "../../uploads/avatars/"+data[0].profilePicture : "../../assets/userThumb.png"}" />
										</div>
										<div class="userNumberName col-8">
											<span class="userFullname">${data[0].firstName} ${data[0].lastName}</span>
											<span class="userNumber">(+673) ${data[0].mobileNumber}</span>
										</div>
										<div class="userSubStatus col-1">
											<span>${(data[0].subscriptionStatus == "" || data[0].subscriptionStatus == "unsubscribed") ? '<i class="fas fa-user-times userUnsub"></i>' : '<i class="fas fa-user-check userSub"></i>'}</span>
										</div>
										<div class="userChevronRight col-1">
											<i class="fas fa-chevron-right arrowDetails"></i>
										</div>
									</div>
									<div class="userAccountDetails">
										<div class="userDetailsContainer">
											<div class="userDetails">
												<ul>
													<li>Account ID: <span>${data[0].accountId}</span></li>
													<li>Account Name: <span>${data[0].firstName} ${data[0].lastName}</span></li>
													<li>Mobile Number: <span>${data[0].mobileNumber}</span></li>
													<li>Email Address: <span>${data[0].email}</span></li>
													<li>Recent Activity: <span>${(data[0].latestActivityDate != "") ? data[0].latestActivityDate : "No Recent Activity"}</span></li>
													<li class="receiveUpdate"><span>*Receiving updates via ${data[0].receiveUpdate}</span></li>
												</ul>
											</div>
											<div class="userCtaBtnsContainer">
												<button type="button" class="btnRedGradient userCtaBtn userDeleteBtn">
													Delete
												</button>
												<button type="button" class="btnRedGradient userCtaBtn userUnsubscribeBtn">
													Unsubscribe
												</button>
												<button type="button" class="btnGreenGradient userCtaBtn userActivitiesBtn">
													Activities
												</button>
											</div>
										</div>
									</div>
								</div>
							`)	

							const userDetails = new UserDetails;
							// return value of get height and set height
							const userDetailsHeight = userDetails.setHeightUserDetailsToZero();
							let toggleUserDetails = "close";
							// add click event to the search result
							$('.user').on('click', function(){
								if(toggleUserDetails == "close"){
									// show details
									userDetails.showUserDetails(userDetailsHeight, this);
									toggleUserDetails = "open";
								}else{
									// hide details
									userDetails.hideUserDetails(this);
									toggleUserDetails = "close";
								}
							})
							// show history
							$('.userActivitiesBtn').on('click', function(){
                                const userId = $(this).parents('.userAccountDetails').siblings('input').val();
                                userDetails.viewActivities(userId, this);
                            })
							
							//unsubscribe user
							$('.userUnsubscribeBtn').on('click', function(){
								const userId = $(this).parents('.userAccountDetails').siblings('input').val();
								
								userDetails.unsubscribeUser(userId, this);
							})
							
							//delete user
							$('.userDeleteBtn').on('click', function(){
								const userId = $(this).parents('.userAccountDetails').siblings('input').val();
								
								const resetToggleClose = () => toggleUserDetails = "close";
								
								userDetails.deleteUser(userId, this, resetToggleClose);
							})
						}
					}
				},
				error:(err) => console.log(err)
			})
		}
		
		setHeightUserDetailsToZero(){
		// get height and set height of account details then return all heights
			const heightArr = [];
			$.each($('.userAccountDetails'), function(key, elem){
				// get the initial height
				heightArr.push($(elem).outerHeight());
				// set all element height to zero
				$(elem).css({height:"0"});
			})
			
			return heightArr;
		}
		
		showUserDetails(userDetailsHeight, user){	
		// show user details and add data attribute
			// get the index of user container
			const indParent = $(user).parent().index();
			// add animation and data attribute to the account details container
			$(user).next()
				.attr('data-user-details', "active")
				.css({display:"block"})
				.animate({height: `${userDetailsHeight[indParent]}px`, opacity:1}, 200, "swing")
			// user container set border radius and border style
			$(user).css({borderRadius:"5px 5px 0 0", borderBottom: "none"});
			// arrow icon animate rotation
			$(user).find('.arrowDetails').css({transform: "rotate(90deg)"});
		}
		
		hideUserDetails(user){
		// hide user details and remove data attribute
			// add animation and remove data attribute of the account details container
			$(user).next().animate({height: "0", opacity:0}, 200, "swing", function(){
				// account details container
				$(user).next().css({display:"none"});
				// user container set border radius and border style
                $(user).css({borderRadius:"5px", border: "1px solid #E0E0E0"});
            
                if($('.userActivityHistory').length > 0 ){
                    // if the userActivityHistory exists
                    // show userDetails ul
                    $('.userActivityHistory').prev().css({display: "block"});
                    // hide userActivityHistory
                    $('.userActivityHistory').remove();
                }
			}).removeAttr('data-user-details');
			// arrow back to normal
			$(user).find('.arrowDetails').css({transform: "rotate(0deg)"});
		}
	}

    class AdminAccountMenu{
        logout(){
            $('#adminLogoutBtn').on('click', function(e){
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

        adminMenu(){
            $('.adminAcctBtn').on('click', function(){
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
                    success: function(html){
                        $('.adminMenuWrapper').animate({right: "100%"});
                        // add html elements
                        $('.adminProfileWrapper').append(html);
                        // insert the content of the selected menu
                        $('.menuAdminProfileDivs').animate({left:"0"}, function(){
                            // remove the href attribute of back btn then add event
                            $('#adminProfileBackBtn').removeAttr("href").on('click', function(){
                                // remove current page then show the menu
                                $('.adminMenuWrapper').animate({right:0});
                                $('.menuAdminProfileDivs').animate({left: "100%"}, function(){
                                    $('.adminProfileWrapper').children('.menuAdminProfileDivs').remove();
                                    // add href attribb to the button
                                    $('#adminProfileBackBtn').attr("href", "../../index.php");
                                })
                            })
                        })

                        if(spanValue === "manageUsers"){
                            const userDetails = new UserDetails;
                            // return value of get height and set height
                            const userDetailsHeight = userDetails.setHeightUserDetailsToZero();
                            let toggleUserDetails = "close";
                            // user container click event
                            $('.user').on('click', function(){
                                if(toggleUserDetails == "close"){
                                    // show details
                                    userDetails.showUserDetails(userDetailsHeight, this);
                                    toggleUserDetails = "open";
                                }else{
                                    if($(this).next().attr('data-user-details') === "active"){
                                        // check the current user has the attribute user details
                                        // if admin click to the currently opened user then close
                                        userDetails.hideUserDetails(this);
                                        toggleUserDetails = "close";
                                    }else{
                                        // if admin click a new user but there is a user that is currently opened
                                        // hide the currently opened user then show the new user details
                                        
                                        // reference to the new user
                                        const user = this;
                                    
                                        $.each($('.userAccountDetails'), function(key, elem){
                                            // loop and find the user that has attribute of user details then hide it
                                            if($(elem).attr('data-user-details') === "active"){
                                                $(elem)
                                                    .animate({height: "0", opacity:0}, function(){
                                                        $(elem).css({display:"none"});

                                                        $(elem).prev().css({borderRadius:"5px", border: "1px solid #E0E0E0"});
                                                        
                                                        // show the new user after the animation, change toggle status
                                                        userDetails.showUserDetails(userDetailsHeight, user);
                                                        toggleUserDetails = "open";
                                                    })
                                                    .removeAttr('data-user-details');
                                            }
                                        })
                                    }
                                }
                            })
							// show history
                            $('.userActivitiesBtn').on('click', function(){
                                const userId = $(this).parents('.userAccountDetails').siblings('input').val();
                                
                                userDetails.viewActivities(userId, this);
                            })
							//unsubscribe user
							$('.userUnsubscribeBtn').on('click', function(){
								const userId = $(this).parents('.userAccountDetails').siblings('input').val();
								
								userDetails.unsubscribeUser(userId, this);
							})
							//delete user
							$('.userDeleteBtn').on('click', function(){
								const userId = $(this).parents('.userAccountDetails').siblings('input').val();
								// callback function
								const resetToggleClose = () => toggleUserDetails = "close";
								
								userDetails.deleteUser(userId, this, resetToggleClose);
								
								// if(result === "success"){
									// toggleUserDetails = "close";
								// }
							})
                            // search form submit
                            $('#searchUserForm').on('submit', function(e){
                                e.preventDefault();
                                const mobileNum = $('#userSearchInput').val();
                                userDetails.searchMobileNumber(mobileNum);
                            })
                            // search icon click event
                            $('#userSearchBtn').on('click', function(){
                                const mobileNum = $('#userSearchInput').val();
                                userDetails.searchMobileNumber(mobileNum);
                            })
                        }
                        
                    },
                    error:(err) => console.log(err)
                })
            })
        }
    }

    const adminAccountMenu = new AdminAccountMenu;
    adminAccountMenu.logout();
    adminAccountMenu.adminMenu();
})