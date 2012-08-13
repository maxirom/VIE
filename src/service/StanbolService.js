//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - StanbolService service
// The StanbolService service allows a VIE developer to directly query
// the <a href="http://incubator.apache.org/stanbol/">Apache Stanbol</a> entityhub for entities and their properties. 
// Furthermore, it gives access to the enhance facilities of
// Stanbol to analyze content and semantically enrich it.
(function(){

// ## VIE.StanbolService(options)
// This is the constructor to instantiate a new service to collect
// properties of an entity from <a href="http://incubator.apache.org/stanbol/">Apache Stanbol</a>.  
// **Parameters**:  
// *{object}* **options** Optional set of fields, ```namespaces```, ```rules```, ```url```, or ```name```.  
// **Throws**:  
// *nothing*  
// **Returns**:  
// *{VIE.StanbolService}* : A **new** VIE.StanbolService instance.  
// **Example usage**:  
//
//     var stnblService = new vie.StanbolService({<some-configuration>});
VIE.prototype.StanbolService = function(options) {
    var defaults = {
        /* the default name of this service */
        name : 'stanbol',
        /* you can pass an array of URLs which are then tried sequentially */
        url: ["http://dev.iks-project.eu/stanbolfull"],
        timeout : 20000, /* 20 seconds timeout */
        namespaces : {
            semdeski : "http://www.semanticdesktop.org/ontologies/2007/01/19/nie#",
            semdeskf : "http://www.semanticdesktop.org/ontologies/2007/03/22/nfo#",
            skos: "http://www.w3.org/2004/02/skos/core#",
            foaf: "http://xmlns.com/foaf/0.1/",
            opengis: "http://www.opengis.net/gml/",
            dbpedia: "http://dbpedia.org/ontology/",
            dbprop: "http://dbpedia.org/property/",
            owl : "http://www.w3.org/2002/07/owl#",
            geonames : "http://www.geonames.org/ontology#",
            enhancer : "http://fise.iks-project.eu/ontology/",
            entityhub: "http://www.iks-project.eu/ontology/rick/model/",
            entityhub2: "http://www.iks-project.eu/ontology/rick/query/",
            rdf: "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
            rdfs: "http://www.w3.org/2000/01/rdf-schema#",
            dcterms  : 'http://purl.org/dc/terms/',
            schema: 'http://schema.org/',
            geo: 'http://www.w3.org/2003/01/geo/wgs84_pos#'
        },
        /* default rules that are shipped with this service */
        rules : [
            /* rule to add backwards-relations to the triples
             * this makes querying for entities a lot easier!
             */
            {
                'left' : [
                    '?subject a <http://fise.iks-project.eu/ontology/EntityAnnotation>',
                    '?subject enhancer:entity-type ?type',
                    '?subject enhancer:confidence ?confidence',
                    '?subject enhancer:entity-reference ?entity',
                    '?subject dcterms:relation ?relation',
                    '?relation a <http://fise.iks-project.eu/ontology/TextAnnotation>',
                    '?relation enhancer:selected-text ?selected-text',
                    '?relation enhancer:selection-context ?selection-context',
                    '?relation enhancer:start ?start',
                    '?relation enhancer:end ?end'
                ],
                'right' : [
                    '?entity a ?type',
                    '?entity enhancer:hasTextAnnotation ?relation',
                    '?entity enhancer:hasEntityAnnotation ?subject'
                ]
            }
        ],
        enhancer : {
        	chain : "default"
        },
        entityhub : {
        	/* if set to undefined, the Referenced Site Manager @ /entityhub/sites is used. */
        	/* if set to, e.g., dbpedia, eferenced Site @ /entityhub/site/dbpedia is used. */
        	site : undefined
        }
    };
    /* the options are merged with the default options */
    this.options = jQuery.extend(true, defaults, options ? options : {});

    this.vie = null; /* will be set via VIE.use(); */
    /* overwrite options.name if you want to set another name */
    this.name = this.options.name;
    
};

VIE.prototype.StanbolService.prototype = {

//      ### init()
//      This method initializes certain properties of the service and is called
//      via ```VIE.use()```.  
//      **Parameters**:  
//      *nothing*  
//      **Throws**:  
//      *nothing*  
//      **Returns**:  
//      *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
//      **Example usage**:  

//      var stnblService = new vie.StanbolService({<some-configuration>});
//      stnblService.init();
        init: function(){

            for (var key in this.options.namespaces) {
                var val = this.options.namespaces[key];
                this.vie.namespaces.add(key, val);
            }

            this.rules = jQuery.extend([], VIE.Util.transformationRules(this));
            this.rules = jQuery.merge(this.rules, (this.options.rules) ? this.options.rules : []);

            this.connector = new this.vie.StanbolConnector(this.options);

            /* adding these entity types to VIE helps later the querying */
            this.vie.types.addOrOverwrite('enhancer:EntityAnnotation', [
                                                                        /*TODO: add attributes */
                                                                        ]).inherit("owl:Thing");
            this.vie.types.addOrOverwrite('enhancer:TextAnnotation', [
                                                                      /*TODO: add attributes */
                                                                      ]).inherit("owl:Thing");
            this.vie.types.addOrOverwrite('enhancer:Enhancement', [
                                                                   /*TODO: add attributes */
                                                                   ]).inherit("owl:Thing");
        },

//      ### analyze(analyzable)
//      This method extracts text from the jQuery element and sends it to Apache Stanbol for analysis.  
//      **Parameters**:  
//      *{VIE.Analyzable}* **analyzable** The analyzable.  
//      **Throws**:  
//      *{Error}* if an invalid VIE.Findable is passed.  
//      **Returns**:  
//      *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
//      **Example usage**:  

//      var stnblService = new vie.StanbolService({<some-configuration>});
//      stnblService.analyzable(
//      new vie.Analyzable({element : jQuery("#foo")})
//      );
        analyze: function(analyzable) {
            var service = this;

            var correct = analyzable instanceof this.vie.Analyzable;
            if (!correct) {throw "Invalid Analyzable passed";}

            var element = analyzable.options.element ? analyzable.options.element : jQuery('body');

            var text = service._extractText(element);

            if (text.length > 0) {
                /* query enhancer with extracted text */
                var success = function (results) {
                    _.defer(function(){
                        var entities = VIE.Util.rdf2Entities(service, results);
                        analyzable.resolve(entities);
                    });
                };
                var error = function (e) {
                    analyzable.reject(e);
                };

                var options = {
                        chain : (analyzable.options.chain)? analyzable.options.chain : service.options.enhancer.chain
                };

                this.connector.analyze(text, success, error, options);

            } else {
                console.warn("No text found in element.");
                analyzable.reject([]);
            }

        },

//      ### find(findable)
//      This method finds entities given the term from the entity hub.  
//      **Parameters**:  
//      *{VIE.Findable}* **findable** The findable.  
//      **Throws**:  
//      *{Error}* if an invalid VIE.Findable is passed.  
//      **Returns**:  
//      *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
//      **Example usage**:  

//      var stnblService = new vie.StanbolService({<some-configuration>});
//      stnblService.find(new vie.Findable({
//          term : "Bischofsh", 
//          limit : 10, 
//          offset: 0,
//          field: "skos:prefLabel", // used for the term lookup, default: "rdfs:label"
//          properties: ["skos:prefLabel", "rdfs:label"] // are going to be loaded with the result entities
//      }));
        find: function (findable) {        
            var correct = findable instanceof this.vie.Findable;
            if (!correct) {throw "Invalid Findable passed";}
            var service = this;
            /* The term to find, * as wildcard allowed */
            if(!findable.options.term) {
                console.info("StanbolConnector: No term to look for!");
                findable.reject([]);
            };
            var term = escape(findable.options.term);
            var limit = (typeof findable.options.limit === "undefined") ? 20 : findable.options.limit;
            var offset = (typeof findable.options.offset === "undefined") ? 0 : findable.options.offset;
            var success = function (results) {
                _.defer(function(){
                    var entities = VIE.Util.rdf2Entities(service, results);
                    findable.resolve(entities);
                });
            };
            var error = function (e) {
                findable.reject(e);
            };

            findable.options.site = (findable.options.site)? findable.options.site : service.options.entityhub.site;

            var vie = this.vie;
            if(findable.options.properties){
                var properties = findable.options.properties;
                findable.options.ldPath = _(properties)
                .map(function(property){
                    if(vie.namespaces.isCurie(property)){
                        return vie.namespaces.uri(property) + ";"
                    } else {
                        return property;
                    }
                })
                .join("");
            }
            if(findable.options.field && vie.namespaces.isCurie(field)){
                var field = findable.options.field;
                findable.options.field = vie.namespaces.uri(field);
            }
            this.connector.find(term, limit, offset, success, error, findable.options);
        },

        // ### load(loadable)
        // This method loads the entity that is stored within the loadable into VIE.  
        // **Parameters**:  
        // *{VIE.Loadable}* **lodable** The loadable.  
        // **Throws**:  
        // *{Error}* if an invalid VIE.Loadable is passed.  
        // **Returns**:  
        // *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
        // **Example usage**:  
        //
        //      var stnblService = new vie.StanbolService({<some-configuration>});
        //      stnblService.load(new vie.Loadable({
        //      entity : "<http://...>"
        //      }));
        load: function(loadable){
            var correct = loadable instanceof this.vie.Loadable;
            if (!correct) {throw "Invalid Loadable passed";}
            var service = this;

            var entity = loadable.options.entity;
            if(!entity){
                console.warn("StanbolConnector: No entity to look for!");
                loadable.resolve([]);
            };
            var success = function (results) {
                _.defer(function(){
                    var entities = VIE.Util.rdf2Entities(service, results);
                    loadable.resolve(entities);
                });
            };
            var error = function (e) {
                loadable.reject(e);
            };

            var options = {
                    site : (loadable.options.site)? loadable.options.site : service.options.entityhub.site,
                    local : loadable.options.local
            };

            this.connector.load(entity, success, error, options);
        },

        // ### query(queryable)
        // This method queries for entities, given the query that is stored in the queryable element.  
        // **Parameters**:  
        // *{VIE.Queryable}* **queryable** The queryable.  
        // **Throws**:  
        // *{Error}* if an invalid VIE.Queryable is passed.  
        // **Returns**:  
        // *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
        // **Example usage**:  
        //
        //      var stnblService = new vie.StanbolService({<some-configuration>});
        //      stnblService.query(new vie.Queryable({
        //          {
        //              select: ["rdfs:label", "population"],
        //              fieldQuery: {
        //                  "rdfs:label": "mongolia*",
        //                  "@type": "schema:Country"
        //              }
        //          }));
        query: function(queryable){
            var correct = queryable instanceof this.vie.Queryable;
            if (!correct) {throw "Invalid Queryable passed";}
            var service = this;

            var query = queryable.options.query;
            if(!query){
                console.warn("StanbolConnector: No query to be executed!");
                queryable.resolve([]);
            };
            var success = function (response) {
                _.defer(function(){
                    var entities = VIE.Util.rdf2Entities(service, response.results);
                    queryable.resolve(entities);
                });
            };
            var error = function (e) {
                queryable.reject(e);
            };

            var options = {
                    site : (queryable.options.site)? queryable.options.site : service.options.entityhub.site,
                    local : queryable.options.local
            };

            this.connector.query(query, success, error, options);
        },

        // ### save(savable)
        // This method saves the given entity to the Apache Stanbol installation.  
        // **Parameters**:  
        // *{VIE.Savable}* **savable** The savable.  
        // **Throws**:  
        // *{Error}* if an invalid VIE.Savable is passed.  
        // **Returns**:  
        // *{VIE.StanbolService}* : The VIE.StanbolService instance itself.  
        // **Example usage**:  
        //
        //      var entity = new vie.Entity({'name' : 'Test Entity'});
        //      var stnblService = new vie.StanbolService({<some-configuration>});
        //      stnblService.save(new vie.Savable(entity));
        save: function(savable) {
        	console.log("received Savable: " + typeof(savable))
        	console.log(savable)
            var correct = savable instanceof this.vie.Savable;
            if (!correct) {throw "Invalid Savable passed";}
            var service = this;

            var entity = savable.options.entity;
            console.log("entity to save is: " + entity)
            if(!entity){
                console.warn("StanbolConnector: No entity to save!");
                savable.reject("StanbolConnector: No entity to save!");
            };
            var success = function (results) {
                _.defer(function() {
                    var entities = VIE.Util.rdf2Entities(service, results);
                    savable.resolve(entities);
                });
            };

            var error = function (e) {
                savable.reject(e);
            };

            var options = {
                    site : (savable.options.site)? savable.options.site : service.options.entityhub.site,
                    local : savable.options.local,
                    update : savable.options.update
            };
            
            this.connector.save(entity, success, error, options);
        },

        /* this private method extracts text from a jQuery element */
        _extractText: function (element) {
            if (element.get(0) &&
                    element.get(0).tagName &&
                    (element.get(0).tagName == 'TEXTAREA' ||
                            element.get(0).tagName == 'INPUT' && element.attr('type', 'text'))) {
                return element.get(0).val();
            }
            else {
                var res = element
                .text()    /* get the text of element */
                .replace(/\s+/g, ' ') /* collapse multiple whitespaces */
                .replace(/\0\b\n\r\f\t/g, ''); /* remove non-letter symbols */
                return jQuery.trim(res);
            }
        }
};

})();

