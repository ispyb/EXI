dust.helpers.decimal = function(chunk, context, bodies, params) {
    if (params.key){
        var value = context.current()[params.key];
        if (params.key.split(".").length > 1) {
            var keys = params.key.split(".");
            value = context.current()[keys[0]][keys[1]];
        }
        if (value){
            if (params.decimals != null){
                try{
                        if (params.intIfPossible){
                            if (parseInt(Number(value)) == Number(value)) {
                                chunk.write(parseInt(Number(value)));
                            } else {
                                chunk.write(Number(value).toFixed(params.decimals));
                            }
                        } else {
                            chunk.write(Number(value).toFixed(params.decimals));
                        }
                }
                catch(e){
                    
                    /** There was an error, we leave same value */
                    chunk.write(context.current()[params.key]);    
                }
            }
            else{
                /** No decimals then same value */
                chunk.write(context.current()[params.key]);
            }
        }
    }
    else{
        chunk.write('WARN: NO KEY SET');
    }
    return chunk;
};

dust.helpers.dataCollectionComment = function (chunk, context, bodies, params) {
    if (params.key) {
        var value = context.current()[params.key];
        if (value){
            if (value.trim() != "") {
                chunk.write('Comment: ' + value);
            }
        }
    }
    else{
        chunk.write('WARN: NO KEY SET');
    }
    return chunk;
}

dust.helpers.sizeOf = function(chunk, context, bodies, params) {
  var value = this.size(chunk, context, bodies, params);
  return (bodies && bodies.block) ? chunk.render(bodies.block, context.push({ isSelect: true, isResolved: false, selectKey: value })) : value;
};

dust.helpers.exponential = function(chunk, context, bodies, params) {
    if (params.key){            
        var value = context.current()[params.key];
        if (value){
            if (params.decimals != null){
                try{
                        chunk.write(Number(Number(value).toFixed(params.decimals)).toExponential());
                }
                catch(e){
                    
                    /** There was an error, we leave same value */
                    chunk.write(context.current()[params.key]);    
                }
            }
            else{
                /** No decimals then same value */
                chunk.write(context.current()[params.key]);
            }
        }
        
    }
    else{
        chunk.write('WARN: NO KEY SET');
    }
        return chunk;
    
};

dust.helpers.mmVolTest = function(chunk, context, bodies, params) {      
    var value = context.current()["Subtraction_volume"];
    if (value){
        try{
                chunk.write(Number(value / 2).toFixed(1) + " - " + Number(value / 1.5).toFixed(1));
        }
        catch(e){
            
            /** There was an error, we leave same value */
            chunk.write(context.current()[params.key]);    
        }
    }
    return chunk;
    
};


dust.helpers.framesColor = function(chunk, context, bodies, params) {          
    var merge = context.current()["Merge_framesMerge"];
    var count = context.current()["Merge_framesCount"];
    var color = "undefined";
    if (merge == null || count == null) {
        color = "orange";
    } else {
        if (merge/count >= 0.3) {
            color = "orange";
        }
        if (merge/count >= 0.7) {
            color = "undefined";
        }
        if (merge/count < 0.3) {
            color = "red"
        }
    }
    try{
            chunk.write(color);
    }
    catch(e){
        
        /** There was an error, we leave same value */
        chunk.write(context.current()[params.key]);    
    }
    return chunk;
    
};

dust.helpers.fileName = function (chunk, context, bodies, params) {
    var filePath = context.current()["filePath"];
    if (filePath) {
        try{
            var withExtension = filePath.substring(filePath.lastIndexOf('/')+1);
            chunk.write(withExtension.substring(0,withExtension.indexOf(".")));
        }
        catch(e){
            /** There was an error, we leave same value */
            chunk.write(context.current()[params.key]);    
        }
    }
    return chunk;
}
//
//function ExiController(){
//	this.init();
//};
//
//ExiController.prototype.init = function(){
//	function setPageBackground() {
//
//	}
//	function notFound() {
//
//	}
//
//	function loadNavigationPanel(listView){
//		/** Cleaning up navigation panel **/
//		EXI.clearNavigationPanel();
//		EXI.setLoadingNavigationPanel(true);
//		
//		/** Load data data **/
//		var adapter = new DataAdapter();
//		adapter.onSuccess.attach(function(sender, data) {
//			/** Load panel **/
//			EXI.addNavigationPanel(listView);
//			/** Load data **/
//			listView.store.loadData(data);
//			EXI.setLoadingNavigationPanel(false);
//		});
//		
//		/** Handle error **/
//		adapter.onError.attach(function(sender, data) {
//			EXI.setLoadingNavigationPanel(false);
//		});
//		return adapter;
//	}
//	
//	
//	/** Welcome Page **/
//	Path.map("#/").to(function() {}).enter(setPageBackground);
//	
//	
//	/** 
//	 * Loading navigation panel
//	 *  
//	 * #/session/nav
//	 * #/experiment/nav
//	 * #/macromolecule/nav
//	 * 
//	 * */
//	Path.map("#/:navigation/nav").to(function() {
//		/** Session navigation **/
//		if (this.params['navigation'] == "session") {
//			var listView = new SessionListView();
//			/** When selected move to hash **/
//			listView.onSelect.attach(function(sender, selected) {
//				location.hash = "/session/nav/" + selected[0].sessionId + "/session";
//			});
//			var adapter = loadNavigationPanel(listView);
//			adapter.getSessions();
//		}
//
//		if (this.params['navigation'] == "shipping") {
//			var listView = new ShippingListView();
//			/** When selected move to hash **/
//			listView.onSelect.attach(function(sender, selected) {
//				location.hash = "/shipping/" + selected[0].shippingId + "/main";
//			});
//			var adapter = loadNavigationPanel(listView);
//			adapter.getShippings();
//		}
//		
//		if (this.params['navigation'] == "experiment") {
//			var listView = new ExperimentListView();
//			/** When selected move to hash **/
//			listView.onSelect.attach(function(sender, selected) {
//				location.hash = "/experiment/experimentId/" + selected[0].experimentId + "/main";
//			});
//			var adapter = loadNavigationPanel(listView);
//			adapter.getExperiments();
//		}
//		
//		if (this.params['navigation'] == "template") {
//			var listView = new TemplateListView();
//			/** When selected move to hash **/
//			listView.onSelect.attach(function(sender, selected) {
//				location.hash = "/experiment/templateId/" + selected[0].experimentId + "/main";
//			});
//			var adapter = loadNavigationPanel(listView);
//			adapter.getByExperimentByKey("experimentType", "TEMPLATE");
//		}
//		
//
//		if (this.params['navigation'] == "macromolecule") {
//			alert("not implemented yet");
//		}
//		
//	}).enter(setPageBackground);
//
//	/** Loading a single session on the navigation panel **/
//	Path.map("#/session/nav/:sessionId/session").to(function() {
//		var listView = new ExperimentListView();
//		/** When selected move to hash **/
//		listView.onSelect.attach(function(sender, selected) {
//			location.hash = "/experiment/experimentId/" + selected[0].experimentId + "/main";
//		});
//		var adapter = loadNavigationPanel(listView);
//		adapter.getExperimentsBySessionId(this.params['sessionId']);
//		
//	}).enter(setPageBackground);
//
//	Path.map("#/experiment/experimentId/:experimentId/main").to(function() {
//			var mainView = new ExperimentMainView();
//			EXI.addMainPanel(mainView);
//			mainView.load(this.params['experimentId']);
//					/** Selecting data collections from experiment **/
//			mainView.onSelect.attach(function(sender, element) {
//					EXI.localExtorage.selectedSubtractionsManager.append(element);
//			});
//			mainView.onDeselect.attach(function(sender, element) {
//					EXI.localExtorage.selectedSubtractionsManager.remove(element);
//			});
//
//	}).enter(setPageBackground);
//	
//	
//	/** Loading Experiments **/
//	Path.map("#/experiment/:key/:value/main").to(function() {
//		var adapter = new DataAdapter();
//		EXI.setLoadingMainPanel();
//		adapter.onSuccess.attach(function(sender, data) {
//			EXI.setLoadingMainPanel(false);
//			if (data != null) {
//				if (data.length > 0) {
//					var mainView = null;
//					if (data[0].experimentType == "STATIC") {
//						mainView = new ExperimentMainView();
//						
//					}
//					if (data[0].experimentType == "HPLC") {
//						mainView = new HPLCMainView();
//					}
//					
//					if (data[0].experimentType == "TEMPLATE") {
//						mainView = new TemplateMainView();
//					}
//					
//					EXI.addMainPanel(mainView);
//					mainView.load(data);
//					/** Selecting data collections from experiment **/
//					mainView.onSelect.attach(function(sender, element) {
//						EXI.localExtorage.selectedSubtractionsManager.append(element);
//					});
//					mainView.onDeselect.attach(function(sender, element) {
//						EXI.localExtorage.selectedSubtractionsManager.remove(element);
//					});
//					
//				}
//			}
//		});
//		if ((this.params['key'] == "experimentId")||(this.params['key'] == "templateId")){
//			adapter.getByExperimentId([this.params['value']]);
//		}
//		else{
//			adapter.getByExperimentByKey(this.params['key'], this.params['value']);
//		}
//		
//
//	}).enter(setPageBackground);
//
//	Path.map("#/tool/crysol/main").to(function() {
//		var mainView = new CrysolMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//
//	
//	Path.map("#/tool/subtraction/main").to(function() {
//		var mainView = new SubtractionMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	Path.map("#/datacollection/:key/:value/main").to(function() {
//		EXI.setLoadingMainPanel();
//		var adapter = new DataAdapter();
//		adapter.onSuccess.attach(function(sender, data) {
//			var mainView = new DataCollectionMainView();
//			EXI.addMainPanel(mainView);
//			mainView.load(data);
//			EXI.setLoadingMainPanel(false);
//			/** Selecting data collections from experiment **/
//			mainView.onSelect.attach(function(sender, element) {
//				EXI.localExtorage.selectedSubtractionsManager.append(element);
//			});
//			mainView.onDeselect.attach(function(sender, element) {
//				EXI.localExtorage.selectedSubtractionsManager.remove(element);
//			});
//		});
//		adapter.getDataCollectionsByKey(this.params['key'], this.params['value']);
//
//	}).enter(setPageBackground);
//
//	
//	Path.map("#/datacollection/:key/:value/primaryviewer").to(function() {
//		var adapter = new DataAdapter();
//		adapter.onSuccess.attach(function(sender, data) {
//			var primaryMainView = new PrimaryDataMainView();
//			EXI.addMainPanel(primaryMainView);
//			primaryMainView.load(data);
//
//		});
//		adapter.getDataCollectionsByKey(this.params['key'], this.params['value']);
//	}).enter(setPageBackground);
//
//	Path.map("#/datacollection/:key/:value/merge").to(function() {
//		var adapter = new DataAdapter();
//		adapter.onSuccess.attach(function(sender, data) {
//			var primaryMainView = new MergeMainView();
//			EXI.addMainPanel(primaryMainView);
//			primaryMainView.load(data);
//
//		});
//		adapter.getDataCollectionsByKey(this.params['key'], this.params['value']);
//	}).enter(setPageBackground);
//
//	Path.map("#/project/:projectId/run/:runId/main").to(function() {
//		var projectId = this.params['projectId'];
//		var runId = this.params['runId'];
//		var exidataAdapter = new ExiDataAdapter();
//		exidataAdapter.onSuccess.attach(function(sender, runs) {
//			for (var i = 0; i < runs.length; i++) {
//				if (runs[i].internalId == runId) {
//					var main = new RunMainView();
//					EXI.addMainPanel(main);
//					main.load(runs[i]);
//				}
//			}
//		});
//		exidataAdapter.getRuns(projectId);
//	}).enter(setPageBackground);
//
//	
//	Path.map("#/prepare/designer/main").to(function() {
//		var mainView = new ExperimentDesignerMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/prepare/buffer/main").to(function() {
//		var mainView = new BufferMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/shipping/:shippingId/main").to(function() {
//		var mainView = new ShippingMainView();
//		var shippindId = this.params['shippingId'];
//		EXI.addMainPanel(mainView);
//		mainView.load(shippindId);
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/prepare/stocksolution/main").to(function() {
//		var mainView = new StockSolutionMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/prepare/macromolecule/main").to(function() {
//		var mainView = new MacromoleculeMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	Path.map("#/prepare/templates/main").to(function() {
//		var mainView = new ExperimentDesignerMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(setPageBackground);
//	
//	Path.map("#/prepare/designer").to(function() {
//		var wizardWidget = new WizardWidget({
//			windowMode : true,
//			width : 1200
//		});
//
//		wizardWidget.onFinished.attach(function(sender, result) {
//			var adapter = new DataAdapter();
//			wizardWidget.window.close();
//			EXI.setLoading();
//			adapter.onSuccess.attach(function(sender, experiment) {
//				location.hash = "/experiment/experimentId/" + experiment.experimentId + "/main";
//			});
//			wizardWidget.current.setLoading("ISPyB: Creating experiment");
//			
//			adapter.saveTemplate(result.name, "comments", result.data);
//		});
//
//		var manager = new ProposalUpdater(); 
//		manager.onSuccess.attach(function(sender, proposals){
//			wizardWidget.draw(this.targetId, new MeasurementCreatorStepWizardForm(ProposalManager.getMacromolecules(), ProposalManager.getBuffers()));
//		});
//		manager.get();
//		
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/welcome/:user/main").to(function() {
//		var user = this.params['shippingId'];
//		var mainView = new WelcomeMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load(user);
//	}).enter(setPageBackground);
//	
//	
//	
//	Path.map("#/login").to(function() {
//		var _this = this;
//		
//		
//		EXI.authenticationForm.show();
//		return;
//		var authenticationForm = new AuthenticationForm();
//		authenticationForm.onAuthenticate.attach(function(sender, args){
//			var authenticationManager = new AuthenticationManager();
//			authenticationManager.onSuccess.attach(function(sender, args){
//				/** This user has been authenticated **/
////				EXI.localExtorage.tokenManager.addToken(args.user, args.token, args.url);
////				debugger
//				EXI.credentialManager.addCredential(args.user, args.roles, args.token, args.url);
////				EXI.mainMenu.addLoggin(args.user,  args.url);
//				authenticationForm.window.close();
//				
//				/** load proposals **/
//				location.hash = "/welcome/" + args.user + "/main";
//				
//				/** Loading projects **/
////				var exidataAdapter = new ExiDataAdapter();
////				exidataAdapter.onSuccess.attach(function(sender, projects){
////					EXI.localExtorage.userManager.setProjects(projects);
////				});
////				exidataAdapter.getUser();
//				
//				/** Loading proposal **/
////				new ProposalUpdater().get(true);
//				
////				window.location.href = 'main.html';
//				
//			});
//			
//			authenticationManager.login(args.user, args.password, args.site);
//			
//		});
//		authenticationForm.show();
//		
//	}).enter(setPageBackground);
//	
//	
//	Path.map("#/logout").to(function() {
//		EXI.credentialManager.logout();
////		if (EXI.localExtorage){
////			EXI.localExtorage.clear();
////		}
////		if (EXI.mainMenu){
////			EXI.mainMenu.setCredentials();
////		}
//		
////		window.location.href = 'main.html';
//		
//	}).enter(setPageBackground);
//	
//	// Here we set a "root route".  You may have noticed that when you landed on this
//	// page you were automatically "redirected" to the "#/users" route.  The definition
//	// below tells PathJS to load this route automatically if one isn't provided.
//	Path.root("#/");
//
//	// The `Path.rescue()` method takes a function as an argument, and will be called when
//	// a route is activated that you have no yet defined an action for.  On this example
//	// page, you'll notice there is no defined route for the "Unicorns!?" link.  Since no
//	// route is defined, it calls this method instead.
//	Path.rescue(notFound);
//	
//	
//};

function Exi(args) {
	var _this = this;
	
	this.headerCssClass = "titlePanel";
	
	/** Active Menu **/
	this.mainMenu = new MainMenu();
	/** When user is not logged in **/
	this.anonymousMenu = null;
	/** When user is logged in **/
	this.userMenu = null;
	/** When user is manager **/
	this.managerMenu = null;
	
	/** If false when opening a new tab it will close the already open ones **/
	this.keepTabs = false;
	
	
	this.controllers = [new ExiController(), new ProposalExiController(), new ShippingExiController()];
	
	if (args != null){
		if (args.menu != null){
			this.mainMenu = args.menu;
			this.userMenu = args.menu;
		}
		if (args.anonymousMenu != null){
			this.anonymousMenu = args.anonymousMenu;
		}
		if (args.managerMenu != null){
			this.managerMenu = args.managerMenu;
		}
		
		if (args.headerCssClass != null){
			this.headerCssClass = args.headerCssClass;
		}
		
		if (args.controllers != null){
			for (var i = 0; i < args.controllers.length; i++) {
				this.controllers.push(args.controllers[i]);
			}
		}
	}
	/** Status bar **/
	this.mainStatusBar = new MainStatusBar();
	
	/** Proposal manager **/
	this.proposalManager = new ProposalManager();
	
	this.credentialManager = new CredentialManager();
	this.credentialManager.onLogout.attach(function(sender){
		_this.mainMenu.populateCredentialsMenu();
		_this.clearMainPanel();
		_this.clearNavigationPanel();
		_this.setAnonymousMenu();
		Ext.getCmp("navigation").collapse();
		location.hash = '/welcome';
	});
	
	
	this.credentialManager.onLogin.attach(function(sender, credential){
		_this.manageMenu(credential);
	});
	
	this.credentialManager.onActiveProposalChanged.attach(function(sender){
		_this.mainMenu.populateCredentialsMenu();
	});
	
	/** AUTHENTICATION FORM **/
	this.authenticationForm = new AuthenticationForm();
	this.authenticationForm.onAuthenticate.attach(function(sender, args){
		var authenticationManager = new AuthenticationManager();
        
		authenticationManager.onSuccess.attach(function(sender, data){
            
			/** This user has been authenticated **/           
			_this.credentialManager.addCredential(data.user, data.roles, data.token, args.site, args.exiUrl, args.properties);
			_this.authenticationForm.window.close();			
			var credential = EXI.credentialManager.getCredentialByUserName(data.user);
			
			if (credential.isManager()||credential.isLocalContact()){
				location.hash = "/welcome/manager/" + data.user + "/main";
			}
			else{
				location.hash = "/welcome/user/" + data.user + "/main";        
			}
			
            
			/** Authenticating EXI in the offline system**/            
			_this.getDataAdapter().exi.offline.authenticate();
			
		});
		authenticationManager.onError.attach(function(sender, data){
			alert("error");
		});
		authenticationManager.login(args.user, args.password, args.site);
	});
	
	this.onAfterRender = new Event(this);
}

/**
 * This method append to args the values of the active connection: url, token and proposal
 */
Exi.prototype.appendDataAdapterParameters = function(args) {
    if (!args){ args = {};}
    
     /** Is your token still valid */     
     
    if (EXI.credentialManager.getCredentials()[0]){        
        if (!EXI.credentialManager.getCredentials()[0].isValid()){                        
           location.hash = '/welcome';
           return;
        }        
    }	
            
    var connections = EXI.credentialManager.getConnections();
    /** Authentication data adapter does not need any token **/
    if (connections.length > 0){
        args.url = connections[0].url;
        args.token = connections[0].token;
        args.proposal = connections[0].proposal;			
    }
    return args;
        	
};


Exi.prototype.getDataAdapter = function(args) {   
    var dataAdapter =  new DataAdapterFactory(this.appendDataAdapterParameters(args));       
    return dataAdapter;  	
};

Exi.prototype.setAnonymousMenu = function() {
	this.mainMenu = this.anonymousMenu;
	Ext.getCmp("mainMenu").removeAll();
	Ext.getCmp("mainMenu").add(EXI.mainMenu.getPanel());
};

Exi.prototype.setUserMenu = function() {
	this.mainMenu = this.userMenu;
	Ext.getCmp("mainMenu").removeAll();
	Ext.getCmp("mainMenu").add(EXI.mainMenu.getPanel());
};

Exi.prototype.setManagerMenu = function() {
	this.mainMenu = this.managerMenu;
	Ext.getCmp("mainMenu").removeAll();
	Ext.getCmp("mainMenu").add(EXI.mainMenu.getPanel());
};

Exi.prototype.manageMenu = function (credential) {
	if (credential.isManager()) {
		this.setManagerMenu();
	} else {
		this.setUserMenu();
	}
	this.mainMenu.populateCredentialsMenu();
}

Exi.prototype.loadSelected = function(selected) {
};

/**
 * Adds a new Main panel to the center panel
 * @param mainView
 */
Exi.prototype.addMainPanel = function(mainView) {
	if (!this.keepTabs){
		Ext.getCmp('main_panel').removeAll();
	}
	Ext.getCmp('main_panel').add(mainView.getPanel());
	Ext.getCmp('main_panel').setActiveTab(Ext.getCmp('main_panel').items.length - 1);
};

Exi.prototype.getSelectedDataCollections = function() {
	var selected = [];
	for (var i = 0; i < this.experimentListView.length; i++) {
		selected = selected.concat(this.experimentListView[i].getSelected());
	}
	return selected;
};

Exi.prototype.addNavigationPanel = function(listView) {
	Ext.getCmp('navigation').add(listView.getPanel());
	if (Ext.getCmp("navigation") != null){
		Ext.getCmp("navigation").expand();
        this.showNavigationPanel();
	}
};

Exi.prototype.hideNavigationPanel = function(listView) {
	if (Ext.getCmp("navigation") != null){
		Ext.getCmp('navigation').hide();
	}
};

Exi.prototype.showNavigationPanel = function(listView) {
	if (Ext.getCmp("navigation") != null){
		Ext.getCmp('navigation').show();
	}
};


Exi.prototype.clearNavigationPanel = function() {
	Ext.getCmp('navigation').removeAll();
};

Exi.prototype.clearMainPanel = function() {
	Ext.getCmp('main_panel').removeAll();
};

Exi.prototype.setLoadingNavigationPanel = function(isLoading) {
	Ext.getCmp('navigation').setLoading(isLoading);
};

Exi.prototype.setLoadingMainPanel = function(isLoading) {
	Ext.getCmp('main_panel').setLoading(isLoading);
};

Exi.prototype.setError = function(error) {
	this.mainStatusBar.showError(error);
};

Exi.prototype.setLoading = function(isLoading) {
	if ((isLoading == null) || (isLoading  == true)){
		this.mainStatusBar.showBusy();
	}
	else{
		this.mainStatusBar.showReady();
	}
};

Exi.prototype.getHeader = function(error) {
	return '<img class="titleImage" src="images/logo_EMBL.png"><span class="title">Extended ISPyB</span>';
};

Exi.prototype.show = function() {
	var _this = this;
	Ext.application({
				name : 'ExiSAXS',
				launch : function() {
					Ext.create(
									'Ext.container.Viewport',
									{
										layout : 'border',
										items : [
												{
													region : 'north',
													xtype : 'component',
													padding : 10,
													height : 75,
													html : _this.getHeader(),
													cls : _this.headerCssClass

												}, {
													region : 'north',
													cls : 'toolbarPanel',
													id : 'mainMenu',
													xtype : 'panel',
													width : 400,
													items : _this.mainMenu.getPanel() },

												{
													xtype : 'panel',
													id : 'navigation',
													region : 'west',
													width : 250,
													split : false,
													title : 'Browse by',
													cls : 'navigation',
													collapsible : true,
													collapsed : true
													

												},
//												{
//													xtype : 'panel',
//													id : 'workspace',
//													region : 'east',
//													width : 250,
//													collapsed : true,
//													title : 'Workspace',
//													split : false,
//													layout : 'fit',
////													title : 'Browse by',
//													cls : 'navigation',
//													collapsible : true,
//													items : [_this.workspacePanel.getPanel()]
//
//												},
												{
													region : 'center',
													id : 'main_panel',
													xtype : 'tabpanel',
													cls : 'navigation',
													plain : true,
													items : []
												},
												{
														region : 'south',
														xtype : 'panel',
														cls : 'statusBar',
														bbar : _this.mainStatusBar.getBar() 
												}
													],
										listeners : {
											afterrender : function(component, eOpts) {
														_this.mainMenu.populateCredentialsMenu();
														_this.onAfterRender.notify();
														
//														/** If there is a user login then we show the menu **/
														if (_this.credentialManager.getCredentials() == 0){
															_this.setAnonymousMenu();
														}
														else{
															var credential = _this.credentialManager.getCredentials()[0];
															_this.manageMenu(credential);
														}
											} } });
				}

			});
};


function MainStatusBar(){
	
	
}

MainStatusBar.prototype.getBar = function(){
	this.statusBar =  Ext.create('Ext.ux.StatusBar', {
		id : 'main-status-bar',
	    text: 'Ready',
	    iconCls: 'accept',
	    busyIconCls: 'busy',
	    busyText:   this.busyText,
	    cls : 'statusBar',
		statusAlign : 'right'
	});
	return this.statusBar;
};

MainStatusBar.prototype.showBusy = function(msg){
    if (msg == null){
        msg = 'Connecting to servers...';
    }
    this.statusBar.busyText = msg;
	this.statusBar.showBusy();
};

MainStatusBar.prototype.showError = function(error){
	this.statusBar.clearStatus();
	this.statusBar.setStatus({
	    text: error,
	    iconCls: 'error'
	});
};

MainStatusBar.prototype.showReady = function(){
	this.statusBar.clearStatus();
	this.statusBar.setStatus({
	    text: 'Ready',
	    iconCls: 'accept'
	});
};





/**
* Class used to manage the common points for a single or several proposals. It deals with methods to help the management of crystals, proteins, macromolecules, buffer, stockSolutions and labcontacts
*
* @class ProposalManager
* @constructor
*/
function ProposalManager() {
    this.onActiveProposalChanged = new Event(this);
}


/**
* It gets the information of the proposals that are found on the local Storage in the field called proposal. If it does not exist it will load form the server and store them on the local storage
* @method get
* @param {Boolean} forceUpdate if true the proposals information will be reloaded from the server asyncrhonously
*/
ProposalManager.prototype.get = function(forceUpdate) {
    var _this = this;
	if ((localStorage.getItem("proposals") == null)||(forceUpdate)){
       
		var onSuccess= function(sender, proposals){
			localStorage.setItem("proposals", JSON.stringify(proposals));
            _this.onActiveProposalChanged.notify();
		};
		EXI.getDataAdapter({async : false, onSuccess : onSuccess}).proposal.proposal.getProposalsInfo();
	}	
  
	return JSON.parse(localStorage.getItem("proposals"));
};

/**
* It removes the information from the local storage. It means it remove the proposals item
* @method clear
*/
ProposalManager.prototype.clear = function() {
	localStorage.removeItem('proposals');
};

/**
* It gets a list of sessions from the local storage or retrieve them from the server if the proposals have not been loaded yet. It is synchronous.
* @method getSessions
*/
ProposalManager.prototype.getSessions = function() {
	if (localStorage.getItem("sessions") == null){
		var onSuccess= function(sender, sessions){
			localStorage.setItem("sessions", JSON.stringify(sessions));
		};
		EXI.getDataAdapter({async : false, onSuccess : onSuccess}).proposal.session.getSessions();
	}
	return JSON.parse(localStorage.getItem("sessions"));
};

/**
* It gets a list of sessions which start date comes after today.
* @method getFutureSessions
*/
ProposalManager.prototype.getFutureSessions = function() {
	var sessions = this.getSessions();
	var today = moment();
	var futureSessions = [];
	for (var i = 0; i < sessions.length; i++) {        
		if (today.diff(sessions[i].BLSession_startDate) < 0){
			futureSessions.push(sessions[i]);
		}
	}
	return futureSessions;
};

/**
* It gets a list of colors
* @method getBufferColors
*/
ProposalManager.prototype.getBufferColors = function() {
	return [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494" ];
};

/**
* It gets a list of labcontacts from the current proposal
* @method getLabcontacts
*/
ProposalManager.prototype.getLabcontacts = function() {
	return this.get()[0].labcontacts;
};

/**
* @method getLabcontactById
*/
ProposalManager.prototype.getLabcontactById = function(labContactId) {
	return _.find(this.getLabcontacts(), function(o) { return o.labContactId == labContactId; });
};

/**
* @method getPlateTypeById
*/
ProposalManager.prototype.getPlateTypeById = function(plateTypeId) {
	return _.find(this.getPlateTypes(), function(o) { return o.plateTypeId == plateTypeId; });
};

/**
* @method getPlateTypes
*/
ProposalManager.prototype.getPlateTypes = function() {
	return this.get()[0].plateTypes;
};

/**
* This methods is supposed to retrieve the plate configuration by flavour. However, it is not used yet
* @method getPlateByFlavour
*/
ProposalManager.prototype.getPlateByFlavour = function(flavour) {
	return [ this.getPlateTypes()[0], this.getPlateTypes()[2], this.getPlateTypes()[3] ];
};

/**
* @method getBufferById
*/
ProposalManager.prototype.getBufferById = function(bufferId) {
	var proposals = this.get();
	var f = function(o) { return o.bufferId == bufferId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].buffers, f);
		if (found != null) {return found;}
	}
};

/**
* @method getMacromoleculeById
*/
ProposalManager.prototype.getMacromoleculeById = function(macromoleculeId) {
	var proposals = this.get();
	var f = function(o) { return o.macromoleculeId == macromoleculeId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].macromolecules, f);
		if (found != null) {return found;}
	}
	return null;
};

/**
* @method getMacromoleculeByAcronym
*/
ProposalManager.prototype.getMacromoleculeByAcronym = function(acronym) {
	var proposals = this.get();
	var f = function(o) { return o.acronym == acronym; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].macromolecules, f);
		if (found != null) {return found;}
	}
	return null;
};

/**
* @method getStockSolutionById
*/
ProposalManager.prototype.getStockSolutionById = function(stockSolutionId) {
	var proposals = this.get();
	var f = function(o) { return o.stockSolutionId == stockSolutionId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].stockSolutions, f);
		if (found != null) {return found;}
	}
};

/**
* @method getBuffers
*/
ProposalManager.prototype.getBuffers = function() {
	var proposals = this.get();
	var buffers = [];
	for (var i = 0; i < proposals.length; i++) {
		buffers = buffers.concat(proposals[i].buffers);
	}
	return buffers;
};

/**
* @method getMacromolecules
*/
ProposalManager.prototype.getMacromolecules = function() {
	var proposals = this.get();
	var macromolecules = [];
	for (var i = 0; i < proposals.length; i++) {
		macromolecules = macromolecules.concat(proposals[i].macromolecules);
	}
	return macromolecules;
};

/**
* @method getProposals
*/
ProposalManager.prototype.getProposals = function() {
	var proposals = this.get();
	var result = [];
	for (var i = 0; i < proposals.length; i++) {
		proposals[i].proposal[0]["proposal"] = proposals[i].proposal[0].code + proposals[i].proposal[0].number;
		result = result.concat(proposals[i].proposal);
	}
	return result;
};

