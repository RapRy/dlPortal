$('document').ready(function(){
	class Notification {
        // prompt if ajax request is success
        static domNotificationSuccess(elem1, notifContent, elem2){
			// append to the parent
            $(elem1).html(`${notifContent}`);
		
            $(elem2).on('click', () => {
                $('.notification').fadeOut(400, "swing", () => {
                    $('.notification').css("display", "none");
                   $(elem1).children(`${elem1} > :first-child`).remove();
                })
                $('.notif-container').css("transform", "scale(0)");
            })
			
			// $('html').animate({scrollTop: 0}, 200, "swing");
        }
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
        // prompt if ajax request return an error
        static domValidateAjax(elem, hint, whichField){
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
		// check the width and height of the icon returns a promise
        checkImageDimension(resolve){
            let errors = []
            if($('#customFileIcon').val() === "" || $('#customFileIcon').val() === null){
				// empty input return 0
                resolve(errors);
            }else if($('#customFileIcon')[0].files[0].type != "image/png"){
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
            }else{
				// other error return 0
                resolve(errors);
            }
        }

		checkErrors(){
			let errors = [];
			
			if($('#categoryName').val() === "" || $('#categoryName').val() === null){
				// input empty
				Notification.domValidate('#categoryName', "Category Name is required", errors, "categoryName");
            }else{
                $('#categoryName').next().remove();
            }
        
            if($('#customFileIcon').val() === "" || $('#customFileIcon').val() === null){
                Notification.domValidate('#customFileIcon', "Category Icon is required", errors, "categoryIcon");
            }else{
                const imgExt = $('#customFileIcon')[0].files[0].name.toLowerCase().split(".");

                if(imgExt[1] != "png" || $('#customFileIcon')[0].files[0].type != "image/png"){
					// if file type is not png
                    Notification.domValidate('#customFileIcon', "Category Icon must be png file extension", errors, "categoryIcon");
                }else{
                    $('#customFileIcon').next().next().remove();
                    $('#customFileIcon').parent().css({marginBottom: "35px"})
                }
            }

            if($('#selectFileExt').val() === "" || $('#selectFileExt').val() === null){
                Notification.domValidate('.customSelectOptions', "File extension is required", errors, "selectFileExt");
            }else{
                $('.customSelectOptions').next().remove();
            }
			
			return errors;
        }
        
        submitForm(dataForm){
            $.ajax({
                type:'POST',
                url:'../../../backend/addMainCategoryFn.php',
                data:dataForm,
                dataType: 'json',
                contentType:false,
                processData:false,
                beforeSend: () => {
                    // show loader
                    $('.addMainCatContainer').prepend(`
                        <section class="notification">
                            <div class="notif-container">
                                <p>Adding Main Category..</p>
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
                        if(data.hasOwnProperty('error')){
                            // remove loader
                            $('.notification').remove()

							if(data.error == "icon"){
								// show error if there is other problem on the image icon
								Notification.domValidateAjax('#customFileIcon', "Something went wrong, please try a different icon", "categoryIcon");
							}else{
								Notification.domValidateAjax('#categoryName', "Category name already exist, try a different name", "categoryName");
							}
                        }else if(data.hasOwnProperty('result')){
                            // show notification success
                            const notifContent = `
                                <p id="catAddedNotif">Category Added</p>
                                <button type="button" class="btnGray5 globalBtn" id="catAddedNotifCloseBtn">CLOSE</button>
                            `
                            Notification.domNotificationSuccess('.notif-container', notifContent, '#catAddedNotifCloseBtn');
							// remove selected attrib on the original option
                            $.each($('.customSelectMenu').children(), function(i, opt){
                                $(opt).attr('selected', false)
                            })
							// remove check and class on the custom option
                            $.each($('.customOption'), function(i, opt){
                                $(opt).removeClass('customOptionSelected').find('i').remove();
                            })
							
							// set empty values
                            $('#customFileIcon').val("");
                            $('#categoryName').val("");
							
							// set to default text
                            $('.currentSelected').text("Select file extension");
                            $('#customFileLabel').text("Only png are allowed.(Dimension 25x25px");

                        }
                    }
                },
                error:(err) => console.log(err)
            })
        }
		
		events(){
			$('#addCategoryBtn').on('click', async () => {
				
                const inputErrors = this.checkErrors();
                const iconError = new Promise((resolve) => this.checkImageDimension(resolve));

                const result = await iconError
                
                if(inputErrors.length > 0 || result.length > 0){
					// if both arrays is not empty then dont submit form
                    return;
                }else{
					// submit form if there is no errors
                    const dataForm = new FormData($('#categoryForm')[0]);
                    // console.log(...dataForm);
                    this.submitForm(dataForm)
                }
                
			})
		}
	}
	
	const customSelectMenu = new CustomSelectMenu;
    const customFile = new CustomFile;
	const validateForm = new ValidateForm;

    customFile.getFileValue();

    customSelectMenu.loadCustomSelectMenu();
    customSelectMenu.events();
	validateForm.events();

})