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
		$("#collapsibleSetForApprovedPTOs").empty();
	}
	else {
		event.preventDefault();
        event.stopPropagation();
        alert("Log Out Failed!");
	}
};

function loadPTOs(ptoStatus) {
	var holidaysArray = [];
	ds.Holiday.all({
	    orderBy: "date",
	    onSuccess: function(event) {
	        event.entityCollection.toArray("name,date", {
	            onSuccess: function(ev) {
	                holidaysArray = ev.result;
	                WAF.ds.User.query("fullName = :1", WAF.directory.currentUser().fullName, {
	                    autoExpand: "pTO_RequestCollection",
	                    onSuccess: function(event) {
	                        event.entityCollection.forEach({
	                            onSuccess: function(ev) {
	                                var ptoCollectionRel = ev.entity.pTO_RequestCollection.relEntityCollection; //get the PTO_request collection
	                                ptoCollectionRel.orderBy("firstDayOff asc");
	                                if (ptoCollectionRel.length > 0) {
	                                    ptoCollectionRel.forEach({ // browse PTO reqeusts
	                                        onSuccess: function(eventRelPTO) {
	                                            var ptoRequest = eventRelPTO.entity;
	                                            var requestStatus = ptoRequest.status.getValue();
	                                            var requestID = ptoRequest.ID.getValue();
	                                            // Call server side method which returns the requestLineItems
	                                            var requestLineItems = ptoRequest.getLineItemsRange(ptoRequest.firstDayOff.getValue(), ptoRequest.returnToWorkDate.getValue());
	                                            if (requestStatus == ptoStatus) {
	                                                var ptoHours = 0;
	                                                var floatingDays = 0;
	                                                var holiday = formatDate(ISOToDate(holidaysArray[0].date));
	                                                var lastDayOff = formatDate(ptoRequest.lastDayOff.getValue());
	                                                requestLineItems.forEach({
	                                                    onSuccess: function(ev3) {
	                                                        var theHours = ev3.entity.hoursRequested.getValue();
	                                                        ptoHours += theHours;
	                                                        (!theHours & ev3.entity.compensation.getValue() == "Floating Day" ? floatingDays += 1 : floatingDays += 0);
	                                                    }
	                                                });
	                                                //build PTO request element using two grid blocks in a collapsiable
	                                                var $element = $('<div  data-role="collapsible" data-collapsed="true" style="background: #ddd" ' 
													+ '><h3>' + formatDate(ptoRequest.firstDayOff.getValue()) 
													+ " - " + lastDayOff + "  PTO "
													+ requestStatus + '</h3>' //<!--p style="padding-left: 15px;margin: 0"-->
	                                                +'<div class="ui-grid-b" style="padding-left:15px;margin: 0"><div class="ui-block-a" ><p style="margin: 0">PTO hours: <br />Floating days: <br />Return date: <br />Notes:</p></div>'
	                                                + '<div class="ui-block-b"><p style="margin: 0">'
	                                                + ptoHours + '<br />' + floatingDays + '<br />'
	                                                + formatDate(ptoRequest.returnToWorkDate.getValue()) + '<br />'
	                                                + (ptoRequest.notes.getValue() ? ptoRequest.notes.getValue() : "None") + '</p></div></div>' 
	                                                + (ptoStatus == "pending" ? '<div  style="padding-right:15px;padding-left:15px;margin: 0" class="ui-collapsible ui-collapsible-inset ui-collapsible-collapsed" data-content-theme="c" data-theme="b" data-role="collapsible"><h3 class="ui-collapsible-heading ui-collapsible-heading-collapsed"><a class=" ui-collapsible-heading-toggle ui-btn ui-fullsize ui-btn-icon-left ui-corner-top ui-corner-bottom ui-btn-up-b ui-btn-hover-b" href="#" data-corners="false" data-shadow="false" data-iconshadow="true" data-wrapperels="span" data-icon="plus" data-iconpos="left" data-theme="c" data-mini="true" style="text-align:center"><span id="' + requestID + '"  class=" submit ui-btn-inner ui-corner-top ui-corner-bottom"><span class="ui-btn-text">Submit This Request</span></a></h3></div>' : '</div>'))
	                                                .appendTo(ptoStatus == "pending" ? $('#collapsibleSet') : ('#collapsibleSetForApprovedPTOs'));
	                                                $element.collapsible();
	                                            }
	                                        }
	                                    });
	                                }
	                            },
	                            atTheEnd: function(end) { //at the end of loop, add the list of upcoming holidays, need sorting with PTOs in future. 
	                                holidaysArray.forEach(function(elem) {
	                                    if (ISOToDate(elem.date) > new Date() & ptoStatus == "approved") {
	                                        var $holidayElement = $('<div  data-role="collapsible" data-collapsed="true" style="background: #ddd" ' + '><h3>' 
											+ formatDate(ISOToDate(elem.date)) + "- " 
											+ formatDate(ISOToDate(elem.date)) + '  ' + elem.name + '</h3>' //<!--p style="padding-left: 15px;margin: 0"-->
	                                        +'<div class="ui-grid-b" style="padding-left:15px;margin: 0"><div class="ui-block-a" ><p style="margin: 0">Return date: </p></div>' + '<div class="ui-block-b"><p style="margin: 0">'
	                                        + getNextWorkDay(ISOToDate((elem.date))) + '</p></div></div>' + '</div>')
	                                        .appendTo(('#collapsibleSetForApprovedPTOs'));
	                                        $holidayElement.collapsible();
	                                    }
	                                });
	                            }
	                        });
	                    }
	                });
	            }
	        });
	    }
	});
};