/**
* @method getProposalById
*/
ProposalManager.prototype.getProposalById = function(proposalId) {
	var proposals = this.get();
	var result = [];
	for (var i = 0; i < proposals.length; i++) {
		if (proposals[i].proposal[0].proposalId == proposalId){
			return proposals[i].proposal[0];
		}
	}
	return result;
};

/**
* @method getStockSolutions
*/
ProposalManager.prototype.getStockSolutions = function() {
	return this.get()[0].stockSolutions;
};

/**
* @method getProteins
*/
ProposalManager.prototype.getProteins = function() {
	return this.get()[0].proteins;
};

/**
* @method getCrystals
*/
ProposalManager.prototype.getCrystals = function() {
	return this.get()[0].crystals;
};

/**
* @method getProteinByAcronym
*/
ProposalManager.prototype.getProteinByAcronym = function(acronym) {
	return _.filter(this.getProteins(), function(o) { return o.acronym == acronym; });
};

/**
* @method getCrystalsByAcronym
*/
ProposalManager.prototype.getCrystalsByAcronym = function(acronym) {
	return _.filter(this.getCrystals(), 
						function(o) { 
								if (o.proteinVO == null) {return false;} 
								else {return o.proteinVO.acronym == acronym;} 
						}
	);
};

/**
* @method getStockSolutionsBySpecimen
*/
ProposalManager.prototype.getStockSolutionsBySpecimen = function(macromoleculeId, bufferId) {
	var aux = _.filter(this.getStockSolutions(), function(o) { return o.macromoleculeId == macromoleculeId; });
	return _.filter(aux, function(o) { return o.bufferId == bufferId; });
};

/**
* @method getUnpackedStockSolutions
*/
ProposalManager.prototype.getUnpackedStockSolutions = function() {
	var stockSolutions = this.getStockSolutions();
	var result = [];
	for (var i = 0; i < stockSolutions.length; i++) {
		if (stockSolutions[i].boxId == null) {
			result.push(stockSolutions[i]);
		}
	}
	return result;
};

/**
* @method getStockSolutionsByDewarId
*/
ProposalManager.prototype.getStockSolutionsByDewarId = function(dewarId) {
	return _.filter(this.getStockSolutions(), function(o) { return o.boxId == dewarId; });
};

/**
* Super class for the controllers. It manages the setPageBackground and notFound methods
*
* @class ExiGenericController
* @constructor
*/
function ExiGenericController() {
	this.init();
}


ExiGenericController.prototype.setPageBackground = function() {

};

ExiGenericController.prototype.notFound = function() {

};




function MainView(args) {
	this.id = BUI.id();
	this.title = "New Tab";
	this.closable = true; 
	this.onSelectionChange = new Event(this);
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
	
	//this.bodyStyle = {"background-color":"#FAFAFA"};
    
    if (args != null){
        if (args.title != null){
            this.title = args.title;
        }
    }

}

MainView.prototype.getContainer = function() {
	return this.container;
};

MainView.prototype.getPanel = function() {
	this.container = Ext.create('Ext.container.Container', {
		xtype : 'container',
		items : []
	});

	this.panel = Ext.create('Ext.panel.Panel', {
		autoScroll : true,
		title : this.title,
		closable: this.closable,
		icon : this.icon,
		bodyStyle: this.bodyStyle, 
		items :[this.getContainer() ]
	});
	return this.panel;
};
function AuthenticationManager(){
	this.onSuccess = new Event(this);
	this.onError = new Event(this);
}

/**
 * url to an ISPyB for instance http://ispyb.esrf.fr/ispyb-ws/rest
 * @param user
 * @param password
 * @param url
 */
AuthenticationManager.prototype.login = function(user, password, url){
	var _this = this;
	var fn = function onSuccess(sender, data) {
		_this.onSuccess.notify({
			user : user,
			roles : data.roles,
			token : data.token,
			url : url
	    });
	};
		
	var err = function(sender, data) {
		EXI.setError("Permission denied");
		BUI.showError("Your credentials are invalid");
	};
    
	EXI.getDataAdapter({
		onSuccess 	: fn,
		onError 	: err,
		url			: url,
		username 	: user
		
	}).proposal.authentication.authenticate(user, password, url);
};

function ExiController(){
	this.init();
}

ExiController.prototype.loadNavigationPanel = function(listView) {
	/** Cleaning up navigation panel * */
	EXI.clearNavigationPanel();
	EXI.setLoadingNavigationPanel(true);
	
	var onSuccess = function(sender, data) {
		/** Load panel * */
		EXI.addNavigationPanel(listView);
		/** Load data * */
		listView.load(data);
		EXI.setLoadingNavigationPanel(false);
	};
	
	/** Handle error * */
	var onError = function(sender, data) {
		EXI.setLoadingNavigationPanel(false);
	};
	
	/** Load data data * */
	return EXI.getDataAdapter({ onSuccess : onSuccess, onError : onError });
};

ExiController.prototype.init = function(){
	function setPageBackground() {

	}
	function notFound() {

	}

	/** Welcome Page **/
	Path.map("#/").to(function() {       
		location.hash = '/welcome';
	}).enter(setPageBackground);
	
	Path.map("#/login").to(function() {
        EXI.credentialManager.logout();
		EXI.authenticationForm.show();
	}).enter(setPageBackground);
	
	
	Path.map("#/welcome").to(function() {
		//EXI.addMainPanel(new WelcomeMainView());
        //location.hash = '/login';
         EXI.credentialManager.logout();
        EXI.authenticationForm.show();
	}).enter(setPageBackground);
	
	Path.map("#/welcome/user/:user/main").to(function() {
		var user = this.params['user'];		
        var mainView = new ManagerWelcomeMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		mainView.load(user);
	}).enter(setPageBackground);
	

	Path.map("#/welcome/manager/:user/main").to(function() {
        
		var user = this.params['user'];
		var mainView = new ManagerWelcomeMainView();
		EXI.addMainPanel(mainView);
        
        EXI.hideNavigationPanel();
		mainView.load(user);
	}).enter(setPageBackground);
	
    Path.map("#/welcome/manager/:user/date/:start/:end/main").to(function() {                    
		var user = this.params['user'];
		var mainView = new ManagerWelcomeMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		mainView.loadSessionsByDate(user,this.params['start'], this.params['end'] );
	}).enter(setPageBackground);
    
   
    
	
	Path.map("#/logout").to(function() {
		EXI.credentialManager.logout();
         EXI.hideNavigationPanel();
		EXI.proposalManager.clear();
		
	}).enter(setPageBackground);
	
	// Here we set a "root route".  You may have noticed that when you landed on this
	// page you were automatically "redirected" to the "#/users" route.  The definition
	// below tells PathJS to load this route automatically if one isn't provided.
	Path.root("#/");

	// The `Path.rescue()` method takes a function as an argument, and will be called when
	// a route is activated that you have no yet defined an action for.  On this example
	// page, you'll notice there is no defined route for the "Unicorns!?" link.  Since no
	// route is defined, it calls this method instead.
	Path.rescue(notFound);
	
	
};

/**
* Super class for the controllers. It manages the setPageBackground and notFound methods
*
* @class ExiGenericController
* @constructor
*/
function ExiGenericController() {
	this.init();
}


ExiGenericController.prototype.setPageBackground = function() {

};

ExiGenericController.prototype.notFound = function() {

};



function LabContactExiController() {
	this.init();
}

LabContactExiController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;

LabContactExiController.prototype.setPageBackground = function() {
};

LabContactExiController.prototype.notFound = function() {
};



LabContactExiController.prototype.init = function() {
	var _this = this;

		function setPageBackground() {
			_this.setPageBackground();
		}
		function notFound() {
			_this.notFound();
		}

		function loadNavigationPanel(listView) {
			return _this.loadNavigationPanel(listView);
		}
		
		
		var listView = null;
		var adapter = null;
		
		Path.map("#/proposal/addresses/nav").to(function() {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new AddressListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/proposal/address/" + selected[0].labContactId + "/main";
			});
			
			EXI.addNavigationPanel(listView);
			adapter = loadNavigationPanel(listView);
			adapter.proposal.labcontacts.getLabContacts();
			
			/** Loading welcome page **/
			// EXI.addMainPanel(new AddressWelcomeMainView());
			
		}).enter(this.setPageBackground);
		
		Path.map("#/proposal/address/:labcontactId/main").to(function() {
			var mainView = new AddressMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['labcontactId']);
		}).enter(this.setPageBackground);
		
};

function OfflineExiController() {
	this.init();
}

OfflineExiController.prototype.setPageBackground = function() {

};

OfflineExiController.prototype.notFound = function() {

};

OfflineExiController.prototype.init = function() {
	var _this = this;

		function setPageBackground() {
			_this.setPageBackground();
		}
		function notFound() {
			_this.notFound();
		}


		Path.map("#/tool/dimple/main").to(function() {
			var mainView = new DimpleMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);
        
          Path.map("#/tool/dimple/datacollection/:dataCollectionId/main").to(function() {
			var mainView = new DimpleDCMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['dataCollectionId']);
		}).enter(this.setPageBackground);
        
        Path.map("#/tool/reprocess/datacollection/:dataCollectionId/:startImage/:endImage/main").to(function() {
			var mainView = new ReprocessMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['dataCollectionId'],this.params['startImage'],this.params['endImage']);
		}).enter(this.setPageBackground);
        
		
		
		Path.map("#/tool/crysol/main").to(function() {
			var mainView = new CrysolMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);

		Path.map("#/tool/subtraction/main").to(function() {
			var mainView = new SubtractionMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);
		
		Path.map("#/tool/list").to(function() {
			var project = null;
			var listView = new RunListView();
			/** When selected move to hash * */
			listView.onSelect.attach(function(sender, selected) {
				var runId = selected[0].internalId;
				var projectId = project.internalId;
				if (selected[0].tool == "Dimple"){
					location.hash = "/project/" +projectId + "/dimple/" + runId + "/main";
				}
				else{
					location.hash = "/project/" +projectId + "/run/" + runId + "/main";
				}
			});

			/** Cleaning up navigation panel * */
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);

			
			var onSuccess = function(sender, data) {
				project = data[0];
				/** Load panel * */
				EXI.addNavigationPanel(listView);
				/** Load data * */
				listView.load(data[0].runs.reverse());
				EXI.setLoadingNavigationPanel(false);
			};
			
			/** Handle error * */
			var onError = function(sender, data) {
				EXI.setLoadingNavigationPanel(false);
			};
			
			EXI.getDataAdapter({onSuccess : onSuccess, onError :onError}).exi.offline.getProject();
		}).enter(this.setPageBackground);
		

	Path.map("#/project/:projectId/run/:runId/main").to(function() {
		var projectId = this.params['projectId'];
		var runId = this.params['runId'];

		var onSuccess = function(sender, runs) {
			for (var i = 0; i < runs.length; i++) {
				if (runs[i].internalId == runId) {
					var main = new RunMainView();
					EXI.addMainPanel(main);
					main.load(runs[i]);
				}
			}
		};
		var onError = function(sender) {
			BUI.showError("There was an error");
		};
		
		EXI.getDataAdapter({onSuccess : onSuccess, onError :onError}).exi.offline.getRuns(projectId);
	}).enter(this.setPageBackground);


	Path.map("#/project/:projectId/dimple/:runId/main").to(function() {
		var projectId = this.params['projectId'];
		var runId = this.params['runId'];

		var onSuccess = function(sender, runs) {
			for (var i = 0; i < runs.length; i++) {
				if (runs[i].internalId == runId) {
					var main = new DimpleRunMainView();
					EXI.addMainPanel(main);
					main.load(runs[i]);
				}
			}
		};
		var onError = function(sender) {
			BUI.showError("There was an error");
		};
		
		EXI.getDataAdapter({onSuccess : onSuccess, onError :onError}).exi.offline.getRuns(projectId);
	}).enter(this.setPageBackground);
	
	Path.rescue(notFound);

};

function ProposalExiController() {
	this.init();
}

ProposalExiController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;

ProposalExiController.prototype.setPageBackground = function() {
};

ProposalExiController.prototype.notFound = function() {
};


ProposalExiController.prototype.init = function() {
	var _this = this;

		function setPageBackground() {
			_this.setPageBackground();
		}
		function notFound() {
			_this.notFound();
		}

		function loadNavigationPanel(listView) {
			return _this.loadNavigationPanel(listView);
		}
		
		var listView = null;
		var adapter = null;

		

		Path.map("#/proposal/session/nav").to(function() {
			listView = new SessionListView();
			/** When selected move to hash * */
			listView.onSelect.attach(function(sender, selected) {
                
				if (EXI.credentialManager.getTechniqueByBeamline(selected[0].beamlineName) == "SAXS"){
					location.hash = "/session/nav/" + selected[0].sessionId + "/session";
				}
				else{
					location.hash = "/mx/datacollection/session/" + selected[0].sessionId + "/main";
				}
				
			});
            
			adapter = loadNavigationPanel(listView);
			adapter.proposal.session.getSessions();
						
		}).enter(this.setPageBackground);
	

		
		Path.map("#/proposal/address/:lacontactId/main").to(function() {
			var mainView = new AddressMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['lacontactId']);
		}).enter(this.setPageBackground);
		

		Path.map("#/puck/:containerId/main").to(function() {
			var mainView = new PuckMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['containerId']);
		}).enter(this.setPageBackground);
		
};

/**
* This is the description for routing all the session actions. It means url= #/session/*
*
* @class SessionController
* @constructor
*/
function SessionController() {
	this.init();
}

SessionController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
SessionController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the session related objects
* Paths accepted:
* #/session/nav
* #/session/nav/:sessionId/session
*
* @method init
*/
SessionController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/session/nav").to(function() {
			EXI.clearNavigationPanel();
            EXI.hideNavigationPanel();	
			/*EXI.setLoadingNavigationPanel(true);
			listView = new SessionListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/mx/datacollection/session/" + selected[0].sessionId + "/main";
			});
			EXI.addNavigationPanel(listView);
            */
            var mainView = new SessionMainView({
                title : "Sessions"
            });
           
            EXI.addMainPanel(mainView);
            
            var onSuccess = function(sender, data){
            //    listView.load(EXI.proposalManager.getSessions().slice(0, 50));
                 mainView.load(EXI.proposalManager.getSessions());
            //    EXI.hideNavigationPanel();		
            //    EXI.setLoadingNavigationPanel(false);
                 EXI.setLoadingMainPanel(false);    
            };
            EXI.setLoadingMainPanel();
            EXI.getDataAdapter({
                onSuccess : onSuccess                
            }).proposal.session.getSessions();         	

	}).enter(this.setPageBackground);

	

	Path.rescue(this.notFound);
};

function ShippingExiController() {
	this.init();
}

ShippingExiController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;

ShippingExiController.prototype.setPageBackground = function() {
};

ShippingExiController.prototype.notFound = function() {
};


ShippingExiController.prototype.loadShipmentsNavigationPanel = function(listView) {
	/** Cleaning up navigation panel * */
	EXI.clearNavigationPanel();
	EXI.setLoadingMainPanel(true);
	
	var onSuccess = function(sender, data) {
		data = BUI.groupBy(data, function(item){return item["Shipping_shippingId"];});
		var curated = [];
		for(var i = 0; i < data.length; i++){
			curated.push(data[i][0]);
		}
		curated.sort(function(a,b){return b.Shipping_shippingId - a.Shipping_shippingId;});
		
		/** Load panel * */
		EXI.addNavigationPanel(listView);
		/** Load data * */
		listView.load(curated);
		EXI.setLoadingMainPanel(false);
	};
	
	/** Handle error * */
	var onError = function(sender, data) {
		EXI.setLoadingNavigationPanel(false);
	};
	
	/** Load data data * */
	return EXI.getDataAdapter({ onSuccess : onSuccess, onError : onError });
};

ShippingExiController.prototype.init = function() {
	var _this = this;

		function setPageBackground() {
			_this.setPageBackground();
		}
		function notFound() {
			_this.notFound();
		}

		function loadNavigationPanel(listView) {
			return _this.loadNavigationPanel(listView);
		}
		
		var listView = null;
		var adapter = null;

		function loadShipmentNavigationList(){
			var listView = new ShippingListView();
			/** When selected move to hash * */
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/shipping/" + selected[0].Shipping_shippingId  + "/main";
			});
			adapter = _this.loadShipmentsNavigationPanel(listView);
			adapter.proposal.shipping.getShippings();
		}
		
		Path.map("#/proposal/shipping/nav?nomain").to(function() {
			loadShipmentNavigationList();
		});

		Path.map("#/proposal/shipping/nav").to(function() {
			loadShipmentNavigationList();
			// EXI.addMainPanel(new ShippingWelcomeMainView());
		});
		
		Path.map("#/shipping/:shippingId/main").to(function() {
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['shippingId']);
		}).enter(this.setPageBackground);

		Path.map("#/shipping/main").to(function() { 
                       
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);

		Path.map("#/shipping/:shippingId/:shippingStatus/containerId/:containerId/edit").to(function() {
			var mainView = new PuckFormView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['containerId'],this.params['shippingId'],this.params['shippingStatus']);
		}).enter(this.setPageBackground);

		Path.map("#/shipping/:shippingId/containerId/:containerId/sampleId/:sampleId/editCrystalForm").to(function() {
			var mainView = new CrystalFormView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['containerId'],this.params['sampleId'],this.params['shippingId']);
		}).enter(this.setPageBackground);

		// Path.map("#/shipping/edv").to(function() {
		// 	var mainView = new ElectronDensityViewer();
		// 	EXI.addMainPanel(mainView);
		// }).enter(this.setPageBackground);

};

/**
* Given a dustjs template and some data, it returns a panel containing a bootstrap grid
*
* @class BootstrapGrid
* @return 
*/
function BootstrapGrid(args) {
    this.id = BUI.id();
    this.data = {};
    this.width = 300;
    this.height = 300;
    this.template = "";
    if (args) {
        if (args.width) {
            this.width = args.width;
        }
        if (args.height) {
            this.height = args.height;
        }
        if (args.template) {
            this.template = args.template;
        }
    }
    
    this.data.id = this.id;

    this.rowSelected = new Event(this);
}

/**
* Returns an EXT.panel.Panel containing the html of the grid and sets the click listeners
*
* @method getPanel
* @return 
*/
BootstrapGrid.prototype.getPanel = function () {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        width : this.width,
        autoScroll:true,
        autoHeight :true,
        maxHeight: this.height,
        title : this.data.header,
        items : [{html : this.getHTML()}]
    });

    this.panel.on('boxready', function() {
        _this.setClickListeners();
    });

    return this.panel;
};

/**
* Sets the click listeners
*
* @method setClickListeners
* @return 
*/
BootstrapGrid.prototype.setClickListeners = function () {
    var _this = this;

    $('#bootstrap-table-' + this.id).unbind('click').on('click', '.clickable-row', function(event) {
        $(this).addClass('active-step').siblings().removeClass('active-step');
        _this.rowSelected.notify(event.target.innerText);
    });

};

/**
* Selects a row given its value
*
* @method selectRowByValue
* @return 
*/
BootstrapGrid.prototype.selectRowByValue = function (value) {
    var rowIndex = this.data.values.indexOf(value);
    if (rowIndex >= 0) {
        $("#row-" + rowIndex + "-" + this.id).addClass('active-step').siblings().removeClass('active-step');
        this.rowSelected.notify($("#row-" + rowIndex + "-" + this.id)[0].innerText);
    }
};

/**
* Deselects all rows
*
* @method deselectAll
* @return 
*/
BootstrapGrid.prototype.deselectAll = function () {
    $('#bootstrap-table-' + this.id).find('.clickable-row').removeClass("active-step");
};

/**
* Loads and returns the html code of the grid
*
* @method getPanel
* @return 
*/
BootstrapGrid.prototype.getHTML = function () {
    var html = "";
	dust.render(this.template, this.data, function(err, out){
		html = out;
	});

    return "<div id='bootstrap-grid-" + this.id + "'>" + html + "</div>";
};

/**
* Loads the data of the grid
*
* @method load
* @return 
*/
BootstrapGrid.prototype.load = function (data) {
    this.data = data;
    this.data.id = this.id;
    if ($("#bootstrap-grid" + this.id).length) {
        this.panel.setTitle(data.header);
        $("#bootstrap-grid" + this.id).html(this.getHTML());
        this.setClickListeners();
    }
};
function MainMenu(args) {
	this.id = BUI.id();
	this.loginButtonId = 'loginButton' + this.id;
	this.cssClass = 'mainMenu';
	this.isHidden = true;
	if (args != null){
		if (args.cssClass != null){
			this.cssClass = args.cssClass;
		}
		if (args.isHidden != null){
			this.isHidden = args.isHidden;
		}
	}
}

MainMenu.prototype.getMenuItems = function() { return [];};


/**
 * If there is a credential then home tab will redirect to the welcome page (either manager or user)
 */
MainMenu.prototype.getHomeItem = function() { 
	return {
		text : this._convertToHTMLWhiteSpan("Home"),
		cls : 'ExiSAXSMenuToolBar',
		icon : '../images/icon/rsz_ic_home_black_24dp.png',
		handler : function(){
				if (EXI.credentialManager.getCredentials() != null){
					if (EXI.credentialManager.getCredentials().length > 0){
						var username = EXI.credentialManager.getCredentials()[0].username;
						var credential = EXI.credentialManager.getCredentialByUserName(EXI.credentialManager.getCredentials()[0].username);
						if (credential.isManager()){
							location.hash = "/welcome/manager/" + username + "/main";
						}
						else{
							location.hash = "/welcome/user/" + username + "/main";
						}
					}
					else{
						BUI.showError("You should sign up");
					}
				}
				else{
					BUI.showError("You should sign up");
				}
		}
	};
};

MainMenu.prototype.getShipmentItem = function() { 
	var _this = this;

	function getBiosaxsMenu() {
		var _this = this;
		function onItemCheck(item, checked) {
			if (item.text == "Stock Solutions") {
				location.hash = "/saxs/stocksolution/nav";
			}
		}

		return Ext.create('Ext.menu.Menu', {
			items : [ 
						{
							text : 'Stock Solutions',
							icon : '../images/icon/testtube.png',
							handler : onItemCheck 
						} 
			] });
	}

	function getLabContactsMenu() {
		var _this = this;
		function onItemCheck(item, checked) {
			if (item.text == "Add new") {
				var addressEditForm = new AddressEditForm();
	
				addressEditForm.onSaved.attach(function (sender, address) {
					window.close();
					location.hash = "#/proposal/address/" + address.labContactId + "/main";
				});

				var window = Ext.create('Ext.window.Window', {
					title : 'Shipping Address Card',
					height: 550,
	   				width: 750,
					modal : true,
					layout : 'fit',
					items : [ addressEditForm.getPanel() ],
					buttons : [ {
							text : 'Save',
							handler : function() {
								addressEditForm.save();
							}
						}, {
							text : 'Cancel',
							handler : function() {
								window.close();
							}
						} ]
				}).show();

				addressEditForm.load();
			} else if (item.text == "List") {
				location.hash = "/proposal/addresses/nav";
			}
		}

		return Ext.create('Ext.menu.Menu', {
			items : [ 
						{
							text : 'Add new',
							icon : '../images/icon/add.png',
							handler : onItemCheck 
						}, {
							text : 'List',
							icon : '../images/icon/ic_list_black_24dp.png',
							handler : onItemCheck 
						} 
			] });
	}
	
	function getShipmentsMenu() {
		var _this = this;
		function onItemCheck(item, checked) {
			if (item.text == "Add new") {
				var shippingEditForm = new ShipmentEditForm();
				
				shippingEditForm.onSaved.attach(function (sender, shipment) {
					window.close();
					location.hash = "#/shipping/"+ shipment.shippingId +"/main"
				});

				var window = Ext.create('Ext.window.Window', {
					title : 'Shipment',
					height : 450,
					width : 600,
					modal : true,
					layout : 'fit',
					items : [ shippingEditForm.getPanel() ],
					buttons : [ {
							text : 'Save',
							handler : function() {
								shippingEditForm.saveShipment();
							}
						}, {
							text : 'Cancel',
							handler : function() {
								window.close();
							}
						} ]
				}).show();

				shippingEditForm.load();
			} else if (item.text == "List") {
				location.hash = "/proposal/shipping/nav";
			}
			
		}

		return Ext.create('Ext.menu.Menu', {
			items : [ 
						{
							text : 'Add new',
							icon : '../images/icon/add.png',
							handler : onItemCheck 
						}, {
							text : 'List',
							icon : '../images/icon/ic_list_black_24dp.png',
							handler : onItemCheck 
						} 
			] });
	}
	
	return {
		text : this._convertToHTMLWhiteSpan("Shipment"),
		cls : 'ExiSAXSMenuToolBar',
//		hidden : this.isHidden,
        disabled : false,
		menu : Ext.create('Ext.menu.Menu', {
			items : [ 
						{
							text : 'BioSAXS',
							icon : '../images/icon/macromolecule.png',
							menu: getBiosaxsMenu()
						}, 
						{
							text : 'Manage shipping addresses',
							icon : '../images/icon/contacts.png',
							menu : getLabContactsMenu() 
						}, 
						{
							text : 'Shipments',
							icon : '../images/icon/shipping.png',
							menu : getShipmentsMenu() 
						} 
					] })
	};

};

MainMenu.prototype.getManagerMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "AutoprocIntegrator") {
			var scatteringForm = new ScatteringForm();

			var window = Ext.create('Ext.window.Window', {
				title : 'Scattering',
				height : 450,
				width : 600,
				modal : true,
				layout : 'fit',
				items : [ scatteringForm.getPanel() ],
				buttons : [ {
						text : 'Plot',
						handler : function() {
							
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
			}).show();

			var keys = ["rPimWithinIPlusIMinus","anomalousMultiplicity","blSubSampleId","recordTimeStamp","multiplicity",
			"endTime","resolutionLimitLow","ccHalf","strategySubWedgeOrigId","startTime","completeness","rMerge","anomalous",
			"dataCollectionNumber","meanIOverSigI","proposalId","ccAno","autoProcScalingId","beamLineName","scalingStatisticsType",
			"nTotalObservations","sigAno","rMeasWithinIPlusIMinus","dataCollectionId","anomalousCompleteness","autoProcScalingStatisticsId",
			"sessionId","resolutionLimitHigh","fractionalPartialBias","rMeasAllIPlusIMinus","detectorId","nTotalUniqueObservations","rPimAllIPlusIMinus"];

			var scatteringData = {title : "AutoprocIntegrator", keys : keys};

			scatteringForm.load(scatteringData);
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [
					{
						text : 'Statistics',
						icon : '../images/icon/ic_insert_chart_black_36dp.png',
						menu : {       
								items: [
									{
										text: 'AutoprocIntegrator',
										icon : '../images/icon/ic_insert_chart_black_36dp.png',
										handler: onItemCheck
									}
								]
							}
					}
			] 
	});
};

MainMenu.prototype.getHelpMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "ISPyB Web services API Map") {
			window.open('/exi/documentation/ispyb-api-ws/print.html');
		}
		if (item.text == "Job list") {
			location.hash = "/tool/list";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [

		{
			text : 'Developer',
			checked : false,
			group : 'theme',
			menu : {       
                    items: [
                        {
                            text: 'ISPyB Web services API Map',
                            handler: onItemCheck
                        }, {
                            text: 'How to retrieve data from ISPyB?',
                            handler: onItemCheck
                        }, {
                            text: 'EXI Router',
                            handler: onItemCheck
                        }, {
                            text: 'EXI List Views Objects',
                            handler: onItemCheck
                        }, {
                            text: 'EXI Main View Objects',
                            handler: onItemCheck
                        }
                    ]
                }
		},
		"-",
		{
				text : 'About',
				checked : false,
				group : 'theme',
				handler : onItemCheck }
		] });
};

MainMenu.prototype.getAddCredentialMenu = function() {
	if (EXI.credentialManager.getCredentials() != null){
		if (EXI.credentialManager.getCredentials().length > 0){
			return {
				icon : '../images/icon/rsz_1ic_input_black_24dp.png',
				height : 30,
				text : 'Add',
				handler : function() {
						window.location.href = '#/login';
				} 
			};
		}
	}
};

MainMenu.prototype.populateCredentialsMenu = function() {
	this.credentialsMenu.removeAll();
	var credentialDisplay = "";
	if (EXI.credentialManager.getCredentials() != null) {
		for (var i = 0; i < EXI.credentialManager.getCredentials().length; i++) {
			credentialDisplay = EXI.credentialManager.getCredentials()[i].username;
			if (EXI.credentialManager.getCredentials()[i].activeProposals.length > 0) {
				for (var j = 0; j < EXI.credentialManager.getCredentials()[i].activeProposals.length; j++) {
					credentialDisplay = EXI.credentialManager.getCredentials()[i].activeProposals[j] + "@" + EXI.credentialManager.getCredentials()[i].username;
					this.credentialsMenu.add({
						text : credentialDisplay,
						icon : "../images/icon/rsz_esrflogo80.gif",
						disabled : true });
				}
			} else {
				this.credentialsMenu.add({
					text : credentialDisplay,
					icon : "../images/icon/rsz_esrflogo80.gif",
					disabled : true });
				
			}
			
			
		}
	} 
	if (EXI.credentialManager.getCredentials().length > 0){
		Ext.getCmp(this.loginButtonId).setText("<span style='color:white'>Log out <span style='font-weight:bold;'>" + credentialDisplay + " </span> </span>");
		Ext.getCmp(this.loginButtonId).setIcon("../images/rsz_logout.png");
	}
	else{
		Ext.getCmp(this.loginButtonId).setText("<span style='color:white'>Sign In</span>");
		Ext.getCmp(this.loginButtonId).setIcon("../images/rsz_login.png");
	}
	
	
};

MainMenu.prototype._convertToHTMLWhiteSpan = function(text) {
	return '<span style="color:white">' + text +'</span>';
};

MainMenu.prototype.isLoggedIn = function() {
	return (EXI.credentialManager.getCredentials().length > 0);
};


MainMenu.prototype.getLoginButton = function() {
	var icon =  "../images/rsz_login.png";
	var text =  this._convertToHTMLWhiteSpan("Sign In");
	
	if (EXI.credentialManager.getCredentials().length > 0){
		icon =  "../images/rsz_logout.png";
		text =  this._convertToHTMLWhiteSpan("log out");
	}
	
	return {
		xtype 	: 'splitbutton',
		id	: this.loginButtonId,
		text 	: text,
		cls 	: 'button_log_out',
		icon 	: icon,
		menu 	: this.credentialsMenu,
		handler : function() {
			if (EXI.credentialManager.getCredentials().length == 0){
				location.hash = "/login";
			}
			else{
				location.hash = "/logout";
			}
		} 
	};
};

