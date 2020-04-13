
hoverSearchFlag=false
function showSearch(elem){
    $('#suchenInput').val($(elem).attr("value"))
    $('#suchenInput').trigger(
            jQuery.Event( 'keydown', { keyCode: 65, which: 65 } )
        );
        
    $("#ui-id-4").hide()
}

function removeSearchItem(elem){
    parent=$(elem).parent();
    $(parent).hide(600);
    value=$(elem).attr("value")
    
    var SearchDataItemsArray = $.cookie("SearchDataItemsArr");
    $.removeCookie("SearchDataItemsArr")
    
    var dataArray = JSON.parse(SearchDataItemsArray);
    
    var index=searchValueInArray(value,dataArray)
    
    dataArray.splice(index, 1);
        
    $.cookie("SearchDataItemsArr",JSON.stringify(dataArray),{expires:3600,path: '/' });
}   

function searchValueInArray(value,array){
    for(i=0;i<array.length;i++)
    {
        if(array[i]==value)
        {
            return i;
        }
    }
    return -1
}  

function storeSeachInCookisFromClick(id){
    
    val=$("#"+id+" .label").html();
        
    storeSeachInCookis(val)
        
}

function strip_html_tags(str)
{
    if ((str===null) || (str===''))
        return false;
    else
    str = str.toString();
    return str.replace(/<[^>]*>/g, '');
}
function storeSeachInCookis(val){
    val = filterXSS(val);        
    if(val.length==0)
        retrun ;  
    
    var SearchDataItemsArray = $.cookie("SearchDataItemsArr");
    $.removeCookie("SearchDataItemsArr")
    var dataArray=[];
    
    if (typeof SearchDataItemsArray !== "undefined") {
        dataArray = JSON.parse(SearchDataItemsArray);
        if(searchValueInArray(val,dataArray)==-1)
        {
            if(dataArray.length<10)
            { 
                dataArray.push(val)
            }
            else
            {
                var new_array=[] 
                for(i=0;i<dataArray.length;i++)
                {  
                    
                    if(i==dataArray.length-1)
                        new_array[dataArray.length-1]=val  
                    else 
                        new_array[i]=dataArray[i+1] 
                }
                dataArray=new_array;
            }
            $.cookie("SearchDataItemsArr",JSON.stringify(dataArray),{ expires:3600, path: '/' });
        }
    }else{
        SearchDataItemsArray=$.cookie("SearchDataItemsArr", JSON.stringify([]),{  path: '/' });
        dataArray.push(val)
        $.cookie("SearchDataItemsArr",JSON.stringify([]),{ expires:3600, path: '/' });
        $.cookie("SearchDataItemsArr",JSON.stringify(dataArray),{ expires:3600, path: '/' });
    }                     
}
function buildSearchHistory() {
    var SearchDataItemsArray = $.cookie("SearchDataItemsArr");
    var dataArray;
    if (typeof SearchDataItemsArray !== "undefined") {
        var dataArray = JSON.parse(SearchDataItemsArray);
        dataArray.reverse().forEach(element => {
            $("#ui-id-4").append(

                jQuery("<li/>",{
                    css:{"position": "relative","padding": "10px","border-top":"1px solid #eeeded"}
                }).append(
                    jQuery("<div/>",{
                        css:{"padding-right": "50px"},
                        id:"history-text-item",
                        text:element,
                        value: element
                    })
                ).append(jQuery("<div/>",{
                    value:element,
                    class:"history-text",
                }).append(jQuery("<i/>",{
                    class:"fa fa-remove",
                    css:{"color": "#e66464","font-size": "17px","padding-top": "30%","cursor": "pointer"}  
                })))
            )
        });
    }
}
$(document).ready(function () {
    var html='<div class="search-history"><ul id="ui-id-4" tabindex="0" class="ui-menu ui-widget ui-widget-content ui-autocomplete ui-front item" ></div>'
    $(".search").after(html);
    buildSearchHistory();
    $('#suchenInput').on("focus",function(){
        
        if($('#suchenInput').val().length>0)
        return ;
        $("#ui-id-4").fadeIn(1200)
    });

    $(document).on("click","#history-text-item",function(){                
        showSearch($(this))
    });
    $(document).on("click",".history-text",function(){
        removeSearchItem($(this))
    })
    $('#suchenInput').on("focusout",function(){
        
        if(hoverSearchFlag==false)
        {
            $("#ui-id-4").hide();
        }
    });
    $('#ui-id-4').on("mouseover",function(){
        hoverSearchFlag=true
        
    })
    
    $('#ui-id-4').on("mouseleave",function(){
        hoverSearchFlag=false

    })
    
    $('#searchIcon').on("click",function(){
        storeSeachInCookis($('#suchenInput').val())  
    })
    $('#suchenInput').on("keyup",function(e) { 
        if($('#suchenInput').val().length==0)
        {
            $("#ui-id-4").show()
        }  
        else{
            $("#ui-id-4").hide()
        }
        if(e.which == 13) {
            storeSeachInCookis($('#suchenInput').val());     
        }
    });
    $('#suchenInput').on("keydown",function() {
        
        if(screen.width<500 && $('#suchenInput').val().length==1) 
        {  
            $("#ui-id-4").show();
        }
    });
});
