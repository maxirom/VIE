// getReposSessionKey()
// mapRDFtoRepository()		(**upload of local files is not supported yet**)
// mapRepositoryToRDF()
// submitRepositoryItem()
// deleteRepositoryItem()
//
(function(){
		
	jQuery.extend(VIE.prototype.StanbolConnector.prototype, {
		
		// ### getReposSessionKey(reposURL, usrName, passwd, connectionType, success, error, options)
		// @author mere01
		// retrieves a session key to access a content repository. A session key
		// is needed for operations on the cmsadapter/ endpoint.
		// For JCR repositories RMI protocol, for CMIS repositories AtomPub 
		// Binding is used
		// **Parameters**:
		// *{string}* **reposURL** the URL of the content repository
		// *{string}* **usrName** the user name to be used on the repository
		// *{string}* **passwd** the password to be used on the repository
		// *{string}* **connectionType** JCR or CMIS
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options, optionally specify
		// 'workspaceName': For JCR repositories; this parameter determines the 
		// workspace to be connected. For CMIS repositories, the repository ID 
		// should be set to this parameter. In case of not setting 
		// this parameter, for JCR the default workspace is selected, for CMIS 
		// the first repository obtained through the session object is selected.
		// (cf. http://dev.iks-project.eu:8081/cmsadapter/session#)
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
		// instance itself.	
	getReposSessionKey : function(reposURL, usrName, passwd, connectionType, success, error, options){
		
		options = (options) ? options : {};
		var connector = this;
	// curl -i -X GET 
	// -H "Accept: text/plain" 
	// "http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/session?repositoryURL=http://lnv-89012.dfki.uni-sb.de:9002/rmi&username=admin&password=admin&connectionType=JCR"
		connector._iterate( {
			method : connector._getReposSessionKey,
			methodNode : connector._getReposSessionKeyNode,
			success : success,
			error : error,

			url : function(idx, opts) {
			  var u = this.options.url[idx].replace(/\/$/, '');
			  u += this.options.cmsadapter.urlPostfix.replace(/\/$/, '');
			  u += this.options.cmsadapter.session.replace(/\/$/, '');

			  u += "?repositoryURL=" + reposURL;
			  u += "&username=" + usrName;
			  u += "&password=" + passwd;
			  u += "&connectionType=" + connectionType;
			  
			  
			  
			  if (options.workspaceName) {
				 u += "&workspaceName=" + options.workspaceName;
			  }
			  
  			  return u;

		},
		args : {
		},
		urlIndex : 0
		});
	}, // end of getReposSessionKey
	
	_getReposSessionKey : function(url, args, success, error) {
		jQuery.ajax( {
			beforeSend: function(xhrObj) {
				xhrObj.setRequestHeader("Accept", "text/plain");
			},
			success : success,
			error : error,
			url : url,
			type : "GET"
		});
	}, // end of _getReposSessionKey

	_getReposSessionKeyNode : function(url, args, success, error) {
		var request = require('request');
		var r = request( {
			method : "GET",
			uri : url,
			headers : {
				Accept : "text/plain"
			}
		}, function(err, response, body) {
			try {
				success( {
					results : JSON.parse(body)
				});
			} catch (e) {
				error(e);
			}
		});
		r.end();
	}, // end of _getReposSessionKeyNode
	
	// ### mapRDFtoRepository(sessionKey, success, error, options)
	// @author mere01
	// update of content repository based on external RDF data:
	// in a first step, the given raw RDF data is annotated with standard terms 
	// from the CMS vocabulary. In a second step, annotated RDF is processed and
	// the content repository is updated accordingly.
	// (cf. http://dev.iks-project.eu:8081/cmsadapter/map#)
	// **Parameters**:
	// *{string}* **sessionKey** the session key that provides interaction with
	//		the content repository. A session key can be obtained by calling 
	// 		getReposSessionKey().
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	//
	// *{object}* **options** Options. There are 3 possible ways of submitting
	//		RDF data:
	//		{rdfURL : '<rdfURL>'} to specify the URL of some remote RDF file
	//		{rdfFile : '<rdfFile>'} to specify a local RDF file to be loaded
	//			by the cmsadapter. **NOT supported yet**.
	// 		Optionally, in case that a local RDF file is specified, a parameter
	//		'rdfFileInfo' can be specified to carry information about the
	//		submitted RDF file.
	//		{rdf : '<rdfString>'} to specify plain RDF data as a string, in the
	//			'application/rdf+xml' format.
	//		In case more than one of the three main options is specified, only
	//		one of them will be considered. Priority is: rdf > rdfURL > rdfFile 
	//
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	mapRDFtoRepository : function(sessionKey, success, error, options) {
		
		// a local file:
		// curl -i -X POST 
		//   -F "rdfFile=@personsRDF.xml" 
		//   "http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/map/rdf?sessionKey=5d934b53-dc33-4d9c-884f-c16c8ba872af"

		// a remote file:
		// curl -i -X POST 
		//   -d "sessionKey=5d934b53-dc33-4d9c-884f-c16c8ba872af&url=http://www.w3.org/2001/sw/Europe/200303/geo/exampleGeo.rdf" 
		//   http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/map/rdf
		
		// a string that contains the RDF data:
		// curl -i -X POST
		// -d "sessionKey=dfe9fe63-a6d1-4d39-85ec-4e558bd4d5d7&serializedGraph=<?xml...</rdf:RDF>"
		// http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/map/rdf
		
		options = (options) ? options : false;
		
		var rdfURL = (options.rdfURL) ? options.rdfURL : false;
		var rdfFile = (options.rdfFile) ? options.rdfFile : false;
		var rdf = (options.rdf) ? options.rdf : false;
		
		// must specify at least one of them
		if (!rdfURL && !rdfFile && !rdf) {
		
			return "Must specify one of the options 'rdfURL', 'rdfFile', or 'rdf'.";
		}
		
		if (rdfFile) {
			
			var info = (options.rdfFileInfo) ? options.rdfFileInfo : false;
		}
		
		var connector = this;

		var data = false;
		var local = false;
		
		if (rdf) {
			
			data = "sessionKey=" + sessionKey;
			data += "&serializedGraph=" + rdf;
			
		} else if (rdfURL){
			
			data = "sessionKey=" + sessionKey;
			data += "&url=" + rdfURL;
			
		} else {
			
			var local = true;
			
			data = new FormData();
			data.append('rdfFile', rdfFile);
			
			if (info) {
				data.append('rdfFileInfo', info);
			}

		}

		connector._iterate( {
			method : connector._mapRDFtoRepository,
			methodNode : connector._mapRDFtoRepositoryNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(
						/\/$/, '');
				u += this.options.cmsadapter.urlPostfix
						.replace(/\/$/, '');
				u += this.options.cmsadapter.map.replace(/\/$/, '');
				u += "/rdf";
				
				if (local) {
					u += "?sessionKey=" + sessionKey;
				} 
				
				return u;
			},
			args : {
				local : local,
				data : data
			},
			urlIndex : 0
		});

	}, // end of mapRDFtoRepository

	_mapRDFtoRepository : function(url, args, success, error) {

		if (args.local) {
		$.ajax( {
			success : success,
			error : error,
			url : url,
			type : "POST",
			data : args.data,
			contentType : false,
			processData : false,
			cache : false
		});
		
		} else {
		
			$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data
			});
			
		}
	}, // end of _mapRDFtoRepository

	_mapRDFtoRepositoryNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			data : args.data,
			uri : url
		}, function(err, response, body) {
			try {
				success( {
					results : JSON.parse(body)
				});
			} catch (e) {
				error(e);
			}
		});
		r.end();
	}, // end of _mapRDFtoRepositoryNode

	
	// ### mapRepositoryToRDF(sessionKey, baseURI, success, error, options)
	// @author mere01
	// maps a content repository to RDF.
	// **Parameters**:
	// *{string}* **sessionKey** the session key that provides interaction with
	//		the content repository. A session key can be obtained by calling 
	// 		getReposSessionKey().
	// *{string}* **baseURI* Base URI for the RDF to be generated.
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Available parameters:
	//		'store':  A boolean value indicating whether the generated RDF will 
	//		be stored persistently or not. (default is false)
	//		'update': A boolean value indicating whether the generated will be 
	//		added into an existing RDF having the specified baseURI (default is true). 
	// 		If there is no existing RDF, a new one is created. This parameter is
	//		considered only if 'store' is set as true.
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
		mapRepositoryToRDF : function(sessionKey, baseURI, success, error, options) {
		
		// curl -i -X POST 
		//	-d "sessionKey=70d925b7-3438-4232-b850-d91d10a58dc&baseURI=http://www.apache.org/stanbol/cms&store=true" 
		//	http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/map/cms

		options = (options) ? options : false;
		
		if (options) {
			var store = (options.store) ? options.store : false;
			if (store) {
				var update = (options.update) ? options.update : true;
			}
		}
		
		var connector = this;

		var data = false;
		
		data = "sessionKey=" + sessionKey;
		data += "&baseURI=" + baseURI;
		
		if (store) {
			data += "&store=" + store;
			if (update) {
				data += "&update=" + update;
			}
		}

		connector._iterate( {
			method : connector._mapRepositoryToRDF,
			methodNode : connector._mapRepositoryToRDFNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(
						/\/$/, '');
				u += this.options.cmsadapter.urlPostfix
						.replace(/\/$/, '');
				u += this.options.cmsadapter.map.replace(/\/$/, '');
				u += "/cms";
				
				return u;
			},
			args : {
				data : data
			},
			urlIndex : 0
		});

	}, // end of mapRepositoryToRDF

	_mapRepositoryToRDF : function(url, args, success, error) {
	
			$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data
			});
		
	}, // end of _mapRepositoryToRDF

	_mapRepositoryToRDFNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			data : args.data,
			uri : url
		}, function(err, response, body) {
			try {
				success( {
					results : JSON.parse(body)
				});
			} catch (e) {
				error(e);
			}
		});
		r.end();
	}, // end of _mapRepositoryToRDFNode


	
	// ### submitRepositoryItem(sessionKey, success, error, options)
	// @author mere01
	// enables submission of content repository objects to Contenthub through 
	// either their IDs or paths in the content repository. Enhancements of 
	// content items are obtained through Stanbol Enhancer before submitting 
	// them to Contenthub.
	// (cf. http://dev.iks-project.eu:8081/cmsadapter/contenthubfeed)
	// **Parameters**:
	// *{string}* **sessionKey** the session key that provides interaction with
	//		the content repository. A session key can be obtained by calling 
	// 		getReposSessionKey().
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Available parameters:
	//	@FormParam id: Content repository ID of the content item to be submitted
	//	@FormParam path: Content repository path of the content item to be submitted
	//	@FormParam recursive: This parameter is used together with path parameter. 
	//		Its default value is false. If it is set as true, all content repository 
	//		objects under the specified path are processed.
	//	@FormParam indexName: Name of the Solr index managed by Contenthub. 
	//		Specified index will be used to submit the content items.
	//	@FormParam contentProperties: This parameter indicates the list of properties 
	//		that are possibly holding the actual content. Possible values are 
	//		passed as comma separated. Its default value is content, skos:definition.
	// Mandatory parameters are the session key and one of id and path.
	// If both, id and path are specified, only the id parameter is used to 
	// identify the repository node.
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	submitRepositoryItem : function(sessionKey, success, error, options) {
				
		// curl -i -X POST 
		//   --data "sessionKey=eeae036f-2e22-4a8e-8f1d-860a246f1750&path=/test&recursive=yes" 
		//   http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/contenthubfeed
		
		options = (options) ? options : false;
		
		if (! options) {
			return "Must specify at least a session key and one of path or id of the repository.";
		}
		
		var params = {};
		params.sessionKey = sessionKey;
		
		var id = (options.id) ? options.id : false;
			
		var path = (options.path) ? options.path : false;
			
		if (id && path) {
			params.id = id;
		} else if (id) {
			params.id = id;
		} else if(path) {
			params.path = path;	
			}
		
		if (path) {
			var recursive = (options.recursive) ? options.recursive : false;
			if (recursive) {
				params.recursive = recursive;
			}
		}
		
		var indexName = options.indexName;
			if (indexName) {
				params.indexName = indexName;
			}
		var contentProperties = options.contentProperties;
			if (contentProperties) {
				params.contentProperties = contentProperties;
			}
		
		var connector = this;

		var data = "";
		
		for (var key in params) {
			data += key + "=" + params[key] + "&";
		}

		connector._iterate( {
			method : connector._submitRepositoryItem,
			methodNode : connector._submitRepositoryItemNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(
						/\/$/, '');
				u += this.options.cmsadapter.urlPostfix
						.replace(/\/$/, '');
				u += this.options.cmsadapter.contenthubfeed.replace(/\/$/, '');
				
				return u;
			},
			args : {
				data : data
			},
			urlIndex : 0
		});

	}, // end of submitRepositoryItem

	_submitRepositoryItem : function(url, args, success, error) {
	
			$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data
			});
			
	}, // end of _submitRepositoryItem

	_submitRepositoryItemNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "POST",
			data : args.data,
			uri : url

		}, function(err, response, body) {
			try {
				success( {
					results : JSON.parse(body)
				});
			} catch (e) {
				error(e);
			}
		});
		r.end();
	}, // end of _submitRepositoryItemNode
		
	// ### deleteRepositoryItem(sessionKey, success, error, options)
	// @author mere01
	// deletes content items from the contenthub through either their IDs or 
	// paths in the content repository.
	// (cf. http://dev.iks-project.eu:8081/cmsadapter/contenthubfeed)
	// **Parameters**:
	// *{string}* **sessionKey** the session key that provides interaction with
	//		the content repository. A session key can be obtained by calling 
	// 		getReposSessionKey().
	// *{function}* **success** The success callback.
	// *{function}* **error** The error callback.
	// *{object}* **options** Options. Available parameters:
	//	@FormParam id: Content repository ID of the content item to be deleted
	//	@FormParam path: Content repository path of the content item to be deleted
	//	@FormParam recursive: This parameter is used together with path parameter. 
	//		Its default value is false. If it is set as true, all content repository 
	//		objects under the specified path are processed (deleted).
	//	@FormParam indexName: Name of the Solr index managed by Contenthub. 
	//		Specified index will be used to submit the content items.
	// Mandatory parameters are the session key and one of id and path.
	// If both, id and path are specified, only the id parameter is used to 
	// identify the repository node.
	// **Throws**:
	// *nothing*
	// **Returns**:
	// *{VIE.StanbolConnector}* : The VIE.StanbolConnector
	// instance itself.
	deleteRepositoryItem : function(sessionKey, success, error, options) {
		
		// curl -i -X DELETE 
		// 	--data "sessionKey=5d934b53-dc33-4d9c-884f-c16c8ba872af&path=/contenthubfeedtest&recursive=true" 
		//	http://lnv-89012.dfki.uni-sb.de:9001/cmsadapter/contenthubfeed

		options = (options) ? options : false;
		
		if (! options) {
			return "Must specify at least a session key and one of path or id of the repository.";
		}
		
		var params = {};
		params.sessionKey = sessionKey;
		
		var id = (options.id) ? options.id : false;
			
		var path = (options.path) ? options.path : false;
			
		if (id && path) {
			params.id = id;
		} else if (id) {
			params.id = id;
		} else if(path) {
			params.path = path;	
			}
		
		if (path) {
			var recursive = (options.recursive) ? options.recursive : false;
			
			params.recursive = recursive;
			
		}
		
		var indexName = (options.indexName) ? options.indexName : false;
			if (indexName) {
				params.indexName = indexName;
			}
		
		var connector = this;

		var data = "";
		
		for (var key in params) {
			data += key + "=" + params[key] + "&";
		}

		connector._iterate( {
			method : connector._deleteRepositoryItem,
			methodNode : connector._deleteRepositoryItemNode,
			success : success,
			error : error,
			url : function(idx, opts) {
				var u = this.options.url[idx].replace(
						/\/$/, '');
				u += this.options.cmsadapter.urlPostfix
						.replace(/\/$/, '');
				u += this.options.cmsadapter.contenthubfeed.replace(/\/$/, '');
				
				return u;
			},
			args : {
				data : data
			},
			urlIndex : 0
		});

	}, // end of deleteRepositoryItem

	_deleteRepositoryItem : function(url, args, success, error) {
	
			$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "DELETE",
				data : args.data
			});
			
	}, // end of _deleteRepositoryItem

	_deleteRepositoryItemNode : function(url, args, success,
			error) {
		var request = require('request');
		var r = request( {
			method : "DELETE",
			data : args.data,
			uri : url,
		}, function(err, response, body) {
			try {
				success( {
					results : JSON.parse(body)
				});
			} catch (e) {
				error(e);
			}
		});
		r.end();
	}	// end of _deleteRepositoryItemNode
	
	});
	
})();