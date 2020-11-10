$('document').ready(function(){
    class Categories{
        constructor(){
            this.toggleCat = false
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
                    dataForm.append('catId', catId);
                    $('.catWrapOuter').remove();
                },
                success: (data, textStatus, xhr) => {
                    if(xhr.status === 200){
                        console.log(data)
                        if(data != null){
                            if(data[0].subCategory === null || data[0].contents.length === 0){
                                currentElem.parent().append(`
                                    <div class="noData">
                                        <p>no data temporary error message</p>
                                    </div>
                                `)
                            }else{
                                const offsetTop = currentElem.parent().offset();

                                catArrow.css({transform: "rotate(90deg)"});

                                currentElem.parent().append(`<div class="catWrapOuter"></div>`);

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
                                                        <img src="uploads/contents/${contMainCatName.replace(" ", "")}/${subCatName.replace(" ", "")}/${folderName}/${contentThumb}" />
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
                            }
                        }else{
                            currentElem.parent().append(`
                                <div class="noData">
                                    <p>no data temporary error message</p>
                                </div>
                            `)
                        }
                        // const { subCategories, contents } = data;
                        // const offsetTop = currentElem.parent().offset();

                        // catArrow.css({transform: "rotate(90deg)"});

                        // if(subCategories === null && contents === null){
                        //     currentElem.parent().append(`
                        //         <div class="noData">
                        //             <p>no data temporary error message</p>
                        //         </div>
                        //     `)
                        // }else{
                        //     currentElem.parent().append(`<div class="catWrapOuter"></div>`)

                        //     $.each(subCategories, function(iSub, subcat){
                        //         const { subCatId, subCatName } = subcat;
                                
                        //         $('.catWrapOuter').append(`
                        //             <div class="catWrapInner container">
                        //                 <div class="subCatWrap row">
                        //                     <div class="col-9">
                        //                         <input type="hidden" value="${subCatId}" />
                        //                         <p class="subCatTitle">${subCatName}</p>
                        //                     </div>
                        //                     <div class="col-3">
                        //                         <span class="viewAll">view all</span>
                        //                     </div>
                        //                 </div>
                        //                 <div class="contentsWrap"></div>
                        //             </div>
                        //         `)


                        //         $.each(contents, (iCon, content) => {
                        //             const { contentId, contentName, folderName, contentFileSize, contSubCatName, contSubCatId, contMainCatName } = content;

                        //             if(subCatId === contSubCatId){
                        //                 $('.contentsWrap').eq(iSub).append(`
                        //                     <h1>${contentName}</h1>
                        //                 `)
                        //             }
                        
                        //         })
                        //     })
                        // }
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
                this.getSubCatsAndContents(catId, currentElem, catArrow);
            })
        }
    }

    const categories = new Categories;

    categories.events();
})