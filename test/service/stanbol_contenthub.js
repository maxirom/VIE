var stanbolRootUrl = (window.STANBOL_URLS) ? window.STANBOL_URLS : [
		"http://lnv-89012.dfki.uni-sb.de:9001",
		"http://dev.iks-project.eu:8081",
		"http://dev.iks-project.eu/stanbolfull" ];

// var contentFile = (window.contentItem) ? window.contentItem : false;

test(
		"VIE.js StanbolService - ContentHub: Upload of content / Retrieval of enhancements",
		function() {
			if (navigator.userAgent === 'Zombie') {
				return;
			}

			var content = 'This is a small test, where Steve Jobs sings the song "We want to live forever!" song.';
			var sid = 'stevejobs'

			var z = new VIE();
			ok(z.StanbolService, "Stanbol Service exists.");
			equal(typeof z.StanbolService, "function");

			var stanbol = new z.StanbolService({
				url : stanbolRootUrl[0]
			});
			z.use(stanbol);

			stop();
			// testing of upload and update content with form elements, using
			// text content
			stanbol.connector.uploadContent(content, function(success) {

				ok(true, "Uploaded content item " + sid + " to contenthub.")

				/**
				 * // we can now update this content:
				 * stanbol.connector.updateContent( sid, function(xml, status,
				 * xhr){
				 * 
				 * ok(true, "Updated content item with id " + sid); start();
				 *  },
				 * 
				 * function(error){ // error case for updateContent() ok(false,
				 * "Could not update item " + sid); start(); }, { fe: { content :
				 * "Paris is the capital of France.", constraints :
				 * "{type:city}", title : "France" } }); // end of error case
				 * for updateContent()
				 */

				stanbol.connector.deleteContent(sid, 
						function(success) {
					ok(true, "Deleted content item " + sid);
					start();
				}, function(error) {
					ok(false, "Could not delete content item " + sid);
					start();
				});

			}, function(err) {
				ok(false, "Could not upload content to contenthub: " + err)
				start();
			}, // end of error case for uploadContent()
			{
				id : sid
			});

			stop();
			var url = "http://en.wikipedia.org/wiki/Portal:Middle_East";
			var uri = "ontos"
			// testing of upload content with form elements, using url
			stanbol.connector.uploadContent(null, function(success) {

				ok(true, "Uploaded content item \"" + uri + "\" from URL "
						+ url);

				stanbol.connector.deleteContent(uri, function(success) {
					ok(true, "Deleted content item " + uri);
					start();
				}, function(error) {
					ok(false, "Could not delete content item " + uri);
					start();
				});

			}, function(error) {

				ok(false, "Could not upload content item from URL " + url);
				start();

			}, {

				fe : {
					title : uri,
					constraints : "{author:mere01}",
					url : url
				},
				id : uri

			});

			// // multipart-formdata file upload does not work yet
			// stop();
			// stanbol.connector.uploadContent(
			// contentFile, function(xml, status, xhr){
			// console.log("status: " + status)
			// ok(true, "Loaded up content from local file " + contentFile);
			// console.log("this is the location:")
			// console.log(location)
			// start();
			// }, function(error){
			// ok(false, "Could not load up content from local file " +
			// contentFile);
			// start();
			// },
			// {
			// // id : "J-M-B",
			// file : true
			// });

		}); // end of test for Upload of content

// ### test for the /contenthub/contenthub/store/download, the service to
// download raw data or metadata from existing content items via the item's id
// @author mere01
test(
		"VIE.js StanbolConnector - ContentHub downloadContent()",
		function() {

			var z = new VIE();
			ok(z.StanbolService);
			var stanbol = new z.StanbolService({
				url : stanbolRootUrl[0]
			});
			z.use(stanbol);

			var id = "panEmerges";
			var content = "Peter Pan first appeared in a section of The Little White Bird, a 1902 novel written by the Scottish author James Matthew Barrie for adults.";
			// in order to download a content item, we must ensure that it
			// exists
			stop();
			stanbol.connector.uploadContent(content, function(success) {

				ok(true, "Uploaded content item " + id);

				stanbol.connector.downloadContent(id,

				function(success) {

					ok(true, "Downloaded content item " + id);

					stanbol.connector.deleteContent(id, function(success) {

						ok(true, "Deleted content item " + id);
						start();
					}, function(error) {

						ok(false, "Could not delete content item " + id);
						start();
					}); // end of delete call

				}, function(error) {

					ok(false, "Could not download content item " + id);
					start();

				}, {
					type : "metadata",
					format : "application%2Frdf%2Bxml"
				}); // end of call for downloadContent()

			}, function(error) {

				ok(false, "Could not upload content item " + id);

			}, {
				id : id
			});

		}); // end of test for downloadContent()

