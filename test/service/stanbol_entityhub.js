var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];


test("VIE.js StanbolConnector - Get all referenced sites", function() {
	if (navigator.userAgent === 'Zombie') {
        return;
    }
    // Sending a an example with double quotation marks.
	var z = new VIE();
  	ok(z.StanbolService);
  	equal(typeof z.StanbolService, "function");
  	var stanbol = new z.StanbolService( {

     url : stanbolRootUrl[0]

 	});
	z.use(stanbol);
  	stop();
  	stanbol.connector.referenced(
  		function(sites) {
     		ok(_.isArray(sites));
     		ok(sites.length > 0);
     		start();
 		}, 
 		function(err) {
     		ok(false, "No referenced site has been returned!");
     		start();
 		});
	});
	
test(
  "VIE.js StanbolService - Find",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var term = "European Union";
    var limit = 10;
    var offset = 0;
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    z.use(new z.StanbolService( {

        url : stanbolRootUrl[0]

    }));
    stop();

    z.find( {
      term : term,
      limit : limit,
      offset : offset
  	})
    .using('stanbol')
    .execute()
    .done(
     function(entities) {

        ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        
        for ( var i = 0; i < entities.length; i++) {
           var entity = entities[i];
           if (!(entity instanceof Backbone.Model)) {
              allEntities = false;
              ok(false,
                "VIE.js StanbolService - Find: Entity is not a " +
                "Backbone model!");
          }
      }
      ok(allEntities);
      start();
  }).fail(function(f) {
      ok(false, f.statusText);
      start();
  });

  stop();
  // search only in local entities
  z.find( {
         	  term : "Pad*", // at P* or Par*, Stanbol will throw a geo exception
              limit : limit,
              offset : offset,
              local : true
          })
           .using('stanbol')
           .execute()
           .done(
             function(entities) {
                ok(entities);
                ok(entities.length > 0);
                ok(entities instanceof Array);
                var allEntities = true;
                for ( var i = 0; i < entities.length; i++) {
                   var entity = entities[i];
                   if (!(entity instanceof Backbone.Model)) {
                      allEntities = false;
                      ok(false,
                        "VIE.js StanbolService - Find: Entity is not a " +
                        "Backbone model!");
                      
                  }
              }
              ok(allEntities);
              start();
          }).fail(function(f) {
              ok(false, f.statusText);
              start();
          });

          stop();
          z
          .find( {
              term : term
          })
                    // only term given, no limit, no offset
                    .using('stanbol')
                    .execute()
                    .done(
                     function(entities) {

                        ok(entities);
                        ok(entities.length > 0);
                        ok(entities instanceof Array);
                        var allEntities = true;
                        for ( var i = 0; i < entities.length; i++) {
                           var entity = entities[i];
                           if (!(entity instanceof Backbone.Model)) {
                              allEntities = false;
                              ok(false,
                                "VIE.js StanbolService - Find: Entity is " +
                                "not a Backbone model!");
                              
                          }
                      }
                      ok(allEntities);
                      start();
                  }).fail(function(f) {
                      ok(false, f.statusText);
                      start();
                  });

                  stop();
                  z
                  .find( {
                      term : "",
                      limit : limit,
                      offset : offset
                  })
                  .using('stanbol')
                  .execute()
                  .done(
                     function(entities) {

                        ok(false,
                          "this should fail, as there is an empty term given!");
                        start();
                    }).fail(function(f) {
                      ok(true, f.statusText);
                      start();
                  });

                    stop();
                    z.find( {
                        limit : limit,
                        offset : offset
                    }).using('stanbol').execute().done(function(entities) {

                        ok(false, "this should fail, as there is no " +
                        		"term given!");
                        start();
                    }).fail(function(f) {
                        ok(true, f.statusText);
                        start();
                    });
                });

