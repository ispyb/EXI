  dust.helpers.decimal = function(chunk, context, bodies, params) {
      
        if (params.key){            
            var value = context.current()[params.key];
            if (value){
                if (params.decimals != null){
                    try{
                         chunk.write(Number(value).toFixed(params.decimals));
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

dust.helpers.sizeOf = function(chunk, context, bodies, params) {
  var value = this.size(chunk, context, bodies, params);
  return (bodies && bodies.block) ? chunk.render(bodies.block, context.push({ isSelect: true, isResolved: false, selectKey: value })) : value;
};

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
	
	/** If false when opening a new tab it will close the already open ones **/
	this.keepTabs = false;
	
	
	this.controllers = [new ExiController(), new ProposalExiController(), new ShippingExiController(), new TestController()];
	
	if (args != null){
		if (args.menu != null){
			this.mainMenu = args.menu;
			this.userMenu = args.menu;
		}
		if (args.anonymousMenu != null){
			this.anonymousMenu = args.anonymousMenu;
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
	
	
	this.credentialManager.onLogin.attach(function(sender){
		_this.mainMenu.populateCredentialsMenu();
		_this.setUserMenu();
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
															_this.setUserMenu();
															_this.mainMenu.populateCredentialsMenu();
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
* @param {Boolean} forceUpdate if true the proposals information will be reloaded from the server syncrhonously
*/
ProposalManager.prototype.get = function(forceUpdate) {
    var _this = this;
	if ((localStorage.getItem("proposals") == null)||(forceUpdate)){
       
		var onSuccess= function(sender, proposals){
			localStorage.setItem("proposals", JSON.stringify(proposals));
            _this.onActiveProposalChanged.notify();
		};
		EXI.getDataAdapter({async : true, onSuccess : onSuccess}).proposal.proposal.getProposalsInfo();
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
			EXI.addMainPanel(new AddressWelcomeMainView());
			
		}).enter(this.setPageBackground);
		
		Path.map("#/proposal/address/:lacontactId/main").to(function() {
			var mainView = new AddressMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['lacontactId']);
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
			EXI.addMainPanel(new ShippingWelcomeMainView());
		});
		
		Path.map("#/shipping/:shippingId/main").to(function() {
			var mainView = new ShippingMainViewTest();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['shippingId']);
		}).enter(this.setPageBackground);

		Path.map("#/shipping/main").to(function() {
			var mainView = new ShippingMainViewTest();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);

		Path.map("#/shipping/:shippingId/main/old").to(function() {
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load(this.params['shippingId']);
		}).enter(this.setPageBackground);

		Path.map("#/shipping/main/old").to(function() {
			var mainView = new ShippingMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
		}).enter(this.setPageBackground);
		
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
        this.rowSelected.notify($("#row-" + rowIndex + "-" + this.id).innerText);
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
	function onItemCheck(item, checked) {
		if (item.text == "Shipments") {
			location.hash = "/proposal/shipping/nav";
		}
		if (item.text == "Manage shipping addresses") {
			location.hash = "/proposal/addresses/nav";
		}
		if (item.text == "Shipment List") {
			location.hash = "/proposal/shipping/nav";
		}
	}

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
							handler : onItemCheck 
						}, 
						{
							text : 'Shipments',
							icon : '../images/icon/shipping.png',
							handler : onItemCheck 
						} 
					] })
	};

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
	var _this = this;
	
	this.credentialsMenu = new Ext.menu.Menu({
		id : _this.id + "menu",
		items : [_this.getAddCredentialMenu()] 
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
function AddressMainView() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];

	MainView.call(this);

	this.addressForm = new AddressForm();
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

AddressMainView.prototype.getPanel = MainView.prototype.getPanel;

AddressMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
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
    
    EXI.mainStatusBar.showBusy("Loading proposal " +proposal); 
    
	EXI.credentialManager.setActiveProposal(this.username, proposal);
    EXI.proposalManager.clear();
	/** I don't need this to be synchronous **/	
    EXI.proposalManager.onActiveProposalChanged = new Event();
    EXI.proposalManager.onActiveProposalChanged.attach(function(){
        EXI.mainStatusBar.showReady();
        console.log(EXI.proposalManager.get());
    });
	EXI.proposalManager.get();
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
            }
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
	this.height = 380;
	this.width = 500;
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onModified = new Event(this);
}

ContainerSpreadSheet.prototype.getPanel = function(){
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


ContainerSpreadSheet.prototype.getSamplesData = function(puck) {
	var samples = puck.sampleVOs;
	var data = [];
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
					[(i+1), protein.acronym, sample.name, crystal.spaceGroup, diffraction.experimentKind, sample.code,  getValue(diffraction["observedResolution"]),  diffraction.requiredResolution, diffraction.preferredBeamDiameter, 
					 diffraction.numberOfPositions, diffraction.radiationSensitivity, diffraction.requiredMultiplicity, diffraction.requiredCompleteness,
					 crystal.cellA, crystal.cellB, crystal.cellC, crystal.cellAlpha, crystal.cellBeta, crystal.cellGamma, sample.smiles, sample.comments
					 ]
				);
		}
		else{
			data.push([(i+1)]);
		}
	}
	return data;
};


