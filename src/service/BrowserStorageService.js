//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - BrowserStorage service
(function(){

VIE.prototype.BrowserStorageService = function (options) {
    var defaults = {
        /* default name of this service */
        name : 'browserStorage',
		/* default memory in bits requested for storage */
		storageSize : 1024*1024,
		/* default name for the file to store*/
		fileName : 'VIEstorage',
		/*overwrite the already saved entities*/
		overwrite : true
    };
    /* the options are merged with the default options */
    this.options = jQuery.extend(true, defaults, options ? options : {});

    this.vie = null; /* this.vie will be set via VIE.use(); */
    /* overwrite options.name if you want to set another name */
    this.name = this.options.name;
    
};

VIE.prototype.BrowserStorageService.prototype = {
    init: function() {
        this.connector = new this.vie.BrowserStorageConnector(this.options);
        return this;
    },
	
	removeFile: function(){
		this.connector.removeFile();
		return this;
	},
	
	remove: function(removable, success, error){
		var correct = removable instanceof this.vie.Removable;
        if (!correct) {
            throw new Error("Invalid Removable passed");
        }
		var entitySubjects = (removable.options.entity)? removable.options.entity : removable.options.entities;
		if (entitySubjects) {
			entitySubjects = (_.isArray(entitySubjects))? entitySubjects : [ entitySubjects ];
		};
		this.connector.remove(entitySubjects, success, error);
	},

    load: function(loadable,success,error){
        var service = this;
        var loadAll = loadable.options.all;/*boolean. if true, then load all enitities*/
        var correct = loadable instanceof this.vie.Loadable;
        if (!correct) {
            throw new Error("Invalid Loadable passed");
        }
		var onLoadEnd = function(results){
			var entities = [];
			for(var r in results){
				var entityObject = results[r];
				var entity = new service.vie.Entity(entityObject);
				entities.push(entity);
			}
			/*Filter results that satisfy given predicate for the entities preset in loadable (listed in URIs)e*/
			entities = loadAll? entities: entities.filter(function(e){
				var b = false;
				for(var i in URIs){
					b = b || (e['@subject'] == URIs[i]);
				}
				return b;
			});
			/*Add results to VIE*/
			service.vie.entities.addOrUpdate(entities);
			console.log(entities.length + ' entities have been loaded: ',entities);
			if(success){
				success(entities);
			}
		}
		
		var error = function (e) {
            loadable.reject(e);
        };
		
		var entities = (loadable.options.entity)? loadable.options.entity : loadable.options.entities;
		var URIs = [];
		if (entities) {
			entities = (_.isArray(entities))? entities : [ entities ];
        	for (var e = 0; e < entities.length; e++) {
        		var tmpEnt = (typeof entities[e] === "string")? entities[e] : entities[e].id;
        		URIs.push(tmpEnt);
        	}
		};	
		if (entities || loadAll) {
            this.connector.load(URIs, onLoadEnd, error);
        }
		else {
            loadable.reject([]);
        }
    },
	
	save: function(savable,success,error){
		var correct = savable instanceof this.vie.Savable;
        if (!correct) {
            throw new Error("Invalid Savable passed");
        }
		var entities = (savable.options.entity)? savable.options.entity : savable.options.entities;
		if (!entities) {
            savable.reject([]);
        } else {
			entities = (_.isArray(entities))? entities : [ entities ];
			this.connector.save(entities,success,error);
        }

	}
};

VIE.prototype.BrowserStorageConnector = function (options) {
    this.options = options;
	window.requestFileSystem  = window.requestFileSystem || window.webkitRequestFileSystem;
};

VIE.prototype.BrowserStorageConnector.prototype = {

	load: function (URIs,onLoadEnd, error) {
		var fileName = this.options.fileName;
		var storageSize = this.options.storageSize;
		window.webkitStorageInfo.requestQuota(PERSISTENT, storageSize, function(grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes, function onInitFs(fs) { fs.root.getFile(fileName,{create:true}, function(fileEntry) {

				fileEntry.file(function(file) {
					var reader = new FileReader();
					reader.onloadend = function(e) {
						if(this.result && this.result!= ""){
							var results = JSON.parse(this.result);
							onLoadEnd(results);
						}
					};
					reader.readAsText(file);
				});
			});
		});
		}, function(e) {
			console.log('Error', e);
			if(error){
				error();
			}
		 }
		);
			
    },

	save: function(entities,success,error){
		var fileName = this.options.fileName;
		var storageSize = this.options.storageSize;
		var overwrite = this.options.overwrite;
		window.webkitStorageInfo.requestQuota(
			PERSISTENT, 
			storageSize, 
			function(grantedBytes) {
				window.requestFileSystem(PERSISTENT, 
				grantedBytes, 
				function onInitFs(fs) { 
					fs.root.getFile(
						fileName, 
						{create: true}, 
						function(fileEntry) {
							fileEntry.createWriter(function(fileWriter) {
								fileEntry.file(function(file) {
									/*First load the saved data*/
									var reader = new FileReader();
									reader.onloadend = function(e) {
										var savedEntityObjects = [];
										var saveString = '';
										if(this.result && this.result != ""){
											try{
												savedEntityObjects = JSON.parse(this.result);
												var Subjects = [];
												if(overwrite){
													for(var i in entities){
														var entity = entities[i];
														Subjects.push(entity.getSubject());
													};
													/*Filter out the already saved entity objects, which don't appear in the entities to save*/
													savedEntityObjects = savedEntityObjects.filter(function(e){
														var b = true;
														for(var i in Subjects){
															b = b && (Subjects[i] != e['@subject']);
														}
														return b;
													});
												}
												else{
													for(var i in savedEntityObjects){
														var entityObject = savedEntityObjects[i];
														Subjects.push(entityObject['@subject']);
													};
													/*Filter out the entities to save from those, which already exist*/
													entities = entities.filter(function(e){
														var b = true;
														for(var i in Subjects){
															b = b && (Subjects[i] != e.getSubject())
														}
														if(!b){
															console.warn('Entity already exists!',e);
														}
														return b;
													});
												}
											}
											catch (e) {
												console.log('Failed to parse data from ' + fileName,e);
											}
										}
										/*Add 'entities to save' to the 'already saved entities, which don't need to be updated'*/
										for(var i in entities){
											var entity = entities[i];
											savedEntityObjects.push(entity.toJSON());
										}
										saveString = JSON.stringify(savedEntityObjects);
										fileWriter.truncate(0);
										fileWriter.onwriteend = function(e){
											/*Call the Write method*/
											var bb = new window.WebKitBlobBuilder();
											bb.append(saveString);
											fileWriter.onwriteend = function(e){
												console.log('Write to ' + fileName + ' completed.');
												if(success){
													success();
												}
											}
											fileWriter.write(bb.getBlob('text/plain'));
										}
									};
									reader.readAsText(file);
								});
								fileWriter.onerror = function(e) {
									console.log('Write failed: ' + e.toString());
									if(error){
										error();
									}
								};
							});
			});
			}, function(e) {
				console.log('Error', e);
			})
		});
		return this;
	},
	
	removeFile: function(){
		var fileName = this.options.fileName;
		window.requestFileSystem(
			PERSISTENT, 
			this.options.storageSize, 
			function onInitFs(fs) { 
				fs.root.getFile(fileName, {create: true}, function(fileEntry) {
					fileEntry.remove(function() {
						console.log('File removed.');
					});
				});
			}
		);
	},
	
	remove: function(subjects, success, error){
		var fileName = this.options.fileName;
		var storageSize = this.options.storageSize;
		window.webkitStorageInfo.requestQuota(PERSISTENT, storageSize, function(grantedBytes) {
			window.requestFileSystem(PERSISTENT, grantedBytes, function onInitFs(fs) { fs.root.getFile(fileName, {create: true}, function(fileEntry) {
				fileEntry.createWriter(function(fileWriter) {
					fileEntry.file(function(file) {
						/*First load the saved data*/
						var reader = new FileReader();
						reader.onloadend = function(e) {
							var savedEntityObjects = [];
							var saveString = '';
							if(this.result && this.result != ""){
								try{
									savedEntityObjects = JSON.parse(this.result);
									/*Filter out the already saved entity objects, which don't appear in the entities to remove*/
									savedEntityObjects = savedEntityObjects.filter(function(e){
										var b = true;
										for(var i in subjects){
											b = b && (subjects[i] != e['@subject']);
										}
										return b;
									});
									saveString = JSON.stringify(savedEntityObjects);
									fileWriter.truncate(0);
									fileWriter.onwriteend = function(e) {
										fileWriter.onwriteend = function(e){
											console.log('Entities have been removed.');
											if(success){
												success();
											}
										}	
										/*Call the Write method*/
										var bb = new window.WebKitBlobBuilder();
										bb.append(saveString);
										fileWriter.write(bb.getBlob('text/plain'));
									}
								}
								catch (e) {
									console.log('Failed to parse data from ' + fileName,e);
								}
								
							}
						};
						reader.readAsText(file);
					});
				});
			});
			}, function(e) {
				console.log('Error', e);
				if(error){
					error();
				}
			})
		});
		return this;
	}
};
})();