MainMenu.prototype.getPanel = function() {
	
	
	this.credentialsMenu = new Ext.menu.Menu({
		id : this.id + "menu",
		items : [this.getAddCredentialMenu()] 
	});
	
	var items  = this.getMenuItems();
	items.push('->');
	items.push(this.getLoginButton());
	
	this.tb = Ext.create('Ext.toolbar.Toolbar', {
		cls : this.cssClass,
		items : items
	});
	return this.tb;
};

function ManagerMenu() {
	this.id = BUI.id();
	MainMenu.call(this, {isHidden : false, cssClass : 'mainMenu'});
}

ManagerMenu.prototype.populateCredentialsMenu = MainMenu.prototype.populateCredentialsMenu;
ManagerMenu.prototype.init = MainMenu.prototype.init;
ManagerMenu.prototype.getPanel = MainMenu.prototype.getPanel;
ManagerMenu.prototype._convertToHTMLWhiteSpan = MainMenu.prototype._convertToHTMLWhiteSpan;
ManagerMenu.prototype.getAddCredentialMenu = MainMenu.prototype.getAddCredentialMenu;
ManagerMenu.prototype.getLoginButton = MainMenu.prototype.getLoginButton;
ManagerMenu.prototype.setText = MainMenu.prototype.setText;
ManagerMenu.prototype.getHelpMenu = MainMenu.prototype.getHelpMenu;
ManagerMenu.prototype.getManagerMenu = MainMenu.prototype.getManagerMenu;
ManagerMenu.prototype.getHomeItem = MainMenu.prototype.getHomeItem;
ManagerMenu.prototype.getShipmentItem = MainMenu.prototype.getShipmentItem;


ManagerMenu.prototype.getMenuItems = function() {	
    		
	return [	
    	this.getHomeItem(),
    	this.getShipmentItem(),
    	{
				text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
                 disabled : true,
				menu : this.getPreparationMenu() 
		}, {
				text : this._convertToHTMLWhiteSpan("Data Explorer"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
				menu : this.getDataExplorerMenu() 
		},
//		{
//			text : '<span style="color:white">Offline Data Analysis</span>',
//			cls : 'ExiSAXSMenuToolBar',
//			hidden : this.isHidden,
//			menu : this.getOnlineDataAnalisysMenu() 
//		}, 
        {
			text : this._convertToHTMLWhiteSpan("Manager"),
			cls : 'ExiSAXSMenuToolBar',
			menu : this.getManagerMenu() 
		},
		{
			text : this._convertToHTMLWhiteSpan("Help"),
			cls : 'ExiSAXSMenuToolBar',
			menu : this.getHelpMenu() 
		}, 
		'->', 
		{
			xtype : 'textfield',
			name : 'field1',
			emptyText : 'search macromolecule',
			hidden : this.isHidden,
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == e.ENTER) {                        
						location.hash = "/datacollection/macromoleculeAcronym/" + field.getValue() + "/main";
					}
				} 
			} 
	}
	];
};




ManagerMenu.prototype.getPreparationMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Macromolecules") {
			location.hash = "/saxs/macromolecule/nav";
		}
		if (item.text == "Buffers") {
			location.hash = "/saxs/buffer/nav";
		}

		if (item.text == "Sample Tracking") {
			location.hash = "/saxs/shipping/nav";
		}

		if (item.text == "My Experiments") {
			location.hash = "/saxs/template/nav";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [ 
	          {
				text : 'Macromolecules',
				icon : '../images/icon/macromolecule.png',
				handler : onItemCheck 
			}, 
			{
				text : 'Buffers',
				icon : '../images/icon/buffer.jpg',
				handler : onItemCheck 
			}, 
//			"-", 
//			{
//				text : 'Stock Solutions',
//				icon : '../images/icon/testtube.png',
//				handler : onItemCheck 
//			}, 
//			{
//				text : 'Sample Tracking',
//				icon : '../images/icon/shipping.png',
//				menu:this.getSampleTrackingMenu()
//			}, 
			"-", 
			{
				text : 'My Experiments',
				icon : '../images/icon/edit.png',
				handler : onItemCheck 
			}

		] });
};


ManagerMenu.prototype.getDataReductionMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Sessions") {
			_this.onSessionClicked.notify();
		}
		if (item.text == "Subtraction") {
			location.hash = "/tool/subtraction/main";
		}
		if (item.text == "Experiments") {
			_this.onExperimentClicked.notify();
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [ {
			text : '<span class="menuCategoryItem">SEC</span>' }, "-", {
			text : 'Background Test' }, {
			text : 'Baseline Checker' }, {
			text : 'Frame Merge' }, "-", {
			text : '<span class="menuCategoryItem">INDIVIDUAL CONCENTRATION</span>' }, "-", {
			text : 'Subtraction',
			checked : false,
			group : 'theme',
			checkHandler : onItemCheck }, {
			text : 'Average' }, "-", {
			text : '<span class="menuCategoryItem">COMBINING</span>' }, "-", {
			text : 'Merging tool' } ] });
};



ManagerMenu.prototype.getDataExplorerMenu = function() {
	function onItemCheck(item, checked) {
		if (item.text == "Calendar") {
			location.hash = "/session/nav";
		}
		if (item.text == "Experiments") {
			location.hash = "/experiment/nav";
		}
	}
	return Ext.create('Ext.menu.Menu', {
		items : [ 
			{
				text : 'Calendar',
				icon : '../images/icon/sessions.png',
				handler : onItemCheck 
			}
		] 
	});
};

ManagerMenu.prototype.getOnlineDataAnalisysMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Structure Validation") {
			location.hash = "/tool/crysol/main";
		}
		if (item.text == "Job list") {
			location.hash = "/tool/list";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [
		{
			text : 'Structure Validation',
			checked : false,
			group : 'theme',
			handler : onItemCheck },
			"-",
			{
				text : 'Job list',
				checked : false,
				group : 'theme',
				handler : onItemCheck }
		] });
};


/*function SelectionMenu() {

	
	
}

SelectionMenu.prototype.openViewer = function() {
	var ids = exiSAXS.localExtorage.selectedSubtractionsManager.getDataCollectionIds();
	location.hash = "/datacollection/dataCollectionId/" + ids.toString() +"/primaryviewer";
};

SelectionMenu.prototype.openMerge = function() {
	var ids = exiSAXS.localExtorage.selectedSubtractionsManager.getDataCollectionIds();
	location.hash = "/datacollection/dataCollectionId/" + ids.toString() +"/merge";
};

SelectionMenu.prototype.clear = function() {
	exiSAXS.localExtorage.selectedSubtractionsManager.clear();
	
};


SelectionMenu.prototype.getPanel = function() {
	var _this = this;
	var tb = Ext.create('Ext.toolbar.Toolbar', {
	    height : 50,
	   
	    items: [
	        {
	            xtype: 'splitbutton',
	            text : 'Actions',
	            menu: new Ext.menu.Menu({
	                items: [
	                    	{text: 'Open Viewer', handler: function(){ _this.openViewer(); }},
	                    	{text: 'Open Merging Tool', handler: function(){  _this.openMerge(); }},
	                    	"-",
	                    	{text: 'Create new Project from Selection', handler: function(){ alert("Item 2 clicked"); }},
	                    	"-",
	                    	{text: 'Discard Selection', handler: function(){_this.clear(); }}
	                    
	                    
	                ]
	            })
	        }
	    ]
	});
	return tb;
};
*/

/**
 * Main class used for the west panel. Main purpose is the navigation
 */

function ListView(){
	this.width = 250;
	this.height = Ext.getBody().getHeight() - 215;

	/** Event is triggered when a element has been selected from the list **/
	this.onSelect = new Event();
}

ListView.prototype.getSorters = function(){
	return {};
};

ListView.prototype.getFilter = function(value){
	return null;
};

ListView.prototype.load = function(data){
	this.data = data;
	if (this.formatData != null){
		this.store.loadData(this.formatData(data));
	}
	else{
		this.store.loadData(data);
	}
};


ListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: this.title,  flex: 1, dataIndex: 'shippingId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

ListView.prototype.getFields = function(){
	return  [];
};

ListView.prototype.getPanel = function(){
	var _this =this;
	this.store = Ext.create('Ext.data.Store', {
	    fields:this.getFields(),
	    data : [],
	    sorters: this.sorters,
	    proxy: {
	        type: 'memory',
	        reader: {
	            type: 'json'
	        }
	    }
	});
	
	this.panel =  Ext.create('Ext.grid.Panel', {
	    store: this.store,
	    layout : 'fit',
	    columns: this.getColumns(),
	    width: this.width,
	    height : this.height,
	    multiSelect : true,
	    dockedItems: [{
	        xtype: 'toolbar',
	        dock: 'bottom',
	        cls : 'x-toolbar',
	        height : 42,
	        items: [
	            {
            xtype: 'textfield',
            name: 'searchField',
            hideLabel: true,
            width: 200,
            hidden : _this.getFilter() == null,
            emptyText : 'Search...',
            listeners : {
    			'change' : function(field, e) {
    						var value = field.getValue();
    						if (value != ""){
    							_this.store.filter(_this.getFilter(value));
    						}
    						else{
    							_this.store.clearFilter(true);
    							_this.load(_this.data);
    						}
    					} 
            		} 
	            }
	        ]
	    }],
	    viewConfig : {
	    	emptyText: 'No items to display',
	    	enableTextSelection : true,
	    	preserveScrollOnRefresh : true,
			stripeRows : true
		}
	});
	
    this.panel.on('selectionchange', function(view, elements){
    		var data = [];
    		for ( var index in elements) {
				data.push(elements[index].data);
			}
    		/** Trigger on select event **/
    		_this.onSelect.notify(data);
	    });
	return this.panel; 
};



/**
* AddressListView displays the address (labcontact information) as list on the navigation panels
*
* @class AddressListView
* @constructor
*/
function AddressListView(){
	this.title = "Addresses";
	this.sorters = [{property : 'cardName', direction: 'ASC'}];
	ListView.call(this);
}

AddressListView.prototype.getPanel = ListView.prototype.getPanel;
AddressListView.prototype.load = ListView.prototype.load;
AddressListView.prototype.getFields = ListView.prototype.getFields;
AddressListView.prototype.getColumns = ListView.prototype.getColumns;

AddressListView.prototype.getFilter = function(value){
	return [{property : "cardName", value : value, anyMatch : true}];
};

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
AddressListView.prototype.getRow = function(record){
	var html = "";
	dust.render("address.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};




function RunListView(){
	this.sorters = [];
	ListView.call(this);
}

RunListView.prototype.getPanel = ListView.prototype.getPanel;
RunListView.prototype.load = ListView.prototype.load;

RunListView.prototype.getFilter = function(value){
	return [{property : "name", value : value, anyMatch : true}];
};


RunListView.prototype.formatStatus = function(status){
	if (status == "FINISHED"){
		return "<span style='color:green;font-weight:bold;'>" + status + "</span>" ;
	}
	return "<span style='color:orange;font-weight:bold;'>" + status + "</span>"; 
};

RunListView.prototype.formatJobs = function(jobs){
	var html = "<table>";
	for (var i = 0; i < jobs.length; i++) {
		html = html + "<tr><td>" + jobs[i].name +"</td></tr>";
	}
	return html + "</table>"; 
};

RunListView.prototype.getRow = function(record){
	var html = "<table class='listView'>";
	
		html = html + "<tr><td>Name:</td><td>" + record.data.name+ "</td></tr>";
		html = html + "<tr><td>Status:</td><td>" + this.formatStatus(record.data.status) + "</td></tr>";
		html = html + "<tr><td>Jobs:</td><td>" + this.formatJobs(record.data.jobs) + "</td></tr>";
		html = html + "<tr><td>Date:</td><td>" + record.data.creationDate+ "</td></tr>";
	return html + "</table>";
};

RunListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Jobs',  flex: 1, dataIndex: 'sessionId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

RunListView.prototype.getFields = function(){
	return  ['name', 'status', 'creationDate', 'jobs'];
};



function SessionListView(){
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
}

SessionListView.prototype.getPanel = ListView.prototype.getPanel;
SessionListView.prototype.load = ListView.prototype.load;

SessionListView.prototype.getFilter = function(value){
	return [{property : "beamlineName", value : value, anyMatch : true}];
};

SessionListView.prototype.formatData = function(data){
	for (var i = 0; i < data.length; i++) {
		data[i]["day"] =  moment(data[i].BLSession_startDate).format("Do");
        data[i]["year"] =  moment(data[i].BLSession_startDate).format("YYYY");
        data[i]["month"] =  moment(data[i].BLSession_startDate).format("MMM");
	}
    
	return data;
};


SessionListView.prototype.getRow = function(record){

    var html = "";
    dust.render("session.listview", record.data, function(err, out){
		html = html + out;
    });
    return html;

};

SessionListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Session',  flex: 1, dataIndex: 'sessionId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

SessionListView.prototype.getFields = function(){
	return  ['date'];
};



function ShippingListView(){
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
}

ShippingListView.prototype.getPanel = ListView.prototype.getPanel;
ShippingListView.prototype.load = ListView.prototype.load;
ShippingListView.prototype.getFilter = ListView.prototype.getFilter;
ShippingListView.prototype.getFields = ListView.prototype.getFields;
ShippingListView.prototype.getColumns = ListView.prototype.getColumns;


/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
ShippingListView.prototype.getRow = function(record){
	var html = "";
    
	dust.render("shipping.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};


function WorkSpaceListView(){
	this.width = 250;
	this.height = 800;

	this.selectionMenu = new SelectionMenu();
	this.onSelect = new Event();
	
	this.projectId = null;
}


WorkSpaceListView.prototype.loadProjects = function(projects){
		if (projects != null){
			this.projectStore.loadData(projects);
		}
		this.loadRuns();
};

WorkSpaceListView.prototype.loadRuns = function(){
	var _this = this;
	var exidataAdapter = new ExiDataAdapter();
	exidataAdapter.onSuccess.attach(function(sender, runs){
		_this.runStore.loadData(runs.reverse());
		_this.runGrid.setLoading(false);
	});
	this.runGrid.setLoading();
	
	this.projectId = exiSAXS.localExtorage.userManager.getActiveProject().internalId;
	exidataAdapter.getRuns(exiSAXS.localExtorage.userManager.getActiveProject().internalId);
};



WorkSpaceListView.prototype.setSelectedItems = function(items){
	/** remove id **/
	for (var i = 0; i < items.length; i++) {
		delete items[i].id;
	}
	this.selection.loadData(items);
	this.projectGrid.collapse();
};




WorkSpaceListView.prototype.getSelectionPanel = function(){
	this.selection = Ext.create('Ext.data.Store', {
	    fields:['subtractionId', 'scattering', 'macromoleculeAcronym', 'concentration', 'framesMerge', 'framesCount', 'exposureTemperature']
	});
	function formatFrames(averaged, count){
		if ((averaged != null) && (count != null)){
			if (averaged / count < 0.3){
				return "<span style='color:red;'>" + averaged + "/" + count + "</span>";
			}
			if (averaged / count < 0.7){
				return "<span style='color:orange;'>" + averaged + "/" + count + "</span>";
			}
		}
		return averaged + "/" + count;
	}
	
	function processResult(answer){
							if (answer == "yes"){
								exiSAXS.localExtorage.selectedSubtractionsManager.remove(record.data);
							}
	}
	
	this.selectionGrid = Ext.create('Ext.grid.Panel', {
	    store: this.selection ,
	    title : "Selection",
	    emptyText : "No selection",
	    tbar : this.selectionMenu.getPanel(),
	    columns: [
	        { 	
	        	text: '',  
	        	dataIndex: 'scattering', 
	        	renderer : function(grid, data, record){
	    			return '<img src=' + new DataAdapter().getImage(record.data.subtractionId, "scattering") + '   height="70" width="70" >';
	        	} 
	        },
	        { 	text: '', 
	        	dataIndex: 'macromoleculeAcronym', 
	        	flex: 0.8, 
	        	renderer : function(grid, data, record){
	    			return record.data.macromoleculeAcronym + 
	    					"<br />" +
	    					 BUI.formatValuesUnits(record.data.concentration, "mg/ml", 7, 2) +
	    					"<br />" +
	    					record.data.exposureTemperature + "<span class='key_subgrid'> C</span>" +
	    					"<br />" +
	    					formatFrames(record.data.framesMerge, record.data.framesCount);
	        	} 	
	        },
	        { 
	        	text: '', 
	        	id : 'remove',
	        	dataIndex: 'scattering', 
	        	width : 50,
	        	renderer: function(value){
	                return "<br />" + '<img style="cursor: pointer; height:30px;width:30px;" src="images/icon/ic_highlight_remove_black_24dp.png" />';
	            }
	        },
	    ],
	    width: 200,
	    listeners: {
	    	cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (cellIndex == 2) {
				
						Ext.Msg.show({
						   title:'Discard subtraction?',
						   msg: 'Your are discarding a selected subtraction. You may re-add it afterwards. Would you like to discard it?',
						   buttons: Ext.Msg.YESNO,
						   icon: Ext.Msg.QUESTION,
						   fn: processResult,
						   height : 150
						});
					}
	    	}
	    }
	});
	return this.selectionGrid;
};

WorkSpaceListView.prototype.getProjectPanel = function(){
	this.projectStore= Ext.create('Ext.data.Store', {
	    fields:['name']
	});

	this.projectGrid = Ext.create('Ext.grid.Panel', {
	    store: this.projectStore,
	    title : "Projects",
	    emptyText : "No projects", 
	    columns: [
	        { text: 'Name',  dataIndex: 'name', flex: 1, 
	        	
	        	renderer : function(grid, opts, record){
	        		var html =  "<span class='projectName'>" + record.data.name + "</span><br/>" +
	        			    "<span class='projectDescription'>"  + record.data.description + "</span>";
	        		
	        		if (record.data.subtractions != null){
	        			html = html + "<br />" + record.data.subtractions.length + " datasets selected";
	        		}
	        		
	        		return html;
	        				
	        	} 
	        }
	    ],
	    height: 200
	});
	return this.projectGrid;
};

WorkSpaceListView.prototype.getRunPanel = function(){
	var _this = this;
	this.runStore= Ext.create('Ext.data.Store', {
	    fields:['name']
	});

	this.runGrid = Ext.create('Ext.grid.Panel', {
	    store: this.runStore,
	    title : "Run",
	    emptyText : "No Runs",
	    minHeight : 600,
	    dockedItems: [{
	        xtype: 'toolbar',
	        dock: 'bottom',
	        ui: 'footer',
	        items: [
	            { xtype: 'component', flex: 1 },
	            { 
	            	xtype: 'button', 
	            	text: 'Refresh', 
	            	handler : function(sender, a, b){
	            		_this.loadRuns();
	            	
	            	} 
	            }
	        ]
	    }],
	    columns: [
	        {
	        	text: 'Name',  
	        	dataIndex: 'name', 
	        	flex: 1, 
	        	renderer : function(grid, opts, record){
	        		var jobs = record.data.jobs;
	        		var html = '<table>';
	        		html = html + "<tr ><td  class='nameRun'>" + record.data.name + "</td></tr>";
	        		html = html + "<tr ><td  class='statusRun'>" + record.data.status + "</td></tr>";
	        		html = html + "<tr ><td  class='dateRun'>" + record.data.creationDate + "</td></tr>";
	        		if (jobs != null){
	        			for (var i = 0; i < jobs.length; i++) {
							html = html + "<tr ><td class='jobRow'>" + jobs[i].name +"</td><td>" + jobs[i].status + "</td></tr>";
						}
	        		}
	        		return html + "</table>";
	        				
	        	} 
	        }
	    ],
	    height: 200
	});
	
	  this.runGrid.on('select', function( grid, record, index, eOpts ){
		  	location.hash = "/project/" + _this.projectId + "/run/" +record.data.internalId + "/main";
	    });
	  
	return this.runGrid;
};


WorkSpaceListView.prototype.getPanel = function(){
	var _this =this;
	this.panel =  Ext.create('Ext.panel.Panel', {
	    layout : 'fit',
	    autoScroll : true,
	    defaults: {
	        bodyStyle: 'padding:15px'
	    },
	    /*layout: {
	        type: 'accordion',
	        titleCollapse: false,
	        animate: true,
	        activeOnTop: true
	    },*/
	    items: [
	            _this.getSelectionPanel(),
	            _this.getProjectPanel(),
	            _this.getRunPanel()
        ]
	});
	return this.panel; 
};

function Credential(username, roles, token, url, exiUrl,activeProposals, tokenExpires, properties) {
	this.username = username.toLowerCase();
	this.roles = roles;
	this.url = url;
	this.exiUrl = exiUrl;
	this.token = token;
	this.activeProposals = activeProposals;
    this.tokenExpires = tokenExpires;
	this.properties = properties;
   
}

Credential.prototype.isManager = function() {
	return this._checkRole("manager");
};

Credential.prototype.isLocalContact = function() {
	return this._checkRole("localcontact");
};

Credential.prototype._checkRole = function(role) {
	return JSON.stringify(this.roles).toLowerCase().indexOf(role) != -1;
};

/**
 * Checks if it has not expired yet
 */
Credential.prototype.isValid = function() {
    return  this.timeToExpire() > 0;
};

/**
 * Checks if it has not expired yet
 */
Credential.prototype.timeToExpire = function() {
    return  moment.duration(moment(this.tokenExpires).diff(moment())).asHours();
};

function CredentialManager(){
	this.onLogin = new Event(this);
	this.onLogout = new Event(this);
	this.onActiveProposalChanged = new Event(this);
}

CredentialManager.prototype.addCredential = function(username, roles, token, url, exiUrl, properties){
    
    var tokenExpires =  moment().add(3, 'hour');
	var credential = new Credential(username, roles, token, url, exiUrl, [], tokenExpires, properties);
	/** Writing to ExtLocalStorage * */
	if (localStorage.getItem("credentials") == null) {
		localStorage.setItem("credentials", "[]");
	}
	var credentials = this.getCredentials();
	credentials.push(credential);
	localStorage.setItem("credentials", JSON.stringify(credentials));
	this.onLogin.notify(credential);
};

CredentialManager.prototype.credentialToObject = function(json){
    return new Credential(json.username,json.roles,	json.token,json.url,json.exiUrl,json.activeProposals,json.tokenExpires,json.properties);
};

CredentialManager.prototype.getCredentials = function(){
	var credentials = [];
	if (JSON.parse(localStorage.getItem("credentials")) != null){
		credentials = JSON.parse(localStorage.getItem("credentials"));
	}
    for (var i=0; i < credentials.length; i++){
        credentials[i] = this.credentialToObject(credentials[i]);
    }
	return credentials;
};

/** Given a beamline name it return MX or SAXS **/
CredentialManager.prototype.getTechniqueByBeamline = function(beamlineName){
	var connections = this.getConnections();
	for (var i = 0; i < connections.length; i++) {
		if (JSON.stringify(connections[i].beamlines.MX).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1){
			return "MX";
		}
		if (JSON.stringify(connections[i].beamlines.SAXS).toUpperCase().indexOf(beamlineName.toUpperCase()) != -1){
			return "SAXS";
		}
	}
	return "UNKNOW";

};

/**
*  Returns an string with the name of all the beamlines
*
* @method getBeamlineNames
* @return 
*/
CredentialManager.prototype.getBeamlineNames = function(){   
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {
      beamlines =_.concat(_.keys(_.keyBy(connections[i].beamlines.SAXS, "name")), _.keys(_.keyBy(connections[i].beamlines.MX, "name")))      
	}
	return beamlines;
};

/**
*  Returns an array with all the configuration for every beamline
*
* @method getBeamlines
* @return 
*/
CredentialManager.prototype.getBeamlines = function(){   
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {
      beamlines =_.concat(connections[i].beamlines.SAXS, connections[i].beamlines.MX);     
	}
	return beamlines;
};


/**
*  Returns an array with the name of all the beamlines of the selected technique
*
* @method getBeamlinesByTechnique
* @param technique [MX, SAXS]
* @return 
*/
CredentialManager.prototype.getBeamlinesByTechnique = function(technique){
	var connections = this.getConnections();
    var beamlines = [];
	for (var i = 0; i < connections.length; i++) {        
        beamlines =_.concat(connections[i].beamlines[technique]);     
	}
	return beamlines;
};

CredentialManager.prototype.getConnections = function(){
	var credentials = this.getCredentials();
	var connectors = [];
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].activeProposals.length > 0){
			for (var j = 0; j < credentials[i].activeProposals.length; j++) {
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					exiUrl : credentials[i].exiUrl,
					token : credentials[i].token,
					beamlines : credentials[i].properties.beamlines,
					proposal : credentials[i].activeProposals[j] });
			}
		}
		else{
				connectors.push({
					username : credentials[i].username,
					url : credentials[i].url,
					exiUrl : credentials[i].exiUrl,
					token : credentials[i].token,
					beamlines : credentials[i].properties.beamlines,
					proposal : null
				});
		}
	}
	return connectors;
};

CredentialManager.prototype.getCredentialByUserName = function(username){
    var found =  _.filter(this.getCredentials(), {username : username});
    if (found.length > 0){
        return found[0];
    }
	
};

CredentialManager.prototype.logout = function(username, roles, token, url){
	localStorage.removeItem('credentials');
	this.onLogout.notify();
};

CredentialManager.prototype.setActiveProposal = function(username, proposal){
	var credentials = this.getCredentials();
	for (var i = 0; i < credentials.length; i++) {
		if (credentials[i].username.toLowerCase() == username.toLowerCase()) {
			credentials[i].activeProposals = [proposal];
			localStorage.setItem("credentials", JSON.stringify(credentials));
			localStorage.removeItem("sessions");
			this.onActiveProposalChanged.notify();
		}
	}
};



function MainView(args) {
	this.id = BUI.id();
	this.title = "New Tab";
	this.closable = true; 
	this.onSelectionChange = new Event(this);
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
	
	//this.bodyStyle = {"background-color":"#FAFAFA"};
    
    if (args != null){
        if (args.title != null){
            this.title = args.title;
        }
    }

}

MainView.prototype.onBoxReady = function() {
};

MainView.prototype.getContainer = function() {
	return this.container;
};

MainView.prototype.getPanel = function() {
	this.container = Ext.create('Ext.container.Container', {
		xtype : 'container',
		items : []
	});

	this.panel = Ext.create('Ext.panel.Panel', {
		autoScroll : true,
		title : this.title,
		closable: this.closable,
		icon : this.icon,
		bodyStyle: this.bodyStyle, 
		items :[this.getContainer() ]
	});
    var _this = this;
    this.panel.on('boxready', function() {
        if (_this.onBoxReady){
            _this.onBoxReady();
        }
    });
    
	return this.panel;
};
function AddressMainView() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];

	MainView.call(this);

	this.addressForm = new AddressForm({width : Ext.getBody().getWidth()*0.9});
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

AddressMainView.prototype.getPanel = MainView.prototype.getPanel;

AddressMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'fit'
	    },
	    margin : 15,
	    border: 1,
	    defaults: {
	        labelWidth: 80,
	        flex: 1,
	    },
	    items: [this.addressForm.getPanel([])]
	});
};


AddressMainView.prototype.load = function(labContactId) {
	
	this.panel.setTitle("Address");
	var _this = this;
	var onSuccess = function(sender, data){
		_this.addressForm.load(data);
	};
	
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.labcontacts.getLabContactById(labContactId);
	
	
};


/**
* Class for the manager landing page. It inherits from MainView
*
* @class ManagerWelcomeMainView
* @constructor
*/
function ManagerWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Home";
	this.closable = false;

    this.sessionGrid = new SessionGrid({
                    width : null,
                    height:600,
                    isHiddenTitle : true,
                    isHiddenPI : false,
                    isHiddenNumberOfShifts : false,
                    isHiddenLocalContact : false,                                        
                    margin : '10 10 10 10'
    });
    
    this.proposalGrid = new ProposalGrid({
                                            width: 900,
                                            height:600,
                                            margin : '10 10 10 10'

                                    });
}

ManagerWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;

/**
* This sets an active proposal into the credential Manager. It also retrieve all the information about the proposal: shipments, macromolecules, crystals, buffers, etc.. and store 
* them in a local storage
*
* @method activeProposal
* @param {Object} proposal Proposal object that should container at least: [code, number]
*/
ManagerWelcomeMainView.prototype.activeProposal = function(proposal) {
    
    //EXI.mainStatusBar.showBusy("Loading proposal " +proposal); 
    
	EXI.credentialManager.setActiveProposal(this.username, proposal);
    EXI.proposalManager.clear();
	/** I don't need this to be synchronous **/	
    /*EXI.proposalManager.onActiveProposalChanged = new Event();
    EXI.proposalManager.onActiveProposalChanged.attach(function(){
        EXI.mainStatusBar.showReady();
        
    });
    
	EXI.proposalManager.get();*/
};


ManagerWelcomeMainView.prototype.getContainer = function() {
	this.container = Ext.create('Ext.panel.Panel', {
		autoScroll : true,
        margin : 20,
        cls : 'border-grid',
        tbar : this.getToolbar(),
            items :[
                this.sessionGrid.getPanel()
        ]
	});
	return this.container;
};

/**
* It receives a list of proposals and display them in the main container
*
* @param {Object} proposals Arrays of Proposal objects
* @method displayProposals
*/
ManagerWelcomeMainView.prototype.displayProposals = function(proposals) {
    var _this = this;
    this.container.removeAll();
   
    this.proposalGrid.onSelected.attach(function(sender, proposal){
            _this.panel.setLoading(true);
            var proposalCode = proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber;
            function onSuccess(sender, sessions){
                _this.displaySessions(sessions, sessions.length + " sessions for proposal " + proposalCode);
                _this.panel.setLoading(false);
            }
            EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposal(proposalCode);
                            
            /** Loading Proposal info */                 
            _this.activeProposal( proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber);
        
    });
    
    this.container.insert(this.proposalGrid.getPanel());
    this.proposalGrid.load(proposals);
};


/**
* It receives a local contact name and will load in the sessionGrid
*
* @param {String} beamlineOperator name or surname of the beamline operator
* @method displaySessionsByBeamlineOperator
*/
ManagerWelcomeMainView.prototype.displaySessionsByBeamlineOperator = function(beamlineOperator) {
    var _this = this;
    _this.panel.setLoading(true);
    var onSuccess = function(sender, sessions){
       _this.displaySessions(sessions,sessions.length + " sessions are scheduled for local contact: " + beamlineOperator);
       _this.panel.setLoading(false);
    }
    
    var onError = function(sender, sessions){  
        _this.sessionGrid.panel.setTitle("No sessions are scheduled for local contact: " + beamlineOperator);             
       _this.panel.setLoading(false);
    }
    EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.session.getSessionsByBeamlineOperator(beamlineOperator);
};

