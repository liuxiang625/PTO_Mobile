function sinInButton_clicked() {
    if (WAF.directory.loginByPassword($("#textinput1").val(), $("#textinput2").val())) {
    	loadPTOs('pending');
    	loadPTOs('approved');
    }
    else {
        $('#log > div').remove();
        event.preventDefault();
        event.stopPropagation();// stop button from going to deafault link
        $('<div></div>').append('Invalid username or password').appendTo('#log');
    }
};

function logOutButton_clicked() {
	if (WAF.directory.logout()) {
		$("#textinput1").val("");
		$("#textinput2").val("");
		$("#collapsibleSet").empty();// get rid of generated collapsibles
	
	}
	else {
		event.preventDefault();
        event.stopPropagation();
        alert("Log Out Failed!");
	}
};

function loadPTOs(ptoStatus) {
	WAF.ds.User.query("fullName = :1",WAF.directory.currentUser().fullName , {
    		autoExpand: "pTO_RequestCollection",
    		onSuccess: function(event) {
    			event.entityCollection.forEach({
    				onSuccess: function(ev) {
    					var ptoCollectionRel = ev.entity.pTO_RequestCollection.relEntityCollection;//get the PTO_request collection
    					if (ptoCollectionRel.length > 0) {
    						ptoCollectionRel.forEach({// browse PTO reqeusts
    							onSuccess: function(eventRelPTO) {
    							var ptoRequest = eventRelPTO.entity;
    							var requestStatus = ptoRequest.status.getValue();
    							var requestID = ptoRequest.ID.getValue();
    							// Call server side method which returns the requestLineItems
								var requestLineItems = ptoRequest.getLineItemsRange(ptoRequest.firstDayOff.getValue(), ptoRequest.returnToWorkDate.getValue());
									//if (requestStatus != "commit") {
										if (requestStatus == ptoStatus) {
										var ptoHours = 0;
										var floatingDays = 0; 
										requestLineItems.forEach({
											onSuccess: function(ev3) {
												var theHours = ev3.entity.hoursRequested.getValue();
												ptoHours += theHours;
												(!theHours & ev3.entity.compensation.getValue()== "Floating Day"? floatingDays += 1: floatingDays += 0);
											}
										});
               							var $element = $('<div data-role="collapsible" data-collapsed="true" style="background: #ddd" '
                   						+ (requestStatus === "approved" ? 'data-theme="b"' : '') +'><h3>' 
                   						+ formatDate(ptoRequest.firstDayOff.getValue()) + " - " 
                  						+ formatDate(ptoRequest.lastDayOff.getValue())+ "  " 
                   						+ requestStatus + '</h3>' //<!--p style="padding-left: 15px;margin: 0"-->
//                   						+ "	PTO hours:" + ptoHours + '</p><p style="padding-left: 15px;margin: 0">'
//                   						+ "	Floating days:" + floatingDays + '</p><p style="padding-left: 15px;margin: 0"">'
//                  						+ '	Return to work at: '+ formatDate(ptoRequest.returnToWorkDate.getValue()) +'</p>'
//                   						+ (ptoRequest.notes.getValue()?'<p style="padding-left: 15px;margin: "">	Notes: '+ptoRequest.notes.getValue() +'</p>':'</p>')
                   						+'<div class="ui-grid-b" style="padding-left:15px;margin: 0"><div class="ui-block-a" ><p style="margin: 0">PTO hours: <br />Floating days: <br />Return date : <br />Notes:</p></div>'
                   						+'<div class="ui-block-b"><p style="margin: 0">'+ptoHours+'<br />'+floatingDays+'<br />'+formatDate(ptoRequest.returnToWorkDate.getValue())+'<br />'+(ptoRequest.notes.getValue()?ptoRequest.notes.getValue():"None")+'</p></div></div>'
                   						+ (ptoStatus == "pending"?'<a class="submit" id="'+ requestID +'"style="color:blue;text-align:center;padding-left: 15px" href="" data-theme="a" data-inline="true" data-role="button" onclick="submitPTO()" >Submit This PTO Request</a>'+ '</div>':"</div>"))
                    						.appendTo(ptoStatus == "pending"?$('#collapsibleSet'):('#collapsibleSetForApprovedPTOs'));
                   						$element.collapsible();
                   						$(".submit").bind('click', function (event) {
        									 WAF.sources.pTO_Request.selectByKey(event.target.id);
        									 WAF.sources.pTO_Request.status = "commit";
        									 WAF.sources.pTO_Request.save({
        									 	onSuccess: function(event) {
													alert("Your PTO request has been commited!");
													WAF.sources.pTO_Request.all();
													reloadPTOs();
												},
           										onError: function(error) {
           											console.log(error['error'][0].message + " (" + error['error'][0].errCode + ")");
          										}
      	
				
      										});
    									});	
               						}
								}
    						});
    					}
    				}
    			});
    		}
    		
    	});
};

