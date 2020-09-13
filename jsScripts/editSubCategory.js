$('document').ready(function(){
    class Notification{
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

    const customSelectMenu = new CustomSelectMenu;

    customSelectMenu.loadCustomSelectMenu();
    customSelectMenu.events();
})