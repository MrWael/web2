$(window).load(function(){
    var id = $('input[type=hidden]#videoItemNb').val();

    $.ajax({
        type: "GET",
        url: "/page/movie/GetUBIMSRecommendedItems/"+id,
        success: function(data){
            
            $("#owloadgif").remove();
            itemBuild = buildRelatedVideo("related-video",data);
            $("#related-video").append(itemBuild);
            var $spmvmovie = $(".related-video");
            initCarousel($spmvmovie);
            $('.slideContainer').css({opacity: 0, visibility: "visible"}).animate({opacity: 1.0}, 500);
        },
        failure: function(errMsg) {
            
        }
    });
});
    
function initCarousel($spmvmovie) {
    $spmvmovie.owlCarousel({
        loop: false,
        dots: false,
        nav: true,
        navClass:['owl-prev','owl-next'],
        slideBy:3,
        navText : ['<i class="themeum-moviewangle-left" aria-hidden="true"></i>','<i class="themeum-moviewangle-right" aria-hidden="true"></i>'],
        rtl: false,
        autoplay:false,
        autoplayTimeout:3000,
        autoplayHoverPause:true,
        mouseDrag: false,
        autoHeight: false,
        lazyLoad:true,
        responsive: {
            
            767: {
                items: 4
            }
            
        }
    });
}
