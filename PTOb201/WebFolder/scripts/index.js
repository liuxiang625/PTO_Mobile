
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var pTO_RequestEvent = {};	// @dataSource
	var button1 = {};	// @button
	var button24 = {};	// @button
	var button23 = {};	// @button
	var button11 = {};	// @button
	var button10 = {};	// @button
	var button9 = {};	// @button
	var button8 = {};	// @button
	var button7 = {};	// @button
	var button6 = {};	// @button
	var dataGrid3 = {};	// @dataGrid
	var button22 = {};	// @button
	var button21 = {};	// @button
	var dataGrid1 = {};	// @dataGrid
	var documentEvent = {};	// @document
// @endregion// @endlock


//David Robbins Functions - Start
var today = new Date();
var dd = today.getDate();
var mm = today.getMonth()+1; //January is 0!
var yyyy = today.getFullYear();
if(dd<10){dd='0'+dd} 
if(mm<10){mm='0'+mm}
var myCurrentDate = mm+'/'+dd+'/'+yyyy;

function formatDate(dateObject) {
	var curr_date = dateObject.getDate();
	var curr_month = dateObject.getMonth();
	curr_month++;
	var curr_year = dateObject.getFullYear();
	return curr_month + "/" + curr_date + "/" + curr_year;
}

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months;
}

function lastDayOfMonth(year, month) {
 	return(new Date((new Date(year, month+1,1))-1)).getDate();
}

function daysInMonth(month,year) {
	var m = [31,28,31,30,31,30,31,31,30,31,30,31];
	if (month != 2) return m[month - 1];
	if (year%4 != 0) return m[1];
	if (year%100 == 0 && year%400 != 0) return m[1];
	return m[1] + 1;
}

function elapsedPayPeriods(userEntity) {
	var ptoHoursAccruedToDate;
	var seedPTOHours = userEntity.ptoHours.getValue();
	var seedPTOAccrualRate= userEntity.ptoAccrualRate.getValue();
	var seedPTODate = userEntity.ptoSeedDate.getValue();
	//Figure out how many pay periods have passed from PTO Seed Date
	// until current date.
	var todaysDate = new Date();
	var mm = todaysDate.getMonth()+1; //January is 0!
	var yyyy = todaysDate.getFullYear();
	var dd = todaysDate.getDate();
	var seedDay = seedPTODate.getDate();
	var numberOfPayPeriodsElapsed = monthDiff(seedPTODate, todaysDate) * 2;
	
	if (seedDay < 15) {
		numberOfPayPeriodsElapsed += 2;
	} else {
		numberOfPayPeriodsElapsed += 1;
	}
	
	if (dd > 14) {
		numberOfPayPeriodsElapsed += 1;	
	} 

	return numberOfPayPeriodsElapsed;
}

function updateUserAccountDisplay() {
	var myCurrentUser = WAF.directory.currentUser(); // Get the current user
	var myUser = WAF.ds.User.find("ID = " + myCurrentUser.ID, {
		onSuccess: function(event) {
			var theNumberOfElapsedPayPeriods = elapsedPayPeriods(event.entity);
			var currentPTOHours = event.entity.ptoHours.getValue() + (theNumberOfElapsedPayPeriods * event.entity.ptoAccrualRate.getValue());
			var myHTML = '';
			myHTML += '<p class="holiday">' + "Floating Holidays: " + event.entity.floatingDays.getValue() + "."  + '</p>'; 
			myHTML += '<p class="holiday">' + "Paid Time Off Hours: " + currentPTOHours + "."  + '</p>'; 
			//myHTML += '<p class="holiday">' + "Manager: " + "Under Construction" + "."  + '</p>'; 
			
			$('#container6').html('User Account: <br/><br/>' + myHTML);
		}
	}); // Load their user entity.
}

function enableInput() {
	$("#textField3").removeAttr("disabled"); //First Day Off
	$("#textField4").removeAttr("disabled"); //Last Day Off
	$("#textField15").removeAttr("disabled"); //line item hours
	$$("combobox2").enable(); //status
	$$("button6").enable();
	$$("button7").enable();
}

