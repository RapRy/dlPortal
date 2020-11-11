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
        }

        contentClickEvent(){
            $('.contThumbWrap').on('click', (e) => {
                console.log(e.currentTarget);
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
                this.contentClickEvent();
                $(e.currentTarget).css({cursor:"grab"})
            }).on('touchstart', (e) => {
                ind = $(e.currentTarget).parent().index();
                mousedown[ind] = true;
                divPosX[ind] = e.pageX - $(e.currentTarget).offset().left;
                scrollToLeft[ind] = $(e.currentTarget).scrollLeft();
                $(e.currentTarget).css({cursor:"grabbing"})
            }).on('touchend', (e) => {
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
                                                        <div class="contThumbWrap">
                                                            <img draggable="false" src="uploads/contents/${contMainCatName.replace(" ", "")}/${subCatName.replace(" ", "")}/${folderName}/${contentThumb}" />
                                                        </div>
                                                        <div class="contNameWrap">
                                                            <p>${contentName}</p>
                                                            <span>${String(contentFileSize).substring(0, 2)} mb</span>
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

                                this.contentClickEvent();
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