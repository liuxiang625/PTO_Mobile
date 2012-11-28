
WAF.onAfterInit = function onAfterInit() {// @lock

// @region namespaceDeclaration// @startlock
	var documentEvent = {};	// @document
// @endregion// @endlock

// eventHandlers// @lock

	documentEvent.onLoad = function documentEvent_onLoad (event)// @startlock
	{// @endlock
		
		hljs.initHighlighting();
		
		// Full list of configuration options available here:
      	// https://github.com/hakimel/reveal.js#configuration
		Reveal.initialize({
	      	controls: true,
	      	progress: true,
	      	history: true,
			transition: 'linear' // default/cube/page/concave/linear(2d)
			//theme: 'simple',
      		// Optional libraries used to extend on reveal.js
			
			/*
      		dependencies: [
      		
      		{ src: '/Presentation/revealJS/lib/js/highlight.js', async: true, callback: function() { window.hljs.initHighlightingOnLoad(); } },		
	      	{ src: '/Presentation/revealJS/lib/js/classList.js', condition: function() { return !document.body.classList; } },
	      	{ src: '/Presentation/revealJS/lib/js/showdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },
	      	{ src: '/Presentation/revealJS/lib/js/data-markdown.js', condition: function() { return !!document.querySelector( '[data-markdown]' ); } },      	
	      	{ src: 'socket.io/socket.io.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } }, 	
	      	{ src: 'plugin/speakernotes/client.js', async: true, condition: function() { return window.location.host === 'localhost:1947'; } },
      		]
      		*/
      	});
      
	};// @lock

// @region eventManager// @startlock
	WAF.addListener("document", "onLoad", documentEvent.onLoad, "WAF");
// @endregion
};// @endlock
