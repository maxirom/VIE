module("VIE - Utils");

test("VIE - Utils API", function() {
    
    ok (VIE.Util);

    ok(VIE.Util.toCurie);
    ok(typeof VIE.Util.toCurie === 'function');

    ok(VIE.Util.isCurie);
    ok(typeof VIE.Util.isCurie === 'function');

    ok(VIE.Util.toUri);
    ok(typeof VIE.Util.toUri === 'function');

    ok(VIE.Util.isUri);
    ok(typeof VIE.Util.isUri === 'function');

    ok(VIE.Util.mapAttributeNS);
    ok(typeof VIE.Util.mapAttributeNS === 'function');

    ok(VIE.Util.rdf2Entities);
    ok(typeof VIE.Util.rdf2Entities === 'function');

    ok(VIE.Util._rdf2EntitiesNoRdfQuery);
    ok(typeof VIE.Util._rdf2EntitiesNoRdfQuery === 'function');

    ok(VIE.Util.loadSchemaOrg);
    ok(typeof VIE.Util.loadSchemaOrg === 'function');

    ok(VIE.Util.xsdDateTime);
    ok(typeof VIE.Util.xsdDateTime === 'function');

    ok(VIE.Util.getPreferredLangForPreferredProperty);
    ok(typeof VIE.Util.getPreferredLangForPreferredProperty === 'function');

    ok(VIE.Util.extractLanguageString);
    ok(typeof VIE.Util.extractLanguageString === 'function');

    ok(VIE.Util.transformationRules);
    ok(typeof VIE.Util.transformationRules === 'function');

    ok(VIE.Util.getAdditionalRules);
    ok(typeof VIE.Util.getAdditionalRules === 'function');

    ok(VIE.Util.createSimpleRule);
    ok(typeof VIE.Util.createSimpleRule === 'function');

    ok(VIE.Util.getDepiction);
    ok(typeof VIE.Util.getDepiction === 'function');
    
});