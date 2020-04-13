function dataAnalytics(arrAnalytics) {
    var obj = [{
        eventID: arrAnalytics.eventID,
        eventInt: arrAnalytics.eventInt,
        videoID: arrAnalytics.videoID,
        eventStr: arrAnalytics.eventStr,
        currentTime: Math.round(arrAnalytics.currentTime)
    }];

    if (typeof $.cookie('dataAnalytics') === 'undefined') {
        $.cookie("dataAnalytics", JSON.stringify(obj), {path: '/'});
    } else {
        var data = JSON.parse($.cookie("dataAnalytics"))
        if (data.length >= 10) {
            sendAnalyticsData();
            $.cookie("dataAnalytics", JSON.stringify(obj), {path: '/'});
        } else {
            data.push(obj[0]);
            obj = [];
            //SET
            $.cookie("dataAnalytics", JSON.stringify(data), {path: '/'});
        }
    }
    return obj;
}

function getCurrentTimeFromCookie(videoId) {
    try{

        var storedVideoID = $.cookie("CnWatchHistoryV2");
        var arr = JSON.parse(storedVideoID);
        var videoTime = 0;
        for (var i = 0; i < arr.length; i++) {
            if (videoId == arr[i].id) {
                videoTime = arr[i].videoTime;
                break;
            }
        }
        return videoTime;
    }
    catch(e)
    {
        return 0;
    }
}
function viewport() {
    var e = window
        , a = 'inner';
    if (!('innerWidth' in window)) {
        a = 'client';
        e = document.documentElement || document.body;
    }
   // var width = screen.width;
    // var height = screen.height;
    var result = e[a + 'Width'] + " X " + e[a + 'Height'];
    return {eventID: 12, eventInt: 1, eventStr: result}
}

if (typeof videojs != "undefined" && videojs != null) {
    $(window).load(function () {
        var analyticsVideoPlayer = document.getElementById("player_html5_api");
        var videoID = $("#videoItemNb").attr('value');
        var analyticsTimer = 0;
        var analyticsInterval;
        var playerTime = 0;
        var timeError = -1;
		var viewTrigger = 0;

        videojs("player").on("play", function () {


			if (viewTrigger == 0)
			{

				$.post("/page/movie/increaseNumberOfView",
				{
					id: videoID
				});
			}
			viewTrigger = 1;

		 
            if (!analyticsInterval) {
                analyticsInterval = setInterval(function () {

                    //set current player time for future check to see if the player is on glitch or not
                    var playerTimeCurrent = videojs("player").currentTime()

                    //check for time and possible glitch in player that might activate the on play event

                    if (analyticsTimer == 180 && playerTimeCurrent != playerTime) {

                        var arrAnalytics = {
                            'eventID': 0,
                            'videoID': videoID,
                            'eventInt': "1",
                            'currentTime': getCurrentTimeFromCookie(videoID)
                        };
                        dataAnalytics(arrAnalytics);
                        analyticsTimer = 0;
                        playerTime = videojs("player").currentTime();
                    }
                    analyticsTimer += 1;

                }, 1000);
            }
        });
        videojs("player").on("pause", function () {
            clearInterval(analyticsInterval);
            analyticsInterval = false;
        });
        analyticsVideoPlayer.onpause = function () {
            if (timeError != videojs("player").currentTime()) {
                arrAnalytics = {
                    'eventID': 0,
                    'videoID': videoID,
                    'eventInt': '2',
                    'currentTime': getCurrentTimeFromCookie(videoID)
                };
                dataAnalytics(arrAnalytics);
            }
        };
        var onWaitingInterval;
        analyticsVideoPlayer.onwaiting = function () {
            if (!onWaitingInterval) {
                onWaitingInterval = setTimeout(function () {
                    if (timeError != videojs("player").currentTime()) {
                        timeError = videojs("player").currentTime()
                        arrAnalytics = {
                            'eventID': 0,
                            'videoID': videoID,
                            'eventInt': '3',
                            'currentTime': getCurrentTimeFromCookie(videoID)
                        };
                        dataAnalytics(arrAnalytics);
                    }
                    clearInterval(onWaitingInterval);
                    onWaitingInterval = false;
                }, 2000)
            }
        };

        analyticsVideoPlayer.onerror = function () {
            if (timeError != videojs("player").currentTime()) {
                timeError = videojs("player").currentTime()
                arrAnalytics = {
                    'eventID': 0,
                    'videoID': videoID,
                    'eventInt': '4',
                    'currentTime': getCurrentTimeFromCookie(videoID)
                };
                dataAnalytics(arrAnalytics);

            }
        };

        videojs("player").on("play", function () {
            $('li').click(function () {
                if ($(this).text().indexOf('Arabic') >= 0) {
                    arrAnalytics = {
                        'eventID': 1,
                        'videoID': videoID,
                        'eventInt': '1',
                        'currentTime': getCurrentTimeFromCookie(videoID)
                    };
                    dataAnalytics(arrAnalytics);

                }
                if ($(this).text().indexOf('English') >= 0) {
                    arrAnalytics = {
                        'eventID': 1,
                        'videoID': videoID,
                        'eventInt': '2',
                        'currentTime': getCurrentTimeFromCookie(videoID)
                    };
                    dataAnalytics(arrAnalytics);

                }
                if ($(this).text().indexOf('captions off') >= 0) {
                    arrAnalytics = {
                        'eventID': 1,
                        'videoID': videoID,
                        'eventInt': '3',
                        'currentTime': getCurrentTimeFromCookie(videoID)
                    };
                    dataAnalytics(arrAnalytics);
                }
            });
        });
        $('.analytics').on('click', function () {
            var str = $(this).attr('data-analytics');

            if (!!document.getElementById("player")) {
                str += 'currentTime=' + getCurrentTimeFromCookie(videoID) + '|';
            }
            var result = {};
            str.split('|').forEach(function (x) {
                var arr = x.split('=');
                arr[1] && (result[arr[0]] = arr[1]);
            });
            dataAnalytics(result);

        });
    });
} else {
    $('.analytics').on('click', function () {
        var str = $(this).attr('data-analytics');
        var result = {};
        str.split('|').forEach(function (x) {
            var arr = x.split('=');
            arr[1] && (result[arr[0]] = arr[1]);
        });
        dataAnalytics(result);
    });

}

dataAnalytics(viewport());
var result = {eventID: 12, eventInt: 2, eventStr: window.screen.availHeight + " X " + window.screen.availWidth};
dataAnalytics(result);
dataAnalytics({eventID: 12, eventInt: 3, eventStr:document.referrer});
dataAnalytics({eventID: 12, eventInt: 4, eventStr:document.location.href});
$(document).on('click', '#searchIcon', function () {
        var searchValue = $("#suchenInput").val();
        var searchCount = $("#autoCompleteContainer").attr("data-count");
        dataAnalytics({eventID: 13, eventInt: searchCount, eventStr: searchValue});
});
window.onload = function () {
    var loadTime = window.performance.timing.domContentLoadedEventEnd - window.performance.timing.navigationStart;
    dataAnalytics({eventID: 12, eventInt: 5,eventStr: loadTime});
}
