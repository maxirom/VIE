

test("VIE.js StanbolConnector - Get all referenced sites", function() {
    if (navigator.userAgent === 'Zombie') {
        return;
    }
    // Sending a an example with double quotation marks.
  var z = new VIE();
  ok(z.StanbolService);
  equal(typeof z.StanbolService, "function");
  var stanbol = new z.StanbolService( {
     url : stanbolRootUrl
 });
  z.use(stanbol);
  stop();
  stanbol.connector.referenced(function(sites) {
     ok(_.isArray(sites));
     ok(sites.length > 0);
     start();
 }, function(err) {
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
        url : stanbolRootUrl
    }));
    stop();

    z
    .find( {
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
                "VIE.js StanbolService - Find: Entity is not a Backbone model!");
              console
              .error(
                  "VIE.js StanbolService - Find: ",
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

  stop();
            // search only in local entities
            z
           .find( {
              term : "P*",
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
                        "VIE.js StanbolService - Find: Entity is not a Backbone model!");
                      console
                      .error(
                          "VIE.js StanbolService - Find: ",
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
                                "VIE.js StanbolService - Find: Entity is not a Backbone model!");
                              console
                              .error(
                                  "VIE.js StanbolService - Find: ",
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

                        ok(false, "this should fail, as there is no term given!");
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
        url : stanbolRootUrl
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
                "VIE.js StanbolService - Load: Entity is not a Backbone model!");
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



/*
 * //### test for the /entityhub/sites/query //@author mere01 //tests json field
 * queries with constraints on value, text and range test( "VIE.js
 * StanbolService - FieldQuery.json", function() { // ask for the first three
 * entities with an altitude of 34 meters var queryVC = '{ "selected":
 * ["http:\/\/www.w3.org\/2000\/01\/rdf-schema#label"], "offset": "0", "limit":
 * "3", "constraints": [{ "type": "value", "value": "34", "field":
 * "http:\/\/www.w3.org\/2003\/01\/geo\/wgs84_pos#alt", "datatype": "xsd:int" }]
 * }'; // ask for the first three entities with a German rdfs:label // starting
 * with "Frankf" var queryTC = '{ "selected":
 * ["http:\/\/www.w3.org\/2000\/01\/rdf-schema#label"], "offset": "0", "limit":
 * "3", "constraints": [{"type": "text", "xml:lang": "de", "patternType":
 * "wildcard", "field": "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label",
 * "text": "Frankf*" }] }'; // ask for the first three cities that are > 1K
 * meters above sear // level AND have > 1 mio inhabitants var queryRC = '{
 * "selected": ["http:\/\/www.w3.org\/2000\/01\/rdf-schema#label",
 * "http:\/\/dbpedia.org\/ontology\/populationTotal",
 * "http:\/\/www.w3.org\/2003\/01\/geo\/wgs84_pos#alt"], "offset": "0", "limit":
 * "3", "constraints": [{ "type": "range", "field":
 * "http:\/\/dbpedia.org\/ontology\/populationTotal", "lowerBound": 1000000,
 * "inclusive": true, "datatype": "xsd:long" },{ "type": "range", "field":
 * "http:\/\/www.w3.org\/2003\/01\/geo\/wgs84_pos#alt", "lowerBound": 1000,
 * "inclusive": true, },{ "type": "reference", "field":
 * "http:\/\/www.w3.org\/1999\/02\/22-rdf-syntax-ns#type", "value":
 * "http:\/\/dbpedia.org\/ontology\/City", }] }';
 * 
 * var z = new VIE(); ok(z.StanbolService, "Stanbol Service exists.");
 * equal(typeof z.StanbolService, "function");
 * 
 * var stanbol = new z.StanbolService( { url : stanbolRootUrl }); //
 * console.log(stanbol.options); z.use(stanbol); // hold it until we get results
 * form our test query // stop(); // // expecting as results "Baghdad", "Berlin"
 * among others // stanbol.connector // .queryEntities( // queryVC, //
 * function(response) { // ok(true, // "entityhub/query returned a response.
 * (see log)"); // console // .log("value test of entityhub/query returned:"); // //
 * response is an Object with 2 fields: query and results. // // results is an
 * Array containing the 3 resulting Objects // console.log(response.results); //
 * start(); // }, // function(err) { // ok(false, // "value test of
 * entityhub/query endpoint returned no response!"); // console.log(err) //
 * start(); // });
 * 
 * stop(); // expecting as results "Frankfurt am Main", "Eintracht Frankfurt",
 * among others stanbol.connector .queryEntities( queryTC, function(response) {
 * ok(true, "entityhub/query returned a response. (see log)"); console
 * .log("text test of entityhub/query returned:");
 * console.log(response.results); start(); }, function(err) { ok(false, "text
 * test of entityhub/query endpoint returned no response!"); start(); }); // //
 * stop(); // // expecting as results "Mexico City", "Bogotá" and "Quito" //
 * stanbol.connector // .queryEntities( // queryRC, // function(response) { //
 * ok(true, // "entityhub/query returned a response. (see log)"); // console //
 * .log("range test of entityhub/query returned:"); //
 * console.log(response.results); // start(); // }, // function(err) { //
 * ok(false, // "range test of entityhub/query endpoint returned no response!"); //
 * start(); // });
 * 
 * }); // end of test for entityhub/sites/query
 * 
 * //### test for the /entityhub/site/<siteID> //@author mere01 //tests the
 * single site service of the entityhub's Referenced Site Manager //since per
 * default, only dbpedia is referenced, this tests for dbpedia only
 * //test("VIE.js StanbolService - QueryDBpedia", function() { // // // ask for
 * the first three entities with a German rdfs:label, starting with "Frankf" //
 * var query = '{ "selected":
 * ["http:\/\/www.w3.org\/2000\/01\/rdf-schema#label"], "offset": "0", "limit":
 * "3", "constraints": [{"type": "text", "xml:lang": "de", "patternType":
 * "wildcard", "field": "http:\/\/www.w3.org\/2000\/01\/rdf-schema#label",
 * "text": "Frankf*" }] }'; // // var z = new VIE(); // ok(z.StanbolService,
 * "Stanbol Service exists."); // equal(typeof z.StanbolService, "function"); // //
 * var stanbol = new z.StanbolService( { // url : stanbolRootUrl // }); //
 * z.use(stanbol); // // // hold it until we get results form our test query //
 * stop(); // // expecting as result entity "Paris" (France) of dbpedia //
 * stanbol.connector // .queryDBpedia( // query, // function(response) { //
 * ok(true, // "entityhub/dbpedia returned a response. (see log)"); // console //
 * .log("entity returned from entityhub/dbpedia is:"); // //
 * console.log(response.results); // start(); // }, // function(err) { //
 * ok(false, // "entityhub/dbpedia endpoint returned no response!"); // start(); //
 * }); // // }); // end of test for entityhub/site/<siteID>
*/


/*
 * test("VIE.js StanbolService - EntityHub: Lookup", function () { if
 * (navigator.userAgent === 'Zombie') { return; }
 * 
 * var entity = 'http://dbpedia.org/resource/Paris';
 * 
 * var z = new VIE(); z.namespaces.add("cc", "http://creativecommons.org/ns#");
 * ok (z.StanbolService); equal(typeof z.StanbolService, "function"); var
 * stanbol = new z.StanbolService({url : stanbolRootUrl}); z.use(stanbol);
 * 
 * stop(); stanbol.connector.lookup(entity, function (response) { var entities =
 * VIE.Util.rdf2Entities(stanbol, response); ok(entities.length > 0, "With
 * 'create'"); start(); }, function (err) { ok(false, err); start(); }, { create :
 * true });
 * 
 * stop(); stanbol.connector.lookup(entity, function (response) { var entities =
 * VIE.Util.rdf2Entities(stanbol, response); ok(entities.length > 0, "Without
 * 'create'"); start(); }, function (err) { ok(false, err); start(); }); });
*/
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
        url : stanbolRootUrl
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
        url : stanbolRootUrl
    });
    z.use(stanbol);

            // create a new entity
            var id = 'http://developer.yahoo.com/javascript/howto-proxy.html';
            var ent = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';
            // var entity = z.entities.addOrUpdate({entity: ent, update: true,
            // local: true});
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
z
.save(entity)
                    // option to allow repeated testing with same entity
                    .using("stanbol")
                    .execute()
                    .done(
                     function(response) {

                        ok(
                          true,
                          "E1: new entity "
                          + id
                          + " created in entityhub/entity/ (using option update)");
                                // if an Entities already exists within the
                                // Entityhub, the request should fail with BAD
                                // REQUEST
                                start();
                                stop();
                                z
                              .save(entity2)
                                        // do NOT allow updating of already
                                        // existing entities (no options)
                                        .using("stanbol")
                                        .execute()
                                        .done(
                                            function(response) {
                                               ok(
                                                 false,
                                                 "E2: entityhub/entity: created already existing entity "
                                                 + id
                                                 + ". (using no option)");
                                               console.log(response);
                                               start();
                                           })
                                        .fail(
                                            function(err) {
                                               ok(
                                                 true,
                                                 "E2: already-existing entity could not be created in the entityhub! (using no option) Received error message: "
                                                 + err);
                                               start();
                                           });
//                              start();
})
.fail(
 function(err) {
    ok(false,
      "E1: entity could not be created in the entityhub! (using option update)");
    start();
});

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
  console.log("E3 got response:");
  console.log(response);
  start();
}).fail(
function(err) {
  ok(true,
    "E3: entity creation failed due to erroneous syntax. Received error message: "
    + err);
  console.log("E3:");
  console.log(err);
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
        url : stanbolRootUrl
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
                  true,
                  "E1: new entity "
                  + id
                  + " created in entityhub/entity/ (using option update)");
                start();
                                // if an Entities already exists within the
                                // Entityhub, the request should fail with BAD
                                // REQUEST
                                stop();
                                stanbol.connector
                              .createEntity(
                                entity,
                                function(response) {
                                   ok(
                                     false,
                                     "E2: entityhub/entity: created already existing entity "
                                     + id
                                     + ". (using no option)");
                                   console.log(response);
                                   start();
                               },
                               function(err) {
                                   ok(
                                     true,
                                     "E2: already-existing entity could not be created in the entityhub! (using no option) Received error message: "
                                     + err);
                                   start();
                                                }); // do NOT allow updating of
                                // already existing entities

                                // retrieve the entity that's just been created
                                stop();
                                stanbol.connector
                              .readEntity(
                                id,
                                function(response) {
                                   var first = null;
                                   for ( var key in response)
                                                    // grab just the first key
                                                    // of the returned object
                                                    {
                                                        console.log(key);
                                                        first = response[key];
                                                        if (typeof (first) !== 'function') {
                                                            console.log(key);
                                                            first = key;
                                                            break;
                                                        }
                                                    }
                                                    ok(true,
                                                     "E3: got entity from entityhub/entity: "
                                                     + first);
                                                    console
                                                 .log("E3: got entity:");
                                                 console.log(first);
                                                 start();
                                             },
                                             function(err) {
                                               ok(false,
                                                 "E3: could not get entity from the entityhub!");
                                               console.log(err);
                                               start();
                                           }, {
                                               local : 'true'
                                                }); // to denote that this is a
                                // local entity

                                // update the entity that's just been created
                                // (modify the label)
                                stop();
                                console
                              .log("sending id to updateEntity: "
                                + id);
                              stanbol.connector
                              .updateEntity(
                                modifEntity,
                                function(response) {
                                   ok(response);
                                   if (response && response.id)
                                      ok(
                                        true,
                                        "E4: entity  "
                                        + response.id
                                        + " was updated successfully in the entityhub.");
                                  start();
                              },
                              function(err) {
                               ok(
                                 false,
                                 "E4: could not update entity "
                                 + id
                                 + " in the entityhub! Received error message: "
                                 + err);
                               console
                               .log("E4: could not update entity "
                                   + id);
                               console.log(err);
                               start();
                           }, {}, id);

                                // delete our entity
                                stop();
                                stanbol.connector
                              .deleteEntity(
                                id,
                                function(response) {
                                   ok(response);
                                   if (response && response.id)
                                      ok(
                                        true,
                                        "E6: entity  "
                                        + response.id
                                        + " was deleted successfully from the entityhub.");
                                  start();
                              },
                              function(err) {
                               ok(
                                 false,
                                 "E6: could not delete entity "
                                 + id
                                 + " from the entityhub! Received error message: "
                                 + err);
                               console
                               .log("E6: could not delete entity "
                                   + id);
                               console.log(err);
                               start();
                           });

                                // the deleted entity cannot be retrieved
                                // anymore
                                stop();
                                stanbol.connector
                              .readEntity(
                                id,
                                function(response) {
                                   console
                                   .log("E7: got entity:");
                                   var first = null;
                                   for ( var key in response)
                                                    // grab just the first key
                                                    // of the returned object
                                                    {
                                                        first = response[key]
                                                        if (typeof (first) !== 'function') {
                                                            console.log(key);
                                                            first = key;
                                                            break;
                                                        }
                                                    }
                                                    ok(false,
                                                     "E7: got non-existing entity from entityhub/entity: "
                                                     + first);
                                                    start();
                                                },
                                                function(err) {
                                                    ok(true,
                                                     "E7: could not get non-existing entity from the entityhub!");
                                                    console.log("E7:");
                                                    console.log(err);
                                                    start();
                                                });
},
function(err) {
    ok(false,
      "E1: entity could not be created in the entityhub! (using option update)");
    start();
}, {
                                update : 'true' // option to allow repeated
                        // testing with same entity
                  });

            // we should be unable to update a non-existing entity
            var modifId = 'http://developer.yahoo.com/javascript/howto-proxy-falseaddress.html';
            stop();
            console.log("sending id to updateEntity: " + modifId);
            stanbol.connector.updateEntity(modifEntity, function(response) {
                console.log("response?")
                console.log(response);
               ok(false, "E5: non-existing entity  " + modifId
                 + " was updated successfully in the entityhub.");
               start();
           }, function(err) {
               ok(true, "E5: could not update non-existing entity "
                 + modifId
                 + " in the entityhub! Received error message: "
                 + err);
               console.log("E5: could not update non-existing entity "
                 + modifId);
               console.log(err);
               start();
           }, {}, modifId);

            // create should fail due to invalid syntax (forgot quotation marks
            // for xmlns:rdf entry)
