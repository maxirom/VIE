// for more documentation, cf. 
// http://dev.iks-project.eu:8081/contenthub/contenthub/store/#
// and
// http://dev.iks-project.eu:8081/contenthub/ldpath#

// uploadContent()
// updateContent()
// downloadContent()
// editContent()
// getTextContentByID()
// getMetadataByID()
// createIndex()
// deleteIndex()
// contenthubIndices()
// getIndex()
// existsIndex()
// deleteContent()
//
(function() {

	jQuery.extend(true, VIE.prototype.StanbolConnector.prototype, {

		// ### uploadContent(content, success, error, options)
		// Stores a content item to an index on the contenthub. If no index is
		// specified, the default index (contenthub) will be used. It is possible
		// to specify the ID under which the item will be stored.
		// **Parameters**:
		// *{string}* **content** The text content to be uploaded upon the
		//		contenthub. Specify 'null' if you want to pass the content in
		//		the form of a form element 'content' or 'url'. 
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options: Possible parameters:
		// Specify index: '<indexName>' to load up items to a specific index. 
		// If none is specified, the item will be stored to the default index 
		// (contenthub).
		// Specify id: '<id>' as the ID under which your content item will be
		// stored on the contenthub. (if you specify a form element parameter, 
		// - fe - , then this option will be ignored.
		// Specify 'fe : {}' as the form elements to be used in uploading the
		// content. As embedded keys of fe are possible: 
		// fe.id: the id for the new item. NOTE: If an item with this ID already
		//		exists, it will be overridden. 
		// fe.url: URL where the actual content resides. If this parameter is 
		// 		supplied (and content is null), then the content is retrieved 
		//		from this url
		// fe.constraints: Constraints in JSON format. Constraints are used to 
		// 		add supplementary metadata to the content item. For example, 
		// 		author of the content item may be supplied as 
		//		{author: "John Doe"}. Then, this constraint is added to the Solr
		//		and will be indexed if the corresponding Solr schema includes 
		//		the author field.
		// fe.title: The title for the content item.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		uploadContent : function(content, success, error, options) {
			
			options = (options) ? options : {};
			
			// Specify 'file: true' if the **content** you passed is not a string,	TODO
			// but the name of a local file where your content is stored.
//			file = (options.file) ? options.file : false;
			var connector = this;
			
			// construct form element request
			var formEl = {};
			if (options.fe) {
				
				formEl.title = (options.fe.title) ? options.fe.title : false;
				formEl.constraints = (options.fe.constraints) ? options.fe.constraints : false;
				formEl.url = (options.fe.url) ? options.fe.url : false;
				formEl.id = (options.fe.id) ? options.fe.id : false;
				
			}
			
			// decide if we need to send a multipart-formdata request
			var c = (content !== null) ? content : "";
//			if (file) {
//				console.log("got a file:")
//				console.log(c)
//				content = new FormData();
//				content.append('file', c);
//				
//				
//			} else {
				
				if (options.fe) {
			
					content = "content=" + c;
					
					if (formEl.url) {
						// in case a url is given, it substitutes the content
						content = "url=" + formEl.url;
					}
					
					if (formEl.title) {
						content += "&title=" + formEl.title;
					}
					if (formEl.constraints) {
						content += "&constraints=" + formEl.constraints;
					}
					
					if (formEl.id) {
						content += "&id=" + formEl.id;
					}
				}
//			}
			

			connector._iterate({
				method : connector._uploadContent,
				methodNode : connector._uploadContentNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index
							: this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store";

					// can append uri to the URL only if we're not dealing with
					// form elements
					if (!(options.fe))
					{
						var id = (opts.id) ? "/" + opts.id : '';
						u += id;
					}
					

					return u;
				},
				args : {
					content : content,
					options : options,
//					file : file,
					fe : options.fe
				},
				urlIndex : 0
			});
		},

		_uploadContent : function(url, args, success, error) {
			
			// in case we want to upload data from a local file
//			if (args.file) {
//				console.log("ajax: sending multipart-formdata")
//			
//			jQuery.ajax( {
//				success : success,
//				error : error,
//				url : url,
//				type : "POST",
//				data : args.content,
//				contentType : false,
//				processData : false,
//				cache : false
//			});
//			
//			
//			} else 
			
			// in case we have form elements specified
				if (args.fe) {
				
				jQuery.ajax( {
					success : success,
					error : error,
					url : url,
					type : "POST",
					data : args.content,
					contentType : "application/x-www-form-urlencoded",
					accepts: {"application/rdf+json": "application/rdf+json"}
				});
				
			} else {
				jQuery.ajax( {
					success : success,
					error : error,
					url : url,
					type : "POST",
					data : args.content,
					contentType : "text/plain"
				
			});
		}

	},
		_uploadContentNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "POST",
				uri : url,
				body : args.content,
				headers : {
					Accept : "application/rdf+json",
					"Content-Type" : "application/x-www-form-urlencoded"
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
		},	// end of _uploadContentNode
		
		// ### udpateContent(id, success, error, options)
		// @author mere01
		// Updates a content item on an index on the contenthub. If no index is
		// specified, the item is assumed to be located at the default index 
		// (contenthub). The old (to-be-updated) item will be deleted, and will
		// no longer be reachable under its old id. The update will be stored to
		// a new id, which is returned in the response header 'Location'.
		// **Parameters**:
		// *{string}* **id** The uri of the content item that is to be updated.	
		//		Note that after the update, the item will not be available under
		//		this item any more, but will be assigned a new uri automatically
		//		by the contenthub.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options: Possible parameters:
		// Specify index: '<indexName>' to update an item on a specific index. 
		// If none is specified, the item will be assumed to reside on the 
		// default index (contenthub).
		// Specify 'fe : {}' as the form elements to be used in uploading the
		// content. As embedded keys of fe are possible: 
		// fe.content: the content of the updated item (the old content will be
		// 		overridden by this).
		// fe.url: URL where the actual content resides. If this parameter is 
		// 		supplied (and content is null), then the content is retrieved 
		//		from this url (instead of **content**).
		// fe.constraints: Constraints in JSON format. Constraints are used to 
		// 		add supplementary metadata to the content item. For example, 
		// 		author of the content item may be supplied as 
		//		{author: "John Doe"}. Then, this constraint is added to the Solr
		//		and will be indexed if the corresponding Solr schema includes 
		//		the author field.
		// fe.title: The title for the content item.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		updateContent : function(id, success, error, options) {
			
			
			options = (options) ? options : {};
			
			// Specify 'file: true' if the **content** you passed is not a string,		TODO
			// but the name of a local file where your content is stored.
//			file = (options.file) ? options.file : false;
			
			var connector = this;
			var content = "";
			
			// construct form element request
			var formEl = {};
			if (options.fe) {
				
				formEl.content = (options.fe.content) ? options.fe.content : false;
				formEl.title = (options.fe.title) ? options.fe.title : false;
				formEl.constraints = (options.fe.constraints) ? options.fe.constraints : false;
				formEl.url = (options.fe.url) ? options.fe.url : false;
//				formEl.id = (options.fe.id) ? options.fe.id : false;
				formEl.content = (options.fe.content) ? options.fe.content : false;
				
			}
			
			// decide if we need to send a multipart-formdata request
			var c = (formEl.content) ? (formEl.content) : "";
//			if (file) {
//				console.log("got a file:")
//				console.log(c)
//				content = new FormData();
//				content.append('file', c);
//				
//				
//			} else {
				
				if (options.fe) {
			
					content += "id=" + id; // this id identifies our update-target
					
					if (formEl.content) {
						content += "&content=" + formEl.content;
					}
					if (formEl.title) {
						content += "&title=" + formEl.title;
					}
					if (formEl.constraints) {
						content += "&constraints=" + formEl.constraints;
					}
					if (formEl.url) {
						content += "&url=" + formEl.url;
					}

				}
			
//		}
			connector._iterate( {
				method : connector._updateContent,
				methodNode : connector._updateContentNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index
							: this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store/update";

					return u;
				},
				args : {
					content : content,
					options : options,
//					file : file,
					fe : options.fe
				},
				urlIndex : 0
			});
			
			},

		
		_updateContent : function(url, args, success, error) {
			
			// in case we want to upload data from a local file
//			if (args.file) {
//				console.log("ajax: sending multipart-formdata")
//			
//			$.ajax( {
//				success : success,
//				error : error,
//				url : url,
//				type : "POST",
//				data : args.content,
//				contentType : false,
//				processData : false,
//				cache : false
//			});
//			
//			
//			} else 
				// in case we have form elements specified
				if (args.fe) {
				
				$.ajax( {
					success : success,
					error : error,
					url : url,
					type : "POST",
					data : args.content,
					contentType : "application/x-www-form-urlencoded",
					accepts: {"application/rdf+json": "application/rdf+json"}
				});
				
			} else {
				
				$.ajax( {
					success : success,
					error : error,
					url : url,
					type : "POST",
					data : args.content,
					contentType : "text/plain"
					
			});
		}

	},	// end of _updateContent
	
		_updateContentNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "POST",
				uri : url,
				body : args.content,
				headers : {
					Accept : "application/rdf+json",
					"Content-Type" : "application/x-www-form-urlencoded"
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
		},	// end of _updateContentNode


		// ### downloadContent(id, success, error, options)
		// @author mere01
		// Download raw data or metadata of a content item. The downloaded
		// content is returned in the success callback.
		// **Parameters**:
		// *{string}* **id** The uri of the content item that is to be downloaded.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options: Possible parameters:
		//		type: {metadata,raw}. If no type is specified, "raw" will be
		//			used as default.
		//		format: Rdf serialization format of metadata, e.g. 
		//			"application/json", or "application/rdf/xml". If no format
		//			is specified, "application/json" will be used as default.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		downloadContent : function(id, success, error, options) {
			
			options = (options) ? options : {};
			
			var connector = this;
			
			var type = (options.type) ? options.type : "raw";
			var format = (options.format) ? options.format : "application/json";