test(
  "VIE.js StanbolService - Load",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var entity = "<http://dbpedia.org/resource/Barack_Obama>";
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    z.use(new z.StanbolService( {

        url : stanbolRootUrl[0]

    }));
    stop();
    z
    .load( {
      entity : entity
  })
    .using('stanbol')
    .execute()
    .done(
     function(entities) {
        ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        for ( var i = 0; i < entities.length; i++) {
           var entity = entities[i];
           if (!(entity instanceof Backbone.Model)) {
              allEntities = false;
              ok(false,
                "VIE.js StanbolService - Load: Entity is not a " +
                "Backbone model!");
              
          }
      }
      ok(allEntities);
      start();
  }).fail(function(f) {
      ok(false, f.statusText);
      start();
  });
});


  test("VIE.js StanbolService - EntityHub: Lookup", function () { 
  	if (navigator.userAgent === 'Zombie') { return; }
  
  	var z = new VIE();
  	ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService( {

        url : stanbolRootUrl[0]

    });
    z.use(stanbol);
    
    var entity = 'http://dbpedia.org/resource/Germany'; // sometimes, Stanbol will throw an exception at Paris
    
    // ** briefly test the accept parameter
               stop();
               stanbol.connector.lookup(entity, 
               	function(success) {
               		ok(true, "Retrieved newly-referenced entity in " +
               				"rdf+nt syntax");
               		start();
               	}, 
               	function(error) {
               		ok(false, "Could not retrieve newly-referenced entity " +
               				"in rdf+nt syntax");
               		start();
               	}, 
               	{
               		create : "true",
               		accept : "text/rdf+nt"
               	});
               	// **
  	
  });

test(
  "VIE.js StanbolService - LDPath",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }

    var context = 'http://dbpedia.org/resource/Paris';
    var ldpath = "@prefix dct : <http://purl.org/dc/terms/> ;\n"
    + "@prefix geo : <http://www.w3.org/2003/01/geo/wgs84_pos#> ;\n"
    + "name = rdfs:label[@en] :: xsd:string;\n"
    + "labels = rdfs:label :: xsd:string;\n"
    + "comment = rdfs:comment[@en] :: xsd:string;\n"
    + "categories = dc:subject :: xsd:anyURI;\n"
    + "homepage = foaf:homepage :: xsd:anyURI;\n"
    + "location = fn:concat(\"[\",geo:lat,\",\",geo:long,\"]\") :: xsd:string;\n";

    var z = new VIE();
    z.namespaces.add("cc", "http://creativecommons.org/ns#");
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService( {

        url : stanbolRootUrl[0]

    });
    z.use(stanbol);

    stop();
            // on all sites
            stanbol.connector.ldpath(ldpath, context, function(response) {
                var entities = VIE.Util.rdf2Entities(stanbol, response);
                ok(entities.length > 0);
                start();
            }, function(err) {
                ok(false, err);
                start();
            });

            stop();
            // on on specific site
            stanbol.connector.ldpath(ldpath, context, function(response) {
                var entities = VIE.Util.rdf2Entities(stanbol, response);
                ok(entities.length > 0);
                start();
            }, function(err) {
                ok(false, err);
                start();
            }, {
                site : "dbpedia"
            });

            stop();
            // on local entities
            stanbol.connector.ldpath(ldpath, context, function(response) {
                var entities = VIE.Util.rdf2Entities(stanbol, response);
                ok(entities.length > 0);
                start();
            }, function(err) {
                ok(false, err);
                start();
            }, {
                local : true
            });
        });


