
test(
  "VIE.js StanbolService - Analyze",
  function() {
   if (navigator.userAgent === 'Zombie') {
    return;
  }
        // Sending a an example with double quotation marks.
        var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
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

          ok(entities);
          ok(entities instanceof Array);
          ok(entities.length > 0, "At least one entity returned");
          if (entities.length > 0) {
            var allEntities = true;
              for ( var i = 0; i < entities.length; i++) {
                var entity = entities[i];
                if (!(entity instanceof Backbone.Model)) {
                 allEntities = false;
                 ok(false, "VIE.js StanbolService - Analyze: Entity is not a Backbone model!");
              }
         }
        ok(allEntities);
        var firstTextAnnotation = _(entities).filter(
          function(e) {
            return e.isof("enhancer:TextAnnotation") && e.get("enhancer:selected-text");
          })[0];
         var s = firstTextAnnotation.get("enhancer:selected-text").toString();
         ok(s.substring(s.length - 4, s.length - 2) != "\"@", "Selected text should be converted into a normal string.");
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
            var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
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
                  "VIE.js StanbolService - Analyze: Entity is not a Backbone model!");
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
            var elem = $('<p>This is a small test, where Barack Obama sings the song \"We want to live forever!\" song.</p>');
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
            var elem = $('<p>This is a small test, where Steve Jobs sings the song \"We want to live forever!\" song.</p>');
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
       });