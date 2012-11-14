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
                
		// ### sparql(query, success, error, options)
		// TODO.  
		// **Parameters**:  
		// TODO
		// *{function}* **success** The success callback.  
		// *{function}* **error** The error callback.  
		// *{object}* **options** Options, unused here.   
		// **Throws**:  
		// *nothing*  
		// **Returns**:  
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.  
	     sparql: function(query, success, error, options) {
	     	options = (options)? options :  {};
	         var connector = this;
	      	
	      	connector._iterate({
	          	method : connector._sparql,
	          	methodNode : connector._sparqlNode,
	          	success : success,
	          	error : error,
	          	url : function (idx, opts) {
	                var u = this.options.url[idx].replace(/\/$/, '');
	                u += this.options.sparql.urlPostfix.replace(/\/$/, '');
	              
	      		    return u;
	          	},
	          	args : {
	          		query : query,
	          		options : options
	          	},
	          	urlIndex : 0
	          });
	      },
	      
	      _sparql : function (url, args, success, error) {
	      	jQuery.ajax({
	              success: success,
	              error: error,
	              url: url,
	              type: "POST",
	              data : "query=" + args.query,
	              contentType : "application/x-www-form-urlencoded"
	          });
	      },

	      _sparqlNode: function(url, args, success, error) {
	          var request = require('request');
	          var r = request({
	              method: "POST",
	              uri: url,
	              body : JSON.stringify({query : args.query}),
	              headers: {
	                  Accept: args.format
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