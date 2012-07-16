
test("VIE.js StanbolConnector - Perform SPARQL Query", function() {
    if (navigator.userAgent === 'Zombie') {
        return;
    }

    var query = "PREFIX fise: <http://fise.iks-project.eu/ontology/> "
 + "PREFIX dc:   <http://purl.org/dc/terms/> "
 + "SELECT distinct ?enhancement ?content ?engine ?extraction_time "
 + "WHERE { " + "?enhancement a fise:Enhancement . "
 + "?enhancement fise:extracted-from ?content . "
 + "?enhancement dc:creator ?engine . "
 + "?enhancement dc:created ?extraction_time . " + "} "
 + "ORDER BY DESC(?extraction_time) LIMIT 5";

    // Sending a an example with double quotation marks.
  var z = new VIE();
  ok(z.StanbolService);
  equal(typeof z.StanbolService, "function");
  var stanbol = new z.StanbolService( {
     url : stanbolRootUrl
 });
  z.use(stanbol);
  stop();
  stanbol.connector.sparql(query, function(response) {
     ok(response instanceof Document);
     var xmlString = (new XMLSerializer()).serializeToString(response);
     var myJsonObject = xml2json.parser(xmlString);

     ok(myJsonObject.sparql);
     ok(myJsonObject.sparql.results);
     ok(myJsonObject.sparql.results.result);
     ok(myJsonObject.sparql.results.result.length > 0);

     start();
 }, function(err) {
     ok(false, "SPARQL endpoint returned no response!");
     start();
 });
});
