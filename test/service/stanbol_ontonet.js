var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];


//### test for the ontonet/ontology endpoint, the component to manage scopes.
// From the documentation / from Alessandro Amadou:
// An ontology Scope is a 'logical realm' for all ontologies that encompass a
// certain CMS-related set of concepts.
// A library is an aggregate object of multiple ontology sources. 
// A registry is the RDF graph that describes one or more libraries (or parts thereof). 
//@author mere01
test("VIE.js StanbolConnector - OntoNet Scope Manager", function() {
	
	var scope = "pizzaScope";
    var lib = "http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks";
    var ontology = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);

    // core
    stop();
	stanbol.connector.createScope(
				scope,
				function(success) {
					console.log("01. Created scope " + scope)
					ok(true, "01. Created scope " + scope);
					start();
					
					// we can load specific libraries or ontologies into a specific scope
	// core end
					
					// TODO post/redirect/get problem for libraries //TODO back in
					stop();
					stanbol.connector.appendLibrary(scope, lib, function(success){
						
						ok(true, "02.A. Loaded library into scope " + scope);
						console.log("02.A. Loaded library " + lib + " into scope " + scope)
						
						
						stanbol.connector.getLibrary(scope, lib, function(success){
							
							ok(true, "03.A. Retrieved library from scope " + scope);
							console.log("03.A. Retrieved library " + lib + " from scope " + scope)
							
							

							
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
					});
					
					// TODO post/redirect/get problem for ontologies due to time out for GET
					stop();
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
								+ " as " + ontID + " into existing scope "
								+ scope);

					
	                stanbol.connector.getOntology(scope, ontID, function(success) {
	                    ok(true, "03.B. Retrieved ontology " + ontology + " at scope " + scope);
	                    console.log("03.B. Retrieved ontology " + ontology);
	                    console.log(success)
	                    start();
	                }, function(err) {		// error callback of getOntology
	                    ok(false, "03.B. Could not retrieve ontology " + ontology + " at scope " + scope);
						console.log("03.B. Could not retrieve ontology " + ontology + " at scope " + scope)
	                    start();
	                }, {
	                	loc : 'scope'
	                });

						},
						function(err) { // error callback of loadOntology
							ok(false, "02.B. Could not load ontology " + ontology
								+ " into scope " + scope);
							console.log("02.B. Could not load ontology "
								+ ontology + " into scope " + scope)
							console.log(err);
							start();
						}, 
						{ 
							loc : 'scope'
						});
					
 // core
					// TODO stable part start
				    // we can get a list of all the registered scopes
				    stanbol.connector.ontoScopes(function(success) {
				        ok(true, "04. could retrieve list of all registered scopes");
				        console.log("04. retrieved list of registered scopes:")
//				         console.log(success) // TODO returns HTML page instead of RDF
				     
				        
				        stanbol.connector.deleteScope(scope, function(success) {
				            ok(true, "05. deleted scope " + scope + " from the ontonet/ontology.");
				            console.log("05. deleted scope " + scope)
				            start();
				        }, function(err) {	// error callback of deleteScope()
				            ok(false, "05. could not delete scope " + scope + " from the ontonet/ontology.");
				            console.log("05. could not delete scope " + scope);
				            start();
				        }, {});
				        
				    }, function(err) {	// error callback of ontoScopes()
				        ok(false, "04. could not retrieve list of all registered scopes");
				        console.log("04. could not retrieve list of all registered scopes")
				        console.log(err)
				        start();
				        

				    });
				    // TODO stable part end

						
				}, function(error) {	// error callback of createScope
					console.log("01. Could not create scope " + scope)
					ok(false, "01. Could not create scope " + scope);
					start();
				});
	//core end
	
	// testing for parameter options in loading a scope	//TODO back in
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
         false, "06. Could not load scope " + sc + " using options.");
         console.log("06. Could not load scope " + sc + " using options.");
         start();
     }, {
         
     	 corereg : 'http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks',	// ok
         coreont: 'http://www.ontologydesignpatterns.org/cp/owl/sequence.owl'							// ok
         // customont and customreg are deprecated, they now have to be set using
         // loadLibrary() and loadOntology()
//         customreg : 'http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments',
//         customont: 'http://ontologydesignpatterns.org/ont/iks/kres/omv.owl',
//         foo: 'http://somefoo.com',
//         activate: true
     });
     
  // testing for parameter options in loading a scope
     var lsc = "listScope";
     stop();
      stanbol.connector.createScope(lsc, function(success) {
          ok(true, "07. Created scope " + lsc + " using list options.");
          console.log("07. Could load scope " + lsc + " using list options.");
         
          
          stanbol.connector.deleteScope(lsc, function(success) {	
              ok(true, "07. deleted scope " + lsc + " from the ontonet/ontology.");
              console.log("07. deleted scope " + lsc)
              start();
          }, function(err) {
              ok(false, "07. could not delete scope " + lsc + " from the ontonet/ontology.");
              console.log("07. could not delete scope " + lsc);
              start();
          }, {});
          
      }, function(err) {
          ok(
          false, "07. Could not load scope " + lsc + " using list options.");
          console.log("07. Could not load scope " + lsc + " using list options.");
          start();
      }, {
          
      	 corereg : [
      	            'http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks',
      	            'http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments'		// ok
      	            ],
          coreont: [
                    'http://www.ontologydesignpatterns.org/cp/owl/sequence.owl',						// ok
                    'http://ontologydesignpatterns.org/ont/iks/kres/omv.owl'
                    ],
          foo: 'http://somefoo.com',
          activate: true
      });
    
}); // end of test "OntoNet Scope Manager"


