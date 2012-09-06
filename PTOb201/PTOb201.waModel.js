
guidedModel =// @startlock
{
	RequestLineItem :
	{
		methods :
		{// @endlock
			getCalendarArray:function()
			{// @lock
				// Add your code here
				//{title  : 'event1', start  : '2012-08-01'}
				
				/*
				eventArray.push({title  : 'Tim Penner : Floating Day', start  : '2012-08-01'});
				eventArray.push({title  : 'Tim Penner : Floating Day', start  : '2012-08-02'});
				eventArray.push({title  : 'Josh Fletcher : Paid Time Off : 4hrs', start  : '2012-09-05'});
				*/
				var managerName;
				var sessionRef = currentSession(); // Get session.
				var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.	
				//if (loginByPassword("admin", "admin")) {	
					var eventArray = [];		
					var ptoLineItems = ds.RequestLineItem.query("ptoRequest.status = :1", "approved");
					
					/**/
					ptoLineItems.forEach(function(lineItem) {
						var eventObj = {};
						if (typeof lineItem.ptoRequest !== "undefined") {
							if (typeof lineItem.ptoRequest.requestor !== "undefined") {
								eventObj.title =  lineItem.ptoRequest.requestor.fullName + " : " + lineItem.compensation;
								if (lineItem.compensation === "Paid Time Off") {
									eventObj.title += " : " + lineItem.hoursRequested;
								}
								
								//get Manager
								managerName = lineItem.ptoRequest.requestor.myManager.fullName;
								myName = lineItem.ptoRequest.requestor.fullName;
								
								switch(managerName) {
									case "Sandra Michaels":
									if (myName === "Tom Miller") {
										eventObj.backgroundColor = "#B0C4DE";
										eventObj.borderColor = "#999999";
										eventObj.textColor = "#333333";
									} else if (myName === "Michel Gerin")  {
										eventObj.backgroundColor = "#F0F080";
										eventObj.borderColor = "#999999";
										eventObj.textColor = "#333333";
									} else {
										eventObj.backgroundColor = "#B0C4DE";
										eventObj.borderColor = "#999999";
										eventObj.textColor = "#333333";
									}	
									break;
									
									case "Tom Miller":
										if (myName === "Tracy Roberts") {
											eventObj.backgroundColor = "#B4ACE6";
											eventObj.borderColor = "#999999";
											eventObj.textColor = "#333333";
										} else if (myName === "Add Komoncharoensiri")  {
											eventObj.backgroundColor = "#3CBC71";
											eventObj.borderColor = "#999999";
											eventObj.textColor = "#333333";
										} else {
											eventObj.backgroundColor = "#B0C4DE";
											eventObj.borderColor = "#999999";
											eventObj.textColor = "#333333";
										}
									break;
									
									case "Michel Gerin":
									eventObj.backgroundColor = "#F0F080";
									eventObj.borderColor = "#999999";
									eventObj.textColor = "#333333";
									break;
									
									case "Add Komoncharoensiri":
									eventObj.backgroundColor = "#3CBC71";
									eventObj.borderColor = "#999999";
									eventObj.textColor = "#333333";
									break;
									
									case "Tracy Roberts":
									eventObj.backgroundColor = "#B4ACE6";
									eventObj.borderColor = "#999999";
									eventObj.textColor = "#333333";
									break;
									
									default:
									eventObj.backgroundColor = "#B0C4DE";
									eventObj.borderColor = "#999999";
									eventObj.textColor = "#333333";
								}

								eventObj.start = formatDateForCalendar(lineItem.dateRequested);
								eventArray.push(eventObj);
							}
						}
					});
					
					
					//logout();
					sessionRef.unPromote(promoteToken); //put the session back to normal.
					return eventArray;
					
				//}
				
				
				
			}// @startlock
		},
		events :
		{
			onRemove:function()
			{// @endlock
				/**/
				var err;
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
				if (sessionRef.belongsTo("Administrator")) {
					//err = { error : 5099, errorMessage: "The Administrator is not allowed to remove PTO Request Line Items."};
					//return err;
				
				} else if (sessionRef.belongsTo("Manager") && (this.ptoRequest.requestor.login !== myCurrentUser.name)) {	
					err = { error : 5095, errorMessage: "A Manager is only allowed to remove their own PTO Request Line Items."};
					return err;
				
				} else if ((sessionRef.belongsTo("Employee")) || (sessionRef.belongsTo("Manager"))) {
	
					//Can't remove last request line item.
					var thePTO = this.ptoRequest;
					if (thePTO.requestLineItemCollection.length === 1) {
						err = { error : 5091, errorMessage: "You cannot remove the last PTO Request Line Item."};
						return err;
					}
					
					if (this.ptoRequest.status === "pending") { //want to check the status of the PTO request here.
						if (this.compensation === "Floating Day") {
							var sessionRef = currentSession(); // Get session.
							var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
							//update the user account and put back the Floating Day.
							myUserV.floatingDays += 1;
							myUserV.save();
							sessionRef.unPromote(promoteToken); //put the session back to normal.
						}
						
						if (this.compensation === "Paid Time Off") {
							var sessionRef = currentSession(); // Get session.
							var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
							//update the user account and put back the Floating Day.
							myUserV.ptoHours += this.hoursRequested;
							myUserV.save();
							sessionRef.unPromote(promoteToken); //put the session back to normal.
						}
					} else {
						err = { error : 5097, errorMessage: "You cannot remove PTO Request Line Items unless the PTO status is pending."};
						return err;
					}
					
					
				} else {	
					err = { error : 5090, errorMessage: "You must sign in to remove PTO Request Line Items."};
					return err;
				}
				
				
			},// @startlock
			onValidate:function()
			{// @endlock
				var err;
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
					
				if (sessionRef.belongsTo("Administrator")) {
					err = { error : 5099, errorMessage: "The Administrator is not allowed to update PTO Request Line Items."};
					return err;
				
				} else if (sessionRef.belongsTo("Manager") && (this.ptoRequest.requestor.login !== myCurrentUser.name)) {	
					err = { error : 5095, errorMessage: "A Manager is only allowed to update their own  PTO Request Line Items."};
					return err;
				
				} else if (sessionRef.belongsTo("Employee")) {
					
					
				} else {	
					err = { error : 5090, errorMessage: "You must sign in to update PTO Request Line Items."};
					return err;
				}
				
				
				
				//User wants to update their PTO Request line item.
				if (!this.isNew()) {
					var theClass = this.getDataClass(); //get the dataclass of the entity to save
					var theClassName = theClass.getName(); //get the dataclass name
					var oldEntity = theClass(this.getKey()); //find the same entity on disk	
					
					//Can't edit compensation method or date.
					//if (this.dateRequested !== oldEntity.dateRequested) {
					DaysDiff = Math.floor((this.dateRequested.getTime() - oldEntity.dateRequested.getTime())/(1000*60*60*24));
					if (DaysDiff !== 0) {
						err = { error : 5080, errorMessage: "You cannot change the PTO Request Line Item date requested."};
						return err;
					}
					
					/*
					//Let's not let them change the compensation method.
					if (this.compensation !== oldEntity.compensation) {
						err = { error : 5071, errorMessage: "You cannot change the PTO Request Line Item compensation method."};
						return err;
					}
					*/
					
					//Did compensation method change?
					if (this.ptoRequest.status === "pending") {
						if (this.compensation !== oldEntity.compensation) {
						//Changed Compensation Method
							if (this.compensation === "Floating Day") {
								/**/
								if (myUserV.floatingDays < 1) {
									err = { error : 5070, errorMessage: "You do not have any Floating Days left in your bank."};
									return err;
								}
								
							} //(this.compensation === "Floating Day")
							
							if (this.compensation === "Paid Time Off") {
								if ((this.hoursRequested < 1) || (this.hoursRequested > 7)) {
									err = { error : 5052, errorMessage: "You cannot request hours less than 1 or greater than 8."};
									return err;
								} else {
									//check if we have enough hours.
									if ((this.hoursRequested > myUserV.ptoHours) && (this.hoursRequested > oldEntity.hoursRequested)){
										err = { error : 5054, errorMessage: "You do not have enough hours in your bank for this request."};
										return err;
									}
								}//((this.hoursRequested < 1) || (this.hoursRequested > 7))
							}
						} else {
						//Did not change compensation method
							
							if (this.compensation === "Floating Day") {
								if (this.hoursRequested !== oldEntity.hoursRequested) {
									err = { error : 5050, errorMessage: "You don't need to request hours for Floating Days."};
									return err;
								}
							} //(this.compensation === "Floating Day")
							
							
							if (this.compensation === "Paid Time Off") {
								/**/
								if ((this.hoursRequested < 1) || (this.hoursRequested > 7)) {
									err = { error : 5052, errorMessage: "You cannot request hours less than 1 or greater than 8."};
									return err;
								} else {
									//check if we have enough hours.
									if ((this.hoursRequested > myUserV.ptoHours) && (this.hoursRequested > oldEntity.hoursRequested)){
										err = { error : 5054, errorMessage: "You do not have enough hours in your bank for this request."};
										return err;
									}
								}//((this.hoursRequested < 1) || (this.hoursRequested > 7))
							} //(this.compensation === "Paid Time Off")
							
						} //(this.compensation !== oldEntity.compensation)
						
						
						
					} else {
						err = { error : 5097, errorMessage: "You cannot update PTO Request Line Items unless the PTO status is pending."};
						return err;
					}
				} //(!this.isNew())
				
			
			},// @startlock
			onSave:function()
			{// @endlock
				if (!this.isNew()) {
					
					var sessionRef = currentSession(); // Get session.
					var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.				
					var theClass = this.getDataClass(); //get the dataclass of the entity to save
					var theClassName = theClass.getName(); //get the dataclass name
					var oldEntity = theClass(this.getKey()); //find the same entity on disk
					var myCurrentUser = currentUser(); // Get the current user
					var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity.
					
					if (this.hoursRequested < oldEntity.hoursRequested) {
						myUser.ptoHours += oldEntity.hoursRequested - this.hoursRequested;
					}
					
					if (this.hoursRequested > oldEntity.hoursRequested) {
						myUser.ptoHours -= this.hoursRequested;
					}
					
					if (this.compensation !== oldEntity.compensation) {
						if (this.compensation === "Paid Time Off") {
							//Return Floating Day
							myUser.floatingDays += 1;
						}
						
						if (this.compensation === "Floating Day") {
							myUser.floatingDays -= 1;
							myUser.ptoHours -= oldEntity.ptoHours;
							this.hoursRequested = 0;
						}
					}
					
					myUser.save();
					sessionRef.unPromote(promoteToken); //put the session back to normal.
					
					//return {error: 5000, errorMessage: "Just a test."};
				} (!this.isNew()) 
				
			}// @startlock
		}
	},
	PTO_Request :
	{
		collectionMethods :
		{// @endlock
			getIDs:function()
			{// @lock
				var requestIDs = this.toArray("ID");
				return requestIDs;
			}// @startlock
		},
		entityMethods :
		{// @endlock
			getStatusList:function()
			{// @lock
				var statusArray = [];
				
				if (currentSession().belongsTo("Payroll") || currentSession().belongsTo("Manager") || currentSession().belongsTo("Administrator")) {
					statusArray = [{statusName: ""}, {statusName: "pending"}, {statusName: "requested"}, {statusName: "approved"}, {statusName: "returned"}];
				} else if (currentSession().belongsTo("Employee")) {
					statusArray = [{statusName: ""}, {statusName: "pending"}, {statusName: "requested"}];
					if ((this.status !== "pending") && (this.status !== "requested")) {
						var myNewStatusObj = {statusName: ""};
						myNewStatusObj.statusName = this.status;
						statusArray.push(myNewStatusObj);
					}
				}
				
				return statusArray;
				
				
				//var statusArray = [];
				//statusArray = [{statusName: "VV"}, {statusName: "pending"}, {statusName: "requested"}];
				//return {dave: "robbins"};
				//return statusArray;
				//return this.status;
				//var myNewStatusObj = {statusName: ""};
				//myNewStatusObj.statusName = this.status;
				//return myNewStatusObj;
			},// @lock
			getLineItemsRange:function(startDate, endDate)
			{// @lock
		
				// For the current PTO Request get all line items in date range.
				//return this.requestLineItemCollection;
				//return this.requestLineItemCollection.query("compensation = :1", "Floating Day");
				return this.requestLineItemCollection.query("dateRequested >= :1 && dateRequested <= :2", startDate, endDate);
			}// @startlock
		},
		methods :
		{// @endlock
			getListOfStatus:function(currentStatus)
			{// @lock
				var statusArray = [];
				
				if (currentSession().belongsTo("Payroll") || currentSession().belongsTo("Manager") || currentSession().belongsTo("Administrator")) {
					statusArray = [{statusName: ""}, {statusName: "pending"}, {statusName: "requested"}, {statusName: "approved"}, {statusName: "returned"}];
				} else if  (currentSession().belongsTo("Employee")) {
					statusArray = [{statusName: ""}, {statusName: "pending"}, {statusName: "requested"}];
				}
				
				//return [{statusName: ""}, {statusName: "pending"}, {statusName: "commmit"}, {statusName: "approved"}];
				
				return statusArray;
			},// @lock
			newPTORequest:function()
			{// @lock
				// create new PTO Request entity
				return new ds.PTO_Request();
			}// @startlock
		},
		events :
		{
			onRemove:function()
			{// @endlock
				var ptoRequest = this;
				var myCurrentUser = currentUser(); // Get the current user
				var sessionRef = currentSession(); // Get session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity
				
				
				if (!(sessionRef.belongsTo("Administrator"))) {
					if (myUser !== null) {
						//Remove a PTO Request.
						if (currentSession().belongsTo("Payroll") || currentSession().belongsTo("Manager") || currentSession().belongsTo("Administrator")) {
							if (ptoRequest.requestor.ID !== myUser.ID) {
								return {error: 2060, errorMessage: "Delete request rejected on the server. Only the requestor can remove a PTO."};
							}
						
						} else {
							//requestor is trying to remove PTO request.
							if (this.status !== "pending") {
								return {error: 2020, errorMessage: "Delete request rejected on the server. Only pending requests can be removed."};
							} else {
								return {error: 2030, errorMessage: "Delete request rejected on the server. Just for now..."};
							}
						}
					
					} else {
						return {error: 2040, errorMessage: "Delete request rejected on the server. User record could not be loaded."};
					}
				} //(!(sessionRef.belongsTo("Administrator"))) 
			},// @startlock
			onRestrictingQuery:function()
			{// @endlock
				var myCurrentUser = currentUser(); // Get the current user
				var sessionRef = currentSession(); // Get session.
				var result = ds.PTO_Request.createEntityCollection();
				/**/
				//if (currentUser().name === "admin") {
				if (currentSession().belongsTo("Administrator")) {
					result = ds.PTO_Request.all();
				
				} else {
					//Load User entity.
					//var myCurrentUser = currentUser(); // Get the current user
					//var sessionRef = currentSession(); // Get session.
					var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.	
					var myUser = ds.User.find("ID = :1", myCurrentUser.ID); // Load their user entity.
					sessionRef.unPromote(promoteToken); //put the session back to normal.
					
					if (myUser !== null) {
						//if (myUser.accessLevel < 4) {
						if (myUser.role === "Manager" || myUser.role === "Payroll") {
							result = ds.PTO_Request.query("requestor.myManager.login = :1 and status !== :2", myCurrentUser.name, "pending");
							theManagerPTOs = ds.PTO_Request.query("requestor.login = :1", currentUser().name);
							result = result.add(theManagerPTOs);
							
						} else {
							result = ds.PTO_Request.query("requestor.login = :1", myCurrentUser.name);
						}
					}
				}
				
				
				
				
				return result;
			},// @startlock
			onSave:function()
			{// @endlock
				var myCurrentUser = currentUser(), // Get the current user
				myUser = ds.User.find("ID = :1", myCurrentUser.ID), // Load their user entity.
				the4DHolidays = ds.Holiday.all(),
				numberOf4DHolidays = the4DHolidays.length,
				myDayPointer = this.firstDayOff,
				myLastDay = this.lastDayOff,
				theDayNumber,
				hours,
				theClass = this.getDataClass(), //get the dataclass of the entity to save
				theClassName = theClass.getName(), //get the dataclass name
				oldEntity = theClass(this.getKey()), //find the same entity on disk
				vacationDateCompare = dates.compare(this.firstDayOff, this.lastDayOff);
				
				if ((myUser !== null) && (this.isNew())) {
					//if (myLastDay != null) {
					if (vacationDateCompare === -1) {
						while (myDayPointer <= myLastDay) { // Loop thru the requested days off.
							theDayNumber = myDayPointer.getDay();
						 	if ((theDayNumber > 0) && (theDayNumber < 6) && (!is4DHoliday(myDayPointer))){
						 		addPTOLineItem(this, myUser, myDayPointer);
							}
							myDayPointer.setDate(myDayPointer.getDate()+1); // Go to next requested day off.
						}
					} else { //Requesting One Day Off.
						theDayNumber = myDayPointer.getDay();
						if ((theDayNumber > 0) && (theDayNumber < 6) && (!is4DHoliday(myDayPointer))){
							addPTOLineItem(this, myUser, myDayPointer);
						} else {
							//can i reject this
							return {error: 10455, errorMessage: "You don't need to request PTO. This day is a holiday."};
						}
					} //(myLastDay != null)
				}//(myUser !== null)				
				
				
				if (this.status === "approved") {
						this.authorizationDate = new Date();
				}
				
				/**/
				//Employee send email to manager for approval.
				if ((myUser !== null) && (!this.isNew())) {
					if ((this.status === "requested") && (oldEntity.status !== "requested")) {
						//Put request line items in an array.
						var requestLineItemsArray = [];
						var lineItems = this.requestLineItemCollection;
						lineItems.forEach(function(lineItem) {
							var lineItemObj = {};
							lineItemObj.hoursRequested = lineItem.hoursRequested;
							lineItemObj.dateRequested = formatDate(lineItem.dateRequested);
							lineItemObj.compensation = lineItem.compensation;
							requestLineItemsArray.push(lineItemObj);
						});
						
						
						//Employee is requesting PTO. Send email to manager.
						var theEmailWorker = new SharedWorker("sharedWorkers/emailDaemon.js", "emailDaemon");
						var thePort = theEmailWorker.port; // MessagePort to communicate with the email shared worker.
						thePort.postMessage({what: 'requestTimeOff',
								requestorID : this.requestor.ID,
								firstDayOff: formatDate(this.firstDayOff),
								lastDayOff: formatDate(this.lastDayOff),
								requestLineItems: requestLineItemsArray,
								notes: this.emailText
								//requestLineItems: [{name: "dave"}, {name: "tom"}, {name: "bill"}]
						});
						
						thePort.postMessage({what: 'htmlEmailTest'});
						
						new ds.Note({ 
							date: new Date(),
							title: "PTO Request from " + this.requestor.fullName + " submitted to Manager.",
							body: this.emailText,
							date: new Date(),
							pto: this
						}).save();
					}//((this.status === "requested") && (oldEntity.status !== "requested"))
					
					//Manager send email to employee
					var sendEmaiToManager = false;
					if ((this.status === "approved") && (oldEntity.status === "requested")) {
						sendEmaiToManager = true;
					}
					if ((this.status === "rejected") && (oldEntity.status === "requested")) {
						sendEmaiToManager = true;
					}
					//if ((this.status === "approved") && (oldEntity.status !== "approved")) {
					if (sendEmaiToManager) {
						//Manager has approved the request. Send email to employee.
						//Put request line items in an array.
						var requestLineItemsArray = [];
						var lineItems = this.requestLineItemCollection;
						lineItems.forEach(function(lineItem) {
							var lineItemObj = {};
							lineItemObj.hoursRequested = lineItem.hoursRequested;
							lineItemObj.dateRequested = formatDate(lineItem.dateRequested);
							lineItemObj.compensation = lineItem.compensation;
							requestLineItemsArray.push(lineItemObj);
						});
						
						var theEmailWorker = new SharedWorker("sharedWorkers/emailDaemon.js", "emailDaemon");
						var thePort = theEmailWorker.port; // MessagePort to communicate with the email shared worker.
						thePort.postMessage({what: 'requestApproved',
								requestorID : this.requestor.ID,
								firstDayOff: formatDate(this.firstDayOff),
								lastDayOff: formatDate(this.lastDayOff),
								requestLineItems: requestLineItemsArray,
								notes: this.emailText,
								status: this.status
						});
						
						//this.notes = "";
						
						new ds.Note({ 
							date: new Date(),
							title: "PTO  request from "  + this.requestor.fullName + " "  + this.status + " by " + this.requestor.myManager.fullName,
							body: this.emailText,
							pto: this
						}).save();
						
						
						if (this.status === "rejected") {
							this.status = "pending";
						}
						
						
					}//sendEmaiToManager)
				} //((myUser !== null) && (!this.isNew())) {
				
			},// @startlock
			onInit:function()
			{// @endlock
				var sessionRef = currentSession(); // Get session.
				var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
				var err;
				var myCurrentDate = new Date(); // we get the current date.
				var myCurrentUser = currentUser(); // we get the user of the current session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID);
    			
				if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.
        			this.dateEntered = myCurrentDate;
        			this.requestor = myUser;  //New
        			this.status = "pending";
        			this.authorizationDate = null;
        		} else {
        			err = { error : 4, errorMessage: "Your request is invalid. Have Human Resources check your User record." };
				} //if (user != null)
				
				sessionRef.unPromote(promoteToken); //put the session back to normal.	
				
				if (err != null) {
					return err;
				}//if (err != null)
							
			},// @startlock
			onValidate:function()
			{// @endlock
				//is4DHoliday
				var err;
				var theClass = this.getDataClass(); //get the dataclass of the entity to save
				var theClassName = theClass.getName(); //get the dataclass name
				var oldEntity = theClass(this.getKey()); //find the same entity on disk
				var sessionRef = currentSession(); // Get session.
				var myCurrentUser = currentUser(); // Get the current user.
				var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
				
				
				if (sessionRef.belongsTo("Administrator")) {
					err = { error : 3099, errorMessage: "The Administrator is not allowed to update PTO requests."};
					return err;
					
					
				} else if (sessionRef.belongsTo("Manager") && (this.requestor.login !== myCurrentUser.name)) {
				
				
					//status
					//Let's think about status June 29 2012
					if ((this.status === "closed") && (oldEntity.status === "requested")) {
						err = { error : 4022, errorMessage: "You do not have permission to close a requested PTO request."};
						return err;	
					}
					
					if ((oldEntity.status === "closed") || (oldEntity.status === "rejected")) {
						err = { error : 4011, errorMessage: "You do not have permission to update a closed PTO request."};
						return err;	
					}
					
					if (this.status === "pending") {
						err = { error : 4012, errorMessage: "You cannot change an employee request to pending."};
						return err;	
					}
					
					if (this.firstDayOff === null) {
						err = { error : 4010, errorMessage: "You do not have permission to update the First Day Off field value."};
						return err;	
					}
					
					if (this.lastDayOff === null) {
						err = { error : 4015, errorMessage: "You do not have permission to update the Last Day Off field value."};
						return err;	
					}
					
					if (this.returnToWorkDate === null) {
						err = { error : 4020, errorMessage: "You do not have permission to update the Return To Work field value."};
						return err;	
					}
					
					if (this.firstDayOff.toString() != oldEntity.firstDayOff.toString()) {
						err = { error : 4030, errorMessage: "You do not have permission to update the First Day Off field."};	
						return err;	
					}

					if (this.lastDayOff.toString() != oldEntity.lastDayOff.toString()) {
						err = { error : 4040, errorMessage: "You do not have permission to update the Last Day Off field."};
						return err;		
					}
					
					if (this.returnToWorkDate !== null) {
						if (this.returnToWorkDate.toString() != oldEntity.returnToWorkDate.toString()) {
							err = { error : 4050, errorMessage: "You do not have permission to update the Return To Work field."};	
							return err;	
						}
					}
					
					/*
					if (this.notes != oldEntity.notes) {
						err = { error : 4060, errorMessage: "You do not have permission to update the Notes field."};
						return err;		
					}
					*/
					
					
					

						
				} else if (sessionRef.belongsTo("Employee")) {
					//Does this entity belong to the employee that is signed in?
					if (this.requestor.HA1Key !== myUserV.HA1Key) {
						err = { error : 2001, errorMessage: "You cannot update another employee's PTO request."};
						return err;
					}
					
					if (!((this.status === "pending") || (this.status === "requested"))) {
						err = { error : 2006, errorMessage: "Invalid status."};
						return err;
					}
					
					
					if (this.firstDayOff === null) {
						err = { error : 2002, errorMessage: "You must enter a First Day Off."};
						return err;
					}
					
					if (this.lastDayOff === null) {
						err = { error : 2003, errorMessage: "You must enter a Last Day Off."};
						return err;
					}
					
					if (this.returnToWorkDate === null) {
						err = { error : 2004, errorMessage: "You must enter a Return To Work Date."};
						return err;
					}
					
					
					var firstDayOff = this.firstDayOff;
					var lastDayOff = this.lastDayOff;
					var currentDate = new Date;
					//var myCurrentUser = currentUser(); // Get the current user.
					//var myUserV = ds.User.find("ID = :1", myCurrentUser.ID);
					
					if ((this.authorized !== null) && (oldEntity.authorized !== null)) {
						if (this.authorized !== oldEntity.authorized) {
							err = { error : 2005, errorMessage: "You do not have permission to change the authorization."};
							return err;	
						}
					}
					
					
					if (this.authorized) {
							err = { error : 2010, errorMessage: "You do not have permission to authorize PTO requests."};
							return err;	
					}	
					
					
					//You cannot update certain fields of a current request
					if (!this.isNew()) {
					 	//This is an existing PTO rquest.
					 	if (this.authorizationDate !== oldEntity.authorizationDate) {
					 		err = { error : 2006, errorMessage: "You do not have permission to change the authorization date."};
							return err;	
					 	}
					 	
					 	
					 	if (this.status !== oldEntity.status) {
					 		//check to see if it's ok for the employee to change the status
					 		if (oldEntity.status !== "pending") {
								err = { error : 2007, errorMessage: "You do not have permission to change the status."};
								return err;	
							} else { 
								//current status is pending
								if (this.status !== "requested") {
									err = { error : 2007, errorMessage: "You do not have permission to change the status."};
									return err;	
								} 
							}
						}
					
					 	if (this.firstDayOff === null) {
							err = { error : 2012, errorMessage: "You cannot update the First Day Off field of an existing request."};
							return err;	
						}
					
						if (this.lastDayOff === null) {
							err = { error : 2015, errorMessage: "You cannot update the Last Day Off field of an existing request."};
							return err;	
						}
					
						if (this.returnToWorkDate === null) {
							err = { error : 2020, errorMessage: "You cannot update the Return To Work field of an existing request."};
							return err;	
						}
					
						if (this.firstDayOff.toString() != oldEntity.firstDayOff.toString()) {
							err = { error : 2030, errorMessage: "You cannot update the First Day Off of an existing request."};	
							return err;	
						}

						if (this.lastDayOff.toString() != oldEntity.lastDayOff.toString()) {
							err = { error : 2040, errorMessage: "You cannot update the Last Day Off of an existing request."};
							return err;		
						}
					
						if (this.returnToWorkDate !== null) {
							if (this.returnToWorkDate.toString() != oldEntity.returnToWorkDate.toString()) {
								err = { error : 2050, errorMessage: "You cannot update the Return To Work field of an existing request."};	
								return err;	
							}
						}
						
					} //This is an existing request - end.
					
					//Only for new requests
					if (this.isNew()) {
						//Requesting One Day and it's a holiday?
						dateCompare = dates.compare(firstDayOff, currentDate);
						if (dateCompare === 0) {
							if (is4DHoliday(firstDayOff)) {
								err = { error : 2065, errorMessage: "You don't need to take PTO. This day is a holiday." };
								return err;	
							}
						}
						
						//Has the first day requested already past?
						dateCompare = dates.compare(firstDayOff, currentDate);
						if (dateCompare < 0) {
							err = { error : 2064, errorMessage: "Your request is invalid. The requested dates have already passed." };
							return err;	
						}
					
					
						if (lastDayOff !== null) {
							//Has the last day requested already past?
							dateCompare = dates.compare(lastDayOff, currentDate);
							if ((dateCompare < 0)  & (err == null)) {
								err = { error : 2072, errorMessage: "Your request is invalid. The requested dates have already past." };
								return err;	
							}
							
							//Is the last day requested before the first day requested?
							//dateCompare = dates.compare(lastDayOff, firstDayOff);
							//if ((dateCompare < 0) & (err == null)) {
							//	err = { error : 2078, errorMessage: "Your request is invalid. The last day off is before the first day off." };
							//	return err;	
							//}
						}
					
						//Does the user have enough hours?
						//Only check this for new requests
						if (this.isNew()) {
							if (lastDayOff != null) {
								var oneDay = 24*60*60*1000; // hours*minutes*seconds*milliseconds
								var daysRequested = daysOffRequested(firstDayOff, lastDayOff);
							} else {
								daysRequested = 1;
							}
							var theNumberOfElapsedPayPeriods = elapsedPayPeriods(myUserV);
							var currentPTOHoursV = myUserV.ptoHours + (theNumberOfElapsedPayPeriods * myUserV.ptoAccrualRate);
							currentPTOHoursV = Math.floor(currentPTOHoursV);
							var ptoDaysRemaining = Math.floor(currentPTOHoursV/8);
							var floatingDays = myUserV.floatingDays;
							var myTotalDays = ptoDaysRemaining + floatingDays;
							if ((myTotalDays < daysRequested)  & (err == null)) { //floatingDays + ptoDaysRemaining	
								if ((currentPTOHoursV > 0) && (myTotalDays === daysRequested - 1)) {
									// no error
								} else {
									err = { error : 2088, errorMessage: "You have requested " + daysRequested + " days off. You do not have enough PTO/Floating Holidays for this request." };
									return err;	
								}
							}
						}
					
					
					
						//Duplicate request?
						if (this.isNew()) {
							if (duplicatePTORequest(this, myUserV)) {
								err = { error : 2089, errorMessage: "This request conflicts with a previous request." };
								return err;	
							}
						}
					} //Only for new requests.
						
				} else {
					//This session does not belong to any authorized group.
					err = { error : 3096, errorMessage: "You are not authorized to update this PTO request."};
					return err;	
				}
				
			}// @startlock
		}
	},
	User :
	{
		methods :
		{// @endlock
			changePassword:function(passwordData)
			{// @lock
				var sessionRef = currentSession(); // Get session.
				var promoteToken = sessionRef.promoteWith("Administrator"); //temporarily make this session Admin level.
				//Find the User entity for the current user.
				var myCurrentUser = currentUser(); // we get the user of the current session.
				var myUser = ds.User.find("ID = :1", myCurrentUser.ID);
    			
				if ((myCurrentUser !== null) && (myUser !== null)) {//if a user is logged in.
					
					if (myUser.validatePassword(passwordData.oldPassword)) {
						if (passwordData.newPassword === passwordData.newPasswordAgain) {
							myUser.password = passwordData.newPassword;
							myUser.save();
							return {message: "Your password has been changed."};
						} else {
							return {message: "You did not match the new password."};
						}
					} else {
						return {message: "You did not enter the correct password."};
					}
					
				} else {
					return {message: "Could not load your user account on the server. You password was not changed."}
				}
				
				sessionRef.unPromote(promoteToken); //put the session back to normal.	
			}// @startlock
		},
		events :
		{
			onRestrictingQuery:function()
			{// @endlock
				var result = ds.User.createEntityCollection();
				
				if (currentSession().belongsTo("Administrator")) {
					result = ds.User.all();
				
				} else if (currentSession().belongsTo("Manager")) {
					//screencast
					result =  ds.User.query("myManager.login = :1", currentUser().name);
					theManager = ds.User.find("login = :1", currentUser().name);
					result = result.add(theManager);
					
					//result = ds.User.all();
				} else if (currentSession().belongsTo("Employee")) {
					result = ds.User.query("login = :1", currentUser().name);
				}
				
				return result;
			},// @startlock
			onSave:function()
			{// @endlock
				// Add your code here
				//Reset the seed values.
				//var theNumberOfElapsedPayPeriods = elapsedPayPeriods(this);
				//var currentPTOHours = this.ptoHours + (theNumberOfElapsedPayPeriods * this.ptoAccrualRate);				
				//this.ptoHours = currentPTOHours;
				//this.ptoSeedDate = new Date();
			}// @startlock
		},
		entityMethods :
		{// @endlock
			validatePassword:function(password) //only use the password.
			{// @lock
				var ha1 = directory.computeHA1(this.ID, password);
				return (ha1 === this.HA1Key); //true if validated, false otherwise.
			}// @startlock
		},
		password :
		{
			onSet:function(value)
			{// @endlock
				this.HA1Key = directory.computeHA1(this.ID, value);
				//we use the ID to compute the HA1 key.
				//I need to check password compliance here - not blank, number of chars.
			},// @startlock
			onGet:function()
			{// @endlock
				return "*****"; //could also return Null.
			}// @startlock
		}
	}
};// @endlock
