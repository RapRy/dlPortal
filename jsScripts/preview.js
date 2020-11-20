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
            this.mediaType = $(mType);
        }

        mediaPlayerFn(){
            if(this.mediaType.length > 0){
                console.log(this.mediaType)
            }
        }
    }

    const screenshots = new Screenshots
    const mediaPlayer = new MediaPlayer($('.videoContainer').length > 0 ? "#video" : "#audio");
    screenshots.scrollX();
    mediaPlayer.mediaPlayerFn();
})