// ### test for the ontonet/session endpoint, the component to manage sessions.
// A Session is a collector of volatile semantic data, not intended for
// persistent storage
// @author mere01
test("VIE.js StanbolConnector - OntoNet Session Manager", function() {

    var session = "testSession";
    var scope = "anotherScope";
    var ont = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";

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
            console.log("01.Created session " + session);
            ok(true, "01.Created session " + session);
            start();
            
            // get the session
            stanbol.connector.getSession(session, function(success){
            	
            	ok(true, "02. getSession returned a value");
            	console.log("02. getSession returned a value");
//            	console.log(success);
            	
            }, function(error){
            	
            	ok(false, "02. getSession failed.");
            	console.log("02. getSession failed with " + error);
            	
            });

            // create a scope that  we'll load into our session
            stop();
            stanbol.connector.createScope(scope, function(success) {
                console.log("03. Created scope " + scope);
                ok(true, "03. Created scope " + scope);
                
                // get this newly-created scope
                stanbol.connector.getScope(scope, function(success) {
                    console.log("04. getScope for " + scope + " returned a result.");
                    ok(true, "04. getScope for " + scope + " returned a result.");
                    start();
                    
                }, function(error) {	// error callback of getScope
                    console.log("04. Scope " + scope + " does not exist.");
                    ok(true, "04. Scope " + scope + " does not exist.");
                    start();
                }); 
                
                // load the scope and an ontology upon this session
                stop();
                stanbol.connector.updateScopes(session, function(success){
                	
                	ok(true, "05. Updated session " + session + " with scope " + scope);
                	console.log("05. Updated session " + session + " with scope " + scope)
                	
                	// detach the scope again from this session
                	stanbol.connector.updateScopes(session, function(success){ 
						
                		ok(true, "06. Detached all scopes from session " + session);
                    	console.log("06. Detached all scopes from session " + session)
                		
                	}, function(error){
                		
                		ok(false, "06. Could not detach all scopes from session " + session);
                    	console.log("06. Could not detach all scopes from session " + session)
                		
                	}); // specifying no options will result in an empty POST
                		// and this again will detach all scopes from our session

                	 // delete the scope
                    stanbol.connector.deleteScope(scope, function(success){
                    	ok(true, "08. Deleted scope " + scope + " from ontonet.");
                    	console.log("08. Deleted scope " + scope + " from ontonet.");
                    	start();
                    }, function(error) {
                    	ok(false, "08. Could not delete scope " + scope + " from ontonet.");
                    	console.log("08. Could not delete scope " + scope + " from ontonet.");
                    	start();
                    });
                    
                    
                	
                }, function(error){	// error callback of updateScopes()
                	
                	ok(false, "05. Could not update session " + session + " with scope " + scope);
                	console.log("05. Could not update session " + session + " with scope " + scope)
                	start();
                	
                }, {
                	scope : scope
                });
                
                // load a library upon this session // TODO does not work yet
                // -> appendLibrary()
                // 	-> detachLibrary()
                
                // load an ontology upon this session
                stop();
                stanbol.connector.appendOntology(session, ont, function(success){
                	
                	ok(true, "06. Successfully appended ontology " + ont + " to session " + session);
                	console.log("06. Successfully appended ontology " + ont +  " to session " + session);

//                  // remove the ontology again from the session
                	// TODO post/redirect/get problem with time out for GET request
                	stanbol.connector.detachOntology(session, ont, function(success){
                		
                		ok(true, "07. Successfully detached ontology " + ont + " from session " + session);
                    	console.log("07. Successfully detached ontology " + " from session " + session);
                    	
                    	// delete the session
                        stop();
                        stanbol.connector.deleteSession(function(success){
                        	ok(true, "09. Deleted session " + session + " from ontonet.");
                        	console.log("09. Deleted session " + session + " from ontonet.");
                        	start();
                        }, function(error){	// error callback of deleteSession
                        	ok(false, "09. Could not delete session " + session + " from ontonet.");
                        	console.log("09. Could not delete session " + session + " from ontonet.");
                        	start();
                        }, 
                        session);
                    	
                	}, function(error){	// error callback of detachOntology
                		
                		ok(true, "07. Could not detach ontology " + ont + " from session " + session);
                    	console.log("07. Could not detach ontology " + ont + " from session " + session);
                    	
                	}
					);
                	
                }, function(error){	// error callback of appendOntology
                	
                	ok(true, "06. Could not append ontology " + ont + " to session " + session);
                	console.log("06. Could not append ontology " + " to session " + session);
                	start();
                	
                },
                {
                	loc : "session"
					});
                

                
                
            }, function(error) {	// error callback of createScope
                ok(false, "03. Could not create new scope " + scope);
                console.log("03. Could not create new scope " + scope + ": " + error);
                start();
            });
            

            

        }, function(error) {	// error callback of createSession
            ok(false, "01. Could not create new session " + session);
            console.log("01. Could not create new session " + session + ": " + error);
            start();
        }, session
        );

    });	// end of test for Session Manager