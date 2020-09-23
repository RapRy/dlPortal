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

            this.getSubCategories($(currentElem).text());
            
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
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200){
                        if(data.length > 0){
                            if($('.customSelectSubCatContainer').next("small")){
                                $('.customSelectSubCatContainer').next().remove();
                            }
                            customSelectMenuSubCat.loadCustomSelectMenuSubCat(data);
                            customSelectMenuSubCat.events();
                        }else{
                            // send notification no sub categories
                            let errors = [];
                            Notification.domValidate('.customSelectSubCatContainer', "No Sub Categories", errors, "selectSubCat");
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

    const customSelectMenuMainCat = new CustomSelectMenuMainCat;

    customSelectMenuMainCat.loadCustomSelectMenu();
    customSelectMenuMainCat.events();
    
})