// ### test for the StanbolService save interface to the entityhub/entity
// endpoint,
// the service to create Entities managed on the Entityhub.
// @author mere01
test(
  "VIE.js StanbolService - save (create) local entities",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var z = new VIE();
    ok(z.StanbolService, "Stanbol Service exists.");
    equal(typeof z.StanbolService, "function");

    var stanbol = new z.StanbolService( {

        url : stanbolRootUrl[0]

    });
    z.use(stanbol);

            // create a new entity
            var id = 'http://developer.yahoo.com/javascript/howto-proxy.html';
            var ent = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';
            
	var entity = {
	    entity : ent,
	    update : true,
	    local : true
	};
	var entity2 = {
	    entity : ent,
	    local : true
	};
	
	stop();
	z.save(entity)
    // option to allow repeated testing with same entity
    	.using("stanbol")
        .execute()
        .done(
        	function(response) {

            	ok(true, "E1: new entity " + id
                	+ " created in entityhub/entity/ (using option update)");
                // if an Entities already exists within the
                // Entityhub, the request should fail with BAD REQUEST
                start();
                stop();
                z.save(entity2)
                 // do NOT allow updating of already
                 // existing entities (no options)
                 .using("stanbol")
                 .execute()
                 .done(
                 	function(response) {
                    	ok(false, "E2: entityhub/entity: created " +
                    			"already existing entity " + id
								+ ". (using no option)");
                        start();
                    })
				 .fail(
					function(err) {
						ok(true, "E2: already-existing entity could not " +
							"be created in the entityhub! (using no option) " +
							"Received error message: " + err);
						start();
					});
			})
		.fail(
			function(err) {
				ok(false, "E1: entity could not be created in the " +
						"entityhub! (using option update)");
    			start();
			}
		);

	// create should fail due to invalid syntax (forgot quotation marks
    // for xmlns:rdf entry)
	var entF = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf=http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';
	stop();
	z.save( {
	    entity : entF,
	    local : true
	}).using("stanbol").execute().done(
	function(response) {
	  ok(false,
	    "E3: created entity on entityhub in spite of faulty syntax. "
	    + response)
	  start();
	}).fail(
	function(err) {
	  ok(true,
	    "E3: entity creation failed due to erroneous syntax. Received error message: "
	    + err);
	  start();
	});

}); // end of save test for entityhub/entity

