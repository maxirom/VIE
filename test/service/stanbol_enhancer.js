var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

//### test for the two GET services offered by the enhancer/ endpoint, i.e., to
// retrieve information on the available enhancement chains and engines, and on
// the ExecutionPlan used by an enhancement endpoint.
// @author mere01
test("VIE.js StanbolConnector - Retrieve info on enhancer", function(){
		
	if (navigator.userAgent === 'Zombie') {
		    return;
	}
		   
	var v = new VIE();
	ok(v.StanbolService);
	equal(typeof v.StanbolService, "function");
	var stanbol = new v.StanbolService({
	  url: stanbolRootUrl[0]
	});
	v.use(stanbol);
		    
	stop();
	stanbol.connector.enhancers(
	  function(success){
		  
		  ok(true, "Retrieved information on available enhancement chains " +
		  		"and engines.");
		  console.log("Retrieved information on available enhancement chains " +
		  		"and engines:")
		  console.log(success)
		  start();
		    			
	  }, function(error){
		  
		  ok(false, "Could not retrieve information on available enhancement " +
		  		"chains and engines.");
		  console.log("Could not retrieve information on available " +
		  		"enhancement chains and engines.")
		  console.log(error)
		  start();
		    			
	  }, {
		  format : 'text/turtle'
	  	});
	
	stop();
	stanbol.connector.getExecutionPlan(
	  function(success){
		  
		  ok(true, "Retrieved ExecutionPlan of enhancer.");
		  console.log("Retrieved ExecutionPlan of enhancer:")
		  console.log(success)
		  start();
		    			
	  }, function(error){
		  
		  ok(false, "Could not retrieve ExecutionPlan of enhancer.");
		  console.log("Could not retrieve ExecutionPlan of enhancer.")
		  console.log(error)
		  start();
		    			
	  }, {
		  format : 'application/rdf+xml'
	  	});
	
});

test(
  "VIE.js StanbolService - Analyze",
  function() {
   if (navigator.userAgent === 'Zombie') {
    return;
  }
        // Sending a an example with double quotation marks.
        var elem = $('<p>This is a small test, where Steve Jobs sings the ' +
        		'song \"We want to live forever!\" song.</p>');
        var z = new VIE();
        ok(z.StanbolService);
        equal(typeof z.StanbolService, "function");
        z.use(new z.StanbolService( {
          url : stanbolRootUrl
        }));

        stop();
        z.analyze( {
          element : elem
        })
        .using('stanbol')
        .execute()
        .done(function(entities) {

          console.log(entities[0])
          ok(entities);
          ok(entities instanceof Array);
          ok(entities.length > 0, "At least one entity returned");
          if (entities.length > 0) {
            var allEntities = true;
              for ( var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (!(entity instanceof Backbone.Model)) {
                 allEntities = false;
                 ok(false, "VIE.js StanbolService - Analyze: Entity is not " +
                 		"a Backbone model!");
              }
         }
        ok(allEntities);
        var firstTextAnnotation = _(entities).filter(
          function(e) {
            return e.isof("enhancer:TextAnnotation") && e.get("enhancer:selected-text");
          })[0];
         var s = firstTextAnnotation.get("enhancer:selected-text").toString();
         ok(s.substring(s.length - 4, s.length - 2) != "\"@", "Selected " +
         		"text should be converted into a normal string.");
      } else {
        ok(false, "no entities returned!");
      }
      start();
    }).fail(function(f) {
      ok(false, f.statusText);
      start();
    });
  });

test(
  "VIE.js StanbolService - Analyze with wrong URL of Stanbol",
  function() {
   if (navigator.userAgent === 'Zombie') {
    return;
  }
            // Sending a an example with double quotation marks.
            var elem = $('<p>This is a small test, where Steve Jobs sings ' +
            		'the song \"We want to live forever!\" song.</p>');
            var z = new VIE();
            ok(z.StanbolService);
            equal(typeof z.StanbolService, "function");
            var wrongUrls = [ "http://www.this-is-wrong.url/" ];
            z.use(new z.StanbolService( {
              url : wrongUrls.concat(stanbolRootUrl)
            }));
            stop();
            z
            .analyze( {
              element : elem
            })
            .using('stanbol')
            .execute()
            .done(
             function(entities) {

              ok(entities);
              ok(entities.length > 0,
                "At least one entity returned");
              ok(entities instanceof Array);
              var allEntities = true;
              for ( var i = 0; i < entities.length; i++) {
               var entity = entities[i];
               if (!(entity instanceof Backbone.Model)) {
                allEntities = false;
                ok(false,
                  "VIE.js StanbolService - Analyze: Entity is not a " +
                  "Backbone model!");
                console
                .error(
                  "VIE.js StanbolService - Analyze: ",
                  entity,
                  "is not a Backbone model!");
              }
            }
            ok(allEntities);
            start();
          }).fail(function(f) {
            ok(false, f.statusText);
            start();
          });
        });

