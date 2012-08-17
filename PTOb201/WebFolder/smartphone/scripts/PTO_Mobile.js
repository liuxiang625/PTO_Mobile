function sinInButton_clicked() {
    if (WAF.directory.loginByPassword($("#textinput1").val(), $("#textinput2").val())) {
    	loadPTOs();
//        var requestCollection = WAF.sources.pTO_Request.getEntityCollection();
//        requestCollection.forEach({ // on each of the entity collection
//            onSuccess: function(event) {
//                var entity = event.entity; // get the entity from event.entity
//                var requestStatus = entity.status.getValue();
//                var ptoHours = entity.requestLineItemCollection.getRelatedClass;
//                if (requestStatus != "commit") {
//                   var $element = $('<div data-role="collapsible" data-collapsed="true" '
//                    + (entity.status.getValue() === "approved" ? 'data-theme="b"' : '') +'><h3>' 
//                    + formatDate(entity.firstDayOff.getValue()) + "- " 
//                    + formatDate(entity.lastDayOff.getValue())+ "  " 
//                    + requestStatus + '</h3><p>' 
//                    + "PTO hours:" + ptoHours + '</p><p>'
//                    + 'Return to work at: '+ formatDate(entity.returnToWorkDate.getValue()) +'</p>'
//                    + (entity.notes.getValue()?'<p> Notes: '+entity.notes.getValue() +'</p>':"")+
//                    + '</div>')
//                    .appendTo($('#collapsibleSet'));
//                    $element.collapsible();
//                }
//                }, onError: function(event) {
//                    $("#display").html("An error has been returned");
//                },
//                //            atTheEnd: function(event) {
//                //                $("#display").html(html); // display of the final result
//                //            },
//        });
    }
    else {
        $('#log > div').remove();
        event.preventDefault();
        event.stopPropagation();
        $('<div></div>').append('Invalid username or password').appendTo('#log');
    }
};

function logOutButton_clicked() {
	if (WAF.directory.logout()) {
		$("#textinput1").val("");
		$("#textinput2").val("");
		$("#collapsibleSet").empty();
	
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
			//orderBy: "fullName",
    		onSuccess: function(event) {
    			event.entityCollection.forEach({
    				onSuccess: function(ev) {
    					var ptoCollectionRel = ev.entity.pTO_RequestCollection.relEntityCollection;
    					if (ptoCollectionRel.length > 0) {
    						ptoCollectionRel.forEach({
    							onSuccess: function(eventRelPTO) {
    							var ptoRequest = eventRelPTO.entity;
    							var requestStatus = ptoRequest.status.getValue();
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
               							var $element = $('<div data-role="collapsible" data-collapsed="true" '
                   						+ (requestStatus === "approved" ? 'data-theme="b"' : '') +'><h3>' 
                   						+ formatDate(ptoRequest.firstDayOff.getValue()) + "- " 
                  						+ formatDate(ptoRequest.lastDayOff.getValue())+ "  " 
                   						+ requestStatus + '</h3><p>' 
                   						+ "PTO hours:" + ptoHours + '</p><p>'
                   						+ "Floating days:" + floatingDays + '</p><p>'
                  						+ 'Return to work at: '+ formatDate(ptoRequest.returnToWorkDate.getValue()) +'</p>'
                   						+ (ptoRequest.notes.getValue()?'<p> Notes: '+ptoRequest.notes.getValue() +'</p>':"")+
                    						+ '</div>')
                    						.appendTo($('#collapsibleSet'));
                   						$element.collapsible();
               						}
									
//									requestLineItems.forEach({
//										onSuccess: function(ev3) {
//											var theHours = ev3.entity.hoursRequested.getValue();
//											alert(theHours);
//										}
//									});
								}
    						});
    					}
    				}
    			});
    		}
    		
    	});
};

function formatDate(date) {
	return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()
};
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
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
