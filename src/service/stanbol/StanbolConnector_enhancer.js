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
// analyze()
// enhancers()
// getExecutionPlan()
// 
(function(){
	
	jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {
	    
		// ### analyze(text, success, error, options)
		// This method sends the given text to Apache Stanbol returns the result by the success callback.  
		// **Parameters**:  
		// *{string}* **text** The text to be analyzed.  
		// *{function}* **success** The success callback.  
		// *{function}* **error** The error callback.  
		// *{object}* **options** Options, like the ```format```, or the ```chain``` to be used.
		//		if no options.format is specified, then "application/rdf+json" is used,
		//		if no options.accept is specified, then "application/rdf+json" is used,
		//		if no options.contentType is specified, then "text/html; charset=UTF-8" is used.
		// *{object}* **params** query parameters and/or multipart contentitem 
		// parameters. Can be one of the following:
		// - uri={content-item-uri}: By default the URI of the content item being enhanced is a local, non de-referencable URI automatically built out of a hash digest of the binary content. Sometimes it might be helpful to provide the URI of the content-item to be used in the enhancements RDF graph. uri request parameter
		// - executionmetadata=true/false: Allows the include of execution metadata in the response. Such data include the ExecutionPlan as provided by the enhancement chain as well as information about the actual execution of that plan. The default value is false.
		// - outputContent=[mediaType]: Allows to specify the Mimetypes of content included within the Response of the Stanbol Enhancer. This parameter supports wild cards (e.g. '*' ... all, 'text/*'' ... all text versions, 'text/plain' ... only the plain text version). This parameter can be used multiple times.
		// - omitParsed=[true/false]: Makes only sense in combination with the outputContent parameter. This allows to exclude all content included in the request from the response. A typical combination is outputContent=*/*&omitParsed=true. The default value of this parameter is false
		// - outputContentPart=[uri/'*']: This parameter allows to explicitly include content parts with a specific URI in the response. Currently this only supports ContentParts that are stored as RDF graphs.
		//   See the developer documentation for ContentItems for more information about ContentParts.
		//   Responses to requests with this parameter will be encoded as multipart/from-data. If the "Accept" header of the request is not compatible to multipart/from-data it is assumed as a # 400 BAD_REQUEST. The selected content parts will be included as MIME parts. The URI of the part will be used as name. Such parts will be added after the "metadata" and the "content" (if present).
		// - omitMetadata=[true/false]: This allows to enable/disable the inclusion of the metadata in the response. The default is false.
		//   Typically omitMetadata=true is used when users want to use the Stanbol Enhancer just to get one or more ContentParts as an response. Note that Requests that use an Accept: {mimeType} header AND omitMetadata=true will directly return the content verison of {mimeType} and NOT wrap the result as multipart/from-data
		// - rdfFormat=[rdfMimeType]: This allows for requests that result in multipart/from-data encoded responses to specify the used RDF serialization format. Supported formats and defaults are the same as for normal Enhancer Requests.
		// **Throws**:  
		// *nothing*  
		// **Returns**:  
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.  
		// **Example usage**:  
		//
		//     var stnblConn = new vie.StanbolConnector(opts);
		//     stnblConn.analyze("This is some text.",
		//                 function (res) { ... },
		//                 function (err) { ... });
	    analyze: function(text, success, error, options, params) {
	    	options = (options)? options :  {};
	    	params = (params)? params : false;
	    	
	    	console.log("options param for analyze is: ")
	    	console.log(options)
	    	
	    	var connector = this;
	        
	    	connector._iterate({
	        	method : connector._analyze,
	        	methodNode : connector._analyzeNode,
	        	url : function (idx, opts) {
	        		var chain = (opts.chain)? opts.chain : this.options.enhancer.chain;
	                
	        		var u = this.options.url[idx].replace(/\/$/, '');
	        		u += this.options.enhancer.urlPostfix.replace(/\/$/, '');
	        		u += "/chain/" + chain.replace(/\/$/, '');	        		
	        		
	        		if (params) {
	        			
	        			u += "?";
	        			
	        			for (var key in params) {
	        				var value = params[key];
	        				u += key + "=" + value + "&";
	        			
	        			}
	        			
	        			if (u.charAt(u.length - 1) == "&") {
	        				u = u.slice(0, -1);
	        			}
	        		} 
	        		
	        		return u.replace(/\/$/, '');
	        	},
	        	args : {
	        		text : text,
	        		format : options.format,// || "application/rdf+json",
	        		accept : options.accept, //  "application/rdf+json",
	        		options : options,
	        		contentType : options.contentType// "text/html; charset=UTF-8"
	        	},
	        	success : success,
	        	error : error,
	        	urlIndex : 0
	        });
	    },
	    
	    _analyze : function (url, args, success, error) {
	    	
	    	console.log("analyze() got as accept header: " + args.accept)
	    	console.log("analyze() got as dataType header: " + args.format)
	    	console.log("analyze() got as contentType header: " + args.contentType)
	    	
	    	jQuery.ajax({
	    	  beforeSend: function(xhrObj) {
	    		xhrObj.setRequestHeader("Accept", args.accept);
				xhrObj.setRequestHeader("Content-type", args.contentType);
			  },
	            success: success,
	            error: error,
	            
	            /**/
	            complete: function (xhr, status) {
					console.log("status is: " + status)
	                if (status === 'parsererror' || !xhr.responseText) {
	                	console.log("in if-case for error")
	                	console.log("xhr.responseText: " + xhr.responseText)
	                    
	                }
	                else {
	                    var data = xhr.responseText;
	                }
	            },
	            /**/
	            
	            url: url,
	            type: "POST",
	            data: args.text,
	            dataType: args.format
//	            contentType: "text/html"
	        });
	    },
	
	    _analyzeNode: function(url, args, success, error) {
	        var request = require('request');
	        var r = request({
	            method: "POST",
	            uri: url,
	            body: args.text,
	            headers: {
	                Accept: args.accept,
	                'Content-Type': 'text/plain'
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
	    
	    // ### enhancers(success, error, options)
	    // @author mere01
		// return information about the available enhancement chains and engines.
		// **Parameters**:    
		// *{function}* **success** The success callback.  
		// *{function}* **error** The error callback.  
		// *{object}* **options** Options, specifies the ```format``` in which to 
	    // 		return the results. Can be any of: 
	    //		- application/json (for JSON-LD format)
	    //		- application/rdf+xml
	    //		- application/rdf+json
	    //		- text/turtle
	    //		- text/rdf+nt (for N-TRIPLES)
	    //		By default, application/rdf+xml is returend.
		// **Throws**:  
		// *nothing*  
		// **Returns**:  
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.  
		// **Example usage**:  
		//
		//     var stnblConn = new vie.StanbolConnector(opts);
		//     stnblConn.enhancers(
		//                 function (res) { ... },
		//                 function (err) { ... },
	    //					{ format : 'text/turtle'});
	    enhancers: function(success, error, options) {
	    	options = (options)? options :  {};
	    	var connector = this;
	        
	    	connector._iterate({
	        	method : connector._enhancers,
	        	methodNode : connector._enhancersNode,
	        	url : function (idx, opts) {
	        		
	        		var u = this.options.url[idx].replace(/\/$/, '');
	        		u += this.options.enhancer.urlPostfix.replace(/\/$/, '');
	        		return u;
	        	},
	        	args : {
	        		
	        		format : options.format || 'application/rdf+xml'
	        		
	        	},
	        	success : success,
	        	error : error,
	        	urlIndex : 0
	        });
	    },	// end of enhancers
	    
	    _enhancers : function (url, args, success, error) {
	    	console.log("enhancers() received as format: " + args.format)
	    	jQuery.ajax({
	    		beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.format);
			},
	            success: success,
	            error: error,
	            url: url,
	            type: "GET"
	        });
	    }, 	// end of _enhancers
	
	    _enhancersNode: function(url, args, success, error) {
	        var request = require('request');
	        var r = request({
	            method: "GET",
	            uri: url,
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
	    },	// end of _enhancersNode
	    
	    // ### getExecutionPlan(success, error, options)
	    // @author mere01
		// returns the ExecutionPlan used by an enhancement endpoint. The 
	    // ExecutionPlan formally describes how ContentItems passed to the 
	    // Stanbol Enhancer are processes by an Enhancement Chain. Such 
	    // information are also included in enhancement results as part of the 
	    // ExectionMetadata (see also the executionmetadata=true/false parameter
	    // of the analyze() method)
		// **Parameters**:    
		// *{function}* **success** The success callback.  
		// *{function}* **error** The error callback.  
		// *{object}* **options** Options, specifies the ```format``` in which to 
	    // 		return the results. Can be any of: 
	    //		- application/json (for JSON-LD format)
	    //		- application/rdf+xml
	    //		- application/rdf+json
	    //		- text/turtle
	    //		- text/rdf+nt (for N-TRIPLES)
	    //		By default, application/rdf+xml is returend.
		// **Throws**:  
		// *nothing*  
		// **Returns**:  
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.  
		// **Example usage**:  
		//
		//     var stnblConn = new vie.StanbolConnector(opts);
		//     stnblConn.enhancers(
		//                 function (res) { ... },
		//                 function (err) { ... },
	    //					{ format : 'text/turtle'});
	    getExecutionPlan: function(success, error, options) {
	    	options = (options)? options :  {};
	    	var connector = this;
	        
	    	connector._iterate({
	        	method : connector._getExecutionPlan,
	        	methodNode : connector._getExecutionPlanNode,
	        	url : function (idx, opts) {
	        		
	        		var u = this.options.url[idx].replace(/\/$/, '');
	        		u += this.options.enhancer.urlPostfix.replace(/\/$/, '');
	        		u += "/ep";
	        		return u;
	        	},
	        	args : {
	        		
	        		format : options.format || 'application/rdf+xml'
	        		
	        	},
	        	success : success,
	        	error : error,
	        	urlIndex : 0
	        });
	    },	// end of getExecutionPlan
	    
	    _getExecutionPlan : function (url, args, success, error) {
	    	console.log("getExecutionPlan() received as format: " + args.format)
	    	jQuery.ajax({
	    		beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", args.format);
			},
	            success: success,
	            error: error,
	            url: url,
	            type: "GET"
	        });
	    }, 	// end of _getExecutionPlan
	
	    _getExecutionPlanNode: function(url, args, success, error) {
	        var request = require('request');
	        var r = request({
	            method: "GET",
	            uri: url,
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
	    }	// end of _getExecutionPlanNode
	    
	});

})();