function reloadPTOs() {// clean up and reload PTO in both tabs
	$("#collapsibleSet").empty();
	$("#collapsibleSetForApprovedPTOs").empty();
	loadPTOs('pending');
	loadPTOs('approved');
}
function formatDate(date) {// ultility to formate date to mm/dd/yyyy
	return (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear()
};

function createDate(dateString) {// create Date object frome mm-dd-yyyy 
	var dateArray = dateString.split("-");
	return new Date(dateArray[0] , dateArray[1] -1, dateArray[2]);
}
function newPTOButton_clicked() {
	WAF.sources.pTO_Request.newEntity({
			onSuccess: function(event) {
				WAF.sources.pTO_Request.setCurrentEntity(event.result);
			}
		});

};

function cancelButton_clicked() {
		
		WAF.sources.pTO_Request.all();
		$("#startDate").val("");
		$("#endDate").val("");
		$("textarea").val("");
		$('#errorlog > div').remove();
}

function saveButton_clicked() {
	WAF.sources.pTO_Request.firstDayOff = createDate($("#startDate").val());
	WAF.sources.pTO_Request.lastDayOff = createDate($("#endDate").val());
	WAF.sources.pTO_Request.returnToWorkDate = getNextWorkDay(createDate($("#endDate").val()));
	WAF.sources.pTO_Request.notes = $("textarea").val();
	WAF.sources.pTO_Request.save({
        	onSuccess: function(event) {
				WAF.sources.pTO_Request.all();
				reloadPTOs();
				$("#startDate").val("");
				$("#endDate").val("");
				$("textarea").val("");
				$('#errorlog > div').remove();
				$.mobile.changePage("#page6", { transition: "slideup"});
				
			},
           	onError: function(error) {
           		console.log(error['error'][0].message + " (" + error['error'][0].errCode + ")");
           		$('#errorlog > div').remove();
        		$('<div></div>').append(error['error'][0].message + " (" + error['error'][0].errCode + ")").appendTo('#errorlog');
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
	$(".submit").live('tap', function(event) {//add tap event handler to submit class for request submission
	    var requestKey = this.id;
	    WAF.sources.pTO_Request.selectByKey(requestKey, {
	        onSuccess: function(event) {
	            WAF.sources.pTO_Request.status = "requested";
	            WAF.sources.pTO_Request.save({
	                onSuccess: function(event) {
	                    alert("Your PTO request has been submitted!");
	                    reloadPTOs();
	                },
	                onError: function(error) {
	                    console.log(error['error'][0].message + " (" + error['error'][0].errCode + ")");
	                }
	            });
	        }
	    });

	});
	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		if (WAF.directory.currentUser() === null) {
				$.mobile.changePage("#page1", { transition: "pop"});
				
		}
		else {
			loadPTOs('pending');
			loadPTOs('approved');
			$.mobile.changePage("#page6", { transition: "pop"});
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
