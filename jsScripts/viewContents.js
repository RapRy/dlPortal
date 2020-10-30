$('document').ready(function(){
    class Notification{
        static confirmNotification(msg){
			$('.viewContentsContainer').prepend(`
				<section class="notification">
					<div class="notif-container">
						<p>${msg}</p>
						<div class="twoBtnContainer container">
							<div class="row">
							<button type="button" class="btnRedConfirm twoBtnGlobal col mr-3" id="confirmBtn">
								CONFIRM
							</button>
							<button type="button" class="btnGray5 twoBtnGlobal col" id="closeBtn">
								CLOSE
							</button>
							</div>
						</div>
					</div>
				</section>
			`)
			
			// show notification
			$('.notification').fadeIn(400, "swing", () => {
				$('.notification').css("display", "flex");
				$('.notif-container').css("transform", "scale(1)");
			})
			// close btn hide notification
			$('#closeBtn').on('click', function(){
				$('.notification').fadeOut(400, "swing", () => {
					$('.notification').css("display", "none");
					$('.viewContentsContainer').children('.viewContentsContainer > :first-child').remove();
				})
				$('.notif-container').css("transform", "scale(0)");
			})
			// scroll back to top
			$('html').animate({scrollTop: 0}, 200, "swing");
        }
        
        static notifContainer(msg){
			// show notification
			$('.notif-container').html(`
				<p>${msg}</p>
				<div class="deactivateDeleteLoader">
					<div class="deactivateDeleteSpinner"></div>
				</div>
			`)
        }
        
        static removeNotif(){
			// remove the loader then show the deactivate message
			$('.deactivateDeleteLoader').remove();
			$('.notif-container').append(`<i class="fas fa-check deactivateDeleteSuccess"></i>`);
			$('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
			$('.notif-container p').text("Account succesfully deleted.");
			
			// remove the notification after timeout
			setTimeout(function(){
				$('.notification').fadeOut(400, "swing", function(){
					$('.viewContentsContainer').children(".notification").remove();
				})
				$('.notif-container').css("transform", "scale(0)");
				
			}, 2000)
		}
    }

    class Content{
        deleteContent(contentId, contentContainer, viewContentsContent){
            $('#confirmBtn').on('click', function(){
                const dataForm = new FormData;

                console.log(contentId)

                $.ajax({
                    type:'POST',
                    url: "../../../backend/deleteContent.php",
                    contentType:false,
                    processData:false,
                    data:dataForm,
                    beforeSend: () => {
                        dataForm.append('contentId', contentId);
                        Notification.notifContainer('Deleting Content..')
                    },
                    success: (data, textStatus, xhr) => {
                        if(xhr.status === 200){
                            if(data != ""){
                                Notification.removeNotif();

                                $(contentContainer).remove();

                                if($(viewContentsContent).length === 1){
                                    $(viewContentsContent).append(`<p>No Contents</p>`)
                                }
                            }
                        }
                    },
                    error:(err) => console.log(err)
                })
            })
        }

        contentEvents(){
            $('.deleteContentBtn').on('click', (e) => {

                const contentId = $(e.currentTarget).parent().parent().find('input').val();
                const contentName = $(e.currentTarget).parent().prev().find('.contentName').text();

                const contentContainer = $(e.currentTarget).parent().parent()

                const viewContentsContent = $(e.currentTarget).parent().parent().parent()

                Notification.confirmNotification(`Please tap or click on the Confirm Button to delete ${contentName}.`);

                this.deleteContent(contentId, contentContainer, viewContentsContent);
            })
        }
    }

    class SubCategories extends Content{
        constructor(){
            super()
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
                success:(data, textStatus, xhr) => {
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
                                            <a href="./editContent.php?cat=${catName}&subCat=${subCatName}&contId=${contentId}" class="btnBlueSolid btnLink editContentBtn">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button type="button" class="btnRedSolid deleteContentBtn">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                `)
                            })

                            this.contentEvents();
                        }else{
                            $(contentsParent).append(`<p>No Contents</p>`)
                        }
                    }
                },
                error:(err) => console.log(err)
            })
        }

        subCategoriesEvents(){
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

    class Search extends Content{
        searchContentName(searchValue){
            const dataForm = new FormData;
            $.ajax({
                type:'POST',
                url:"../../../backend/searchContents.php",
                data:dataForm,
                dataType: "json",
                contentType:false,
                processData:false,
                beforeSend: () => {
                    dataForm.append('searchValue', searchValue);
                },
                success: (data, textStatus, xhr) => {
                    if(xhr.status === 200){
                        if(data.length > 0){

                            $('.contentsWrapper').empty().append(`
                                <div class="viewContents">
                                    <div class="viewContentsCat">
                                        <h6>${data.length === 1 ? "Search Result" : "Search Results"}</h6>
                                    </div>
                                    <div class="viewContentsContent container"></div>
                                </div>
                            `);

                            $(data).each(function(){
                                const { contentId, contentName, catName, subCatName, folderName, contentThumb, contentFilename, contentFileSize } = this

                                $('.viewContentsContent').append(`
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
                                            <a href="./editContent.php?cat=${catName}&subCat=${subCatName}&contId=${contentId}" class="btnBlueSolid btnLink editContentBtn">
                                                <i class="fas fa-edit"></i>
                                            </a>
                                            <button type="button" class="btnRedSolid deleteContentBtn">
                                                <i class="fas fa-trash-alt"></i>
                                            </button>
                                        </div>
                                    </div>
                                `)
                            })

                            this.contentEvents();

                        }else{
                            $('.contentsWrapper').empty().append(`<p class="noResult">No Results</p>`);
                        }
                    }
                },
                error: (err) => console.log(err)
            })
        }

        searchEvents(){
            $('#searchContentForm').on('submit', (e) =>{
                e.preventDefault();
                const searchValue = $('#contentSearchInput').val()
                this.searchContentName(searchValue)
            })

            $('#contentSearchBtn').on('click', () => {
                const searchValue = $('#contentSearchInput').val()
                this.searchContentName(searchValue)
            })
        }
    }

    const content = new Content;
    const subCategories = new SubCategories;
    const search = new Search;

    content.contentEvents();
    search.searchEvents();
    subCategories.subCategoriesEvents();
    subCategories.windowLoadAddActive();
})