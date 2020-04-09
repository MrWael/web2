function buildRecommendedPage(result) {
    
    var isRtl  = location.pathname.search('ar');
    if (isRtl === -1) {
        var lang = "en";
    }else{
        var lang = "ar";
    }
    var itemBuild ="";    
    for (i in result) {
        itemBuild += '<div class="col-lg-3 col-md-4 col-sm-4  col-xs-6  movie-item-responsive">';
        var videoTitle = "";
        
        if (lang === "en") {
            videoTitle = videoTitle = result[i].en_title;
        }
        else {
            videoTitle = result[i].ar_title;
        }
        itemBuild += builder(result[i],videoTitle,lang);
        itemBuild +='</div>';
    }


    return itemBuild;
}

function buildRecommendedSlider(owlObject,result) {
    
    var isRtl  = location.pathname.search('ar');
    if (isRtl === -1) {
        var lang = "en";
    }else{
        var lang = "ar";
    }

    var itemBuild ='<section id="nav_recommended" class="section scroll-item main bg_color transition-cnt" title="recommended items" style="background: #191919;padding:0">';
    itemBuild += '<h2 class="text-center featured-films" >'
    itemBuild += '<span class="line">'
                     
    if (lang === "en") {
        itemBuild += 'Recommended '
    } else {
        itemBuild += 'الفديوهات الموصى بها'
    }
    itemBuild += '<a class="video-collection"  href="/page/movie/Recomended">'
    itemBuild += '<span class="view-all" dir="rtl"><i class="fa fa-angle-double-right"></i>'
    itemBuild += 'view all'
    itemBuild += '</span>';
    itemBuild += '</a>';
    itemBuild += '</span>';
    itemBuild += '</h2>';
    itemBuild += '<div class="container_custom">';
    itemBuild += '<div id="post-68" class="post-68 page type-page status-publish hentry analytics" data-analytics="|eventID=5|eventInt=50|">';

    itemBuild +='<div class="entry-content">';
    itemBuild +='<div data-vc-full-width="true" data-vc-full-width-init="false" data-vc-stretch-content="true"'+
                    ' class="vc_row wpb_row vc_row-fluid container-fullwidth vc_custom_1455700416777 vc_row-no-padding">';
    itemBuild +='<div class="wpb_column vc_column_container vc_col-sm-12">';
    itemBuild += '<div class="vc_column-inner vc_custom_1455700439913">';
    itemBuild += '<div class="wpb_wrapper">';
    itemBuild += '<div id="moview-movie" style="visibility: hidden;" class="moview-movie-featured slideContainer">';
    itemBuild += '<div id="recommended" class="row-fluid">';
    itemBuild += '<div class="movie-featured ' + owlObject + '" data-api="' + owlObject + '" data-page="1">';
    

    itemBuild += carouselTemplate(result,lang);
    
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '</div>';
    itemBuild += '<div class="vc_row-full-width vc_clearfix"></div>'
    itemBuild += '</div>'
    itemBuild += '</div>'
    itemBuild += '</div>';
    itemBuild += '</section>'
    return itemBuild;
}


function buildRelatedVideo(owlObject,result) {
    var itemBuild = '<div class="movie-featured ' + owlObject + '" data-api="' + owlObject + '" data-page="1">'
    var isRtl  = location.pathname.search('ar');
    
    if(isRtl === -1){ 
        var lang = "en";
    }else{
        var lang = "ar";
    }
    itemBuild += carouselTemplate(result,lang);
    
    itemBuild += '</div>'

    return itemBuild;
}

function carouselTemplate(result,lang) {
    var buildTemplate = "";
    for (i in result) {
        var videoTitle = "";
        
        if (lang === "en") {
            videoTitle = videoTitle = result[i].en_title;
        }
        else {
            videoTitle = result[i].ar_title;
        }
        buildTemplate += builder(result[i],videoTitle,lang);
    }
    return buildTemplate;
}

function builder(result,videoTitle,lang) {
    var build = '';
    if ($.cookie("token")) {
        var notifyClass = "notify";
    }
    build += '<div class="item analytics '+notifyClass +'"  data-analytics="|eventID=6|eventInt=1|videoID='+result.nb +'|">'
    build += '<div class="featuredContent">'
    build +='<a id="'+ result.nb +'" class="cast watchLaterBtnV2  analytics" data-analytics="|eventID=6|eventInt=2|videoID='+result.nb +'|">'
    build +='<i class="themeum-moviewclock "></i>'
    build += '</a></div>'
    build += '<div class="movie-poster"><a><img style="width:100%" class="item-responsive " src="' + result.imgMediumThumbObjUrl + '" data-src="'+result.imgMediumThumbObjUrl +'"  alt="'+ videoTitle+'"></a></div>'
    build += '<a href="/page/movie/watch/' + lang + '/' + result.nb + '" class="play-icon" onclick="event.stopPropagation();" window.event.cancelBubble = "true">'
    build += '<i class="themeum-moviewplay" style="font-size: 40px;">'
    build += '</i>'
    build += '</a>'
    build += '<div class="content-wrap">'
    build += '<div class="video-container">'
    build += '</div>'
    build += '</div>'
    build += '<div class="movie-details" style="text-align:left;">'
    if (result.parent_skipping == '1'){
        build += '<div class="moview-rating-wrapper">'
        build += '<span class="moview-rating-summary">'
        build +='<span class="parentalResponsive" "></span>'
        build +='</span>'
        build += '</div>'
    }
    build += '<div class="movie-name">'
    build += '<h2 class="movie-title" style="font-size: 18px"><a>' + videoTitle + '</a></h2>'
    build += '</div>'
    build += '<div class="moview-rating-wrapper">'
    build += ' <div class="moview-rating">'
    build += '<span class="star active" style="padding:0px"></span>'
    build += '</div>'
    build += '<span class="moview-rating-summary" style="padding:0px">'
    build += '<span>'+result.stars+'</span>'
    build += '/10</span>'
    build += '</div>'
    build += '</div>'
    build += '</div>'

    return build;
}
