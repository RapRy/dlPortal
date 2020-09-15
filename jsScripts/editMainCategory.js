$('document').ready(function(){
	class Notification{
		// prompt if there is error in the input fields
		static domValidate(elem, hint, errorsArr, whichField){
			if(whichField === "categoryIcon"){
                $(elem).next().next().remove();
            }else{
                $(elem).next().remove();
            }
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);

            if(whichField === "categoryIcon"){
                $(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
                $(elem).parent().css({marginBottom: "55px"})
            }
            $(`${elem} ~ .errorHint`).fadeIn(500);
            errorsArr.push(whichField);
		}
	}
	
	class CustomFile{
        getFileValue(){
			// set name of the file onchange event
            $('#customFileIcon').on('change', (e) => $(e.target).next().text(e.target.files[0].name))
        }
    }
	
	class CustomSelectMenu{
        constructor(){
			// get options
            this.selectOptions = $('.customSelectMenu').children();
			// container for the height value of select
            this.heightSelectMenu = null;
        }

        loadCustomSelectMenu(){
			// add new div element
            $('.customSelectWrapper').append(`<div class="customSelectOptions"></div>`);
		
			
            $.each(this.selectOptions, function(i, opt){
				// get the text of the options then assign it to the new span element
                $('.customSelectOptions').append(`<span class="customOption">${$(opt).text()}</span>`)
				
				//check for selected attribute
				if($(opt).attr("selected") != undefined){
					$($('.customOption')[i]).addClass('customOptionSelected').append(`<i class="fas fa-check"></i>`);
				}
            })
			// hide select file extension text
            $('.customOption:first').css({display: "none"});
			// get height of customSelectOptions container then assign it to heightSelectMenu, we will use this for the dropdown animation of the custom select menu
            this.heightSelectMenu = $('.customSelectOptions').height();
			// set customSelectOptions height to 0 after getting initial height 
            $('.customSelectOptions').css({height: 0});
        }

        showCustomSelectMenu(heightSelect, currentElem){
			// show dropdown
            const borderStyle = "1px solid #207CE8";
            // add css styling then set and animate height of customSelectOptions
            $('.customSelectOptions').css({
                borderLeft: borderStyle,
                borderRight: borderStyle,
                borderBottom: borderStyle
            }).animate({height: `${heightSelect}px`}, 200, "swing");
			
			// change css style of the customSelectContainer
            $(currentElem).css({
                borderRadius: ".25rem .25rem 0 0",
                borderLeft: borderStyle,
                borderRight: borderStyle,
                borderTop: borderStyle,
                borderBottom: "1px solid #E0E0E0"
            })
        }

        hideCustomSelectMenu(currentElem){
			// hide dropdown
            const borderStyle = "1px solid #207CE8";
			// return styles to initial styles
            $('.customSelectOptions').animate({height: 0}, 200, "swing", function(){
                $(this).css({border: "none"})
                $(currentElem).css({border: borderStyle, borderRadius: ".25rem"});
            });
        }

        selectCustomOption(currentElem, selectMenuChildren){
			// get the index of the clicked option
            const ind = $(currentElem).index();
			// remove class and check mark of all the options
            $.each($('.customOption'), function(i, opt){
                $(opt).removeClass('customOptionSelected').find('i').remove();
            })
			// assign class and check mark to the clicked option
            $(currentElem).addClass('customOptionSelected').append(`<i class="fas fa-check"></i>`);
			// remove selected attribute to all the original option
            $.each(selectMenuChildren, function(i, opt){
                $(opt).attr('selected', false)
            })
			// add selected attribute to the original option based from the index of the clicked custom option
            $(selectMenuChildren[ind]).attr('selected', true)
			// get the text of the clicked custom option then assig it to the currentSelected
            $('.currentSelected').text($(currentElem).text());
			// hide dropdown
            this.hideCustomSelectMenu('.customSelectContainer')
        }

        events(){
            $('.customSelectContainer').on('click', (e) => {
				// get height of customSlectOptions afte we set the height to 0
				// we use this as toggle between showing and hiding the dropdown
                const selectMenuHeight = $('.customSelectOptions').height();
                if(selectMenuHeight == 0){
					// show dropdown
                    this.showCustomSelectMenu(this.heightSelectMenu, e.currentTarget)
                }else{
					// hide dropdown
                    this.hideCustomSelectMenu(e.currentTarget);
                }
            });

            if($('.customOption').length > 0){
				// check if the custom options already loaded
				// add click event to each custom option
                $('.customOption').on('click', (e) => {
					// assign value to the original select menu
                    this.selectCustomOption(e.currentTarget, this.selectOptions);
                })
            }
        }
    }
	
	class ValidateForm{
		constructor(){
			this.catNameInitial = $('#categoryName').val()
			this.catIconInitial = $('#customFileLabel').text()
			this.contentFileExtInitial = $('#selectFileExt').val()
			this.catId = $('#categoryId').val()
		}
		
		// check the width and height of the icon returns a promise
        checkImageDimension(resolve){
            let errors = []
            if($('#customFileLabel').text() === "" || $('#customFileLabel').text() === null){
				// empty input return 0
                resolve(errors);
            }else if($('#customFileIcon')[0].files.length > 0){
				if($('#customFileIcon')[0].files[0].type != "image/png"){
					// file type is not png return 0
					resolve(errors);
				}else if($('#customFileIcon').val() != "" || $('#customFileIcon').val() != null){
					// input not empty
					const rd = new FileReader();
					// read the file ad based64 or blob
					rd.readAsDataURL($('#customFileIcon')[0].files[0]);
					rd.onload = function(e){
						// create image tag
						const img = new Image();
						// add blob file as src attribute of the image 
						img.src = e.target.result;
						img.onload = function(){
							if((this.height > 25 && this.width > 25) || (this.height < 25 && this.width < 25)){
								// check image if height and width is not equal to 25px
								Notification.domValidate('#customFileIcon', "Category icon dimension must be 25x25px", errors, "categoryIcon");
								// return the error or return 1
								resolve(errors);
							}else{
								// if image height and width is equal 25px
								// remove the error notif if there is any then return 0
								$('#customFileIcon').next().next().remove();
								$('#customFileIcon').parent().css({marginBottom: "35px"})
								resolve(errors);
							}
						}
					}
				}
            }else{
				// other error return 0
                resolve(errors);
            }
        }
		
		checkErrors(){
			let errors = [];
			
			if($('#categoryName').val() === "" || $('#categoryName').val() === null){
				// empty input
				Notification.domValidate('#categoryName', "Category Name is required", errors, "categoryName");
			}else{
				// remove error hint if input not empty
				$('#categoryName').next().remove();
			}
			
			if($('#customFileLabel').text() === "" || $('#customFileLabel').text() === null){
				// empty input
                Notification.domValidate('#customFileIcon', "Category Icon is required", errors, "categoryIcon");
				console.log($('#customFileIcon').val())
            }else if($('#customFileIcon')[0].files.length > 0){
				// if input is not empty
                const imgExt = $('#customFileIcon')[0].files[0].name.toLowerCase().split(".");

                if(imgExt[1] != "png" || $('#customFileIcon')[0].files[0].type != "image/png"){
					// if file type is not png
                    Notification.domValidate('#customFileIcon', "Category Icon must be png file extension", errors, "categoryIcon");
                }else{
					// remove error hint if input not empty
                    $('#customFileIcon').next().next().remove();
                    $('#customFileIcon').parent().css({marginBottom: "35px"})
                }
            }
			
			if($('#selectFileExt').val() === "" || $('#selectFileExt').val() === null){
				// empty input
				Notification.domValidate('.customSelectOptions', "File extension is required", errors, "selectFileExt");
			}else{
				// remove error hint if input not empty
				$('.customSelectOptions').next().remove();
			}
			
			return errors;
		}
		
		checkInitialValues(data){
			let errors = [];
			
			if(this.catNameInitial === $('#categoryName').val()){
				// no change on the input field
				if($('#customFileLabel').text() != this.catIconInitial || $('#selectFileExt').val() != this.contentFileExtInitial){
					// if other input fields values changed
					errors = [];
				}else{
					// add error
					errors.push('categoryName');
				}
			}else{
				// append input value if input field value is changed
				data.append('categoryName', $('#categoryName').val())
				// append initial value for renaming the folder
				data.append('initialCategoryName', this.catNameInitial);
				errors = [];
			}
			
			if($('#customFileLabel').text() === this.catIconInitial){
				// no change on the input field
				if(this.catNameInitial != $('#categoryName').val() || $('#selectFileExt').val() != this.contentFileExtInitial){
					// if other input fields values changed
					errors = [];
				}else{
					// add error
					errors.push('categoryIcon');
				}
			}else{
				// append input value if input field value is changed
				data.append('iconCategoryName', $('#categoryName').val())
				// append initial value for renaming the folder
				data.append('iconInitialCategoryName', this.catNameInitial);
				data.append('categoryIcon', $('#customFileIcon')[0].files[0]);
				errors = [];
			}
			
			if($('#selectFileExt').val() === this.contentFileExtInitial){
				// no change on the input field
				if(this.catNameInitial != $('#categoryName').val() || $('#customFileLabel').text() != this.catIconInitial){
					// if other input fields values changed
					errors = [];
				}else{
					// add error
					errors.push('categoryFileExt');
				}
			}else{
				// append input value if input field value is changed
				data.append('categoryFileExt', $('#selectFileExt').val())
				errors = [];
			}
			
			return errors;
		}
		
		submitForm(){
			const data = new FormData;
			// append id reference for the category
			data.append('categoryId', this.catId);
			// returns error if there is any
			const valInitials = this.checkInitialValues(data);
			
			$.ajax({
				type:'POST',
				url:'../../../backend/editMainCategoryFn.php',
				data: data,
				dataType: 'json',
				contentType: false,
				processData: false,
				beforeSend: () => {
					if(valInitials.length > 0){
						// dont submit form is there is any error
						return false;
					}else{
						// show save loader
						$('.editMainCatContainer').prepend(`
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
				success: function(data, textStatus, xhr){
					if(xhr.status == 200){
						if(data.length > 0){
							// const getDate = data.split(':');
							
							if(data.hasOwnProperty('error')){
								$('.saveLoader').remove();
								// remove the notification after timeout
								setTimeout(function(){
									$('.notification').fadeOut(400, "swing", function(){
										$('.editMainCatContainer').children(".notification").remove();
									})
									$('.notif-container').css("transform", "scale(0)");
								}, 1000)
								
								// scroll back to top
								$('html').animate({scrollTop: 0}, 200, "swing");
								
								if(data.error == "icon"){
									$('.notif-container').append(`<i class="fas fa-exclamation-triangle deactivateDeleteSuccess"></i>`);
									$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
									$('.notif-container p').text("Try a different icon.");
								}else if(data.error == "rename"){
									$('.notif-container').append(`<i class="fas fa-exclamation-triangle deactivateDeleteSuccess"></i>`);
									$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
									$('.notif-container p').text("Try a different category name.");
								}else if(data.error == "checkpath"){
									$('.notif-container').append(`<i class="fas fa-exclamation-triangle deactivateDeleteSuccess"></i>`);
									$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
									$('.notif-container p').text("Something went wrong please try again.");
								}
								
							}else{
								$('.saveLoader').remove();
								$('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
								$('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
								$('.notif-container p').text("Category succesfully updated.");
								// remove the notification after timeout
								setTimeout(function(){
									$('.notification').fadeOut(400, "swing", function(){
										$('.editMainCatContainer').children(".notification").remove();
									})
									$('.notif-container').css("transform", "scale(0)");
								}, 1000)
								
								// scroll back to top
								$('html').animate({scrollTop: 0}, 200, "swing");
							}
						}
					}
				},
				error: (err) => console.log(err)
			})
		}
		
		events(){
			$('#editCategoryBtn').on('click', async () => {
				const inputErrors = this.checkErrors();
				const iconError = new Promise((resolve) => this.checkImageDimension(resolve));
				
				const result = await iconError
				
				if(inputErrors.length > 0 || result.length > 0){
					// don't submit form is there is any errors
					return;
				}else{
					this.submitForm();
				}
			})
		}
	}
	
	const customSelectMenu = new CustomSelectMenu;
	const validateForm = new ValidateForm;
	const customFile = new CustomFile;
	
	customFile.getFileValue();
	validateForm.events();
	

    customSelectMenu.loadCustomSelectMenu();
    customSelectMenu.events();
})