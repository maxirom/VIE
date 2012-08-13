// ### test for the ontonet/ontology endpoint, the component to manage scopes.
// An Ontology
// Scope is a 'logical realm' for all ontologies that encompass a certain
// CMS-related set of concepts.
// @author mere01
test("VIE.js StanbolConnector - OntoNet Scope Manager", function() {

    var scope = "pizzaScope";
    // a library is a collection of references to ontologies, which can be
    // located anywhere on the web
    var lib = "http://ontologydesignpatterns.org/ont/iks/kres/"; // TODO
    // what is a lib?
    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl
    });
    z.use(stanbol);

    stop();
    // first we check if our scope already exists
    stanbol.connector.getScope(scope, function(success) {
        console.log("01. Scope " + scope + " exists.")
        ok(true, "01. Scope " + scope + " exists.");
        stanbol.connector.deleteScope(scope, function(success) {
            ok(true, "01.B. deleted scope " + scope + " from the ontonet/ontology.");
            console.log("01.B. deleted scope " + scope)
            start();
        }, function(err) {
            ok(false, "could not delete scope " + scope + " from the ontonet/ontology.");
            console.log("could not delete scope " + scope);
            start();
        });
    }, function(error) {
        console.log("01. Scope " + scope + "does not exist yet. Will be created.")
        ok(true, "01. Scope " + scope + " does not exist yet. Will be created.");
        start();
    }, function(complete) {
        console.log("entering complete case");
        stop();
        stanbol.connector.loadScope(scope, function(success) {
            console.log("02. Created scope " + scope)
            ok(true, "02. Created scope " + scope);
            // we can load a specific
            // ontology into a specific
            // scope
            var ontology = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";
            var ontID = '';
            stanbol.connector.loadOntology(scope, ontology, function(success) {
                // retrieve the URI under which the ontology was stored on the scope
                ontID = success['@subject'][0]['@subject'];
                ok(true, "03. Loaded ontology " + ontology + " as " + ontID + " into existing scope " + scope);
                stanbol.connector.getOntology(scope, ontID, function(success) {
                    ok(true, "04. Retrieved ontology " + ontology + " at scope " + scope);
                    console.log("04. Retrieved ontology " + ontology);
                    console.log(success)
                    start();
                }, function(
                err) {
                    ok(false, "04. Could not retrieve ontology " + ontology + " at scope " + scope);
                    start();
                }, {});

            }, function(err) {
                ok(
                false, "03. Could not load ontology " + ontology + " into scope " + scope);
                console.log("03. Could not load ontology " + ontology + " into scope " + scope)
                console.log(err)
                start();
            }, {});

        }, function(error) {
            console.log("02. Could not create scope " + scope)
            ok(false, "02. Could not create scope " + scope);
            start();
        });
    });

    stop();
    // we can get a list of all the registered scopes
    stanbol.connector.ontoScopes(function(success) {
        ok(true, "could retrieve list of all registered scopes")
        console.log("retrieved list of registered scopes:")
        // console.log(success) // TODO returns HTML page instead of RDF
        start();
    }, function(err) {
        ok(false, "could not retrieve list of all registered scopes")
        console.log("could not retrieve list of all registered scopes")
        console.log(err)
        start();

    });

    // // or we can delete the whole set of scopes
    // stanbol.connector
    // .deleteScope(
    // null,
    // function(success) {
    // ok(true,
    // "deleted all scopes from the ontonet/ontology.");
    // console.log("deleted all scopes")
    // },
    // function(err) {
    // ok(false,
    // "could not delete all scopes from the ontonet/ontology.");
    // console
    // .log("could not delete all scopes")
    // });
    // testing for parameter options in loading a scope
    var sc = "paramScope";
    stop();
    stanbol.connector.getScope(sc, function(success) {

        console.log("Scope " + sc + " exists.")
        ok(true, "Scope " + sc + " exists.");
        stanbol.connector.deleteScope(sc, function(success) {
            ok(true, "deleted scope " + sc + " from the ontonet/ontology.");
            console.log("deleted scope " + sc)
            start();
        }, function(err) {
            ok(false, "could not delete scope " + sc + " from the ontonet/ontology.");
            console.log("could not delete scope " + sc);
            start();
        }, {});

    }, function(error) {
        console.log("Scope " + sc + "does not exist yet. Will be created.")
        ok(true, "Scope " + sc + " does not exist yet. Will be created.");
        start();

    }, function(complete) {
        // start();
        console.log("entering complete case")

        stop();
        stanbol.connector.loadScope(sc, function(success) {
            ok(true, "Created scope " + sc + " using options.");
            console.log("Could load scope " + sc + " using options.");
            start();
        }, function(err) {
            ok(
            false, "Could not load scope " + sc + " using options.");
            console.log("Could not load scope " + sc + " using options.");
            start();
        }, {
            // 'corereg' : '', TODO what is
            // an ontology library?
            'coreont': 'http://www.ontologydesignpatterns.org/cp/owl/sequence.owl',
            // 'customreg' : '',
            'foo': 'http://somefoo.com',
            'customont': 'http://ontologydesignpatterns.org/ont/iks/kres/omv.owl',
            'activate': true
        });

    });

}); // end of test "OntoNet Scope Manager"
// ### test for the ontonet/session endpoint, the component to manage sessions.
// A Session is a collector of volatile semantic data, not intended for
// persistent storage
// @author mere01
test("VIE.js StanbolConnector - OntoNet Session Manager", function() {

    var session = "pizzaSession";
    var scope = "someScope";
    var ont = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";

    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl
    });
    z.use(stanbol);

    // test if our scope already exists. If yes, delete it before we create
    // it anew.
    stop();
    stanbol.connector.getSession(session, function(success) {
        ok(true, "01. Session " + session + " exists.");
        console.log("01. Session " + session + " exists.")

        // delete our session (in case it already existed)
        stanbol.connector.deleteSession(function(success) {
            ok(true, "02. Deleted session " + session);
            console.log("02. Deleted session " + session);
            start();
        }, function(error) {
            ok(false, "02. Could not delete session " + session);
            console.log("02. Could not delete session " + session + ": " + error);
            start();
        }, session);

    }, // ok
    function(error) {
        ok(true, "01. Session " + session + " does not exist yet.");
        console.log("01. Session " + session + " does not exist yet: " + error);
        start();
    }, function(complete) {
        // start();
        console.log("entering complete case 1")

        // create the session
        stop();
        stanbol.connector.createSession(

        function(success) {
            console.log("03.Created session")
            ok(true, "03.Created session " + session);

            // we create a scope (if it
            // doesn't
            // already exist) that
            // we'll load into our session
            stanbol.connector.getScope(scope, function(success) {
                console.log("04. Scope " + scope + " exists.");
                ok(
                true, "04. Scope " + scope + " exists");
                start();
            }, function(error) {
                console.log("04. Scope " + scope + " does not exist, will create it.")
                ok(
                true, "04. Scope " + scope + " does not exist, will be created.");

                stanbol.connector.loadScope(scope, function(success) {
                    console.log("04.B Created scope " + scope)
                    ok(
                    true, "04.B. Created scope " + scope);
                    start();
                }, function(
                error) {
                    ok(
                    false, "04.B. Could not create new scope " + scope);
                    console.log("04.B Could not create new scope " + scope + ": " + err)
                    start();
                });

            }, function(complete) {
                console.log("Entering complete 2")

                // load a
                // scope
                // and
                // an
                // ontology
                // upon
                // this
                // session
                stop();
                stanbol.connector.appendToSession(session, function(success) {
                    ok(true, "05. Successfully appended " + ont + " and " + scope + " to session " + session);
                    console.log("05. Successfully appended " + ont + " and " + scope + " to session " + session);
                    
                    stanbol.connector.undockFromSession(session, function(success) {
                        ok(
                        true, "06. Deleted ontology " + ont + " from session " + session);
                        console.log("06. Deleted ontology " + ont + " from session " + session);
                        start();
                    }, function(
                    error) {
                        ok(
                        false, "06. Could not delete ontology " + ont + " from session " + session);
                        console.log("06. Could not delete ontology " + ont + " from session " + session);
                        start();
                    }, {
                        ont: ont
                    });

                    // remove the scope again from the session
                    stop();
                    stanbol.connector.undockFromSession(
                    session, function(
                    success) {
                        ok(
                        true, "07. Deleted scope " + scope + " from session " + session);
                        console.log("07. Deleted scope " + scope + " from session " + session);
                        start();
                    }, function(
                    error) {
                        ok(
                        true, "07. Could not delete scope " + scope + " from session " + session);
                        console.log("07. Could not delete scope " + scope + " from session " + session);
                        start();
                    }, {
                        scope: scope
                    });

                }, function(error) {
                    ok(
                    false, "05. Could not append to session " + session);
                    console.log("05. Could not append to session " + session);
                    start();
                }, {
                    ont: ont,
                    scope: scope

                });

            });

        }, function(error) {
            ok(false, "03. Could not create new session " + session);
            console.log("03. Could not create new session " + session + ": " + error);
            start();
        }, session);

    });

}); // end of test for Session Manager​​