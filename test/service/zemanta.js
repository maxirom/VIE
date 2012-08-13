module("vie.js - Zemanta Service");

if (!window.ZEMANTA_API_KEY) {
	// overwrite this if needed but be careful not to commit your own key!
	window.ZEMANTA_API_KEY = undefined; 
}
test("VIE.js ZemantaService - Registration", function() {
    var z = new VIE();
    ok(z.ZemantaService, "Checking if the Zemanta Service exists.'");
    z.use(new z.ZemantaService);
    ok(z.service('zemanta'));
});

test("VIE.js ZemantaService - API", function() {
    var z = new VIE();
    z.use(new z.ZemantaService);    
    //API
	ok(z.service('zemanta').init);
    equal(typeof z.service('zemanta').init, "function");
    ok(z.service('zemanta').analyze);
    equal(typeof z.service('zemanta').analyze, "function");
    ok(z.service('zemanta').connector);
    ok(z.service('zemanta').connector instanceof z.ZemantaConnector);
    ok(z.service('zemanta').rules);
    equal(typeof z.service('zemanta').rules, "object");
});

test("VIE.js ZemantaConnector - API", function() {
	var z = new VIE();
    var zemanta = new z.ZemantaService;
    z.use(zemanta);
    
    //API
    ok(zemanta.connector.analyze);
    equal(typeof zemanta.connector.analyze, "function");
});

test("VIE.js ZemantaService - Analyze", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    if (window.ZEMANTA_API_KEY === undefined) {
    	console.warn("Please provide an API key for Zemanta. At best, put the key in an extra file that is ignored by git.");
    	ok(true, "Skipped tests, as no API key is available! At best, put the key in an extra file that is ignored by git.");
    	return;
    }
    // Sending a an example with double quotation marks.
    var text = "<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>";    
    var elem = $(text);
    var z = new VIE();
    ok (z.ZemantaService);
    equal(typeof z.ZemantaService, "function");
    z.use(new z.ZemantaService({"api_key" : window.ZEMANTA_API_KEY}));
    stop();
    z.analyze({element: elem}).using('zemanta').execute().done(function(entities) {
        ok(entities);
        ok(entities.length > 0, "At least one entity returned");
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js ZemantaService - Analyze: Entity is not a Backbone model!");
                console.error("VIE.js ZemantaService - Analyze: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        var firstTextAnnotation = _(entities).filter(function(e){return e.isof("zemanta:Document") && e.get("zemanta:text");})[0];
        var s = firstTextAnnotation.get("zemanta:text").toString();
        
    	equal(text, s, "This should return the same text that has been sent to Zemanta.");
        ok(s.substring(s.length-4, s.length-2) != "\"@", "Selected text should be converted into a normal string.");
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});