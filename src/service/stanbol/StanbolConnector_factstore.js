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
(function(){

    jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {
        
		//### createFactSchema(url, schema, success, error, options)
		//TODO.  
		//**Parameters**:  
		//TODO
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
					url : url,
					schema : schema,
					options : options
				},
				urlIndex : 0
			});
		},

		_createFactSchema : function (url, args, success, error) {
			jQuery.ajax({
				success: success,
				error: error,
				url: url,
				type: "PUT",
				data : args.schema,
				contentType : "application/json",
				dataType: "application/json"
			});
		},

		_createFactSchemaNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "PUT",
				uri: url,
				body : args.schema,
				headers: {
					Accept: "application/json",
					"Content-Type" : "application/json"
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
					fact : fact,
					options : options
				},
				urlIndex : 0
			});
		},

		_createFact : function (url, args, success, error) {
			jQuery.ajax({
				success: success,
				error: error,
				url: url,
				type: "POST",
				data : args.fact,
				contentType : "application/json",
				dataType: "application/json"
			});
		},

		_createFactNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "POST",
				uri: url,
				body : args.fact,
				headers: {
					Accept: "application/json",
					"Content-Type" : "application/json"
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
					query : query,
					options : options
				},
				urlIndex : 0
			});
		},

		_queryFact : function (url, args, success, error) {
			jQuery.ajax({
				success: success,
				error: error,
				url: url,
				type: "POST",
				data : args.query,
				contentType : "application/json",
				dataType: "application/json"
			});
		},

		_queryFactNode: function(url, args, success, error) {
			var request = require('request');
			var r = request({
				method: "POST",
				uri: url,
				body : args.query,
				headers: {
					Accept: "application/json",
					"Content-Type" : "application/json"
				}
			}, function(err, response, body) {
				try {
					success({results: JSON.parse(body)});
				} catch (e) {
					error(e);
				}
			});
			r.end();
		}
	});

})();