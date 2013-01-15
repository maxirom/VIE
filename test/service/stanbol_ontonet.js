var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];


//### test for the ontonet/ontology endpoint, the component to manage scopes.
// An ontology Scope is a 'logical realm' for all ontologies that encompass a
// certain CMS-related set of concepts.
// A library is an aggregate object of multiple ontology sources. 
// A registry is the RDF graph that describes one or more libraries (or parts thereof). 
//@author mere01
test("VIE.js StanbolConnector - OntoNet Scope Manager", function() {
	
	var scope = "pizzaScope";
    var lib = "http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments";
    var ontology = "http://ontologydesignpatterns.org/schemas/cpannotationschema.owl";
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);

    stop();
	stanbol.connector.createScope(
				scope,
				function(success) {
					ok(true, "01. Created scope " + scope);
					
					// we can load specific libraries or ontologies into a specific scope
					
					/* TODO available at Stanbol in near future
					stanbol.connector.appendLibrary(scope, lib, function(success){
						
						ok(true, "02.A. Loaded library into scope " + scope);
						console.log("02.A. Loaded library " + lib + " into scope " + scope)
						
						
						stanbol.connector.getLibrary(scope, lib, function(success){
							
							ok(true, "03.A. Retrieved library from scope " + scope);
							console.log("03.A. Retrieved library " + lib + " from scope " + scope)
							
							
							// TODO available at Stanbol in near future
							stanbol.connector.appendOntology(
								scope,
								ontology,
								function(success) {
									// retrieve the URI under which the ontology was
									// stored on the scope
									ontID = success['@subject'][0]['@subject'];

									ok(true, "02.B. Loaded ontology " + ontology + " as "
										+ ontID + " into existing scope " + scope);
									console.log("02.B. Loaded ontology " + ontology
										+ " as " + ontID + " into existing scope " + scope);

							
			                stanbol.connector.getOntology(scope, ontID, function(success) {
			                    ok(true, "03.B. Retrieved ontology " + ontology + " at scope " + scope);
			                    console.log("03.B. Retrieved ontology " + ontology);
			                */ // POST/redirect/GET    
			                    
			                // we can get a list of all the registered scopes
						    stanbol.connector.ontoScopes(function(success) {
						        ok(true, "04. could retrieve list of all registered scopes");
						        
						        stanbol.connector.deleteScope(scope, function(success) {
								       ok(true, "05. deleted scope " + scope + " from the ontonet/ontology.");
								       start();
								   }, function(err) {	// error callback of deleteScope()
								       ok(false, "05. Could not delete scope " + scope + " from the ontonet/ontology.");
								       start();
								   }, {});
						        
						      
						    }, function(err) {	// error callback of ontoScopes()
						        ok(false, "04. Could not retrieve list of all registered scopes");
						        start();
						     
						    }, {
						    	accept: "text/rdf+n3"
						    });
			                        
			                    
			                /* available at Stanbol in near future
			                   
			                }, function(err) {		// error callback of getOntology
			                    ok(false, "03.B. Could not retrieve ontology " + ontology + " at scope " + scope);
								console.log("03.B. Could not retrieve ontology " + ontology + " at scope " + scope)
			                    start();
			                }, {
			                	loc : 'scope'
			                });

								},
								function(err) { // error callback of appendOntology
									ok(false, "02.B. Could not load ontology " + ontology
										+ " into scope " + scope + ". Make sure that 'http://ontologydesignpatterns.org' is accessible.");
									console.log("02.B. Could not load ontology "
										+ ontology + " into scope " + scope)
									console.log(err);
									start();
								}, 
								{ 
									loc : 'scope'
								});
							

							

							
						}, function(error){	// error callback of getLibrary()
							
							ok(false, "03.A. Could not retrieve library from scope " + scope);
							console.log("03.A. Could not retrieve library " + lib + " from scope " + scope)
							
							start();
						}, {
							loc : "scope"
						});
						
					}, function(error){		// error callback of appendLibrary()
						
						ok(false, "02.A. Could not load library into scope " + scope);
						console.log("02.A. Could not load library " + lib + " into scope " + scope)
						start();
					},{
						loc : 'scope'
					}); */ // available at Stanbol in near future
					
								
				}, function(error) {	// error callback of createScope
					ok(false, "01. Could not create scope " + scope);
					start();
				});

	
	/* TODO: available at Stanbol in near future
	// testing for parameter options in loading a scope
    var sc = "paramScope";
    stop();
     stanbol.connector.createScope(sc, function(success) {
         ok(true, "06. Created scope " + sc + " using options.");
         console.log("06. Could load scope " + sc + " using options.");
        
         
         stanbol.connector.deleteScope(sc, function(success) {	
             ok(true, "07. deleted scope " + sc + " from the ontonet/ontology.");
             console.log("07. deleted scope " + sc)
             start();
         }, function(err) {
             ok(false, "07. could not delete scope " + sc + " from the ontonet/ontology.");
             console.log("07. could not delete scope " + sc);
             start();
         }, {});
         
     }, function(err) {
         ok(
         false, "06. Could not load scope " + sc + " using options. Make sure that 'http://ontologydesignpatterns.org' is accessible.");
         console.log("06. Could not load scope " + sc + " using options.");
         start();
     }, {
         
     	 corereg : 'http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments',
         coreont: 'http://ontologydesignpatterns.org/schemas/cpannotationschema.owl'
         // parameters customont and customreg are deprecated, they now have to 
         // be set using appendLibrary() and appendOntology()
//         foo: 'http://somefoo.com',
//         activate: true
     });
     
  // testing for parameter options in loading a scope
     var lsc = "listScope";
     stop();
      stanbol.connector.createScope(lsc, function(success) {
          ok(true, "08. Created scope " + lsc + " using list options.");
          console.log("08. Could load scope " + lsc + " using list options.");
         
          
          stanbol.connector.deleteScope(lsc, function(success) {	
              ok(true, "09. deleted scope " + lsc + " from the ontonet/ontology.");
              console.log("09. deleted scope " + lsc)
              start();
          }, function(err) {
              ok(false, "09. could not delete scope " + lsc + " from the ontonet/ontology.");
              console.log("09. could not delete scope " + lsc);
              start();
          }, {});
          
      }, function(err) {
          ok(
          false, "08. Could not load scope " + lsc + " using list options. Make sure that 'http://ontologydesignpatterns.org' is accessible.");

          console.log("08. Could not load scope " + lsc + " using list options.");
          start();
      }, {
          
      	 corereg : [
      	            'http://stanbol.apache.org/ontologies/registries/stanbol_network/W3C',
      	            'http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments'		// ok
      	            ],
          coreont: [
                    'http://ontologydesignpatterns.org/schemas/repository.owl',						// ok
                    'http://ontologydesignpatterns.org/schemas/cpannotationschema.owl'
                    ],
          foo: 'http://somefoo.com',
          activate: true
      });	*/ // available at Stanbol in near future
    
}); // end of test "OntoNet Scope Manager"