/**
* Retrieves a list of sessions based on a start date and end date and loads them on the session grid
*
* @param {String} start Date should be in the format of YYYYMMDD
* @param {String} end Date should be in the format of YYYYMMDD
* @method loadByDate
*/
ManagerWelcomeMainView.prototype.loadByDate = function(username, start, end) {
          var _this = this;
          this.panel.setLoading(true);
          function onSuccess(sender, data){              
        	  _this.displaySessions(data, data.length + " sessions scheduled on " + moment(start, 'YYYYMMDD').format('MMMM Do YYYY'));
        	  _this.panel.setLoading(false);
          }
          /** Increasing one day */
          end = moment(end, "YYYYMMDD").add(1, 'days').format("YYYYMMDD");                    
          if (this.isUser(username)){
		        EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposalAndDate(start, end, username);
          }
          else{
                EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByDate(start, end);
          }
};

/**
* Removes oldest sessions up to get only 500
*
* @param {String} sessions List of sessions
* @method filterSessions
*/
ManagerWelcomeMainView.prototype.filterSessions = function(sessions) {    
        var realLength = sessions.length;
        data = _.slice(sessions, 0, 500);
        // Sorting by start date because sessionId does not sort by date
        _(sessions).forEach(function(value) {
                value['ms'] = moment(value.BLSession_startDate, 'MMM DD, YYYY h:mm:ss a').format('x');
        });
        sessions = _.orderBy(sessions, ['ms'], ['desc']);
        return sessions.slice(0, 300);
        
};
        
ManagerWelcomeMainView.prototype.displaySessions = function(sessions, title) {
    var _this = this;
    
    /** it loads the session panel */
    this.container.removeAll();   
    this.container.insert(this.sessionGrid.getPanel());

    /** Handling onSelected **/
    this.sessionGrid.onSelected.attach(function(sender, args){
        EXI.proposalManager.clear();
        _this.activeProposal(args.proposalCode + args.proposalNumber);
    });
    
    this.sessionGrid.load(this.filterSessions(sessions));
    this.sessionGrid.panel.setTitle(title);
};

ManagerWelcomeMainView.prototype.getToolbar = function() {
   var _this = this;
   var dateMenu = Ext.create('Ext.menu.DatePicker', {
        handler: function(dp, date){            
            location.href = "#/welcome/manager/" + _this.username +"/date/"+ Ext.Date.format(date, 'Ymd') +"/" + Ext.Date.format(date, 'Ymd') +"/main";          
        }
    });

    return Ext.create('Ext.toolbar.Toolbar', {
        width   : 500,
        cls 	: 'exi-top-bar',
        items: [
            {
               text: 'Choose a Date',
               icon : '../images/icon/sessions.png',
               menu: dateMenu 
            },
            {
                xtype    : 'textfield',
                name     : 'field1',
                width    : 300,
                emptyText: 'enter search term (proposal or title)',
    			listeners : {
    				specialkey : function(field, e) {
    					if (e.getKey() == e.ENTER) {
    						var found = _this.searchProposalByTerm(field.getValue());
    						_this.displayProposals(found);
    					}
    				} 
    			} 
            },
            '->',
            {             
               icon     : '../images/icon/person.png',
               border : 0
            },
             {
                xtype    : 'textfield',
                name     : 'field1',
                width    : 300,               
                emptyText: 'search by local contact',
    			listeners : {
    				specialkey : function(field, e) {
    					if (e.getKey() == e.ENTER) {    						
    						_this.displaySessionsByBeamlineOperator(field.getValue());
    					}
    				} 
    			} 
            },
        ]
    });
};

ManagerWelcomeMainView.prototype.searchProposalByTerm = function(term) {
	var result = [];
	if (this.proposals != null){
		for (var i = 0; i < this.proposals.length; i++) {
			var proposalId = this.proposals[i]["Proposal_proposalCode"] +  this.proposals[i]["Proposal_proposalNumber"];
			var title = this.proposals[i]["Proposal_title"];
			if (title == null){
				title = "";
			}
			if ((proposalId.toUpperCase().match(term.toUpperCase())) ||(title.toUpperCase().match(term.toUpperCase()))){
				result.push(this.proposals[i]);
			}
		}
	}
	return result;
};

/**
* Retrieves all proposas on ISPyB and stores them on this.proposal 
* It is useful for fast search later on
*
* @method loadProposals
*/
ManagerWelcomeMainView.prototype.loadProposals = function(callback) {
	var _this = this;
	var onSuccess = function(sender, proposals){
		_this.proposals = proposals;
        if (callback){            
            callback();
        }
	};	
	EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

ManagerWelcomeMainView.prototype.isUser = function(username) {
       return (!EXI.credentialManager.getCredentialByUserName(username).isManager() && (!EXI.credentialManager.getCredentialByUserName(username).isLocalContact()));
};

ManagerWelcomeMainView.prototype.load = function(username) {      
  this.username = username;  
  /** By default for users we load all the sessions and managers only sessions that occurs today */
  if (this.isUser(username)){
    this.loadSessionsByProposal(username);  
    /** set active proposal */
    this.activeProposal(username);
  }
  else{
    var today = moment().format("YYYYMMDD");
    this.loadSessionsByDate(username, today, today);
  }    
  EXI.setLoadingMainPanel(false);
};

/**
* Retrieves all sessions for the proposal
*
* @method loadSessions
*/
ManagerWelcomeMainView.prototype.loadSessionsByProposal = function(username) {
    this.username = username;
    var _this = this;
    this.panel.setLoading(true);
    function onSuccess(sender, data){
       _this.displaySessions(data, "Sessions for proposal " + username);
       _this.panel.setLoading(false);
    }
    EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposal(username);
};


ManagerWelcomeMainView.prototype.loadSessionsByDate = function(username, start, end) { 
  this.username = username;
  this.loadByDate(username, start, end);  
   /** This is need for quick searchs on proposals **/
  this.loadProposals(); 
};

ManagerWelcomeMainView.prototype.loadSessionsByTerm = function(username, term) {
  this.username = username;    
  /** This is need for quick searchs on proposals **/
  var _this = this;
  var onSuccess = function(sender, proposals){
		_this.proposals = proposals;
       _this.searchProposalByTerm(term);
  };
  EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

function RunMainView() {
	this.id = BUI.id();
	MainView.call(this);
}

RunMainView.prototype.getPanel = MainView.prototype.getPanel;

RunMainView.prototype.getOutputPanel = function() {
	this.outputStore = Ext.create('Ext.data.Store', {
	    fields:['name', 'value', 'type', 'targetId', 'tool', 'i' ],
	    groupField: 'tool',
	    sorters : [{property: 'i', direction : 'DESC'}]
	});

	return Ext.create('Ext.grid.Panel', {
	    store: this.outputStore,
	    cls : 'border-grid',
	    features: [{ftype:'grouping'}],
	    columns: [
	        { text: 'Tool',  dataIndex: 'tool', flex : 1, hidden:true },
	        { text: 'id',  dataIndex: 'i', flex : 1, hidden:true },
	        { text: 'Name',  dataIndex: 'name', flex : 1 },
	        { text: 'value', dataIndex: 'value', flex : 1 },
	        { text: 'type', dataIndex: 'type', flex : 1 },
	        { text: 'target', dataIndex: 'targetId', flex : 1, hidden:true },
	        { text: '', dataIndex: 'targetId', flex : 1, renderer : function(grid, opt, record){
        		var url =EXI.credentialManager.getConnections()[0].exiUrl + "/file/" + record.data.targetId + "/download";
        		return "<div><a style='color:blue;' href='"+ url +"'>Download</a></div>";
	        } 
        }
	    ]
	});
};


RunMainView.prototype.getGeneralContainerList = function(run) {
	var li = "<ul class='generalContainerRunList'>";
	li = li + "<li>Name: " + run.name + "</li>";
	li = li + "<li>Status: " + run.status + "</li>";
	li = li + "<li>" + run.creationDate + "</li>";
	return li;
};

RunMainView.prototype.getGeneralContainer = function(run) {
	return {
		xtype : 'panel',
		title : "General",
		margin : 10,
		border : 1,
		style: {borderColor:'gray', borderStyle:'solid', borderWidth:'1px'},
		items : [
		         {
		        	 html 		: this.getGeneralContainerList(run),
		        	 margin 	: '10 0 0 50'
		         }
		]
	};
};

RunMainView.prototype.getMainPanel = function() {
	
};

RunMainView.prototype.getTabs = function() {
	return  Ext.createWidget('tabpanel',
			{
				plain : true,
				margin : '20 0 0 0',
				items : [
				     	this.getMainPanel(),
					{
						tabConfig : {
							title : 'Output Files'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							height : 700,
							padding : 20,
							cls : 'border-grid',
							items : [ 
							         this.getOutputPanel()
							]
						}

						]
					}
//				     	,
//					{
//						tabConfig : {
//							title : "Input",
//						},
//						items : [  
//									{
//										xtype : 'container',
//										layout : 'vbox',
//										height : 700,
//										padding : 20,
//										cls : 'border-grid',
//										items : [ 
//										     	]
//									}
//					]
//			}
			]});
};

RunMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'anchor'
	    },
	    defaults : {
			anchor : '100%',
			hideEmptyLabel : false },
	    margin : 5,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
	    items: [
	            
	            	this.getTabs()
	            ]
	});
};

RunMainView.prototype.loadMain = function(run) {
	
};

RunMainView.prototype.load = function(run) {
	if (run != null) {
		this.panel.setTitle(run.name);
		var parsed = [];
		for (var i = 0; i < run.jobs.length; i++) {
			for (var j = 0; j < run.jobs[i].output.length; j++) {
				run.jobs[i].output[j]["tool"] = run.jobs[i].name + " " + run.jobs[i].version;
				run.jobs[i].output[j]["i"] = i;
				parsed.push(run.jobs[i].output[j]);
			}
		}
		this.outputStore.loadData(parsed);
	}
	this.loadMain(run);
};

function DimpleRunMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	this.id = BUI.id();
	RunMainView.call(this);
}

DimpleRunMainView.prototype.getPanel = RunMainView.prototype.getPanel;
DimpleRunMainView.prototype.getOutputPanel = RunMainView.prototype.getOutputPanel;
DimpleRunMainView.prototype.getTabs = RunMainView.prototype.getTabs;
DimpleRunMainView.prototype.getContainer = RunMainView.prototype.getContainer;
DimpleRunMainView.prototype.load = RunMainView.prototype.load;

DimpleRunMainView.prototype.getFilesGrid = function() {
	var _this = this;
	
	this.filesStore = Ext.create('Ext.data.Store', {
	    fields:['name', 'targetId']
	});
	
	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
		listeners : {
			selectionchange : function(sm, selections) {
				console.log(selections[0].data);
				var onSuccess = function(sender, content){
					document.getElementById(_this.id + "display").innerHTML = "<textarea rows='100' cols='100'> " + content + "</textarea>" ;
				};
				if (selections[0].data.name.indexOf(".mtz") == -1){
					EXI.getDataAdapter({onSuccess:onSuccess}).exi.offline.getFileContent(selections[0].data.targetId);
				}
				else{
					onSuccess(this, "No text available");
				}
			}

		} });
	
	return  Ext.create('Ext.grid.Panel', {
	    title: 'Files',
	    store:this.filesStore,
	    selModel : selModel,
	    cls : 'border-grid',
	    height : 400,
	    columns: [
	        { text: 'Name',     dataIndex: 'name', flex : 1}
	    ]
	});
};






DimpleRunMainView.prototype.getMainPanel = function() {
	var store = Ext.create('Ext.data.Store', {
	    fields:['key', 'value']
	});
	
	this.generalGrid = Ext.create('Ext.grid.Panel', {
	    title: 'General',
	    store:store,
	    layout : 'fit',
	    columns: [
	        { text: 'Name',     dataIndex: 'name' },
	        { text: 'Seniority', dataIndex: 'seniority' }
	    ],
	    flex : 1
	});
	
	
	return {
		tabConfig : {
			title : 'Dimple'
		},
		items : [ {
							xtype : 'container',
//							layout : 'fit',
							height : 700,
							cls : 'border-grid',
							items : [ 
							         {
											xtype : 'container',
											layout : 'hbox',
											items : [
											         {
															xtype : 'container',
															layout : 'fit',
															flex : 0.4,
															margin: 5,
															items : [
																	this.getFilesGrid(),
																	{
																		html : "<br />"
																	},
																	 {
															        	 html : '<div id="' + this.id +'blobs";><div>'
															        	 
															         }
															]
											         },
											         {
															xtype : 'container',
															layout : 'fit',
															flex : 0.6,
															margin: 5,
															height : 400,
															cls : 'border-grid',
															items : [
															         {
															        	 html : '<div id="' + this.id +'display";><div>'
															        	 
															         }
													         ]
											         }
									         ]
							         },
							         {
											xtype : 'container',
											margin: 5,
											height : 210,
											layout : 'fit',
											flex : 1,
//											cls : 'border-grid',
											items : [
											         {
											        	 html : '<div style="height:200px"  id="' + this.id +'snapshots";><div>'
											        	 
											         }
									         ]
							         }
							 ]
			         
			}
		]
	};
};

DimpleRunMainView.prototype.loadBlobs = function(job) {
	var blobs = [];
	var i = 0;
	for (i = 0; i < job.output.length; i++) {
		if (job.output[i].type == "blob"){
			blobs.push(job.output[i]);
		}
	}
	
	/** Rendering blobs **/
//	var table = document.createElement("table");
	var container = document.createElement("div");
	var table = document.createElement("table");
	var tr = document.createElement("tr");
	for (i = 0; i < blobs.length; i++) {
		var td = document.createElement("td");
		var img = document.createElement("img");
		img.setAttribute("src", EXI.getDataAdapter().exi.offline.getFileImage(blobs[i].targetId));
		img.setAttribute("height", "180px");
		img.setAttribute("width", "180px");
		img.setAttribute("hspace", "10");
		
		img.setAttribute("onclick", "window.open(this.src)");
		td.appendChild(img);
		tr.appendChild(td);
		
		
	}
	table.appendChild(tr);
	document.getElementById(this.id + "snapshots").innerHTML =  table.innerHTML;
//	document.getElementById(this.id + "blobs").innerHTML = table.innerHTML;
};

DimpleRunMainView.prototype.loadFiles = function(job) {
	var files = [];
	for (var i = 0; i < job.output.length; i++) {
		if (job.output[i].type != "blob"){
			files.push(job.output[i]);
		}
	}
	this.filesStore.loadData(files);
};



DimpleRunMainView.prototype.loadMain = function(run) {
	console.log(run);
	if (run != null){
		if (run.jobs != null){
			if (run.jobs.length > 0){
				for (var i = 0; i < run.jobs.length; i++) {
					this.loadBlobs(run.jobs[i]);
					this.loadFiles(run.jobs[i]);
				}
			}
		}
	}
};
function ScatteringForm(args) {
    this.id = BUI.id();

    this.width = 600;
    this.height = 200;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}
}

ScatteringForm.prototype.getPanel = function() {
    var _this = this;

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					width : this.width
				}]
	});

    this.panel.on('boxready', function() {
        _this.load();
    });

	return this.panel;
};

ScatteringForm.prototype.load = function(data) {
    if (!data) {
        var data = {};
    }
    data.id = this.id;

	if (data.keys) {
		data.chunkedKeys = _.chunk(data.keys,Math.ceil(data.keys.length/3.0));
	}

    var html = "";
    dust.render("scattering.form.template", data, function (err, out) {
        html = out;
    });

	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
}
function SessionMainView(args) {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this, args);
	var _this = this;
	
	this.sessionGrid = new SessionGrid({
         width : 700,
         height: 598,
         margin : '0 0 0 20',
        title : "Click on calendar to see the sessions"
    });
}

SessionMainView.prototype.getPanel = MainView.prototype.getPanel;

SessionMainView.prototype.getContainer = function() {
    _this = this;
    
    
    this.subpanel =  Ext.create('Ext.container.Container', {
         layout:  'fit',  
         border : 0,  
        items : [
         
        ]
    });
	this.panel = Ext.create('Ext.container.Container', {
        layout:  'hbox',    
        margin : 10,        
        items: [            
                    {
                        html: '<div style="height:600px" id="' + this.id +'"></div>',
                        height :600,
                        border :0 ,
                        width : 600,                                         
                    } ,
                    this.subpanel                               
                    
            ],
        listeners: {
            afterrender: function() {
                _this.showCalendar([]);
            }
        }
    }
    );
	return this.panel;	
};

SessionMainView.prototype.showCalendar = function(data) {
     var _this = this;
     $('#' + _this.id).empty();
     function editEvent(event) {
                         _this.loadByDate(moment(new Date(event.startDate)).format("YYYYMMDD"));
      }
        $('#' + this.id).calendar({
            enableContextMenu: true,
            enableRangeSelection: true,
            selectRange: function(e) {
                editEvent({ startDate: e.startDate, endDate: e.endDate });
            },
            mouseOnDay: function(e) {
                if(e.events.length > 0) {
                    var content = '';
                    
                    for(var i in e.events) {
                        content += "<div class='event-tooltip-content'><div class='event-name' style='color:" + e.events[i].color + "'>" + e.events[i].name + "</div><div class='event-location'>" + e.events[i].location + "</div></div>";
                    }
                
                    $(e.element).popover({ 
                        trigger: 'manual',
                        container: 'body',
                        html:true,
                        content: content
                    });
                    
                    $(e.element).popover('show');
                }
            },
            mouseOutDay: function(e) {
                if(e.events.length > 0) {
                    $(e.element).popover('hide');
                }
            },
            dayContextMenu: function(e) {
                $(e.element).popover('hide');
            },
            dataSource: data
            
        });
};

SessionMainView.prototype.getBadge = function(title, count) {
    if (count){
        if (count != 0){
            return '<span>' + title + '  <span class="badge">' + count +'</span></span><br />';
        }
    }
    return "";
};
SessionMainView.prototype.getLocation = function(session) {
    var html = this.getBadge("Collect", session.dataCollectionGroupCount);
    html = html + this.getBadge("Images", session.imagesCount);
    html = html + this.getBadge("XRF", session.xrfSpectrumCount);
    html = html + this.getBadge("Energy", session.energyScanCount);
    return html + this.getBadge("Sample", session.sampleCount);
}; 

SessionMainView.prototype.load = function(sessions) {
	var sessionForCalendar = [];
    for(var i = 0; i < sessions.length; i++){
        sessionForCalendar.push({
           id : sessions[i].sessionId,
           name : sessions[i].Proposal_proposalCode + sessions[i].Proposal_ProposalNumber + "( " + sessions[i].beamLineName + " )",
           location : this.getLocation(sessions[i]),
           startDate : new Date(sessions[i].BLSession_startDate), 
           endDate : new Date(sessions[i].BLSession_endDate)
        });
        
    }
    
    this.showCalendar(sessionForCalendar);
    this.subpanel.insert( this.sessionGrid.getPanel());
    //this.sessionGrid.load(sessions);
    
    var _this = this;
    /** Rendering proposal Header */
    if ($("#" + this.id + "_header")){
        if (EXI.proposalManager.getProposals().length > 0){
            var proposal = EXI.proposalManager.getProposals()[0];
            proposal.sessionCount = sessions.length; 
            dust.render('welcomemainviewproposalheader', proposal, function(err, out) {
                
                $("#" + _this.id + "_header").html(out);
                _this.panel.insert(0,
                    {
                        html  :   out,
                        border : 0,
                        margin : '10 0 0 10',
                        width : 600
                        
                    });
            });
        }        
    }    
};

SessionMainView.prototype.loadByDate = function(start) {
          var _this = this;
          this.panel.setLoading(true);
          function onSuccess(sender, sessions){              
        	  //_this.displaySessions(data, data.length + " sessions scheduled on " + moment(start, 'YYYYMMDD').format('MMMM Do YYYY'));
             _this.sessionGrid.load(sessions);
        	  _this.panel.setLoading(false);
          }
          /** Increasing one day */
         var username = EXI.credentialManager.getCredentials()[0].activeProposals[0];
         var end = moment(start, "YYYYMMDD").format("YYYYMMDD");                    
         EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposalAndDate(start, end, username);          
};















function SpreadSheet(args){
	this.id = BUI.id();
	this.height = 380;
	this.width = 500;
	this.containerType = "OTHER";
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.containerType != null) {
			this.containerType = args.containerType;
		}
	}

}

SpreadSheet.prototype.getPanel = function(){
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		height 		: this.height+ 50,
		items : [ 
				  {
						html 		: '<div  style="overflow: auto;overflow-y: hidden; border:1px solid gray;background-color:white;height:500px;width:' + (_this.width - 20) +'px"; id="' + this.id + '_samples"; ></div>',
						margin 		: '20 0 20 10',
						height 		: this.height,
						width 		: this.width,
						autoScroll 	: true,
						resizable 	: true
					}]
	});
    return this.panel;
};

SpreadSheet.prototype.setLoading = function (bool) {
	this.panel.setLoading(bool);
}

SpreadSheet.prototype.getAcronyms = function() {
	var proteins = EXI.proposalManager.getProteins();
	var acronyms = [];
	for (var i = 0; i < proteins.length; i++) {
		acronyms.push(proteins[i].acronym);
	}
	return acronyms;
};

SpreadSheet.prototype.setContainerType = function(containerType) {
	this.containerType = containerType;
};

SpreadSheet.prototype.getHeaderWidth = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].column.with);
	}
	return text;
};

SpreadSheet.prototype.getHeaderId = function(containerType) {
	var header = this.getHeader(containerType);
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].id);
	}
	return text;
};

SpreadSheet.prototype.getHeaderText = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].text);
	}
	return text;
};


SpreadSheet.prototype.getColumns = function() {
	var columns = [];
	for (var i = 0; i < this.getHeader().length; i++) {
		columns.push(this.getHeader()[i].column);
	}
	return columns;
};

/**
* Returns an array of objects for each row in the grid where at least the protein acronym column is filled
*
* @method parseTableData
*/
SpreadSheet.prototype.parseTableData = function() {
	var parsed = [];
	var data = this.spreadSheet.getData();
	// var columnIds = this.getHeaderId();
	if (data != null && data.length > 0){
		var columnIds = this.getHeaderId();
		for (var j = 0; j < data.length; j++) {
			if (data[j].length > 1){
				var row = {};
				row["location"] = j + 1;
				for (var k = 0 ; k < columnIds.length ; k++) {
					var key = columnIds[k];
					var value = data[j][this.getColumnIndex(key)];
					row[key] = value;
				}
				if (row["Protein Acronym"]){
					if (row["Protein Acronym"].length > 0){
						parsed.push(row);
					}
				}
			}
		}
	}
	/** Curated contains the whole-data rows * */
	var curated = [];
	for (var i = 0; i < parsed.length; i++) {
		if (parsed[i]["Protein Acronym"] != null){
			curated.push(parsed[i]);
		}
	}
	return curated;
};

SpreadSheet.prototype.load = function(data){
	var _this = this;
	this.data = data;
	var container = document.getElementById(this.id + '_samples');

	this.spreadSheet = new Handsontable(container, {
			data: data,
			height : this.height,
			width : this.width,
			manualColumnResize: true,
			colWidths: this.getHeaderWidth(),
			colHeaders: this.getHeaderText(),
			stretchH: 'last',
			columns: this.getColumns(),
	});
};

SpreadSheet.prototype.getData = function () {
	return this.spreadSheet.getData();
}

SpreadSheet.prototype.loadData = function (data) {
	return this.spreadSheet.loadData(data);
}

SpreadSheet.prototype.setDataAtCell = function (rowIndex, columnIndex, value) {
	this.spreadSheet.setDataAtCell(rowIndex, columnIndex, value);
}

/**
* Returns the columnIndex given the columnId
*
* @method getColumnIndex
* @param {Integer} colId The column Id of the column it's column index we want to know 
* @param {String} containerType Optional value to use if we want the header for an specific containerType
*/
SpreadSheet.prototype.getColumnIndex = function (colId) {
	return _.findIndex(this.getHeader(),{id :colId});
}

/**
* Changes the number of rows in the grid
*
* @method updateNumberOfRows
* @param {Integer} n The new number of rows
*/
SpreadSheet.prototype.updateNumberOfRows = function (n) {
	if (this.spreadSheet) {
		var data = this.spreadSheet.getData();
		//Sets the appropiate number of rows according to the capacity
		if (data.length < n){
			for (var i = data.length + 1; i<= n; i++){
				data.push([i]);
			}
		}
		else{
			data = data.slice(0, n);
		}
		this.spreadSheet.loadData(data);
	}
}

/**
* Sets an empty value for all the cells in a given row
*
* @method emptyRow
* @param {Integer} row The row index to be emptied
*/
SpreadSheet.prototype.emptyRow = function (row) {
	var columnIds = this.getHeaderId();
	for (var i = 1 ; i < columnIds.length ; i++) {
		this.setDataAtCell(row,i,"");
	}
}
function AddContainerForm(args) {
    this.id = BUI.id();
    var _this = this;

    this.width = 600;
    this.height = 200;
	this.showTitle = true;
    this.container = {};
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

    this.containerTypeComboBox = new ContainerTypeComboBox({extraOptions : [{"type":"STOCK SOLUTION"},{"type":"OTHER", "capacity":1}]});
    this.stockSolutionsGrid = new StockSolutionsGrid({width : this.width*0.95});

    this.containerTypeComboBox.onSelected.attach(function (sender,selection){
        _this.container = {};
        if (selection.type == "STOCK SOLUTION") {
            _this.addStockSolutionsList();
            Ext.getCmp(_this.id + "-save-button").disable();
        } else {
            if (_this.stockSolutionsGrid.panel){
                _this.panel.remove(_this.stockSolutionsGrid.panel);
            }
            Ext.getCmp(_this.id + "-save-button").enable();
        }
    });

    this.stockSolutionsGrid.onSelected.attach(function (sender, stockSolution) {
        _this.container = stockSolution;
        _this.container.containerType = "STOCK SOLUTION";
        Ext.getCmp(_this.id + "-save-button").enable();
    });

    this.onSave = new Event(this);
    this.onCancel = new Event(this);
}

AddContainerForm.prototype.getPanel = function(dewar) {
    this.panel = Ext.create('Ext.form.Panel', {
        width : this.width - 10,
        height : this.height,
//			cls : 'border-grid',
//			margin : 10,
        padding : 10,
        buttons : this.getButtons(),
        items : [ {
                        xtype : 'container',
                        margin : "2 2 2 2",
                        collapsible : false,
                        defaultType : 'textfield',
                        layout : 'anchor',
                        items : [ {
                            xtype : 'container',
                            margin : '5 0 5 5',
                            layout : 'vbox',
                            items : [ {
                                xtype : 'textfield',
                                fieldLabel : 'Name',
                                name : 'code',
                                id : this.id + 'container_code',
                                labelWidth : 200,
                                width : 500
                            }
                            ]
                        }, 
                        this.containerTypeComboBox.getPanel()
            ]
        } ]
    });
	return this.panel;
};

AddContainerForm.prototype.getButtons = function () {
    var _this = this;
    return [ {
                text : 'Save',
                id : this.id + "-save-button",
                handler : function() {
                    _this.onSave.notify(_this.getContainer());
                }
            }, {
                text : 'Cancel',
                handler : function() {
                    _this.onCancel.notify();
                }
            } ]
}

AddContainerForm.prototype.getContainer = function () {
    this.container.code = Ext.getCmp(this.id + "container_code").getValue();
    this.container.containerType = this.containerTypeComboBox.getSelectedType();
    this.container.capacity = this.containerTypeComboBox.getSelectedCapacity();    
    return this.container;
}

AddContainerForm.prototype.addStockSolutionsList = function () {
    var stockSolutions = _.filter(EXI.proposalManager.getStockSolutions(),{"boxId" : null});
    this.panel.insert(this.stockSolutionsGrid.getPanel());
    this.stockSolutionsGrid.load(stockSolutions);
}
/**
 * @showTitle
 *
 * #onSaved
 * #onAddPlates
 * #onRemovePlates
 **/
function CaseForm(args) {
	this.id = BUI.id();
	this.width = 600;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
	}

	this.onSaved = new Event(this);
}

CaseForm.prototype.fillStores = function() {
	var _this = this;
	this.panel.setLoading("Loading Labcontacts from database");

	var proposal = BUI.getProposal();
	proposal.onDataRetrieved.attach(function(sender, data) {
		_this.labContactForSendingStore.loadData(data, false);
		_this.labContactForReturnStore.loadData(data, false);
		_this.panel.setLoading(false);
	});
	proposal.getLabContactsByProposalId();

};

CaseForm.prototype.refresh = function(dewar) {
	this.setDewar(dewar);
};

CaseForm.prototype.getDewar = function() {
	this.dewar.code = Ext.getCmp(this.id + "dewar_code").getValue();
	this.dewar.comments = Ext.getCmp(this.id + "dewar_comments").getValue();
	this.dewar.transportValue = Ext.getCmp(this.id + "dewar_transportValue").getValue();
//	this.dewar.storageLocation = Ext.getCmp("dewar_storageLocation").getValue();
	this.dewar.storageLocation = this.storageLocationComboBox.getValue();
	//this.dewar.firstExperimentId = this.sessionsCombo.getValue();
	return this.dewar;
};

CaseForm.prototype.setDewar = function(dewar) {
	this.dewar = dewar;
	
	if (this.dewar == null){
		this.dewar={};
		this.dewar["code"] = "";
		this.dewar["transportValue"] = "";
		this.dewar["storageLocation"] = "";
		this.dewar["comments"] = "";
	}
	
	Ext.getCmp(this.id + "dewar_code").setValue(this.dewar.code);
	Ext.getCmp(this.id + "dewar_comments").setValue(this.dewar.comments);
	Ext.getCmp(this.id + "dewar_transportValue").setValue(this.dewar.transportValue);
//	Ext.getCmp("dewar_storageLocation").setValue(this.dewar.storageLocation);
	this.storageLocationComboBox.setValue(this.dewar.storageLocation);
	/*if (this.dewar.sessionVO != null) {
		this.sessionsCombo.setValue(this.dewar.sessionVO.sessionId);
	}*/
};

/*
CaseForm.prototype.getSessionCombo = function() {
	this.sessionsCombo = BIOSAXS_COMBOMANAGER.getComboSessions(EXI.proposalManager.getFutureSessions(), {
		labelWidth : 200,
		margin : '5 0 00 0',
		width : 500
	});
	return this.sessionsCombo;
};*/

CaseForm.prototype.getStorageLocationCombo = function() {
	this.storageLocationComboBox =  BIOSAXS_COMBOMANAGER.getComboStorageTemperature();
	return this.storageLocationComboBox;
};

