// ## VIE - Ontonet service
// VIE OntoNet Service implements the interface to the ontonet endpoint; 
// the API for managinging OWL/OWL2 ontologies within stanbol.
// Once loaded internally from their remote or local resources, ontologies live 
// and are known within the realm (=scope) they were loaded in.
//
// for more documentation,
// cf. http://dev.iks-project.eu:8081/ontonet
//
// available functions:
//
// createScope		
// getOntology		# get an ontology from a scope or from a session
// getLibrary		# get a library from a scope or from a session
// getScope	
// deleteScope		
// ontoScopes		# get all scopes that live on the ontonet/ontology endpoint
// ontoSessions		# get all sessions that live on the ontonet/session endpoint
// createSession	
// deleteSession
// updateScopes		# append scopes to a session while detaching all other scopes from this session
// detachOntology	# remove and ontology from a session	
// getSession

(function() {

	jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {

	// ### createScope(scopeID, success, error, options)
	// @author mere01
	// creates a scope with the specified name. 
	// 
	// TODO: available at Stanbol in near future
	// Optionally, an ontology library (or even a list
	// of libraries), or an ontology (or even a list of 
	// ontologies) can be loaded on creation into the core 
	// space of the scope. 
	// A library is a collection of references to ontologies, 
	// which can be located anywhere on the web. 
	// For other options, see the description of the 
	// **options** parameter.
	//
	// Already existing scopes cannot be overridden by this
	// function.
	// **Parameters**:
	// *{string}* **scopeID** the name of the scope to be
	// created
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. 
	// The range of options:
	//
	// ---- list of options that will be available in the
	//      near future, after the POST/redirect/GET problem
	//		has been solved ----
	// * corereg: the physical URL of the registry 
	// ( = ontology library) that points
	// to the ontologies to be loaded into the core space.
	// This parameter overrides coreont if both are
	// specified. Might be a single string value or an array of string values.
	// * coreont: the physical URL of the top ontology to be
	// loaded into the core space.
	// This parameter is ignored if corereg is specified.
	// Might be a single string value or an array of string values.
	// * customreg: deprecated -> to be set using appendLibrary().
	// the physical URL of the registry that points to the ontologies to be 
	// loaded into the custom space. This parameter is optional. It overrides 
	// customont if both are specified.
	// * customont: deprecated -> to be set using appendOntology().
	// the physical URL of the top ontology to be loaded into the custom space.
	// This parameter is optional. It is ignored if customreg is specified.
	// ---- end of list ----
	//
	// * activate: If true, the ontology scope will be set as
	// active upon creation. This parameter is optional, default is false.
	// **Throws**: *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
	createScope : function(scopeID, success, error, options) {

		var params = [ //"corereg", "coreont",
		               "activate" ];
		options = (options) ? options : {};

		var connector = this;
							
		// "http://<myserver>/ontonet/ontology/<scopeID>?corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks"

		// passing multiple libraries for the core space:
		// curl -i -X PUT  
		// 	http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/<scope>?corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks\&corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments
							
		connector._iterate( {
				method : connector._createScope,
				methodNode : connector._createScopeNode,
				success : success,
				error : error,
				url : function(idx, opts) {


				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.scope.replace(/\/$/, '');
				u += "/" + scopeID;

				if (Object.keys(options).length != 0) {
					u += "?";
				}
				// build up our list of parameters
				var counter = 0;
				for (var key in options) {
							
							/* TODO available at Stanbol in near future
												if (key === "corereg") {
													// this might be a list
													
													var value = options[key];
													if (Object.prototype.toString.apply(value) === '[object Array]') {
													// if we got a list of registries / libraries:
														for(var i=0, len=value.length; i < len; i++){
															u += key + "=" + value[i] + "&";
														}
														
													} else {
														u += key + "=" + value + "&";
													}
													
												} else if (key === "coreont"){
													// this might be a list
													
													var value = options[key];
													
													if (Object.prototype.toString.apply(value) === '[object Array]') {
														// if we got a list of registries / libraries:
															for(var i=0, len=value.length; i < len; i++){
																u += key + "=" + value[i] + "&";
															}
															
														} else {
															u += key + "=" + value + "&";
														}
													
													
												} else */
													if (($.inArray(key, params)) != -1) {

													if (counter != 0) {
														u += "&";
													}
													u += key + "="
															+ options[key];
												}

												counter += 1;
											}
											return u.replace('&&', '&');
										},
										args : {
											auth : this.options.auth,
											options : options
									},
									urlIndex : 0
									});
						}, // end of createScope

	_createScope : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : "PUT"
				
		});
	}, // end of _createScope

	_createScopeNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "PUT",
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
	}, // end of _createScopeNode

											
						
	/* TODO available at Stanbol in near future
	// ### appendLibrary(destination, libURI, success, error, options)
	// @author mere01
	// loads the specified library into the specified destination.
	// This destination can be the ID of a scope or of a session.
	// The options parameter must specify 'loc' to be either
	// 'session' or 'scope' accordingly. If it is set to
	// 'scope', the library will be loaded into the custom
	// space of the scope denoted by **destination**. 
	// If it is set to 'session', the library will be 
	// appended to the session denoted by **destination**.
	// **Parameters**:
	// *{string}* **destination** the ID of the scope or session
	// *{string}* **libraryURI** the URI of the library that is
	// to be loaded into the destination.
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options Must contain the
	//		key 'loc' with a value of either 'session' or 'scope'. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	appendLibrary : function(destination, libURI, success,
		error, options) {

		options = (options) ? options : false;
							
		if (!options) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
			}
							
		var loc = options.loc;
							
		if (! (loc === "session" || loc === "scope") ) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
			}
		var connector = this;
						
		// curl -X POST -F
		// "library=http://ontologydesignpatterns.org/ont/iks/kres/omv.owl"
		// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/myScope

		// we want to send multipart form (option -F for
		// curl), so we need a form data object
		var data = new FormData();
		data.append('library', libURI);
							

		connector._iterate( {
			method : connector._appendLibrary,
			methodNode : connector._appendLibraryNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				// decide where to load the ontology
				if (loc === "session") {
					u += this.options.ontonet.session.replace(/\/$/, '');
				} else {
					u += this.options.ontonet.scope.replace(/\/$/, '');
				}
									
				u += "/" + destination;

				return u;
			},
			args : {
				auth : this.options.auth,
				// data : {url: ontologyURI},
				data : data,
				options : options
			},
			urlIndex : 0
			});
		}, // end of appendLibrary
	*/

	_appendLibrary : function(url, args, success, error) {

		$.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : "POST",
			data : args.data,	
			accepts : {
				"application/rdf+xml" : "application/rdf+xml"
			},
			contentType : false,
			processData : false,
			cache : false
		});
	}, // end of _appendLibrary

	_appendLibraryNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			uri : url,
			body : args.data,
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
	}, // end of _appendLibraryNode

	// ### getScope(scopeID, success, error, options)
	// @author mere01
	// retrieves the specified scope from the
	// ontonet/ontology endpoint. The scope must be existing.
	// **Parameters**:
	// *{string}* **scopeID** the ID of the scope
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options to specify the accept
	// type. Specify 'accept : <type>', where <type> is one
	// of the following: application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	getScope : function(scopeID, success, error, options) {
		
		options = (options) ? options : {};
		
		var acc = (options.accept) ? (options.accept) : "text/turtle";
		
		var connector = this;
		// curl -H "Accept:text/turtle" http://<server>/ontonet/ontology/<scope>
		
		connector._iterate( {
			method : connector._getScope,
			methodNode : connector._getScopeNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.scope.replace(/\/$/, '');
				u += "/" + scopeID;

				return u;
			},
			args : {
				auth : this.options.auth,
				options : options,
				accept : acc
			},
			urlIndex : 0
		});
	}, // end of getScope

	_getScope : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.accept);
				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
				
		});
	}, // end of _getScope

	_getScopeNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.accept
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
	}, // end of _getScopeNode
	
	// ### getOntology(id, ontologyID, success, errror,
	// options)
	// @author mere01
	// retrieves the specified ontology from the
	// ontonet/{ontology|session} endpoint, i.e. from the 
	// specific scope or session it was appended to. 
	// The options parameter must specify 'loc' to be either
	// 'session' or 'scope' accordingly. 
	// **Parameters**:
	// *{string}* **id** the ID of the scope or session
	// *{string}* **ontologyID** the ID of the ontology to
	// be retrieved
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Must contain the
	//		key 'loc' with a value of either 'session' or
	//		'scope'. 
	// It is also possible to specify the accept
	// type. Specify 'accept : <type>', where <type> is one
	// of the following: application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	getOntology : function(id, ontologyID, success,
			error, options) {
		
		options = (options) ? options : false;
		
		if (!options) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
		}
		
		var loc = options.loc;
		
		if (! (loc === "session" || loc === "scope") ) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
		}
		var connector = this;
							
		var acc = (options.accept) ? (options.accept) : "text/turtle";
		
		// curl -H "Accept:application/rdf+xml"
		// http://<server>/ontonet/ontology/<scope>/<ontology>
		// or
		// curl -H "Accept:text/turtle"
		// http://<server>/ontonet/ontology/<scope>/<ontology>
		
		connector._iterate( {
			method : connector._getOntology,
			methodNode : connector._getOntologyNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				// decide where to get the ontology from
				if (loc === "session") {
					u += this.options.ontonet.session.replace(/\/$/, '');
				} else {
					u += this.options.ontonet.scope.replace(/\/$/, '');
				}
									
				u += "/" + id;
				
				return u;
			},
			args : {
				auth : this.options.auth,
				options : options,
				accept : acc
			},
			urlIndex : 0
		});
	}, // end of getOntology

	_getOntology : function(url, args, success, error) {
		jQuery
		.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.accept);
				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
				
		});
	}, // end of _getOntology

	_getOntologyNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.accept
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
	}, // end of _getOntologyNode
	
	// ### getLibrary(id, libraryID, success, errror,
	// options)
	// @author mere01
	// retrieves the specified library from the
	// ontonet/{ontology|session} endpoint, i.e. from the specific
	// scope or session it was appended to. 
	// The options parameter must specify 'loc' to be either
	// 'session' or 'scope' accordingly. 
	// **Parameters**:
	// *{string}* **id** the ID of the scope or session
	// *{string}* **libraryID** the ID of the library to
	// be retrieved
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Must contain the
	//		key 'loc' with a value of either 'session' or
	//		'scope'. 
	// specify the accept
	// type. Specify 'accept : <type>', where <type> is one
	// of the following: application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	getLibrary : function(id, libraryID, success,
			error, options) {
		
		options = (options) ? options : false;
		
		if (!options) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
		}
		
		var loc = options.loc;
		
		if (! (loc === "session" || loc === "scope") ) {
			return "options parameter 'loc' must be set to" +
			"either 'session' or 'scope'";
		}
		
		var connector = this;
		
		var acc = (options.accept) ? (options.accept) : "text/turtle";

		// curl -H "Accept:application/rdf+xml"
		// http://<server>/ontonet/ontology/<scope>/<Library>
		// or
		// curl -H "Accept:text/turtle"
		// http://<server>/ontonet/ontology/<scope>/<Library>

		connector._iterate( {
			method : connector._getLibrary,
			methodNode : connector._getLibraryNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				// decide where to get the library from
				if (loc === "session") {
					u += this.options.ontonet.session.replace(/\/$/, '');
				} else {
					u += this.options.ontonet.scope.replace(/\/$/, '');
				}
									
				u += "/" + id;

				return u;
			},
			args : {
				auth : this.options.auth,
				options : options,
				accept : acc
			},
			urlIndex : 0
		});
	}, // end of getLibrary

	_getLibrary : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.accept);
				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
				

		});
	}, // end of _getLibrary

	_getLibraryNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.accept
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
	}, // end of _getLibraryNode

	// ### deleteScope(scopeID, success, errror, options)
	// @author mere01
	// deletes a complete scope from the ontonet/ontology
	// endpoint. If scopeID is specified to be null, then *all* scopes will be
	// deleted.
	// **Parameters**:
	// *{string}* **scopeID** the ID of the scope
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options (not specified here)
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	deleteScope : function(scopeID, success, error, options) {
		
		var scope = (scopeID !== null) ? scopeID : '';
		options = (options) ? options : {};
		
		var connector = this;
		// curl -X DELETE
		// http://<server>/ontonet/ontology/<scope>

		connector._iterate( {
			method : connector._deleteScope,
			methodNode : connector._deleteScope,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.scope.replace(/\/$/, '');
				u += "/" + scope;

				return u;
			},
			args : {
				auth : this.options.auth,
				options : options
			},
			urlIndex : 0
		});
	}, // end of deleteScope

	_deleteScope : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : "DELETE"

		});
	}, // end of _deleteScope

	_deleteScopeNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "DELETE",
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
	}, // end of _deleteScopeNode

	// ### ontoScopes(success, error, options)
	// @author mere01
	// This method returns all scopes that are currently
	// registered and/or (in)active ontology scopes of the
	// ontonet/ontology/ endpoint. Format/return type can
	// be specified as options.format.
	// **Parameters**:
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Specify e.g. {
	// 'inactive' : false } if you want the inactive scopes to be omitted.
	// Specify the return format of the data as 'options.format' to be one of 
	// the following:
	// application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	// **Example usage**:
	//
	// var stnblConn = new vie.StanbolConnector(opts);
	// stnblConn.contenthubIndices(
	// function (res) { ... },
	// function (err) { ... });
	ontoScopes : function(success, error, options) {

		options = (options) ? options : {};
		var connector = this;

		var acc = (options.accept) ? (options.accept) : "text/turtle";
							
		connector
		._iterate( {
			method : connector._ontoScopes,
			methodNode : connector._ontoScopesNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				
				inactive = (options.inactive) ? options.inactive
						: 'true';
				
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix;
				u += this.options.ontonet.scope.replace(/\/$/, '');
				u += "?with-inactive=" + inactive;

				return u;
			},
			args : {
				auth : this.options.auth,
				format : acc
			},
			urlIndex : 0
		});
	}, // end of ontoScopes()

	_ontoScopes : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.format);
