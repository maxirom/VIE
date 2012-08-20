module("vie.js - LocalStorage Service");

test("VIE.js LocalStorage - Registration", function() {
    var v = new VIE();
    ok(v.LocalStorageService, "Checking if the LocalStorage Service exists.'");
    v.use(new v.LocalStorageService);
    ok(v.service('localStorage'));
});

test("VIE.js LocalStorageService - API", function() {
    var v = new VIE();
    v.use(new v.LocalStorageService);    
    //API
    ok(v.service('localStorage').load);
    equal(typeof v.service('localStorage').load, "function");
	ok(v.service('localStorage').save);
    equal(typeof v.service('localStorage').save, "function");
	ok(v.service('localStorage').clear);
    equal(typeof v.service('localStorage').clear, "function");
	ok(v.service('localStorage').remove);
    equal(typeof v.service('localStorage').remove, "function");
});

test("VIE.js LocalStorageConnector - API", function() {
	var v = new VIE();
    var localStorage = new v.LocalStorageService();
    v.use(localStorage);
    //API
    ok(v.service('localStorage').connector.load);
    equal(typeof v.service('localStorage').connector.load, "function");
	ok(v.service('localStorage').connector.save);
    equal(typeof v.service('localStorage').connector.save, "function");
	ok(v.service('localStorage').connector.clear);
    equal(typeof v.service('localStorage').connector.clear, "function");
	ok(v.service('localStorage').connector.remove);
    equal(typeof v.service('localStorage').connector.remove, "function");
});

test("VIE.js LocalStorage - entity: Save and Load", function() {
    var v = new VIE();
    v.use(new v.LocalStorageService({keyName: 'VIE-TestCase'}));
    ok(v.service('localStorage'));
	var entity = new v.Entity({'@subject':'<TestEntity1>'});
	var s = new v.Savable({entity:entity});
	v.service('localStorage').save(s);
	var l = new v.Loadable({entity: '<TestEntity1>'});
	var loaded = v.service('localStorage').load(l);
	equal(loaded.length, 1);
	ok(loaded[0].isEntity);
	equal(entity.getSubject(),loaded[0].getSubject());
	v.service('localStorage').clear();
});

test("VIE.js LocalStorage - multiple entities: Save, Load", function() {
    var v = new VIE();
    v.use(new v.LocalStorageService({keyName: 'VIE-TestCase'}));
    ok(v.service('localStorage'));
	var entity1 = new v.Entity({'@subject':'<TestEntity1>'});
	var entity2 = new v.Entity({'@subject':'<TestEntity2>'});
	var s = new v.Savable({entities:[entity1,entity2]});
	v.service('localStorage').save(s);
	var l = new v.Loadable({entities: ['<TestEntity1>','<TestEntity2>']});
	var loaded = v.service('localStorage').load(l);
	equal(loaded.length, 2);
	ok(loaded[0].isEntity);
	ok(loaded[1].isEntity);
	equal(entity1.getSubject(),loaded[0].getSubject());
	equal(entity2.getSubject(),loaded[1].getSubject());
	v.service('localStorage').clear();
});

test("VIE.js LocalStorage - Save, Load, Remove", function() {
    var v = new VIE();
    v.use(new v.LocalStorageService({keyName: 'VIE-TestCase'}));
    ok(v.service('localStorage'));
	var entity1 = new v.Entity({'@subject':'<TestEntity1>'});
	var entity2 = new v.Entity({'@subject':'<TestEntity2>'});
	var s = new v.Savable({entities:[entity1,entity2]});
	v.service('localStorage').save(s);
	var r = new v.Removable({entity: '<TestEntity1>'});
	v.service('localStorage').remove(r);
	var l = new v.Loadable({entities: ['<TestEntity1>','<TestEntity2>']});
	var loaded = v.service('localStorage').load(l);
	equal(loaded.length, 1);
	ok(loaded[0].isEntity);
	equal(entity2.getSubject(),loaded[0].getSubject());
	v.service('localStorage').clear();
});
