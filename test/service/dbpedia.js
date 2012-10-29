module("vie.js - DBPedia Service");

test("VIE.js DBPedia connection", function() {
    var z = new VIE();
    ok(z.DBPediaService, "Checking if the DBPedia Service exists.'");
    z.use(new z.DBPediaService);
    ok(z.service('dbpedia'));
});

test("VIE.js DBPediaService - Load", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    var entity = "<http://dbpedia.org/resource/Barack_Obama>";
    var z = new VIE();
    ok (z.DBPediaService);
    equal(typeof z.DBPediaService, "function");
    z.use(new z.DBPediaService());
    stop();
    z
    .load({entity: entity})
    .using('dbpedia')
    .execute()
    .done(function(x) {
        ok(x, "Something returned");
        ok(x.isCollection);
        ok(x.at(0).isEntity);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});



test("VIE.js DBPediaService - Load multiple entities", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    var entity1 = "<http://dbpedia.org/resource/Barack_Obama>";
    var entity2 = "<http://dbpedia.org/resource/London>";
    var z = new VIE();
    ok (z.DBPediaService);
    equal(typeof z.DBPediaService, "function");
    z.use(new z.DBPediaService());
    stop();
    z
    .load({entity: [entity1, entity2]})
    .using('dbpedia')
    .execute()
    .done(function(x) {
        ok(x, "Something returned");
        ok(x.isCollection);
        ok(x.at(0).isEntity);
        ok(x.at(1).isEntity);
        equal(x.at(0).id, entity1);
        equal(x.at(1).id, entity2);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});

