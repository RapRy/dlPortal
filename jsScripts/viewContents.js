$('document').ready(function(){
    class SubCategories{
        constructor(){
            this.subCatBtns = $('.subCatBtn')
        }

        windowLoadAddActive(){
            $('.viewContentsSubCat').each(function(){
                if($(this).children('.subCatBtn:first').length > 0)
                    $(this).children('.subCatBtn:first').addClass('activeSub')
            })
        }

        showContents(catId, subCatId, contentsParent, catName, subCatName){
            const dataForm = new FormData;
            
            $.ajax({
                type:'POST',
                url:'../../../backend/fetchContents.php',
                data:dataForm,
                dataType: 'json',
                contentType:false,
                processData:false,
                beforeSend: function(){
                    dataForm.append('catId', catId)
                    dataForm.append('subCatId', subCatId)
                },
                success:function(data, textStatus, xhr){
                    if(xhr.status === 200){
                        $(contentsParent).children('a').attr('href', `addContent.php?cat=${catName.replace(" ", "+")}&subCat=${subCatName.replace(" ", "+")}`);

                        if(data.length > 0){
                            $(data).each(function(){
                                const { contentId, contentName, folderName, contentThumb, contentFilename, contentFileSize } = this
                                $(contentsParent).append(`
                                    <div class="contentContainer row align-items-center">
                                        <input type="hidden" value="${contentId}" />
                                        <div class="contentNameCont col-7">
                                            <p class="contentName">${contentName}</p>
                                            <p class="contentFilesize">File Size: ${String(contentFileSize).substring(0, 2)}</p>
                                        </div>
                                        <div class="contentCta col-5">
                                            <a href="" class="btnBlueSolid btnLink contentPreviewBtn">
                                                <i class="fas fa-eye"></i>
                                            </a>
                                            <a href="" class="btnBlueSolid btnLink editContentBtn">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button type="button" class="btnRedSolid deleteContentBtn">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                `)
                            })
                        }else{
                            $(contentsParent).append(`<p>No Contents</p>`)
                        }
                    }
                },
                error:(err) => console.log(err)
            })
        }

        events(){
            this.subCatBtns.on('click', async (e) => {
                // console.log($(e.currentTarget).parent().children());
                const siblings = $(e.currentTarget).parent().children();
                const parent = $(e.currentTarget).parent();
                const contents = $(e.currentTarget).parent().next().children(':not(a)');
                const contentsParent = $(e.currentTarget).parent().next();
                const catId = $(e.currentTarget).parent().prev().children('input').val();
                const subCatId = $(e.currentTarget).children('input').val();
                const catName = $(e.currentTarget).parent().prev().children('h6').text();
                const subCatName = $(e.currentTarget).children('p').text();

                if($(e.currentTarget).hasClass('activeSub')){
                    return;
                }else{
                    if(siblings.length > 0){
                        siblings.each(function(){
                            $(this).removeClass('activeSub')
                        })

                        $(e.currentTarget).addClass('activeSub')

                        let promise = new Promise((resolve) => {
                            contents.each(function(){
                                $(this).animate({opacity:0}, 300, "swing", function(){
                                    if($(this).is(':last-child')){
                                        resolve(true)
                                    }
                                    $(this).remove()
                                })
                            })
                        })

                        let result = await promise;

                        if(result) this.showContents(catId, subCatId, contentsParent, catName, subCatName)
                    }
                }
            })
        }
    }

    const subCategories = new SubCategories;

    subCategories.events();
    subCategories.windowLoadAddActive();
})