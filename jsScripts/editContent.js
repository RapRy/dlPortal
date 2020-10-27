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
            if(whichField === "contentFile" || whichField === "contentIcon"){
                $(elem).next().next().remove();
            }else if(whichField === "contentScreenshots"){
                $(elem).next().next().remove();
                // set to default margin of save button
                $('#addContentBtn').parent().css({marginTop: `${$('#contentScreenshotsWrapper').outerHeight() - 35}px`})
            }else{
                $(elem).next().remove();
            }
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);

            if(whichField === "contentFile" || whichField === "contentIcon"){
                $(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
                $(elem).parent().css({marginBottom: "55px"})
            }else if(whichField === "contentScreenshots"){
                // set top value of errorhint to the height of contentScreenshotsWrapper
                $(`${elem} ~ .errorHint`).css({position: "absolute", top: `${$('#contentScreenshotsWrapper').outerHeight() + 30}px`, left: 0})
                // assign new marginTop value of save button
                $('#addContentBtn').parent().css({marginTop: `60px`})
            }
            $(`${elem} ~ .errorHint`).fadeIn(500);
            errorsArr.push(whichField);
        }
        // prompt if ajax request return an error
        static domValidateAjax(elem, hint, whichField){
			if(whichField === "contentFile"){
				$(elem).next().next().remove();
			}else{
				$(elem).next().remove();
			}
            
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);
			
			if(whichField === "contentFile"){
				$(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
				$(elem).parent().css({marginBottom: "55px"})
			}
            $(`${elem} ~ .errorHint`).fadeIn(500);
        }
    }

    class ValidateForm{
        constructor(){
            this.contNameInitial = $('#contentName').val()
            this.contId = $('#contentId').val()
            this.mainCatInitial = $('.currentMainCatSelected').text()
            this.subCatInitial = $('.currentMainCatSelected').text()
            this.contFileInitial = $('#contentFileLabel').text()
            this.contIconInitial = $('#contentIconLabel').text()
            this.contDescInitial = $('#contentDescription').val()
            this.contScreensInitial = []
        }

        checkVals(){
            console.log(this.contNameInitial)
            console.log(this.contId)
            console.log(this.mainCatInitial)
            console.log(this.subCatInitial)
            console.log(this.contFileInitial)
            console.log(this.contIconInitial)
            console.log(this.contDescInitial)
        }
    }

    class Screenshots extends ValidateForm{
        // constructor(){
        //     super();
        // }

        getScreenshots(){
            if($('#screenshotsBody').length > 0){
                $.each($('.imgContainer p'), (i, screenName) => this.contScreensInitial.push($(screenName).text()))

                $('#editContentBtn').css({marginTop: "40px"})

                console.log(this.contScreensInitial)
            }
        }
    }

    const validateForm = new ValidateForm;
    const screenshots = new Screenshots;

    validateForm.checkVals();
    screenshots.getScreenshots();

})