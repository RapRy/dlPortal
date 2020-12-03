$('document').ready(function(){
    class Notification{
        // prompt if ajax request is success
        static domNotification(elem1, notifContent, elem2){
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

                    // start code only for home js
                    // show dom 
                    $('.featuredWrapper').animate({opacity:1}, 250, "swing");
                    // set top position
                    $('.menuCategoryWrapper').animate({top:0}, 250, "swing");

                    // end code only for home js
                })
                $('.notif-container').css("transform", "scale(0)");
            })
        }
    }

    class Categories{
        constructor(){
            this.toggleCat = false
            this.viewAllToggle = false
        }

        viewAllClick(){
            $('.viewAll').on('click', (e) => {
                const contentsWrap = $(e.currentTarget).parent().parent().parent().find('.contentsWrap');
                let contents = $(e.currentTarget).parent().parent().next().children();
                let contentThumb = contents.find('img');
                let catWrapInner = $(e.currentTarget).parent().parent().parent();
                let catWrap = catWrapInner.parent().parent()

                if(!this.viewAllToggle){
                    // change text
                    $(e.currentTarget).text("minimize")

                    // set white space
                    contentsWrap.css({whiteSpace:"normal"})

                    // set width and margin bottom
                    contents.css({width:"85px", marginBottom: "10px"})
                    // set height and width
                    contentThumb.css({height:"85px", width:"85px"})
                    // add data attrib
                    catWrapInner.attr('data-view', 'active').css({marginBottom: 0});

                    // hide sub cat and its contents that has no data attrib
                    $.each($('.catWrapInner'), (i, catWrap) => {
                        if(!$(catWrap).attr('data-view')){
                            $(catWrap).css({display:"none"});
                        }
                        
                    })

                    // set margin right to each content
                    for(let i = 2; i < contents.length; i++){
                        $(contents).eq(i).css({marginRight: 0});
                    }

                    catWrap.animate({height: `${catWrapInner.parent().prev().outerHeight() + catWrapInner.parent().outerHeight()}px`}, 250, "swing")

                    this.viewAllToggle = true;

                }else{
                    // change text
                    $(e.currentTarget).text("view all")
                    // set white space
                    contentsWrap.css({whiteSpace:"nowrap"})

                    // set width and margin bottom
                    contents.css({width:"75px", marginBottom: 0})
                    // set height and width
                    contentThumb.css({height:"75px", width:"75px"})
                    // set remove data attrib
                    catWrapInner.removeAttr('data-view');

                    // set margin bottom
                    $.each(catWrapInner.parent().children('.catWrapInner'), (i, catInner) => {
                        $(catInner).css({marginBottom: "20px"})
                    })
                    // set margin bottom 0 of the last catWrapInner element
                    catWrapInner.parent().children('.catWrapInner').eq(catWrapInner.parent().children('.catWrapInner').length -1).css({marginBottom: 0})

                    // hide sub cat and its contents that has no data attrib
                    $.each($('.catWrapInner'), (i, catWrap) => {
                        $(catWrap).css({display:"block"});
                    })

                    // set margin right to each content
                    $.each(contents, (i, conts) => {
                        $(conts).css({marginRight: "15px"});
                    })

                    // set margin right 0 of the last content element
                    contents.eq(contents.length - 1).css({marginRight: 0})

                    catWrap.animate({height: `${catWrapInner.parent().prev().outerHeight() + catWrapInner.parent().outerHeight()}px`}, 250, "swing")

                    this.viewAllToggle = false;
                }
            })
        }

        scrollXEvents(){
            let mousedown = [];
            let divPosX = [];
            let scrollToLeft = [];
            let ind = 0;

            $.each($('.contentsWrap'), (i, conts) => {
                mousedown.push(false);
                divPosX.push(0);
                scrollToLeft.push(0);
            })

            $('.contentsWrap').on('mousedown', (e) => {
                // get index of selected sub cat 
                ind = $(e.currentTarget).parent().index();
                mousedown[ind] = true;
                divPosX[ind] = e.pageX - $(e.currentTarget).offset().left;
                scrollToLeft[ind] = $(e.currentTarget).scrollLeft();
                $(e.currentTarget).css({cursor:"grabbing"})

            }).on('mousemove', (e) => {
                if(!mousedown[ind]) return
                let posX = e.pageX - $(e.currentTarget).offset().left;
                let walk = (posX - divPosX[ind]) * 2;
                $(e.currentTarget).scrollLeft(scrollToLeft[ind] - walk);
            }).on('mouseup', (e) => {
                mousedown[ind] = false;
                scrollToLeft[ind] = 0;
            }).on('mouseleave', (e) => {
                mousedown[ind] = false;
                scrollToLeft[ind] = 0;
                $(e.currentTarget).css({cursor:"grab"})
            }).on('touchstart', (e) => {
                ind = $(e.currentTarget).parent().index();
                mousedown[ind] = true;
                divPosX[ind] = e.pageX - $(e.currentTarget).offset().left;
                scrollToLeft[ind] = $(e.currentTarget).scrollLeft();
                $(e.currentTarget).css({cursor:"grabbing"})
            }).on('touchmove', (e) => {
                if(!mousedown[ind]) return
                let posX = e.pageX - $(e.currentTarget).offset().left;
                let walk = (posX - divPosX[ind]) * 2;
                $(e.currentTarget).scrollLeft(scrollToLeft[ind] - walk);
            }).on('touchend', (e) => {
                mousedown[ind] = false;
                scrollToLeft[ind] = 0;
                $(e.currentTarget).css({cursor:"grab"})
            }).on('touchcancel', (e) => {
                mousedown[ind] = false;
                scrollToLeft[ind] = 0;
                $(e.currentTarget).css({cursor:"grab"})
            })
        }

        getSubCatsAndContents(catId, currentElem, catArrow){
            const dataForm = new FormData;

            $.ajax({
                type:'POST',
                url: 'backend/homeFn.php',
                data:dataForm,
                dataType:'json',
                contentType:false,
                processData:false,
                beforeSend:() => {
                    // append to form data
                    dataForm.append('catId', catId);
                    // remove dom element
                    $('.catWrapOuter').remove();
                    // set heigth
                    currentElem.parent().css({height: `${currentElem.outerHeight()}px`})
                },
                success: async (data, textStatus, xhr) => {
                    if(xhr.status === 200){
                        // data is not empty
                        if(data != null){
                            if(data[0].subCategory === null || data[0].contents.length === 0){
                                const notifContent = `
                                    <p id="noContentP">No Contents Available</p>
                                    <button type="button" class="btnGray5 globalBtn" id="noContentCloseBtn">CLOSE</button>
                                `
                                Notification.domNotification('.homeContainer', notifContent, '#noContentCloseBtn');
                            }else{
                                currentElem.parent().append(`<div class="catWrapOuter"></div>`);
                                // promise
                                let promise = new Promise((resolve) => {
                                    $.each(data, (iSub, val) => {
                                        const { subCategory, contents } = val;
    
                                        if(contents.length > 0){
                                            const { subCatId, subCatName } = subCategory;
                                            $('.catWrapOuter').append(`
                                                <div class="catWrapInner container">
                                                    <div class="subCatWrap row">
                                                        <div class="col-9">
                                                            <input type="hidden" value="${subCatId}" />
                                                            <p class="subCatTitle">${subCatName}</p>
                                                        </div>
                                                        <div class="col-3">
                                                            <span class="viewAll">view all</span>
                                                        </div>
                                                    </div>
                                                    <div class="contentsWrap"></div>
                                                </div>
                                            `)
    
                                            $.each(contents, (iCont, content) => {
                                                const { contentId, contentName, folderName, contentFileSize, contMainCatName, contentThumb } = content;
    
                                                $('.contentsWrap').eq(iSub).append(`
                                                    <div class="content">
                                                        <input type="hidden" value="${contentId}" />
                                                        <a href="pages/preview.php?content=${folderName}_${contentId}" class="contThumbWrap">
                                                            <img draggable="false" src="uploads/contents/${contMainCatName.replace(" ", "")}/${subCatName.replace(" ", "")}/${folderName}/${contentThumb}" />
                                                        </a>
                                                        <div class="contNameWrap">
                                                            <p>${contentName}</p>
                                                            <span>${contentFileSize}</span>
                                                        </div>
                                                    </div>
                                                `)
                                            })
                                        }
                                    })

                                    resolve(currentElem.next().outerHeight())
                                })

                                let result = await promise;
                                // rotate arrow animation at css
                                catArrow.css({transform: "rotate(90deg)"});
                                // set top position value
                                $('.menuCategoryWrapper').animate({top:`-${120 + $('.featuredWrapper').outerHeight()}px`}, 250, "swing");

                                $('.featuredWrapper').animate({opacity:0}, 250, "swing");
                                // set height
                                currentElem.parent().animate({height: `${result + currentElem.outerHeight()}px`}, 250, "swing")

                                this.scrollXEvents()

                                this.viewAllClick();
                            }
                        }else{
                            const notifContent = `
                                <p id="noContentP">No Contents Available</p>
                                <button type="button" class="btnGray5 globalBtn" id="noContentCloseBtn">CLOSE</button>
                            `
                            Notification.domNotification('.homeContainer', notifContent, '#noContentCloseBtn');
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        events(){
            $('.menuCategory').on('click', (e) => {
                const catId = $(e.currentTarget).children("input:first").val();
                const currentElem = $(e.currentTarget);
                const catArrow = $(e.currentTarget).find('.fa-chevron-right');

                // set to false
                if(this.viewAllToggle){
                    this.viewAllToggle = false
                }

                if(!this.toggleCat){
                    // show content
                    this.getSubCatsAndContents(catId, currentElem, catArrow);
                    // add attribute
                    currentElem.parent().attr('data-active', 'activeCat');
                    this.toggleCat = true
                }else{
                    if(currentElem.parent().attr('data-active') === 'activeCat'){
                        // if current category has data attrib
                        // close active category

                        catArrow.css({transform: "rotate(0deg)"});

                        $('.menuCategoryWrapper').animate({top:0}, 250, "swing");

                        $('.featuredWrapper').animate({opacity:1}, 250, "swing");

                        currentElem.parent().animate({height: `${currentElem.outerHeight()}px`}, 250, "swing", () => {
                            // remove dom element
                            $('.catWrapOuter').remove()
                            // remove data attribute
                            currentElem.parent().removeAttr('data-active')
                            this.toggleCat = false
                        })
                    }else{
                        // if selected category has no data attrib
                        $.each($('.catWrapper'), (i, catWrap) => {
                            // check for category that has data attrib
                            if($(catWrap).attr('data-active') === 'activeCat'){
                                // reset chevron of category that has data attrib
                                $(catWrap).find('.fa-chevron-right').css({transform: "rotate(0deg)"});
                                // set height of category that has data attrib
                                $(catWrap).animate({height: `${currentElem.outerHeight()}px`}, 250, "swing", () => {
                                    // remove data attrib of category that has data attrib
                                    $(catWrap).removeAttr('data-active');

                                    // show contents of selected category
                                    this.getSubCatsAndContents(catId, currentElem, catArrow);
                                    currentElem.parent().attr('data-active', 'activeCat');
                                    this.toggleCat = true
                                })
                            }
                        })
                    }
                }

            })
        }
    }

    const categories = new Categories;

    categories.events();
})