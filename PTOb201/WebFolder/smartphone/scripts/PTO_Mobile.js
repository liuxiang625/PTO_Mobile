function button_clicked() {
    if (WAF.directory.loginByPassword($("#textinput1").val(), $("#textinput2").val())) {
    	WAF.ds.User.all();
        var requestCollection = WAF.sources.pTO_Request.getEntityCollection();
        requestCollection.forEach({ // on each of the entity collection
            onSuccess: function(event) {
                var entity = event.entity; // get the entity from event.entity
                var requestStatus = entity.status.getValue();
                var ptoHours = entity.requestLineItemCollection.getRelatedClass;
                if (requestStatus != "commit") {
                   var $element = $('<div data-role="collapsible" data-collapsed="true" '
                    + (entity.status.getValue() === "approved" ? 'data-theme="b"' : '') +'><h3>' 
                    + formatDate(entity.firstDayOff.getValue()) + "- " 
                    + formatDate(entity.lastDayOff.getValue())+ "  " 
                    + requestStatus + '</h3><p>' 
                    + "PTO hours:" + ptoHours + '</p><p>'
                    + 'Return to work at: '+ formatDate(entity.returnToWorkDate.getValue()) +'</p>'
                    + (entity.notes.getValue()?'<p> Notes: '+entity.notes.getValue() +'</p>':"")+
                    + '</div>')
                    .appendTo($('#collapsibleSet'));
                    $element.collapsible();
                }
                }, onError: function(event) {
                    $("#display").html("An error has been returned");
                },
                //            atTheEnd: function(event) {
                //                $("#display").html(html); // display of the final result
                //            },
        });

        function formatDate(date) {
            return date.getMonth() + "/" + date.getDate() + "/" + date.getFullYear()
        }

    }
    else {
        $('#log > div').remove();
        event.preventDefault();
        event.stopPropagation();
        $('<div></div>').append('Invalid username or password').appendTo('#log');
    }
}
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
			$.mobile.changePage("#page6", "slideup");
		}
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
