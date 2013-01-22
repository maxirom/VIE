
module("vie.js - Apache Stanbol Service");

/* All known endpoints of Stanbol */

/* The ones marked with a "!!!" are implemented by the StanbolConnector */
/* The ones marked with a "???" are implemented but still broken */

// !!! /enhancer/chain/default
// !!! /enhancer/chain/<chainId>
// !!! /entityhub/sites/referenced
// !!! /entityhub/sites/entity
// !!! /entityhub/sites/find
// 
// !!! /entityhub/query
// ??? /entityhub/sites/query - strange exception, see test "Query (non-local)"
// !!! /entityhub/site/<siteId>/query
// !!! /entityhub/sites/ldpath
// !!! /entityhub/site/<siteId>/entity
// !!! /entityhub/site/<siteId>/find
// !!! /entityhub/site/<siteId>/ldpath
// !!! /entityhub/entity (GET, PUT, POST, DELETE)
// !!! /entityhub/mapping
// !!! /entityhub/find
// !!! /entityhub/lookup
// !!! /entityhub/ldpath
// 
//     /sparql
// 
// !!! /contenthub/contenthub/ldpath - createIndex(), deleteIndex() 
// !!! /contenthub/contenthub/store - uploadContent()
// !!! /contenthub/contenthub/store/raw/<contentId> - getTextContentByID()
// !!! /contenthub/contenthub/store/metadata/<contentId> - getMetadataByID()
// !!! /contenthub/<coreId>/store - uploadContent()
// !!! /contenthub/<coreId>/store/raw/<contentId> - getTextContentByID()
// !!! /contenthub/<coreId>/store/metadata/<contentId> - getMetadataByID()

// 
// !!! /factstore/facts
// !!! /factstore/query
// 
// !!! /ontonet/ontology/
// !!! /ontonet/session/

// 
// /rules/recipe
// /rules/recipe/<recipeId>
// /rules/find/recipe
// /rules/find/rules
// /rules/adapters
// /rules/adapters/recipe
// /refactor
// /refactor/apply
// /refactor/applyfile
// 
// /cmsadapter/map
// /cmsadapter/session
// /cmsadapter/contenthubfeed
var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

test("VIE.js StanbolService - Registration", function() {
    var z = new VIE();
    ok(z.StanbolService, "Checking if the Stanbol Service exists.'");
    z.use(new z.StanbolService);
    ok(z.service('stanbol'));
});

test("VIE.js StanbolService - API", function() {
    var z = new VIE();
    z.use(new z.StanbolService);

    ok(z.service('stanbol').init);
    equal(typeof z.service('stanbol').init, "function");
    ok(z.service('stanbol').analyze);
    equal(typeof z.service('stanbol').analyze, "function");
    ok(z.service('stanbol').find);
    equal(typeof z.service('stanbol').find, "function");
    ok(z.service('stanbol').load);
    equal(typeof z.service('stanbol').load, "function");
    ok(z.service('stanbol').connector);
    ok(z.service('stanbol').connector instanceof z.StanbolConnector);
    ok(z.service('stanbol').rules);
    equal(typeof z.service('stanbol').rules, "object");
});

test("VIE.js StanbolConnector - API", function() {
  var z = new VIE();
    var stanbol = new z.StanbolService({url : stanbolRootUrl});
    z.use(stanbol);
    
    //API
    ok(stanbol.connector.analyze);
    equal(typeof stanbol.connector.analyze, "function");
    ok(stanbol.connector.load);
    equal(typeof stanbol.connector.load, "function");
    ok(stanbol.connector.find);
    equal(typeof stanbol.connector.find, "function");
    ok(stanbol.connector.lookup);
    equal(typeof stanbol.connector.lookup, "function");
    ok(stanbol.connector.referenced);
    equal(typeof stanbol.connector.referenced, "function");
    ok(stanbol.connector.sparql);
    equal(typeof stanbol.connector.sparql, "function");
    ok(stanbol.connector.ldpath);
    equal(typeof stanbol.connector.ldpath, "function");
    ok(stanbol.connector.uploadContent);
    equal(typeof stanbol.connector.uploadContent, "function");
    ok(stanbol.connector.createFactSchema);
    equal(typeof stanbol.connector.createFactSchema, "function");
    ok(stanbol.connector.createFact);
    equal(typeof stanbol.connector.createFact, "function");
    ok(stanbol.connector.queryFact);
    equal(typeof stanbol.connector.queryFact, "function");
});

