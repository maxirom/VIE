module("vie.js - OpenCalais Service");

if (!window.OPENCALAIS_API_KEY) {
	// overwrite this if needed but be careful not to commit your own key!
	window.OPENCALAIS_API_KEY = undefined; 
}

test("VIE.js OpenCalais - Registration", function() {
    var o = new VIE();
    ok(o.OpenCalaisService, "Checking if the OpenCalais Service exists.'");
    o.use(new o.OpenCalaisService);
    ok(o.service('opencalais'));
});

test("VIE.js OpenCalaisService - API", function() {
    var o = new VIE();
    o.use(new o.OpenCalaisService);    
    //API
    ok(o.service('opencalais').analyze);
    equals(typeof o.service('opencalais').analyze, "function");
});

test("VIE.js OpenCalaisConnector - API", function() {
	var o = new VIE();
    var opencalais = new o.OpenCalaisService();
    o.use(opencalais);
    
    //API
    ok(opencalais.connector.analyze);
    equals(typeof opencalais.connector.analyze, "function");
});

test("VIE.js OpenCalaisService - Analyze", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    if (window.OPENCALAIS_API_KEY === undefined) {
    	console.warn("Please provide an API key for OpenCalais.");
    	ok(true, "Skipped tests, as no API key is available!");
    	return;
    }
    // Sending a an example with double quotation marks.
    var text = "<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>";    
    var elem = $(text);
    var o = new VIE();
    ok (o.OpenCalaisService);
    equal(typeof o.OpenCalaisService, "function");
    o.use(new o.OpenCalaisService({"api_key" : window.OPENCALAIS_API_KEY}));
    stop();
    o.analyze({element: elem}).using('opencalais').execute().done(function(entities) {
    	debugger;
        ok(entities);
        ok(entities.length > 0, "At least one entity returned");
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js OpenCalaisService - Analyze: Entity is not a Backbone model!");
                console.error("VIE.js OpenCalaisService - Analyze: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        var firstTextAnnotation = _(entities).filter(function(e){return e.isof("opencalaisc:Document") && e.get("opencalaisc:text");})[0];
        var s = firstTextAnnotation.get("opencalaisc:text").toString();
        
    	equals(text, s, "This should return the same text that has been sent to OpenCalais.");
        ok(s.substring(s.length-4, s.length-2) != "\"@", "Selected text should be converted into a normal string.");
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});