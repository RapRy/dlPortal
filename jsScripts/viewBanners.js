$('document').ready(function(){

    $('.bannerContainer').each((i, bannerContainer) => {
        $(bannerContainer).children('.bannerImgContainer').height($(bannerContainer).find('img').height());
    })

    function deleteBanner(featureId, imageName, bannerContainer, viewBanners){
        $('#confirmBtn').on('click', () => {
            const dataForm = new FormData;

            $.ajax({
                type:'POST',
                url:"../../../backend/deleteBanner.php",
                contentType:false,
                processData:false,
                data:dataForm,
                beforeSend: () => {
                    dataForm.append('featureId', featureId)
                    dataForm.append('image', imageName)
                    $('.notif-container').html(`
                        <p>Deleting Banner..</p>
                        <div class="deactivateDeleteLoader">
                            <div class="deactivateDeleteSpinner"></div>
                        </div>
                    `)
                },
                success: (data, textStatus, xhr) => {
                    if(xhr.status === 200){
                        if(data != ""){
                            $('.deactivateDeleteLoader').remove();
                            $('.notif-container').append(`<i class="fas fa-check deactivateDeleteSuccess"></i>`);
                            $('.deactivateDeleteSuccess').css({display:"none"}).fadeIn(400, "swing");
                            $('.notif-container p').text("Account succesfully deleted.");

                            setTimeout(function(){
                                $('.notification').fadeOut(400, "swing", function(){
                                    $('.viewContentsContainer').children(".notification").remove();
                                })
                                $('.notif-container').css("transform", "scale(0)");
                                
                            }, 2000)

                            $(bannerContainer).remove()

                            console.log($(viewBanners))

                            if($(viewBanners).children().length === 1)
                                $(viewBanners).append(`<p>No Contents</p>`)
                        }
                    }
                },
                error:(err) => console.log(err)
            })
        })
    }

    $('.deleteBannerBtn').on('click', function(){
        const featureId = $(this).prev().prev().prev().val();
        const imageName = $(this).prev().prev().val();
        const bannerContainer = $(this).parent().parent();
        const viewBanners = $(this).parent().parent().parent();

        $('.viewBannersContainer').prepend(`
            <section class="notification">
                <div class="notif-container">
                    <p>Please tap or click on the Confirm Button to delete the banner</p>
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

        $('.notification').fadeIn(400, "swing", () => {
            $('.notification').css("display", "flex");
            $('.notif-container').css("transform", "scale(1)");
        })
        
        $('#closeBtn').on('click', function(){
            $('.notification').fadeOut(400, "swing", () => {
                $('.notification').css("display", "none");
                $('.viewContentsContainer').children('.viewContentsContainer > :first-child').remove();
            })
            $('.notif-container').css("transform", "scale(0)");
        })
        
        $('html').animate({scrollTop: 0}, 200, "swing");

        deleteBanner(featureId, imageName, bannerContainer, viewBanners);
    })
})