ContainerSpreadSheet.prototype.getSpaceGroups = function() {
	return ["P1","P2","P21","C2","P222","P2221","P21212","P212121","C222","C2221","F222","I222","I212121","P4","P41","P42","P43","P422","P4212","P4122","P41212","P4222","P42212","P4322","P43212",
                	"I4","I41","I422","I4122","P3","P31","P32","P31","P321","P3112","P3121","P3212","P3221","P6","P61","P65","P62","P64","P63","P622","P6122","P6522","P6222","P6422","P6322","R3","R32","P23","P213",
                	"P432",	"P4232","P4332","P4132","F23","F432","F4132","I23",	"I213","I432","I4132", "UNKNOWN"];
};


ContainerSpreadSheet.prototype.getAcronyms = function() {
	var proteins = EXI.proposalManager.getProteins();
	var acronyms = [];
	for (var i = 0; i < proteins.length; i++) {
		acronyms.push(proteins[i].acronym);
	}
	return acronyms;
};


ContainerSpreadSheet.prototype.getHeader = function() {
	return  [
	         { text : '#', 	id: 'position', column : {width : 20}}, 
	         { text :'Protein <br />Acronym', id :'Protein Acronym', 	column :  {
																						width : 60,
																						type: 'dropdown',
																						source: this.getAcronyms()
																					}
	         }, 
	         { text :'Sample<br /> Name', id :'Sample Name', column : {width : 120}}, 
	         { text :'Space<br /> Group', id : 'Space Group',column : {
			        	 													width : 90,
			        	 													type: 'dropdown',
			        	 													source: this.getSpaceGroups()
			         								}
	         }, 
	         { text :'Exp.<br /> Type', id : 'Experiment Type', column : {
							        	 								width : 80,  
							        	 								type: 'dropdown',
							        	 								source: [ "Default", "MXPressE", "MXPressO", "MXPressI", "MXPressE_SAD", "MXScore", "MXPressM" ]
							         								}
	         }, 
	         { text :'Pin <br />BarCode', id : 'Pin BarCode', column : {width : 45}},  
	         { text :'Pre-observed <br />resolution', id : 'Pre-observed resolution', column : {width : 45}}, 
	         { text :'Needed<br /> resolution',  id :'Needed resolution', column : {width : 45}}, 
	         { text :'Pref. <br />Diameter', id :'Pref. Diameter',column : {width : 45}}, 
	         { text :'Number Of<br /> positions', id :'Number Of positions', column : {width : 45}}, 
	         { text :'Radiation<br /> Sensitivity', id :'Radiation Sensitivity', column : {width : 60}}, 
	         { text :'Required<br /> multiplicity', id :'Required multiplicity', column : {width : 60}}, 
	         { text :'Required<br /> Completeness', id :'Required Completeness', column : {width : 60}}, 
	         { text :'A', id :'Unit cell A', column : {width : 40}}, 
	         { text :'B', id :'Unit cell B', column : {width : 40}}, 
	         { text :'C', id : 'Unit cell C', column : {width : 40}}, 
	         { text :'&#945;', id :'Unit cell Alpha', column : {width : 40}}, 
	         { text :'&#946;', id :'Unit cell Beta', column : {width : 40}}, 
	         { text :'&#947;', id :'Unit cell Gamma', column : {width : 40}}, 
	         { text :'Smiles', id :'Required Completeness', column : {width : 45}}, 
	         { text :'Comments', id :'Comments', column : {width : 45}}
	         ];
};

ContainerSpreadSheet.prototype.getHeaderWidth = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].column.with);
	}
	return text;
};

ContainerSpreadSheet.prototype.getHeaderId = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].id);
	}
	return text;
};

ContainerSpreadSheet.prototype.getHeaderText = function() {
	var header = this.getHeader();
	var text = [];
	for (var i =0; i < header.length; i++){
		text.push(header[i].text);
	}
	return text;
};


ContainerSpreadSheet.prototype.getColumns = function() {
	var columns = [];
	for (var i = 0; i < this.getHeader().length; i++) {
		columns.push(this.getHeader()[i].column);
	}
	return columns;
};


