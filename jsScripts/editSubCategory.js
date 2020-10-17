$('document').ready(function(){
    class Notification{
		// prompt if there is error in the input fields
		static domValidate(elem, hint, errorsArr, whichField){
            $(elem).next().remove();
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);

            $(`${elem} ~ .errorHint`).fadeIn(500);
            errorsArr.push(whichField);
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
			this.mainCatInitial = $('#selectMainCat').val()
			this.subCatInitial = $('#subCategoryName').val()
			this.subCatId = $('#subCategoryId').val();
		}
		
		checkErrors(){
			let errors = [];
			
			if($('#subCategoryName').val() === "" || $('#subCategoryName').val() === null){
				// empty input
				Notification.domValidate('#subCategoryName', "Sub Category Name is required", errors, "subCategoryName");
			}else{
				// remove error hint if input not empty
				$('#subCategoryName').next().remove();
			}
			
			if($('#selectMainCat').val() === "" || $('#selectMainCat').val() === null){
				// empty input
				Notification.domValidate('.customSelectOptions', "Main Category is required", errors, "selectMainCat");
			}else{
				// remove error hint if input not empty
				$('.customSelectOptions').next().remove();
			}
			
			return errors;
		}
		
		checkInitialValues(data){
			let errors = [];
			
			if(this.mainCatInitial === $('#selectMainCat').val()){
				if($('#subCategoryName').val() != this.subCatInitial){
					errors = []
				}else{
					errors.push('mainCatInitial')
				}
			}else{
				data.append('categoryName', $('#selectMainCat').val());
				errors = [];
			}
			
			if(this.subCatInitial === $('#subCategoryName').val()){
				if($('#selectMainCat').val() != this.mainCatInitial){
					errors = []
				}else{
					errors.push('subCatInitial')
				}
			}else{
				data.append('subCategoryName', $('#subCategoryName').val());
				errors = [];
			}
			
			return errors;
		}
		
		submitForm(){
			const data = new FormData;
			
			data.append('subCatId', this.subCatId);
			data.append('subCatInitialName', this.subCatInitial);
			data.append('catInitialName', this.mainCatInitial)
			
			const valInitials = this.checkInitialValues(data);
			
			$.ajax({
				type:'POST',
				url:'../../../backend/editSubCategoryFn.php',
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
						$('.editSubCatContainer').prepend(`
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
						if(data[0].hasOwnProperty('error')){
							$('.saveLoader').remove();
							// remove the notification after timeout
							setTimeout(function(){
								$('.notification').fadeOut(400, "swing", function(){
									$('.editSubCatContainer').children(".notification").remove();
								})
								$('.notif-container').css("transform", "scale(0)");
							}, 1000)
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
							
							$('.notif-container').append(`<i class="fas fa-exclamation-triangle deactivateDeleteSuccess"></i>`);
							$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
							$('.notif-container p').text("Something went wrong please try again.");
						}else{
							$('.saveLoader').remove();
							$('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
							$('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
							$('.notif-container p').text("Sub Category succesfully updated.");
							// remove the notification after timeout
							setTimeout(function(){
								$('.notification').fadeOut(400, "swing", function(){
									$('.editSubCatContainer').children(".notification").remove();
								})
								$('.notif-container').css("transform", "scale(0)");
							}, 1000)
							
							// scroll back to top
							$('html').animate({scrollTop: 0}, 200, "swing");
							
							// reassign initial values
							this.mainCatInitial = $('#selectMainCat').val()
							this.subCatInitial = $('#subCategoryName').val()
						}
					}
				}
			})
		}
		
		event(){
			$('#editSubCategoryBtn').on('click', () => {
				const inputErrors = this.checkErrors();
				
				if(inputErrors.length > 0){
					return;
				}else{
					this.submitForm();
				}
			})
		}
	}
	
    const customSelectMenu = new CustomSelectMenu;
	const validateForm =  new ValidateForm;
	
	validateForm.event();
    customSelectMenu.loadCustomSelectMenu();
    customSelectMenu.events();
})