function disableInput() { 
	//$('#container5').html('');
	//$('#container6').html('');
	/**/
	if ((WAF.directory.currentUserBelongsTo("Payroll")) || 
		(WAF.directory.currentUserBelongsTo("Manager")) ||
		(WAF.directory.currentUserBelongsTo("Administrator"))) {
		
		currentPTOUserName = WAF.sources.pTO_Request.getAttribute("requestor.fullName").getValue();
		
		if (WAF.directory.currentUser().fullName !== currentPTOUserName) {
		//Manager is looking at Employee request.
			//console.log("Employee request: " + currentPTOUserName + " for Manager: " + WAF.directory.currentUser().fullName);
			$("#textField3").attr("disabled", "disabled"); //First Day Off
			$("#textField4").attr("disabled", "disabled"); //Last Day Off
			$("#textField5").attr("disabled", "disabled"); //Return To Work Date
			$("#textField8").attr("disabled", "disabled"); //Notes
			
			$$("button6").disable();
			$$("button7").disable();
			$$("combobox1").disable();
			$("#textField15").attr("disabled", "disabled"); //line item hours
			
			if ((WAF.sources.pTO_Request.status === "closed") || (WAF.sources.pTO_Request.status === "rejected")) {
				$$("combobox2").disable(); //status
			} else {
				$$("combobox2").enable(); //status
			}
			
						
		} else {
		//Manager is looking at their own request.
			if (WAF.sources.pTO_Request.status !== "pending") {
				$$("button6").disable();
				$$("button7").disable();
				$$("combobox1").disable();
				$("#textField15").attr("disabled", "disabled"); //line item hours
				$$("combobox2").disable(); //status
				$("#textField8").attr("disabled", "disabled"); //Notes
				
			} else {
				$$("button6").enable();
				$$("button7").enable();
				$$("combobox1").enable();
				$("#textField15").removeAttr("disabled"); //line item hours
				$$("combobox2").enable(); //status
			}
			
			$("#textField3").attr("disabled", "disabled"); //First Day Off
			$("#textField4").attr("disabled", "disabled"); //Last Day Off
			$("#textField5").attr("disabled", "disabled"); //Return To Work Date
		
			//$("#textField3").removeAttr("disabled"); //First Day Off
			//$("#textField4").removeAttr("disabled"); //Last Day Off
			//$("#textField5").removeAttr("disabled"); //Return To Work Date
			//$("#textField8").removeAttr("disabled"); //Notes
		}
		
	} else {
		//Employee
		$("#textField3").attr("disabled", "disabled"); //First Day Off
		$("#textField4").attr("disabled", "disabled"); //Last Day Off
		$("#textField5").attr("disabled", "disabled"); //Return To Work Date
		
		if (WAF.sources.pTO_Request.status !== "pending") {
			$$("button6").disable();
			$$("button7").disable();
			$$("combobox1").disable();
			$("#textField15").attr("disabled", "disabled"); //line item hours
			$$("combobox2").disable(); //status
			
		} else {
			$$("button6").enable();
			$$("button7").enable();
			$$("combobox1").enable();
			$("#textField15").removeAttr("disabled"); //line item hours
			$$("combobox2").enable(); //status
		} //(WAF.sources.pTO_Request.status !== "pending") 
	}
	
}