/**
 * //### test for the /contenthub/contenthub/store/edit, the service to //
 * Creates the JSON string of a content item // // commented out because this
 * service seems to have vanished recently from // Stanbol again. // //
 * 
 * @author mere01 test("VIE.js StanbolConnector - ContentHub editContent()",
 *         function() {
 * 
 * var z = new VIE(); ok(z.StanbolService); var stanbol = new
 * z.StanbolService({url : stanbolRootUrl[0]}); z.use(stanbol);
 * 
 * var id = "panOccurrence"; var content = "James Matthew Barrie wrote two
 * stories about Peter Pan: Peter Pan in Kensington Gardens introduces the
 * character Peter Pan, while the play Peter pan, or the Boy who wouldn't grow
 * up tells the story of Peter and Wendy."; // in order to download a content
 * item, we must ensure that it exists stop();
 * stanbol.connector.uploadContent(content, function(success){
 * 
 * ok(true, "Uploaded content item " + id);
 * 
 * stanbol.connector.editContent(id,
 * 
 * function(success){
 * 
 * ok(true, "Retrieved JSON object of content item " + id);
 * 
 * stanbol.connector.deleteContent( id, function(success) {
 * 
 * ok(true, "Deleted content item " + id); start(); }, function(error) {
 * 
 * ok(false, "Could not delete content item " + id); start(); } ); // end of
 * delete call
 *  }, function(error){
 * 
 * ok(false, "Could not retrieve JSON object of content item " + id); start();
 * 
 * }); // end of call for editContent()
 * 
 *  }, function(error){
 * 
 * ok(false, "Could not upload content item " + id);
 *  }, { id : id });
 * 
 * 
 * }); // end of test for editContent()
 */

