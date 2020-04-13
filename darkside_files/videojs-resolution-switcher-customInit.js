
function resolutionSwitcher() {
    var videoId = document.getElementById("videoItemNb").value
    var resolutionObject =[];
    var eventInt = 1;
    $('video source').each(function (num, val) {
        if ($(this).attr('class') == 'mp4') {
            
            var url = $(this).attr('src');
            var datares = $(this).attr('data-res');
            var isCast = $(this).attr('data-cast');
            var res = $(this).attr('res');
            if ((navigator.userAgent.indexOf("PlayStation") === -1 && (datares !== '1080p' && (datares !== '720p' || isCast ==='1' ))) ) {
                
                var dataAnalytics = 'data-analytics="|eventID=2|videoID=' + videoId + '|eventInt=' + eventInt++ + '|" ';
                    resolutionObject.push({
                        src: url,
                        type:'video/mp4',
                        label: datares,
                        res:res
                    });
            }
        }
        $(this).remove();
    });
    videojs('player').ready(function () {
        this.videoJsResolutionSwitcher({
        default: 'low', // Default resolution [{Number}, 'low', 'high'],
        dynamicLabel: false,
        updateSrc: function (e) {
                return resolutionObject;
            }
        });
    });
}
