// for more documentation,
// cf. http://dev.iks-project.eu:8081/factstore#
//
// createFactSchema()
// createFact()
// queryFact()
// getFactSchema()
//
// NOTE: a method for deleting facts and fact schemata is not implemented yet on
// the Stanbol side.

(function(){

    jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {
        
		//### createFactSchema(url, schema, success, error, options)
		// Allows clients to publish new fact schemata to the FactStore. Each 
    	// fact is an n-tuple where each element of that tuple defines a certain
    	// type of entity. A fact schema defines which types of entities and 
    	// their roles are part of instances of that fact. The fact schema is 
    	// sent as the PUT payload in JSON-LD format as a JSON-LD profile. The 
    	// name of the fact is given by the URL. The elements of the schema are 
    	// defined in the "@types" section of the JSON-LD "#context". Each 
    	// element is specified using a unique role name for that entity plus 
    	// the entity type specified by an URN.
		//**Parameters**: 
    	//*{string}* **url**
    	//*{string}* **schema**
		//*{function}* **success** The success callback.  
		//*{function}* **error** The error callback.  
		//*{object}* **options** Options, unused here.   
		//**Throws**:  
		//*nothing*  
		//**Returns**:  
		//*{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.  
		createFactSchema: function(url, schema, success, error, options) {
			options = (options)? options :  {};
			var connector = this;

			options.url = url;

			connector._iterate({
				method : connector._createFactSchema,
				methodNode : connector._createFactSchemaNode,
				success : success,
				error : error,
				url : function (idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.factstore.urlPostfix.replace(/\/$/, '');

					u += "/facts/" + escape(opts.url);

					return u;
				},
				args : {
					auth : this.options.auth,
					schema : schema,
					options : options
				},
				urlIndex : 0
			});
		},

		_createFactSchema : function (url, args, success, error) {
			jQuery.ajax({
				beforeSend: function(xhrObj) {
					xhrObj.setRequestHeader("Content-type", "application/json");
					xhrObj.setRequestHeader('Authorization', args.auth);
				},
				success: success,
				error: error,
				url: url,
				type: "PUT",
				data : args.schema,
				dataType: "text"
			});
		},

		_createFactSchemaNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "PUT",
				uri: url,
				body : args.schema,
				headers: {
					"Content-Type" : "application/json",
					"Data-Type": "text"
				}
			}, function(err, response, body) {
				try {
					success({results: JSON.parse(body)});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		},

		
		//### createFact(fact, success, error, options)
		// Allows clients to store a new fact according to a defined fact schema that was 
		// previously published to the FactStore. Each new fact 
		// is an n-tuple according to its schema where each tuple element 
		// identifies an entity using its unique IRI. 
		// The facts are sent as the POST payload in JSON-LD format referring to
		// the defined JSON-LD profile. The name of the fact is given by the 
		// "@profile" element of the JSON-LD object. The JSON-LD object contains
		// a list of facts under the attribute "facts" where each element of 
		// that list is an n-tuple of entity instances according to the fact 
		// schema. 
		//**Parameters**:
		//*{string}* **fact**
		//*{function}* **success** The success callback.  
		//*{function}* **error** The error callback.  
		//*{object}* **options** Options, unused here.   
		//**Throws**:  
		//*nothing*  
		//**Returns**:  
		//*{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		createFact: function(fact, success, error, options) {
			options = (options)? options :  {};
			var connector = this;

			connector._iterate({
				method : connector._createFact,
				methodNode : connector._createFactNode,
				success : success,
				error : error,
				url : function (idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.factstore.urlPostfix.replace(/\/$/, '');

					u += "/facts";

					return u;
				},
				args : {
					auth : this.options.auth,
					fact : fact,
					options : options
				},
				urlIndex : 0
			});
		},

		_createFact : function (url, args, success, error) {
			jQuery.ajax({
				beforeSend : function(req) {
		            req.setRequestHeader('Authorization', args.auth);
		          },
				success: success,
				error: error,
				url: url,
				type: "POST",
				data : args.fact,
				contentType : "application/json",
				dataType: "text"
			});
		},

		_createFactNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "POST",
				uri: url,
				body : args.fact,
				headers: {
					"Content-Type" : "application/json",
					"Data-Type": "text"
				}
			}, function(err, response, body) {
				try {
					success({results: JSON.parse(body)});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		},
		
		//###queryFact(query, success, error, options)
		// Allows clients to query stored facts of a specific type defined by 
		// the fact's schema. The clients specify the desired fact plus an 
		// arbitrary number of entities that play some role in the fact.
		// The query is specified by a JSON-LD object in the payload of the 
		// request. The query defines a "select" to specify the desired type of 
		// result to be returned in the result set. The "from" part specifies 
		// the fact type to query and the "where" clause specifies constraints 
		// to be fulfilled.
		//**Parameters**:
		//*{string}* **query**
		//*{function}* **success** The success callback.  
		//*{function}* **error** The error callback.  
		//*{object}* **options** Options, unused here.   
		//**Throws**:  
		//*nothing*  
		//**Returns**:  
		//*{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		queryFact: function(query, success, error, options) {
			options = (options)? options :  {};
			var connector = this;

			connector._iterate({
				method : connector._queryFact,
				methodNode : connector._queryFactNode,
				success : success,
				error : error,
				url : function (idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.factstore.urlPostfix.replace(/\/$/, '');

					u += "/query";

					return u;
				},
				args : {
					auth : this.options.auth,
					query : query,
					options : options
				},
				urlIndex : 0
			});
		},

		_queryFact : function (url, args, success, error) {
			jQuery.ajax({
				beforeSend : function(req) {
		            req.setRequestHeader('Authorization', args.auth);
		          },
				success: success,
				error: error,
				url: url,
				type: "POST",
				data : args.query,
				contentType : "application/json",
				dataType: "text"
			});
		},

		_queryFactNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "POST",
				uri: url,
				body : args.query,
				headers: {
					"Content-Type" : "application/json",
					"Data-Type": "text"
				}
			}, function(err, response, body) {
				try {
					success({results: JSON.parse(body)});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		},
		
		// ### getFactData(fact(Schema)Name, success, error, options)
		// @author mere01
		// This method retrieves the definition of an existing fact schema.
		// **Parameters**:
		// *{string}* **factSchemaName** The name of the fact schema to be retrieved.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** The Options, not specified here.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.getFactData({factName,factSchemaName},
		// 	function (res) { ... },
		// 	function (err) { ... },
		// });
		getFactData : function(FSname, success, error, options) {

			options = (options) ? options : {};

			var connector = this;

			connector._iterate( {
				method : connector._getFactData,
				methodNode : connector._getFactDataNode,

				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.factstore.urlPostfix.replace(/\/$/, '');

					u += "/facts/";
					u += FSname;

					return u;
				},
				args : {
					auth : this.options.auth,
					options : options
				},
				success : success,
				error : error,
				urlIndex : 0
			});
		}, // end of getFactData

		_getFactData : function(url, args, success, error) {

			jQuery.ajax( {
				beforeSend : function(req) {
		            req.setRequestHeader('Authorization', args.auth);
		          },
				success : success,
				error : error,
				url : url,
				type : "GET"
			});

		}, // end of _getFactData

		_getFactDataNode : function(url, args, success, error) {
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
		} // end of _getFactDataNode
		
		
	});

})();