
test(
  "VIE.js StanbolService - ContentHub: Upload of content / Retrieval of enhancements",
  function() {
     if (navigator.userAgent === 'Zombie') {
        return;
    }
    var content = 'This is a small test, where Steve Jobs sings the song "We want to live forever!" song.';

    var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService( {
        url : stanbolRootUrl
    });
    z.use(stanbol);

    stop();
    stanbol.connector.uploadContent(content,
       function(xml, status, xhr) {
          var location = xhr.getResponseHeader('Location');
          console.log("this is the location:")
          console.log(location);
                        // TODO: This does not work in jQuery :(
                           start();
                       }, function(err) {
                           ok(false, err);
                           start();
                       });
});

// ### test for the /contenthub/contenthub/store/raw/<contentId>, the service to
// retrieve raw text content from content items via the item's id
// @author mere01
test(
  "Vie.js StanbolConnector - contenthub/<index>/store/raw/<id>",
  function() {

     var z = new VIE();
     ok(z.StanbolService, "Stanbol Service exists.");
     equal(typeof z.StanbolService, "function");

     var stanbol = new z.StanbolService( {
        url : stanbolRootUrl
    });
     z.use(stanbol);

     var content = "This is some raw text content to be stored for id 'urn:melaniesitem'.";
            var id = "urn:melaniesitem"; // for iks demo server

            // first we have to store that item to the contenthub -> to the
            // default index
            stop(); // TODO do this via uploadContent !!
            // TODO try this also with some index other than default
            $ //TODO: mere01
           .ajax( {
              url : stanbolRootUrl[0] + "/contenthub/contenthub/store/"
              + id,
              success : function(response) {
                 ok(true, "01. Stored entity " + id + " to contenthub.")
                 console.log("01. Stored entity " + id
                   + " to contenthub");
                            // console.log(response);
                            start();
                            // hold it until we get our results
                            stop();
                            stanbol.connector
                           .getTextContentByID(
                             id,
                             function(response) {
                                ok(true,
                                  "02. contenthub/contenthub/store/raw returned a response. (see log)");
                                console
                                .log("02. text content returned from contenthub/contenthub/store/raw is:");
                                console.log(response);
                                start();
                            },
                            function(err) {
                                ok(false,
                                  "02. contenthub/contenthub/store/raw endpoint returned no response!");
                                console
                                .log("02. contenthub/contenthub/store/raw endpoint returned no response!");
                                console.log(err);
                                start();
                            }, {});

                            // delete this content item
                            stop();
                            stanbol.connector.deleteContent(id, function(
                               success) {
                                ok(true, "03. deleted item " + id
                                  + " from the contenthub.");
                                console.log("03. deleted item " + id
                                  + " from the contenthub.");
                                start();
                            }, function(err) {
                                ok(false, "03. could not delete item " + id
                                  + " from the contenthub.");
                                console.log("03. could not delete item " + id
                                  + " from the contenthub.");
                                start();
                            }, {});

                        },
                        error : function(err) {
                            ok(false, "01. could not store content item " + id
                               + " to contenthub.")
                            console
                           .log("01. could not store content item to contenthub.")
                           console.log(err);
                           start();
                       },
                       type : "POST",
                       data : content,
                       contentType : "text/plain"
                    // dataType: "application/rdf+xml"

               });
        }); // end of test for /contenthub/contenthub/store/raw/<contentId>

// ### test for the /contenthub/contenthub/store/metadata/<contentId>, the
// service to retrieve the
// metadata (=enhancements) from content items via the item's id
// @author mere01
test(
  "Vie.js StanbolConnector - Contenthub/store/metadata/<id>",
  function() {

     var z = new VIE();
     ok(z.StanbolService, "Stanbol Service exists.");
     equal(typeof z.StanbolService, "function");

     var stanbol = new z.StanbolService( {
        url : stanbolRootUrl
    });
     z.use(stanbol);

     var content = "This is a small example content item with an occurrence of entity Steve Jobs in it.";
     var id = "urn:melanie2ndsitem";

            // first we have to store that item to the contenthub -> to the
            // default index
            var url = stanbolRootUrl + "/contenthub/contenthub/store/" + id;
            stop();
            $
           .ajax( {
              url : url,
              success : function(response) {
                 ok(true, "01. Stored entity " + id + " to contenthub");
                 start();
                 console.log("01. Stored entity " + id
                   + " to contenthub");
                 console.log(response);

                            // hold it until we get our results
                            stop();
                            stanbol.connector
                           .getMetadataByID(
                             id,
                             function(response) {
                                ok(true,
                                  "02. contenthub/contenthub/store/metadata returned a response. (see log)");
                                console
                                .log("02. text content returned from contenthub/contenthub/store/metadata is:");
                                console.log(response);
                                start();
                            },
                            function(err) {
                                ok(false,
                                  "02. contenthub/contenthub/store/metadata endpoint returned no response!");
                                console.log(err);
                                start();
                            }, {});

                       },
                       error : function(err) {
                         ok(false, "01. Could not store item " + id
                           + " to contenthub.")
                         console.log("01. Could not store item " + id
                           + " to contenthub.")
                         console.log(err);
                         start();
                     },
                     type : "POST",
                     data : content,
                     contentType : "text/plain"
                    // dataType : "application/rdf+xml"
               });

        }); // end of test for /contenthub/contenthub/store/metadata/<contentId>