function getNextWorkDay(textFieldIDSelector) {
	var lastDayArray = $(textFieldIDSelector).val().split("/");
	var yyyy = lastDayArray[2];
	var mm = lastDayArray[0];
	switch (mm) {
		case "01" :
		mm = "00";
		break;
		
		case "02" :
		mm = "01";
		break;
		
		case "03" :
		mm = "02";
		break;
		
		case "04" :
		mm = "03";
		break;
		
		case "05" :
		mm = "04";
		break;
		
		case "06" :
		mm = "05";
		break;
		
		case "07" :
		mm = "06";
		break;
		
		case "08" :
		mm = "07";
		break;
		
		case "09" :
		mm = "08";
		break;
		
		case "10" :
		mm = "09";
		break;
		
		case "11" :
		mm = "10";
		break;
		
		case "12" :
		mm = "11";
		break;		
	} //Switch
	
	var dd = lastDayArray[1];
	
	
	var lastDay = new Date(yyyy, mm, dd);
	lastDay.setDate(lastDay.getDate()+1);
	var yyyyNext = lastDay.getFullYear();
	var mmNext = lastDay.getMonth();
	
	switch (mmNext) {
		case 0 :
		mmNext = "01";
		break;
		
		case 1 :
		mmNext = "02";
		break;
		
		case 2 :
		mmNext = "03";
		break;	

		case 3 :
		mmNext = "04";
		break;	

		case 4 :
		mmNext = "05";
		break;	

		case 5 :
		mmNext = "06";
		break;	

		case 6 :
		mmNext = "07";
		break;	

		case 7 :
		mmNext = "08";
		break;	

		case 8 :
		mmNext = "09";
		break;	

		case 9 :
		mmNext = "10";
		break;	

		case 10 :
		mmNext = "11";
		break;	

		case 11 :
		mmNext = "12";
		break;	
	} //Switch mmNext
	
	var ddNext = lastDay.getDate();
	
	return(mmNext + "/" + ddNext + "/" + yyyyNext);
	//return lastDay.toDateString();
}

function signIn() {
	$("#errorDiv1").html("");
	if (WAF.directory.loginByPassword(WAF.sources.loginObject.loginName, WAF.sources.loginObject.password)) {
		statusArray = [];
		if ((WAF.directory.currentUserBelongsTo("Payroll")) || 
			(WAF.directory.currentUserBelongsTo("Manager")) ||
			(WAF.directory.currentUserBelongsTo("Administrator"))) {
			statusArray.push({statusName: ''});
			statusArray.push({statusName: 'pending'});
			statusArray.push({statusName: 'commit'});
			statusArray.push({statusName: 'approved'});
			statusArray.push({statusName: 'rejected'});
			//statusArray.push({statusName: 'returned'});
			statusArray.push({statusName: 'closed'});
		} else if (WAF.directory.currentUserBelongsTo("Employee")) {
			statusArray.push({statusName: ''});
			statusArray.push({statusName: 'pending'});
			statusArray.push({statusName: 'commit'});
		}
		WAF.sources.statusArray.sync();
		
		
		$$("richText2").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
		$$("signInContainer").hide();
		$$("signOutContainer").show();
		$$("container1").show();
		$("#container7").css("top", "-1px");
		$$("container7").hide();
		
		//Load User Account Display
		updateUserAccountDisplay();
		
		ds.Holiday.all({orderBy:"date", onSuccess:function(event) {
			event.entityCollection.toArray("name,date", {onSuccess: function(ev) {
				var arr = ev.result;
				var myHTML = '';
				arr.forEach(function(elem) { 
					myHTML += '<p class="holiday">' + elem.name + " : " + formatDate(ISOToDate(elem.date)) + '</p>';
				});
				$('#container5').html('Upcoming 4D Holidays:  <br/><br/>' + myHTML);
			}});
		}});
		
		$$("textField1").setValue("");
		$$("textField2").setValue("");
		
		WAF.sources.pTO_Request.all({
			onSuccess: function(event) {
				disableInput();
			}
		});
		
		
		
		

	} else {
		$$("signInError").setValue("Invalid login.");
	}
}
//David Robbins Functions - End