test("VIE.js StanbolService - Analyze - Default", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    }
    expect(7);
    // Sending a an example with double quotation marks.
    var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
    var z = new VIE();
    ok (z.StanbolService);
    equal(typeof z.StanbolService, "function", "The StanbolService exists.");
    z.use(new z.StanbolService({url : stanbolRootUrl}));
    stop();
    z.analyze({element: elem}).using('stanbol').execute().done(function(entities) {

        ok(entities, "The returned results is not null.");
        ok(entities instanceof Array, "The entities are an array.");
        ok(entities.length > 0, "At least one entity returned");
        if(entities.length > 0){
          var allEntities = true;
          for(var i=0; i<entities.length; i++){
              var entity = entities[i];
              if (! (entity instanceof Backbone.Model)){
                  allEntities = false;
                  ok(false, "VIE.js StanbolService - Analyze: Entity is not a Backbone model!");
                  console.error("VIE.js StanbolService - Analyze: ", entity, "is not a Backbone model!");
              }
          }
          ok(allEntities, "All result elements are VIE entities.");
          var firstTextAnnotation = _(entities).filter(function(e){return e.isof("enhancer:TextAnnotation") && e.get("enhancer:selected-text");})[0];
          var s = firstTextAnnotation.get("enhancer:selected-text").toString();
          ok(s.substring(s.length-4, s.length-2) != "\"@", "Selected text should be converted into a normal string.");
        }
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});

