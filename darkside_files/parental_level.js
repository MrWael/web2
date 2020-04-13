/**
 * Author (c) Osama Alnuimi
 * Version 1.0
 * Shabakaty Cinemana
 * 1/24/2019
 **/

(function () {
    /* global require */
    'use strict';
    var videojs = null;

    var initialize = false;
    var current_element = 0;
    var disable_seek = false;
    var elements=[];
    var elementsOriginal;
    var introskipElements=[];
    var IsExistParental=false;
    if (typeof window.videojs === 'undefined' && typeof require === 'function') {
        videojs = require('video.js');
    } else {
        videojs = window.videojs;
    }

    (function (window, videojs) {
        'use strict';

        var defaults = {};

        /**
         * Return MenuButton's MenuItems.
         *
         * @method MenuButton.getItems
         * @return MenuItem[]
         */
        var MenuButton = videojs.getComponent('MenuButton');

        /**
         * Set current level.
         * This provides interface to either Player tech.
         *
         * @method setLevel
         * @param  {Number} level
         * @return Levels[]
         */
        
        

        function apiCall() {
            var videoID = document.getElementById("videoItemNb").value;
             
            var settings = {
                url : "/page/movie/SkippingDurations",
                data : {videoID: videoID} ,
                method: 'GET'
            };
            return $.ajax(settings);
        }
    
        

        var MenuItem = videojs.getComponent('MenuItem');

        videojs.MenuItemTest = videojs.extend(MenuItem, {

            constructor: function (player, options, onClickListener) {
                this.onClickListener = onClickListener;

                // Call the parent constructor
                MenuItem.call(this, player, options);
                this.on('click', this.onClick);
                this.on('touchstart', this.onClick);

            },
            onClick: function () {
                this.onClickListener(this);
                var selected = this.options_.el.value;
                
                $(player)[0].player.setFilter(selected);
                
            }
        });

        /**
         * LevelsMenuButton
         */
        videojs.levelsMenuButton = videojs.extend(MenuButton, {

            className: 'vjs-menu-button-parental-level ',

            init: function (player, options) {

                videojs.getComponent('MenuButton').call(this, player, options);

                this.controlText('parental-level');

                var staticLabel = document.createElement('span');
                staticLabel.classList.add('vjs-levels-button-staticlabel');
                this.el().appendChild(staticLabel);

            },
            createItems: function () {
                var videoId = document.getElementById("videoItemNb").value
                var notFilteredAnalytics = '|eventID=3|videoID=' + videoId + '|eventInt=' + 1 + '| ';
                var familyAnalytics = '|eventID=3|videoID=' + videoId + '|eventInt=' + 2 + '| ';
                var kidsAnalytics = '|eventID=3|videoID=' + videoId + '|eventInt=' + 3 + '| ';
                var component = this;
                var player = component.player();
                var fetch_levels = [{
                    name: 'Family',
                    index: 1,
                    value: 1,
                    'najeeb': 2,
                    dataAnalytics:familyAnalytics
                },{
                    name: 'Kids',
                    index: 2,
                    value: 2,
                    dataAnalytics:kidsAnalytics
                }];//player.qualityLevels();
                var levels = fetch_levels;//.levels_;

                var item;
                var menuItems = [];

                if (!levels.length) {
                    return [];
                }

                // Prepend levels with 'Auto' item
                levels = [{
                    name: 'Default',
                    index: -1,
                    value: 0,
                    'najeeb': 2,
                    dataAnalytics:notFilteredAnalytics
                }].concat(levels);

                var onClickUnselectOthers = function (clickedItem) {
                    menuItems.map(function (item) {
                        if ($(item.el()).hasClass('vjs-selected')) {
                            $(item.el()).removeClass('vjs-selected');
                        }
                    });
                    $(clickedItem.el()).addClass('vjs-selected');
                };

                var levelsObject =  levels.map(function (level, index) {

                    // Select a label based on available information
                    // name and height are optional in manifest
                    var levelName;

                    if (level.name) {
                        levelName = level.name;
                    }

                    item = new videojs.MenuItemTest(player, {
                        el: videojs.getComponent('Component').prototype.createEl('li', this, {
                            label: levelName,
                            value: level.value,
                            class: 'vjs-menu-item analytics',
                            tabIndex: index,
                            'data-analytics':level.dataAnalytics
                        })
                    }, onClickUnselectOthers);

                    /**
                     * Store MenuButton's MenuItems.
                     * @return object
                     */
                    menuItems.push(item);

                    $(item.el()).html(levelName);

                    return item;
                });
                
                var skippingLevel = $.cookie("parentalSkippingLevel");
                
                if (["0", "1", "2"].indexOf(skippingLevel) >= 0) {

                    $(levelsObject[skippingLevel].el()).addClass('vjs-selected');
                    
                    player.setFilter(skippingLevel);

                } else {
                    
                    if (levelsObject[0].name === 'Default') {
                        $(levelsObject[1].el()).addClass('vjs-selected');
                    }
                    player.setFilter(1);
                }
                
                return levelsObject;
            }
        });
        videojs.getComponent('Player').prototype.setFilter = function (level) {
                   
            $.cookie("parentalSkippingLevel", level);
            elements = [];
            
            for (var i = 0; i < elementsOriginal.length; i++) {
                var element_level = parseInt(elementsOriginal[i]['control_level']);
                if (element_level <= level ) {
                    elements.push(elementsOriginal[i]);
               }

            }
            initialize = true;
                    
        };
        // register the plugin
        videojs.registerPlugin('levels', function (options) {
            
            var settings = videojs.mergeOptions(defaults, options);
            var player = this;
            var button = null;

            player.on('ready', function (evt) {            
                apiCall().done(function(data) {
                    elementsOriginal = data
                    for (var i = 0; i < elementsOriginal.length; i++) {
                    var element_level = parseInt(elementsOriginal[i]['control_level']);
                        if ( element_level != 3) {
                            IsExistParental=true
                        }else{
                            introskipElements.push(elementsOriginal[i]);
                        }
                    }
                    button = new videojs.levelsMenuButton(player,settings);
                    
                    button.el().classList.add('vjs-menu-button-parental-level');

                    player.controlBar.addChild(button,{},10);
                    if (elementsOriginal.length == 0 || IsExistParental==false) {               
                        button.dispose();
                    }
                });
                var introSkipbuttonText="skip";
                if(location.href.search('/ar/')!=-1){
                    introSkipbuttonText="تخطي";
                }
                var skipIntroBtnHtml='<span id="intro-skip" skip="0" >'+introSkipbuttonText+'</span>'
                var skipButton=videojs.dom.createEl("button",{
                    text: "Back",
                    tabIndex: 3})
                $(skipButton).addClass("intro-skip-div")
                $(skipButton).attr("style","display:none;height: 37px; width: 100px; position: absolute; background-color: #0c465ab3; right: 20px; bottom: 50px; border-radius: 4px; font-size: 18px;");
                $(skipButton).addClass("analytics")
                var videoID = document.getElementById("videoItemNb").value;
                $(skipButton).attr("data-analytics","|eventID=3|eventInt=4|videoID="+videoID+"|")
                $(skipButton).html(skipIntroBtnHtml);
                
                $(skipButton).on("click",function(){
            
                    $(".intro-skip-div").hide(); 
                    player.currentTime(currentPoint.end+1);
                    disable_seek = true; 
                    skipClick=true
                    

                })
               this.controlBar.el().appendChild(skipButton);
                
            });
            
            //var hideTimer=0
          
            var skipClick=false;         
            var currentPoint={start:'',end:''}; 
            player.on('timeupdate', function() {
                
            if (initialize == true) {        
                getNextPoint(this.currentTime());
                initialize = false;
            }
                       
                       
                        for(var i=0;i<introskipElements.length;i++)
                        { 
                            var start = parseFloat(introskipElements[i]['start']);
                            var end = parseFloat(introskipElements[i]['end']); 
                            
                            
                            if (this.currentTime() >= start- 0.3 && this.currentTime() < end) {
                                currentPoint.start=start; 
                                currentPoint.end=end; 
                                if(skipClick==false){
                                    $(".intro-skip-div").show();  
                                    return 0;
                                }                       
                                break;
                            }  
                         }     
                         $(".intro-skip-div").hide();  
                         skipClick=false     
                                
                                    
                                    
                                    
                                       // $(".intro-skip-div").hide();  
                                     
                                    
                                
                           
                            
                    

                

                        
                        
               
                if (elements[current_element] != undefined) {
                    var start = parseFloat(elements[current_element]['start']);
                    var end = parseFloat(elements[current_element]['end']);
                    if (this.currentTime() >= start - 0.3 && this.currentTime() < end) {
                        if(elements[current_element].control_level!=3)
                        {
                            this.currentTime(end);
                            current_element++;
                            disable_seek = true;
                        
                        }
                        
                    }
                }
               
            });
            player.on('seeking', function() {

                var player = this;
                if (disable_seek == false) {
                    
                    getNextPoint(player.currentTime());
                 
                } else {
                    disable_seek = false;
                }
            });

            function getNextPoint(time) {
                
                for (var i = 0; i < elements.length; i++) {
                    var start = parseFloat(elements[i]['start']);
                    var end = parseFloat(elements[i]['end']);
                    if (time < end) {
                        current_element = i;
                        break;
                    }
                }
            }
        });
    })(window, videojs);
  
})();
