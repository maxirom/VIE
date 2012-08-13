//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE Literal
// 
// In VIE there are ...
VIE.prototype.Literal = function(attrs, opts) {

    attrs = (attrs)? attrs : {};
    opts = (opts)? opts : {};

    var self = this;
    
    var Model = Backbone.Model.extend({
        
        set : function (key, value, options) {
            if (!value && !_.isObject(key)) {
                value = key;
                key = this.vie.getLang();
            }
            return Backbone.Model.prototype.set.call(this, key, value, options);
        },
                
        get : function (attr) {
            if (!attr) 
                attr = this.vie.getLang();
            return Backbone.Model.prototype.get.call(this, attr);
        },
        
        toString : function () {
            throw new Error("not implemented!");
        },
            
        toTurtle : function () {
            throw new Error("not implemented!");
        },
        
        isLiteral : true,
        vie : self.vie
    });
    
    return new Model(attrs, opts);
};

VIE.prototype.BooleanLiteral = function (value) {
    
    value = (value === true)? true : false;
    
    var model = new this.vie.Literal();
    
    _.extend(model, {
        
        toString : function (lang) { 
            return this.get(lang).toString();
        },
        
        toTurtle : function (lang) {
            return this.toString(lang);
        }
    });
    
    model.set(value);
    
    return model;
};

VIE.prototype.NumberLiteral = function (value) {
    
    value = (value)? value : 0;
    
    var model = new this.vie.Literal();
    
    _.extend(model, {
        /* language-specific storage does not make sense for numbers */
        get : function () {
            return Backbone.Model.prototype.get.call(this, "value");
        },

        /* language-specific storage does not make sense for numbers */
        set : function (val) {
            return Backbone.Model.prototype.set.call(this, "value", val);
        },
        
        toString : function (lang) { 
            return this.get().toLocaleString();
        },
        
        toTurtle : function (lang) {
            return this.toString(lang);
        }
    });
    
    model.set(value);
    
    return model;
};

VIE.prototype.StringLiteral = function (value) {
    
    value = (value)? value : "";
    
    var model = new this.vie.Literal();
    
    _.extend(model, {
        
        toString : function (lang) { 
            return this.get(lang);
        },
        
        toTurtle : function (lang) {
            lang = (lang)? lang : this.vie.getLang();
            return "\"\"\"" + this.toString(lang) + "\"\"\"" + "@" + lang;
        }
    });
    
    model.set(value);
    
    return model;
};

VIE.prototype.DateLiteral = function (value) {
    
    if (value instanceof Date ||
        value instanceof String) {
        value = new Date(value);
    } else {
        throw new Error ("Invalid dateformat '" + value + "'");
    }
    
    var model = new this.vie.Literal();
    
    _.extend(model, {
        
        toString : function (lang) { 
            return this.get(lang).toISOString();
        },
        
        toTurtle : function (lang) {
            return this.toString(lang) + "^^<http://www.w3.org/2001/XMLSchema#dateTime>";
        }
    });
    
    model.set(value);
    
    return model;
};



/*

'"2009-07-13"^^xsd:date'

*/