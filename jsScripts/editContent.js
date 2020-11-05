$('document').ready(function(){

    let screenImgArr = [];

    let catExt = "";

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

    class CustomSelectMenuSubCat{
        constructor(){
            this.heightSelectMenu = null;
        }

        loadCustomSelectMenuSubCat(data){
            // add new div element
            $('.customSelectSubCatWrapper').append(`<div class="customSelectOptions customSelectSubCatOptions"></div>`);

            // $('.currentSubCatSelected').text($('.currentSubCatSelected').prev().val())

            $.each(data, function(i, subCat){
                const { subCatId, subCatName } = subCat;
                $('.customSelectSubCatMenu').append(`
                    <option value="${subCatName}">${subCatName}</option>
                `)

                $('.customSelectSubCatOptions').append(`<span class="customOption customSubCatOption">${subCatName}</span>`)
            })

            $('.customSelectSubCatOptions').prepend(`
                <span class="customOption customSubCatOption">Select Sub Category</span>
            `)

            $('.customSubCatOption:first').css({display: "none"});
            // assign value to the this.heightSelectMenu
            this.heightSelectMenu = $('.customSelectSubCatOptions').height();

            $('.customSelectSubCatOptions').css({height: 0});

            // if the user click add button from view contents page
            if($('.currentSubCatSelected').prev().length > 0){
                $('.currentSubCatSelected').text($('.currentSubCatSelected').prev().val())
                
                $('#selectSubCat').children().each((i, elem) => {
                    if($('.currentSubCatSelected').prev().val() === $(elem).text()){
                        $(elem).attr('selected', 'true');
                    }
                })
            }
        }
    
        removeSubcategories(){
            if($('.customSelectSubCatMenu').children().length > 1){

                this.hideCustomSelectMenu($('.customSelectSubCatContainer'));

                $('.customSelectSubCatMenu').empty().append(`
                        <option value="">Select Sub Category</option>
                `);

                $('.customSelectSubCatOptions').remove();
                $('.currentSubCatSelected').text("Select Sub Category");

                $('.customSelectSubCatContainer').unbind('click');
            }
        }

        hideCustomSelectMenu(currentElem){
			// hide dropdown
            const borderStyle = "1px solid #207CE8";
			// return styles to initial styles
            $('.customSelectSubCatOptions').animate({height: 0}, 200, "swing", function(){
                $(this).css({border: "none"})
                $(currentElem).css({border: borderStyle, borderRadius: ".25rem"});
            });
        }

        showCustomSelectMenu(heightSelect, currentElem){
			// show dropdown
            const borderStyle = "1px solid #207CE8";
            // add css styling then set and animate height of customSelectOptions
            $('.customSelectSubCatOptions').css({
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

        selectCustomOption(currentElem, selectMenuChildren){
			// get the index of the clicked option
            const ind = $(currentElem).index();
			// remove class and check mark of all the options
            $.each($('.customSubCatOption'), function(i, opt){
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
            $('.currentSubCatSelected').text($(currentElem).text());
            $('#selectSubCat').attr('value', $(currentElem).text())
			// hide dropdown
            this.hideCustomSelectMenu('.customSelectSubCatContainer')

            // this.getSubCategories($(currentElem).text());
            
        }

        getSubCategories(currentCat, resolve){
            const dataForm  = new FormData;

            $.ajax({
                type:'POST',
                url:'../../../backend/editContentFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend: () => {
                    dataForm.append('selectCat', currentCat)
                    // remove the previous sub categories if there is any
                    this.removeSubcategories();
                },
                success: (data, textStatus, xhr) => {
                    if(xhr.status == 200){
                        if(data.length > 0){
                            // remove error "no subcategories"
                            if($('.customSelectSubCatContainer').next("small")){
                                $('.customSelectSubCatContainer').next().remove();
                            }
                            // show the subcategories
                            this.loadCustomSelectMenuSubCat(data);
                            // add click event on subcategory select input
                            this.events();
                            // assign the current main category to the global variable catExt 
                            catExt = data[0].mainCatExt;
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('.customSelectSubCatContainer').on('click', (e) => {
                const selectMenuHeight = $('.customSelectSubCatOptions').height();
                if(selectMenuHeight == 0){
                    // show dropdown
                    this.showCustomSelectMenu(this.heightSelectMenu, e.currentTarget)
                }else{
					// hide dropdown
                    this.hideCustomSelectMenu(e.currentTarget);
                }
            })

            if($('.customSubCatOption').length > 0){
				// check if the custom options already loaded
				// add click event to each custom option
                $('.customSubCatOption').on('click', (e) => {
					// assign value to the original select menu
                    this.selectCustomOption(e.currentTarget, $('.customSelectSubCatMenu').children());
                })
            }
        }
    }

    class CustomFile{
        setValue(selector){
			// set name of the file onchange event
            $(selector).on('change', (e) => {
                $(e.target).next().text(e.target.files[0].name)
                $(e.target).attr('value', e.target.files[0].name);
            })
        }
    }

    class ValidateForm{
        constructor(){
            this.contNameInitial = $('#contentName').val()
            this.contId = $('#contentId').val()
            this.folderName = $('#folderName').val()
            this.mainCatInitial = $('.currentMainCatSelected').text()
            this.subCatInitial = $('.currentSubCatSelected').text()
            this.contFileInitial = $('#contentFileLabel').text()
            this.contIconInitial = $('#contentIconLabel').text()
            this.contDescInitial = $('#contentDescription').val()
            this.contScreensInitial = []
            this.screenshotsInitialLength = $('.screenInitial').length
        }

        checkIconDimension(resolve){
            let errors = [];

            if($('#contentIcon').attr('value') === "" || $('#contentIcon').attr('value') === null){
				// empty input return 0
                resolve(errors);
            }else if($('#contentIcon').attr('value') != "" || $('#contentIcon').attr('value') != null){
                if($('#contentIcon')[0].files[0] != undefined){
                    const ext = $('#contentIcon')[0].files[0].name.toLowerCase().split(".");

                    const extCompare = ["png", "jpg"]
                    let extResult = "";

                    $.each(extCompare, (i, extC) => {
                        // return false is there is no match to extCompare values
                        if(ext.includes(extC)) extResult = ext.includes(extC)
                    })

                    if(!extResult){
                        // file type is not png or jpg return 0
                        resolve(errors);
                    }else{
                        // input not empty
                        const rd = new FileReader();
                        // read the file ad based64 or blob
                        rd.readAsDataURL($('#contentIcon')[0].files[0]);
                        rd.onload = function(e){
                            // create image tag
                            const img = new Image();
                            // add blob file as src attribute of the image 
                            img.src = e.target.result;
                            img.onload = function(){
                                if((this.height > 45 && this.width > 45) || (this.height < 45 && this.width < 45)){
                                    // check image if height and width is not equal to 45px
                                    Notification.domValidate('#contentIcon', "Content icon dimension must be 45x45px", errors, "contentIcon");
                                    // return the error or return 1
                                    resolve(errors);
                                }else{
                                    // if image height and width is equal 45px
                                    // remove the error notif if there is any then return 0
                                    $('#contentIcon').next().next().remove();
                                    $('#contentIcon').parent().css({marginBottom: "35px"})
                                    resolve(errors);
                                }
                            }
                        }
                    }
                }else{
                    // other error return 0
                    resolve(errors);
                }
            }else{
				// other error return 0
                resolve(errors);
            }
        }

        checkInitialValues(data){
            let errors = [];

            if(this.contNameInitial === $('#contentName').val()){
                if(this.subCatInitial != $('.currentSubCatSelected').text() || this.contFileInitial != $('#contentFileLabel').text() || this.contIconInitial != $('#contentIconLabel').text() || this.contDescInitial != $('#contentDescription').val() || screenImgArr.length > 0 || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('contNameInitial');
                }
            }else{
                data.append('contentName', $('#contentName').val());
                errors = [];
            }

            if(this.subCatInitial === $('#selectSubCat').attr('value')){
                if(this.contNameInitial != $('#contentName').val() || this.contFileInitial != $('#contentFileLabel').text() || this.contIconInitial != $('#contentIconLabel').text() || this.contDescInitial != $('#contentDescription').val() || screenImgArr.length > 0 || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('subCatInitial');
                }
            }else{
                data.append('subCategory', $('#selectSubCat').val());
                errors = [];
            }

            if(this.contFileInitial === $('#contentFile').attr('value')){
                if(this.contNameInitial != $('#contentName').val() || this.subCatInitial != $('.currentSubCatSelected').text() || this.contIconInitial != $('#contentIconLabel').text() || this.contDescInitial != $('#contentDescription').val() || screenImgArr.length > 0 || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('contFileInitial');
                }
            }else{
                data.append('contentFile', $('#contentFile')[0].files[0]);
                data.append('contentFileInitial', this.contFileInitial);
                errors = [];
            }

            if(this.contIconInitial === $('#contentIcon').attr('value')){
                if(this.contNameInitial != $('#contentName').val() || this.contFileInitial != $('#contentFileLabel').text() || this.subCatInitial != $('.currentSubCatSelected').text() || this.contDescInitial != $('#contentDescription').val() || screenImgArr.length > 0 || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('contIconInitial');
                }
            }else{
                data.append('contentIcon', $('#contentIcon')[0].files[0]);
                data.append('contentIconInitial', this.contIconInitial)
                errors = [];
            }

            if(this.contDescInitial === $('#contentDescription').val()){
                if(this.contNameInitial != $('#contentName').val() || this.contFileInitial != $('#contentFileLabel').text() || this.contIconInitial != $('#contentIconLabel').text() || this.subCatInitial != $('.currentSubCatSelected').text() || screenImgArr.length > 0 || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('contDescInitial');
                }
            }else{
                data.append('contentDescription', $('#contentDescription').val());
                errors = [];
            }

            if(screenImgArr.length === 0){
                if(this.contNameInitial != $('#contentName').val() || this.contFileInitial != $('#contentFileLabel').text() || this.subCatInitial != $('.currentSubCatSelected').text() || this.contDescInitial != $('#contentDescription').val() || this.contIconInitial != $('#contentIconLabel').text() || this.screenshotsInitialLength > $('.deleteScreenInitial').length){
                    errors = [];
                }else{
                    errors.push('screenImgArr');
                }
            }else{
                screenImgArr.forEach((img, i) =>  {
                    data.append("screenshots[]", img)
                })
            }

            return errors;
        }

        checkErrors(){
            let errors = [];

            if($('#contentName').val() === "" || $('#contentName').val() === null){
                Notification.domValidate('#contentName', "Content Name is required", errors, "contentName");
            }else{
                $('#contentName').next().remove();
            }

            // if($('#selectMainCat').val() === "" || $('#selectMainCat').val() === null){
            //     Notification.domValidate('.customSelectMainCatOptions', "Main Category is required", errors, "selectMainCat");
            // }else{
            //     $('.customSelectMainCatOptions').next().remove();
            // }

            if($('#selectSubCat').attr('value') === "" || $('#selectSubCat').attr('value') === null){
                Notification.domValidate('.customSelectSubCatOptions', "Sub Category is required", errors, "selectSubCat");
            }else{
                $('.customSelectSubCatOptions').next().remove();
            }

            if($('#contentFile').attr('value') === "" || $('#contentFile').attr('value') === null){
                Notification.domValidate('#contentFile', "Content File is required", errors, "contentFile");
            }else{
                if($('#contentFile')[0].files[0] != undefined){
                    const ext = $('#contentFile')[0].files[0].name.toLowerCase().split(".");

                    if(catExt == "APK"){
                        // validate if file has apk or xapk extension
                        const extCompare = ["xapk", "apk"]
                        let extResult = "";

                        $.each(extCompare, (i, extC) => {
                            if(ext.includes(extC)) extResult = ext.includes(extC)
                        })

                        if(!extResult){
                            Notification.domValidate('#contentFile', "Content File must be apk or xapk file extension", errors, "contentFile");
                        }else{
                            $('#contentFile').next().next().remove();
                            $('#contentFile').parent().css({marginBottom: "35px"})
                        }
                    }else if(catExt == "MP3"){
                        // validate if file has mp3 extension
                        const extInd = $.inArray("mp3", ext);

                        if(ext[extInd] != "mp3" || $('#contentFile')[0].files[0].type != "audio/mpeg"){
                            Notification.domValidate('#contentFile', "Content File must be mp3 file extension", errors, "contentFile");
                        }else{
                            $('#contentFile').next().next().remove();
                            $('#contentFile').parent().css({marginBottom: "35px"})
                        }

                    }else if(catExt == "MP4"){
                        // validate if file has mp4 extension
                        const extInd = $.inArray("mp4", ext);

                        if(ext[extInd] != "mp4" || $('#contentFile')[0].files[0].type != "video/mp4"){
                            Notification.domValidate('#contentFile', "Content File must be mp4 file extension", errors, "contentFile");
                        }else{
                            $('#contentFile').next().next().remove();
                            $('#contentFile').parent().css({marginBottom: "35px"})
                        }
                    }
                }
            }

            if($('#contentIcon').attr('value') === "" || $('#contentIcon').attr('value') === null){
                Notification.domValidate('#contentIcon', "Content Icon is required", errors, "contentIcon");
            }else{
                if($('#contentIcon')[0].files[0] != undefined){
                    const ext = $('#contentIcon')[0].files[0].name.toLowerCase().split(".");

                    const extCompare = ["png", "jpg"]
                    let extResult = "";

                    $.each(extCompare, (i, extC) => {
                        if(ext.includes(extC)) extResult = ext.includes(extC)
                    })

                    if(!extResult){
                        // if icon is not png or jpg
                        Notification.domValidate('#contentIcon', "Content Icon must be png or jpg file extension", errors, "contentIcon");
                    }else{
                        $('#contentIcon').next().next().remove();
                        $('#contentIcon').parent().css({marginBottom: "35px"})
                    }
                }
            }

            if($('#contentDescription').val() === "" || $('#contentDescription').val() === null){
                Notification.domValidate('#contentDescription', "Content Description is required", errors, "contentDescription");
            }else{
                $('#contentDescription').next().remove();
            }

            if($('.imgContainer').length === 0){

                if($('#contentScreenshotsWrapper').next().length > 0){
                    $('#contentScreenshotsWrapper').next().remove();
                }
                
                Notification.domValidate('#contentScreenshotsWrapper', "Content screenshots are required", errors, "contentScreenshots");
            }else{
                
                if($('#contentScreenshots')[0].files[0]){
                    const extCompare = ["png", "jpg", "gif"];
                    // let extResult = [];
                    let imgInds = [];

                    $(screenImgArr).each(function(ind){
                        const ext = this.name.toLowerCase().split(".");
                        if(extCompare.includes(ext[ext.length - 1])){
                            imgInds.push(ind);
                        }
                    })

                    $(screenImgArr).each(function(ind){
                        const name = this.name

                        if(!imgInds.includes(ind)){
                            Notification.domValidate('#contentScreenshotsWrapper', `${name} extension is not valid`, errors, "contentScreenshots");
                            return false;
                        }else{
                            $('#contentScreenshotsWrapper').next().remove();
                        }
                    })
                }
            }

            return errors;
        }

        submitForm(){
            const data = new FormData;

            data.append('contentId', this.contId)
            data.append('folderName', this.folderName)
            data.append('mainCatInitial', this.mainCatInitial)
            data.append('subCatInitial', this.subCatInitial)

            const valInitials = this.checkInitialValues(data)

            console.log(valInitials)

            $.ajax({
                type:'POST',
                url:'../../../backend/editContentFn.php',
                data:data,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend:() => {
                    if($('#screenshotsInput').length > 0 && screenImgArr.length === 0){
                        if(this.screenshotsInitialLength > $('.screenInitial').length && this.contNameInitial === $('#contentName').val() && this.subCatInitial === $('.currentSubCatSelected').text() && this.contFileInitial === $('#contentFileLabel').text() && this.contIconInitial === $('#contentIconLabel').text() && this.contDescInitial === $('#contentDescription').val()){

                            // show save loader
                            $('.editContentContainer').prepend(`
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

                            // remove the loader then show the success message after the timeout
                            setTimeout(() => {
                                $('.saveLoader').remove();
                                $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                                $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                                $('.notif-container p').text(`${this.contNameInitial} succesfully updated.`);
                            }, 500);
                            // remove the notification after timeout
                            setTimeout(function(){
                                $('.notification').fadeOut(400, "swing", function(){
                                    $('.editContentContainer').children(".notification").remove();
                                })
                                $('.notif-container').css("transform", "scale(0)");
                            }, 2000);

                            return false
                        }else if(valInitials.length > 0){
                            return false;
                        }else{
                           // show save loader
                            $('.editContentContainer').prepend(`
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
                    }else if(valInitials.length > 0){
                        // cancel update content
                        return false
                    }else{
                        // show save loader
						$('.editContentContainer').prepend(`
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
                success:(data, textStatus, xhr) => {
                    if(xhr.status === 200){
                        // remove the loader then show the success message after the timeout
                        setTimeout(() => {
                            $('.saveLoader').remove();
                            $('.notif-container').append(`<i class="fas fa-check updateSuccess"></i>`);
                            $('.updateSuccess').css({display:"none"}).fadeIn(400, "swing");
                            $('.notif-container p').text(`${this.contNameInitial} succesfully updated.`);
                        }, 500);
                        // remove the notification after timeout
                        setTimeout(function(){
                            $('.notification').fadeOut(400, "swing", function(){
                                $('.editContentContainer').children(".notification").remove();
                            })
                            $('.notif-container').css("transform", "scale(0)");
                        }, 2000);
                    }
                },
                error:(err) => console.log(err)
            })
        }

        events(){
            $('#editContentBtn').on('click', async () => {
                const inputErrors = this.checkErrors();
                const iconError = new Promise((resolve) => this.checkIconDimension(resolve))

                const iconResult = await iconError;

                if(inputErrors.length > 0 || iconResult.length > 0){
                    return;
                }else{
                    this.submitForm();
                }
            })
        }
    }

    class Screenshots extends ValidateForm{
        
        getScreenshots(){
            if($('#screenshotsBody').length > 0){
                // get initial values
                $.each($('.imgContainer p'), (i, screenName) => this.contScreensInitial.push($(screenName).text()))
                // set margin top
                $('#editContentBtn').parent().css({marginTop: "40px"})
                // add height
                $('#contentScreenshotsWrapper').height($('#contentScreenshotsWrapper').height())

            }
        }

        deleteInitialScreenshot(){
            // initial screenshots
            $('.deleteScreenInitial').on('click', (e) => {
                const dataForm  = new FormData;

                $.ajax({
                    type:'POST',
                    url:'../../../backend/editContentFn.php',
                    data:dataForm,
                    dataType:'json',
                    contentType:false,
                    processData:false,
                    beforeSend: () => {
                        // append name of screenshot
                        dataForm.append('screenshotName', $(e.currentTarget).prev().text())
                        dataForm.append('folderName', this.folderName)
                        dataForm.append('catName', this.mainCatInitial)
                        dataForm.append('subCatName', this.subCatInitial)
                    },
                    success: (data, textStatus, xhr) => {
                        if(xhr.status === 200){
                            // get index
                            const ind = $(e.currentTarget).parent().index();
                            // remove from array
                            this.contScreensInitial.splice(ind, 1);
                            // remove dom element
                            $(e.currentTarget).parent().remove();
                            // set empty value
                            if(this.contScreensInitial.length === 0) $('#contentScreenshots').val("")
                        
                            // height animation of the screenshot thumb container
                            const height = $('#screenshotsBody').height() + $('#screenshotsHeader').height() + 30;

                            $('#contentScreenshotsWrapper').animate({height: height}, 200, "swing");

                            // adjust top position error hint if its not undefined
                            if($('#contentScreenshotsWrapper').next().length > 0){
                                $('#contentScreenshotsWrapper').next().animate({top: `${height + 30}px`}, 200, "swing")
                            }
                        }
                    },
                    error: (err) => console.log(err)
                })
            })
        }

        deleteAddedScreenshot(){
            // added screenshots
            $('.deleteScreen').on('click', function(){
                // get index then minus 1 to match the index of the screenImgArr array
                const ind = $(this).parent().index() - 1;
                // remove from array
                screenImgArr.splice(ind, 1);
                // remove dom element
                $(this).parent().remove();
                // set empty value
                if(screenImgArr.length === 0) $('#contentScreenshots').val("")

                // height animation of the screenshot thumb container
                const height = $('#screenshotsBody').height() + $('#screenshotsHeader').height() + 30;

                $('#contentScreenshotsWrapper').animate({height: height}, 200, "swing");

                // adjust top position error hint if its not undefined
                if($('#contentScreenshotsWrapper').next().length > 0){
                    $('#contentScreenshotsWrapper').next().animate({top: `${height + 30}px`}, 200, "swing")
                }

            })
        }

        eventsScreenshots(){
            $('#contentScreenshots').on('change', (e) => {
                $.each(e.target.files, (i, img) => {
                    // push the value or values of the input to the global variable screenImgArr
                    screenImgArr.push(img);
                    // add dom element
                    $('#screenshotsBody').append(`
                        <div class="imgContainer screenNew">
                            <i class="fas fa-file-image screenImgThumb"></i>
                            <p>${img.name}</p>
                            <button type="button" class="btnRedSolid deleteCategoryBtn deleteScreen">
                                <i class="fas fa-trash-alt"></i>
                            </button>
                        </div>
                    `)
                })

                // height animation of the screenshot thumb container
                const height = $('#screenshotsBody').height() + $('#screenshotsHeader').height() + 30;

                $('#contentScreenshotsWrapper').animate({height: height}, 200, "swing");

                // adjust top position error hint if its not undefined
                if($('#contentScreenshotsWrapper').next().length > 0){
                    $('#contentScreenshotsWrapper').next().animate({top: `${height + 30}px`}, 200, "swing")
                }

                // remove previous click event from del button to avoid multiple click event
                $.each($('.deleteScreen'), (i, del) => $(del).unbind('click'))
                // add delete click event
                this.deleteAddedScreenshot()
            })
        }
    }  

    const customSelectMenuSubCat = new CustomSelectMenuSubCat();
    const validateForm = new ValidateForm;
    const screenshots = new Screenshots;
    const customFile = new CustomFile;

    customFile.setValue('#contentFile')
    customFile.setValue('#contentIcon')

    validateForm.events();

    if($('#screenshotsInput').length > 0){
        screenshots.getScreenshots();
        screenshots.deleteInitialScreenshot()
        screenshots.eventsScreenshots();
    }

    customSelectMenuSubCat.getSubCategories($('.currentMainCatSelected').text());
})