test("VIE.js StanbolService - Analyze with wrong URL of Stanbol (2)",
  function() {
   if (navigator.userAgent === 'Zombie') {
    return;
  }

            // Sending a an example with double quotation marks.
            var elem = $('<p>This is a small test, where Barack Obama sings ' +
            		'the song \"We want to live forever!\" song.</p>');
            var x = new VIE();
            x.use(new x.StanbolService( {
             url : [ "http://www.this-is-wrong.url/" ]
           }));
            stop();
            x.analyze( {
             element : elem
           }).using('stanbol').execute().done(function(entities) {
             ok(false, "This should not return with any value!");
             start();
           }).fail(function(f) {
             ok(true, f.statusText);
             start();
           });
         });

test(
  "VIE.js StanbolService - Analyze with Enhancement Chain",
  function() {
   if (navigator.userAgent === 'Zombie') {
    return;
  }
            // Sending a an example with double quotation marks.
            var elem = $('<p>This is a small test, where Steve Jobs sings ' +
            		'the song \"We want to live forever!\" song.</p>');
            var v = new VIE();
            ok(v.StanbolService);
            equal(typeof v.StanbolService, "function");
            v.use(new v.StanbolService( {
              url : stanbolRootUrl,
              enhancerUrlPostfix : "/enhancer/chain/dbpedia-keyword"
            }));
            stop();
            v
            .analyze( {
              element : elem
            })
            .using('stanbol')
            .execute()
            .done(
             function(entities) {
              ok(entities);
              ok(entities.length > 0,
                "At least one entity returned");
              if (entities.length > 0) {
               ok(entities instanceof Array);
               var allEntities = true;
               for ( var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (!(entity instanceof Backbone.Model)) {
                 allEntities = false;
                 console
                 .error(
                   "VIE.js StanbolService - Analyze: ",
                   entity,
                   "is not a Backbone model!");
               }
             }
             ok(allEntities);
           }
           start();
         }).fail(function(f) {
          ok(false, f.statusText);
          start();
        });
            
            
       });	// end of test Analyze with enhancement chain