ContainerSpreadSheet.prototype.getPuck = function() {
	var myPuck = JSON.parse(JSON.stringify(this.puck));
	var rows = this.parseTableData();
    
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
		sample["crystalVO"]["spaceGroup"] = rows[i]["Space Group"];
		sample["crystalVO"]["cellA"] = Number(rows[i]["Unit cell A"]);
		sample["crystalVO"]["cellB"] = Number(rows[i]["Unit cell B"]);
		sample["crystalVO"]["cellC"] = Number(rows[i]["Unit cell C"]);
		sample["crystalVO"]["cellAlpha"] = Number(rows[i]["Unit cell Alpha"]);
		sample["crystalVO"]["cellBeta"] = Number(rows[i]["Unit cell Beta"]);
		sample["crystalVO"]["cellGamma"] = Number(rows[i]["Unit cell Gamma"]);
		
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


ContainerSpreadSheet.prototype.parseTableData = function() {
	var parsed = [];
	var data = this.spreadSheet.getData();
	for (var j = 0; j < data.length; j++) {
		var row = {};
		row["location"] = j + 1;
			for (var k = 0; k < data[j].length; k++) {
				var key = this.getHeaderId()[k];
				var value = data[j][k];
				row[key] = value;
			}
			if (row["Protein Acronym"]){
				if (row["Protein Acronym"].length > 0){
					parsed.push(row);
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

ContainerSpreadSheet.prototype.load = function(puck){
	this.puck = puck;
	var container = document.getElementById(this.id + '_samples');
    
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
	  }
	  // maps function to lookup string
	  Handsontable.renderers.registerRenderer('ValueRenderer', ValueRenderer);
	  var _this = this;
	  this.spreadSheet = new Handsontable(container, {
		beforeChange: function (changes, source) {
		      lastChange = changes;
		      
		},
	    data: this.getSamplesData(puck),
	 
	    height : this.height,
	    width : this.width,
	    manualColumnResize: true,
	    colWidths: this.getHeaderWidth(),
	    colHeaders: this.getHeaderText(),
	    stretchH: 'last',
	    columns: this.getColumns()
	  });

	  
	 /*this.spreadSheet.updateSettings({
		  afterChange: function (changes, source) {              
				_this.onModified.notify(_this.getPuck());
			
		  }
		});*/
	
	
};

/**
* This is a grid for parcels
*
* @class ParcelGrid
* @constructor
*/
function ParcelGrid(args) {
	this.height = 100;
	this.width = 100;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	/** Events **/
	this.onSuccess = new Event(this);
	this.onAdd = new Event(this);
	this.onRemove = new Event(this);
}

ParcelGrid.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	return [(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add New Parcel',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}))];
};

ParcelGrid.prototype.load = function(shipment) {
	var _this = this;
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;

	this.parcelForms = [];

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
   
	for ( var i in this.dewars) {
		var parcelForm = new ParcelPanelTest({
			height : 500,
			width : this.width - 40
		});
		this.panel.insert(parcelForm.getPanel());
		parcelForm.load(this.dewars[i]);
		parcelForm.onSavedClick.attach(onSaved);
		this.parcelForms.push(parcelForm);
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
        maxHeight: this.height
	});

	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		items : _this._getTopButtons(),
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
function PuckForm(args) {
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

	
	var _this = this;
	
	//this.puckLayout = new PuckPanel({width : 150, tbar : false});
	this.containerSpreadSheet = new ContainerSpreadSheet({width : 1300});
	
	/*this.containerSpreadSheet.onModified.attach(function(sender, puck){
		
	});*/
	
	this.onRemoved = new Event(this);
	this.onSaved = new Event(this);
}

/** Loads a puck into the form **/
PuckForm.prototype.load = function(puck, shippingId) {
	var _this = this;
	this.puck = puck;
    
	if (puck != null){
		Ext.getCmp(this.id + "puck_name").setValue(this.puck.code);
		this.capacityCombo.setValue(this.puck.capacity);
        Ext.getCmp(this.id + "puck_beamline").setValue(this.puck.beamlineLocation);
        Ext.getCmp(this.id + "puck_sampleChangerLocation").setValue(this.puck.sampleChangerLocation);
        Ext.getCmp(this.id + "puck_status").setValue(this.puck.containerStatus);                
	}	
	this.containerSpreadSheet.load(puck);
};

/*
PuckForm.prototype.loadPlateLayout = function(puck) {
	 try{
		 this.puckLayout.load(puck);
		 this.puckLayout.render(puck);
	  }
	  catch(e){
		  console.log(e);
	  }
};*/

PuckForm.prototype.getToolBar = function() {
	var _this = this;
	return [
	        
			{
			    text: 'Remove',
			    width : 100,
			    height : 30,
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
	            width : 100,
	            height : 30,
	            handler : function(){
	            	_this.save();
	            }
	        }
	];
};

PuckForm.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        _this.onRemoved.notify(containerId);
	};
	var containerId = this.puck.containerId;
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(containerId,containerId,containerId );
	
};

PuckForm.prototype.save = function() {
	var _this = this;
	this.panel.setLoading("Saving Puck");

	var puck = this.containerSpreadSheet.getPuck();
	/** Updating general parameters **/
	puck.code = Ext.getCmp(_this.id + 'puck_name').getValue();
	puck.capacity = _this.capacityCombo.getValue();
	
    var onError = function(sender, error){
		_this.panel.setLoading(false);
		EXI.setError(error.responseText);
	};
    
	var onSuccess = function(sender, puck){
		_this.panel.setLoading(false);
		_this.load(puck);
		_this.onSaved.notify(puck);
	};
	EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.saveContainer(this.puck.containerId, this.puck.containerId, this.puck.containerId, puck);
};


/**
 * When container type has changed from SPINE|| UNIPUCK || PLATE
 * 
 * We make the spreadsheet longer and the platelayout is rendered again
 */
PuckForm.prototype.containerTypeChanged = function(capacity) {
	this.puck.capacity = capacity;
	var data = this.containerSpreadSheet.spreadSheet.getData();
	if (data.length < capacity){
		for (var i = data.length; i<= capacity; i++){
			data.push([i]);
		}
	}
	else{
		data = data.slice(0, capacity);
	}
	this.containerSpreadSheet.spreadSheet.loadData(data);

};

PuckForm.prototype.getPanel = function() {
	var _this =this;
	var capacityCombo = BIOSAXS_COMBOMANAGER.getComboPuckType({margin : '10 0 10 5', labelWidth : 100, width : 250});
	capacityCombo.on('select', function(capacityCombo, record){
		var capacity = record[0].data.value;
		_this.containerTypeChanged(capacity);
	});
	
	this.capacityCombo = capacityCombo;
	this.panel = Ext.create('Ext.panel.Panel', {
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
											layout : 'vbox',
											items : [ 
							         				   {
																xtype: 'requiredtextfield',
																id : this.id + 'puck_name',
																fieldLabel : 'Name',
																name : 'name',
																width : 250,
																margin : '0 0 0 5',
																labelWidth : 100
														},
														this.capacityCombo,
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_beamline',
																fieldLabel : 'Beamline',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
																labelWidth : 100
														},
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_sampleChangerLocation',
																fieldLabel : '#Sample Changer',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
																labelWidth : 100
														},                                                       
                                                        {
																xtype: 'textfield',
																id : this.id + 'puck_status',
																fieldLabel : 'Status',
																width : 250,
                                                                disabled : true,
																margin : '0 0 0 5',
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


/**
 * Same form as MX part
 * 
 * @creationMode if true a create button appears instead of save
 * @showTitle true or false
 */
function ShipmentForm(args) {
	this.id = BUI.id();
	this.width = 600;

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

ShipmentForm.prototype.fillStores = function() {
	this.panel.setLoading("Loading Labcontacts from database");
	var labContacts = EXI.proposalManager.getLabcontacts();

	this.labContactForSendingStore.loadData(labContacts, false);

	labContacts.sort(function(a, b){
	    if(a.cardName < b.cardName) {return -1;}
	    if(a.cardName > b.cardName) {return 1;}
	    return 0;
	});
	
	$.extend(labContacts, [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);
	this.labContactForReturnStore.loadData(labContacts, false);

	this.labContactsReturnCombo.setValue(-1);

	this.panel.setLoading(false);
	if (this.shipment != null) {
		this.setShipment(this.shipment);
	}
};

ShipmentForm.prototype.draw = function(targetId) {
	this.getPanel().render(targetId);
};

ShipmentForm.prototype.load = function(shipment) {
	this.shipment = shipment;
	var _this = this;
	Ext.getCmp(_this.id + "shippingName").setValue(shipment.shippingName);
	Ext.getCmp(_this.id + "comments").setValue(shipment.comments);
	if (shipment.sendingLabContactVO != null) {
		this.labContactsSendingCombo.setValue(shipment.sendingLabContactVO.labContactId);
	}

	
	if (shipment.returnLabContactVO == null) {
		this.labContactsReturnCombo.setValue(0);
	}
	else{
		if (shipment.returnLabContactVO.labContactId == shipment.sendingLabContactVO.labContactId){
			this.labContactsReturnCombo.setValue(-1);
		}
		else{
			this.labContactsReturnCombo.setValue(shipment.returnLabContactVO.labContactId);
		}
	}
	
	if (shipment.sessions != null){
		if (shipment.sessions.length > 0){
			var session = shipment.sessions[0];
			this.sessionComboBox.setValue(session.sessionId);
		}
	}

};

ShipmentForm.prototype._saveShipment = function() {
	var _this = this;
	var shippingId = null;
	
	if (this.shipment != null) {
		shippingId = this.shipment.shippingId;
	}
	
	var sendingAddressId = this.labContactsSendingCombo.getValue();
	var returnAddressId = this.labContactsReturnCombo.getValue();
	
	if (sendingAddressId == null) {
		BUI.showError("User contact information for shipping to beamline is mandatory");
		return;
	}

		
	/** No return requested **/
	if (this.labContactsReturnCombo.getValue() == 0){
		returnAddressId = 0;
	}
	
	/** Same sender **/
	if (this.labContactsReturnCombo.getValue() == -1){
		returnAddressId = -1;
	}

	var sendingAddress = (EXI.proposalManager.getLabcontactById(sendingAddressId));
	var json = {
		shippingId : shippingId,
		name : Ext.getCmp(_this.id + "shippingName").getValue(),
		status : "Not set",
		sendingLabContactId : sendingAddressId,
		returnLabContactId : returnAddressId, 
		returnCourier : returnAddressId,
		courierAccount : sendingAddress.courierAccount,
		billingReference : sendingAddress.billingReference,
		dewarAvgCustomsValue : sendingAddress.dewarAvgCustomsValue,
		dewarAvgTransportValue :sendingAddress.dewarAvgTransportValue,
		comments : Ext.getCmp(_this.id + "comments").getValue(),
		sessionId : this.sessionComboBox.getValue()
	};

	var onSuccess = function(sender, shipment) {
		location.hash = "#/shipping/" + shipment.shippingId + "/main";
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
	
	
};

ShipmentForm.prototype.getPanel = function() {
	var _this = this;
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
	var buttons = [];

	if (_this.creationMode) {
		buttons.push({
			text : 'Create',
			scope : this,
			handler : function() {
				_this._saveShipment();
			}
		});
	} else {
		buttons.push({
			text : 'Save',
			scope : this,
			handler : function() {
				_this._saveShipment();
			}
		});

	}

	this.labContactForSendingStore = Ext.create('Ext.data.Store', {
		fields : [ 'cardName', 'labContactId' ],
		sorters : 'cardName'
	});

	this.labContactForReturnStore = Ext.create('Ext.data.Store', {
		fields : [ 'cardName', 'labContactId' ]
		
	});

	this.labContactsSendingCombo = Ext.create('Ext.form.ComboBox', {
		id : _this.id + "shipmentform_sendingLabContactId",
		fieldLabel : 'Shipping Card to ESRF',
		afterLabelTextTpl : required,
		store : this.labContactForSendingStore,
		queryMode : 'local',
		labelWidth : 200,
		width : 600,
		margin : '10 0 0 10',
		displayField : 'cardName',
		valueField : 'labContactId'
	});

	this.labContactsReturnCombo = Ext.create('Ext.form.ComboBox', {
		id : _this.id + "returnLabContactId",
		fieldLabel : 'Shipping Card to HOME',
		afterLabelTextTpl : required,
		store : this.labContactForReturnStore,
		queryMode : 'local',
		margin : '10 0 0 10',
		labelWidth : 200,
		width : 600,
		displayField : 'cardName',
		valueField : 'labContactId'
	});

	
    this.sessionComboBox =  BIOSAXS_COMBOMANAGER.getComboSessions(EXI.proposalManager.getSessions(), {margin: '10 0 0 10', width: 400, labelWidth: 200});

	if (this.panel == null) {
		this.panel = Ext.create('Ext.form.Panel', {
			layout: 'hbox',
			width : this.width,
			margin : 10,
			bodyPadding : 5,
			cls : 'border-grid',
			buttons : buttons,
			items : [ 
						{
							xtype : 'container',
							layout: 'vbox',
							items: [
										{
												xtype : 'requiredtextfield',
												fieldLabel : 'Name',
												allowBlank : false,
												labelWidth : 200,
												width : 400,
												margin : "10 20 0 10",
												name : 'shippingName',
												id : _this.id + 'shippingName',
												value : '',
										},
										this.sessionComboBox
							]
						},
					    {
		    					xtype : 'textareafield',
		    					name : 'comments',
		    					id : _this.id + 'comments',
		    					fieldLabel : 'Comments',
		    					value : '',
		    					labelWidth : 200,
		    					margin : "10 20 0 10",
		    					width : 500,
						},
						{
							xtype : 'container',
							layout: 'vbox',
							items: [
										this.labContactsSendingCombo,
										this.labContactsReturnCombo
							]
						}
		]
		});
	}
	this.fillStores();
	return this.panel;
};



/**
* This main class deals with the creation and edition of shipments
*
* @class ShippingMainView
* @constructor
*/
function ShippingMainView() {
	MainView.call(this);
	var _this = this;
	
	/**
	* 
	* @property shipmentForm
	*/
	this.shipmentForm = new ShipmentForm();
	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
	});
	
	/**
	* 
	* @property parcelGrid
	*/
	this.parcelGrid = new ParcelGrid({
		height : 300
	});
}

ShippingMainView.prototype.getPanel = MainView.prototype.getPanel;
ShippingMainView.prototype.getContainer = MainView.prototype.getContainer;

ShippingMainView.prototype.getContainer = function() {
	this.tabPanel =  Ext.createWidget('tabpanel',
			{
				margin : 10,
				defaults : {
						anchor : '100%'
				},
				items : [
				     		{
							tabConfig : {
								title : 'Delivery Details'
							},
							items : [ 
							         	this.shipmentForm.getPanel()
							]
						},
						{
							tabConfig : {
								id : this.id + "grid",
								title : 'Parcels',
								icon : '../images/icon/shipping.png'
							},
							items : [ 
							         	this.parcelGrid.getPanel()
							]
						}
					]
			});

	return this.tabPanel;

};


ShippingMainView.prototype.load = function(shippingId) {
	var _this = this;
	this.shippingId = shippingId;
	
	if (shippingId == null){
		Ext.getCmp(this.id + "grid").disable(true);
	}
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
};


/**
* This main class deals with the creation and edition of shipments
*
* @class ShippingMainView
* @constructor
*/
function ShippingMainViewTest() {
	MainView.call(this);
	var _this = this;

    /**
	* 
	* @property shipmentForm
	*/
    this.shipmentForm = new ShipmentForm({width : Ext.getBody().getWidth() - 200});
	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
	});

    /**
	* 
	* @property parcelGrid
	*/
	this.parcelGrid = new ParcelGrid({height : 580, width : Ext.getBody().getWidth() - 200});
	
}

ShippingMainViewTest.prototype.getPanel = function() {
	
    this.panel =  Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        cls : 'border-grid',
        items : [
                    this.shipmentForm.getPanel(),
                    this.parcelGrid.getPanel()
        ]
	});

    return this.panel;
};


ShippingMainViewTest.prototype.load = function(shippingId) {
	var _this = this;
	this.shippingId = shippingId;
	
	if (shippingId == null){
		Ext.getCmp(this.id + "grid").disable(true);
	}
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

function AuthenticationForm(){
	this.onAuthenticate = new Event(this);
}
AuthenticationForm.prototype.show = function(){
	this.window = Ext.create('Ext.window.Window', {
	    title: 'Authentication <span style="FONT-SIZE:9PX;color:red;">[INTRANET ONLY]</span>',
	    height: 250,
	    closable :  false,
	    width: 400,
	    modal : true,
	    layout: 'fit',
	    items: [
	            this.getPanel()
        ]}
	);
	this.window.show();
};

AuthenticationForm.prototype.getPanel = function(){
	var _this = this;
	var sites = Ext.create('Ext.data.Store', {
	    fields: ['name', 'url', 'exiUrl'],
	    data : ExtISPyB.sites
	});
	
	return Ext.create('Ext.form.Panel', {
	    bodyPadding: 5,
	    width: 350,
	    layout: 'anchor',
       
	    defaults: {
	        anchor: '90%'
	    },
	    // The fields
	    defaultType: 'textfield',
	    items: [{
	        fieldLabel: 'User',
	        name: 'user',
	        margin : '10 0 0 10',
	        allowBlank: false
	    },{
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
	    }],

	    buttons: [ {
	        text: 'Login',
	        formBind: true,
	        disabled: true,
	        handler: function() {
	        	var form = this.up('form').getForm();
	        	
	        	var exiUrl;
	        	var properties = null;
	        	for (var i =0; i< ExtISPyB.sites.length; i++){
	        		if (ExtISPyB.sites[i].url == form.getFieldValues().site){
	        			properties = ExtISPyB.sites[i];
	        		}
	        		
	        	}
	        	_this.onAuthenticate.notify({
	        		user : form.getFieldValues().user, 
	        		password : form.getFieldValues().password, 
	        		site : form.getFieldValues().site,
	        		exiUrl : properties.exiUrl,
	        		properties : properties
	        	});

	        }
	    }]
	});
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
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;

	this.isSaveButtonHidden = false;
	this.isHidden = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onSavedClick = new Event(this);
}

/**
* It inserts a panel into the this.panel with the template parcelformsummary
*
* @method addHeaderPanel
*/
ParcelPanel.prototype.addHeaderPanel = function() {
	var html = "No information";
	dust.render("parcelformsummary", this.dewar, function(err, out){
		html = out;
    });
	this.panel.insert(
				{
					xtype 	: 'container',
					width	: 200,
					border : 1,
					padding : 20,
					items 	: [	{html : html}
				
					]
				}
	);
};

ParcelPanel.prototype.render = function() {
	debugger
	var dewar = this.dewar;
	this.panel.removeAll();

	this.addHeaderPanel();
	
	if (dewar != null){
		if (dewar.containerVOs != null){
			/** Sorting container by id **/
			dewar.containerVOs.sort(function(a, b){return a.containerId - b.containerId;});
			for (var i = 0; i< dewar.containerVOs.length; i++){
				var container = dewar.containerVOs[i];
				/** Adding the puck layout **/
				var puckPanel = new PuckPanel({height : 200});
				debugger
				this.panel.insert(puckPanel.getPanel());
				puckPanel.load(container);
				
			}
		}
	}
};

ParcelPanel.prototype.load = function(dewar) {
	this.dewar = dewar;
	try {
		/** Rendering pucks **/
		this.render();
	}
	catch(e){
		console.log(e);
	}
};

/**
* It inserts a new puck into the dewar and reloads the widget
*
* @method addPuckToDewar
*/
ParcelPanel.prototype.addPuckToDewar = function() {
	var _this = this;
	var onSuccess = function(sender, puck){
		_this.dewar.containerVOs.push(puck);
		_this.load(_this.dewar);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addPuck(this.dewar.dewarId, this.dewar.dewarId);
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
	    listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null){
						_this.render(_this.puck);
				}
			}
	    },
	    buttons : [ {
						text : 'Save',
						handler : function() {
							_this.onSavedClick.notify(caseForm.getDewar());
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
};

ParcelPanel.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	
	
	actions.push(this.code);
	actions.push(this.status);
	actions.push(this.storageCondition);
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/edit.png',
		text : 'Edit',
		disabled : false,
		handler : function(widget, event) {
					_this.showCaseForm();
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/print.png',
		text : 'Print Labels',
		disabled : false,
		handler : function(widget, event) {
			var dewarId = _this.dewar.dewarId;
			var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(dewarId, dewarId);
			location.href = url;
			return;
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add puck',
		disabled : false,
		handler : function(widget, event) {
			_this.addPuckToDewar();
		}
	}));
	
	return actions;
};


ParcelPanel.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		layout 		: 'hbox',
		cls 		: "border-grid",
		margin 		: 10,
		height 		: this.height,
		width 		: this.width,
		autoScroll	: true,
		items 		: [],
		listeners : {
			afterrender : function(component, eOpts) {
						_this.render();
			}
	    }
	});
	
	this.panel.addDocked({
		id 		: _this.id + 'tbar',
		height 	: 45,
		xtype 	: 'toolbar',
		items 	: _this._getTopButtons(),
		cls 	: 'exi-top-bar'
	});
	return this.panel;
};


