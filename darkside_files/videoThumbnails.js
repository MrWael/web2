
function thumbnails() {
    var videoId = $("input#videoItemNb").val();
    if(videoId){
        $.ajax({
            type:'GET',
            url:"/page/movie/VideoThumb/"+ videoId,
            success:function(data){
                
                if (data.status == 200) {
                    initThumb(data.videoThumbnails)           
                }
            }
        });
    }
}
function initThumb(spriteSheet) {
    
    var thumb ={};
    i = 0 ;
    n = 990;
    thumbObj =[];
    thumbHeight=[];
    for (index in spriteSheet){
        thumbObj.push(spriteSheet[index].sprite_url);
        thumbHeight.push(spriteSheet[index].height);
    }

    for (j =0;j< thumbObj.length;j++) {
        topThumb = 85;
        leftThumb = 60;
        clipTop = 0;
        clipBottom= 68;
        clipRight = 120;
        clipLeft = 0;
        while (i <= n) {
            thumb[i] = {
                src: thumbObj[j],
                style: {
                    left: "-" + leftThumb + "px",
                    width: '1200px',
                    height: thumbHeight[j] +"px",
                    top: "-" + topThumb + "px",
                    clip: "rect(" + clipTop + "px," + clipRight + "px," + clipBottom + "px," + clipLeft + "px)"
                }
            }
            i += 10;
            clipRight += 120;
            clipLeft += 120;

            if (Number.isInteger(i  / 100 )) {
                leftThumb = 60;
                clipTop += 68;
                clipBottom += 68;
                clipRight = 120;
                clipLeft = 0;
                topThumb += 68;
                // newLineHandler += 20;
            } else {
                leftThumb += 120;
            }
        }
        n += 1000;
    }

    videojs('player').ready(function () {
        this.thumbnails(thumb);
    });

}
