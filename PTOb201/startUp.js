/**

* @author admin

*/

//HTTP Request Handler
//addHttpRequestHandler('/testEcho', 'requestHandlers.js', 'echoHandler');
//addHttpRequestHandler('/calendarData', 'requestHandlers.js', 'fullCalendarDispatcher');
addHttpRequestHandler('/ptoApproval', 'requestHandlers.js', 'ptoApproval');


directory.setLoginListener("ptoLogin");

//var theEmailWorker = new SharedWorker("sharedWorkers/emailDaemon.js", "emailDaemon");

if (loginByPassword("admin", "admin")) {
	//Seed Users
	var userCollection = ds.User.all();
	try 
	{
		/**/
		userCollection.remove();
		
		var payrollManager = new ds.User({login: "smichaels", password: "michaels", fullName: "Sandra Michaels", email: "dave@wakanda.org", role: "Payroll", myManager: generalManager, accessLevel: 5, ptoHours: 120, floatingDays: 5, ptoSeedDate: new Date()});
		payrollManager.save();

		var generalManager = new ds.User({login: "tmiller", password: "miller", fullName: "Tom Miller", email: "dave@wakanda.org", role: "Manager", myManager: payrollManager, accessLevel: 3, ptoHours: 120, floatingDays: 5, ptoSeedDate: new Date()});
		generalManager.save();
		
		
		var salesManager = new ds.User({login: "troberts", password: "roberts", fullName: "Tracy Roberts", email: "dave@wakanda.org", role: "Manager", myManager: generalManager, accessLevel: 5, ptoHours: 120, floatingDays: 5, ptoSeedDate: new Date()});
		salesManager.save();
		
		var marketingManager = new ds.User({login: "mgerin", password: "gerin", fullName: "Michel Gerin", email: "dave@wakanda.org", role: "Manager", myManager: payrollManager, accessLevel: 3, ptoHours: 120, floatingDays: 5, ptoSeedDate: new Date()});
		marketingManager.save();
		
		var techServicesManager = new ds.User({login: "addk", password: "komoncharoensiri", fullName: "Add Komoncharoensiri", email: "dave@wakanda.org", role: "Manager", myManager: generalManager, accessLevel: 3, ptoHours: 80, floatingDays: 5, ptoSeedDate: new Date()});
		techServicesManager.save();
		
		//Staff
		var rduarte = new ds.User({
			login: "rduarte", 
			password: "duarte", 
			fullName: "Ruth Duarte", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: generalManager
		});
		rduarte.save();
		
		var dbeaulieu = new ds.User({
			login: "dbeaulieu", 
			password: "beaulieu", 
			fullName: "Doris Beaulieu", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: generalManager
		});
		dbeaulieu.save();
		
		//Sales Dept.
		var jsobczak = new ds.User({
			login: "jsobczak", 
			password: "sobczak", 
			fullName: "James Sobczak", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: salesManager
		});
		jsobczak.save();
		
		var ccooper = new ds.User({
			login: "ccooper", 
			password: "cooper", 
			fullName: "Court Cooper", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: salesManager
		});
		ccooper.save();
		
		var smorouse = new ds.User({
			login: "smorouse", 
			password: "morouse", 
			fullName: "Shirley Morouse", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: salesManager
		});
		smorouse.save();
		
		//Marketing Dept.
		var jfesslmeier = new ds.User({
			login: "jfesslmeier", 
			password: "fesslmeier", 
			fullName: "Juergen	Fesslmeier", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: marketingManager
		});
		jfesslmeier.save();
		
		var bmackay = new ds.User({
			login: "bmackay", 
			password: "mackay", 
			fullName: "Bill MacKay", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: marketingManager
		});
		bmackay.save();
		
		var emoeller = new ds.User({
			login: "emoeller", 
			password: "moeller", 
			fullName: "Erin Moeller", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: marketingManager
		});
		emoeller.save();
		
		//Tech Account Managers
		var jfletcher = new ds.User({
			login: "jfletcher", 
			password: "fletcher", 
			fullName: "Josh Fletcher", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: generalManager
		});
		jfletcher.save();
		
		var drobbins = new ds.User({
			login: "drobbins", 
			password: "robbins", 
			fullName: "David Robbins",
			email: "dave@wakanda.org", 
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 13.33,
			myManager: generalManager
		});
		drobbins.save();
		
		// Technical Services	
		var nfu = new ds.User({
			login: "nfu", 
			password: "fu", 
			fullName: "Nina Fu", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: techServicesManager
		});
		nfu.save();
		
		var xliu = new ds.User({
			login: "xliu", 
			password: "liu", 
			fullName: "Xiang Liu", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: techServicesManager
		});
		xliu.save();

		var asmith = new ds.User({
			login: "asmith", 
			password: "smith", 
			fullName: "Aaron Smith", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: techServicesManager
		});
		asmith.save();

		
		var ddraper = new ds.User({
			login: "ddraper", 
			password: "draper", 
			fullName: "Darrell Draper", 
			email: "dave@wakanda.org",
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 5,
			ptoHours: 120,
			ptoAccrualRate: 20,
			myManager: techServicesManager
		});
		ddraper.save();
		
		var srackwitz = new ds.User({
			login: "srackwitz", 
			password: "rackwitz", 
			fullName: "Sonya Rackwitz",
			email: "dave@wakanda.org",  
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 3,
			ptoHours: 80,
			ptoAccrualRate: 16.67,
			myManager: techServicesManager
		});
		srackwitz.save();
		
		var tpenner = new ds.User({
			login: "tpenner", 
			password: "penner", 
			fullName: "Tim Penner",
			email: "dave@wakanda.org",  
			accessLevel: 4, 
			role: "Employee",
			ptoSeedDate: new Date(),
			floatingDays: 3,
			ptoHours: 80,
			ptoAccrualRate: 16.67,
			myManager: techServicesManager
		});
		tpenner.save();
	}
	catch (err)
	{
		new ds.Log({
			createDate: new Date(), 
			message: err.message,
			line: err.line,
			name: err.name,
			sourceID: err.sourceID,
			sourceURL: err.sourceURL
		}).save();
	}
	
	//Seed Holidays
	var someHolidays = ds.Holiday.all();
	try 
	{
		/**/
		someHolidays.remove();
		new ds.Holiday({name: "New Years Day", date: new Date("January 02, 2012")}).save();
		new ds.Holiday({name: "President's Day", date: new Date("February 20, 2012")}).save();
		new ds.Holiday({name: "Memorial Day", date: new Date("May 28, 2012")}).save();
		new ds.Holiday({name: 'Independence Day', date: new Date("July 04, 2012")}).save();
		new ds.Holiday({name: 'Labor Day', date: new Date("September 03, 2012")}).save();
		new ds.Holiday({name: 'Christmas', date: new Date("December 25, 2012")}).save();
		
	}
	catch (err)
	{
		new ds.Log({
			createDate: new Date(), 
			message: err.message,
			line: err.line,
			name: err.name,
			sourceID: err.sourceID,
			sourceURL: err.sourceURL
		}).save();
	}
	
	
	//request line items
	var requestLineItemCollection = ds.RequestLineItem.all();
	try 
	{
		/**/
		requestLineItemCollection.remove();
		
	}
	catch (err)
	{
		//debugger;
		new ds.Log({
			createDate: new Date(), 
			message: err.message,
			line: err.line,
			name: err.name,
			sourceID: err.sourceID,
			sourceURL: err.sourceURL
		}).save();
	}
	
	
	//PTOs
	var ptoCollection = ds.PTO_Request.all();
	try 
	{
		/**/
		ptoCollection.remove();
		
	}
	catch (err)
	{
		//debugger;
		new ds.Log({
			createDate: new Date(), 
			message: err.message,
			line: err.line,
			name: err.name,
			sourceID: err.sourceID,
			sourceURL: err.sourceURL
		}).save();
	}
	
	//Notes
	var noteCollection = ds.Note.all();
	try 
	{
		/**/
		noteCollection.remove();
		
	}
	catch (err)
	{
		//debugger;
		new ds.Log({
			createDate: new Date(), 
			message: err.message,
			line: err.line,
			name: err.name,
			sourceID: err.sourceID,
			sourceURL: err.sourceURL
		}).save();
	}

}