/**
* This is a form  for parcels. It includes all items includes in a parcel. Include pucks
*
* @class ParcelPanelTest
* @constructor
*/
function ParcelPanelTest(args) {
	this.id = BUI.id();
	this.height = 500;
	this.width = 500;

	this.isSaveButtonHidden = false;
	this.isHidden = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onSavedClick = new Event(this);
}

/**
* It inserts a panel into the this.panel with the template parcelformsummary
*
* @method addHeaderPanel
*/
ParcelPanelTest.prototype.addHeaderPanel = function() {
	var html = "No information";
	dust.render("parcel.header.shipping.template", this.dewar, function(err, out){
		html = out;
    });
    
	this.panel.add(0,
				{
					xtype 	: 'container',
					width	: this.width - 50,
					border : 1,
					padding : 5,
					items 	: [	{html : html}
				
					]
				}
	);
};

ParcelPanelTest.prototype.render = function() {
    var _this = this;

	var dewar = this.dewar;
	this.panel.removeAll();
	this.addHeaderPanel();
	
	if (dewar != null){
		if (dewar.containerVOs != null){

            var pucksPanel = Ext.create('Ext.panel.Panel', {
                layout      : 'hbox',
                cls 		: "border-grid",
                margin 		: 10,
                width       : this.width - 50,
                height       : this.height - 250,
                autoScroll : true,
                items       : []
            });

            this.panel.add(pucksPanel);
			/** Sorting container by id **/
			dewar.containerVOs.sort(function(a, b){return a.containerId - b.containerId;});
            var puckPanelsMap = {};
            var containerIds = [];
            
			for (var i = 0; i< dewar.containerVOs.length; i++){
				var container = dewar.containerVOs[i];
                var puckPanel = new PuckParcelPanel({width : 200, radius : 80, containerId : container.containerId, capacity : container.capacity, code : container.code});
                puckPanel.onPuckRemoved.attach(function (sender, containerId) {
                    _.remove(_this.dewar.containerVOs, {containerId: containerId});
                    _this.load(_this.dewar);
                });
                puckPanel.onPuckSaved.attach(function (sender, puck) {
                    _.remove(_this.dewar.containerVOs, {containerId: puck.containerId});
                    _this.dewar.containerVOs.push(puck);
                    _this.load(_this.dewar);
                });
                puckPanelsMap[container.containerId] = puckPanel;
                containerIds.push(container.containerId);
                pucksPanel.insert(puckPanel.getPanel());
			}
            
            if (!_.isEmpty(puckPanelsMap)) {
                
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
                            puckPanelsMap[containerId].load(samples);
                        });
                    }
                }

                EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerIds);
            }
		}
	}
};