// ### test for the ontonet/session endpoint, the component to manage sessions.
// A Session is a collector of volatile semantic data, not intended for
// persistent storage
// @author mere01
test("VIE.js StanbolConnector - OntoNet Session Manager", function() {

    var session = "testSession";
    var scope = "anotherScope";
    var ont = "http://ontologydesignpatterns.org/ont/alignments/schemaorg.owl";

    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);

    stop();
    // create the session
    stanbol.connector.createSession(

        function(success) {
        	start();
            ok(true, "01. Created session " + session);
            
            
            // get the session
            stop();
            stanbol.connector.getSession(session, function(success){
            	
            	ok(true, "02. getSession returned a value");
            	start();
            	
            }, function(error){
            	
            	ok(false, "02. getSession failed.");
            	start();
            });
            
            // get a list of all registered sessions
            stop();
            stanbol.connector.ontoSessions(
            	function(success){
            		ok(true, "Retrieved list of all registered sessions.")
            		start();
            	},
            	function(error){
            		ok(false, "Could not retrieve list of all registered sessions.");
            		start();
            	},
            	{
            		accept: "text/owl-functional"
            	}
            
            );

            // create a scope that  we'll load into our session
            stop();
            stanbol.connector.createScope(scope, function(success) {
            	start();
                ok(true, "03. Created scope " + scope);
                
                // get this newly-created scope
                stop();
                stanbol.connector.getScope(scope, function(success) {
                    ok(true, "04. getScope for " + scope + " returned a result.");
                    start();
                    
                }, function(error) {	// error callback of getScope
                    ok(true, "04. Scope " + scope + " does not exist.");
                    start();
                }, {
                	accept : "application/rdf+xml"
                }); 
                
                // load the scope and an ontology upon this session
                stop();
                stanbol.connector.updateScopes(session, function(success){
                	
                	start();
                	ok(true, "05. Updated session " + session + " with scope " + scope);                	
                	
                	// detach the scope again from this session
                	stop();
                	stanbol.connector.updateScopes(session, function(success){
                		
                		ok(true, "06. Detached all scopes from session " + session);
                    	start();
                    	
                	}, function(error){
                		
                		ok(false, "06. Could not detach all scopes from session " + session);
                		start();
                	}); // specifying no options will result in an empty POST
                		// and this again will detach all scopes from our session

                	// delete the scope
                	stop();
                    stanbol.connector.deleteScope(scope, function(success){
                    	ok(true, "08. Deleted scope " + scope + " from ontonet.");
                   	
                    	      
                         /* TODO available at Stanbol in near future 
                         // load an ontology upon this session
                         stanbol.connector.appendOntology(session, ont, function(success){
                         	
                         	ok(true, "06. Successfully appended ontology " + ont + " to session " + session);
                         	console.log("06. Successfully appended ontology " + ont +  " to session " + session);

                             // remove the ontology again from the session
                         	stanbol.connector.detachOntology(session, ont, function(success){
                         		
                         		ok(true, "07. Successfully detached ontology " + ont + " from session " + session);
                             	console.log("07. Successfully detached ontology " + " from session " + session);
                             	*/
                             	// delete the session 
                                 stanbol.connector.deleteSession(function(success){
                                 	ok(true, "09. Deleted session " + session + " from ontonet.");
                                 	start();
                                 }, function(error){	// error callback of deleteSession
                                 	ok(false, "09. Could not delete session " + session + " from ontonet.");
                                 	start();
                                 }, 
                                 session);
                             	
                                 /*
                         	}, function(error){	// error callback of detachOntology
                         		
                         		ok(true, "07. Could not detach ontology " + ont + " from session " + session);
                             	console.log("07. Could not detach ontology " + ont + " from session " + session);
                             	start();
                         	}
         					);
                         	
                         }, function(error){	// error callback of appendOntology
                         	
                         	ok(false, "06. Could not append ontology " + ont + " to session " + session + ". Make sure that 'http://ontologydesignpatterns.org' is accessible.");
                         	console.log("06. Could not append ontology " + " to session " + session);
                         	start();
                         	
                         },
                         {
                         	loc : "session"
         					}); */
                    	
                    }, function(error) {
                    	ok(false, "08. Could not delete scope " + scope + " from ontonet.");
                    	start();
                    });
                    
                    
                	
                }, function(error){	// error callback of updateScopes()
                	
                	ok(false, "05. Could not update session " + session + " with scope " + scope);
                	
                	 // delete the scope /
                    stanbol.connector.deleteScope(scope, function(success){
                    	ok(true, "08. Deleted scope " + scope + " from ontonet.");
                    	start();
                    }, function(error) {
                    	ok(false, "08. Could not delete scope " + scope + " from ontonet.");
                    	start();
                    });
                	
                } 
//                ,{	//TODO upload does not work yet
//                	scope : scope
//                }
                );
                
                // TODO (not supported yet in Stanbol):
                // load a library upon this session
                //  -> appendLibrary()
                // 	-> detachLibrary()
                
            }, function(error) {	// error callback of createScope
                ok(false, "03. Could not create new scope " + scope);
                
                stanbol.connector.deleteSession(function(success){
                	ok(true, "09. Deleted session " + session + " from ontonet.");
                	start();
                }, function(error){	// error callback of deleteSession
                	ok(false, "09. Could not delete session " + session + " from ontonet.");
                	start();
                }, 
                session);
            });
            

            

        }, function(error) {	// error callback of createSession
            ok(false, "01. Could not create new session " + session);
            start();
        }, session
        );
        
        
        // small separate test for createSession(), in which we do not specify
        // a session ID but wait for the session manager to create and return
        // one for us
        stop();
        stanbol.connector.createSession(
        	function(xml, status, xhr){
        		ok(true, "Created nameless session.");
        		var location = xhr.getResponseHeader('Location');
        		
        		// we get back something like 
        		// http://dev.iks-project.eu:8081/ontonet/session/1349682593596
        		// -> retrieve from this the id
        		var idx = location.lastIndexOf('/') + 1;
        		var id = location.substring(idx );
        		
        		stanbol.connector.deleteSession(
        			function(success){
        				ok(true, "Deleted nameless session.");
        				start();
        			},
        			function(error){
        				ok(false, "Could not delete nameless session.");
        				start();
        			},
        			id
        		);
        		        	},
        	function(error){
        		ok(false, "Could not create nameless session.");
        		start();
        	}
        );
        

    });	// end of test for Session Manager