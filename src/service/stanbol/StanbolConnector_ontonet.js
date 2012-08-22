//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - Ontonet service
// VIE OntoNet Service implements the interface to the ontonet endpoint; 
// the API for managinging OWL/OWL2 ontologies within stanbol.
// Once loaded internally from their remote or local resources, ontologies live 
// and are known within the realm (=scope) they were loaded in.
//
// available functions:
//
// createScope		
// getOntology		# get an ontology from a scope or from a session
// appendLibrary	# append an ontology to a session or load it into the custom space of a scope 
// getLibrary		# get a library from a scope or from a session
// getScope	
// deleteScope		
// ontoScopes		# get all scopes that live on the ontonet endpoint
// createSession	
// deleteSession
// updateScopes		# append scopes to a session while detaching all other scopes from this session
// appendOntology	# append an ontology to a session or load it into the custom space of a scope
// detachOntology	# remove and ontology from a session	
// getSession

(function() {

	jQuery
			.extend(
					true,
					VIE.prototype.StanbolConnector.prototype,
					{

						// ### createScope(scopeID, success, error, options)
						// @author mere01
						// creates a scope with the specified name. Optionally,
						// an ontology library (or even a list of libraries), or
						// an ontology (or even a list of ontologies) can 
						// be loaded on creation into the core space of the scope. 
						// A library is a collection of references to ontologies, 
						// which can be located anywhere on the web. 
						// For other options, see the description of the 
						// **options** parameter.
						// Already existing scopes cannot be overridden by this
						// function.
						// **Parameters**:
						// *{string}* **scopeID** the name of the scope to be
						// created
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options. 
						// The range of options:
						// * corereg: the physical URL of the registry 
						// ( = ontology library) that points
						// to the ontologies to be loaded into the core space.
						// This parameter overrides coreont if both are
						// specified. Might be a single string value or an array
						// of string values.
						// * coreont: the physical URL of the top ontology to be
						// loaded into the core space.
						// This parameter is ignored if corereg is specified.			????
						// Might be a single string value or an array
						// of string values.
						// * customreg: the physical URL of the registry that
						// points to the ontologies to be loaded into the custom space.
						// This parameter is optional. Overrides customont if
						// both are specified.
						// * customont: the physical URL of the top ontology to be
						// loaded into the custom space.
						// This parameter is optional. Ignored if customreg is
						// specified.
						// * activate: If true, the ontology scope will be set as
						// active upon creation.
						// This parameter is optional, default is false.
						// Note that parameters **customont** and **customreg** are
						// deprecated and will be removed in the near future
						// (Alessandro Amadou).
						// **Throws**: *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						createScope : function(scopeID, success, error, options) {

							console.log("entering function createScope for "
									+ scopeID)

							var params = [ "corereg", "coreont", //"customreg",	"customont", 
							               "activate" ];
							options = (options) ? options : {};

							var connector = this;
							// "http://<myserver>/ontonet/ontology/<scopeID>?corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks"

							// passing multiple libraries for the core space:
							// curl -i -X PUT  
							// 	http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/<scope>?corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks\&corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/Alignments
							connector
									._iterate( {
										method : connector._createScope,
										methodNode : connector._createScopeNode,
										success : success,
										error : error,
										url : function(idx, opts) {


											var u = this.options.url[idx]
													.replace(/\/$/, '');
											u += this.options.ontonet.urlPostfix
													.replace(/\/$/, '');
											u += this.options.ontonet.scope
													.replace(/\/$/, '');
											u += "/" + scopeID;

											if (Object.keys(options).length != 0) {
												u += "?";
											}
											// build up our list of parameters
											var counter = 0;
											for (var key in options) {
												console
														.log("iterating over keys in options, key: "
																+ key)

												if (key === "corereg") {
													// this might be a list
													
													var value = options[key];
													if (Object.prototype.toString.apply(value) === '[object Array]') {
													// if we got a list of registries / libraries:
														for(var i=0, len=value.length; i < len; i++){
															u += key + "=" + value[i] + "&";	// TODO do we need to escape the & ?
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
																u += key + "=" + value[i] + "&";	// TODO do we need to escape the & ?
															}
															
														} else {
															u += key + "=" + value + "&";
														}
													
													
												} else if (($.inArray(key,
														params)) != -1) {

													if (counter != 0) {
														u += "&";	// TODO is this necessary?
													}
//													console
//															.log("key "
//																	+ key
//																	+ " is contained in list of admissible params")
													u += key + "="
															+ options[key];
												} else {
													console
															.log("illegal parameter "
																	+ key
																	+ " was specified to function createScope.")
												}

												counter += 1;
											}
											return u.replace('&&', '&');
										},
										args : {
											// content: content,
										options : options
									},
									urlIndex : 0
									});
						}, // end of createScope

						_createScope : function(url, args, success, error) {
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : "PUT"
							// data : args.content,
									// contentType : "text/plain"
									});
						}, // end of _createScope

						_createScopeNode : function(url, args, success, error) {
							var request = require('request');
							var r = request( {
								method : "PUT",
								uri : url,
								body : args.content,
								headers : {
									Accept : "application/rdf+xml",
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
						}, // end of _createScopeNode

											
						
						
						// ### appendLibrary(destination, libURI, success,
						// error, options)
						// @author mere01
						// loads the specified library into specified destination.
						// This destination can be the ID of a scope or of a session.
						// The options parameter must specify 'loc' to be either
						// 'session' or 'scope' accordingly. If it is set to
						// 'scope', the library will be loaded into the custom
						// space of the scope denoted by the **destination**. 
						// If it is set to 'session', the library will be 
						// appended to the session denoted by the **destination**.
						// **Parameters**:
						// *{string}* **destination** the ID of the scope or session
						// *{string}* **libraryURI** the URI of the library
						// to be loaded into the destination.
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options Must contain the
						//		key 'loc' with a value of either 'session' or
						//		'scope'. 
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
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									// decide where to load the ontology
									if (loc === "session") {
										u += this.options.ontonet.session.replace(
												/\/$/, '');
									} else {
										u += this.options.ontonet.scope.replace(
												/\/$/, '');
									}
									
									u += "/" + destination;

									return u;
								},
								args : {
									// data : {url: ontologyURI},
									data : data,
									options : options
								},
								urlIndex : 0
							});
						}, // end of appendLibrary

						_appendLibrary : function(url, args, success, error) {

							$.ajax( {
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
								body : args.content,
								headers : {
									Accept : "application/rdf+xml",
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
						}, // end of _appendLibraryNode

						// ### getScope(scopeID, success, error, options)
						// @author mere01
						// retrieves the specified scope from the
						// ontonet/ontology endpoint. The
						// scope must be existing.
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
						getScope : function(scopeID, success, error, options) {

							options = (options) ? options : {};
							var connector = this;
							// curl -H "Accept:text/turtle"
							// http://<server>/ontonet/ontology/<scope>

							connector._iterate( {
								method : connector._getScope,
								methodNode : connector._getScopeNode,
								success : success,
								error : error,
								url : function(idx, opts) {
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									u += this.options.ontonet.scope.replace(
											/\/$/, '');
									u += "/" + scopeID;

									return u;
								},
								args : {
									options : options
								},
								urlIndex : 0
							});
						}, // end of getScope

						_getScope : function(url, args, success, error) {
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : "GET",
								accepts : {
									"text/turtle" : "text/turtle"
								}

							});
						}, // end of _getScope

						_getScopeNode : function(url, args, success, error) {
							var request = require('request');
							var r = request( {
								method : "GET",
								uri : url,
								// body : args.content,
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
							// curl -H "Accept:application/rdf+xml"
							// http://<server>/ontonet/ontology/<scope>/<ontology>
							// oder
							// curl -H "Accept:text/turtle"
							// http://<server>/ontonet/ontology/<scope>/<ontology>

							connector._iterate( {
								method : connector._getOntology,
								methodNode : connector._getOntologyNode,
								success : success,
								error : error,
								url : function(idx, opts) {
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									// decide where to load the ontology
									if (loc === "session") {
										u += this.options.ontonet.session.replace(
												/\/$/, '');
									} else {
										u += this.options.ontonet.scope.replace(
												/\/$/, '');
									}
									
									u += "/" + id;

									return u;
								},
								args : {
									options : options
								},
								urlIndex : 0
							});
						}, // end of getOntology

						_getOntology : function(url, args, success, error) {
							jQuery
									.ajax( {
										success : success,
										error : error,
										url : url,
										type : "GET",
										accepts : {
											"application/rdf+xml" : "application/rdf+xml"
										}

									});
						}, // end of _getOntology

						_getOntologyNode : function(url, args, success, error) {
							var request = require('request');
							var r = request( {
								method : "GET",
								uri : url,
								// body : args.content,
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
						}, // end of _getOntologyNode
						
						// ### getLibrary(id, libraryID, success, errror,
						// options)
						// @author mere01
						// retrieves the specified library from the
						// ontonet/ endpoint, i.e. from the specific
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
							// curl -H "Accept:application/rdf+xml"
							// http://<server>/ontonet/ontology/<scope>/<Library>
							// oder
							// curl -H "Accept:text/turtle"
							// http://<server>/ontonet/ontology/<scope>/<Library>

							connector._iterate( {
								method : connector._getLibrary,
								methodNode : connector._getLibraryNode,
								success : success,
								error : error,
								url : function(idx, opts) {
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									// decide where to load the ontology
									if (loc === "session") {
										u += this.options.ontonet.session.replace(
												/\/$/, '');
									} else {
										u += this.options.ontonet.scope.replace(
												/\/$/, '');
									}
									
									u += "/" + id;

									return u;
								},
								args : {
									options : options
								},
								urlIndex : 0
							});
						}, // end of getLibrary

						_getLibrary : function(url, args, success, error) {
							jQuery
									.ajax( {
										success : success,
										error : error,
										url : url,
										type : "GET",
										accepts : {
											"application/rdf+xml" : "application/rdf+xml"
										}

									});
						}, // end of _getLibrary

						_getLibraryNode : function(url, args, success, error) {
							var request = require('request');
							var r = request( {
								method : "GET",
								uri : url,
								// body : args.content,
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
						}, // end of _getLibraryNode

						// ### deleteScope(scopeID, success, errror, options)
						// @author mere01
						// deletes a complete scope from the ontonet/ontology
						// endpoint. If
						// scopeID is
						// specified to be null, then *all* scopes will be
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
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									u += this.options.ontonet.scope.replace(
											/\/$/, '');
									u += "/" + scope;

									return u;
								},
								args : {
									options : options
								},
								urlIndex : 0
							});
						}, // end of deleteScope

						_deleteScope : function(url, args, success, error) {
							jQuery.ajax( {
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
						// This method returns an RDF document that lists all
						// scopes that are
						// currently
						// registered and/or (in)active ontology scopes of the
						// ontonet/ontology/
						// endpoint.
						// **Parameters**:
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options. Specify e.g. {
						// 'inactive' : false }
						// if you want the inactive scopes to be omitted
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
//							console.log("options:")
//							console.log(options)
							var connector = this;

							connector
									._iterate( {
										method : connector._ontoScopes,
										methodNode : connector._ontoScopesNode,
										success : success,
										error : error,
										url : function(idx, opts) {

											inactive = (options.inactive) ? options.inactive
													: 'true';
											console.log("inactive? = " + inactive)

											var u = this.options.url[idx]
													.replace(/\/$/, '');
											u += this.options.ontonet.urlPostfix;
											u += this.options.ontonet.scope
													.replace(/\/$/, '');
											u += "?with-inactive=" + inactive;

											return u;
										},
										args : {
											format : "application/rdf+xml"
										},
										urlIndex : 0
									});
						}, // end of ontoScopes()

						_ontoScopes : function(url, args, success, error) {
							jQuery
									.ajax( {
										success : success,
										error : error,
										url : url,
										type : "GET",
										accepts : {
											"application/rdf+xml" : "application/rdf+xml"
										}
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

						// ### createSession(success, error, sessionId)
						// @author mere01
						// creates a session on the ontonet/session/ endpoint.
						// Optionally, a
						// session id
						// can be specified. If no id is specified //TODO, an id
						// is created
						// automatically.
						// Already existing sessions cannot be overridden by
						// this function (will
						// result
						// in a '409 Conflict').
						// **Parameters**:
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{string}* **sessionID** the name of the session to
						// be created
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

									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									u += this.options.ontonet.session.replace(
											/\/$/, '');

									if (sessionId) {
										u += "/" + sessionId;
									}

									return u;
								},
								args : {
									// content: content,
								// options : options
								verb : verb
							},
							urlIndex : 0
							});
						}, // end of createSession

						_createSession : function(url, args, success, error) {
							console.log("using verb " + args.verb);
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : args.verb
							// data : args.content,
									// contentType : "text/plain"
									});
						}, // end of _createSession

						_createSessionNode : function(url, args, success, error) {
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

									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									u += this.options.ontonet.session.replace(
											/\/$/, '');

									if (sessionId) {
										u += "/" + sessionId;
									}

									return u;
								},
								args : {
								// content: content,
								// options : options
								// verb : verb
								},
								urlIndex : 0
							});
						}, // end of deleteSession

						_deleteSession : function(url, args, success, error) {
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : 'DELETE'
							// data : args.content,
									// contentType : "text/plain"
									});
						}, // end of _deleteSession

						_deleteSessionNode : function(url, args, success, error) {
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
						}, // end of _deleteSessionNode

						// ### appendOntology(destination, ontURI, success, error,
						// options)
						// @author mere01
						// appends an ontology to the specified destination. This 
						// destination can be the ID of a scope or of a session.
						// The options parameter must specify 'loc' to be either
						// 'session' or 'scope' accordingly. If it is set to
						// 'scope', the ontology will be loaded into the custom
						// space of the scope denoted by the **destination**. 
						// If it is set to 'session', the ontology will be 
						// appended to the session denoted by the **destination**.
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
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									
									// decide where to load the ontology
									if (loc === "session") {
										u += this.options.ontonet.session.replace(
												/\/$/, '');
									} else {
										u += this.options.ontonet.scope.replace(
												/\/$/, '');
									}
									
									u += "/" + destination;
									
									return u;
								},
								args : {
									// data : {url: ontologyURI},
									data : data,
									options : options
								},
								urlIndex : 0
							});

						}, // end of appendOntology

						_appendOntology : function(url, args, success, error) {

							$.ajax( {
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
								data : args.data,
								uri : url,
								body : args.content,
								headers : {
									Accept : "application/rdf+xml",
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
						}, // end of _appendOntology
						
						// ### updateScopes(sessionID, success, error,
						// options)
						// @author mere01
						// If scopes are specified in the **options** parameter,
						// they are appended to the specified session. All
						// scopes that are not specified in the **options**
						// parameter will be automatically detached from the
						// session.
						// If no scopes are specified (empty **options** argument),
						// then all scopes will be detached from the specified
						// session. 
						// The session must be existing. It is possible
						// to specify multiple scopes at once.
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

							console.log("appendToSession received:")
							console.log("scope: " + scope)

							var connector = this;

							// prepare multipart form (option -F for curl)
							var data = new FormData();
							
							if (scope) {
								
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
									// data : {url: ontologyURI},
									data : data,
									options : options
								},
								urlIndex : 0
							});

						}, // end of updateScopes

						_updateScopes : function(url, args, success, error) {

							$.ajax( {
								success : success,
								error : error,
								url : url,
								type : "POST",
								data : args.data,
								contentType : false,
								processData : false,
								cache : false
					
								
							});
						}, // end of _updateScopes

						_updateScopesNode : function(url, args, success,
								error) {
							var request = require('request');
							var r = request( {
								method : "POST",
								data : args.data,
								uri : url,
								body : args.content,
								headers : {
									Accept : "application/rdf+xml",
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
						}, // end of _updateScopesNode
						
						
						// ### detachOntology(sessionID, ontURI, success, error,
						// options)
						// @author mere01
						// removes an ontology from the specified session.
						// **Parameters**:
						// *{string}* **sessionID** the ID of the session
						// *{string}* **ontURI** the URI of the ontology to
						// be detached from the session.
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
									var u = this.options.url[idx].replace(
											/\/$/, '');
									u += this.options.ontonet.urlPostfix
											.replace(/\/$/, '');
									u += this.options.ontonet.session.replace(
											/\/$/, '');
									u += "/" + sessionID + "/";
								
									u += ontURI;

									return u;
								},
								args : {
								// options : options
								},
								urlIndex : 0
							});

						}, // end of detachOntology

						_detachOntology : function(url, args, success, error) {

							$.ajax( {
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
								uri : url,
								body : args.content,
								headers : {
									Accept : "application/rdf+xml",
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
						}, // end of _detachOntologyNode

					
						
						
						// ### getSession(sessionID, success, error, options)
						// @author mere01
						// retrieves the specified session from the
						// ontonet/session endpoint. The
						// session must be existing.
						// **Parameters**:
						// *{string}* **sessionID** the name of the session
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options (not specified here)
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						getSession : function(sessionID, success, error,
								options) {

							options = (options) ? options : {};
							var connector = this;
							// curl -i -X GET -H "Accept: text/turtle"
							// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/pizzaScope

							connector._iterate( {
								method : connector._getSession,
								methodNode : connector._getSessionNode,
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
									options : options
								},
								urlIndex : 0
							});
						}, // end of getSession

						_getSession : function(url, args, success, error) {
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : "GET",
								accepts : {
									"text/turtle" : "text/turtle"
								}

							});
						}, // end of _getSession

						_getSessionNode : function(url, args, success, error) {
							var request = require('request');
							var r = request( {
								method : "GET",
								uri : url,
								// body : args.content,
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
						} // end of _getSessionNode

					});

})();