ParcelPanelTest.prototype.load = function(dewar) {
	this.dewar = dewar;
	try {
		/** Rendering pucks **/
		this.render();
	}
	catch(e){
		console.log(e);
	}
};

/**
* It inserts a new puck into the dewar and reloads the widget
*
* @method addPuckToDewar
*/
ParcelPanelTest.prototype.addPuckToDewar = function() {
	var _this = this;
	var onSuccess = function(sender, puck){
		_this.dewar.containerVOs.push(puck);
		_this.load(_this.dewar);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addPuck(this.dewar.dewarId, this.dewar.dewarId);
};

/**
* It displays a window with a case form
*
* @method showCaseForm
*/
ParcelPanelTest.prototype.showCaseForm = function() {
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
	    listeners : {
			afterrender : function(component, eOpts) {
				if (_this.puck != null){
						_this.render(_this.puck);
				}
			}
	    },
	    buttons : [ {
						text : 'Save',
						handler : function() {
							_this.onSavedClick.notify(caseForm.getDewar());
                            _this.render();
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
};

ParcelPanelTest.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	
	
	actions.push(this.code);
	actions.push(this.status);
	actions.push(this.storageCondition);
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/edit.png',
		text : 'Edit',
		disabled : false,
		handler : function(widget, event) {
					_this.showCaseForm();
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/print.png',
		text : 'Print Labels',
		disabled : false,
		handler : function(widget, event) {
			var dewarId = _this.dewar.dewarId;
			var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(dewarId, dewarId);
			location.href = url;
			return;
		}
	}));
	
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add puck',
		disabled : false,
		handler : function(widget, event) {
			_this.addPuckToDewar();
		}
	}));
	
	return actions;
};


