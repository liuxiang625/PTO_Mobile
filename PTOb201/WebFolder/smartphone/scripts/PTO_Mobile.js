function button_clicked() {
    if (WAF.directory.loginByPassword($("#textinput1").val(), $("#textinput2").val())) {
        var requestCollection = WAF.sources.pTO_Request.getEntityCollection();
        //alert(requestCollection.length);
        //var $element = $('<div data-role="collapsible" data-collapsed="true"><h3>test</h3><p>test</p></div>').appendTo($('#collapsibleSet'));
        requestCollection.forEach({ // on each of the entity collection
            onSuccess: function(event) {
                var entity = event.entity; // get the entity from event.entity
                var requestStatus = entity.status.getValue();
                if (requestStatus != "commit") {
                    var $element = $('<div data-role="collapsible" data-collapsed="true" '
                    + (entity.status.getValue() === "approved" ? 'data-theme="b"' : '') +'><h3>' 
                    + formatDate(entity.firstDayOff.getValue()) + "- " 
                    + formatDate(entity.lastDayOff.getValue())+ "  " 
                    + requestStatus + '</h3><p>' + '</p></div>')
                    .appendTo($('#collapsibleSet'));
                    $element.collapsible();
                }
                    // event.position contains the position of the entity in the entity collection
                    // you get the attribute value with entity.attribute.getValue()
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
