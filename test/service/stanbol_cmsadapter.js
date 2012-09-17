var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

var repo = (window.CMS_REPO) ? window.CMS_REPO : false;
var rdf = (window.CMS_rdf) ? window.CMS_rdf : false;
var rdfURL = (window.CMS_rdfURL) ? window.CMS_rdfURL : false;
var rdfFile = (window.CMS_rdfFile) ? window.CMS_rdfFile : false;
var path = (window.CMS_path) ? window.CMS_path : false;

// helper function needed in order to read from files
//@author shamelessly inspired by http://snipplr.com/view/4021/
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
	
	if ( (! repo) ) {//|| (repo === "http://lnv-89012.dfki.uni-sb.de:9002/rmi") ) {
		
		ok(true, "CMS Adapter test is not configured. If you want to run tests for the Stanbol cmsadapter, please specify your settings in VIE/utils/api_keys.js. Also remember to configure your CMS path in Stanbol: at http://lnv-89012.dfki.uni-sb.de:9001/system/console/configMgr, choose \"Apache Stanbol CMS Adapter Default RDF Bridge Configuration\" and add a bridge to your repository.");
		return;
		
	}
	
	var z = new VIE();
    ok(z.StanbolService);
    equal(typeof z.StanbolService, "function");
    var stanbol = new z.StanbolService({
        url: stanbolRootUrl[0]
    });
    z.use(stanbol);
    
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
		
		ok(true, "Obtained session key for repository.");
		console.log("Obtained session key for repository: " + key);
		
		///* this test is depending on the local file system
		if (rdfFile) {
			ok(true, "Parameter 'rdfFile' is set to " + rdfFile);
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
		} else {
			ok(true, "Parameter 'rdfFile' is *NOT* set. Not testing mapping of a local rdf file to your repository");
		}
		//*/
		
		if (rdf) {
			
			ok(true, "Parameter 'rdf' is set.");
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
		} else {
			ok(true, "Parameter 'rdf' is *NOT* set. Not testing mapping of an rdf string to your repository");
		}
		
		if (rdfURL) {
			
			ok(true, "Parameter 'rdfURL' is set to " + rdfURL);
		stanbol.connector.mapRDFtoRepository(
		   key,  
		   function(success) {
			   
			 ok(true, "Mapped remote RDF file to repository.");
			 console.log("Mapped RDF at " + rdfURL + " to repo at " + repo);
			 start();
			
		}, function(error){
			
			ok(false, "Could not map remote RDF file to repository. Make sure that '" + rdfURL + "' is accessible.");
			console.log("Could not map RDF at " + rdfURL + " to repo at " + repo);
			start();
			
		}, 
				{rdfURL : rdfURL}
				);
		} else {
			ok(true, "Parameter 'rdfURL' is *NOT* set. Not testing mapping of a remote rdf file to your repository");
		}
		
		// now submit the subtree stored in our repo at path /test to the contenthub
		if (path) {
			
			ok(true, "Parameter 'path' is set to " + path);
			
		stop();
		stanbol.connector.submitRepositoryItem(
				key, 
				function(success){
					
					ok(true, "Submitted repository item at '/test' to contenthub.");
					console.log("Submitted repository item at '/test' to contenthub.");
					console.log(success);
					start();
				},
				function(error){
					
					ok(false, "Could not submit repository item at '/test' to contenthub.");
					console.log( "Could not submit repository item at '/test' to contenthub.");
					console.log(error);
					start();
				},
				{
					recursive : true,
					path : path
				}
		);
	
		
		// and try the same thing without using a legal sessionKey
		stop();
		stanbol.connector.submitRepositoryItem(
				"0123", 
				function(success){
					
					ok(false, "Submitted repository item at '/test' to contenthub, using an illegal session key.");
					console.log("Submitted repository item at '/test' to contenthub, using an illegal session key.");
					console.log(success);
					start();
				},
				function(error){
					
					ok(true, "Could not submit repository item at '/test' to contenthub with an illegal session key.");
					console.log( "Could not submit repository item at '/test' to contenthub with an illegal session key.");
					console.log(error);
					start();
				},
				{
					recursive : true,
					path : path
				}
		);
		
		} else {
			ok(true, "Parameter 'path' is *NOT* set. Not testing submission of repository items to the Stanbol contenthub.");
		}
		
	}, function(error){
		
		ok(false, "Could not obtain session key.");
		console.log('Could not obtain session key')
		console.log(error)
		start();
	});
	
});