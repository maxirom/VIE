var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
"http://dev.iks-project.eu:8081",
"http://dev.iks-project.eu/stanbolfull" ];

var contentFile = (window.contentItem) ? window.contentItem : false;
    
// helper function needed in order to read from files
// shamelessly inspired by http://snipplr.com/view/4021/
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
    
//test("VIE.js StanbolService - ContentHub: Upload of content / Retrieval of enhancements",
//  function() {
//     if (navigator.userAgent === 'Zombie') {
//        return;
//    }
//    
//    var content = 'This is a small test, where Steve Jobs sings the song "We want to live forever!" song.';
//	var sid = 'stevejobs'
//    
//    var z = new VIE();
//     ok(z.StanbolService, "Stanbol Service exists.");
//     equal(typeof z.StanbolService, "function");
//
//     var stanbol = new z.StanbolService( {
//        url : stanbolRootUrl[0]
//    });
//    z.use(stanbol);
//     
//    stop();
//    stanbol.connector.uploadContent(content,
//       function(success) {
//       	  start();
//       	  ok(true, "Loaded up content to contenthub.")
//       	  
//          stop();
//		  stanbol.connector.deleteContent(
//		  	sid,
//		  	function(succ){ 
//		  		ok(true, "Deleted content item " + sid);
//		  		start();
//		  	},
//		  	function(err){ 
//		  		ok(false, "Could not delete content item " + sid);
//		  		console.log(err);
//		  		start();
//		  	}	  		
//		  );
//         
//		}, function(err) {
//        	ok(false, "Could not load up content to contenthub: " + err)
//        	console.log(err)
//            start();
//        },
//        {
//        	id : sid
//        });
//        
//        
//	    stop();
//	    var file;
//	    var xmlhttp = getXmlHttp();
//	    xmlhttp.onreadystatechange = function() {
//	       if (xmlhttp.readyState==4) { 
//	           file = xmlhttp.responseText;
//	           console.log("in if-case")
//	           console.log("***file :")
//	           console.log(file)			// here, we have the true content of the file
//	       }
//	    }
//	    xmlhttp.open("GET", contentFile, true);
//	    xmlhttp.send(null);
//	    console.log(xmlhttp);
//	    console.log("***file: ")
//	    console.log(file)					// here, it is 'undefined'    
//    
//        stanbol.connector.uploadContent(
//    		file, 
//    		function(xml, status, xhr){
//	    		var location = xhr.getResponseHeader('Location');
//	    		console.log("status: " + status)
//	    		ok(true, "Loaded up content from local file " + contentFile);
//	          	console.log("this is the location:")
//	          	console.log(location)
//	    		start();
//    	}, function(error){
//	    		ok(false, "Could not load up content from local file " + contentFile);
//	    		console.log(error)
//	    		start();
//    	},
//    	{
////    		id : "J-M-B",
//    		file : true
//    	});
//    
//    var bid = "jmBarrie";
//	stop();
//    content = 'James Matthew Barrie, the famous author of Peter Pan, was born in Scotland in 1860.';
//    stanbol.connector.uploadContent(
//    	content, 
//    	function(xml, status, xhr){
//    		start();
//    		ok(true, "Loaded up content with form elements.");
//    		
//			// then delete the item again:
//			stop();
//			stanbol.connector.deleteContent(bid,
//				function(succ){
//					ok(true, "Deleted content item " + bid);
//					start();
//				}, 
//				function(err){
//					ok(false, "Could not delete content item " + bid);
//					console.log(err)
//					start();
//				});
//          	
//    	}, function(error){
//    		ok(false, "Could not load up content with form elements.");
//    		console.log(error)
//    		start();
//    	},
//    	{
//    		id : "JMB_with-form-elements",	// does not work using form elements
//    		fe : {
//    			title : "Barrie",
//    			constraints : "{author: \"mere\"}",
//    			url : "http://net.tutsplus.com", TODO test separately, specify *instead* of 'content' -> 'content' might be a URL
//    			id : bid
//    		}
//    	});
//                          
//    
//  // TODO multipart-formdata file ipload does not work yet
// 	stop();
//    stanbol.connector.uploadContent(
//    	contentFile, function(xml, status, xhr){
//    		console.log("status: " + status)
//    		ok(true, "Loaded up content from local file " + contentFile);
//          	console.log("this is the location:")
//          	console.log(location)
//    		start();
//    	}, function(error){
//    		ok(false, "Could not load up content from local file " + contentFile);
//    		start();
//    	},
//    	{
////    		id : "J-M-B",
//    		file : true
//    	});
//    
//       
//});

	
// ### test for the /contenthub/contenthub/store/raw/<contentId>, the service to
// retrieve raw text content from content items via the item's id
// @author mere01
test(
  "Vie.js StanbolConnector - ContentHub/<index>/store/raw/<id>",
  function() {

     var z = new VIE();
     ok(z.StanbolService, "Stanbol Service exists.");
     equal(typeof z.StanbolService, "function");

     var stanbol = new z.StanbolService( {
        url : stanbolRootUrl[0]
    });
     z.use(stanbol);

     var content = "This is some raw text content to be stored for id 'urn:melaniesitem'.";
     var id = "urn:melaniesitem";

     // first we have to store that item to the contenthub -> to the
     // default index
     stop(); 
            // TODO try this also with some index other than default
     stanbol.connector.uploadContent(content, 
            function(response) {
                 ok(true, "01. Stored item " + id + " to contenthub.")
                 console.log("01. Stored item " + id
                   + " to contenthub");
                            
                            // hold it until we get our results
                            stanbol.connector.getTextContentByID(
                             id,
                             function(response) {
                                ok(true,
                                  "02. contenthub/contenthub/store/raw returned a response. (see log)");
                                console
                                .log("02. text content returned from contenthub/contenthub/store/raw is:");
                                console.log(response);

                            },
                            function(err) {
                                ok(false,
                                  "02. contenthub/contenthub/store/raw endpoint returned no response!");
                                console
                                .log("02. contenthub/contenthub/store/raw endpoint returned no response!");
                                console.log(err);
                            }, {});

                           
                            // delete this content item 
                            stanbol.connector.deleteContent(id, function(
                               success) {
                                ok(true, "03. deleted item " + id
                                  + " from the contenthub.");
                                console.log("03. deleted item " + id
                                  + " from the contenthub.");
                                start();
                            }, function(err) {
                                ok(false, "03. could not delete item " + id
                                  + " from the contenthub.");
                                console.log("03. could not delete item " + id
                                  + " from the contenthub.");
                                start();
                            }, {});

                        },
                        function(err) {
                            ok(false, "01. could not store content item " + id
                               + " to contenthub.");
                            console
                           .log("01. could not store content item to contenthub.");
                           console.log(err);
                           start();
                      

               }, {
            	   id : id
               });
        }); // end of test for /contenthub/contenthub/store/raw/<contentId>