CaseForm.prototype.getPanel = function(dewar) {
		this.panel = Ext.create('Ext.form.Panel', {
			width : this.width - 10,
//			cls : 'border-grid',
//			margin : 10,
			padding : 10,
			height : 320,
			items : [ {
				xtype : 'container',
				margin : "2 2 2 2",
				collapsible : false,
				defaultType : 'textfield',
				layout : 'anchor',
				items : [ {
					xtype : 'container',
					layout : 'vbox',
					items : [ {
						xtype : 'requiredtextfield',
						fieldLabel : 'Name',
						allowBlank : false,
						name : 'code',
						id : this.id + 'dewar_code',
						labelWidth : 200,
						width : 500
					}
					]
				}, 
				this.getStorageLocationCombo(),
				{
					xtype : 'numberfield',
					width : 500,
					labelWidth : 200,
					margin : '10 0 0 0',
					fieldLabel : 'Transport Value',
					id : this.id + 'dewar_transportValue'
				},
				{
					xtype : 'textareafield',
					name : 'comments',
					fieldLabel : 'Comments',
					labelWidth : 200,
					width : 500,
					margin : '10 0 0 0',
					height : 100,
					id : this.id + 'dewar_comments'
				} ]
			} ]
		});
	this.refresh(dewar);
	return this.panel;
};

function ContainerSpreadSheet(args){
	this.id = BUI.id();
	SpreadSheet.call(this, args);

    this.renderCrystalFormColumn = false;

    if (args != null) {
		if (args.renderCrystalFormColumn != null) {
			this.renderCrystalFormColumn = args.renderCrystalFormColumn;
		}
	}

    this.crystalInfoToIdMap = {};

	this.crystalFormIndex = -1;
	// this.unitCellIndex = -1;
	this.spaceGroupIndex = -1;
	
	this.onModified = new Event(this);

}

ContainerSpreadSheet.prototype.getPanel = SpreadSheet.prototype.getPanel;
ContainerSpreadSheet.prototype.setLoading = SpreadSheet.prototype.setLoading;
ContainerSpreadSheet.prototype.getAcronyms = SpreadSheet.prototype.getAcronyms;
ContainerSpreadSheet.prototype.getHeaderWidth = SpreadSheet.prototype.getHeaderWidth;
ContainerSpreadSheet.prototype.getHeaderId = SpreadSheet.prototype.getHeaderId;
ContainerSpreadSheet.prototype.getHeaderText = SpreadSheet.prototype.getHeaderText;
ContainerSpreadSheet.prototype.getColumns = SpreadSheet.prototype.getColumns;
ContainerSpreadSheet.prototype.parseTableData = SpreadSheet.prototype.parseTableData;
ContainerSpreadSheet.prototype.getData = SpreadSheet.prototype.getData;
ContainerSpreadSheet.prototype.loadData = SpreadSheet.prototype.loadData;
ContainerSpreadSheet.prototype.setDataAtCell = SpreadSheet.prototype.setDataAtCell;
ContainerSpreadSheet.prototype.getColumnIndex = SpreadSheet.prototype.getColumnIndex;
ContainerSpreadSheet.prototype.disableAll = SpreadSheet.prototype.disableAll;
ContainerSpreadSheet.prototype.setContainerType  = SpreadSheet.prototype.setContainerType;
ContainerSpreadSheet.prototype.updateNumberOfRows  = SpreadSheet.prototype.updateNumberOfRows;
ContainerSpreadSheet.prototype.emptyRow  = SpreadSheet.prototype.emptyRow;

ContainerSpreadSheet.prototype.load = function(puck){
	var _this = this;
	this.puck = puck;
	var container = document.getElementById(this.id + '_samples');
	this.crystalFormIndex = this.getColumnIndex('Crystal Form');
	// this.unitCellIndex = this.getColumnIndex('Unit cell');
	this.spaceGroupIndex = this.getColumnIndex("Space Group");
	var data = this.getSamplesData(puck);
    
	  function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    td.style.fontWeight = 'bold';
	    td.style.color = 'green';
	    td.style.fontSize = '9px';
	    td.style.background = '#CEC';
	  }
	  
	  function ValueRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    if (!instance.getDataAtRow(row)[1]){
	    	td.style.background = '#EEE';
	    	return;
	    }
	    
	    if ((col == 2)){
		    	if (!value || value == '') {
		    		td.className = 'custom-row-text-required';
		  	    }
	    }
		if (/*(col == _this.unitCellIndex) || */col == _this.spaceGroupIndex) {
			td.style.background = '#EEE';
		}
	  }

	  
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);
	  this.spreadSheet = new Handsontable(container, {
		  		afterCreateRow: function (index, numberOfRows) {
                    data.splice(index, numberOfRows);
                },
				beforeChange: function (changes, source) {
					lastChange = changes;
				},
				afterChange: function (changes, source) {
                    $(".htInvalid").removeClass("htInvalid");
					$(".edit-crystal-button").click(function(sender){
								var row = sender.target.id.split("-")[2];
								var crystal = _this.parseCrystalFormColumn(_this.getData()[row][_this.crystalFormIndex],row);
								_this.showEditForm(crystal,row);
							});
					if (source == "edit") {
						if (changes) {
							for (var i = 0 ; i < changes.length ; i++) {
								var change = changes[i];
								if (change[2] != change[3]) {
									_this.manageChange(change, source);
								}
							}
						}
					} else if (source == "autofill") {
						if (changes){
							/**Get the direction of the autofill and manage the change following that direction*/
							var direction = Math.sign(changes[0][0] - _this.spreadSheet.getSelected()[0]);
							if (direction == 1){
								for (var i = 0 ; i < changes.length ; i++) {
									var change = changes[i];
									if (change[2] != change[3]) {
										_this.manageChange(change, source, direction);
									}
								}
							} else {
								for (var i = changes.length - 1 ; i >= 0 ; i--) {
									var change = changes[i];
									if (change[2] != change[3]) {
										_this.manageChange(change, source, direction);
									}
								}
							}
						}
					}
				},
				data: data,
				height : this.height,
				width : this.width,
				manualColumnResize: true,
				colWidths: this.getHeaderWidth(),
				colHeaders: this.getHeaderText(),
				stretchH: 'last',
				columns: this.getColumns(),
		});
};

/**
* Returns an array of arrays for each sample in the given container up to the container's capacity ordered according to the grid
*
* @method getSamplesData
* @param {Object} puck The container which's samples are parsed
*/
ContainerSpreadSheet.prototype.getSamplesData = function(puck) {
    var data = [];
    var samples = puck.sampleVOs;
    /** Sorting samples by location * */
    samples.sort(function(a,b){return Number(a.location) - Number(b.location);});
    function getSampleByLocation(samples, location){
        for (var i = 0; i < samples.length; i++) {
            if (samples[i].location == Number(location)){
                return samples[i];
            }
        }
    }

    function getValue(value){
        if (!value){return "";}
        return value;
    }
		
    for (var i = 0; i < puck.capacity; i++) {
        var sample = getSampleByLocation(samples, i + 1);
        if (sample!= null){
                var crystal = sample.crystalVO;
                var protein = crystal.proteinVO;
                var diffraction = sample.diffractionPlanVO;
                if (diffraction == null){
                    diffraction = {};
                }
                data.push(
                    [
                        // crystal.crystalId,
                        (i+1), 
                        protein.acronym, sample.name, this.getCrystalInfo(crystal), diffraction.experimentKind, sample.code,  getValue(diffraction["observedResolution"]),  diffraction.requiredResolution, diffraction.preferredBeamDiameter, 
                        diffraction.numberOfPositions, diffraction.radiationSensitivity, diffraction.requiredMultiplicity, diffraction.requiredCompleteness,
						// this.getUnitCellInfo(crystal),
						crystal.spaceGroup, sample.smiles, sample.comments
                    ]
                );
        }
        else{
            data.push([(i+1)]);
        }
    }
	return data;
};

ContainerSpreadSheet.prototype.getHeader = function() {
    var _this = this;
	var header = [];
	var disabledRenderer = function(instance, td, row, col, prop, value, cellProperties){
		if (value != undefined){
			td.innerHTML = value;
		}
		td.style.background = '#DDD';
	}
	var editCrystalFormRenderer = function(instance, td, row, col, prop, value, cellProperties){
		if (value != undefined){
			td.innerHTML = value;
		}
	}
    header = [
            // { text :'', id :'crystalId', column : {width : 100}}, 
            { text : '#', 	id: 'position', column : {width : 20}}, 
            { text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
                                                                                        width : 80,
                                                                                        type: 'dropdown',
                                                                                        source: this.getAcronyms()
                                                                                    }
            }, 
            { text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}}, 
            { text :'Crystal<br /> Form', id : 'Crystal Form',column : {
                                                                        width : 250,
                                                                        type: 'dropdown',
                                                                        source: function(query, process) {
                                                                            var colIndex = _this.getColumnIndex("Protein Acronym");
                                                                            var protein = EXI.proposalManager.getProteinByAcronym(this.instance.getDataAtCell(this.row,colIndex));
                                                                            if (protein.length > 0){
                                                                                process(_this.getCrystalInfoByProtein(protein[0]));
                                                                            } else {
                                                                                process([]);
                                                                            }
                                                                        }
                                                                    }
                                                                }, 
            { text :'Exp.<br /> Type', id : 'Experiment Type', column : {
                                                                        width : 80,  
                                                                        type: 'dropdown',
                                                                        source: [ "Default", "MXPressE", "MXPressO", "MXPressI", "MXPressE_SAD", "MXScore", "MXPressM" ]
                                                                    }
            }, 
            { text :'Pin <br />BarCode', id : 'Pin BarCode', column : {width : 60}},  
            { text :'Pre-observed <br />resolution', id : 'Pre-observed resolution', column : {width : 80}}, 
            { text :'Needed<br /> resolution',  id :'Needed resolution', column : {width : 60}}, 
            { text :'Pref. <br />Diameter', id :'Pref. Diameter',column : {width : 60}}, 
            { text :'Number of<br /> positions', id :'Number Of positions', column : {width : 80}}, 
            { text :'Radiation<br /> Sensitivity', id :'Radiation Sensitivity', column : {width : 80}}, 
            { text :'Required<br /> multiplicity', id :'Required multiplicity', column : {width : 60}}, 
            { text :'Required<br /> Completeness', id :'Required Completeness', column : {width : 80}}, 
            // { text :'Unit Cell', id :'Unit cell', column : {width : 150, renderer: disabledRenderer, editor : false, readOnly: true}}, 
            { text :'Space <br /> Group', id :'Space Group', column : {width : 55, renderer: disabledRenderer, editor : false, readOnly: true}}, 
            { text :'Smiles', id :'Smiles', column : {width : 140}}, 
            { text :'Comments', id :'Comments', column : {width : 200}}
            ];

    if (this.renderCrystalFormColumn) {
        header.push({ text :'Edit Crystal Form', id :'editCrystalForm', column : {width : 200, renderer: editCrystalFormRenderer, editor : false, readOnly: true}});
    }

    return header;
};


/**
* Returns a puck object with the corresponding samples from the grid
*
* @method getPuck
*/
ContainerSpreadSheet.prototype.getPuck = function() {
	var myPuck = JSON.parse(JSON.stringify(this.puck));
	var rows = this.parseTableData();
	myPuck['barcode'] = rows[0]["Pin BarCode"];
    
	//myPuck.sampleVOs = [];
    var aux = [];
    
    function filterByLocation(samples){
        return _.filter(samples, function(b){return b.location == rows[i].location;} );
    }
	for (var i = 0; i < rows.length; i++) {
        var sample = {};
        var sampleByLocation = filterByLocation(myPuck.sampleVOs);
        if (sampleByLocation.length > 0){
            /** new sample */
		    sample = sampleByLocation[0];
        } 
        
		sample["name"] = rows[i]["Sample Name"];
		// sample["Dewar_barCode"] = rows[i]["Pin BarCode"];
		sample["smiles"] = rows[i]["Smiles"];
		sample["location"]= rows[i]["location"];
		sample["comments"] = rows[i]["Comments"];
        var proteins = [];
		if (sample["crystalVO"] == null){
			sample["crystalVO"] = {};
			proteins = EXI.proposalManager.getProteinByAcronym(rows[i]["Protein Acronym"]);
			if (proteins != null){
				sample["crystalVO"]["proteinVO"] = proteins[0];
			}
		}
        else{
            proteins = EXI.proposalManager.getProteinByAcronym(rows[i]["Protein Acronym"]);
			if (proteins != null){
				sample["crystalVO"]["proteinVO"] = proteins[0];
			}
        }
		var crystal = this.parseCrystalFormColumn(rows[i]["Crystal Form"],i);
		sample["crystalVO"]["spaceGroup"] = (crystal.spaceGroup) ? crystal.spaceGroup : "";
		sample["crystalVO"]["cellA"] = crystal.cellA;
		sample["crystalVO"]["cellB"] = crystal.cellB;
		sample["crystalVO"]["cellC"] = crystal.cellC;
		sample["crystalVO"]["cellAlpha"] = crystal.cellAlpha;
		sample["crystalVO"]["cellBeta"] = crystal.cellBeta;
		sample["crystalVO"]["cellGamma"] = crystal.cellGamma;
		
		sample["diffractionPlanVO"] = {};
		sample["diffractionPlanVO"]["radiationSensitivity"]= Number(rows[i]["Radiation Sensitivity"]);
		sample["diffractionPlanVO"]["requiredCompleteness"]= Number(rows[i]["Required Completeness"]);
		sample["diffractionPlanVO"]["requiredMultiplicity"]= Number(rows[i]["Required multiplicity"]);
		sample["diffractionPlanVO"]["requiredResolution"]= Number(rows[i]["Needed resolution"]);
		sample["diffractionPlanVO"]["observedResolution"]= Number(rows[i]["Pre-observed resolution"]);
		sample["diffractionPlanVO"]["preferredBeamDiameter"]= Number(rows[i]["Pref. Diameter"]);
		sample["diffractionPlanVO"]["numberOfPositions"]= Number(rows[i]["Number Of positions"]);
		sample["diffractionPlanVO"]["experimentKind"]= rows[i]["Experiment Type"];
		aux.push(sample);
		
	}
    myPuck.sampleVOs = aux;

    
	return myPuck;
};

ContainerSpreadSheet.prototype.setRenderCrystalFormColumn = function(bool) {
	this.renderCrystalFormColumn = bool;
};

/**
* Returns an object containing the crystal information given the value at the crystal form column
*
* @method parseCrystalFormColumn
* @param {String} dataAtCrystalFormColumn The string containing the information with the space group and the cell values
* @param {Integer} row The corresponding row
*/
ContainerSpreadSheet.prototype.parseCrystalFormColumn = function (dataAtCrystalFormColumn,row) {
	var parsed = {
					spaceGroup 	: null,
					cellA		: null,
					cellB		: null,
					cellC		: null,
					cellAlpha	: null,
					cellBeta	: null,
					cellGamma	: null
				};
	if (dataAtCrystalFormColumn != "" && dataAtCrystalFormColumn != null){
		var proteins = EXI.proposalManager.getProteinByAcronym(this.spreadSheet.getDataAtCell(row,this.getColumnIndex("Protein Acronym")));
		if (proteins && proteins.length > 0) {
			parsed.proteinVO = proteins[0];
		}
		if (dataAtCrystalFormColumn == "NEW") {
			parsed.spaceGroup = "NEW";
			parsed.crystalId = "";
		} else {
			if (this.crystalInfoToIdMap[dataAtCrystalFormColumn]){
				parsed.crystalId = this.crystalInfoToIdMap[dataAtCrystalFormColumn];
			} else {
				this.getCrystalInfoByProtein(proteins[0]);
				parsed.crystalId = this.crystalInfoToIdMap[dataAtCrystalFormColumn];
			}
			var splitted = dataAtCrystalFormColumn.split("-");
			parsed.spaceGroup = splitted[0].trim();
			if (splitted.length > 1){
				var cells = (splitted[1] + "-" + splitted[2]).trim().replace(/[{()}]/g, '').replace(/\s+/g,"");;
				parsed.cellA = (cells.split("-")[0].split(",")[0] == "null")? null : cells.split("-")[0].split(",")[0];
				parsed.cellB = (cells.split("-")[0].split(",")[1] == "null")? null : cells.split("-")[0].split(",")[1];
				parsed.cellC = (cells.split("-")[0].split(",")[1] == "null")? null : cells.split("-")[0].split(",")[2];
				parsed.cellAlpha = (cells.split("-")[1].split(",")[0] == "null")? null : cells.split("-")[1].split(",")[0];
				parsed.cellBeta = (cells.split("-")[1].split(",")[1] == "null")? null : cells.split("-")[1].split(",")[1];
				parsed.cellGamma = (cells.split("-")[1].split(",")[2] == "null")? null : cells.split("-")[1].split(",")[2];
			} else {
				parsed.cellA = 0;
				parsed.cellB = 0;
				parsed.cellC = 0;
				parsed.cellAlpha = 0;
				parsed.cellBeta = 0;
				parsed.cellGamma = 0;
			}
		}
	}
	return parsed;
};

/**
* Returns an string of the form [spaceGroup - (cellA : cellB : cellC | cellAlpha : cellBeta : cellGamma)]
*
* @method getCrystalInfo
* @param {Object} crystal The crystal used to extract the values
*/
ContainerSpreadSheet.prototype.getCrystalInfo = function (crystal) {
    try {
        if (crystal.cellA == null) {
            return crystal.spaceGroup + " - undefined";
        } else if (crystal.cellA == 0 && crystal.cellB == 0 && crystal.cellC == 0 && crystal.cellAlpha == 0 && crystal.cellBeta == 0 && crystal.cellGamma == 0 ){
            return crystal.spaceGroup
        }
        return crystal.spaceGroup + " - (" + crystal.cellA + " , " + crystal.cellB + " , " + crystal.cellC + " - " + crystal.cellAlpha + " , " + crystal.cellBeta + " , " + crystal.cellGamma + ")";
    } catch (e) {
        return "";
    }
};

ContainerSpreadSheet.prototype.getUnitCellInfo = function (crystal) {
	var html = "";
	dust.render("shipping.edit.form.unit.cell.template", crystal, function(err,out){
		html = out;
	});
	return html;
};

ContainerSpreadSheet.prototype.showEditForm = function (crystal, row) {
	var _this = this;

	/** Check if other samples share this crystal form */

	var editCrystalForm = new EditCrystalFormView();

	editCrystalForm.onSaved.attach(function (sender, crystal) {
		var rows = _this.parseTableData();
		_this.updateCrystalGroup(row,crystal);
		for (var i = 0; i < rows.length; i++) {
			if (rows[i].location-1 != row){
				if (_this.crystalInfoToIdMap[rows[i]["Crystal Form"]] == crystal.crystalId){
					_this.updateCrystalGroup(rows[i].location-1,crystal);
				}
			}
		}
		window.close();
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Crystal Form',
		height : 460,
		width : 600,
		modal : true,
		closable : false,
		layout : 'fit',
		items : [ editCrystalForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					editCrystalForm.save();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					if (crystal.spaceGroup == "NEW"){
						_this.resetCrystalGroup(row);
					}
					window.close();
				}
			} ]
	}).show();

	editCrystalForm.load(crystal);
};

ContainerSpreadSheet.prototype.addEditCrystalFormButton = function (row, column) {
	if (!column) {
		column = this.getColumnIndex("editCrystalForm");
	}
	var button = "<a id='edit-button-" + row + "' class='btn btn-xs edit-crystal-button'><span class='glyphicon glyphicon-edit'></span> Edit Crystal Form</a>";
	this.setDataAtCell(row,column,button);
};

ContainerSpreadSheet.prototype.updateCrystalGroup = function (row, crystal) {
    if (crystal) {
        this.setDataAtCell(row,this.crystalFormIndex,this.getCrystalInfo(crystal));
        // this.setDataAtCell(row,this.unitCellIndex,this.getUnitCellInfo(crystal));
        this.setDataAtCell(row,this.spaceGroupIndex,crystal.spaceGroup);
        // this.setDataAtCell(row,0,crystal.crystalId); //crystal Id column
        this.addEditCrystalFormButton(row);
    } else {
        this.resetCrystalGroup(row);
    }
};

ContainerSpreadSheet.prototype.resetCrystalGroup = function (row) {
	this.setDataAtCell(row,this.crystalFormIndex,"");
	// this.setDataAtCell(row,this.unitCellIndex,"");
	this.setDataAtCell(row,this.spaceGroupIndex,"");
	// this.setDataAtCell(row,0,"");
	this.setDataAtCell(row,this.getColumnIndex("editCrystalForm"),"");
};

ContainerSpreadSheet.prototype.disableAll = function () {
	this.spreadSheet.updateSettings({
					readOnly: true
				});
};

/**
* Method executed when a change is made on the spreadSheet. It manages the process when the crystal form or the protein acronym are changed
*
* @method manageChange
* @param {Array} change The change made to the spreadSheet as an array of the form [row, column, prevValue, newValue]
* @param {String} source The kind of change. Can be "edit" or "autofill"
* @param {Integer} direction In case of the source being autofill, this parameter indicates the direction of it
*/
ContainerSpreadSheet.prototype.manageChange = function (change, source, direction){
	switch (change[1]) { //Column Index
		case this.crystalFormIndex : {
			var parsed = this.parseCrystalFormColumn(change[3],change[0]); // parseCrystalFormColumn(dataAtCrystalFormColumn,row)
			if (parsed.spaceGroup != undefined){
				if (parsed.spaceGroup == "NEW"){
					this.showEditForm(parsed, change[0]);
				} else {
					if (this.isCrystalFormAvailable(parsed,this.getData()[change[0]][this.getColumnIndex("Protein Acronym")])){
						this.updateCrystalGroup(change[0],parsed);
					} else {
						this.resetCrystalGroup(change[0]);
					}
				}
			} else {
				this.resetCrystalGroup(change[0]);
			}
			break;
		}
		case this.getColumnIndex("Protein Acronym") : {
            if (change[3] == ""){
				this.emptyRow(change[0]);
            } else {
				/**Manage the sample name column */
				if (change[0] > 0){
					var colIdx = this.getColumnIndex("Sample Name");
					var currentName = this.spreadSheet.getDataAtCell(change[0],colIdx);
					if (currentName == undefined || currentName == "") {
						var nameSampleAbove = this.spreadSheet.getDataAtCell(change[0] - 1, colIdx);
						if (nameSampleAbove != null && nameSampleAbove != "") {
							var autoincremented = this.autoIncrement(nameSampleAbove, 1);
							if (autoincremented != "") {
								this.setDataAtCell(change[0],colIdx,autoincremented);
							}
						}
					}
				}
				/**Manage the crystal form column */
                var parsed = this.parseCrystalFormColumn(this.getData()[change[0]][this.crystalFormIndex],change[0]); // parseCrystalFormColumn(dataAtCrystalFormColumn,row)
                if (!this.isCrystalFormAvailable(parsed,change[3])){
                    this.resetCrystalGroup(change[0]);
                    var proteins = EXI.proposalManager.getProteinByAcronym(change[3]);
                    if (proteins) {
                        var crystalsByProteinId = _.filter(EXI.proposalManager.getCrystals(),function(o) {return o.proteinVO.proteinId == proteins[0].proteinId;});
                        if (crystalsByProteinId && crystalsByProteinId.length > 0){
                            var crystal = _.maxBy(crystalsByProteinId,"crystalId");
                            this.updateCrystalGroup(change[0],crystal);
                        }
                    }
                }
            }
			break;
		}
		case this.getColumnIndex("Sample Name") : {
            if (source == "autofill" && change[3] != ""){
				var autoincremented = this.autoIncrement(this.spreadSheet.getDataAtCell(change[0] - direction, change[1]), direction);
				if (autoincremented != "") {
					this.setDataAtCell(change[0],change[1],autoincremented);
				}
            }
			break;
		}
	}
	if (change[1] != this.getColumnIndex("editCrystalForm")){
		this.onModified.notify(change);
	}
	$(".htInvalid").removeClass("htInvalid");
};

/**
* Returns an autoincremented string
*
* @method autoIncrement
* @param {String} value The string to be incremented
* @param {Integer} direction The direction on which the string is going to be incremented
*/
ContainerSpreadSheet.prototype.autoIncrement = function (value, direction) {
	var autoincremented = "";
	var regex = /(\d+)/g;
	var numbers = value.match(regex);
	if (numbers) {
		var lastNumber = numbers[numbers.length - 1];
		/**Check if there are any other characters after the last number */
		if (value.lastIndexOf(lastNumber) == value.length - lastNumber.length) {
			autoincremented = value.substring(0,value.length - lastNumber.length) + (parseInt(lastNumber) + direction);
		}
	}
	return autoincremented;
}

/**
* Returns true if the parseCrystalForm is available for the given proteinAcronym
*
* @method isCrystalFormAvailable
* @param {Object} parsedCrystalForm A parsed crystal form object
* @param {String} proteinAcronym The proteinAcronym
*/
ContainerSpreadSheet.prototype.isCrystalFormAvailable = function (parsedCrystalForm, proteinAcronym) {
	var crystalsBySpaceGroupAndAcronym = _.filter(_.filter(EXI.proposalManager.getCrystals(),{"spaceGroup":parsedCrystalForm.spaceGroup}),function(o){return o.proteinVO.acronym == proteinAcronym})
	if (crystalsBySpaceGroupAndAcronym.length > 0) {
        for (var i = 0 ; i < crystalsBySpaceGroupAndAcronym.length ; i++) {
            var crystal = crystalsBySpaceGroupAndAcronym[i];
            if (crystal.cellA == parsedCrystalForm.cellA && crystal.cellB == parsedCrystalForm.cellB && crystal.cellC == parsedCrystalForm.cellC && crystal.cellAlpha == parsedCrystalForm.cellAlpha && crystal.cellBeta == parsedCrystalForm.cellBeta && crystal.cellGamma == parsedCrystalForm.cellGamma) {
                return true;
            }
        }
    }
    return false;
};

/**
* Loads the crystal info to ud map and returns an array of cystal info given a protein
*
* @method getCrystalInfoByProtein
* @param {Object} protein The protein the crystals must be linked to
* @return {Array} Returns an array of strings with the crystal info to be loaded on the Crystal Form column
*/
ContainerSpreadSheet.prototype.getCrystalInfoByProtein = function (protein) {
	var src = [];
	var crystalsByProteinId = _.filter(EXI.proposalManager.getCrystals(),function(o) {return o.proteinVO.proteinId == protein.proteinId;});
	if (crystalsByProteinId) {
		for (var i = 0 ; i < crystalsByProteinId.length ; i++){
			var crystalInfo = this.getCrystalInfo(crystalsByProteinId[i]);
			this.crystalInfoToIdMap[crystalInfo] = crystalsByProteinId[i].crystalId;
			src.push(crystalInfo);
		}
	}
	return _.union(src,["NEW"]);
};
function CrystalFormView (args) {
    this.id = BUI.id();
    this.padding = 20;
    this.containerId = 0;
	
	if (args != null) {
        if (args.padding != null) {
			this.padding = args.padding;
		}
        if (args.containerId != null) {
			this.containerId = args.containerId;
		}
	}

    this.uploaderWidget = new UploaderWidget();
}



CrystalFormView.prototype.getPanel = function(){
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        buttons : this.getToolBar(),
        items : [
            {
                html : '<div id="' + this.id + '" ></div>',
            },
            this.uploaderWidget.getForm(),
            {
                xtype : 'button',
                margin: '0 0 0 2',
                text: 'Test',
                handler: function() {
                    window.open('#/shipping/edv','_newtab');
                    // var edv = new ElectronDensityViewer();
                    // var window = Ext.create('Ext.window.Window', {
                    //         title: 'Elecyton Density Viewer',
                    //         height: Ext.getBody().getHeight() - 100,
                    //         width: Ext.getBody().getWidth() - 100,
                    //         modal : true,
                    //         resizable : true,
                    //         layout: 'fit',
                    //         items: edv.getPanel()
                    // }).show();
                }
            }
        ]
    });

    return this.panel;
};

CrystalFormView.prototype.getToolBar = function() {
	var _this = this;
	return [
            {
	            text: 'Return to shipment',
	            width : 200,
	            height : 30,
	            handler : function () {
                    location.href = "#/shipping/" + _this.shippingId + "/main";
                }
	        }
	];
};

CrystalFormView.prototype.load = function(containerId, sampleId, shippingId){
    var _this = this;
    this.containerId = containerId;
    this.sampleId = sampleId;
    this.shippingId = shippingId;
    this.panel.setTitle("Shipment");

    var onSuccess = function (sender, puck) {
        if (puck){
            var filtered = _.filter(puck.sampleVOs,function (o) {return o.blSampleId == _this.sampleId});
            if (filtered.length > 0) {
                _this.sample = filtered[0];
                
                var html = "";
                dust.render("crystal.form.template", _this.sample, function(err, out) {                                                                       
                    html = html + out;
                });
                
                $('#' + _this.id).hide().html(html).fadeIn('fast');
                $('#' + _this.id).css("padding",_this.padding);
                _this.panel.doLayout();
            }
        }
    }

	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(this.containerId,this.containerId,this.containerId);
};
function EditCrystalFormView (args) {
    this.id = BUI.id();

    this.width = 600;
    this.height = 500;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

	this.onSaved = new Event(this);
};

EditCrystalFormView.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					padding : this.padding,
					width : this.width,
				}]
	});

	return this.panel;
};

EditCrystalFormView.prototype.load = function(crystal) {
	var _this = this;
	this.crystal = crystal;
	if (crystal.crystalId != null){
		if (crystal.crystalId != "") {
			var onSuccess = function (sender, crystalById) {
				_this.crystal = crystalById;
				_this.render();
			}
			EXI.getDataAdapter({onSuccess:onSuccess}).mx.crystal.getCrystalById(crystal.crystalId);
		} else {
			this.render();
		}
	} else {
		$('#' + this.id).hide().html("<div id='" + this.id + "-error' style='margin:30px;'><h4>There was an error loading the crystal</h4></div>").fadeIn('fast');
		this.panel.doLayout();
	}
}

EditCrystalFormView.prototype.render = function () {
	var _this = this;
    this.crystal.spaceGroups = ExtISPyB.spaceGroups;
	this.crystal.id = this.id;
    var html = "";
	
    dust.render("crystal.edit.form.template", this.crystal, function(err, out){
		html = out;
	});
	
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();

	$('#' + this.id + "-space-group").on('change', function() {
		_this.setCellValuesBySpaceGroup(this.value);	
	});

	this.setCellValuesBySpaceGroup($('#' + this.id + "-space-group").val());

};

EditCrystalFormView.prototype.save = function () {
	var _this = this;
    var crystal = {
                    spaceGroup  :   $("#" + this.id + "-space-group").val(),
                    cellA       :   $("#" + this.id + "-cellA").val(),
                    cellB       :   $("#" + this.id + "-cellB").val(),
                    cellC       :   $("#" + this.id + "-cellC").val(),
                    cellAlpha   :   $("#" + this.id + "-cellAlpha").val(),
                    cellBeta    :   $("#" + this.id + "-cellBeta").val(),
                    cellGamma   :   $("#" + this.id + "-cellGamma").val(),
					name		: 	$("#" + this.id + "-name").val(),
					comments	:	$("#" + this.id + "-comments").val()
                };

	if (crystal.cellA != "" && crystal.cellB != "" && crystal.cellC != "") {
		this.panel.setLoading();
		var onSaved = function (sender, newCrystal) {
			EXI.proposalManager.get(true);
			_this.onSaved.notify(newCrystal);
			_this.panel.setLoading(false);
		}
		
		EXI.getDataAdapter({onSuccess : onSaved}).mx.crystal.save(this.crystal.proteinVO.proteinId, this.crystal.crystalId, 
																	crystal.name, crystal.spaceGroup, crystal.cellA, crystal.cellB, crystal.cellC, 
																	crystal.cellAlpha, crystal.cellBeta, crystal.cellGamma, crystal.comments);
	} else {
		$("#" + this.id + "-cellsABC").notify("The values A, B and C must be filled",{className:"error"});
	}
};

