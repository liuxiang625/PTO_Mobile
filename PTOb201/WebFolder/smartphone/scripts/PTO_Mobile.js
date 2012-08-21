function sinInButton_clicked() {
    if (WAF.directory.loginByPassword($("#textinput1").val(), $("#textinput2").val())) {
    	loadPTOs();
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

function loadPTOs() {
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
    							console.log(ptoRequest.ID.getValue());
    							var requestStatus = ptoRequest.status.getValue();
    							// Call server side method which returns the requestLineItems
								var requestLineItems = ptoRequest.getLineItemsRange(ptoRequest.firstDayOff.getValue(), ptoRequest.returnToWorkDate.getValue());
									if (requestStatus != "commit") {
										var ptoHours = 0;
										var floatingDays = 0; 
										requestLineItems.forEach({
											onSuccess: function(ev3) {
												var theHours = ev3.entity.hoursRequested.getValue();
												ptoHours += theHours;
												(!theHours| ev3.entity.compensation.getValue().indexOf("Floating")? floatingDays += 1: floatingDays += 0);
											}
										});
               							var $element = $('<div data-role="collapsible" data-collapsed="true" style="background: #b3b3b3" '
                   						+ (requestStatus === "approved" ? 'data-theme="b"' : '') +'><h3>' 
                   						+ formatDate(ptoRequest.firstDayOff.getValue()) + "- " 
                  						+ formatDate(ptoRequest.lastDayOff.getValue())+ "  " 
                   						+ requestStatus + '</h3><p>' 
                   						+ "PTO hours:" + ptoHours + '</p><p>'
                   						+ "Floating days:" + floatingDays + '</p><p>'
                  						+ 'Return to work at: '+ formatDate(ptoRequest.returnToWorkDate.getValue()) +'</p>'
                   						+ (ptoRequest.notes.getValue()?'<p> Notes: '+ptoRequest.notes.getValue() +'</p>':"")+ '</div>')
                    						.appendTo($('#collapsibleSet'));
                   						$element.collapsible();
               						}
								}
    						});
    					}
    				}
    			});
    		}
    		
    	});
};

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

function saveButton_clicked() {
	WAF.sources.pTO_Request.firstDayOff = createDate($("#startDate").val());
	WAF.sources.pTO_Request.lastDayOff = createDate($("#endDate").val());
	WAF.sources.pTO_Request.returnToWorkDate = getNextWorkDay(WAF.sources.pTO_Request.lastDayOff);
	WAF.sources.pTO_Request.notes = "new Notes";
	WAF.sources.pTO_Request.save({
        	onSuccess: function(event) {
//				updateUserAccountDisplay();
//				if (event.dataSource.status === "pending") {
//					$("#errorDiv1").html("PTO Request Saved. Double-click any request line item to edit your request.");
//				} else {
//					$("#errorDiv1").html("PTO Request Saved.");
//				}
				alert("Saved!");
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
           		WAF.sources.pTO_Request.serverRefresh({forceReload: true});
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
			loadPTOs();
			$.mobile.changePage("#page6", "slideup");
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
