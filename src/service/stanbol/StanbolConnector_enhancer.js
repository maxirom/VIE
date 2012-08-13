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
	    
		// ### analyze(text, success, error, options)
		// This method sends the given text to Apache Stanbol returns the result by the success callback.  
		// **Parameters**:  
		// *{string}* **text** The text to be analyzed.  
		// *{function}* **success** The success callback.  
		// *{function}* **error** The error callback.  
		// *{object}* **options** Options, like the ```format```, or the ```chain``` to be used.  
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
	    analyze: function(text, success, error, options) {
	    	options = (options)? options :  {};
	    	var connector = this;
	        
	    	connector._iterate({
	        	method : connector._analyze,
	        	methodNode : connector._analyzeNode,
	        	url : function (idx, opts) {
	        		var chain = (opts.chain)? opts.chain : this.options.enhancer.chain;
	                
	        		var u = this.options.url[idx].replace(/\/$/, '');
	        		u += this.options.enhancer.urlPostfix + "/chain/" + chain.replace(/\/$/, '');
	        		return u;
	        	},
	        	args : {
	        		text : text,
	        		format : options.format || "application/rdf+json",
	        		options : options
	        	},
	        	success : success,
	        	error : error,
	        	urlIndex : 0
	        });
	    },
	    
	    _analyze : function (url, args, success, error) {
	    	jQuery.ajax({
	            success: success,
	            error: error,
	            url: url,
	            type: "POST",
	            data: args.text,
	            dataType: args.format,
	            contentType: "text/plain",
	            accepts: {"application/rdf+json": "application/rdf+json"}
	        });
	    },
	
	    _analyzeNode: function(url, args, success, error) {
	        var request = require('request');
	        var r = request({
	            method: "POST",
	            uri: url,
	            body: args.text,
	            headers: {
	                Accept: args.format,
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
	    }
	    
	});

})();
