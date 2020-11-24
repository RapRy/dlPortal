$('document').ready(function(){
    class Screenshots{
        constructor(){
            this.mousedown = false;
            this.divPosX = 0;
            this.scrollToLeft = 0;
        }

        scrollX(){
            $('.contScreenshots').on('mousedown', (e) => {
                this.mousedown = true;
                this.divPosX = e.pageX - $(e.currentTarget).offset().left;
                this.scrollToLeft = $(e.currentTarget).scrollLeft();
                $(e.currentTarget).css({cursor:"grabbing"})
            }).on('mousemove', (e) => {
                if(!this.mousedown) return;
                let posX = e.pageX - $(e.currentTarget).offset().left;
                let walk = (posX - this.divPosX) * 2;
                $(e.currentTarget).scrollLeft(this.scrollToLeft - walk);
            }).on('mouseup', (e) => {
                this.mousedown = false;
                this.scrollToLeft = 0;
                $(e.currentTarget).css({cursor:"grab"})
            }).on('mouseleave', (e) => {
                this.mousedown = false;
                this.scrollToLeft = 0;
                $(e.currentTarget).css({cursor:"grab"})
            }).on('touchstart', (e) => {
                this.mousedown = true;
                this.divPosX = e.pageX - $(e.currentTarget).offset().left;
                this.scrollToLeft = $(e.currentTarget).scrollLeft();
                $(e.currentTarget).css({cursor:"grabbing"})
            }).on('touchmove', (e) => {
                if(!this.mousedown) return;
                let posX = e.pageX - $(e.currentTarget).offset().left;
                let walk = (posX - this.divPosX) * 2;
                $(e.currentTarget).scrollLeft(this.scrollToLeft - walk);
            }).on('touchend', (e) => {
                this.mousedown = false;
                this.scrollToLeft = 0;
                $(e.currentTarget).css({cursor:"grab"})
            }).on('touchcancel', (e) => {
                this.mousedown = false;
                this.scrollToLeft = 0;
                $(e.currentTarget).css({cursor:"grab"})
            })
        }
    }

    class MediaPlayer{
        constructor(mType){
            this.media = document.getElementById(mType)
            this.play = $('#play')
            this.stop = $('#stop')
            this.progress = $('#progress')
            this.timestamp = $('#timestamp')
        }

        mediaPlayerFn(){
            if(this.media !== undefined){
                let toggleStatus = () => (this.media.paused) ? this.media.play() : this.media.pause()
                let toggleStatusIcon = () => (this.media.paused) ? this.play.html(`<i class="fas fa-play"></i>`) : this.play.html(`<i class="fas fa-pause"></i>`);
                let updateProgress = () => {
                    this.progress.val((this.media.currentTime / this.media.duration) * 100)

                    let mins = Math.floor(this.media.currentTime / 60)
                    let secs = Math.floor(this.media.currentTime % 60)

                    if(mins < 10) mins = `0${String(mins)}`
                    if(secs < 10) secs = `0${String(secs)}`

                    this.timestamp.html(`${mins}:${secs}`)
                }

                let setVideoProgress = () => this.media.currentTime = (parseInt(this.progress.val()) * this.media.duration) / 100

                let stopVideo = () =>{
                    this.media.currentTime = 0;
                    this.media.pause()
                }

                $(this.media).on('play', toggleStatusIcon)
                $(this.media).on('pause', toggleStatusIcon)
                $(this.media).on('click', toggleStatus)
                $(this.media).on('timeupdate', updateProgress)

                this.play.on('click', toggleStatus)
                this.stop.on('click', stopVideo)
                this.progress.on('change', setVideoProgress)
            }
        }
    }

    class Reviews{
        constructor(){
            this.contentReview = $('#contentReview')
            this.reviewBtn = $('#submitReviewBtn')
            this.commentBtn = $('.commentBtn')
        }

        submitReview(){
            this.reviewBtn.on('click', () => {
                if(this.contentReview.val() === ""){
                    return;
                }else{
                    const data = new FormData($('#reviewForm')[0])
                    
                    $.ajax({
                        type:'POST',
                        url:'../backend/previewFn.php',
                        data:data,
                        dataType:'json',
                        contentType:false,
                        processData:false,
                        beforeSend:() => data.append('contentId', $('#contentId').val()),
                        success:(data, textStatus, xhr) => {
                            if(xhr.status === 200){
                                $('#contentReview').val("");

                                const { profilePicture, firstName, lastName, mobileNumber, reviewId, reviewDesc, date } = data;

                                const { month, day, year, hour, mins, ampm } = date;

                                $('.reviewsWrapper').append(`
                                    <div class="review">
                                        <div class="reviewMain row">
                                            <input type="hidden" value="${reviewId}" />
                                            <div class="reviewerThumb col-3">
                                                <img src="../uploads/avatars/${mobileNumber}/${profilePicture}" />
                                            </div>
                                            <div class="reviewerDetails col-9">
                                                <h6>${firstName} ${lastName}</h6>
                                                <p>${reviewDesc}</p>
                                                <div>
                                                    <span class="reviewDate">${month} ${day}, ${year}</span>
                                                    <span class="reviewTime">${hour}:${mins} ${ampm}</span>
                                                    <button class="commentBtn">
                                                        <i class="fas fa-comment-dots"></i>
                                                        Comment
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `)
                            }
                        },
                        error:(err) => console.log(err)
                    })
                }
            })
        }

        submitComment(){
            $('#submitCommentBtn').on('click', (e) => {            
                if($('#reviewComment').val() === ""){
                    return
                }else{
                    const data = new FormData($('#commentForm')[0])
                    const mainReviewId = $(e.currentTarget).parent().parent().parent().parent().parent().find('input').val();

                    const review = $(e.currentTarget).parent().parent().parent().parent().parent().parent();

                    console.log(review.find('.reviewSub'))

                    $.ajax({
                        type:'POST',
                        url:'../backend/previewFn.php',
                        data:data,
                        dataType:'json',
                        contentType:false,
                        processData:false,
                        beforeSend:() => {
                            data.append('contentId', $('#contentId').val())
                            data.append('reviewId', mainReviewId)

                            if(review.find('.reviewSub').length === 0){
                                review.append(`<div class="reviewSub row justify-content-end"></div>`)
                            }
                        },
                        success: (data, textStatus, xhr) => {
                            if(xhr.status === 200){
                                $('#reviewComment').val("");

                                const reviewSub = $(e.currentTarget).parent().parent().parent().parent().parent().next();

                                const { profilePicture, firstName, lastName, mobileNumber, reviewId, reviewDesc, date } = data;

                                const { month, day, year, hour, mins, ampm } = date;

                                reviewSub.append(`
                                    <div class="commentContainer col-9">
                                        <h6>${firstName} ${lastName}</h6>
                                        <p>${reviewDesc}</p>
                                        <div>
                                            <span class="reviewDate">${month} ${day}, ${year}</span>
                                            <span class="reviewTime">${hour}:${mins} ${ampm}</span>
                                        </div>
                                    </div>
                                `)
                            }
                        },
                        error: (err) => console.log(err)
                    })
                }
            })   
        }

        showCommentForm(){
            this.commentBtn.on('click', (e) => {
                if($('.commentFormContainer').length > 0){
                    $('.commentFormContainer').remove();
                }

                $(e.currentTarget).parent().parent().append(`
                    <div class="commentFormContainer">
                        <form id="commentForm" name="commentForm">
                            <div class="form-group">
                                <textarea class="form-control formInputGreen reviewComment" name="reviewComment" id="reviewComment" rows="4"></textarea>
                            </div>
                            <div class="form-group text-right">
                                <button type="button" class="btnGreenGradient reviewBtn globalBtn" id="submitCommentBtn">Post Comment</button>
                            </div>
                        </form>
                    </div>
                `)

                this.submitComment()
            })
        }
    }

    const screenshots = new Screenshots
    const mediaPlayer = new MediaPlayer($('.videoContainer').length > 0 ? "video" : "audio");
    const reviews = new Reviews

    screenshots.scrollX();
    mediaPlayer.mediaPlayerFn();
    reviews.submitReview();
    reviews.showCommentForm();
})