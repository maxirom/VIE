module("vie.js - Apache Stanbol Service");

/* All known endpoints of Stanbol */

/* The ones marked with a "!!!" are implemented by the StanbolConnector */
/* The ones marked with a "???" are implemented but still broken */

// !!! /enhancer/chain/default
// !!! /enhancer/chain/<chainId>
// !!! /entityhub/sites/referenced
// !!! /entityhub/sites/entity
// !!! /entityhub/sites/find
// 
// !!! /entityhub/query
// ??? /entityhub/sites/query - strange exception, see test "Query (non-local)"
// !!! /entityhub/site/<siteId>/query
// !!! /entityhub/sites/ldpath
// !!! /entityhub/site/<siteId>/entity
// !!! /entityhub/site/<siteId>/find
// !!! /entityhub/site/<siteId>/ldpath
// !!! /entityhub/entity (GET, PUT, POST, DELETE)
// !!! /entityhub/mapping
// !!! /entityhub/find
// !!! /entityhub/lookup
// !!! /entityhub/ldpath
// 
// ??? /sparql
// 
// !!! /contenthub/contenthub/ldpath - createIndex(), deleteIndex() - DELETE
// access problem
// !!! /contenthub/contenthub/store - uploadContent()
// !!! /contenthub/contenthub/store/raw/<contentId> - getTextContentByID()
// !!! /contenthub/contenthub/store/metadata/<contentId> - getMetadataByID()
// !!! /contenthub/<coreId>/store - uploadContent()
// !!! /contenthub/<coreId>/store/raw/<contentId> - getTextContentByID()
// !!! /contenthub/<coreId>/store/metadata/<contentId> - getMetadataByID()
// ??? /contenthub/content/<contentId>
// 
// !!! /factstore/facts
// !!! /factstore/query
// 
// !!! /ontonet/ontology/
// !!! /ontonet/session/
// /ontonet/registry/
// 
// /rules/recipe
// /rules/recipe/<recipeId>
// /rules/find/recipe
// /rules/find/rules
// /rules/adapters
// /rules/adapters/recipe
// /refactor
// /refactor/apply
// /refactor/applyfile
// 
// /cmsadapter/map
// /cmsadapter/session
// /cmsadapter/contenthubfeed
var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

test("VIE.js StanbolService - Registration", function() {
    var z = new VIE();
    ok(z.StanbolService, "Checking if the Stanbol Service exists.'");
    z.use(new z.StanbolService);
    ok(z.service('stanbol'));
});