// ### test for the entityhub/entity, the service to get/create/update and
// delete Entities managed on the Entityhub.
// @author mere01
test(
  "VIE.js StanbolConnector - CRUD on local entities",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var z = new VIE();
    ok(z.StanbolService, "Stanbol Service exists.");
    equal(typeof z.StanbolService, "function");

    var stanbol = new z.StanbolService( {

        url : stanbolRootUrl[0]

    });
    z.use(stanbol);

            // create a new entity
            var entity = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';
            var modifEntity = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Modified Label of Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';

            var id = 'http://developer.yahoo.com/javascript/howto-proxy.html';

            stop();
            stanbol.connector
           .createEntity(
             entity,
             function(response) {
                
                ok(
                  true, "E1: new entity " + id
                  + " created in entityhub/entity/ (using option update)");
                start();
				// if an Entities already exists within the
                // Entityhub, the request should fail with BAD REQUEST
				stop();
                stanbol.connector.createEntity(
	  				entity,
	                function(response) {
	                	ok(false, "E2: entityhub/entity: created already " +
	                			"existing entity " + id + ". (using no option)");
						start();
	                },
	                function(err) {
	                	ok(true, "E2: already-existing entity could not be " +
	                			"created in the entityhub! (using no option) " +
	                			"Received error message: " + err);
						start();
	                }); // do NOT allow updating of already existing entities

               // retrieve the entity that's just been created
               stop();
               stanbol.connector.readEntity(
				id,
                function(response) {
                	ok(true,"E3: got entity from entityhub/entity.");
                    start();
                },
                function(err) {
                	ok(false,
					"E3: could not get entity from the entityhub!");
                    start();
                }, 
                {
                 	local : 'true',
                    accept : 'application/x-turtle',
                    format : 'text'
				}); // to denote that this is a local entity

  				// update the entity that's just been created
                // (modify the label)
                stop();
                stanbol.connector.updateEntity(
					modifEntity,
                    function(response) {
                    	ok(response);
                        if (response && response.id)
                        	ok(true, "E4: entity  " + response.id
                               + " was updated successfully in the entityhub.");
                        start();
                    },
                    function(err) {
                    ok(false, "E4: could not update entity " + id
						+ " in the entityhub! Received error message: " + err);
					start();
                    }, {}, id);

                // delete our entity
                stop();
                stanbol.connector.deleteEntity(
					id,
                    function(response) {
                    	ok(response);
                        if (response && response.id)
                        ok(true, "E6: entity  " + response.id
                             + " was deleted successfully from the entityhub.");
                        start();
					},
                    function(err) {
                    	ok(false, "E6: could not delete entity " + id
                        	+ " from the entityhub! Received error message: "
                            + err);
						start();
					});

                // the deleted entity cannot be retrieved anymore
                stop();
                stanbol.connector.readEntity(
					id,
                    function(response) {
						var first = null;
                        for ( var key in response)
                        // grab just the first key of the returned object
						{
							first = response[key]
                            if (typeof (first) !== 'function') {
                               	first = key;
                                break;
                            }
                        }
                        ok(false, "E7: got non-existing entity from " +
                        		"entityhub/entity: " + first);
						start();
                    },
                    function(err) {
                    	ok(true, "E7: could not get non-existing entity " +
                    			"from the entityhub!");
                        start();
					});
			},
			function(err) {
    			ok(false, "E1: entity could not be created in the " +
    					"entityhub! (using option update)");
    			start();
			}, {
                update : 'true' // option for repeated testing with same entity
            });

            // we should be unable to update a non-existing entity
            var modifId = 'http://developer.yahoo.com/javascript/howto-proxy-falseaddress.html';
            stop();
            stanbol.connector.updateEntity(modifEntity, function(response) {
                ok(false, "E5: non-existing entity  " + modifId
                 + " was updated successfully in the entityhub.");
               start();
           }, function(err) {
               ok(true, "E5: could not update non-existing entity "
                 + modifId
                 + " in the entityhub! Received error message: "
                 + err);
               start();
           }, {}, modifId);

            // create should fail due to invalid syntax (forgot quotation marks
            // for xmlns:rdf entry)
	var entity = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf=http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-ajax.html"><rdfs:label>Howto-Ajax</rdfs:label></rdf:Description></rdf:RDF>';
	stop();
	stanbol.connector.createEntity(entity, function(response) {
	    ok(false,
	      "E8: created entity on entityhub in spite of faulty syntax. "
	      + response)
	    start();
	}, function(err) {
	    ok(true,
	      "E8: entity creation failed due to erroneous syntax. Received error message: "
	      + err);
	    start();
	});

	
	// testing new parameters on the enityhub/find service
	// curl -X POST -d "name=Bisho&limit=10&offset=0&lang=en&field=http://www.w3.org/2000/01/rdf-schema#label&select=http://www.w3.org/2000/01/rdf-schema#domain&ldpath=name%20%3D%20rdfs%3Alabel%5B%40en%5D%3B" http://dev.iks-project.eu:8081/entityhub/sites/find
	var name = "P*";
	var limit = 10;
	var offset = 0;
	var lang = "en";
	var field = "http://www.w3.org/2000/01/rdf-schema#label";
	var select = "http://www.w3.org/2000/01/rdf-schema#domain";
	var ldpath = "name%20%3D%20rdfs%3Alabel%5B%40en%5D%3B";
	stop()
	z
    .find( {
      term : name,
      limit : limit,
      offset : offset
  })
    .using('stanbol')
    .execute()
    .done(
     function(entities) {

     	ok(true, "Found entity " + name + " with new parameters.");
		ok(entities);
        ok(entities.length > 0);
        ok(entities instanceof Array);
        var allEntities = true;
        
        for ( var i = 0; i < entities.length; i++) {
           var entity = entities[i];
           if (!(entity instanceof Backbone.Model)) {
              allEntities = false;
              ok(false,
                "VIE.js StanbolService - Find: Entity is not a Backbone model!");
              
          }
      }
      ok(allEntities);
      start();
  }).fail(function(f) {
  	ok(false, "Could not find entity " + name + " with new parameters.");
	  ok(false, f.statusText);
      start();
  },
  {
			lang : lang,
			field : field,
			select : select,
			ldpath : ldpath
		});
	
	


	// delete all the entities at once (this must never be tested on some
	// stanbol server that is used by other clients than ourselves !)
//	stop();
//	stanbol.connector.deleteEntity("*", 
//		function(success){
//			ok(true, "Deleted all the entities from local entityhub.");
//			start();
//		},
//		function(error){
//			ok(false, "Could not delete all the entities from local entityhub.");
//			start();
//		})

}); // end of test for CRUD entityhub/entity


