//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - DBPedia service
// The DBPedia service allows a VIE developer to directly query
// the DBPedia database for entities and their properties. Obviously,
// the service does not allow for saving, removing or analyzing methods.
//
// createRule()
// createRecipe()
// deleteRule()
// deleteRecipe()
// findRule()
// findRecipe()
// getRecipe()
// refactor()		Uses the specified recipe to transform the specified RDF graph
// exportRecipe()	export to a specific format
//
(function() {

	jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {

		// ### createRule(ruleSyntax, recipeURI, success, error,
		// options)
		// @author mere01
		// creates a rule on the rules/recipe/ endpoint, and adds it to the
		// specified recipe.
		// **Parameters**:
		// *{string}* **ruleSyntax** the rule itself, in KRES syntax, e.g.
		// [has(?r, ?x, ?z) . has(?r, ?z, ?y) -> has(?r, ?x, ?y)]
		// *{string}* **recipeURI** the URI of the recipe to which the new rule
		// will be added
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options. You may optionally specify a
		// description for your rule like this '{desc : "a new rule"}'
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		createRule : function(rulename, ruleSyntax, recipeURI, success, error,
				options) {

			options = (options) ? options : {};

			// curl -X POST
			// -F "rules=transitivity[has(?r, ?x, ?z) . has(?r, ?z, ?y) ->
			// has(?r, ?x, ?y)]"
			// -F "description=Test rule"
			// http://[stanbol]/rules/recipe/<recipeURI>

			var connector = this;

			var data = new FormData();
			data.append('rules', rulename + ruleSyntax);

			if (options.desc) {
				data.append('description', options.desc);
			}


			connector._iterate( {
				method : connector._createRule,
				methodNode : connector._createRuleNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');
				// return u;
					
				return "http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe"
			},
			args : {
				recipe : recipeURI,
				data : data
			},
			urlIndex : 0
			});
		}, // end of createRule

		_createRule : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url + "/" + args.recipe,
				type : "POST",
				data : args.data,
				contentType : false,
				processData : false,
				cache : false

			});
		}, // end of _createRule

		_createRuleNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : args.verb,
				uri : url,
				body : args.content,
				headers : {
					Accept : "text/plain",
					"Content-Type" : "text/plain"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _createRuleNode

		// ### createRecipe(recipeURI, success, error, options)
		// @author mere01
		// creates a recipe on the rules/recipe/ endpoint.
		// Already existing recipes cannot be overridden by
		// this function (will result in a '409 Conflict').
		// **Parameters**:
		// *{string}* **recipeURI** the name of the recipe to be created
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options can hold a description. Descriptions
		//		can be used to later on find a recipe using the findRecipe()
		//		function. If you want to add a description to your recipe, 
		//		specify {description : 'some description'}
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		createRecipe : function(recipeURI, success, error, options) {

			options = (options) ? options : {};

			// curl -i -X PUT
			// http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe/http://www.dfki.de/mere01/recipe/r1

			var connector = this;
			
			var suffix = recipeURI;
			if (options.description) {
				suffix += "?description=" + options.description.replace(/\/$/, '');
			}

			connector._iterate( {
				method : connector._createRecipe,
				methodNode : connector._createRecipeNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');

				// return u;
				var u = "http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe";
				
				return u;
			},
			args : {
				id : suffix
			},
			urlIndex : 0
			});
		}, // end of createRecipe

		_createRecipe : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url + "/" + args.id,
				type : 'PUT'

			});
		}, // end of _createRecipe

		_createRecipeNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : args.verb,
				uri : url,
				body : args.content,
				headers : {
					Accept : "text/plain",
					"Content-Type" : "text/plain"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _createRecipeNode

			
		// ### deleteRule(recipeURI, success, error, options)
		// @author mere01
		// deletes a rule from a specific recipe on the rules/recipe/ endpoint.
		// **Parameters**:
		// *{string}* **recipeURI** the URI of the recipe where the rule lives
		// *{string}* **ruleName** the name of the rule that will be deleted 
		//			from the specified recipe
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options (not specified here)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		deleteRule : function(recipeURI, ruleName, success, error, options) {

			options = (options) ? options : {};
			
			// curl -i -X DELETE 
			// http://dev.iks-project.eu:8081/rules/recipe/http://www.dfki.de/mere01/recipe/r2?rule=transitivity
			var connector = this;

			console.log(this.options.rules.urlPostfix)

			connector._iterate( {
				method : connector._deleteRule,
				methodNode : connector._deleteRuleNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');

				// return u;
				
				var u = "http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe" + "/" + recipeURI + "?rule=" + ruleName;
				console.log("sending DELETE request to address:")
				console.log(u)
				return u;
			},
			args : {
				id : recipeURI,
				ruleName : ruleName
			},
			urlIndex : 0
			});
		}, // end of deleteRule

		_deleteRule : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : 'DELETE'

			});
		}, // end of _deleteRule

		_deleteRuleNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : 'DELETE',
				uri : url,
				body : args.content,
				headers : {
					Accept : "text/plain",
					"Content-Type" : "text/plain"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _deleteRuleNode	
		
		// ### deleteRecipe(recipeURI, success, error, options)
		// @author mere01
		// deletes a recipe from the rules/recipe/ endpoint.
		// **Parameters**:
		// *{string}* **recipeURI** the URI of the recipe to be deleted
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options (not specified here)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		deleteRecipe : function(recipeURI, success, error, options) {

			options = (options) ? options : {};

			// curl -i -X DELETE
			// http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe/http://www.dfki.de/mere01/recipe/r1
			var connector = this;

			console.log("rules endpoint:")
			console.log(this.options.rules.urlPostfix)

			connector._iterate( {
				method : connector._deleteRecipe,
				methodNode : connector._deleteRecipeNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');

				// return u;
				return "http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe"
			},
			args : {
				id : recipeURI
			},
			urlIndex : 0
			});
		}, // end of deleteRecipe

		_deleteRecipe : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url + "/" + args.id,
				type : 'DELETE'

			});
		}, // end of _deleteRecipe

		_deleteRecipeNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : 'DELETE',
				uri : url,
				body : args.content,
				headers : {
					Accept : "text/plain",
					"Content-Type" : "text/plain"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _deleteRecipeNode

		// TODO old version, evt. to be removed
		// ### oldfindRule(term, termType, success, error, options)
		// @author mere01
		// searches the /rules/find/rules/ endpoint for a rule that matches the
		// specified search term, using SPARQL string matching.
		// **Parameters**:
		// *{string}* **term** the search term
		// *{string]* **termType** the type of the search term, this must be one
		// of 'name' or 'description' (depending on whether the rule shall
		// be searched by name or by its description).
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options (not specified here)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		oldfindRule : function(term, termType, success, error, options) {

			options = (options) ? options : {};
			var connector = this;
			// curl -H "Accept: application/rdf+xml" 
			//		http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules?name=transitivity
			// curl -H "Accept: application/rdf+xml" 
			//		http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules?description=has+rule

			connector._iterate( {
				method : connector._findRule,
				methodNode : connector._findRuleNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.findRule.replace(/\/$/, '');

				// return u;
				return "http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules"
			},
			args : {
				options : options,
				termType : termType,
				term : term
			},
			urlIndex : 0
			});
		}, // end of findRule

		_oldfindRule : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url + "?" + args.termType + "=" + args.term

			});
		}, // end of _findRule

		_oldfindRuleNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+xml"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _findRuleNode

		
				// ### findRule(success, error, options)
				// @author mere01
				// retrieves a rule from the /rules/find/ endpoint. The retrieval
				// can be done using either the name or some description of
				// the rule. These can be specified in the options parameter
				// as 'name' or 'description'. In the default case, i.e., if no
				// options are specified, //... TODO
				// **Parameters**:
				// *{function}* **success** The success callback.
				// *{function}* **error** The error callback.
				// *{object}* **options** Options to specify what we're looking
				//		for. Specify e.g. {name : 'myRule'} if you want to search
				//		for a rule by its name; specify {description : 'transitive'}
				//		if you want to search rules by their descriptions.
				//		If a name is specified, any given description will be
				//		ignored.
				// **Throws**:
				// *nothing*
				// **Returns**:
				// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
				// instance itself.
				findRule : function(success, error, options) {

					options = (options) ? options : {};
					var connector = this;
					// curl -H "Accept: application/rdf+xml" 
					// http://http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules?name=transitivity
					// or
					// curl -H "Accept: application/rdf+xml" 
					// http://http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules?description=has+rule


					connector._iterate( {
						method : connector._findRule,
						methodNode : connector._findRuleNode,
						success : success,
						error : error,
						url : function(idx, opts) {
						// var u = this.options.url[idx].replace(/\/$/, '');
						// u += this.options.rules.urlPostfix.replace(/\/$/, '');
						// u += this.options.rules.recipe.replace(/\/$/, '');

						// return u;
						var u = "http://lnv-89012.dfki.uni-sb.de:9001/rules/find/rules";
						
						if (options.name) {
							u += "?name=" +  options.name;
						} else if (options.description) {
							u += "?description" + options.description;
						}
						
						return u;
					},
					args : {
						
					},
					urlIndex : 0
					});
				}, // end of findRule

				_findRule : function(url, args, success, error) {
					jQuery.ajax( {
						beforeSend: function(xhrObj) {
							xhrObj.setRequestHeader("Accept", "application/rdf+xml");
						},
						success : success,
						error : error,
						url : url,
						type : "GET",
						accepts : {
							"application/rdf+xml" : "application/rdf+xml"
						}

					});
				}, // end of _findRule

				_findRuleNode : function(url, args, success, error) {
					var request = require('request');
					var r = request( {
						method : "GET",
						uri : url,
						headers : {
							Accept : "text/turtle"
						}
					}, function(err, response, body) {
						try {
							success( {
								results : JSON.parse(body)
							});
						} catch (e) {
							error(e);
						}
					});
					r.end();
				}, // end of _findRuleNode
				
				// ### findRecipe(success, error, options)
				// @author mere01
				// retrieves a recipe from the /rules/find/ endpoint. The retrieval
				// can be done using the some description of the recipe. This 
				// description must have been specified at creation of the recipe. 
				// **Parameters**:
				// *{function}* **success** The success callback.
				// *{function}* **error** The error callback.
				// *{object}* **options** Options to specify what we're looking
				//		for. Specify e.g. {name : 'myRecipe'} if you want to search
				//		for a rule by its name; specify {description : 'transitive'}
				//		if you want to search a recipe by its description.
				//		If a name is specified, any given description will be
				//		ignored.
				// **Throws**:
				// *nothing*
				// **Returns**:
				// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
				// instance itself.
				findRecipe : function(searchTerm, success, error) {

					var connector = this;
					// curl -H "Accept: text/turtle" 
					// http://lnv-89012.dfki.uni-sb.de:9001/rules/find/recipes?description=Test


					connector._iterate( {
						method : connector._findRecipe,
						methodNode : connector._findRecipeNode,
						success : success,
						error : error,
						url : function(idx, opts) {
						// var u = this.options.url[idx].replace(/\/$/, '');
						// u += this.options.rules.urlPostfix.replace(/\/$/, '');
						// u += this.options.rules.recipe.replace(/\/$/, '');

						// return u;
						var u = "http://lnv-89012.dfki.uni-sb.de:9001/rules/find/recipes";
						
						
						u += "?description=" + searchTerm;
						
						
						return u;
					},
					args : {
						
					},
					urlIndex : 0
					});
				}, // end of findRecipe

				_findRecipe : function(url, args, success, error) {
					jQuery.ajax( {
						beforeSend: function(xhrObj) {
							xhrObj.setRequestHeader("Accept", "application/rdf+xml");
						},
						success : success,
						error : error,
						url : url

					});
				}, // end of _findRecipe

				_findRecipeNode : function(url, args, success, error) {
					var request = require('request');
					var r = request( {
						method : "GET",
						uri : url,
						headers : {
							Accept : "text/turtle"
						}
					}, function(err, response, body) {
						try {
							success( {
								results : JSON.parse(body)
							});
						} catch (e) {
							error(e);
						}
					});
					r.end();
				}, // end of _findRecipeNode	
				
				
		// ### getRecipe(recipeURI, success, error, options)
		// @author mere01
		// retrieves the specified recipe from the /rules/recipe/ endpoint. The
		// recipe must be existing.
		// **Parameters**:
		// *{string}* **recipeURI** the URI of the recipe
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options (not specified here)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		getRecipe : function(recipeURI, success, error, options) {

			options = (options) ? options : {};
			var connector = this;
			// curl -i -X GET
			// http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe/http://www.dfki.de/mere01/recipe/r1

			connector._iterate( {
				method : connector._getRecipe,
				methodNode : connector._getRecipeNode,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');

				// return u;
				return "http://lnv-89012.dfki.uni-sb.de:9001/rules/recipe"
			},
			args : {
				options : options,
				id : recipeURI
			},
			urlIndex : 0
			});
		}, // end of getRecipe

		_getRecipe : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url + "/" + args.id,
				type : "GET",
				accepts : {
					"text/turtle" : "text/turtle"
				}

			});
		}, // end of _getRecipe

		_getRecipeNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "text/turtle"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _getRecipeNode

		// ### refactor(graph, recipe, success, error, options)
		// @author mere01
		// addresses resource refactor/ and refactor/apply, which "performs RDF 
		// graphs transformations to specific target vocabularies or ontologies 
		// by means of rules. This allows the harmonization and the alignment of 
		// RDF graphs expressed with different vocabularies". 
		// (http://incubator.apache.org/stanbol/docs/trunk/components/rules/)
		// 
		// Uses the specified recipe to transform the specified RDF graph.
		// The **recipe** can be either a string encoding the recipe in the
		// stanbol rule syntax, or it can be the URI of an existing recipe on 
		// /stanbol/recipe.
		// The **options** parameter 'rec' has to be set accordingly to either
		// 'syntax' or 'uri'. If no **options** is specified, **recipe** is
		// assumed to be the URI of an existing recipe. 
		// **Parameters**:
		// *{string}* **graph** the RDF graph to be transformed
		// *{string}* **recipe** the recipe to be used for transformation 
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options. Specify parameter 'rec' to have 
		//		the value 'syntax' if **recipe** is a recipe in rule syntax,
		//		or value 'uri' if **recipe** is the URI of an existing recipe.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		refactor : function(graph, recipe, success, error, options) {

			options = (options) ? options : false;
			
			var rec = (options.rec) ? options.rec.toLowerCase() : "uri";
			

			// curl -X POST -H "Content-Type: multipart/form-data" 
			//   -H "Accept: text/turtle" 
			//   -F recipe="personTypes[is(<http://dbpedia.org/ontology/Person>, ?x) -> is(<http://rdf.data-vocabulary.org/Person>, ?x)]" 
			// 	 -F input=@personsRDF.xml 
			//	 http://lnv-89012.dfki.uni-sb.de:9001/refactor/apply
			
			// curl -X POST -H "Accept: application/rdf+xml" 
			//  -F input=@personsRDF.xml 
			//  -F recipe="http://www.dfki.de/mere01/recipe/TestRecipe" 
			//  http://lnv-89012.dfki.uni-sb.de:9001/refactor

			var connector = this;

			var data = new FormData();
			data.append('recipe', recipe);
			data.append('input', graph);

			connector._iterate( {
				method : connector._refactor,
				methodNode : connector._refactor,
				success : success,
				error : error,
				url : function(idx, opts) {
				// var u = this.options.url[idx].replace(/\/$/, '');
				// u += this.options.rules.urlPostfix.replace(/\/$/, '');
				// u += this.options.rules.recipe.replace(/\/$/, '');

				// return u;
				var u = "http://lnv-89012.dfki.uni-sb.de:9001/refactor";
				if (rec !== "uri") {
					u += "/apply";
				}
				return u;
			},
			args : {
				data : data
			},
			urlIndex : 0
			});
		}, // end of refactor

		_refactor : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data,
				contentType : false,
				processData : false,
				cache : false

			});
		}, // end of _refactor

		_refactorNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : args.verb,
				uri : url,
				body : args.content,
				headers : {
					Accept : "text/plain",
					"Content-Type" : "text/plain"
				}
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}, // end of _refactorNode

		
		// ### exportRecipe(recipe, format, success, error, options)
		// @author mere01
		// exports the specified recipe to the specified format. The recipe must
		// be existing on rules/recipe/.
		// **Parameters**:
		// *{string}* **recipe** the URI of the recipe to be exported
		// *{format}* **format** the format into which the **recipe** will be
		//		exported. Can be one of
		//		* com.hp.hpl.jena.reasoner.rulesys.Rule
		//		* org.apache.clerezza.rdf.core.sparql.query.ConstructQuery
		//		* org.apache.stanbol.rules.base.api.SPARQLObject
		//		* org.semanticweb.owlapi.model.SWRLRule
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options (not specified here)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.
		
		exportRecipe : function(recipe, format, success, error, options) {

			options = (options) ? options : {};
			var connector = this;
		//  curl -i -X GET 
		//    http://lnv-89012.dfki.uni-sb.de:9001/rules/adapters/http://www.dfki.de/mere01/recipe/r1?format=com.hp.hpl.jena.reasoner.rulesys.Rule
			connector._iterate( {
				method : connector._exportRecipe,
				methodNode : connector._exportRecipeNode,
				success : success,
				error : error,
				url : function(idx, opts) {

//					var u = this.options.url[idx].replace(/\/$/, '');
//					u += this.options.rules.urlPostfix.replace(/\/$/, '');
//					u += this.options.rules.adapters.replace(/\/$/, '');
//					u += recipe.replace(/\/$/, '');
//					u += "?format=" + format;
//
//					return u;
				return "http://lnv-89012.dfki.uni-sb.de:9001/rules/adapters/" + recipe.replace(/\/$/, '') + "?format=" + format;
			},
			args : {
				options : options
			},
			urlIndex : 0
			});
		}, // end of exportRecipe

		_exportRecipe : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET"

			});
		}, // end of _exportRecipe

		_exportRecipeNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url
				
			}, function(err, response, body) {
				try {
					success( {
						results : JSON.parse(body)
					});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		} // end of _exportRecipeNode
		
		
	});

})();