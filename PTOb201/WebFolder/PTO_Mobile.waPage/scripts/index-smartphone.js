
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
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

	function updateHolidayDisplay() {
		var today = new Date();
		//ds.Holiday.all({orderBy:"date", onSuccess:function(event) {
		ds.Holiday.query("date > :1", today,
			{orderBy:"date", onSuccess:function(event) {
			event.entityCollection.toArray("name,date", {onSuccess: function(ev) {
				var arr = ev.result;
				var myHTML = '';
				//myHTML += '<p class="title">' + 'Upcoming 4D Holidays: ' + '</p>';
				arr.forEach(function(elem) { 
					myHTML += '<p class="holiday">' + elem.name + " : " + formatDate(ISOToDate(elem.date)) + '</p>';
				});
				$('#holidaysContainer').html(myHTML);
			}});
		}});
	}
// eventHandlers// @lock

	button3.click = function button3_click (event)// @startlock
	{// @endlock
		$$('navigationView2').goToView(3);
	};// @lock

	button1.click = function button1_click (event)// @startlock
	{// @endlock
		$$('navigationView2').goToView(2);
		updateHolidayDisplay();
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("button3", "click", button3.click, "WAF");
	WAF.addListener("button1", "click", button1.click, "WAF");
// @endregion
};// @endlock
