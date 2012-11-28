
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var dataGrid1 = {};	// @dataGrid
	var button1 = {};	// @button
	var button2 = {};	// @button
// @endregion// @endlock

// eventHandlers// @lock

	dataGrid1.onRowClick = function dataGrid1_onRowClick (event)// @startlock
	{// @endlock
		// Row Click
		$$('messageRichText').setValue("");
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		// New
		$$('messageRichText').setValue("");
	};// @lock

	button2.click = function button2_click (event)// @startlock
	{// @endlock
		//Save
		waf.sources.preferences.save({
			onSuccess: function(event) {
				$$('messageRichText').setValue("Your preference was stored in the database. A courtesy email was sent for your records.");
			},
			onError: function(error) {
				$$('messageRichText').setValue(error['error'][0].message + " (" + error['error'][0].errCode + ")");
			}
		});
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("dataGrid1", "onRowClick", dataGrid1.onRowClick, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("button2", "click", button2.click, "WAF");
// @endregion
};// @endlock
