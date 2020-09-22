$('document').ready(function(){
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
            $.ajax({
                type:'POST',
                url:'../../../backend/addContentFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend: () => {dataForm.append('selectCat', currentCat)},
                success: function(data, textStatus, xhr){
                    if(xhr.status == 200){
                        console.log(data);
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