EditCrystalFormView.prototype.setCellValuesBySpaceGroup = function (spaceGroup) {
	var _this = this;
	var onSuccess = function (sender, geometryClass) {
		var alpha = "";
		var beta = "";
		var gamma = "";
		if (geometryClass && geometryClass.length > 0 && geometryClass[0].geometryClassnameVO){
			switch (geometryClass[0].geometryClassnameVO.geometryClassname){
				case "Primitive triclinic":
											break;
				case "Primitive monoclinic":
											alpha = 90;    
											gamma = 90;
											break;
				case "Centred monoclinic":
											alpha = 90;
											gamma = 90;
											break;
				case "Primitive orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "C-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "F-centred orthohombic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;    
				case "Primitive tetragonal":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred tetragonal":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "Primitive trigonal":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Primitive hexagonal":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Rhombohedral":
											alpha = 90;
											beta    = 90;
											gamma    = 120;
											break;
				case "Primitive cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "I-centred cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;
				case "F-centred cubic":
											alpha = 90;
											beta    = 90;
											gamma = 90;
											break;                                                                
			}
			_this.manageCellValueUpdate("#" + _this.id + "-cellAlpha", alpha);
			_this.manageCellValueUpdate("#" + _this.id + "-cellBeta", beta);
			_this.manageCellValueUpdate("#" + _this.id + "-cellGamma", gamma);
		}
	}
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.crystal.getGeometryclassBySpacegroup(spaceGroup);
}

EditCrystalFormView.prototype.manageCellValueUpdate = function (id, value) {
	if (value != "") {
		$(id).prop('disabled', true);
		$(id).val(value);
	} else {
		$(id).prop('disabled', false);
	}
}
function GenericContainerSpreadSheet(args){
	this.id = BUI.id();
	SpreadSheet.call(this, args);
}

GenericContainerSpreadSheet.prototype.getPanel = SpreadSheet.prototype.getPanel;
GenericContainerSpreadSheet.prototype.setLoading = SpreadSheet.prototype.setLoading;
GenericContainerSpreadSheet.prototype.getAcronyms = SpreadSheet.prototype.getAcronyms;
GenericContainerSpreadSheet.prototype.getHeaderWidth = SpreadSheet.prototype.getHeaderWidth;
GenericContainerSpreadSheet.prototype.getHeaderId = SpreadSheet.prototype.getHeaderId;
GenericContainerSpreadSheet.prototype.getHeaderText = SpreadSheet.prototype.getHeaderText;
GenericContainerSpreadSheet.prototype.getColumns = SpreadSheet.prototype.getColumns;
GenericContainerSpreadSheet.prototype.parseTableData = SpreadSheet.prototype.parseTableData;
GenericContainerSpreadSheet.prototype.getData = SpreadSheet.prototype.getData;
GenericContainerSpreadSheet.prototype.loadData = SpreadSheet.prototype.loadData;
GenericContainerSpreadSheet.prototype.setDataAtCell = SpreadSheet.prototype.setDataAtCell;
GenericContainerSpreadSheet.prototype.getColumnIndex = SpreadSheet.prototype.getColumnIndex;
GenericContainerSpreadSheet.prototype.disableAll = SpreadSheet.prototype.disableAll;
GenericContainerSpreadSheet.prototype.setContainerType  = SpreadSheet.prototype.setContainerType;
GenericContainerSpreadSheet.prototype.updateNumberOfRows  = SpreadSheet.prototype.updateNumberOfRows;
GenericContainerSpreadSheet.prototype.emptyRow  = SpreadSheet.prototype.emptyRow;


GenericContainerSpreadSheet.prototype.load = function(container){
	var _this = this;
	this.container = container;
	var domElement = document.getElementById(this.id + '_samples');
	var data = this.getSamplesData(container);
    
	  function firstRowRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    td.style.fontWeight = 'bold';
	    td.style.color = 'green';
	    td.style.fontSize = '9px';
	    td.style.background = '#CEC';
	  }
	  
	  function ValueRenderer(instance, td, row, col, prop, value, cellProperties) {
	    Handsontable.renderers.TextRenderer.apply(this, arguments);
	    if (!instance.getDataAtRow(row)[1]){
	    	td.style.background = '#EEE';
	    	return;
	    }
	    
	    if ((col == 2)){
		    	if (!value || value == '') {
		    		td.className = 'custom-row-text-required';
		  	    }
	    }
		if ((col == _this.unitCellIndex) || col == _this.spaceGroupIndex) {
			td.style.background = '#EEE';
		}
	  }

	  
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);
	  this.spreadSheet = new Handsontable(domElement, {
		  		afterCreateRow: function (index, numberOfRows) {
                    data.splice(index, numberOfRows);
                },
				beforeChange: function (changes, source) {
					lastChange = changes;
				},
				data: data,
			
				height : this.height,
				width : this.width,
				manualColumnResize: true,
				colWidths: this.getHeaderWidth(),
				colHeaders: this.getHeaderText(),
				stretchH: 'last',
				columns: this.getColumns(),
		});
};

/**
* Returns an array of arrays for each sample in the given container up to the container's capacity ordered according to the grid
*
* @method getSamplesData
* @param {Object} container The container which's samples are parsed
*/
GenericContainerSpreadSheet.prototype.getSamplesData = function(container) {
    var data = [];
    for (var i = 0; i < container.capacity; i++) {
        if (container.samples){
            if (i < container.samples.length){
                var sample = container.samples[i];
                data.push(
                    [(i+1),sample.Protein_acronym, sample.BLSample_name, sample.BLSample_comments]
                );
            } else {
                data.push([(i+1)]);
            }
        } else {
            data.push([(i+1)]);
        }
    }

    return data;
}

GenericContainerSpreadSheet.prototype.getHeader = function() {
    var header = [];
    header = [{ text : '#', 	id: 'position', column : {width : 20}}, 
				{ text :'Samplesheet <br />Acronym', id :'Protein Acronym', 	column :  {
																							width : 100,
																							type: 'dropdown',
																							source: this.getAcronyms()
																						}
				}, 
				{ text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}},
				{ text :'Comments', id :'Comments', column : {width : 200}}
				];

    return header;
}

/**
* Returns a puck object with the corresponding samples from the grid
*
* @method getPuck
*/
GenericContainerSpreadSheet.prototype.getPuck = function() {
    var rows = this.parseTableData();
    var myPuck = {};
    myPuck.sampleVOs = [];
	
    function filterByLocation(samples){
        return _.filter(samples, function(b){return b.BLSample_location == rows[i].location;} );
    }
    
    for (var i = 0; i < rows.length; i++) {
        var sample = {};
        var sampleByLocation = filterByLocation(this.container.samples);
        if (sampleByLocation.length > 0){
            /** new sample */
		    sample = sampleByLocation[0];
        }
		
		sample["Protein_acronym"] = rows[i]["Protein Acronym"];
        sample["BLSample_name"] = rows[i]["Sample Name"];
        sample["location"]= rows[i]["location"];
		sample["BLSample_comments"] = rows[i]["Comments"];
        sample["crystalVO"] = {
									proteinVO : EXI.proposalManager.getProteinByAcronym(rows[i]["Protein Acronym"])[0]
								};
        sample["diffractionPlanVO"] = {};

        myPuck.sampleVOs.push(sample);
    }
	
    return myPuck;
}
function OtherContainerForm(args) {
    this.id = BUI.id();
    var _this = this;

    this.width = 1500;
    this.height = 600;
    this.container = {};
	if (args != null) {
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

    this.containerSpreadSheet = new GenericContainerSpreadSheet({width : this.width - 50, height : this.height - 300});

    this.onSave = new Event(this);
    this.onCancel = new Event(this);
}

OtherContainerForm.prototype.load = function (container) {
    if (container) {
        // var _this = this;
        this.container = container;
        if (!this.container.samples) {
            this.container.samples = [];
        }
        if (!this.container.capacity) {
            this.container.capacity = container.samples.length;
        }
        
        Ext.getCmp(this.id + "container_name").setValue(container.code);
        Ext.getCmp(this.id + "capacity").setValue(this.container.capacity);
        this.containerSpreadSheet.load(this.container);
        this.panel.doLayout();
        // this.panel.setLoading(true);
        // var onSuccess = function (sender, samples) {
        //     if (samples) {
        //         _this.container.capacity = samples.length;
        //         _this.container.samples = samples;
        //         _this.containerSpreadSheet.load(_this.container);
        //         _this.panel.doLayout();
        //         _this.panel.setLoading(false);
        //     }
        // }
        // EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(container.containerId);
    }
}

OtherContainerForm.prototype.getPanel = function() {
    var _this = this;

    this.panel = Ext.create('Ext.form.Panel', {
        // width : this.width - 10,
        // height : this.height,
//			cls : 'border-grid',
//			margin : 10,
        autoScroll 	: true,
        buttons : this.getButtons(),
        items : [
                {
							xtype : 'container',
							margin : '5 0 2 5',
							layout : 'hbox',
							items : [
										
										
								         {
								        	 xtype : 'container',
											margin : '12 0 2 0',
											layout : 'hbox',
											items : [ 
							         				   {
																xtype: 'requiredtextfield',
																id : this.id + 'container_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '5 5 5 5',
																labelWidth : 100
														},
                                                        {
																xtype: 'numberfield',
																id : this.id + 'capacity',
																fieldLabel : 'Capacity',
																width : 250,
                                                                disabled : false,
																margin : '5 5 5 10',
																labelWidth : 100,
                                                                minValue: 0,
                                                                listeners: {
                                                                    'change': function(el, newValue, oldValue){
                                                                                    _this.panel.setLoading(true);
                                                                                    _this.containerSpreadSheet.updateNumberOfRows(newValue);
                                                                                    _this.panel.setLoading(false);
                                                                                }
														        }
                                                        }
                                            ]   
                                         }
                            ]
                },
                    this.containerSpreadSheet.getPanel()
                ]
    });
	return this.panel;
};

OtherContainerForm.prototype.getButtons = function () {
    var _this = this;
    return [ {
                text : 'Save',
                id : this.id + "-save-button",
                handler : function() {
                    _this.save();
                }
            }, {
                text : 'Cancel',
                handler : function() {
                    _this.onCancel.notify();
                }
            } ]
}

OtherContainerForm.prototype.getContainer = function () {
    this.container.code = Ext.getCmp(this.id + "container_code").getValue();
    this.container.containerType = "OTHER";
    this.container.capacity = this.container.samples.length;    
    return this.container;
}

OtherContainerForm.prototype.save = function() {
	var _this = this;
	this.panel.setLoading("Saving Puck");
    
	var puck = this.containerSpreadSheet.getPuck();

	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'container_name').getValue();
	puck.capacity = Ext.getCmp(_this.id + 'capacity').getValue();
	puck.containerType = "OTHER";
    puck.containerId = this.container.containerId;
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender){
		_this.panel.setLoading(false);
        _this.onSave.notify(puck);
	};
    
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.container.containerId, this.container.containerId, this.container.containerId, puck);
};

/**
* This is a grid for parcels
*
* @class ParcelGrid
* @constructor
*/
function ParcelGrid(args) {
	this.id = BUI.id();
	this.height = 100;
	this.width = 100;
	this.padding = 0;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.padding != null) {
			this.padding = args.padding;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	this.shipment = "";
	this.dewars = {};

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}

ParcelGrid.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	return (Ext.create('Ext.Action', {
		id : this.id + "-add-button",
		icon : '../images/icon/add.png',
		text : 'Add',
		disabled : true,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
};

ParcelGrid.prototype.load = function(shipment) {
	var _this = this;
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;


	this.panel.removeAll();

	this.dewars.sort(function(a, b) {
		return a.dewarId - b.dewarId;
	});

    function onSaved(sender, dewar) {
			_this.panel.setLoading();
			dewar["sessionId"] = dewar.firstExperimentId;
			dewar["shippingId"] = _this.shipment.shippingId;
			
			var onSuccess = function(sender, shipment) {				
				_this.panel.setLoading(false);
			};			
			EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
    }

	Ext.getCmp(this.id + "-label").setText("Content (" + this.dewars.length + " Parcels)");
	Ext.getCmp(this.id + "-add-button").enable();
	for ( var i in this.dewars) {
		var parcelPanel = new ParcelPanel({
			height : 90,
			width : this.width - 60,
			shippingId : this.shipment.shippingId,
			shippingStatus : this.shipment.shippingStatus,
			index : Number(i)+1
		});
		this.panel.insert(parcelPanel.getPanel());
		parcelPanel.load(this.dewars[i],this.shipment);
		parcelPanel.onSavedClick.attach(onSaved);
	}
};

ParcelGrid.prototype.edit = function(dewar) {
	var _this = this;
	var caseForm = new CaseForm();

	var window = Ext.create('Ext.window.Window', {
		title : 'Parcel',
		height : 450,
		width : 600,
		modal : true,
		layout : 'fit',
		items : [ caseForm.getPanel(dewar) ],
		listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null) {
					_this.render(_this.puck);
				}
			}
		},
		buttons : [ {
			text : 'Save',
			handler : function() {
				var adapter = new DataAdapter();
				_this.panel.setLoading();
				var dewar = caseForm.getDewar();
				var onSuccess = function(sender, shipment) {
					_this.load(shipment);
					_this.panel.setLoading(false);
					window.close();
				};
				dewar["sessionId"] = dewar.firstExperimentId;
				dewar["shippingId"] = _this.shipment.shippingId;
				EXI.getDataAdapter({
					onSuccess : onSuccess
				}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
			}
		}, {
			text : 'Cancel',
			handler : function() {
				window.close();
			}
		} ]
	});
	window.show();

};

ParcelGrid.prototype.getPanel = function() {
	var _this = this;
	
	this.panel = Ext.create('Ext.panel.Panel', {
		cls : 'border-grid',
		width : this.width,
		autoScroll:true,
        autoHeight :true,
        maxHeight: this.height,
		padding : this.padding
	});

	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		items : [
					{
						xtype : 'label',
						text : 'Content (0 Parcels)',
						id : this.id + "-label"
					},
					_this._getTopButtons()
				],
		cls : 'exi-top-bar'
	});

	return this.panel;
};

/**
* This class containes name, description, samples spreadsheet and puck loyout for a given puck 
*
* @class PuckForm
* @constructor
**/
function PuckFormView(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;
	this.unsavedChanges = false;
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

	
	var _this = this;
	
	this.containerSpreadSheet = new ContainerSpreadSheet({width : Ext.getBody().getWidth() - 100, height : 600});
	this.containerSpreadSheet.onModified.attach(function (sender, change) {
		_this.unsavedChanges = true;
	});

	this.capacityCombo = new ContainerTypeComboBox({label : "Type:", labelWidth : 100, width : 250, initDisabled : true});
	this.capacityCombo.onSelected.attach(function (sender, data) {
		var capacity = data.capacity;
		_this.unsavedChanges = true;
		_this.containerTypeChanged(capacity);
	});
	
	this.onRemoved = new Event(this);
	this.onSaved = new Event(this);
}

/** Loads a puck into the form **/
PuckFormView.prototype.load = function(containerId, shippingId, shippingStatus) {
	var _this = this;
    this.shippingId = shippingId;
    this.shippingStatus = shippingStatus;
    this.containerId = containerId;
    // this.containerSpreadSheet.setLoading(true);
	this.panel.setTitle("Shipment");

    var onSuccess = function(sender, puck){
        _this.puck = puck;
        if (puck != null){
            Ext.getCmp(_this.id + "puck_name").setValue(_this.puck.code);
			if (_this.puck.capacity){
            	_this.capacityCombo.setValue(_this.puck.capacity);
			} else {
				$.notify("ERROR: The capacity of the container is not defined.", "error");
			}
            Ext.getCmp(_this.id + "puck_beamline").setValue(_this.puck.beamlineLocation);
            Ext.getCmp(_this.id + "puck_sampleChangerLocation").setValue(_this.puck.sampleChangerLocation);
            Ext.getCmp(_this.id + "puck_status").setValue(_this.puck.containerStatus);                
        }

		_this.fillSamplesGrid(puck);

    };

    EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(this.containerId,this.containerId,this.containerId);

};

PuckFormView.prototype.fillSamplesGrid = function (puck) {
	var _this = this;
	this.containerSpreadSheet.setLoading(true);
	var onSuccess = function (sender, samples) {
		if (samples) {
			if (samples.length > 0) {
				_this.containerSpreadSheet.setRenderCrystalFormColumn(true);
			} else {
				_this.containerSpreadSheet.setRenderCrystalFormColumn(false);
			}
			_this.containerSpreadSheet.setContainerType(puck.containerType);
			_this.containerSpreadSheet.load(puck);
			if (_this.shippingStatus != "processing"){
				var withoutCollection = _.filter(samples,{DataCollectionGroup_dataCollectionGroupId : null});
				if (withoutCollection.length == samples.length) {
					Ext.getCmp(_this.id + "_save_button").enable();
					Ext.getCmp(_this.id + "_remove_button").enable();
					_this.capacityCombo.enable();
				}
			} else {
				_this.containerSpreadSheet.disableAll();
			}
			_this.containerSpreadSheet.setLoading(false);
			if (_this.containerSpreadSheet.renderCrystalFormColumn) {
				_this.setValuesForEditCrystalColumn();
			}
		}
	}

	EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(puck.containerId);
}

PuckFormView.prototype.getPanel = function() {
	var _this =this;

	this.panel = Ext.create('Ext.panel.Panel', {
		autoScroll 	: true,
		buttons : this.getToolBar(),
		items : [ 
		         {
							xtype : 'container',
							margin : '5 0 2 5',
							layout : 'hbox',
							items : [
										
										
								         {
								        	 xtype : 'container',
											margin : '12 0 2 0',
											layout : 'hbox',
											items : [ 
							         				   {
																xtype: 'requiredtextfield',
																id : this.id + 'puck_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '5 5 5 5',
																labelWidth : 100,
														},
														this.capacityCombo.getPanel(),
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_beamline',
																fieldLabel : 'Beamline',
																width : 250,
                                                                disabled : true,
																margin : '5 5 5 10',
																labelWidth : 100
														},
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_sampleChangerLocation',
																fieldLabel : '#Sample Changer',
																width : 300,
                                                                disabled : true,
																margin : '5 5 5 5',
																labelWidth : 150
														},                                                       
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_status',
																fieldLabel : 'Status',
																width : 250,
                                                                disabled : true,
																margin : '5 5 5 5',
																labelWidth : 100
														}
													]
								         },
                                         // this.puckLayout.getPanel()
							         ]
		         },
		         this.containerSpreadSheet.getPanel(),
                
	         ] 
		} 
	);
	return this.panel;
};

PuckFormView.prototype.getToolBar = function() {
	var _this = this;
	return [
			{
			    text: 'Remove',
				id: this.id + "_remove_button",
			    width : 100,
			    height : 30,
				disabled : true,
			    cls : 'btn-red',
			    handler : function(){
			    	function showResult(result){
						if (result == "yes"){
							_this.removePuck();							
						}
			    	}
					  Ext.MessageBox.show({
				           title:'Remove',
				           msg: 'Removing a puck from this parcel will remove also its content. <br />Are you sure you want to continue?',
				           buttons: Ext.MessageBox.YESNO,
				           fn: showResult,
				           animateTarget: 'mb4',
				           icon: Ext.MessageBox.QUESTION
				       });
			    }
			},
	        "->",
	        {
	            text: 'Save',
                id: this.id + "_save_button",
	            width : 100,
	            height : 30,
				disabled : true,
	            handler : function(){
	            	_this.save();
	            }
	        },
			{
	            text: 'Return to shipment',
	            width : 200,
	            height : 30,
	            handler : function () {
                    _this.returnToShipment();
                }
	        }
	];
};

PuckFormView.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        location.href = "#/shipping/" + _this.shippingId + "/main";
        // _this.onRemoved.notify(containerId);
	};
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(this.containerId,this.containerId,this.containerId );
	
};

PuckFormView.prototype.returnToShipment = function(){
    /**Check if the container's name has been changed */
	if (this.puck.code != Ext.getCmp(this.id + 'puck_name').getValue()) {
		this.unsavedChanges = true;
	}
	if (this.unsavedChanges) {
		this.showReturnWarning();
	} else {
		location.href = "#/shipping/" + this.shippingId + "/main";
	}
}

/**
* Saves the container
*
* @method save
* @param {Boolean} returnToShipment True if you want to return to shipment after the save
*/
PuckFormView.prototype.save = function(returnToShipment) {
	var _this = this;

	var puck = this.containerSpreadSheet.getPuck();
	/** Check if all samples have name */
	if (puck.sampleVOs && puck.sampleVOs.length > 0) {
		var sampleNames = _.map(puck.sampleVOs,"name");
		if(sampleNames.indexOf(null) >= 0 || sampleNames.indexOf("") >= 0) {
			$.notify("There are samples without a Sample Name", "error");
			return;
		}
	}
	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'puck_name').getValue();
	puck.capacity = _this.capacityCombo.getSelectedCapacity();
	puck.containerType = _this.capacityCombo.getSelectedType();
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender, puck){
		_this.unsavedChanges = false;
		_this.panel.setLoading(false);
		if (returnToShipment){
			location.href = "#/shipping/" + _this.shippingId + "/main";
		} else {
			_this.load(_this.containerId, _this.shippingId);
		}
	};
	this.panel.setLoading("Saving Puck");
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.containerId, this.containerId, this.containerId, puck);
};

/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * 
 * We make the spreadsheet longer and the platelayout is rendered again
 */
PuckFormView.prototype.containerTypeChanged = function(capacity) {
	var currentType = this.capacityCombo.getTypeByCapacity(this.puck.capacity);
	var newType = this.capacityCombo.getTypeByCapacity(capacity);
	this.puck.capacity = capacity;
	this.containerSpreadSheet.setContainerType(newType);
	this.containerSpreadSheet.updateNumberOfRows(capacity);
};

/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * Updates the values for the edit crystal column
 */
PuckFormView.prototype.setValuesForEditCrystalColumn = function(capacity) {
	var rows = this.containerSpreadSheet.parseTableData();
	var columnIndex = this.containerSpreadSheet.getColumnIndex("editCrystalForm");
	for (var i = 0; i < rows.length; i++) {
		this.containerSpreadSheet.addEditCrystalFormButton(rows[i].location-1,columnIndex);
	}
	this.panel.doLayout();
};

PuckFormView.prototype.showReturnWarning = function() {
	var _this = this;
	var window = Ext.create('Ext.window.Window', {
		title: 'Container',
		width: 250,
		layout: 'fit',
		modal : true,
		items: [
					{
						html : '<div class="container-fluid" style="margin:10px;"><div class="row"><span style="font-size:14px;color: #666;">Do you want to save the changes to the container ' + _this.puck.code + '?</span></div></div>',
					}
		],
		buttons : [ {
						text : 'Yes',
						handler : function() {
							window.close();
							_this.save(true);
						}
					},{
						text : 'No',
						handler : function() {
							window.close();
							location.href = "#/shipping/" + _this.shippingId + "/main";
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
	});
	window.show();
}		
function ShipmentEditForm(args) {
    this.id = BUI.id();

    this.width = 600;
    this.height = 200;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

	this.onSaved = new Event(this);
}

ShipmentEditForm.prototype.load = function(shipment) {

	this.shipment = shipment;
	var html = "";
	try{
		var fromData = EXI.proposalManager.getLabcontacts();
		var toData = $.extend(EXI.proposalManager.getLabcontacts(), [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);

		var beamlineName = "";
		var startDate = "";
		if (shipment){
			if (shipment.sessions.length > 0){
				beamlineName = shipment.sessions[0].beamlineName;
				startDate = (new Date(shipment.sessions[0].startDate)).toLocaleDateString();
			}
		}

		var sessionSort = function(o1,o2) {
			var d1 = new Date(o1.BLSession_startDate);
			var d2 = new Date(o2.BLSession_startDate);
			if (d1 === d2) {
				return 0;
			} else {
				return (d1 < d2) ? 1 : -1;
			}
		}
		var sessions = EXI.proposalManager.getSessions();
		sessions.sort(sessionSort);
		var sessionsSelectData = [];
		var currentDay = new Date((new Date()).toDateString());
		for (var i = 0 ; i < sessions.length ; i++){
			var session = sessions[i];
			var sessionStartDate = (new Date(session.BLSession_startDate));
			if (currentDay <= (new Date(sessionStartDate.toDateString())) ){
				var dd = sessionStartDate.getDate();
				var mm = sessionStartDate.getMonth()+1; //January is 0!
				var yyyy = sessionStartDate.getFullYear();
				if(dd<10){
					dd='0'+dd;
				} 
				if(mm<10){
					mm='0'+mm;
				} 
				var formattedDate = dd+'/'+mm+'/'+yyyy;
				sessionsSelectData.push({sessionId : session.sessionId, date : sessionStartDate.toLocaleDateString(), formattedDate : formattedDate, beamLineName : session.beamLineName});
			}
		}
		
		
		dust.render("shipping.edit.form.template", {id : this.id, sessions : sessionsSelectData, to : toData, from : fromData, beamlineName : beamlineName, startDate : startDate, shipment : shipment}, function(err, out){
			html = out;
		});
	} catch (e) {
		html = "There was an error loading the lab contacts.";
	}
	
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

ShipmentEditForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					width : this.width
				}]
	});

	return this.panel;
};

ShipmentEditForm.prototype.saveShipment = function() {
	var _this = this;

	var sendingAddressId = $("#" + this.id + "-to").val();
	var returnAddressId = $("#" + this.id + "-from").val();

	var shippingId = null;
	if (this.shipment) {
		shippingId = this.shipment.shippingId;
	}
	
	if (sendingAddressId == null) {
		BUI.showError("User contact information for shipping to beamline is mandatory");
		return;
	}

	/** No return requested **/
	if (returnAddressId == "No return requested"){
		returnAddressId = 0;
	}
	
	/** Same sender **/
	if (returnAddressId == "Same as for shipping to beamline"){
		returnAddressId = -1;
	}
	
	var sendingAddress = (EXI.proposalManager.getLabcontactById(sendingAddressId));
	var json = {
		shippingId : shippingId,
		name : $("#" + this.id + "-name").val(),
		status : "Not set",
		sendingLabContactId : sendingAddressId,
		returnLabContactId : returnAddressId, 
		returnCourier : returnAddressId,
		courierAccount : sendingAddress.courierAccount,
		billingReference : sendingAddress.billingReference,
		dewarAvgCustomsValue : sendingAddress.dewarAvgCustomsValue,
		dewarAvgTransportValue :sendingAddress.dewarAvgTransportValue,
		comments : $("#" + this.id + "-comments").val(),
		sessionId : $("#" + this.id + "-date").val()
	};

	var onSuccess = function(sender, shipment) {
		_this.panel.setLoading(false);
		_this.onSaved.notify(shipment);
	};

	/** Cheking params **/
	if (json.name == "") {
		BUI.showError("Name field is mandatory");
		return;
	}

	if (json.sendingLabContactId == null) {
		BUI.showError("Lab contact for sending field is mandatory");
		return;
	}

	this.panel.setLoading();
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.saveShipment(json);
}
/**
 * Same form as MX part
 * 
 * @creationMode if true a create button appears instead of save
 * @showTitle true or false
 */
function ShipmentForm(args) {
	this.id = BUI.id();
	this.width = 600;
	this.padding = 10;

	if (args != null) {
		if (args.creationMode != null) {
			this.creationMode = args.creationMode;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onSaved = new Event(this);
}

ShipmentForm.prototype.load = function(shipment) {
	this.shipment = shipment;
	var _this = this;
	
	var toData = EXI.proposalManager.getLabcontacts();
	var fromData = $.extend(EXI.proposalManager.getLabcontacts(), [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);

    var html = "";
	var beamlineName = "";
	var startDate = "";
	if (shipment){
		if (shipment.sessions.length > 0){
			beamlineName = shipment.sessions[0].beamlineName;
			startDate = moment(shipment.sessions[0].startDate).format("DD/MM/YYYY");
		}
	}
	
    dust.render("shipping.form.template", {id : this.id, to : toData, from : fromData, beamlineName : beamlineName, startDate : startDate, shipment : shipment}, function(err, out){
		html = out;
	});
	
    $('#' + _this.id).hide().html(html).fadeIn('fast');
	if (shipment == null || shipment.shippingStatus != "processing"){
		$("#" + _this.id + "-edit-button").prop('disabled',false);
		$("#" + _this.id + "-edit-button").unbind('click').click(function(sender){
			_this.edit();
		});
	}

	this.panel.doLayout();

};

ShipmentForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					cls	: 'border-grid',
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
};

ShipmentForm.prototype.edit = function(dewar) {
	var _this = this;
	var shippingEditForm = new ShipmentEditForm();
	
	shippingEditForm.onSaved.attach(function (sender, shipment) {
		if (_this.shipment) {
			_this.load(shipment);
		} else {
			_this.onSaved.notify(shipment);
		}
		window.close();
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Shipment',
		height : 450,
		width : 600,
		modal : true,
		layout : 'fit',
		items : [ shippingEditForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					shippingEditForm.saveShipment();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					window.close();
				}
			} ]
	}).show();

	shippingEditForm.load(this.shipment);
};

/**
* This main class deals with the creation and edition of shipments
*
* @class ShippingMainViewTest
* @constructor
*/
function ShippingMainView() {
	MainView.call(this);
	var _this = this;

    /**
	* 
	* @property shipmentForm
	*/
    this.shipmentForm = new ShipmentForm({width : Ext.getBody().getWidth() - 200});
	this.shipmentForm.onSaved.attach(function(sender, shipment){
		// location.hash = "#/proposal/shipping/nav?nomain";
		location.hash = "#/shipping/" + shipment.shippingId + "/main";
	});

    /**
	* 
	* @property parcelGrid
	*/
	this.parcelGrid = new ParcelGrid({height : 580, width : Ext.getBody().getWidth() - 200});
	
}

ShippingMainView.prototype.getPanel = function() {
	
    this.panel =  Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center'
        },
		autoScroll : true,
        cls : 'border-grid',
        items : [
                    this.shipmentForm.getPanel(),
                    this.parcelGrid.getPanel()
        ]
	});

    return this.panel;
};


