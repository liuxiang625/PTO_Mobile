
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button3 = {};	// @button
	var button21 = {};	// @button
	var button19 = {};	// @button
	var button20 = {};	// @button
	var button18 = {};	// @button
	var button9 = {};	// @button
	var button14 = {};	// @button
	var button13 = {};	// @button
	var button4 = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock

function signIn() {
	if (WAF.directory.loginByPassword(WAF.sources.loginObject.loginName, WAF.sources.loginObject.password)) {
		WAF.sources.user.all();
		WAF.sources.holiday.all();
		//WAF.sources.user1.all();
		//WAF.sources.user1.query("accessLevel = 3");
		WAF.sources.user1.query("role = 'Manager' || role = 'Payroll'");
		
		
		if (WAF.directory.currentUserBelongsTo("Administrator")) {
			//hide login stuff
			$$("richText1").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
			$$("signInContainer").hide();
			$$("signOutContainer").show();
			$$("container1").show();
			$("#container13").css("top", "-1px");
			$$("container13").hide();
			$$("textField11").setValue("");
			$$("textField12").setValue("");
		} else {
			WAF.directory.logout();
			$$("signInError").setValue("Only the Administrator can sign in to this application.");
		} //(WAF.directory.currentUserBelongsTo("Administrator"))
		
	} else {
		$$("signInError").setValue("Invalid login.");
	}
}
// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		//New
		$$('textField2').focus(); //login field
	};// @lock

	button21.click = function button21_click (event)// @startlock
	{// @endlock
		//Sign In
		signIn();
	};// @lock

	button19.click = function button19_click (event)// @startlock
	{// @endlock
		//Sign Out
		if (WAF.directory.logout()) {
			//hide logout stuff
			$$("richText1").setValue("");
			$$("signOutContainer").hide();
			$$("signInContainer").show();
			$$("container1").hide();
			$("#container13").css("top", "80px");
			$("#container13").css("left", "0px");
			$$("container13").show();	

			WAF.sources.user.query("ID < 0");
			WAF.sources.user1.query("ID < 0");
			WAF.sources.holiday.query("ID < 0");
		}
	};// @lock

	//Choose Manager
	button20.click = function button20_click (event)// @startlock
	{// @endlock
		$('#dialog2').css("top", 200);
		WAF.widgets['dialog2'].displayDialog();
	};// @lock

	button18.click = function button18_click (event)// @startlock
	{// @endlock
		waf.sources.user.myManager.set(waf.sources.user1);
		waf.sources.user.serverRefresh();
		$$('dialog2').closeDialog(); //ok button
	};// @lock


	//Delete
	button9.click = function button9_click (event)// @startlock
	{// @endlock
		var userName = WAF.sources.user.fullName;
		$('#errorDiv2').html("Are you sure you want to delete " + userName);
		$('#dialog1').css("top", 200);
		WAF.widgets['dialog1'].displayDialog();
	};// @lock

	button14.click = function button14_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //cancel button
	};// @lock

	button13.click = function button13_click (event)// @startlock
	{// @endlock
		$$('dialog1').closeDialog(); //ok button
		//Red Alert red Alert - Move this logic to the server!!!!!!!!!!!!!!!!!
		//switch (WAF.sources.user.accessLevel) {
		switch (WAF.sources.user.role) {
			case "Manager": //Manager
			var employeeCount;
			var employeeCollection = WAF.ds.User.query("myManager.ID = " + WAF.sources.user.ID, {
				onSuccess: function(event) {
					employeeCount = event.entityCollection.length;
					if (employeeCount > 0) {
						$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for employees. Count: " + employeeCount);
					} else {
						//Check for PTO requests.
						var ptoCount;
						var currentUserPTOCollection = WAF.ds.PTO_Request.query("requestor.ID = " + WAF.sources.user.ID, {
							onSuccess: function(event) {
								ptoCount = event.entityCollection.length;
								$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for Manager PTO Requests. Count: " + ptoCount);
							},
							onError: function(error) {
				
							}
						});

					}
					
				}
			});
			break;
			
			case "Employee": //Employee
			var ptoCount;
			var currentUserPTOCollection = WAF.ds.PTO_Request.query("requestor.ID = " + WAF.sources.user.ID, {
				onSuccess: function(event) {
					ptoCount = event.entityCollection.length;
					if (ptoCount > 0) {
						$("#errorDiv1").html("The account for " + WAF.sources.user.fullName + " has not been removed. This user has PTO Requests on file.");
					} else {
						WAF.sources.user.removeCurrent();
						$("#errorDiv1").html("The account for " + WAF.sources.user.fullName + " has been removed.");
					}
					//$("#errorDiv1").html("Check " + WAF.sources.user.ID + " for PTO Requests. Count: " + ptoCount);
				},
				onError: function(error) {
				
				}
			});
			break;
			
			default:
			
		} //End switch	
		
		//WAF.sources.user.removeCurrent();
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		WAF.sources.user.save({
			onSuccess: function(event) {
				$("#errorDiv1").html("Save successful on server.");
			},
			onError: function(error) {
				var myError = error['error'][0];
				$("#errorDiv1").html(myError.message);
			}	
		});
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		roleArray = [];
		roleArray.push({title: 'Employee'});
		roleArray.push({title: 'Manager'});
		roleArray.push({title: 'Payroll'});
		roleArray.push({title: 'Admin'});
		WAF.sources.roleArray.sync();

		if (WAF.directory.currentUser() === null) {
			$$("richText1").setValue("");
			$$("container1").hide();
			$$("signInContainer").show();
			$$("signOutContainer").hide();
			$("#container13").css("top", "80px");
			$("#container13").css("left", "0px");
			$$("container13").show();		
		} else {
			$$("richText1").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
			$$("container1").show();
			$$("signInContainer").hide();
			$$("signOutContainer").show();
			$("#container13").css("top", "-1px");
			$$("container13").hide();
		}
		
		$('#textField11, #textField12').live('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signIn();
	    	}
		});	
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button21", "click", button21.click, "WAF");
	WAF.addListener("button19", "click", button19.click, "WAF");
	WAF.addListener("button20", "click", button20.click, "WAF");
	WAF.addListener("button18", "click", button18.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("button14", "click", button14.click, "WAF");
	WAF.addListener("button13", "click", button13.click, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
