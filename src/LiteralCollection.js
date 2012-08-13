//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE Literal-Collection
// 
// In VIE there are ...
VIE.prototype.LiteralCollection = Backbone.Collection.extend({
    model: VIE.prototype.Literal,
    
    
    toString: function (langs) {
        var browserLang = "en";
        if (navigator.userLanguage) // IE
            browserLang = navigator.userLanguage;
        else if (navigator.language) // FF
            browserLang = navigator.language;
        options.lang = (options.lang)? 
                options.lang : 
                [browserLang, "en", "de", "fi", "fr", "es", "ja", "zh-tw"];
        return VIE.Util.getPreferredLangForPreferredProperty(this, options.prop, options.lang);
    },
    
});
    