ShippingMainView.prototype.load = function(shippingId) {
	var _this = this;
	this.shippingId = shippingId;
	
	this.panel.setTitle("Shipment");
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipmentForm.load(shipment);
			_this.parcelGrid.load(shipment);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
    }	
    else{
        
        _this.shipmentForm.load();	
		_this.panel.setLoading(false);
    }
};
function WelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';
	MainView.call(this);
	this.title = "Welcome";
	this.closable = true;		
}

WelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;


WelcomeMainView.prototype.getContainer = function() {
	return {
		  layout: {
		        type: 'fit'
		    },
		items : [
		         	{
		         		html : "<iframe style='width:900px;height:900px;' frameBorder='0' src='../html/welcome.html'></iframe>",
		         		margin : '50 0 0 50'
		         	}
		]
	};
};


WelcomeMainView.prototype.load = function() {
	
};

function AddressEditForm (args) {
    this.id = BUI.id();
    this.height = 450;
	this.width = 740;
    this.padding = 10


	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

    this.onSaved = new Event(this);
}

AddressEditForm.prototype.load = function(address) {
    this.address = {};
    if (address) {
        this.address = address;
    }
    this.address.id = this.id;

	var html = "";
	dust.render("address.edit.form.template", this.address, function(err, out){
		html = out;
	});
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

AddressEditForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					// cls	: 'border-grid',
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
};

AddressEditForm.prototype.save = function() {
    var _this = this;
	var address = this.getAddress();
    var onSuccess = function (sender,addressSaved) {
        _this.onSaved.notify(address);
    }
    
    EXI.getDataAdapter({onSuccess : onSuccess}).proposal.labcontacts.saveLabContact(address);
};

AddressEditForm.prototype.getAddress = function () {
    var address = {};
    address = this.address;
    if (!address.labContactId){
        address.labContactId = null;
    }
    if (!address.personVO) {
        address.personVO = {};
        address.personVO.personId = null;
    }
    address.personVO.emailAddress = $("#" + this.id + "-emailAddress").val();
    address.personVO.familyName = $("#" + this.id + "-familyName").val();
    address.personVO.givenName = $("#" + this.id + "-givenName").val();
    address.personVO.phoneNumber = $("#" + this.id + "-phoneNumber").val();
    address.personVO.faxNumber = $("#" + this.id + "-faxNumber").val();
    address.cardName = $("#" + this.id + "-cardName").val();
    address.courierAccount = $("#" + this.id + "-courierAccount").val();
    address.defaultCourrierCompany = $("#" + this.id + "-defaultCourrierCompany").val();
    address.dewarAvgCustomsValue = $("#" + this.id + "-dewarAvgCustomsValue").val();
    address.dewarAvgTransportValue = $("#" + this.id + "-dewarAvgTransportValue").val();
    address.billingReference = $("#" + this.id + "-billingReference").val();
    address.labName = $("#" + this.id + "-labName").val();
    address.labAddress = $("#" + this.id + "-labAddress").val();
    
    return address;
}
/**
 * Edit the information of a buffer
 * 
 * #onRemoveAdditive
 */
function AddressForm(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;


	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
}

AddressForm.prototype.getAddress = function() {
	if (this.address == null) {
		this.address = {};
	}
	this.address["billingReference"] = Ext.getCmp(this.id + "billingReference").getValue();
	this.address["cardName"] = Ext.getCmp(this.id + "cardName").getValue();
	this.address["courierAccount"] = Ext.getCmp(this.id + "courierAccount").getValue();
	this.address["defaultCourrierCompany"] = Ext.getCmp(this.id + "courrierCompany").getValue();
	this.address["dewarAvgCustomsValue"] = Ext.getCmp(this.id + "dewarAvgCustomsValue").getValue();
	this.address["dewarAvgTransportValue"] = Ext.getCmp(this.id + "dewarAvgTransportValue").getValue();

	if (this.address.personVO == null) {
		this.address.personVO = {};
	}
	else{
		
	}

	this.address.personVO["emailAddress"] = Ext.getCmp(this.id + "emailAddress").getValue();
	this.address.personVO["familyName"] = Ext.getCmp(this.id + "familyName").getValue();
	this.address.personVO["givenName"] = Ext.getCmp(this.id + "name").getValue();
	this.address.personVO["faxNumber"] = Ext.getCmp(this.id + "faxNumber").getValue();
	this.address.personVO["phoneNumber"] = Ext.getCmp(this.id + "phoneNumber").getValue();
	return this.address;
};

AddressForm.prototype.load = function(address) {
	this.address = address;

	var html = "";
	dust.render("address.form.template", address, function(err, out){
		html = out;
	});
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

AddressForm.prototype.getPanel = function() {
	var _this = this;

	this.panel = Ext.create("Ext.panel.Panel",{
		cls : "border-grid",
		title : 'Shipping Address Card',
		buttons : this.getToolBar(),
		icon : '../images/icon/ic_email_black_24dp.png',
		items :	[{
					// cls	: 'border-grid',
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
};

// AddressForm.prototype.save = function() {
// 	var _this = this;

// 	_this.panel.setLoading();
// 	var onSuccess = function(sender) {
// 		_this.panel.setLoading(false);
// 		EXI.getDataAdapter().proposal.proposal.update();
// 	};
// 	EXI.getDataAdapter({onSuccess : onSuccess }).proposal.labcontacts.saveLabContact(_this.getAddress());
// };

AddressForm.prototype.getToolBar = function() {
	var _this = this;
	return [ {
		text : 'Edit',
		hidden : _this.isSaveButtonHidden,
		width : 100,
		handler : function() {
			_this.edit();

		} } ];
};

AddressForm.prototype.edit = function(dewar) {
	var _this = this;
	var addressEditForm = new AddressEditForm();
	
	addressEditForm.onSaved.attach(function (sender, address) {
		window.close();
		_this.load(address);
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Shipping Address Card',
		height: 550,
		width: 750,
		modal : true,
		layout : 'fit',
		items : [ addressEditForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					addressEditForm.save();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					window.close();
				}
			} ]
	}).show();

	addressEditForm.load(this.address);
};

function AuthenticationForm(){
    this.singleSite =false;
    this.siteURL = null;
    this.icon = null;
	this.onAuthenticate = new Event(this);
}
AuthenticationForm.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'Login',
	    height: 250,
	    closable :  false,
	    width: 450,
	    modal : true,
	    layout: 'fit',
	    items: [
	            this.getPanel()
        ]}
	);
	this.window.show();
};


AuthenticationForm.prototype.getAuthenticationForm = function(){         
     if (ExtISPyB.sites){
        if (ExtISPyB.sites.length > 1){
             var sites = Ext.create('Ext.data.Store', {
                fields: ['name', 'url', 'exiUrl'],
                data : ExtISPyB.sites
            });
            
            return    {
                        xtype: 'container',
                        layout: 'vbox',
                        items: [
                        {
                            xtype: 'textfield',
                            fieldLabel: 'User',
                            name: 'user',
                            margin : '10 0 0 10',
                            allowBlank: false
                        }, 
                        {
                            xtype: 'textfield',
                            fieldLabel: 'Password',
                            margin : '10 0 0 10',
                            name: 'password',
                            allowBlank: false,
                            inputType : 'password'
                        },{
                            xtype : 'combo',
                            fieldLabel: 'Choose site',
                            name: 'site',
                            store : sites,
                            allowBlank: false,
                            valueField : 'url',
                            displayField : 'name',
                            margin : '10 0 0 10'
	                    }    
                        ]
                    }
        }
     }
    
    
     
    return    {
                xtype: 'container',
                layout: 'vbox',
                items: [
                {
                    xtype: 'textfield',
                    fieldLabel: 'User',
                    name: 'user',
                    margin : '30 0 0 10',
                    allowBlank: false
                }, 
                {
                    xtype: 'textfield',
                    fieldLabel: 'Password',
                    margin : '10 0 0 10',
                    name: 'password',
                    allowBlank: false,
                    inputType : 'password'
                }    
                ]
  };                  
     
};


AuthenticationForm.prototype.getIconForm = function(){    
        if (this.singleSite)
                    return {
                            xtype   : 'image',
                            src     : this.site.icon,
                            width   : 75,
                            height  : 75,
                            margin  : '30 0 0 10'
                            
                        };
};


AuthenticationForm.prototype.getPanel = function(){
	var _this = this;
   

    if (ExtISPyB.sites){
        if (ExtISPyB.sites.length == 1){                                         
            /** Only a single site so we can show the icon */
            this.singleSite = true;
            this.siteURL = ExtISPyB.sites[0].url;  
            this.site = ExtISPyB.sites[0];
            this.icon = ExtISPyB.sites[0].icon;                                                            
        }
    }
    
	return Ext.create('Ext.form.Panel', {
	    bodyPadding: 5,
	    width: 370,
	    layout: 'vbox',       
	    defaults: {
	        anchor: '90%'
	    },
	    // The fields
	    defaultType: 'textfield',
	    items: [
                        {
                            xtype: 'container',
                            layout: 'hbox',
                            items: [
                                    this.getIconForm(),              
                                    this.getAuthenticationForm()]
                        }                                           
        ],
	    buttons: [ {
	        text: 'Login',
	        formBind: true,
	        disabled: true,
	        handler: function() {
	        	var form = this.up('form').getForm();	        	
	        	var exiUrl;
	        	var properties = null;
                
                 if (!_this.singleSite){
                    _this.siteURL = form.getFieldValues().site;
                }
                
	        	for (var i =0; i< ExtISPyB.sites.length; i++){
	        		if (ExtISPyB.sites[i].url == _this.siteURL){
	        			properties = ExtISPyB.sites[i];
	        		}	        		
	        	}
               
                
	        	_this.onAuthenticate.notify({
	        		user : form.getFieldValues().user, 
	        		password : form.getFieldValues().password, 
	        		site : _this.siteURL,
	        		exiUrl : properties.exiUrl,
	        		properties : properties
	        	});

	        }
	    }]
	});
};





/**
* Renders a panel that contains a puck widget and two buttons
*
* @class ContainerParcelPanel
* @constructor
*/
function ContainerParcelPanel(args) {
    this.id = BUI.id();
    this.height = 220;
    this.containerId = 0;
    this.shippingId = 0;
    this.shippingStatus = "";
    this.withoutCollection = true;
    this.type = "Puck";
    this.data = {puckType : "Unipuck", 
                mainRadius : this.height*0.75*0.9/2,
                xMargin : this.width/2 - this.height*0.9/2, 
                yMargin : 2.5,
                code : "",
                enableMouseOver : true,
                enableClick : true,
                enableMainClick : true,
                enableMainMouseOver : true,
                containerId : 0
    };
    this.width = 2*this.data.mainRadius + 20;
    this.container = new ContainerWidget(this.data);

	if (args != null) {
        if (args.height != null) {
			this.height = args.height;
            this.data.mainRadius = this.height*0.75*0.9/2;
            this.width = 2*this.data.mainRadius + 20;
            this.data.xMargin = this.width/2 - this.data.mainRadius;
		}
        if (args.width != null) {
			this.width = args.width;
            this.data.xMargin = this.width/2 - this.data.mainRadius;
		}
        if (args.containerId != null) {
			this.containerId = args.containerId;
            this.data.containerId = this.containerId;
		}
        if (args.shippingId != null) {
			this.shippingId = args.shippingId;
		}
        if (args.shippingStatus != null) {
			this.shippingStatus = args.shippingStatus;
		}
        if (args.code != null) {
            this.data.code = args.code;
		}
        if (args.type != null) {
            if ((["Puck","StockSolution","OTHER","PLATE"]).indexOf(args.type) >= 0){
			    this.type = args.type;
            } else {
                this.type = "Puck";
            }
		}
        if (args.capacity != null) {
			if (args.capacity != 16) {
                this.data.puckType = "Spinepuck";
            }
		}
	}
    
    this.onContainerRemoved = new Event(this);
	
};

/**
* Returns the panel containing the container and the buttons
*
* @class load
* @return The panel containing the container and the buttons
*/
ContainerParcelPanel.prototype.getPanel = function () {
    var _this = this;
    this.container = new ContainerWidget(this.data);
    if (this.type == "Puck"){
        this.container = new PuckWidgetContainer(this.data);
    } else if (this.type == "StockSolution") {
        this.data.stockSolutionId = this.containerId;
        this.container= new StockSolutionContainer(this.data);
    }

    this.container.onClick.attach(function (sender, id) {
        var code = _this.data.code;
        if (code == "") {
            code = "-";
        }
        
        var window = Ext.create('Ext.window.Window', {
            title: 'Container',
            width: 250,
            layout: 'fit',
            modal : true,
            items: [
                        {
                            html : '<div class="container-fluid" style="margin:10px;"><div class="row"><span style="font-size:14px;color: #666;"><b>Code:</b> ' + code + '</span></div><div class="row"><span style="font-size:12px;color: #666;">Select one of the options below:</span></div></div>',
                        }
            ],
            buttons : [ {
                            text : 'Edit',
                            handler : function() {
                                if (_this.type == "StockSolution") {
                                    location.href = "#/stocksolution/" + _this.containerId + "/main";                            
                                } else if (_this.type == "OTHER") {
                                    _this.openEditOtherContainerForm();
                                } else {
                                    location.href = "#/shipping/" + _this.shippingId + "/" + _this.shippingStatus + "/containerId/" + _this.containerId + "/edit";                            
                                }
                                 window.close();
                            }
                        },{
                            text : 'Remove',
                            disabled : _this.shippingStatus == "processing",
                            handler : function() {
                                _this.removeButtonClicked();
                                 window.close();
                            }
                        }, {
                            text : 'Cancel',
                            handler : function() {
                                window.close();
                            }
                        } ]
        });
        window.show();
    });

    this.container.onMouseOver.attach(function(sender, container){
        container.focus(true);
    });

    this.container.onMouseOut.attach(function(sender, container){
        container.focus(false);
    });

    var containerPanelHeight = 2*this.data.mainRadius + 5;
    
    this.containerPanel = Ext.create('Ext.panel.Panel', {
        // cls : 'border-grid',
        width : this.width,
        height : containerPanelHeight,
        items : [this.container.getPanel()]
	});

    this.panel = Ext.create('Ext.panel.Panel', {
        // cls : 'border-grid',
        layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
        },
        width : this.width,
        height : this.height,
        items : [
                this.containerPanel
                ]
	});
    
    if (this.height >= 45) {
        this.panel.insert({
                    html : "<div class='container-fluid' align='center'><span id='" + this.id + "-name' style='font-size:" + this.height*0.15 + "px;'>" + this.data.code + "</span></div>",
                    height : this.height*0.25,
                    width : this.width
                });
    }

    return this.panel;
};

/**
* Loads the container with the given samples
*
* @class load
* @return
*/
ContainerParcelPanel.prototype.load = function (samples) {
    this.containerPanel.removeAll();
    this.containerPanel.add(this.container.getPanel());
    if (samples.length > 0){
        this.container.loadSamples(samples);
        if (!this.container.containerId) {
            this.container.containerId = this.containerId;
        }
        // this.shippingId = samples[0].Shipping_shippingId;
    }
    var withoutCollection = _.filter(samples,{DataCollectionGroup_dataCollectionGroupId : null});
    if (withoutCollection.length < samples.length) {
        this.withoutCollection = false;
    }
};

/**
* Removes the puck from the database
*
* @class removePuck
* @return 
*/
ContainerParcelPanel.prototype.removePuck = function() {
    this.panel.setLoading();
    if (this.type == "StockSolution") {
        this.onContainerRemoved.notify(this.containerId);
    } else {
        var _this = this;
        var onSuccess = function(sender, data){
            _this.panel.setLoading(false);
            _this.onContainerRemoved.notify(_this.containerId);
        };
        var containerId = this.containerId;
        EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(containerId,containerId,containerId );
    }
};

ContainerParcelPanel.prototype.removeButtonClicked = function () {
    var _this = this;
    function showResult(result){
        if (result == "yes"){
            _this.removePuck();							
        }
    }
    Ext.MessageBox.show({
        title:'Remove',
        msg: 'Removing a container from this parcel will remove also its content. <br />Are you sure you want to continue?',
        buttons: Ext.MessageBox.YESNO,
        fn: showResult,
        animateTarget: 'mb4',
        icon: Ext.MessageBox.QUESTION
    });
};

ContainerParcelPanel.prototype.openEditOtherContainerForm = function () {
    var _this = this;
	/** Opens a window with the cas form **/
	var otherContainerForm = new OtherContainerForm();
	otherContainerForm.onSave.attach(function(sender,container){
        $("#" + _this.id + "-name").html(container.code);
        _this.container.samples = container.sampleVOs;
        _this.container.capacity = container.capacity;
        window.close();
	})
    
	otherContainerForm.onCancel.attach(function(sender){
		window.close();
	})
    
	var window = Ext.create('Ext.window.Window', {
	    title: 'Container',
	    height: 600,
	    width: 1500,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	otherContainerForm.getPanel()
	    ],
        listeners : {
			afterrender : function(component, eOpts) {
				otherContainerForm.load(_this.container);
			}
	    },
	});
	window.show();
}
function ContainerTypeComboBox(args) {
    this.id = BUI.id();

    this.label = "Choose Container Type:";
    this.labelWidth = 200;
    this.width = 500;
    this.initDisabled = false;

    this.data = [
                    {"type":"UNIPUCK", "capacity":16},
                    {"type":"SPINE", "capacity":10},
                    {"type":"PLATE", "capacity":96}
                ]

    if (args) {
        if (args.label) {
            this.label = args.label;
        }
        if (args.labelWidth) {
            this.labelWidth = args.labelWidth;
        }
        if (args.width) {
            this.width = args.width;
        }
        if (args.extraOptions != null) {
            this.data = _.union(this.data, args.extraOptions);
        }
        if (args.initDisabled != null){
            this.initDisabled = args.initDisabled;
        }
    }
    this.onSelected = new Event(this);
}

ContainerTypeComboBox.prototype.getPanel = function () {
    var _this = this;

    var types = Ext.create('Ext.data.Store', {
        fields: ['type','capacity'],
        data : this.data
    });

    this.panel = Ext.create('Ext.form.ComboBox', {
        layout:'fit',
        margin : '5 0 5 5',
        fieldLabel: this.label,
        store: types,
        labelStyle: 'padding:5px',
        labelWidth : this.labelWidth,
        displayField: 'type',
        value:'UNIPUCK',
        width: this.width,
        disabled : this.initDisabled
    });

    this.panel.on('select', function(capacityCombo, record){
		_this.onSelected.notify(record[0].data);
	});

	return this.panel;
};

ContainerTypeComboBox.prototype.getValue = function () {
    return this.panel.getValue();
};


ContainerTypeComboBox.prototype.getSelectedType = function () {
    var type = this.panel.getValue();
    if (type == "UNIPUCK" || type == "SPINE") {
        type = "Puck";
    }
	return type;
};

ContainerTypeComboBox.prototype.getSelectedCapacity = function () {
	return _.filter(this.data,{"type" : this.getValue()})[0]["capacity"];
};

ContainerTypeComboBox.prototype.getTypeByCapacity = function (capacity) {
    return _.filter(this.data,{"capacity" : capacity})[0]["type"];
};

ContainerTypeComboBox.prototype.setValue = function (capacity) {
    var type = this.getTypeByCapacity(capacity);
    this.panel.setValue(type);
};

ContainerTypeComboBox.prototype.enable = function () {
    this.panel.enable();
}
function ContainerWidget(args) {
    this.id = BUI.id();
	
    this.templateData = {
                            id          	: this.id,
                            xmargin     	: 0,
                            ymargin     	: 0,
                            mainRadius  	: 50,
                            width       	: 100,
                            height      	: 100,
                            r           	: 20,
							enableMainClick : false,
							enableMainMouseOver : false,
                        };
	this.containerId = 0;
    this.samples = null;
	this.code = "";

	if (args){
		if (args.code){
			this.code = args.code;
		}
		if (args.containerId){
			this.containerId = args.containerId;
		}
		if (args.xMargin){
			this.templateData.xMargin = args.xMargin;
		}
		if (args.yMargin){
			this.templateData.yMargin = args.yMargin;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
		if (args.enableMainMouseOver != null){
			this.templateData.enableMainMouseOver = args.enableMainMouseOver;
		}
        if (args.mainRadius){
			this.templateData.mainRadius = args.mainRadius;
			this.templateData.width = 2*args.mainRadius;
			this.templateData.height = 2*args.mainRadius;
			this.templateData.r = args.mainRadius/5;
		}
	}

	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

ContainerWidget.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
            id: this.id + "-container",
		    x: this.templateData.xMargin,
		    y: this.templateData.yMargin,
		    width : this.templateData.width + 1,
		    height : this.templateData.height + 1,
		//    cls:'border-grid',
		    frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						{
							html : this.getSVG(),
							width : this.templateData.width + 1,
							height : this.templateData.height + 1
						}
			],
			
	});

	this.panel.on('boxready', function() {
        if(_this.templateData.enableMainClick) {
			$("#" + _this.id).unbind('click').click(function(sender){
				_this.onClick.notify(sender.target.id);
			});
		}
		if(_this.templateData.enableMainMouseOver) {
			$("#" + _this.id).unbind('mouseover').mouseover(function(sender){
				_this.onMouseOver.notify(_this);
			});
			
			$("#" + _this.id).unbind('mouseout').mouseout(function(sender){
				_this.onMouseOut.notify(_this);
			});
		}
    });
	
	return this.panel;
	
};

ContainerWidget.prototype.loadSamples = function (samples) {
    this.samples = samples;
    if (samples){
		if (samples.length > 0){
			this.containerId = samples[0].Container_containerId; 
		}
	}
};

ContainerWidget.prototype.getSVG = function (samples) {
	var html = "";
	dust.render("container.widget.template", this.templateData, function(err, out){
		html = out;
	});
	
	return html;
};

ContainerWidget.prototype.focus = function (bool) {
	if (bool){
		$("#" + this.id).addClass("puck-selected");		
	} else {
		$("#" + this.id).removeClass("puck-selected");	
	}
};
function CurvePlotter(args) {
    this.id = BUI.id();

    this.backgroundColor = "#FFFFFF";

    this.margin = '0 0 0 5';
    this.ruleColor = "black";
    this.targetId = "plotCanvas" + BUI.id();
    this.legend = 'onmouseover';

    if (args != null) {
        if (args.margin != null) {
            this.margin = args.margin;
        }
        if (args.legend != null) {
            this.legend = args.legend;
        }
        if (args.targetId != null) {
            this.targetId = args.targetId;
        }
    }

    this.onRendered = new Event(this);
    this.onPointClickCallback = new Event();

}

CurvePlotter.prototype.getPanel = function() {
    this.plotPanel = Ext.create('Ext.container.Container', {
        layout: {
            type: 'hbox'
        },
        flex: 0.7,
        margin: this.margin,
        items: [{
            html: '<div id="' + this.targetId + '"></div>',
            id: this.id,
        }]
    });

    this.plotPanel.on("afterrender", function() {
    });

    this.plotPanel.on("resize", function() {
    });
    return this.plotPanel;
};

CurvePlotter.prototype.getPointCount = function() {
    return this.dygraph.rawData_.length;
};

CurvePlotter.prototype.getColors = function() {
    return this.dygraph.getColors();
};

CurvePlotter.prototype.getLabels = function() {
    return this.dygraph.getLabels();
};

CurvePlotter.prototype.render = function(url) {
    var _this = this;
    if (document.getElementById(this.targetId) != null) {
        document.getElementById(this.targetId).innerHTML = "";

        this.width = this.plotPanel.getWidth();
        this.height = this.plotPanel.getHeight();

        document.getElementById(this.targetId).setAttribute("style", "border: 1px solid #000000; height:" + (this.plotPanel.getHeight() - 1) + "px;width:" + (this.plotPanel.getWidth() - 2) + "px;");

        Ext.getCmp(this.id).setHeight(this.plotPanel.getHeight());
        Ext.getCmp(this.id).setWidth(this.plotPanel.getWidth());


        this.dygraph = new Dygraph(
            document.getElementById(this.targetId),
            url,
            {
                title: this.title,
                titleHeight: 20,

                legend: this.legend,
                labelsSeparateLines: true,
                errorBars: true,
                connectSeparatedPoints: true,
                pointClickCallback: function(e, p) {
                    _this.onPointClickCallback.notify(p.name);
                }
            }

        );
      
        this.dygraph.ready(function() {
            _this.onRendered.notify();
        });
    }
};

CurvePlotter.prototype.loadMerge = function(subtractionIdList, from, to, scale) {
    this.render(EXI.getDataAdapter().saxs.hplc.getFramesMergeURL(subtractionIdList, from, to, scale));
};

CurvePlotter.prototype.loadHPLCFrame = function(experimentId, frameNumber) {
    this.render(EXI.getDataAdapter().saxs.hplc.getHPLCFramesScatteringURL(experimentId, frameNumber));
};

CurvePlotter.prototype.loadUrl = function(url) {
    this.render(url);
};


CurvePlotter.prototype.load = function(selections) {
    this.render(EXI.getDataAdapter().saxs.frame.getFramesURL(selections.frame, selections.average, selections.subtracted, selections.sampleaverage, selections.bufferaverage));
};


function AutoProcIntegrationCurvePlotter(args) {
    CurvePlotter.call(this, args);

    this.margin = '10 0 0 0';
    this.height = null;
    this.title = "";
    if (args != null) {
        if (args.height != null) {
            this.height = args.height;
        }
        if (args.title != null) {
            this.title = args.title;
        }
    }

    this.data = {
        labels: [], // labels = [{name: 'axisX', x: true, y, false},{name: 'axisXY', x: false, y, true}] 
        data: []
    };

    this.xLabels = [];
}


AutoProcIntegrationCurvePlotter.prototype.getPointCount = CurvePlotter.prototype.getPointCount;
AutoProcIntegrationCurvePlotter.prototype.getLabels = CurvePlotter.prototype.getLabels;


AutoProcIntegrationCurvePlotter.prototype.toCSV = function(labels, data) {
    var csv = labels.toString() + "\n";
    for (var i = 0; i< data.length; i++){
        for (var j = 0; j< data[i].length; j++){
            csv = csv +  data[i][j] + "," ;
        }
        /** Removing last , */
        csv = csv.substring(0, csv.length - 1);
        csv = csv + "\n";
        
    }
    return csv;
};
/**
* Render the dygraph widget on a container that should exists with id = this.id
*
* 
* @method render
*/
AutoProcIntegrationCurvePlotter.prototype.render = function(labels, data) {
    var _this = this;

   
   
    /** Plotting */
    var g = new Dygraph(
        document.getElementById(this.targetId),
        this.toCSV(labels, data),
        {
            title: this.title,
            titleHeight: 20,
            legend : 'always',
            height: this.height - 100,
            hideOverlayOnMouseOut :true,
            labelsSeparateLines: true,
            labelsDiv :_this.targetId + "_legend",
            labelsDivStyles : " { 'fontSize': 6 } ",
            axisLabelWidth : 20,
           
            connectSeparatedPoints: true,
            pointClickCallback: function(e, p) {
                _this.onPointClickCallback.notify(p.name);
            },
            axes: {
                x: {
                     pixelsPerXLabel : 30,
                    axisLabelFormatter: function(d, gran, opts) {
                        return _this.xLabels[d];                        
                    }
                }
            }
        }

    );

    g.ready(function() {
        //g.setAnnotations(_this.getAnnotations(data, labels));
    });

};

/**
 * Example csv
Resolution,11259175,11259180,11259326
2.4,143.9,0,143.9,0,,0
2.57,99.2,0,99.2,0,,0
2.77,62.7,0,62.7,0,,0
3.04,41.4,0,41.4,0,,0
3.39,24.0,0,24.0,0,,0
3.74,,0,,0,56.0,0
3.87,,0,,0,55.0,0
3.91,18.2,0,18.2,0,,0
4.03,,0,,0,53.0,0
4.21,,0,,0,53.6,0
4.43,,0,,0,54.6,0
4.71,,0,,0,53.9,0
4.78,19.1,0,19.1,0,,0
5.07,,0,,0,49.2,0
5.59,,0,,0,52.2,0
6.39,,0,,0,45.5,0
6.73,16.4,0,16.4,0,,0
8.05,,0,,0,38.1,0
 */
AutoProcIntegrationCurvePlotter.prototype.loadUrl = function(url) {

    var _this = this;
    $.ajax({
        url: url,
        context: this

    }).done(function(csv) {
        var index = 0;
        var _this = this;
        _this.xLabels = [];
        if (csv) {
            var lines = csv.split("\n");
            var labelsHeader = [];

            if (lines) {
                if (lines[0]) {
                    this.data.labels = lines[0].split(",");

                }
                else {
                    /** No Lines */
                    EXI.setError("No labels on csv");
                    return;
                }

                var toNumber = function toNumber(el) {
                        if (el) {
                            if (el != "") {
                                return parseFloat(el);
                            }
                            else {
                                return "";
                            }
                        }
                        else {
                            return "";
                        }
                };
                    
                var convertToNumber = function (element) {
                    var noError = [];
                    var elements = element.split(',');                                       
                    elements = _.map(elements, toNumber);                 
                    noError.push(index);
                    _this.xLabels.push(elements[0]);

                    for (var i = 1; i < elements.length; i++) {
                        if (i % 2 != 0) {
                            noError.push(elements[i]);
                        }
                    }
                    index = index + 1;
                    return noError;
                };
                lines = lines.reverse();
                /** Parsing data it means remove labels, split by , and convert to number */
                this.data.data = _.map(_.slice(lines, 1, lines.length - 1), convertToNumber);


                try {

                    this.render(this.data.labels, this.data.data);
                }
                catch (e) {
                    EXI.setError(e.message);
                }
            }
        }
        else {
            /** No Lines */
            EXI.setError("CSV is empty");
            return;
        }
    });

};

AutoProcIntegrationCurvePlotter.prototype.getHTML = function() {
    return '<div  id="' + this.targetId + '"></div><div  style="height:20px" id="' + this.targetId + '_legend"></div>';
};
AutoProcIntegrationCurvePlotter.prototype.getPanel = function() {
    
    this.plotPanel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'fit'
        },
        height: this.height,
        margin: this.margin,
        items: [{
                    html: this.getHTML(),
                    id: this.id,
                    style: {
                      border: "1px solid black"  
                    },
                    height : this.height,
                    border : 1
        }
       
        ]
    });   
    return this.plotPanel;
};


/**
* This is a form  for parcels. It includes all items includes in a parcel. Include pucks
*
* @class ParcelPanel
* @constructor
*/
function ParcelPanel(args) {
	var _this = this;
	
	this.test="A";
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;
	this.index = 0;
	this.containersPanelHeight = 400;
	this.containersPanelWidth = this.width*9/12 - 30;
	this.containersParcelWidth = 2*this.containersPanelHeight*0.9/2 + 20;
	// this.containersParcelWidth = 2*this.containersPanelHeight*0.2 + 20;
	this.shippingId = 0;
	this.shippingStatus = "";
	this.containersPanel = null;

	this.isSaveButtonHidden = false;
	this.isHidden = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
			this.containersPanelHeight = this.height*0.9;
			this.containersParcelWidth = 2*this.containersPanelHeight*0.9/2 + 20;
		}
		if (args.width != null) {
			this.width = args.width;
			this.containersPanelWidth = this.width*9/12 - 30;
		}
		if (args.index != null) {
			this.index = args.index;
		}
		if (args.shippingId != null) {
			this.shippingId = args.shippingId;
		}
		if (args.shippingStatus != null) {
			this.shippingStatus = args.shippingStatus;
		}
	}
	
	this.onSavedClick = new Event(this);

}