test("VIE.js StanbolService - Analyze with wrong URL of Stanbol", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    }
    expect(6);
    // Sending a an example with double quotation marks.
    var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
    var z = new VIE();
    ok (z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var wrongUrls = ["http://www.this-is-wrong.url/", "http://dev.iks-project.eu/stanbolfull"];
    z.use(new z.StanbolService({url : wrongUrls}));
    stop();
    z.analyze({element: elem}).using('stanbol').execute().done(function(entities) {

        ok(entities);
        ok(entities.length > 0, "At least one entity returned");
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js StanbolService - Analyze: Entity is not a Backbone model!");
                console.error("VIE.js StanbolService - Analyze: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});

test("VIE.js StanbolService - Analyze with Enhancement Chain", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    }
    expect(4);
    // Sending a an example with double quotation marks.
    var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
    var v = new VIE();
    v.use(new v.StanbolService({url : stanbolRootUrl, enhancerUrlPostfix: "/enhancer/chain/dbpedia-keyword"}));
    stop();
    v.analyze({element: elem}).using('stanbol').execute().done(function(entities) {
        ok(entities, "Entities is not null");
        ok(entities instanceof Array, "Result is an array");
        ok(entities.length > 0, "At least one entity returned");
        if(entities.length > 0) {
            var allEntities = true;
            for(var i=0; i<entities.length; i++){
                var entity = entities[i];
                if (! (entity instanceof Backbone.Model)){
                    allEntities = false;
                    console.error("VIE.js StanbolService - Analyze: ", entity, "is not a Backbone model!");
                }
            }
            ok(allEntities, "All results are VIE Entities");
        }
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});

test("VIE.js StanbolConnector - Get all referenced sites", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    // Sending a an example with double quotation marks.
    var z = new VIE();
    ok (z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({url : stanbolRootUrl});
    z.use(stanbol);
    stop();
    stanbol.connector.referenced(function (sites) {
      ok(_.isArray(sites));
      ok(sites.length > 0);
      start();
    }, function (err) {
      ok(false, "No referenced site has been returned!");
      start();
    });
});

test("VIE.js StanbolConnector - Perform SPARQL Query", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    
    var query = "PREFIX fise: <http://fise.iks-project.eu/ontology/> " + 
      "PREFIX dc:   <http://purl.org/dc/terms/> " + 
        "SELECT distinct ?enhancement ?content ?engine ?extraction_time " + 
        "WHERE { " + 
          "?enhancement a fise:Enhancement . " + 
          "?enhancement fise:extracted-from ?content . " + 
          "?enhancement dc:creator ?engine . " + 
          "?enhancement dc:created ?extraction_time . " + 
        "} " +
        "ORDER BY DESC(?extraction_time) LIMIT 5";
    
    // Sending a an example with double quotation marks.
    var z = new VIE();
    ok (z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({url : stanbolRootUrl});
    z.use(stanbol);
    stop();
    stanbol.connector.sparql(query, function (response) {
      ok(response instanceof Document);
      var xmlString = (new XMLSerializer()).serializeToString(response);
      var myJsonObject = xml2json.parser(xmlString);

      ok(myJsonObject.sparql);
      ok(myJsonObject.sparql.results);
      ok(myJsonObject.sparql.results.result);
      ok(myJsonObject.sparql.results.result.length);
      ok(myJsonObject.sparql.results.result.length > 0);
      
      start();
    }, function (err) {
      ok(false, "SPARQL endpoint returned no response!");
      start();
    });
});


test("VIE.js StanbolService - Find - Default", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    var term = "European Union";
    var limit = 10;
    var offset = 0;
    var z = new VIE();
    ok (z.StanbolService);
    equal(typeof z.StanbolService, "function");
    z.use(new z.StanbolService({url : stanbolRootUrl}));
    stop();
    
    z.find({term: term, limit: limit, offset: offset})
    .using('stanbol').execute().done(function(entities) {

        ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js StanbolService - Find: Entity is not a Backbone model!");
                console.error("VIE.js StanbolService - Find: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });

});


test("VIE.js StanbolService - Find - Search only in local entities", function () {
    if (navigator.userAgent === 'Zombie') {
        return;
    }
    var term = "European Union";
    var limit = 10;
    var offset = 0;
    var z = new VIE();
    z.use(new z.StanbolService({url : stanbolRootUrl}));
    stop();
    // search only in local entities
    z.find({term: "P*", limit: limit, offset: offset, local : true})
    .using('stanbol').execute().done(function(entities) {
        ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js StanbolService - Find: Entity is not a Backbone model!");
                console.error("VIE.js StanbolService - Find: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });

});


test("VIE.js StanbolService - Find - Only term given, no limit, no offset", function () {
    if (navigator.userAgent === 'Zombie') {
        return;
    }
    var term = "European Union";
    var limit = 10;
    var offset = 0;
    var z = new VIE();
    z.use(new z.StanbolService({url : stanbolRootUrl}));
    stop();
    z.find({term: term}) // only term given, no limit, no offset
    .using('stanbol').execute().done(function(entities) {

        ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        for(var i=0; i<entities.length; i++){
            var entity = entities[i];
            if (! (entity instanceof Backbone.Model)){
                allEntities = false;
                ok(false, "VIE.js StanbolService - Find: Entity is not a Backbone model!");
                console.error("VIE.js StanbolService - Find: ", entity, "is not a Backbone model!");
            }
        }
        ok(allEntities);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });

});


test("VIE.js StanbolService - Find - Empty term", function () {
    if (navigator.userAgent === 'Zombie') {
        return;
    }
    var term = "European Union";
    var limit = 10;
    var offset = 0;
    var z = new VIE();
    z.use(new z.StanbolService({url : stanbolRootUrl}));
    stop();
    z.find({term: "", limit: limit, offset: offset})
    .using('stanbol').execute()
    .done(function(entities) {

        ok(false, "this should fail, as there is an empty term given!");
        start();
    })
    .fail(function(f){
        ok(true, f.statusText);
        start();
    });

});