// ### test for the /entityhub/mapping endpoint, checking the retrieval of
// entity mappings
// (the entityhub/mapping looks up mappings from local Entities to Entities
// managed by a Referenced Site.
// @author mere01
test("VIE.js StanbolConnector - entityhub/mapping", function() {

    if (navigator.userAgent === 'Zombie') {
        return;
    }

    	// we can look for an entity's mapping
    	var entity = "http://dbpedia.org/resource/Germany"; // Paris will throw an exception
        // or for the mapping itself by its ID
        var mapping = ""; // e.g.
        // "urn:org.apache.stanbol:entityhub:mapping.996b1d77-674d-bf3d-f426-f496c87b5ea7";
        // or by using the entity's symbol
        var symbol = ""; // e.g.
        // "urn:org.apache.stanbol:entityhub:entity.3e388b57-0a27-c49f-3e0a-2d547a3e1985";

        var z = new VIE();
        ok(z.StanbolService);
        equal(typeof z.StanbolService, "function");
        var stanbol = new z.StanbolService( {

            url : stanbolRootUrl[0]

        });
        z.use(stanbol);

        // first make sure that we have the dbpedia 'Paris' entity referenced on
        // our local entityhub
        var there = false;
        var del = true;
        stop();
        stanbol.connector.lookup(
          entity,
          function(succ) {
			// so the entity is already referenced locally
            there = true;
            // this means we must NOT delete it after tests are done
			del = false;
            var counter = 0;
            // get the symbol for this entity
            // pick the urn, but not the .meta info
            var suffix = ".meta";

           symbol = succ["id"];
                            
           start();

           /** * */
                           
           // execute the following tests only if we have
           // an entity Paris on the local entityhub
           stop();
           stanbol.connector.getMapping(entity,
           	function(success) {
            	ok(true, "retrieved Mapping for entity " + entity);
               	start();
			},
            function(err) {
            	ok(false, "couldn't retrieve mapping for entity " + entity);
                start();
            }, {
            	entity : true,
                accept : "text/rdf+n3"
            });

		stop();
		stanbol.connector.getMapping(symbol, function(success) {
		  ok(true, "retrieved mapping for symbol " + symbol);
		  // retrieve the mapping's id from the symbol's mapping
          mapping = success['results'][0]['id'];
          start();

          stop();
          stanbol.connector.getMapping(mapping,
            function(success) {
               ok(true, "retrieved mapping by ID.");
               start();
         	},
            function(err) {
            ok(false, "couldn't retrieve mapping by ID");
            start();
            }, 
            {});

		}, function(err) {
		    ok(false, "couldn't retrieve mapping for symbol " + symbol);
		    start();
		}, {
		    symbol : true
		});


  /** * */

  },
  function(err) {
	  // so the entity is not referenced on the entityhub
	  ok(true, "Could not look up entity " + entity
			  + ". This entity apparently is not stored on the local entityhub. I will temporarily create this entity until tests are completed.");
	  start();

      // if the entity is not already there -> create it temporarily
      stop();
      stanbol.connector.lookup(entity,
         function(succ) {
                 // so the entity got referenced locally
                 there = true;
                 ok(true, "newly referenced entity " + entity);
                 var counter = 0;
                 // get the symbol for this entity
				symbol = succ["id"];
                

                 /** * */
                 
                    // execute the following tests only if we have an entity Paris on the local entityhub
                    
                    stanbol.connector.getMapping(entity, 
                    function(success) {
                        ok(true, "retrieved Mapping for entity " + entity);
                        start();

                    	},
                    	function(err) {
                             ok(false, "couldn't retrieve mapping for entity" + entity);
                             start();
                       },
                       {
                             entity : true,
                             accept : "text/rdf+n3"
                        });

    stop();
	stanbol.connector.getMapping(symbol,
	  function(success) {
	     ok(true,"retrieved mapping for symbol " + symbol);
	        // retrieve the mapping's id from the symbol's mapping
	        mapping = success['results'][0]['id'];
	        start();
	
	        stop();
	        stanbol.connector.getMapping(mapping,
	          function(success) {
	              ok(true,"retrieved mapping by ID.");
	              start();
	              	              
				 stop();
				 stanbol.connector.deleteEntity(symbol,
				     function(success) {
				        ok(true, "deleted entity " + entity + " from the local entityhub");
				        start();
				    },
				    function(err) {
				        ok(false, "could not delete entity " + entity + " from the local entityhub");
				        start();
				    },
				    {});
				 
	
	           },
	           function(err) {
	             ok(false, "couldn't retrieve mapping by ID");
	             start();
	            },
	          {});
	
			},
			function(err) {
			 ok(false, "couldn't retrieve mapping for symbol " + symbol);
			 start();
			},
			{
			 symbol : true
			});


    },
    function(err) {
    	ok(false, "failed to reference entity " + entity);
    	start();

    }, {
    	create : true
    });


 },

 {
  'create' : false  // do NOT create *new* references/mappings
 });
});

