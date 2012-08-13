module("vie.js - SameAs Service");

test("VIE.js SameAs connection", function() {
    var v = new VIE();
    ok(v.SameAsService, "Checking if the SameAs Service exists.'");
    v.use(new v.SameAsService);
    ok(v.service('sameas'));
});

test("VIE.js SameAsService - Load", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    var entity = "<http://dbpedia.org/resource/Barack_Obama>";
    var z = new VIE();
    ok (z.SameAsService);
    equal(typeof z.SameAsService, "function");
    z.use(new z.SameAsService());
    stop();
    z
    .load({entity: entity})
    .using('sameas')
    .execute()
    .done(function(x) {
        ok(x, "Something returned");
        ok(x.isCollection);
        equal(x.size(), 1);
        equal(x.at(0).id, entity);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});


test("VIE.js SameAsService - Load Multiple Entities", function () {
    if (navigator.userAgent === 'Zombie') {
       return;
    } 
    var entity1 = "<http://dbpedia.org/resource/Barack_Obama>";
    var entity2 = "<http://dbpedia.org/resource/London>";
    var z = new VIE();
    ok (z.SameAsService);
    equal(typeof z.SameAsService, "function");
    z.use(new z.SameAsService());
    stop();
    z
    .load({entity: [entity1, entity2]})
    .using('sameas')
    .execute()
    .done(function(x) {
        ok(x, "In the current implementation, this is called twice!");
        ok(x.isCollection);
        equal(x.size(), 1);
        ok (x.at(0).id === entity1 || x.at(0).id === entity2);
        start();
    })
    .fail(function(f){
        ok(false, f.statusText);
        start();
    });
});

