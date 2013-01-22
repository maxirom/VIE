var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];



//### test for the /rules endpoint, the component that "supports the 
// construction and execution of inference rules. An inference rule, or 
// transformation rule, is a syntactic rule or function which takes premises and
// returns a conclusion. Stanbol Rules allows to add a layer for expressing 
// business logics by means of axioms, which encode the inference rules. These 
// axioms can be organized into a container called recipe, which identifies a set 
// of rules that share the same business logic and interpret them as a whole." 
// (see http://incubator.apache.org/stanbol/docs/trunk/components/rules/).
//
//@author mere01
test("VIE.js StanbolConnector - Rules Manager", function() {
	
	var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);
    
    // first, we need to create a recipe
    var recipe = "http://www.dfki.de/mere01/recipe/melaniesRecipe";
    // then we can load a new rule upon the recipe
	// the rule itself must be in KRES syntax
    var ruleName = "has_transitive";
	var rule = "[has(?r, ?x, ?z) . has(?r, ?z, ?y) -> has(?r, ?x, ?y)]";
	var description = "Expresses transitivity of the has-relation";
	var ont = "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl";
		
    stop();
    
    
      // TODO CORS access problem
    stanbol.connector.createRecipe(recipe, function(success) {
    	
    	ok(true, "01. created recipe: " + recipe);

    	
    }, function(error) {
    	
    	ok(false, "01. could not create recipe: " + recipe);
    	start();
    }, {
  	description : 'Melanie'
		});
    

    stanbol.connector.createRule(ruleName, rule, recipe, 
 	       function(success){
 	    	
 	    	ok(true, "02. Created rule " + ruleName + " on recipe " + recipe);
 	    	
 	    	// search for this rule on the rules endpoint
 	    	stanbol.connector.findRule(function(success){
 	    		
 	    		ok(true, "04. Got rule " + ruleName + " from rules endpoint");
 	    		
 	    	}, function(error){
 	    		
 	    		ok(false, "04. Could not get rule " + ruleName + " from rules endpoint");
 	    		
 	    	}, {
 	    		name : 'has_transitive',
 	    		description : 'transitivity'
 	    	});
 	    	
 	    	// get this recipe from the rules endpoint
 	    	stanbol.connector.getRecipe(recipe, function(success){
 	    		
 	    		ok(true, "03. Got recipe " + recipe + " from rules endpoint");
 	    		
 	    	}, function(error){
 	    		ok(false, "03. Could not get recipe " + recipe + " from rules endpoint");
 	    	});
 	    	
 	    	// get this recipe by searching through recipe descriptions
 	    	stanbol.connector.findRecipe("Melanie", function(success) {
 	    		
 	    		ok(true, "05. Found recipe " + recipe + " by description 'Melanie'");
 	    		
 	    	}, function(error){
 	    		
 	    		ok(false, "05. Could not find recipe " + recipe + " by description 'Melanie'");
 	    		
 	    	});
 	    	
 	    	// delete this rule again from our recipe // TODO CORS access problem
 	    	stanbol.connector.deleteRule(recipe, ruleName, function(success){
 	    		
 	    		ok(true, "98. deleted rule " + ruleName + " from recipe " + recipe)
 	    	}, function(error){
 	    		
 	    		ok(false, "98. could not delete rule " + ruleName + " from recipe " + recipe)
 	    	});
 	    	
 	    	stop();
 	    	stanbol.connector.deleteRecipe(recipe, function(success){
 	    		
 	    		ok(true, "99. deleted recipe " + recipe)
 	    		start();
 	    	}, function(error){
 	    		ok(false, "99. could not delete recipe " + recipe)
 	    		start();
 	    	});
 	    	
 	    	
 	    }, function(error){
 	    	
 	    	ok(false, "02. Could not create rule " + ruleName + " on recipe " + recipe);
 	    	start();
 	    }, {
 	    	desc : description
 	    });
    
    
    // independent testing of /refactor 
    graph = "";
    recipe = "personTypes[is(<http://dbpedia.org/ontology/Person>, ?x) -> is(<http://rdf.data-vocabulary.org/Person>, ?x)]";	
    stop();
	stanbol.connector.refactor(graph, recipe, function(success){
		start();
		
	}, function(error){
		start(); 
		
	}, { 
		rec : 'syntax' 
		});
		
    
});		// end of test for Rules Manager

//### test for the /rules/adapters service, the component that allows exporting 
// recipes to other formats.
//
//@author mere01
test("VIE.js StanbolConnector - Rules Manager - rules/adapters", 3, function() {
//test the rules/adapters service to convert recipes into another format

var z = new VIE();
ok(z.StanbolService);
equal(typeof z.StanbolService, "function");
var stanbol = new z.StanbolService({
    url: stanbolRootUrl[0]
});
z.use(stanbol);

stop();
recipe = "http://www.dfki.de/mere01/recipe/r1";
format = "org.semanticweb.owlapi.model.SWRLRule";
//  curl -i -X GET 
//    http://lnv-89012.dfki.uni-sb.de:9001/rules/adapters/http://www.dfki.de/mere01/recipe/r1?format=com.hp.hpl.jena.reasoner.rulesys.Rule
stanbol.connector.exportRecipe(recipe, format, function(success){
	
	ok(true, "Exported recipe to format " + format);
	start();
}, function(error) { 

	ok(false, "Could not export recipe to format " + format);
	start();
});



}); // end of test for Rules Manager - rules/adapters


//### test for the /rules/find service, the component that allows to find rules
//	and recipes by names and descriptions
//
//@author mere01
test("VIE.js StanbolConnector - Rules Manager - rules/find", function() {

var z = new VIE();
ok(z.StanbolService);
equal(typeof z.StanbolService, "function");
var stanbol = new z.StanbolService({
  url: stanbolRootUrl[0]
});
z.use(stanbol);

var recipe = "http://www.dfki.de/mere01/recipe/r1"; 
var ruleName = "has_transitive";
stop();
// search for this rule on the rules endpoint
	stanbol.connector.findRule(function(success){
		
		ok(true, "04. Got rule " + ruleName + " from rules endpoint");
		
	}, function(error){
		
		ok(false, "04. Could not get rule " + ruleName + " from rules endpoint");
		
	}, {
		name : ruleName,
		description : 'transitivity'
	});



	// get this recipe by searching through recipe descriptions
	stanbol.connector.findRecipe("Melanie", function(success) {
		
		ok(true, "05. Found recipe " + recipe + " by description 'Melanie'");
		start();
		
	}, function(error){
		
		ok(false, "05. Could not find recipe " + recipe + " by description 'Melanie'");
		start();
	});



}); // end of test for the Rules Manager - rules/find