ParcelPanelTest.prototype.getPanel = function() {
	var _this = this;

	this.panel = Ext.create('Ext.panel.Panel', {
        title       : 'Parcel',
		cls 		: "border-grid",
		margin 		: 10,
		height 		: this.height,
		width 		: this.width,
		autoScroll	: false,
		items 		: [],
		// listeners : {
		// 	afterrender : function(component, eOpts) {
		// 				_this.render();
		// 	}
	    // }
	});

    this.panel.addDocked({
		id 		: _this.id + 'tbar',
		height 	: 45,
		xtype 	: 'toolbar',
		items 	: _this._getTopButtons(),
		cls 	: 'exi-top-bar'
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





/**
* Renders a panel that contains a puck widget and two buttons
*
* @class PuckParcelPanel
* @constructor
*/
function PuckParcelPanel(args) {
	this.radius = 200;
    this.width = 220;
    this.containerId = 0;
    this.code = "";
    this.data = {puckType : 1, 
                mainRadius : this.radius - 20, 
                x : 20, 
                y : 15, 
                enableMouseOver : true
    };

	if (args != null) {
        if (args.width != null) {
			this.width = args.width;
		}
		if (args.radius != null) {
			this.radius = args.radius;
            this.data.mainRadius = this.radius - 20;
            this.data.x = this.width/2 - this.data.mainRadius;
		}
        if (args.containerId != null) {
			this.containerId = args.containerId;
		}
        if (args.code != null) {
			this.code = args.code;
		}
        if (args.capacity != null) {
			if (args.capacity != 16) {
                this.data.puckType = 2;
            }
		}
	}

    this.onPuckRemoved = new Event(this);
    this.onPuckSaved = new Event(this);
	
};

/**
* Returns the panel containing the puck and the buttons
*
* @class load
* @return The panel containing the puck and the buttons
*/
PuckParcelPanel.prototype.getPanel = function () {

    this.puck = new PuckWidgetContainer(this.data);

    this.puckPanel = Ext.create('Ext.panel.Panel', {
        width : this.width,
        height : 2*this.radius,
        // cls : 'border-grid',
        items : [this.puck.getPanel()]
	});

    this.panel = Ext.create('Ext.panel.Panel', {
        // cls : 'border-grid',
        width : this.width,
        height : 2*this.radius + 70,
        items : [{
                    html : this.getCodeHeader(),
                    margin : 5,
                    x : this.data.x
                },
                this.puckPanel,
                this.getButtons()]
	});

    return this.panel;
};

/**
* Loads the puck with the given samples
*
* @class load
* @return
*/
PuckParcelPanel.prototype.load = function (samples) {
    this.puck = new PuckWidgetContainer(this.data);
    this.puckPanel.removeAll();
    this.puckPanel.add(this.puck.getPanel());
    
    this.puck.loadSamples(samples);
    this.containerId = this.puck.puckWidget.containerId;
};

/**
* Returns a panel with the buttons
*
* @class getCodeHeader
* @return The html of the code header
*/
PuckParcelPanel.prototype.getCodeHeader = function () {
    var templateData = {info : [{
                                    text : 'Code',
                                    value : this.code
                                }]
    }
    var html = "";
    dust.render("info.grid.template", templateData, function(err, out){
		html = out;
	});
    return html;
};


/**
* Returns a panel with the buttons
*
* @class getButtons
* @return A panel with the buttons
*/
PuckParcelPanel.prototype.getButtons = function () {
    var _this = this;

    this.buttons = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'hbox',
            align: 'middle',
            pack: 'center'
        },
        width : this.width,
        height : 40,
        items : [
                {
                xtype: 'button',
                margin : 5,
                icon : '../images/icon/edit.png',
                text : 'Edit',
                handler : function(widget, e) {
                    var puckForm = new PuckForm({
                        width : Ext.getBody().getWidth() - 150
                    });

                    puckForm.onRemoved.attach(function(sender, containerId){
                        _this.onPuckRemoved.notify(containerId);
                        window.close();
                    });
                    puckForm.onSaved.attach(function(sender, puck){
                        _this.onPuckSaved.notify(puck);
                        window.close();
                    });
                    var window = Ext.create('Ext.window.Window', {
                            title: 'Edit Puck',
                            height: 700,
                            width: Ext.getBody().getWidth() - 100,
                            modal : true,
                            resizable : true,
                            layout: 'fit',
                            items: puckForm.getPanel()
                    }).show();

                    if (_this.containerId != null){
                        var onSuccess = function(sender, puck){
                            puckForm.load(puck);
                        };
                        EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(_this.containerId,_this.containerId,_this.containerId);
                    }
                }
            },{
                xtype: 'button',
                margin : 5,
                icon : '../images/icon/ic_highlight_remove_black_24dp.png',
                text : 'Remove',
                handler: function(){
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
            }
        ]
	});

    return this.buttons;
};

/**
* Removes the puck from the database
*
* @class removePuck
* @return 
*/
PuckParcelPanel.prototype.removePuck = function() {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.panel.setLoading(false);
        _this.onPuckRemoved.notify(_this.containerId);
	};
	var containerId = this.containerId;
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(containerId,containerId,containerId );
	
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
    this.sessions = sessions;
	this.store.loadData(sessions, false);
};

SessionGrid.prototype.filterByBeamline = function(beamlines) {
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
                        _this.beamlineFilter =_.remove(_this.beamlineFilter,a.boxLabel );
                    }
                    _this.filterByBeamline(_this.beamlineFilter);
    };
            
    for (var i =0; i<EXI.credentialManager.getBeamlineNames().length; i++){
        items.push({           
                xtype: 'checkbox',
                boxLabel : EXI.credentialManager.getBeamlineNames()[i],
                name : EXI.credentialManager.getBeamlineNames()[i],
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




