var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];


//### test for the ontonet/ontology endpoint, the component to manage scopes.
//An Ontology
//Scope is a 'logical realm' for all ontologies that encompass a certain
//CMS-related set of concepts.
//@author mere01
test("VIE.js StanbolConnector - OntoNet Scope Manager", function() {
	
	var scope = "pizzaScope";
    // a library is a collection of references to ontologies, which can be
    // located anywhere on the web
    var lib = "http://ontologydesignpatterns.org/ont/iks/kres/"; // TODO test this with an array of libraries
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);

    stop();
	stanbol.connector.loadScope(
				scope,
				function(success) {
					console.log("01. Created scope " + scope)
					ok(true, "01. Created scope " + scope);
					start();
					
					// we can load a specific ontology into a specific scope
					// TODO post/redirect/get problem due to time out for GET
					var ontology = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";
					var ontID = '';
//					stop();
//					stanbol.connector.loadOntology(
//						scope,
//						ontology,
//						function(success) {
//							// retrieve the URI under which the ontology was
//							// stored on the scope
//							ontID = success['@subject'][0]['@subject'];
//
//							ok(true, "02. Loaded ontology " + ontology + " as "
//								+ ontID + " into existing scope " + scope);
//							console.log("02. Loaded ontology " + ontology
//								+ " as " + ontID + " into existing scope "
//								+ scope);
//
//							
//	                stanbol.connector.getOntology(scope, ontID, function(success) {
//	                    ok(true, "03. Retrieved ontology " + ontology + " at scope " + scope);
//	                    console.log("03. Retrieved ontology " + ontology);
//	                    console.log(success)
//	                    start();
//	                }, function(err) {		// error callback of getOntology
//	                    ok(false, "03. Could not retrieve ontology " + ontology + " at scope " + scope);
//						console.log("03. Could not retrieve ontology " + ontology + " at scope " + scope)
//	                    start();
//	                }, {});
//
//						},
//						function(err) { // error callback of loadOntology
//							ok(false, "02. Could not load ontology " + ontology
//								+ " into scope " + scope);
//							console.log("02. Could not load ontology "
//								+ ontology + " into scope " + scope)
//							console.log(err);
//							start();
//						}, {});
					
				    stop();
				    // we can get a list of all the registered scopes
				    stanbol.connector.ontoScopes(function(success) {
				        ok(true, "04. could retrieve list of all registered scopes")
				        console.log("04. retrieved list of registered scopes:")
				        // console.log(success) // TODO returns HTML page instead of RDF
				     
				        
				        stanbol.connector.deleteScope(scope, function(success) {
				            ok(true, "05. deleted scope " + scope + " from the ontonet/ontology.");
				            console.log("05. deleted scope " + scope)
				            start();
				        }, function(err) {
				            ok(false, "05. could not delete scope " + scope + " from the ontonet/ontology.");
				            console.log("05. could not delete scope " + scope);
				            start();
				        }, {});
				        
				    }, function(err) {
				        ok(false, "04. could not retrieve list of all registered scopes")
				        console.log("04. could not retrieve list of all registered scopes")
				        console.log(err)
				        start();
				        
				        

				    });
						
				}, function(error) {	// error callback of loadScope
					console.log("01. Could not create scope " + scope)
					ok(false, "01. Could not create scope " + scope);
					start();
				});
	
	
	// testing for parameter options in loading a scope
    var sc = "paramScope";
    stop();
     stanbol.connector.loadScope(sc, function(success) {
         ok(true, "06. Created scope " + sc + " using options.");
         console.log("06. Could load scope " + sc + " using options.");
        
         start(); // TODO get rid
//         stanbol.connector.deleteScope(sc, function(success) {	// TODO back in
//             ok(true, "07. deleted scope " + sc + " from the ontonet/ontology.");
//             console.log("07. deleted scope " + sc)
//             start();
//         }, function(err) {
//             ok(false, "07. could not delete scope " + sc + " from the ontonet/ontology.");
//             console.log("07. could not delete scope " + sc);
//             start();
//         }, {});
         
     }, function(err) {
         ok(
         false, "06. Could not load scope " + sc + " using options.");
         console.log("06. Could not load scope " + sc + " using options.");
         start();
     }, {
         
     	 corereg : 'http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks',	// ok
         coreont: 'http://www.ontologydesignpatterns.org/cp/owl/sequence.owl',							// ok
         // customont and customreg are deprecated, they now have to be set using
         // loadLibrary() and loadOntology()
         customreg : 'http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments',
         customont: 'http://ontologydesignpatterns.org/ont/iks/kres/omv.owl',
         foo: 'http://somefoo.com',
         activate: true
     });
     
  // testing for parameter options in loading a scope
     var lsc = "listScope";
     stop();
      stanbol.connector.loadScope(lsc, function(success) {
          ok(true, "07. Created scope " + lsc + " using list options.");
          console.log("07. Could load scope " + lsc + " using list options.");
         
          start(); // TODO get rid
//          stanbol.connector.deleteScope(sc, function(success) {	// TODO back in
//              ok(true, "07. deleted scope " + sc + " from the ontonet/ontology.");
//              console.log("07. deleted scope " + sc)
//              start();
//          }, function(err) {
//              ok(false, "07. could not delete scope " + sc + " from the ontonet/ontology.");
//              console.log("07. could not delete scope " + sc);
//              start();
//          }, {});
          
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
          activate: false
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
            stanbol.connector.loadScope(scope, function(success) {
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
                // TODO post/redirect/get problem with time out for GET request
//                stop();
//                stanbol.connector.appendToSession(session, function(success) {
 //                    ok(true, "05. Successfully appended " + ont + " and " + scope + " to session " + session);
//                    console.log("05. Successfully appended " + ont + " and " + scope + " to session " + session);
                    
                    
                    
                    
//                    // remove the ontology again from the session
                	// TODO post/redirect/get problem with time out for GET request
//                    stanbol.connector.undockFromSession(session, function(success) {
//                        ok(true, "06. Deleted ontology " + ont + " from session " + session);
//                        console.log("06. Deleted ontology " + ont + " from session " + session);
//                        
//                        // remove the scope again from the session    
//                        stanbol.connector.undockFromSession(
//                        session, function(success) {
//                            ok(true, "07. Deleted scope " + scope + " from session " + session);
//                            console.log("07. Deleted scope " + scope + " from session " + session);
//                            start();
                            
                            // delete the scope
                			stop();
                            stanbol.connector.deleteScope(scope, function(success){
                            	ok(true, "08. Deleted scope " + scope + " from ontonet.");
                            	console.log("08. Deleted scope " + scope + " from ontonet.");
                            	start();
                            }, function(error) {
                            	ok(false, "08. Could not delete scope " + scope + " from ontonet.");
                            	console.log("08. Could not delete scope " + scope + " from ontonet.");
                            	start();
                            });
                            
                            // delete the session
                            stop();
                            stanbol.connector.deleteSession(function(success){
                            	ok(true, "09. Deleted session " + session + " from ontonet.");
                            	console.log("09. Deleted session " + session + " from ontonet.");
                            	start();
                            }, function(error){
                            	ok(false, "09. Could not delete session " + session + " from ontonet.");
                            	console.log("09. Could not delete session " + session + " from ontonet.");
                            	start();
                            }, 
                            session);
                          
//                        }, function(error) {	// error callback of undockFromSession
//                            ok(true, "07. Could not delete scope " + scope + " from session " + session);
//                            console.log("07. Could not delete scope " + scope + " from session " + session);
//                            start();
//                        }, {
//                            scope: scope
//                        });
                      
//                    }, function(error) {
//                        ok(false, "06. Could not delete ontology " + ont + " from session " + session);
//                        console.log("06. Could not delete ontology " + ont + " from session " + session);
//                        
//                    }, {
//                        ont: ont
//                    });


                    
                    
                    
//                    start();
//
//                }, function(error) {	// error callback of appendToSession
//                    ok(
//                    false, "05. Could not append to session " + session);
//                    console.log("05. Could not append to session " + session);
//                    start();
//                }, {
//                    ont: ont,	// TODO back in as soon as post/redirect/get problem is solved
//                    scope: scope

//                });
                
                
            }, function(error) {	// error callback of loadScope
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