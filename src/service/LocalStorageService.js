//     VIE - Vienna IKS Editables
//     (c) 2011 Henri Bergius, IKS Consortium
//     (c) 2011 Sebastian Germesin, IKS Consortium
//     (c) 2011 Szaby Grünwald, IKS Consortium
//     VIE may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://viejs.org/

// ## VIE - LocalStorage service
(function(){

VIE.prototype.LocalStorageService = function (options) {
    var defaults = {
        /* default name of this service */
        name : 'localStorage',
		/* default name for the file to store*/
		keyName : 'VIEstorage',
		/*overwrite the already saved entities*/
		overwrite : true
    };
    /* the options are merged with the default options */
    this.options = jQuery.extend(true, defaults, options ? options : {});

    this.vie = null; /* this.vie will be set via VIE.use(); */
    /* overwrite options.name if you want to set another name */
    this.name = this.options.name;
    
};

VIE.prototype.LocalStorageService.prototype = {
    init: function() {
        this.connector = new this.vie.LocalStorageConnector(this.options);
        return this;
    },
	
	clear: function(){
		this.connector.clear();
	},
	
	remove: function(removable){
		var correct = removable instanceof this.vie.Removable;
        if (!correct) {
            throw new Error("Invalid Removable passed");
        }
		var entitySubjects = (removable.options.entity)? removable.options.entity : removable.options.entities;
		if (entitySubjects) {
			entitySubjects = (_.isArray(entitySubjects))? entitySubjects : [ entitySubjects ];
		};
		this.connector.remove(entitySubjects);
	},
	
    load: function(loadable){
        var service = this;
        var loadAll = loadable.options.all;/*boolean. if true, then load all enitities*/
        var correct = loadable instanceof this.vie.Loadable;
        if (!correct) {
            throw new Error("Invalid Loadable passed");
        }
		var entitySubjects = (loadable.options.entity)? loadable.options.entity : loadable.options.entities;
		if (entitySubjects) {
			entitySubjects = (_.isArray(entitySubjects))? entitySubjects : [ entitySubjects ];
		};
		var results = this.connector.load();
		var entities = [];
		for(var r in results){
			var entityObject = results[r];
			var entity = new service.vie.Entity(entityObject);
			entities.push(entity);
		};
		entities = loadAll? entities: entities.filter(function(e){
			var b = false;
			for(var i in entitySubjects){
				b = b || (e['@subject'] == entitySubjects[i]);
			}
			return b;
		});
		/*Add results to VIE*/
		service.vie.entities.addOrUpdate(entities);
		console.log(entities.length + ' entities have been loaded: ',entities);
		return entities;
    },
	
	save: function(savable){
		var correct = savable instanceof this.vie.Savable;
        if (!correct) {
            throw new Error("Invalid Savable passed");
        }
		var entities = (savable.options.entity)? savable.options.entity : savable.options.entities;
		if (!entities) {
            savable.reject([]);
        } else {
			entities = (_.isArray(entities))? entities : [ entities ];
			this.connector.save(entities);
        }

	}
};

VIE.prototype.LocalStorageConnector = function (options) {
    this.options = options;
};

VIE.prototype.LocalStorageConnector.prototype = {
	clear: function(){
		var key = this.options.keyName;
		localStorage.removeItem(key);
	},
	
	remove: function(Subjects){
		var key = this.options.keyName;
		var saveString = "";
		/*Get the already saved data*/
		var savedData = localStorage.getItem(key);
		var savedEntityObjects = [];
		if(savedData && savedData != ""){
			try{
				savedEntityObjects = JSON.parse(savedData);
				savedEntityObjects = savedEntityObjects.filter(function(e){
					var b = true;
					for(var i in Subjects){
						b = b && (Subjects[i] != e['@subject']);
					}
					return b;
				});
				var saveString = JSON.stringify(savedEntityObjects);
				localStorage.setItem(key, saveString);
			}
			catch(e){
				console.log('Failed to parse data from ' + key,e);
			}
		}
	},
	load: function(){
		var key = this.options.keyName;
		var entityObjects = [];
		var savedData = localStorage.getItem(key);
		try{
			entityObjects = JSON.parse(savedData);
		}
		catch(e){
			console.log('Failed to parse data from ' + key,e);
		}
		return 	entityObjects;
    },

	save: function(entities){
		var key = this.options.keyName;
		var overwrite = this.options.overwrite;
		var saveString = "";
		/*Get the already saved data*/
		var savedData = localStorage.getItem(key);
		var savedEntityObjects = [];
		if(savedData && savedData != ""){
			try{
				savedEntityObjects = JSON.parse(savedData);
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
				console.log('Failed to parse data from ' + key,e);
			}
		}
		for(var e in entities){
			var entity = entities[e];
			savedEntityObjects.push(entity.toJSON());
		}
		saveString = JSON.stringify(savedEntityObjects);
		
		localStorage.setItem(key, saveString);
	}
};
})();

