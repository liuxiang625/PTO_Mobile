
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button3 = {};	// @button
	var documentEvent = {};	// @document
	var button2 = {};	// @button
	var login1 = {};	// @login
// @endregion// @endlock

// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		//New PTO with initialization on server.
		ds.PTO_Request.newPTORequest({
			onSuccess: function(event) {
				WAF.sources.pTO_Request.setCurrentEntity(event.result);
				$$('messageText').setValue("New PTO Request Created.");
			}
			
			//By default, the values of relation attributes are not calculated 
			//  in the entity collection returned by the server.
			//,autoExpand: "requestor"
		});
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		$( "#textField6" ).datepicker();
		$( "#textField7" ).datepicker();
		$( "#textField8" ).datepicker();
		
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		waf.sources.pTO_Request.save({
			onSuccess: function(event) {
				$$('messageText').setValue("PTO Request Saved Successfully.");
			},
			onError: function(error) {
				$$('messageText').setValue(error['error'][0].message + " (" + error['error'][0].errCode + ")");
			}
			
		});
	};// @lock

	login1.logout = function login1_logout (event)// @startlock
	{// @endlock
		WAF.sources.pTO_Request.setEntityCollection();
	};// @lock

	login1.login = function login1_login (event)// @startlock
	{// @endlock
		//Login
		waf.sources.pTO_Request.all();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("login1", "logout", login1.logout, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
	WAF.addListener("login1", "login", login1.login, "WAF");
// @endregion
};// @endlock