// ### test for the /contenthub/contenthub/store/raw/<contentId>, the service to
// retrieve raw text content from content items via the item's id
// @author mere01
test(
		"Vie.js StanbolConnector - ContentHub/<index>/store/raw/<id>",
		function() {

			var z = new VIE();
			ok(z.StanbolService, "Stanbol Service exists.");
			equal(typeof z.StanbolService, "function");

			var stanbol = new z.StanbolService({
				url : stanbolRootUrl[0]
			});
			z.use(stanbol);

			var content = "This is some raw text content to be stored for id 'urn:melaniesitem'.";
			var id = "urn:melaniesitem";

			// first we have to store that item to the contenthub
			stop();
			stanbol.connector
					.uploadContent(
							content,
							function(response) {
								ok(true, "01. Stored item " + id
										+ " to contenthub.")

								// hold it until we get our results
								stanbol.connector
										.getTextContentByID(
												id,
												function(response) {
													ok(true,
															"02. contenthub/contenthub/store/raw returned a response. (see log)");

													// delete this content item
													stanbol.connector
															.deleteContent(
																	id,
																	function(
																			success) {
																		ok(
																				true,
																				"03. deleted item "
																						+ id
																						+ " from the contenthub.");
																		start();
																	},
																	function(
																			err) {
																		ok(
																				false,
																				"03. could not delete item "
																						+ id
																						+ " from the contenthub.");
																		start();
																	}, {});

												},
												function(err) {
													ok(false,
															"02. contenthub/contenthub/store/raw endpoint returned no response!");

												}, {});

							}, function(err) {
								ok(false, "01. could not store content item "
										+ id + " to contenthub.");

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

			var stanbol = new z.StanbolService({
				url : stanbolRootUrl[0]
			});
			z.use(stanbol);

			var content = "This is a small example content item with an occurrence of entity Steve Jobs in it.";
			var id = "urn:melanie2ndsitem";

			// first we have to store that item to the contenthub -> to the
			// default index
			var url = stanbolRootUrl[0] + "/contenthub/contenthub/store/" + id;
			stop();
			stanbol.connector
					.uploadContent(
							content,
							function(response) {
								ok(true, "01. Stored item " + id
										+ " to contenthub");
								start();

								// hold it until we get our results
								stop();
								stanbol.connector
										.getMetadataByID(
												id,
												function(response) {
													ok(true,
															"02. contenthub/contenthub/store/metadata returned a response. (see log)");

													// delete this content item
													stanbol.connector
															.deleteContent(
																	id,
																	function(
																			success) {
																		ok(
																				true,
																				"03. deleted item "
																						+ id
																						+ " from the contenthub.");

																		start();
																	},
																	function(
																			err) {
																		ok(
																				false,
																				"03. could not delete item "
																						+ id
																						+ " from the contenthub.");

																		start();
																	}, {});
												},
												function(err) {
													ok(false,
															"02. contenthub/contenthub/store/metadata endpoint returned no response!");

													start();
												}, {});

							}, function(err) {
								ok(false, "01. Could not store item " + id
										+ " to contenthub.");
								start();
							}, {
								id : id
							});

		}); // end of test for /contenthub/contenthub/store/metadata/<contentId>

// ### test for the /contenthub endpoint, checking the ldpath functionality and
// options in working with own indices on the contenthub
// @author mere01
test(
		"VIE.js StanbolConnector - ContentHub CRD access on indices",
		function() {

			if (navigator.userAgent === 'Zombie') {
				return;
			}

			// we first want to create ourselves a new index, using an ldpath
			// program
			// var ldpath = "name=melaniesIndex&program=@prefix rdf :
			// <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs :
			// <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont :
			// <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string;
			// dbpediatype = rdf:type :: xsd:anyURI; population =
			// db-ont:populationTotal :: xsd:int;";
			var name = "melaniesIndex";
			var prog = '@prefix rdf : <http://www.w3.org/1999/02/22-rdf-syntax-ns#>; @prefix rdfs : <http://www.w3.org/2000/01/rdf-schema#>; @prefix db-ont : <http://dbpedia.org/ontology/>; title = rdfs:label :: xsd:string; dbpediatype = rdf:type :: xsd:anyURI; population = db-ont:populationTotal :: xsd:int;';
			var index = name;

			var lookfor = "name=" + index + "&program=";
			var len = lookfor.length;

			var z = new VIE();
			ok(z.StanbolService);
			equal(typeof z.StanbolService, "function");
			var stanbol = new z.StanbolService({
				url : stanbolRootUrl[0]
			});
			z.use(stanbol);

			stop();
			// check if our index already exists on the contenthub
			stanbol.connector
					.existsIndex(
							name,
							function(success) {
								ok(
										true,
										"Index "
												+ name
												+ " already exists. Will not be touched.")
								start();
							},
							function(error) {

								// since the index does not exist, we'll create
								// it and
								// perform some tests
								ok(
										true,
										"Index "
												+ name
												+ " does not exist. Will be created temporarily.")

								stanbol.connector
										.createIndex(
												{
													name : name,
													program : prog
												},
												function(success) {

													ok(true, "success");

													ok(true,
															"01. created new index on contenthub.");

													// try to get it back
													stanbol.connector
															.getIndex(
																	name,
																	function(
																			success) {
																		ok(
																				true,
																				"Got back the newly-created index.");
																	},
																	function(
																			error) {
																		ok(
																				false,
																				"Could not retrieve the newly-created index.");

																	});

													// we can now store new
													// items unto our index
													var item = "We are talking about huge cities such as Paris or New York, where life is an expensive experience.";
													var id = 'myOwnIdToUseHere';

													stanbol.connector
															.uploadContent(
																	item,
																	function(
																			success) {
																		ok(
																				true,
																				"02. stored item to "
																						+ index);

																		// ...
																		// we
																		// can
																		// then
																		// get
																		// back
																		// this
																		// newly
																		// created
																		// item
																		// by
																		// its
																		// id:
																		var idToRetrieve = "urn:content-item-"
																				+ id;

																		// ...
																		// we
																		// can
																		// either
																		// retrieve
																		// its
																		// text
																		// content
																		stanbol.connector
																				.getTextContentByID(
																						idToRetrieve,
																						function(
																								success) {
																							ok(
																									true,
																									"03. retrieved item's raw text content.");

																						},
																						function(
																								err) {
																							ok(
																									false,
																									"03. could not retrieve item's raw text content.");

																						},
																						{
																							index : index
																						});

																		// ...
																		// or
																		// its
																		// enhancements
																		stanbol.connector
																				.getMetadataByID(
																						idToRetrieve,
																						function(
																								success) {
																							ok(
																									true,
																									"04. retrieved content item's metadata.");

																							// finally,
																							// delete
																							// the
																							// test
																							// index
																							stanbol.connector
																									.deleteIndex(
																											index,
																											function(
																													success) {
																												ok(
																														true,
																														"06. Index "
																																+ index
																																+ " was deleted from contenthub.");
																												start();
																											},
																											function(
																													err) { // error
																															// callback
																															// for
																															// deleteIndex()
																												ok(
																														false,
																														"06. Index "
																																+ index
																																+ " could not be deleted from contenthub");
																												start();
																											});

																						},
																						function(
																								err) { // error
																										// callback
																										// for
																										// getMetadataByID()
																							ok(
																									false,
																									"04. could not retrieve content item's metadata.");
																							start();
																						},
																						{
																							index : index
																						});

																		// end
																		// of
																		// success
																		// callback
																		// for
																		// uploadContent()

																	},
																	function(
																			err) { // error
																					// callback
																					// for
																					// uploadContent()
																		ok(
																				false,
																				"02. couldn't store item to "
																						+ id);
																		start();
																	},
																	{
																		index : index,
																		id : id
																	}); // end
																		// of
																		// success
																		// callback
																		// for
																		// createIndex()

												},
												function(error) { // error
																	// callback
																	// for
																	// createIndex()

													ok(false, "error");

													ok(
															false,
															"01. could not create index '"
																	+ index
																	+ "' on contenthub.");

													start();

												}); // end of createIndex() call

							}); // end of error callback of existsIndex()

			stop();
			stanbol.connector
					.contenthubIndices(
							function(indices) {

								ok("Retrieved list of all ldpath programs currently managed on the contenthub.")

								start();
							}, // end of success callback for
								// contenthubIndices()

							function(err) { // error callback for
											// contenthubIndices()
								ok(false,
										"00. No contenthub indices have been returned!");
								start();
							}, {}); // end of call for contenthubIndices()

		}); // end of test "CRD on contenthub indices"

