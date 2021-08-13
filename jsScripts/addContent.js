$('document').ready(function(){
    // screenshots container, push values at CustomSelectMenuMainCat.getSubCategeories
    let screenImgArr = [];
    // reference variable, set value at CustomSelectMenuMainCat.getSubCategories
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
			// hide dropdown
            this.hideCustomSelectMenu('.customSelectSubCatContainer')

            // this.getSubCategories($(currentElem).text());
            
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

    class CustomSelectMenuMainCat{
        constructor(){
			// get options
            this.selectOptions = $('.customSelectMainCatMenu').children();
			// container for the height value of select
            this.heightSelectMenu = null;
        }

        loadCustomSelectMenu(){
			// add new div element
            $('.customSelectMainCatWrapper').append(`<div class="customSelectOptions customSelectMainCatOptions"></div>`);
			
            $.each(this.selectOptions, function(i, opt){
				// get the text of the options then assign it to the new span element
                $('.customSelectMainCatOptions').append(`<span class="customOption customMainCatOption">${$(opt).text()}</span>`)
            })
			// hide select file extension text
            $('.customMainCatOption:first').css({display: "none"});
			// get height of customSelectOptions container then assign it to heightSelectMenu, we will use this for the dropdown animation of the custom select menu
            this.heightSelectMenu = $('.customSelectMainCatOptions').height();
			// set customSelectOptions height to 0 after getting initial height 
            $('.customSelectMainCatOptions').css({height: 0});
        }

        showCustomSelectMenu(heightSelect, currentElem){
			// show dropdown
            const borderStyle = "1px solid #207CE8";
            // add css styling then set and animate height of customSelectOptions
            $('.customSelectMainCatOptions').css({
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
            $('.customSelectMainCatOptions').animate({height: 0}, 200, "swing", function(){
                $(this).css({border: "none"})
                $(currentElem).css({border: borderStyle, borderRadius: ".25rem"});
            });
        }

        selectCustomOption(currentElem, selectMenuChildren){
			// get the index of the clicked option
            const ind = $(currentElem).index();
			// remove class and check mark of all the options
            $.each($('.customMainCatOption'), function(i, opt){
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
            $('.currentMainCatSelected').text($(currentElem).text());
			// hide dropdown
            this.hideCustomSelectMenu('.customSelectMainCatContainer')

            this.getSubCategories($(currentElem).text());
            
        }

        getSubCategories(currentCat){
            const dataForm  = new FormData;
            // create instance of the CustomSelectMenuMainCat class
            const customSelectMenuSubCat = new CustomSelectMenuSubCat;

            $.ajax({
                type:'POST',
                url:'../../../backend/addContentFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend: () => {
                    dataForm.append('selectCat', currentCat)
                    // remove the previous sub categories if there is any
                    customSelectMenuSubCat.removeSubcategories();
                },
                success:(data, textStatus, xhr) => {
                    if(xhr.status == 200){
                        if(data.length > 0){
                            // remove error "no subcategories"
                            if($('.customSelectSubCatContainer').next("small")){
                                $('.customSelectSubCatContainer').next().remove();
                            }
                            // show the subcategories
                            customSelectMenuSubCat.loadCustomSelectMenuSubCat(data);
                            // add click event on subcategory select input
                            customSelectMenuSubCat.events();
                            // assign the current main category to the global variable catExt 
                            catExt = data[0].mainCatExt;
                            // reset the content file and content icon input value
                            $('#contentFile').val("")
                            $('#contentIcon').val("")

                            if(data[0].mainCatExt === "APK"){
                                // if main category has extension of apk add sceenshots input upload

                                // change text label of content file input
                                $('#contentFileLabel').text("Only apk and xapk are allowed.");
                                $('#contentIconLabel').text("Only png and jpg are allowed. (45x45px).");

                                // remove previous screenshot input just in case admin changed the main category and if main cat ext is not equal to apk or select another cat that has apk
                                if($('#screenshotsInput') != undefined)
                                    $('#screenshotsInput').remove();

                                // append input before save button
                                // and add margin top value to the container of the save button
                                $('#addContentBtn').parent().before(`
                                    <div class="custom-file" id="screenshotsInput">
                                        <span class="formLabel customFormLabel">Content Screenshots</span>
                                        <input type="file" id="contentScreenshots" class="contentScreenshots" name="contentScreenshots" multiple>
                                        <div class="contentScreenshotsWrapper" id="contentScreenshotsWrapper">
                                            <div class="text-center" id="screenshotsHeader">
                                                <label type="button" class="screenshotsBtnSubmit" id="screenshotsBtnSubmit" for="contentScreenshots">
                                                    Choose Images
                                                </label>
                                                <p class="screenshotsReminder">Only png and jpg are allowed.</p>
                                            </div>
                                            <div class="screenshotsBody" id="screenshotsBody"></div>
                                        </div>
                                    </div>
                                `).css({marginTop: `${$('#contentScreenshotsWrapper').outerHeight() - 35}px`})

                                $('#contentScreenshotsWrapper').height($('#contentScreenshotsWrapper').outerHeight());

                                $('#contentScreenshots').on('change', (e) => {

                                    $.each(e.target.files, (i, img) => {
                                        // push the value or values of the input to the global variable screenImgArr
                                        screenImgArr.push(img);

                                        if(screenImgArr.length > 0){
                                            $('#screenshotsBtnSubmit').text('Add Images')
                                        }else{
                                            $('#screenshotsBtnSubmit').text('Choose Images')
                                        }

                                        $('#screenshotsBody').append(`
                                            <div class="imgContainer">
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

                                    // add new click event
                                    $('.deleteScreen').on('click', function(){
                                        const ind = $(this).parent().index();
                                        screenImgArr.splice(ind, 1);
                                        $('.imgContainer').eq(ind).remove();

                                        if(screenImgArr.length === 0){
                                            $('#contentScreenshots').val("")
                                        }

                                        // height animation of the screenshot thumb container
                                        const height = $('#screenshotsBody').height() + $('#screenshotsHeader').height() + 30;

                                        $('#contentScreenshotsWrapper').animate({height: height}, 200, "swing");

                                        // adjust top position error hint if its not undefined
                                        if($('#contentScreenshotsWrapper').next().length > 0){
                                            $('#contentScreenshotsWrapper').next().animate({top: `${height + 30}px`}, 200, "swing")
                                        }
                                    })
                                })
                    
                            }else if(data[0].mainCatExt === "MP4"){
                                $('#contentFile').val("")
                                $('#contentIcon').val("")

                                // change text of label
                                $('#contentFileLabel').text("Only mp4 are allowed.");
                                $('#contentIconLabel').text("Only png and jpg are allowed. (45x45px).");
                                // remove screenshot input if its appended
                                if($('#screenshotsInput') != undefined){
                                    $('#screenshotsInput').remove();
                                    screenImgArr = [];
                                    $('#contentScreenshots').val("")
                                }
                                // set 0 margintop to the container of the save button
                                $('#addContentBtn').parent().css({marginTop:"0px"})

                            }else if(data[0].mainCatExt === "MP3"){
                                $('#contentFile').val("")
                                $('#contentIcon').val("")
                                $('#contentDescription').val("")

                                $('#contentFileLabel').text("Only mp3 are allowed.");
                                $('#contentIconLabel').text("Only png and jpg are allowed. (45x45px).");
                                // remove screenshot input if its appended
                                if($('#screenshotsInput') != undefined){
                                    $('#screenshotsInput').remove();
                                    screenImgArr = [];
                                    $('#contentScreenshots').val("")
                                }

                                $('#addContentBtn').parent().css({marginTop:"0px"})
                            }

                        }else{
                            // send notification no sub categories
                            let errors = [];
                            Notification.domValidate('.customSelectSubCatContainer', "No Sub Categories", errors, "selectSubCat");

                            $('#contentFile').val("")
                            $('#contentIcon').val("")

                            // set default text label
                            $('#contentFileLabel').text("Only apk and xapk are allowed.");
                            $('#contentIconLabel').text("Only png and jpg are allowed. (45x45px).");
                            
                            // remove screenshots if its defined 
                            if($('#screenshotsInput') != undefined){
                                $('#screenshotsInput').remove();
                                screenImgArr = [];
                                $('#contentScreenshots').val("")
                            }

                            return;
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('.customSelectMainCatContainer').on('click', (e) => {
				// get height of customSlectOptions afte we set the height to 0
				// we use this as toggle between showing and hiding the dropdown
                const selectMenuHeight = $('.customSelectMainCatOptions').height();
                if(selectMenuHeight == 0){
					// show dropdown
                    this.showCustomSelectMenu(this.heightSelectMenu, e.currentTarget)
                }else{
					// hide dropdown
                    this.hideCustomSelectMenu(e.currentTarget);
                }
            });

            if($('.customMainCatOption').length > 0){
				// check if the custom options already loaded
				// add click event to each custom option
                $('.customMainCatOption').on('click', (e) => {
					// assign value to the original select menu
                    this.selectCustomOption(e.currentTarget, this.selectOptions);
                })
            }
        }

        // if user click add button from view contents page
        windowLoad(){
            $('#selectMainCat').children().each((i, elem) => {
                if($(elem).attr('selected')){
                    this.getSubCategories($(elem).text());
                }               
            })
        }

    }

    class CustomFile{
        getContentFileValue(){
			// set name of the file onchange event
            $('#contentFile').on('change', (e) => $(e.target).next().text(e.target.files[0].name))
        }

        getContentIconValue(){
			// set name of the file onchange event
            $('#contentIcon').on('change', (e) => $(e.target).next().text(e.target.files[0].name))
        }
    }

    class ValidateForm extends CustomSelectMenuMainCat{
        checkIconDimension(resolve){
            let errors = []

            if($('#contentIcon').val() === "" || $('#contentIcon').val() === null){
				// empty input return 0
                resolve(errors);
            }else if($('#contentIcon').val() != "" || $('#contentIcon').val() != null){

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
                            if((this.height > 75 && this.width > 75) || (this.height < 75 && this.width < 75)){
                                // check image if height and width is not equal to 45px
                                Notification.domValidate('#contentIcon', "Content icon dimension must be 75x75px", errors, "contentIcon");
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
        }

        checkErrors(){
            let errors = [];

            if($('#contentName').val() === "" || $('#contentName').val() === null){
                Notification.domValidate('#contentName', "Content Name is required", errors, "contentName");
            }else{
                $('#contentName').next().remove();
            }

            if($('#selectMainCat').val() === "" || $('#selectMainCat').val() === null){
                Notification.domValidate('.customSelectMainCatOptions', "Main Category is required", errors, "selectMainCat");
            }else{
                $('.customSelectMainCatOptions').next().remove();
            }

            if($('#selectSubCat').val() === "" || $('#selectSubCat').val() === null){
                Notification.domValidate('.customSelectSubCatOptions', "Sub Category is required", errors, "selectSubCat");
            }else{
                $('.customSelectSubCatOptions').next().remove();
            }

            if($('#contentFile').val() === "" || $('#contentFile').val() === null){
                Notification.domValidate('#contentFile', "Content File is required", errors, "contentFile");
            }else{
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

            if($('#contentIcon').val() === "" || $('#contentIcon').val() === null){
                Notification.domValidate('#contentIcon', "Content Icon is required", errors, "contentIcon");
            }else{
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

            if($('#contentDescription').val() === "" || $('#contentDescription').val() === null){
                Notification.domValidate('#contentDescription', "Content Description is required", errors, "contentDescription");
            }else{
                $('#contentDescription').next().remove();
            }

            if($('#contentScreenshots').val() === "" || $('#contentScreenshots').val() === null){
                
                if($('#contentScreenshotsWrapper').next().length > 0){
                    $('#contentScreenshotsWrapper').next().remove();
                }
                
                Notification.domValidate('#contentScreenshotsWrapper', "Content screenshots are required", errors, "contentScreenshots");
            }else{
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

            return errors;
        }

        submitForm(dataForm){
            $.ajax({
                type:'POST',
                url:'../../../backend/addContentFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend: () => {
                    // show loader
                    $('.addContentContainer').prepend(`
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
                        if(data.hasOwnProperty('success')){
                            const notifContent = `
								<p id="contentAddedNotif">${data.contentName} Added</p>
                                <button type="button" class="btnGray5 globalBtn" id="addContentNotifCloseBtn">CLOSE</button>
							`;
							// show success notification
                            Notification.domNotificationSuccess('.notif-container', notifContent, '#addContentNotifCloseBtn');

                            $.each($('.selectMainCat').children(), function(i, opt){
                                $(opt).attr('selected', false)
                            })

                            $.each($('.customSelectMainCatOptions'), function(i, opt){
                                $(opt).removeClass('customOptionSelected').find('i').remove();
                            })

                            $('.currentMainCatSelected').text("Select Main Category")

                            $.each($('.selectSubCat').children(), function(i, opt){
                                $(opt).attr('selected', false)
                            })

                            $.each($('.customSelectSubCatOptions'), function(i, opt){
                                $(opt).removeClass('customOptionSelected').find('i').remove();
                            })

                            $('.currentSubCatSelected').text("Select Sub Category")

                            $('#contentName').val("");
                            $('#contentFile').val("")
                            $('#contentIcon').val("")
                            $('#contentDescription').val("")

                            $('#contentFileLabel').text("")
                            $('#contentIconLabel').text("Only png and jpg are allowed. (45x45px).")

                            if($('#screenshotsInput') != undefined){
                                $('#screenshotsInput').remove();
                                screenImgArr = [];
                                $('#contentScreenshots').val("")

                                $('#addContentBtn').parent().css({marginTop:"0px"})
                            }

                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }
        
        events(){
            $('#addContentBtn').on('click', async () => {

                const inputErrors = this.checkErrors();
                const iconError = new Promise((resolve) => this.checkIconDimension(resolve));

                const iconResult = await iconError;

                if(inputErrors.length > 0 || iconResult.length > 0){
                    return;
                }else{
                    const dataForm = new FormData;

                    dataForm.append("contentName", $('#contentName').val())
                    dataForm.append("mainCategory", $('#selectMainCat').val())
                    dataForm.append("subCategory", $('#selectSubCat').val())
                    dataForm.append("contentFile", $('#contentFile')[0].files[0])
                    dataForm.append("contentIcon", $('#contentIcon')[0].files[0])
                    dataForm.append("contentDescription", $('#contentDescription').val())

                    if(screenImgArr.length > 0){
                        screenImgArr.forEach((img, i) =>  {
                            dataForm.append("screenshots[]", img)
                        })
                    }

                    this.submitForm(dataForm);
                }
            })
        }
    }

    const customSelectMenuMainCat = new CustomSelectMenuMainCat();
    const customFile = new CustomFile;
    const validateForm = new ValidateForm();

    customFile.getContentFileValue()
    customFile.getContentIconValue()
    validateForm.events();

    customSelectMenuMainCat.loadCustomSelectMenu();
    customSelectMenuMainCat.windowLoad();
    customSelectMenuMainCat.events();
})