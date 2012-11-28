
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var button1 = {};	// @button
	var signOutbutton = {};	// @button
	var signInButton = {};	// @button
	var documentEvent = {};	// @document
// @endregion// @endlock



function lastDayOfMonth(year, month) {
 	return(new Date((new Date(year, month+1,1))-1)).getDate();
}

function formatDateFirst(dateObject) {
		var curr_date = dateObject.getDate();
		var curr_month = dateObject.getMonth();
		curr_month++;
		var curr_year = dateObject.getFullYear();
		return curr_month + "/" + "01" + "/" + curr_year;
}

function formatDateLast(dateObject) {
		var curr_date = dateObject.getDate();
		var curr_month = dateObject.getMonth();
		curr_month++;
		var curr_year = dateObject.getFullYear();
		var lastDay = lastDayOfMonth(curr_year, curr_month);
		return curr_month + "/" + lastDay + "/" + curr_year;
}

function formatDate(dateObject) {
		var curr_date = dateObject.getDate();
		var curr_month = dateObject.getMonth();
		curr_month++;
		var curr_year = dateObject.getFullYear();
		return curr_month + "/" + curr_date + "/" + curr_year;
}
	
function initAccordian() {
	var today = new Date();
	$$('startDate').setValue(formatDateFirst(today));
	$$('endDate').setValue(formatDateLast(today));
	WAF.sources.dateRangeObject.sync();
}

function buildUserRequestAccordian() {
	//Remove all items from our <DL>
	$('#employeeRequestsDL').children().remove();
	ds.User.all({
		autoExpand: "pTO_RequestCollection",
		orderBy: "fullName",
		onSuccess: function(event) {
			event.entityCollection.forEach({
				onSuccess: function(ev) {				
					var theEmployeeName = ev.entity.fullName.getValue();
					$('<dt>', {
						text: theEmployeeName
					}).appendTo('#employeeRequestsDL');		
					var ptoCollectionRel = ev.entity.pTO_RequestCollection.relEntityCollection;
					if (ptoCollectionRel.length > 0) {			
						ptoCollectionRel.forEach({
							userData: {employee: theEmployeeName},
							onSuccess: function(eventRelPTO) {
								if (eventRelPTO.entity.status.getValue() === "approved") {
									var requestLineItems = eventRelPTO.entity.getLineItemsRange(WAF.sources.dateRangeObject.start, WAF.sources.dateRangeObject.end);
									requestLineItems.forEach({
										userData: {employee: eventRelPTO.userData.employee},
										onSuccess: function(ev3) {
											var theEmployee = ev3.userData.employee;
											console.log("Emp: " + theEmployee);
											var theComp = ev3.entity.compensation.getValue();
											var theDate = formatDate(ev3.entity.dateRequested.getValue());
											var theHours = ev3.entity.hoursRequested.getValue();
											
											var myDateDiv = $('<div>', {
												text: theDate,
												"class" : "accordianDiv"
											});
											
											var myCompensationDiv = $('<div>', {
												text: theComp,
												"class" : "accordianDiv"
											});
											
											var myHoursDiv = $('<div>', {
												text: theHours,
												"class" : "accordianDiv"
											});
											
											var myDD = $('<dd>');
											myDD.append(myDateDiv, myCompensationDiv, myHoursDiv);
											$('#employeeRequestsDL').append(myDD);
											myDD.prev('dt').css('background', 'LightGoldenrodYellow');		
										} ////end requestLineItems.forEach
									});	//end requestLineItems.forEach
								}
							} // end ptoCollectionRel.forEach onSuccess
						}); // end ptoCollectionRel.forEach
					} //end if (ptoCollectionRel.length > 0) 
				} //end OnSuccess function(ev)
			}); // end event.entityCollection.forEach
			var dd = $('dd');
			dd.hide();
		} // end ds.User.all onSuccess
	}); //end ds.User.all
} // end buildUserRequestAccordian()
		

function signIn() {
	if (WAF.directory.loginByPassword(WAF.sources.loginObject.loginName, loginObject.password)) {
		//hide login stuff
		$$("signOutRichText").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
		$$("signInContainer").hide();
		$$("signOutContainer").show();
		$("#mainContainer").css("top", "80px");
		$("#mainContainer").css("left", "0px");
		$$("mainContainer").show();
		$("#splashScreenContainer").css("top", "-1200px");
		$("#splashScreenContainer").css("left", "-1200px");
		$$("splashScreenContainer").hide();
		$$("loginNameTextField").setValue("");
		$$("passwordTextField").setValue("");
		initAccordian();
		buildUserRequestAccordian();
	} else {
		$$('signInError').setValue('invalid login');
	}
}


// eventHandlers// @lock


	button1.click = function button1_click (event)// @startlock
	{// @endlock
		//Query Button
		buildUserRequestAccordian();
		
	};// @lock



	signOutbutton.click = function signOutbutton_click (event)// @startlock
	{// @endlock
		//Sign Out
		if (WAF.directory.logout()) {
			//hide logout stuff
			$$("signOutRichText").setValue("");
			$$("signOutContainer").hide();
			$$("signInContainer").show();
			$("#mainContainer").css("top", "-1200px");
			$("#mainContainer").css("left", "-1200px");
			$$("mainContainer").hide();
			$("#splashScreenContainer").css("top", "80px");
			$("#splashScreenContainer").css("left", "0px");
			$$("splashScreenContainer").show();	
		}
	};// @lock

	signInButton.click = function signInButton_click (event)// @startlock
	{// @endlock
		//Sign In
		signIn();
	};// @lock


	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		//Document on load.
		if (WAF.directory.currentUser() === null) {
			//User is not signed in.
			$$("signOutRichText").setValue("");
			$("#mainContainer").css("top", "-1200px");
			$("#mainContainer").css("left", "-1200px");
			$$("mainContainer").hide();
			$$("signInContainer").show();
			$$("signOutContainer").hide();
			$("#splashScreenContainer").css("top", "80px");
			$("#splashScreenContainer").css("left", "0px");
			$$("splashScreenContainer").show();		
		} else {
			//User is signed in.
			$$("signOutRichText").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
			$$("signInContainer").hide();
			$$("signOutContainer").show();
			$("#splashScreenContainer").css("top", "-1200px");
			$("#splashScreenContainer").css("left", "-1200px");
			$$("splashScreenContainer").hide();
			$$("mainContainer").show();
		}
		
		$('#loginTextField, #passwordTextField').live('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signIn();
	    	}
		});	
		
		$('dl').on('click', 'dt', function() {
			$this = $(this);
			$this.nextUntil('dt').slideDown(300);
			$this.siblings('dt').nextUntil('dt').slideUp(300);
		});	
		
		initAccordian();
		buildUserRequestAccordian();
		
		$("#startDate").change(function () { 
			var myStartDate = new Date($$('startDate').getValue());
			console.log(myStartDate);
			$$('endDate').setValue(formatDateLast(myStartDate));
			WAF.sources.dateRangeObject.sync();
		}); 
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("signOutbutton", "click", signOutbutton.click, "WAF");
	WAF.addListener("signInButton", "click", signInButton.click, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
