//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - Ontonet service
// VIE OntoNet Service implements the interface to the ontonet endpoint; 
// the API for managinging OWL/OWL2 ontologieswithin stanbol.
// Once loaded internally from their remote or local resources, ontologies live and are known 
// within the realm (=scope) they were loaded in.
(function() {

	jQuery
			.extend(
					true,
					VIE.prototype.StanbolConnector.prototype,
					{

						// ### loadScope(scopeID, success, error, options)
						// @author mere01
						// creates a scope with the specified name. Optionally,
						// an ontology
						// library can be loaded on creation. A library is a
						// collection of references to ontologies, which can be
						// located anywhere
						// on the web. For other options, see description of the
						// **options**
						// parameter
						// Already existing scopes cannot be overridden by this
						// function.
						// **Parameters**:
						// *{string}* **scopeID** the name of the scope to be
						// created
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options. Specify e.g. 'lib:
						// <libID>' in order
						// to load a specific ontology library on creating the
						// scope. The range
						// of options:
						// corereg: the physical URL of the registry that points
						// to the
						// ontologies to be loaded into the core space.
						// This parameter overrides coreont if both are
						// specified.
						// coreont: the physical URL of the top ontology to be
						// loaded into the
						// core space.
						// This parameter is ignored if corereg is specified.
						// customreg: the physical URL of the registry that
						// points to the
						// ontologies to be loaded into the custom space.
						// This parameter is optional. Overrides customont if
						// both are
						// specified.
						// customont: the physical URL of the top ontology to be
						// loaded into the
						// custom space.
						// This parameter is optional. Ignored if customreg is
						// specified.
						// activate: If true, the ontology scope will be set as
						// active upon
						// creation.
						// This parameter is optional, default is false.< /td>
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						loadScope : function(scopeID, success, error, options) {
							// TODO: rename createScope

							console.log("entering function loadScope for "
									+ scopeID)

							var params = [ "corereg", "coreont", "customreg",
									"customont", "activate" ];
							options = (options) ? options : {};

							var connector = this;
							// "http://<myserver>/ontonet/ontology/<scopeID>?corereg=http://stanbol.apache.org/ontologies/registries/stanbol_network/SocialNetworks"

							connector
									._iterate( {
										method : connector._loadScope,
										methodNode : connector._loadScopeNode,
										success : success,
										error : error,
										url : function(idx, opts) {

											var lib = options.lib;

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
											for ( var key in options) {
												console
														.log("iterating over keys in options, key: "
																+ key)

												if (lib) {
													u += "corereg=" + lib + "&";
												} else if (($.inArray(key,
														params)) != -1) {

													if (counter != 0) {
														u += "&";
													}
													console
															.log("key "
																	+ key
																	+ " is contained in list of admissible params")
													u += key + "="
															+ options[key];
												} else {
													console
															.log("illegal parameter "
																	+ key
																	+ " was specified to function loadScope.")
												}

												counter += 1;
											}
											return u;
										},
										args : {
											// content: content,
										options : options
									},
									urlIndex : 0
									});
						}, // end of loadScope

						_loadScope : function(url, args, success, error) {
							jQuery.ajax( {
								success : success,
								error : error,
								url : url,
								type : "PUT"
							// data : args.content,
									// contentType : "text/plain"
									});
						}, // end of _loadScope

						_loadScopeNode : function(url, args, success, error) {
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
						}, // end of _loadScopeNode

						// ### loadOntology(scopeID, ontologyURI, success,
						// error, options)
						// @author mere01
						// loads the specified ontology into the custom space of
						// the specified
						// scope. The scope must be existing.
						// **Parameters**:
						// *{string}* **scopeID** the ID of the scope
						// *{string}* **ontologyURI** the URI of the ontology to
						// be loaded into
						// the scope.
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options (not specified here)
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						loadOntology : function(scopeID, ontologyURI, success,
								error, options) {

							options = (options) ? options : {};
							var connector = this;
							// curl -i -X POST -data
							// (
							// "http://ontologydesignpatterns.org/ont/iks/kres/omv.owl"
							// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/melaniesScope
							// )
							// curl -X POST -F
							// "url=http://ontologydesignpatterns.org/ont/iks/kres/omv.owl"
							// http://localhost:8080/ontonet/ontology/myScope

							// we want to send multipart form (option -F for
							// curl), so we need a
							// form data object
							var data = new FormData();
							data.append('url', ontologyURI);
							console.log("the FormData object:")
							console.log(data)

							connector._iterate( {
								method : connector._loadOntology,
								methodNode : connector._loadOntologyNode,
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
									// data : {url: ontologyURI},
									data : data,
									options : options
								},
								urlIndex : 0
							});
						}, // end of loadOntology

						_loadOntology : function(url, args, success, error) {

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
						}, // end of _loadOntology

						_loadOntologyNode : function(url, args, success, error) {
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
						}, // end of _loadOntologyNode

						// ### getScope(scopeID, success, error, complete,
						// options)
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
						getScope : function(scopeID, success, error, complete,
								options) {

							options = (options) ? options : {};
							var connector = this;
							// curl -H "Accept:text/turtle"
							// http://<server>/ontonet/ontology/<scope>

							connector._iterate( {
								method : connector._getScope,
								methodNode : connector._getScopeNode,
								success : success,
								error : error,
								complete : complete,
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

						_getScope : function(url, args, success, error,
								complete) {
							jQuery.ajax( {
								success : success,
								error : error,
								complete : complete,
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

						// ### getOntology(scopeID, ontologyID, success, errror,
						// options)
						// @author mere01
						// retrieves the specified scope from the
						// ontonet/ontology endpoint. The
						// scope must be existing.
						// **Parameters**:
						// *{string}* **scopeID** the ID of the scope
						// *{string}* **ontologyID** the ID of the ontology to
						// be retrieved
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options (not specified here)
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						getOntology : function(scopeID, ontologyID, success,
								error, options) {

							options = (options) ? options : {};
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
									u += this.options.ontonet.scope.replace(
											/\/$/, '');
									u += "/" + scopeID;
									u += "/" + ontologyID;

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
							console.log("options:")
							console.log(options)
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
											console.log(inactive)

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

						// ### appendToSession(sessionID, success, error,
						// options)
						// @author mere01
						// appends an ontology and/or a scope to the specified
						// session. The session must be existing.
						// **Parameters**:
						// *{string}* **sessionID** the ID of the session
						// *{string}* **ontologyURI** the URI of the ontology to
						// be loaded into
						// the session.
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options.
						// Specify 'ont : <ontologyURI>' to append a specific
						// ontology to the session. <ontologyURI> can be either
						// an absolute URL, pointing to some ontology on the
						// web, or the name of an ontology in stanbol.
						// Specify 'scope : <scopeID>' to append a specific
						// scope to the session. (Both can be combined within
						// the option object).
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						// OR, if neither scope nor ont is specified in options,
						// an error message as a string.
						appendToSession : function(sessionID, success, error,
								options) {

							// curl -i -X POST -F scope=<scope>
							// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/session/<id>
							// curl -i -X POST -F url=<ontology>
							// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/session/<id>

							options = (options) ? options : {};
							var scope = (options.scope) ? options.scope : false;
							var ont = (options.ont) ? options.ont : false;

							console.log("appendToSession received:")
							console.log("scope: " + scope)
							console.log("ont: " + ont)

							if (!(scope || ont)) {
								var msg = "Must specify one of the two options 'ont' or 'scope' in order to append either an ontology or a scope to session ";
								console.log(msg + session)
								return msg + session;
							}

							var connector = this;

							// we want to send multipart form (option -F for
							// curl), so we need a
							// form data object
							var data = new FormData();
							if (ont) {
								data.append('url', ont);
							}
							if (scope) {
								data.append('scope', scope);
							}

							connector._iterate( {
								method : connector._appendToSession,
								methodNode : connector._appendToSessionNode,
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

						}, // end of appendToSession

						_appendToSession : function(url, args, success, error) {

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
						}, // end of _appendToSession

						_appendToSessionNode : function(url, args, success,
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
						}, // end of _appendToSessionNode
						// ### undockFromSession(sessionID, success, error,
						// options)
						// @author mere01
						// removes an ontology and/or a scope from the specified
						// session.
						// **Parameters**:
						// *{string}* **sessionID** the ID of the session
						// *{string}* **ontologyURI** the URI of the ontology to
						// be loaded into
						// the session.
						// *{function}* **success** The success callback.
						// *{function}* **error** The error callback.
						// *{object}* **options** Options. Specify 'ont :
						// <ontologyURI>' to remove a specific
						// ontology from the session. Specify 'scope :
						// <scopeID>'} to remove a specific
						// scope from the session. (Only one of both can be
						// specified in the options object)
						// **Throws**:
						// *nothing*
						// **Returns**:
						// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
						// instance itself.
						// OR, if neither scope nor ont is specified in options,
						// an error message as a string.
						undockFromSession : function(sessionID, success, error,
								options) {

							// curl -X DELETE
							// http://<stanbol>/ontonet/session/<mysession>/<someOntology>
							// curl -X DELETE
							// http://<stanbol>/ontonet/session/<mySession>?scopeid=<someScope>
							options = (options) ? options : {};
							var scope = (options.scope) ? options.scope : false;
							var ont = (options.ont) ? options.ont : false;

							if (!(scope || ont)) {
								var msg = "Must specify one of the two options 'ont' or 'scope' in order to remove either an ontology or a scope from session ";
								console.log(msg + session)
								return msg + session;
							}

							if (scope && ont) {
								var msg = "Can only specify one of the two options 'ont' or 'scope' in order to remove either an ontology or a scope from session ";
								console.log(msg + session)
								return msg + session;
							}

							var connector = this;

							connector._iterate( {
								method : connector._undockFromSession,
								methodNode : connector._undockFromSessionNode,
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

									if (ont) {
										u += ont;
									}
									if (scope) {
										u += "?scopeid=" + scope;
									}

									return u;
								},
								args : {
								// options : options
								},
								urlIndex : 0
							});

						}, // end of undockFromSession

						_undockFromSession : function(url, args, success, error) {

							$.ajax( {
								success : success,
								error : error,
								url : url,
								type : "DELETE"
							});
						}, // end of _undockFromSession

						_undockFromSessionNode : function(url, args, success,
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
						}, // end of _undockFromSessionNode

						// ### getSession(sessionID, success, error, complete,
						// options)
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
								complete, options) {

							options = (options) ? options : {};
							var connector = this;
							// curl -i -X GET -H "Accept: text/turtle"
							// http://lnv-89012.dfki.uni-sb.de:9001/ontonet/ontology/pizzaScope

							connector._iterate( {
								method : connector._getSession,
								methodNode : connector._getSessionNode,
								success : success,
								error : error,
								complete : complete,
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

						_getSession : function(url, args, success, error,
								complete) {
							jQuery.ajax( {
								success : success,
								error : error,
								complete : complete,
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