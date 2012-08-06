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
//    stanbol.connector.createRecipe(recipe, function(success) {
//    	
//    	ok(true, "01. created recipe: " + recipe);
//    	console.log("01. created recipe: " + recipe);
//
//
//    	
//    }, function(error) {
//    	
//    	ok(false, "01. could not create recipe: " + recipe);
//    	console.log("01. could not create recipe: " + recipe);
//    	start();
//    }, {
//  	description : 'Melanie'  
//		});
    

    stanbol.connector.createRule(ruleName, rule, recipe, 
 	       function(success){
 	    	
 	    	ok(true, "02. Created rule " + ruleName + " on recipe " + recipe);
 	    	console.log("02 Created rule " + ruleName + " on recipe " + recipe)
 	    	
 	    	// search for this rule on the rules endpoint
 	    	stanbol.connector.findRule(function(success){
 	    		
 	    		ok(true, "04. Got rule " + ruleName + " from rules endpoint");
 	    		console.log("04. Got rule " + ruleName + " from rules endpoint")
 	    		console.log(success)
 	    		
 	    	}, function(error){
 	    		
 	    		ok(false, "04. Could not get rule " + ruleName + " from rules endpoint");
 	    		console.log("04. Coudl not get rule " + ruleName + " from rules endpoint")
 	    		
 	    	}, {
 	    		name : 'has_transitive',
 	    		description : 'transitivity'
 	    	});
 	    	
 	    	// get this recipe from the rules endpoint
 	    	stanbol.connector.getRecipe(recipe, function(success){
 	    		
 	    		ok(true, "03. Got recipe " + recipe + " from rules endpoint");
 	    		console.log("03. Got recipe " + recipe + " from rules endpoint")
 	    		console.log(success)
 	    		
 	    	}, function(error){
 	    		ok(false, "03. Could not get recipe " + recipe + " from rules endpoint");
 	    		console.log("03. Could not get recipe " + recipe + " from rules endpoint")
 	    	});
 	    	
 	    	// get this recipe by searching through recipe descriptions
 	    	stanbol.connector.findRecipe("Melanie", function(success) {
 	    		
 	    		ok(true, "05. Found recipe " + recipe + " by description 'Melanie'");
 	    		console.log("05. Found recipe " + recipe + " by description 'Melanie'")
 	    		console.log(success)
 	    		
 	    	}, function(error){
 	    		
 	    		ok(false, "05. Could not find recipe " + recipe + " by description 'Melanie'");
 	    		console.log("05. Could not find recipe " + recipe + " by description 'Melanie'")
 	    		
 	    	});
 	    	
 	    	// delete this rule again from our recipe // TODO CORS access problem
 	    	stanbol.connector.deleteRule(recipe, ruleName, function(success){
 	    		
 	    		ok(true, "98. deleted rule " + ruleName + " from recipe " + recipe)
 	    		console.log("98. deleted rule " + ruleName + " from recipe " + recipe)
// 	    		start();
 	    	}, function(error){
 	    		
 	    		ok(false, "98. could not delete rule " + ruleName + " from recipe " + recipe)
 	    		console.log("98. could not delete rule " + ruleName + " from recipe " + recipe)
// 	    		start();
 	    	});
 	    	
 	    	stop();
 	    	stanbol.connector.deleteRecipe(recipe, function(success){
 	    		
 	    		ok(true, "99. deleted recipe " + recipe)
 	    		console.log("99. deleted recipe " + recipe)
 	    		start();
 	    	}, function(error){
 	    		ok(false, "99. could not delete recipe " + recipe)
 	    		console.log("99. could not delete recipe " + recipe)
 	    		start();
 	    	});
 	    	
 	    	
 	    }, function(error){
 	    	
 	    	ok(false, "02. Could not create rule " + ruleName + " on recipe " + recipe);
 	    	console.log("02. Could not create rule " + ruleName + " on recipe " + recipe)
 	    	start();
 	    }, {
 	    	desc : description
 	    });
	
});		// end of test for Rules Manager