// ### test for the /contenthub/contenthub/store/metadata/<contentId>, the
// service to retrieve the
// metadata (=enhancements) from content items via the item's id
// @author mere01
test(
  "Vie.js StanbolConnector - ContentHub/store/metadata/<id>",
  function() {

     var z = new VIE();
     ok(z.StanbolService, "Stanbol Service exists.");
     equal(typeof z.StanbolService, "function");

     var stanbol = new z.StanbolService( {
        url : stanbolRootUrl[0]
    });
     z.use(stanbol);

     var content = "This is a small example content item with an occurrence of entity Steve Jobs in it.";
     var id = "urn:melanie2ndsitem";

            // first we have to store that item to the contenthub -> to the
            // default index
            var url = stanbolRootUrl[0] + "/contenthub/contenthub/store/" + id;
            stop();
            stanbol.connector.uploadContent(content, 
              function(response) {
                 ok(true, "01. Stored item " + id + " to contenthub");
                 start();
                 console.log("01. Stored item " + id
                   + " to contenthub");
                 console.log(response);

                            // hold it until we get our results
                            stop();
                            stanbol.connector.getMetadataByID(
                             id,
                             function(response) {
                                ok(true,
                                  "02. contenthub/contenthub/store/metadata returned a response. (see log)");
                                console
                                .log("02. text content returned from contenthub/contenthub/store/metadata is:");
                                console.log(response);

                                // delete this content item 
                                stanbol.connector.deleteContent(id, function(
                                   success) {
                                    ok(true, "03. deleted item " + id
                                      + " from the contenthub.");
                                    console.log("03. deleted item " + id
                                      + " from the contenthub.");
                                    start();
                                }, function(err) {
                                    ok(false, "03. could not delete item " + id
                                      + " from the contenthub.");
                                    console.log("03. could not delete item " + id
                                      + " from the contenthub.");
                                    start();
                                }, {});
                            },
                            function(err) {
                                ok(false,
                                  "02. contenthub/contenthub/store/metadata endpoint returned no response!");
                                console.log(err);
                                start();
                            }, {});

                       },
                       function(err) {
                         ok(false, "01. Could not store item " + id
                           + " to contenthub.");
                         console.log("01. Could not store item " + id
                           + " to contenthub.");
                         console.log(err);
                         start();
                     },
                     {
                    	 id : id
                     });

        }); // end of test for /contenthub/contenthub/store/metadata/<contentId>

