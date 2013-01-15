//window.STANBOL_URLS = ["http://lnv-89012.dfki.uni-sb.de:9000"];
//window.STANBOL_URLS = ["http://lnv-89012.dfki.uni-sb.de:9001"];
//window.STANBOL_URLS = ["http://dev.iks-project.eu:8080/"];
window.STANBOL_URLS = ["http://dev.iks-project.eu:8081/"];
//window.STANBOL_URLS = ["http://dev.iks-project.eu/stanbolfull/"];

// Specify login data accordingly
window.username = 'admin';
window.password = 'admin';

// Please specify here the URLs and paths to be used for testing the Stanbol cmsadapter:
// ***
// your cms repository's location:
//window.CMS_REPO = "http://lnv-89012.dfki.uni-sb.de:9002/rmi";
// some rdf graph to be mapped to your repository, in the form of a string
window.CMS_rdf = '<?xml version="1.0" encoding="UTF-8"?><rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#" xmlns:dbprop="http://dbpedia.org/property/" xmlns:dbpedia="http://dbpedia.org/ontology"><rdf:Description rdf:about="urn:example:person:ernie"><dbpedia:Person>Ernie</dbpedia:Person><rdf:type rdf:resource="http://dbpedia.org/ontology/Person"/><dbpedia:profession>Friend of Bert</dbpedia:profession></rdf:Description></rdf:RDF>';
// some rdf graph to be mapped to your repository, stored in a local file
//[**NOT supported yet**]window.CMS_rdfFile = "../../../personsRDF.xml";
// the URL of a file holding an rdf graph to be mapped to your repository
window.CMS_rdfURL = "http://ontologydesignpatterns.org/ont/wn/supersenses.rdf";
// some path in your repository that will be used to test submission of repo subtrees to the contenthub via cmsadapter
window.CMS_path = "/test";
// ***