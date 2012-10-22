// VIE Widgets - Vienna IKS Editable Widgets
// (c) 2012 Cholpon Degenbaeva
// VIE Widgets may be freely distributed under the MIT license.
// (see LICENSE)

(function($, undefined) {
  // Date Picker Widget starts.
  $.widget("view.vieDatePicker", {
    _create: function () {
      var widget = this;
      $(widget.element).find('[property="name"]').addClass("clickable");
      $(widget.element).find('[property="name"]').click(function() {
          var clickedName = ($(this).text());  
          var entities = widget.options.vie.entities;
          var currentEntity = _.find(entities.models, function(entity) {
            var name = entity.get("name");
            return (normalizedSchemaName(name) == clickedName);
          });        
          if (!currentEntity.isClicked) {
            currentEntity.isClicked = true;
            currentEntity.setFormat= widget.options.setFormat;
            var element = $("<div class='entity-card'> </div>");
            widget.options.container.append(element);
            var view = new SchemaView({model: currentEntity, vie: vie, el: element});
            view.render();
          }
      });
    },
    
    _init: function () {
    },
    options: {
      vie: undefined,
      container: undefined, 
      setFormat: "YYYY-MM-DD"
    }
  });
  // Date Picker Widget ends.

  var SchemaView = Backbone.View.extend( {
    initialize: function (opt) {
      this.vie = opt.vie;
    },
    render: function () {      
      function fixSchemaId(str) {
        // Converts for example:
        // "<http://schema.orgactor>" to "actor".
        return str.slice(19,str.length-1);
      }

      function isDateAttribute(id) {
        if (id.search("date") >= 0) return true;
        if (id.search("Date") >= 0) return true;
        if (id.search("year") >= 0) return true;
        if (id.search("Year") >= 0) return true;
        if (id.search("month") >= 0) return true;
        if (id.search("Month") >= 0) return true;
        if (id.search("day") >= 0) return true;
        if (id.search("Day") >= 0) return true;
        return false;
      }

      function worthShowing(id, value) {
        // attribute is worth showing if 
        // id contains date related words or value is not undefined.
        return isDateAttribute(id) || (typeof value != "undefined");
      }

      function isDate(dateStr) {
        var date = Kalendae.moment(dateStr);
        if (date.toString() !== "Invalid Date") {
            return true;
          } else {   
            return false;
          }
      } 
      
      var type = this.model.get ('@type');      
      var attributes;
        if (type.length>1) {
          attributes= type[1].attributes.list();
        } else
        attributes= type.attributes.list();

      var schemaName = this.model.get ("name");
      $(this.el).html("<h2>" + normalizedSchemaName(schemaName));

      var button = $("<button type='button' class='close-btn'></button>");
      button.addClass('close-btn');
      
      button.click(
        (function (model) {
            return function () {
              model.isClicked = false;
              $(this).parent().hide();
            }
        })(this.model) 
      );
      
      $(this.el).prepend(button);
   
      var html_list = $("<ul class='entity-attributes'> </ul>");
      for (var i = 0; i < attributes.length; i++) {
        var attribute = attributes[i];
        var id = fixSchemaId(attribute.id);
        var value = this.model.get(id);

        if (id != "name" && worthShowing(id, value)) {
          var input = $("<input type=text></input>"); 
          var curId = id;
          var curModel = this.model;
          (function(model, id) {
                    $(input.change (function() {
                            var inputVal = $(this).val();                             
                            if (isDate(inputVal)) {
                                inputVal = Kalendae.moment(inputVal);
                                inputVal = inputVal.format(model.setFormat);
                                model.set(id,inputVal);
                            } else {
                             console.log ("Invalid input");
                             }  
                          })
                     );
           })(curModel, curId);
                 
    
          if (isDateAttribute(id)) {            
            if (typeof value != "undefined") {
              var date = Kalendae.moment(value);
              input.attr("value", date.format(this.model.setFormat));
            }
            var validRanges= (function (model, id) {
                return function () {
                   var rules = getDateRange(model, id, allRules);
                   var lower = rules[0] ? rules[0] : "any";
                   if (lower !== "any") {
                       lowerDate = Kalendae.moment(lower);
                       lower = lowerDate.format(model.setFormat); 
                   }
                   var upper = rules[1] ? rules[1] : "any";
                   if (upper !== "any") {
                       upperDate = Kalendae.moment(upper);
                       upper = upperDate.format(model.setFormat);
                   }
                   var fromDate = "From: " + lower;
                   fromDate = normalizedSchemaName(fromDate);
                   var toDate = "To: " + upper;
                   toDate = normalizedSchemaName(toDate);
                   var message = new Array(fromDate, toDate);
                   return (message);
                 }
            })(this.model, id);
            function installKalendar(model, input, id) {
              new Kalendae.Input(input[0], {
                                              format: model.setFormat,
                                              subscribe: {
                                                'change': function () {
                                                   var value = this.getSelected();
                                                   model.set(id, value);
                                                }
                                              },
                                              message: validRanges
                                            });
            }
            installKalendar(this.model, input, id);
            // Install click handler.
            // Pass model (which is entity) and id (attribute name).
           
          } else {
            
              if (value.isCollection) {
                 var val = value.toArray();
                 val = val[0].getSubject();      
                 input.attr("value", val);
                 } else
                 input.attr("value", value);

          }
          var list_item = $("<li>" + id + ": </li>");
          list_item.append(input);
          html_list.append(list_item);
        }
      }
      $(this.el).append(html_list);
      return this;
    }
  });

  function contains(a, b) {
     for (var i = 0; i < a.length; i++) {
        if (a[i] == b) return true;
     }
     return false;
  } 

  function collectSuperTypes(type) {
     if (typeof(type.supertypes) == "undefined") return [];
     var result = [type.toString()];
     var supertypes = type.supertypes.toArray();
     for (var i = 0; i < supertypes.length; i++) {
        result = result.concat(collectSuperTypes(supertypes[i]));
     }
     return result;
  } 

  function findRulesForEntity(entity, rules) {
     var result = [];
     var type = entity.get("@type");
     var typeNames;
     if (type.length>1) {
        typeNames = collectSuperTypes(type[1]);
     } else
        typeNames=collectSuperTypes(type);

     for (var i = 0; i < rules.length; i++) {
       var rule = rules[i];
       if (contains(typeNames, rule.type)) {
         result.push(rule);
       }
     }
     return result;
  }

  function VertexId(entity, attribute) {
     this.entity = entity;
     this.attribute = attribute;
     this.isEqual = function (other) { 
       return (other.entity === this.entity) &&
              (other.attribute === this.attribute);
     }
  }

  function Vertex(vertexId, value) {
    this.id = vertexId;
    this.value = value;
    this.edges = [];
    this.addEdge = function (other) {
      this.edges.push(other);
    }
    this.visited = false;
  }

  function Graph(entities, rules, label) {
    this.vertices = [];
    this.findVertex = function (vertexId, value) {
       // Try to find vertex with vertexId:
       for (var i = 0; i < this.vertices.length; i++) {
          if (this.vertices[i].id.isEqual(vertexId)) {
            return this.vertices[i];
          }
       }
       // The vertex is not found, create a new one:
       var vertex = new Vertex(vertexId, value)
       this.vertices.push(vertex);
       return vertex;
    }

    this.findReachable = function (vertex) {
      if (vertex.visited) return [];
      vertex.visited = true;
      var result = [vertex];
      for (var i = 0; i < vertex.edges.length; i++) {
         var new_vertex = vertex.edges[i];
         result = result.concat(this.findReachable(new_vertex));
      }
      return result;
    }
    for (var i = 0; i < entities.length; i++) {
       var entity = entities.models[i];
       var entity_rules = findRulesForEntity(entity, rules);
       for (var j = 0; j < entity_rules.length; j++) {
         var rule = entity_rules[j];
         var startVertexId = new VertexId(entity, rule.date1);
         var otherEntity = (rule.reference === "self" ? entity : entity.get(rule.reference));
         if (!otherEntity) {
            continue;
         }
         var endVertexId = new VertexId(otherEntity, rule.date2);
         var startVertex = this.findVertex(startVertexId, entity.get(rule.date1));
         var endVertex = this.findVertex(endVertexId, otherEntity.get(rule.date2));
         if (rule.label === label) {
            startVertex.addEdge(endVertex);
         } else {
            endVertex.addEdge(startVertex);
         }
       }
    }
  }

  function findMin(vertices) {
     var result = null;
     for (var i = 0; i < vertices.length; i++) {
        if (vertices[i].value) {
           if (!result || result > vertices[i].value) {
              result = vertices[i].value;
           }
        }
     }
     return result;
  }

  function findMax(vertices) {
     var result = null;
     for (var i = 0; i < vertices.length; i++) {
        if (vertices[i].value) {
           if (!result || result < vertices[i].value) {
              result = vertices[i].value;
           }
        }
     }
     return result;
  }

  function getDateRange(entity, attribute, rules) {
    var entities = vie.entities;
    var graphLess = new Graph(entities, rules, "<=");
    var graphGreater = new Graph(entities, rules, ">=");
    var vertexId = new VertexId(entity, attribute);
    var reachableLess = graphLess.findReachable(graphLess.findVertex(vertexId));
    var reachableGreater = graphGreater.findReachable(graphGreater.findVertex(vertexId));
    return [findMin(reachableGreater), findMax(reachableLess)];
  }

  function normalizedSchemaName(name) {
      name = name.replace(/"/g, '');
      name = name.replace(/@.*$/, '');
      name = name.replace(/_/g, '');
      return name;
  }


})(jQuery);

// Collection of rules for detecting semantic connections
// Based on Schema ontology

function Rule(type, date1, label, reference, date2) {
  this.type = type;
  this.date1 = date1;
  this.label = label;
  this.reference = reference;
  this.date2 = date2;
}
var allRules = ([]).concat(rulesForCreativeWork(),
               rulesForEducationalOrganization(),
               rulesForEvent(),
               rulesForJobPosting(),
               rulesForMediaObject(),
               rulesForMovie(),
               rulesForMusicPlaylist(),
               rulesForOffer(),
               rulesForOrganization(),
               rulesForPerson(),
               rulesForSoftwareApplication(),
               rulesForTVEpisode(),
               rulesForTVSeason(), 
               rulesForTVSeries(),
               rulesForWebPage());


function rulesForCreativeWork() {
  var type = "<http://schema.org/CreativeWork>";
  return [
    new Rule(type, "datePublished", ">=", "self", "dateCreated"),
    new Rule(type, "dateModified", ">=", "self", "dateCreated"),
    new Rule(type, "copyrightYear", ">=", "self", "dateCreated"),
    new Rule(type, "dateCreated", ">=", "accountablePerson", "birthDate"),
    new Rule(type, "dateCreated", "<=", "associatedMedia", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "associatedMedia", "expires"),
    new Rule(type, "dateCreated", "<=", "associatedMedia", "uploadDate"),
    new Rule(type, "dateCreated", "<=", "audioObject", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "audioObject", "expires"),
    new Rule(type, "dateCreated", "<=", "audioObject", "uploadDate"),  
    new Rule(type, "dateCreated", ">=", "author", "birthDate"),
    new Rule(type, "dateCreated", ">=", "author", "foundingDate"),  
    new Rule(type, "dateCreated", "<=", "comment", "startDate"),
    new Rule(type, "dateCreated", "<=", "comment", "commentTime"),    
    new Rule(type, "dateCreated", ">=", "contributor", "birthDate"),
    new Rule(type, "dateCreated", "<=", "contributor", "deathDate"),
    new Rule(type, "dateCreated", ">=", "contributor", "foundingDate"),    
    new Rule(type, "dateCreated", ">=", "copyrightHolder", "birthDate"),
    new Rule(type, "dateCreated", "<=", "copyrightHolder", "deathDate"),
    new Rule(type, "dateCreated", ">=", "copyrightHolder", "foundingDate"),    
    new Rule(type, "dateCreated", ">=", "creator", "birthDate"),
    new Rule(type, "dateCreated", "<=", "creator", "deathDate"),
    new Rule(type, "dateCreated", ">=", "creator", "foundingDate"),    
    new Rule(type, "dateCreated", ">=", "editor", "birthDate"),
    new Rule(type, "dateCreated", "<=", "editor", "deathDate"),    
    new Rule(type, "dateCreated", "<=", "encoding", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "encoding", "expires"),
    new Rule(type, "dateCreated", "<=", "encoding", "uploadDate"),   
    new Rule(type, "dateCreated", ">=", "provider", "birthDate"),
    new Rule(type, "dateCreated", "<=", "provider", "deathDate"),
    new Rule(type, "dateCreated", ">=", "provider", "foundingDate"),
    new Rule(type, "dateCreated", ">=", "publisher", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "review", "dateCreated"),    
    new Rule(type, "dateCreated", "<=", "sourceOrganization", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "videoObject", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "videoObject", "expires"),
    new Rule(type, "dateCreated", "<=", "videoObject", "uploadDate")       
  ];
  
}

function rulesForEducationalOrganization() {
  var type = "<http://schema.org/EducationalOrganization>";
  return [
    new Rule(type, "foundingDate", "<=", "alumni", "birthDate"),
  ];
}


function rulesForEvent() {
  var type = "<http://schema.org/Event>";
  return [
    new Rule(type, "startDate", "<=", "self", "endDate"), 
    new Rule(type, "startDate", ">=", "attendee", "birthDate"),
    new Rule(type, "startDate", ">=", "performer", "birthDate"),
    new Rule(type, "startDate", "<=", "subEvent", "startDate"),
    new Rule(type, "endDate", ">=", "subEvent", "endDate")
    ];
}

function rulesForJobPosting() {
  var type = "<http://schema.org/JobPosting>";
  return [
    new Rule(type, "datePoste", ">=", "hiringOrganization", "foundingDate")
   ];
}


function rulesForMediaObject() {
  var type = "<http://schema.org/MediaObject>";
  return [
    new Rule(type, "dateCreated", "<=", "self", "uploadDate"),
    new Rule(type, "dateCreated", "<=", "self", "expires"),    
    new Rule(type, "dateModified", "<=", "self", "uploadDate"),
    new Rule(type, "dateMOdified", "<=", "self", "expires"),    
    new Rule(type, "datePublished", "<=", "self", "uploadDate"),
    new Rule(type, "datePublished", "<=", "self", "expires"),    
    new Rule(type, "uploadDate", "<=", "associatedArticle", "dateCreated"),
    new Rule(type, "uploadDate", "<=", "associatedArticle", "dateModified"),
    new Rule(type, "uploadDate", "<=", "associatedArticle", "datePublished"),    
    new Rule(type, "dateCreated", ">=", "encodesCreativeWork", "dateCreated"),
    new Rule(type, "dateCreated", ">=", "encodesCreativeWork", "dateModified"),
    new Rule(type, "sdateCreated", ">=", "encodesCreativeWork", "datePublished")    
  ];
}

function rulesForMovie() {
  var type = "<http://schema.org/Movie>";
  return [
    new Rule(type, "datePublished", ">=", "self", "dateCreated"),
    new Rule(type, "dateModified", ">=", "self", "dateCreated"),
    new Rule(type, "copyrightYear", ">=", "self", "dateCreated"),    
    new Rule(type, "dateCreated", ">=", "director", "birthDate"),    
    new Rule(type, "dateCreated", "<=", "director", "deathDate"),    
    new Rule(type, "dateCreated", ">=", "actor", "birthDate"),
    new Rule(type, "dateCreated", "<=", "actor", "deathDate"),    
    new Rule(type, "dateCreated", ">=", "musicBy", "birthDate"),
    new Rule(type, "dateCreated", ">=", "musicBy", "foundingDate"),    
    new Rule(type, "dateCreated", ">=", "producer", "birthDate"),
    new Rule(type, "dateCreated", "<=", "producer", "deathDate"),    
    new Rule(type, "dateCreated", ">=", "productionCompany", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "trailor", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "trailor", "dateModified"),
    new Rule(type, "dateCreated", "<=", "trailor", "datePublished"),
    new Rule(type, "dateCreated", "<=", "trailor", "expires"),
    new Rule(type, "dateCreated", "<=", "trailor", "uploadDate")
  ];
}


function rulesForMusicPlaylist() {
  var type = "<http://schema.org/MusicPlaylist>";
  return [
    new Rule(type, "dateCreated", ">=", "track", "dateCreated"),
    new Rule(type, "dateCreated", ">=", "track", "datePublished")
  ];
}

function rulesForOffer() {
  var type = "<http://schema.org/Offer>";
  return [
    new Rule(type, "priceValidUntil", ">=", "seller", "foundingDate")
   
  ];
}


function rulesForOrganization() {
  var type = "<http://schema.org/Organization>";
  return [
    new Rule(type, "foundingDate", ">=", "employee", "birthDate"),    
    new Rule(type, "foundingDate", "<=", "employee", "deathDate"),
    new Rule(type, "foundingDate", ">=", "founder", "birthDate"),    
    new Rule(type, "foundingDate", "<=", "founder", "deaththDate"),    
    new Rule(type, "foundingDate", ">=", "member", "birthDate"),   
    new Rule(type, "foundingDate", "<=", "member", "deathDate"),    
    new Rule(type, "foundingDate", "<=", "review", "dateCreated"),
    new Rule(type, "foundingDate", "<=", "review", "dateModified"),
    new Rule(type, "foundingDate", "<=", "review", "datePublished")   
  ]; 
}


function rulesForPerson() {
  var type = "<http://schema.org/Person>";
  return [
    new Rule(type, "birthDate", "<=", "self", "deathDate"),
    new Rule(type, "deathDate", ">=", "affiliation", "foundingDate"),
    new Rule(type, "deathDate", ">=", "colleague", "birthDate"),
    new Rule(type, "deathDate", ">=", "follows", "birthDate"),
    new Rule(type, "deathDate", ">=", "knows", "birthDate"),
    new Rule(type, "deathDate", ">=", "memberOf", "foundingDate"),
    new Rule(type, "birthDate", ">=", "parent", "birthDate"),
    new Rule(type, "birthDate", "<=", "performerIn", "startDate"),
    new Rule(type, "deathDate", ">=", "spouse", "birthDate"),
    new Rule(type, "birthDate", ">=", "worksFor", "foundingDate") 
  ];

}

function rulesForSoftwareApplication() {
  var type = "<http://schema.org/SoftwareApplication>";
  return [
    new Rule(type, "dateCreated", "<=", "screenshot", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "screenshot", "dateModified"),
    new Rule(type, "dateCreated", "<=", "screenshot", "datePublished"),
    
    new Rule(type, "dateCreated", "<=", "screenshot", "expires"),
    new Rule(type, "dateCreated", "<=", "screenshot", "uploadDate")
        
  ];
}

function rulesForTVEpisode() {
  var type = "<http://schema.org/TVEpisode>";
  return [
    new Rule(type, "dateCreated", ">=", "actor", "birthDate"),  
    new Rule(type, "dateCreated", "<=", "actor", "deathDate"),    
    new Rule(type, "dateCreated", ">=", "director", "birthDate"),
    new Rule(type, "dateCreated", "<=", "director", "deathDate"),
    new Rule(type, "dateCreated", ">=", "musicBy", "birthDate"),
    new Rule(type, "dateCreated", "<=", "musicBy", "deathDate"),
    new Rule(type, "dateCreated", ">=", "musicBy", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "partOfSeason", "startDate"),
    new Rule(type, "dateCreated", "<=", "partOfSeason", "endDate"),
    new Rule(type, "dateCreated", "<=", "partOfSeason", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "partOfSeason", "dateModified"),
    new Rule(type, "dateCreated", "<=", "partOfSeason", "datePublished"),    
    new Rule(type, "dateCreated", "<=", "partOfTVSeries", "startDate"),
    new Rule(type, "dateCreated", "<=", "partOfTVSeries", "endDate"),
    new Rule(type, "dateCreated", "<=", "partOfTVSeries", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "partOfTVSeries", "dateModified"),
    new Rule(type, "dateCreated", "<=", "partOfTVSeries", "datePublished"),    
    new Rule(type, "dateCreated", ">=", "producer", "birthDate"),
    new Rule(type, "dateCreated", "<=", "producer", "deathDate"),    
    new Rule(type, "dateCreated", ">=", "productionCompany", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "trailer", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "trailer", "dateModified"),
    new Rule(type, "dateCreated", "<=", "trailer", "datePublished"),
    new Rule(type, "dateCreated", "<=", "trailer", "expires"),
    new Rule(type, "dateCreated", "<=", "trailer", "uploadDate")          
  ];
}


function rulesForTVSeason() {
  var type = "<http://schema.org/TVSeason>";
  return [
    new Rule(type, "startDate", "<=", "self", "endDate"),    
    new Rule(type, "startDate", ">=", "trailer", "dateCreated"),
    new Rule(type, "startDate", ">=", "trailer", "dateModified"),
    new Rule(type, "startDate", ">=", "trailer", "datePublished"),
    new Rule(type, "startDate", ">=", "trailer", "expires"),
    new Rule(type, "startDate", ">=", "trailer", "uploadDate")  
        
  ];
}


function rulesForTVSeries() {
  var type = "<http://schema.org/TVSeries>";
  return [
    new Rule(type, "startDate", "<=", "self", "endDate"),    
    new Rule(type, "dateCreated", ">=", "actor", "birthdate"), 
    new Rule(type, "dateCreated", "<=", "actor", "deathdate"),    
    new Rule(type, "dateCreated", ">=", "director", "birthdate"),
    new Rule(type, "dateCreated", "<=", "director", "deathdate"),    
    new Rule(type, "dateCreated", ">=", "musicBy", "birthDate"),
    new Rule(type, "dateCreated", "<=", "musicBy", "deathDate"),
    new Rule(type, "dateCreated", ">=", "musicBy", "foundingDate"),    
    new Rule(type, "dateCreated", "<=", "season", "startDate"),
    new Rule(type, "dateCreated", "<=", "season", "endDate"),
    new Rule(type, "dateCreated", "<=", "season", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "season", "dateModified"),
    new Rule(type, "dateCreated", "<=", "season", "datePublished"),    
    new Rule(type, "dateCreated", "<=", "trailer", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "trailer", "dateModified"),
    new Rule(type, "dateCreated", "<=", "trailer", "datePublished"),
    new Rule(type, "dateCreated", "<=", "trailer", "expires"),
    new Rule(type, "dateCreated", "<=", "trailer", "uploadDate")
    ];
}


function rulesForWebPage() {
  var type = "<http://schema.org/WebPage>";
  return [        
    new Rule(type, "dateCreated", "<=", "self", "lastReviewed"),    
    new Rule(type, "dateCreated", "<=", "mainContentOfPage", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "mainContentOfPage", "dateModified"),
    new Rule(type, "dateCreated", "<=", "mainContentOfPage", "datePublished"),    
    new Rule(type, "dateCreated", "<=", "primaryImageOfPage", "dateCreated"),
    new Rule(type, "dateCreated", "<=", "primaryImageOfPage", "dateModified"),
    new Rule(type, "dateCreated", "<=", "primaryImageOfPage", "datePublished"),
    new Rule(type, "dateCreated", "<=", "primaryImageOfPage", "expires"),
    new Rule(type, "dateCreated", "<=", "primaryImageOfPage", "uploadDate"),
    new Rule(type, "dateCreated", ">=", "reviewedBy", "birthdate"),
    new Rule(type, "dateCreated", "<=", "reviewedBy", "deathdate"),
    new Rule(type, "dateCreated", ">=", "reviewedBy", "foundingDate")
    ];
}