//			curl -O "http://lnv-89012.dfki.uni-sb.de:9001/contenthub/contenthub/store/download/raw/rep5364768269159563506tmp?format=application%2Fjson"
			
			connector._iterate({
				method : connector._downloadContent,
				methodNode : connector._downloadContentNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index : this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store/download/";

					u += type;
					u += "/" + id + "?";
					u += "format=" + format;
					
					return u;
				},
				args : {
					options : options
				},
				urlIndex : 0
			});
			
			}, // end of downloadContent()

		
		_downloadContent : function(url, args, success, error) {
		
				$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET",
				contentType : "application/x-www-form-urlencoded",
				accepts: {"application/rdf+json": "application/rdf+json"}
				});


	},	// end of _downloadContent
	
		_downloadContentNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+json",
					"Content-Type" : "application/x-www-form-urlencoded"
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
		},	// end of _downloadContentNode
		

		// ### editContent(id, success, error)
		// @author mere01
		// Creates the JSON string of a content item (to be edited) to display 
		// it in the HTML view. The JSON string is returned in the success
		// callback.
		// **Parameters**:
		// *{string}* **id** The uri of the content item.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options: not specified here.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		editContent : function(id, success, error) {
			
			var connector = this;
			
			// curl http://lnv-89012.dfki.uni-sb.de:9001/contenthub/contenthub/store/edit/{id}
			
			connector._iterate({
				method : connector._editContent,
				methodNode : connector._editContentNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index : this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store/edit";
	
					u += "/" + id;
					
					return u;
				},
				args : {
					options : {}
				},
				urlIndex : 0
			});
			
			}, // end of editContent()

		
		_editContent : function(url, args, success, error) {
		
				$.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET",
				contentType : "application/x-www-form-urlencoded",
				accepts: {"application/rdf+json": "application/rdf+json"}
				});

	},	// end of _editContent
	
		_editContentNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+json",
					"Content-Type" : "application/x-www-form-urlencoded"
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
		},	// end of _editContentNode
		
		
		
		// ### getTextContentByID(id, success, error, options)
		// @author mere01
		// This method queries the Apache Stanbol contenthub for the text
		// content of a specific content item.
		// **Parameters**:
		// *{string}* **id** The id of the content item to be retrieved.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** The Options, specify e.g. index: '<indexName>'
		// if the content item you want to retrieve is stored on some contenthub
		// index other than the default index.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.getTextContentByID('urn:content-item-sha1-37c8a8244041cf6113d4ee04b3a04d0a014f6e10',
		// function (res) { ... },
		// function (err) { ... },
		// {
		// index: 'myIndex'
		// });
		getTextContentByID : function(id, success, error, options) {

			options = (options) ? options : {};

			var connector = this;

			connector._iterate( {
				method : connector._getTextContentByID,
				methodNode : connector._getTextContentByIDNode,

				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index
							: this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store/raw";

					return u;
				},
				args : {
					id : id,
					format : "text/plain",
					options : options
				},
				success : success,
				error : error,
				urlIndex : 0
			});
		}, // end of getTextContentByID

		_getTextContentByID : function(url, args, success, error) {

			jQuery.ajax( {

				success : success,
				error : error,
				url : url + "/" + args.id,
				type : "GET",
				contentType : args.format,
				accepts : args.format
			});

		}, // end of _getTextContentByID

		_getTextContentByIDNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url + "/" + args.id,
				headers : {
					Accept : args.format,
					'Content-Type' : args.format
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
		}, // end of _getTextContentByIDNode

		// ### getMetadataByID(id, success, error, options)
		// @author mere01
		// This method queries the Apache Stanbol contenthub for the metadata,
		// i.e. enhancements of a specific content item. The result is an RDF graph.
		// **Parameters**:
		// *{string}* **id** The id of the content item to be retrieved.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** The Options, specify e.g. "index:
		// '<indexName>'" if the content item you want to retrieve is stored on 
		// some contenthub index other than the default index.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.getTextContentByID('urn:content-item-sha1-37c8a8244041cf6113d4ee04b3a04d0a014f6e10',
		// function (res) { ... },
		// function (err) { ... },
		// {
		//   index: 'myIndex'
		// } );
		getMetadataByID : function(id, success, error, options) {

			options = (options) ? options : {};

			var connector = this;

			connector._iterate( {
				method : connector._getMetadataByID,
				methodNode : connector._getMetadataByIDNode,

				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');

					var index = (opts.index) ? opts.index
							: this.options.contenthub.index;

					u += "/" + index.replace(/\/$/, '');
					u += "/store/metadata";

					u += "/" + id;

					return u;
				},
				args : {
					options : options
				},
				success : success,
				error : error,
				urlIndex : 0
			});

		}, // end of query

		_getMetadataByID : function(url, args, success, error) {

			jQuery.ajax( {

				success : success,
				error : error,
				url : url,
				type : "GET",
				contentType : "text/plain",
				accepts : "text/plain"
			});

		}, // end of _getMetadataByID

		_getMetadataByIDNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : 'text/plain',
					'Content-Type' : 'text/plain'
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
		}, // end of _getMetadataByIDNode

		// ### createIndex(ldpathProgram, success, error)
		// @author mere01
		// This method creates a new index on the contenthub, using the
		// specified ldpath program.
		// **Parameters**:
		// *{object}* **ldpath** The specification of the new index in
		// ldpath syntax. This requires an object that holds two keys, 'name' 
		// and 'program', where 'name' is the name of the index to be created,
		// and 'program' is the ldpath program representing the index.
		// (see
		// http://incubator.apache.org/stanbol/docs/trunk/contenthub/contenthub5min)
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.createIndex(<ldpath>,
		// function (res) { ... },
		// function (err) { ... });
		createIndex : function(ldpath, success, error) {

			var connector = this;
			
			var msg = "Must specify both, name ('name') and ldpath program ('program') of the index to be created.";

			var submit = "name=";
			submit += ldpath.name.replace(/\/$/, '');
			submit += "&program=";
			submit += ldpath.program.replace(/\/$/, '');
			
			connector._iterate( {
				method : connector._createIndex,
				methodNode : connector._createIndexNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');
					u += "/ldpath/program";

					return u;
				},
				args : {
					data : submit
				},
				urlIndex : 0
			});
		}, // end of createIndex()

		_createIndex : function(url, args, success, error) {

			jQuery.ajax( {

				success : success,
				error : error,
				url : url,
				type : "POST",
				data : args.data
			});

		}, // end of _createIndex

		_createIndexNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "POST",
				uri : url,
				body : args.data

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
		}, // end of _createIndexNode

		// ### deleteIndex(index, success, error)
		// @author mere01
		// This method deletes the specified index from the contenthub, using
		// contenthub/ldpath/program/<indexID>
		// TAKE CARE: This will not only delete a specific index, but also all
		// the content items that were stored to this specific index!
		// **Parameters**:
		// *{string}* **index** The name of the index to be deleted permanently
		// from the contenthub.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.createIndex(<index>,
		// function (res) { ... },
		// function (err) { ... });
		deleteIndex : function(index, success, error) {

			var connector = this;
			connector._iterate( {
				method : connector._deleteIndex,
				methodNode : connector._deleteIndexNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');
					u += "/ldpath/program/" + index;

					return u;
				},
				args : {
					options : {}
				},
				urlIndex : 0
			});
		}, // end of deleteIndex()

		_deleteIndex : function(url, args, success, error) {

			jQuery.ajax( {

				success : success,
				error : error,
				url : url,
				type : "DELETE"
			});

		}, // end of _deleteIndex

		_deleteIndexNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "DELETE",
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
		}, // end of _deleteIndexNode

		// ### contenthubIndices(success, error, options)
		// @author mere01
		// This method returns a list of all indices that are currently being
		// managed on the contenthub.
		// **Parameters**:
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** Options, unused here.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.contenthubIndices(
		// function (res) { ... },
		// function (err) { ... });
		contenthubIndices : function(success, error, options) {
			options = (options) ? options : {};
			var connector = this;

			var successCB = function(indices) {
				var array = [];
				for ( var program in indices) {
					var ldpath = "name=";
					ldpath += program;
					ldpath += "&program=" + indices[program];

					array.push(ldpath);
				}

				return success(array);
			};

			connector._iterate( {
				method : connector._contenthubIndices,
				methodNode : connector._contenthubIndicesNode,
				success : successCB,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix + "/ldpath";

					return u;
				},
				args : {
					options : options
				},
				urlIndex : 0
			});
		},

		_contenthubIndices : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET",
				accepts : {
					"application/rdf+json" : "application/rdf+json"
				}
			});
		}, // end of _contenthubIndices

		_contenthubIndicesNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+json"
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
		}, // end of _contenthubIndicesNode
		
		// ### getIndex(name, success, error)
		// @author mere01
		// retrieves an ldpath program (index) by its name. The
		// function returns the program in the success callback if the program 
		// exists (is stored on the contenthub). If not, it goes into the error
		// callback.
		// **Parameters**:
		// *{string}* **name** the name of the ldpath program (index) to be
		// 		retrieved.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.contenthubIndices(
		// function (res) { ... },
		// function (err) { ... });
		getIndex : function(name, success, error) {
			
			var connector = this;

			connector._iterate( {
				method : connector._getIndex,
				methodNode : connector._getIndexNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix + "/ldpath/program?name=";
					u += name;

					return u;
				},
				args : {
					options : {}
				},
				urlIndex : 0
			});
		},	// end of getIndex()

		_getIndex : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET",
				accepts : {
					"application/rdf+json" : "application/rdf+json"
				}
			});
		}, // end of _getIndex

		_getIndexNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+json"
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
		}, // end of _getIndexNode		

		
		// ### existsIndex(name, success, error)
		// @author mere01
		// This method checks if an ldpath program (index) is stored on the
		// contenthub/ldpath. The function returns in success callback if the 
		// program exists. If not, it goes into the error callback.
		// **Parameters**:
		// *{string}* **name** the name of the ldpath program (index) to be
		// 		checked for existence.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.contenthubIndices(
		// function (res) { ... },
		// function (err) { ... });
		existsIndex : function(name, success, error) {
			
			var connector = this;

			connector._iterate( {
				method : connector._existsIndex,
				methodNode : connector._existsIndexNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix + "/ldpath/exists?name=";
					u += name;

					return u;
				},
				args : {
					options : {}
				},
				urlIndex : 0
			});
		},	// end of existsIndex()

		_existsIndex : function(url, args, success, error) {
			jQuery.ajax( {
				success : success,
				error : error,
				url : url,
				type : "GET",
				accepts : {
					"application/rdf+json" : "application/rdf+json"
				}
			});
		}, // end of _existsIndex

		_existsIndexNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "GET",
				uri : url,
				headers : {
					Accept : "application/rdf+json"
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
		}, // end of _existsIndexNode		
		
		

		// ### deleteContent(itemURI, success, error, options)
		// @author mere01
		// This method deletes the specified content item from the contenthub.
		// **Parameters**:
		// *{string}* **itemURI** The URI of the content item to be deleted 
		//		permanently from the contenthub.
		// *{function}* **success** The success callback.
		// *{function}* **error** The error callback.
		// *{object}* **options** The options. If deleting a content item on some 
		//		index, other than the default index, specify 'index' : '<indexURI>'.
		// **Throws**:
		// *nothing*
		// **Returns**:
		// *{VIE.StanbolConnector}* : The VIE.StanbolConnector instance itself.
		// **Example usage**:
		//
		// var stnblConn = new vie.StanbolConnector(opts);
		// stnblConn.deleteIndex(<index>,
		// function (res) { ... },
		// function (err) { ... });
		deleteContent : function(itemURI, success, error, options) {

			options = (options) ? options : {};
			var index = (options.index) ? ("/" + options.index) : "/contenthub";
			
			var connector = this;
			connector._iterate( {
				method : connector._deleteContent,
				methodNode : connector._deleteContentNode,
				success : success,
				error : error,
				url : function(idx, opts) {
					var u = this.options.url[idx].replace(/\/$/, '');
					u += this.options.contenthub.urlPostfix.replace(/\/$/, '');
					
					u += index;
					u += "/store/";
					
					return u;
				},
				args : {
					item : itemURI
				},
				urlIndex : 0
			});
		}, // end of deleteContent

		_deleteContent : function(url, args, success, error) {

			jQuery.ajax( {

				success : success,
				error : error,
				url : url + args.item,
				type : "DELETE"
			});

		}, // end of _deleteContent

		_deleteContentNode : function(url, args, success, error) {
			var request = require('request');
			var r = request( {
				method : "DELETE",
				uri : url + args.item

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
		} // end of _deleteContentNode

		
		
	});

})();