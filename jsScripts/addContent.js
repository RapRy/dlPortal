$('document').ready(function(){

    let screenImgArr = [];
    let catExt = "";

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
            if(whichField === "contentFile" || whichField === "contentIcon"){
                $(elem).next().next().remove();
            }else{
                $(elem).next().remove();
            }
            $(elem).parent().append(`<small class="formHint errorHint">${hint}</small>`);

            if(whichField === "contentFile" || whichField === "contentIcon"){
                $(`${elem} ~ .errorHint`).css({position: "absolute", top: "62px", left: 0})
                $(elem).parent().css({marginBottom: "55px"})
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

            this.heightSelectMenu = $('.customSelectSubCatOptions').height();

            $('.customSelectSubCatOptions').css({height: 0});
        }

        removeSubcategories(){
            if($('.customSelectSubCatMenu').children().length > 1){

                this.hideCustomSelectMenu($('.customSelectSubCatContainer'));

                $('.customSelectSubCatMenu').empty().append(`
                        <option value="">Select Sub Category</option>
                `);

                $('.customSelectSubCatOptions').remove();
                $('.currentSubCatSelected').text("Select Sub Category");

                // this.heightSelectMenu = null;

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
            // create instance of the subcat select menu
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

                    customSelectMenuSubCat.removeSubcategories();
                },
                success:(data, textStatus, xhr) => {
                    if(xhr.status == 200){
                        if(data.length > 0){
                            if($('.customSelectSubCatContainer').next("small")){
                                $('.customSelectSubCatContainer').next().remove();
                            }

                            customSelectMenuSubCat.loadCustomSelectMenuSubCat(data);
                            customSelectMenuSubCat.events();

                            catExt = data[0].mainCatExt;
                            $('#contentFile').val("")
                            console.log($('#contentFile').val())

                            if(data[0].mainCatExt === "APK"){
                                $('#contentFileLabel').text("Only apk and xapk are allowed.");

                                if($('#screenshotsInput') != undefined)
                                    $('#screenshotsInput').remove();

                                $('#addContentBtn').parent().before(`
                                    <div class="custom-file" id="screenshotsInput">
                                        <span class="formLabel customFormLabel">Content Screenshots</span>
                                        <input type="file" id="contentScreenshots" class="contentScreenshots" name="contentScreenshots" multiple>
                                        <div class="contentScreenshotsWrapper" id="contentScreenshotsWrapper">
                                            <div class="text-center">
                                                <label type="button" class="screenshotsBtnSubmit" id="screenshotsBtnSubmit" for="contentScreenshots">
                                                    Choose Files
                                                </label>
                                                <p class="screenshotsReminder">Only png and jpg are allowed.</p>
                                            </div>
                                            <div class="screenshotsBody"></div>
                                        </div>
                                    </div>
                                `).css({marginTop: `${$('#contentScreenshotsWrapper').outerHeight() - 35}px`})

                                $('#contentScreenshots').on('change', (e) => {
                                    $.each(e.target.files, (i, img) => {
                                        screenImgArr.push(img);
                                    })
                                })
                    
                            }else if(data[0].mainCatExt === "MP4"){
                                $('#contentFileLabel').text("Only mp4 are allowed.");

                                if($('#screenshotsInput') != undefined)
                                    $('#screenshotsInput').remove();

                                $('#addContentBtn').parent().css({marginTop:"0px"})

                            }else if(data[0].mainCatExt === "MP3"){
                                $('#contentFileLabel').text("Only mp3 are allowed.");

                                if($('#screenshotsInput') != undefined)
                                    $('#screenshotsInput').remove();

                                $('#addContentBtn').parent().css({marginTop:"0px"})
                            }

                        }else{
                            // send notification no sub categories
                            let errors = [];
                            Notification.domValidate('.customSelectSubCatContainer', "No Sub Categories", errors, "selectSubCat");

                            $('#contentFileLabel').text("");

                            if($('#screenshotsInput') != undefined){
                                $('#screenshotsInput').remove();
                                $('#addContentBtn').parent().css({marginTop:0})
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
                let extInd = "";

                $.each(extCompare, (i, extC) => {
                    if(ext.includes(extC)) extInd = ext.includes(extC)
                })

                if(!extInd){
                    // file type is not png return 0
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
                                // check image if height and width is not equal to 25px
                                Notification.domValidate('#contentIcon', "Content icon dimension must be 45x45px", errors, "contentIcon");
                                // return the error or return 1
                                resolve(errors);
                            }else{
                                // if image height and width is equal 25px
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
                    const extCompare = ["xapk", "apk"]
                    let extInd = "";

                    $.each(extCompare, (i, extC) => {
                        if(ext.includes(extC)) extInd = ext.includes(extC)
                    })

                    if(!extInd){
                        Notification.domValidate('#contentFile', "Content File must be apk or xapk file extension", errors, "contentFile");
                    }else{
                        $('#contentFile').next().next().remove();
                        $('#contentFile').parent().css({marginBottom: "35px"})
                    }
                }else if(catExt == "MP3"){
                    const extInd = $.inArray("mp3", ext);

                    if(ext[extInd] != "mp3" || $('#contentFile')[0].files[0].type != "audio/mpeg"){
                        Notification.domValidate('#contentFile', "Content File must be mp3 file extension", errors, "contentFile");
                    }else{
                        $('#contentFile').next().next().remove();
                        $('#contentFile').parent().css({marginBottom: "35px"})
                    }

                }else if(catExt == "MP4"){
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
                let extInd = "";

                $.each(extCompare, (i, extC) => {
                    if(ext.includes(extC)) extInd = ext.includes(extC)
                })

                console.log(extInd)

                if(!extInd){
                    Notification.domValidate('#contentIcon', "Content Icon must be png or jpg file extension", errors, "contentIcon");
                }else{
                    $('#contentIcon').next().next().remove();
                    $('#contentIcon').parent().css({marginBottom: "35px"})
                }
            }

            return errors;
        }
        
        events(){
            $('#addContentBtn').on('click', async () => {

                const inputErrors = this.checkErrors();
                const iconError = new Promise((resolve) => this.checkIconDimension(resolve));

                const iconResult = await iconError;

                console.log(iconResult);

                // const dataForm = new FormData;
                
                // screenImgArr.forEach((img, i) =>  {
                //     dataForm.append("screenshots[]", img)
                // })

                // $.ajax({
                //     type:'POST',
                //     url:'../../../backend/addContentFn.php',
                //     data:dataForm,
                //     dataType:'text',
                //     contentType:false,
                //     processData:false,
                //     success: (data, textStatus, xhr) => {
                //         console.log(data);
                //     },
                //     error: (err) => console.log(err)
                // })
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
    customSelectMenuMainCat.events();
    
})