ParcelPanel.prototype.load = function(dewar, shipment) {
	var _this = this;
	this.dewar = dewar;
	this.dewar.index = this.index;
	this.shipment = shipment;
	
	/** Loading the template **/
	var html = "";
	dust.render("parcel.panel.template", {id : this.id, dewar : this.dewar, height : this.height, width : this.width}, function(err, out){
		html = out;
	});
	
	/** Setting click listeners **/		
	$('#' + this.id).hide().html(html).fadeIn("fast");
	this.panel.doLayout();

	if (this.shippingStatus != "processing"){
		$("#" + this.id + "-add-button").removeClass("disabled");
		$("#" + this.id + "-add-button").click(function () {
			_this.showAddContainerForm();
		});

		$("#" + this.id + "-edit-button").removeClass("disabled");
		$("#" + this.id + "-edit-button").click(function () {
			_this.showCaseForm();
		});
	}

	$("#" + this.id + "-print-button").click(function () {
		var dewarId = _this.dewar.dewarId;
		var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(dewarId, dewarId);
		location.href = url;
		return;
	});

	this.containersPanel = Ext.create('Ext.panel.Panel', {
		id			: this.id + "-containers-panel",
		// layout      : 'hbox',
		cls 		: "border-grid-light",
		margin		: this.height*0.0 + ' 0 ' + this.height*0.05 + ' 0',
		width       : this.containersPanelWidth,
		height    	: this.containersPanelHeight,
		autoScroll 	: false,
		items       : [],
		renderTo	: this.id + "-container-panel-div",
	});

	/** Set parameters **/
	this.renderShipmentParameters(dewar);

	/** Rendering pucks **/
	this.renderPucks(dewar);
};

ParcelPanel.prototype.renderShipmentParameters = function (dewar) {
	var html = "";
	dust.render("parcel.panel.parameter.table.template", {id : this.id, dewar : dewar, height : this.height}, function(err, out){
		html = out;
	});

	$('#' + this.id + "-parameters-div").hide().html(html).fadeIn("fast");
	if (dewar.comments != "" && dewar.comments != null) {
		$('#' + this.id + "-comments").hide().html("Comments: " + dewar.comments).fadeIn("fast");
		$('#' + this.id + "-index-td").attr('rowspan',2);
		$('#' + this.id + "-buttons-td").attr('rowspan',2);
		this.panel.setHeight(this.height + 25);
	} else {
		this.panel.setHeight(this.height);
		$('#' + this.id + "-index-td").attr('rowspan',1);
		$('#' + this.id + "-buttons-td").attr('rowspan',1);
	}
	this.panel.doLayout();
};

ParcelPanel.prototype.renderPucks = function (dewar) {
	var _this = this;

	this.containersPanel.setLoading(false);					
	if (dewar != null){
		if (dewar.containerVOs != null){

			this.containersPanel.removeAll();
			var stockSolutions = EXI.proposalManager.getStockSolutionsByDewarId(dewar.dewarId);

			if (dewar.containerVOs.length)
			var maxNumberForRow = Math.floor(this.containersPanel.width/this.containersParcelWidth);
			if (maxNumberForRow == null){
				maxNumberForRow = Math.floor(this.containersPanel.width/this.containersParcelWidth);
			}
			var rows = Math.ceil((this.dewar.containerVOs.length + stockSolutions.length)/maxNumberForRow);
			var containerRows = [];
			for (var i = 0 ; i < rows ; i++) {
				var containerRow = Ext.create('Ext.panel.Panel', {
					layout      : 'hbox',
					// cls 		: "border-grid",
					// margin		: this.height*0.05 + ' 0 0 0',
					width       : this.containersPanelWidth,
					height    	: this.containersPanelHeight/rows,
					autoScroll 	: false,
					items       : []
				});
				containerRows.push(containerRow);
				this.containersPanel.insert(containerRow);
			}
			
			
			/** Sorting container by id **/
			dewar.containerVOs.sort(function(a, b){return a.containerId - b.containerId;});
			var containerPanelsMap = {};
			var containerIds = [];
			
			for (var i = 0; i< dewar.containerVOs.length; i++){
				var container = dewar.containerVOs[i];
				var containerParcelPanel = new ContainerParcelPanel({type : container.containerType, height : this.containersPanelHeight/rows, width : this.containersParcelWidth,containerId : container.containerId, shippingId : this.shippingId, shippingStatus : this.shippingStatus, capacity : container.capacity, code : container.code});
				containerParcelPanel.onContainerRemoved.attach(function (sender, containerId) {
					_.remove(_this.dewar.containerVOs, {containerId: containerId});
					_this.renderPucks(_this.dewar);
				});
				containerPanelsMap[container.containerId] = containerParcelPanel;
				containerIds.push(container.containerId);
				
				containerRows[Math.floor(i/maxNumberForRow)].insert(containerParcelPanel.getPanel());
			}
			
			for (var i = 0; i< stockSolutions.length; i++){
				$('#hoveringTooltipDiv-' + stockSolutions[i].stockSolutionId).remove();
				var containerParcelPanel = new ContainerParcelPanel({type : "StockSolution", height : this.containersPanelHeight/rows, width : this.containersParcelWidth,containerId : stockSolutions[i].stockSolutionId, shippingId : this.shippingId, shippingStatus : this.shippingStatus, code : stockSolutions[i].name});	
				containerPanelsMap[stockSolutions[i].boxId] = containerParcelPanel;
				containerIds.push(stockSolutions[i].boxId);
				containerParcelPanel.onContainerRemoved.attach(function (sender, stockSolutionId) {
					var stockSolution = EXI.proposalManager.getStockSolutionById(stockSolutionId);
					stockSolution.boxId = null;

					var onSuccess = function(sender, container){
						EXI.proposalManager.get(true);
						_this.renderPucks(_this.dewar);
					};
					
					EXI.getDataAdapter({onSuccess : onSuccess}).saxs.stockSolution.saveStockSolution(stockSolution);
				});
				
				containerRows[Math.floor((i + dewar.containerVOs.length)/maxNumberForRow)].insert(containerParcelPanel.getPanel());
			}

			if (!_.isEmpty(containerPanelsMap)) {
				
				var onSuccess = function (sender, samples) {
					if (samples) {
						var samplesMap = {};
						for (var i = 0 ; i < samples.length ; i++) {
							var sample = samples[i];
							if (samplesMap[sample.Container_containerId]){
								samplesMap[sample.Container_containerId].push(sample);
							} else {
								samplesMap[sample.Container_containerId] = [sample];
							}
						}
						_.each(samplesMap, function(samples, containerId) {
							containerPanelsMap[containerId].load(samples);
						});
					}
				}

				EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerIds);
			}
		}
	}
}

/**
* It inserts a new container into the dewar and reloads the widget
*
* @method addContainerToDewar
*/
ParcelPanel.prototype.addContainerToDewar = function(containerVO) {
	var _this = this;
	this.containersPanel.setLoading();
	if (containerVO.containerType == "STOCK SOLUTION"){
		var stockSolution = EXI.proposalManager.getStockSolutionById(containerVO.data.stockSolutionId);
		stockSolution.boxId = this.dewar.dewarId;
		if (containerVO.code != "") {
			stockSolution.name  = containerVO.code;
		}
		var onSuccess = function(sender, container){
			EXI.proposalManager.get(true);
			_this.renderPucks(_this.dewar);
		};
		
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.stockSolution.saveStockSolution(stockSolution);
	} else {
		var onSuccess = function(sender, container){
			container.code = containerVO.code;
			container.containerStatus = _this.dewar.dewarStatus;
			container.sampleChangerLocation = _this.dewar.storageLocation;
			if (_this.shipment) {
				if (_this.shipment.sessions && _this.shipment.sessions.length > 0) {
					container.beamlineLocation = _this.shipment.sessions[0].beamlineName;
				}
			}
			container.sampleVOs = [];
			_this.dewar.containerVOs.push(container);
			
			var onSaveSuccess = function (sender) {
				_this.renderPucks(_this.dewar);
			}
			var onError = function(sender,error) {
				EXI.setError(error.responseText);
				_this.renderPucks(_this.dewar);
			};
			
			EXI.getDataAdapter({onSuccess : onSaveSuccess, onError : onError}).proposal.shipping.saveContainer(_this.shippingId, _this.dewar.dewarId, container.containerId, container);		
		};

		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addContainer(this.shippingId, this.dewar.dewarId, containerVO.containerType, containerVO.capacity);
		
	}	
};

/**
* It displays a window with a case form
*
* @method showCaseForm
*/
ParcelPanel.prototype.showCaseForm = function() {
	var _this = this;
	/** Opens a window with the cas form **/
	var caseForm = new CaseForm();
	var window = Ext.create('Ext.window.Window', {
	    title: 'Parcel',
	    height: 450,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	caseForm.getPanel(_this.dewar)
	    ],
	    // listeners : {
		// 	afterrender : function(component, eOpts) {
		// 		if (_this.puck != null){
		// 			_this.load(_this.puck);
		// 		}
		// 	}
	    // },
	    buttons : [ {
						text : 'Save',
						handler : function() {
							_this.onSavedClick.notify(caseForm.getDewar());
							window.close();
                            _this.renderShipmentParameters(_this.dewar);
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
	});
	window.show();
};

/**
* It displays a window with an adding container form
*
* @method showAddContainerForm
*/
ParcelPanel.prototype.showAddContainerForm = function() {
	var _this = this;
	/** Opens a window with the cas form **/
	var addContainerForm = new AddContainerForm();

	addContainerForm.onSave.attach(function(sender,container){
		_this.addContainerToDewar(container);
		window.close();
	})

	addContainerForm.onCancel.attach(function(sender){
		window.close();
	})

	var window = Ext.create('Ext.window.Window', {
	    title: 'Container',
	    height: 450,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	addContainerForm.getPanel(_this.dewar)
	    ],
	});
	window.show();
};

ParcelPanel.prototype.getPanel = function() {
	this.panel = Ext.create("Ext.panel.Panel",{
		cls 		: "border-grid",
		margin 		: 10,
		height 		: this.height,
		width 		: this.width,
		autoScroll	: false,
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					padding : this.padding,
					width : this.width
				}]
	});

	return this.panel;
};
function ProposalGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	this.margin = '0 0 0 0';
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.searchBar != null) {
			this.searchBar = args.searchBar;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}

		if (args.collapsed != null) {
			this.collapsed = args.collapsed;
		}

		if (args.width != null) {
			this.width = args.width;
		}
		
		if (args.margin != null) {
			this.margin = args.margin;
		}
	}
	this.onSelected = new Event(this);
}


ProposalGrid.prototype.load = function(proposals) {
	this.data = proposals;
	this.store.loadData(proposals, false);
};

ProposalGrid.prototype.getFilter = function(value){
	return [{property : "Proposal_proposalNumber", value : value, anyMacth : true}];
};

ProposalGrid.prototype.filter = function(value) {
	
};

ProposalGrid.prototype._getTbar = function() {
	var _this = this;
	var actions = [];
	actions.push({
		xtype : 'textfield',
		name : 'field1',
		emptyText : 'search by number',
		hidden : this.isHidden,
		  listeners : {
  			'change' : function(field, e) {
  						var value = field.getValue();
  						if (value != ""){
  							_this.store.filter(_this.getFilter(field.getValue()));
  						}
  						else{
  							_this.store.clearFilter(true);
  							_this.load(_this.data);
  						}
  					} 
          		} 
	    }
	);
	return actions;
};

ProposalGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'Proposal_proposalId', 'Proposal_title', 'Proposal_proposalCode', 'Proposal_proposalNumber', 'Proposal_proposalType' ]
	});

	this.store.sort(['Proposal_proposalCode', 'Proposal_proposalNumber']);

	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Proposals',
		store : this.store,
		tbar : this._getTbar(),
		layout : 'fit',
		cls : 'border-grid',
		height : this.height,
		margin : this.margin,
		emptyText : "No proposals",
		columns : [ 
		{
			text : 'Proposal',
			dataIndex : 'Proposal_code',
			width : 125,
			renderer : function(grid, a, record){
				return "<a href='#'>" + record.data.Proposal_proposalCode + record.data.Proposal_proposalNumber + "</a>"; 
			}
		}, 
		{
			text : 'Code',
			dataIndex : 'Proposal_number',
			width : 75,
			hidden : true
		}, 
		{
			text : 'Number',
			dataIndex : 'number',
			width : 75,
			hidden : true
		}, 
		{
			text : 'Title',
			dataIndex : 'Proposal_title',
			flex : 1
		}
		],
		flex : 1,
		viewConfig : {
			stripeRows : true,
			listeners : {
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					_this.onSelected.notify(record.data);
				}
			}
		}
	});

	/** Adding the tbar **/
	if (this.tbar) {
		this.panel.addDocked({
			xtype : 'toolbar',
			cls : 'toolBarGrid',
			height : 48,
			items : this._getTbar()
		});
	}
	return this.panel;
};





function SessionGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	this.width = null;

	this.title = null;
	this.margin = 10;


	this.hiddenGoColumn = true;
    this.isHiddenTitle = true;
    this.isHiddenNumberOfShifts = true;
    
    this.isHiddenPI = true;
    this.isHiddenLocalContact = true;
    
    this.layout = 'fit';
    
    /** Array with the beamline selected to make the filter */
    this.beamlineFilter = [];
    
	if (args != null) {
         if (args.isHiddenLocalContact != null) {
			this.isHiddenLocalContact = args.isHiddenLocalContact;
		}
        

        if (args.isHiddenNumberOfShifts != null) {
			this.isHiddenNumberOfShifts = args.isHiddenNumberOfShifts;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.isHiddenTitle != null) {
			this.isHiddenTitle = args.isHiddenTitle;
		}
        if (args.isHiddenPI != null) {
			this.isHiddenPI = args.isHiddenPI;
		}
        
		if (args.title != null) {
			this.title = args.title;
		}
		if (args.margin != null) {
			this.margin = args.margin;
		}

		if (args.height != null) {
			this.height = args.height;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}

		if (args.width != null) {
			this.width = args.width;
            this.layout = null;
		}
		if (args.hiddenGoColumn != null) {
			this.hiddenGoColumn = args.hiddenGoColumn;
		}
	}
	this.onSelected = new Event(this);
}



SessionGrid.prototype.load = function(sessions) {
    /** Filtering session by the beamlines of the configuration file */    
    this.sessions = _.filter(sessions, function(o){ return _.includes(EXI.credentialManager.getBeamlineNames(), o.beamLineName); });
	this.store.loadData(this.sessions, false);
};

SessionGrid.prototype.filterByBeamline = function(beamlines) {
    console.log(beamlines);
    if (beamlines){
        if (beamlines.length > 0){
            var filtered = [];
            for(var i = 0; i < beamlines.length; i++){
                filtered = _.concat(filtered, (_.filter(this.sessions, {'beamLineName': beamlines[i]})));
            }
            this.store.loadData(filtered, false);
        }
        else{
            this.store.loadData(this.sessions, false);
        }
    }
};

SessionGrid.prototype.getToolbar = function(sessions) {
    var _this = this;
    var items = [];
    
    var myHandler = function(a,selected,c){                    
                    if (selected){
                        _this.beamlineFilter.push(a.boxLabel);
                    }
                    else{          
                                      
                        _this.beamlineFilter =_.remove(_this.beamlineFilter, function(n) {                            
                                return n  != a.boxLabel;
                        });
                    }
                     
                    _this.filterByBeamline(_this.beamlineFilter);
    };

        
    for (var i =0; i<EXI.credentialManager.getBeamlines().length; i++){
        items.push({           
                xtype: 'checkbox',
                boxLabel : EXI.credentialManager.getBeamlines()[i].name,
                name : EXI.credentialManager.getBeamlines()[i].name,
                handler : myHandler 
            
        });
    }
	 return Ext.create('Ext.toolbar.Toolbar', {  
        items: items
    });
};


SessionGrid.prototype.getPanel = function() {
	var _this = this;
   
    this.store = Ext.create('Ext.data.Store', {
		fields : ['Proposal_ProposalNumber', 'beamLineName', 'beamLineOperator', 'Proposal_title', 'Person_emailAddress', 'Person_familyName', 'Person_givenName', 'nbShifts', 'comments'],
		emptyText : "No sessions",
		data : []
	});    


	this.panel = Ext.create('Ext.grid.Panel', {
		title : this.title,
		store : this.store,
        tbar : this.getToolbar(),		
		icon : '../images/icon/sessions.png',
		cls : 'border-grid',
		minHeight: 300,
        width : this.width,
        height : this.height,
		margin : this.margin,
		layout : this.layout,
		columns : [
              {
                    text              : '',
                    dataIndex         : 'BLSession_startDate',
                    flex             : 1,
                    hidden              : true,
                    renderer          : function(grid, a, record){                                    
                                               var html = "";
                                               if (record.data.BLSession_startDate){
                                                    record.data.start =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY');
                                                    record.data.day =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('Do');
                                                    record.data.month =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM');
                                                    record.data.year =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('YYYY');
                                               }
                                               dust.render("session.grid", record.data, function(err, out){
                                                    html = html + out;
                                               });
                                               return html;
                    }
              },
              {
                            text              : 'Start',
                            dataIndex         : 'BLSession_startDate',
                            flex              : 2,
                            hidden            : false,
                            renderer          : function(grid, a, record){                                 
                                                     
                                                    var location = "#";
                                                    if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                                                        location = "#/session/nav/" + record.data.sessionId + "/session";
                                                    }
                                                    else{
                                                        location = "#/mx/datacollection/session/" + record.data.sessionId + "/main";
                                                    }
                                                    if (record.data.BLSession_startDate){                 
                                                         return "<a href='" +  location +"'>" + moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY') + "</a>"; 
                                                    }
                            }
		     },
             {
                    text : 'Beamline',
                    dataIndex : 'beamLineName',
                    width : 125,
                    hidden : false,
                    renderer : function(grid, a, record){
                            var location = "#";
                            if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                                location = "#/session/nav/" + record.data.sessionId + "/session";
                            }
                            else{
                                location = "#/mx/datacollection/session/" + record.data.sessionId + "/main";
                            }
                        return "<a href='" +  location +"'>" + record.data.beamLineName + "</a>"; 
                    }
		    }, 
            {
                text : 'Proposal',
                dataIndex : 'Proposal_ProposalNumber',
                flex : 1,
                hidden : false,
                renderer : function(grid, a, record){
                    var proposal = record.data.Proposal_proposalCode + record.data.Proposal_ProposalNumber;
                    return "<a href='#/session/nav' data-toggle='tooltip' title='Open proposal " + proposal +"'>" + proposal + "</a>"; 
                }
          },       
          {
			    text                : 'Shifts',
			    dataIndex           : 'nbShifts',
                hidden              : this.isHiddenNumberOfShifts,
                flex                : 1
		    },
           {
			    text                : 'Local Contact',
			    dataIndex           : 'beamLineOperator',
			    width               : 200,
                hidden              : this.isHiddenLocalContact,
                flex                : 1
		    },
            {
			    text                : 'Title',
			    dataIndex           : 'Proposal_title',
			    width               : 200,
                hidden              : this.isHiddenTitle,
                flex               : 4
		    },
            {
			    text                : 'PI',
			    dataIndex           : 'Proposal_title',
			    width               : 200,
              
                 hidden              : this.isHiddenPI,
                renderer : function(grid, a, record){                        
                        return record.data.Person_familyName + ", " + record.data.Person_givenName;
                    }
		    },
             {
			    text                : 'e-mail',
			    dataIndex           : 'Person_emailAddress',
			    width               : 200,
                hidden              : true,
                flex               : 1
		    },
           {
                text                : 'Data Collections',
			    dataIndex           : 'Person_emailAddress',
                 width               : 200,
                renderer : function(grid, a, record){ 
                    function getBadge(title, count) {
                        if (count){
                            if (count != 0){
                                return '<tr><td><span style="margin-left:10px;margin-top:2px;background-color:#207a7a;" class="badge">' + count +'</span></td><td style="padding-left:10px;">' + title + '</td></tr>';
                            }
                        }
                        return "";
                    }
                    function getTable(record){
                        var html = "<table>";
                        html =   html = html + getBadge("Energy", record.data.energyScanCount);
                        html = html + getBadge("XRF", record.data.xrfSpectrumCount);
                        html = html + getBadge("Samples", record.data.sampleCount);
                        html = html + getBadge("Test", record.data.testDataCollectionGroupCount);
                        html = html + getBadge("Collects", record.data.dataCollectionGroupCount);
                        html = html + getBadge("Calibration", record.data.calibrationCount);
                        html = html + getBadge("Sample Changer", record.data.sampleChangerCount);
                        html = html + getBadge("HPLC", record.data.hplcCount);
                        return html + "</table>";  
                    }                                                          
                    return getTable(record);
                 }
               
           },
     
            {
                text              : 'End',
                dataIndex         : 'BLSession_endDate',
                hidden              : true,
                flex             : 1,                
                renderer          : function(grid, a, record){                    
                                        return record.data.BLSession_endDate;
                }
		   },
           {
			    text                : 'Comments',
			    dataIndex           : 'comments',
                hidden              : false,
                flex                : 3,
                renderer            : function(grid, a, record){    
                                        if (record.data.comments){                
                                            return "<div style='width:50px; wordWrap: break-word;'>" + record.data.comments + "</div>";
                                        }
                }
                


		    },
           ], 
      	   viewConfig : {
                stripeRows : true,
                getRowClass : function(record, rowIndex, rowParams, store){
                    /*
                    if (record.data.beamLineName != null){
                        
                        if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                            return ((rowIndex % 2) == 0) ? "saxs-grid-row-light" : "saxs-grid-row-dark";
                        }
                        if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "MX"){
                            return ((rowIndex % 2) == 0) ? "mx-grid-row-light" : "mx-grid-row-dark";
                        }
                    }
                    return "mx-grid-row-dark";*/
                }
	    	},
            listeners : {
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {                    
					_this.onSelected.notify({
                       proposalCode   : record.data.Proposal_proposalCode,
                       proposalNumber : record.data.Proposal_ProposalNumber
                        
                    });
				}			
			}				
	});	
	return this.panel;
};





function StockSolutionContainer(args) {
    this.id = BUI.id();
	
    this.templateData = {
                            id          	: this.id,
                            xmargin     	: 0,
                            ymargin     	: 0,
                            mainRadius  	: 50,
                            width       	: 100,
                            height      	: 100,
                            imgH			: 42,
                            imgW			: 42,
							margin			: 15,
							stockId			: 0,
							// rInner			: 10,
							enableMainClick : false,
                            code            : "",
                            enableClick     : false,
							enableMainMouseOver : false
                        };

	this.stockSolutionId = 0;
    this.samples = null;
	this.code = "";

	if (args){
		if (args.code){
			this.code = args.code;
		}
		if (args.xMargin){
			this.templateData.xMargin = args.xMargin;
		}
		if (args.yMargin){
			this.templateData.yMargin = args.yMargin;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
        if (args.mainRadius){
			this.templateData.mainRadius = args.mainRadius;
			this.templateData.width = 2*args.mainRadius;
			this.templateData.height = 2*args.mainRadius;
			this.templateData.imgH = this.templateData.height*0.7;
			this.templateData.imgW = this.templateData.width*0.7;
			this.templateData.margin = (this.templateData.width - this.templateData.imgW)*0.5;
		}
        if (args.code) {
            this.templateData.code = args.code;
        }
        if (args.enableClick != null) {
            this.templateData.enableClick = args.enableClick;
        }
        if (args.stockSolutionId) {
            this.stockSolutionId = args.stockSolutionId;
            var stockSolution = EXI.proposalManager.getStockSolutionById(this.stockSolutionId);
            this.templateData.macromoleculeAcronym = EXI.proposalManager.getMacromoleculeById(stockSolution.macromoleculeId).acronym;
            this.templateData.buffer = EXI.proposalManager.getBufferById(stockSolution.bufferId).acronym;
            this.templateData.stockId = this.stockSolutionId;
        }
	}

	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

StockSolutionContainer.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
            id: this.id + "-container",
		    x: this.templateData.xMargin,
		    y: this.templateData.yMargin,
		    width : this.templateData.width + 1,
		    height : this.templateData.height + 1,
		   cls:'border-grid',
		    frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						{
							html : this.getHTML(),
							width : this.templateData.width + 1,
							height : this.templateData.height + 1
						}
			],
			
	});

	this.panel.on('boxready', function() {
        if(_this.templateData.enableMainClick) {
			$("#" + _this.id).unbind('click').click(function(sender){
				_this.onClick.notify(sender.target.id);
			});
		}
		_this.setOnMouseOverEvent();
    });
	
	return this.panel;
	
};

StockSolutionContainer.prototype.loadSamples = function (samples) {
    this.samples = samples;
    if (samples){
		if (samples.length > 0){
			this.containerId = samples[0].Container_containerId; 
		}
	}
};

StockSolutionContainer.prototype.getHTML = function (samples) {
	var html = "";
	if (this.templateData.height < 40) {
		this.templateData.fillPanel = false;
	} else {
		this.templateData.fillPanel = true;
	}
	dust.render("stock.solution.container.template", this.templateData, function(err, out){
		html = out;
	});
	
	return html;
};

StockSolutionContainer.prototype.setOnMouseOverEvent = function () {
	var _this = this;
	
	$("#" + this.id).unbind('mouseover').mouseover(function(sender){
		_this.onMouseOver.notify(_this);
		if (_this.templateData.height < 40){
			var id = sender.currentTarget.id;
			$("#" + id).addClass("stock-solution-focus");
			
			// TOOLTIP
			var tooltipHtml = "";
			dust.render("stock.solution.tooltip.template", _this.templateData, function(err, out) {
				tooltipHtml = out;
			});
			$('body').append(tooltipHtml);
			$('#hoveringTooltipDiv-' + _this.stockSolutionId).css({
				"top" : $(this).offset().top,
				"left" : $(this).offset().left + _this.templateData.width
			});
		}
	});
	
	$("#" + this.id).unbind('mouseout').mouseout(function(sender){
		_this.onMouseOut.notify(_this);
		if (_this.templateData.height < 40){
			var stockId = sender.currentTarget.id;
			$("#" + stockId).removeClass("stock-solution-focus");

			// TOOLTIP
			$('#hoveringTooltipDiv-' + _this.stockSolutionId).remove();
		}
	});

}

StockSolutionContainer.prototype.focus = function (bool) {
	if (bool){
		$("#" + this.id + "-container").addClass("stock-solution-selected");		
	} else {
		$("#" + this.id + "-container").removeClass("stock-solution-selected");	
	}
};
/**
 * Grid rendering the stock solutions
 * 
 */
function StockSolutionsGrid(args) {
	this.id = BUI.id();
	this.width = 600;
    this.padding = 0;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
        if (args.width != null) {
			this.padding = args.padding;
		}
	}
	
    this.onSelected = new Event(this);
}

StockSolutionsGrid.prototype.getPanel = function () {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
        storeId:'stockSolutionsGridStore',
        fields: ["acronym","buffer","concentration","volume"],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        width: this.width,
        border: 1,        
        store: this.store,       
        disableSelection: false,
        flex:0.5,
        columns: [
                    {
                        header: 'Acronym',
                        dataIndex: 'acronym',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Buffer',
                        dataIndex: 'buffer',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Concentration (mg/ml)',
                        dataIndex: 'concentration',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Volume (&#956l)',
                        dataIndex: 'volume',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    }
        ],
        listeners : {
            itemclick: function(grid, record, item, index, e) {
                _this.onSelected.notify(record);
            }
        }
    });

    return this.panel;
}

StockSolutionsGrid.prototype.load = function (stockSolutions) {
    this.stockSolutions = stockSolutions;
    var data = [];
    for (var i=0 ; i < stockSolutions.length ; i++) {
        data.push({
            acronym         : EXI.proposalManager.getMacromoleculeById(stockSolutions[i].macromoleculeId).acronym,
            buffer          : EXI.proposalManager.getBufferById(stockSolutions[i].bufferId).acronym,
            concentration   : stockSolutions[i].concentration,
            volume          : stockSolutions[i].volume,
            stockSolutionId : stockSolutions[i].stockSolutionId
        });
    }
    this.store.loadData(data);
}


function UploaderWidget(args){
	this.id = BUI.id();

	this.url = null;
	if (args) {
		if (args.url) {
			this.url = args.url;
		}
	}
	if (this.url == null){
		 Ext.Msg.alert('Error', 'Please, set an url');
	}
	
	
	this.onUploaded = new Event(this);
}

UploaderWidget.prototype.getFileName = function(){
	var filePath =  Ext.getCmp(this.id).value;
	return filePath.split("\\")[filePath.split("\\").length - 1];
};

UploaderWidget.prototype.getForm = function(){
	var _this = this;
	return Ext.create('Ext.form.Panel', {
		layout: {
			type: 'hbox',
			align: 'stretch'
		},
	    bodyPadding: 20,
	    border : 0,
	    frame: true,
	    items: [
			{
				xtype: 'filefield',
				name: 'file',
				width: 400,
				id : this.id,
				fieldLabel: 'File',
				labelWidth: 30,
				msgTarget: 'side',
				allowBlank: false,
				buttonText: 'Browse...'
			},
			// {
			// 	xtype : 'hiddenfield',
			// 	id : _this.id + 'fileName',
			// 	name : 'fileName',
			// 	value : '' 
			// },
			{
			xtype : 'button',
			margin: '0 0 0 2',
	        text: 'Upload',
	        handler: function() {
	            var form = this.up('form').getForm();
	            if(form.isValid()){
	            	// Ext.getCmp(_this.id + "fileName").setValue(_this.getFileName());
	                form.submit({
	                    url: _this.url,
	                    waitMsg: 'Uploading your file...',
	                    success: function(fp, o) {
//	                        Ext.Msg.alert('Success', 'Your file has been uploaded.');
	                    	_this.window.close();
	                    	_this.onUploaded.notify();
	                    },
	                    failure : function(fp, o) {
//	                    	Ext.Msg.alert('Failure', 'Processed file "' + o.result.file + '" on the server');
	                    	_this.window.close();
	                    	_this.onUploaded.notify();
	                    } });
	            }
	        }
	    }
	    ],
	});
	
	
};



UploaderWidget.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'ISPyB File Uploader Manager',
	    height: 200,
	    modal : true,
	    icon : '../images/icon/upload.svg',
	    width: 600,
	    layout: 'fit',
	    items: this.getForm()
	});
	this.window.show();
};