var entity = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf=http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:rdfs="http://www.w3.org/2000/01/rdf-schema#"><rdf:Description rdf:about="http://developer.yahoo.com/javascript/howto-proxy.html"><rdfs:label>Howto-Proxy</rdfs:label></rdf:Description></rdf:RDF>';
stop();
stanbol.connector.createEntity(entity, function(response) {
    ok(false,
      "E8: created entity on entityhub in spite of faulty syntax. "
      + response)
    console.log("E8 got response:");
    console.log(response);
    start();
}, function(err) {
    ok(true,
      "E8: entity creation failed due to erroneous syntax. Received error message: "
      + err);
    console.log("E8:");
    console.log(err);
    start();
});

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
  var entity = "http://dbpedia.org/resource/Paris";
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
            url : stanbolRootUrl
        });
        z.use(stanbol);

        // first make sure that we have the dbpedia 'Paris' entity referenced on
        // our local entityhub
        var there = false;
        var del = true;
        stop();
        stanbol.connector
        .lookup(
          entity,
          function(succ) {
                            // so the entity is already referenced locally
                            there = true;
                            console.log("set 'there' to " + there)
                            // this means we must NOT delete it after tests are
                            // done
                            del = false;
                            console.log("set 'del' to " + del)
                            console.log("looked up entity " + entity);
                            console.log(succ);
                            console.log("picking from lookup:");
                            var counter = 0;
                            // get the symbol for this entity
                            for ( var key in succ) {
                                counter += 1;
                                console.log(key);
                                console.log(succ[key]);
                                // pick the urn, but not the .meta info
                                var suffix = ".meta";
                                if (key.indexOf(suffix, key.length
                                  - suffix.length) === -1) {
                                    symbol = key;
                            }
                                // function endsWith(str, suffix) {
                                // return str.indexOf(suffix, str.length -
                                // suffix.length) !== -1;
                                // }
                            }

                            start();

                            /** * */
                            console
                           .log("testing 'there' in order to do the rest")
                           if (there) {
                            console
                            .log("in if test of 'there' for the rest")
                            stop();
                                // execute the following tests only if we have
                                // an entity Paris on
                                // the local entityhub
                                console.log("starting to do the rest")
                                console.log("do request for mapping of "
                                  + entity)
                                stanbol.connector
                              .getMapping(
                                entity,
                                function(success) {
                                   ok(true,
                                     "retrieved Mapping for entity "
                                     + entity);
                                   console
                                   .log("retrieved Mapping for entity "
                                       + entity);
                                   console.log(success);
                                   start();

                               },
                               function(err) {
                                   ok(false,
                                     "couldn't retrieve mapping for entity"
                                     + entity);
                                   console
                                   .log("couldn't retrieve mapping for entity"
                                       + entity);
                                   console.log(err);
                                   start();
                               }, {
                                   entity : true
                               });

stop();
console.log("do request for symbol " + symbol);
stanbol.connector
.getMapping(symbol, function(success) {
 ok(true,
   "retrieved mapping for symbol "
   + symbol);
 console.log(success);
                                            // retrieve the mapping's id
                                                // from the symbol's mapping
                                                mapping = success['results'][0]['id'];
                                                start();

                                                stop();
                                                console
                                              .log("do request for mapping "
                                                + mapping)
                                              stanbol.connector
                                              .getMapping(
                                                mapping,
                                                function(
                                                  success) {
                                                   ok(true,
                                                     "retrieved mapping by ID.");
                                                   console
                                                   .log(success);
                                                   start();

                                               },
                                               function(err) {
                                                   ok(false,
                                                     "couldn't retrieve mapping by ID");
                                                   console
                                                   .log(err);
                                                   start();
                                               }, {});

}, function(err) {
    ok(false,
      "couldn't retrieve mapping for symbol "
      + symbol);
    console.log(err);
    start();
}, {
    symbol : true
});

if (del) {
   console.log("in case 'del'")
   stop();
   stanbol.connector
   .deleteEntity(
       symbol,
       function(success) {
          console
          .log("deleted entity "
              + entity
              + " from the local entityhub")
          ok(
            true,
            "deleted entity "
            + entity
            + " from the local entityhub");
          start();
      },
      function(err) {
          console
          .log("could not delete entity "
              + entity
              + " from the local entityhub")
          ok(
            false,
            "could not delete entity "
            + entity
            + " from the local entityhub");
          start();
      }, {});
}

}
/** * */

},
function(err) {
 ok(
   true,
   "Could not look up entity "
   + entity
   + ". This entity apparently is not stored on the local entityhub. I will temporarily create this entity until tests are completed.");
 console.log("Could not look up entity " + entity)
 start();

                            // if the entity is not already there -> create it
                            // temporarily
                            if (!there) {
                                console.log("in case '!there'")
                                stop();
                                stanbol.connector
                              .lookup(
                                entity,
                                function(succ) {
                                                    // so the entity got
                                                    // referenced locally
                                                    there = true;
                                                    ok(true,
                                                     "newly referenced entity "
                                                     + entity);
                                                    console
                                                 .log("newly referenced entity "
                                                   + entity)
                                                 console
                                                 .log("set 'there' to "
                                                   + there)
                                                 console
                                                 .log("picking from lookup:");
                                                 var counter = 0;
                                                    // get the symbol for this
                                                    // entity
                                                    for ( var key in succ) {
                                                        counter += 1;
                                                        console.log(key);
                                                        console.log(succ[key]);
                                                        // pick the urn, but not
                                                        // the .meta info
                                                        var suffix = ".meta";
                                                        if (key
                                                            .indexOf(
                                                              suffix,
                                                              key.length
                                                              - suffix.length) === -1) {
                                                            symbol = key;
                                                  }
                                              }

                                              start();

                                              /** * */
                                              console
                                              .log("testing 'there' in order to do the rest")
                                              if (there) {
                                                  console
                                                  .log("in if test of 'there' for the rest")
                                                  stop();
                                                        // execute the following
                                                        // tests only if we have
                                                        // an entity Paris on
                                                        // the local entityhub
                                                        console
                                                        .log("starting to do the rest")
                                                        console
                                                        .log("do request for mapping of "
                                                          + entity)
                                                        stanbol.connector
                                                        .getMapping(
                                                          entity,
                                                          function(
                                                            success) {
                                                             ok(
                                                               true,
                                                               "retrieved Mapping for entity "
                                                               + entity);
                                                             console
                                                             .log("retrieved Mapping for entity "
                                                                 + entity);
                                                             console
                                                             .log(success);
                                                             start();

                                                         },
                                                         function(
                                                            err) {
                                                             ok(
                                                               false,
                                                               "couldn't retrieve mapping for entity"
                                                               + entity);
                                                             console
                                                             .log("couldn't retrieve mapping for entity"
                                                                 + entity);
                                                             console
                                                             .log(err);
                                                             start();
                                                         },
                                                         {
                                                             entity : true
                                                         });

stop();
console
.log("do request for symbol "
  + symbol);
stanbol.connector
.getMapping(
  symbol,
  function(
    success) {
     ok(
       true,
       "retrieved mapping for symbol "
       + symbol);
     console
     .log("retrieved symbol:")
     console
     .log(success);
                                                                            // retrieve
                                                                            // the
                                                                            // mapping's
                                                                            // id
                                                                            // from
                                                                            // the
                                                                            // symbol's
                                                                            // mapping
                                                                            mapping = success['results'][0]['id'];
                                                                            start();

                                                                            stop();
                                                                            console
                                                                           .log("do request for mapping "
                                                                             + mapping)
                                                                           stanbol.connector
                                                                           .getMapping(
                                                                             mapping,
                                                                             function(
                                                                               success) {
                                                                                ok(
                                                                                  true,
                                                                                  "retrieved mapping by ID.");
                                                                                console
                                                                                .log(success);
                                                                                start();

                                                                            },
                                                                            function(
                                                                               err) {
                                                                                ok(
                                                                                  false,
                                                                                  "couldn't retrieve mapping by ID");
                                                                                console
                                                                                .log(err);
                                                                                start();
                                                                            },
                                                                            {});

},
function(
    err) {
 ok(
   false,
   "couldn't retrieve mapping for symbol "
   + symbol);
 console
 .log(err);
 start();
},
{
 symbol : true
});

if (del) {
 console
 .log("in case 'del'")
 stop();
 stanbol.connector
 .deleteEntity(
     symbol,
     function(
       success) {
        console
        .log("deleted entity "
            + entity
            + " from the local entityhub")
        ok(
          true,
          "deleted entity "
          + entity
          + " from the local entityhub");
        start();
    },
    function(
       err) {
        console
        .log("could not delete entity "
            + entity
            + " from the local entityhub")
        ok(
          false,
          "could not delete entity "
          + entity
          + " from the local entityhub");
        start();
    },
    {});
}

}
/** * */

},
function(err) {
   ok(false,
     "failed to reference entity "
     + entity);
   console
   .log("failed to reference entity "
       + entity);

   start();

}, {
   'create' : true
});
}

},

{
 'create' : false
                        // do NOT create new references/mappings
                  });
});

