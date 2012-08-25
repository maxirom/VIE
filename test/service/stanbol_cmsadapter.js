var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

function getXmlHttp() {
	   if (window.XMLHttpRequest) {
	      xmlhttp=new XMLHttpRequest();
	   } else if (window.ActiveXObject) {
	      xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	   }
	   if (xmlhttp == null) {
	      alert("Your browser does not support XMLHTTP.");
	   }
	   return xmlhttp;
	}

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
    
    var repo = "http://lnv-89012.dfki.uni-sb.de:9002/rmi";
    var rdf = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dbprop="http://dbpedia.org/property/" xmlns:dbpedia="http://dbpedia.org/ontology"><rdf:Description rdf:about="urn:example:person:ernie"><dbpedia:Person>Ernie</dbpedia:Person><rdf:type rdf:resource="http://dbpedia.org/ontology/Person"/><dbpedia:profession>Friend of Bert</dbpedia:profession></rdf:Description></rdf:RDF>';
    var rdfURL = "http://www.w3.org/2001/sw/Europe/200303/geo/exampleGeo.rdf";
    var rdfFile = "../../../personsRDF.xml"; // TODO
    
    stop();
    var file;
    var xmlhttp = getXmlHttp();
    xmlhttp.onreadystatechange = function() {
       if (xmlhttp.readyState==4) { 
           file = xmlhttp.responseText;
           console.log("in if-case")
       }
    }
    xmlhttp.open("GET", rdfFile, true);
    xmlhttp.send(null);
    console.log(xmlhttp);
    console.log("file :")
    console.log(file);
    
   
	stanbol.connector.getReposSessionKey(repo, 
			"admin", "admin", "JCR", function(key){
		
		
		stanbol.connector.mapRDFtoRepository(
				   key,  
				   function(success) {
					   
					 ok(true, "Mapped local RDF data to repository.");
					 console.log("Mapped RDF from file " + rdfFile + " to repo at " + repo);
					
				}, function(error){
					
					ok(false, "Could not map local RDF data to repository.");
					console.log("Could not map RDF from File " + rdfFile + " to repo at " + repo);
					
				}, 
						{rdfFile : file}
						);
		
		ok(true, "Obtained session key for repository.");
		console.log("Obtained session key for repository: " + key);
		
		stanbol.connector.mapRDFtoRepository(
				   key,  
				   function(success) {
					   
					 ok(true, "Mapped RDF string data to repository.");
					 console.log("Mapped RDF to repo at " + repo);
					
				}, function(error){
					
					ok(false, "Could not map RDF string data to repository.");
					console.log("Could not map RDF to repo at " + repo);
					
				}, 
						{rdf : escape(rdf)}
						);
		
		stanbol.connector.mapRDFtoRepository(
		   key,  
		   function(success) {
			   
			 ok(true, "Mapped remote RDF file to repository.");
			 console.log("Mapped RDF at " + rdfURL + " to repo at " + repo);
			 start();
			
		}, function(error){
			
			ok(false, "Could not map remote RDF file to repository.");
			console.log("Could not map RDF at " + rdfURL + " to repo at " + repo);
			start();
			
		}, 
				{rdfURL : rdfURL}
				);
		
		
		
	}, function(error){
		
		ok(false, "Could not obtain session key.");
		console.log('Could not obtain session key')
		console.log(error)
		start();
	});
	
});