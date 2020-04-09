$(function () {
    
    var SETTINGS = {
        navBarTravelling: false,
        navBarTravelDirection: "",
         navBarTravelDistance: 150
    }
    
    
    document.documentElement.classList.remove("no-js");
    document.documentElement.classList.add("js");
    
    // Out advancer buttons
    var pnAdvancerLeft = document.getElementById("pnAdvancerLeft");
    var pnAdvancerRight = document.getElementById("pnAdvancerRight");
    
    var pnProductNav = document.getElementById("pnProductNav");
    var pnProductNavContents = document.getElementById("pnProductNavContents");
    
    pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    
    // Set the indicator
    
    // Handle the scroll of the horizontal container
    var last_known_scroll_position = 0;
    var ticking = false;
    
    function doSomething(scroll_pos) {
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    }
    
    pnProductNav.addEventListener("scroll", function() {
        last_known_scroll_position = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(function() {
                doSomething(last_known_scroll_position);
                ticking = false;
            });
        }
        ticking = true;
    });
    
    
    pnAdvancerLeft.addEventListener("click", function() {
        // If in the middle of a move return
        if (SETTINGS.navBarTravelling === true) {
            return;
        }
        // If we have content overflowing both sides or on the left
        if (determineOverflow(pnProductNavContents, pnProductNav) === "left" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
            // Find how far this panel has been scrolled
            var availableScrollLeft = pnProductNav.scrollLeft;
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollLeft < SETTINGS.navBarTravelDistance * 2) {
                pnProductNavContents.style.transform = "translateX(" + availableScrollLeft + "px)";
            } else {
                pnProductNavContents.style.transform = "translateX(" + SETTINGS.navBarTravelDistance + "px)";
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
            // Update our settings
            SETTINGS.navBarTravelDirection = "left";
            SETTINGS.navBarTravelling = true;
        }
        // Now update the attribute in the DOM
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    });
    
    pnAdvancerRight.addEventListener("click", function() {
        // If in the middle of a move return
        if (SETTINGS.navBarTravelling === true) {
            return;
        }
        // If we have content overflowing both sides or on the right
        if (determineOverflow(pnProductNavContents, pnProductNav) === "right" || determineOverflow(pnProductNavContents, pnProductNav) === "both") {
            // Get the right edge of the container and content
            var navBarRightEdge = pnProductNavContents.getBoundingClientRect().right;
            var navBarScrollerRightEdge = pnProductNav.getBoundingClientRect().right;
            // Now we know how much space we have available to scroll
            var availableScrollRight = Math.floor(navBarRightEdge - navBarScrollerRightEdge);
            // If the space available is less than two lots of our desired distance, just move the whole amount
            // otherwise, move by the amount in the settings
            if (availableScrollRight < SETTINGS.navBarTravelDistance * 2) {
                pnProductNavContents.style.transform = "translateX(-" + availableScrollRight + "px)";
            } else {
                pnProductNavContents.style.transform = "translateX(-" + SETTINGS.navBarTravelDistance + "px)";
            }
            // We do want a transition (this is set in CSS) when moving so remove the class that would prevent that
            pnProductNavContents.classList.remove("pn-ProductNav_Contents-no-transition");
            // Update our settings
            SETTINGS.navBarTravelDirection = "right";
            SETTINGS.navBarTravelling = true;
        }
        // Now update the attribute in the DOM
        pnProductNav.setAttribute("data-overflowing", determineOverflow(pnProductNavContents, pnProductNav));
    });
    
    pnProductNavContents.addEventListener(
        "transitionend",
        function() {
            // get the value of the transform, apply that to the current scroll position (so get the scroll pos first) and then remove the transform
            var styleOfTransform = window.getComputedStyle(pnProductNavContents, null);
            var tr = styleOfTransform.getPropertyValue("-webkit-transform") || styleOfTransform.getPropertyValue("transform");
            // If there is no transition we want to default to 0 and not null
            var amount = Math.abs(parseInt(tr.split(",")[4]) || 0);
            pnProductNavContents.style.transform = "none";
            pnProductNavContents.classList.add("pn-ProductNav_Contents-no-transition");
            // Now lets set the scroll position
            if (SETTINGS.navBarTravelDirection === "left") {
                pnProductNav.scrollLeft = pnProductNav.scrollLeft - amount;
            } else {
                pnProductNav.scrollLeft = pnProductNav.scrollLeft + amount;
            }
            SETTINGS.navBarTravelling = false;
        },
        false
    );
    
    
    
    
    function determineOverflow(content, container) {
        var containerMetrics = container.getBoundingClientRect();
        var containerMetricsRight = Math.floor(containerMetrics.right);
        var containerMetricsLeft = Math.floor(containerMetrics.left);
        var contentMetrics = content.getBoundingClientRect();
        var contentMetricsRight = Math.floor(contentMetrics.right);
        var contentMetricsLeft = Math.floor(contentMetrics.left);
         if (containerMetricsLeft > contentMetricsLeft && containerMetricsRight < contentMetricsRight) {
            return "both";
        } else if (contentMetricsLeft < containerMetricsLeft) {
            return "left";
        } else if (contentMetricsRight > containerMetricsRight) {
            return "right";
        } else {
            return "none";
        }
    }
    
    
    });
    
    
    $(function () {
        'use strict';
        var conditionQuery = new Object();
        var scrolled = false; 
        var scrollLock = false;
        var baseUrl ="/page/movie/";
        var currentURL = window.location.href;
        var dropdownInit = false;
        var lang  =window.location.pathname.split('/')[4];
        $(".video-tags span").one("click",function () {
            if (dropdownInit == false) {
                dropdownInit = true;
                $.ajax({
                    url: "/page/movie/GetSortOption/"+ lang,
                    method: 'GET'
                }).done(function(data) {
                    buildOrderDropDownList(data);
                });
            }
            
        });

        $(document).on('touchstart  tap click',".dropdown-menu .sort-filter",function(){
            $(".dropdown-menu .sort-filter").removeClass('active');
            $(this).addClass("active");
            $('.movie-item-responsive').fadeOut("slow", function(){$(this).remove();});
            conditionQuery.selectedTag= videoTags();
            conditionQuery.orderTags = $(this).attr("data-sort");
            conditionQuery.lastOffset= 0;
            conditionQuery.videoKind = window.location.pathname.split('/')[5];
            $("#sort-by").text($(".sort-filter.active").text());
            apiCall(conditionQuery, baseUrl + "TagsSelect/"+ lang);    
        });

        function searchTagInArray(value,array){
            for(var i=0;i<array.length;i++)
            {
                if(array[i]==value)
                {
                    return i;
                }
            }
            return -1
        } 
        
        function storeTagInCookis(val){
                   
                    val=val.trim()
                    if(val.length==0)
                        retrun ;  
                    
                    var tagsArr = $.cookie(tagPrefix);
                    //$.cookie("SearchDataItemsArr",JSON.stringify(""));
                    $.removeCookie(tagPrefix)
                    var dataArray=[];
                    
                    if (typeof tagsArr !== "undefined") {
                        dataArray = JSON.parse(tagsArr);
                        if(searchTagInArray(val,dataArray)==-1)
                        {
                        
                            dataArray.push(val)
                        
                            console.log(dataArray)
                            $.cookie(tagPrefix,JSON.stringify(dataArray),{ expires:3600, path: location.href });
                        }
                    }else{
                     
                        dataArray.push(val)
                        $.cookie(tagPrefix,JSON.stringify([]),{ expires:3600, path: location.href });
                        $.cookie(tagPrefix,JSON.stringify(dataArray),{ expires:3600, path: location.href });
                    }
                    
                    
        }
        function removeTagItem(value){
           
            var tagsArr = $.cookie(tagPrefix);
            //$.cookie("SearchDataItemsArr",""); 
     
            $.removeCookie(tagPrefix)
            
            var dataArray = JSON.parse(tagsArr);
          
             var index=searchTagInArray(value,dataArray)
             dataArray.splice(index, 1);
             
            $.cookie(tagPrefix,JSON.stringify(dataArray),{expires:3600,path: location.href });
            
        }  
        //----------get tags from cookies
        var flagClickTag=false
        var tagPrefix="tagPrefix"
        $(document).ready(function(){
            checkTags()
            
        })
        window.addEventListener('popstate', function (e) {
            if(location.href.search("clickTags=true")==-1)
            {
                $.cookie(tagPrefix,JSON.stringify([]),{ expires:3600, path: location.href });
                location.reload()
            }            
        })
        function checkTags(){
            

                if(location.href.search("clickTags=true")!=-1)
                {   
                    var tagsArr = $.cookie(tagPrefix);
                    
                    var dataArray;
                    if (typeof tagsArr !== "undefined" ) {
                        var dataArray = JSON.parse(tagsArr);
                        for(var i=dataArray.length-1;i>=0;i--)
                        {
                            $("#"+dataArray[i]).click()

                        }
                     
                    }
               }else{
                  
                $.cookie(tagPrefix,JSON.stringify([]),{ expires:3600, path: location.href });
                
               }
               flagClickTag=true 
        }

    
          

        
        $(".video-tags span").on("click",function () {
            
            $('.movie-item-responsive,.pull-right,.pagination').fadeOut("slow", function(){$(this).remove();});

            if ($(this).hasClass("tags-selected")) {
                $(this).removeClass("tags-selected");
                removeTagItem($(this).attr("id"))
                conditionQuery.selectedTag = videoTags();
                
                conditionQuery.videoKind = window.location.pathname.split('/')[5];
                
            }else{
                $(this).addClass("tags-selected");
                if(flagClickTag==true)
                {
                    if(location.href.search("clickTags=true")==-1)
                        location.href+="#?clickTags=true"
                     storeTagInCookis($(this).attr("id"))
                }
                 
                conditionQuery.selectedTag= videoTags();
                conditionQuery.lastOffset= 0;
                conditionQuery.videoKind = window.location.pathname.split('/')[5];
                
            }

            if (conditionQuery.selectedTag.length > 0) {
                
                apiCall(conditionQuery, baseUrl + "TagsSelect/"+ lang);    
            }else{
                window.location.replace(currentURL);
            }

        });

        $(window).scroll(function(){
            if(!scrollLock){
                var scrollTop = $(document).scrollTop();
                var windowHeight = $(window).height();
                var bodyHeight = $(document).height() - windowHeight;
                var scrollPercentage = (scrollTop / bodyHeight);
                conditionQuery.lastOffset = $('.video-tags').attr('data-id');
                
                if(!scrolled && scrollPercentage > 0.9 && conditionQuery.lastOffset != 0){
                    scrolled = true;
                
                    $("#owloadgif").show();
                    apiCall(conditionQuery, baseUrl + "TagsSelect/" + lang);
                    $( document ).ajaxStop(function(){
                        scrolled = false;                    
                    });
                }
        }
        });

        function buildOrderDropDownList(sortOptions){
            var dropdown = "<div  style='padding:10px;margin-right: 5%;float: right;'>"  
            dropdown += '<div class="dropdown" >'
            dropdown +='<button class="btn btn-secondary dropdown-toggle" style="color:white" type="button" id="sort-by" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">'
            dropdown += "Sort By"
            dropdown +='<span class="caret"></span>'
            dropdown +='</button>'
            dropdown += '<ul class="dropdown-menu" aria-labelledby="sort-by">'
            for (var i in sortOptions) {
                var element = sortOptions[i]['caption'];
                var value = sortOptions[i]['value'];
                if (value == 'r_desc') {
                    dropdown +='<li class="sort-filter active" data-sort="'+value +'">'+element+'</li>'    
                }else{
                    dropdown +='<li class="sort-filter" data-sort="'+value +'">'+element+'</li>'   
                }
                
            }
           
            dropdown +='</ul>'
            dropdown +='</div>'
            dropdown +='</div>'
            $('.pn-ProductNav_Wrapper').after(dropdown);
        }    
        function videoTags() {
            var videoTagsSelected = [];
            $(".video-tags span.tags-selected").each(function (index,element) {
               
                videoTagsSelected.push($(element).attr("id")); 
                
            });
            return videoTagsSelected;
        }
        function apiCall(tagsID,url) {
            
            var settings = {
                url : url,
                data : tagsID ,
                method: 'GET'
            };
            
                $.ajax(settings).done(function(data) {
                    
                    
                    if (data['info'].length > 0) {                        
                        buildItems(data);
                    }else{
                        
                        scrollLock = true;
                        
                    }
                });     
            
                 
                $("#owloadgif").hide();
            
        }
        function buildItems(data) {
            var totalCard=[];
            var notifyClass ="";
            $(".video-tags").attr("data-id",data.lastOffset);
            var isRtl  = location.pathname.search('ar');
            var lang = "en";
            if (isRtl === -1) {
                 lang = "en";
            }else{
                 lang = "ar";
            }
            var result = data.info
            for (var i in result) {
                var itemBuild = '<div class="col-lg-3 col-md-4 col-sm-4  col-xs-6  movie-item-responsive " style="display: none;">'
                var videoTitle = "";
                if (result[i].kind == 2) {
                    if (lang == "ar") {
                        videoTitle = result[i].ar_title;
                    }
                    else {
                        videoTitle = result[i].en_title;
                    }
                }
                else {
                    if (lang == "ar") {
                        videoTitle = result[i].ar_title
                    }
                    else {
                        videoTitle = result[i].en_title
                    }
                }
                if ($.cookie("token")) {
                    notifyClass = "notify";
                }
                itemBuild += '<div class="item analytics '+ notifyClass +' "  data-analytics="|eventID=6|eventInt=1|videoID='+result[i].nb +'|">'
                itemBuild += '<div class="featuredContent">'
                itemBuild +='<a id="'+ result[i].nb +'" class="cast watchLaterBtnV2  analytics" data-analytics="|eventID=6|eventInt=2|videoID=' +result[i].nb+'|">'
                itemBuild +='<i class="themeum-moviewclock "></i>'
                itemBuild += '</a></div>'
                itemBuild += '<div class="movie-poster"><a><img  class="item-responsive" src="' + result[i].imgMediumThumbObjUrl + '" alt=""></a></div>'
                itemBuild += '<a href="/page/movie/watch/' + lang + '/' + result[i].nb + '" class="play-icon" onclick="event.stopPropagation();" window.event.cancelBubble = "true">'
                itemBuild += '<i class="themeum-moviewplay" style="font-size: 40px;">'
                itemBuild += '</i>'
                itemBuild += '</a>'
                itemBuild += '<div class="content-wrap">'
                itemBuild += '<div class="video-container">'
                itemBuild += '</div>'
                itemBuild += '</div>'
                itemBuild += '<div class="movie-details" style="text-align:left;">'
                    if (result[i].parent_skipping == '1'){
                        itemBuild += '<div class="moview-rating-wrapper">'
                        itemBuild += '<span class="moview-rating-summary">'
                        itemBuild +='<span  class="parentalResponsive"></span>'
                        itemBuild +='</span>'
                        itemBuild += '</div>'
                    }
                itemBuild += '<div class="movie-name">'
                itemBuild += '<h2 class="movie-title" style="font-size: 18px"><a>' + videoTitle + '</a></h2>'
                itemBuild += '</div>'
                itemBuild += '<div class="moview-rating-wrapper">'
                itemBuild += ' <div class="moview-rating">'
                itemBuild += '<span class="star active" style="padding:0px"></span>'
                itemBuild += '</div>'
                itemBuild += '<span class="moview-rating-summary" style="padding:0px">'
                itemBuild += '<span>'+result[i].stars+'</span>'
                itemBuild += '/10</span>'
                itemBuild += '</div>'
                itemBuild += '</div>'
                itemBuild += '</div>'
                itemBuild += '</div>'
                
                totalCard.push(itemBuild);
            }
            
            $(".movie-featured").append(totalCard);
            var $newCards = $(".movie-item-responsive");
            $newCards.show('slow');
        }
        

    });