// ### test for the /contenthub endpoint, checking the ldpath functionality and
// options in working with own indices on the contenthub
// @author mere01
test("VIE.js StanbolConnector - ContentHub CRD access on indices", function() {

    if (navigator.userAgent === 'Zombie') {
        return;
    }

        // we first want to create ourselves a new index, using an ldpath
        // program
//        var ldpath = "name=melaniesIndex&program=@prefix rdf : <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs : <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont : <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string; dbpediatype = rdf:type :: xsd:anyURI; population = db-ont:populationTotal :: xsd:int;";
        var name = "melaniesIndex";
        var prog = "@prefix rdf : <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs : <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont : <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string; dbpediatype = rdf:type :: xsd:anyURI; population = db-ont:populationTotal :: xsd:int;";
        var index = name;
        console.log("index is: " + index);
        var lookfor = "name=" + index + "&program=";
        var len = lookfor.length;
        
        var z = new VIE();
        ok(z.StanbolService);
        equal(typeof z.StanbolService, "function");
        var stanbol = new z.StanbolService( {
            url : stanbolRootUrl[0]
        });
        z.use(stanbol);
        
        var there = false; // check if our index already exists on the contenthub
        
        stop();
        stanbol.connector.contenthubIndices(
         function(indices) {

            console
            .log("00. the following indices are currently managed by the contenthub:");
            console.log(indices);
            
            console.log("for loop will now check for " + lookfor);
            for (var i = 0; i < indices.length; i++) {
            	console.log("comparing against:" + indices[i]);
            	  if (indices[i].substring(0, len) === lookfor) {
            		console.log("match");
                	there = true;
                	break;
                }
            }
            
            if (there) {
            	// this doesn't work (is called too late)
            	ok(true, "00. Index " + index + " already exists. Will be deleted before we continue."); 
            	 stanbol.connector.deleteIndex(
                         index,
                         function(success) {
                            ok(true, "00. Index " + index + " was deleted from contenthub.");
                            console.log("00 deleted index " + index);
                            start();
                        },
                        function(err) {
                            ok(false, "00. Index " + index
                              + " could not be deleted from contenthub");
                            console.log("00 could not delete index");
                            start();
                        });
            } else {
            	ok(true, "00. Index " + index + " does not exist. Will be created.");
            }
    
            
           start();
        },
        function(err) {
            ok(false, "00. No contenthub indices have been returned!");
            start();
        }, 
        {},
        function(complete) {
        	

        	stop();
        	// create a new, empty index
        	stanbol.connector.createIndex(
        			{
        				name : name,
        				program : prog
        			},
        			function(success) { 
        	
        				ok(true, "success");
        				start();        				
        	
        				ok(true, "01. created new index on contenthub.");
        				console.log("01. created new index on contenthub.");
        				console.log(success);
        	
        				
        	        	// we can now store new items unto our index
        	            var item = "We are talking about huge cities such as Paris or New York, where life is an expensive experience.";
        	            var id = 'myOwnIdToUseHere';
        	            
        	            stop();
        	            
        	            stanbol.connector.uploadContent(item, function(success) {
        	                  ok(true, "02. stored item to " + index);
        	                  console.log("02 stored item " + item);
        	                  
        	       
        	                  // we can then get back this newly created item by its id:
        	                  var idToRetrieve = "urn:content-item-" + id;
        	                                                
        	                  // ... we can either retrieve its text content
        	                  stanbol.connector.getTextContentByID(
        	                        idToRetrieve,
        	                        function(success) {
        	                            ok(true, "03. retrieved item's raw text content.");
        	                            console.log("03. retrieved content item: " + success);
        	                                                      
        	                        },
        	                        function(err) {
        	                            ok(false, "03. could not retrieve item's raw text content.");
        	                     	   console.log("03. could not retrieve item's raw text content.");
        	                            console.log(err);
        	                                                      
        	                        }, {
        	                           index : index
        	                        });
        	                  
        	                  
        	                  // ... or its enhancements
        	                  stanbol.connector.getMetadataByID(
        	                        idToRetrieve,
        	                        function(success) {
        	                           ok(true,"04. retrieved content item's metadata.");
        	                             console.log("04. retrieved content item's metadata.");
        	                                      
        	                        },
        	                        function(err) {
        	                          ok(false, "04. could not retrieve content item's metadata.");
        	                     	   console.log("04. could not retrieve content item's metadata.");
        	                            console.log(err);
        	                                      
        	                        }, {
        	                             index : index
        	                        });                 
        	                  
        	                  start();
        	                  
        	                 	// finally, delete the test index
        	                  stop();
        	                  stanbol.connector.deleteIndex(
        	                   index,
        	                   function(success) {
        	                      ok(
        	                        true, "06. Index " + index + " was deleted from contenthub.");
        	                      console.log("06 deleted index " + index);
        	                      start();
        	                  },
        	                  function(err) {
        	                      ok(false, "06. Index " + index
        	                        + " could not be deleted from contenthub");
        	                      console.log("06 could not delete index");
        	                      start();
        	                  });
        	                  
        	            }, function(err) {
        	                ok(false, "02. couldn't store item to "	+ id);
        	                console.log("02 couldn't store item " + item);
        	                console.log(err);
        	                start();
        	          }, {
        	              index : index,
        	              id : id
        	         }); 
        	
        			}, function(error) {
        	
        				ok(false, "error");
        	
        				ok(false, "01. could not create index '" + index
        						+ "' on contenthub.");
        				console.log(error);
        				console.log("01. could not create index '" + index + "' on contenthub.");
        	
        				start();
        	
        			});	// end of createIndex() call
  
            
        });
      
     


    }); // end of test "CRD on contenthub indices"