//				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
		});
	}, // end of _ontoScopes

	_ontoScopesNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.format
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
	}, // end of _ontoScopesNode

						
	// ### ontoSessions(success, error, options)
	// @author mere01
	// This method returns all sessions that are currently
	// being managed on the ontonet/session/ endpoint. Format/return type can
	// be specified as options.format.
	// **Parameters**:
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Specify the return format of the data as 
	// 'options.format' to be one of the following:
	// application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	// **Example usage**:
	//
	// var stnblConn = new vie.StanbolConnector(opts);
	// stnblConn.contenthubIndices(
	// function (res) { ... },
	// function (err) { ... });
	ontoSessions : function(success, error, options) {
		
		options = (options) ? options : {};
		var connector = this;
		
		var acc = (options.accept) ? (options.accept) : "text/turtle";
		
		connector
		._iterate( {
			method : connector._ontoScopes,
			methodNode : connector._ontoScopesNode,
			success : success,
			error : error,
			url : function(idx, opts) {

				var u = this.options.url[idx]
				.replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix;
				u += this.options.ontonet.session.replace(/\/$/, '');
				return u;
			},
			args : {
				auth : this.options.auth,
				format : acc
			},
			urlIndex : 0
		});
	}, // end of ontoSessions()

	_ontoSessions : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.format);
				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
		});
	}, // end of _ontoSessions
	
	_ontoSessionsNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.format
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
	}, // end of _ontoSessionsNode
						
	// ### createSession(success, error, sessionId)
	// @author mere01
	// creates a session with the specified session id on 
	// the ontonet/session/ endpoint.
	// Already existing sessions cannot be overridden by
	// this function (will result in a '409 Conflict').
	// **Parameters**:
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{string}* **sessionID** the name of the session to be created
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	createSession : function(success, error, sessionId) {

		var verb = 'POST';
		if (sessionId) {
			verb = 'PUT';
		}

		var connector = this;

			connector._iterate( {
				method : connector._createSession,
				methodNode : connector._createSessionNode,
				success : success,
				error : error,
				url : function(idx, opts) {

					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
					u += this.options.ontonet.session.replace(/\/$/, '');

					if (sessionId) {
						u += "/" + sessionId;
					}

					return u;
				},
				args : {
					auth : this.options.auth,
					verb : verb
				},
				urlIndex : 0
			});
	}, // end of createSession

	_createSession : function(url, args, success, error) {
		
		jQuery.ajax( {
//			beforeSend : function(req) {
//	            req.setRequestHeader('Authorization', args.auth);
//	          },
			success : success,
			error : error,
			url : url,
			type : args.verb
			
		});
	}, // end of _createSession

	_createSessionNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : args.verb,
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
	}, // end of _createSessionNode

	// ### deleteSession(success, error, sessionId)
	// @author mere01
	// deletes a session from the ontonet/session/ endpoint.
	// **Parameters**:
	// *{string}* **sessionID** the name of the session to
	// be deleted
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	deleteSession : function(success, error, sessionId) {
		
		var connector = this;
		
		connector._iterate( {
			method : connector._deleteSession,
			methodNode : connector._deleteSessionNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.session.replace(/\/$/, '');

				if (sessionId) {
					u += "/" + sessionId;
				}
				
				return u;
			},
			args : {
				auth : this.options.auth,
			},
			urlIndex : 0
		});
	}, // end of deleteSession

	_deleteSession : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : 'DELETE'
		});
	}, // end of _deleteSession

	_deleteSessionNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : 'DELETE',
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
	}, // end of _deleteSessionNode

	/* TODO available at Stanbol in near future
	// ### appendOntology(destination, ontURI, success, error, options)
	// @author mere01
	// appends an ontology to the specified destination. This 
	// destination can be the ID of a scope or of a session.
	// The options parameter must specify 'loc' to be either
	// 'session' or 'scope' accordingly. If it is set to
	// 'scope', the ontology will be loaded into the custom
	// space of the scope denoted by **destination**. 
	// If it is set to 'session', the ontology will be 
	// appended to the session denoted by **destination**.
	// **Parameters**:
	// *{string}* **destination** the ID of the session or
	// 		the scope to which the ontology will be appended
	// *{string}* **ontURI** the URI of the ontology to
	// be loaded into the destination. Can be either
	// an absolute URL, pointing to some ontology on the
	// web, or the name of an ontology in stanbol.
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Must contain the
	//		key 'loc' with a value of either 'session' or
	//		'scope'. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	appendOntology : function(destination, ontURI, success, error,
		options) {
							
		// curl -i -X POST -F url=<ontology>
		// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/session/<id>
							
		// curl -X POST -F "url=<ontology>"
		// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/myScope

		options = (options) ? options : false;
							
		if (!options) {
			return "options parameter 'loc' must be set to" +
				"either 'session' or 'scope'";
		}
							
		var loc = options.loc;
							
		if (! (loc === "session" || loc === "scope") ) {
			return "options parameter 'loc' must be set to" +
				"either 'session' or 'scope'";
		}

		var connector = this;

		// we want to send multipart form (option -F for
		// curl), so we need a form data object
		var data = new FormData();
							
		data.append('url', ontURI);
				

		connector._iterate( {
			method : connector._appendOntology,
			methodNode : connector._appendOntologyNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
									
				// decide where to load the ontology
				if (loc === "session") {
					u += this.options.ontonet.session.replace(/\/$/, '');
				} else {
					u += this.options.ontonet.scope.replace(/\/$/, '');
				}
									
				u += "/" + destination;
									
				return u;
			},
			args : {
				auth : this.options.auth,
				// data : {url: ontologyURI},
				data : data,
				options : options
			},
			urlIndex : 0
			});

			}, // end of appendOntology
	*/ 

	_appendOntology : function(url, args, success, error) {
		
		$.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : "POST",
			data : args.data,
			contentType : false,
			processData : false,
			cache : false	
		});
	}, // end of _appendOntology

	_appendOntologyNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			body : args.data,
			uri : url,
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
	}, // end of _appendOntology
	
	// ### updateScopes(sessionID, success, error, options)
	// @author mere01
	// If scopes are specified in the **options** parameter,
	// they are appended to the specified session. All
	// scopes that are not specified in the **options**
	// parameter will be automatically detached from the session.
	// If no scopes are specified (empty **options** argument),
	// then all scopes will be detached from the specified session. 
	// The session must be existing. It is possible to specify multiple scopes 
	// at once.
	// **Parameters**:
	// *{string}* **sessionID** the ID of the session
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options.
	// Specify 'scope : <scopeID>' to append a specific
	// scope to the session. To pass several scopes at once,
	// specify 'scope : [ <scopeID_1>, <scopeID_2>, ... ]'
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	updateScopes : function(sessionID, success, error,
								options) {
							
		// curl -i -X POST -F scope=<scope>
		// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/session/<id>
							
		// submit several scopes at once:
		// curl -i -X POST 
		// 		-F scope=<scope1> 
		// 		-F scope=<scope2> 
		//	 	http://lnv-89012.dfki.uni-sb.de:9001/ontonet/session/<sessionID>

		options = (options) ? options : {};
		var scope = (options.scope) ? options.scope : false;
		
		var connector = this;

		var data = false;
		
		if (scope) {
			
			data = new FormData();
			
			if (Object.prototype.toString.apply(scope) === '[object Array]') {
				// in case we got a list of scopes:
				for(var i=0, len=scope.length; i < len; i++){
					data.append('scope', scope[i]);	
				}
				
			}
			else {
				data.append('scope', scope);
			}
		}
		
		connector._iterate( {
			method : connector._updateScopes,
			methodNode : connector._updateScopesNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(
						/\/$/, '');
				u += this.options.ontonet.urlPostfix
				.replace(/\/$/, '');
				u += this.options.ontonet.session.replace(
						/\/$/, '');
				u += "/" + sessionID;
				
				return u;
			},
			args : {
				auth : this.options.auth,
				data : data,
				options : options
			},
			urlIndex : 0
		});
		
	}, // end of updateScopes

	_updateScopes : function(url, args, success, error) {

		if (args.data) {
			$.ajax( {
				beforeSend : function(req) {
		            req.setRequestHeader('Authorization', args.auth);
		          },
				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data,
				contentType : false,
				processData : false,
				cache : false
				
			});
		} else {
			// in case no scopes were specified, we do a simple POST without arguments
			$.ajax( {
				beforeSend : function(req) {
		            req.setRequestHeader('Authorization', args.auth);
		          },
				success : success,
				error : error,
				url : url,
				type : "POST"
			});
		}
	}, // end of _updateScopes

	_updateScopesNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			data : args.data,
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
	}, // end of _updateScopesNode
	
						
	// ### detachOntology(sessionID, ontURI, success, error, options)
	// @author mere01
	// removes an ontology from the specified session.
	// **Parameters**:
	// *{string}* **sessionID** the ID of the session
	// *{string}* **ontURI** the URI of the ontology to
	// be detached from the specified session.
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Not specified here.
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	detachOntology : function(sessionID, ontURI, success, error,
			options) {
		
		// curl -X DELETE
		// http://<stanbol>/ontonet/session/<mysession>/<someOntology>
		
		options = (options) ? options : {};
				
		var connector = this;
		
		connector._iterate( {
			method : connector._detachOntology,
			methodNode : connector._detachOntologyNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.session.replace(/\/$/, '');
				u += "/" + sessionID + "/";
				
				u += ontURI;
				
				return u;
			},
			args : {
				auth : this.options.auth,
			},
			urlIndex : 0
		});
		
	}, // end of detachOntology
	
	_detachOntology : function(url, args, success, error) {

		$.ajax( {
			beforeSend : function(req) {
	            req.setRequestHeader('Authorization', args.auth);
	          },
			success : success,
			error : error,
			url : url,
			type : "DELETE"
		});
	}, // end of _detachOntology

	_detachOntologyNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "DELETE",
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
	}, // end of _detachOntologyNode

					
						
	// ### getSession(sessionID, success, error, options)
	// @author mere01
	// retrieves the specified session from the
	// ontonet/session endpoint. The session must be existing.
	// **Parameters**:
	// *{string}* **sessionID** the name of the session
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options: You may
	// specify the accepttype. Specify 'accept : <type>', where <type> is one
	// of the following: application/owl+xml, 
	// application/rdf+json, application/rdf+xml, 
	// application/x-turtle, text/owl-functional, 
	// text/owl-manchester, text/plain, text/rdf+n3, 
	// text/rdf+nt, text/turtle. 
	// In case nothing is specified, 'text/turtle' will be
	// used. 
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	getSession : function(sessionID, success, error, options) {

		options = (options) ? options : {};
		var connector = this;
		
		var acc = (options.accept) ? (options.accept) : "text/turtle";

		// curl -i -X GET -H "Accept: text/turtle"
		// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/pizzaScope

		connector._iterate( {
			method : connector._getSession,
			methodNode : connector._getSessionNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(/\/$/, '');
				u += this.options.ontonet.urlPostfix.replace(/\/$/, '');
				u += this.options.ontonet.session.replace(/\/$/, '');
				u += "/" + sessionID;

				return u;
			},
			args : {
				auth : this.options.auth,
				options : options,
				accept : acc
			},
			urlIndex : 0
		});
	}, // end of getSession

	_getSession : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.accept);
				xhrObj.setRequestHeader('Authorization', args.auth);
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
				
		});
	}, // end of _getSession
	
	_getSessionNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : args.accept
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
	} // end of _getSessionNode
	
	});
	
})();