// eventHandlers// @lock

	pTO_RequestEvent.onCurrentElementChange = function pTO_RequestEvent_onCurrentElementChange (event)// @startlock
	{// @endlock
		
		if (!((WAF.directory.currentUserBelongsTo("Payroll")) || 
			(WAF.directory.currentUserBelongsTo("Manager")) ||
			(WAF.directory.currentUserBelongsTo("Administrator")))) {
			
			if ((waf.sources.pTO_Request.status !== "pending") && (waf.sources.pTO_Request.status !== "commit")) {
				$$('combobox2').hide();
				$$('textField10').show();
			} else {
				$$('combobox2').show();
				$$('textField10').hide();
			}
		} else {
			$$('combobox2').show();
			$$('textField10').hide();
		}
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		//Cancel Changes to PTO Request
		var primKey = WAF.sources.pTO_Request.ID;
		WAF.sources.pTO_Request.all({
			onSuccess: function (event) {
				WAF.sources.pTO_Request.selectByKey(primKey);
		}});
		
	};// @lock

	button24.click = function button24_click (event)// @startlock
	{// @endlock
		//logout
		$("#errorDiv1").html("");
		if (WAF.directory.logout()) {
			//reset status array
			statusArray = [];
			WAF.sources.statusArray.sync();
			//WAF.sources.pTO_Request.all();
			WAF.sources.pTO_Request.setEntityCollection();
			
			$$("richText2").setValue("");
			$$("signOutContainer").hide();
			$$("signInContainer").show();
			$$("container1").hide();
			$("#container7").css("left", "0px");
			$("#container7").css("top", "80px");
			$$("container7").show();
		}
	};// @lock

	button23.click = function button23_click (event)// @startlock
	{// @endlock
		//change password
		$("#errorDiv1").html("");
		$('#dialog3').css("top", 200);
		$('#dialog3').css("left", 300);
		WAF.widgets['dialog3'].displayDialog();
	};// @lock

	button11.click = function button11_click (event)// @startlock
	{// @endlock
		//Sign In
		signIn();
	};// @lock

	button10.click = function button10_click (event)// @startlock
	{// @endlock
		// Save Button
		var primKey = WAF.sources.pTO_Request.ID;
		$("#errorDiv1").html("");
		WAF.sources.pTO_Request.save({
        	onSuccess: function(event) {
				updateUserAccountDisplay();
				if (event.dataSource.status === "pending") {
					$("#errorDiv1").html("PTO Request Saved. Double-click any request line item to edit your request.");
				} else {
					$("#errorDiv1").html("PTO Request Saved.");
				}
				/**/
				WAF.sources.pTO_Request.all({
					onSuccess: function (event) {
						WAF.sources.pTO_Request.selectByKey(primKey);
						disableInput();
				}});
				
			},
           	onError: function(error) {
           		$('#errorDiv1').html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
           		//Ask Laurent if serverRefresh supports declareDependencies or autoExpand.
           		WAF.sources.pTO_Request.serverRefresh({forceReload: true});
         		/*
           		WAF.sources.pTO_Request.all({
					onSuccess: function (event) {
						WAF.sources.pTO_Request.selectByKey(primKey);
				}});
				*/
          	}
      	
				
      	});
	};// @lock

	button9.click = function button9_click (event)// @startlock
	{// @endlock
		// New Request Button
		$("#errorDiv1").html("Enter your requested days off and hit Save.");
		
		ds.PTO_Request.newPTORequest({
			autoExpand: "requestor",
			onSuccess: function(event) {
				enableInput();
				WAF.sources.pTO_Request.setCurrentEntity(event.result);
				$$('textField3').focus();
			}
		});
	};// @lock

	button8.click = function button8_click (event)// @startlock
	{// @endlock
		//Request Line Item Detail
		$$("tabView1").selectTab(1);
	};// @lock

	button7.click = function button7_click (event)// @startlock
	{// @endlock
		$("#errorDiv1").html("");
		//Request Line Item Detail Save
		WAF.sources.requestLineItemCollection.save({
        	onSuccess: function(event) {
				updateUserAccountDisplay();
				$("#errorDiv1").html("PTO Request Line Item Updated.");
				WAF.sources.requestLineItemCollection.serverRefresh({forceReload: true});
			},
           	onError: function(error) {
           		$('#errorDiv1').html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
           		WAF.sources.requestLineItemCollection.serverRefresh({forceReload: true});
          	}
      	});
		$$("tabView1").selectTab(1);
	};// @lock

	button6.click = function button6_click (event)// @startlock
	{// @endlock
		//Request Line Item Detail
		WAF.sources.requestLineItemCollection.removeCurrent({
		    onSuccess: function(event) {
		        $("#errorDiv1").html("Your PTO request line item has been removed and your user account updated.");
		        updateUserAccountDisplay();
		    },
		    onError: function(error) {
		        $("#errorDiv1").html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
		    }
		});
		$$("tabView1").selectTab(1);
	};// @lock

	dataGrid3.onRowDblClick = function dataGrid3_onRowDblClick (event)// @startlock
	{// @endlock
		$("#errorDiv1").html("");
		$$("tabView1").selectTab(2);
	};// @lock

	button22.click = function button22_click (event)// @startlock
	{// @endlock
		$$('dialog3').closeDialog(); //cancel button
	};// @lock

	button21.click = function button21_click (event)// @startlock
	{// @endlock
		//$("#errorDiv1").html("");
		var passwordData = {
			oldPassword: WAF.sources.changePassword.oldPassword,
			newPassword: WAF.sources.changePassword.newPassword,
			newPasswordAgain: WAF.sources.changePassword.newPasswordAgain				
		};
		
		WAF.ds.User.changePassword({
			onSuccess: function(event) {
				$("#errorDiv1").html(event.result.message);
			},
			onError: function(error) {
				$("#errorDiv1").html("Error Change Password");
			}
		}, passwordData);
		
		$$('dialog3').closeDialog(); //ok button
	};// @lock

	dataGrid1.onRowClick = function dataGrid1_onRowClick (event)// @startlock
	{// @endlock
		disableInput();
		$("#errorDiv1").html('');
		
		
	};// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		WAF.sources.pTO_Request.declareDependencies("requestor");
		WAF.sources.pTO_Request.all();
		
		$("#errorDiv1").html("");
		$("#textField10").attr("disabled", true);  //Status
		$("#textField9").attr("disabled", true);  //Name
		$("#textField7").attr("disabled", true);  //Date Entered
		$("#textField6").attr("disabled", true);  //Auth date
		$$("textField14").disable(); //request line item date
		
		if (WAF.directory.currentUser() === null) {
			$$("richText2").setValue("");
			$$("container1").hide();
			$("#container7").css("top", "80px");
			$("#container7").css("left", "0px");
			$$("container7").show();
			$$("signInContainer").show();
			$$("signOutContainer").hide();
		} else {
			$$("richText2").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
			$$("container1").show();
			$("#container7").css("top", "-1px");
			$$("container7").hide();
			$$("signInContainer").hide();
			$$("signOutContainer").show();
		}
		
		/**/
		$("#textField3").change(function () { 
			WAF.sources.pTO_Request.lastDayOff = new Date($("#textField3").val());
			WAF.sources.pTO_Request.autoDispatch();
			WAF.sources.pTO_Request.returnToWorkDate = new Date(getNextWorkDay("#textField4"));
			WAF.sources.pTO_Request.autoDispatch();
		}); 
		
		$("#textField4").change(function () { 
			WAF.sources.pTO_Request.returnToWorkDate = new Date(getNextWorkDay("#textField4"));
			WAF.sources.pTO_Request.autoDispatch();
		}); 
		
		$('#textField1, #textField2').live('keyup', function (e) {
	   		if ( e.keyCode == 13 ){
	   			signIn();
	    	}
		});
		
		compensationArray = [];
		compensationArray.push({title: 'Floating Day'});
		compensationArray.push({title: 'Paid Time Off'});
		WAF.sources.compensationArray.sync();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("pTO_Request", "onCurrentElementChange", pTO_RequestEvent.onCurrentElementChange, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
	WAF.addListener("button24", "click", button24.click, "WAF");
	WAF.addListener("button23", "click", button23.click, "WAF");
	WAF.addListener("button11", "click", button11.click, "WAF");
	WAF.addListener("button10", "click", button10.click, "WAF");
	WAF.addListener("button9", "click", button9.click, "WAF");
	WAF.addListener("button8", "click", button8.click, "WAF");
	WAF.addListener("button7", "click", button7.click, "WAF");
	WAF.addListener("button6", "click", button6.click, "WAF");
	WAF.addListener("dataGrid3", "onRowDblClick", dataGrid3.onRowDblClick, "WAF");
	WAF.addListener("button22", "click", button22.click, "WAF");
	WAF.addListener("button21", "click", button21.click, "WAF");
	WAF.addListener("dataGrid1", "onRowClick", dataGrid1.onRowClick, "WAF");
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