test(
  "VIE.js StanbolService - Query (non-local)", 6,
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var query = {
        "selected" : [ "http://www.w3.org/2000/01/rdf-schema#label",
        "http://dbpedia.org/ontology/birthDate",
        "http://dbpedia.org/ontology/deathDate" ],
        "offset" : "0",
        "limit" : "3",
        "constraints" : [
        {
         "type" : "range",
         "field" : "http://dbpedia.org/ontology/birthDate",
         "lowerBound" : "1946-01-01T00:00:00.000Z",
         "upperBound" : "1946-12-31T23:59:59.999Z",
         "inclusive" : true,
         "datatype" : "xsd:dateTime"
     },
     {
         "type" : "reference",
         "field" : "http://www.w3.org/1999/02/22-rdf-syntax-ns#type",
         "value" : "http://dbpedia.org/ontology/Person"
     } ]
 };

	 var query = {
	    "selected" : [ "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label" ],
	    "offset" : "0",
	    "limit" : "3",
	    "constraints" : [ {
	       "type" : "text",
	       "xml:lang" : "de",
	       "patternType" : "wildcard",
	       "field" : "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label",
	       "text" : "Frankf*"
	   } ]
	};

	var z = new VIE();
	z.use(new z.StanbolService( {
	
	    url : stanbolRootUrl[0]
	
	}));
	stop();
    // query all referenced sites (entityhub/sites/query)
    z.query( {
    	query : query,
        local : false
	})
    .using('stanbol')
    .execute()
    .done(
    	function(entities) {
        	ok(entities);
            if (!entities.length > 0) {
            	ok(false,
                     "no entitites found on all referenced sites.");
            } else {
            	ok(true,
                     "at least one entity was found on all referenced sites.");
            }
            ok(entities instanceof Array);
            start();
        })
	
        // cf e.g.
        // curl -X POST -H "Content-Type:application/json" --data
        // "@fieldQuery2.json"
        // http://lnv-89012.dfki.uni-sb.de:9001/entityhub/sites/query
        // to
        // curl "http://lnv-89012.dfki.uni-sb.de:9001/entityhub/sites/entity?id=http://dbpedia.org/resource/Frankfurt
	 .fail(function(f) {
      	ok(false, f.statusText);
        start();
     });

 	/** mere01 * */
	stop();
	// query only entities on referenced site dbpedia
 	// (entityhub/site/dbpedia/query)
	z.query( {
 		query : query,
        site : "dbpedia"
            }).using('stanbol').execute().done(function(entities) {
                ok(entities);
                if (!entities.length > 0) {
                    ok(false, "no entitites found on dbpedia.");
                } else {
                    ok(true, "at least one entity was found on dbpedia.");
                }
                ok(entities instanceof Array);
                start();
            }).fail(function(f) {
                ok(false, f.statusText);
                start();
            });
            /**/
        });


