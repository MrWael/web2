function sendToYan(e){var r=new Date((new Date).getTime()-60*(new Date).getTimezoneOffset()*1e3).toISOString().substr(0,19).replace("T"," ");$.ajax({type:"POST",url:"https://cinemana.shabakaty.com/api/info/userInfo",data:{info:JSON.stringify(e),clientDate:r},success:function(e){},error:function(e){}})}function areEqual(){for(var e=arguments.length,r=1;r<e;r++)if(null===arguments[r]||arguments[r]!==arguments[r-1])return!1;return!0}function userAnalytics(e){var r={pbip:e.pbip,prip:e.prip,refrrer:e.refrrer,rsrv:e.rsrv,check_ip1:e.check_ip1,check_ip2:e.check_ip2,check_ip3:e.check_ip3};if(void 0===$.cookie("userInfo"))$.cookie("userInfo",JSON.stringify(r),{path:"/",expires:1e3}),sendToYan(r);else{var n=JSON.parse($.cookie("userInfo"));isSame=objectsAreSame(n,r),isSame||($.removeCookie("userInfo",{path:"/"}),$.cookie("userInfo",JSON.stringify(r),{path:"/",expires:1e3}),sendToYan(r))}return r}function objectsAreSame(e,r){var n=!0;for(var t in e)if(e[t]!==r[t]){n=!1;break}return e.hasOwnProperty("refrrer")&&r.hasOwnProperty("refrrer")||(n=!1),n}var userInfo=new Array;function getPbip(){return $.ajax({method:"GET",url:"https://api.ipify.org/?format=json",success:function(e){userInfo.pbip=e.ip,userInfo.refrrer=1}})}function getBalance(){return $.ajax({method:"GET",url:"https://cinemana.shabakaty.com/whatismyip",success:function(n){userInfo.prip=n.length<=20?n:"0",userInfo.check_ip1=n.length<=20?n:"0",$.ajax({method:"GET",url:"https://share.shabakaty.com/whatismyip",success:function(r){r=r.length<=20?r:"0",userInfo.check_ip2=r,$.ajax({method:"GET",url:"https://cinemana.shabakaty.com/whatismyip",success:function(e){e=e.length<=20?e:"0","0"==(userInfo.check_ip3=e)||"0"==r||"0"==n?userInfo.rsrv=2:areEqual(n,e,r)?userInfo.rsrv=0:userInfo.rsrv=1}})}})},error:function(e,r){userInfo.prip=2}})}$.when(getPbip(),getBalance()).done(function(e,r){userAnalytics(userInfo)});