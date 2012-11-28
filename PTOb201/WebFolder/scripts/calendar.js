
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		
		/*
		myEvents = [
			{title  : 'event1', start  : '2012-08-01'},
			 {title  : 'event2', start  : '2012-08-24'},
			 {title  : 'event3', start  : '2012-09-07'},
		];
		*/
		
		waf.ds.RequestLineItem.getCalendarArray({
			onSuccess: function(event) {
				console.log(event.result);
				$('#calendar').fullCalendar({
					
       				 // put your options and callbacks here
       				height: 650,
        			weekends: true, // will hide Saturdays and Sundays
        			events: event.result
			        /*
			        events: [
			        	{title  : 'event1', start  : '2012-08-01'},
			        	{title  : 'event2', start  : '2012-09-05'},
			        ]
			        */
				})
			}
		});
		
		// Init Full Calendar
	 	

	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