// ### test for the /contenthub endpoint, checking the ldpath functionality and
// options in working with
// own indices on the contenthub
// @author mere01
test("VIE.js StanbolConnector - CRD on contenthub indices", function() {

    if (navigator.userAgent === 'Zombie') {
        return;
    }

        // we first want to create ourselves a new index, using an ldpath
        // program
        var ldpath = "name=melaniesIndex&program=@prefix rdf : <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs : <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont : <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string; dbpediatype = rdf:type :: xsd:anyURI; population = db-ont:populationTotal :: xsd:int;";
        var name = "melaniesIndex";
        var prog = "@prefix rdf : <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs : <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont : <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string; dbpediatype = rdf:type :: xsd:anyURI; population = db-ont:populationTotal :: xsd:int;";
        var index = 'melaniesIndex';

        var z = new VIE();
        ok(z.StanbolService);
        equal(typeof z.StanbolService, "function");
        var stanbol = new z.StanbolService( {
            url : stanbolRootUrl
        });
        z.use(stanbol);

        // create a new, empty index
        stop();
        stanbol.connector
        .createIndex(
        {
         name : name,
         program : prog
     },
     function(success) {
         ok(true, "01. created new index on contenthub.");
         console.log("01. created new index on contenthub.");
         console.log(success);
         start();

                            // we can now store new items unto our own index
                            var item = "We are talking about huge cities such as Paris or New York, where life is an expensive experience.";
                            var id = 'myOwnIdToUseHere';

                            stop();
                            stanbol.connector
                           .uploadContent(item, function(success) {
                              ok(true, "02. stored item to " + index);
                              start();

                                            // we can then get back this
                                            // newly created item by its
                                            // id:
                                            var idToRetrieve = "urn:content-item-"
                                           + id;
                                           
                                           stop();
                                            // ... we can either retrieve
                                            // its text content
                                            stanbol.connector
                                           .getTextContentByID(
                                             idToRetrieve,
                                             function(success) {
                                                ok(true,
                                                  "03. retrieved item's raw text content.");
                                                console
                                                .log("03. retrieved content item: "
                                                    + success);
                                                start();
                                            },
                                            function(err) {
                                                ok(false,
                                                  "03. could not retrieve item's raw text content.");
                                                console
                                                .log(err);
                                                start();
                                            }, {
                                                index : index
                                            });
stop();
                                            // ... or its enhancements
                                            stanbol.connector
                                           .getMetadataByID(
                                             idToRetrieve,
                                             function(success) {
                                                ok(true,
                                                  "04. retrieved content item's metadata.");
                                                console
                                                .log("04. retrieved content item's metadata: "
                                                    + success);
                                                start();
                                            },
                                            function(err) {
                                                ok(false,
                                                  "04. could not retrieve content item's metadata.");
                                                console
                                                .log(err);
                                                start();
                                            }, {
                                                index : index
                                            });

}, function(err) {
 ok(false, "02. couldn't store item to "
   + id);
 console.log(err);
 start();
}, {
 index : index,
 id : id
});

                            // we can also view the list of indices that are
                            // currently being managed by the contenthub
                            var z = new VIE();
                            ok(z.StanbolService);
                            equal(typeof z.StanbolService, "function");
                            var stanbol = new z.StanbolService( {
                                url : stanbolRootUrl
                            });
                            z.use(stanbol);
                            stop();
                            stanbol.connector
                           .contenthubIndices(
                             function(indices) {
                                ok(_.isArray(indices),
                                  "05. returned an array of indices");
                                ok(indices.length > 0,
                                  "05. returned at least one index");

                                ok(true,
                                  "05. indices currently managed by the contenthub: \n"
                                  + indices);

                                console
                                .log("05. the following indices are currently managed by the contenthub:");
                                console.log(indices);
                                start();
                            },
                            function(err) {
                                ok(false,
                                  "05. No contenthub indices have been returned!");
                                start();
                            });

                            // finally, delete the test index
                            stop();
                            stanbol.connector
                           .deleteIndex(
                             index,
                             function(success) {
                                ok(
                                  true,
                                  "06. Index "
                                  + index
                                  + " was deleted from contenthub.");
                                start();
                            },
                            function(err) {
                                ok(
                                  false,
                                  "06. Index "
                                  + index
                                  + " could not be deleted from contenthub");
                                start();
                            });

                       }, function(err) {
                         ok(false, "01. could not create index '" + index
                           + "' on contenthub.");
                         console.log(err);
                         console.log("01. could not create index '" + index
                           + "' on contenthub.");
                         start();
                     });

    }); // end of test "CRD on contenthub indices"
