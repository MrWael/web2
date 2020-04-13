var flagFocusInputs=false;

$(document).ready(function(){

    $("textarea,input").on("focus",function(){
   
        flagFocusInputs=true
    })

        $("textarea,input").on("focusout",function(){
        
                flagFocusInputs=false
        })
})

$(document).keydown(function(e) {

    if(flagFocusInputs==true)
       return 0;
                       
    switch(e.which) {
        case 67: // left
            changeSubtitleByClickC()
        break;
        case 70: 
            if(videojs("player").isFullscreen()==false)
              {
                  videojs("player").requestFullscreen();
              } 
            else
               {
                   videojs("player").exitFullscreen();
               }

        break;
        case 37: // left
            currentTime=videojs("player").currentTime()
            videojs("player").currentTime(currentTime-5.0)
        break;

        case 39: // right
            currentTime=videojs("player").currentTime()
            videojs("player").currentTime(currentTime+5.0)
        break;
        default: return; // exit this handler for other keys
    }
    e.preventDefault(); // prevent the default action (scroll / move caret)
});