function reloadPTOs() {
	$("#collapsibleSet").empty();
	loadPTOs('pending');
	loadPTOs('approved');
}
function formatDate(date) {
	return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
};

function createDate(dateString) {
	var dateArray = dateString.split("-");
	return new Date(dateArray[0] , dateArray[1] -1, dateArray[2]);
}
function newPTOButton_clicked() {
	WAF.sources.pTO_Request.newEntity({
			//autoExpand: "requestor",
			onSuccess: function(event) {
				//enableInput();
				WAF.sources.pTO_Request.setCurrentEntity(event.result);
				//$$('textField3').focus();
			}
		});

};

function cancelButton_clicked() {
		
		WAF.sources.pTO_Request.all();
		$("#startDate").val("");
		$("#endDate").val("");
		$("textarea").val("");
}

function saveButton_clicked() {
	WAF.sources.pTO_Request.firstDayOff = createDate($("#startDate").val());
	WAF.sources.pTO_Request.lastDayOff = createDate($("#endDate").val());
	WAF.sources.pTO_Request.returnToWorkDate = getNextWorkDay(createDate($("#endDate").val()));
	WAF.sources.pTO_Request.notes = $("textarea").val();
	WAF.sources.pTO_Request.save({
        	onSuccess: function(event) {
//				updateUserAccountDisplay();
//				if (event.dataSource.status === "pending") {
//					$("#errorDiv1").html("PTO Request Saved. Double-click any request line item to edit your request.");
//				} else {
//					$("#errorDiv1").html("PTO Request Saved.");
//				}
				alert("Your PTO request has been sent!");
				WAF.sources.pTO_Request.all();
				reloadPTOs();
				$("#startDate").val("");
				$("#endDate").val("");
				$("textarea").val("");
//				/**/
//				WAF.sources.pTO_Request.all({
//					onSuccess: function (event) {
//						WAF.sources.pTO_Request.selectByKey(primKey);
//						disableInput();
//				}});
				
			},
           	onError: function(error) {
//           		$('#errorDiv1').html(error['error'][0].message + " (" + error['error'][0].errCode + ")");
           		//Ask Laurent if serverRefresh supports declareDependencies or autoExpand.
           		console.log(error['error'][0].message + " (" + error['error'][0].errCode + ")");
         		/*
           		WAF.sources.pTO_Request.all({
					onSuccess: function (event) {
						WAF.sources.pTO_Request.selectByKey(primKey);
				}});
				*/
          	}
      	
				
      	});
};

function getNextWorkDay(lastDayOff) {
	console.log(lastDayOff);
	if(lastDayOff.getDay() == 5) {
		//Friday
		lastDayOff.setDate(lastDayOff.getDate()+3);
	} else if (lastDayOff.getDay() == 6) {
		//Saturday
		lastDayOff.setDate(lastDayOff.getDate()+2);
	} else {
		lastDayOff.setDate(lastDayOff.getDate()+1);
	}
	console.log(lastDayOff);
	return(lastDayOff);
};



function submitPTO() {
	

//	ptoRequest.status = "commit";
//	ptoRequest.save({
//		onSuccess: function(event) {
//				alert("Your PTO request has been commited!");
//				WAF.sources.pTO_Request.all();
//				reloadPTOs();
//			},
//           	onError: function(error) {
//           		console.log(error['error'][0].message + " (" + error['error'][0].errCode + ")");
//          	}
//      	
//				
//      	});
}
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
//		 var dates = $('#startDate, #endDate').datepicker({
//         	minDate: new Date()
//          	//changeMonth: true,
////          	onSelect: function(selectedDate) {
////                var option = this.id == 'enterfrom' ? 'minDate' : 'maxDate',
////                dates.not(this).datepicker('option', option, $(this).datepicker('getDate'));
////         	}
//    	});

		if (WAF.directory.currentUser() === null) {
				$.mobile.changePage("#page1", "slideup");
				
		}
		else {
			loadPTOs('pending');
			loadPTOs('approved');
			$.mobile.changePage("#page6", "slideup");
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
