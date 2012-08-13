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
	
// ## VIE.StanbolConnector(options)
// The StanbolConnector is the connection between the VIE Stanbol service
// and the actual ajax calls.  
// **Parameters**:  
// *{object}* **options** The options.  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.StanbolConnector}* : The **new** VIE.StanbolConnector instance.  
// **Example usage**:  
//
//     var stnblConn = new vie.StanbolConnector({<some-configuration>});
VIE.prototype.StanbolConnector = function (options) {
	
	var defaults = {
		/* you can pass an array of URLs which are then tried sequentially */
		url: ["http://dev.iks-project.eu/stanbolfull"],
		timeout : 20000 /* 20 seconds timeout */,

        enhancer : {
            urlPostfix : "/enhancer",
            chain : "default"
        },
        contenthub : {
            urlPostfix : "/contenthub",
            index : "contenthub"
        },
        entityhub : {
            /* if set to undefined, the Referenced Site Manager @ /entityhub/sites is used. */
            /* if set to, e.g., dbpedia, referenced Site @ /entityhub/site/dbpedia is used. */
            site : undefined,
            urlPostfix : "/entityhub",
            local : false
        },
        factstore : {
            urlPostfix : "/factstore"
        },
        ontonet : {
            urlPostfix : "/ontonet",
            scope: "/ontology",
            session: "/session",
            registry: "/registry"
        },
        rules : {
            urlPostfix : "/rules",
            recipe : "/recipe",
            findRule : "/find/rules",
            findRecipe : "/find/recipes"
        },
        sparql : {
            urlPostfix : "/sparql"
        }
	};
	
    /* the options are merged with the default options */
    this.options = jQuery.extend(true, defaults, options ? options : {});
    this.options.url = (_.isArray(this.options.url))? this.options.url : [ this.options.url ];
    
    this._init();
};

VIE.prototype.StanbolConnector.prototype = {

		// ### _init()
		// Basic setup of the stanbol connector.  This is called internally by the constructor!
		// **Parameters**:  
		// *nothing*
		// **Throws**:  
		// *nothing*  
		// **Returns**:  
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself. 
		_init : function () {
			var connector = this;

			/* basic setup for the ajax connection */
			jQuery.ajaxSetup({
				converters: {"text application/rdf+json": function(s){return JSON.parse(s);}},
				timeout: connector.options.timeout
			});

			return this;
		},

		_iterate : function (params) {
			if (!params) { return; }

			if (params.urlIndex >= this.options.url.length) {
				params.error.call(this, "Could not connect to the given Stanbol endpoints! Please check for their setup!");
				return;
			}

			var retryErrorCb = function (c, p) {
				/* in case a Stanbol backend is not responding and
				 * multiple URLs have been registered
				 */
				return function () {
					console.log("Stanbol connection error", arguments);
					p.urlIndex = p.urlIndex+1;
					c._iterate(p);
				};
			}(this, params);

			if (typeof exports !== "undefined" && typeof process !== "undefined") {
				/* We're on Node.js, don't use jQuery.ajax */
				return params.methodNode.call(
						this, 
						params.url.call(this, params.urlIndex, params.args.options),
						params.args,
						params.success,
						retryErrorCb,
						params.complete);
			}

			
			if (params.complete) {
			return params.method.call(
					this, 
					params.url.call(this, params.urlIndex, params.args.options),
					params.args,
					params.success,
					retryErrorCb,
					params.complete);
			} else {
				return params.method.call(
						this, 
						params.url.call(this, params.urlIndex, params.args.options),
						params.args,
						params.success,
						retryErrorCb);
			}
		}

};

})();