//### testing new parameters with the analyze() method.
//@author mere01
test(
		  "VIE.js StanbolService - Analyze with new parameters",
		  function() {
		   if (navigator.userAgent === 'Zombie') {
		    return;
		  }

		        var elem = $('<html><body><p>The Stanbol enhancer can ' +
		        		'detect famous cities such as Paris and people ' +
		        		'such as Bob Marley.</p></body></html>');
		        var param1 = {
		        		
		        		uri : 'steve',	// gives a name to the content item
		        		outputContent : 'text/plain', // includes the plain text version of the parsed content in the response
		        		rdfFormat: 'application/rdf%2Bxml' // allows for requests that result in multipart/from-data encoded responses to specify the used RDF serialization format
		        		
		        };
		        var param2 = {
		        		
		        		executionmetadata : true, // allows execution metadata in the response
		        		omitParsed : true, // excludes all content included in the request from the response
		        		outputContentPart : escape('http://stanbol.apache.org/ontology/enhancer/executionmetadata#ChainExecution') // include the ExectionMetadata within the response of the Stanbol Enhancer
		        };
		        
		        var param3 = {
		        		
		        		uri : 'lars',
		        		omitMetadata : true // disables inclusion of the metadata in the response
		        		
		        };
		        
		        var param4 = {
		        	
		        		uri : 'ole',
		        		outputContent : "*/*",
		        		omitParsed : true,
		        		rdfFormat : "application/rdf%2Bxml"
		        		
		        };
		        
		        var z = new VIE();
		        ok(z.StanbolService);
		        equal(typeof z.StanbolService, "function");
		        z.use(new z.StanbolService( {
		          url : stanbolRootUrl
		        }));

		        stop();
		        z.analyze( {
		          element : elem,
		          params : param1
		        })
		        .using('stanbol')
		        .execute()
		        .done(function(entities) {
		          console.log("in success callback of param set 1.")
		          console.log(entities);
		          console.log(entities[0])
		          ok(entities, "parameter set 1");
		          ok(entities instanceof Array);
		          ok(entities.length > 0, "At least one entity returned");
		          if (entities.length > 0) {
		            var allEntities = true;
		              for ( var i = 0; i < entities.length; i++) {
		                var entity = entities[i];
		                if (!(entity instanceof Backbone.Model)) {
		                 allEntities = false;
		                 ok(false, "VIE.js StanbolService - Analyze: " +
		                 		"Entity is not a Backbone model!");
		              }
		         }
		        ok(allEntities);
		        var firstTextAnnotation = _(entities).filter(
		          function(e) {
		            return e.isof("enhancer:TextAnnotation") && e.get("enhancer:selected-text");
		          })[0];
		         var s = firstTextAnnotation.get("enhancer:selected-text").toString();
		         ok(s.substring(s.length - 4, s.length - 2) != "\"@", 
		         	"Selected text should be converted into a normal string.");
		      } else {
		        ok(false, "no entities returned!");
		      }
		      start();
		    }).fail(function(f) {
		      console.log("in error callback of param set 1")
		      console.log(f)
		      ok(false, f.statusText)
		      ok(false, "for param set 1");
		      start();
		    });
		        
		        stop();
		        z.analyze( {
		          element : elem,
		          params : param2
		        })
		        .using('stanbol')
		        .execute()
		        .done(function(entities) {
		          console.log("in success callback of param set 2.")
		          console.log(entities);
		          console.log(entities[0])
		          ok(entities, "parameter set 2");
		          ok(entities instanceof Array);
		          ok(entities.length > 0, "At least one entity returned");
		          if (entities.length > 0) {
		            var allEntities = true;
		              for ( var i = 0; i < entities.length; i++) {
		                var entity = entities[i];
		                if (!(entity instanceof Backbone.Model)) {
		                 allEntities = false;
		                 ok(false, "VIE.js StanbolService - Analyze: " +
		                 		"Entity is not a Backbone model!");
		              }
		         }
		        ok(allEntities);
		        var firstTextAnnotation = _(entities).filter(
		          function(e) {
		            return e.isof("enhancer:TextAnnotation") && e.get("enhancer:selected-text");
		          })[0];
		         var s = firstTextAnnotation.get("enhancer:selected-text").toString();
		         ok(s.substring(s.length - 4, s.length - 2) != "\"@", 
		         	"Selected text should be converted into a normal string.");
		      } else {
		        ok(false, "no entities returned!");
		      }
		      start();
		    }).fail(function(f) {
		      console.log("in error callback of param set 2")
		      console.log(f)
		      ok(false, f.statusText)
		      ok(false, "for param set 2");
		      start();
		    });
		        
		        stop();
		        z.analyze( {
 			      accept : "text/plain",		// to be verified
 			      format : "text",
		          element : elem,
		          params : param3
		        })
		        .using('stanbol')
		        .execute()
		        .done(function(success) {
		          console.log("in success callback of param set 3.");
		          console.log(success);
		          ok(success, "parameter set 3");
		      start();
		    }).fail(function(f) {
		      console.log("in error callback of param set 3")
		      console.log(f)
		      ok(false, f.statusText)
		      ok(false, "for param set 3");
		      start();
		    });
		        
		        // another test, this time for usage of the MultiPart 
		    	// ContentItem RESTful API
		        stop();
		        console.log("--- here now passing multipart ---")
		        z.analyze( {
//		          accept : "multipart/form-data",
		          format : "text",
		          element : elem,
		          params : param4
		        })
		        .using('stanbol')
		        .execute()
		        .done(function(entities) {
		          console.log("in success callback of param set 4.")
		          console.log(entities);
		          console.log(entities[0])
		          ok(entities, "parameter set 4");
		          
		      	  start();
		    }).fail(function(f) {
		      console.log("in error callback of param set 4")
		      console.log(f)
		      ok(false, f.statusText)
		      ok(false, "for param set 4");
		      start();
		    });
		        
		  });