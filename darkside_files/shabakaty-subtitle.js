/*========================================*/
/*== Shabakaty-Subtitle - v1.0.0 - 2018 ==*/
/*==       Ahmed Mohammed Kadhum        ==*/
/*========================================*/

(function($,undefined) {
    //## Global Variables ##//
    var shabakatySubtitleVersion = '1.0.0';
    
    
    //## Default Settings ##//
    var ShabakatySubtitleDefaultSettings = {
       baseUrl: '/api/translation/',
       userCaption: 'ar'
    };
 
    //## Global Functions ##//
    // Ajax Call Function
    function ApiCall(base, url, data, callback, failCallback, decode) {
        var settings = {
            crossDomain : false,
            url : base + url,
            data : data,
            mimeType: "text/plain; charset=x-user-defined",
            method: 'GET',
            headers: {
                contentType: 'application/json'
            },
            processData: true
        };
        $.ajax(settings).done(function(data) {
            if(decode == true)
            {
                data = SubtitleEncoder.decode(data);
            }
            data = JSON.parse(data);
            if(callback) callback(data);
        }).fail(failCallback);
    }

    // Register Shabakaty Subtitle Plugin
    function registerShabakatySubtitlePlugin(options) {
        // Local Variables
        var player = this;
        var videoKey = null;
        var videoWrapper = $(this.el());
        var settings = $.extend( true, {}, ShabakatySubtitleDefaultSettings, options );

        
        var subtitleNumber = 0;
        var subtitles = [];
        var textTracks = [];
        var chunkLength = 0;

        var activeSubtitleID = null;
        var activeSubtitleLang = null;
        var activeChunkID = null;

        var currentChunkFrom = 0;
        var currentChunkTo = 0;
        var upThreshold = 0;

        var cueCurrentTime = null;
        var cuePreviousTime = null;
        var cueSeekStart = null;
        
        
        //Initialize Plugin
        function initialize() {
            //just for development silence
            //player.volume(0);

            videoKey = videoWrapper.attr('video-key');
            if(videoKey == null || videoKey == undefined)
            {
                console.error('Error in get video key.');
                return;
            }
            
            if(getSubtitles() == false) return false;

            player.on("play", function (e) {
                //console.log("Video playback started: " + cueCurrentTime);
            });
        
            player.on("pause", function (e) {
                //console.log("Video playback paused: " + cueCurrentTime);
            });

            player.on('timeupdate', function() {
                cuePreviousTime = cueCurrentTime;
                cueCurrentTime = player.currentTime();
                if (cueCurrentTime == null) {
                    cueCurrentTime = 0;
                }
                //console.log('Current Time : ' + cueCurrentTime);
                activeChunkID = parseInt(cueCurrentTime / chunkLength);

                if(activeSubtitleID == null) return;
                if(activeChunkID >= subtitles[activeSubtitleID].chunks.length) return;
                
                if(subtitles[activeSubtitleID].chunks[activeChunkID].loaded == -1)
                {
                    if(getChunk(activeChunkID) == false) alert("Error In Fetch Subtitle Chunk");
                    updateChunkTimes();
                }
                if(cueCurrentTime >= currentChunkFrom && cueCurrentTime < currentChunkTo)
                {
                    if(cueCurrentTime > upThreshold && activeChunkID != subtitles[activeSubtitleID].chunks.length)
                    {
                        getChunk(activeChunkID + 1);
                    }
                }
                else
                {
                    updateChunkTimes();
                }

            });
        
            player.on("seeking", function (e) {
                if(cueSeekStart === null) {
                    cueSeekStart = cuePreviousTime;
                }
            });
            player.ready(function () {
                //set subtitle size 50 % in mobile
                if(screen.width<700){
                    $("[aria-labelledby=captions-font-size-player_component_390]").val("0.50");
                }
            });
            player.on("seeked", function (e) {
                //console.log('seeked from', cueSeekStart, 'to', cueCurrentTime, '; delta:', cueCurrentTime - cueSeekStart);
                cueSeekStart = null;
            });
        
            player.on("ended", function (e) {
                //console.log("Video playback ended.");
            });

            player.textTracks().on("change", function () {
                activeSubtitleID = null;
                activeSubtitleLang = null;
                for (var i = 0; i < this.tracks_.length; i++){
                    if (this.tracks_[i].mode == 'showing'){
                        activeSubtitleID = i;
                        activeSubtitleLang = this.tracks_[i].label;
                    }
                }
                if(activeSubtitleID == null) console.log("Subtitle Off");
            });
        }

        function resetSubtitles() {
            subtitleNumber = 0;
            subtitles = [];
            textTracks = [];
            chunkLength = 0;

            activeSubtitleID = null;
            activeChunkID = null;

            currentChunkFrom = 0;
            currentChunkTo = 0;
            upThreshold = 0;

            previousChunk = null;
            currentChunk = null;
            nextChunk = null;

            var tracks = player.textTracks();
            for (var i = 0; i < tracks.length; i++) {
                var track = tracks[i];
                for (var j = 0; j < track.cues.length; j++) {
                    track.removeCue(track.cues[j]);
                }
            }
        }

        function getSubtitles() {
            resetSubtitles();
            ApiCall(settings.baseUrl, 'SubtitleVideo', { videokey : videoKey }, function (res) {
                subtitleNumber = res.subtitleNum;
                chunkLength = res.chunkLength;
                
                for (var i=0; i < subtitleNumber; i++){
                    subtitles.push(res.subtitles[i]);
                    if(subtitleNumber > player.textTracks().length)
                    {
                        var text = player.addTextTrack("captions", subtitles[i].langName, subtitles[i].langCode);    
                        
                        if (typeof text !== 'undefined') {
                            
                            textTracks.push(text);    
                            for (var j = 0; j < subtitles[i].chunks.length; j++) {
                                subtitles[i].chunks[j].loaded = -1;
                            }
                        }else{
                            getSubtitles();
                            return;
                        }
                    }
                }
                
                var tracks = player.textTracks();
                activeSubtitleID = null;
                for (i = 0; i < tracks.length; i++) {
                    var track = tracks[i];

                    if (track.kind == "captions" && track.language == settings.userCaption) {

                      track.mode = "showing";
                      activeSubtitleID = i;
                      activeSubtitleLang = track.label;
                    }
                }
                getChunk(0);
                return true;
            }, function (err) {
		        // handle error
                console.error("Subtitles Loading Error : " + err.responseText);
                return false;
            }, true);
        }

        function getChunk(chunkID) {
            if(activeSubtitleID == null ||chunkID >= subtitles[activeSubtitleID].chunks.length || subtitles[activeSubtitleID].chunks[chunkID].loaded != -1) return;
            var chunkKey = subtitles[activeSubtitleID].chunks[chunkID].chunkKey;
            subtitles[activeSubtitleID].chunks[chunkID].loaded = 0;
            ApiCall(settings.baseUrl, 'ChunkSubtitle', { requestkey : chunkKey }, function (res) {
                
                var tracks = player.textTracks();
                var track = tracks[activeSubtitleID];
                for (var i = 0; i < res.cues.length; i++) {
                    var cueText = res.cues[i].data.join("\r\n");
                    track.addCue(new VTTCue(res.cues[i].startTime, res.cues[i].endTime, cueText));
                }
                
                subtitles[activeSubtitleID].chunks[chunkID].loaded = 1;
                return true;
            }, function (err) {
                console.error("Subtitle Chunk Loading Error : " + err.responseText);
                subtitles[activeSubtitleID].chunks[chunkID].loaded = -1;
                return false;
            }, true);
        }

        function updateChunkTimes()
        {
            var chunkID = parseInt(cueCurrentTime / chunkLength);
            currentChunkFrom = chunkID * chunkLength;
            currentChunkTo = currentChunkFrom + chunkLength;
            upThreshold = currentChunkTo - (chunkLength/3);
        }
       
        player.shabakatySubtitle = {
            test: function(callback) {
                if(callback) callback();
            },
            version: function() {
                return shabakatySubtitleVersion;
            }
        };
        
        initialize();
    }
    
    videojs.registerPlugin('shabakatySubtitle', registerShabakatySubtitlePlugin);
 })(jQuery);


 var SubtitleEncoder = {
    // private property
    _keyStr : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

    // public method for decoding
    decode : function (input) {
      var output = "";
      var chr1, chr2, chr3;
      var enc1, enc2, enc3, enc4;
      var i = 0;
      input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

      while (i < input.length) {

        enc1 = this._keyStr.indexOf(input.charAt(i++));
        enc2 = this._keyStr.indexOf(input.charAt(i++));
        enc3 = this._keyStr.indexOf(input.charAt(i++));
        enc4 = this._keyStr.indexOf(input.charAt(i++));

        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output = output + String.fromCharCode(chr1);

        if (enc3 != 64) {
          output = output + String.fromCharCode(chr2);
        }
        if (enc4 != 64) {
          output = output + String.fromCharCode(chr3);
        }

      }

      output = SubtitleEncoder._utf8_decode(output);

      return output;

    },

    // private method for UTF-8 decoding
    _utf8_decode : function (utftext) {
      var string = "";
      var i = 0;
      var c = 0, c2 = 0, c3 = 0;

      while ( i < utftext.length ) {

        c = utftext.charCodeAt(i);

        if (c < 128) {
          string += String.fromCharCode(c);
          i++;
        }
        else if((c > 191) && (c < 224)) {
          c2 = utftext.charCodeAt(i+1);
          string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
          i += 2;
        }
        else {
          c2 = utftext.charCodeAt(i+1);
          c3 = utftext.charCodeAt(i+2);
          string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
          i += 3;
        }

      }

      return string;
    }

}
