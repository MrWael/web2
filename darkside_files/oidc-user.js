$(function() {
	/*var identity_server_register_address = identity_server_address+"/core/registration?backurl="+window.location.protocol + "//" + window.location.host + "/";
	var config = {
		authority: identity_server_address+'/core',
		client_id: "Cinemana.id",
		redirect_uri: window.location.protocol + "//" + window.location.host + "/",	
		post_logout_redirect_uri: window.location.protocol + "//" + window.location.host + "/",
		response_type: "id_token token",
		scope: "openid email earthlink.profile",
		silent_redirect_uri: window.location.protocol + "//" + window.location.host + "/",
		silent_renew: false,	
		filter_protocol_claims: true,
		store: window.sessionStorage
	};
	var mgr = new OidcTokenManager(config);
	var loc = window.location.toString();
	var res = loc.split("?");
	if (res[1] == 'ies') {
		mgr.oidcClient.loadUserProfile(mgr.access_token).then(function (profile) {     
	        var request = $.ajax({
				url: cenimana_base_url+'page/user/ajaxHandleUserProfile',
				type: 'POST',
				dataType: 'json',
				data: profile
			});    
			request.done(function(json) {
				if (json.status == 'SUCCESS' ) {
					var currentUrl = $('#currentUrl').val();						
					var url = res[0];
					window.location = url;	
				}
			});
	   });	
	}
	
	function handleCallback() {		
		mgr.processTokenCallbackAsync().then(function () {			
			var hash = window.location.hash.substr(1);
			var result = hash.split('&').reduce(function (result, item) {
				var parts = item.split('=');
				result[parts[0]] = parts[1];
				return result;
			}, {});		
			
			mgr.oidcClient.loadUserProfile(result.access_token).then(function (profile) {            
	            handleUser(profile);
	        });			
		}, function (error) {			
		});
	}
	
	function handleUser(profile) {
		profile.access_token = mgr.access_token;
		var request = $.ajax({
			url: cenimana_base_url+'page/user/ajaxHandleUser',
			type: 'POST',
			dataType: 'json',
			data: profile
		});    
		request.done(function(json) {
			if (json.status == 'SUCCESS' ) {
				var currentUrl = $('#currentUrl').val();						
				var url = cenimana_base_url + 'page/home/index/' + json.lang;
				window.location = url;	
			}
		});
	}*/	
	
	var loc = window.location.toString();
	var res = loc.split("?");
	if (res[1] == 'ies') {
		var request = $.ajax({
			url: cenimana_base_url+'page/user/ajaxHandleUserProfile',
			type: 'GET',
			dataType: 'json',
		});    
		request.done(function(json) {
			if (json.status == 'SUCCESS' ) {
				var currentUrl = $('#currentUrl').val();						
				var url = res[0];
				window.location = url;	
			}
		});
	}
	
	
	
	/*$(".logout").on( "click", function() {
		var request = $.ajax({
			url: cenimana_base_url+'page/user/logout',
			type: 'GET',
			dataType: 'json',
		});    
		request.done(function(json) {	
			window.location = json.eis_logout_url;	
		});		
	});*/
	
	/*function authorize(scope, response_type) {
		config.scope = scope;
		config.response_type = response_type;
		mgr.redirectForToken();
	}

	function logout() {
		mgr.redirectForLogout();
	}

	if (window.location.hash) {	
		handleCallback();
	}
	
	[].forEach.call(document.querySelectorAll(".request"), function (button) {	
		button.addEventListener("click", function () {
			authorize(this.dataset["scope"], this.dataset["type"]);		
		});
	});*/	
});

