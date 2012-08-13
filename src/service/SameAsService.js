//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - SameAsService service
// The SameAsService service allows a VIE developer to directly query
// "sameAs"-relations of entities from http://sameas.org .
(function(){

// ## VIE.SameAsService(options)
// This is the constructor to instantiate a new service to collect
// "sameAs" relations of an entity from <a href="http://sameas.org">SameAs.org</a>.  
// **Parameters**:  
// *{object}* **options** Optional set of fields, ```namespaces```, ```rules```, or ```name```.  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.SameAsService}* : A **new** VIE.SameAsService instance.  
// **Example usage**:  
//
//     var service = new vie.SameAsService({<some-configuration>});
VIE.prototype.SameAsService = function (options) {
    var defaults = {
        /* the default name of this service */
        name : 'sameas',
        /* default namespaces that are shipped with this service */
        namespaces : {
            owl    : "http://www.w3.org/2002/07/owl#",
            yago   : "http://dbpedia.org/class/yago/",
            foaf: 'http://xmlns.com/foaf/0.1/',
            georss: "http://www.georss.org/georss/",
            geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#',
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            dbpedia: "http://dbpedia.org/ontology/",
            dbprop : "http://dbpedia.org/property/",
            dcelements : "http://purl.org/dc/elements/1.1/"
        },
        /* default rules that are shipped with this service */
        rules : []
    };
    /* the options are merged with the default options */
    this.options = jQuery.extend(true, defaults, options ? options : {});

    this.vie = null; /* this.vie will be set via VIE.use(); */
    /* overwrite options.name if you want to set another name */
    this.name = this.options.name;
    
    /* basic setup for the ajax connection */
    jQuery.ajaxSetup({
        converters: {"text application/rdf+json": function(s){return JSON.parse(s);}},
        timeout: 60000 /* 60 seconds timeout */
    });
};

VIE.prototype.SameAsService.prototype = {
    
// ### init()
// This method initializes certain properties of the service and is called
// via ```VIE.use()```.  
// **Parameters**:  
// *nothing*  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.SameAsService}* : The VIE.SameAsService instance itself.  
// **Example usage**:  
//
//     var service = new vie.SameAsService({<some-configuration>});
//     service.init();
    init: function() {

        for (var key in this.options.namespaces) {
            var val = this.options.namespaces[key];
            this.vie.namespaces.add(key, val);
        }
        
        this.rules = jQuery.extend([], VIE.Util.transformationRules(this));
        this.rules = jQuery.merge(this.rules, (this.options.rules) ? this.options.rules : []);
        
        this.connector = new this.vie.SameAsConnector(this.options);
        
        return this;
    },

// ### load(loadable)
// This method loads the "sameAs" relations for the entity taht is stored  
// within the loadable into VIE. You can also query for multiple queries  
// by setting ```entities``` with an array of entities.  
// **Parameters**:  
// *{VIE.Loadable}* **lodable** The loadable.  
// **Throws**:  
// *{Error}* if an invalid VIE.Loadable is passed.  
// **Returns**:  
// *{VIE.SameAsService}* : The VIE.SameAsService instance itself.  
// **Example usage**:  
//
//  var service = new vie.SameAsService({<some-configuration>});
//  service.load(new vie.Loadable({entity : "<http://...>"}));
//    OR
//  var service = new vie.SameAsService({<some-configuration>});
//  service.load(new vie.Loadable({entities : ["<http://...>", "<http://...>"]}));
    load: function(loadable){
        var service = this;
        
        var correct = loadable instanceof this.vie.Loadable;
        if (!correct) {
            throw new Error("Invalid Loadable passed");
        }

        var entities = (loadable.options.entity)? loadable.options.entity : loadable.options.entities;
        
        if (!entities) {
            loadable.reject([]);
        } else {
            entities = (_.isArray(entities))? entities : [ entities ];
        
            var success = function (ents) {
                return function (results) {
                    _.defer(function() {
                        try {
                            var returnEntities = new service.vie.Collection();
                            var newEnts = VIE.Util.rdf2Entities(service, results);
                            for (var e = 0; e < newEnts.length; e++) {
                                var isValid = false;
                                var id1 = (newEnts[e].id)? newEnts[e].id : newEnts[e];
                                for (var f = 0; f < ents.length; f++) {
                                    var id2 = (ents[f].id)? ents[f].id : ents[f];
                                    isValid |= id1 === id2;
                                }
                                if (isValid) {
                                    returnEntities.add(newEnts[e]);
                                }
                            }
                            returnEntities.each(function (ent) {
                                ent.set("SameAsServiceLoad", VIE.Util.xsdDateTime(new Date()));
                            });
                            loadable.resolve(returnEntities);
                        } catch (except) {
                            loadable.reject(except);
                        }
                    });
                };
            }(entities);
            
            var error = function (e) {
                loadable.reject(e);
            };
                
        	var tmpEntities = [];
        	for (var e = 0; e < entities.length; e++) {
        		var tmpEnt = (typeof entities[e] === "string")? entities[e] : entities[e].id;
        		tmpEntities.push(tmpEnt);
        	}
                        
            this.connector.load(tmpEntities, success, error);
        }
        return this;
    }
};

// ## VIE.SameAsConnector(options)
// The SameAsConnector is the connection between the http://sameas.org service
// and the backend service.  
// **Parameters**:  
// *{object}* **options** The options.  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.SameAsConnector}* : The **new** VIE.SameAsConnector instance.  
// **Example usage**:  
//
//     var dbpConn = new vie.SameAsConnector({<some-configuration>});
VIE.prototype.SameAsConnector = function (options) {
    this.options = options;
    this.baseUrl = "http://sameas.org/rdf?uri=";
};

VIE.prototype.SameAsConnector.prototype = {

// ### load(uri, success, error, options)
// This method loads the sameas-relations from an entity and returns the result by the success callback.  
// **Parameters**:  
// *{string|array}* **uri** The URI of the entity to be loaded or an array of URIs.  
// *{function}* **success** The success callback.  
// *{function}* **error** The error callback.  
// *{object}* **options** Options, like the ```format```.  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.SameAsConnector}* : The VIE.SameAsConnector instance itself.  
// **Example usage**:  
//
//     var conn = new vie.SameAsConnector(opts);
//     conn.load("<http://dbpedia.org/resource/Barack_Obama>",
//                 function (res) { ... },
//                 function (err) { ... });
    load: function (uri, success, error, options) {
        if (!options) { options = {}; }
        
        var url = this.baseUrl;

        var _load = function (u, s, e) {
            jQuery.ajax({
                success: s,
                error: e,
                type: "GET",
                url: u
            });
        };
        
        uri = (_.isArray(uri))? uri : [ uri ];

        for (var i = 0; i < uri.length; i++) {
            var u = uri[i];
            u = u.replace(/[<>]/g, "");

            if (typeof exports !== "undefined" && typeof process !== "undefined") {
                /* We're on Node.js, don't use jQuery.ajax */
                this._loadNode(url + encodeURIComponent(u), success, error, options, format);
            } else {
                _load(url + encodeURIComponent(u), success, error);
            }
        }

        
        return this;
    },

    _loadNode: function (uri, success, error, options, format) {
        var request = require('request');
        var r = request({
            method: "GET",
            uri: uri
        }, function(error, response, body) {
            success(JSON.parse(body));
        });
        r.end();
        
        return this;
    }
};
})();