test(
  "VIE.js StanbolService - Query (non-local)",
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
    url : stanbolRootUrl
}));
stop();
            // query all referenced sites (entityhub/sites/query)
            z
           .query( {
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
               console.log("all referenced sites:")
               console.log(entities)
               start();
           })
                    // TODO: at this place, some strange parse exception is
                    // thrown in spite of
                    // valid query and valid URI.
                    // cf e.g.
                    // curl -X POST -H "Content-Type:application/json" --data
                    // "@fieldQuery2.json"
                    // http://lnv-89012.dfki.uni-sb.de:9001/entityhub/sites/query
                    // to
                    // curl
                    // "http://lnv-89012.dfki.uni-sb.de:9001/entityhub/sites/entity?id=http://dbpedia.org/resource/Frankfurt
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
                console.log("dbpedia:")
                console.log(entities)
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
    z.use(new z.StanbolService( {
        url : stanbolRootUrl
    }));
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
          "This should not return successfully if query was wrong!");
        start();
    })
    .fail(
     function(msg) {
        ok(true,
          "Query failed because of wrong query syntax (empty query object)");
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
           "text" : "Frankf*"
       } ]
   };

   var z = new VIE();
   ok(z.StanbolService);
   equal(typeof z.StanbolService, "function");
   var stanbol = new z.StanbolService( {
    url : stanbolRootUrl
});
   z.use(stanbol);

   z.query( {
    query : query,
    local : true
}).using(stanbol).execute().done(

function(entities) {
    ok(true, "Retrieved entities according to query Frankf*");
    ok(entities);
    if (!entities.length > 0) {
       ok(false, "no entitites found.");
   } else {
       ok(true, "at least one entity was found.");
   }
   ok(entities instanceof Array);
   console.log("returned entities:")
   console.log(entities)
   start();
}).fail(function(f) {
    ok(false, f.statusText);
    start();
});

/**/
});
