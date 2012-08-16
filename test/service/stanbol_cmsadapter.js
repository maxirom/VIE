var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

//### test for the cmsadapter/ endpoint, the component that connects stanbol to
// content management systems and their data repositories.
//@author mere01
test("VIE.js StanbolConnector - CMS Adapter", function() {
	
	var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);

    stop();
	stanbol.connector.getReposSessionKey("http://lnv-89012.dfki.uni-sb.de:9002/rmi", 
			"admin", "admin", "JCR", function(success){
		
		ok(true, "Obtained session key for repository.");
		console.log("Obtained session key for repository: " + success);
		
//		stanbol.connector.mapRDFtoRepository(
//		   sessionKey, 
//		   rdfURI, 
//		   function(success) {
//			
//		}, function(error){
//			
//		}, 
//				options // {rdf : ('local'|'url')}
//				);
		
		start();
		
	}, function(error){
		
		ok(false, "Could not obtain session key.");
		console.log('Could not obtain session key')
		console.log(error)
		start();
	});
	
});