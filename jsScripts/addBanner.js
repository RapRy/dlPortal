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
            if(whichField === "bannerImg"){
                $(elem).next().next().remove();
            }else{
                $(elem).next().remove();
            }
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);

            if(whichField === "bannerImg"){
                $(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
                $(elem).parent().css({marginBottom: "55px"})
            }

            $(`${elem} ~ .errorHint`).fadeIn(500);
            errorsArr.push(whichField);
        }
        // prompt if ajax request return an error
        static domValidateAjax(elem, hint, whichField){
			if(whichField === "bannerImg"){
				$(elem).next().next().remove();
			}else{
				$(elem).next().remove();
			}
            
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
			
			if(whichField === "bannerImg"){
				$(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
				$(elem).parent().css({marginBottom: "55px"})
			}
            $(`${elem} ~ .errorHint`).fadeIn(500);
        }
    }

    class CustomSelectContent{
        constructor(){
            this.selectOptions = $('.customSelectContent').children();
            this.heightSelectMenu = null;
        }

        loadCustomSelectMenu(){
			// add new div element
            $('.customSelectContentWrapper').append(`<div class="customSelectOptions customSelectContentOptions"></div>`);
			
            $.each(this.selectOptions, function(i, opt){
				// get the text of the options then assign it to the new span element
                $('.customSelectContentOptions').append(`<span class="customOption customContentOption">${$(opt).text()}</span>`)
            })
			// hide select file extension text
            $('.customContentOption:first').css({display: "none"});
			// get height of customSelectOptions container then assign it to heightSelectMenu, we will use this for the dropdown animation of the custom select menu
            this.heightSelectMenu = $('.customSelectContentOptions').height();
			// set customSelectOptions height to 0 after getting initial height 
            $('.customSelectContentOptions').css({height: 0});
        }

        showCustomSelectMenu(heightSelect, currentElem){
			// show dropdown
            const borderStyle = "1px solid #207CE8";
            // add css styling then set and animate height of customSelectOptions
            $('.customSelectContentOptions').css({
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
            $('.customSelectContentOptions').animate({height: 0}, 200, "swing", function(){
                $(this).css({border: "none"})
                $(currentElem).css({border: borderStyle, borderRadius: ".25rem"});
            });
        }

        selectCustomOption(currentElem, selectMenuChildren){
			// get the index of the clicked option
            const ind = $(currentElem).index();
			// remove class and check mark of all the options
            $.each($('.customContentOption'), function(i, opt){
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
            $('.currentContentSelected').text($(currentElem).text());
			// hide dropdown
            this.hideCustomSelectMenu('.customSelectContentContainer')
            
        }

        events(){
            $('.customSelectContentContainer').on('click', (e) => {
				// get height of customSlectOptions afte we set the height to 0
				// we use this as toggle between showing and hiding the dropdown
                const selectMenuHeight = $('.customSelectContentOptions').height();
                if(selectMenuHeight == 0){
					// show dropdown
                    this.showCustomSelectMenu(this.heightSelectMenu, e.currentTarget)
                }else{
					// hide dropdown
                    this.hideCustomSelectMenu(e.currentTarget);
                }
            });

            if($('.customContentOption').length > 0){
				// check if the custom options already loaded
				// add click event to each custom option
                $('.customContentOption').on('click', (e) => {
					// assign value to the original select menu
                    this.selectCustomOption(e.currentTarget, this.selectOptions);
                })
            }
        }
    }

    class CustomFile{
        getBannerImage(){
            $('#bannerImg').on('change', (e) => $(e.target).next().text(e.target.files[0].name))
        }
    }

    class ValidateForm{
        checkImageDimension(resolve){
            let errors = [];

            if($('#bannerImg').val() === "" || $('#bannerImg').val() === null){
                resolve(errors);
            }else if($('#bannerImg').val() !== "" || $('#bannerImg').val() !== null){
                const ext = $('#bannerImg')[0].files[0].name.toLowerCase().split(".");

                const extCompare = ["png", "jpg"];
                let extResult = "";

                $.each(extCompare, (i, extC) => {
                    if(ext.includes(extC)) extResult = ext.includes(extC)
                })

                if(!extResult){
                    resolve(errors);
                }else{
                    const rd = new FileReader();

                    rd.readAsDataURL($('#bannerImg')[0].files[0]);
                    rd.onload = function(e){
                        const img = new Image();

                        img.src = e.target.result;

                        img.onload = function(){
                            if(this.height > 215 && this.width > 300 || this.height < 215 && this.width < 300){
                                Notification.domValidate('#bannerImg', "Banner Image dimension must be 300x215px", errors, "bannerImg");

                                resolve(errors);
                            }else{
                                $('#bannerImg').next().next().remove();
                                $('#bannerImg').parent().css({marginBottom: "35px"})
                                resolve(errors);
                            }
                        }
                    }
                }
            }else{
                resolve(errors)
            }
        }

        checkErrors(){
            let errors = [];

            if($('#selectContent').val() === "" || $('#selectContent').val() === null){
                Notification.domValidate('.customSelectContentOptions', "Content is required", errors, "selectContent");
            }else{
                $('.customSelectContentOptions').next().remove();
            }

            if($('#bannerImg').val() === "" || $('#bannerImg').val() === null){
                Notification.domValidate('#bannerImg', "Banner Image is required", errors, "bannerImg");
            }else{
                const ext = $('#bannerImg')[0].files[0].name.toLowerCase().split("."); 

                const extCompare = ["png", "jpg"];
                let extResult = "";

                $.each(extCompare, (i, extC) => {
                    if(ext.includes(extC)) extResult = ext.includes(extC)
                })

                if(!extResult){
                    Notification.domValidate('#bannerImg', "Banner Image must be png or jpg extension", errors, "bannerImg");
                }else{
                    $('#bannerImg').next().next().remove();
                    $('#bannerImg').parent().css({marginBottom: "35px"})
                }
            }

            if($('#bannerTagLine').val() === "" || $('#bannerTagLine').val() === null){
                Notification.domValidate('#bannerTagLine', "Banner Tagline is required", errors, "bannerTagLine");
            }else{
                $('#bannerTagLine').next().remove();
            }

            return errors;
        }

        submitForm(dataForm){
            $.ajax({
                type:'POST',
                url:'../../../backend/addBannerFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend: () => {
                    $('.addBannerContainer').prepend(`
                        <section class="notification">
                            <div class="notif-container">
                                <p>Adding Content..</p>
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
                success: (data, textStatus, xhr) => {
                    if(xhr.status === 200){

                        if(data.hasOwnProperty('error')){
                            return;
                        }else{
                            const notifContent = `
                                <p id="bannerAddedNotif">banner Added</p>
                                <button type="button" class="btnGray5 globalBtn" id="addBannerNotifCloseBtn">CLOSE</button>
                            `;

                            Notification.domNotificationSuccess('.notif-container', notifContent, '#addBannerNotifCloseBtn');

                            $.each($('.selectContent').children(), function(i, opt){
                                $(opt).attr('selected', false)
                            })

                            $.each($('.customSelectContentOptions'), function(i, opt){
                                $(opt).removeClass('customOptionSelected').find('i').remove();
                            })

                            $('.currentContentSelected').text("Select Content");

                            $('#bannerImg').val("")
                            $('#bannerImgLabel').text("Only png and jpg are allowed. (300x215px)")

                            $('#bannerTagLine').val("")
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('#addBannerBtn').on('click', async () => {
                const inputErrors = this.checkErrors();
                const bannerError = new Promise((resolve) => this.checkImageDimension(resolve))

                const bannerResult = await bannerError;

                if(inputErrors.length > 0 || bannerResult.length > 0){
                    return;
                }else{
                    const dataForm = new FormData()

                    dataForm.append("contentName", $('#selectContent').val())
                    dataForm.append("bannerImage", $('#bannerImg')[0].files[0])
                    dataForm.append("bannerTagline", $('#bannerTagLine').val())

                    this.submitForm(dataForm)
                }
            })
        }
    }

    const customSelectContent = new CustomSelectContent();
    const customFile = new CustomFile;
    const validateForm = new ValidateForm()
    
    customFile.getBannerImage();
    validateForm.events();

    customSelectContent.loadCustomSelectMenu();
    customSelectContent.events();
})