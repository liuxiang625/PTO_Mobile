
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
	var button4 = {};	// @button
	var button3 = {};	// @button
	var button1 = {};	// @button
// @endregion// @endlock
	function formatDate(dateObject) {
		var curr_date = dateObject.getDate();
		var curr_month = dateObject.getMonth();
		curr_month++;
		var curr_year = dateObject.getFullYear();
		return curr_month + "/" + curr_date + "/" + curr_year;
	}
	
	function elapsedPayPeriods(seedPTOHours, seedPTOAccrualRate, seedPTODate) {
		var ptoHoursAccruedToDate;
		//var seedPTOHours = userEntity.ptoHours.getValue();
		//var seedPTOAccrualRate= userEntity.ptoAccrualRate.getValue();
		//var seedPTODate = userEntity.ptoSeedDate.getValue();
		
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
	
	function updateHolidayDisplay() {
		var today = new Date();
		//ds.Holiday.all({orderBy:"date", onSuccess:function(event) {
		ds.Holiday.query("date > :1", today,
			{orderBy:"date", onSuccess:function(event) {
			event.entityCollection.toArray("name,date", {onSuccess: function(ev) {
				var arr = ev.result;
				var myHTML = '';
				arr.forEach(function(elem) { 
					myHTML += '<p class="holiday">' + elem.name + " : " + formatDate(ISOToDate(elem.date)) + '</p>';
				});
				$('#holidaysContainer').html(myHTML);
			}});
		}});
	}
	
	function updateUserAccountDisplay() {
		var myCurrentUser = WAF.directory.currentUser(); // Get the current user
		var myUser = WAF.ds.User.find("ID = " + myCurrentUser.ID, {
			onSuccess: function(event) {
				//var theNumberOfElapsedPayPeriods = elapsedPayPeriods(event.entity);
				var theNumberOfElapsedPayPeriods = elapsedPayPeriods(event.entity.ptoHours.getValue(), event.entity.ptoAccrualRate.getValue(), event.entity.ptoSeedDate.getValue());
				var currentPTOHours = event.entity.ptoHours.getValue() + (theNumberOfElapsedPayPeriods * event.entity.ptoAccrualRate.getValue());
				var myHTML = '';
				myHTML += '<p class="title">' + event.entity.fullName.getValue() + "."  + '</p>'; 
				myHTML += '<p class="holiday">' + "Floating Holidays: " + event.entity.floatingDays.getValue() + "."  + '</p>'; 
				myHTML += '<p class="holiday">' + "Paid Time Off Hours: " + currentPTOHours.toFixed(2) + "."  + '</p>'; 
				//myHTML += '<p class="holiday">' + "Manager: " + "Under Construction" + "."  + '</p>'; 
				
				$('#myAccount').html(myHTML);
			}
		}); // Load their user entity.
	}

	
	function signIn() {
//		setMessageValue("");
		$("#signInError").html("");
		if (WAF.directory.loginByPassword(WAF.sources.loginObject.loginName, WAF.sources.loginObject.password)) {
//			statusArray = [];
//			if ((WAF.directory.currentUserBelongsTo("Payroll")) || 
//				(WAF.directory.currentUserBelongsTo("Manager")) ||
//				(WAF.directory.currentUserBelongsTo("Administrator"))) 
//			{
//				currentUserIsManagement = true;
//				statusArray.push({statusName: ''});
//				statusArray.push({statusName: 'pending'});
//				statusArray.push({statusName: 'requested'});
//				statusArray.push({statusName: 'approved'});
//				statusArray.push({statusName: 'rejected'});
//				//statusArray.push({statusName: 'returned'});
//				statusArray.push({statusName: 'closed'});
//			} else if (WAF.directory.currentUserBelongsTo("Employee")) {
//				currentUserIsEmployee = true;
//				statusArray.push({statusName: ''});
//				statusArray.push({statusName: 'pending'});
//				statusArray.push({statusName: 'requested'});
//			}
//			WAF.sources.statusArray.sync();
			
//			$('#calendarButton').show();
//			$$("richText2").setValue("Signed in as : " + WAF.directory.currentUser().fullName);
//			$$("signInContainer").hide();
//			$$("signOutContainer").show();
//			$$("container1").show();
//			$("#container7").css("top", "-1px");
//			$$("container7").hide();
			
//			updateUserAccountDisplay();
//			updateHolidayDisplay();
//			
//			$$("textField1").setValue("");
//			$$("textField2").setValue("");
//			
			WAF.sources.pTO_Request.query(
				"status !== :1 order by firstDayOff", "closed", 
				{
				onSuccess: function(event) {
					//disableInput();
					//createEmailAccordian();
					//currentPTOPrimaryKey = WAF.sources.pTO_Request.ID;
					$$('navigationView2').goToView(2);
					updateHolidayDisplay();
					updateUserAccountDisplay()
				}
			});
			
			//Closed PTOs.
			//waf.sources.pTO_Request1.query("status = :1", "closed");
			
		} else {
			$("#signInError").html("Invalid login.");
		}
	} //end signIn()
	
	function monthDiff(d1, d2) {
	    var months;
	    months = (d2.getFullYear() - d1.getFullYear()) * 12;
	    months -= d1.getMonth() + 1;
	    months += d2.getMonth();
	    return months;
	}
	
// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		if (WAF.directory.currentUser() === null) {
			console.log(WAF.directory.currentUser());
		}
		else {
			$$('navigationView2').goToView(2);
			updateHolidayDisplay();
			updateUserAccountDisplay()
		}
	};// @lock

	button4.click = function button4_click (event)// @startlock
	{// @endlock
		sources.pTO_Request.status = "pending";
		WAF.sources.pTO_Request.save({
	    	onSuccess: function(event) {
	    		//console.log('primary key after save: ' + event.dataSource.ID);
//				updateUserAccountDisplay();
//				if (event.dataSource.status === "requested") {
//					setMessageValue("PTO Request Saved. An email has been sent to your manager.");
//				} else if (event.dataSource.status === "pending") {
//					setMessageValue("PTO Request Saved. Double-click line-items to update PTO request.");
//				} else {
//					setMessageValue("PTO Request Saved.");
//				}
				
				//WAF.sources.pTO_Request.addEntity(event.dataSource.getCurrentElement());
				//WAF.sources.pTO_Request.selectByKey(primKey);
				WAF.sources.pTO_Request.selectByKey(event.dataSource.ID);
				$$('navigationView2').goToView(2);
				//currentPTOPrimaryKey = primKey;
				//createEmailAccordian();
				//disableInput();
					
			},
	     	onError: function(error) {
	        	setMessageValue(error['error'][0].message + " (" + error['error'][0].errCode + ")", true);
	           	WAF.sources.pTO_Request.serverRefresh({forceReload: true});
	          }		
	      });
	};// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		ds.PTO_Request.newPTORequest({
			autoExpand: "requestor",
			onSuccess: function(event) {
				//enableInput();
				WAF.sources.pTO_Request.setCurrentEntity(event.result);
				//$$('textField3').focus();
				$$('navigationView2').goToView(3);
			}
		});
		
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		signIn();
		//$$('navigationView2').goToView(2);
		//updateHolidayDisplay();
	};// @lock


	
// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
	WAF.addListener("button4", "click", button4.click, "WAF");
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
// @endregion
};// @endlock