test(
  "VIE.js StanbolService - Query (local)",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var query = {};

    var z = new VIE();
    var stanbol = new z.StanbolService( {

        url : stanbolRootUrl[0]

    });
    z.use(stanbol);
    stop();
    z
    .query( {
      query : query,
      local : true
  })
    .using('stanbol')
    .execute()
    .done(
     function(entities) {
        ok(false,
          "A. This should not return successfully because query was wrong!");
        start();
    })
    .fail(
     function(msg) {
        ok(true,
          "A. Query failed because of wrong query syntax (empty query object)");
        start();
    });


    /** mere01 * */

    var query = {
        "selected" : [ "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label" ],
        "offset" : "0",
        "limit" : "3",
        "constraints" : [ {
           "type" : "text",
           "xml:lang" : "de",
           "patternType" : "wildcard",
           "field" : "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label",
           "text" : "Germ*" // at Frankf*, Stanbol will throw an exception
       } ]
   };


   // first we decide whether we need to reference an entity for the following test
   var there = false;
   var del = true;
   entity = "http://dbpedia.org/resource/Germany"; // sometimes, Stanbol will throw an exception at Frankfurt
	   
   stop();
   stanbol.connector.lookup(entity, 
	  function(success){
	   
	   ok(true, "1. Looked up entity " + entity + ". This entity apparently " +
	   		"is already stored on the local entityhub.");
	   ok(true, "2. No need to reference entity " + entity);
	   
	   // so the entity is already referenced locally
       there = true;
       // this means we must NOT delete it after tests are done
       del = false;
      
      // execute the following tests only if we have an entity Frankf* on the local entityhub
      z.query( {
          query : query,
          local : true
      }).using('stanbol').execute().done(

            function(entities) {
            	    ok(true, "3. Retrieved entities according to query Frankf*");
            	    ok(entities);
            	    if (!entities.length > 0) {
            	       ok(false, "3. no entitites found.");
            	   } else {
            	       ok(true, "3. at least one entity was found.");
            	   }
            	   ok(entities instanceof Array);
            	   
               // ** briefly test the accept parameter
               stanbol.connector.lookup(entity, 
               	function(success) {
               		ok(true, "Retrieved newly-referenced entity in rdf+nt syntax");
               		start();
               	}, 
               	function(error) {
               		ok(false, "Could not retrieve newly-referenced entity in rdf+nt syntax");
               		start();
               	}, 
               	{
               		create : "false",
               		accept : "text/rdf+nt"
               	});
               	// **
            	   
            	   
            }).fail(function(f) {
            	ok(false, f.statusText);
            	start();
            });
     
      ok(true, "4. We will NOT delete entity " + entity + 
      	" since it has been there before"); 
	   
      // end of success case of lookup (create : false)
      
   }, function(error){
	   
	   ok(true, "1. Could not look up entity " + entity 
	   	+ ". This entity apparently is not stored on the local entityhub. " +
	   			"I will temporarily create this entity until tests " +
	   			"are completed.");

	   // if the entity is not already there -> create it temporarily
	   stanbol.connector.lookup(entity, function(success){
			   
	   	there = true;
        ok(true, "2. newly referenced entity " + entity);
               
        // in order to delete the entity again, we need to find its id:
        var id;
        var counter = 0;
        for ( var key in success) {
        	counter += 1;
            // pick the urn, but not the .meta info
            var suffix = ".meta";
            if (key.indexOf(suffix, key.length - suffix.length) === -1) {
            	id = key;
            }
                                
        }
              
 
		// execute the following tests only if we have an entity Frankf* on the local entityhub
        z.query( {
        	query : query,
            local : true
        }).using('stanbol').execute().done(

        	function(entities) {
            	ok(true, "3. Retrieved entities according to query Frankf*");
                ok(entities);
                if (!entities.length > 0) {
                	ok(false, "3. no entitites found.");
                } else {
                	ok(true, "3. at least one entity was found.");
                }
                	   
                ok(entities instanceof Array);

                // delete the entity again (now we don't need it anymore)
                stanbol.connector.deleteEntity(
                	id,
                   function(success) {
                   	ok(true, "4. deleted entity " + entity + " from the local entityhub");
                   	start();
                   },
                   function(err) {
                   	ok(false, "4. could not delete entity " + entity + " from the local entityhub");
                   	start();
                   },
                   {});
               
         }).fail(function(f) {
         	ok(false, f.statusText);
            start();
     	 });	// end of error case for query()
   
            
		   }, function(error){
			   
			   ok(false, "2. failed to reference entity " + entity);
			   start();
			   
		   }, {
			   create : true,
			   accept : "application/rdf+json"
		   });
	
	   
	   
   }, {	// end of error case of lookup (create : false)
	   create : false
       
 });	
   


/**/
});

