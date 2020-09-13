$('document').ready(function(){
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
        static domValidateAjax(elem, hint, whichField){
			$(elem).next().remove();
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
            $(`${elem} ~ .errorHint`).fadeIn(500);
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
		checkErrors(){
			let errors = [];
			
			if($('#subCategoryName').val() === "" || $('#subCategoryName').val() === null){
				// input empty
				Notification.domValidate('#subCategoryName', "Sub Category Name is required", errors, "subCategoryName");
            }else{
                $('#subCategoryName').next().remove();
            }
        
            if($('#selectMainCat').val() === "" || $('#selectMainCat').val() === null){
                Notification.domValidate('.customSelectOptions', "Main Category is required", errors, "selectMainCat");
            }else{
                $('.customSelectOptions').next().remove();
            }
			
			return errors;
        }
        
        submitForm(dataForm){
            $.ajax({
                type:'POST',
                url:'../../../backend/addSubCategoryFn.php',
                data:dataForm,
                dataType: 'json',
                contentType:false,
                processData:false,
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200){
                        if(data.hasOwnProperty('error')){
							if(data.error == "subCatExists"){
								Notification.domValidateAjax('#subCategoryName', "Sub Category Name already exists", "subCategoryName");
							}else if(data.error == "catId"){
								Notification.domValidateAjax('#subCategoryName', "Something went wrong, please try again", "subCategoryName");
							}
						}else if(data.hasOwnProperty('success')){
							const notifContent = `
								<p id="subCatAddedNotif">Sub Category Added</p>
                                <button type="button" class="btnGray5 globalBtn" id="subCatAddedNotifCloseBtn">CLOSE</button>
							`;
							
							Notification.domNotificationSuccess('.addSubCatContainer', notifContent, '#subCatAddedNotifCloseBtn');
							
							$.each($('.customSelectMenu').children(), function(i, opt){
                                $(opt).attr('selected', false)
                            })
							
							$.each($('.customOption'), function(i, opt){
                                $(opt).removeClass('customOptionSelected').find('i').remove();
                            })
							
							$('#subCategoryName').val("")
							
							$('.currentSelected').text("Select Main Category");
						}
                    }
                },
                error:(err) => console.log(err)
            })
        }
		
		events(){
			$('#addSubCategoryBtn').on('click', () => {
				
                const inputErrors = this.checkErrors();
                
                if(inputErrors.length > 0){
					// if both arrays is not empty then dont submit form
                    return;
                }else{
					// submit form if there is no errors
                    const dataForm = new FormData($('#subCategoryForm')[0]);
                    // console.log(...dataForm);
                    this.submitForm(dataForm)
                }
                
			})
		}
	}
	
	const customSelectMenu = new CustomSelectMenu;
	const validateForm = new ValidateForm;

    customSelectMenu.loadCustomSelectMenu();
    customSelectMenu.events();
	validateForm.events();

})