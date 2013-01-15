module("vie.js - BrowserStorage Service");
var myVIE = new VIE();
test("VIE.js BrowserStorage - Registration", function() {
    var v = new VIE();
    ok(v.BrowserStorageService, "Checking if the BrowserStorage Service exists.'");
    v.use(new v.BrowserStorageService);
    ok(v.service('browserStorage'));
});

test("VIE.js BrowserStorageService - API", function() {
    var v = new VIE();
    v.use(new v.BrowserStorageService);    
    //API
    ok(v.service('browserStorage').load);
    equal(typeof v.service('browserStorage').load, "function");
	ok(v.service('browserStorage').save);
    equal(typeof v.service('browserStorage').save, "function");
	ok(v.service('browserStorage').removeFile);
    equal(typeof v.service('browserStorage').removeFile, "function");
});

test("VIE.js BrowserStorageConnector - API", function() {
	var v = new VIE();
    var browserStorage = new v.BrowserStorageService();
    v.use(browserStorage);
    //API
    ok(v.service('browserStorage').load);
    equal(typeof v.service('browserStorage').load, "function");
	ok(v.service('browserStorage').save);
    equal(typeof v.service('browserStorage').save, "function");
	ok(v.service('browserStorage').removeFile);
    equal(typeof v.service('browserStorage').removeFile, "function");
});

test("VIE.js BrowserStorage - entity: Save and Load", function() {
    var v = new VIE();
    v.use(new v.BrowserStorageService({fileName: 'VIE-TestCase'}));
    ok(v.service('browserStorage'));
	var entity = new v.Entity({'@subject':'<TestEntity1>'});
	var s = new v.Savable({entity:entity});
	var saveSuccess = function(){
		var l = new v.Loadable({entity: '<TestEntity1>'});
		var loadSuccess = function(entities){
			start();
			equal(entities.length, 1);
			ok(entities[0].isEntity);
			equal(entity.getSubject(),entities[0].getSubject());
			v.service('browserStorage').removeFile();
		}	
		v.service('browserStorage').load(l,loadSuccess);
	};
	v.service('browserStorage').save(s,saveSuccess);
	stop();
});

test("VIE.js BrowserStorage - multiple entities: Save, Load", function() {
    var v = new VIE();
    v.use(new v.BrowserStorageService({fileName: 'VIE-TestCase'}));
    ok(v.service('browserStorage'));
	var entity1 = new v.Entity({'@subject':'<TestEntity1>'});
	var entity2 = new v.Entity({'@subject':'<TestEntity2>'});
	var s = new v.Savable({entities:[entity1,entity2]});
	var saveSuccess = function(){
		var l = new v.Loadable({entities: ['<TestEntity1>','<TestEntity2>']});
		var loadSuccess = function(entities){
			start();
			equal(entities.length, 2);
			ok(entities[0].isEntity);
			ok(entities[1].isEntity);
			equal(entity1.getSubject(),entities[0].getSubject());
			equal(entity2.getSubject(),entities[1].getSubject());
			v.service('browserStorage').removeFile();
		}	
		v.service('browserStorage').load(l,loadSuccess);
	};
	v.service('browserStorage').save(s,saveSuccess);
	stop();
});

test("VIE.js BrowserStorage - Save, Load, Remove", function() {
    var v = new VIE();
    v.use(new v.BrowserStorageService({fileName: 'VIE-TestCase'}));
    ok(v.service('browserStorage'));
	var entity1 = new v.Entity({'@subject':'<TestEntity1>'});
	var entity2 = new v.Entity({'@subject':'<TestEntity2>'});
	var s = new v.Savable({entities:[entity1,entity2]});
	var saveSuccess = function(){
		var l = new v.Loadable({entities: ['<TestEntity1>','<TestEntity2>']});
		var loadSuccess = function(entities){
			start();
			equal(entities.length, 2);
			ok(entities[0].isEntity);
			ok(entities[1].isEntity);
			equal(entity1.getSubject(),entities[0].getSubject());
			equal(entity2.getSubject(),entities[1].getSubject());
			stop();
			var r = new v.Removable({entity: '<TestEntity1>'});
			var removeSuccess = function(){
				var loadSuccessAfterRemove = function(entities){
					start();
					equal(entities.length, 1);
					ok(entities[0].isEntity);
					equal(entity2.getSubject(),entities[0].getSubject());
					v.service('browserStorage').removeFile();
				}
				v.service('browserStorage').load(l,loadSuccessAfterRemove);
			};
			v.service('browserStorage').remove(r, removeSuccess);
		}	
		v.service('browserStorage').load(l,loadSuccess);
	};
	v.service('browserStorage').save(s,saveSuccess);
	stop();
});