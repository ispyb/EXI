function SAXSExiController() {
    
	this.init();
}

SAXSExiController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;

SAXSExiController.prototype.routeNavigation = function() {
	var _this = this;
	function loadNavigationPanel(listView) {
		return _this.loadNavigationPanel(listView);
	}

	/**
	 * Loading navigation panel
	 * 
	 * #/session/nav #/experiment/nav #/macromolecule/nav
	 * 
	 */
	Path.map("#/saxs/:navigation/nav").to(function() {
		var listView = null;
		
		if (this.params['navigation'] == "buffer") {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new BufferListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/buffer/" + selected[0].bufferId + "/main";
			});
			EXI.addNavigationPanel(listView);
			listView.load(EXI.proposalManager.getBuffers());
			EXI.setLoadingNavigationPanel(false);
			
			/** Loading welcome page **/
			EXI.addMainPanel(new BufferWelcomeMainView());
			
		}
		
		if (this.params['navigation'] == "stocksolution") {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new StockSolutionListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/stocksolution/" + selected[0].stockSolutionId + "/main";
			});
			EXI.addNavigationPanel(listView);
			listView.load(EXI.proposalManager.getStockSolutions());
			EXI.setLoadingNavigationPanel(false);
			
			/** Loading welcome page **/
			EXI.addMainPanel(new StockSolutionWelcomeMainView());
			
		}
		
		if (this.params['navigation'] == "macromolecule") {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new MacromoleculeListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/macromolecule/" + selected[0].macromoleculeId + "/main";
			});
			EXI.addNavigationPanel(listView);
			listView.load(EXI.proposalManager.getMacromolecules());
			EXI.setLoadingNavigationPanel(false);
			
			/** Loading welcome page **/
			EXI.addMainPanel(new MacromoleculeWelcomeMainView());
			
		}
		
		if (this.params['navigation'] == "template") {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			
			listView = new TemplateListView();
			/** When selected move to hash * */
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/experiment/templateId/" + selected[0].experimentId + "/main";
			});
			var adapter = loadNavigationPanel(listView);
			adapter.saxs.experiment.getByExperimentByKey("experimentType", "TEMPLATE");
			
			/** Loading welcome page **/
			EXI.addMainPanel(new ExperimentWelcomeMainView());
		}


	}).enter(this.setPageBackground);

	
};

SAXSExiController.prototype.setPageBackground = function() {

};

SAXSExiController.prototype.notFound = function() {

};

SAXSExiController.prototype.routeExperiment = function() {
	Path.map("#/experiment/experimentId/:experimentId/main").to(function() {
		var mainView = new ExperimentMainView();
		EXI.addMainPanel(mainView);	
		mainView.panel.setLoading();		
		var onSuccess = function(sender, dataCollections){			
			mainView.load(dataCollections);
			mainView.panel.setLoading(false);				
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByExperiment(this.params['experimentId']);
		// EXI.getDataAdapter({onSuccess : onSuccess}).saxs.experiment.getExperimentById(this.params['experimentId']);

	}).enter(this.setPageBackground);
    
    Path.map("#/experiment/session/:sessionId/main").to(function() {
		var mainView = new ExperimentMainView();
		EXI.addMainPanel(mainView);	
		mainView.panel.setLoading();		
		var onSuccess = function(sender, dataCollections){			
			mainView.load(dataCollections);
			mainView.panel.setLoading(false);				
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsBySessionId(this.params['sessionId']);

	}).enter(this.setPageBackground);
    
	
	Path.map("#/experiment/hplc/:experimentId/main").to(function() {
		var mainView = new HPLCMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['experimentId']);
		/** Selecting data collections from experiment * */
		mainView.onSelect.attach(function(sender, element) {
			EXI.localExtorage.selectedSubtractionsManager.append(element);
		});
		mainView.onDeselect.attach(function(sender, element) {
			EXI.localExtorage.selectedSubtractionsManager.remove(element);
		});

	}).enter(this.setPageBackground);
	

	/** Loading Experiments * */
	Path.map("#/experiment/:key/:value/main").to(function() {
		alert("!");
		EXI.setLoadingMainPanel();
		var onSuccess = function(sender, data) {
			EXI.setLoadingMainPanel(false);
			if (data != null) {
				if (data.length > 0) {
					var mainView = null;
					if (data[0].experimentType == "STATIC") {
						mainView = new ExperimentMainView();

					}
					if (data[0].experimentType == "HPLC") {
						mainView = new HPLCMainView();
					}

					if (data[0].experimentType == "TEMPLATE") {
						mainView = new TemplateMainView();
					}

					EXI.addMainPanel(mainView);
					mainView.load(data);
					/** Selecting data collections from experiment * */
					mainView.onSelect.attach(function(sender, element) {
						EXI.localExtorage.selectedSubtractionsManager.append(element);
					});
					mainView.onDeselect.attach(function(sender, element) {
						EXI.localExtorage.selectedSubtractionsManager.remove(element);
					});

				}
			}
		};
		if ((this.params['key'] == "experimentId") || (this.params['key'] == "templateId")) {
			EXI.getDataAdapter({onSuccess : onSuccess}).saxs.experiment.getByExperimentId([ this.params['value'] ]);
		} else {
			EXI.getDataAdapter({onSuccess : onSuccess}).saxs.experiment.getByExperimentByKey(this.params['key'], this.params['value']);
		}

	}).enter(this.setPageBackground);
};





SAXSExiController.prototype.routeDataCollection = function() {
	Path.map("#/datacollection/macromoleculeAcronym/:value/main").to(function() {
		/** Loading navidation menu **/
		    EXI.setLoadingMainPanel("Searching " + this.params['value']+  "...");

			var mainView = new ExperimentMainView();
            EXI.addMainPanel(mainView);	
           		
            var onSuccess = function(sender, dataCollections){			                
                mainView.load(dataCollections);
               
                EXI.setLoadingMainPanel(false);				
            };            
            if (EXI.proposalManager.getMacromoleculeByAcronym(this.params['value']) != null){
                EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByMacromoleculeId(EXI.proposalManager.getMacromoleculeByAcronym(this.params['value']).macromoleculeId);
            }
            else{
                BUI.showError("No Macromolecule Found");
                 EXI.setLoadingMainPanel(false);	
            }


	}).enter(this.setPageBackground);
	
	
	Path.map("#/saxs/datacollection/:key/:value/main").to(function() {
		EXI.setLoadingMainPanel();
		var onSuccess = function(sender, data) {
			var mainView = new DataCollectionMainView();
			EXI.addMainPanel(mainView);
			mainView.load(data);
			EXI.setLoadingMainPanel(false);
			/** Selecting data collections from experiment * */
			mainView.onSelect.attach(function(sender, element) {
				EXI.localExtorage.selectedSubtractionsManager.append(element);
			});
			mainView.onDeselect.attach(function(sender, element) {
				EXI.localExtorage.selectedSubtractionsManager.remove(element);
			});
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByKey(this.params['key'], this.params['value']);
	}).enter(this.setPageBackground);

	Path.map("#/saxs/datacollection/dataCollectionId/:dataCollectionId/primaryviewer").to(function() {		
			var primaryMainView = new PrimaryDataMainView();    
            EXI.addMainPanel(primaryMainView);        		            
			primaryMainView.load(this.params['dataCollectionId']);		
		
	}).enter(this.setPageBackground);
    
    Path.map("#/saxs/datacollection/dataCollectionId/:dataCollectionId/abinitio").to(function() {		
			var primaryMainView = new AbinitioMainView();    
            EXI.addMainPanel(primaryMainView);        		            
			primaryMainView.load(this.params['dataCollectionId']);		
		
	}).enter(this.setPageBackground);
	
	Path.map("#/saxs/datacollection/:key/:value/merge").to(function() {
		var onSuccess = function(sender, data) {
			var primaryMainView = new MergeMainView();
			EXI.addMainPanel(primaryMainView);
			primaryMainView.load(data);

		};
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByKey(this.params['key'], this.params['value']);
	}).enter(this.setPageBackground);
};

SAXSExiController.prototype.routePrepare = function() {
	Path.map("#/buffer/:bufferId/main").to(function() {
		var mainView = new BufferMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['bufferId']);
	}).enter(this.setPageBackground);
	
	Path.map("#/buffer/add").to(function() {
		var mainView = new BufferMainView();
		EXI.addMainPanel(mainView);
	}).enter(this.setPageBackground);
	
	Path.map("#/macromolecule/:macromoleculeId/main").to(function() {
		var mainView = new MacromoleculeMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['macromoleculeId']);
	}).enter(this.setPageBackground);
	
	Path.map("#/macromolecule/add").to(function() {
		var mainView = new MacromoleculeMainView();
		EXI.addMainPanel(mainView);
	}).enter(this.setPageBackground);
	
	Path.map("#/stocksolution/:stocksolutionId/main").to(function() {
		var mainView = new StockSolutionMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['stocksolutionId']);
	}).enter(this.setPageBackground);
	
	Path.map("#/stocksolution/add").to(function() {
		var mainView = new StockSolutionMainView();
		EXI.addMainPanel(mainView);
		mainView.load();
	}).enter(this.setPageBackground);
	
	
	Path.map("#/prepare/stocksolution/main").to(function() {
		var mainView = new StockSolutionMainView();
		EXI.addMainPanel(mainView);
		mainView.load();
	}).enter(this.setPageBackground);
	
	

//	Path.map("#/prepare/macromolecule/main").to(function() {
//		var mainView = new MacromoleculeMainView();
//		EXI.addMainPanel(mainView);
//		mainView.load();
//	}).enter(this.setPageBackground);

	Path.map("#/prepare/templates/main").to(function() {
		var mainView = new ExperimentDesignerMainView();
		EXI.addMainPanel(mainView);
		mainView.load();
	}).enter(this.setPageBackground);
	
	Path.map("#/prepare/shipmentpreparation").to(function() {
		var mainView = new ShipmentPreparationMainView();
		EXI.addMainPanel(mainView);
		mainView.load();
	}).enter(this.setPageBackground);
	
	
	
	

	Path.map("#/prepare/designer").to(function() {
			var mainView = new DesignerMainView();
			EXI.addMainPanel(mainView);
			mainView.load();
			}).enter(this.setPageBackground);
};

SAXSExiController.prototype.init = function() {
	var _this = this;

	function setPageBackground() {
		_this.setPageBackground();
	}
	function notFound() {
		_this.notFound();
	}

	this.routeNavigation();
	this.routeExperiment();
	this.routeDataCollection();
	this.routePrepare();

	

    /** Loading a single session on the navigation panel * */
	Path.map("#/session/nav/:sessionId/session").to(function() {           
        EXI.clearNavigationPanel();
        EXI.setLoadingMainPanel(true);    
		var listView = new SessionSaxsListView();		
		/** When selected move to hash * */
		listView.onSelect.attach(function(sender, selected) {
			if (selected[0].experimentType == "HPLC"){
				location.hash = "/experiment/hplc/" + selected[0].experimentId + "/main";
			}
			if ((selected[0].experimentType == "STATIC")||(selected[0].experimentType == "CALIBRATION")){
				location.hash = "/experiment/experimentId/" + selected[0].experimentId + "/main";
			}
			if (selected[0].experimentType == "TEMPLATE"){
				location.hash = "/experiment/templateId/" + selected[0].experimentId + "/main";
			}
		});
         var onSuccess = function(sender, data){            
		    EXI.addNavigationPanel(listView);
            listView.load(data);            
            EXI.setLoadingMainPanel(false);    
          };
            
         EXI.getDataAdapter({
                onSuccess : onSuccess                
            }).saxs.experiment.getExperimentsBySessionId(this.params['sessionId']); 
            

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
		
		var onError = function(sender, runs) {
			
		};
		
		EXI.getDataAdapter({onSuccess : onSuccess, onError :onError}).exi.offline.getRuns(projectId);
//		exidataAdapter.getRuns(projectId);
	}).enter(this.setPageBackground);
	

	Path.rescue(notFound);

};

function ExiSAXS() {
	 Exi.call(this, {
		 					menu: new SAXSMainMenu(),
                            managerMenu : new ManagerMenu(),
		 					anonymousMenu: new MainMenu(),
		 					controllers : [new SAXSExiController(),  new OfflineExiController(), new ProposalExiController(), new SessionController(), new LabContactExiController()]
	 });
}

ExiSAXS.prototype.loadSelected = Exi.prototype.loadSelected;
ExiSAXS.prototype.addMainPanel = Exi.prototype.addMainPanel;
ExiSAXS.prototype.getSelectedDataCollections = Exi.prototype.getSelectedDataCollections;
ExiSAXS.prototype.addNavigationPanel = Exi.prototype.addNavigationPanel;
ExiSAXS.prototype.clearNavigationPanel = Exi.prototype.clearNavigationPanel;
ExiSAXS.prototype.clearMainPanel = Exi.prototype.clearMainPanel;
ExiSAXS.prototype.setLoadingNavigationPanel = Exi.prototype.setLoadingNavigationPanel;
ExiSAXS.prototype.setError = Exi.prototype.setError;
ExiSAXS.prototype.setLoading = Exi.prototype.setLoading;
ExiSAXS.prototype.setLoadingMainPanel = Exi.prototype.setLoadingMainPanel;
ExiSAXS.prototype.show = Exi.prototype.show;
ExiSAXS.prototype.setAnonymousMenu = Exi.prototype.setAnonymousMenu;
ExiSAXS.prototype.setUserMenu = Exi.prototype.setUserMenu;
ExiSAXS.prototype.setManagerMenu = Exi.prototype.setManagerMenu;
ExiSAXS.prototype.manageMenu = Exi.prototype.manageMenu;
ExiSAXS.prototype.appendDataAdapterParameters = Exi.prototype.appendDataAdapterParameters;
ExiSAXS.prototype.hideNavigationPanel = Exi.prototype.hideNavigationPanel;
ExiSAXS.prototype.showNavigationPanel = Exi.prototype.showNavigationPanel;

ExiSAXS.prototype.getHeader = function(){
    var html = "";
    var data = {
        version         : ExtISPyB.version,
        release_date    : ExtISPyB.release_date
       
        
    };
    dust.render("saxsheader", data, function(err, out){
		html = out;
     });
    return html;	
};

ExiSAXS.prototype.getDataAdapter = function(args){
	return new SaxsDataAdapterFactory(this.appendDataAdapterParameters(args));
};


function SAXSMainMenu() {
	this.id = BUI.id();
	MainMenu.call(this, {isHidden : false, cssClass : 'mainMenu'});
}

SAXSMainMenu.prototype.populateCredentialsMenu = MainMenu.prototype.populateCredentialsMenu;
SAXSMainMenu.prototype.init = MainMenu.prototype.init;
SAXSMainMenu.prototype.getPanel = MainMenu.prototype.getPanel;
SAXSMainMenu.prototype._convertToHTMLWhiteSpan = MainMenu.prototype._convertToHTMLWhiteSpan;
SAXSMainMenu.prototype.getAddCredentialMenu = MainMenu.prototype.getAddCredentialMenu;
SAXSMainMenu.prototype.getLoginButton = MainMenu.prototype.getLoginButton;
SAXSMainMenu.prototype.setText = MainMenu.prototype.setText;
SAXSMainMenu.prototype.getHelpMenu = MainMenu.prototype.getHelpMenu;
SAXSMainMenu.prototype.getHomeItem = MainMenu.prototype.getHomeItem;
SAXSMainMenu.prototype.getShipmentItem = MainMenu.prototype.getShipmentItem;


SAXSMainMenu.prototype.getMenuItems = function() {	
    		
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




SAXSMainMenu.prototype.getPreparationMenu = function() {
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


SAXSMainMenu.prototype.getDataReductionMenu = function() {
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



SAXSMainMenu.prototype.getDataExplorerMenu = function() {
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

SAXSMainMenu.prototype.getOnlineDataAnalisysMenu = function() {
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


function BufferListView(){
	ListView.call(this);
}

BufferListView.prototype.getPanel = ListView.prototype.getPanel;
BufferListView.prototype.load = ListView.prototype.load;


BufferListView.prototype.getRow = function(record){
	var html = "<table class='listView'>";
		html = html + "<tr><td>Acronym:</td><td style='color:#207a7a;font-weight:bold;'>" + record.data.acronym+ "</td></tr>";
		html = html + "<tr><td>name:</td><td>" + record.data.name+ "</td></tr>";
	return html + "</table>";
};

BufferListView.prototype.getFilter = function(value){
	return [{property : "acronym", value : value, anyMacth : true}];
};

BufferListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Buffers',  flex: 1, dataIndex: 'bufferId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

BufferListView.prototype.getFields = function(){
	return  ['acronym', 'name'];
};


function DataCollectionListView(){
	ListView.call(this);
}

DataCollectionListView.prototype.getPanel = ListView.prototype.getPanel;
DataCollectionListView.prototype.load = ListView.prototype.load;

DataCollectionListView.prototype.getRow = function(record){
	var html = "<table class='listView'>";
	html = html + "<tr><td>Macromolecule:</td><td >" + record.data.macromoleculeAcronym+ "</td></tr>";
		html = html + "<tr><td>Buffer:</td><td style='color:#207a7a;font-weight:bold;'>" + record.data.bufferAcronym+ "</td></tr>";
		html = html + "<tr><td>Count:</td><td>" + record.data.dataCollections+ "</td></tr>";
	return html + "</table>";
};

DataCollectionListView.prototype.getFilter = function(value){
	return [{property : "bufferAcronym", value : value, anyMacth : true}];
};

DataCollectionListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Data Collections',  flex: 1, dataIndex: 'bufferAcronym', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

DataCollectionListView.prototype.getFields = function(){
	return  ['macromoleculeAcronym', 'bufferAcronym', 'macromoleculeId', 'dataCollections'];
};

//DataCollectionListView.prototype.groupBy = function(array , f ){
//  var groups = {};
//  array.forEach( function( o )
//  {
//    var group = JSON.stringify( f(o) );
//    groups[group] = groups[group] || [];
//    groups[group].push( o );  
//  });
//  return Object.keys(groups).map( function( group ){
//	  return groups[group]; 
//  });
//};


/** This groups all the data by bufferId **/
DataCollectionListView.prototype.formatData = function(data){
	data =  BUI.groupBy(data, function(item){
		  return [item.bufferAcronym];
	});
	/** Data is now an array of arrays **/
	
	var results = [];
	for (var i = 0; i < data.length; i++) {
		var item = data[i];
		results.push({
			macromoleculeAcronym : item[0].macromoleculeAcronym,
			macromoleculeId: item[0].macromoleculeId,
			bufferAcronym : item[0].bufferAcronym,
			dataCollections : item.length
		});
	}
	
	return results;
	
};



function MacromoleculeListView(){
	this.sorters = [{property : 'experimentId', direction: 'DESC'}];
	ListView.call(this);
}

MacromoleculeListView.prototype.getPanel = ListView.prototype.getPanel;
MacromoleculeListView.prototype.load = ListView.prototype.load;

MacromoleculeListView.prototype.getRow = function(record){
	var html = "<table class='listView'>";
	html = html + "<tr><td>Acronym:</td><td style='color:#207a7a;font-weight:bold;'>" + record.data.acronym+ "</td></tr>";
	html = html + "<tr><td>name:</td><td>" + record.data.name+ "</td></tr>";
	return html + "</table>";
};

MacromoleculeListView.prototype.getFilter = function(value){
	return [{property : "acronym", value : value, anyMacth : true}];
};

MacromoleculeListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Macromolecule',  flex: 1, dataIndex: 'macromoleculeId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

MacromoleculeListView.prototype.getFields = function(){
	return  ['acronym', 'name', 'comments'];
};


function SessionSaxsListView(){
	this.sorters = [{property : 'experimentId', direction: 'DESC'}];
	ListView.call(this);
}

SessionSaxsListView.prototype.getPanel = ListView.prototype.getPanel;
SessionSaxsListView.prototype.load = ListView.prototype.load;

SessionSaxsListView.prototype.parseStatistics = function(done, total){
    if (total){
        if (done){
            try{
                return (done/total)*100;
            }   
            catch(err){
                return 0;
            }
            
        }        
    }
    return 0;
};
SessionSaxsListView.prototype.getRow = function(record){
    var html = '';
   
    record.data.measured = this.parseStatistics(record.data.measurementDoneCount, record.data.measurementCount);
    record.data.averaged = this.parseStatistics(record.data.measurementAveragedCount, record.data.measurementCount);
    record.data.subtracted = this.parseStatistics(record.data.dataCollectionDoneCount, record.data.dataCollectionCount);
    
    dust.render("sessionsaxslistview.template", record.data, function(err, out){
        	html = out;
     	});
	return html;
	/**
     * var color = "black";
	 If experiment is empty then color is gray
		if ((record.data.experimentType != 'HPLC')&&(record.data.measurementDoneCount == 0)&&(record.data.measurementAveragedCount == 0)&&(record.data.dataCollectionDoneCount == 0)){
			color = '#DEDEDE';
		}
		var html = "<table class='listView' style='color:" + color +";'>";
			html = html + "<tr><td colspan='4'>" + record.data.creationDate+ "</td></tr>";
			html = html + "<tr><td colspan='4'>" + record.data.name+ "</td></tr>";
			html = html + "<tr><td style='font-weight:bold;' colspan='4'>" + record.data.experimentType+ "</td></tr>";
			if ((record.data.experimentType == 'STATIC')||(record.data.experimentType == 'CALIBRATION')){
				if ((record.data.measurementDoneCount == 0)&&(record.data.measurementAveragedCount == 0)&&(record.data.dataCollectionDoneCount == 0)){
					html = html + "<tr ><td  style='width:180px;border:1px solid gray;text-align:center;color:" + color +";font-weight:bold;' colspan='4'>EMPTY</td></tr>";
					
				}
				else{
					html = html + "<tr style='margin-left:5px;'><td style='width:10px;'></td><td>Collected:</td><td>"+ record.data.measurementDoneCount +"/" + record.data.measurementCount + "</td><td>" + new ProgressBar().getPanel(record.data.measurementDoneCount, record.data.measurementCount) + "</td></tr>";
					html = html + "<tr><td style='width:10px;'></td><td>Averaged:</td><td>"+ record.data.measurementAveragedCount +"/" + record.data.measurementCount + "</td><td>" + new ProgressBar().getPanel(record.data.measurementAveragedCount, record.data.measurementCount) + "</td></tr>";
					html = html + "<tr><td style='width:10px;'></td><td>Subtracted:</td><td>"+ record.data.dataCollectionDoneCount +"/" + record.data.dataCollectionCount + "</td><td>" + new ProgressBar().getPanel(record.data.dataCollectionDoneCount, record.data.dataCollectionCount) + "</td></tr>";
				}
			}
	return html + "</table>"; **/
};

SessionSaxsListView.prototype.getFilter = function(value){
	return [{property : "name", value : value, anyMacth : true}];
};

SessionSaxsListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Experiment',  flex: 1, dataIndex: 'sessionId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

SessionSaxsListView.prototype.getFields = function(){
	return  ['creationDate', 'name', 'experimentType'];
};


function StockSolutionListView(){
	this.sorters = [{property : 'experimentId', direction: 'DESC'}];
	ListView.call(this);
}

StockSolutionListView.prototype.getPanel = ListView.prototype.getPanel;
StockSolutionListView.prototype.load = ListView.prototype.load;
StockSolutionListView.prototype.getFilter = ListView.prototype.getFilter;
StockSolutionListView.prototype.getFields = ListView.prototype.getFields;
StockSolutionListView.prototype.getColumns = ListView.prototype.getColumns;


/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
StockSolutionListView.prototype.getRow = function(record){
	var html = "";
	if (EXI.proposalManager.getBufferById(record.data.bufferId)){
		record.data.bufferAcronym = EXI.proposalManager.getBufferById(record.data.bufferId).acronym;
	}
	if (EXI.proposalManager.getMacromoleculeById(record.data.macromoleculeId)){
		record.data.macromoleculeAcronym = EXI.proposalManager.getMacromoleculeById(record.data.macromoleculeId).acronym;
	}
	dust.render("stocksolution.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};

function TemplateListView(){
	this.sorters = [{property : 'experimentId', direction: 'DESC'}];
	ListView.call(this);
}

TemplateListView.prototype.getPanel = ListView.prototype.getPanel;
TemplateListView.prototype.load = ListView.prototype.load;

TemplateListView.prototype.getRow = function(record){
	var color = "black";
	var html = "<table class='listView' style='color:" + color +";'>";
	html = html + "<tr style='font-weight: bold;font-size:14px; color:#207a7a;'><td colspan='4'>" + record.data.name+ "</td></tr>";
	html = html + "<tr><td style='font-weight:bold;' colspan='4'>" + record.data.comments+ "</td></tr>";
	html = html + "<tr ><td colspan='4'>" + record.data.creationDate+ "</td></tr>";
	return html + "</table>";
};

TemplateListView.prototype.getFilter = function(value){
	return [{property : "name", value : value, anyMatch : true}];
};

TemplateListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { 
		        	text: 'Experiment',  
		        	flex: 1, 
		        	dataIndex: 'sessionId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        	} 
		        }
		    ];
};

TemplateListView.prototype.getFields = function(){
//	debugger
//	return  ['creationDate', 'name', 'experimentType'];
	return  [
	         	{name : 'creationDate', type : 'string'}, 
	        	{name : 'name', type : 'string'}, 
	        	{name : 'experimentType', type : 'string'} 
	         ];
};


function AbinitioMainView() {		
	MainView.call(this);
				
	/** Abinitio **/
	this.abinitioForm = new AbinitioForm({
		height : 700
	});	
}


AbinitioMainView.prototype.getPanel = function() {
	return this.abinitioForm.getPanel()
};

AbinitioMainView.prototype.load = function(dataCollectionId) {
	var _this = this;
	
	var onSuccess = function (sender, dataCollections) {        
		if (dataCollections){
            if (dataCollections[0].Subtraction_subtractionId){
                   var onSuccessSubtraction = function(sender, subtractions) {                 
                        _this.abinitioForm.load(subtractions);
                    };			
                    EXI.getDataAdapter({onSuccess : onSuccessSubtraction}).saxs.subtraction.getSubtractionsBySubtractionIdList([dataCollections[0].Subtraction_subtractionId]);	                  
            }
        }
	}
	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsById(dataCollectionId);
};


function BufferMainView() {
	
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	this.bufferForm = new BufferForm({
		height : 800,
		collapsed : false,
		tbar : true
	});
	
	var _this = this;
//	this.bufferGrid.onUpdated.attach(function(sender){
//		_this.load();
//	});
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

BufferMainView.prototype.getPanel = MainView.prototype.getPanel;

BufferMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    margin : 15,
//		bodyStyle : {
//			"background-color" : "#E6E6E6" 
//		},
	    border: 1,
//	    style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
	    defaults: {
	        labelWidth: 80,
//	        xtype: 'datefield',
	        flex: 1,
	    },
	    items: [this.bufferForm.getPanel([])]
	});
};


BufferMainView.prototype.load = function(bufferId) {
//	this.bufferGrid.load(EXI.proposalManager.getBuffers());
	this.panel.setTitle("Buffer");
	this.bufferForm.load(EXI.proposalManager.getBufferById(bufferId));
};

function BufferWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Macromolecules";
	this.closable = false;
}

BufferWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
BufferWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

BufferWelcomeMainView.prototype.getOptions = function() {
	var html =  "<ul><li>Define beforehand an experiment</li>";
	html = html + "<li>Send your samples by courier</li>";
	return html + "</ul>";
};



BufferWelcomeMainView.prototype.getContainer = function() {
	return  Ext.createWidget('panel',
			{
				plain : true,
				margin : '20',
				layout : 'fit',
				items : [
					{
						tabConfig : {
							title : 'Welcome'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
//							height : 700,
							padding : 10,
							margin : 0,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="landing-title" ><h2>Buffers on ISPyB</h2></div>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : '<div class="landing-text">A buffer is the matched solution which in a sample is suspended</div><br/>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : '<div class="landing-text">You should define a macromolecule on ISPyB if you want:</div>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : this.getOptions(),
							        	 margin : '0 0 0 40'
							         },
							         
							         {
							        	 html : '<br/><div class="landing-text">If your macromolecule is not in the list showed on the left you can create a new one</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	xtype : 'container',
							        	layout : 'hbox',
							        	cls : 'option-bar-menu',
							        	items :[
							        	    
										         {
										        	 xtype : 'button',
										        	 cls : 'square-option',
										        	 maxWidth : 200,
										        	 minWidth : 200,
										        	 margin : '0 0 0 150',
										        	 height : 100,
										        	 text : '<div class="square-option-text"; >Add a new buffer</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/buffer/add';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


BufferWelcomeMainView.prototype.load = function() {
	
};

function DataCollectionMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';

	MainView.call(this);

	this.grid = new OverviewQueueGrid({
		positionColumnsHidden : true,
		maxHeight : Ext.getCmp("main_panel").getHeight() - 50,
		padding : 40,
		sorters : [ {
			property : 'macromoleculeAcronym',
			direction : 'ASC' } ] });
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

DataCollectionMainView.prototype.getPanel = MainView.prototype.getPanel;
DataCollectionMainView.prototype.getContainer = MainView.prototype.getContainer;

DataCollectionMainView.prototype.filter = function(macromoleculeAcronym, bufferAcronym) {
	this.grid.key = {};
	this.grid.filter("bufferAcronym",bufferAcronym);
};

DataCollectionMainView.prototype.load = function(selected) {
	var _this = this;
	

	this.grid.onSelectionChange.attach(function(sender, elements) {
		_this.onSelectionChange.notify(elements);
	});

	this.grid.onSelect.attach(function(sender, selected) {
		_this.onSelect.notify(selected);
	});
	this.grid.onDeselect.attach(function(sender, unselected) {
		_this.onDeselect.notify(unselected);
	});

	this.container.insert(0, this.grid.getPanel());

	//this.grid.panel.setLoading();
	this.grid.load(selected);
	//this.grid.panel.setLoading(false);
};

function DesignerMainView() {
	
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	var _this = this;
	
	
	this.wizardWidget = new WizardWidget({
		windowMode : true,
		width : 1200 });
//
	this.wizardWidget.onFinished.attach(function(sender, result) {
//		wizardWidget.window.close();
		EXI.setLoading();
		var onSuccess = function(sender, experiment) {
			location.hash = "/experiment/templateId/" + experiment.experimentId + "/main";
		};
//		wizardWidget.current.setLoading("ISPyB: Creating experiment");
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.template.saveTemplate(result.name, result.comments, result.data);
	});
//
//	wizardWidget.draw(new MeasurementCreatorStepWizardForm(EXI.proposalManager.getMacromolecules(),EXI.proposalManager.getBuffers()));
		
		
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

DesignerMainView.prototype.getPanel = MainView.prototype.getPanel;

DesignerMainView.prototype.getContainer = function() {
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
	    items: [this.wizardWidget.getPanel(new MeasurementCreatorStepWizardForm(EXI.proposalManager.getMacromolecules(),EXI.proposalManager.getBuffers()))]
	});
};


DesignerMainView.prototype.load = function(bufferId) {
//	this.bufferGrid.load(EXI.proposalManager.getBuffers());
	this.panel.setTitle("Experiment Designer");
	
};

function ExperimentDesignerMainView() {
	
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	this.templateGrid = new TemplateGrid({
		minHeight : 300,
		height : 440,
		gridType : 'Ext.grid.Panel',
		title : 'Experiments',
		grouping : false,
		tbar : true
	});
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

ExperimentDesignerMainView.prototype.getPanel = MainView.prototype.getPanel;

ExperimentDesignerMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    margin : 30,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
	    border: 1,
	    style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
	    defaults: {
	        labelWidth: 80,
	        xtype: 'datefield',
	        flex: 1,
	    },
	    items: [this.templateGrid.getPanel([])]
	});
};

ExperimentDesignerMainView.prototype.load = function() {
	var _this = this;
	this.panel.setLoading();
	var manager = new ProposalUpdater(); 
	this.templateGrid.grid.setLoading();
	manager.onSuccess.attach(function(sender, proposals){
		_this.panel.setLoading(false);
		var adapter = new DataAdapter();
		adapter.onSuccess.attach(function(sender, experiments){
			_this.templateGrid.store.loadData(experiments);
			_this.templateGrid.grid.setLoading(false);
		});
		
		adapter.getByExperimentByKey("experimentType", "TEMPLATE");
	});
	manager.get();
	
	this.panel.setTitle("Experiment Designer");
};

function ExperimentMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	// this.experimentHeaderForm = new ExperimentHeaderForm();
	var _this = this;
	/** Viscosity **/
	var storeViscosity = Ext.create('Ext.data.Store', {
		fields : [ 'name' ],
		data : [ {
			"name" : "low"
		}, {
			"name" : "medium"
		}, {
			"name" : "high"
		} ]
	});

	// Create the combo box, attached to the states data store
	// var viscosityEditor = Ext.create('Ext.form.ComboBox', {
	// 	fieldLabel : '',
	// 	store : storeViscosity,
	// 	queryMode : 'local',
	// 	displayField : 'name',
	// 	valueField : 'name'
	// });
	
	
	/** Specimen Widget contains a specimenGrid and a sampleChangerWidget than can be displayed with are vertical or horizontal layout **/
	this.specimenWidget = new SpecimenWidget({
		height : this.height,
		width : 1200
	});
	
	this.measurementGrid = new MeasurementGrid();
	
	this.queueGrid = new OverviewQueueGrid({
		positionColumnsHidden : true,
//		maxHeight : Ext.getCmp("main_panel").getHeight() - 50,
		sorters : [ {
			property : 'macromoleculeAcronym',
			direction : 'ASC'
		} ]
	});

	this.activePanel = this.queueGrid;
	
}


ExperimentMainView.prototype.getToolBar = function() {
    var _this = this;
    function onMenuClicked(widget){
        if (_this.activePanel != widget){
            _this.activePanel = widget;
			_this.load(_this.dataCollections);
        }
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'Online Data Analysis',
            handler: function(){
                onMenuClicked(_this.queueGrid);
            }
        },{
            text: 'Measurements',            
            handler: function(){
                onMenuClicked(_this.measurementGrid);
            }
        },{
            text: 'Sample Plate Setup',            
            handler: function(){
                onMenuClicked(_this.specimenWidget);
            }
        }]
   });
    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
		
        items: [
           {
                text:'View',
                iconCls: 'bmenu',  // <-- icon
                menu : menu  // assign menu by instance
            }
        ]
    });
};

ExperimentMainView.prototype.getPanel = function() {

	this.panel = Ext.create('Ext.panel.Panel', {   
		margin : 10,
		// minHeight : 900,
		layout : 'fit',
		minHeight : 600,
		tbar : this.getToolBar(),
		items: []
	});
	return this.panel;
};

ExperimentMainView.prototype.load = function(dataCollections) {
	this.dataCollections = dataCollections;
	this.panel.removeAll();
	this.panel.insert(this.activePanel.getPanel());
	this.activePanel.load(dataCollections);	
};
function ExperimentWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Welcome";
	this.closable = false;
}

ExperimentWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
ExperimentWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

ExperimentWelcomeMainView.prototype.getContainer = function() {
	return  Ext.createWidget('panel',
			{
				plain : true,
				margin : '10',
				layout : 'fit',
				items : [
					{
						tabConfig : {
							title : 'Welcome'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							padding : 20,
							margin : 0,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="landing-title" ><h2>Designing your experiment on ISPyB</h2></div>'
							         },
							         {
							        	 html : '<div class="landing-text">A experiment is a set of measurements of samples.</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	xtype : 'container',
							        	layout : 'hbox',
							        	cls : 'option-bar-menu',
							        	items :[
							        	    
										         {
										        	 xtype : 'button',
										        	 cls : 'square-option',
										        	 maxWidth : 200,
										        	 minWidth : 200,
										        	 margin : '0 0 0 150',
										        	 height : 100,
										        	 text : '<div class="square-option-text"; >Create a new Experiment</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/prepare/designer';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


ExperimentWelcomeMainView.prototype.load = function() {
	
};

function HPLCMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	this.grid = new OverviewQueueGrid({
		height : 220 });

	this.grid.onSelectionChange.attach(function(sender, elements) {
		_this.onSelectionChange.notify(elements);
	});

	this.grid.onSelect.attach(function(sender, selected) {
		_this.onSelect.notify(selected);
	});

	this.grid.onDeselect.attach(function(sender, unselected) {
		_this.onDeselect.notify(unselected);
	});

	var _this = this;
	_this.annotations = [];
	_this.selectedFrameNumber = [];
	this.hplcGraph = new HPLCGraph({
		title : 'I0',
		width : 300,
		height : 300,
		bbar : true,
		plots : {
			"I0" : true,
			"Rg" : true },
		xlabel : "Frames",
		scaled : true,
		interactionModel : {
			'dblclick' : function(event, g, context) {
				//_this.selectedFrameNumber.push(g.lastx_);
                _this.selectedFrameNumber = [g.lastx_];
				_this.plotter.loadHPLCFrame(_this.experimentId, _this.selectedFrameNumber);
				/*_this.annotations.push({
					series : g.selPoints_[0].name,
					x : g.lastx_,
					width : 30,
					height : 23,
					tickHeight : 2,
					shortText : g.lastx_,
					text : g.lastx_,
					attachAtBottom : true });*/
                    _this.annotations= [({
					series : g.selPoints_[0].name,
					x : g.lastx_,
					width : 30,
					height : 23,
					tickHeight : 2,
					shortText : g.lastx_,
					text : g.lastx_,
					attachAtBottom : true })];
				g.setAnnotations(_this.annotations);
                
                /** Summary Panel */
                var summary = {
                        frame :  _this.selectedFrameNumber,
                        quality : _.find(_this.hplcGraph.hplcData, {param : 'quality'}).data[_this.selectedFrameNumber],
                        Qr : _.find(_this.hplcGraph.hplcData, {param : 'Qr'}).data[_this.selectedFrameNumber],
                        Vc : _.find(_this.hplcGraph.hplcData, {param : 'Vc'}).data[_this.selectedFrameNumber],
                        Mass : _.find(_this.hplcGraph.hplcData, {param : 'Mass'}).data[_this.selectedFrameNumber],
                        Rg : _.find(_this.hplcGraph.hplcData, {param : 'Rg'}).data[_this.selectedFrameNumber],
                        I0 : _.find(_this.hplcGraph.hplcData, {param : 'I0'}).data[_this.selectedFrameNumber],
                        downloadURL : EXI.getDataAdapter().saxs.hplc.getDownloadHDF5FramesURL(_this.experimentId, _this.selectedFrameNumber, _this.selectedFrameNumber)
                }
                
                
                
               
                var html = "";
                dust.render("summary.hplcmainview.template", [summary], function(err, out) {
                                                                                                                                       
                    html = html + out;
                });
                $('#' + _this.id + "summary").html(html);
                
			} 
        } 
    });

	this.hplcGraph.onClearSelection.attach(function(sender) {
		_this.annotations = [];
		_this.selectedFrameNumber = [];
		_this.hplcGraph.dygraphObject.dygraph.setAnnotations([]);
	});

	this.plotter = new CurvePlotter({
		margin : 10,
        width : 300
     });

	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

HPLCMainView.prototype.getPanel = MainView.prototype.getPanel;


HPLCMainView.prototype.getHeader = function(beamlineName, startDate) {
	return "<span class='item'>" + beamlineName + "</span><span class='item_description'>" + startDate + "</span>";
};

HPLCMainView.prototype.getPlotContainer = function() {
	return  {
                xtype : 'container',
                cls : 'defaultGridPanel',
                layout : 'hbox',
                border : 1,
                defaults : {height : 400 },
		        items : [ this.hplcGraph.getPanel(), this.plotter.getPanel()
		] };
};


HPLCMainView.prototype.getSecondaryContainer = function() {
	return  {
                xtype : 'container',
                cls : 'defaultGridPanel',
                layout : 'hbox',
                border : 0,
                defaults : {height : 400 },
		        items : [
                    {
                        html : '<div style="text-align:center;" class="alert alert-info" role="alert">Select a frame by double-clicking on the HPLC Frames plot</div>',
                        margin : 10,
                        flex : 1
                    },
                    {
                        html : '<div id="' + this.id + 'summary"></div>',
                        margin : 10,
                        flex : 1
                    }
                    
                ] };
};

HPLCMainView.prototype.getContainer = function() {
    
	return {
		xtype : 'container',
        margin : 10,
		items : [ 
            
            {
              html : '<div id="' + this.id +'header"></div>',
              margin : 10 ,
              height : 160 
            },
            {
              html : ' <div class="panel panel-primary"><div class="panel-heading">Data Collection</div></div>',
              margin : 10 ,
              height : 40 
            },
           
            this.grid.getPanel(), 
              {
              html : '<div class="panel panel-primary"><div class="panel-heading">Size-exclusion chromatography</div></div>',
              margin : 10 ,
              height : 40 
            },
            this.getPlotContainer(), 
            this.getSecondaryContainer()
             ] };
};

HPLCMainView.prototype.getSelected = function() {
	var selected = [];
	for (var i = 0; i < this.queueGridList.length; i++) {
		selected = this.queueGridList[i].getSelected().concat(selected);
	}
	return selected;
};

HPLCMainView.prototype.loadHPLCGraph = function(experimentId) {
	var _this = this;
	var onSuccess = function(sender, data) {
		data = JSON.parse(data);
		var zeroArray = [];
		for (var i = 0; i < data.I0.length; i++) {
			zeroArray.push(0);
		}
		data = [ {
			param : "I0",
			data : data.I0,
			std : data.I0_Stdev,
			color : '#0066CC',
			label : "I0" }, {
			param : "sum_I",
			label : "sum_I",
			color : "#00FF00",
			data : data.sum_I,
			std : zeroArray }, {
			param : "Rg",
			label : "Rg",
			color : "#21610B",
			data : data.Rg,
			std : data.Rg_Stdev }, {
			param : "Mass",
			data : data.mass,
			std : data.mass_Stdev,
			color : '#FF9900',
			label : "Mass" }, {
			param : "Vc",
			data : data.Vc,
			std : data.Vc_Stdev,
			color : '#990099',
			label : "Vc" }, {
			param : "Qr",
			data : data.Qr,
			std : data.Qr_Stdev,
			color : '#FF0066',
			label : "Qr" }, {
			param : "quality",
			label : "quality",
			color : "#FF00FF",
			data : data.quality,
			std : zeroArray } ];
		_this.hplcGraph.loadData(data, experimentId);
        
	};

	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.hplc.getHPLCOverviewByExperimentId(experimentId);
};

HPLCMainView.prototype.load = function(experimentId) {
		var _this = this;
		this.experimentId = experimentId;
	
		var onSuccess = function(sender, data) {  
            if (data){          
			    _this.grid.load(data);
                if (data[0]){
                    var header = {
                        creationDate : data[0].Experiment_creationDate,
                        name : data[0].Experiment_name,
                        type : data[0].Experiment_experimentType,
                        hdf5 : data[0].Experiment_dataAcquisitionFilePath,
                        url : EXI.getDataAdapter().saxs.hplc.getDownloadHDF5URL(data[0].Experiment_experimentId)
                    }
                    
                    /** Renedering header */
                     var html = "";
                     
                    dust.render("header.hplcmainview.template", header, function(err, out) {
                                                                                                                                        
                        html = html + out;
                    });
                    $('#' + _this.id + "header").html(html);
                }
            }			
		};

		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByExperiment(experimentId);
		this.loadHPLCGraph(experimentId);
};

function MacromoleculeMainView() {
	
	this.icon = '../images/icon/macromolecule.png';
	this.queueGridList = [];

	MainView.call(this);

	this.macromoleculeForm = new MacromoleculeForm({
		height : 800,
		collapsed : false,
		tbar : true
	});
	
	this.rigidBodyModelingForm = new RigidBodyModelingForm({
//		width : this.width - 30,
//		height : this.height - 50,
	});
	
	this.rigidBodyModelingForm.onSave.attach(function(sender, macromolecule) {
//		_this.onSave.notify(macromolecule);
	});
	
	
	var _this = this;
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

MacromoleculeMainView.prototype.getPanel = MainView.prototype.getPanel;

MacromoleculeMainView.prototype.getHeader = function(beamlineName, startDate) {
	return "<span class='item'>" + beamlineName + "</span><span class='item_description'>" + startDate + "</span>";
};

MacromoleculeMainView.prototype.getSelected = function() {
	var selected = [];
	for (var i = 0; i < this.queueGridList.length; i++) {
		selected = this.queueGridList[i].getSelected().concat(selected);
	}
	return selected;
};

MacromoleculeMainView.prototype.getTabs = function() {
	return  Ext.createWidget('tabpanel',
			{
				plain : true,
//				margin : '5 0 0 0',
				items : [
					{
						tabConfig : {
							title : 'General'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							height : 600,
							padding : 0,
							items : [ 
							         
							         this.macromoleculeForm.getPanel()
							]
						}

						]
					},
					{
						tabConfig : {
							title : 'Advanced'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							height : 500,
							padding : 0,
							items : [ 
							         this.rigidBodyModelingForm.getPanel()
							]
						}

						]
					}
			]});
};


MacromoleculeMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'anchor'
	    },
	    defaults : {
			anchor : '100%',
			hideEmptyLabel : false },
	    margin : 30,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
	    items: [
	            this.getTabs()
	            ]
	});
};


MacromoleculeMainView.prototype.load = function(macromoleculeId) {
	this.panel.setLoading();
	var macromolecule = EXI.proposalManager.getMacromoleculeById(macromoleculeId);
	this.panel.setTitle(macromolecule.acronym);
	this.macromoleculeForm.load(macromolecule);
	this.rigidBodyModelingForm.load(macromolecule);
	this.panel.setLoading(false);
};

function MacromoleculeWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Macromolecules";
	this.closable = false;
}

MacromoleculeWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
MacromoleculeWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

MacromoleculeWelcomeMainView.prototype.getOptions = function() {
	var html =  "<ul><li>Define beforehand an experiment</li>";
	html = html + "<li>Send your samples by courier</li>";
	html = html + "<li>Online data analysis to run apriori data analysis (PDB information will be required on the advanced tab in the macromolecule view)</li>";
	return html + "</ul>";
};

MacromoleculeWelcomeMainView.prototype.getContainer = function() {
	return  Ext.createWidget('panel',
			{
				plain : true,
				margin : '10',
				layout : 'fit',
				items : [
					{
						tabConfig : {
							title : 'Welcome'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							padding : 20,
							margin : 0,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="landing-title" ><h2>Macromolecules on ISPyB</h2></div>'
							         },
							         {
							        	 html : '<div class="landing-text">A macromolecule is a biological contruct for investigation.</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : '<div class="landing-text">You should define a macromolecule on ISPyB if you want:</div>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : this.getOptions(),
							        	 margin : '0 0 0 40'
							         },
							         
							         {
							        	 html : '<br/><div class="landing-text">If your macromolecule is not in the list showed on the left you can create a new one</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	xtype : 'container',
							        	layout : 'hbox',
							        	cls : 'option-bar-menu',
							        	items :[
							        	    
										         {
										        	 xtype : 'button',
										        	 cls : 'square-option',
										        	 maxWidth : 200,
										        	 minWidth : 200,
										        	 margin : '0 0 0 150',
										        	 height : 100,
										        	 text : '<div class="square-option-text"; >Add a new macromolecule</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/macromolecule/add';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


MacromoleculeWelcomeMainView.prototype.load = function() {
	
};

function MergeMainView() {
	this.title = "Primary Data View";
	this.icon = 'images/icon/ic_blur_on_black_18dp.png';
	this.queueGridList = [];

	var _this = this;

	/** Curve plotter * */
	this.plotter = new CurvePlotter({});
	this.formPopulated = false;
	this.plotter.onRendered.attach(function(sender) {
		/** only once * */
		if (!_this.formPopulated) {
			/** colors * */
			var colors = {};
			for (var i = 1; i < sender.getLabels().length; i++) {
				colors[sender.getLabels()[i]] = sender.getColors()[i - 1];
			}

			_this.populateForm(sender.getPointCount(), colors);
			_this.formPopulated = true;
		}
		plotter = sender;
	});
}

MergeMainView.prototype.getPanel = MainView.prototype.getPanel;
MergeMainView.prototype.getContainer = MainView.prototype.getContainer;

MergeMainView.prototype.populateForm = function(pointCount, colors) {
	for (var i = 0; i < this.frames.length; i++) {
		this.editorPanel.add(this.getCurveContainer(this.frames[i].subtractionId, this.frames[i].fileName, 0, 5, this.frames[i].scale,
				pointCount, colors));
	}
};

MergeMainView.prototype.getSelected = function() {
	var selected = [];
	for (var i = 0; i < this.queueGridList.length; i++) {
		selected = this.queueGridList[i].getSelected().concat(selected);
	}
	return selected;
};

MergeMainView.prototype.getCurveContainer = function(subtractionId, fileName, from, to, scale, pointCount, colors) {
	var _this = this;
	return Ext.create('Ext.Panel', {
		width : 380,
		layout : 'vbox',
		border : 1,
		style : {
			// borderColor : colors[fileName],
			borderStyle : 'solid',
			borderWidth : '1px' },
		margin : '10 0 0 5',
		items : [ {
			xtype : 'container',
			margin : '0 0 0 0',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				layout : 'vbox',
				items : [ {
					html : '<span style="font-size:12px;color:' + colors[fileName] + ';">' + fileName + '</span>',
					margin : '10 0 0 10' },

				{
					xtype : 'sliderfield',
					margin : '10 0 0 2',
					hideLabel : true,
					width : 275,
					minValue : 0,
					subtractionId : subtractionId,
					id : "slider" + subtractionId,
					maxValue : pointCount,
					increment : 1,
					values : [ 0, pointCount ],
					listeners : {
						changecomplete : function(slider, newValue, thumb, eOpts) {
							var values = slider.getValues();
							for (var i = 0; i < _this.frames.length; i++) {
								if (_this.frames[i].subtractionId == slider.subtractionId) {
									_this.frames[i].from = _this.plotter.dygraph.getValue(values[0] - 1, 0);
									_this.frames[i].to = _this.plotter.dygraph.getValue(values[1] - 1, 0);
								}
							}
							_this.updateCurve();
						} } } ] }, {
				xtype : 'container',
				layout : 'vbox',
				items : [ {
					xtype : 'container',
					layout : 'hbox',
					items : [ {
						xtype : 'button',
						text : '<',
						width : 30,
						margin : '2 0 0 10',
						subtractionId : subtractionId,
						handler : function(sender) {
							var id = "slider" + sender.subtractionId;
							Ext.getCmp(id).setValue(0, Ext.getCmp(id).getValues()[0] - 1);
							var values = Ext.getCmp(id).getValues();
							for (var i = 0; i < _this.frames.length; i++) {
								if (_this.frames[i].subtractionId == sender.subtractionId) {
									_this.frames[i].from = _this.plotter.dygraph.getValue(values[0] - 1, 0);
								}
							}

							_this.updateCurve();
						} }, {
						xtype : 'button',
						text : '>',
						width : 30,
						margin : '2 0 0 5',
						subtractionId : subtractionId,
						handler : function(sender) {
							var id = "slider" + sender.subtractionId;
							Ext.getCmp(id).setValue(1, Ext.getCmp(id).getValues()[1] + 1);
							var values = Ext.getCmp(id).getValues();
							for (var i = 0; i < _this.frames.length; i++) {
								if (_this.frames[i].subtractionId == sender.subtractionId) {
									_this.frames[i].to = _this.plotter.dygraph.getValue(values[1] - 1, 0);
								}
							}
							_this.updateCurve();
						} }

					]

				}, {
					xtype : 'container',
					layout : 'hbox',
					margin : '2 0 2 0',
					items : [ {
						xtype : 'button',
						text : '+',
						margin : '0 0 0 10',
						width : 30,
						subtractionId : subtractionId,
						handler : function(sender) {
							for (var i = 0; i < _this.frames.length; i++) {
								console.log(sender.subtractionId);
								if (_this.frames[i].subtractionId == sender.subtractionId) {
									_this.frames[i].scale = _this.frames[i].scale + 0.1;
								}
							}
							_this.updateCurve();
						} }, {
						xtype : 'button',
						text : '-',
						width : 30,
						margin : '0 0 0 5',
						subtractionId : subtractionId,
						handler : function(sender) {
							for (var i = 0; i < _this.frames.length; i++) {
								if (_this.frames[i].subtractionId == sender.subtractionId) {
									_this.frames[i].scale = _this.frames[i].scale - 0.1;
								}
							}
							_this.updateCurve();
						} } ] } ] }

			] }

		] });
};

MergeMainView.prototype.getSubtractionEditor = function() {
	var _this = this;
	this.editorPanel = Ext.create('Ext.Panel', {
		border : 1,
		height : 600,
		width : 400,
		layout : 'vbox',
		scrollable : true,
		style : {
			borderColor : '#000000',
			borderStyle : 'solid',
			borderWidth : '1px' },
		items : [],
		bbar : [ {
					text : "Download",
					xtype : 'button',
					handler : function(sender) {
						var params = _this.getParams();
						window.open(new DataAdapter().getMergeURL(params.subtractionIds.toString(), params.from.toString(), params.to.toString(), params.scale.toString()));
					}
		}]
//		{
//			xtype : 'button',
//			text : 'Download',
//			margin : '0 0 0 10',
//			width : 30,
//			handler : function(sender) {
//
//			} } ] 
			
	});
	return this.editorPanel;
};

MergeMainView.prototype.getParams = function() {
	var from = [];
	var to = [];
	var scale = [];
	var subtractionIds = [];
	for (var i = 0; i < this.frames.length; i++) {
		var frame = this.frames[i];
		if (frame.from != null) {
			from.push(frame.from);
		} else {
			from.push("");
		}
		if (frame.to != null) {
			to.push(frame.to);
		} else {
			to.push("");
		}
		if (frame.scale != null) {
			scale.push(frame.scale);
		} else {
			scale.push("");
		}
		if (frame.subtractionId != null) {
			subtractionIds.push(frame.subtractionId);
		} else {
			subtractionIds.push("");
		}
	}
	return {
		from : from,
		to : to,
		scale : scale,
		subtractionIds : subtractionIds,
		
	};
};

MergeMainView.prototype.updateCurve = function() {
	

	/** Saving zoom * */
	this.xAxisRange = this.plotter.dygraph.xAxisRange();
	this.yAxisRange = this.plotter.dygraph.yAxisRange();

	var params = this.getParams();
	this.plotter.loadMerge(params.subtractionIds.toString(), params.from.toString(), params.to.toString(), params.scale.toString());
	this.plotter.dygraph.updateOptions({
		dateWindow : this.xAxisRange,
		valueRange : this.yAxisRange });
};

MergeMainView.prototype.getSlavePanel = function() {
	return {
		xtype : 'container',
		layout : 'hbox',
		cls : 'defaultGridPanel',
		border : 0,
		defaults : {
			xtype : 'container',
			height : 600 },
		items : [ this.getSubtractionEditor(), this.plotter.getPanel() ] };
};

MergeMainView.prototype.load = function(selected) {
	var _this = this;

	var grid = new QueueGrid({
		maxHeight : 300

	});

	this.panel.setTitle("Merge Tool");
	this.container.insert(0, grid.getPanel());

	this.container.insert(1, this.getSlavePanel());
	grid.load(selected);
	grid.panel.setLoading(false);

	var dataCollectionIds = [];
	var subtractionIds = [];
	var subtractionKey = [];

	this.frames = [];
	for (var i = 0; i < selected.length; i++) {

		dataCollectionIds.push(selected[i].dataCollectionId);
		if (subtractionKey[selected[i].subtractionId] == null) {
			subtractionIds.push(selected[i].subtractionId);
			this.frames.push({
				'fileName' : selected[i].substractedFilePath.substr(selected[i].substractedFilePath.lastIndexOf("/") + 1),
				'subtractionId' : selected[i].subtractionId,
				'scale' : 1 });

			subtractionKey[selected[i].subtractionId] = true;
		}
	}

	/** Loading the subtraction on the curve Plotter * */
	this.plotter.load({
		subtracted : subtractionIds });

};

function PrimaryDataMainView() {
	this.title = "Primary Data View";
	this.icon = 'images/icon/ic_blur_on_black_18dp.png';

	MainView.call(this);
	
	this.onMeasurementSelectionChange = new Event(this);
	
	var _this = this;

	this.framesGrid = new FramesGrid();
	this.framesGrid.onSelectionChange.attach(function(sender, selections){
		_this.plotter.load(selections);
	});
	
	/** Curve plotter * */
	this.plotter = new CurvePlotter({
	});

	this.grid = new OverviewQueueGrid({height : 220});				
}



PrimaryDataMainView.prototype.getSlavePanel = function() {
	return {
		xtype : 'container',
		layout : 'hbox',
		cls 	: 'defaultGridPanel',
		margin : 5,
		border : 0,
		defaults : {
			height : 400 
		},
		items : [
		         {
		        	 xtype : 'panel',
		        	 layout: {
		        	        type: 'accordion',
		        	        titleCollapse: false,
		        	        animate: true,
		        	        activeOnTop: true
		        	    },
		        	    flex : 0.2,
		        		border : 1,
		        		style : {
		        			borderColor : '#000000',
		        			borderStyle : 'solid',
		        			borderWidth : '1px' },
		        	 items : [		        	        
		        	                this.framesGrid.getPanel()
		        	          ]
		         },
		         this.plotter.getPanel()		        
		    ]
	};
};

PrimaryDataMainView.prototype.getPanel = function() {
	return {
            xtype : 'container',
            autoScroll : true,							
            layout : 'fit',
            padding : 10,
            style : {
                borderColor : 'gray',
                borderStyle : 'solid',
                borderWidth : '1px',
                'background-color' : 'white' 
            },
            items : [ 
                        {
                            xtype : 'container',
                            items : [
                                        this.grid.getPanel(),
                                        this.getSlavePanel()         
                            ]
                        }
            ]
        };
};

PrimaryDataMainView.prototype.load = function(dataCollectionId) {
	var _this = this;
	

	var onSuccessA = function (sender, dataCollections) {        
		_this.grid.load(dataCollections);
				
		var onSuccessFrames = function (sender, averages){
			var allFrames = _.map(_.flatten(_.map(_.map(JSON.parse(averages), 'framelist3VO'), 'frametolist3VOs')), 'frame3VO');
			/** Retrieve subtraction */

			 var onSuccessSubtractions = function(sender, data) {				 				 
				 if (data){
					 if (data[0].substraction3VOs){
						 var subtraction = data[0].substraction3VOs[0];
						 if (subtraction.sampleOneDimensionalFiles){			 
							var frameFromSampleAveraged = _.map(subtraction.sampleOneDimensionalFiles.frametolist3VOs, 'frame3VO');
							var frameFromBufferAveraged = _.map(subtraction.bufferOneDimensionalFiles.frametolist3VOs, 'frame3VO');
						 
							/** Identify discarded frames */
							for (var i in allFrames){
								var frame = allFrames[i];
								debugger
								if (_.find(_.concat(frameFromSampleAveraged, frameFromBufferAveraged), {filePath : frame.filePath})){
									frame.discarded = false;
								}
								else{
									frame.discarded = true;								
								}
								frame.type = 'Frame';
								frame.domId = frame.frameId;
							}
						
							allFrames = _.orderBy(allFrames, ['filePath'], ['asc']);
							allFrames.unshift({
								filePath : subtraction.substractedFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'Subtraction',
								type : 'Subtraction'
							});
							allFrames.unshift({
								filePath : subtraction.bufferAverageFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'BufferAverage',
								type : 'BufferAverage'
							});
							allFrames.unshift({
								filePath : subtraction.sampleAverageFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'SampleAverage',
								type : 'SampleAverage'
							});
							_this.framesGrid.load(allFrames);	
							// if (subtraction.subtractionId){
							// 	var onSuccessSubtraction = function(sender, subtractions) {                 
							// 		_this.abinitioForm.load(subtractions);
							// 	};			
							// 	EXI.getDataAdapter({onSuccess : onSuccessSubtraction}).saxs.subtraction.getSubtractionsBySubtractionIdList([subtraction.subtractionId]);			
							// }
						} else {
							_this.framesGrid.load(null);
						}
					 }
				 }
			 };
 			EXI.getDataAdapter({onSuccess : onSuccessSubtractions}).saxs.dataCollection.getDataCollectionsByDataCollectionId(dataCollectionId);
		}		
		EXI.getDataAdapter({onSuccess : onSuccessFrames}).saxs.frame.getFramesByAverageId(_.map(dataCollections, 'Merge_mergeId'));
	}
	EXI.getDataAdapter({onSuccess : onSuccessA}).saxs.dataCollection.getDataCollectionsById(dataCollectionId);
};




function ShipmentPreparationMainView() {
	
	MainView.call(this);
	
	var _this = this;
	this.shipmentForm = new ShipmentForm();

	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
		//_this.tabPanel.setActiveTab(1);
		
	});
	this.caseGrid = new CaseGrid({
		height : 300
	});
	
	this.caseGrid.onRemove.attach(function(sender, dewar){
		var onSuccess = function(sender){
			_this.load(_this.shippingId);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess:onSuccess}).proposal.dewar.removeDewar(_this.shippingId, dewar.dewarId );
	});
}

ShipmentPreparationMainView.prototype.getPanel = MainView.prototype.getPanel;


ShipmentPreparationMainView.prototype.getContainer = function() {
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
							         	this.caseGrid.getPanel()
							]
						}
					]
			});

	return this.tabPanel;

};


ShipmentPreparationMainView.prototype.load = function(shippingId) {
	this.shippingId = shippingId;
	
	if (shippingId == null){
		Ext.getCmp(this.id + "grid").disable(true);
	}
	this.panel.setTitle("Shipment");
	var _this = this;
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipmentForm.load(shipment);
			_this.caseGrid.load(shipment);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
	}
};
function StockSolutionMainView() {
	
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	this.stockSolutionForm = new StockSolutionForm({
//		width : this.width - 10,
		minHeight : 800,
		height : 800,
		tbar : true,
		showTitle : true,
		isPackedVisible : false,
		btnAddExisting : false,
		btnRemoveVisible : false,
		btnUnpackVisible : false
	});
	
	var _this = this;
	
	
	this.stockSolutionForm.onSaved.attach(function(sender, stockSolution){
		var onSuccess2 = function(sender, proposals){
			_this.stockSolutionForm.load(EXI.proposalManager.getStockSolutionById(_this.stockSolutionId));	
			_this.panel.setLoading(false);
		};
		_this.panel.setLoading("Updading proposal information");
		EXI.getDataAdapter({onSuccess : onSuccess2}).proposal.proposal.update();
//		
	});
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

StockSolutionMainView.prototype.getPanel = MainView.prototype.getPanel;

StockSolutionMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'anchor'
	    },
	    defaults : {
			anchor : '100%',
			hideEmptyLabel : false },
	    margin : 30,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
		 items: [this.stockSolutionForm.getPanel([])]
	});
	
};


StockSolutionMainView.prototype.load = function(stockSolutionId) {
	this.stockSolutionId = stockSolutionId;
	
	this.stockSolutionForm.load(EXI.proposalManager.getStockSolutionById(stockSolutionId));	
	this.panel.setTitle("Stock Solutions");
};

function StockSolutionWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Macromolecules";
	this.closable = false;
}

StockSolutionWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;
StockSolutionWelcomeMainView.prototype.getContainer = MainView.prototype.getContainer;

StockSolutionWelcomeMainView.prototype.getOptions = function() {
	var html =  "<ul><li>Define beforehand an experiment</li>";
	html = html + "<li>Send your samples by courier</li>";
	return html + "</ul>";
};

StockSolutionWelcomeMainView.prototype.getContainer = function() {
	return  Ext.createWidget('panel',
			{
				plain : true,
				margin : '20',
				layout : 'fit',
				items : [
					{
						tabConfig : {
							title : 'Welcome'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
//							height : 700,
							padding : 10,
							margin : 0,
							cls : 'border-grid',
							items : [ 
							        
							         {
							        	 html : '<div class="landing-title" ><h2>Stock Solutions on ISPyB</h2></div>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	 html : '<div class="landing-text">A buffer is the matched solution which in a sample is suspended</div><br/>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : '<div class="landing-text">You should define a macromolecule on ISPyB if you want:</div>',
							        	 margin : '0 0 0 40'
							         },
							         {
							        	 html : this.getOptions(),
							        	 margin : '0 0 0 40'
							         },
							         
							         {
							        	 html : '<br/><div class="landing-text">If your macromolecule is not in the list showed on the left you can create a new one</div><br/>',
							        	 margin : '0 0 0 20'
							         },
							         {
							        	xtype : 'container',
							        	layout : 'hbox',
							        	cls : 'option-bar-menu',
							        	items :[
							        	    
										         {
										        	 xtype : 'button',
										        	 cls : 'square-option',
										        	 maxWidth : 200,
										        	 minWidth : 200,
										        	 margin : '0 0 0 150',
										        	 height : 100,
										        	 text : '<div class="square-option-text"; >Add a new Stock Solution</div>',
										        	 icon : '../images/icon/add.png',
										        	 iconAlign : 'top',
										        	 handler : function(){
										        		 location.hash = '/stocksolution/add';
										        	 }
										         }]
							         }
							       
							        
							]
						}
					
						]
					}
			]});
	};


StockSolutionWelcomeMainView.prototype.load = function() {
	
};

function TemplateMainView() {
	
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	MainView.call(this);

	
	this.experimentHeaderForm = new ExperimentHeaderForm();
	
	var _this = this;
	
	
	/** Viscosity **/
	var storeViscosity = Ext.create('Ext.data.Store', {
		fields : [ 'name' ],
		data : [ {
			"name" : "low"
		}, {
			"name" : "medium"
		}, {
			"name" : "high"
		} ]
	});

	// Create the combo box, attached to the states data store
	var viscosityEditor = Ext.create('Ext.form.ComboBox', {
		fieldLabel : '',
		store : storeViscosity,
		queryMode : 'local',
		displayField : 'name',
		valueField : 'name'
	});
	
	
	/** Specimen Widget contains a specimenGrid and a sampleChangerWidget than can be displayed with are vertical or horizontal layout **/
	this.specimenWidget = new SpecimenWidget({
		height : this.height,
		width : 1200
	});
	
	this.measurementGrid = new MeasurementGrid({
//		maxWidth : 1500,
//		width : 1200,
		height : 600,
		minHeight : 600,
		maxHeight : 600,
		estimateTime : false,
		positionColumnsHidden : true,
		isPriorityColumnHidden : true,
		isStatusColumnHidden : true,
		addBtnEnable : true,
		isTimeColumnHidden : true,
		updateRowEnabled : true,
		collapsed : true,
		removeBtnEnabled : true,
		showTitle : false,
		collapseBtnEnable : false,
		addBtnMultipleEdit : true,
		sortingBtnEnable : true,
		editor : {
			exposureTemperature : {
				xtype : 'textfield',
				allowBlank : true
			},
			comments : {
				xtype : 'textfield',
				allowBlank : true
			},
			volumeToLoad : {
				xtype : 'numberfield',
				allowBlank : true
			},
			transmission : {
				xtype : 'numberfield',
				allowBlank : true
			},
			viscosity : viscosityEditor,
			waitTime : {
				xtype : 'numberfield',
				allowBlank : true
			},
			flow : {
				xtype : 'checkbox',
				allowBlank : true
			}
		}
	});


	this.measurementGrid.onMeasurementChanged.attach(function(sender, measurement) {
		_this.experiment.setMeasurement(measurement);
		_this.measurementGrid.loadExperiment(_this.experiment);
		_this.volumePlanificator.load(_this.experiment);
	});

	this.measurementGrid.onExperimentChanged.attach(function(sender, json) {
		_this.experiment = new Experiment(json);
		_this.measurementGrid.loadExperiment(_this.experiment);
		_this.specimenWidget.refresh(_this.experiment);
		_this.volumePlanificator.load(_this.experiment);
	});

	this.measurementGrid.onRemoved.attach(function(sender, experiments) {
		_this.experiment = new Experiment(experiments[0]);
		_this.specimenWidget.refresh(_this.experiment);
		_this.volumePlanificator.load(_this.experiment);
	});

	this.volumePlanificator = new VolumeGrid();
}

TemplateMainView.prototype.getPanel = MainView.prototype.getPanel;

TemplateMainView.prototype.getHeader = function(beamlineName, startDate) {
	return "<span class='item'>" + beamlineName + "</span><span class='item_description'>" + startDate + "</span>";
};

TemplateMainView.prototype.getSelected = function() {
	var selected = [];
	for (var i = 0; i < this.queueGridList.length; i++) {
		selected = this.queueGridList[i].getSelected().concat(selected);
	}
	return selected;
};


TemplateMainView.prototype.getTabs = function() {
	return  Ext.createWidget('tabpanel',
			{
				plain : true,
				margin : '20 0 0 0',
				items : [
					{
						tabConfig : {
							title : 'Measurements'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							height : 700,
							padding : 20,
							style : {
								borderColor : 'gray',
								borderStyle : 'solid',
								borderWidth : '1px',
								'background-color' : 'white' 
							},
							items : [ 
							         
							         this.measurementGrid.getPanel()
							]
						}

						]
					},
					{
						tabConfig : {
							title : "Sample Plate Setup"
						},
						items : [  
									{
										xtype : 'container',
										layout : 'vbox',
										height : 700,
										padding : 20,
										style : {
											borderColor : 'gray',
											borderStyle : 'solid',
											borderWidth : '1px',
											'background-color' : 'white' 
										},
										items : [ 
										     	this.specimenWidget.getPanel()
										     	]
									}
					]
			},
			{
				tabConfig : {
					title : "Sample Requirements"
				},
				items : [  
							{
								xtype : 'container',
								layout : 'fit',
								height : 700,
								padding : 20,
								style : {
									borderColor : 'gray',
									borderStyle : 'solid',
									borderWidth : '1px',
									'background-color' : 'white' 
								},
								items : [ 
								     	this.volumePlanificator.getPanel()
								     	]
							}
			]
			}
			]});
};


TemplateMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'anchor'
	    },
	    defaults : {
			anchor : '100%',
			hideEmptyLabel : false },
	    margin : 30,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
	    items: [
	            
	            this.experimentHeaderForm.getPanel(),
	            this.getTabs()
	            ]
	});
};



TemplateMainView.prototype.load = function(experiments) {
	var _this = this;
	_this.panel.setLoading();
	var onSuccess = function(sender, experiments){
		_this.experiment = new Experiment(experiments[0]);
		_this.experimentHeaderForm.load(_this.experiment);
		_this.measurementGrid.loadExperiment(_this.experiment);
		_this.specimenWidget.refresh(_this.experiment);
		_this.volumePlanificator.load(_this.experiment);
		_this.panel.setLoading(false);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.experiment.getExperimentById(experiments[0].experimentId);
	this.panel.setTitle("Template");
};

function QueueGrid(args) {
    this.decimals = 3;
	this.onSelect = new Event();

	this.maxHeight = 600;
	this.imgWidth = 77;
	this.padding = 0;
	
	this.id = BUI.id();
	this.title = 'Data Collections';
	this.key = {};

	this.selectionMode = 'MULTI';
	
	this.collapsible = true;
	this.collapsed = false;
	
	var _this = this;
	this.filters = [ function(item) {
		if (item.data.dataCollectionId == null) {
			return false;
		}
		if (_this.key[item.data.dataCollectionId] == null) {
			_this.key[item.data.dataCollectionId] = [];
		}
		_this.key[item.data.dataCollectionId].push(item.data);
		return item.data.macromoleculeId != null;
	} ];
	if (args!= null){
		if (args.maxHeight != null){
			this.maxHeight = args.maxHeight;
		}
		if (args.padding != null){
			this.padding = args.padding;
		}
		if (args.collapsible != null){
			this.collapsible = args.collapsible;
		}
		if (args.collapsed != null){
			this.collapsed = args.collapsed;
		}
		if (args.selectionMode != null){
			this.selectionMode = args.selectionMode;
		}
		if (args.title != null){
			if (args.title == false){
				this.title = null;
			}
		}
	}
	
	this.selected = []; 
	this.onSelectionChange = new Event();
	this.onDeselect = new Event(this);
	this.onSelect = new Event(this)
}


/**
* It loads a set of data collections
*
* @method getImage
* @param {subtractionId} subtractionId
* @param {category} ['scattering' | 'kratky' | 'density' | 'guinier']
*/
QueueGrid.prototype.getImage = function(subtractionId, category) {	
		return EXI.getDataAdapter().saxs.subtraction.getImage(subtractionId, category);
};

/**
* Attaches the events to lazy load to the images. Images concerned are with the class queue-img
*
* @method attachCallBackAfterRender
*/
QueueGrid.prototype.attachCallBackAfterRender = function(nodeWithScroll) {
    
    var _this = this;
    var lazy = {
            bind: 'event',
            /** !!IMPORTANT this is the parent node which contains the scroll **/
            appendScroll: nodeWithScroll,
            beforeLoad: function(element) {
                console.log('image "' + (element.data('src')) + '" is about to be loaded');                                
            },           
            onFinishedAll: function() {
                EXI.mainStatusBar.showReady();
            }
    };
       
    var timer1 = setTimeout(function() { $('.img-responsive').lazy(lazy);}, 500);
	// var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500); 

};

QueueGrid.prototype.getPanel = function(){
    var _this = this;

	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : false,
        padding : this.padding
	}
};
/**
 * Example form
 * 
 * @witdh
 * @height
 */
function AbinitioForm(args) {
	this.id = BUI.id();
	this.width = null;
	this.height = null;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}

	var _this = this;
	/** Widgets **/
	this.abinitioGrid = new AbinitioGrid({
		width : 700,
		height : 600
	});
}



AbinitioForm.prototype.getPanel = function() {
	return this.abinitioGrid.getPanel();
};


/** It populates the form * */
AbinitioForm.prototype.load = function(subtractions) {
	this.subtractions = subtractions;
	this.abinitioGrid.refresh(subtractions);
};



function AbinitioGrid(args) {
	this.height = null;
	this.width = null;
	this.id = BUI.id();

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;

			if (args.width != null) {
				this.width = args.width;
			}
		}
	}
	
	this.onSelected = new Event(this);
}


AbinitioGrid.prototype.refresh = function(subtractions){
    $('#' + this.id).html(this.doTemplate(this._prepareData(subtractions)));
};

AbinitioGrid.prototype._prepareData = function(subtractions){
	/** Parsing data * */
	var models = [];
	for (var l = 0; l < subtractions.length; l++) {
		var subtraction = subtractions[l];
		for (var k = 0; k < subtraction.substractionToAbInitioModel3VOs.length; k++) {
			var data = subtraction.substractionToAbInitioModel3VOs[k].abinitiomodel3VO;
			if (data.averagedModel != null) {
				models.push(data.averagedModel);
				models[models.length - 1].type = "Reference";
			}
	
			if (data.shapeDeterminationModel != null) {
				models.push(data.shapeDeterminationModel);
				models[models.length - 1].type = "Refined";
			}
	
			if (data.modelList3VO != null) {
				if (data.modelList3VO.modeltolist3VOs != null) {
					for (var i = 0; i < data.modelList3VO.modeltolist3VOs.length; i++) {
						models.push(data.modelList3VO.modeltolist3VOs[i].model3VO);
						models[models.length - 1].type = "Model";
					}
				}
			}
		}
	}
    console.log(models)
	return models;
};

AbinitioGrid.prototype.doTemplate = function(data){
    var html = "";
    dust.render("abinitiogrid.template", data, function(err, out) {                                                                                               
		html = html + out;
	});
    return html;
};

AbinitioGrid.prototype.getPanel = function(){
	
	
    var html = this.doTemplate({});
	
	return [{
		html : '<div id="' + this.id + '">' + html + '</div>',
		autoScroll : true,
        border : 1,
        padding : 0,
		height : this.height
	}];
};


/**
 * Rigid body grid to show PDB, symmetry and multiplicity
 * 
 * 
 * #onUploadFile click on upload file
 */
function AprioriRigidBodyGrid(args) {

	this.height = 250;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
	}

	/** Events **/
	this.onUploadFile = new Event(this);
	this.onRemove = new Event(this);
}

AprioriRigidBodyGrid.prototype._getColumns = function() {
};

AprioriRigidBodyGrid.prototype._getTopButtons = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	/** ADD BUTTON **/
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			_this.onAddButtonClicked.notify();
		}
	}));

	return actions;
};

AprioriRigidBodyGrid.prototype.load = function(macromolecule) {
	this.macromolecule = macromolecule;
	if (macromolecule != null){
		this.pdbStore.loadData(macromolecule.structure3VOs);
	}
};

AprioriRigidBodyGrid.prototype._prepareData = function() {
	var data = [];
	for ( var i = 0; i < this.features.length; i++) {
		data.push(this.features[i]);
	}
	return data;
};



AprioriRigidBodyGrid.prototype._updateProposalInformation = function() {
	
	EXI.proposalManager.get(true);
	this.load(EXI.proposalManager.getMacromoleculeById(this.macromolecule.macromoleculeId));
	this.panel.setLoading(false);
	
};

AprioriRigidBodyGrid.prototype._getPlugins = function() {
	var _this = this;
	var plugins = [];
	plugins.push(Ext.create('Ext.grid.plugin.RowEditing', {
		clicksToEdit : 1,
		listeners : {
			validateedit : function(grid, e) {
				/** Comments are always updatable* */
				var multiplicity = e.newValues.multiplicity;
				var symmetry = e.newValues.symmetry;
				var macromoleculeId = e.record.data.macromoleculeId;
				var structureId = e.record.data.structureId;
				
				_this.panel.setLoading();
				var onSuccess = function (){
					_this._updateProposalInformation();
				};
				
				var onError = function (error){
					BUI.showError("Ops, there was a problem");
					_this._updateProposalInformation();
				};

				_this.panel.setLoading();
				EXI.getDataAdapter({
					onSuccess : onSuccess,
					onError : onError
				}).saxs.macromolecule.saveStructure(macromoleculeId, structureId, multiplicity, symmetry);
			}
		}
	}));
	return plugins;
};

AprioriRigidBodyGrid.prototype.getPanel = function() {
	var _this = this;

	this.pdbStore = Ext.create('Ext.data.Store', {
		fields : [ 'filePath', 'structureId', 'structureType', 'symmetry', 'structureId', 'name', 'multiplicity' ],
		groupField : 'structureType',
		sorters : {
			property : 'structureId',
			direction : 'DESC'
		}
	});


	this.panel = Ext.create('Ext.grid.Panel', {
		margin : "15 10 0 10",
		height : this.height,
		store : this.pdbStore,
		plugins : _this._getPlugins(),
		cls : 'border-grid',
		tbar : [ {
			text : 'Add Modeling Option (PDB)',
			icon : '../images/icon/add.png',
			handler : function() {
				_this.onUploadFile.notify('PDB', 'Upload PDB File');
			}
		}
		],
		columns : [
				{
					text : "structureId",
					flex : 0.2,
					hidden : true,
					dataIndex : 'structureId',
					sortable : true
				},
				{
					text : "File",
					flex : 1,
					dataIndex : 'filePath',
					sortable : true,
					hidden : true
				},
				{
					text : "PDB",
					flex : 0.4,
					dataIndex : 'name',
					sortable : true
				},
				{
					text : "Symmetry",
					flex : 0.2,
					dataIndex : 'symmetry',
					sortable : true,
					editor : {
						xtype : 'combobox',
						typeAhead : true,
						triggerAction : 'all',
						selectOnTab : true,
						store : [ [ "P1", "P1" ], [ "P2", "P2" ], [ "P3", "P3" ], [ "P4", "P4" ], [ "P5", "P5" ], [ "P6", "P6" ], [ "P32", "P32" ], [ "P42", "P42" ],
								[ "P52", "P52" ], [ "P62", "P62" ], [ "P222", "P222" ] ],
					}
				}, {
					text : "Multiplicity",
					flex : 0.2,
					dataIndex : 'multiplicity',
					sortable : true,
					editor : {
						xtype : 'textfield'
					}

				}, {
					text : "Subunit",
					flex : 0.2,
					dataIndex : 'isSubunit',
					sortable : true,
					hidden : true
				}, {
					text : "Type",
					flex : 0.2,
					dataIndex : 'structureType',
					sortable : true,
					hidden : true
				},
				{
		            xtype:'actioncolumn',
		            flex : 0.1,
		            text : 'Remove',
		            editor : {
						xtype : 'textfield'
					},

		            items: [{
		                icon: '../images/icon/ic_delete_black_24dp.png',  // Use a URL in the icon config
		                tooltip: 'Remove',
		                handler: function(grid, rowIndex, colIndex) {
		                	var rec = grid.getStore().getAt(rowIndex);
		                	
		                	var structureId = rec.data.structureId;
		                	var macromoleculeId = rec.data.macromoleculeId;
		                	function showResult(btn){
		                	       if (btn == 'yes'){
		                	    	   var onSuccess = function(){
		                	    		   _this._updateProposalInformation();
		                	    	   };
		                	    	   
		                	    	    var onError = function onSuccess(){
		                	    		   BUI.showWarning("ISPyB could not remove this structure. Have it been already used?");
		                	    		   _this._updateProposalInformation();
		           						};
		           						_this.panel.setLoading();
			                	    	EXI.getDataAdapter({
			               					onSuccess : onSuccess,
			               					onError : onError
			               				}).saxs.macromolecule.removeStructure(macromoleculeId, structureId);
		                	       }
		                	};
		                	    
		                    Ext.MessageBox.show({
		                        title:'Warning',
		                        fn: showResult,
		                        msg: 'You are removing a PDB structure option. <br />Sure?',
		                        buttons: Ext.MessageBox.YESNO,
		                        icon: Ext.MessageBox.QUESTION
		                    });
		                }
		            }]
		        }
		],
		listeners: { 
		     beforeedit: function (grid, e, eOpts) { 
		    	 	return e.column.xtype != 'actioncolumn'; 
		       } 
		 }  
				
	});

	return this.panel;
};

/**
 * Example form
 * 
 * @witdh
 * @height
 */
function AssemblyForm(args) {
	this.id = BUI.id();
	this.width = 700;
	this.height = 500;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}

	this.molarityGrid = new MolarityGrid({height : this.height - 50});
}

AssemblyForm.prototype._getItems = function() {
	return [ {
		xtype : 'label',
		forId : 'myFieldId',
		text : 'List of previously defined macromolecules present in the assembly. This information will be used for additional cross-checks where possible',
		margin : '15 0 20 10',
		cls : "inline-help"
	}, this.molarityGrid.getPanel() ];
};

AssemblyForm.prototype._getButtons = function() {
	return [];
};

AssemblyForm.prototype.getPanel = function() {
	this.panel = Ext.create('Ext.form.Panel', {
		width : this.width,
		height : this.height,
		margin : 10,
		border : 0,
		defaultType : 'textfield',
		items : this._getItems(),
		buttons : this._getButtons()
	});
	return this.panel;
};


/** It populates the form **/
AssemblyForm.prototype.refresh = function(macromolecule) {
	this.macromolecule = macromolecule;
	this.molarityGrid.refresh(macromolecule);
};

AssemblyForm.prototype.input = function() {
	return {};
};


AssemblyForm.prototype.test = function(targetId) {
	var assemblyForm = new AssemblyForm();
	
	var panel = assemblyForm.getPanel();
	panel.render(targetId);
};
/**
 * Edit the information of a buffer
 * 
 * #onRemoveAdditive
 */
function BufferForm(args) {
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

//	this.onSaved = new Event(this);
	this.onRemoveAdditive = new Event(this);
}

BufferForm.prototype.getBuffer = function() {
	if (this.buffer == null){
		this.buffer = {};
	}
	this.buffer["name"] = Ext.getCmp(this.id + "buffer_name").getValue();
	this.buffer["acronym"] = Ext.getCmp(this.id + "buffer_acronym").getValue();
	this.buffer["comments"] = Ext.getCmp(this.id + "buffer_comments").getValue();
	this.buffer["ph"] = Ext.getCmp(this.id + "buffer_ph").getValue();
	this.buffer["composition"] = Ext.getCmp(this.id + "buffer_composition").getValue();
	this.buffer["proposalId"] = Ext.getCmp(this.id + "proposalIdCombo").getValue();
	return this.buffer;
};

BufferForm.prototype.load = function(buffer) {
	this.buffer = buffer;
	
	if (buffer != null){
		Ext.getCmp(this.id + "buffer_name").setValue(this.buffer.name);
		Ext.getCmp(this.id + "buffer_acronym").setValue(this.buffer.acronym);
		Ext.getCmp(this.id + "buffer_comments").setValue(this.buffer.comments);
		Ext.getCmp(this.id + "buffer_ph").setValue(this.buffer.ph);
		Ext.getCmp(this.id + "buffer_composition").setValue(this.buffer.composition);
	}
	
		if (this.buffer != null){
			if (this.buffer.proposalId != null){
				          
				Ext.getCmp(this.id + "proposalIdCombo").setValue(this.buffer.proposalId);
				Ext.getCmp(this.id + "proposalIdCombo").disable();
			}
		}
};

BufferForm.prototype._getTopPanel = function() {
	return {
		xtype : 'container',
		layout : 'hbox',
		border : 0,
		margin : '40 0 0 0',
		frame : true,
		items : [ {
			xtype : 'container',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				flex : 1,
				border : false,
				layout : 'anchor',
//				defaultType : 'textfield',
				items : [ {
					xtype: 'requiredtextfield',
					id : this.id + 'buffer_name',
					fieldLabel : 'Name',
					name : 'name',
					width : 300
//					value : this.buffer.name 
					}, {
						xtype: 'requiredtextfield',
					id : this.id + 'buffer_acronym',
					fieldLabel : 'Acronym',
					maskRe:/[a-zA-Z0-9]+/,
					name : 'acronym',
					width : 300
//					value : this.buffer.acronym
				} ] } ] }, {
			xtype : 'container',
			flex : 1,
			layout : 'anchor',
			defaultType : 'textfield',
			margin : '0 0 0 10',
			items : [ {
				id : this.id + 'buffer_ph',
				fieldLabel : 'pH',
				name : 'ph',
//				value : this.buffer.ph,
				xtype : 'numberfield',
				width : 300,
				minValue : 0,
				maxValue : 15 }, 
				
//				{
//					//					xtype : 'requiredtext',
//					xtype : 'Ext.Extended.SearchField',
//					id : 'buffer_composition',
//					fieldLabel : 'Composition',
//					name : 'composition',
//					width : 300
//				}
				{
//					              xtype: 'searchfield',
					              fieldLabel: 'Composition',
					              id : this.id + 'buffer_composition',
					              name: 'composition',
					              width : 300
					          }
				
				
				] } ] };
};


BufferForm.prototype.getToolBar = function() {
	var _this = this;
	return [
	        {
	            text: 'Save',
	            width : 100,
	            handler : function(){
	            	_this.panel.setLoading();
	            	var onSuccess = (function(sender){
	            		_this.panel.setLoading(false);
	            		EXI.getDataAdapter().proposal.proposal.update();
	            	});
	            	EXI.getDataAdapter({ onSuccess : onSuccess}).saxs.buffer.saveBuffer(_this.getBuffer());
	            }
	        }
	];
};

BufferForm.prototype.getPanel = function() {
	var _this =this;
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		buttons : this.getToolBar(),
		cls : 'border-grid',
		items : [ 
		         {
						xtype : 'container',
						margin : '10 0 0 20',
						layout : 'vbox',
						items : [ 
										BIOSAXS_COMBOMANAGER.getComboProposal({id : _this.id + "proposalIdCombo" ,labelWidth : 100}), 
										this._getTopPanel(), 
		          						{
											id : this.id + 'buffer_comments',
											xtype : 'textareafield',
											name : 'comments',
											fieldLabel : 'Comments',
											width : 600 ,
											height : 80
										}
						]
		         }
		
		         ] 
		}
	);
	return this.panel;
};


/**
 * It shows buffer grid with a top bar with "Add" button
 * 
 * @height
 * @searchBar
 * @collapsed
 * @width
 */
function BufferGrid(args) {
	this.height = 500;
	this.searchBar = false;
	this.tbar = false;
	this.collapsed = false;
	this.id = BUI.id();

	this.collapsible = false;
	
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
	}
	
	this.onUpdated = new Event(this);
}

BufferGrid.prototype._edit = function(bufferId) {
	var _this = this;
	function getButtons(){
				return [ {
					text : 'Save',
					handler : function() {
						var onSuccess = function(sender) {
							var onSuccess2 = function(sender, proposals){
								_this.window.close();
								_this.onUpdated.notify();
								_this.panel.setLoading(false);
							};
							_this.panel.setLoading("Updading proposal information");
							EXI.getDataAdapter({onSuccess : onSuccess2}).proposal.proposal.update();
							
						};
						/** Checking mandatory fields **/
						if (_this.bufferForm.getBuffer().name == ""){
							BUI.showWarning("Name field is mandatory");
							return;
						}
						if (_this.bufferForm.getBuffer().acronym == ""){
							BUI.showWarning("Acronym field is mandatory");
							return;
						}
						if ((_this.bufferForm.getBuffer().proposalId == "") || (_this.bufferForm.getBuffer().proposalId == null)){
							BUI.showWarning("Proposal field is mandatory");
							return;
						}
						EXI.getDataAdapter({onSuccess : onSuccess}).saxs.buffer.saveBuffer(_this.bufferForm.getBuffer());
					}
				}, {
					text : 'Cancel',
					handler : function() {
						_this.window.close();
					}
				}];
	}

	this.bufferForm = new BufferForm({height : 400, width : 700});
	
	this.window = Ext.create('Ext.window.Window', {
	    title: 'Edit buffer',
	    layout: 'fit',
	    items: this.bufferForm.getPanel(),
	    buttons			: getButtons(),
	}).show();
	
	this.bufferForm.load(this.getBufferById(bufferId));
};

BufferGrid.prototype.getBufferById = function(bufferId) {
	for (var i = 0; i < this.buffers.length; i++) {
		if (this.buffers[i].bufferId == bufferId){
			return this.buffers[i];
		}
	}
	return {};
};

BufferGrid.prototype.load = function(buffers) {
	var _this = this;
	/** Retrieving proposals **/
	this.buffers = buffers;
	
	this.proposalKey = {};
	this.proposalColor = {};
	var colors = ["#006633", "#999966", "#CC0066"];
	for (var i = 0; i < buffers.length; i++) {
		var proposal = EXI.proposalManager.getProposalById(buffers[i].proposalId);
		buffers[i]["proposal"] = proposal.code + proposal.number;
	}
	this.store.loadData(buffers, false);
};

BufferGrid.prototype._getTbar = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		text : 'Add',
		icon: 'images/icon/add.png',
		disabled : false,
		handler : function(widget, event) {
			_this._edit();
		}
	}));
	return actions;
};

BufferGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'proposal', 'bufferId', 'acronym', 'name', 'composition', 'comments', 'ph' ]
	});

	this.store.sort('acronym');

	var type = 'Ext.grid.Panel';
	if (this.searchBar == true) {
		type = 'Ext.ux.LiveSearchGridPanel';
	}

	this.panel = Ext.create(type, {
		title : 'Buffers',
		collapsible : this.collapsible,
		collapsed : this.collapsed,
		store : this.store,
		height : this.height,
		width : this.width,
		columns : [ 
		{
			text : 'Proposal',
			dataIndex : 'proposal',
			flex : 1
		}, 
		{
			text : 'Acronym',
			dataIndex : 'acronym',
			flex : 2
		}, {
			text : 'Name',
			dataIndex : 'name',
			flex : 2,
			hidden : false
		}, {
			text : 'pH',
			dataIndex : 'ph',
			flex : 2
		},{
			text : 'Composition',
			dataIndex : 'composition',
			flex : 2,
			hidden : false
		}, 
		{
			text : 'Comments',
			dataIndex : 'comments',
			flex : 4,
			hidden : false
		}, 
		 {
            xtype:'actioncolumn',
            width:40,
            text : 'Edit',
            items: [{
                icon: 'images/icon/edit.png',  // Use a URL in the icon config
                tooltip: 'Edit',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    _this._edit(rec.get('bufferId'));
                }
            }]
        }
		],
		flex : 1,
		viewConfig : {
			stripeRows : true,
			listeners : {
				'celldblclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					_this._edit(record.data.bufferId);
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

BufferGrid.prototype.input = function() {
	return new MacromoleculeGrid().input();
};

BufferGrid.prototype.test = function(targetId) {
	var bufferGrid = new BufferGrid({
		width : 800,
		height : 350,
		collapsed : false,
		tbar : true
	});

	BIOSAXS.proposal = new Proposal(bufferGrid.input().proposal);
	var panel = bufferGrid.getPanel(BIOSAXS.proposal.macromolecules);
	panel.render(targetId);
};




/**
 * A shipment may contains one or more cases where stock solutions and sample plates are stored
 * 
 * @height
 * @btnEditVisible
 * @btnRemoveVisible
 * 
 * #onEditButtonClicked
 * #onAddButtonClicked
 * #onRemoveButtonClicked
 * #onDuplicateButtonClicked
 */
function CaseGrid(args) {

	this.height = 100;
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
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

CaseGrid.prototype._getHTMLTable = function(items) {
	var html = "<table style='font-size:14px;color:gray;'>";
	
	for (var i = 0; i < items.length; i++) {
		html = html + "<tr>";
		html = html + "<td>";
		html = html + items[i].key;
		html = html + "</td>";
		html = html + "<td style='font-weight:bold;color:black;'>";
		html = html + items[i].value;
		html = html + "</td>";
		html = html + "</tr>";
	}
	return html + "</table>";
	
	
};

CaseGrid.prototype._getHTMLButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="btn" style="font-size:9px;width:90px; height:40px" class="btn-component" value="' + value +'" >';
};

CaseGrid.prototype._getUnpackStockSolutionButton = function(stockSolutionId, value) {
	return '<input id="' + stockSolutionId +'"type="button" name="stockSolution" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};

CaseGrid.prototype._getRemoveContainerButton = function(stockSolutionId, value) {
	return '<input id="' + stockSolutionId +'"type="button" name="puck" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};

CaseGrid.prototype._getEditPuckButton = function(type, id, value) {
	return '<input id="' + type + "_" + id +'"type="button" name="edit" style="font-size:9px;width:90px; height:40px" class="btn-component-puck-edit" value="' + value +'" >';
};

CaseGrid.prototype._getPrintParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="printLabels" style="font-size:9px;width:90px; height:40px" class="btn-component-print-parcel" value="' + value +'" >';
};

CaseGrid.prototype._getEditParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="editParcel" style="font-size:9px;width:90px; height:40px" class="btn-component-edit-parcel" value="' + value +'" >';
};

CaseGrid.prototype._getRemoveParcelButton = function(dewarId, value) {
	return '<input id="' + dewarId+' "type="button" name="removeParcel" style="font-size:9px;width:90px; height:40px" class="btn-component-remove" value="' + value +'" >';
};


CaseGrid.prototype._getComponentRowHTML = function(icon, type, code, capacity, id) {
	var html = "";
	html = html + "<tr  class='tr-component'>";
	

	html = html + "<td>";
	html = html +  this._getEditPuckButton(type, Number(id), "Edit");
	html = html + "</td>";

	/*
	html = html + "<td>";
	html = html + "<img style='cursor:pointer;' name='edit' id='" + type +"_" + id +"' src=\'" + icon + "' />";
	html = html + "</td>";
	*/
	html = html + "<td>";
	html = html +  type;
	html = html + "</td>";
	
	html = html + "<td>";
	html = html +  code;
	html = html + "</td>";

	
	html = html + "<td>";
	html = html +  capacity;
	html = html + "</td>";

	


	if (type == "Stock Solution"){
		html = html + "<td>";
		html = html +  this._getUnpackStockSolutionButton(Number(id), "Unpack");
		html = html + "</td>";
	}
	
	if (type == "Puck"){
		html = html + "<td>";
		html = html +  this._getRemoveContainerButton(Number(id), "Remove");
		html = html + "</td>";
	}

	
	
	html = html + "</tr>";
	return html;
};

CaseGrid.prototype._getComponentHTML = function(dewarId, items) {
	var html = "";
	if (items.length > 0){
		html = "<table  class='table-component'><tr><th class='th-component'></th><th class='th-component'>Type</th><th class='th-component'>Code</th><th class='th-component'>Capacity</th><th></th></tr>";
		for (var i = 0; i < items.length; i++) {
			var icon = '../images/BasketView_24x24_01.png';
			
			if (items[i].type == "Puck"){
					html = html + this._getComponentRowHTML(icon, items[i].type,  items[i].code,  items[i].sampleCount + "/"+ items[i].capacity,  items[i].id);
			}
			
			if (items[i].type == "Stock Solution"){
				icon = '../images/SampleHolderView_24x24_01.png';
				html = html + this._getComponentRowHTML(icon, items[i].type,  items[i].code,  items[i].capacity, items[i].id);
			}
			
		}
		html = html + "</table>";
	}
	else{
		html = html + "<br /><br /><span class='parcel-empty-msg'>This parcel is empty</span>";
	}
	
	
	/** Adding buttons **/
	if (items.length == 0){
		html =  this._getHTMLButton(dewarId, "Add Solution") + this._getHTMLButton(dewarId, "Add Puck") + html;
	}

	if (items.length > 0){
		if (items[0].type == "Puck"){
			html =  this._getHTMLButton(dewarId, "Add Puck") + html;
		}
		else{
			html =  this._getHTMLButton(dewarId, "Add Solution")+ html;
		}
	}
	return '<div  class="header-component-table" >Components</div><div  style="margin:0px 0px 0px 0px !important;width:610px;">' + html + '</div>';
};


CaseGrid.prototype._getParcelHTML = function(dewar) {
	var html = "<table  class='table-component'><tr><th class='th-component'>Code</th><th class='th-component'>Status</th><th class='th-component'>Store Location</th><th class='th-component'>Comments</th></tr>";

	var storageLocation = dewar["Dewar_storageLocation"];
	var dewarCode = dewar["Dewar_code"];
	var status = dewar["Dewar_status"];
	var comments = dewar["Dewar_comments"];

	if (dewarCode == null){
		dewarCode = "<span style='color:orange'>Not set</span>";
	}

	if (status == null){
		status = "<span style='color:orange'>Unknown</span>";
	}

	if (storageLocation == null){
		storageLocation = "<span style='color:orange'>Not set</span>";
	}

	if (comments == null){
		comments = "";
	}

	html = html + "<tr class='tr-component'><td>" + dewarCode + "</td><td>" + status + "</td><td>" + storageLocation + "</td><td>" + comments + "</td></tr></table>"
	/** Adding buttons **/
	html =  this._getEditParcelButton(dewar["Dewar_dewarId"], "Edit") +  this._getPrintParcelButton(dewar["Dewar_dewarId"], "Print Labels") + this._getRemoveParcelButton(dewar["Dewar_dewarId"], "Remove") + html;
	return '<div  class="header-component-table" >Parcel</div><div  style="margin:0px 0px 0px 0px !important;width:610px;">' + html + '</div>';
};



CaseGrid.prototype._getColumns = function() {
	var _this = this;


	var columns = [
		{
			header : 'General',
			dataIndex : 'type',
			name : 'type',
			type : 'string',
			flex : 0.5,
			
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				return _this._getParcelHTML(deserialized[0]);
			}
		},
		{
			header : 'Content',
			dataIndex : 'Dewar_comments',
			name : 'type',
			type : 'string',
			flex : 0.5,
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				var dewarId = deserialized[0].Dewar_dewarId;
				var items = [];
				
				if (deserialized != null){
					if (deserialized.length > 0){
						for (var i = 0; i < deserialized.length; i++) {
							if (deserialized[i].Container_containerType == "Puck"){
								var code = "";
								if (deserialized[i].Container_code != null){
									code = deserialized[i].Container_code;
								}

								items.push({
								    type 	: deserialized[i].Container_containerType,
								    code 	: code,
								    capacity 	: deserialized[i].Container_capacity,
								    sampleCount : deserialized[i].sampleCount,
								    id 		: deserialized[i].Container_containerId,
								 
								});
								
							}
						}
					}
				}
				
				/** Stock Solutions **/
				var stockSolutions = EXI.proposalManager.getStockSolutionsByDewarId(dewarId);
                if(stockSolutions){
                    for (var i = 0; i < stockSolutions.length; i++) {                        
                            items.push({
                                    type 	: "Stock Solution",
                                            code 	: stockSolutions[i].name,
                                        capacity :	stockSolutions[i].volume + "ml",
                                        sampleCount :	"",
                                        id : 	stockSolutions[i].stockSolutionId                            
                            });                            
                    }
                }
				/** Rendering on HTML **/
				return _this._getComponentHTML(dewarId, items);
			}
		}
		/*{
			header : 'Comments',
			dataIndex : 'Dewar_comments',
			name : 'type',
			type : 'string',
			flex : 1,
			renderer : function(grid, opts, record){
				var deserialized = JSON.parse(record.data.serialized);
				return deserialized[0].Dewar_comments;
			}
		},*/
	];
	return columns;
};

CaseGrid.prototype._getTopButtons = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	/** ADD BUTTON **/
	actions.push(Ext.create('Ext.Action', {
		icon : '../images/icon/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
	

	return actions;
};


CaseGrid.prototype.groupBy = function(array , f ){
	  var groups = {};
	  array.forEach( function( o )
	  {
	    var group = JSON.stringify( f(o) );
	    groups[group] = groups[group] || [];
	    groups[group].push( o );  
	  });
	  
	  return Object.keys(groups).map( function( group ){
		  return groups[group]; 
	  });
	};

CaseGrid.prototype.load = function(shipment) {
	var _this = this;
	
	this.shipment = shipment;
	this.dewars = shipment.dewarVOs;
	
	if (this.dewars.length > 0){
		function onSuccess(sender, containers){
			var dewars = (_this.groupBy(containers, function(item){
				  return [item.Dewar_dewarId];
			}));
			var data = [];
			for (var i = 0; i < dewars.length; i++) {
				data.push({serialized : JSON.stringify(dewars[i])})
			}
			_this.store.loadData(data);
		}
		
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getDewarsByShipmentId(shipment.shippingId);
	}
};


CaseGrid.prototype.edit = function(dewar) {
	var _this = this;
	var caseForm = new CaseForm();
	
	var window = Ext.create('Ext.window.Window', {
	    title: 'Parcel',
	    height: 360,
	    width: 600,
	    modal : true,
	    layout: 'fit',
	    items: [
	            	caseForm.getPanel(dewar)
	    ],
	    buttons : [ {
						text : 'Save',
						handler : function() {
							var adapter = new DataAdapter();
							_this.panel.setLoading();
							var dewar = caseForm.getDewar();
							var onSuccess = (function(sender, shipment) {
								_this.load(shipment);
								window.close();
								_this.panel.setLoading(false);
							});
							dewar["sessionId"] = dewar.firstExperimentId;
							dewar["shippingId"] = _this.shipment.shippingId;
							EXI.getDataAdapter({onSuccess : onSuccess}).proposal.dewar.saveDewar(_this.shipment.shippingId, dewar);
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

CaseGrid.prototype._getStoreFields = function() {
	return [ {
		name : 'serialized',
		type : 'string'
	}
	];
};

CaseGrid.prototype.getDewarById = function(dewarId) {
	var _this = this;
	for (var i = 0; i < _this.dewars.length; i++) {
		if (_this.dewars[i].dewarId == dewarId){
			return _this.dewars[i];
		}
	}
};

CaseGrid.prototype.saveStockSolution = function(stockSolution) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(){
		var onSuccess2 = function(){
			_this.panel.setLoading(false);
			_this.load(_this.shipment);
		};
		EXI.getDataAdapter({onSuccess : onSuccess2}).proposal.proposal.update();
	}
	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.stockSolution.saveStockSolution(stockSolution);
};



CaseGrid.prototype.addPuckToDewar = function(dewarId) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(){
		_this.load(_this.shipment);
		_this.panel.setLoading(false);
	};
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.addPuck(this.shipment.shippingId, Number(dewarId));
	
};

CaseGrid.prototype.removePuck = function(puckId) {
	var _this = this;
	this.panel.setLoading();
	var onSuccess = function(sender, data){
		_this.load(_this.shipment);
		_this.panel.setLoading(false);
	};
	EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.removeContainerById(_this.shipment.shippingId,puckId,puckId );
	
};

/** Open a window with the stock solutions **/
CaseGrid.prototype.openStockSolutionWindow = function(dewarId) {
	var _this = this;
	var stockSolutionGrid = new StockSolutionGrid({
		btnAddVisible : false,
		btnEditVisible : false,
		btnRemoveVisible : false,
		btnAddExisting : false,
		isPackedVisible : false,
		multiselect : true
	});

	var window = Ext.create('Ext.window.Window', {
		height : 400,
		width : 700,
		items : [ stockSolutionGrid.getPanel() ],
		buttons : [ {
			text : 'Pack',
			handler : function() {
				window.close();
				stockSolutionGrid.selectedStockSolutions[0]["boxId"] = dewarId;
				_this.saveStockSolution(stockSolutionGrid.selectedStockSolutions[0]);
				
			}
		}, {
			text : 'Cancel',
			handler : function() {
				window.close();
			}
		} ]

	}).show();

	stockSolutionGrid.load(EXI.proposalManager.getUnpackedStockSolutions());
};

CaseGrid.prototype.getPanel = function() {
	var _this = this;

	/** Store **/
	this.store = Ext.create('Ext.data.Store', {
		fields : this._getStoreFields(),
		data : [],
		autoload : true
	});

	
	this.panel = Ext.create('Ext.grid.Panel', {
		style : {
			padding : 15
		},
		cls : 'border-grid',
		height : 800,
		deferEmptyText: false,
	    	emptyText: 'No data',
		store : this.store,
		columns : this._getColumns(),
		disableSelection : true,
		viewConfig : {
			stripeRows : true,
				enableTextSelection : true,
				preserveScrollOnRefresh : true,
				stripeRows : true,
				rowLines : true,
				listeners : {
					celldblclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
						_this.edit(_this.getDewarById(JSON.parse(record.data.serialized)[0].Dewar_dewarId));
					},
					cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

							if (e.target.name == 'printLabels') {
								var dewarId = e.target.id.trim();
								var url = EXI.getDataAdapter().proposal.shipping.getDewarLabelURL(_this.shipment.shippingId, dewarId);
								console.log(dewarId);
								location.href = url;
								return;
							}
							if (e.target.name == 'removeParcel') {
								BUI.showWarning("Not implemented yet");
								return;
							}
							if (e.target.name == 'editParcel') {
								_this.edit(_this.getDewarById(parseInt(e.target.id.trim())));
								return;
							}
							if (e.target.name == 'edit') {
								/** Edit stock solution **/
								if (e.target.id.indexOf("Stock Solution") != -1){
									var stockSolutionId = e.target.id.split("_")[1];
									location.hash = "/stocksolution/" + stockSolutionId +"/main";
								}
								
								if (e.target.id.indexOf("Puck") != -1){
									var containerId = e.target.id.split("_")[1];
									//location.hash = "/puck/" + containerId +"/main";
									var puckForm = new PuckForm({
										width : Ext.getBody().getWidth() - 150
									});

									puckForm.onSaved.attach(function(sender, puck){
										_this.load(_this.shipment);
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

									if (containerId != null){
										var onSuccess = function(sender, puck){
											puckForm.load(puck);
										};
										EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(containerId,containerId,containerId);
									}

								}
								
							}
							
							
							if (e.target.defaultValue == 'Add Solution') {
								_this.openStockSolutionWindow(e.target.id);
							}
							
							if (e.target.defaultValue == 'Add Puck') {
								_this.addPuckToDewar(e.target.id);
							}
							

							if (e.target.defaultValue == 'Unpack') {
								if (e.target.name == "stockSolution"){
									var stockSolution = EXI.proposalManager.getStockSolutionById(e.target.id);
									stockSolution.boxId = null;
									_this.saveStockSolution(stockSolution);
								}
							}
							
							if (e.target.defaultValue == 'Remove') {
								var puckId = Number(e.target.id);
								if (e.target.name == "puck"){
									function showResult(result){
											if (result == "yes"){
												_this.removePuck(puckId);
											}
									}
									  Ext.MessageBox.show({
								           title:'Save Changes?',
								           msg: 'Removing a puck from this parcel will remove also its content. <br />Are you sure you want to continue?',
								           buttons: Ext.MessageBox.YESNOCANCEL,
								           fn: showResult,
								           animateTarget: 'mb4',
								           icon: Ext.MessageBox.QUESTION
								       });
									  
								}
							}
					}
				}
		},
		selModel : {
			mode : 'SINGLE'
		}
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
 * Example form
 * 
 * @witdh
 * @height
 */
function DataReductionForm(args) {
	this.id = BUI.id();
	this.width = null;
	this.height = null;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}

	var _this = this;

	/** Widgets **/
	this.plotWidget = new PlotWidget({
		width : 650,
		height : 490
	});

	/** Selected frames to be displayed **/
	this.selectedItems = {
		frames : [],
		averages : [],
		subtractions : []
	};

}

DataReductionForm.prototype._parseSelectedItemsToIds = function(selectedArray) {
	var ids = [];
	if (selectedArray != null) {
		for (var i = 0; i < selectedArray.length; i++) {
			ids.push(selectedArray[i].id);
		}
	}
	return ids;
};

DataReductionForm.prototype.onSelectionChanged = function(columnName, selected) {
	if (selected != null) {
		if (columnName == "Frames") {
			this.selectedItems.frames = selected;
			this.selectedItems.subtractions = [];
		}
		if (columnName == "Averages") {
			this.selectedItems.averages = selected;
		}
		if (columnName == "Subtractions") {
			this.selectedItems.frames = [];
			this.selectedItems.subtractions = selected;
		}
	}
	this.plotWidget.refresh(this._parseSelectedItemsToIds(this.selectedItems.frames), this._parseSelectedItemsToIds(this.selectedItems.subtractions));
};

DataReductionForm.prototype._getFramesExtPanel = function(store, columnName, height) {
	var _this = this;

	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
		mode : 'MULTI',
		listeners : {
			selectionchange : function(sm, selections) {
				var selected = [];
				for (var i = 0; i < selections.length; i++) {
					selected.push(selections[i].data);
				}
				_this.onSelectionChanged(columnName, selected);
			}
		}
	});

	return Ext.create('Ext.grid.Panel', {
		store : store,
		margin : 10,
		height : height,
		width : 200,
		selModel : selModel,
		columns : [ {
			text : columnName,
			dataIndex : 'fileName',
			flex : 1
		} ],
		viewConfig : {
		}
	});
};

DataReductionForm.prototype._getFramesPanel = function() {
	var fields = [ 'fileName', 'type', 'id' ];

	this.framesStore = Ext.create('Ext.data.Store', {
		fields : fields,
		sorters : 'fileName'
	});

	this.averagesStore = Ext.create('Ext.data.Store', {
		fields : fields
	});

	this.subtractionStore = Ext.create('Ext.data.Store', {
		fields : fields
	});

	var gridFrames = this._getFramesExtPanel(this.framesStore, "Frames", 375);
	var gridAvgs = this._getFramesExtPanel(this.averagesStore, "Averages", 125);
	var subtractionAvgs = this._getFramesExtPanel(this.subtractionStore, "Subtractions", 75);

	return {
		xtype : 'container',
		layout : 'vbox',
		items : [ gridFrames,  subtractionAvgs ]
	};
};

DataReductionForm.prototype._getImageContainer = function(name, help) {
	var html = "<div id='" + this.id + "_" + name + "'>" + name + "</div>"
	return {
		xtype : 'container',
		layout : 'vbox',
		items : [ {
			html : html,
			margin : "5 0 0 0",
			height : 95,
			width : 100
		}, {
			xtype : 'label',
			forId : 'myFieldId',
			text : help,
			margin : '5 0 0 0',
			cls : "inline-help"
		} ]
	}
};

DataReductionForm.prototype._getItems = function() {
	var _this = this;
	return [ {
		xtype : 'container',
		layout : 'hbox',
		items : [
				this._getFramesPanel(),
				this.plotWidget.getPanel(),
				{
					xtype : 'panel',
					width : 110,
					frame : true,
					margin : "10 5 5 5",
					border : 0,
					layout : 'vbox',
					items : [ this._getImageContainer("scattering", "Scattering"), this._getImageContainer("guinier", "Guinier Region"),
							this._getImageContainer("kratky", "Kratky Plot"), this._getImageContainer("gnom", "P(r) distribution") ]
				} ]
	} ]
};

DataReductionForm.prototype._getButtons = function() {
	return [];
};

DataReductionForm.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.form.Panel', {
		width : this.width,
		height : this.height,
		border : 0,
		items : this._getItems(),
		buttons : this._getButtons(),
		listeners : {
			afterrender : function() {
				_this._populate();
			}
		}
	});
	return this.panel;
};

/** Populates could be call when the DOM is not filled yet **/
DataReductionForm.prototype._populate = function() {
};

/** It populates the form * */
DataReductionForm.prototype.refresh = function(subtractions) {
	if (subtractions != null) {
		for (var i = 0; i < subtractions.length; i++) {
			/** Loading frame grids **/
			var subtraction = subtractions[i];
			var averages = [ {
				fileName : BUI.getFileName(subtraction.bufferAverageFilePath),
				type : 'bufferAvg',
				id : subtraction.subtractionId
			}, {
				fileName : BUI.getFileName(subtraction.sampleAverageFilePath),
				type : 'sampleAvg',
				id : subtraction.subtractionId
			}

			];
			this.averagesStore.loadData(averages, true);
			this.subtractionStore.loadData([ {
				fileName : BUI.getFileName(subtraction.substractedFilePath),
				type : 'SUBTRACTION',
				id : subtraction.subtractionId
			} ], true);

			var frames = [];
			/** Buffers **/
			if (subtraction.bufferOneDimensionalFiles != null) {
				if (subtraction.bufferOneDimensionalFiles.frametolist3VOs != null) {
					for (var j = 0; j < subtraction.bufferOneDimensionalFiles.frametolist3VOs.length; j++) {
						var frametolist3VO = subtraction.bufferOneDimensionalFiles.frametolist3VOs[j];
						if (frametolist3VO.frame3VO != null) {
							frames.push({
								fileName : BUI.getFileName(frametolist3VO.frame3VO.filePath),
								type : 'BUFFER',
								id : frametolist3VO.frame3VO.frameId
							});
						}
					}
				}
			}
			/** Samples **/
			if (subtraction.sampleOneDimensionalFiles != null) {
				if (subtraction.sampleOneDimensionalFiles.frametolist3VOs != null) {
					for (var j = 0; j < subtraction.sampleOneDimensionalFiles.frametolist3VOs.length; j++) {
						var frametolist3VO = subtraction.sampleOneDimensionalFiles.frametolist3VOs[j];
						if (frametolist3VO.frame3VO != null) {
							frames.push({
								fileName : BUI.getFileName(frametolist3VO.frame3VO.filePath),
								type : 'SAMPLE',
								id : frametolist3VO.frame3VO.frameId
							});
						}
					}
				}
			}

			this.framesStore.loadData(frames, true);

			/** Loading images **/
			this._displayImage("scattering", subtraction.subtractionId);
			this._displayImage("kratky", subtraction.subtractionId);
			this._displayImage("guinier", subtraction.subtractionId);
			this._displayImage("gnom", subtraction.subtractionId);
		}
	}
};

DataReductionForm.prototype._displayImage = function(name, subtractionId) {
//	var url = BUI.getURL() + '&type=' + name + '&subtractionId=' + subtractionId;
	var url = new DataAdapter().getImage(subtractionId, name);
	console.log(url);
	var event = "OnClick= window.open('" + url + "')";
//	name
	document.getElementById(this.id + "_" + name).innerHTML = '<img src=' + url + '   height="90" width="90" ' + event + '>';
//	return '<img src=' + url + '   height="100" width="100" >';
};

DataReductionForm.prototype.input = function() {
	return {};
};

/** It populates the form **/
DataReductionForm.prototype.test = function(targetId) {
	var macromoleculeForm = new DataReductionForm();
	var panel = macromoleculeForm.getPanel();
	panel.render(targetId);
};

//
//function PlotWidget(args) {
//	this.width = 600;
//	this.height = 600;
//	this.id = BUI.id();
//
//	this.linear = false;
//
//	this.margin =  "10 0 0 0";
//	/** for each stat the max and minimum value when it is scaled in order to show correctly in the legend **/
//	this.ranges = {};
//	if (args != null) {
//		if (args.width != null) {
//			this.width = args.width;
//		}
//		if (args.height != null) {
//			this.height = args.height;
//		}
//		if (args.margin != null) {
//			this.margin = args.margin;
//		}
//	}
//
//}
//
//PlotWidget.prototype.getMenu = function() {
//	var _this = this;
//	/** Actions buttons **/
//	var actions = [];
//	actions.push("->");
//	actions.push({
//		text : "Export as Image",
//		scope : this,
//		icon : '../images/save.gif',
//		handler : function(item, pressed) {
//			var largeImage = document.createElement("img");
//			largeImage.style.display = 'block';
//			largeImage.style.width = 200 + "px";
//			largeImage.style.height = 200 + "px";
//			largeImage.setAttribute('src', Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL());
//			window.open(Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL(), 'Image', '');
//		}
//	});
//
//	return actions;
//};
//
///** Looks for the maximum value and then divide everything but that value **/
//PlotWidget.prototype.scaledData = function(data) {
//	for (var i = 0; i < data.length; i++) {
//		var values = this.getMaxAndMinValue(data[i]);
//		data[i] = this.divideValuesByMax(data[i], values.max);
//		this.ranges[data[i].label] = values;
//	}
//	return data;
//};
//
///** Given a stat float[] and a max number it will divide each value by max **/
//PlotWidget.prototype.divideValuesByMax = function(stat, max) {
//	for (var j = 0; j < stat.data.length; j++) {
//		if (max != 0) {
//			stat.data[j] = Number(stat.data[j]) / max;
//			stat.std[j] = Number(stat.std[j]) / max;
//		}
//	}
//	return stat;
//};
//
///** returns max value of a stat **/
//PlotWidget.prototype.getMaxAndMinValue = function(stat) {
//	var max = 0;
//	var min = stat.data[0];
//	for (var j = 0; j < stat.data.length; j++) {
//		if (Number(stat.data[j]) > max) {
//			max = Number(stat.data[j]);
//		}
//		if (Number(stat.std[j]) > max) {
//			max = Number(stat.std[j]);
//		}
//		if (Number(stat.data[j]) < min) {
//			min = Number(stat.data[j]);
//		}
//	}
//	return {
//		max : Number(max),
//		min : Number(min)
//	};
//};
//
//PlotWidget.prototype._renderDygraph = function(parsed, colors, labels) {
//	this.dygraphObject = new StdDevDyGraph(this.id, {
//		width : this.width - 20,
//		height : this.height - 40,
//		xlabel : "",
//	});
//
//	this.dygraphObject.draw(parsed, colors, labels);
//
//};
//
//PlotWidget.prototype.getPanel = function() {
//	this.panel = Ext.create('Ext.panel.Panel', {
//		width : this.width,
//		height : this.height,
//		margin : this.margin,
//		tbar : this.getMenu(),
//		items : [ {
//			html : "",
//			id : this.id,
//			width : this.width,
//			height : this.height,
//			padding : 10,
//			margin : "0 0 0 -30",
//			border : 0
//		} ]
//	});
//
//	return this.panel;
//};
//
//PlotWidget.prototype.getPoint = function(y, error) {
//	var minus = y - error;
//	var max = y + error;
//
//	if (this.linear) {
//		return [ Math.abs(minus), y, Math.abs(max) ];
//	}
//	if ((minus != 0) && (max != 0)) {
//		return [ Math.log(Math.abs(minus)), Math.log(y), Math.log(Math.abs(max)) ];
//	} else {
//		return [ Math.log(y), Math.log(y), Math.log(y) ];
//	}
//
//};
//
//PlotWidget.prototype.getDataPlot = function(frames, subtractions, models, fits, rbms) {
//	var files = [];
//	var labels = [ "Intensity" ];
//	if (frames != null) {
//		for (var i = 0; i < frames.length; i++) {
//			files.push(frames[i].data);
//			labels.push(frames[i].fileName);
//		}
//	}
//	 function splitData(data, column, errorColumn, name){
//		 var result = []
//		 for (var j = 0; j < data.length; j++) {
//			 console.log(data[j][column]);
//			result.push([j,data[j][column],data[j][errorColumn]]);//[0, data[i][column],0]]);
//		}
//		 files.push(result);
//		 labels.push(name);
//	 }
//	 
//	if (subtractions != null) {
//		for (var i = 0; i < subtractions.length; i++) {
//			/** For subtraction **/
//			files.push(subtractions[i].subtraction.data);
//			labels.push(subtractions[i].subtraction.fileName);
//			/** For sample average **/
////			files.push(subtractions[i].sampleAvg.data);
////			labels.push(subtractions[i].sampleAvg.fileName);
//			/** For buffer average **/
////			files.push(subtractions[i].bufferAvg.data);
////			labels.push(subtractions[i].bufferAvg.fileName);
//		}
//	}
//	
//	if (models != null) {
//		for (var i = 0; i < models.length; i++) {
//			for ( var key in models[i]) {
//				 splitData(models[i][key].fir.data, 1, 2, "Intensity");
//				 splitData(models[i][key].fir.data, 3, 3, "Fit");
//			}
//		}
//	}
//	
//	if (fits != null) {
//		for (var i = 0; i < fits.length; i++) {
//			for ( var key in fits[i]) {
//				
//				/** adding fit file to be plotted **/
//						 if (fits[i][key].fit.data[0].length == 3){
//							 splitData(fits[i][key].fit.data, 1, 1, "Intensity");
//							 splitData(fits[i][key].fit.data, 2, 2, "Fit");
//						 }
//						 
//						 if (fits[i][key].fit.data[0].length == 5){
//							 /** X Intensity Fit Error Residues **/
//							
//							 splitData(fits[i][key].fit.data, 1, 3, "Intensity");
//							 splitData(fits[i][key].fit.data, 2, 2, "Fit");
//						 }
//			}
//		}
//	}
//	
//	var dataPoints = [];
//	if (files.length > 0) {
//		for (var i = 0; i < files[0].length; i++) {
//			dataPoints.push([ files[0][i][0], this.getPoint(files[0][i][1], files[0][i][2]) ]);
//		}
//		if (files.length > 1) {
//			for (var i = 1; i < files.length; i++) {
//				for (var j = 0; j < dataPoints.length; j++) {
//					if (files[i][j] != null){
//						dataPoints[j].push(this.getPoint(files[i][j][1], files[i][j][2]));
//					}
//					else{
//						dataPoints[j].push([0,0,0]);
//					}
//				}
//			}
//		}
//	}
//
//	return {
//		dataPoints : dataPoints,
//		labels : labels
//	};
//};
//
//PlotWidget.prototype.refresh = function(frames, subtractions, models, fits, rbms, colors) {
//	var _this = this;
////	this.panel.setLoading("Reading Files");
////	
////	var dataAdapter = new BiosaxsDataAdapter();
////	dataAdapter.onSuccess.attach(function(sender, data) {
////			_this.panel.setLoading("Rendering");
////			var parsed = _this.getDataPlot(data.frames, data.subtractions, data.models, data.fits, rbms);
////			_this._renderDygraph(parsed.dataPoints, colors, parsed.labels);
////		_this.panel.setLoading(false);
////	});
////	dataAdapter.onError.attach(function(sender, data) {
////		_this.panel.setLoading(false);
////	});
////	dataAdapter.getDataPlot(frames, subtractions, models, fits, rbms);
//};
//
//PlotWidget.prototype.input = function() {
//	return DATADOC.getHPLCData();
//};


/**
 *  Shows a list of experiment AKA data acquisitions
 *	@height
 *	@sorters 
 *	@minHeight
 *	@gridType: Ext.ux.LiveSearchGridPanel or Ext.grid.Panel
 *	@tbar true or false
 *	@grouping true or false
 *	@width
 *	@title
 *	#onEditButtonClicked
 */
function ExperimentGrid(args) {
	this.width = "100%";
	this.height = 700;
	this.minHeight = 500;

	this.id =  BUI.id();
	this.gridType = 'Ext.grid.Panel'; //'Ext.ux.LiveSearchGridPanel';
	this.tbar = false;
	this.hideHeaders = false;
	this.grouping = true;
	this.title = null;

	this.filtered = null;
	
	/** maximum row count **/
	this.limit = 100;
	
	this.sessionIdFilter = null;
	
	/** if not null filtered by date **/
	this.date = null;
	
	this.sorters = [ {
		property : 'date',
		direction : 'DESC'
	}, {
		property : 'time',
		direction : 'DESC'
	} ];

	this.dates = {};
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.limit != null) {
			this.limit = args.limit;
		}
		if (args.sorters != null) {
			this.sorters = args.sorters;
		}
		if (args.sessionId != null){
			this.sessionIdFilter = args.sessionId;
		}
		if (args.filtered != null) {
			this.filtered = args.filtered;
		}
		if (args.minHeight != null) {
			this.minHeight = args.minHeight;
		}
		if (args.gridType != null) {
			this.gridType = args.gridType;
		}
		if (args.tbar != null) {
			this.tbar = args.tbar;
		}
		if (args.grouping != null) {
			this.grouping = args.grouping;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.title != null) {
			this.title = args.title;
		}

	}
	/** Events **/
	this.onEditButtonClicked = new Event(this);
}

ExperimentGrid.prototype._getFilterTypes = function() {
	return [];
};

ExperimentGrid.prototype._prepareData = function(rows) {
	var data = [];
	var count = 0;
	
	rows.sort(function(a,b){return b.experimentId - a.experimentId;});
	for ( var i = 0; i < rows.length; i++) {
	var row = rows[i];
				this.dates[moment(row.creationDate).format("YYYYMMDD")] = moment(row.creationDate).format("MMM Do YY");
				if (
						  ( this.filtered == null || row.experimentType == this.filtered ) && (count < this.limit || this.limit == null )	&& (this.sessionIdFilter == null || this.date != null || (this.date == null && this.sessionIdFilter == row.sessionId)) 
					){

					data.push({
						experimentId : row.experimentId,
						status : row.status,
						dataAcquisitionFilePath : row.dataAcquisitionFilePath,
						type : row.experimentType,
						name : row.name,
						macromolecules_names : row.macromolecules,
						percentageAnalysed : {
							value : (row.dataCollectionDoneCount / row.dataCollectionCount) * 100,
							text : row.dataCollectionDoneCount + " of " + row.dataCollectionCount
						},
						percentageCollected : {
							value : (row.measurementDoneCount / row.measurementCount) * 100,
							text : row.measurementDoneCount + " of " + row.measurementCount
						},
						percentageMerged : {
							value : (row.measurementAveragedCount / row.measurementCount) * 100,
							text : row.measurementAveragedCount + " of " + row.measurementCount
						},
						date : moment(row.creationDate).format("YYYYMMDD"),
						time : moment(row.creationDate).format("YYYYMMDDHHmmss"),
						creationDate : row.creationDate
					});
					count ++;
		}
	}
	return data;
};

ExperimentGrid.prototype.getPanel = function(experiments) {
	this.features = experiments;
	return this._renderGrid(experiments);
};

ExperimentGrid.prototype.refresh = function(experiments) {
	
	this.experiments = experiments;
	var filtered = [];
	for ( var i = 0; i < experiments.length; i++) {
		if (experiments[i].experimentType != "TEMPLATE") {
			filtered.push(experiments[i]);
		}
	}

	this.parsedData = this._prepareData(filtered);
	
	var day = {};
	var dates = [];
	for ( var i = 0; i < this.experiments.length; i++) {
		var date  =  moment(this.experiments[i].creationDate).format("MMM Do YYYY");
		if (day[date] == null){
			dates.push({
				date : date,
				value :  moment(this.experiments[i].creationDate)
			});
			day[date] = true;
		}
	}
	
	this.storeDate.loadData(dates, false);
	this.store.loadData(this.parsedData, false);
	
	/** If it has already been filtered by date we keep the filter **/
	if (this.date != null){
		this._filterByDate(this.date);
	}
	
};

ExperimentGrid.prototype._getTopButtons = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		icon : '../images/calendar_icon.png',
		text : 'Show Calendar',
		disabled : false,
		handler : function(widget, event) {
			var window = Ext.create('Ext.window.Window', {
				title : 'Calendar',
				width : 600,
				height : 600,
				modal : true,
				closable : true,
				layout : {
					type : 'vbox',
					align : 'stretch'
				},
				items : [ {
					xtype : 'label',
					html : 'Click on a data acquisition to select:',
					margin : '5 5 5 5'
				}, {
					html : '<div id="calendar" style="height:450px;overflow-y: scroll;"></div>',
					margin : '5 5 5 5'
				}

				]
			}).show();

			var calendarWidget = new CalendarWidget({
				height : 450
			});
			var aux = _this.limit;
			/** we remove the limit temporarily **/
			_this.limit = null;
			_this.sessionIdFilter = null;
			calendarWidget.loadData(_this._prepareData(_this.experiments));
			_this.limit = aux;
			calendarWidget.draw('calendar');
			calendarWidget.onClick.attach(function(sender, date) {
				date = moment(date, "YYYY-MM-DD");
				_this._filterByDate(date);
				window.close();
				
			});

		}
	}));
	this.storeDate =  Ext.create('Ext.data.ArrayStore', {
		        fields: ['date', 'value'],
		        data : []
		    });
	
	this.dateMenu = Ext.create('Ext.form.field.ComboBox', {
	        hideLabel: true,
	        store: this.storeDate,
	        displayField: 'date',
	        typeAhead: true,
	        queryMode: 'local',
	        margin : '0 0 0 30',
	        triggerAction: 'all',
	        emptyText:'Select a date...',
	        selectOnFocus:true,
	        width:135,
	        listeners:{
	            scope: this,
	            'select': function (a,b,c){
	            	_this.limit = null;
	            	_this._filterByDate(moment(b[0].raw.value, "YYYY-MM-DD"));
	            }
	       }
	 });
	 
	actions.push(this.dateMenu);
	
	actions.push("->");
	if (_this.filtered != null){
		actions.push({
			html	: "<span>Experiment Type: " + _this.filtered +"</span>"
		});
	}
	else{
		actions.push({
			html	: "<span>Experiment Type: ALL</span>"
		});
	}
	return actions;
};

/**
 * Date format: "YYYY-MM-DD"
 */
ExperimentGrid.prototype._filterByDate = function(date) {
	var experimentsFiltered = [];
	/** Getting all the experiments of date**/
	for ( var i = 0; i < this.experiments.length; i++) {
		var experiment = this.experiments[i];
		if (experiment.creationDate != null) {
			var experimentDate = moment(experiment.creationDate);
			if (experimentDate.year() == date.year()) {
				if (experimentDate.month() == date.month()) {
					if (experimentDate.date() == date.date()) {
						experimentsFiltered.push(experiment);
					}
				}
			}
		}
	}
	var parsedData = this._prepareData(experimentsFiltered);
	this.store.loadData(parsedData);
	this.date = date;
};

/** Only for templates **/
ExperimentGrid.prototype._removeExperimentById = function(experimentId) {
	var _this = this;
	var adapter = new BiosaxsDataAdapter();
	adapter.onSuccess.attach(function(evt, args) {
		_this.grid.setLoading(false);
		document.getElementById(BIOSAXS.targetId).innerHTML = "";
		BIOSAXS.start(BIOSAXS.targetId);
	});
	this.grid.setLoading("Removing experiment ");
	adapter.removeExperimentById(experimentId);
};

ExperimentGrid.prototype._renderGrid = function() {
	var _this = this;

	/** Store **/
	this.store = Ext.create('Ext.data.Store', {
		fields : ["name"], 
//		groupField : 'date',
		autoload : true,
		data : [],
		remoteSort: false,
		sorters : this.sorters
	});

	
	
	
	var groupingFeature = Ext.create('Ext.grid.feature.Grouping', {
		groupHeaderTpl : Ext.create('Ext.XTemplate',
				"<div style='background:#0ca3d2; color:white; float:left; margin:6px 8px 0 0; padding:5px 8px;'>{name:this.formatName}</div>", {
					formatName : function(name) {
						return _this.dates[name];
					}
				}),
		hideGroupedHeader : true,
		startCollapsed : false
	});

	this.features = [];
	if (this.grouping) {
		this.features.push(groupingFeature);
	}

	/** Grid **/
	this.grid = Ext.create(this.gridType, {
		hideHeaders : this.hideHeaders,
		resizable : true,
		title : this.title,
		width : this.width,
		minHeight : this.minHeight,
		height : this.height,
		features : this.features,
		store : this.store,
		columns : this._getColumns(),
		selModel : {
			mode : 'SINGLE'
		},
		viewConfig : {
			stripeRows : true,
			getRowClass : function(record, rowIdx, params, store) {
				if (record.raw.type == "TEMPLATE") {
					return "template-color-row";
				}
				if ((record.raw.type == "CALIBRATION") && (record.raw.status == "FINISHED")) {
					return "blue-row";
				}
			},
			listeners : {
				itemdblclick : function(dataview, record, item, e) {
					_this._editExperiment(record.raw.experimentId);
				},
				cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'GO') {
						_this._editExperiment(record.raw.experimentId);
					}

					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'REMOVE') {
						_this._removeExperimentById(record.raw.experimentId);
					}

				}
			}
		}
	});

	var actions = _this._getTopButtons();

	if (this.tbar) {
		this.grid.addDocked({
			xtype : 'toolbar',
			height : 48,
			items : actions
		});
		this.grid.getSelectionModel().on({
			selectionchange : function(sm, selections) {
				if (selections.length) {
					for ( var i = 0; i < actions.length; i++) {
						if (actions[i].enable) {
							actions[i].enable();
						}
					}
				} else {
					for ( var i = 0; i < actions.length; i++) {
						if (actions[i].alwaysEnabled == false) {
							if (actions[i].disable) {
								actions[i].disable();
							}
						}
					}
				}
			}
		});
	}

	return this.grid;
};

ExperimentGrid.prototype._getColumns = function() {
	var _this = this;
	function actionItemRenderer(value, meta, record, rowIx, ColIx, store) {
		if (record.raw.buffer3VOs != null) {
			if (record.raw.buffer3VOs.length > 0) {
				return 'x-hide-display';
			}
		}

		if (record.data.platesCount > 0) {
			return 'x-hide-display';
		}
	}

	return [
		{
			text : 'experimentId',
			dataIndex : 'experimentId',
			name : 'experimentId',
			type : 'string',
			hidden : true
		},
		{
			xtype : 'rownumberer',
			width : 40
		},
		{
			text : 'Name',
			dataIndex : 'name',
			name : 'name',
			type : 'string',
			flex : 1
		},

		{
			text : 'Type',
			dataIndex : 'type',
			name : 'type',
			type : 'string',
			flex : 1,
			renderer : function(val) {
				if (val == "CALIBRATION") {
					return "<span style='color:blue;'>" + val + "</span>";
				}

				return val;
			}
		},
		{
			text : 'Macromolecules',
			name : 'macromolecules_names',
			dataIndex : 'macromolecules_names',
			flex : 1,
			renderer : function(val) {
				if (val != null) {
					return " <span style='font-weight:bold'>" + val + "</span>";
				}
				return " <span style='font-style:italic;color:gray;'>Information not available</span>";
			}
		},
		{
			text : 'Buffers',
			dataIndex : 'buffer_names',
			name : 'buffer_names',
			flex : 1,
			hidden : true,
			renderer : function(val) {
				return "Buffer/s: <span style='font-weight:bold'>" + val + "</span>";
			}
		},
		{
			text : 'Status',
			dataIndex : 'status',
			name : 'status',
			type : 'string',
			flex : 1,
			renderer : function(val, x, sample) {
				if (sample.raw.type == "TEMPLATE") {
					return "READY";
				}
				if (sample.raw.status == "ABORTED") {
					return "<span style='color:red;'>" + val + "</span>";
				}
				return "<span style='color:green;'>" + val + "</span>";
			}
		},
		{
			text : 'Download',
			dataIndex : 'creationDate',
			name : 'creationDate',
			renderer : function(val, x, sample) {
				if (sample != null) {
					if (sample.raw.type == "HPLC") {
						return;
					}
					return BUI.getZipHTMLByExperimentId(sample.raw.experimentId, sample.raw.name);
				}
			},
			width : 100

		},
		{
			header : 'Measurements',
			dataIndex : 'percentageCollected',
			name : 'percentageCollected',
			type : 'string',
			renderer : function(val, y, sample) {
				if ((sample.raw.type == "TEMPLATE") || (sample.raw.type == "HPLC")) {
					return;
				}
				return "<table><tr><td>" + BUI.getProgessBar(sample.raw.percentageCollected.value, sample.raw.percentageCollected.text) + "</td></table>";
			},
			width : 100
		},
		{
			header : 'Averaged',
			dataIndex : 'percentageMerged',
			name : 'percentageMerged',
			type : 'string',
			renderer : function(val, y, sample) {
				if ((sample.raw.type == "TEMPLATE") || (sample.raw.type == "HPLC")) {
					return;
				}
				return "<table><tr><td>" + BUI.getProgessBar(sample.raw.percentageMerged.value, sample.raw.percentageMerged.text) + "</td></table>";
			},
			width : 100
		},
		{
			header : 'Subtractions',
			dataIndex : 'percentageAnalysed',
			name : 'percentageAnalysed',
			type : 'string',
			renderer : function(val, y, sample) {
				if ((sample.raw.type == "TEMPLATE") || (sample.raw.type == "HPLC")) {
					return;
				}
				return "<table><tr><td>" + BUI.getProgessBar(sample.raw.percentageAnalysed.value, sample.raw.percentageAnalysed.text) + "</td></table>";
			},
			width : 100
		},

		{
			text : 'time',
			dataIndex : 'time',
			name : 'time',
			hidden : true,
			renderer : function(val) {
				return val;
			},
			width : 100

		}, {
			text : 'Date',
			dataIndex : 'date',
			name : 'date',
			renderer : function(val) {
				return val;
			},
			width : 100

		},

		{
			text : 'Time',
			dataIndex : 'creationDate',
			name : 'creationDate',
			renderer : function(val) {
				return moment(val).format(" HH:mm:ss");
			},
			width : 100

		}, {
			id : _this.id + 'GO',
			width : 80,
			sortable : false,
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				return BUI.getGreenButton('GO');
			}
		} ];
};

/** Changes location.href in order to edit the experiment **/
ExperimentGrid.prototype._editExperiment = function(experimentId) {
	if (Ext.urlDecode(window.location.href).sessionId != null) {
		location.href = 'viewProjectList.do?reqCode=display&experimentId=' + experimentId + '&sessionId='+ Ext.urlDecode(window.location.href).sessionId;
	} else {
		location.href = 'viewProjectList.do?reqCode=display&experimentId=' + experimentId;
	}
};

ExperimentGrid.prototype.input = function() {
	var experiments = DATADOC.getExperimentList_10();
	return {
		experiments : experiments,
		proposal : new MeasurementGrid().input().proposal

	};
};

ExperimentGrid.prototype.test = function(targetId) {
	var experimentGrid = new ExperimentGrid({
		height : 350,
		minHeight : 350,
		width : 1000

	});
	BIOSAXS.proposal = new Proposal(experimentGrid.input().proposal);
	var panel = experimentGrid.getPanel(experimentGrid.input().experiments);
	experimentGrid.refresh(experimentGrid.input().experiments);
	panel.render(targetId);
};

/**
 * Shows the header for the experiments changing the color and parameters depending on experiment type
 * 
 */
function ExperimentHeaderForm(args) {
	this.id = BUI.id();
	this.backgroundColor = '#FFFFFF';
}


ExperimentHeaderForm.prototype.load = function(experiment) {
	this.experiment = experiment;
	Ext.getCmp(this.id + "name").setValue(experiment.name);
	document.getElementById(this.id + "date").innerHTML = "Created on " + (experiment.creationDate);
	Ext.getCmp(this.id + "comments").setValue(experiment.json.comments);
};


ExperimentHeaderForm.prototype.getToolBar = function() {
	var _this = this;
	return [
	        {
	            text: 'Save',
	            width : 100,
	            handler : function(){
	            	_this.panel.setLoading();
	            	var onSuccess = (function(sender){
	            		_this.panel.setLoading(false);
	            		
	            	});
	            	EXI.getDataAdapter({ onSuccess : onSuccess}).saxs.experiment.saveExperiment(_this.experiment.experimentId, 
	            			Ext.getCmp(_this.id + "name").getValue(), 
	            			Ext.getCmp(_this.id + "comments").getValue());
	            }
	        },
	        '->',
	        Ext.create('Ext.button.Split', {
	            text: 'Download',
	            menu: new Ext.menu.Menu({
	                items: [
	                    {text: 'For BsxCube on bm29', handler: function(){
	                    		window.open(EXI.getDataAdapter().saxs.template.getTemplateSourceFile(_this.experiment.experimentId, "bsxcube")); 
	                    	}
	                    },
	                    {text: 'For Becquerel on p12', handler: function(){
	                    		window.open(EXI.getDataAdapter().saxs.template.getTemplateSourceFile(_this.experiment.experimentId, "becquerel"));
	                    	}
	                    }
	                ]
	            })
	        })
	];
};

ExperimentHeaderForm.prototype.getPanel = function() {
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		buttons : this.getToolBar(),
		cls : 'border-grid',
		items : [
		         {
				xtype : 'container',
				margin : '10 0 0 20',
				layout : 'hbox',
				items : [ {
					xtype : 'container',
					layout : 'vbox',
					items : [ {
								xtype : 'textfield',
								fieldLabel : 'Name' ,
								id : this.id + "name"
						}, 
						{
								margin : '0 0 0 100',
								html : "<div style='color:gray;' id='" + this.id + "date';></div>"
						},
						 ] 
				},
				{
					xtype : 'textarea',
					fieldLabel : 'Comments',
					margin : '0 0 10 20',
					width : 600 ,
					height : 80 ,
					id : this.id + "comments"
				}

				]  }
		] });
	return this.panel;
};


function FramesGrid (args) {
    this.id = BUI.id();
    this.selectedFrames = [];

    this.onSelectionChange = new Event(this);
}

FramesGrid.prototype.getPanel = function () {
    return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : true
	}
};

FramesGrid.prototype.load = function (frames) {
    if (frames) {
        this.frames = frames;
        this.frames.id = this.id;

        var html = "";
        dust.render("frames.grid.template",frames,function (err,out){
            html += out;
        });

        $("#" + this.id).html(html);

        this.setClickListeners();
    } else {
        $("#" + this.id).html("<h4>No frames found</h4>");
    }
};

FramesGrid.prototype.setClickListeners = function () {
    var _this = this;
    $('#' + this.id + '-frames-table').unbind('click').on('click', '.frame-cell-element', function(event) {
        var domId = event.target.id;
        if (event.shiftKey && _this.selectedFrames.length > 0){
            var last = _this.selectedFrames[_this.selectedFrames.length-1].domId;
            if (last != domId) {
                var lastIndex = _this.frames.indexOf(_this.getFrameByDomId(last));
                var currentIndex = _this.frames.indexOf(_this.getFrameByDomId(domId));
                var begin = Math.min(lastIndex, currentIndex);
                var end = Math.max(lastIndex, currentIndex);
                _this.deselectAll();
                for (var i = begin ; i <= end ; i++) {
                    _this.select(_this.frames[i].domId);
                }
            }
        } else {
            if (event.ctrlKey) {
                if (_this.selectedFrames.indexOf(_this.getFrameByDomId(domId)) >= 0) {
                    _this.deselect(domId);
                } else {
                    _this.select(domId);
                }
            } else {
                if (_this.selectedFrames.length == 1 && _this.selectedFrames[0].domId == domId) {
                    _this.deselect(domId);
                } else {
                    _this.deselectAll();
                    _this.select(domId);
                }
            }
        }
        _this.onSelectionChange.notify(_this.parseSelected());
    });
}

FramesGrid.prototype.select = function (domId) {
    this.selectedFrames.push(this.getFrameByDomId(domId));
    $("#" + domId).addClass('x-grid-item-selected');
}

FramesGrid.prototype.deselect = function (domId) {
    var _this = this;
    _.remove(this.selectedFrames,function(o) {return o.domId == domId});
    $("#" + domId).removeClass('x-grid-item-selected');
}

FramesGrid.prototype.deselectAll = function () {
    this.selectedFrames = [];
    $(".frame-cell-element").removeClass("x-grid-item-selected");
}

// FramesGrid.prototype.getFileName = function (filePath) {
//     var withExtension = filePath.substring(filePath.lastIndexOf('/')+1);
//     return withExtension.substring(0,withExtension.indexOf("."));
// }

FramesGrid.prototype.getFrameByDomId = function (domId) {
    var _this = this;
    return _.filter(this.frames,function (o) {return o.domId == domId})[0];
};

FramesGrid.prototype.parseSelected = function () {
    var parsed = {
                    average         : [],
                    bufferaverage   : [],
                    frame           : [],
                    sampleaverage   : [],
                    subtracted      : []
                };
    for (var i = 0 ; i < this.selectedFrames.length ; i++) {
        var frame = this.selectedFrames[i];
        switch (frame.type) {
            case 'Frame':
                parsed.frame.push(frame.frameId);
                break;
            case 'Subtraction':
                parsed.subtracted.push(frame.frameId);
                break;
            case 'BufferAverage':
                parsed.bufferaverage.push(frame.frameId);
                break;
            case 'SampleAverage':
                parsed.sampleaverage.push(frame.frameId);
                break;
        }
    }
    return parsed;
}
/**
 * Class for managing wizards
 * 
 * @title
 * @description
 * @data
 * @onNextFn
 * @onBackFn
 **/ 
function GenericStepWizardForm(title, description, data, onNextFn, onBackFn){
	this.id = BUI.id();
	this.title = title;
	this.description = description;
	this.data = data;
	this.onNext = onNextFn;
	this.onBack = onBackFn;
}

GenericStepWizardForm.prototype.getForm = function(){
	alert("[getForm] Not implemented");

};

GenericStepWizardForm.prototype.getNextForm = function(){
	alert("[getNextForm] Not implemented");
};

/** When coming back to the same form **/
GenericStepWizardForm.prototype.reload = function(){
	alert("[getNextForm] Not implemented");
};




function HPLCGraph(args) {
	this.width = 600;
	this.height = 600;
	this.title = '';
	this.bbar = false;
	this.plotInnerPanelPadding = 10;
	this.plotPanelPadding = 10;
	this.id = BUI.id();

	this.hidePlots = null;
	this.xlabel = "";
	this.scaled = false;
	this.xParam = null;
	this.showRangeSelector = true;
	this.interactionModel = null;

	/** for each stat the max and minimum value when it is scaled in order to show correctly in the legend **/
	this.ranges = {};
	if (args != null) {
		if (args.interactionModel != null) {
			this.interactionModel = args.interactionModel;
		}		
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.bbar != null) {
			this.bbar = args.bbar;
		}
		if (args.title != null) {
			this.title = args.title;
		}
		if (args.plots != null) {
			this.plots = args.plots;
		}

		if (args.scaled != null) {
			this.scaled = args.scaled;
		}
		if (args.xlabel != null) {
			this.xlabel = args.xlabel;
		}
		if (args.xParam != null) {
			this.xParam = args.xParam;
		}
		if (args.showRangeSelector != null) {
			this.showRangeSelector = args.showRangeSelector;
		}
	}

	this.onZoomX = new Event(this);
	this.onResetZoom = new Event(this);
	this.dblclick = new Event(this);
	this.onClearSelection = new Event(this);
}

HPLCGraph.prototype.getMenu = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	function toggle(item, pressed) {
		if (pressed) {
			_this.plots[item.param] = true;
		} else {
			delete _this.plots[item.param];
		}
		_this.reloadData(this.hplcData);
	}

	for (var i = 0; i < this.hplcData.length; i++) {
		if (this.hplcData[i].showOnMenu != false) {
			var param = this.hplcData[i].param;
			var style = "style='padding:0 0px 0 5px;'";
			actions.push({
				text : "<table><tr><td>" + BUI.getRectangleColorDIV(this.hplcData[i].color, 10, 10) + "</td><td " + style + "> "
						+ this.hplcData[i].label + "</td></tr></table>",
				id : _this.id + param,
				param : param,
				enableToggle : true,
				scope : this,
				toggleHandler : toggle,
				pressed : (_this.plots[param] != null) });
		}
	}
	actions.push("-");

	actions.push({
		text : "Scale",
		enableToggle : true,
		scope : this,
		pressed : this.scaled,
		icon : '../images/icon_graph.png',
		toggleHandler : function(item, pressed) {
			_this.scaled = pressed;
			_this.reloadData(this.hplcData);
		} });

	actions.push("->");
	actions.push({
		text : "Save",
		scope : this,
		icon : 'images/icon/ic_get_app_black_24dp.png',
		handler : function(item, pressed) {
			var largeImage = document.createElement("img");
			largeImage.style.display = 'block';
			largeImage.style.width = 200 + "px";
			largeImage.style.height = 200 + "px";
			largeImage.setAttribute('src', Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL());
			window.open(Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL(), 'Image', '');
		} });

	return actions;
};

/** Looks for the maximum value and then divide everything but that value **/
HPLCGraph.prototype.scaledData = function(data) {
	for (var i = 0; i < data.length; i++) {
		var values = this.getMaxAndMinValue(data[i]);
		data[i] = this.divideValuesByMax(data[i], values.max);
		this.ranges[data[i].label] = values;
	}
	return data;
};

/** Given a stat float[] and a max number it will divide each value by max **/
HPLCGraph.prototype.divideValuesByMax = function(stat, max) {
	for (var j = 0; j < stat.data.length; j++) {
		if (max != 0) {
			stat.data[j] = Number(stat.data[j]) / max;
			stat.std[j] = Number(stat.std[j]) / max;
		}
	}
	return stat;
};

/** returns max value of a stat **/
HPLCGraph.prototype.getMaxAndMinValue = function(stat) {
	var max = 0;
	var min = stat.data[0];
	for (var j = 0; j < stat.data.length; j++) {
		if (Number(stat.data[j]) > max) {
			max = Number(stat.data[j]);
		}
		if (Number(stat.std[j]) > max) {
			max = Number(stat.std[j]);
		}
		if (Number(stat.data[j]) < min) {
			min = Number(stat.data[j]);
		}
	}
	return {
		max : Number(max),
		min : Number(min) };
};

HPLCGraph.prototype.getPoint = function(data, i) {
	var point = [ 10, 10, 10 ];
	var y = parseFloat(data.data[i]);
	var error = parseFloat(data.std[i]);
	if (data.fdata == null) {
		return [ y - error, y, y + error ];
	} else {
		if (data.fstd != null) {
			return [ data.fstd(y - error), data.fdata(y), data.fstd(y + error) ];
		}
		return [ data.fdata(y) - error, data.fdata(y), data.fdata(y) + error ];
	}	
};

HPLCGraph.prototype.reloadData = function(hplcData) {
	this.panel.setLoading(false);
	this.hplcData = hplcData;

	var data = hplcData;


	if (this.scaled) {
		data = this.scaledData(JSON.parse(JSON.stringify(hplcData)));
	}
	var paramIndex = {};
	var parsed = [];
	var j = 0;
	for (var i = 0; i < data[0].data.length - 1; i++) {
		var aux = [];
		for (j = 0; j < data.length; j++) {
			if (this.plots != null) {
				if (this.plots[data[j].param] != null) {
					aux.push(this.getPoint(data[j], i));
					paramIndex[data[j].param] = aux.length - 1;
				}
			} else {
				aux.push([ data[j].data[i] - data[j].std[i], data[j].data[i], data[j].data[i] + data[j].std[i] ]);
			}
		}
		parsed.push([]);

		var index = i;
		if (this.xParam != null) {
			index = parseFloat(data[this.xParam].data[i]);
		}

		parsed[parsed.length - 1].push(index);

		for (j = 0; j < data.length; j++) {
			if (this.plots != null) {
				if (this.plots[data[j].param] != null) {
					parsed[parsed.length - 1].push(aux[paramIndex[data[j].param]]);
				}
			} else {
				parsed[parsed.length - 1].push(aux[j]);
			}
		}
	}

	var colors = [];
	var labels = [ "" ];
	for (j = 0; j < data.length; j++) {
		if (this.plots != null) {
			if (this.plots[data[j].param] != null) {
				colors.push(data[j].color);
				labels.push(data[j].label);
			}
		} else {
			parsed[parsed.length - 1].push(aux[j]);
		}
	}

	this._renderDygraph(parsed, colors, labels);
};

HPLCGraph.prototype._renderDygraph = function(parsed, colors, labels) {
	var _this = this;
	Ext.getCmp(this.id).setWidth(this.panel.getWidth());
	this.dygraphObject = new StdDevDyGraph(this.id, {
		width : this.panel.getWidth() - 20,
		height : this.height - 10,
		xlabel : this.xlabel,
		showRangeSelector : this.showRangeSelector,
		interactionModel : this.interactionModel,
		scaled : this.scaled
//		ranges : this.ranges 
	});
	this.dygraphObject.draw(parsed, colors, labels);

	var _this = this;
	this.dygraphObject.onZoomX.attach(function(sender, args) {
		try {
			_this.onZoomX.notify(args);
		} catch (e) {}
	});

	this.dygraphObject.onResetZoom.attach(function(sender, args) {
		try {
			_this.onResetZoom.notify(args);
		} catch (e) {}
	});

	this.dygraphObject.dblclick.attach(function(sender, args) {
		try {
			_this.dblclick.notify(args);
		} catch (e) {}
	});

};

HPLCGraph.prototype.loadData = function(data,experimentId) {
	var _this = this;
    this.experimentId = experimentId;
	this.reloadData(data);
	this.panel.addDocked({
		cls : 'hplcMenu',
		xtype : 'toolbar',
		items : this.getMenu() });

	if (this.bbar == true) {
		this.panel.addDocked({
			border : 1,
			xtype : 'toolbar',
			dock : 'bottom',
			cls : 'hplcMenu',
			items : [ {
				xtype : 'numberfield',
				id : 'main_field_start',
				fieldLabel : 'Range from',
				width : 200,
				labelWidth : 100,
				value : 0,
				minValue : 0 }, {
				xtype : 'numberfield',
				id : 'main_field_end',
				fieldLabel : 'to',
				width : 130,
				labelWidth : 30,
				value : 0,
				minValue : 0 }, {
				xtype : 'button',
				text : 'Go',
				handler : function() {
					var start = parseFloat(Ext.getCmp("main_field_start").getValue());
					var end = parseFloat(Ext.getCmp("main_field_end").getValue());

					if (start < 0) {
						start = 0;
					}
					if (end < 0) {
						end = 0;
					}
					if (start > end) {
						var aux = end;
						end = start;
						start = aux;
					}

					_this.dygraphObject.dygraph.updateOptions({
						isZoomedIgnoreProgrammaticZoom : true,
						dateWindow : [ start, end ] });
				} },
                {
				xtype : 'button',
				text : 'Download Range',
                icon : '../images/icon/ic_get_app_black_24dp.png',
				handler : function() {
					var start = parseFloat(Ext.getCmp("main_field_start").getValue());
					var end = parseFloat(Ext.getCmp("main_field_end").getValue());

					if (start < 0) {
						start = 0;
					}
					if (end < 0) {
						end = 0;
					}
					if (start > end) {
						var aux = end;
						end = start;
						start = aux;
					}

					location.href = EXI.getDataAdapter().saxs.hplc.getDownloadHDF5FramesURL(_this.experimentId,start, end)
				} },
				"->",
				 {
					xtype : 'button',
					text : 'Clear Selection',
					handler : function() {
						_this.onClearSelection.notify();
					} }
					] });
	}
};

HPLCGraph.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		margin : this.plotPanelPadding, 
        flex : 1,       		
		items : [ {
			html : "",
			id : this.id,			
			height : this.height } ] });

	this.panel.on("afterrender", function(panel) {
		document.getElementById(this.id).setAttribute("style",
				"border: 1px solid #000000; height:" + (panel.getHeight() - 1) + "px;width:" + (panel.getWidth() - 50) + "px;");

	});

	return this.panel;
};



HPLCGraph.prototype.getDataByFrameNumber = function(frameNumber) {
	var data = {};
	data.frameNumber = frameNumber;
	for ( var key in this.hplcData) {
		data[this.hplcData[key].label] = this.hplcData[key].data[frameNumber];
	}
	return data;
};


function MergesHPLCGraph(args) {
	HPLCGraph.prototype.constructor.call(this, args);

	//	this.peakColors = ["#00FB42", "#00BA31", "#007C21", "#003E10"];
	this.peakColors = [ "#DEBD00", "#6D9100", "#872900", "#0092CC" ];
}

MergesHPLCGraph.prototype.scaledData = HPLCGraph.prototype.scaledData;
MergesHPLCGraph.prototype.divideValuesByMax = HPLCGraph.prototype.divideValuesByMax;
MergesHPLCGraph.prototype.getMaxAndMinValue = HPLCGraph.prototype.getMaxAndMinValue;
MergesHPLCGraph.prototype.getPoint = HPLCGraph.prototype.getPoint;
MergesHPLCGraph.prototype.reloadData = HPLCGraph.prototype.reloadData;
MergesHPLCGraph.prototype._renderDygraph = HPLCGraph.prototype._renderDygraph;
MergesHPLCGraph.prototype.loadData = HPLCGraph.prototype.loadData;
MergesHPLCGraph.prototype.getPanel = HPLCGraph.prototype.getPanel;
MergesHPLCGraph.prototype.getDataByFrameNumber = HPLCGraph.prototype.getDataByFrameNumber;

MergesHPLCGraph.prototype.setPeaks = function(data) {
	this.peaks = data;
	/** get size of peaks **/
	this.peakKeys = [];
	this.colorPeak = {};
	var colorCount = 1;
	for ( var key in this.peaks) {
		if (this.peaks.hasOwnProperty(key)) {
			var color = this.peakColors[colorCount % this.peakColors.length];
			colorCount = colorCount + 1;
			this.peakKeys.push(key);
			this.colorPeak[key] = color;
		}
	}
	this.peakKeys.sort();
};

MergesHPLCGraph.prototype.getMenu = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	function toggle(item, pressed) {
		if (pressed) {
			_this.plots[item.param] = true;
		} else {
			delete _this.plots[item.param];
		}
		_this.reloadData(_this.hplcData);
	}

	/** Toolbar for peaks  Average **/
	if (this.peaks != null) {
		var items = [];
		for (var i = 0; i < this.peakKeys.length; i++) {
			var color = this.colorPeak[this.peakKeys[i]];
			items.push({
				text : "<span style='color:" + color + "; font-weight:bold;'>Peak #" + i + " "
						+ this.peakKeys[i].replace("- ", " to #").replace(".0", "").replace(".0", "") + "</span>",
				peakid : this.peakKeys[i],
				checked : false,
				checkHandler : function(sender, pressed) {
					var item = new Object();
					item.param = sender.peakid;
					toggle(item, pressed);
				} });
		}

		var menu = Ext.create('Ext.menu.Menu', {
			id : 'mainMenu',

			style : {
				overflow : 'visible' },
			items : items });
		var tb = Ext.create('Ext.toolbar.Toolbar');
		tb.add({
			text : 'Peaks Avg.',
			menu : menu });
		actions.push(tb);
	}

	for (var i = 0; i < this.hplcData.length; i++) {
		if (this.hplcData[i].showOnMenu != false) {
			var param = this.hplcData[i].param;
			var style = "style='padding:0 0px 0 5px;'";
			actions.push({
				text : "<table><tr><td>" + BUI.getRectangleColorDIV(this.hplcData[i].color, 10, 10) + "</td><td " + style + "> "
						+ this.hplcData[i].label + "</td></tr></table>",
				id : _this.id + param,
				param : param,
				enableToggle : true,
				scope : this,
				margin : 5,
				toggleHandler : toggle,
				pressed : (_this.plots[param] != null) });
		}
	}

	actions.push("->");
	actions.push({
		text : "Save",
		scope : this,
		icon : '../images/icon/ic_get_app_black_24dp.png',
		handler : function(item, pressed) {
			var largeImage = document.createElement("img");
			largeImage.style.display = 'block';
			largeImage.style.width = 200 + "px";
			largeImage.style.height = 200 + "px";
			largeImage.setAttribute('src', Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL());
			window.open(Dygraph.Export.asCanvas(this.dygraphObject.dygraph).toDataURL(), 'Image', '');
		} });

	return actions;
};

/**
 * Macromolecule form with the general parameters of a macromolecule
 * 
 * @witdh
 * @height
 * 
 * #onSave button save has been clicked
 * #onClose button close has been clicked
 */
function MacromoleculeForm(args) {
	this.id = BUI.id();
	this.width = 700;
	this.height = 700;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}
	
	/** Events **/
	this.onSave = new Event(this);
	this.onClose = new Event(this);
}

/** Type : is the Ext type then requiredtext or textfield * */
MacromoleculeForm.prototype._getFieldTextWithHelp = function(type, fieldLabel, fieldName, help) {
	return Ext.create('Ext.container.Container', {
		items : [ {
			xtype : type,
			fieldLabel : fieldLabel,
			name : fieldName,
			id : this.id + fieldName
		}, {
			xtype : 'label',
			forId : 'myFieldId',
			text : help,
			margin : "5 0 0 105",
			cls : "inline-help"
		} ]
	});
};

MacromoleculeForm.prototype._getNumericWithHelp = function(type, fieldLabel, fieldName, help) {
	return Ext.create('Ext.container.Container', {
		margin : "0 0 0 10",
		items : [ {
			xtype : type,
			fieldLabel : fieldLabel,
			name : fieldName,
			id : this.id + fieldName,
			decimalPrecision : 6,
			width : 220
		}, {
			xtype : 'label',
			forId : 'myFieldId',
			text : help,
			margin : "5 0 0 10",
			cls : "inline-help"
		} ]
	});
};

MacromoleculeForm.prototype._getButtons = function() {
	var _this = this;
	return [ {
		text : 'Save',
		handler : function() {
			_this._save();
		}
	}
	];
};

/** It persits the macromolecule in the database **/
MacromoleculeForm.prototype._persist = function(macromoleculeId, acronym, name, molecularMass, extintionCoefficient, comments, refractiveIndex, solventViscosity) {
	var proposalId = Ext.getCmp("proposalIdCombo").getValue();
	if (proposalId == null){
			BUI.showError("Please select a proposal");
			return;
	}
	
	/** Checking not duplicated acronym **/
	if (macromoleculeId == null){
		if (EXI.proposalManager.getMacromoleculeByAcronym(acronym) != null){
			BUI.showError("Duplicated acronym");
			return;
		}
	}
	
	if (macromoleculeId == null){
		/** new macromolecule **/
		this.macromolecule = {};
		this.macromolecule.macromoleculeId = null;
	}
	else{
		this.macromolecule.macromoleculeId = macromoleculeId;
	}
	
	this.macromolecule["acronym"] = acronym;
	this.macromolecule["name"] = name;
	this.macromolecule["molecularMass"] = molecularMass;
	this.macromolecule["extintionCoefficient"] = extintionCoefficient;
	this.macromolecule["comments"] = comments;
	this.macromolecule["symmetry"] =  Ext.getCmp(this.id + 'comboSym').getValue();
	this.macromolecule["refractiveIndex"] =  refractiveIndex;
	this.macromolecule["solventViscosity"] =  solventViscosity;
	this.macromolecule["proposalId"] =  proposalId;
	
	var _this = this;
	
	var onSuccess = (function(sender, proposal) {
		var onSuccess2 = function(sender, proposals){
			_this.panel.setLoading(false);
			_this.onSave.notify();
			_this.onClose.notify();
		};
		_this.panel.setLoading("Updading proposal information");
		EXI.getDataAdapter({onSuccess : onSuccess2}).proposal.proposal.update();
		
//		var manager = new ProposalUpdater(); 
//		manager.onSuccess.attach(function(sender, proposals){
//			_this.load(ProposalManager.getBuffers());	
//			_this.panel.setLoading(false);
//			_this.onClose.notify();
//		});
//		_this.panel.setLoading();
//		manager.get(true);
		
	});
	
	this.panel.setLoading("Saving Macromolecule");
	EXI.getDataAdapter({onSuccess: onSuccess }).saxs.macromolecule.saveMacromolecule(this.macromolecule);
};

/** Save the macromolecule in the DB **/
MacromoleculeForm.prototype._save = function() {
	
	var _this = this;
	
	var acronym = this._getField("acronym");
	var name = this._getField("name");
	var molecularMass = this._getField("molecularMass");
	var extintionCoefficient = this._getField("extintionCoefficient");
	var comments = this._getField("comments");
	
	var refractiveIndex = this._getField("refractiveIndex");
	var solventViscosity = this._getField("solventViscosity");
	
	/** Checking required fields **/
	if (name == "") {
		BUI.showError("Name field is mandatory");
		return;
	}
	if (acronym == "") {
		BUI.showError("Acroynm field is mandatory");
		return;
	}

	if (this.macromolecule != null){
		/** Checking if it is a new macromolecule **/
		if (this.macromolecule.macromoleculeId == null){
			/** Check if the acronym exists already **/
			this._persist(null, acronym, name, molecularMass, extintionCoefficient, comments, refractiveIndex, solventViscosity);
		}
		else{
			/** It is an update **/
			this._persist(this.macromolecule.macromoleculeId, acronym, name, molecularMass, extintionCoefficient, comments, refractiveIndex, solventViscosity);
		}
	}
	else{
		/** It is a new macromolecule **/
		this._persist(null, acronym, name, molecularMass, extintionCoefficient, comments, refractiveIndex, solventViscosity);
	}
};



MacromoleculeForm.prototype._getItems = function() {
	var _this = this;
	/** Symmetry combo box **/
	var symmetry = Ext.create('Ext.data.Store', {
		fields : [ 's' ],
		data : this._getSymmetries()
	});

	this.symmetryComboBox = Ext.create('Ext.form.ComboBox', {
		fieldLabel : 'Symmetry',
		store : symmetry,
		id : this.id + 'comboSym',
		queryMode : 'local',
		displayField : 's',
		valueField : 's',
		value : "P1", 
		margin : "0 0 0 30",
		width : 220
	});
	return [ BIOSAXS_COMBOMANAGER.getComboProposal({labelWidth : 100}),
	         this._getFieldTextWithHelp("requiredtextfield", "Name", "name", "Long name. i.e: Bovine serum albumin"),
			 this._getFieldTextWithHelp("requiredtextfield", "Acronym", "acronym", "Acronym will be used in the files and analisys. i.e: BSA"),
			 this._getFieldTextWithHelp("textfield", "Mol. Mass (Da)", "molecularMass", "Atomic mass estimation measured in Da"),
			{
				xtype : 'container',
				layout : 'hbox',
				margin : "10 0 0 0",
				items :[
				        	this._getNumericWithHelp("numberfield", "Extinction coef.", "extintionCoefficient", ""),
							this.symmetryComboBox
				        ]
			},
			{
				xtype : 'container',
				layout : 'hbox',
				margin : "5 0 0 0",
				items :[
				        	this._getNumericWithHelp("numberfield", "Refractive Index", "refractiveIndex", "How radiation propagates through the medium"),
							this._getNumericWithHelp("numberfield", "Solvent Viscosity", "solventViscosity", "")
				]
					
		
			},
			
			
			{
				id : this.id + "comments",
				xtype : 'textareafield',
				name : 'comments',
				margin : '35 0 0 10',
				fieldLabel : 'Comments',
				width : this.width - 100,
				height : 100
			} ];
	
	return  Ext.create('Ext.form.Panel', {
		width : this.width,
		height : this.height,
		items : this._getItems()
	});
};

MacromoleculeForm.prototype._getSymmetries = function() {
	return  [ {
		"s" : "P1"
	}, {
		"s" : "P2"
	}, {
		"s" : "P3"
	}, {
		"s" : "P4"
	}, {
		"s" : "P5"
	}, {
		"s" : "P6"
	}, {
		"s" : "P32"
	}, {
		"s" : "P42"
	}, {
		"s" : "P52"
	}, {
		"s" : "P62"
	}, {
		"s" : "P222"
	} ];
};

MacromoleculeForm.prototype.getPanel = function() {
	this.panel =  Ext.create('Ext.panel.Panel', {
		layout : 'hbox',
		buttons : this._getButtons(),
		cls : 'border-grid',
		items : [
		         {
					xtype : 'container',
					margin : '20 0 0 20',
					layout : 'vbox',
					items : this._getItems()
		         }]
	});
	return this.panel;
};


/** Populates each text field by field name and value **/
MacromoleculeForm.prototype._populateField = function(fieldName, value) {
	if (value != null){
		Ext.getCmp(this.id + fieldName).setValue(value);
	}
};

/** Gets the value of a textfield **/
MacromoleculeForm.prototype._getField = function(fieldName) {
	return Ext.getCmp(this.id + fieldName).getValue();
};


/** It populates the form **/
MacromoleculeForm.prototype.load = function(macromolecule) {
	this.macromolecule = macromolecule;
	if (macromolecule != null){
		this._populateField("name", macromolecule.name);
		this._populateField("acronym", macromolecule.acronym);
		this._populateField("extintionCoefficient", macromolecule.extintionCoefficient);
		this._populateField("molecularMass", macromolecule.molecularMass);
		this._populateField("comments", macromolecule.comments);
		this._populateField("refractiveIndex", macromolecule.refractiveIndex);
		this._populateField("solventViscosity", macromolecule.solventViscosity);
		if (macromolecule.symmetry != null){
			Ext.getCmp(this.id + 'comboSym').setValue(macromolecule.symmetry);
		}
		if (this.macromolecule.proposalId != null){
			Ext.getCmp("proposalIdCombo").setValue(this.macromolecule.proposalId);
			Ext.getCmp("proposalIdCombo").disable();
		}
		
	}
};


MacromoleculeForm.prototype.input = function() {
	return {};
};


/** It populates the form **/
MacromoleculeForm.prototype.test = function(targetId) {
	var macromoleculeForm = new MacromoleculeForm();
	macromoleculeForm.onClose.attach(function(sender){
		alert("Click on close");
	});
	var panel = macromoleculeForm.getPanel();
	panel.render(targetId);
};



/**
 * Macromolecule Grid showing macromolecules and adding anb updating buttons
 * 
 * @height
 * @maxHeight
 * @width
 * @cssFontStyle
 * @searchBar makes this grid as Ext.ux.LiveSearchGridPanel
 * @tbar top bar containing "Add" and "Update From SMIS" button 
 * @collapsed
 * @collapsible
 * @btnEditVisible
 * @btnRemoveVisible
 * @multiselect makes it multiselect using Ext.selection.CheckboxModel
 * 
 * #onSelected
 * #onMacromoleculesChanged
 */
function MacromoleculeGrid(args) {
	this.height = 500;
	this.width = 500;
	this.id = BUI.id();
	this.maxHeight = this.height;

	this.searchBar = false;
	this.tbar = false;

	this.collapsible = true;
	this.collapsed = true;
	

	this.btnEditVisible = true;
	this.btnRemoveVisible = false;
	this.multiselect = false;

	/** Font style applied to the acronym column **/
	this.cssFontStyle = null;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
			this.maxHeight = this.height;
		}
		if (args.maxHeight != null) {
			this.maxHeight = args.maxHeight;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.cssFontStyle != null) {
			this.cssFontStyle = args.cssFontStyle;
		}

		if (args.searchBar != null) {
			this.searchBar = args.searchBar;
		}
		if (args.tbar != null) {
			this.tbar = args.tbar;
		}
		if (args.collapsible != null) {
			this.collapsible = args.collapsible;
		}
		if (args.collapsed != null) {
			this.collapsed = args.collapsed;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
		if (args.multiselect != null) {
			this.multiselect = args.multiselect;
		}
	}

	this.onSelected = new Event();

	this.onMacromoleculesChanged = new Event();
}





MacromoleculeGrid.prototype.edit = function(macromolecule) {
	var _this = this;
	var window = new MacromoleculeWindow();
	window.onSave.attach(function(sender) {
//		_this.store.loadData(BIOSAXS.proposal.getMacromolecules());
//		_this.onMacromoleculesChanged.notify();
		_this.store.loadData(EXI.proposalManager.getMacromolecules());
	});
	window.draw(macromolecule);
};

MacromoleculeGrid.prototype.getTbar = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		icon: 'images/icon/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			_this.edit();
		}
	}));
	actions.push("->");
	actions.push(Ext.create('Ext.Action', {
		icon : 'images/icon/refresh.png',
		text : 'Update From SMIS',
		tooltip : "Retrieve all the macromolecules of your proposal from SMIS database",
		disabled : false,
		handler : function(widget, event) {
			_this.grid.setLoading("Connecting to SMIS");
			var adapter = new BiosaxsDataAdapter();
			adapter.onSuccess.attach(function(sender, data) {
				BIOSAXS.proposal.setMacromolecules(data.macromolecules);
				_this.refresh(BIOSAXS.proposal.macromolecules);
				_this.grid.setLoading(false);
			});
			adapter.onError.attach(function(sender, data) {
				_this.grid.setLoading(false);
			});
			adapter.updateDataBaseFromSMIS();
		}
	}));
	return actions;
};

MacromoleculeGrid.prototype.deselectAll = function() {
	this.grid.getSelectionModel().deselectAll();
};

MacromoleculeGrid.prototype.selectById = function(macromoleculeId) {
	this.grid.getSelectionModel().deselectAll();
	for ( var i = 0; i < this.grid.getStore().data.items.length; i++) {
		var item = this.grid.getStore().data.items[i].raw;
		if (item.macromoleculeId == macromoleculeId) {
			this.grid.getSelectionModel().select(i);
		}
	}
};

MacromoleculeGrid.prototype.load = function(macromolecules) {
	this.store.loadData(macromolecules, false);
};

MacromoleculeGrid.prototype.getColumns = function() {
	var _this = this;
	var columns = [
	{
		text : 'Acronym',
		dataIndex : 'acronym',
		id : this.id + "acronym",
		flex : 1,
		renderer : function(value, metaData, record, rowIndex, colIndex, store) {
			if (_this.cssFontStyle != null) {
				return "<span style='" + _this.cssFontStyle + "'>" + value + "</span>";
			}
			return value;
		}
	}, {
		text : 'Name',
		dataIndex : 'name',
		id : this.id + "name",
		flex : 1,
		hidden : false
	}, {
		text : 'Comments',
		dataIndex : 'comments',
		id : this.id + "comments",
		flex : 1,
		hidden : false
	} ];

	if (this.btnEditVisible) {
		columns.push( {
            xtype:'actioncolumn',
            width:40,
            text : 'Edit',
            items: [{
                icon: 'images/icon/edit.png',  // Use a URL in the icon config
                tooltip: 'Edit',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    _this.edit(EXI.proposalManager.getMacromoleculeById(rec.get('macromoleculeId')));
                }
            }]
        });
	}
	if (this.btnRemoveVisible) {
		columns.push({
			id : _this.id + 'buttonRemoveMacromolecule',
			width : 85,
			sortable : false,
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				if (_this.btnRemoveVisible) {
					return BUI.getRedButton('REMOVE');
				}
				return null;
			}
		});
	}

	return columns;
};

MacromoleculeGrid.prototype._prepareData = function(macromolecules) {
	return macromolecules;
};

/** Returns the grid **/
MacromoleculeGrid.prototype.getPanel = function(macromolecules) {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'macromoleculeId', 'name', 'acronym', 'comments' ],
		data : _this._prepareData(macromolecules)
	});

	this.store.sort('acronym');

	var type = 'Ext.grid.Panel';
	if (this.searchBar == true) {
		type = 'Ext.ux.LiveSearchGridPanel';
	}

	var selModel = null;
	if (this.multiselect) {
		selModel = Ext.create('Ext.selection.CheckboxModel', {
			multiSelect : this.multiselect,
			listeners : {
				selectionchange : function(sm, selections) {
					var macromolecules = [];
					for ( var i = 0; i < selections.length; i++) {
						macromolecules.push(selections[i].raw);
					}
					_this.onSelected.notify(macromolecules);
				}
			}
		});
	}

	this.grid = Ext.create(type, {
		id : this.id,
		title : 'Macromolecules',
		collapsible : this.collapsible,
		collapsed : this.collapsed,
		store : this.store,
		height : this.height,
		maxHeight : this.maxHeight,
		selModel : selModel,
		allowDeselect : true,
		columns : this.getColumns(),
		width : this.width,
		viewConfig : {
			stripeRows : true,
			listeners : {
				'celldblclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					_this.edit(EXI.proposalManager.getMacromoleculeById(record.data.macromoleculeId));
				},
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonEditMacromolecule') {
						_this.edit(EXI.proposalManager.getMacromoleculeById(record.data.macromoleculeId));
					}
					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonRemoveMacromolecule') {
						BUI.showBetaWarning();
					}
				}

			}
		}
	});

	/** Adding the tbar **/
	if (this.tbar) {
		this.grid.addDocked({
			xtype : 'toolbar',
			height : 50,
			items : this.getTbar()
		});
	}
	return this.grid;
};

MacromoleculeGrid.prototype.input = function() {
	return {
		proposal : DATADOC.getProposal_10()
	};
};

MacromoleculeGrid.prototype.test = function(targetId) {
	var macromoleculeGrid = new MacromoleculeGrid({
		width : 800,
		height : 350,
		collapsed : false,
		tbar : true
	});

	BIOSAXS.proposal = new Proposal(macromoleculeGrid.input().proposal);
	var panel = macromoleculeGrid.getPanel(BIOSAXS.proposal.macromolecules);
	panel.render(targetId);
};

/** MEASUREMENTS SELECTOR **/
function MeasurementCreatorStepWizardForm(macromolecules, buffers,args) {
	var _this = this;

	this.height = 700;
	this.noNext = false;

	this.macromolecules = macromolecules;
	this.buffers= buffers;
	
	GenericStepWizardForm.call(this, "Define Measurements", {
		margin : "0 0 0 0",
		width : 800,
		border : 0,
		html : "Define only the macromolecule's measurement you want to make. This wizard will add <span style='font-weight:bold;'> buffers' measurement needed for substraction automatically. </span>"
	}, {
		measurementsSelected : null
	},
	/** Fuction next **/
	function() {
//		if (_this.noNext) {
			var result = {
				name : Ext.getCmp(_this.id + "name").getValue(),
				comments :Ext.getCmp(_this.id + "comments").getValue(),
				data : JSON.stringify(_this.parseMeasurements(_this.data.measurementsSelected))
			};
			_this.onWizardFinished.notify(result);
//		}
	}, function() {
	});

	if (args != null) {
		if (args.noNext != null) {
			this.noNext = args.noNext;
		}
	}

	if (this.noNext) {
		this.onWizardFinished = new Event(this);
	}
	
	this.onWizardFinished = new Event(this);
}

MeasurementCreatorStepWizardForm.prototype.setData = function(data) {
	this.data.measurementsSelected = data;
	var buffers = {};
	var macromolecules = {};
	for ( var i = 0; i < this.data.measurementsSelected.length; i++) {
		var record = this.data.measurementsSelected[i];
		if (buffers[record.bufferId] == null) {
			buffers[record.bufferId] = {
				buffer : record.buffer_acronym,
				bufferId : record.bufferId,
				volume : 0,
				concentration : 0
			};
		}

		var macromoleculeId = record.macromoleculeId + "_" + record.bufferId + "_" + record.concentration;
		if (macromolecules[macromoleculeId] == null) {
			macromolecules[macromoleculeId] = {
				macromolecule : record.acronym,
				macromoleculeId : record.macromoleculeId,
				buffer : record.buffer_acronym,
				bufferId : record.bufferId,
				volume : 0,
				concentration : record.concentration
			};
		}

		buffers[record.bufferId].volume = Number(buffers[record.bufferId].volume) + (2 * record.volumeToLoad);
		macromolecules[macromoleculeId].volume = Number(macromolecules[macromoleculeId].volume) + (record.volumeToLoad);
	}

};

MeasurementCreatorStepWizardForm.prototype.getSingleMeasurementForm = function() {
	var macromoleculesComboManager = BIOSAXS_COMBOMANAGER.getComboMacromoleculeByMacromolecules(this.macromolecules, {
		width : 250,
		labelWidth : 100
	});
	var buffersCombo = BIOSAXS_COMBOMANAGER.getComboBuffers(this.buffers, {
		margin : "0 0 0 50",
		width : 250,
		labelWidth : 100
	});

	var addButton = Ext.create('Ext.Button', {
		width : 200,
		height : 25,
		margin : "0 0 20 300",
		text : 'Add',
		scope : this,
		handler : function() {
			var quantity = Ext.getCmp(this.id + "quantity").getValue();
			var measurements = [];
			for (var i = 0; i < quantity; i++) {
				measurements.push(
						{
//							acronym : BIOSAXS.proposal.getMacromoleculeById(macromoleculesComboManager.getValue()).acronym,
							acronym : EXI.proposalManager.getMacromoleculeById(macromoleculesComboManager.getValue()).acronym,
							
							macromoleculeId : macromoleculesComboManager.getValue(),
							bufferId : buffersCombo.getValue(),
							buffer_acronym :EXI.proposalManager.getBufferById(buffersCombo.getValue()).acronym,
							concentration : Ext.getCmp(this.id + "conc").getValue(),
							volumeToLoad : Ext.getCmp(this.id + "volume").getValue(),
							exposureTemperature : Ext.getCmp(this.id + "seu").getValue(),
							transmission : Ext.getCmp(this.id + "transmission").getValue(),
							waitTime : Ext.getCmp(this.id + "waitTime").getValue(),
							viscosity : Ext.getCmp(this.id + "viscosity").getValue(),
							flow : Ext.getCmp(this.id + "flow").getValue()
						});
			}
//			this.measurementGrid.load(measurements);
			this.measurementGrid.store.loadData(measurements, true);

			this.setData(JSON.parse(Ext.encode(Ext.pluck(this.measurementGrid.grid.getStore().data.items, 'data'))));
		}
	});

	return Ext.create('Ext.panel.Panel', {
		padding : "0 0 0 0",
		margin : "0 10 0 0",
		height : 240,
		width : 1150,
		cls : 'border-grid',
		items : [ {
			xtype : 'container',
			layout : 'hbox',
			margin : "10 10 0 10",
			items : [ 
			    macromoleculesComboManager, 
			    buffersCombo,  
			    {
				xtype : 'numberfield',
				id : this.id + "quantity",
				fieldLabel : 'Repeat',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 120",
				minValue : 0,
				maxValue : 300,
				value : 1
			} ]
		}, {
			xtype : 'container',
			layout : 'hbox',
			margin : "10 10 0 10",
			items : [ {
				xtype : 'numberfield',
				id : this.id + "conc",
				fieldLabel : 'Conc. (mg/ml)',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 0",
				minValue : 0,
				maxValue : 300,
				value : 1
			}, {
				xtype : 'numberfield',
				id : this.id + "seu",
				fieldLabel : 'Exposure. Temp.',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 80",
				value : 4,
				minValue : 4,
				maxValue : 60
			} ]
		}, {
			xtype : 'container',
			margin : "10 10 0 10",
			layout : 'hbox',
			items : [ {
				xtype : 'numberfield',
				id : this.id + "volume",
				fieldLabel : 'Vol. To Load (&#181l)',
				labelWidth : 100,
				width : 220,
				value : 40,
				margin : "5 0 0 0",
				minValue : 10,
				maxValue : 300
			},

			{
				xtype : 'numberfield',
				id : this.id + "transmission",
				fieldLabel : 'Transmission (%)',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 80",
				value : 100,
				minValue : 0,
				maxValue : 100
			}

			]
		}, {
			xtype : 'container',
			layout : 'hbox',
			margin : "10 10 0 10",
			items : [ {
				xtype : 'numberfield',
				id : this.id + "waitTime",
				fieldLabel : 'Wait Time',
				labelWidth : 100,
				width : 220,
				value : 0,
				minValue : 0,
				maxValue : 100
			}, {
				xtype : 'combo',
				id : this.id + "viscosity",
				store : [ "low", "medium", "high" ],
				fieldLabel : 'SC Viscosity',
				value : "low",
				labelWidth : 100,
				width : 220,
				margin : "0 0 0 80"
			}, {
				xtype : 'checkbox',
				id : this.id + "flow",
				checked : true,
				fieldLabel : 'Flow',
				labelWidth : 100,
				width : 250,
				margin : "0 0 0 80"
			} ]
		}, {
			xtype : 'container',
			layout : 'hbox',
			margin : "10 0 0 0",
			items : [ addButton ]
		} ]
	});
};


MeasurementCreatorStepWizardForm.prototype.getConcentrationMeasurementForm = function() {
	
	var macromoleculesComboManager = BIOSAXS_COMBOMANAGER.getComboMacromoleculeByMacromolecules(this.macromolecules, {
		width : 300,
		labelWidth : 100
	});
	var buffersCombo = BIOSAXS_COMBOMANAGER.getComboBuffers(this.buffers, {
//		margin : "0 0 0 80",
		width : 300,
		labelWidth : 100
	});

	var addButton = Ext.create('Ext.Button', {
		width : 200,
		height : 25,
		margin : "0 0 20 300",
		text : 'Add',
		scope : this,
		handler : function() {
			var macromoleculeId = macromoleculesComboManager.getValue();
			var bufferId = buffersCombo.getValue();
			var concentrationCount = Ext.getCmp(this.id + "_cs_conc").getValue();
			var volume = Ext.getCmp(this.id + "_cs_volume").getValue();

			var transmission = Ext.getCmp(this.id + "_cs_transmission").getValue();
			var seu = Ext.getCmp(this.id + "_cs_seu").getValue();
			var waitTime = Ext.getCmp(this.id + "_cs_waitTime").getValue();
			var viscosity = Ext.getCmp(this.id + "_cs_viscosity").getValue();
			var flow = Ext.getCmp(this.id + "_cs_flow").getValue();

			var dataToBeLoaded = [];
			for ( var i = 1; i <= concentrationCount; i++) {
				dataToBeLoaded.push({
					acronym : EXI.proposalManager.getMacromoleculeById(macromoleculeId).acronym,
					macromoleculeId : macromoleculeId,
					bufferId : bufferId,
					buffer_acronym : EXI.proposalManager.getBufferById(bufferId).acronym,
					concentration : i,
					volumeToLoad : volume,
					exposureTemperature : seu,
					transmission : transmission,
					waitTime : waitTime,
					viscosity : viscosity,
					flow : flow

				});
			}
			this.measurementGrid.store.loadData(dataToBeLoaded, true);
			this.setData(JSON.parse(Ext.encode(Ext.pluck(this.measurementGrid.store.data.items, 'data'))));
		}
	});

	return Ext.create('Ext.panel.Panel', {
//		padding : "0 0 0 0",
		margin : "0 10 0 0",
		height : 200,
		width : 1150,
		cls : 'border-grid',
		items : [
		 {
			xtype : 'container',
			layout : 'hbox',
			items : [ 
			          {
				xtype : 'numberfield',
				id : this.id + "_cs_conc",
				fieldLabel : 'How many unknow concentrations do you have?',
				labelWidth : 300,
				width : 500,
				margin : "5 0 0 10",
				minValue : 1,
				maxValue : 20,
				value : 1
			} ]
		}, {
			xtype : 'container',
			margin : "10 0 0 10",
			layout : 'hbox',
			items : [macromoleculesComboManager ,{
				xtype : 'numberfield',
				id : this.id + "_cs_seu",
				fieldLabel : 'Exposure. Temp.',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 20",
				value : 4,
				minValue : 4,
				maxValue : 60
			}, {
				xtype : 'numberfield',
				margin : "5 0 0 50",
				id : this.id + "_cs_volume",
				fieldLabel : 'Vol. To Load (&#181l)',
				labelWidth : 100,
				width : 220,
				value : 40,
				minValue : 10,
				maxValue : 300
			},

			{
				xtype : 'numberfield',
				id : this.id + "_cs_transmission",
				fieldLabel : 'Transmission (%)',
				labelWidth : 100,
				width : 220,
				margin : "5 0 0 50",
				value : 100,
				minValue : 0,
				maxValue : 100
			}

			]
		}, {
			xtype : 'container',
			layout : 'hbox',
			margin : "5 0 0 10",
			items : [ buffersCombo, {
				xtype : 'numberfield',
				id : this.id + "_cs_waitTime",
				fieldLabel : 'Wait Time',
				labelWidth : 100,
				width : 220,
				value : 0,
				minValue : 0,
				maxValue : 100,
				margin : "5 0 0 20"
			}, {
				xtype : 'combo',
				id : this.id + "_cs_viscosity",
				store : [ "low", "medium", "high" ],
				fieldLabel : 'SC Viscosity',
				value : "low",
				margin : "5 0 0 50",
				labelWidth : 100,
				width : 220
			}, {
				xtype : 'checkbox',
				id : this.id + "_cs_flow",
				fieldLabel : 'Flow',
				checked : true,
				labelWidth : 100,
				width : 250,
				margin : "0 0 0 80"
			} ]
		}, {
			xtype : 'container',
			layout : 'hbox',
			margin : "20 0 0 0",
			items : [ addButton ]
		} ]
	}
	);
};

MeasurementCreatorStepWizardForm.prototype.getHeaderForm = function() {
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'hbox',
		height : 100,
		items : [ {
			xtype : 'textfield',
			name : 'Name',
			id : this.id + "name",
			width : 400,
			labelWidth : 50,
			fieldLabel : 'Name',
			margin : '20 20 20 20',
			value : ''
		}, {
			id : this.id + "comments",
			xtype : 'textareafield',
			name : 'comments',
			fieldLabel : 'Comments',
			height : 75,
			labelWidth : 100,
			margin : '20 20 20 50',
			width : 600
		} ]
	});
	return this.panel;
};


MeasurementCreatorStepWizardForm.prototype.getForm = function() {
	var _this = this;

	this.formPanel = Ext.create('Ext.tab.Panel', {
		padding : "0 0 0 0",
		plain : true,
		margin : "20 5 20 10",
		height : 290,
		items : [ 
      {
			tabConfig : {
				title : 'Concentration Series'
			},
			items : this.getConcentrationMeasurementForm()
		},{
			tabConfig : {
				title : 'Individual Measurement'
			},
			items : [ this.getSingleMeasurementForm() ]
		} ]


	});
	this.measurementGrid = new MeasurementGrid({
		height : 250,
		maxHeight : 250,
		minHeight : 250,
		width : 1150,
		tbar : false,
		maxWidth : 870,
		resizable : false,
		margin : "0 10 10 10",
		isStatusColumnHidden : true,
		isTimeColumnHidden : true,
		removeBtnEnabled : true,
		isPriorityColumnHidden : true
	});

	this.measurementGrid.onRemoved.attach(function(sender, data) {
		_this.setData(JSON.parse(Ext.encode(Ext.pluck(_this.measurementGrid.grid.getStore().data.items, 'data'))));
	});

	this.panel = Ext.create('Ext.panel.Panel', {
		plain : true,
		frame : false,
		border : 0,
		items : [ this.getHeaderForm(), this.formPanel, this.addButton, this.measurementGrid.getPanel([]) ]
	});

	if (this.data.measurementsSelected != null) {
		/** Recover Data **/
		this.measurementGrid.grid.getStore().loadData(this.data.measurementsSelected, false);
		this.setData(JSON.parse(Ext.encode(Ext.pluck(this.measurementGrid.grid.getStore().data.items, 'data'))));
	}
	return this.panel;
};

MeasurementCreatorStepWizardForm.prototype.getBuffers = function(measurements) {
	var buffers = {};
	var macromolecules = {};
	var record = null;
	for ( var i = 0; i < measurements.length; i++) {
		record = measurements[i];
		if (buffers[record.bufferId] == null) {
			buffers[record.bufferId] = {
				buffer : record.buffer_acronym,
				bufferId : record.bufferId,
				volumeToLoad : record.volumeToLoad,
				volume : 0,
				concentration : 0,
				transmission : record.transmission,
				flow : record.flow,
				viscosity : record.viscosity,
			};
		}

		buffers[record.bufferId].volume = Number(buffers[record.bufferId].volume) + (2 * record.volumeToLoad);
	}

	/** Removing all **/
	var bufferSpecimens = [];
	for ( var buffer in buffers) {
		if (buffers.hasOwnProperty(buffer)) {
			record = buffers[buffer];
			bufferSpecimens.push({
				bufferId : record.bufferId,
				buffer : EXI.proposalManager.getBufferById(record.bufferId).acronym,
				concentration : record.concentration,
				volume : record.volume,
				volumeToLoad : record.volumeToLoad,
				transmission : record.transmission,
				flow : record.flow,
				viscosity : record.viscosity
	
			});
		}
	}
	return bufferSpecimens;
};

MeasurementCreatorStepWizardForm.prototype.parseMeasurements = function(measurements) {
	var _this = this;
	var parsed = [];
	var measurement = null;
	var i = null;
	/** For buffers **/
	var specimenBuffers = this.getBuffers(measurements);
	for (  i = 0; i < specimenBuffers.length; i++) {
		measurement = specimenBuffers[i];
		parsed.push({
			SEUtemperature 	: "",
			buffer 			: measurement.buffer,
			buffername 		: measurement.buffer,
			code 			: measurement.buffer,
			comments 		: "",
			concentration 	: 0,
			enable 			: true,
			flow 			: measurement.flow,
			recuperate 		: false,
			title 			: "",
			transmission 	: measurement.transmission,
			macromolecule 	: measurement.buffer,
			type 			: "Buffer",
			typen 			: 1,
			viscosity 		: measurement.viscosity,
			volume 			: measurement.volume,
			volumeToLoad 	: measurement.volumeToLoad,
			waittime 		: 0,
			plate 			: null,
			row 			: null,
			well 			: null
		});
	}

	for ( i = 0; i < measurements.length; i++) {
		measurement = measurements[i];
		var type = "Buffer";
		var macromolecule = "";
		if (measurement.macromoleculeId != null) {
			type = "Sample";
			macromolecule = EXI.proposalManager.getMacromoleculeById(measurement.macromoleculeId).acronym;
		}

		parsed.push({
			SEUtemperature : measurement.exposureTemperature,
			buffer : measurement.buffer_acronym,
			buffername : measurement.buffer_acronym,
			code : macromolecule,
			comments : "",
			concentration : measurement.concentration,
			enable : true,
			flow : measurement.flow,
			recuperate : false,
			title : "",
			transmission : measurement.transmission,
			macromolecule : macromolecule,
			type : type,
			typen : 1,
			viscosity : measurement.viscosity,
			volume : measurement.volumeToLoad,
			volumeToLoad : measurement.volumeToLoad,
			waittime : measurement.waitTime,
			plate : null,
			row : null,
			well : null
		});
	}
	
	var automatic = new SampleAutomaticPositionFactory(parsed);
	return automatic.setPosition();
};

MeasurementCreatorStepWizardForm.prototype.getNextForm = function() {
	return new FinalStepWizardForm(JSON.stringify(this.parseMeasurements(this.data.measurementsSelected)));
//	return null;
//	var measurements = JSON.stringify(this.parseMeasurements(this.data.measurementsSelected));
//	debugger
};



/**
 * Given a set of measurements this class will set the a priori right position for each specimen
 * @sampleParsed Array of:{"SEUtemperature":"","buffer":"CaCl2","buffername":"CaCl2","code":"CaCl2","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"CaCl2","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":null,"row":null,"well":null}
 */
function SampleAutomaticPositionFactory(sampleParsed){
	this.samples = sampleParsed;
//	this.samples  = JSON.parse('[{"SEUtemperature":"","buffer":"CaCl2","buffername":"CaCl2","code":"CaCl2","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"CaCl2","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":9},{"SEUtemperature":"","buffer":"B2dtt","buffername":"B2dtt","code":"B2dtt","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"B2dtt","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":10},{"SEUtemperature":"","buffer":"BSA","buffername":"BSA","code":"BSA","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"BSA","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":11},{"SEUtemperature":"","buffer":"AE","buffername":"AE","code":"AE","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"AE","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":9},{"SEUtemperature":"","buffer":"ATP","buffername":"ATP","code":"ATP","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"ATP","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":10},{"SEUtemperature":"","buffer":"B1","buffername":"B1","code":"B1","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"B1","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":11},{"SEUtemperature":"","buffer":"B2","buffername":"B2","code":"B2","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"B2","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":9},{"SEUtemperature":"","buffer":"CB-RE","buffername":"CB-RE","code":"CB-RE","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"CB-RE","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":10},{"SEUtemperature":"","buffer":"HEPES7","buffername":"HEPES7","code":"HEPES7","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"HEPES7","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":11},{"SEUtemperature":"","buffer":"FUR","buffername":"FUR","code":"FUR","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"FUR","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":9},{"SEUtemperature":"","buffer":"BTris","buffername":"BTris","code":"BTris","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"BTris","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":10},{"SEUtemperature":"","buffer":"AA","buffername":"AA","code":"AA","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"AA","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":11},{"SEUtemperature":"","buffer":"CVCBuf","buffername":"CVCBuf","code":"CVCBuf","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"CVCBuf","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":9},{"SEUtemperature":"","buffer":"BufferMax","buffername":"BufferMax","code":"BufferMax","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"BufferMax","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":10},{"SEUtemperature":"","buffer":"BufferCicine","buffername":"BufferCicine","code":"BufferCicine","comments":"","concentration":0,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"BufferCicine","type":"Buffer","typen":1,"viscosity":"low","volume":800,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":11},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":1},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":2},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":3},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":4},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":5},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":6},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":7},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":1,"well":8},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":1},{"SEUtemperature":4,"buffer":"AA","buffername":"AA","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":2},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":3},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":4},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":5},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":6},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":7},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":2,"well":8},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":1},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":2},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":3},{"SEUtemperature":4,"buffer":"AE","buffername":"AE","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":4},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":5},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":6},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":7},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":3,"well":8},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":1},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":2},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":3},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":4},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":5},{"SEUtemperature":4,"buffer":"ATP","buffername":"ATP","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":6},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":7},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":4,"well":8},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":1},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":2},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":3},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":4},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":5},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":6},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":7},{"SEUtemperature":4,"buffer":"B1","buffername":"B1","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":5,"well":8},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":1},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":2},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":3},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":4},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":5},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":6},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":7},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":6,"well":8},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":1},{"SEUtemperature":4,"buffer":"B2","buffername":"B2","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":2},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":3},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":4},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":5},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":6},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":7},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":7,"well":8},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":1},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":2},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":3},{"SEUtemperature":4,"buffer":"B2dtt","buffername":"B2dtt","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":4},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":5},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":6},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":7},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":8,"well":8},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":1},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":2},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":3},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":4},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":5},{"SEUtemperature":4,"buffer":"BSA","buffername":"BSA","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":6},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":7},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":9,"well":8},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":1},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":2},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":3},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":4},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":5},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":6},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":7},{"SEUtemperature":4,"buffer":"BTris","buffername":"BTris","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":10,"well":8},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":1},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":2},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":3},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":4},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":5},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":6},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":7},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":11,"well":8},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":1},{"SEUtemperature":4,"buffer":"BufferCicine","buffername":"BufferCicine","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":2},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":3},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":4},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":5},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":6},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":7},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":12,"well":8},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":1},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":2},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":3},{"SEUtemperature":4,"buffer":"BufferMax","buffername":"BufferMax","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":4},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":5},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":6},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":7},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":13,"well":8},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":1},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":2},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":3},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":4},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":5},{"SEUtemperature":4,"buffer":"CB-RE","buffername":"CB-RE","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":6},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":7},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":14,"well":8},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":1},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":2},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":3},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":4},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":5},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":6},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":7},{"SEUtemperature":4,"buffer":"CVCBuf","buffername":"CVCBuf","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":15,"well":8},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":1},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":2},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":3},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":4},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":5},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":6},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":7},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":16,"well":8},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":1},{"SEUtemperature":4,"buffer":"CaCl2","buffername":"CaCl2","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":2},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":3},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":4},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":5},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":6},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":7},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":17,"well":8},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":1},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":2},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":3},{"SEUtemperature":4,"buffer":"FUR","buffername":"FUR","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":4},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":1,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":5},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":2,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":6},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":3,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":7},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":4,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":18,"well":8},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":5,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":1},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":6,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":2},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":7,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":3},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":8,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":4},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":9,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":5},{"SEUtemperature":4,"buffer":"HEPES7","buffername":"HEPES7","code":"A","comments":"","concentration":10,"enable":true,"flow":true,"recuperate":false,"title":"","transmission":100,"macromolecule":"A","type":"Sample","typen":1,"viscosity":"low","volume":40,"volumeToLoad":40,"waittime":0,"plate":2,"row":19,"well":6}]');
};

SampleAutomaticPositionFactory.prototype.getAvailablePlates = function() {
	var plates = EXI.proposalManager.getPlateByFlavour();
	var bufferPositions = [];
	var samplePositions = [];
	
	/** is there a 4x(8x3) Block **/
	for (var i = 0; i < plates.length; i++) {
		if (plates[i].plateTypeId == 2){
			/** Booking place for buffers **/
			for (var index = 0; index < 12; index++) {
				bufferPositions.push({
										plate : 2,
										row : Math.floor(index / 3) + 1,
										well : Number(Number(index % 3) + 9)
									});
			}
			/** Booking place for macromolecules **/
			var savedPositions = 0;
			var positionHash = {};
			for (var index = 0; index < 32; index++) {
					var position = {
						plate : 2,
						row : Math.floor(index / 8) + 1,
						well : Number(index % 8) + 1 - savedPositions
					};
					samplePositions.push(position);
			}
		}
	}

	/** Rest of the plates **/
	for (var i = 0; i < plates.length; i++) {
		if (plates[i].plateTypeId != 2){
			/** Booking place for buffers **/
			for (var indexRow = 0; indexRow < plates[i].rowCount; indexRow++) {
				for (var indexColumn = 0; indexColumn < plates[i].columnCount; indexColumn++) {
					bufferPositions.push({
											plate 	: i + 1, 
											row 	: indexRow + 1,
											well 	: indexColumn + 1
										});
				}
			}
			
			/** Booking place for samples **/
			for (var indexRow = 0; indexRow < plates[i].rowCount; indexRow++) {
				for (var indexColumn = 0; indexColumn < plates[i].columnCount; indexColumn++) {
					samplePositions.push({
											plate 	: i + 1,
											row 	: indexRow + 1,
											well 	: indexColumn + 1
										});
				}
			}
		}
	}
	return {
		buffer : bufferPositions.reverse(),
		sample : samplePositions.reverse()
	};
};

SampleAutomaticPositionFactory.prototype._getKey = function(plate, row, well) {
	return plate + ":" +  row + "-" + well;
};

SampleAutomaticPositionFactory.prototype.setPosition = function() {
	var positions = (this.getAvailablePlates());
	
	var occupied = {};
	/** First, we set positions for buffers **/
	for (var i = 0; i < this.samples.length; i++) {
		if (this.samples[i].type == 'Buffer'){
			var key = this._getKey(this.samples[i].plate, this.samples[i].row, this.samples[i].well);
			this.samples[i].plate = positions.buffer[ positions.buffer.length - 1].plate,
			this.samples[i].row = positions.buffer[ positions.buffer.length - 1].row;
			this.samples[i].well =  positions.buffer[ positions.buffer.length - 1].well;
			occupied[key] = true;
			positions.buffer.pop();
		}
	}
	
	var positionHash = {};
	
	for (var i = 0; i < this.samples.length; i++) {
		if (this.samples[i].type == 'Sample'){
			var key = this._getKey(positions.sample[ positions.sample.length - 1].plate,  positions.sample[ positions.sample.length - 1].row, positions.sample[ positions.sample.length - 1].well);
			
			/** If this position is already occupied by a buffer we pop the stack **/
			while (occupied[key] != null){
				positions.sample.pop();
				key = this._getKey(positions.sample[ positions.sample.length - 1].plate,  positions.sample[ positions.sample.length - 1].row, positions.sample[ positions.sample.length - 1].well);
			}
			
			/**
			 * Position is important as it is the way to distiguish between same sample 
			 * For temperatures series two measurements pointing to the same macromolecule and buffer and concentration
			 * means that it is the same specimen
			 * **/
			var positionId = this.samples[i].macromolecule + "_" + this.samples[i].buffer + "_" + this.samples[i].concentration;
			if (positionHash[positionId] == null) {
				positionHash[positionId] = {
						plate : positions.sample[ positions.sample.length - 1].plate,
						row : positions.sample[ positions.sample.length - 1].row,
						well : positions.sample[ positions.sample.length - 1].well,
				};
			} else {
				/** There is already a specimen so we point out to its position **/
				this.samples[i].plate = positionHash[positionId].plate,
				this.samples[i].row = positionHash[positionId].row;
				this.samples[i].well =  positionHash[positionId].well;
				continue;
			}
			
			this.samples[i].plate = positions.sample[ positions.sample.length - 1].plate,
			this.samples[i].row = positions.sample[ positions.sample.length - 1].row;
			this.samples[i].well =  positions.sample[ positions.sample.length - 1].well;
			
			occupied[key] = true;
			positions.sample.pop();
		}
	}
	return this.samples;
};

















//
//
//function FinalStepWizardForm(measurements) {
//	this.result = {};
//
//	this.id = BUI.id();
//	this.title = "Confirmation";
//	this.description = "This is the last step of this wizard. Write a name and a description (optional) for your experiment. Remember you are able to add new measurements later on";
//	this.height = 500;
//
//	this.data = {
//		measurements : measurements
//	};
//	var _this = this;
//	this.onNext = function(data) {
//
//		this.result = {
//			name : Ext.getCmp(_this.id + "name").getValue(),
//			comments : Ext.getCmp(_this.id + "description").getValue(),
//			data : _this.data.measurements
//		};
//
//		_this.onWizardFinished.notify(this.result);
//	};
//	this.onBack = function() {
//	};
//	this.onWizardFinished = new Event(this);
//}
//
//FinalStepWizardForm.prototype.getForm = function() {
//	this.panel = Ext.create('Ext.panel.Panel', {
//		plain : true,
//		frame : false,
//		border : 1,
//		margin : "100 100 100 100",
//
//		fieldDefaults : {
//			labelAlign : 'left',
//			labelWidth : 90,
//			anchor : '100%'
//		},
//		items : [ {
//			xtype : 'textfield',
//			name : 'Name',
//			id : this.id + "name",
//			width : 600,
//			fieldLabel : 'Name',
//			margin : '20 20 20 20',
//			value : ''
//		}, {
//			xtype : 'textareafield',
//			name : 'textarea1',
//			id : this.id + "description",
//			margin : '20 20 20 20',
//			width : 600,
//			fieldLabel : 'Description',
//			value : ''
//		} ]
//	});
//	return this.panel;
//};
//
//FinalStepWizardForm.prototype.getNextForm = function() {
//	return null;
//};
//
//FinalStepWizardForm.prototype.input = function() {
//	return [];
//};
//
//FinalStepWizardForm.prototype.test = function(targetId) {
//	var experimentTypeWizardForm = new FinalStepWizardForm();
//	var form = experimentTypeWizardForm.getForm();
//	form.render(targetId);
//};

/**
 * Macromolecule Grid showing macromolecules and adding anb updating buttons
 * 
 * @height
 * @maxHeight
 * @width
 * @cssFontStyle
 * @searchBar makes this grid as Ext.ux.LiveSearchGridPanel
 * @tbar top bar containing "Add" and "Update From SMIS" button 
 * @collapsed
 * @collapsible
 * @btnEditVisible
 * @btnRemoveVisible
 * @multiselect makes it multiselect using Ext.selection.CheckboxModel
 * 
 * #onSelected
 * #onMacromoleculesChanged
 */
function MeasurementGrid(args) {
	this.id = BUI.id();
}


MeasurementGrid.prototype.load = function(dataCollections) {
	dataCollections = _.orderBy(dataCollections, ['MeasurementToDataCollection_dataCollectionId', 'MeasurementToDataCollection_dataCollectionOrder'], ['desc', 'desc']);
	_.map(dataCollections, function(o){ 
											o.samplePlateLetter = BUI.getSamplePlateLetters()[o.SamplePlatePosition_rowNumber - 1];
										});
	var html = "";
	dust.render("measurement.grid.template", dataCollections, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$('#' + this.id).html(html);
};

MeasurementGrid.prototype.getPanel = function(){
    var _this = this;

	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : false
	}
};

// MeasurementGrid.prototype._prepareData = function(measurements, experiments) {
// 	var data = [];
	
// 	for (var i = 0; i < measurements.length; i++) {
// 		var measurement = measurements[i];
// 		var specimen = experiments.getSampleById(measurement.specimenId);
// 		var buffer = EXI.proposalManager.getBufferById(specimen.bufferId);
// 		measurement.buffer_acronym = buffer.acronym;
// 		measurement.bufferId = buffer.bufferId;
// 		measurement.volume = specimen.volume;
// 		if (specimen.macromolecule3VO != null) {
// 			measurement.acronym = specimen.macromolecule3VO.acronym;
// 			measurement.macromoleculeId = specimen.macromolecule3VO.macromoleculeId;
// 		}
// 		measurement.concentration = specimen.concentration;
// 		if (measurement.run3VO != null) {
// 			measurement.energy = measurement.run3VO.energy;
// 			measurement.expExposureTemperature = measurement.run3VO.exposureTemperature;
// 			measurement.storageTemperature = measurement.run3VO.storageTemperature;
// 			measurement.timePerFrame = measurement.run3VO.timePerFrame;
// 			measurement.radiationAbsolute = measurement.run3VO.radiationAbsolute;
// 			measurement.radiationRelative = measurement.run3VO.radiationRelative;
// 			measurement.status = "DONE";

// 			try {
				
// 				if (measurement.run3VO.timeStart != null) {
// 					if (measurement.run3VO.timeStart != "") {
// 						measurement.miliseconds = moment(measurement.run3VO.timeStart).format("X");
// 					}
// 				}
// 			} catch (E) {
// 				console.log(E);
// 			}
// 		}

// 		if (experiments.getDataCollectionByMeasurementId(measurement.measurementId).length > 0) {
// 			var measurementtodatacollection3VOs = experiments.getDataCollectionByMeasurementId(measurement.measurementId)[0].measurementtodatacollection3VOs;
// 			for (var k = 0; k < measurementtodatacollection3VOs.length; k++) {
// 				if (measurementtodatacollection3VOs[k].dataCollectionOrder == 1) {
// 					var specimenBuffer = experiments.getSampleById(experiments.getMeasurementById(measurementtodatacollection3VOs[k].measurementId).specimenId);
// 					if (specimenBuffer.sampleplateposition3VO != null) {
// 						measurement.bufferSampleplateposition3VO = specimenBuffer.sampleplateposition3VO;
// 						measurement.bufferSampleplate = (experiments.getSamplePlateById(specimenBuffer.sampleplateposition3VO.samplePlateId));
// 					}
// 				}
// 			}
// 		}

// 		if (this.collapsed) {
// 			/** If collapsed only the samples * */
// 			if (specimen.macromolecule3VO != null) {
// 				data.push(measurement);
// 			}
// 		} else {
// 			data.push(measurement);
// 		}

// 	}
// 	return data;
// };
/**
 * Example form
 * 
 * @witdh
 * @height
 */
function MolarityForm(args) {
	this.id = BUI.id();
	this.width = 700;
	this.height = 500;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}
	
	this.onSave = new Event(this);
	this.onClose = new Event(this);
}


MolarityForm.prototype._getNumericWithHelp = function(type, fieldLabel, fieldName, help) {
	return Ext.create('Ext.container.Container', {
		margin : "10 0 0 10",
		items : [ {
			xtype : type,
			fieldLabel : fieldLabel,
			name : fieldName,
			id : this.id + fieldName,
			decimalPrecision : 6
		}, {
			xtype : 'label',
			forId : 'myFieldId',
			text : help,
			margin : "5 0 0 105",
			cls : "inline-help"
		} ]
	});
};


MolarityForm.prototype._getItems = function() {
	this.macromoleculeCombo = BIOSAXS_COMBOMANAGER.getComboMacromoleculeByMacromolecules(this.getMacromuleculesCandidates(this.macromolecule), {
		width : 250,
		labelWidth : 100,
		margin : 10
	});
	
	return [ {
		xtype : 'container',
		flex : 1,
		margin : '10 0 0 10',
		border : 0,
		layout : 'anchor',
		defaultType : 'requiredtext',
		items : [ this.macromoleculeCombo,
		this._getNumericWithHelp("textfield", "Ratio", "ratio", "Number in assymmetric units")
		]
	} ];
};

MolarityForm.prototype._persist = function() {
	var _this = this;
	var macromoleculeId = this.macromoleculeCombo.getValue();
	var ratio = Ext.getCmp(this.id + "ratio").getValue();
	var comments = "Not used yet";
	var dataAdapter = new BiosaxsDataAdapter();
	this.panel.setLoading("Saving");
	dataAdapter.onSuccess.attach(function(sender, args) {
		_this.onSave.notify();
	});
	dataAdapter.saveStoichiometry(this.macromolecule.macromoleculeId, macromoleculeId, ratio, comments);
};

MolarityForm.prototype._getButtons = function() {
	var _this = this;
	
	function onClose() {
		_this.onClose.notify();
	}
	
	return [ {
		text : 'Save',
		handler : function() {
			_this._persist();
		}
	}, {
		text : 'Cancel',
		handler : function() {
			onClose();
		}
	} ];
};

MolarityForm.prototype.getPanel = function() {
	this.panel = Ext.create('Ext.form.Panel', {
//		width : null,
		height : this.height,
		margin : 2,
		border : 1,
		defaultType : 'requiredtext',
		items : this._getItems(),
		buttons : this._getButtons()
	});
	return this.panel;
};

/** macromolecules contains all macromolecules except this one **/
MolarityForm.prototype.getMacromuleculesCandidates = function(macromolecule) {
	var macromolecules = [];
	if ( BIOSAXS.proposal.macromolecules){
		for (var i = 0; i < BIOSAXS.proposal.macromolecules.length; i++) {
			var m = BIOSAXS.proposal.macromolecules[i];
			if (this.macromolecule != null){
				if (m.macromoleculeId != this.macromolecule.macromoleculeId) {
					macromolecules.push(m);
				}
			}
		}
	}
	return macromolecules;
};


/** It populates the form **/
MolarityForm.prototype.refresh = function(macromolecule) {
	this.macromolecule = macromolecule;
	
};


MolarityForm.prototype.input = function() {
	return {};
};


/** It populates the form **/
MolarityForm.prototype.test = function(targetId) {
	var macromoleculeForm = new MolarityForm();
	var panel = macromoleculeForm.getPanel();
	panel.render(targetId);
};

/**
 * A shipment may contains one or more cases where stock solutions and sample
 * plates are stored
 * 
 * @height
 * @btnEditVisible
 * @btnRemoveVisible
 * 
 * #onEditButtonClicked
 */
function MolarityGrid(args) {
	this.height = 100;
	this.width = 100;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

	var _this = this;
	
	this.molarityForm = new MolarityForm({height : 180, width : 455});

	this.molarityForm.onSave.attach(function(sender){
		_this.molarityWindow.destroy();
		_this.updateProposal();
		
	});
	
	this.molarityForm.onClose.attach(function(sender){
		_this.molarityWindow.destroy();
		
	});
	
	/** Events * */
	this.onEditButtonClicked = new Event(this);
}

MolarityGrid.prototype._getColumns = function() {
	return [ {
		text : 'Subunit',
		columns : [ {
			text : "Acronym",
			width : 100,
			hidden : false,
			dataIndex : 'acronym',
			sortable : true
		}, {
			text : "Name",
			width : 125,
			hidden : false,
			dataIndex : 'name',
			sortable : true
		}, {
			text : "MM Est.",
			width : 100,
			dataIndex : 'molecularMass',
			sortable : true,
			renderer : function(grid, cls, record){
				return BUI.formatValuesUnits(record.data.molecularMass , "Da", 10, 2); 
				
			}
		} ]
	}, {
//		text : "Number <br/><span style='font-size:10px'>in assymmetric units</span>",
		text : "Ratio",
		width : 100,
		dataIndex : 'ratio',
		tooltip : 'Number of times the subunit is present in the macromolecule',
		sortable : true
	}, {
		id : this.id + 'MOLARITY_REMOVE',
		flex : 0.1,
		sortable : false,
		renderer : function(value, metaData, record, rowIndex, colIndex, store) {
			return BUI.getRedButton('REMOVE');
		}
	} ];
};

MolarityGrid.prototype._openMolarityWindow = function() {
	this.molarityWindow = Ext.create('Ext.window.Window', {
		title : 'Molarity',
		height : 220,
		width : 500,
		modal : true,
		items : [this.molarityForm.getPanel() ]
	}).show();
};

MolarityGrid.prototype._getButtons = function() {
	var _this = this;
	return [ {
		text : 'Add subunit',
		icon : '../images/add.png',
		handler : function() {
			_this._openMolarityWindow();
		}
    }];
};


MolarityGrid.prototype.updateProposal = function() {
	var _this = this;
	this.panel.setLoading();
	BIOSAXS.proposal.onInitialized.attach(function() {
		if (BIOSAXS.proposal != null) {
			var macromolecules = BIOSAXS.proposal.macromolecules;
			for (var i = 0; i < macromolecules.length; i++) {
				
				if (macromolecules[i].macromoleculeId == _this.macromolecule.macromoleculeId) {
					_this.refresh(macromolecules[i]);
					_this.panel.setLoading(false);
				}
			}
		}
	});
	BIOSAXS.proposal.init();
};


MolarityGrid.prototype.getPanel = function() {
	var _this = this;

	this.molarityStore = Ext.create('Ext.data.Store', {
		fields : [ 'acronym', 'ratio', 'comments', 'stoichiometryId', 'name', 'molecularMass' ],
		sorters : {
			property : 'ratio',
			direction : 'DESC'
		}
	});

	this.panel = Ext.create('Ext.grid.Panel', {
		store : this.molarityStore,
		height : this.height,
		padding : 5,
		columns : this._getColumns(),
		listeners : {
			cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

				/** Remove entry * */
				if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'MOLARITY_REMOVE') {
					var dataAdapter = new BiosaxsDataAdapter();
					dataAdapter.onSuccess.attach(function(sender) {
						_this.updateProposal();
						
					});
					dataAdapter.removeStoichiometry(record.data.stoichiometryId);
					_this.panel.setLoading("Removing Structure");
				}
			}
		},
		tbar : this._getButtons()
	});
	return this.panel;
};

MolarityGrid.prototype._prepareData = function(macromolecule) {
	/** Return an array of [{ratio,acronym, stoichiometryId, name}] **/
		var data = [];
		if (macromolecule.stoichiometry != null) {
			for (var i = 0; i < macromolecule.stoichiometry.length; i++) {
				var hostMacromolecule = BIOSAXS.proposal.getMacromoleculeById(macromolecule.stoichiometry[i].macromoleculeId);
				data.push({
					ratio : macromolecule.stoichiometry[i].ratio,
					acronym : hostMacromolecule.acronym,
					comments : hostMacromolecule.comments,
					molecularMass : hostMacromolecule.molecularMass,
					stoichiometryId : macromolecule.stoichiometry[i].stoichiometryId,
					name : hostMacromolecule.name
				});
			}
		}
		return data;
};

MolarityGrid.prototype.refresh = function(macromolecule) {
	if (macromolecule != null){
		this.molarityStore.loadData(this._prepareData(macromolecule));
		this.molarityForm.refresh(macromolecule);
		this.macromolecule = macromolecule;
	}
};

MolarityGrid.prototype.input = function() {
	return {
		proposal : DATADOC.getProposal_10(),
		dewars : DATADOC.getDewars_10()

	};
};

MolarityGrid.prototype.test = function(targetId) {
	var MolarityGrid = new MolarityGrid({
		height : 150
	});
	BIOSAXS.proposal = new Proposal(MolarityGrid.input().proposal);
	var panel = MolarityGrid.getPanel(MolarityGrid.input().dewars);
	panel.render(targetId);

};


function DataSet(){
	this.json = null;
	
};


DataSet.prototype.loadFromJSON = function(json){
	if(json != null) {
		if(this.validate(json)) {
			this.json = json;
		}
	}
};


DataSet.prototype.toJSON = function(json){
	return this.json;
};


/** Abstract method to be override on childs classes **/
DataSet.prototype.validate = function(json){
	if (true){
		return true;
	}
	/*else{
		throw "Data validation failed";
	}*/
};



/*
 * Clase gestiona la insercciÃ³n, eliminaciÃ³n de los elementos en el DOM
 * 
 * Vital hacerla SIEMPRE compatible hacia atrÃ¡s
 * 
 * Last update: 28-10-2010
 * 
 */


var DOM = {};

DOM.createNewElement = function(type, nodeParent, attributes)
{
	
	var node = document.createElement(type);
	for (var i=0; i<attributes.length; i++)
	{
		node.setAttribute(attributes[i][0], attributes[i][1]);
	}
	nodeParent.appendChild(node);
	return node;
		
};

DOM.createTextNode = function(text, nodeParent)
{
	var aText = document.createTextNode(text);
	nodeParent.appendChild(aText);
	return aText;

		
};

DOM.removeChilds = function(targetID)
{
	
	var parent = document.getElementById(targetID);
	while (parent.childNodes.length>0)
	{
	      parent.removeChild(parent.childNodes[0]);

	}
};

DOM.select = function(targetID)
{
  return document.getElementById(targetID);
//  return $("#"+targetID);
};
function GraphCanvas(componentID, targetNode, args) {
	this.args = {};
	/** target */
	this.targetID = targetNode.id;

	/** id manage */
	this.id = componentID;
	this.args.idGraph = this.id + "main";
	this.args.idBackgroundNode = this.id + "background";

	this.args.idEdgesGraph = this.id + "edges";
	this.args.idNodesGraph = this.id + "vertices";
	this.args.idLabelGraph = this.id + "label";
	this.args.idBackground = this.id + "background";

	/** Objects Graph **/
	this.dataset = null;
	this.formatter = null;
	this.layout = null;

	/** Drawing **/
	this.circleDefaultRadius = 2;
	this.squareDefaultSide = this.circleDefaultRadius * 1.5;

	/** Directed Arrow **/
	this.arrowDefaultSize = this.circleDefaultRadius;

	/** Groups **/
	this.GraphGroup = null;
	this.GraphNodeGroup = null;
	this.GraphLabelGroup = null;
	this.GraphBackground = null;

	/** SETTINGS FLAGS **/
	this.args.draggingCanvasEnabled = false; //Flag to set if the canvas can be dragged
	this.args.multipleSelectionEnabled = false;
	this.args.interactive = false;
	this.args.labeled = false;
	this.args.linkEnabled = false;

	/** If numberEdge > maxNumberEdgesMoving then only it will move edges when mouse up **/
	this.args.maxNumberEdgesMoving = 3;
	this.args.maxNumberEdgesFiringEvents = 50;

	/** Linking edges **/
	this.args.linking = false;
	this.linkStartX = 0;
	this.linkStartY = 0;
	this.linkSVGNode = null;
	this.linkNodeSource = null;
	this.linkNodeTarget = null;

	/** Dragging Control **/
	this.draggingElement = null;
	this.dragging = false;
	this.nMouseOffsetX = 0;
	this.nMouseOffsetY = 0;
	this.dragStartX = 0;
	this.dragStartY = 0;
	this.desplazamientoX = 0;
	this.desplazamientoY = 0;

	/** Selection Control **/
	this.selecting = false;
	this.selectorX = null;
	this.selectorY = null;
	this.selectorSVGNode = null;

	/** Node status **/
	this.args.isVertexSelected = {};
	this.args.selectedVertices = [];

	/** Edges status **/
	this.args.isEdgeSelected = {};
	//this.args.selectedEdges = [];

	if (args != null) {
		if (args.multipleSelectionEnabled != null) {
			this.args.multipleSelectionEnabled = args.multipleSelectionEnabled;
			this.args.draggingCanvasEnabled = !(this.args.multipleSelectionEnabled);
		}
		if (args.draggingCanvasEnabled != null) {
			this.args.draggingCanvasEnabled = args.draggingCanvasEnabled;
			this.args.multipleSelectionEnabled = !(this.args.draggingCanvasEnabled);
		}
		if (args.interactive != null) {
			this.args.interactive = args.interactive;
		}
		if (args.labeled != null) {
			this.args.labeled = args.labeled;
		}

	}

	/** Hashmap with the svg node labels **/
	this.svgLabels = {};

	/** EVENTS **/
	this.onVertexOut = new Event(this);
	this.onVertexOver = new Event(this);
	this.onVertexSelect = new Event(this);
	this.onEdgeSelect = new Event(this);
	this.onCanvasClicked = new Event(this);
	this.onVertexUp = new Event(this);
}

GraphCanvas.prototype.showLabels = function(value) {
	this.args.labeled = value;
	this.removeLabels();
	if (value) {
		this.renderLabels();
	}
};

GraphCanvas.prototype.getSelectedVertices = function() {
	return this.args.selectedVertices;
};

GraphCanvas.prototype.getSelectedEdges = function() {
	var selected = [];
	for ( var selectedEdge in this.args.isEdgeSelected) {
		selected.push(selectedEdge);
	}
	return selected;
};

GraphCanvas.prototype.createSVGDom = function(targetID, id, width, height, backgroundColor) {
	var container = document.getElementById(targetID);
	this._svg = SVG.createSVGCanvas(container, [
		[ "style", "background-color:" + backgroundColor + ";" ], [ "id", id ], [ "dragx", 0 ], [ "dragy", 0 ],
		[ "height", this.getFormatter().getHeight() ], [ "width", this.getFormatter().getWidth() ] ]);
	return this._svg;
};

/** MULTIPLE SELECTION **/
GraphCanvas.prototype.isMultipleSelectionEnabled = function() {
	return this.args.multipleSelectionEnabled;
};

GraphCanvas.prototype.setMultipleSelection = function(value) {
	this.args.multipleSelectionEnabled = value;
	this.args.draggingCanvasEnabled = (!value);
};

GraphCanvas.prototype.setSelecting = function(value) {
	this.selecting = value;
};

/** linking **/
GraphCanvas.prototype.setLinking = function(value) {
	this.args.linkEnabled = value;
	this.selecting = !value;
	this.dragging = !value;
};

/** CANVAS MOVING **/
GraphCanvas.prototype.setDraggingCanvas = function(value) {
	this.args.draggingCanvasEnabled = value;
	this.args.multipleSelectionEnabled = !value;
};

GraphCanvas.prototype.isDraggingCanvasEnabled = function() {
	return this.args.draggingCanvasEnabled;
};
/** ZOOM **/
GraphCanvas.prototype.getScale = function() {
	return this.getFormatter().getZoomScale();
};

GraphCanvas.prototype.setScale = function(scale) {
	var graphNode = document.getElementById(this.args.idGraph);
	graphNode.setAttribute("transform", graphNode.getAttribute("transform").replace("scale(" + this.getScale() + ")", "scale(" + scale + ")"));
	this.getFormatter().setZoomScale(scale);
};

GraphCanvas.prototype.zoomIn = function() {
	this.setScale(this.getScale() + this.getFormatter().getZoomScaleStepFactor());
};

GraphCanvas.prototype.zoomOut = function() {
	this.setScale(this.getScale() - this.getFormatter().getZoomScaleStepFactor());

};

/** SVG COORDENATES **/
GraphCanvas.prototype.getSVGCoordenates = function(evt) {
	var p = this._svg.createSVGPoint();
	p.x = evt.clientX;
	p.y = evt.clientY;

	var m = this._svg.getScreenCTM(document.documentElement);
	p = p.matrixTransform(m.inverse());
	return p;
};

/** SVG EVENTS **/
GraphCanvas.prototype.mouseClick = function(event) {
	if (event.button == 0) {
		if (!this.args.interactive) {
			return;
		}

		if (this.isVertex(event.target)) {
			this.clickNode(this.getVertexIdFromSVGId(event.target.id));
		}
		/** Como el evento mouseClick viene despues del mouse up es aqui donde manejo el tema de deseccionar los elementos que estoy dragging **/
		if (this.dragging) {
			this.dragging = false;
		}
	}
};

GraphCanvas.prototype.mouseMove = function(evt) {
	if (this.selecting) {
		this.clearLabels();

		var width = (this.getSVGCoordenates(evt).x - this.selectorX);
		var height = (this.getSVGCoordenates(evt).y - this.selectorY);
		if ((width > 0) && (height > 0)) {
			this.displaySelection(this.selectorX, this.selectorY, width, height);
		}
		if ((width > 0) && (height < 0)) {
			this.displaySelection(this.selectorX, this.getSVGCoordenates(evt).y, width, Math.abs(height));
		}
		if ((width < 0) && (height < 0)) {
			this.displaySelection(this.getSVGCoordenates(evt).x, this.getSVGCoordenates(evt).y, Math.abs(width), Math.abs(height));
		}
		if ((width < 0) && (height > 0)) {
			this.displaySelection(this.selectorX + width, this.selectorY, Math.abs(width), Math.abs(height));
		}

		var x1 = (parseFloat(this.selectorSVGNode.getAttribute("x")) - DOM.select(this.id).getAttribute("dragx")) / this.getFormatter().getWidth();
		var y1 = (parseFloat(this.selectorSVGNode.getAttribute("y")) - DOM.select(this.id).getAttribute("dragy")) / this.getFormatter().getHeight();
		var x2 = (x1 + parseFloat(this.selectorSVGNode.getAttribute("width") / this.getFormatter().getWidth()));
		var y2 = (y1 + parseFloat(this.selectorSVGNode.getAttribute("height") / this.getFormatter().getHeight()));

		this.deselectNodes(this.getLayout());
		var verticesSelected = this.getLayout().getVerticesByArea(x1 / this.getFormatter().getZoomScale(), y1 / this.getFormatter().getZoomScale(),
				x2 / this.getFormatter().getZoomScale(), y2 / this.getFormatter().getZoomScale());
		for ( var i = 0; i < verticesSelected.length; i++) {
			this.selectNode(verticesSelected[i].getId());
			this.renderLabel(verticesSelected[i].getId());
		}

	}
	var p = null;
	if (this.args.linking) {
		p = this.getSVGCoordenates(evt);
		if (this.linkSVGNode != null) {
			this.linkSVGNode.setAttribute("x2", p.x - 2);
			this.linkSVGNode.setAttribute("y2", p.y - 2);
		}
	}

	if (this.dragging) {
		p = this.getSVGCoordenates(evt);
		p.x -= this.nMouseOffsetX;
		p.y -= this.nMouseOffsetY;
		this.desplazamientoX = (this.getSVGCoordenates(evt).x - this.dragStartX);//  + parseFloat(DOM.select(this.id).getAttribute("dragx"));
		this.desplazamientoY = (this.getSVGCoordenates(evt).y - this.dragStartY);//  + parseFloat(DOM.select(this.id).getAttribute("dragy"));

		if (this.draggingElement != null) {
			/** Click sobre el recct del banground que provoca que mueva todo el canvas **/
			if (this.isNodeCanvas(this.draggingElement)) {

				p = this.getSVGCoordenates(evt);
				p.x = this.desplazamientoX;
				p.y = this.desplazamientoY;

				this.draggingElement.setAttribute("dragx", p.x);
				this.draggingElement.setAttribute("dragy", p.y);
				this.draggingElement = document.getElementById(this.args.idGraph);
				this.draggingElement.setAttribute("transform", "translate(" + p.x + "," + p.y + "), scale(" + this.getScale() + ")");

				DOM.select(this.id).setAttribute("dragx", p.x);
				DOM.select(this.id).setAttribute("dragy", p.y);

				if (this.NodeSVGbackgroundImage != null) {
					this.NodeSVGbackgroundImage.setAttribute("dragx", p.x);
					this.NodeSVGbackgroundImage.setAttribute("dragy", p.y);
				}
			} else {
				if (this.isVertex(this.draggingElement)) {
					this.selectNode(this.getVertexIdFromSVGId(this.draggingElement.id));
					this.desplazamientoX = this.desplazamientoX / this.getFormatter().getZoomScale();
					this.desplazamientoY = this.desplazamientoY / this.getFormatter().getZoomScale();
					this.moveSelectedNodes(this.desplazamientoX, this.desplazamientoY);

					this.dragStartX = this.getSVGCoordenates(evt).x;
					this.dragStartY = this.getSVGCoordenates(evt).y;
				} else {
					if (this.isNodeBackground(this.draggingElement)) {

						this.draggingElement.setAttribute("dragx", p.x);
						this.draggingElement.setAttribute("dragy", p.y);
						this.draggingElement = document.getElementById(this.args.idGraph);
						this.draggingElement.setAttribute("transform", "translate(" + p.x + "," + p.y + "), scale(" + this.getScale() + ")");
					} else {
						this.draggingElement.setAttribute("transform", "translate(" + p.x + "," + p.y + ")");
					}
				}
			}
		}
	}
};

GraphCanvas.prototype.moveSelectedNodes = function(offsetX, offsetY) {
	for ( var i = 0; i < this.getSelectedVertices().length; i++) {

		var nodeId = this.getSelectedVertices()[i];
		var svgNodeId = this.getSVGNodeId(nodeId);

		var x = parseFloat(DOM.select(svgNodeId).getAttribute("dragx")) + parseFloat(offsetX);// -   parseFloat(DOM.select(this.id).getAttribute("dragx"));
		var y = parseFloat(DOM.select(svgNodeId).getAttribute("dragy")) + parseFloat(offsetY);// +   parseFloat(DOM.select(this.id).getAttribute("dragy"));

		this._movingNode(DOM.select(svgNodeId), x, y);
	}
};

GraphCanvas.prototype.mouseDown = function(evt) {
	if (event.button == 0) {

		/** if !no interactive mouse events do anything **/
		if (!this.args.interactive) {
			return;
		}

		var p = this.getSVGCoordenates(evt);

		/** When click on canvas or background deselect all **/
		if (this.isNodeCanvas(evt.target) || this.isNodeBackground(evt.target)) {
			this.deselectNodes();
			this.deselectEdges();
			this.onCanvasClicked.notify();
		}

		/** if I am linking vertices **/
		if (this.args.linkEnabled) {

			if (!this.args.linking) {
				this.args.linking = true;
				if (this.isVertex(evt.target)) {
					this.linkStartX = p.x;
					this.linkStartY = p.y;
					this.linkSVGNode = SVG.drawLine(p.x, p.y, p.x, p.y, this._svg, {
						"stroke" : "#FF0000"
					});
					this.linkNodeSource = this.getVertexIdFromSVGId(evt.target.id);
				}
			} else {
				this.linkNodeTarget = this.getVertexIdFromSVGId(evt.target.id);
				this.args.linking = false;
				this.args.linkEnabled = false;
				if (this.isVertex(evt.target)) {
					this.getDataset().addEdge(this.linkNodeSource + "_" + this.linkNodeTarget, this.linkNodeSource, this.linkNodeTarget, {});
				}
				this.linkSVGNode.parentNode.removeChild(this.linkSVGNode);
			}
			return;
		}

		/** Id is a vertex or the canvas **/
		if (this.isVertex(evt.target) || this.isNodeCanvas(evt.target) || this.isNodeBackground(evt.target)) {
			this._startDragging(evt);
		}
		/** if i is  edge **/
		if (this.isEdge(evt.target)) {
			this.selectEdge(this.getEdgeIdFromSVGId(evt.target.getAttribute("id")));
		}

		if (this.args.multipleSelectionEnabled) {
			if (!this.dragging) {
				this.setSelecting(true);
				this.selectorX = p.x;
				this.selectorY = p.y;
				this.displaySelection(p.x, p.y, 1, 1);
			}
		}

	}
	if (event.button == 1) {
		this.setLinking(false);
		this.setMultipleSelection(false);
		this.selecting = false;

		/** Id is a vertex or the canvas **/
		if (this.isVertex(evt.target) || this.isNodeCanvas(evt.target) || this.isNodeBackground(evt.target)) {
			this._startDragging(evt);
		}
	}
};

GraphCanvas.prototype.mouseUp = function(event) {
	if (!this.args.interactive) {
		return;
	}

	if (this.dragging) {
		this._stopDragging(event);
		if (this.isVertex(event.target)) {
			var vertexId = this.getVertexIdFromSVGId(event.target.id);
			if (this.getDataset().getVertexById(vertexId).getEdges().length >= this.args.maxNumberEdgesMoving) {
				this.moveEdge(vertexId);
			}
		}
	}

	if (this.selecting) {
		this.setSelecting(false);

		var x1 = (parseFloat(this.selectorSVGNode.getAttribute("x")) - DOM.select(this.id).getAttribute("dragx")) / this.getFormatter().getWidth();
		var y1 = (parseFloat(this.selectorSVGNode.getAttribute("y")) - DOM.select(this.id).getAttribute("dragy")) / this.getFormatter().getHeight();
		var x2 = (x1 + parseFloat(this.selectorSVGNode.getAttribute("width") / this.formatter.getWidth()));
		var y2 = (y1 + parseFloat(this.selectorSVGNode.getAttribute("height") / this.formatter.getHeight()));

		var verticesSelected = this.getLayout().getVerticesByArea(x1 / this.getFormatter().getZoomScale, y1 / this.getFormatter().getZoomScale,
				x2 / this.getFormatter().getZoomScale, y2 / this.getFormatter().getZoomScale);

		for ( var i = 0; i < verticesSelected.length; i++) {
			this.selectNode(verticesSelected[i].getId());
		}

		if (this.selectorSVGNode != null) {
			this._svg.removeChild(this.selectorSVGNode);
		}

		if (this.args.labeled) {
			this.clearLabels();
			this.renderLabels();
		}

		this.selectorSVGNode = null;
		//		this.renderLabels();
	}
};

/** SELECTION **/
GraphCanvas.prototype.displaySelection = function(x, y, width, height) {
	if (this.selectorSVGNode != null) {
		this.selectorSVGNode.setAttribute("x", x);
		this.selectorSVGNode.setAttribute("y", y);
		this.selectorSVGNode.setAttribute("width", width);
		this.selectorSVGNode.setAttribute("height", height);
	} else {
		this.selectorSVGNode = SVG.drawRectangle(x, y, width, height, this._svg, {
			"fill" : "red",
			"stroke" : "black",
			"opacity" : "0.2",
			"stroke-opacity" : "1"
		});
	}
};

/** DRAGGING **/
GraphCanvas.prototype._startDragging = function(evt) {
	if (!this.isDraggingCanvasEnabled()) {
		if (this.isNodeCanvas(evt.target)) {
			this.draggingElement = null;
		}
	}

	if (this.isVertex(evt.target) || (this.isNodeBackground(evt.target) && (this.isDraggingCanvasEnabled()))|| (this.isNodeCanvas(evt.target) && (this.isDraggingCanvasEnabled()))) {
		this.clearLabels();
		this.draggingElement = evt.target;
		this.dragging = true;
		var p = this.getSVGCoordenates(evt);

		this.nMouseOffsetX = p.x - parseInt(evt.target.getAttribute("dragx"));
		this.nMouseOffsetY = p.y - parseInt(evt.target.getAttribute("dragy"));

		if (this.isVertex(evt.target)) {
			this.dragStartX = parseInt(this.draggingElement.getAttribute("dragx")) * this.getFormatter().getZoomScale()
					+ parseFloat(DOM.select(this.id).getAttribute("dragx"));
			this.dragStartY = parseInt(this.draggingElement.getAttribute("dragy")) * this.getFormatter().getZoomScale()
					+ parseFloat(DOM.select(this.id).getAttribute("dragy"));
		} else {
			this.dragStartX = p.x - parseInt(this.draggingElement.getAttribute("dragx"));// + parseFloat(DOM.select(this.id).getAttribute("dragx"));
			this.dragStartY = p.y - parseInt(this.draggingElement.getAttribute("dragy"));// + parseFloat(DOM.select(this.id).getAttribute("dragy"));
		}
	}
};

GraphCanvas.prototype._stopDragging = function(event) {
	this.nMouseOffsetX = 0;
	this.nMouseOffsetX = 0;
	/** despues del evento up viene el evento click entonces acabo el dragging en el mouseclick **/
	this.dragging = false;
	this.draggingElement = null;
	this.renderLabels();

	this.setLinking(false);
	this.setMultipleSelection(true);
	this.selecting = false;

};

/** Move the edges of the vertex with the vertexId indicado **/
GraphCanvas.prototype.moveEdge = function(vertexId) {
	var x = this.getLayout().getNodeById(vertexId).x * this.getFormatter().getWidth();
	var y = this.getLayout().getNodeById(vertexId).y * this.getFormatter().getHeight();

	/** Moving edges out **/
	for ( var i = 0; i < this.getDataset().getVertexById(vertexId).getEdgesOut().length; i++) {
		var edgeId = this.getDataset().getVertexById(vertexId).getEdgesOut()[i].getId();
		var svgEdgeId = this.getSVGEdgeId(edgeId);
		var edgeFormatter = this.getFormatter().getEdgeById(edgeId);
		if (edgeFormatter instanceof LineEdgeGraphFormatter) {
			DOM.select(svgEdgeId + "_shadow").setAttribute("x2", x);
			DOM.select(svgEdgeId + "_shadow").setAttribute("y2", y);
			DOM.select(svgEdgeId).setAttribute("x2", x);
			DOM.select(svgEdgeId).setAttribute("y2", y);
		}

		if ((edgeFormatter instanceof DirectedLineEdgeGraphFormatter) || (edgeFormatter instanceof OdirectedLineEdgeGraphFormatter)
				|| (edgeFormatter instanceof OdotDirectedLineEdgeGraphFormatter) || (edgeFormatter instanceof DotDirectedLineEdgeGraphFormatter)
				|| (edgeFormatter instanceof CutDirectedLineEdgeGraphFormatter)) {
			this.removeEdge(edgeId);
			this.renderEdge(edgeId);
		}
	}

	/** Moving edges in **/
	for ( var i = 0; i < this.getDataset().getVertexById(vertexId).getEdgesIn().length; i++) {
		var edgeId = this.getDataset().getVertexById(vertexId).getEdgesIn()[i].getId();
		var svgEdgeId = this.getSVGEdgeId(edgeId);
		var edgeFormatter = this.getFormatter().getEdgeById(edgeId);
		if (edgeFormatter instanceof LineEdgeGraphFormatter) {
			DOM.select(svgEdgeId).setAttribute("x1", x);
			DOM.select(svgEdgeId).setAttribute("y1", y);
			DOM.select(svgEdgeId + "_shadow").setAttribute("x1", x);
			DOM.select(svgEdgeId + "_shadow").setAttribute("y1", y);
		}

		if ((edgeFormatter instanceof DirectedLineEdgeGraphFormatter) || (edgeFormatter instanceof OdirectedLineEdgeGraphFormatter)
				|| (edgeFormatter instanceof OdotDirectedLineEdgeGraphFormatter) || (edgeFormatter instanceof DotDirectedLineEdgeGraphFormatter)
				|| (edgeFormatter instanceof CutDirectedLineEdgeGraphFormatter)) {
			this.removeEdge(edgeId);
			this.renderEdge(edgeId);
		}

		if (edgeFormatter instanceof BezierEdgeGraphFormatter) {
			var radius = this.getFormatter().getVertexById(vertexId).getDefault().getSize() * this.getFormatter().getNodesMaxSize();
			var d = this.calculateCoordenatesBezier(radius, x, y);
			DOM.select(svgEdgeId).setAttribute("d", d);
		}
	}
};

GraphCanvas.prototype.moveNode = function(vertexId) {
	var x = this.getLayout().getNodeById(vertexId).x * this.getFormatter().getWidth();
	var y = this.getLayout().getNodeById(vertexId).y * this.getFormatter().getHeight();
	var svgNodeElement = DOM.select(this.getSVGNodeId(vertexId));

	svgNodeElement.setAttribute("dragx", x);
	svgNodeElement.setAttribute("dragy", y);
	svgNodeElement.setAttribute("transform", "translate(" + x + "," + y + ")");

	if (this.getDataset().getVertexById(vertexId).getEdges().length < this.args.maxNumberEdgesMoving) {
		this.moveEdge(vertexId);
	}
};

GraphCanvas.prototype._movingNode = function(svgNodeElement, x, y) {
	var vertexId = this.getVertexIdFromSVGId(svgNodeElement.getAttribute("id"));
	this.getLayout().getNodeById(vertexId).setCoordinates(x / this.getFormatter().getWidth(), y / this.getFormatter().getHeight());
	this.desplazamientoX = 0;
	this.desplazamientoY = 0;
	this.removeLabel(vertexId);
	this.renderLabel(vertexId);
};

/** INIT **/
GraphCanvas.prototype.init = function() {

	this._svg = this.createSVGDom(this.targetID, this.id, this.getFormatter().getWidth(), this.getFormatter().getHeight(), this.getFormatter()
			.getBackgroundColor());
	this.GraphGroup = SVG.drawGroup(this._svg, [ [ "id", this.args.idGraph ], [ "transform", "translate(0,0), scale(1)" ] ]);
	this.GraphBackground = SVG.drawGroup(this.GraphGroup, [ [ "id", this.args.idBackground ] ]);
	this.GraphEdgeGroup = SVG.drawGroup(this.GraphGroup, [ [ "id", this.args.idEdgesGraph ] ]);
	this.GraphNodeGroup = SVG.drawGroup(this.GraphGroup, [ [ "id", this.args.idNodesGraph ] ]);
	this.GraphLabelGroup = SVG.drawGroup(this.GraphGroup, [ [ "id", this.args.idLabelGraph ] ]);

	if ((this.getFormatter().getBackgroundImage() != null) && (this.getFormatter().getBackgroundImage() != "")) {
		this.setBackgroundImage(this.getFormatter().getBackgroundImage());
	}
	/** SVG Events listener */
	var _this = this;
	this._svg.addEventListener("click", function(event) {
		_this.mouseClick(event);
	}, false);
	this._svg.addEventListener("mousemove", function(event) {
		_this.mouseMove(event, _this);
	}, false);
	this._svg.addEventListener("mousedown", function(event) {
		_this.mouseDown(event, _this);
	}, false);
	this._svg.addEventListener("mouseup", function(event) {
		_this.mouseUp(event, _this);
	}, false);
};

/*
 GraphCanvas.prototype.backgroungToSVG = function(){
 var _this = this;
 var canvas = document.createElement('canvas');
 canvas.setAttribute("id", "canvas");
 canvas.width = this.formatter.getWidth();
 canvas.height = this.formatter.getHeight();

 this._svg.parentNode.parentNode.appendChild(canvas);
 var ctx = document.getElementById('canvas').getContext('2d');
 var img = new Image();

 img.src = this.formatter.getBackgroundImage();
 ctx.drawImage(img,0,0 ,_this.formatter.getWidth(), _this.formatter.getHeight()); 


 img.onload  = function() { 
 canvas.parentNode.removeChild(canvas);
 }

 this.NodeSVGbackgroundImage.setAttribute("xlink:href", document.getElementById("canvas").toDataURL());
 this.NodeSVGbackgroundImage.removeAttribute("href");

 //

 };*/

GraphCanvas.prototype.setBackgroundImage = function() {
	if (this.NodeSVGbackgroundImage != null) {
		this.NodeSVGbackgroundImage.parentNode.removeChild(this.NodeSVGbackgroundImage);
	}
	$('#' + this.targetID).svg();
	$('#' + this.targetID).svg("get");

	$('#' + this.targetID).svg("get")._svg = document.getElementById(this.id);

	var svg = $('#' + this.targetID).svg("get");
	this.NodeSVGbackgroundImage = svg.image(0, 0, this.getFormatter().getWidth(), this.getFormatter().getHeight(), this.getFormatter()
			.getBackgroundImage());
	this.NodeSVGbackgroundImage.setAttribute("id", this.args.idBackgroundNode);

	this.NodeSVGbackgroundImage.setAttribute("x", 0);
	this.NodeSVGbackgroundImage.setAttribute("y", 0);

	this.NodeSVGbackgroundImage.setAttribute("dragx", 0);
	this.NodeSVGbackgroundImage.setAttribute("dragy", 0);

	if (this.getFormatter().args.backgroundImageHeight != null) {
		this.NodeSVGbackgroundImage.setAttribute("height", this.getFormatter().args.backgroundImageHeight);
	}
	if (this.getFormatter().args.backgroundImageWidth != null) {
		this.NodeSVGbackgroundImage.setAttribute("width", this.getFormatter().args.backgroundImageWidth);
	}

	if (this.getFormatter().args.backgroundImageX != null) {
		this.NodeSVGbackgroundImage.setAttribute("x", this.getFormatter().args.backgroundImageX);
	}
	if (this.getFormatter().args.backgroundImageY != null) {
		this.NodeSVGbackgroundImage.setAttribute("y", this.getFormatter().args.backgroundImageY);
	}

	this.GraphBackground.appendChild(this.NodeSVGbackgroundImage);
	this.NodeSVGbackgroundImage.removeAttribute("href");
	this.NodeSVGbackgroundImage.setAttribute("xlink:href", this.getFormatter().getBackgroundImage());
};

GraphCanvas.prototype.removeBackgroundImage = function() {
	if (this.NodeSVGbackgroundImage != null) {
		this.NodeSVGbackgroundImage.parentNode.removeChild(this.NodeSVGbackgroundImage);
	}
};

GraphCanvas.prototype._setBackgroundColor = function(color) {
	var attributes = [ [ "fill", color ] ];
	SVG.drawRectangle(0, 0, this.getFormatter().getWidth(), this.getFormatter().getHeight(), this.GraphBackground, attributes);
};

/** Serialize **/
GraphCanvas.prototype.toJSON = function() {
	var json = {};
	json.dataset = {};
	json.formatter = {};
	json.layout = {};
	json.dataset = this.getDataset().toJSON();
	json.formatter = this.getFormatter().toJSON();
	json.layout = this.getLayout().toJSON();
	return json;
};

GraphCanvas.prototype.toHTML = function() {
	//this.backgroungToSVG();
	var html = this._svg.parentElement.innerHTML;

	var start = html.indexOf("<svg");
	var end = html.indexOf("</svg>") + 6;

	return html.substr(start, end);
};

/** DRAW **/
GraphCanvas.prototype.draw = function(graphdataset, graphformatter, graphlayout) {
	this.setDataset(graphdataset);
	this.setFormatter(graphformatter);
	this.setLayout(graphlayout);

	var _this = this;
	this.getFormatter().changed.attach(function(sender, item) {
		_this.removeNode(item.getId());
		_this.renderNode(item.getId());
		if (_this.args.labeled) {
			_this.removeLabel(item.getId());
			_this.renderLabel(item.getId());
		}

	});
	//TODO
	this.getFormatter().edgeChanged.attach(function(sender, item) {
		_this.removeEdge(item.getId());
		_this.renderEdge(item.getId());
	});

	this.getFormatter().resized.attach(function(sender, item) {
		_this.resize(_this.getFormatter().getWidth(), _this.getFormatter().getHeight());
	});

	this.getFormatter().backgroundImageChanged.attach(function(sender, item) {
		_this.setBackgroundImage(_this.getFormatter().getBackgroundImage());
	});

	this.getFormatter().backgroundColorChanged.attach(function(sender, item) {
		_this._setBackgroundColor(_this.getFormatter().getBackgroundColor());
	});

	this.getLayout().changed.attach(function(sender, item) {
		_this.moveNode(item.getId());
		_this.moveEdge(item.getId());
		if (_this.args.labeled) {
			_this.removeLabel(item.getId());
			_this.renderLabel(item.getId());
		}
	});

	this.getDataset().newVertex.attach(function(sender, item) {

		_this.renderNode(item.getId());
		if (_this.args.labeled) {
			_this.renderLabel(item.getId());
		}
	});

	this.getDataset().newEdge.attach(function(sender, item) {
		_this.renderEdge(item.getId());
	});

	this.getDataset().vertexDeleted.attach(function(sender, item) {
		_this.removeNode(item.getId());
		if (_this.args.labeled) {
			_this.removeLabel(item.getId());
		}
	});

	this.getDataset().edgeDeleted.attach(function(sender, item) {
		_this.removeEdge(item.getId());
	});

	this.getDataset().vertexNameChanged.attach(function(sender, args) {
		if (_this.args.labeled) {
			_this.removeLabel(args.item.getId());
			_this.removeLabel(args.item.getId());
			_this.renderLabel(args.item.getId());
		}
	});
	this.init();
	this.render();
};

GraphCanvas.prototype.render = function() {
	for ( var id in this.getDataset().getVertices()) {
		this.renderNode(id);
	}
	this.renderLabels();
	this.renderEdges();
};

GraphCanvas.prototype.renderLabels = function() {
	if (this.args.labeled) {
		for ( var id in this.getDataset().getVertices()) {
			this.renderLabel(id);
		}
	}
};

GraphCanvas.prototype.removeLabels = function() {
	for ( var id in this.getDataset().getVertices()) {
		this.removeLabel(id);
	}
};

/** Utilities method for nodes **/
GraphCanvas.prototype.isNodeCanvas = function(node) {
	return ((node.id == this.args.idGraph) || (node.id == this.id));
};

GraphCanvas.prototype.isNodeBackground = function(node) {
	return ((node.id == this.args.idBackgroundNode));
};

GraphCanvas.prototype.isVertex = function(node) {
	if (node.getAttribute("id") != null) {
		if (node.getAttribute("id").indexOf("_v_") != -1) {
			return true;
		}
	}
	return false;
};

GraphCanvas.prototype.isLabel = function(node) {
	if (node.getAttribute("id") != null) {
		if (node.getAttribute("id").indexOf("_l_") != -1) {
			return true;
		}
	}
	return false;
};

GraphCanvas.prototype.isEdge = function(node) {
	if (node.getAttribute("id") != null) {
		if (node.getAttribute("id").indexOf("_e_") != -1) {
			return true;
		}
	}
	return false;
};

/** Resize **/
GraphCanvas.prototype.resize = function(width, height) {
	//	this._svg.setAttribute("width", width);
	//	this._svg.setAttribute("height", height);
	if (this.NodeSVGbackgroundImage != null) {
		this.NodeSVGbackgroundImage.setAttribute("width", width);
		this.NodeSVGbackgroundImage.setAttribute("height", height);
	}

	this._svg.setAttribute("width", width);
	this._svg.setAttribute("height", height);

	this.clearCanvas();
	this.render();
};

GraphCanvas.prototype.clearCanvas = function() {
	DOM.removeChilds(this.GraphEdgeGroup.getAttribute("id"));
	DOM.removeChilds(this.GraphNodeGroup.getAttribute("id"));
	this.clearLabels();
};

GraphCanvas.prototype.clearLabels = function() {
	DOM.removeChilds(this.GraphLabelGroup.getAttribute("id"));
};

/** ID'S converter **/
GraphCanvas.prototype.getSVGNodeId = function(nodeId) {
	return this.id + "_v_" + nodeId;
};

GraphCanvas.prototype.getSVGEdgeId = function(edgeId) {
	return this.id + "_e_" + edgeId;
};

GraphCanvas.prototype.getSVGArrowEdgeId = function(edgeId) {
	return this.id + "_arrow_" + edgeId;
};

GraphCanvas.prototype.getSVGLabelId = function(edgeId) {
	return this.id + "_l_" + edgeId;
};

GraphCanvas.prototype.blinkVertexById = function(vertexId) {
	$("#" + this.getSVGNodeId(vertexId)).fadeIn().fadeOut().fadeIn().fadeOut().fadeIn().fadeOut();
};

GraphCanvas.prototype.getVertexIdFromSVGId = function(svgVertexId) {
	return svgVertexId.replace(this.id, "").replace("_v_", "");
};

GraphCanvas.prototype.getEdgeIdFromSVGId = function(svgEdgeId) {
	return svgEdgeId.replace(this.id, "").replace("_e_", "");
};

/** VERTEX **/
GraphCanvas.prototype.getVertexById = function(id) {
	return document.getElementById(this.getSVGNodeId(id));
};

GraphCanvas.prototype.renderNodes = function() {
	for ( var id in this.getDataset().getVertices()) {
		this.renderNode(id);
	}
};

GraphCanvas.prototype.overNode = function(nodeId) {
	if (!this.args.interactive) {
		return;
	}
	/** If selected we don't change the format **/
	if (this.args.isVertexSelected[nodeId] == null) {
		var args = this.getFormatter().getVertexById(nodeId).getOver();
		args.args["cursor"] = 'pointer';
		this.changeVertexFormat(nodeId, args);
	}
};

GraphCanvas.prototype.outNode = function(nodeId) {
	if (!this.args.interactive) {
		return;
	}

	/** If selected we don't change the format **/
	if (this.args.isVertexSelected[nodeId] == null) {
		this.changeVertexFormat(nodeId, this.getFormatter().getVertexById(nodeId).getDefault());
	}
};

GraphCanvas.prototype.overLabel = function(nodeId) {
	this.overNode(nodeId);
	//	this.svgLabels[nodeId].setAttribute("cursor", "pointer");
};

GraphCanvas.prototype.outLabel = function(nodeId) {
	this.outNode(nodeId);
	//	this.svgLabels[nodeId].setAttribute("cursor", "");
};

GraphCanvas.prototype.clickNode = function(nodeId) {
	if (!this.args.interactive) {
		return;
	}

	/** si el evento se dispara oprque estaba dragging entonces no activo nada **/
	if (this.args.isVertexSelected[nodeId] == null) {
		this.selectNode(nodeId);
	} else {
		this.deselectNode(nodeId);
	}
};

GraphCanvas.prototype.selectNode = function(nodeId) {
	for ( var i = 0; i < this.args.selectedVertices.length; i++) {
		var format = this.getFormatter().getVertexById(nodeId).getSelected();
		format.opacity = 0.2;
		this.changeVertexFormat(nodeId, this.getFormatter().getVertexById(nodeId).getSelected());
	}

	if (this.args.isVertexSelected[nodeId] == null) {
		var format = this.getFormatter().getVertexById(nodeId).getSelected();
		format.opacity = 1;
		this.changeVertexFormat(nodeId, this.getFormatter().getVertexById(nodeId).getSelected());
		this.args.selectedVertices.push(nodeId);
		this.args.isVertexSelected[nodeId] = this.args.selectedVertices.length - 1;
		this.onVertexSelect.notify(nodeId);
	}
};

GraphCanvas.prototype.selectAllEdges = function() {
	this.deselectNodes();
	this.deselectEdges();

	for ( var edgesId in this.getDataset().edges) {
		this.selectEdge(edgesId);
	}
};

GraphCanvas.prototype.selectAllNodes = function() {
	this.deselectNodes();
	this.deselectEdges();

	for ( var vertexId in this.getDataset().vertices) {
		this.selectNode(vertexId);
	}
};

GraphCanvas.prototype.selectAll = function() {
	this.deselectNodes();
	this.deselectEdges();

	for ( var vertexId in this.getDataset().vertices) {
		this.selectNode(vertexId);
	}

	for ( var edgesId in this.getDataset().edges) {
		this.selectEdge(edgesId);
	}
};

GraphCanvas.prototype.selectEdge = function(edgeId) {
	if (this.args.isEdgeSelected[edgeId] == null) {
		this.changeEdgeFormat(edgeId, this.getFormatter().getEdgeById(edgeId).getSelected());
		//this.args.selectedEdges.push(edgeId);
		this.args.isEdgeSelected[edgeId] = true; //this.args.selectedEdges.length - 1;
		this.onEdgeSelect.notify(edgeId);
	}
};

GraphCanvas.prototype.selectEdges = function(edges) {

	for ( var i = 0; i < edges.length; i++) {
		this.selectEdge(edges[i]);
	}
};

GraphCanvas.prototype.deselectNode = function(nodeId) {
	if (this.args.isVertexSelected[nodeId] != null) {
		this.changeVertexFormat(nodeId, this.getFormatter().getVertexById(nodeId).getDefault());
		this.args.selectedVertices.splice(this.args.isVertexSelected[nodeId], 1);
		var index = this.args.isVertexSelected[nodeId];
		delete this.args.isVertexSelected[nodeId];

		for ( var vertex in this.args.isVertexSelected) {
			if (this.args.isVertexSelected[vertex] > index) {
				this.args.isVertexSelected[vertex] = this.args.isVertexSelected[vertex] - 1;
			}
		}
	}
};

GraphCanvas.prototype.deselectNodes = function() {
	var selected = JSON.parse(JSON.stringify(this.getSelectedVertices()));
	for ( var i = 0; i < selected.length; i++) {
		this.deselectNode(selected[i]);
	}
};
GraphCanvas.prototype.selectNodes = function(idNodes) {

	for ( var i = 0; i < idNodes.length; i++) {
		this.selectNode(idNodes[i]);
	}

	//	for ( var vertex in this.args.isVertexSelected) {
	//		if (this.args.isVertexSelected[vertex] > index){
	//			this.args.isVertexSelected[vertex] = this.args.isVertexSelected[vertex] - 1;
	//		}
	//	}

};

GraphCanvas.prototype.changeVertexFormat = function(nodeId, format) {
	var svgNode = DOM.select(this.getSVGNodeId(nodeId));
	if (svgNode != null) {
		var properties = format.toJSON();
		for ( var item in properties) {
			svgNode.setAttribute(item, properties[item]);
		}

		if (this.getFormatter().getVertexById(nodeId) instanceof CircleVertexGraphFormatter) {
			var transform = "translate(" + svgNode.getAttribute("dragx") + "," + svgNode.getAttribute("dragy") + "), scale(" + format.getSize() + ")";
			svgNode.setAttribute("transform", transform);
		}
	}
};

GraphCanvas.prototype.renderLabel = function(nodeId) {
	var x = Math.ceil(this.getLayout().getNodeById(nodeId).x * this.getFormatter().getWidth());
	var y = Math.ceil(this.getLayout().getNodeById(nodeId).y * this.getFormatter().getHeight());

	var svgAttributesNode = JSON.parse(JSON.stringify(this.getFormatter().getVertexById(nodeId).getDefault().toJSON().title));
	svgAttributesNode.id = this.getSVGLabelId(this.getDataset().getVertexById(nodeId).getId());
	svgAttributesNode.dx = (-1) * (this.getDataset().getVertexById(nodeId).getName().length * svgAttributesNode["font-size"]) / 4 - 4;

	svgAttributesNode.dy = parseFloat((this.getFormatter().getVertexById(nodeId).getDefault().getSize()))
			+ parseFloat(svgAttributesNode["font-size"]) + parseFloat(this.getFormatter().getVertexById(nodeId).getDefault().getStrokeWidth()) - 4;
	svgAttributesNode.dragx = Math.ceil(this.getLayout().getNodeById(nodeId).x * this.getFormatter().getWidth());

	var gragy = parseFloat(this.getFormatter().getVertexById(nodeId).getDefault().getSize())
			+ Math.ceil(this.getLayout().getNodeById(nodeId).y * this.getFormatter().getHeight());
	svgAttributesNode.dragy = gragy;
	svgAttributesNode.transform = "translate(" + svgAttributesNode.dragx + "," + svgAttributesNode.dragy + ")";//, scale("+this.formatter.getVertexById(nodeId).getDefault().getSize()+")";

	var nodeSVG = SVG.drawText(0, 0, this.getDataset().getVertexById(nodeId).getName(), this.GraphLabelGroup, svgAttributesNode);

	this.svgLabels[nodeId] = nodeSVG;

	/** Events for the SVG node **/
	var _this = this;
	if (nodeSVG != null) {
		nodeSVG.addEventListener("mouseover", function() {
			_this.overLabel(nodeId);
		}, false);
		nodeSVG.addEventListener("mouseout", function() {
			_this.outLabel(nodeId);
		}, false);
	}

};

GraphCanvas.prototype.removeLabel = function(labelId) {
	if (DOM.select(this.getSVGLabelId(labelId)) != null) {
		DOM.select(this.getSVGLabelId(labelId)).parentNode.removeChild(DOM.select(this.getSVGLabelId(labelId)));
	}
};

GraphCanvas.prototype.renderNode = function(nodeId) {
	var svgAttributesNode = JSON.parse(JSON.stringify(this.getFormatter().getVertexById(nodeId).getDefault().toJSON()));
	svgAttributesNode.dragx = Math.ceil(this.getLayout().getNodeById(nodeId).x * this.getFormatter().getWidth());
	svgAttributesNode.dragy = Math.ceil(this.getLayout().getNodeById(nodeId).y * this.getFormatter().getHeight());
	svgAttributesNode.transform = "translate(" + svgAttributesNode.dragx + "," + svgAttributesNode.dragy + ")";
	svgAttributesNode.id = this.getSVGNodeId(nodeId);
	/*svgAttributesNode["stroke-width"] = 3 ;
	svgAttributesNode["stroke-opacity"] = 1 ;
	svgAttributesNode["fill-opacity"] = svgAttributesNode["opacity"] ;
	svgAttributesNode["opacity"] = 1 ;*/
	this.circleDefaultRadius = this.getFormatter().getVertexById(nodeId).getDefault().getSize();
	var nodeSVG;

	if (this.getFormatter().getVertexById(nodeId) instanceof CircleVertexGraphFormatter) {
		nodeSVG = SVG.drawCircle(0, 0, this.circleDefaultRadius, this.GraphNodeGroup, svgAttributesNode);
	}

	if (this.getFormatter().getVertexById(nodeId) instanceof SquareVertexGraphFormatter) {
		//nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius) ,0 - (this.formatter.getVertexById(nodeId).getDefault().getSize()) , (this.getFormatter().getVertexById(nodeId).getDefault().getSize()*2),  (this.getFormatter().getVertexById(nodeId).getDefault().getSize()*2), this.GraphNodeGroup, svgAttributesNode);
		nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius), 0 - (this.circleDefaultRadius), (this.circleDefaultRadius * 2),
				(this.circleDefaultRadius * 2), this.GraphNodeGroup, svgAttributesNode);
	}

	if (this.getFormatter().getVertexById(nodeId) instanceof EllipseVertexGraphFormatter) {
		nodeSVG = SVG.drawEllipse(0, 0, this.circleDefaultRadius * 1.5, this.circleDefaultRadius, this.GraphNodeGroup, svgAttributesNode);
	}

	if (this.getFormatter().getVertexById(nodeId) instanceof RectangleVertexGraphFormatter) {
		//nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius) ,0 - ((this.circleDefaultRadius*2)/2) , (this.circleDefaultRadius*2),  (this.circleDefaultRadius), this.GraphNodeGroup, svgAttributesNode);
		nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius * 1.5), 0 - (this.circleDefaultRadius), (this.circleDefaultRadius * 2 * 1.5),
				(this.circleDefaultRadius * 2), this.GraphNodeGroup, svgAttributesNode);

	}

	if (this.getFormatter().getVertexById(nodeId) instanceof RoundedVertexGraphFormatter) {
		svgAttributesNode.ry = 2;// this.formatter.getVertexById(nodeId).getDefault().getSize()/4;
		svgAttributesNode.rx = 2;// this.formatter.getVertexById(nodeId).getDefault().getSize()/4;
		nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius * 1.5), 0 - (this.circleDefaultRadius), (this.circleDefaultRadius * 2 * 1.5),
				(this.circleDefaultRadius * 2), this.GraphNodeGroup, svgAttributesNode);
	}

	//<polygon fill="violet" stroke="violet" points="935.972,-363.757 935.972,-380.243 914.9,-391.9 885.1,-391.9 864.028,-380.243 864.028,-363.757 885.1,-352.1 914.9,-352.1 935.972,-363.757"/> 

	if (this.getFormatter().getVertexById(nodeId) instanceof OctagonVertexGraphFormatter) {
		svgAttributesNode.ry = 2;
		svgAttributesNode.rx = 2;
		nodeSVG = SVG.drawRectangle(0 - (this.circleDefaultRadius * 1.5), 0 - (this.circleDefaultRadius), (this.circleDefaultRadius * 2 * 1.5),
				(this.circleDefaultRadius * 2), this.GraphNodeGroup, svgAttributesNode);
	}

	nodeSVG.internalId = nodeId;
	//
	var _this = this;

	/** Events for the SVG node **/
	if (nodeSVG != null) {
		nodeSVG.addEventListener("mouseover", function() {
			_this.onVertexOver.notify(nodeId);
			_this.overNode(nodeId);
		}, false);
		nodeSVG.addEventListener("mouseout", function() {
			_this.onVertexOut.notify(nodeId);
			_this.outNode(nodeId);
		}, false);
		//nodeSVG.addEventListener("click", function(){_this.clickNode(nodeId);}, false);
		//
		nodeSVG.addEventListener("mouseup", function() {
			_this.onVertexUp.notify(nodeId);
		}, false);
	}
};

GraphCanvas.prototype.removeNode = function(nodeId) {
	DOM.select(this.getSVGNodeId(nodeId)).parentNode.removeChild(DOM.select(this.getSVGNodeId(nodeId)));
	if (this.args.labeled) {
		this.removeLabel(nodeId);
	}
};

/** REMOVING **/
GraphCanvas.prototype.removeSelected = function() {
	/** El orden importa **/
	this.removeSelectedEdges();
	this.removeSelectedNode();

};

GraphCanvas.prototype.removeSelectedNode = function() {
	var selected = JSON.parse(JSON.stringify(this.getSelectedVertices()));
	this.deselectNodes();
	var sorted = selected.sort(function(a, b) {
		return a - b
	});
	for ( var i = 0; i < sorted.length; i++) {
		if (this.getDataset().getVertexById(sorted[i]) != null) {
			this.getDataset().getVertexById(sorted[i]).remove();
		}
	}
};

/** EDGES **/
GraphCanvas.prototype.removeEdge = function(edgeId) {
	if (DOM.select(this.getSVGEdgeId(edgeId)) != null) {
		DOM.select(this.getSVGEdgeId(edgeId)).parentNode.removeChild(DOM.select(this.getSVGEdgeId(edgeId)));
	}

	if (DOM.select(this.getSVGEdgeId(edgeId) + "_shadow") != null) {
		DOM.select(this.getSVGEdgeId(edgeId) + "_shadow").parentNode.removeChild(DOM.select(this.getSVGEdgeId(edgeId) + "_shadow"));
	}

	if (DOM.select(this.getSVGArrowEdgeId(edgeId)) != null) {
		DOM.select(this.getSVGArrowEdgeId(edgeId)).parentNode.removeChild(DOM.select(this.getSVGArrowEdgeId(edgeId)));
	}
};

GraphCanvas.prototype.overEdge = function(edgeId) {
	if ((!this.args.interactive) || this.dragging || this.selecting) {
		return;
	}

	/** If selected we don't change the format **/
	if (this.args.isEdgeSelected[edgeId] == null) {
		var format = this.getFormatter().getEdgeById(edgeId).getOver();
		format.args["cursor"] = "pointer";
		this.changeEdgeFormat(edgeId, format);
	}
};

GraphCanvas.prototype.outEdge = function(edgeId) {
	if (!this.args.interactive) {
		return;
	}

	/** If selected we don't change the format **/
	if (this.args.isEdgeSelected[edgeId] == null) {
		this.changeEdgeFormat(edgeId, this.getFormatter().getEdgeById(edgeId).getDefault());
	}
};

GraphCanvas.prototype.changeEdgeFormat = function(edgeId, format) {
	var svgEdge = DOM.select(this.getSVGEdgeId(edgeId) + "_shadow");
	if (svgEdge != null) {
		var properties = format.toJSON();
		for ( var item in properties) {
			svgEdge.setAttribute(item, properties[item]);
		}
	}
};

GraphCanvas.prototype.deselectEdge = function(edgeID) {
	if (this.args.isEdgeSelected[edgeID] != null) {
		this.changeEdgeFormat(edgeID, this.getFormatter().getEdgeById(edgeID).getDefault());
		var index = this.args.isEdgeSelected[edgeID];
		delete this.args.isEdgeSelected[edgeID];
	}
};

GraphCanvas.prototype.deselectEdges = function() {
	var selected = JSON.parse(JSON.stringify(this.getSelectedEdges()));
	for ( var i = 0; i < selected.length; i++) {
		this.deselectEdge(selected[i]);
	}
};

GraphCanvas.prototype.removeSelectedEdges = function() {
	var selected = JSON.parse(JSON.stringify(this.getSelectedEdges()));
	this.deselectEdges();
	for ( var i = 0; i < selected.length; i++) {
		if (this.getDataset().getEdgeById(selected[i]) != null) {
			this.getDataset().getEdgeById(selected[i]).remove();
		}
	}
};

GraphCanvas.prototype.renderEdge = function(edgeId) {
	var svgAttributesEdge = this.getFormatter().getEdgeById(edgeId).getDefault().toJSON();
	var edge = this.getDataset().getEdgeById(edgeId);

	var svgNodeTarget = this.getVertexById(edge.getNodeTarget().getId());
	var svgNodeSource = this.getVertexById(edge.getNodeSource().getId());
	svgAttributesEdge.id = this.getSVGEdgeId(edge.getId()) + "_shadow";

	var svgEdge = null;

	if (this.getFormatter().getEdgeById(edgeId) instanceof LineEdgeGraphFormatter) {
		var coordenateSourceX = svgNodeSource.getAttribute("dragx");
		var coordenateSourceY = svgNodeSource.getAttribute("dragy");
		var coordenateTargetX = svgNodeTarget.getAttribute("dragx");
		var coordenateTargetY = svgNodeTarget.getAttribute("dragy");

		SVG.drawLine(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, this.GraphEdgeGroup, svgAttributesEdge);
		var attributesShadow = {};
		attributesShadow.id = this.getSVGEdgeId(edge.getId());
		attributesShadow["stroke-opacity"] = 0;
		attributesShadow["stroke-width"] = 4;
		attributesShadow["stroke"] = "black";
		svgEdge = SVG.drawLine(svgNodeSource.getAttribute("dragx"), svgNodeSource.getAttribute("dragy"), svgNodeTarget.getAttribute("dragx"),
				svgNodeTarget.getAttribute("dragy"), this.GraphEdgeGroup, attributesShadow);
	}

	if (this.getFormatter().getEdgeById(edgeId) instanceof BezierEdgeGraphFormatter) {
		var nodeId = edge.getNodeTarget().getId();
		var nodeSize = this.formatter.getVertexById(nodeId).getDefault().getSize() * this.getFormatter().getNodesMaxSize();
		svgAttributesEdge.fill = "none";
		svgAttributesEdge.id = this.getSVGEdgeId(edgeId);
		var d = this.calculateCoordenatesBezier(nodeSize, svgNodeSource.getAttribute("dragx"), svgNodeSource.getAttribute("dragy"));
		svgEdge = SVG.drawPath(d, this.GraphEdgeGroup, svgAttributesEdge);
	}
	;

	if ((this.getFormatter().getEdgeById(edgeId) instanceof DirectedLineEdgeGraphFormatter)
			|| (this.getFormatter().getEdgeById(edgeId) instanceof CutDirectedLineEdgeGraphFormatter)
			|| (this.getFormatter().getEdgeById(edgeId) instanceof DotDirectedLineEdgeGraphFormatter)
			|| (this.getFormatter().getEdgeById(edgeId) instanceof OdotDirectedLineEdgeGraphFormatter)
			|| (this.getFormatter().getEdgeById(edgeId) instanceof OdirectedLineEdgeGraphFormatter)) {
		var coordenateSourceX = svgNodeSource.getAttribute("dragx");
		var coordenateSourceY = svgNodeSource.getAttribute("dragy");
		var coordenateTargetX = svgNodeTarget.getAttribute("dragx");
		var coordenateTargetY = svgNodeTarget.getAttribute("dragy");

		var offset = parseFloat(this.getFormatter().getVertexById(this.getDataset().getEdgeById(edgeId).getNodeTarget().getId()).getDefault()
				.getSize()
				* this.circleDefaultRadius);
		var point = this._calculateEdgePointerPosition(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, offset);
		coordenateTargetX = point.x;
		coordenateTargetY = point.y;
		SVG.drawLine(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, this.GraphEdgeGroup, svgAttributesEdge);

		var attributesShadow = {};
		attributesShadow.id = this.getSVGEdgeId(edge.getId());
		attributesShadow["stroke-opacity"] = 0;
		attributesShadow["stroke-width"] = 4;
		attributesShadow["stroke"] = "black";
		svgEdge = SVG.drawLine(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, this.GraphEdgeGroup, attributesShadow);
	}

	if (this.getFormatter().getEdgeById(edgeId) instanceof DirectedLineEdgeGraphFormatter
			|| (this.getFormatter().getEdgeById(edgeId) instanceof OdirectedLineEdgeGraphFormatter)) {
		var coordenateSourceX = svgNodeSource.getAttribute("dragx");
		var coordenateSourceY = svgNodeSource.getAttribute("dragy");
		var coordenateTargetX = svgNodeTarget.getAttribute("dragx");
		var coordenateTargetY = svgNodeTarget.getAttribute("dragy");

		var point = this._calculateEdgePointerPosition(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, offset);
		coordenateTargetX = point.x;
		coordenateTargetY = point.y;

		var angle = Geometry.toDegree(point.angle) + 90;
		this.arrowDefaultSize = this.getFormatter().getEdgeById(edgeId).getArrowSize(); //getDefault().getArrowSize();
		var d = "-" + this.arrowDefaultSize + ",0 0,-" + parseFloat(this.arrowDefaultSize) * 2 + " " + this.arrowDefaultSize + ",0";

		var attributes;

		if (this.getFormatter().getEdgeById(edgeId) instanceof DirectedLineEdgeGraphFormatter) {
			attributes = [
				[ "fill", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ],
				[ "stroke", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ], [ "id", this.getSVGArrowEdgeId(edgeId) ] ];
		} else {
			attributes = [
				[ "fill", "#FFFFFF" ], [ "stroke", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ],
				[ "id", this.getSVGArrowEdgeId(edgeId) ] ];
		}

		var flechaSVGNode = SVG.drawPoligon(d, this.GraphEdgeGroup, attributes);//, ["transform", "rotate("+angle+"), translate(0,0)"]]);
		flechaSVGNode.setAttribute("transform", " translate(" + coordenateTargetX + ", " + coordenateTargetY + "), rotate(" + angle + ")");
	}
	;

	if (this.getFormatter().getEdgeById(edgeId) instanceof CutDirectedLineEdgeGraphFormatter) {
		var coordenateSourceX = svgNodeSource.getAttribute("dragx");
		var coordenateSourceY = svgNodeSource.getAttribute("dragy");
		var coordenateTargetX = svgNodeTarget.getAttribute("dragx");
		var coordenateTargetY = svgNodeTarget.getAttribute("dragy");

		var point = this._calculateEdgePointerPosition(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, offset);
		coordenateTargetX = point.x;
		coordenateTargetY = point.y;

		var angle = Geometry.toDegree(point.angle) + 90;

		//this.arrowDefaultSize = 2; //getDefault().getArrowSize();
		var d = "-4,0 4,0 4,-2 -4,-2";

		var flechaSVGNode = SVG.drawPoligon(d, this.GraphEdgeGroup, [
			[ "fill", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ],
			[ "stroke", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ], [ "id", this.getSVGArrowEdgeId(edgeId) ] ]);//, ["transform", "rotate("+angle+"), translate(0,0)"]]);
		flechaSVGNode.setAttribute("transform", " translate(" + coordenateTargetX + ", " + coordenateTargetY + "), rotate(" + angle + ")");
	}
	;

	if ((this.getFormatter().getEdgeById(edgeId) instanceof DotDirectedLineEdgeGraphFormatter)
			|| (this.getFormatter().getEdgeById(edgeId) instanceof OdotDirectedLineEdgeGraphFormatter)) {
		var coordenateSourceX = svgNodeSource.getAttribute("dragx");
		var coordenateSourceY = svgNodeSource.getAttribute("dragy");
		var coordenateTargetX = svgNodeTarget.getAttribute("dragx");
		var coordenateTargetY = svgNodeTarget.getAttribute("dragy");
		var point = this._calculateEdgePointerPosition(coordenateSourceX, coordenateSourceY, coordenateTargetX, coordenateTargetY, offset);
		coordenateTargetX = point.x;
		coordenateTargetY = point.y;
		var angle = Geometry.toDegree(point.angle) + 90;
		//	this.arrowDefaultSize = this.formatter.getEdgeById(edgeId).getArrowSize(); //getDefault().getArrowSize();
		var attributes = [];
		if (this.getFormatter().getEdgeById(edgeId) instanceof OdotDirectedLineEdgeGraphFormatter) {
			attributes = [
				[ "fill", "#FFFFFF" ], [ "stroke", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ],
				[ "id", this.getSVGArrowEdgeId(edgeId) ] ];
		} else {
			attributes = [
				[ "fill", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ],
				[ "stroke", this.getFormatter().getEdgeById(edgeId).getDefault().getStroke() ], [ "id", this.getSVGArrowEdgeId(edgeId) ] ];
		}
		var flechaSVGNode = SVG.drawCircle(0, 0, 4, this.GraphEdgeGroup, attributes);
		flechaSVGNode.setAttribute("transform", " translate(" + coordenateTargetX + ", " + coordenateTargetY + "), rotate(" + angle + ")");
	}
	;

	var _this = this;
	/** Events for the SVG edge **/
	if (svgEdge != null) {
		if (this.getDataset().getEdgesCount() < this.args.maxNumberEdgesFiringEvents) {
			svgEdge.addEventListener("mouseover", function() {
				_this.overEdge(edgeId);
			}, false);
			svgEdge.addEventListener("mouseout", function() {
				_this.outEdge(edgeId);
			}, false);
		}
	}
};

GraphCanvas.prototype._calculateEdgePointerPosition = function(sourceX, sourceY, targetX, targetY, radius) {
	var angle = Geometry.getAngleBetweenTwoPoints(sourceX, sourceY, targetX, targetY);

	/** Suponiendo el node source que este a la derecha **/
	if ((targetX - sourceX) < 0) {
		var b = Geometry.getAdjacentSideOfRectangleRight(angle, radius);
		targetX = parseFloat(targetX) + parseFloat(b);
		arrowX = parseFloat(targetX) + parseFloat(b) + this.arrowDefaultSize / 2;
	} else {
		var b = Geometry.getAdjacentSideOfRectangleRight(angle, radius);
		targetX = parseFloat(targetX) - parseFloat(b);
		arrowX = parseFloat(targetX) - parseFloat(b) - this.arrowDefaultSize / 2;
	}

	/** Suponiendo el node source que este a la arriba **/
	if ((targetY - sourceY) > 0) {
		var a = Geometry.getOppositeSideOfRectangleRight(angle, radius);
		targetY = parseFloat(targetY) - parseFloat(a);
		arrowY = parseFloat(targetY) - parseFloat(a) - this.arrowDefaultSize / 2;
	} else {
		var a = Geometry.getOppositeSideOfRectangleRight(angle, radius);
		targetY = parseFloat(targetY) + parseFloat(a);
		arrowY = parseFloat(targetY) + parseFloat(a) - this.arrowDefaultSize / 2;

	}

	return {
		"x" : arrowX,
		"y" : arrowY,
		"angle" : angle
	};
};

GraphCanvas.prototype.calculateCoordenatesBezier = function(nodeSize, x1, y1) {
	var x11 = x1 - (nodeSize / 2);
	var y11 = y1 - (nodeSize / 2);

	var x12 = parseFloat(x1) + parseFloat(nodeSize / 2);
	var y12 = y1 - (nodeSize / 2);

	var curvePointX = (x12 - x11) / 2 + x11;
	var curvePointY = y1 - (nodeSize * 2);
	var d = "M" + x11 + "," + y11 + " T" + curvePointX + "," + curvePointY + " " + x12 + "," + y12;
	return d;

};

GraphCanvas.prototype.renderEdges = function() {
	for ( var edge in this.getDataset().getEdges()) {
		this.renderEdge(this.getDataset().getEdgeById(edge).getId());

	}
};

GraphCanvas.prototype.getLastSelectedNode = function() {
	var node = null;
	if (this.getSelectedVertices().length > 0) {
		var nodeId = this.getSelectedVertices()[this.getSelectedVertices().length - 1];
		node = this.getDataset().getVertexById(nodeId);
	}
	return node;
};
/*
 GraphCanvas.prototype.getNodeByNameAndIndex = function(node, index){
 var nodeId = this.getDataset().verticesIndex[node][index];
 var nodeItem = this.getDataset().getVertexById(nodeId);
 return nodeItem;
 };
 */

GraphCanvas.prototype.setDataset = function(dataset) {
	this.dataset = dataset;
};

GraphCanvas.prototype.setFormatter = function(formatter) {
	this.formatter = formatter;
};

GraphCanvas.prototype.setLayout = function(layout) {
	this.layout = layout;
};

/** API **/
GraphCanvas.prototype.getDataset = function() {
	return this.dataset;
};

GraphCanvas.prototype.getFormatter = function() {
	return this.formatter;
};

GraphCanvas.prototype.getLayout = function() {
	return this.layout;
};

/** API DATASET **/
GraphCanvas.prototype.addVertex = function(name, args) {
	this.getDataset().addNode(name, args);
};

GraphCanvas.prototype.removeVertex = function(vertexId) {
	this.getDataset().getVertexById(vertexId).remove();
};

GraphCanvas.prototype.addEdge = function(edgeName, nodeSourceId, nodeTargetId, args) {
	this.getDataset().addEdge(edgeName, nodeSourceId, nodeTargetId, args);
};
/*
 GraphCanvas.prototype.removeEdge = function(edgeId){
 this.getDataset().getEdgeById(edgeId).remove();
 };
 */

/** API FORMATTER **/
GraphCanvas.prototype.getWidth = function() {
	return this.getFormatter().getWidth();
};

GraphCanvas.prototype.getHeight = function() {
	return this.getFormatter().getHeight();
};

GraphCanvas.prototype.getBackgroundImage = function() {
	return this.getFormatter().getBackgroundImage();
};

//GraphCanvas.prototype.setBackgroundImage = function(value){
//	this.getFormatter().setBackgroundImage(value); 
//};

GraphCanvas.prototype.getBackgroundColor = function() {
	return this.getFormatter().getBackgroundColor();
};

GraphCanvas.prototype.setBackgroundColor = function() {
	this.getFormatter().setBackgroundColor(value);
};

//GraphCanvas.prototype.setEdgeFill = function(edgeId, value){
//	this.getFormatter().getEdgeById(edgeId).getDefault().setFill(value);
//};
//
//GraphCanvas.prototype.getEdgeFill = function(edgeId){
//	return this.getFormatter().getEdgeById(edgeId).getDefault().getFill();
//};

/** VERTICES FORMATTER **/
GraphCanvas.prototype.setVertexSize = function(vertexId, value) {
	this.getFormatter().getVertexById(vertexId).getDefault().setSize(value);
};

GraphCanvas.prototype.getVertexSize = function(vertexId) {
	return this.getFormatter().getVertexById(vertexId).getDefault().getSize();
};

GraphCanvas.prototype.setVertexStroke = function(vertexId, value) {
	this.getFormatter().getVertexById(vertexId).getDefault().setStroke(value);
};

GraphCanvas.prototype.getVertexStroke = function(vertexId) {
	return this.getFormatter().getVertexById(vertexId).getDefault().getStroke();
};

GraphCanvas.prototype.setVertexStrokeOpacity = function(vertexId, value) {
	this.getFormatter().getVertexById(vertexId).getDefault().setStrokeOpacity(value);
};

GraphCanvas.prototype.getVertexStrokeOpacity = function(vertexId) {
	return this.getFormatter().getVertexById(vertexId).getDefault().getStrokeOpacity();
};

GraphCanvas.prototype.setVertexOpacity = function(vertexId, value) {
	this.getFormatter().getVertexById(vertexId).getDefault().setOpacity(value);
};

GraphCanvas.prototype.getVertexOpacity = function(vertexId) {
	return this.getFormatter().getVertexById(vertexId).getDefault().getOpacity();
};

GraphCanvas.prototype.setVertexFill = function(vertexId, color) {
	this.getFormatter().getVertexById(vertexId).getDefault().setFill(color);
};

GraphCanvas.prototype.getVertexFill = function(vertexId) {
	return this.getFormatter().getVertexById(vertexId).getDefault().getFill();
};

/** EDGES FORMATTER **/
GraphCanvas.prototype.setEdgeSize = function(edgeId, value) {
	this.getFormatter().getEdgeById(edgeId).getDefault().setSize(value);
};

GraphCanvas.prototype.getEdgeSize = function(edgeId) {
	return this.getFormatter().getEdgeById(edgeId).getDefault().getSize();
};

GraphCanvas.prototype.setEdgeStroke = function(edgeId, value) {
	this.getFormatter().getEdgeById(edgeId).getDefault().setStroke(value);
};

GraphCanvas.prototype.getEdgeStroke = function(edgeId) {
	return this.getFormatter().getEdgeById(edgeId).getDefault().getStroke();
};

GraphCanvas.prototype.setEdgeStrokeOpacity = function(edgeId, value) {
	this.getFormatter().getEdgeById(edgeId).getDefault().setStrokeOpacity(value);
};

GraphCanvas.prototype.getEdgeStrokeOpacity = function(edgeId) {
	return this.getFormatter().getEdgeById(edgeId).getDefault().getStrokeOpacity();
};

GraphCanvas.prototype.setEdgeFill = function(edgeId, color) {
	this.getFormatter().getEdgeById(edgeId).getDefault().setFill(color);
};

GraphCanvas.prototype.getEdgeFill = function(edgeId) {
	return this.getFormatter().getEdgeById(edgeId).getDefault().getFill();
};

/** API LAYOUT **/
GraphCanvas.prototype.setCoordinates = function(vertexId, x, y) {
	return this.getLayout().getEdgeById(vertexId).setCoordinates(x, y);
};

function GraphDataset(){
	DataSet.prototype.constructor.call(this);
	this.edges = new Object();
	this.vertices = new Object();
	this.verticesIndex = new Object();
	
	//Events
	this.newVertex = new Event(this);
	this.vertexNameChanged = new Event(this);
	this.vertexDeleted = new Event(this);
	
	this.newEdge = new Event(this);
	this.edgeNameChanged = new Event(this);
	this.edgeDeleted = new Event(this);
	
	this.json = new Object();
	this.json.vertices = new Array();
	this.json.edges  = new Array();
	this.json.relations = new Array();
};

GraphDataset.prototype.loadFromJSON = DataSet.prototype.loadFromJSON;
GraphDataset.prototype.toJSON  = 	    DataSet.prototype.toJSON;
GraphDataset.prototype.validate  = 	DataSet.prototype.validate;

/** Devuelve el numero de edges incidentes sobre el nodo con mas edges **/
GraphDataset.prototype.getMaxClass = function(){
	var maxClassNode = 0;
	for ( var node in this.vertices) {
		if (this.vertices[node].getEdgesCount() > maxClassNode){
			maxClassNode = this.vertices[node].getEdgesCount();
		}
	}
	return maxClassNode;
};

/** Devuelve el numero de edges incidentes sobre el nodo con mas edges **/
GraphDataset.prototype.getMinClass = function(){
	var minClassNode = Math.min();
	for ( var node in this.vertices) {
		if (this.vertices[node].getEdgesCount() < minClassNode){
			minClassNode = this.vertices[node].getEdgesCount();
		}
	}
	return minClassNode;
};

GraphDataset.prototype.getVertexByName = function(nodeName){
		var results = new Array();
		
		for (var vertexId in this.verticesIndex[nodeName]){
			var vertexByid = this.getVertexById(this.verticesIndex[nodeName][vertexId]);
			results.push(vertexByid);
			//* añadido nuevo porque fallaba el anterior codigo
			return vertexByid
		}
	
		if (results <= 1){
			return this.getVertexById(this.verticesIndex[nodeName]);
		}
		else{
			return results;
		}
};

GraphDataset.prototype.getVertexById = function(id){
	return this.vertices[id];
};

GraphDataset.prototype.toSIF = function(){
	var sifDataAdapter = new SifFileDataAdapter();
	return sifDataAdapter.toSIF(this);
};

GraphDataset.prototype.toSIFID = function(){
	var sifDataAdapter = new SifFileDataAdapter();
	return sifDataAdapter.toSIFID(this);
};

GraphDataset.prototype.toDOT = function(){
	var dotFileDataAdapter = new DotFileDataAdapter();
	return dotFileDataAdapter.toDOT(this);
};

GraphDataset.prototype.toDOTID = function(){
	var dotFileDataAdapter = new DotFileDataAdapter();
	return dotFileDataAdapter.toDOTID(this);
};

GraphDataset.prototype._addNode = function(nodeName, args){
	return new Vertex(this._getVerticesCount()-1, nodeName, args);
};

GraphDataset.prototype.addNode = function(nodeName, args){
	this.json.vertices.push(nodeName);
	this._addVerticesIndex(nodeName, this._getVerticesCount() - 1);
	var vertex = this._addNode(nodeName, args);
	this.vertices[this._getVerticesCount()-1] = vertex;
	this._setNodeEvents(vertex);
	this.newVertex.notify(vertex);
};

GraphDataset.prototype._addVerticesIndex = function(nodeName, id){
	if (this.verticesIndex[nodeName] == null){
		this.verticesIndex[nodeName] = new Array();
	}
	this.verticesIndex[nodeName].push(id);
};

GraphDataset.prototype.addEdge = function(edgeName, nodeSourceId, nodeTargetId, args){
	this.json.edges.push(edgeName);
	var nodeSource = this.getVertexById(nodeSourceId);
	var nodeTarget = this.getVertexById(nodeTargetId);
	var index = this.getEdgesCount() - 1;
	this.edges[index] =  new Edge(index, edgeName, nodeSource, nodeTarget, args);
	this.json.relations.push({"index": index, "sourceIndex": nodeSourceId, "targetIndex": nodeTargetId, "args": args });
	
	nodeSource.addEdge(this.edges[index]);
	nodeTarget.addEdge(this.edges[index]);
	this._setEdgeEvents(this.edges[index]);
	this.newEdge.notify(this.edges[index]);
};

GraphDataset.prototype.getVertices = function(){
	return this.vertices;
};

GraphDataset.prototype.getEdges = function(){
	return this.edges;
};

GraphDataset.prototype.getEdgeById = function(edgeId){
	return this.edges[edgeId];
};

GraphDataset.prototype._getVerticesCount = function(){
	return this.json.vertices.length;
};


GraphDataset.prototype.getVerticesCount = function(){
	var count = 0;
	for ( var vertex in this.getVertices()) {
		count ++;
	}
	return count;
};


GraphDataset.prototype.getEdgesCount = function(){
	return this.json.edges.length;
};

GraphDataset.prototype.init = function(){
	this.edges = new Object();
	this.vertices = new Object();
};

GraphDataset.prototype._setNodeEvents = function(node){
	var _this = this;
	//NODE EVENTS
	node.deleted.attach(function (sender, node){
		_this._removeNode(node);
	});
	
	node.nameChanged.attach(function (sender, args){
		var item = args.item;
		var newName = item.name;
		var indexes = _this.verticesIndex[args.previousName];
		for(var i = 0; i < indexes.length; i++){
			if(indexes[i] == item.id)
				indexes.splice(i,1);
		}
		if(indexes.length == 0){
			delete _this.verticesIndex[args.previousName];
		}
		_this._addVerticesIndex(newName, item.id);
		_this.json.vertices[item.id] = newName;
		_this.vertexNameChanged.notify(args);
	});
};

GraphDataset.prototype._setEdgeEvents = function(edge){
	var _this = this;
	//EDGE EVENTS
	edge.nameChanged.attach(function (sender, edge){
		_this.edgeNameChanged.notify(edge);
		
	});
	
	edge.deleted.attach(function (sender, edge){
		_this._removeEdge(edge);
	});
};

GraphDataset.prototype._connectVerticesByName = function(nodeNameSource, nodeNameTarget){
	var source = this.getVertexByName(nodeNameSource);
	var target = this.getVertexByName(nodeNameTarget);
	
	if ((source != null)&&(target!=null)){
		this.addEdge(source.getName() +"_" + target.getName(), source.getId(), target.getId(), {});
	}
	else{
		if (source == null){
			console.log("No encontrado: " + nodeNameSource)
		}
		if (target == null){
			console.log("No encontrado: " + nodeNameTarget)
		}
	}
};

GraphDataset.prototype.loadFromJSON = function(json){
	var json = json;
	this.init();
	this.json = new Object();
	this.json.vertices = new Array();
	this.json.edges = new Array();
	this.json.relations = new Array();

	for ( var i = 0; i < json.nodes.length; i++) {
		if (json.nodes[i] != null){
			var name = json.nodes[i];
			this.addNode(name);
		}
		else{
			this.json.vertices.push(null);
		}
	}
	
	for ( var i = 0; i < json.edges.length; i++) {
		if (json.edges[i] != null){
			if (json.relations[i] != null){
				var name = json.edges[i];
				this.addEdge(name, json.relations[i].sourceIndex, json.relations[i].targetIndex, json.relations[i].args);
			}
		}
		else{
				this.json.edges.push(null);
				this.json.relations.push(null);
		}
	}
};

GraphDataset.prototype.prettyPrint = function(){
	for ( var node in this.vertices) {
		console.log(this.vertices[node].getName() ); 
		for ( var j = 0; j <  this.vertices[node].getEdgesIn().length; j++) {
 			console.log("          --> " + this.vertices[node].getEdgesIn()[j].getNodeTarget().getName() ); 
		}
	}
};

GraphDataset.prototype._removeEdge = function(edge){
	this.json.edges[edge.getId()] = null;
	this.json.relations[edge.getId()] = null;
	
	delete this.edges[edge.getId()];
	this.edgeDeleted.notify(edge);
	

};

GraphDataset.prototype._removeNode = function(node){
	this.json.vertices[node.getId()] = null;
	delete this.vertices[node.getId()];
	this.vertexDeleted.notify(node);
};

GraphDataset.prototype.toJSON = function(){
	var json = new Object();
	var nodes = new Array();
	json.nodes = this.json.vertices; //nodes;
	json.edges = this.json.edges; //edges;
	json.relations = this.json.relations;
	return json;
};

GraphDataset.prototype.clone = function(){
	var dsDataset = new GraphDataset();
	dsDataset.loadFromJSON(this.toJSON());
	return dsDataset;
};
//GraphDataset.prototype.test = function(){
//	this.loadFromJSON(this.toJSON());
//};

function labels(){
	var names = new Array();
	
	var dataset = interactomeViewer.graphEditorWidget.dataset;
	var layout = interactomeViewer.graphEditorWidget.layout;
	
	for ( var vertexId in interactomeViewer.graphEditorWidget.dataset.getVertices()) {
		names.push(interactomeViewer.graphEditorWidget.dataset.getVertexById(vertexId).getName());
	}
	
	var sorted = (names.sort());
	console.log(sorted)
	var distance =  0.01;
	var altura = 0.6;
	for ( var i = 0; i < names.length; i++) {
		var id =dataset.getVertexByName(names[i]).getId();
		
		layout.getNodeById(id).setCoordenates(distance, altura);
		
		
		distance = parseFloat(distance) + parseFloat(0.03);
		
		altura = parseFloat(altura) + parseFloat(0.02);
	
		if (parseFloat(altura) == 0.9800000000000003){
		
			altura = 0.6;
			distance = distance - 0.51;
		}
		
	}
	

};

function GraphItem(id, name, args){
	this.id = id;
	this.name = name;
	this.type = "NONE";
	
	this.args = new Object();
	
	
	if (args!=null){
		this.args = args;
		if (args.type !=null){
			this.type = args.type;
		}
	}
	
	//Events
	this.nameChanged = new Event(this);
	this.deleted = new Event(this);
}

GraphItem.prototype.getName = function(){
	return this.name;
};

GraphItem.prototype.getId = function(){
	return this.id;
};

GraphItem.prototype.setName = function(name){
	var oldName = this.getName();
	this.name = name;
	this.nameChanged.notify({"item": this, "previousName" : oldName});
};






function ItemGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	this.id = id;
	this.args = new Object();
	
	this.defaultFormat = new ItemFormat(defaultFormat);
	
	if(selectedFormat != null){
		this.selected = new ItemFormat(selectedFormat);
	}
	else{
		this.selected = new ItemFormat(defaultFormat);
	}
	
	if(overFormat != null){
		this.over = new ItemFormat(overFormat);
	}
	else{
		this.over = new ItemFormat(defaultFormat);
	}
	
	if(draggingFormat != null){
		this.dragging = new ItemFormat(draggingFormat);
	}
	else{
		this.dragging = new ItemFormat(defaultFormat);
	}
	
	//Events
	this.stateChanged  = new Event(this);

	
	//Attaching events
	var _this = this;
	this._setEvents();
};

ItemGraphFormatter.prototype.getType = function(){
	return this.args.type;
};


ItemGraphFormatter.prototype.toJSON = function(){
	var json = this.args;
	json.defaultFormat = this.getDefault().toJSON();
	json.over = this.getOver().toJSON();
	json.selected = this.getSelected().toJSON();
	json.dragging = this.getDragging().toJSON();
	json.id = this.id;
	return json;
};

ItemGraphFormatter.prototype.loadFromJSON = function(json){
	this.args = json;
	this.defaultFormat = new ItemFormat(json.defaultFormat);
	this.over = new ItemFormat(json.over);
	this.selected = new ItemFormat(json.selected);
	this.dragging = new ItemFormat(json.dragging);
	this._setEvents();
};

ItemGraphFormatter.prototype._setEvents = function(){
	//Attaching events
	var _this = this;
	
	this.defaultFormat.changed.attach(function (sender, item){
		_this.over.setSize(_this.defaultFormat.getSize());
		_this.selected.setSize(_this.defaultFormat.getSize());
		_this.dragging.setSize(_this.defaultFormat.getSize());
		_this.stateChanged.notify(_this);
	});
	
	this.selected.changed.attach(function (sender, item){
		_this.stateChanged.notify(_this);
	});
	
	this.over.changed.attach(function (sender, item){
		_this.stateChanged.notify(_this);
	});
	
	this.dragging.changed.attach(function (sender, item){
		_this.stateChanged.notify(_this);
	});
};

/** Getters **/
ItemGraphFormatter.prototype.getId = function(){return this.id;};
ItemGraphFormatter.prototype.getDefault = function(){return this.defaultFormat;};
ItemGraphFormatter.prototype.getSelected = function(){return this.selected;};
ItemGraphFormatter.prototype.getOver = function(){return this.over;};
ItemGraphFormatter.prototype.getDragging = function(){return this.dragging;};

function ItemFormat(args){
	this.defaultFormat = new Object();
	this.args = new Object();
	this.args.title = new Object();
	//Defult properties
	this.args.visible = true;
	this.args.hidden = false;
	this.args.stroke = "#000000";
	this.args.strokeOpacity = 0.8;
	this.args["stroke-width"] = 1;
	this.args.fill = "#000000";
	this.args["fill-opacity"] = 1;
	this.args.size = 1;
	this.args.opacity = 1;
	this.args.fontSize = "8";
	this.args.fontColor = "#000000";
	this.args.display = "block";
     this.args.style = 'display:block';
	/** For directed edge with arrow **/ 
	//this.args.arrowSize = 1;
	
	
	if (args != null){
		if (args.visible != null){
			this.args.visible = args.visible;
		}
		if (args.opacity != null){
			this.args.opacity = args.opacity;
		}
		if (args.size != null){
			this.args.size = args.size;
		}
		if (args.hidden != null){
			this.args.hidden = args.hidden;
		}
		if (args.stroke != null){
			this.args.stroke = this._fixColor(args.stroke);
		}
		if (args.strokeOpacity != null){
			this.args.strokeOpacity = args.strokeOpacity;
		}
		if (args["stroke-width"]!=null){
			this.args["stroke-width"] = args["stroke-width"];
		}
		if (args["fill-opacity"]!=null){
			this.args["fill-opacity"] = args["fill-opacity"];
		}
		if (args.shape!=null){
			this.args.shape = args.shape;
		}
		if (args.fill!=null){
				this.args.fill = this._fixColor(args.fill);
		}
		
		
		if (args.title!=null){
			if (args.title.fontSize!=null){
				this.args.title.fontSize = args.title.fontSize;
			}
			if (args.title.fill!=null){
				this.args.title.fill = this._fixColor(args.title.fill);
			}
		}
		
		/** For directed edge with arrow **/
		/*if (args.arrowSize!=null){
			this.args.arrowSize = args.arrowSize;
		}*/
	
	}
	
	this.changed = new Event();
};

ItemFormat.prototype._fixColor = function(color){
	var fixed = color;
	if (color.indexOf("green") != -1){
		fixed = '#04B431';
	}
	
	if (color.indexOf("blue") != -1){
		fixed = '#045FB4';
	}
	
	if (color.indexOf("red") != -1){
		fixed = '#DF0101';
	}
	
	if (color.indexOf("black") != -1){
		fixed = '#000000';
	}
	
	if (color.indexOf("white") != -1){
		fixed = '#FFFFFF';
	}
	
	if (color.indexOf("#") == -1){
		fixed = "#" + color;
	}
	return fixed;
};

ItemFormat.prototype.toJSON = function(){
	if(this.args.strokeOpacity != null){
		this.args["stroke-opacity"] = this.args.strokeOpacity;
		delete this.args.strokeOpacity;
	}
	
//	if(this.args.strokeWidth != null){
//		this.args["stroke-width"] = this.args.strokeWidth;
//		delete this.args["stroke-width"];
//	}

	if(this.args.title.fontColor != null){
		this.args.title["font-color"] = this.args.title.fontColor;
	}
	else{
		this.args.title["font-color"] = this.args.fontColor;//;this.args.title.fontColor;
	}
	
	if(this.args.title.fontSize != null){
		this.args.title["font-size"] = this.args.title.fontSize;//;this.args.title.fontColor;
	}
	else{ 
		this.args.title["font-size"] = this.args.fontSize;//;this.args.title.fontColor;
	}
	//return this.args;
	return this.args;
};

ItemFormat.prototype.getAttribute = function(name){return this.args[name];};

//Getters and Setters
ItemFormat.prototype.setVisible = function(visible){
	if (this.args.visible != visible){
		this.args.visible = visible;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getVisible = function(){return this.args.visible;};

ItemFormat.prototype.setHidden = function(hidden){
	if (this.args.hidden != hidden){
		this.args.hidden = hidden;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getHidden = function(){return this.args.hidden;};


ItemFormat.prototype.setStroke = function(stroke){
	if (this.args.stroke != stroke){
		this.args.stroke = stroke;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getStroke = function(){return this.args.stroke;};

ItemFormat.prototype.setStrokeOpacity = function(strokeOpacity){
	if (this.args.strokeOpacity != strokeOpacity){
		this.args.strokeOpacity = strokeOpacity;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getStrokeOpacity = function(){return this.args["stroke-opacity"];};

ItemFormat.prototype.setStrokeWidth = function(strokeWidth){
	if (this.args["stroke-width"] != strokeWidth){
		this.args["stroke-width"] = strokeWidth;
		this.changed.notify(this);
	}
};


ItemFormat.prototype.getFillOpacity = function(){return this.args["fill-opacity"];};

ItemFormat.prototype.setfillOpacity = function(strokeWidth){
	if (this.args["fill-opacity"] != strokeWidth){
		this.args["fill-opacity"] = strokeWidth;
		this.changed.notify(this);
	}
};


ItemFormat.prototype.getStrokeWidth = function(){
	return this.args["stroke-width"];
};

ItemFormat.prototype.setFill = function(fill){
	if (this.args.fill != fill){
		this.args.fill = fill;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getFill = function(){return this.args.fill;};

ItemFormat.prototype.setSize = function(size){
	if (this.args.size != size){
		this.args.size = size;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getSize = function(){return this.args.size;};

ItemFormat.prototype.setOpacity = function(opacity){
	if (this.args.opacity != opacity){
		this.args.opacity = opacity;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getOpacity = function(){return this.args.opacity;};

ItemFormat.prototype.getArrowSize = function(){return this.args.arrowSize;};

ItemFormat.prototype.setArrowSize = function(arrowSize){
	if (this.args.arrowSize != arrowSize){
		this.args.arrowSize = arrowSize;
		this.changed.notify(this);
	}
};

ItemFormat.prototype.getFontSize = function(){return this.args.title.fontSize;};

ItemFormat.prototype.setFontSize = function(fontSize){

	if (this.args.title.fontSize != fontSize){
		this.args.title.fontSize = fontSize;
		this.changed.notify(this);
	}
};





function LayoutDataset(){
	this.dataset = null;
	this.vertices = new Object();
	this.changed = new Event(this);
	
	
	this.args = new Object();
	
	//RANDOM, CIRCLE
	this.args.type = "CIRCLE";
};

LayoutDataset.prototype.loadFromJSON = function(dataset, json){
	var _this = this;
	this.vertices = new Object();
	this.dataset = dataset; //new GraphDataset();
	for ( var vertex in json) {
		this.vertices[vertex] = new NodeLayout(vertex, json[vertex].x, json[vertex].y);
		this.vertices[vertex].changed.attach(function (sender, item){
			_this.changed.notify(item);
		});
	}
	this._attachDatasetEvents();
};


LayoutDataset.prototype.toJSON = function(){
	var serialize = new Object();
	for ( var vertex in this.vertices) {
		serialize[vertex] = new Object();
		serialize[vertex].x = this.vertices[vertex].x;  
		serialize[vertex].y = this.vertices[vertex].y;  
	}
	serialize.dataset = new Object();
	serialize.dataset =this.dataset.toJSON();
	return serialize;
};

LayoutDataset.prototype.dataBind = function(graphDataset){
	this.dataset = graphDataset;
	this._attachDatasetEvents();
	this._calculateLayout();
};

LayoutDataset.prototype._removeVertex = function(vertexId){
	delete this.vertices[vertexId];
};

LayoutDataset.prototype._attachDatasetEvents = function(){
	var _this = this;
	
	this.dataset.vertexDeleted.attach(function (sender, item){
		_this._removeVertex(item.getId());
	});
	
	this.dataset.newVertex.attach(function (sender, item){
		_this.vertices[item.getId()] = new NodeLayout(item.getId(), 0.5, 0.5);
		_this.vertices[item.getId()].changed.attach(function (sender, item){
			_this.changed.notify(item);
		});
	});
};

LayoutDataset.prototype.getType = function(){
	return this.args.type;
};

LayoutDataset.prototype._calculateLayoutVertices = function(type, count){
	
	if (type == "CIRCLE"){
			var radius = 0.4;
			var centerX = 0.5;
			var centerY = 0.5;
			var verticesCoordinates = new Array();
			for(var i = 0; i < count; i++){
				x = centerX + radius * Math.sin(i * 2 * Math.PI/count);
				y = centerY + radius * Math.cos(i * 2 * Math.PI/count);
				verticesCoordinates.push({'x':x,'y':y});
			}
			return verticesCoordinates;
	}
};


LayoutDataset.prototype._calculateLayout = function(){
	var _this = this;
	if (this.getType() == "RANDOM"){
		for ( var vertex in this.dataset.getVertices()) {
			if (this.vertices[vertex] == null){
				this.vertices[vertex] = new NodeLayout(vertex, 0, 0);
			}
			this.vertices[vertex].setCoordinates(Math.random(), Math.random());
			this.vertices[vertex].changed.attach(function (sender, item){
				_this.changed.notify(item);
			});
		}
	}
	
	if ( this.getType() == "CIRCLE"){
		
		var count = this.dataset._getVerticesCount();
		var verticesCoordinates = this._calculateLayoutVertices(this.getType(), count);
		
		var aux = 0;
		for ( var vertex in this.dataset.getVertices()) {
			if (this.vertices[vertex] == null){
				this.vertices[vertex] = new NodeLayout(vertex, 0, 0);
			}
			this.vertices[vertex].setCoordinates(verticesCoordinates[aux].x, verticesCoordinates[aux].y);//{"x":, "y":};
			aux++;
			this.vertices[vertex].changed.attach(function (sender, item){
				_this.changed.notify(item);
			});
		}
	}
	
	
	if (this.getType() == "SQUARE"){
		
		var count = this.dataset._getVerticesCount();
		var xMin = 0.1;
		var xMax = 0.9;
		var yMin = 0.1;
		var yMax = 0.9;
		
		var rows = Math.sqrt(count);
		var step = (xMax - xMin) / rows;
		
		var verticesCoordinates = new Array();
		for(var i = 0; i < rows; i ++){
			for ( var j = 0; j < rows; j++) {
				x = i * step + xMin;
				y = j * step + yMin;
				verticesCoordinates.push({'x':x,'y':y});
			}
		}
		
		var aux = 0;
		for ( var vertex in this.dataset.getVertices()) {
			if (this.vertices[vertex] == null){
				this.vertices[vertex] = new NodeLayout(vertex, 0, 0);
			}
			this.vertices[vertex].setCoordinates(verticesCoordinates[aux].x, verticesCoordinates[aux].y);//{"x":, "y":};
			aux++;
			this.vertices[vertex].changed.attach(function (sender, item){
				_this.changed.notify(item);
			});
		}
	}
	
};

LayoutDataset.prototype.getNodeById = function(id){
	return this.vertices[id];
};

LayoutDataset.prototype.getVerticesByArea = function(x1, y1, x2, y2){
	var vertices = new Array();
	for ( var vertex in this.dataset.getVertices()) {
		if ((this.vertices[vertex].x >= x1)&&(this.vertices[vertex].x <= x2)){
			if ((this.vertices[vertex].y >= y1)&&(this.vertices[vertex].y <= y2)){
				vertices.push(this.vertices[vertex]);
			}
		}
	}
	return vertices;
};




LayoutDataset.prototype.getLayout = function(type){
	
	if (type == "CIRCLE"){
		this.args.type = "CIRCLE";
		this._calculateLayout();
		return;
	}
	
	if (type == "SQUARE"){
		this.args.type = "SQUARE";
		this._calculateLayout();
		return;
	}
	
	if (type == "RANDOM"){
		this.args.type = "RANDOM";
		this._calculateLayout();
		return;
	}
	
	
	var dotText = this.dataset.toDOTID();
	var url = "http://bioinfo.cipf.es/utils/ws/rest/network/layout/"+type+".coords";
	var _this = this;
	
	 $.ajax({
         async: true,
         type: "POST",
         url: url,
         dataType: "text",
         data: {
                 dot :dotText
                 },  
         cache: false,
         success: function(data){ 
                         var response = JSON.parse(data);
                         for ( var vertexId in response) {
                                 _this.vertices[vertexId].setCoordinates(response[vertexId].x, response[vertexId].y);
                         }   
                 }   
	 });
	 
//	$.ajax({
//		async: true,
//		type: "POST",
//		url: url,
//		dataType: "script",
//		data: {
//			dot :dotText
//			},
//		cache: false,
//		success: function(data){ 
//				var response = JSON.parse(data);
//				for ( var vertexId in response) {
//					_this.vertices[vertexId].setCoordinates(response[vertexId].x, response[vertexId].y);
//				}
//			}
//	});
	
};

function NodeLayout(id, x, y, args){
	this.id = id;
	this.x = x;
	this.y = y;
	this.changed = new Event(this);
};

NodeLayout.prototype.getId = function(id){
	return this.id;
};

NodeLayout.prototype.setCoordinates = function(x, y){
	this.x = x;
	this.y = y;
	this.changed.notify(this);
};



function NetworkDataSetFormatter(vertexFormatProperties, defaultEdgeProperties, args){
	DataSet.prototype.constructor.call(this);
	
	this.args = new Object();
	
	this.vertices = new Object();
	this.edges = new Object();
	this.dataset = null;
	this.maxClass = 0;
	this.minClass = 0;
	
	/** Coordenates with default Setting */
	this.args.width = 1100;
	this.args.height = 500;
	
	/** Optional parameters */
	this.args.backgroundColor = "#FFFFFF";
	this.args.backgroundImage = null;
	this.args.backgroundImageHeight = null;
	this.args.backgroundImageWidth = null;
	this.args.backgroundImageX = null;
	this.args.backgroundImageY = null;
	
	
	this.args.balanceNodes = false;
	this.args.nodesMaxSize = 3;
	this.args.nodesMinSize = 0.5;
		
	
	/** Zoom **/
	this.args.zoomScale = 1;
	this.args.zoomScaleStepFactor = 0.4;
	
	if (args != null){
		if (args.backgroundImage != null){
			this.args.backgroundImage = args.backgroundImage;		
		}
		
		if (args.width != null){
			this.args.width = args.width;		
		}
		
		if (args.height != null){
			this.args.height = args.height;	
			this.args.svgHeight = args.height;		
		}
		
		if (args.svgHeight != null){
			this.args.svgHeight = args.svgHeight;		
		}
		
		if (args.backgroundColor != null){
			this.args.backgroundColor = args.backgroundColor;		
		}
		
		if(args.balanceNodes != null){
			this.args.balanceNodes = args.balanceNodes;
		}

		if(args.nodesMaxSize != null){
			this.args.nodesMaxSize = args.nodesMaxSize;
		}
		if(args.nodesMinSize != null){
			this.args.nodesMinSize = args.nodesMinSize;
		}
	}
	
	this.args.defaultEdgeProperties =  {"fill":"#000000", "radius":"1", "stroke":"#000000", "size":1, "title":{"fontSize":10, "fontColor":"#000000"}};
	this.args.vertexFormatProperties = { "fill":"#000000", "stroke":"#000000", "stroke-opacity":"#000000"};
	
	if (vertexFormatProperties!= null){
		this.args.vertexFormatProperties = vertexFormatProperties;
	}
	if (defaultEdgeProperties!= null){
		this.args.defaultEdgeProperties = defaultEdgeProperties;
	}
	
	/** Events **/
	this.changed = new Event(this);
	this.edgeChanged = new Event(this);
	this.resized = new Event(this);
	this.backgroundImageChanged= new Event(this);
	this.backgroundColorChanged= new Event(this);
};

NetworkDataSetFormatter.prototype.loadFromJSON = function(dataset, json){
	this.args = new Object();
	this.vertices = new Object();
	this.args = json;
	this._setDataset(dataset);
	var _this = this;
	
	for ( var vertex in json.vertices) {
		this.addVertex(vertex, json.vertices[vertex]);
	}
	
	for ( var edgeId in json.edges) {
		this.addEdge(edgeId, json.edges[edgeId]);
	}
};


NetworkDataSetFormatter.prototype.toJSON = function(){
	
	
//	this.args.vertices = new Object();
//	this.args.edges = new Object();
//	
//	for ( var vertex in this.vertices) {
//		this.args.vertices[vertex] = this.getVertexById(vertex).toJSON();
//	}
//	for ( var edge in this.edges) {
//		this.args.edges[edge] = this.getEdgeById(edge).toJSON();
//	}
//	
//	return (this.args);
	

	var serialize = new Object();
	serialize = JSON.parse(JSON.stringify(this.args));
	serialize.vertices = new Object();
	serialize.edges = new Object();
	
	for ( var vertex in this.vertices) {
		serialize.vertices[vertex] = this.getVertexById(vertex).toJSON();
	}
	for ( var edge in this.edges) {
		serialize.edges[edge] = this.getEdgeById(edge).toJSON();
	}
	
	return (serialize);
};



NetworkDataSetFormatter.prototype._getNodeSize = function(nodeId){
	if (this.isVerticesBalanced()){
		var total =  this.maxClass - this.minClass;
		if (total == 0){ total = 1;}
		var nodeConnection = this.dataset.getVertexById(nodeId).getEdges().length;
		return ((nodeConnection*this.args.nodesMaxSize)/total)  + this.args.nodesMinSize;
	}
	return this.getVertexById(nodeId).getDefault().getSize();
};

NetworkDataSetFormatter.prototype._recalculateSize = function(){
	if (this.isVerticesBalanced()){
		this.maxClass = this.dataset.getMaxClass();
		this.minClass = this.dataset.getMinClass();
		for ( var vertexIdAll in this.vertices) {
				var size = this._getNodeSize(vertexIdAll);
				this.vertices[vertexIdAll].getDefault().setSize(size);
				this.vertices[vertexIdAll].getSelected().setSize(size);
				this.vertices[vertexIdAll].getOver().setSize(size);
		}
	}
};


NetworkDataSetFormatter.prototype.addVertex = function(vertexId, json){
	
	
	if (json == null){
		this.vertices[vertexId] = new CircleVertexGraphFormatter(vertexId, this.args.vertexFormatProperties.defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	else{
		
		/** Cargo los attributos desde el json **/
		if (json.type == null){
			this.vertices[vertexId] = new CircleVertexGraphFormatter(vertexId, this.args.vertexFormatProperties.defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
		}
		
		if ((json.type == "SquareVertexGraphFormatter")||(json.type == "SquareVertexNetworkFormatter")){
			this.vertices[vertexId] = new SquareVertexGraphFormatter(vertexId);
			this.vertices[vertexId].loadFromJSON(json);
		}
		
		if ((json.type == "CircleVertexGraphFormatter")||(json.type == "CircleVertexNetworkFormatter")){
			this.vertices[vertexId] = new CircleVertexGraphFormatter(vertexId);
			this.vertices[vertexId].loadFromJSON(json);
		}
		
		if ((json.type == "EllipseVertexGraphFormatter")||(json.type == "EllipseVertexNetworkFormatter")){
			this.vertices[vertexId] = new EllipseVertexGraphFormatter(vertexId);
			this.vertices[vertexId].loadFromJSON(json);
		}
		
		if ((json.type == "RectangleVertexGraphFormatter")||(json.type == "RectangleVertexNetworkFormatter")){
			this.vertices[vertexId] = new RectangleVertexGraphFormatter(vertexId);
			this.vertices[vertexId].loadFromJSON(json);
		}
		
		if ((json.type == "RoundedVertexGraphFormatter")||(json.type == "RoundedVertexNetworkFormatter")){
			this.vertices[vertexId] = new RoundedVertexGraphFormatter(vertexId);
			this.vertices[vertexId].loadFromJSON(json);
		}
		
	}
	
	
	var _this = this;
	this.vertices[vertexId].stateChanged.attach(function (sender, item){
		_this.changed.notify(item);
	});
	
	var size = this._getNodeSize(vertexId);
	this.vertices[vertexId].defaultFormat.args.size = size;
	this.vertices[vertexId].selected.args.size =  size;
	this.vertices[vertexId].over.args.size =  size;
	
};

NetworkDataSetFormatter.prototype.addEdge = function(edgeId, json){
	
	/** Es un edge nuevo que le doy los atributos por defecto **/
	if (json == null){
		if (this.dataset.getEdgeById(edgeId).getNodeSource().getId() == this.dataset.getEdgeById(edgeId).getNodeTarget().getId()){
			this.edges[edgeId] = new BezierEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
		}else{
			this.edges[edgeId] = new DirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
		}
	}
	else{
		/** Cargo los attributos desde el json **/
		if (json.type == null){
			this.edges[edgeId] = new LineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
		}
		
		if ((json.type == "LineEdgeGraphFormatter")||(json.type == "LineEdgeNetworkFormatter")){
			this.edges[edgeId] = new LineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		if ((json.type == "DirectedLineEdgeGraphFormatter")||(json.type == "DirectedLineEdgeNetworkFormatter")){
			this.edges[edgeId] = new DirectedLineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		
		if ((json.type == "BezierEdgeGraphFormatter")||(json.type == "BezierEdgeNetworkFormatter")){
			this.edges[edgeId] = new BezierEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		
		
		if ((json.type == "CutDirectedLineEdgeGraphFormatter")||(json.type == "CutDirectedLineEdgeNetworkFormatter")){
			this.edges[edgeId] = new CutDirectedLineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		
		if ((json.type == "DotDirectedLineEdgeGraphFormatter")||(json.type == "DotDirectedLineEdgeNetworkFormatter")){
			this.edges[edgeId] = new DotDirectedLineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		if ((json.type == "OdotDirectedLineEdgeGraphFormatter")||(json.type == "OdotDirectedLineEdgeNetworkFormatter")){
			this.edges[edgeId] = new OdotDirectedLineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
		
		if ((json.type == "OdirectedLineEdgeGraphFormatter")||(json.type == "OdirectedLineEdgeNetworkFormatter")){
			this.edges[edgeId] = new OdirectedLineEdgeGraphFormatter(edgeId);
			this.edges[edgeId].loadFromJSON(json);
		}
	}
	
	var _this = this;
	this.edges[edgeId].stateChanged.attach(function (sender, item){
		_this.edgeChanged.notify(item);
	});
	
	this._recalculateSize();
};

NetworkDataSetFormatter.prototype._setDataset = function(dataset){
	this.dataset = dataset;
	this.maxClass = dataset.getMaxClass();
	this.minClass = dataset.getMinClass();
	this._attachDatasetEvents();
};

NetworkDataSetFormatter.prototype.changeEdgeType = function(edgeId, type){
	if ((type == "LineEdgeGraphFormatter")||(type == "LineEdgeNetworkFormatter")){
		this.edges[edgeId] = new LineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
		
	}
	if ((type == "DirectedLineEdgeGraphFormatter")||(type == "DirectedLineEdgeNetworkFormatter")){
		this.edges[edgeId] = new DirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
	}
	
	if ((type == "CutDirectedLineEdgeGraphFormatter")||(type == "CutDirectedLineEdgeNetworkFormatter")){
		this.edges[edgeId] = new CutDirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
	}
	
	if ((type == "DotDirectedLineEdgeGraphFormatter")||(type == "DotDirectedLineEdgeNetworkFormatter")){
		this.edges[edgeId] = new DotDirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
	}
	
	if ((type == "OdotDirectedLineEdgeGraphFormatter")||(type == "OdotDirectedLineEdgeNetworkFormatter")){
		this.edges[edgeId] = new OdotDirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
	}
	
	if ((type == "OdirectedLineEdgeGraphFormatter")||(type == "OdirectedLineEdgeNetworkFormatter")){
		this.edges[edgeId] = new OdirectedLineEdgeGraphFormatter(edgeId, this.args.defaultEdgeProperties.defaultFormat, this.args.defaultEdgeProperties.selected, this.args.defaultEdgeProperties.over, this.args.defaultEdgeProperties.dragging);
	}
	
	
	
	var _this = this;
	this.edges[edgeId].stateChanged.attach(function (sender, item){
		_this.edgeChanged.notify(item);
	});
	_this.edgeChanged.notify(this.edges[edgeId]);
};
/*
classe = "SquareNetworkNodeFormatter";
}
if (value == "circle"){
	classe = "CircleNetworkNodeFormatter";
	**/
NetworkDataSetFormatter.prototype.changeNodeType = function(vertexId, type){
	var defaultFormat = JSON.parse(JSON.stringify(this.vertices[vertexId].getDefault()));
	var selectedFormat = JSON.parse(JSON.stringify(this.vertices[vertexId].getSelected()));
	var defaultFormat = JSON.parse(JSON.stringify(this.vertices[vertexId].getDefault()));
	var defaultFormat = JSON.parse(JSON.stringify(this.vertices[vertexId].getDefault()));
	
	if ((type == "SquareVertexGraphFormatter")||(type == "SquareVertexNetworkFormatter")){
		this.vertices[vertexId] = new SquareVertexGraphFormatter(vertexId,defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	
	if ((type == "CircleVertexGraphFormatter")||(type == "CircleVertexNetworkFormatter")){
		this.vertices[vertexId] = new CircleVertexGraphFormatter(vertexId, defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	
	if ((type == "EllipseVertexGraphFormatter")||(type == "EllipseVertexNetworkFormatter")){
		this.vertices[vertexId] = new EllipseVertexGraphFormatter(vertexId, defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	
	if ((type == "RectangleVertexGraphFormatter")||(type == "RectangleVertexNetworkFormatter")){
		this.vertices[vertexId] = new RectangleVertexGraphFormatter(vertexId, defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	
	if ((type == "RoundedVertexGraphFormatter")||(type == "RoundedVertexNetworkFormatter")){
		this.vertices[vertexId] = new RoundedVertexGraphFormatter(vertexId, defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	
	if ((type == "OctagonVertexGraphFormatter")||(type == "OctagonVertexNetworkhFormatter")){
		this.vertices[vertexId] = new OctagonVertexGraphFormatter(vertexId, defaultFormat, this.args.vertexFormatProperties.selected, this.args.vertexFormatProperties.over, this.args.vertexFormatProperties.dragging);
	}
	

	var _this = this;
	this.vertices[vertexId].stateChanged.attach(function (sender, item){
		_this.changed.notify(item);
	});
	_this.changed.notify(this.vertices[vertexId]);
};



NetworkDataSetFormatter.prototype.dataBind = function(networkDataSet){
	var _this = this;
	this._setDataset(networkDataSet);
		
	for ( var vertex in this.dataset.getVertices()) {
		this.addVertex(vertex);
	}
	
	for ( var edge in this.dataset.getEdges()) {
		this.addEdge(edge);
	}
};

NetworkDataSetFormatter.prototype._removeEdge = function(edgeId){
	delete this.edges[edgeId];
};

NetworkDataSetFormatter.prototype._removeVertex = function(vertexId){
	delete this.vertices[vertexId];
};

NetworkDataSetFormatter.prototype._attachDatasetEvents = function(id){
	var _this = this;
	this.dataset.vertexDeleted.attach(function (sender, item){
		_this._removeVertex(item.getId());
	});
	
	this.dataset.edgeDeleted.attach(function (sender, item){
		_this._removeEdge(item.getId());
	});
	
	this.dataset.newVertex.attach(function (sender, item){
		_this.addVertex(item.getId());
	});
	
	this.dataset.newEdge.attach(function (sender, item){
		_this.addEdge(item.getId());
	});
};


NetworkDataSetFormatter.prototype.getVertexById = function(id){
	return this.vertices[id];
};

NetworkDataSetFormatter.prototype.getEdgeById = function(id){
	return this.edges[id];
};

NetworkDataSetFormatter.prototype.makeLabelsBigger = function(){
for ( var vertexId in this.vertices) {
		var fontSize = this.vertices[vertexId].getDefault().getFontSize() + 2;
		this.vertices[vertexId].getDefault().setFontSize(fontSize);
	}
};

NetworkDataSetFormatter.prototype.makeLabelsSmaller = function(){
	for ( var vertexId in this.vertices) {
			var fontSize = this.vertices[vertexId].getDefault().getFontSize() - 2;
			this.vertices[vertexId].getDefault().setFontSize(fontSize);
		}
};


NetworkDataSetFormatter.prototype.resize = function(width, height){
	this.args.width = width;
	this.args.height = height;
	this.resized.notify();
};

/** ZOOM GETTERS **/
NetworkDataSetFormatter.prototype.getZoomScaleStepFactor = function(){return this.args.zoomScaleStepFactor;};
NetworkDataSetFormatter.prototype.setZoomScaleStepFactor = function(scaleFactor){this.args.zoomScaleStepFactor = scaleFactor;};
NetworkDataSetFormatter.prototype.getZoomScale = function(){return this.args.zoomScale;};
NetworkDataSetFormatter.prototype.setZoomScale = function(scale){this.args.zoomScale = scale;};

NetworkDataSetFormatter.prototype.getNodesMaxSize = function(){return this.args.nodesMaxSize;};
NetworkDataSetFormatter.prototype.getNodesMinSize = function(){return this.args.nodesMinSize;};

/** SIZE SETTERS AND GETTERS **/
NetworkDataSetFormatter.prototype.isVerticesBalanced = function(){return this.args.balanceNodes;};
NetworkDataSetFormatter.prototype.getWidth = function(){return this.args.width;};
NetworkDataSetFormatter.prototype.getHeight = function(){return this.args.height;};

/** OPTIONAL PARAMETERS GETTERS AND SETTERS **/
NetworkDataSetFormatter.prototype.getBackgroundImage = function(){return this.args.backgroundImage;};
NetworkDataSetFormatter.prototype.setBackgroundImage = function(value){this.args.backgroundImage = value; this.backgroundImageChanged.notify(this);};


NetworkDataSetFormatter.prototype.getBackgroundImageWidth = function(){return this.args.backgroundImageWidth;};
NetworkDataSetFormatter.prototype.setBackgroundImageWidth = function(value){this.args.backgroundImageWidth = value; this.backgroundImageChanged.notify(this);};

NetworkDataSetFormatter.prototype.getBackgroundImageHeight = function(){return this.args.backgroundImageHeight;};
NetworkDataSetFormatter.prototype.setBackgroundImageHeight = function(value){this.args.backgroundImageHeight = value; this.backgroundImageChanged.notify(this);};

NetworkDataSetFormatter.prototype.getBackgroundImageX = function(){return this.args.backgroundImageX;};
NetworkDataSetFormatter.prototype.setBackgroundImageX = function(value){this.args.backgroundImageX = value; this.backgroundImageChanged.notify(this);};

NetworkDataSetFormatter.prototype.getBackgroundImageY = function(){return this.args.backgroundImageX;};
NetworkDataSetFormatter.prototype.setBackgroundImageY = function(value){this.args.backgroundImageY = value; this.backgroundImageChanged.notify(this);};



NetworkDataSetFormatter.prototype.getBackgroundColor = function(){return this.args.backgroundColor;};
NetworkDataSetFormatter.prototype.setBackgroundColor = function(value){this.args.backgroundColor = value; this.backgroundColorChanged.notify(this);};

NetworkDataSetFormatter.prototype.getWidth = function(){return this.args.width;};
NetworkDataSetFormatter.prototype.setWidth = function(value){this.args.width = value;};

NetworkDataSetFormatter.prototype.getHeight = function(){return this.args.height;};
NetworkDataSetFormatter.prototype.setHeight = function(value){this.args.height = value;};



function NetworkWidget(args) {
	this.id = "NetworkViewer_" + Math.random().toString().replace(".", "_");

	this.label = true;
	if (args != null) {
		if (args.targetId != null) {
			this.targetId = args.targetId;
		}
		if (args.label != null) {
			this.label = args.label;
		}
	}

	this.onVertexOver = new Event(this);
	this.onVertexOut = new Event(this);
}

NetworkWidget.prototype.draw = function(dataset, formatter, layout) {

	this.graphCanvas = new GraphCanvas(this.id, document.getElementById(this.targetId), {
		"labeled" : this.label,
		"multipleSelectionEnabled" : false,
		"draggingCanvasEnabled" : false
	});
	this.graphCanvas.draw(dataset, formatter, layout);

	var _this = this;
	this.graphCanvas.onVertexOver.attach(function(sender, nodeId) {
		_this.onVertexOver.notify(nodeId);
	});

	this.graphCanvas.onVertexOut.attach(function(sender, nodeId) {
		_this.onVertexOut.notify(nodeId);
	});
};

/** SELECT VERTICES BY NAME * */
NetworkWidget.prototype.selectVertexByName = function(vertexName) {
	var vertices = this.getDataset().getVertexByName(vertexName);
	if (vertices != null) {
		for ( var nodeId in vertices) {
			if (vertices.hasOwnProperty(nodeId)) {
				var vertexId = vertices[nodeId].getId();
				this.selectVertexById(vertexId);
			}
		}
	}
};

NetworkWidget.prototype.selectVerticesByName = function(verticesName) {
	for ( var i = 0; i < verticesName.length; i++) {
		this.selectVertexByName(verticesName[i]);
	}
};

/** SELECT VERTICES BY ID * */
NetworkWidget.prototype.selectVertexById = function(vertexId) {
	this.graphCanvas.selectNode(vertexId);
	this.blinkVertexById(vertexId);
};

NetworkWidget.prototype.selectVerticesById = function(verticesId) {
	for ( var i = 0; i < verticesId.length; i++) {
		this.selectVertexById(verticesId[i]);
	}
};

/** VECINDARIO * */
NetworkWidget.prototype.selectNeighbourhood = function() {
	this.selectEdgesFromVertices();
	this.selectAdjacent();
};

/** DESELECT * */
NetworkWidget.prototype.deselectNodes = function() {
	this.graphCanvas.deselectNodes();
};

/** SELECT ALL NODES * */
NetworkWidget.prototype.selectAllNodes = function() {
	this.getGraphCanvas().selectAllNodes();
};

/** SELECT EVERYTHING * */
NetworkWidget.prototype.selectAll = function() {
	this.getGraphCanvas().selectAll();
};

/** SELECT ALL EDGES * */
NetworkWidget.prototype.selectAllEdges = function() {
	this.getGraphCanvas().selectAllEdges();
};

/** ZOOM * */
NetworkWidget.prototype.setScale = function(value) {
	this.graphCanvas.setScale(value);
};

NetworkWidget.prototype.getScale = function() {
	return this.graphCanvas.getScale(value);
};

/** SELECT ADJACENT VERTICES FROM SELECTED VERTICES * */
NetworkWidget.prototype.selectAdjacent = function() {
	var selectedVertices = this.getGraphCanvas().getSelectedVertices();
	var edges = [];
	for ( var i = 0; i < selectedVertices.length; i++) {
		edges = edges.concat(this.getGraphCanvas().getDataset().getVertexById(selectedVertices[i]).getEdges());
	}
	var vertices = [];
	for ( i = 0; i < edges.length; i++) {
		vertices.push(edges[i].getNodeSource().getId());
		vertices.push(edges[i].getNodeTarget().getId());
	}

	this.selectVerticesById(vertices);
};

/** SELECT EDGES FROM SELECTED VERTICES * */
NetworkWidget.prototype.selectEdgesFromVertices = function() {
	var selectedVertices = this.getGraphCanvas().getSelectedVertices();
	var edges = [];
	for ( var i = 0; i < selectedVertices.length; i++) {
		edges = edges.concat(this.getGraphCanvas().getDataset().getVertexById(selectedVertices[i]).getEdges());
	}
	var edgesId = [];
	for (  i = 0; i < edges.length; i++) {
		edgesId.push(edges[i].getId());
	}
	this.getGraphCanvas().selectEdges(edgesId);
};

/** BLINKING * */
NetworkWidget.prototype.blinkVertexById = function(vertexId) {
	this.graphCanvas.blinkVertexById(vertexId);
};

/** COMPONENTE CONEXA DE LOS NODOS SELECCIONADOS * */
NetworkWidget.prototype.selectConnectedComponent = function() {
	var elements = this.getConnectedComponent();
	this.selectVerticesById(elements.nodes);
	this.graphCanvas.selectEdges(elements.edges);
};

NetworkWidget.prototype.getConnectedComponent = function() {
	var nodosVisitados = {};
	var aristasVisitadas = {};
	var arrNodos = [];
	var arrAristas = [];
	var selectedGraphNodesId = this.getGraphCanvas().getSelectedVertices();
	for ( var i = 0; i < selectedGraphNodesId.length; i++) {
		this.visitNode(selectedGraphNodesId[i], nodosVisitados, aristasVisitadas, arrNodos, arrAristas);
	}
	return {
		nodes : arrNodos,
		edges : arrAristas
	};
};

NetworkWidget.prototype.visitNode = function(nodeId, nodosVisitados, aristasVisitadas, arrNodos, arrAristas) {
	nodosVisitados[nodeId] = true;
	arrNodos.push(nodeId);
	var nodeEdges = this.getDataset().getVertexById(nodeId).getEdges();
	for ( var j = 0; j < nodeEdges.length; j++) {
		var edge = nodeEdges[j];
		var edgeId = edge.getId();
		if (aristasVisitadas[edgeId] == null) {
			aristasVisitadas[edgeId] = true;
			arrAristas.push(edgeId);
			var nodeTargetId = edge.getNodeTarget().getId();
			if (nodosVisitados[nodeTargetId] == null) {
				this.visitNode(nodeTargetId, nodosVisitados, aristasVisitadas, arrNodos, arrAristas);
			}
			var nodeSourceId = edge.getNodeSource().getId();
			if (nodosVisitados[nodeSourceId] == null) {
				this.visitNode(nodeSourceId, nodosVisitados, aristasVisitadas, arrNodos, arrAristas);
			}
		}
	}
};

/** COLLAPSE SELECTED VERTICES * */
NetworkWidget.prototype.collapse = function() {
	var selectedVertices = this.getGraphCanvas().getSelectedVertices();
	var xMin = -Infinity;
	var xMax = Infinity;
	var yMin = -Infinity;
	var yMax = Infinity;

	for ( var i = 0; i < selectedVertices.length; i++) {
		var vertex = this.getGraphCanvas().getLayout().getNodeById(selectedVertices[i]);
		if (xMin < vertex.x) {
			xMin = vertex.x;
		}
		if (xMax > vertex.x) {
			xMax = vertex.x;
		}
		if (yMin < vertex.y) {
			yMin = vertex.y;
		}
		if (yMax > vertex.y) {
			yMax = vertex.y;
		}
	}

	var centerX = xMin - xMax;
	var centerY = yMin - yMax;
	var radius = (xMax - xMin) / 4;

	var count = selectedVertices.length;
	var verticesCoordinates = [];

	for ( i = 0; i < selectedVertices.length; i++) {
		x = centerX + radius * Math.sin(i * 2 * Math.PI / count);
		y = centerY + radius * Math.cos(i * 2 * Math.PI / count);
		verticesCoordinates.push({
			'x' : x,
			'y' : y
		});
	}

	for ( i = 0; i < selectedVertices.length; i++) {
		this.getGraphCanvas().getLayout().getNodeById(selectedVertices[i]).setCoordinates(verticesCoordinates[i].x, verticesCoordinates[i].y);
	}
};

/** SETTER FONT SIZE * */
NetworkWidget.prototype.setVerticesFontSize = function(value) {
	for ( var nodeId in this.getDataset().getVertices()) {
		if (this.getDataset().getVertices().hasOwnProperty(nodeId)) {
			this.getFormatter().getVertexById(nodeId).getDefault().setFontSize(value);
		}
	}
};

/** GETTERS * */
NetworkWidget.prototype.getFormatter = function() {
	return this.getGraphCanvas().getFormatter();
};
NetworkWidget.prototype.getLayout = function() {
	return this.getGraphCanvas().getLayout();
};

NetworkWidget.prototype.getDataset = function() {
	return this.getGraphCanvas().getDataset();
};

NetworkWidget.prototype.getGraphCanvas = function() {
	return this.graphCanvas;
};

var SVG =
{
		svgns : 'http://www.w3.org/2000/svg',
		xlinkns : "http://www.w3.org/1999/xlink",

	createSVGCanvas: function(parentNode, attributes)
	{
		
		attributes.push( ['xmlns', SVG.svgns], ['xmlns:xlink', 'http://www.w3.org/1999/xlink']);
		var svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
		this._setProperties(svg, attributes);
		parentNode.appendChild( svg);
		return svg;
		
	}, 
	
	createRectangle : function (x, y, width, height,  attributes){
				var rect = document.createElementNS(this.svgns, "rect");
				rect.setAttribute("x",x);		
				rect.setAttribute("y",y);	
				rect.setAttribute("width",width);		
				rect.setAttribute("height",height);	
				SVG._setProperties(rect, attributes);
				return rect;
	},
	
	drawImage64 : function (x, y, width, height, base64, svgNode, attributes) {
		var node = SVG.createImage64(x, y, width, height, base64, attributes);
		svgNode.appendChild(node);
		return node;
	},
	
	createImage64 : function (x, y, width, height, base64,  attributes)	{
				var img = document.createElementNS(this.svgns, "image");
				img.setAttribute("x",x);		
				img.setAttribute("y",y);	
				img.setAttribute("width",width);		
				img.setAttribute("height",height);	
				img.setAttribute("xlink:href",base64);	
				SVG._setProperties(img, attributes);
				return img;
	},
	
	createLine:  function (x1, y1, x2, y2, attributes){
				var line = document.createElementNS(this.svgns,"line");
				line.setAttribute("x1",x1);		
				line.setAttribute("y1",y1);	
				line.setAttribute("x2", x2);	
				line.setAttribute("y2", y2);
				SVG._setProperties(line, attributes);
				return line;
	},
	
	createClip:  function (id, nodeToClip, attributes){
				var clip = document.createElementNS(this.svgns,"clipPath");
				clip.setAttribute("id",id);
				clip.appendChild(nodeToClip);
				return clip;
	},
	
	drawClip : function (id, nodeToClip, svgNode) {
		var node = SVG.createClip(id, nodeToClip);
		svgNode.appendChild(node);
		return node;
	},

	drawRectangle : function (cx, cy, width, height, svgNode, attributes) {
		try{
			var node = SVG.createRectangle(cx, cy, width, height, attributes);
			svgNode.appendChild(node);
		}
		catch(e){
			
			console.log("-------------------- ");
			console.log("Error on drawRectangle " + e);
			console.log(attributes);
			console.log("-------------------- ");
		}
			return node;
	},
	
	createEllipse : function (x, y, rx, ry,  attributes){
				var rect = document.createElementNS(this.svgns, "ellipse");
				rect.setAttribute("cx",x);		
				rect.setAttribute("cy",y);
				rect.setAttribute("rx",rx);		
				rect.setAttribute("ry",ry);	
				SVG._setProperties(rect, attributes);
				return rect;
 	},
	
	drawEllipse : function (cx, cy, rx, ry, svgNode, attributes) {
		var node = SVG.createEllipse(cx, cy, rx, ry, attributes);
		svgNode.appendChild(node);
		return node;
	},
	
	drawImage : function (x, y, canvasSVG, attributes) {
				var image = document.createElementNS(this.svgns, "image");
				image.setAttribute("x",x);		
				image.setAttribute("y",y);		
				canvasSVG.appendChild(image);
				SVG._setProperties(image, attributes);
	},

	drawLine : function (x1, y1, x2, y2, nodeSVG, attributes) {
		try{
				var line = SVG.createLine(x1, y1, x2, y2, attributes);
				nodeSVG.appendChild(line);
		}catch(e){
		}
				return line;
	},
	
	
	 drawPath: function (d, nodeSVG, attributes) {
        var path = SVG.createPath(d, attributes);
        nodeSVG.appendChild(path);
        return path;
	},

	 createPoligon : function (points,  attributes){
        var poligon = document.createElementNS(this.svgns, "polygon");
        poligon.setAttribute("points",points);
        SVG._setProperties(poligon, attributes);
        return poligon;
    },
    
    drawPoligon : function (points,  canvasSVG, attributes){
    	var poligon = SVG.createPoligon(points, attributes);
    	canvasSVG.appendChild(poligon);
		return poligon;
    },
	//<polygon points="20,420, 300,420 160,20" />
	
	 createPath : function (d,  attributes){
         var path = document.createElementNS(this.svgns, "path");
         path.setAttribute("d",d);
         SVG._setProperties(path, attributes);
         return path;
     },

	drawCircle : function (x, y, radio, canvasSVG, attributes) {
	
				var newText = document.createElementNS(this.svgns,"circle");
				newText.setAttribute("cx",x);		
				newText.setAttribute("cy",y);	
				newText.setAttribute("r",radio);	
				
				canvasSVG.appendChild(newText);
				attributes["cursor"] = "pointer";
				this._setProperties(newText, attributes);	
				return newText;
	},
	
	
	_setProperties: function(node, attributes)
	{
		if (attributes instanceof Array){
				for (var i=0; i< attributes.length; i++)
				{
					node.setAttribute(attributes[i][0], attributes[i][1]);
				}
		}
		else{
			for ( var key in attributes){
				node.setAttribute(key, attributes[key]);
			}
		}
	},

/*	drawPath: function(pointsArray, canvasSVG, attributes){
				var path = document.createElementNS(this.svgns,"polyline");
				path.setAttribute ('id', id);
				
				var d= pointsArray[0].x+ " "+ pointsArray[0].y;
				for (var i=1; i< pointsArray.length; i++)
				{
						d=d+" "+pointsArray[i].x+" "+pointsArray[i].y; 
				}
				path.setAttribute ('points', d);
				canvasSVG.appendChild(path);
	},*/

	createText : function (x, y, text, attributes) {
				var node = document.createElementNS(this.svgns,"text");
				node.setAttributeNS(null , "x",x);		
				node.setAttributeNS(null, "y",y);	
				
				var textNode = document.createTextNode(text);
				node.appendChild(textNode);
				
				this._setProperties(node, attributes);
				return node;
	},
	
	drawText : function (x, y, text, canvasSVG, attributes) {
				var text = SVG.createText(x, y, text, attributes);
				canvasSVG.appendChild(text);
				return text;
	},



	drawGroup: function(svgNode, attributes)
	{
		 var group = SVG.createGroup(attributes);
		 svgNode.appendChild(group);
		 return group;
	},
			
	createGroup: function(attributes){
				var group = document.createElementNS(this.svgns,"g");
				this._setProperties(group, attributes);	
				return group;
	}
			
};



var CanvasToSVG = {
		
	convert: function(sourceCanvas, targetSVG, x, y, id, attributes) {
		
		var img = this._convert(sourceCanvas, targetSVG, x, y, id);
		
		for (var i=0; i< attributes.length; i++)
		{
			img.setAttribute(attributes[i][0], attributes[i][1]);
		}
	},
	
	_convert: function(sourceCanvas, targetSVG, x, y, id) {
		var svgNS = "http://www.w3.org/2000/svg";
		var xlinkNS = "http://www.w3.org/1999/xlink";
		// get base64 encoded png from Canvas
		var image = sourceCanvas.toDataURL();

		// must be careful with the namespaces
		var svgimg = document.createElementNS(svgNS, "image");

		svgimg.setAttribute('id', id);
	
		//svgimg.setAttribute('class', class);
		//svgimg.setAttribute('xlink:href', image);
		svgimg.setAttributeNS(xlinkNS, 'xlink:href', image);
		

		

		svgimg.setAttribute('x', x ? x : 0);
		svgimg.setAttribute('y', y ? y : 0);
		svgimg.setAttribute('width', sourceCanvas.width);
		svgimg.setAttribute('height', sourceCanvas.height);
		//svgimg.setAttribute('cursor', 'pointer');
		svgimg.imageData = image;
	
		targetSVG.appendChild(svgimg);
		return svgimg;
	},
	
	importSVG: function(sourceSVG, targetCanvas) {
	    svg_xml = sourceSVG;//(new XMLSerializer()).serializeToString(sourceSVG);
	    var ctx = targetCanvas.getContext('2d');

	    var img = new Image();
	    img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
//	    img.onload = function() {
	        ctx.drawImage(img, 0, 0);
//	    };
	}
	
};
/*
Graph.prototype.importSVG = function(sourceSVG, targetCanvas) {
	sourceSVG = this._svg;
	targetCanvas = document.createElementNS('canvas'); 
    // https://developer.mozilla.org/en/XMLSerializer
    svg_xml = (new XMLSerializer()).serializeToString(sourceSVG);
    var ctx = targetCanvas.getContext('2d');
    // this is just a JavaScript (HTML) image
    var img = new Image();
    // http://en.wikipedia.org/wiki/SVG#Native_support
    // https://developer.mozilla.org/en/DOM/window.btoa
    img.src = "data:image/svg+xml;base64," + btoa(svg_xml);
    img.onload = function() {
        // after this, Canvas’ origin-clean is DIRTY
        ctx.drawImage(img, 0, 0);
    }
};
*/


Vertex.prototype.getName = GraphItem.prototype.getName;
Vertex.prototype.setName = GraphItem.prototype.setName;
Vertex.prototype.getId = GraphItem.prototype.getId;

function Vertex(id, name, args){
	GraphItem.prototype.constructor.call(this, id, name, args);
	this.edgesIn= new Array();
	this.edgesOut= new Array();
};

Vertex.prototype.getEdges = function(){
	return this.edgesIn.concat(this.edgesOut);
};

Vertex.prototype.getEdgesCount = function(){
	return this.getEdges().length;
};

Vertex.prototype.getEdgesIn = function(){
	return this.edgesIn;
};

Vertex.prototype.getEdgesOut = function(){
	return this.edgesOut;
};

Vertex.prototype.addEdge = function(edge){
	if (edge.getNodeSource().getId() == this.id){
		this.edgesIn.push(edge);
	}
	else{
		this.edgesOut.push(edge);
	}
};

Vertex.prototype.removeEdge = function(edge){
	for ( var i = 0; i < this.getEdgesIn().length; i++) {
		var edgeIn = this.edgesIn[i];
		if (edgeIn.getId() == edge.getId()){
			this.edgesIn.splice(i, 1);
		}
	}
	for ( var i = 0; i < this.getEdgesOut().length; i++) {
		var edgeIn = this.edgesOut[i];
		if (edgeIn.getId() == edge.getId()){
			this.edgesOut.splice(i, 1);
		}
	}
};

Vertex.prototype.remove = function(){
	var edges = this.getEdges();
	for ( var i = 0; i < edges.length; i++) {
		var edge = edges[i];
		edge.remove();
	}
	this.deleted.notify(this);
};





VertexGraphFormatter.prototype.getDefault = ItemGraphFormatter.prototype.getDefault;
VertexGraphFormatter.prototype.getSelected = ItemGraphFormatter.prototype.getSelected;
VertexGraphFormatter.prototype.getOver = ItemGraphFormatter.prototype.getOver;
VertexGraphFormatter.prototype.getDragging = ItemGraphFormatter.prototype.getDragging; 
VertexGraphFormatter.prototype.getId = ItemGraphFormatter.prototype.getId; 
VertexGraphFormatter.prototype.toJSON = ItemGraphFormatter.prototype.toJSON; 
VertexGraphFormatter.prototype.loadFromJSON = ItemGraphFormatter.prototype.loadFromJSON; 
VertexGraphFormatter.prototype._setEvents = ItemGraphFormatter.prototype._setEvents; 


function VertexGraphFormatter(defaultFormat, selectedFormat, overFormat, draggingFormat){
	ItemGraphFormatter.prototype.constructor.call(this, defaultFormat, selectedFormat, overFormat, draggingFormat);
};


CircleVertexGraphFormatter.prototype.getDefault = VertexGraphFormatter.prototype.getDefault;
CircleVertexGraphFormatter.prototype.getSelected = VertexGraphFormatter.prototype.getSelected;
CircleVertexGraphFormatter.prototype.getOver = VertexGraphFormatter.prototype.getOver;
CircleVertexGraphFormatter.prototype.getDragging = VertexGraphFormatter.prototype.getDragging; 
CircleVertexGraphFormatter.prototype.getId = VertexGraphFormatter.prototype.getId; 
CircleVertexGraphFormatter.prototype.toJSON = VertexGraphFormatter.prototype.toJSON; 
CircleVertexGraphFormatter.prototype.loadFromJSON = VertexGraphFormatter.prototype.loadFromJSON;
CircleVertexGraphFormatter.prototype._setEvents = VertexGraphFormatter.prototype._setEvents;

function CircleVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type = "CircleVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};



SquareVertexGraphFormatter.prototype.getDefault = VertexGraphFormatter.prototype.getDefault;
SquareVertexGraphFormatter.prototype.getSelected = VertexGraphFormatter.prototype.getSelected;
SquareVertexGraphFormatter.prototype.getOver = VertexGraphFormatter.prototype.getOver;
SquareVertexGraphFormatter.prototype.getDragging = VertexGraphFormatter.prototype.getDragging; 
SquareVertexGraphFormatter.prototype.getId = VertexGraphFormatter.prototype.getId; 
SquareVertexGraphFormatter.prototype.toJSON = VertexGraphFormatter.prototype.toJSON; 
SquareVertexGraphFormatter.prototype.loadFromJSON = VertexGraphFormatter.prototype.loadFromJSON;
SquareVertexGraphFormatter.prototype._setEvents = VertexGraphFormatter.prototype._setEvents;

function SquareVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type =  "SquareVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};


EllipseVertexGraphFormatter.prototype.getDefault = VertexGraphFormatter.prototype.getDefault;
EllipseVertexGraphFormatter.prototype.getSelected = VertexGraphFormatter.prototype.getSelected;
EllipseVertexGraphFormatter.prototype.getOver = VertexGraphFormatter.prototype.getOver;
EllipseVertexGraphFormatter.prototype.getDragging = VertexGraphFormatter.prototype.getDragging; 
EllipseVertexGraphFormatter.prototype.getId = VertexGraphFormatter.prototype.getId; 
EllipseVertexGraphFormatter.prototype.toJSON = VertexGraphFormatter.prototype.toJSON; 
EllipseVertexGraphFormatter.prototype.loadFromJSON = VertexGraphFormatter.prototype.loadFromJSON;
EllipseVertexGraphFormatter.prototype._setEvents = VertexGraphFormatter.prototype._setEvents;

function EllipseVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type  = "EllipseVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};



RectangleVertexGraphFormatter.prototype.getDefault = ItemGraphFormatter.prototype.getDefault;
RectangleVertexGraphFormatter.prototype.getSelected = ItemGraphFormatter.prototype.getSelected;
RectangleVertexGraphFormatter.prototype.getOver = ItemGraphFormatter.prototype.getOver;
RectangleVertexGraphFormatter.prototype.getDragging = ItemGraphFormatter.prototype.getDragging; 
RectangleVertexGraphFormatter.prototype.getId = ItemGraphFormatter.prototype.getId; 
RectangleVertexGraphFormatter.prototype.toJSON = ItemGraphFormatter.prototype.toJSON; 
RectangleVertexGraphFormatter.prototype.loadFromJSON = ItemGraphFormatter.prototype.loadFromJSON; 
RectangleVertexGraphFormatter.prototype._setEvents = ItemGraphFormatter.prototype._setEvents; 

function RectangleVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type = "RectangleVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};



RoundedVertexGraphFormatter.prototype.getDefault = ItemGraphFormatter.prototype.getDefault;
RoundedVertexGraphFormatter.prototype.getSelected = ItemGraphFormatter.prototype.getSelected;
RoundedVertexGraphFormatter.prototype.getOver = ItemGraphFormatter.prototype.getOver;
RoundedVertexGraphFormatter.prototype.getDragging = ItemGraphFormatter.prototype.getDragging; 
RoundedVertexGraphFormatter.prototype.getId = ItemGraphFormatter.prototype.getId; 
RoundedVertexGraphFormatter.prototype.toJSON = ItemGraphFormatter.prototype.toJSON; 
RoundedVertexGraphFormatter.prototype.loadFromJSON = ItemGraphFormatter.prototype.loadFromJSON; 
RoundedVertexGraphFormatter.prototype._setEvents = ItemGraphFormatter.prototype._setEvents; 

function RoundedVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type = "RoundedVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};



OctagonVertexGraphFormatter.prototype.getDefault = ItemGraphFormatter.prototype.getDefault;
OctagonVertexGraphFormatter.prototype.getSelected = ItemGraphFormatter.prototype.getSelected;
OctagonVertexGraphFormatter.prototype.getOver = ItemGraphFormatter.prototype.getOver;
OctagonVertexGraphFormatter.prototype.getDragging = ItemGraphFormatter.prototype.getDragging; 
OctagonVertexGraphFormatter.prototype.getId = ItemGraphFormatter.prototype.getId; 
OctagonVertexGraphFormatter.prototype.toJSON = ItemGraphFormatter.prototype.toJSON; 
OctagonVertexGraphFormatter.prototype.loadFromJSON = ItemGraphFormatter.prototype.loadFromJSON; 
OctagonVertexGraphFormatter.prototype._setEvents = ItemGraphFormatter.prototype._setEvents; 

function OctagonVertexGraphFormatter(id, defaultFormat, selectedFormat, overFormat, draggingFormat){
	VertexGraphFormatter.prototype.constructor.call(this, id, defaultFormat, selectedFormat, overFormat, draggingFormat);
	this.args.type = "OctagonVertexGraphFormatter";
	if (defaultFormat != null){
		if (defaultFormat.radius != null){
			this.defaultFormat.args.radius = defaultFormat.radius;
		}
	}
	
	if (selectedFormat != null){
		if (selectedFormat.radius != null){
			this.selected.args.radius = selectedFormat.radius;
		}
	}
	
	if (overFormat != null){
		if (overFormat.radius != null){
			this.over.args.radius = overFormat.radius;
		}
	}
	
	if (draggingFormat != null){
		if (draggingFormat.radius != null){
			this.dragging.args.draggingFormat = draggingFormat.radius;
		}
	}
};



function OverviewQueueGrid(args) {
	QueueGrid.call(this,args);

	this.height = 0;
	if (args) {
		if (args.height) {
			this.height = args.height;
		}
	}
}

OverviewQueueGrid.prototype.getPercentage = QueueGrid.prototype.getPercentage;
OverviewQueueGrid.prototype.getImage = QueueGrid.prototype.getImage;
OverviewQueueGrid.prototype.parseDataById = QueueGrid.prototype.parseDataById;
OverviewQueueGrid.prototype.attachCallBackAfterRender = QueueGrid.prototype.attachCallBackAfterRender;

/**
* It loads a set of data collections
*
* @method load
* @param {dataCollections} Measurements retrieved from v_saxs_datacollections
*/
OverviewQueueGrid.prototype.load = function(dataCollections) {	
	if (dataCollections != null && dataCollections.length > 0) {				
		this.render(_.orderBy(dataCollections, ['MeasurementToDataCollection_dataCollectionId', 'MeasurementToDataCollection_dataCollectionOrder'], ['desc', 'desc']));
	} else {
		$('#' + this.id).hide().html("<h4>No results found</h4>").fadeIn('fast');
	}	
};

/**
* Fills overview.queue.grid.test.template with data collections
*
* @method render
* @param {dataCollections} Measurements retrieved from v_saxs_datacollections
*/
OverviewQueueGrid.prototype.render = function(data) {
	var html = "";

	/** Calculates the rowSpan so the template knows when to plot the images. Alsp finds where to draw stronger borders*/	
	var grouped = _.groupBy(data, "MeasurementToDataCollection_dataCollectionId");
    
	_.map(data, function(o){ 
        if(o.Subtraction_subtractionId){
		    o.urlDownload = EXI.getDataAdapter().saxs.subtraction.getZip(o.Subtraction_subtractionId);
        }
        if(o.Merge_mergeId){
		    o.urlSpecific = EXI.getDataAdapter().saxs.frame.downloadFramesByAverageIdList(o.Merge_mergeId);
        }
	});
     
	for (var dataCollectionId in grouped){
		var last = _.maxBy(grouped[dataCollectionId], 'MeasurementToDataCollection_dataCollectionOrder');
        if(last){
            if (last.Subtraction_subtractionId){
                last.rowSpan = grouped[dataCollectionId].length;
                last.scattering = this.getImage(last.Subtraction_subtractionId,"scattering");
                last.kratky = this.getImage(last.Subtraction_subtractionId,"kratky");
                last.density = this.getImage(last.Subtraction_subtractionId,"density");
                last.guinier = this.getImage(last.Subtraction_subtractionId,"guinier");
                if (last.Run_runId) {
                    last.dataReduction = true;
                }
            }
		 _.minBy(grouped[dataCollectionId], 'MeasurementToDataCollection_dataCollectionOrder').rowClass = "blue-bottom-border-row";
        }
	}
    
	dust.render("overview.queue.grid.template", data, function(err, out) {   
		html = html + out;
	});
	
	$('#' + this.id).html(html);
	
	var nodeWithScroll = document.getElementById(document.getElementById(this.id).parentNode.parentNode.parentNode.id);
	
	this.attachCallBackAfterRender(nodeWithScroll);
};


/**
* Return an Ext HTML object with a DIV
*
* @method getPanel
*/
OverviewQueueGrid.prototype.getPanel = function(){ 
	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : true,
		height : this.height
	}
};

function PDBViewer(args) {
	this.id = BUI.id();
	this.glMol = null;

	this.width = 600;
	this.height = 600;
	this.title = "";

	this.margin = "10 0 0 5";
	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.title != null) {
			this.title = args.title;
		}
		if (args.margin != null) {
			this.margin = args.margin;
		}
	}
}

PDBViewer.prototype.getTitle = function() {
	return "<div style='width:" + this.width + "px; height:20px; font-weight:bold;background-color: #E6E6E6;color:black'>" + this.title + "</div>";
};

PDBViewer.prototype.getTextAreaId = function() {
	return this.id + "_src";
};

PDBViewer.prototype.getCanvas = function() {
	/** For text Area **/
	var textAreaStyle = "width:" + this.width + "px; height: " + this.height + "px;display: none;";
	var textArea = "<textarea id='" + this.getTextAreaId() + "'; style='" + textAreaStyle + "' ></textarea>";
	var style = "width: " + this.width + "px; height: " + this.height + "px; background-color: black;";
	return textArea + "<div id='" + this.id + "'; style='" + style + "' ></div>";

};

PDBViewer.prototype.getDownload = function(type, abInitioModelId) {
	/** For title **/
	var url = BUI.getPdbURL() + '&type=' + type + '&abInitioModelId=' + abInitioModelId;
	html = '<a href=' + url + ' style="color:blue;font-weight:bold;"  height="80" width="80" >Download</a><br /><br />';
	return "<div style='width:" + this.width + "px; height:20px; font-weight:bold;background-color: #336699;color:white'>" + html + "</div>";
};

PDBViewer.prototype.getBar = function() {
	/** For title **/
	return "<div style='width:" + this.width + "px; height:20px; font-weight:bold;background-color: #336699;color:white'></div>";
};

PDBViewer.prototype.refresh = function(models) {
	var _this = this;
	if (BUI.isWebGLEnabled()) {
		this.models = models;
//		var adapter = new BiosaxsDataAdapter();
		_this.panel.setLoading("Rendering");
//		adapter.onSuccess.attach(function(sender, data) {
//			if (data.models != null){
//				if (data.models[0] != null){
//					document.getElementById(_this.getTextAreaId()).innerHTML = data.models[0].XYZ;
//					if (_this.glMol == null) {
//						_this.glMol = new GLmol(_this.id);
//					} else {
//						_this.glMol.loadMolecule();
//					}
//				}
//			}
//			_this.panel.setLoading(false);
//		});
//		adapter.onError.attach(function(sender, data) {
//			_this.panel.setLoading("Not available");
//		});
//		adapter.getDataPDB(models, []);
//		
		var onSuccess = function(sender, data){
			if (data.models != null){
				if (data.models[0] != null){
					document.getElementById(_this.getTextAreaId()).innerHTML = data.models[0].XYZ;
					if (_this.glMol == null) {
						_this.glMol = new GLmol(_this.id);
					} else {
						_this.glMol.loadMolecule();
					}
				}
			}
			_this.panel.setLoading(false);
		};
		
//		adapter.onError.attach(function(sender, data) {
//			_this.panel.setLoading("Not available");
//		});
//		adapter.getDataPDB(models, []);
		EXI.getDataAdapter({onSuccess : onSuccess}).saxs.model.getPDB(models, []);
		
		
		
	} else {
		this.webGLNotAvailable();
	}
};

PDBViewer.prototype.getOpacity = function(text) {
	if (text == 'Invisible') {
		return '0';
	}
	if (text == 'Minimum') {
		return '0.2';
	}
	if (text == 'Medium') {
		return '0.5';
	}
	if (text == 'High') {
		return '0.7';
	}
	return '1';
};

PDBViewer.prototype.getMenu = function(model) {
	var _this = this;
	function onItemCheck(comp, checked, eOpts) {
		if (checked) {
			var i = null;
			if (comp.group == 'Opacity') {
				for (i = 0; i < _this.models.length; i++) {
					var opacity = _this.getOpacity(comp.text);
					model.opacity = opacity;
				}
			}

			if (comp.group == 'Radius') {
				for (i = 0; i < _this.models.length; i++) {
					var radius = _this.getOpacity(comp.text);
					model.radius = radius;
				}
			}

			_this.refresh(_this.models);
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [ {
			text : 'Opacity',
			menu : {
				items : [ {
					text : 'Invisible',
					checked : false,
					group : 'Opacity',
					checkHandler : onItemCheck
				}, {
					text : 'Minimum',
					checked : false,
					group : 'Opacity',
					checkHandler : onItemCheck
				}, {
					text : 'Medium',
					checked : false,
					group : 'Opacity',
					checkHandler : onItemCheck
				}, {
					text : 'High',
					checked : false,
					group : 'Opacity',
					checkHandler : onItemCheck
				}, {
					text : 'Opaque',
					checked : false,
					group : 'Opacity',
					checkHandler : onItemCheck
				} ]
			}
		}

		]
	});
};

PDBViewer.prototype.getTbar = function() {
	var _this = this;

	var tb = Ext.create('Ext.toolbar.Toolbar');

	var colorItems = [];
	for (var i = 0; i < this.models.length; i++) {
		tb.add({
			text : this.models[i].title,
			menu : this.getMenu(this.models[i])
		});
		var color = "#" + this.models[i].color.replace("0x", "");
		colorItems.push({
			html : "<table><tr><td width='15px'>" + BUI.getRectangleColorDIV(color, 10, 10) + "</td><td>" + this.models[i].title + "</td></table>"
		});
	}

	tb.add({
		xtype : 'numberfield',
		labelWidth : 50,
		width : 120,
		fieldLabel : 'Radius',
		value : 3,
		maxValue : 10,
		step : 0.2,
		minValue : 0.1,
		listeners : {
			change : function(cmp) {
				var radius = cmp.getValue();
				for (var i = 0; i < _this.models.length; i++) {
					_this.models[i].radius = radius;
				}
				_this.refresh(_this.models);
			}
		}
	});
	tb.add("->");
	tb.add(colorItems);
	return tb;
};

PDBViewer.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		margin : this.margin,
		border : 0,
		layout : {
			type : 'vbox'
		},
		width : this.width - 4,
		height : this.height + 30,
		items : [ {
			html : this.getCanvas()
		} ],
		listeners : {
			afterRender : function() {
			}
		}
	});

	this.panel.setLoading("Rendering");
	return this.panel;
};

PDBViewer.prototype.webGLNotAvailable = function() {
	document.getElementById(_this.id).innerHTML = BUI.getWarningHTML("Your browser doesn't support WebGL");
	document.getElementById(_this.id).innerHTML = document.getElementById(_this.id).innerHTML + "<br />";
	document.getElementById(_this.id).innerHTML = document.getElementById(_this.id).innerHTML
			+ BUI.getTipHTML("<a href='http://www.browserleaks.com/webgl#howto-enable-disable-webgl'>How to enable WebGL</a>");
	document.getElementById(_this.id).innerHTML = document.getElementById(_this.id).innerHTML + "<br />";
	document.getElementById(_this.id).innerHTML = document.getElementById(_this.id).innerHTML + BUI.getTipHTML("<a href='http://caniuse.com/webgl'>Can I use WebGL?</a>");
};

/** Deprecated **/
PDBViewer.prototype.draw = function(models) {
	this.models = models;
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		margin : 2,
		layout : {
			type : 'vbox'
		},
		tbar : this.getTbar(),
		width : this.width - 4,
		height : this.height + 30,
		items : [ {
			html : this.getCanvas()
		}

		],
		listeners : {
			afterRender : function() {
				_this.refresh(models);
			}
		}
	});

	this.panel.setLoading("Rendering");
	return this.panel;
};

SuperpositionPDBViewer.prototype.draw = PDBViewer.prototype.draw;
SuperpositionPDBViewer.prototype.getBar = PDBViewer.prototype.getBar;
SuperpositionPDBViewer.prototype.getCanvas = PDBViewer.prototype.getCanvas;
SuperpositionPDBViewer.prototype.getDownload = PDBViewer.prototype.getDownload;
SuperpositionPDBViewer.prototype.getMenu = PDBViewer.prototype.getMenu;
SuperpositionPDBViewer.prototype.getOpacity = PDBViewer.prototype.getOpacity;
SuperpositionPDBViewer.prototype.getPanel = PDBViewer.prototype.getPanel;
SuperpositionPDBViewer.prototype.getTbar = PDBViewer.prototype.getTbar;
SuperpositionPDBViewer.prototype.getTextAreaId = PDBViewer.prototype.getTextAreaId;
SuperpositionPDBViewer.prototype.getTitle = PDBViewer.prototype.getTitle;
SuperpositionPDBViewer.prototype.refresh = PDBViewer.prototype.refresh;
SuperpositionPDBViewer.prototype.webGLNotAvailable = PDBViewer.prototype.webGLNotAvailable;

function SuperpositionPDBViewer(args) {
	this.width = 550;
	this.height = 500;
	if (args != null) {
		if (args.actions != null) {
			this.actions = args.actions;
		}
	}

	var _this = this;
	this.form = new BufferForm();
	this.onSuccess = new Event();
	PDBViewer.prototype.constructor.call(this, args);
};

SuperpositionPDBViewer.prototype.refresh = function(superpositions) {
	var _this = this;
	if (BUI.isWebGLEnabled()) {
		this.models = superpositions;
		var adapter = new BiosaxsDataAdapter();
		_this.panel.setLoading("Rendering");
		adapter.onSuccess.attach(function(sender, data) {
			document.getElementById(_this.getTextAreaId()).innerHTML = data.XYZ;
			if (_this.glMol == null) {
				_this.glMol = new GLmol(_this.id);
			} else {
				_this.glMol.loadMolecule();
			}
			_this.panel.setLoading(false);
		});
		adapter.onError.attach(function(sender, data) {
			_this.panel.setLoading("Not available");
		});
		adapter.getAbinitioPDBContentBySuperpositionList(superpositions);
	} else {
		this.webGLNotAvailable();
	}
};




AlignedSuperpositionPDBViewer.prototype.draw = PDBViewer.prototype.draw;
AlignedSuperpositionPDBViewer.prototype.getBar = PDBViewer.prototype.getBar;
AlignedSuperpositionPDBViewer.prototype.getCanvas = PDBViewer.prototype.getCanvas;
AlignedSuperpositionPDBViewer.prototype.getDownload = PDBViewer.prototype.getDownload;
AlignedSuperpositionPDBViewer.prototype.getMenu = PDBViewer.prototype.getMenu;
AlignedSuperpositionPDBViewer.prototype.getOpacity = PDBViewer.prototype.getOpacity;
AlignedSuperpositionPDBViewer.prototype.getPanel = PDBViewer.prototype.getPanel;
AlignedSuperpositionPDBViewer.prototype.getTbar = PDBViewer.prototype.getTbar;
AlignedSuperpositionPDBViewer.prototype.getTextAreaId = PDBViewer.prototype.getTextAreaId;
AlignedSuperpositionPDBViewer.prototype.getTitle = PDBViewer.prototype.getTitle;
AlignedSuperpositionPDBViewer.prototype.refresh = PDBViewer.prototype.refresh;
AlignedSuperpositionPDBViewer.prototype.webGLNotAvailable = PDBViewer.prototype.webGLNotAvailable;

function AlignedSuperpositionPDBViewer(args) {
	this.width = 550;
	this.height = 500;
	if (args != null) {
		if (args.actions != null) {
			this.actions = args.actions;
		}
	}

	var _this = this;
	this.form = new BufferForm();
	this.onSuccess = new Event();
	PDBViewer.prototype.constructor.call(this, args);
};

AlignedSuperpositionPDBViewer.prototype.refresh = function(superpositions) {
	var _this = this;
	if (BUI.isWebGLEnabled()) {
		this.models = superpositions;
		
		_this.panel.setLoading("Rendering PDB");
		

		var adapter = new BiosaxsDataAdapter();
		adapter.onError.attach(function(sender, pdbContent){
			console.log(sender);
		});
		adapter.onSuccess.attach(function(sender, data){
			var superposition = data.superpositions[0][superpositions[0]];
			document.getElementById(_this.id).innerHTML = "";
			_this.glMol = new GLmol(_this.id, false, false, superposition.apriori.data);
			_this.glMol.addSuperpositionXYZ(superposition.aligned.XYZ, "0xFFFFFF", 0.3, 1);
			
			var view = _this.glMol.getView();
			_this.glMol.setView(view);
   
			
			_this.panel.setLoading(false);
		});
		if (superpositions != null){
			if (superpositions.length != 0){
				adapter.getDataPDB([], superpositions);
			}
		}
		
		
		
	} else {
		this.webGLNotAvailable();
	}
};







StructurePDBViewer.prototype.draw = PDBViewer.prototype.draw;
StructurePDBViewer.prototype.getBar = PDBViewer.prototype.getBar;
StructurePDBViewer.prototype.getCanvas = PDBViewer.prototype.getCanvas;
StructurePDBViewer.prototype.getDownload = PDBViewer.prototype.getDownload;
StructurePDBViewer.prototype.getMenu = PDBViewer.prototype.getMenu;
StructurePDBViewer.prototype.getOpacity = PDBViewer.prototype.getOpacity;
StructurePDBViewer.prototype.getPanel = PDBViewer.prototype.getPanel;
StructurePDBViewer.prototype.getTbar = PDBViewer.prototype.getTbar;
StructurePDBViewer.prototype.getTextAreaId = PDBViewer.prototype.getTextAreaId;
StructurePDBViewer.prototype.getTitle = PDBViewer.prototype.getTitle;
StructurePDBViewer.prototype.refresh = PDBViewer.prototype.refresh;
StructurePDBViewer.prototype.webGLNotAvailable = PDBViewer.prototype.webGLNotAvailable;

function StructurePDBViewer(args) {
	this.width = 550;
	this.height = 500;
	if (args != null) {
		if (args.actions != null) {
			this.actions = args.actions;
		}
	}

	var _this = this;
	this.form = new BufferForm();
	this.onSuccess = new Event();
	PDBViewer.prototype.constructor.call(this, args);
};

StructurePDBViewer.prototype.refresh = function(structures) {
	var _this = this;
	if (BUI.isWebGLEnabled()) {
		this.models = structures;
		_this.panel.setLoading("Rendering");
		
		var adapter = new BiosaxsDataAdapter();
		adapter.onSuccess.attach(function(sender, pdbContent){
			document.getElementById(_this.getTextAreaId()).innerHTML = pdbContent;
			var glmol02 = new GLmol(_this.id);
			
			_this.panel.setLoading(false);
		});
		adapter.onError.attach(function(sender, data) {
			_this.panel.setLoading("Not available");
		});
		adapter.getDataPDB(models, []);
	} else {
		this.webGLNotAvailable();
	}
};
function QueueGrid(args) {
//	this.height = Ext.getBody().getHeight() - 500;

	this.decimals = 3;
	this.onSelect = new Event();

	this.maxHeight = 600;
	
	this.id = BUI.id();
	this.title = 'Data Collections';
	this.key = {};
	

	this.selectionMode = 'MULTI';
	
	this.collapsible = true;
	this.collapsed = false;
	
	var _this = this;
	this.filters = [ function(item) {
		if (item.data.dataCollectionId == null) {
			return false;
		}
		if (_this.key[item.data.dataCollectionId] == null) {
			_this.key[item.data.dataCollectionId] = [];
		}
		_this.key[item.data.dataCollectionId].push(item.data);
		return item.data.macromoleculeId != null;
	} ];
	if (args!= null){
		if (args.maxHeight != null){
			this.maxHeight = args.maxHeight;
		}
		if (args.collapsible != null){
			this.collapsible = args.collapsible;
		}
		if (args.collapsed != null){
			this.collapsed = args.collapsed;
		}
		if (args.selectionMode != null){
			this.selectionMode = args.selectionMode;
		}
		if (args.title != null){
			if (args.title == false){
				this.title = null;
			}
		}
	}
	
	this.selected = []; 
	this.onSelectionChange = new Event();
	this.onDeselect = new Event(this);
	this.onSelect = new Event(this);
}

QueueGrid.prototype.getSorters = function() {
	return {};
};

QueueGrid.prototype.getSelected = function() {
	return this.selected;
};


QueueGrid.prototype.getSelectedData = function() {
	var elements = this.panel.getSelectionModel().selected.items;
	var data = [];
	for (var i = 0; i < elements.length; i++) {
		data.push(elements[i].data);
	}
	return data;
};




QueueGrid.prototype.getFields = function() {
	return [ 'experimentId', 'subtractionId', 'macromoleculeAcronym', 'priorityLevelId', 'code', 'exposureTemperature', 'concentration' ];
};

QueueGrid.prototype.getRunHTML = function(sample) {
	var dataCollectionId = sample.data.dataCollectionId;
	var table = document.createElement("table");
	if (this.key[dataCollectionId] != null) {

		this.key[dataCollectionId].sort(function(a, b) {
			return b.measurementId - a.measurementId;
		});

		for (i in this.key[dataCollectionId]) {
			var specimen = this.key[dataCollectionId][i];
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			if (specimen.measurementCode != null){
				if (specimen.macromoleculeId == null) {
					td.setAttribute("style", "padding-top:1px;width:130px;color:gray;");
					td.appendChild(document.createTextNode("# " + specimen.measurementCode));
				} else {
					td.setAttribute("style", "padding-top:1px;width:130px;font-weight:bold;");
					td.appendChild(document.createTextNode("# " + specimen.measurementCode));
				}
			}
			else{
				td.appendChild(document.createTextNode(" - "));
			}
			tr.appendChild(td);
			table.appendChild(tr);
		}

	}
	return "<table>" + table.innerHTML + "</table>";
};

QueueGrid.prototype.getPercentage = function(averaged, total) {
	var tdFrames = document.createElement("td");
	
	var color = "green";
	if (averaged == null){
		averaged = "NA";
		color = "orange";
	}
	if (total == null){
		total = "NA";
		color = "orange";
	}
	
	if ((averaged != "NA")&(total != "NA")){
		if (averaged/total >= 0.3){
			color = "orange";
		}
		if (averaged/total > 0.7){
			color = "#BCF5A9";
		}
		
		if (averaged/total < 0.3){
			color = "red";
		}
		
		
	}
	
	tdFrames.appendChild(document.createTextNode(averaged + " / " + total));
	
	tdFrames.setAttribute("style", "background-color:" + color +";");
	return tdFrames;
};

QueueGrid.prototype.getFramesHTML = function(sample) {
	var dataCollectionId = sample.data.dataCollectionId;
	var table = document.createElement("table");
	if (this.key[dataCollectionId] != null) {

		this.key[dataCollectionId].sort(function(a, b) {
			return b.measurementId - a.measurementId;
		});

		for (i in this.key[dataCollectionId]) {
			var specimen = this.key[dataCollectionId][i];
			var tr = document.createElement("tr");
			var td = document.createElement("td");
			if (specimen.macromoleculeId == null) {
				td.setAttribute("style", "width:130px;color:gray;");
				td.appendChild(document.createTextNode(specimen.bufferAcronym));
			} else {
				td.setAttribute("style", "width:130px;font-weight:bold;");
				td.appendChild(document.createTextNode(specimen.macromoleculeAcronym));
			}
			tr.appendChild(td);
			
			tr.appendChild(this.getPercentage(specimen.framesMerge, specimen.framesCount));

			var td = document.createElement("td");
			var a = document.createElement("a");
			if (specimen.macromoleculeId == null) {
				a.setAttribute("href", BUI.getZipURLByAverageId(specimen.mergeId, specimen.measurementCode));
			} else {
				a.setAttribute("href", BUI.getZipURLBySubtractionId(specimen.subtractionId, specimen.measurementCode));
			}

			tr.appendChild(td);

			table.appendChild(tr);
		}

	}
	return "<table>" + table.innerHTML + "</table>";
};

QueueGrid.prototype.getHTMLTable = function(items) {
	var html = "";
	for (var i = 0; i < items.length; i++) {
			html = html + "<tr><td class='key_subgrid'>" + items[i].key + "</td><td class='value_subgrid'>" + items[i].value + "</td></tr>";
	}
	return "<table>" + html + "</table>";
};

QueueGrid.prototype.getImage = function(sample, name) {
	if (sample.data.macromoleculeId != null) {
		if (sample.data.subtractionId != null) {
			var url = EXI.getDataAdapter().saxs.subtraction.getImage(sample.data.subtractionId, name);
			return '<img src=' + url + '   height="70" width="70" >';
		}
	}
};

QueueGrid.prototype.getColumns = function() {
	var _this = this;
	return [
			{
				header : "dataCollectionId",
				name : "dataCollectionId",
				dataIndex : "dataCollectionId",
				flex : 1,
				hidden : true },
			{
				header : "Exp. Id",
				name : "experimentId",
				dataIndex : "experimentId",
				flex : 1,
				hidden : true },
			{
				header : "Exp. Name",
				name : "name",
				dataIndex : "name",
				flex : 1,
				hidden : true },
			{
				header : "MeasurementId",
				name : "measurementId",
				dataIndex : "measurementId",
				hidden : true,
				flex : 1,
				renderer : function(val, y, sample) {
					return sample.raw.measurementId;
				} },
			{
				header : "Date",
				name : "date",
				flex : 1,
				dataIndex : "runCreationDate",
				hidden : true },

			{
				header : "Run",
				flex : 0.2,
				name : "runNumber",
				dataIndex : "measurementCode",
				renderer : function(val, y, sample) {
					return _this.getRunHTML(sample);//"<span style='font-weight:bold;'>#" + val + "</span>";
				} },
			{
				header : "Frames (Average/Total)",
				dataIndex : "macromoleculeId",
				name : "macromoleculeAcronym",
				flex : 1,
				// locked : true,
				hidden : false,
				renderer : function(val, meta, sample) {
					return _this.getFramesHTML(sample);

				} },
			{
				text : 'Scattering',
				dataIndex : 'subtractionId',
				width : 110,
				// locked : true,
				name : 'subtractionId',
				renderer : function(val, y, sample) {
					return _this.getImage(sample, "scattering");
				} 
			},
			{
				header : "Macromolecule",
				name : "macromoleculeAcronym",
				dataIndex : "macromoleculeAcronym",
				flex : 1,
				hidden : true },
			{
				header : "Concentration",
				name : "concentration",
				flex : 0.5,
				dataIndex : "concentration",
				hidden : false,
				renderer : function(val, y, sample) {
					if (sample.data.concentration != 0) {
						return BUI.formatValuesUnits(sample.data.concentration, "mg/ml", 7, this.decimals);
					}
				} },
			{
				header : "Exp. Temp.",
				name : "bufferAcronym",
				dataIndex : "bufferAcronym",
				flex : 0.5,
				renderer : function(val, y, sample) {
					return BUI.formatValuesUnits(sample.data.exposureTemperature, "C", 10, this.decimals);
				} },
			{
				text : 'Kratky.',
				dataIndex : 'subtractionId',
				hidden : true,
				flex : 1,

				name : 'subtractionId',
				renderer : function(val, y, sample) {
					return _this.getImage(sample, "kratky");
				} 
			},
			{
				text : 'P(r).',
				hidden : true,
				flex : 1,
				dataIndex : 'subtractionId',
				type : 'string',
				renderer : function(val, y, sample) {
					return _this.getImage(sample, "density");
				}
			},
			{
				text : 'Guinier.',
				hidden : true,
				flex : 1,
				dataIndex : 'subtractionId',
				type : 'string',
				renderer : function(val, y, sample) {
					return _this.getImage(sample, "guinier");
				} 
			},
			{
				text : 'Guinier',
				name : 'Guinier',
				flex : 0.8,
				dataIndex : 'subtractionId',
				renderer : function(val, y, sample) {
					if (sample.data.macromoleculeId != null) {
						if (sample.data.subtractionId != null) {
							var items = [];
							if (sample.data.rg != null){
								items.push({
									key : "Rg",
									value : BUI.formatValuesUnits(sample.data.rg, "nm", 12, this.decimals) });
							}
							else{
								items.push({
									key : "Rg",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							
							if (sample.data.rg != null){
									items.push({
										key : "Points",
										value : "<span>" + sample.data.firstPointUsed + " - " + sample.data.lastPointUsed + " ("
												+ (sample.data.lastPointUsed - sample.data.firstPointUsed) + ")</span>" });
							}
							else{
								items.push({
									key : "Points",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							
							if (sample.data.I0 != null){
								items.push({
									key : "I0",
									value : BUI.formatValuesErrorUnitsScientificFormat(sample.data.I0, sample.data.I0Stdev, "") });
							}
							else{
								items.push({
									key : "I0",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							return _this.getHTMLTable(items);

						}
					}
				} },
			{
				text : 'Gnom',
				name : 'Gnom',
				flex : 0.7,
				dataIndex : 'subtractionId',
				renderer : function(val, y, sample) {
					if (sample.data.macromoleculeId != null) {
						if (sample.data.subtractionId != null) {
							var items = [];
							if (sample.data.rgGnom != null){
								items.push({
									key : "Rg",
									value : BUI.formatValuesUnits(sample.data.rgGnom, "nm") });
							}
							else{
								items.push({
									key : "Rg",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							
							if (sample.data.rgGnom != null){
								items.push({
									key : "Total",
									value : BUI.formatValuesUnits(sample.data.total, '') });
							}
							else{
								items.push({
									key : "Total",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							if (sample.data.dmax != null){
								items.push({
											key : "D<sub>max</sub>",
											value : BUI.formatValuesUnits(sample.data.dmax, "")
													+ "<span style='font-size:8px;color:gray;'> nm</span>" });
							}
							else{
								items.push({
									key : "D<sub>max</sub>",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}

							return _this.getHTMLTable(items);

						}
					}
				} },
			{
				text : 'Porod',
				name : 'Porod',
				flex : 1,
				dataIndex : 'subtractionId',
				renderer : function(val, y, sample) {
					if (sample.data.macromoleculeId != null) {
						if (sample.data.subtractionId != null) {
							var items = [];
							if (sample.data.volumePorod != null){
								items.push({
									key : "Volume",
									value : BUI.formatValuesUnits(sample.data.volumePorod, '')
											+ "<span style='font-size:8px;color:gray;'> nm<sub>3</sub></span>"
	
								});
							}
							else{
								items.push({
									key : "Volume",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							
							if (sample.data.volumePorod != null){
								items.push({
									key : "MM Vol. est.",
									value : Number(sample.data.volumePorod / 2).toFixed(1) + " - "
											+ Number(sample.data.volumePorod / 1.5).toFixed(1)
											+ "<span style='font-size:8px;color:gray;'>kD</span>" });
								
							}
							else{
								items.push({
									key : "MM Vol. est.",
									value : "<span class='notavailablefield'>NA</span>"
								});
							}
							
							return _this.getHTMLTable(items);

						}
					}
				}
			},
				{
				text : 'Advanced',
				hidden : false,
				id : this.id + 'buttonAction',
				dataIndex : 'subtrationId',
				flex : 1,
				renderer : function(val, y, sample) {
					// 'fitCount', 'superposisitionCount', 'rigidbodyCount',
					// 'abinitioCount'
					var html = "<table><tr><td style='padding-bottom: 1px;'>" + BUI.getGreenButton("Data Reduction", {
						width : 90,
						height : 15 }) + "</td></tr>";

					if (sample.data.abinitioCount > 0) {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getGreenButton("Abinitio", {
							width : 90,
							height : 15 }) + "</td></tr>";
					} else {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getBlueButton("Abinitio", {
							width : 90,
							height : 15 }) + "</td></tr>";
					}

					if (sample.data.fitCount > 0) {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getGreenButton("Fit", {
							width : 90,
							height : 15 }) + "</td></tr>";
					} else {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getBlueButton("Fit", {
							width : 90,
							height : 15 }) + "</td></tr>";
					}

					if (sample.data.superposisitionCount > 0) {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getGreenButton("Superposition", {
							width : 90,
							height : 15 }) + "</td></tr>";
					} else {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getBlueButton("Superposition", {
							width : 90,
							height : 15 }) + "</td></tr>";
					}
					if (sample.data.rigidbodyCount > 0) {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getGreenButton("Rigid Body", {
							width : 90,
							height : 15 }) + "</td></tr>";
					} else {
						html = html + "<tr><td style='padding-bottom: 1px;'>" + BUI.getBlueButton("Rigid Body", {
							width : 90,
							height : 15 }) + "</td></tr>";
					}

					return html + "</table>";
				}

			}
		];
};

QueueGrid.prototype.load = function(data) {
	if (data != null) {
		this.key = {};
		this.store.loadData(data, true);
	} else {
		this.store.load();
	}
};

QueueGrid.prototype.getPanel = function() {
	var _this = this;
	if(!Ext.ClassManager.isCreated('Queue') ){
		Ext.define('Queue', {
		extend : 'Ext.data.Model',
		fields : [ 'name', 'date', 'volumePorod', 'runCreationDate', 'measurementCode', 'macromoleculeAcronym', 'bufferAcronym', 'I0',
				'I0Stdev', 'acronym', 'averageFilePath', 'bufferAverageFilePath', 'bufferId', 'bufferOnedimensionalFiles', 'code',
				'comments', 'composition', 'concentration', 'creationDate', 'creationTime', 'dataAcquisitionFilePath', 'dataCollectionId',
				'discardedFrameNameList', 'dmax', 'experimentId', 'experimentType', 'exposureTemperature', 'extintionCoefficient',
				'extraFlowTime', 'firstPointUsed', 'flow', 'frameListId', 'framesCount', 'framesMerge', 'gnomFilePath',
				'gnomFilePathOutput', 'guinierFilePath', 'isagregated', 'kratkyFilePath', 'lastPointUsed', {
					name : 'macromoleculeId',
					id : 'macromoleculeId'

				}, {
					name : 'measurementId',
					type : 'int' }, 'mergeId', 'molecularMass', 'name', 'pH', 'priorityLevelId', 'proposalId', 'quality', 'rg', 'rgGnom',
				'rgGuinier', 'rgStdev', 'runId', 'safetyLevelId', 'sampleAverageFilePath', 'sampleOneDimensionalFiles',
				'samplePlatePositionId', 'scatteringFilePath', 'sequence', 'sessionId', 'sourceFilePath', 'specimenId', 'status',
				'stockSolutionId', 'substractedFilePath', 'subtractionId', 'total', 'transmission', 'viscosity', 'volume', 'volumeToLoad',
				'waitTime', 'reference', 'refined', 'fitCount', 'superposisitionCount', 'rigidbodyCount', 'abinitioCount' ] });	
	}
	

	this.store = Ext.create('Ext.data.Store', {
		model : 'Queue',
		data : [],
		filters : this.filters,
		listeners : {
			beforeload : function() {
				_this.key = {};
				return true;
			},
			load : function(store, records) {

			} },
		proxy : {
			type : 'memory',
			reader : {
				type : 'json' } } });

	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect		: true,
		mode				: this.selectionMode,
		listeners			: {
						        selectionchange: function (sm, selections) {
						           	_this.selected = _this.getSelectedData();
						        	_this.onSelectionChange.notify(_this.selected );
						        },
						        select: function (sm, selected) {
						        	_this.onSelect.notify(selected.data);
						        },
						        deselect: function (sm, deselected) {
						        	_this.onDeselect.notify(deselected.data);
						        }
		}
	});
	
	this.panel = Ext.create('Ext.grid.Panel', {
		title : this.title,
		border : true,
		cls : 'defaultGridPanel',
		maxHeight : this.maxHeight,
//		minHeight : 300,
		overflow : 'auto', 
		margin : 5,
		store : this.store,
		columns : this.getColumns(),
		allowDeselect : true,
		selModel			: selModel,
		collapsible : this.collapsible,
		collapsed : this.collapsed,
		viewConfig : {
			enableTextSelection : true,
			preserveScrollOnRefresh : true,
			stripeRows : true,
			rowLines : true,
			listeners : {
				cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
						if (e.target.defaultValue == 'Data Reduction') {
							location.hash = "/saxs/datacollection/dataCollectionId/" + record.data.dataCollectionId + "/primaryviewer";
						}

						if (e.target.defaultValue == 'Abinitio') {
							_this.onAbinitioButtonClicked(record.raw);
						}

						if (e.target.defaultValue == 'Fit') {
							_this.onFitButtonClicked(record.raw);
						}

						if (e.target.defaultValue == 'Superposition') {
							_this.onSuperpositionButtonClicked(record.raw);
						}

						if (e.target.defaultValue == 'Rigid Body') {
							_this.onRigidBodyButtonClicked(record.raw);
						}
				}
			}
		}
	});
	return this.panel;
};

QueueGrid.prototype.onDataReductionButtonClicked = function(record) {
	var adapter = new DataAdapter();
	var dataReductionForm = new DataReductionForm({});

	Ext.create('Ext.window.Window', {
		title : 'Data Reduction',
		height : 540,
		width : 1000,
		modal : true,
		items : [ dataReductionForm.getPanel() ]
	}).show();

	dataReductionForm.panel.setLoading();
	adapter.onSuccess.attach(function(sender, subtractions) {
		dataReductionForm.refresh(subtractions);
		dataReductionForm.panel.setLoading(false);
	});
	adapter.getSubtractionsBySubtractionIdList([ record.subtractionId ]);
};


/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class QueueGridTest
* @constructor
*/
function QueueGridTest(args) {
    this.id = BUI.id();

    QueueGrid.call(this,args);
    this.imgWidth = 130;

    this.store = Ext.create('Ext.data.Store', {
            fields: ["experiment"]
     });
}

QueueGridTest.prototype.getPercentage = QueueGrid.prototype.getPercentage;
QueueGridTest.prototype.getImage = QueueGrid.prototype.getImage;
QueueGridTest.prototype.parseDataById = QueueGrid.prototype.parseDataById;
QueueGridTest.prototype.attachCallBackAfterRender = QueueGrid.prototype.attachCallBackAfterRender;


QueueGridTest.prototype.load = function(experiment){
    var _this = this;
    
    this.setLoading();
    try{
        if (experiment.experimentId){
            var onSuccess = function(sender, data){
                if (data != null) {
                    _this.dataByDataCollectionId = _this.parseDataById(data);
                    _this.store.loadData(_.keys(_.keyBy(data,'dataCollectionId')), true);
                    _this.attachCallBackAfterRender(document.getElementById(_this.id + "-body").childNodes[0]);
                }
                _this.setLoading(false);
            };

            EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByExperimentId(experiment.experimentId);
        } else {
            this.dataByDataCollectionId = this.parseDataById(experiment);
            this.store.loadData(_.keys(_.keyBy(experiment,'dataCollectionId')), true);
            _this.attachCallBackAfterRender();
            _this.setLoading(false);
        }
    }
    catch(e){
        console.log(e);
    }
};

QueueGridTest.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        id: this.id,
        border: 1,        
        store: this.store,       
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        }
    });

    return this.panel;
};

QueueGridTest.prototype.setLoading = function(bool){
	this.panel.setLoading(bool);
};

QueueGridTest.prototype.filter = function(key, value) {
    var filtered = _.filter(this.dataByDataCollectionId,function(o) {return o[0]["bufferAcronym"] == value});
    this.store.loadData(_.keys(_.keyBy([].concat.apply([], filtered),'dataCollectionId')));
}


QueueGridTest.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {
            dataIndex: 'experiment',
            name: 'experiment',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var dataCollectionId = record.data;
                var currentDataCollection = _this.dataByDataCollectionId[dataCollectionId];                              
                var html = "";

                var codes = [];
                var macromoleculeInfo = [];
                var averages = [];
                var expTemp = currentDataCollection[0].exposureTemperature + " C";

                var rg = "NA";
                var points = "NA";
                if (currentDataCollection[0].rg != null) {
                    rg = Number(currentDataCollection[0].rg).toFixed(_this.decimals);
                    points = currentDataCollection[0].firstPointUsed + " - " + currentDataCollection[0].lastPointUsed + " (" + (currentDataCollection[0].lastPointUsed - currentDataCollection[0].firstPointUsed) + ")";
                }	
                var I0 = "NA";
                if (currentDataCollection[0].I0 != null){
                    var I0 = Number(currentDataCollection[0].I0).toFixed(_this.decimals-2);
                    var I0Stdev = Number(Number(currentDataCollection[0].I0Stdev).toFixed(_this.decimals)).toExponential();
                }

                var rgGnom = "NA";
                if (currentDataCollection[0].rgGnom != null) {
                    rgGnom = Number(currentDataCollection[0].rgGnom).toFixed(_this.decimals);
                }	
                var total = "NA";
                if (currentDataCollection[0].total != null) {
                    total = Number(currentDataCollection[0].total).toFixed(_this.decimals);
                }
                var dmax = "NA";
                if (currentDataCollection[0].dmax != null) {
                    dmax = Number(currentDataCollection[0].dmax).toFixed(_this.decimals);
                }

                var volumePorod = "NA";
                var mmvolest = "NA";
                if (currentDataCollection[0].volumePorod != null) {
                    volumePorod = Number(currentDataCollection[0].volumePorod).toFixed(_this.decimals);
                    mmvolest = Number(currentDataCollection[0].volumePorod / 2).toFixed(1) + " - "
                                            + Number(currentDataCollection[0].volumePorod / 1.5).toFixed(1);
                }

                var scattering = "";
                var kratky = "";
                var density = "";
                var guinier = "";
                var concentration = "";

                for (var j = 0 ; j < currentDataCollection.length ; j++) {
                    var experiment = currentDataCollection[j];
                    // codes.push(experiment.code);
                    if (experiment.concentration != 0) {
                        concentration = Number(experiment.concentration).toFixed(_this.decimals-1);
                    }
                    if (experiment.macromoleculeId != null) {
                        scattering = _this.getImage(experiment,"scattering");
                        kratky = _this.getImage(experiment,"kratky");
                        density = _this.getImage(experiment,"density");
                        guinier = _this.getImage(experiment,"guinier");
                    }
                    var macromoleculeAcronym = "";
                    if (experiment.macromoleculeAcronym != null) {
                        macromoleculeAcronym = experiment.macromoleculeAcronym;
                    }
                    // macromoleculeInfo.push({ acronym : macromoleculeAcronym, concentration : concentration});
                    // averages.push(_this.getPercentage(experiment.framesMerge,experiment.framesCount));

                    codes.push({code : experiment.code, acronym : macromoleculeAcronym, average : _this.getPercentage(experiment.framesMerge,experiment.framesCount)});
                }                      

                var templateData = {
									codes : codes,
									macromoleculeAcronym : macromoleculeAcronym,
                                    concentration : concentration,
									// averages : averages,
									expTemp : expTemp,
									rg : rg,
									points : points,
									I0 : I0,
									I0Stdev : I0Stdev,
									rgGnom : rgGnom,
									total : total,
									dmax : dmax,
									volumePorod : volumePorod,
									mmvolest : mmvolest,
									scattering : scattering,
									kratky : kratky,
									density : density,
									guinier : guinier,
									imgWidth : _this.imgWidth,
                                    creationDate : currentDataCollection[0].creationDate
								};

                dust.render("queue.grid.test.template", templateData, function(err, out) {                                                                       
                    html = html + out;
                });
                
                return html;

            }
        }
    ];

    return columns;
};

function RigidModelGrid(args) {
	this.height = null;
	this.width = null;
	this.id = BUI.id();

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;

			if (args.width != null) {
				this.width = args.width;
			}
		}
	}
	
	this.onSelected = new Event(this);
}


RigidModelGrid.prototype.refresh = function(subtractions) {
	var data  = [];
	if (subtractions != null){
		if (subtractions.length > 0){
			for (var j in subtractions){
				var subtraction = subtractions[j];
				if (subtraction.rigidBodyModeling3VOs != null){
					for (var i in subtraction.rigidBodyModeling3VOs){
						data.push(subtraction.rigidBodyModeling3VOs[i]);
					}
				}
			}
		}
	}
	this.store.loadData(data);
};

RigidModelGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'symmetry', 'subtractionId', 'subUnitConfigFilePath', 'rigidBodyModelingId', 'rigidBodyModelFilePath', 'logFilePath', 'fitFilePath', 'curveConfigFilePath',
				'crossCorrConfigFilePath', 'contactDescriptionFilePath' ],
		data : []
	});

	this.store.sort([ {
		property : 'name',
		direction : 'ASC'
	} ]);

	this.panel = Ext.create('Ext.grid.Panel', {
		store : this.store,
		width : this.width,
		height : this.height,
		margin : 10,
		deferredRender : false,
		columns : [ {
			text : 'RBM',
			dataIndex : 'rigidBodyModelFilePath',
			hidden : false,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Sub Unit Conf.',
			dataIndex : 'subUnitConfigFilePath',
			hidden : true,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Log',
			dataIndex : 'logFilePath',
			hidden : true,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Fit',
			dataIndex : 'fitFilePath',
			hidden : false,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Curve Conf.',
			dataIndex : 'curveConfigFilePath',
			hidden : false,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Cross Corr.',
			dataIndex : 'crossCorrConfigFilePath',
			hidden : false,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		}, {
			text : 'Contact Desc.',
			dataIndex : 'contactDescriptionFilePath',
			hidden : true,
			flex : 1,
			renderer : function(val){
				return BUI.getFileName(val);
			}
		} ],

		viewConfig : {
			enableTextSelection : true,
			preserveScrollOnRefresh : true
		},
		listeners : {
			cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {

			},
			afterrender : function() {
			}
		}
	});
	return this.panel;
};


/**
 * Example form
 * 
 * @witdh
 * @height
 */
function RigidBodyModelingForm(args) {
	this.id = BUI.id();
	this.width = 700;
	this.height = 500;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}

	var _this = this;
	this.rigidBodyGrid = new AprioriRigidBodyGrid();
	
	this.rigidBodyGrid.onUploadFile.attach(function(sender, type, title){
		_this.openUploadManager(EXI.getDataAdapter().saxs.macromolecule.getAddPDBURL(_this.macromolecule.macromoleculeId));	
	});
	
	this.rigidBodyGrid.onRemove.attach(function(sender, type, title){
		_this._update();
	});
	
	this.onSave = new Event(this);
	
}

RigidBodyModelingForm.prototype.openUploadManager = function(url) {
	var _this = this;
	var widget = new UploaderWidget(url);
	widget.onUploaded.attach(function(sender){
		_this.panel.setLoading();
		EXI.proposalManager.get(true);
		_this.load(EXI.proposalManager.getMacromoleculeById(_this.macromolecule.macromoleculeId));
		_this.panel.setLoading(false);
	});
	widget.show();
};

RigidBodyModelingForm.prototype._getItems = function() {
	var _this = this;
	

	return [ {
		xtype : 'label',
		forId : 'myFieldId',
		text : 'Information for model fit, mixture analysis and rigid body modeling',
		margin : '15 0 20 10',
		cls : "inline-help"
	},
	this.rigidBodyGrid.getPanel(), 
	{
		xtype : 'label',
		forId : 'myFieldId',
		text : 'Distance restraints may be imposed on the model using contacts conditions file (OPTIONAL)',
		margin : '25 0 5 10',
		cls : "inline-help"
	},
	{
		xtype : 'container',
		layout : 'hbox',
		items : [ {
			xtype : 'container',
			border : false,
			layout : 'hbox',
			items : [ {
				xtype : 'label',
				forId : 'myFieldId',
				text : 'Contact Description File: (Optional)',
				width : 150,
				margin : '10 0 0 10'
			}, {
				id : this.id + "contactsDescriptionFilePath",
				xtype : 'textfield',
				hideLabel : true,
				margin : '10 0 0 0',
				width : 400
//				disabled: true
			}, {
				text : 'Upload',
				xtype : 'button',
				margin : "10 0 0 10",
				width : 80,
				handler : function() {
					_this.openUploadManager(EXI.getDataAdapter().saxs.macromolecule.getContactDescriptionUploadFileURL(_this.macromolecule.macromoleculeId));
				}
			}, {
				text : 'Remove',
				id : _this.id + "_remove",
				xtype : 'button',
				margin : "10 0 0 10",
				width : 80,
				handler : function() {
					_this.panel.setLoading(true);
					var onSuccess = function onSuccess(){
						EXI.proposalManager.get(true);
						_this.load(EXI.proposalManager.getMacromoleculeById(_this.macromolecule.macromoleculeId));
						_this.panel.setLoading(false);
					};
					
					
					
					EXI.getDataAdapter({
						onSuccess : onSuccess,
					}).saxs.macromolecule.removeContactDescriptionFile(_this.macromolecule.macromoleculeId);
				}
			} ]
		} ]
	}, {
		xtype : 'panel',
		html : "<span class='inline-help' >Go to <a target='_blank' href='http://www.embl-hamburg.de/biosaxs/manuals/sasrefcvmx.html#input-format'>SASREF manual</a> for further information</span>",
		margin : "10 0 0 160",
		border : 0
		
	}
	];

};

/** Because update is a jsp page we don't know if the user has uploaded a file or not  then we need to refresh **/
RigidBodyModelingForm.prototype._update = function(macromoleculeId, type, title) {
	var _this = this;
	BIOSAXS.proposal.onInitialized.attach(function() {
		if (BIOSAXS.proposal != null) {
			_this.refresh(BIOSAXS.proposal.getMacromoleculeById(_this.macromolecule.macromoleculeId));
			_this.panel.setLoading(false);
		}
	});
	this.panel.setLoading();
	BIOSAXS.proposal.init();
};


RigidBodyModelingForm.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.form.Panel', {
		width : this.width,
		height : this.height,
		cls : 'border-grid',
		defaultType : 'textfield',
		items : this._getItems(),
		padding : 20,
		listeners : {
			afterrender : function(){
				_this._populate();
			}
		}
	});
	return this.panel;
};

/** Populates could be call when the DOM is not filled yet **/ 
RigidBodyModelingForm.prototype._populate = function() {
	if (this.macromolecule != null){
		if (Ext.getCmp(this.id + "contactsDescriptionFilePath") != null){
			if (this.macromolecule.contactsDescriptionFilePath != null){
				Ext.getCmp(this.id + "contactsDescriptionFilePath").setValue(this.macromolecule.contactsDescriptionFilePath);
				Ext.getCmp(this.id + "_remove").enable();
			}
			else{
				Ext.getCmp(this.id + "_remove").disable();
				Ext.getCmp(this.id + "contactsDescriptionFilePath").setValue("");
				
			}
		}
	}
};

/** It populates the form * */
RigidBodyModelingForm.prototype.load = function(macromolecule) {
	this.macromolecule = macromolecule;
	this.rigidBodyGrid.load(macromolecule);
	this._populate();
};

RigidBodyModelingForm.prototype.input = function() {
	return {};
};


/** It populates the form **/
RigidBodyModelingForm.prototype.test = function(targetId) {
	var macromoleculeForm = new RigidBodyModelingForm();
	var panel = macromoleculeForm.getPanel();
	panel.render(targetId);
};


//
//function RigidModelGrid(args) {
//	this.height = null;
//	this.width = null;
//	this.id = BUI.id();
//
//	if (args != null) {
//		if (args.height != null) {
//			this.height = args.height;
//
//			if (args.width != null) {
//				this.width = args.width;
//			}
//		}
//	}
//	
//	this.onSelected = new Event(this);
//}
//
//
//RigidModelGrid.prototype.refresh = function(subtractions) {
//	var data  = [];
//	if (subtractions != null){
//		if (subtractions.length > 0){
//			for (j in subtractions){
//				var subtraction = subtractions[j];
//				if (subtraction.rigidBodyModeling3VOs != null){
//					for (i in subtraction.rigidBodyModeling3VOs){
//						data.push(subtraction.rigidBodyModeling3VOs[i]);
//					}
//				}
//			}
//		}
//	}
//	this.store.loadData(data);
//};
//
//RigidModelGrid.prototype.getPanel = function() {
//	var _this = this;
//	this.store = Ext.create('Ext.data.Store', {
//		fields : [ 'symmetry', 'subtractionId', 'subUnitConfigFilePath', 'rigidBodyModelingId', 'rigidBodyModelFilePath', 'logFilePath', 'fitFilePath', 'curveConfigFilePath',
//				'crossCorrConfigFilePath', 'contactDescriptionFilePath' ],
//		data : []
//	});
//
//	this.store.sort([ {
//		property : 'name',
//		direction : 'ASC'
//	} ]);
//
//	this.panel = Ext.create('Ext.grid.Panel', {
//		store : this.store,
//		width : this.width,
//		height : this.height,
//		margin : 10,
//		deferredRender : false,
//		columns : [ {
//			text : 'RBM',
//			dataIndex : 'rigidBodyModelFilePath',
//			hidden : false,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Sub Unit Conf.',
//			dataIndex : 'subUnitConfigFilePath',
//			hidden : true,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Log',
//			dataIndex : 'logFilePath',
//			hidden : true,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Fit',
//			dataIndex : 'fitFilePath',
//			hidden : false,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Curve Conf.',
//			dataIndex : 'curveConfigFilePath',
//			hidden : false,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Cross Corr.',
//			dataIndex : 'crossCorrConfigFilePath',
//			hidden : false,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		}, {
//			text : 'Contact Desc.',
//			dataIndex : 'contactDescriptionFilePath',
//			hidden : true,
//			flex : 1,
//			renderer : function(val){
//				return BUI.getFileName(val);
//			}
//		} ],
//
//		viewConfig : {
//			enableTextSelection : true,
//			preserveScrollOnRefresh : true
//		},
//		listeners : {
//			cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
//
//			},
//			afterrender : function() {
//			}
//		}
//	});
//	return this.panel;
//};
//

function SamplePlateGroupWidget(args){
	this.id = BUI.id();
	this.width = 900;
	this.height = 300;

	this.titleTypePlate = 20;

	this.margin = 0;
	this.samplePlateWidgets = [];

	this.bbar = false;
	this.border = 1;
	this.showTitle = true;
	this.title = null;
	
	this.nodeSize = 8;
	
	if (args != null){
		if (args.margin != null){
			this.margin = args.margin;
		}
		if (args.bbar != null){
			this.bbar = args.bbar;
		}

		if (args.showTitle != null){
			this.showTitle = args.showTitle;
			if (this.showTitle){
				this.title = "Plates Groups";
			}
		}
		if (args.border != null){
			this.border = args.border;
		}
		if (args.height != null){
			this.height = args.height;
		}
	}
	
	this.heightPlates = this.height - this.titleTypePlate - 60;

	/** Events * */
	this.onClick = new Event(this);
	this.onExperimentChanged = new Event(this);

	this.plateGroup = [{
				type: 'Deep Well',
				rowCount : 8,
				columnCount : 12,
				id : 'deep-well'
			},
			{
				type: ' 4 x ( 8 + 3 ) Block',
				rowCount : 4,
				columnCount : 11,
				id : 'block'
			},
			{
				type: '96 Well plate',
				rowCount : 8,
				columnCount : 12,
				id : 'well-plate'
			}];
}


SamplePlateGroupWidget.prototype.drawPlate = function(dataCollections, plate, targetId){
	var _this = this;
	
	var samplePlateWidget = new SamplePlateWidget(
			{
				width		: (this.width/3) - 5, 
				height		: this.heightPlates + 10 , 
				nodeSize	: this.nodeSize, 
				fontSize	: 8, 
				strokeWidth	: 1.5,
				enableClick : true
			});

	if (this.isVerticalLayout()){
		samplePlateWidget.width = this.width - 15;
		samplePlateWidget.height = this.heightPlates - 10;
	}
	
	samplePlateWidget.draw(dataCollections, plate, targetId );

	samplePlateWidget.onNodeSelected.attach(function(sender, args){
		_this.onClick.notify(
				{
					samplePlate	: args.samplePlate, 
					row			: args.node.row, 
					column		: args.node.column,
					specimenId 	: args.node.specimenId
				}
		);
	});

	// samplePlateWidget.onVertexUp.attach(function(sender, args){
	// 	_this.onClick.notify(
	// 			{
	// 				samplePlate	: args.samplePlate, 
	// 				row			: args.row, 
	// 				column		: args.column

	// 			}
	// 	);
	// });

	this.samplePlateWidgets.push(samplePlateWidget);
};

SamplePlateGroupWidget.prototype.drawPlates = function(dataCollections){
	if (dataCollections){
		for (var i = 0 ; i < this.plateGroup.length ; i++){
			var plate = this.plateGroup[i];
			var targetId = ('id', this.id + "_" + plate.id);
			if (document.getElementById(targetId) != null){
				this.drawPlate(dataCollections, plate, targetId);
			}
		}
	}
};

/*
SamplePlateGroupWidget.prototype._sortPlates = function(a, b) {
	return a.slotPositionColumn - b.slotPositionColumn;
};
*/

/** This returns maxSlotPositionRow and maxSlotPositionColumn to set visually the sample changer layout **/
SamplePlateGroupWidget.prototype.getDimensions = function(sample) {
	var maxSlotPositionRow = 0;
	var maxSlotPositionColumn = 0;
	
	if (sample != null){
		for (var i = 0; i < plates.length; i++) {
			/** Row **/
			var slotPositionRow = plates[i].slotPositionRow;
			if (slotPositionRow != null){
				slotPositionRow = parseFloat(slotPositionRow);
				if (slotPositionRow > maxSlotPositionRow){
					maxSlotPositionRow = slotPositionRow;
				}
			}
			/** Column **/
			var slotPositionColumn = plates[i].slotPositionColumn;
			if (slotPositionColumn != null){
				slotPositionColumn = parseFloat(slotPositionColumn);
				if (slotPositionColumn > maxSlotPositionColumn){
					maxSlotPositionColumn = slotPositionColumn;
				}
			}
		}
	}
	return {
		"maxSlotPositionRow" 		: parseFloat(maxSlotPositionRow),
		"maxSlotPositionColumn"		: parseFloat(maxSlotPositionColumn)
	};
};

/** return true or false if the plates are going to be displayed vertically or horizontally **/
SamplePlateGroupWidget.prototype.isVerticalLayout = function() {
//	var dimensions = this.getDimensions(this.experiment.getSamplePlates())
//	if (dimensions.maxSlotPositionRow < dimensions.maxSlotPositionColumn){
//		return false;
//	}
	return true;
};

/** This returns a sample plate object based on the position it occupies on the sample plate **/
SamplePlateGroupWidget.prototype.getPlateBySlotPosition = function(plates, row, column) {
	if (plates != null){
		for (var i = 0; i < plates.length; i++) {
			/** Row **/
			if ((plates[i].slotPositionRow == row)&&(plates[i].slotPositionColumn == column)){
				return plates[i];
			}
		}
	}
	return null;
};

/** Returns the html that will be used to display the plates **/
SamplePlateGroupWidget.prototype.getPlatesContainer = function(dataCollections){
	var plateGroups = [];

	var div  = document.createElement("div");
	var table  = document.createElement("table");

	table.setAttribute('width', this.width - 30 + 'px');
	table.setAttribute('height', this.heightPlates + 'px');
	
	if (dataCollections!= null){
		for (var i = 0 ; i < this.plateGroup.length ; i++) {
			var tr = document.createElement("tr");
			// var plate = this.getPlateBySlotPosition(plates,j,k);
			var td = document.createElement("td");
			// td.setAttribute('id', this.id + "_" + plate.samplePlateId);
			td.setAttribute('id', this.id + "_" + this.plateGroup[i].id);
			td.setAttribute('style', "background-color:#E6E6E6;border-width:1px;border-style:solid;");
			/** plate Type title * */
			var divTitle = document.createElement("div");
			divTitle.setAttribute("class", "menu-title");
			var text = document.createTextNode(this.plateGroup[i].type);
			divTitle.appendChild(text);
			
			td.appendChild(divTitle);
			tr.appendChild(td);
			table.appendChild(tr);
		}
	}
	div.appendChild(table);
	return div.innerHTML;
};

SamplePlateGroupWidget.prototype.selectSpecimens = function(specimens){
	/** Clear previous selected * */
	for ( var i = 0; i < this.samplePlateWidgets.length; i++) {
		this.samplePlateWidgets[i].clearSelection();
	}
	for ( var i = 0; i < specimens.length; i++) {
		this.selectSpecimen(specimens[i]);
	}
};

SamplePlateGroupWidget.prototype.selectSpecimen = function(specimen){
	if (specimen.SamplePlatePosition_samplePlateId != null){
		for ( var i = 0; i < this.samplePlateWidgets.length; i++) {
			if ( this.samplePlateWidgets[i].samplePlate.type == specimen.SamplePlate_name){
				this.samplePlateWidgets[i].selectSpecimen(specimen);
				return;
			}
		}
	}
};

SamplePlateGroupWidget.prototype._refreshBbar = function(){
	if (this.panel != null){
		this.panel.removeDocked(Ext.getCmp( this.id + 'bbar'));
		this.panel.addDocked(this.getBbar());
	}
};

SamplePlateGroupWidget.prototype.refresh = function(dataCollections){
	this.dataCollections = dataCollections;
	this.samplePlateWidgets = [];
	if (document.getElementById(this.id + "_container") != null){
		document.getElementById(this.id + "_container").innerHTML = "";
		document.getElementById(this.id + "_container").innerHTML = this.getPlatesContainer(dataCollections);
		this.drawPlates(dataCollections);
	}

	/** We refrsh also the bbar  but it could not exist yet* */
	this._refreshBbar();	
};

SamplePlateGroupWidget.prototype._getAutoFillButton = function(){
	var _this = this;
	var item = null;
	function onButtonClick(){

	}

	function showResult(answer){
		if (answer == 'yes'){
			var samplePlateId = item.samplePlateId;
			var adapter = new BiosaxsDataAdapter();
			_this.panel.setLoading("ISPyB: Saving Plate");
			adapter.onSuccess.attach(function(sender, json){
				_this.onExperimentChanged.notify(json);
				_this.panel.setLoading(false);
			});
			adapter.onError.attach(function(sender){
				alert("error");
				_this.panel.setLoading(false);
			});
			adapter.autoFillPlate(samplePlateId, _this.experiment.experimentId);
		}
	}

	function onItemClick(i){
		item = i;
		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to fill "'+ _this.experiment.getSamplePlateById(item.samplePlateId).platetype3VO.name + '" plate?', showResult);
	}


	var items = [];
	items.push( '<b class="menu-title">Select a plate:</b>');

	if (this.experiment){
		var plates = this.experiment.getSamplePlates();
		plates.sort(function(a,b){return a.slotPositionColumn - b.slotPositionColumn;});
		for ( var i = 0; i < plates.length; i++) {
			items.push({
				samplePlateId			:  plates[i].samplePlateId,
				text					: (i+1) + '.- <b> ' + plates[i].platetype3VO.name +'</b>', 
				handler				: onItemClick
			});
		}
	}

	return Ext.create('Ext.button.Split', {
		text		: 'Auto Fill',
		handler		: onButtonClick,
		tooltip		: {text:'This will fill, if there is place, the specimens in the plate', title:'Auto Fill'},
		menu : {
			items: items
		}
	});
};

SamplePlateGroupWidget.prototype._getZoomButton = function(){
	var _this = this;
	var item = null;

	function onItemClick(item){
// Ext.MessageBox.confirm('Confirm', 'Are you sure you want to empty "'+
// _this.experiment.getSamplePlateById(item.samplePlateId).platetype3VO.name +
// '" plate?', showResult);
		Ext.create('Ext.window.Window', {
			title	: _this.experiment.getSamplePlateById(item.samplePlateId).platetype3VO.name,
			height	: 600,
			width	: 900,
			layout	: 'fit',
			modal	: true,
			listeners: {
				afterrender: function(){
					var samplePlateWidget = new SamplePlateWidget(
							{
								width		: 880, 
								height		: 560, 
								nodeSize	: 4, 
								fontSize	: 0, 
								strokeWidth	: 1.5,
								showLabels	: true,
								backgroundColor : '#FFFFFF'
							});

					samplePlateWidget.draw(_this.experiment, _this.experiment.getSamplePlateById(item.samplePlateId), "plateZoom" );
				}
			},
			items	: [
			     	   {
			     		   html 	: '<div id="plateZoom" style="background-color:red"></div>',
			     		   padding 	: 5
			     	   }
			     	   ]
		}).show();

	}


	var items = [];
	if (this.experiment){
		var plates = this.experiment.getSamplePlates();
		plates.sort(function(a,b){return a.slotPositionColumn - b.slotPositionColumn;});
	
		items.push( '<b class="menu-title">Select a plate:</b>');
		for ( var i = 0; i < plates.length; i++) {
			items.push({
				samplePlateId			:  plates[i].samplePlateId,
				text					: (i+1) + '.- <b> ' + plates[i].platetype3VO.name +'</b>', 
				handler				: onItemClick
			});
		}
	}

	return Ext.create('Ext.button.Split', {
		text		: 'Zoom In',
		tooltip		: {text:'This will show a plate bigger', title:'Zoom In Action'},
		menu 		: {
			items: items
		}
	});
};


SamplePlateGroupWidget.prototype._getEmptyButton = function(){
	var _this = this;
	var item = null;
	function onButtonClick(){

	}

	function showResult(answer){
		if (answer == 'yes'){
			var samplePlateId = item.samplePlateId;
			var adapter = new BiosaxsDataAdapter();
			_this.panel.setLoading("ISPyB: Saving Plate");
			adapter.onSuccess.attach(function(sender, json){
				_this.onExperimentChanged.notify(json);
				_this.panel.setLoading(false);
			});
			adapter.onError.attach(function(sender){
				alert("error");
				_this.panel.setLoading(false);
			});
			adapter.emptyPlate(samplePlateId, _this.experiment.experimentId);
		}
	}

	function onItemClick(i){
		item = i;
		Ext.MessageBox.confirm('Confirm', 'Are you sure you want to empty "'+ _this.experiment.getSamplePlateById(item.samplePlateId).platetype3VO.name + '" plate?', showResult);
	}


	var items = [];
	
	if (this.experiment){
		var plates = this.experiment.getSamplePlates();
		plates.sort(function(a,b){return a.slotPositionColumn - b.slotPositionColumn;});
	
		items.push( '<b class="menu-title">Select a plate:</b>');
		for ( var i = 0; i < plates.length; i++) {
			items.push({
				samplePlateId			:  plates[i].samplePlateId,
				text					: (i+1) + '.- <b> ' + plates[i].platetype3VO.name +'</b>', 
				handler				: onItemClick
			});
		}
	}
	return Ext.create('Ext.button.Split', {
		text		: 'Empty',
		handler		: onButtonClick,
		tooltip		: {text:'This will empty the specimen of a plate. It will NOT remove the specimen but will removed their position', title:'Empty Action'},
		menu : {
			items: items
		}
	});
};

SamplePlateGroupWidget.prototype._getPlateTypes = function(){
	var _this = this;
	var item = null;
	function onButtonClick(){

	}

	function changeType(answer){
		if (answer == 'yes'){
			var samplePlateId = item.samplePlateId;
			var plateTypeId = item.plateTypeId;

			var plateType = BIOSAXS.proposal.getPlateTypeById(plateTypeId);
			var plate = _this.experiment.getSamplePlateById(samplePlateId);
			plate.platetype3VO = plateType;

			var samplePlateId = item.samplePlateId;
			var adapter = new BiosaxsDataAdapter();
			_this.panel.setLoading("ISPyB: Saving Plate");
			adapter.onSuccess.attach(function(sender, json){
				_this.onExperimentChanged.notify(json);
				_this.panel.setLoading(false);
			});
			adapter.onError.attach(function(sender){
				alert("error");
				_this.panel.setLoading(false);
			});
			adapter.savePlates([plate], _this.experiment.experimentId);
		}
	}

	function onItemCheck(i){
		item = i;
		var samplePlateId = i.samplePlateId;
		var plateTypeId = i.plateTypeId;

		if (_this.experiment.getSamplePlateById(samplePlateId).platetype3VO.plateTypeId != plateTypeId){
			Ext.MessageBox.confirm('Confirm', 'Are you sure you want to change the type of "'+ _this.experiment.getSamplePlateById(item.samplePlateId).platetype3VO.name + '" plate?', changeType);
		}
	}


	var items = [];
	items.push( '<b class="menu-title">Select an EMPTY plate:</b>');
	
	var plates = [];
	if (this.experiment != null){
		plates = this.experiment.getSamplePlates();
	}
	plates.sort(function(a,b){return a.slotPositionColumn - b.slotPositionColumn;});


	var types = ProposalManager.getPlateTypes();

	for ( var i = 0; i < plates.length; i++) {
		var plate = plates[i];
		var itemTypes = [];
		for ( var j = 0; j < types.length; j++) {

			itemTypes.push({
				text			: types[j].name,
				plateTypeId		: types[j].plateTypeId,
				samplePlateId	: plate.samplePlateId,
				checked			: (plate.platetype3VO.plateTypeId == types[j].plateTypeId),
				group			: 'theme' + plate.samplePlateId,
				checkHandler	: onItemCheck
			});
		}

		items.push({
			text		: (i+1) + '.- <b> ' + plate.platetype3VO.name +'</b>',
			disabled	: (_this.experiment.getSpecimensBySamplePlateId(plate.samplePlateId).length > 0),
			menu		: {       
				items		: itemTypes
			}
		});
	}

	return Ext.create('Ext.button.Split', {
		text		: 'Plate Types',
		handler		: onButtonClick,
		tooltip		: {text:'This will change the type of a plate.', title:'Change plate type'},
		menu : {
			items: items
		}
	});
};

SamplePlateGroupWidget.prototype.getBbar = function(experiment){
	var _this = this;
	if (this.bbar){
		return  Ext.create('Ext.toolbar.Toolbar', {
			id	: _this.id + 'bbar',
			dock: 'bottom',
			items: [
			        this._getPlateTypes(),
			        "-",
			        this._getAutoFillButton(),
			        this._getEmptyButton(),
			        "-",
			        this._getZoomButton()
			        ]
		});
	}
	return null;
};

SamplePlateGroupWidget.prototype.getPanel = function(){
	var _this = this;
	
	var id = this.id + "_container"; 
	this.panel =  Ext.create('Ext.panel.Panel', {
		title		: this.title,
		bbar		: this.getBbar(),
		height		: this.height,
		width		: this.width,
		border		: this.border,
		items		: [
					        {
					        	border		: 0,
					        	height		: this.height,
					        	id			: id,
					        	html		: "<div id='"+ id +"'></div>"
					        }
					   ]
	});

	this.panel.on("afterrender", function(){
		document.getElementById(id).innerHTML = _this.getPlatesContainer(_this.experiment);
		_this.drawPlates(_this.experiment);
		_this._refreshBbar();
	});
	return this.panel ;
};
/**
 * 
 * @nodeSize
 * @fontSize
 * @strokeWidth
 * @showTooltip
 * @showBorderLabels
 * @showFullName
 * @showLabels
 * @backgroundColor
 * 
 **/

function SamplePlateWidget(args) {
	this.actions = [];

	this.width = "1";
	this.height = "1";

	this.legendFontSize = 7;

	this.backgroundColor = "#E6E6E6";
	this.wellColor = "#FFFFFF ";

	this.id = BUI.id();
	this.notSupportedMessage = "IE doesn't support HTML5 features";

	this.nodeSize = 14;
	this.fontSize = 10;
	this.strokeWidth = 2;
	this.showTooltip = true;
	this.showBorderLabels = true;
	this.showFullName = false;
	this.showLabels = false;

	this.enableClick = true;

	if (args != null) {
		if (args.showBorderLabels != null) {
			this.showBorderLabels = args.showBorderLabels;
		}
		if (args.showLabels != null) {
			this.showLabels = args.showLabels;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.nodeSize != null) {
			this.nodeSize = args.nodeSize;
		}
		if (args.notSupportedMessage != null) {
			this.notSupportedMessage = args.notSupportedMessage;
		}
		if (args.fontSize != null) {
			this.fontSize = args.fontSize;
		}
		if (args.showFullName != null) {
			this.showFullName = args.showFullName;
		}
		if (args.showTooltip != null) {
			this.showTooltip = args.showTooltip;
		}
		if (args.backgroundColor != null) {
			this.backgroundColor = args.backgroundColor;
		}
		if (args.strokeWidth != null) {
			this.strokeWidth = args.strokeWidth;
		}
		if (args.enableClick != null) {
			this.enableClick = args.enableClick;
		}
	}

	this.onNodeSelected = new Event(this);

	/** this is the ids[specimenId] = nodeId **/
	this.ids = {};
	this.onVertexUp = new Event(this);
	this.selectedSVGNodes = [];
	this.markedSpecimenId = {};
};

SamplePlateWidget.prototype.clear = function(experiment, samplePlate, targetId) {
	if (document.getElementById(this.targetId) != null) {
		document.getElementById(this.targetId).innerHTML = "";
	}
};

SamplePlateWidget.prototype.load = function (dataCollections) {
	for (var i = 0 ; i < dataCollections.length ; i++) {
		var specimen = dataCollections[i];
		if (specimen.SamplePlate_name == this.samplePlate.type) {
			var nodeId = this.id + "-node-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber;
			// var color = experiment.getSpecimenColorByBufferId(specimen.Specimen_specimenId);
			// if (specimen.Macromolecule_macromoleculeId != null) {
			// 	color = experiment.macromoleculeColors[specimen.macromolecule3VO.macromoleculeId]
			// }
			var color = "blue";
			this.getNodeById(nodeId).specimenId = specimen.Specimen_specimenId;
			$("#" + nodeId).attr("fill",color);
			if (specimen.Measurement_measurementId) {
				if (specimen.Run_runId != null) {
					$("#" + this.id + "-square-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber).attr("visibility","visible");
				}
			}
		}
	}
};

SamplePlateWidget.prototype.draw = function(dataCollections, samplePlate, targetId, windowContainerId) {
	this.onVertexUp = new Event(this);
	this.samplePlate = samplePlate;
	this.dataCollections = dataCollections;

	this.targetId = targetId;
	$("#" + this.targetId).append( "<div id='" + this.targetId + "-div-svg" + "'></div>" );

	var rows = this.samplePlate.rowCount;
	var columns = this.samplePlate.columnCount;

	var formatter = {
			// type : "LineEdgeNetworkFormatter",
			'fill-opacity' : 1,
			fill : this.wellColor,
			'stroke-width' : this.strokeWidth,
			'stroke-opacity' : 1,
           
			stroke : "#000000",
			size : this.nodeSize,
			title : {
				fontSize : this.fontSize,
				fill : "#000000"
			},
			labeled : false,
			height : this.height,
			width : this.width,
		
			right : this.width,
			backgroundColor : this.backgroundColor,
			balanceNodes : false,
			nodesMaxSize : 12,
			nodesMinSize : 2
		};

	this.nodes = [];
	var text = [];
	var margin = 10;
	var nodeRadius = Math.min((this.width-margin)/columns,(this.height-margin)/rows)/2;
	nodeRadius = Math.min(nodeRadius, formatter.nodesMaxSize);
	nodeRadius = Math.max(nodeRadius, formatter.nodesMinSize);

	var horizontalMargin = ((this.width-margin) - 2*nodeRadius*columns)/(columns + 1);
	var verticalMargin = ((this.height-margin) - 2*nodeRadius*rows)/(rows + 1);

	for ( var i = 1; i <= rows; i++) {
		for ( var j = 1; j <= columns; j++) {
			var factor = 0.8;
			if (this.samplePlate.type == " 4 x ( 8 + 3 ) Block") {
				if (j >= 9) {
					factor = 1.0;
				} else {
					factor = 0.6;
				}
			}
			var squareSide = Math.min(horizontalMargin,verticalMargin) + 2*nodeRadius*factor;

			this.nodes.push({
							nodeId 		:	this.id + "-node-" + i + "-" + j,
							squareId 	:	this.id + "-square-" + i + "-" + j,
							radius 		: 	nodeRadius*factor,
							x 			: 	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin,
							y 			: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin,
							row 		: 	i,
							column 		: 	j,
							xSquare 	:	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin - squareSide/2 ,
							ySquare		: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin - squareSide/2,
							squareSide	:	squareSide
			});
			if (j == 1) {
				var letter = ["A","B","C","D","E","F","G","H"][i-1];
				text.push({
							text 	:	letter,
							x		:	Math.max(horizontalMargin,nodeRadius) / 2,
							y 		: 	margin/2 + (i-1)*(2*nodeRadius + verticalMargin) + nodeRadius + verticalMargin + this.fontSize/2
				});
			}
			if (i == rows) {
				text.push({
							text 	:	j,
							x		:	margin/2 + (j-1)*(2*nodeRadius + horizontalMargin) + nodeRadius + horizontalMargin,
							y 		: 	this.height
				});
			}
		}
	}

	var templateData = {
							id 			: 	this.id,
							nodes 		: 	this.nodes,
							text		:	text,
							formatter 	: 	formatter,
							enableClick	:	this.enableClick
	}

	var html = "";
	dust.render("sample.plate.template", templateData, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$("#" + this.targetId + "-div-svg").html(html);

	if (this.enableClick){
		this.attachClickListeners();
	}

	this.load(this.dataCollections);

};

SamplePlateWidget.prototype.attachClickListeners = function () {
	var _this = this;
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		$("#" + node.nodeId).unbind('click').click(function(sender){
			_this.onNodeSelected.notify({
										samplePlate : _this.samplePlate,
										node : _this.getNodeById(sender.target.id)
									});
		});
	}
};

SamplePlateWidget.prototype.getNodeById = function (id) {
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		if (node.nodeId == id) {
			return node;
		}
	}
	return;
};

SamplePlateWidget.prototype.clearSelection = function() {
	for (var i = 0 ; i < this.nodes.length ; i++) {
		var node = this.nodes[i];
		$("#" + node.nodeId).removeClass("plate-square-selected");
	}
};

SamplePlateWidget.prototype.selectSpecimen = function(specimen) {
	var nodeId = this.id + "-node-"+ specimen.SamplePlatePosition_rowNumber + "-" +specimen.SamplePlatePosition_columnNumber;
	$("#" + nodeId).addClass("plate-square-selected");
};

SamplePlateWidget.prototype.drawBorders = function() {
	var xArray = {};
	var yArray = {};

	var xValues = [];
	var yValues = [];

	var verticesLayout = this.network.graphCanvas.getLayout().vertices;
	for ( var vertice in verticesLayout) {
		var verticeX = verticesLayout[vertice].x;
		if (xArray[verticeX] == null) {
			xArray[verticeX] = true;
			xValues.push(verticeX);
		}

		var verticeY = verticesLayout[vertice].y;
		if (yArray[verticeY] == null) {
			yArray[verticeY] = true;
			yValues.push(verticeY);
		}
	}

	/** LEGENG **/
	var letters = BUI.getSamplePlateLetters();
	for ( var i = 1; i <= xValues.length; i++) {
		SVG.drawText(xValues[i - 1] * this.network.graphCanvas.getWidth() - 5, this.network.graphCanvas.getHeight(), i, this.network.graphCanvas._svg,
				[ [ 'font-size', this.legendFontSize + 'px' ], [ 'font-weight', 'bold' ], [ 'fill', 'black' ] ]);
	}

	for ( var i = 1; i <= yValues.length; i++) {
		SVG.drawText(5, yValues[i - 1] * this.network.graphCanvas.getHeight() + 5, letters[i - 1], this.network.graphCanvas._svg, 
				[ [ 'font-size', this.legendFontSize + 'px' ], [ 'font-weight', 'bold' ], [ 'fill', 'black' ] ]);
	}

};

SamplePlateWidget.prototype.addOkIcon = function(x, y, id, specimen) {
	var svg = this.network.graphCanvas._svg;
	var _this = this;

	var id = id + "_marked";
	if (this.markedSpecimenId[id] == null) {
		SVG.drawRectangle(x - 10, y - 10, 22, 22, svg, [ [ "id", id ], [ "fill", "gray" ],["stroke-opacity", "0.5"], [ "fill-opacity", "0.2" ], [ 'stroke', 'black' ] ]);
		this.markedSpecimenId[id] = true;
	}
};


SamplePlateWidget.prototype.getVertexByPosition = function(row, column) {
	var vertices = this.network.getDataset().getVertices();
	for ( var vertexId in vertices) {
		if ((vertices[vertexId].args.row == row) && (vertices[vertexId].args.column == column)) {
			return vertices[vertexId];
		}
	}
	return null;
};

SamplePlateWidget.prototype.showLabel = function(row, column, specimen) {
	if (specimen != null) {
		var vertex = this.getVertexByPosition(row, column);
		if (this.fontSize != 0) {
			if (specimen.macromolecule3VO != null) {
				if (this.showFullName) {
					vertex.setName(specimen.code);
				} else {
					vertex.setName(specimen.macromolecule3VO.acronym);
				}
			} else {
				if (this.showFullName) {
					vertex.setName(specimen.code);
				} else {
					vertex.setName(specimen.macromolecule3VO.acronym);
				}
			}
		}
	}
};

SamplePlateWidget.prototype.getNodeIdBySpecimenId = function(specimenId) {
	var nodeId = this.ids[specimenId];
};

SamplePlateWidget.prototype.markSpecimenAsOk = function(specimen, x, y, id) {
	if (specimen.measurements != null) {
		for ( var j = 0; j < specimen.measurements.length; j++) {
			if (specimen.measurements[j].merge3VOs != null) {
				if (specimen.measurements[j].merge3VOs.length > 0) {
					this.addOkIcon((x * this.network.graphCanvas.getWidth()), y * this.network.graphCanvas.getHeight(), id, specimen);
				}
			}
		}
	}
};
/**
 * Input: specimenId of the sample containing a macromolecule
 * Ouput: color of the specimen buffer associated
 */
SamplePlateWidget.prototype.getSpecimenBufferColorFromSampleSpecimenId = function(specimenId) {
	var dcs = this.experiment.getDataCollectionsBySpecimenId(specimenId);
	if (dcs.length > 0){
		var dataCollection = dcs[0];
		for (var i = 0; i < dataCollection.measurementtodatacollection3VOs.length; i++) {
			var measurementToDc = dataCollection.measurementtodatacollection3VOs[i];
			if (measurementToDc.dataCollectionOrder == 1){
				var measurement = this.experiment.getMeasurementById(measurementToDc.measurementId);
				if (measurement != null){
					return this.experiment.getSpecimenColorByBufferId(measurement.specimenId);
				}
				return 'pink';
			}
		}
	}
	return 'orange';
};

SamplePlateWidget.prototype.fillWell = function(row, column, specimen) {
	var _this = this;
	if (specimen != null) {
		var vertex = this.getVertexByPosition(row, column);
		if (vertex == null) {
			console.log(row + ", " + column + " not found");
			return;
		}
		var id = this.network.getGraphCanvas().getSVGNodeId(vertex.id);

		this.showLabel(row, column, specimen);
		this.ids[specimen.specimenId] = vertex.id;
		var x = this.network.getLayout().vertices[vertex.id].x;
		var y = this.network.getLayout().vertices[vertex.id].y;
		this.markSpecimenAsOk(specimen, x, y, id);

		if (specimen.macromolecule3VO == null) {
			/** BUFFER * */
			var color = this.experiment.getSpecimenColorByBufferId(specimen.specimenId);
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setFill(color);
//			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke(this.experiment.getSpecimenColorByBufferId(specimen.specimenId));
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke('blue');
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStrokeWidth(2);

		} else {
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setFill(this.experiment.macromoleculeColors[specimen.macromolecule3VO.macromoleculeId]);
//			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke(this.getSpecimenBufferColorFromSampleSpecimenId(specimen.specimenId));
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStroke('black');
			this.network.getFormatter().getVertexById(vertex.id).getDefault().setStrokeWidth(1);
		}

		if (this.showLabels) {
			x = this.network.getLayout().vertices[vertex.id].x;
			y = this.network.getLayout().vertices[vertex.id].y;
			if (specimen.macromolecule3VO != null) {
				var acronym = specimen.macromolecule3VO.acronym;
				if (acronym.length > 10) {
					acronym = acronym.slice(0, 10) + "...";
				}

				SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 20, acronym, this.network.graphCanvas._svg, [
					[ 'font-size', 'xx-small' ], [ 'fill', 'black' ] ]);

				SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 35, Number(specimen.concentration).toFixed(2) + " mg/ml", this.network.graphCanvas._svg, [
					[ 'font-size', 'xx-small' ], [ 'fill', 'black' ] ]);
			}

			var bufferName = this.experiment.getBufferById(specimen.bufferId).acronym;
			if (bufferName.length > 10) {
				bufferName = bufferName.slice(0, 10) + "...";
			}

			SVG.drawText((x * this.network.graphCanvas.getWidth()) - this.nodeSize - 10, y * this.network.graphCanvas.getHeight() + (this.nodeSize * 3) + 5, this.experiment.getBufferById(specimen.bufferId).acronym, this.network.graphCanvas._svg, [
				[ 'font-size', 'xx-small' ], [ 'fill', 'blue' ] ]);
		}

		if (this.showTooltip) {
			var id = this.network.getGraphCanvas().getSVGNodeId(vertex.id);
		}
	}
};

SamplePlateWidget.prototype._getToolTipContent = function(specimen) {
	var content = "<table style='font-size:11px;'>";
	content = content + "<TR><TD>" + "Specimen " + "</TD><TD style='color:black; font-weight:bold;'>" + specimen.code + "</TD></TR>";
	content = content + "<TR style='height:20px'><TD>" + "" + "</TD><TD style='color:black; font-weight:bold;'></TD></TR>";
	content = content + "<TR><TD>" + "Buffer: " + "</TD><TD style='color:blue; font-weight:bold;'>" + this.experiment.getBufferById(specimen.bufferId).name + "</TD></TR>";
	if (specimen.macromolecule3VO != null) {
		content = content + "<TR><TD>" + "Macromolecule: " + "</TD><TD  style='color:green; font-weight:bold;'>" + specimen.macromolecule3VO.acronym + "</TD></TR>";
		content = content + "<TR><TD>" + "Concentration: " + "</TD><TD >" + specimen.concentration + "</TD></TR>";
	}
	//	content = content + "<TR><TD>" + "Temperature: "+ "</TD><TD>" + specimen.exposureTemperature + "</TD></TR>";
	content = content + "<TR><TD>" + "Volume: " + "</TD><TD>" + specimen.volume + "</TD></TR>";

	if (specimen.viscosity != null) {
		content = content + "<TR><TD>" + "Viscosity: " + "</TD><TD>" + specimen.viscosity + "</TD></TR>";
	}

	content = content + "</table>";
	return content;
};

SamplePlateWidget.prototype.fillSimulator = function(samples) {
	for ( var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		if (sample.sampleplateposition3VO != null) {
			if (sample.sampleplateposition3VO.samplePlateId == this.samplePlate.samplePlateId) {
				var position = sample.sampleplateposition3VO;
				this.fillWell(position.rowNumber, position.columnNumber, sample);
			}
		}
	}

};

SamplePlateWidget.prototype.relayout = function(network, rows, columns) {
	if (this.samplePlate.platetype3VO.shape == "REC") {
		this.squareRelayout(network, rows, columns);
	}
	if (this.samplePlate.platetype3VO.shape == "CIR") {
		this.circleRelayout(network, rows, columns);
	}
};

SamplePlateWidget.prototype.squareRelayout = function(network, rows, columns) {
	var count = network.getDataset()._getVerticesCount();
	var yMin = 0.07;
	var yMax = 0.9;
	var xMin = 0.075;
	var xMax = 0.95;
	var stepY = (yMax - yMin) / (rows - 1);
	var stepX = (xMax - xMin) / (columns - 1);

	var verticesCoordinates = [];
	for ( var i = 0; i < rows; i++) {
		for ( var j = 0; j < columns; j++) {
			y = i * stepY + yMin;
			x = j * stepX + xMin;

			verticesCoordinates.push({
				'x' : x,
				'y' : y
			});

		}
	}
	var aux = 0;
	for ( var vertex in network.getDataset().getVertices()) {
		if (network.getLayout().vertices[vertex] == null) {
			this.vertices[vertex] = new NodeLayout(vertex, 0, 0);
		}
		network.getLayout().vertices[vertex].setCoordinates(verticesCoordinates[aux].x, verticesCoordinates[aux].y);
		aux++;
		network.getLayout().vertices[vertex].changed.attach(function(sender, item) {
			_this.changed.notify(item);
		});
	}
};

SamplePlateWidget.prototype.circleRelayout = function(network, rows, columns) {
	network.getLayout().getLayout("CIRCLE");
};



function SamplesGrid(args) {
	this.height = 500;
	this.id = BUI.id();
	this.tbar = false;
	this.width = 100;
	this.title = "Samples list";
	this.margin = "5 5 5 5";

	if (args != null) {
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
		}		
	}

	this.onSelected = new Event(this);
	
	Ext.define('BLSampleModel', {
			extend : 'Ext.data.Model',
			fields : [
				{
					name : 'proteinAcronym',
					mapping : 'proteinAcronym'
				},{
					name : 'name',
					mapping : 'name'
				}, {
					name : 'spaceGroup',
					mapping : 'spaceGroup'
				}, {
					name : 'beamlineLocation',
					mapping : 'beamlineLocation'
				}, {
					name : 'code',
					mapping : 'code'
				}, {
					name : 'shipment',
					mapping : 'shipping'
				}, {
					name : 'cellA',
					mapping : 'cellA'
				}, {
					name : 'cellB',
					mapping : 'cellB'
				}, {
					name : 'cellC',
					mapping : 'cellC'
				}, {
					name : 'cellAlpha',
					mapping : 'cellAlpha'
				}, {
					name : 'cellBeta',
					mapping : 'cellBeta'
				}, {
					name : 'cellGamma',
					mapping : 'cellGamma'
				}],
			idProperty : 'blSampleId'
		});
}

SamplesGrid.prototype.load = function(crystal) {
	try{
		this.crystal = crystal;	
		this.loadSampleList();
	}
	catch(e){
		EXI.setError(e);
	}
		
};

SamplesGrid.prototype.loadSampleList = function() {
	var _this = this;
	this.panel.setLoading();
	function onSuccess(sender, samples){
		_this.store.loadData(samples);
		_this.panel.setLoading(false);
	}
	EXI.getDataAdapter({onSuccess: onSuccess}).mx.sample.getSampleInfoByCrystalId(this.crystal.crystalId);
	//EXI.getDataAdapter({onSuccess: onSuccess}).mx.sample.getSamplesByCrystalId(this.crystal.crystalId);
	//EXI.getDataAdapter({onSuccess: onSuccess}).mx.sample.getSampleInfoByProposalId();
};
	
SamplesGrid.prototype.getByCrystalId = function(crystal) {
	for (var i = 0; i < this.data.length; i++) {
				if (this.data[i].crystalId == crystal.crystalId){
					return this.data[i];
				} 
	}
};	
SamplesGrid.prototype.getPanel = function() {
	var _this = this;
	
	this.store2 = Ext.create('Ext.data.Store', {
			model : 'BLSampleModel',
			data : []
		});

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'Protein', 'SpaceGroup', 'SampleName', 'Code' , 'Shipment', 'Dewar', 'Container', 'Location', 'Cell'],
		emptyText : "No samples",
		data : []
	});

	this.panel = Ext.create('Ext.grid.Panel', {
		title : this.title,
		store : this.store,
		layout : 'fit',
		icon : '../images/icon/sessions.png',
		cls : 'border-grid',
		height : this.height,
		margin : this.margin,
		emptyText : "No samples",
		columns : 	[	
		{
			text          : 'SampleName',
			dataIndex     : 'sampleName',
			width         : 100
		},
		{
			text          : 'Protein',
			dataIndex     : 'proteinAcronym',
			width:100
		},
		{
			text          : 'SpaceGroup',
			dataIndex     : 'crystalSpaceGroup',
			width:100
		},		
		{
			text          : 'Code',
			dataIndex     : 'code',
			width         : 100
		},
		{
			text          : 'Location',
			dataIndex     : 'containerSampleChangerLocation',
			width         : 100
		},		
				{
			text          : 'Shipment',
			dataIndex     : 'shipment',
			flex : 0.1,
			renderer : function(grid, a, record){
				return record.data.containerVO.DewarVO.ShippingVO.name;
			}
		},
		{
			text          : 'Dewar',
			dataIndex     : 'dewar',
			flex : 0.1,
			renderer : function(grid, a, record){
				return record.data.containerVO.DewarVO.code;
			}
		},
		{
			text          : 'Location in SC',
			dataIndex     : 'sampleChangerLocation',
			flex : 0.1,
			renderer : function(grid, a, record){
				return record.data.containerVO.sampleChangerLocation;
			}
		},	
		{
			text          : 'Cell',
			dataIndex     : 'cell',
			flex : 0.1,
			renderer : function renderUnitCell(grid, a, record) {
				var nbDec = 2;
				if (record.data.crystalVO) {
					var s = (record.data.CellA ? Number(record.data.crystalVO.CellA).toFixed(nbDec) + ", " : "");
					s += (record.data.crystalVO.CellB ? Number(record.data.crystalVO.CellB).toFixed(nbDec) + ", ": "");
					s += (record.data.crystalVO.CellC ? Number(record.data.crystalVO.CellC).toFixed(nbDec) + "<br />": "");
					s += (record.data.crystalVO.CellAlpha ? Number(record.data.crystalVO.CellAlpha).toFixed(nbDec) + ", " : "");
					s += (record.data.crystalVO.CellBeta ? Number(record.data.crystalVO.CellBeta).toFixed(nbDec) + ", " : "");
					s += (record.data.crystalVO.CellGamma ? Number(record.data.crystalVO.CellGamma).toFixed(nbDec): "");
					return s;
				}
			return "";
			}
		},
		{
			text          : 'Protein',
			dataIndex     : 'proteinAcronym',
			flex : 0.1,
			renderer : function(grid, a, record){
						return record.data.crystalVO.proteinVO.acronym;
			}
		}	
		] 
	});
	return this.panel;
};





function SpecimenGrid(args) {
	this.id = BUI.id();
	this.height = 500;
	this.unitsFontSize = 9;
	this.editEnabled = false;
	this.isPositionColumnHidden = false;
	this.removeBtnEnabled = false;

//	this.selectionMode = "MULTI";
	this.updateRowEnabled = false;
	this.grouped = true;
	this.width = 900;
	this.title = 'Specimens';
	
	this.margin = "0 0 0 0";
//	this.experimentColorBased = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}

		if (args.showTitle == false) {
			this.title = null;
		}
		
		if (args.margin == false) {
			this.margin = args.margin;
		}

		if (args.grouped == false) {
			this.grouped = null;
		}

		if (args.width != null) {
			this.width = args.width;
		}


		if (args.editEnabled != null) {
			this.editEnabled = args.editEnabled;
		}
		if (args.removeBtnEnabled != null) {
			this.removeBtnEnabled = args.removeBtnEnabled;
		}
		if (args.isPositionColumnHidden != null) {
			this.isPositionColumnHidden = args.isPositionColumnHidden;
		}
//		if (args.selectionMode != null) {
//			this.selectionMode = args.selectionMode;
//		}
		if (args.updateRowEnabled != null) {
			this.updateRowEnabled = args.updateRowEnabled;
		}

	}
	this.onClick = new Event(this);
	this.onSelected = new Event(this);
	this.onRemoved = new Event(this);
	this.onSpecimenChanged = new Event();
}

SpecimenGrid.prototype._prepareData = function(dataCollections) {
	var data = [];

	for ( var i = 0; i < dataCollections.length; i++) {
		var sample = dataCollections[i];
		if (sample.Macromolecule_macromoleculeId != null) {
			sample.macromolecule = sample.Macromolecule_acronym;
			sample.exposureTemperature = [];
			sample.macromoleculeId = sample.Macromolecule_macromoleculeId;
		}

		if (sample.SamplePlatePosition_samplePlatePositionId != null) {
			if (sample.SamplePlatePosition_samplePlateId != null) {
				sample.samplePlateId = sample.SamplePlatePosition_samplePlateId;
				sample.rowNumber = sample.SamplePlatePosition_rowNumber;
				sample.columnNumber = sample.SamplePlatePosition_columnNumber;
				// sample.plateGroupName = experiment.getSamplePlateById(sample.sampleplateposition3VO.samplePlateId).plategroup3VO.name;
				sample.samplePlateName = sample.SamplePlate_name;
				sample.slotPositionColumn = sample.SamplePlate_slotPositionColumn;
			}
		} else {
			sample.samplePlateName = "Unallocated Specimens";
		}

		/** For grouping, because sencha has not option for multiple grouping I add a field to your store with a convert function that concatenates these two fields and then group by that field.**/
		sample.groupIndex = sample.Buffer_bufferId + sample.Macromolecule_macromoleculeId;
		var macromolecule = EXI.proposalManager.getMacromoleculeById(sample.Macromolecule_macromoleculeId);

		sample.acronym = "Buffers";
		if (macromolecule != null) {
			sample.acronym = EXI.proposalManager.getMacromoleculeById(sample.Macromolecule_macromoleculeId).acronym;
		}

		sample.buffer = EXI.proposalManager.getBufferById(sample.Buffer_bufferId);

		sample.volumeToLoad = sample.Measurement_volumeToLoad;
		data.push(sample);
	}
	return data;
};

SpecimenGrid.prototype.deselectAll = function() {
	this.grid.getSelectionModel().deselectAll();
};

SpecimenGrid.prototype.selectById = function(specimenId) {
	this.grid.getSelectionModel().deselectAll();
	for ( var i = 0; i < this.grid.getStore().data.items.length; i++) {
		var item = this.grid.getStore().data.items[i].data;
		if (item.Specimen_specimenId == specimenId) {
			this.grid.getSelectionModel().select(i);
		}
	}
};

SpecimenGrid.prototype.getStore = function() {
	return this.store;
};

SpecimenGrid.prototype.getPlugins = function() {
	var _this = this;

	var plugins = [];

	if (this.updateRowEnabled) {
		plugins.push(Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 1,
			listeners : {
				validateedit : function(grid, e) {
					var measurements = [];

					if (e.newValues.bufferId != e.record.data.bufferId) {
						/** If buffer has changed we have to change all the specimens sharing same datacollection **/
						var dataCollections = [];
						if (e.record.data.macromoleculeId == null) {
							dataCollections = dataCollections.concat(_this.experiment.getDataCollectionsBySpecimenId(e.record.data.specimenId));
						} else {
							var sampleDataCollections = _this.experiment.getDataCollectionsBySpecimenId(e.record.data.specimenId);
							for ( var i = 0; i < sampleDataCollections.length; i++) {
								var sampleDataCollection = sampleDataCollections[i];
								if (sampleDataCollection != null) {
									for ( var j = 0; j < sampleDataCollection.measurementtodatacollection3VOs.length; j++) {
										var measurementTODc = sampleDataCollection.measurementtodatacollection3VOs[j];
										if (measurementTODc.dataCollectionOrder == 1) {
											dataCollections = dataCollections.concat(_this.experiment.getDataCollectionsBySpecimenId(_this.experiment
													.getMeasurementById(measurementTODc.measurementId).specimenId));
										}
									}
								}
							}
						}
						var i = null;
						for ( i = 0; i < dataCollections.length; i++) {
							var dataCollection = dataCollections[i];
							var specimens = _this.experiment.getSpecimenByDataCollectionId(dataCollection.dataCollectionId);
							measurements = measurements.concat(specimens);
						}

						for ( i = 0; i < measurements.length; i++) {
							var measurement = measurements[i];
							var specimen = _this.experiment.getSpecimenById(measurement.specimenId);
							specimen.bufferId = e.newValues.bufferId;
							new DataAdapter().saveSpecimen(specimen, _this.experiment);
						}
					}

					/** Setting values **/
					e.record.data.concentration = e.newValues.concentration;
					e.record.data.volume = e.newValues.volume;

					/** Position **/
					if (e.record.data.sampleplateposition3VO != null) {
						var samplePlate = _this.experiment.getSamplePlateBySlotPositionColumn(e.newValues.slotPositionColumn);
						if (samplePlate != null) {
							e.record.data.sampleplateposition3VO = {
								columnNumber : e.newValues.columnNumber,
								rowNumber : e.newValues.rowNumber,
								samplePlateId : samplePlate.samplePlateId
							};
						}
					} else {
						if (e.newValues.slotPositionColumn != null) {
							var samplePlate = _this.experiment.getSamplePlateBySlotPositionColumn(e.newValues.slotPositionColumn);
							if (samplePlate != null) {
								e.record.data.sampleplateposition3VO = {
									columnNumber : e.newValues.columnNumber,
									rowNumber : e.newValues.rowNumber,
									samplePlateId : samplePlate.samplePlateId
								};
							}
						}
					}

					var macromoleculeId = e.record.data.macromoleculeId;
					
					var onSuccess = (function(sender, specimen) {
						/** Because macromolecule3VO is fecthed LAZY **/
						if (macromoleculeId != null) {
							specimen.macromolecule3VO = EXI.proposalManager.getMacromoleculeById(macromoleculeId);
						}
						_this.onSpecimenChanged.notify(specimen);
						_this.grid.setLoading(false);
					});
					
					_this.grid.setLoading();
					EXI.getDataAdapter({onSuccess: onSuccess}).saxs.specimen.saveSpecimen(e.record.data);
				}
			}
		}));
	}
	return plugins;
};

SpecimenGrid.prototype._getRowCombo = function() {
	var data = [];
	for ( var i = 1; i <= 8; i++) {
		data.push({
			rowNumber : i,
			name : BUI.getSamplePlateLetters()[i - 1]
		});
	}

	var positionsStore = Ext.create('Ext.data.Store', {
		fields : [ 'rowNumber', 'name' ],
		data : data
	});

	return Ext.create('Ext.form.ComboBox', {
		store : positionsStore,
		queryMode : 'local',
		displayField : 'name',
		valueField : 'rowNumber'
	});
};

SpecimenGrid.prototype._getColumnCombo = function() {
	var data = [];
	for ( var i = 1; i <= 12; i++) {
		data.push({
			columnNumber : i
		});
	}

	var positionsStore = Ext.create('Ext.data.Store', {
		fields : [ 'columnNumber' ],
		data : data
	});

	return Ext.create('Ext.form.ComboBox', {
		store : positionsStore,
		queryMode : 'local',
		displayField : 'columnNumber',
		valueField : 'columnNumber'
	});
};

SpecimenGrid.prototype._getSlotColumBombo = function() {
	if (this.experiment){
		var length = this.experiment.getSamplePlates().length;
	
		var data = [];
		for ( var i = 1; i <= length; i++) {
			data.push({
				slotPositionColumn : i
			});
		}
	
		var positionsStore = Ext.create('Ext.data.Store', {
			fields : [ 'slotPositionColumn' ],
			data : data
		});
	
		return Ext.create('Ext.form.ComboBox', {
			store : positionsStore,
			queryMode : 'local',
			displayField : 'slotPositionColumn',
			valueField : 'slotPositionColumn'
		});
	}
};

SpecimenGrid.prototype.getPanelByExperiment = function(experiment) {
	this.experiment = experiment;
	var data = this._prepareData(experiment);
	return this.getPanel(data);
};

SpecimenGrid.prototype.refresh = function(dataCollections) {
	// debugger
	this.dataCollections = dataCollections;
	_.map(dataCollections, function(o){ 
        if(o.Macromolecule_macromoleculeId){
		    o.acronym = EXI.proposalManager.getMacromoleculeById(o.Macromolecule_macromoleculeId).acronym;
        } else {
			o.acronym = "Buffers";
		}
		o.groupIndex = o.Buffer_bufferId + o.Macromolecule_macromoleculeId;
	});
	// var data = this._prepareData(dataCollections);

	this.store.loadData(dataCollections);
};

SpecimenGrid.prototype.getPanel = function() {
	
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [
			'Buffer_acronym', 'Buffer_bufferId', 'Measurement_code', 'Macromolecule_acronym', 'acronym', 'Macromolecule_macromoleculeId', 'Specimen_concentration', 'Specimen_volume', 'SamplePlatePosition_samplePlateId',
			'SamplePlate_slotPositionColumn', 'SamplePlatePosition_rowNumber', 'SamplePlatePosition_columnNumber', 'groupIndex' ],
		data : [],
		groupField : 'acronym'
	});
	this.store.sort([ {
		property : 'Specimen_concentration',
		direction : 'ASC'
	}, {
		property : 'Buffer_acronym',
		direction : 'ASC'
	} ]);

	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
//		mode : this.selectionMode,
		listeners : {
			select : function(sm, record, index, eOpts ) {
				_this.onSelected.notify([record.data]);
			},
			deselect : function(sm, record, index, eOpts ) {
				_this.onSelected.notify([]);
			}
		}
	});

	var features = [];

	if (this.grouped) {
		features.push({
			ftype : 'grouping',
			groupHeaderTpl : '{name}',
			hideGroupedHeader : false,
			startCollapsed : false,
			id : 'myGroupedStore'
		});
	}
	this.grid = Ext.create(
					'Ext.grid.Panel',
					{
						title 		: this.title,
						height 		: this.height,
						width 		: this.width,
//						layout : 'fit',
						selModel 	: selModel,
						store 		: this.store,
						features 	: features,
						margin 		: this.margin,
						plugins	 	: this.getPlugins(),
						cls 		: 'border-grid',
						columns : [
							{
								text : '',
								dataIndex : 'Macromolecule_acronym',
								width : 20,
								renderer : function(val, y, sample) {
									var macromoleculeId = sample.data.Macromolecule_macromoleculeId;
									if (macromoleculeId == null) return; 
									// return BUI.getRectangleColorDIV(_this.experiment.macromoleculeColors[macromoleculeId], 10, 10);
									return BUI.getRectangleColorDIV("red", 10, 10);
								}
							},
							{
								text : 'Macromolecule',
								dataIndex : 'Macromolecule_acronym',
								width : 100
							},
							{
								text : '',
								dataIndex : 'Buffer_acronym',
								width : 20,
								renderer : function(val, y, sample) {
									var color = "black";
									if (sample.data.Buffer_bufferId != null) {
										// if (_this.experiment.getDataCollectionsBySpecimenId(sample.data.Specimen_specimenId)[0] != null){
										// 	color = _this.experiment.getSpecimenColorByBufferId(_this.experiment.getMeasurementById(_this.experiment.getDataCollectionsBySpecimenId(sample.data.Specimen_specimenId)[0].measurementtodatacollection3VOs[0].measurementId).specimenId);
										// }
										return BUI.getRectangleColorDIV(color, 10, 10);
									}
								}
							}
							, {
								text : 'Buffer',
								dataIndex : 'Buffer_bufferId',
								width : 140,
								editor : BIOSAXS_COMBOMANAGER.getComboBuffers(EXI.proposalManager.getBuffers(), {
									noLabel : true,
									width : 300
								}),
								renderer : function(val, y, sample) {
									if (sample.data.bufferId != null) {
										return EXI.proposalManager.getBufferById(val).acronym;
									}
								}
							}, 
							{
								text : 'Conc.',
								dataIndex : 'Specimen_concentration',
								width : 100,
								editor : {
									allowBlank : false
								},
								renderer : function(val, meta, sample) {
									if (isNaN(val)) {
										meta.tdCls = 'yellow-cell';
										return val;
									} else {
										if (val != 0) {
											return BUI.formatValuesUnits(val, 'mg/ml', {
												fontSize : 16,
												decimals : 3,
												unitsFontSize : this.unitsFontSize
											});
										} else {
											return;
										}
									}
								}
							},
							{
								text : 'Vol. Well',
								dataIndex : 'Specimen_volume',
								width : 70,
								editor : {
									allowBlank : true
								},
								renderer : function(val, y, sample) {
									return BUI.formatValuesUnits(sample.data.Specimen_volume, '&#181l', {
										fontSize : 12,
										decimals : 2,
										unitsFontSize : this.unitsFontSize
									});
								}
							}, 
							// {
							// 	text : 'Position',
							// 	hidden : true,
							// 	flex : 1,
							// 	renderer : function(val, y, sample) {
							// 		return BUI.getSamplePositionHTML(sample.data, _this.experiment);
							// 	}
							// }, 
							{
								text : 'samplePlateId',
								dataIndex : 'SamplePlatePosition_samplePlateId',
								hidden : true
							}, 
							{
								text : 'Plate',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlate_slotPositionColumn',
								editor : _this._getSlotColumBombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) & (val != "")) {
										return val;
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								text : 'Row',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlatePosition_rowNumber',
								editor : this._getRowCombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) && (val != "")) {
										return BUI.getSamplePlateLetters()[val - 1];
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								text : 'Well',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlatePosition_columnNumber',
								editor : this._getColumnCombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) && (val != "")) {
										return val;
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								id : _this.id + 'buttonEditSample',
								text : 'Edit',
								width : 80,
								sortable : false,
								hidden : !_this.editEnabled,
								renderer : function(value, metaData, record, rowIndex, colIndex, store) {
									if (_this.editEnabled) {
										return BUI.getGreenButton('EDIT');
									}
								}
							}, {
								id : _this.id + 'buttonRemoveSample',
								text : '',
								hidden : !_this.removeBtnEnabled,
								width : 100,
								sortable : false,
								renderer : function(value, metaData, record, rowIndex, colIndex, store) {
									if (_this.removeBtnEnabled) {
										return BUI.getRedButton('REMOVE');
									}
								}
							}

						],
						viewConfig : {
							preserveScrollOnRefresh : true,
							stripeRows : true,
							getRowClass : function(record) {
								var specimens = _.filter(_this.dataCollections,{"SamplePlatePosition_rowNumber":record.data.SamplePlatePosition_rowNumber,
																				"SamplePlatePosition_columnNumber":record.data.SamplePlatePosition_columnNumber,
																				"SamplePlatePosition_samplePlateId":record.data.SamplePlatePosition_samplePlateId});
								if (specimens.length > 1) {
									return 'red-row';

								}
							},
							listeners : {
								selectionchange : function(grid, selected) {
									_this.onClick.notify(record.data);
								},
								cellclick : function(grid, td, cellIndex, record, tr) {
									if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonEditSample') {
									}
									if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonRemoveSample') {
										grid.getStore().removeAt(rowIndex);
										_this.onRemoved.notify();
									}

								}

							}
						}
					});
	return this.grid;
};

SpecimenGrid.prototype.input = function() {
	return {
		experiment : DATADOC.getExperiment_10(),
		proposal : DATADOC.getProposal_10()
	};
};

SpecimenGrid.prototype.test = function(targetId) {
	var specimenGrid = new SpecimenGrid({
		height : 400,
		maxHeight : 400,
		width : 1000
	});
	BIOSAXS.proposal = new Proposal(specimenGrid.input().proposal);

	var experiment = new Experiment(specimenGrid.input().experiment);
	var panel = specimenGrid.getPanelByExperiment(experiment);
	panel.render(targetId);

};

/**
 * Widget container of Specimen grid and samplePlate widget
 * Depending of the sample changer layout it may be displayed vertically or horizontally
 * 
 * @param args
 * 
 * #onExperimentChanged It happens when specimen are modified
 */
function SpecimenWidget(args){

	this.width = 1000;
	this.height = 600;
	
	if (args != null){
		if (args.width != null){
			this.width = args.width;
		}
		if (args.height != null){
			this.height = args.height;
		}
	}
	
	var _this = this; 
	
	/** Specimen Grid **/
	this.specimenGrid = new SpecimenGrid({
											minHeight 			: 425,
											selectionMode 		: "SINGLE",
											editEnabled 		: false,
											updateRowEnabled 	: false,
											width 				: 900,
											showTitle 			: false
	});

	
	this.specimenGrid.onSpecimenChanged.attach(function(sender, specimen) {
		_this.experiment.setSpecimenById(specimen);
		_this.load(_this.experiment);
	});

	this.specimenGrid.onSelected.attach(function(sender, specimens) {
		if (specimens.length > 0) {
			_this.specimenSelected = specimens[0];
		} else {
			_this.specimenSelected = null;
		}
		_this.samplePlateGroupWidget.selectSpecimens(specimens);
	});
	
	
	/** Sample plate Widget **/
	this.samplePlateGroupWidget = new SamplePlateGroupWidget({
		showTitle : false,
		height : 250,
		margin : 5,
		bbar : false
	});
	
	
	this.samplePlateGroupWidget.onExperimentChanged.attach(function(sender, json) {
		_this.load(new Experiment(json));
	});

	this.samplePlateGroupWidget.onClick.attach(function(sender, args) {
		/** Clicking on a plate * */
		// var row = args.row;
		// var column = args.column;
		// var samplePlate = args.samplePlate;
		var specimenId = args.specimenId;
		if (_this.specimenSelected && _this.specimenSelected.Specimen_specimenId == specimenId) {
			_this.samplePlateGroupWidget.selectSpecimens([]);
			_this.specimenGrid.deselectAll();
			_this.specimenSelected = null;
		} else {
			_this.specimenSelected = {Specimen_specimenId : specimenId};
			_this.specimenGrid.selectById(specimenId);
		}

// 		/** is specimen selected on the grid? * */
// 		if (_this.specimenSelected != null) {
// 			/** Is position target empty * */
// 			if (specimenId) {
// 				_this.samplePlateGroupWidget.panel.setLoading("ISPyB: Saving specimen");
// 				/** If success * */
// 				var onSuccess = (function(sender, experiment) {
// 					_this.samplePlateGroupWidget.panel.setLoading(false);
// 					_this.samplePlateGroupWidget.refresh(_this.experiment);
// 					_this.specimenGrid.refresh(_this.experiment);
// 					//_this.refresh(_this.experiment);
// 					_this.specimenSelected = null;
// 					_this.specimenGrid.deselectAll();
// 				});

// //				adapter.onError.attach(function(sender, error) {
// //					_this.samplePlateGroupWidget.panel.setLoading(false);
// //					showError(error);
// //				});

// 				EXI.getDataAdapter({onSuccess : onSuccess}).saxs.specimen.saveSpecimen(specimen);
				
// 			} else {
// 				/**
// 				 * Can we merge? We can merge when specimen are the
// 				 * same. So, same buffer, macromolecule, concentration *
// 				 */
// 				var target = _this.experiment.getSampleByPosition(args.samplePlate.samplePlateId, args.row, args.column)[0];
// 				var specimen = _this.experiment.getSampleById(_this.specimenSelected.specimenId);
// 				if (target == specimen) {
// 					_this.samplePlateGroupWidget.refresh(_this.experiment);
// 					_this.specimenSelected = null;
// 					_this.specimenGrid.deselectAll();
// 				} else {
// 					if ((specimen.bufferId == target.bufferId) && (specimen.concentration == target.concentration)) {
// 						if (((specimen.macromolecule3VO != null) && (target.macromolecule3VO != null) && (specimen.macromolecule3VO.macromoleculeId == target.macromolecule3VO.macromoleculeId)) || 
// 								((specimen.macromolecule3VO == null) && (target.macromolecule3VO == null))) {
// 							var onSuccess = (function(sender, data) {
// 								_this.load(new Experiment(data));
// 								_this.samplePlateGroupWidget.panel.setLoading(false);
								
// 								_this.onExperimentChanged.notify(experiment);
// 							});
// 							_this.samplePlateGroupWidget.panel.setLoading("ISPyB: Merging specimens");
// 							EXI.getDataAdapter({onSuccess : onSuccess}).saxs.specimen.mergeSpecimens(specimen.specimenId, target.specimenId);
// 							_this.specimenSelected = null;
// 							_this.specimenGrid.deselectAll();
// 						}
// 					} else {
// 						$.notify("Well is not empty. Select another well!", "error");
// 					}
// 				}
// 			}
// 		} else {
// 			if (specimenId != null) {
// 				_this.specimenGrid.selectById(specimenId);
// 			}
// 		}
	});
	/** Events **/
	this.onExperimentChanged = new Event(this);
};

/**
 * Return vbox or hbox depending on the slot positions of the plates
 */
SpecimenWidget.prototype.getContainerLayoutConfiguration = function(dataCollections){
	// var dimensions = this.samplePlateGroupWidget.getDimensions(experiment.getSamplePlates());
//	if (dimensions.maxSlotPositionRow < dimensions.maxSlotPositionColumn){
//		return {
//					layout 					: "vbox",
//					specimenGridWidth		: this.width - 10,
//					specimenGridHeight		: this.height - 260,
//					samplePlateGroupWidth	: this.width - 10,
//					samplePlateGroupHeight	: 250
//				};
//	}
	return {
					layout 					: "hbox",
					samplePlateGroupWidth	: this.width*1/3 -10,
					samplePlateGroupHeight	: this.height - 10,
					specimenGridWidth		: this.width*2/3,
					specimenGridHeight		: this.height - 10
	};
	
};


SpecimenWidget.prototype.load = function(dataCollections){
	this.dataCollections = _.uniqBy(dataCollections,"Specimen_specimenId");
	
	/** Removing all components **/
	this.panel.removeAll();

	var layoutConfiguration = this.getContainerLayoutConfiguration(dataCollections);

	/** Setting new width and height for layout vbox and hbox **/
	this.specimenGrid.width = layoutConfiguration.specimenGridWidth;
	this.specimenGrid.height = layoutConfiguration.specimenGridHeight;

	this.samplePlateGroupWidget.width = layoutConfiguration.samplePlateGroupWidth;
	this.samplePlateGroupWidget.height = layoutConfiguration.samplePlateGroupHeight;
	
	if (layoutConfiguration.layout == "hbox"){
		this.specimenGrid.margin = "0 0 0 5";
		this.specimenGrid.width =this.specimenGrid.width - 5;
	}
	/** Insert container depending on layout [vertical|horizontal] */
	var container = Ext.create('Ext.container.Container', {
		layout 		: layoutConfiguration.layout,
		height		: this.height,
		width 		: this.width,
		padding 	: '2px',
		items 		: [ 		   ]
	});
	if (layoutConfiguration.layout == "vbox"){
		container.insert(this.specimenGrid.getPanel());
		container.insert(this.samplePlateGroupWidget.getPanel());
	}
	else{
		container.insert(this.samplePlateGroupWidget.getPanel());
		container.insert(this.specimenGrid.getPanel());
	}
	
	/** Insert Widget **/
   	this.panel.insert(container);
   	
	/** Load data **/
	this.specimenGrid.refresh(this.dataCollections);
	this.samplePlateGroupWidget.refresh(this.dataCollections);
	
	
};

/** It creates a dummy container to be inserted the plates once the method refresh has been called 
 * This is necessay because we can not know the sample changer layout before hand
 * **/
SpecimenWidget.prototype.getPanel = function(){
	this.panel = Ext.create('Ext.container.Container', {
		layout 		: 'vbox',
		height 		: this.height,
		border 		: 0,
		margin		: 5,
		width 		: this.width,
		items 		: []
	});
	return this.panel;
};


// SpecimenWidget.prototype.input = function() {
// 	return {
// 		experiment : DATADOC.getExperiment_10(),
// 		proposal : DATADOC.getProposal_10()
// 	};
// };

// SpecimenWidget.prototype.test = function(targetId) {
// 	var specimenWidget = new SpecimenWidget({
// 		height : 500,
// 		width : 1000
// 	});
// 	BIOSAXS.proposal = new Proposal(specimenWidget.input().proposal);
// 	var experiment = new Experiment(specimenWidget.input().experiment);
// 	var panel = specimenWidget.getPanel();
// 	panel.render(targetId);
// 	specimenWidget.refresh(experiment);

// };




/**
 * #onSaved
 */
function StockSolutionForm(args) {
	this.id = BUI.id();
	this.actions = [];

	this.height = 500;
	if (args != null) {
		if (args.actions != null) {
			this.actions = args.actions;
		}
		if (args.height != null) {
			this.height = args.height;
		}
	}
	this.onSaved = new Event(this);
}


StockSolutionForm.prototype._getButtons = function() {
	var _this = this;
	return [ {
		text : 'Save',
		handler : function() {
			var onSuccess = function(sender, stockSolution){
					_this.panel.setLoading(false);
					_this.onSaved.notify();
			};
			if (_this.getStockSolution().bufferId == null){
				BUI.showError("Buffer field is mandatory");
				return;
			}
			
			if (_this.getStockSolution().name == ""){
				BUI.showError("Acronym field is mandatory");
				return;
			}
			
			if (_this.getStockSolution().concentration == ""){
				BUI.showError("Concentration field is mandatory");
				return;
			}
			
			if (_this.getStockSolution().volume == ""){
				BUI.showError("Volume field is mandatory");
				return;
			}
			
			_this.panel.setLoading("ISPyB: saving stock solution");
			EXI.getDataAdapter({onSuccess : onSuccess}).saxs.stockSolution.saveStockSolution(_this.getStockSolution());
			
			
		}
	}
	];
};

StockSolutionForm.prototype.getStockSolution = function() {
	if (this.stockSolution != null) {
		this.stockSolution.concentration = Ext.getCmp(this.id + "stockSolution_concentration").getValue();
//		this.stockSolution.storageTemperature = Ext.getCmp(this.id + "stockSolution_storageTemperature").getValue();
		this.stockSolution.storageTemperature =  this.storageLocationComboBox.getValue();
		
		
		this.stockSolution.volume = Ext.getCmp(this.id + "stockSolution_volume").getValue();
		this.stockSolution.comments = Ext.getCmp(this.id + "stockSolution_comments").getValue();
		this.stockSolution.name = Ext.getCmp(this.id + "stockSolution_name").getValue();
		this.stockSolution.proposalId = Ext.getCmp("proposalIdCombo").getValue();
		this.stockSolution.bufferId = this.bufferCombo.getValue();

		if (this.macromoleculeCombo.getValue() != null) {
			this.stockSolution.macromoleculeId = this.macromoleculeCombo.getValue();
		} else {
			this.stockSolution.macromolecule3VO = null;
		}
		

	} else {
		return {
			concentration : Ext.getCmp(this.id + "stockSolution_concentration").getValue(),
//			storageTemperature : Ext.getCmp(this.id + "stockSolution_storageTemperature").getValue(),
			storageTemperature : this.storageLocationComboBox.getValue(),
			volume : Ext.getCmp(this.id + "stockSolution_volume").getValue(),
			comments : Ext.getCmp(this.id + "stockSolution_comments").getValue(),
			name : Ext.getCmp(this.id + "stockSolution_name").getValue(),
			bufferId : this.bufferCombo.getValue(),
			macromoleculeId : this.macromoleculeCombo.getValue(),
			proposalId :  Ext.getCmp("proposalIdCombo").getValue()
		};
	}
	return this.stockSolution;
};

StockSolutionForm.prototype.load = function(stockSolution) {
	this.stockSolution = stockSolution;
	if (stockSolution != null) {
		if (stockSolution.macromoleculeId != null) {
			this.macromoleculeCombo.setValue(stockSolution.macromoleculeId);
		}
		this.bufferCombo.setValue(stockSolution.bufferId);
		Ext.getCmp(this.id + "stockSolution_concentration").setValue(this.stockSolution.concentration);
//		Ext.getCmp(this.id + "stockSolution_storageTemperature").setValue(this.stockSolution.storageTemperature);
		this.storageLocationComboBox.setValue(this.stockSolution.storageTemperature);
		Ext.getCmp(this.id + "stockSolution_volume").setValue(this.stockSolution.volume);
		Ext.getCmp(this.id + "stockSolution_name").setValue(this.stockSolution.name);
		Ext.getCmp(this.id + "stockSolution_comments").setValue(this.stockSolution.comments);
		
		if (stockSolution != null){
			if (stockSolution.proposalId != null){
				Ext.getCmp("proposalIdCombo").setValue(stockSolution.proposalId);
				Ext.getCmp("proposalIdCombo").disable();
			}
		}
		
	}
};

StockSolutionForm.prototype.getBufferCombo = function() {
	this.bufferCombo = BIOSAXS_COMBOMANAGER.getComboBuffers(EXI.proposalManager.getBuffers(), {
		labelWidth : 150,
		margin : '0 0 10 0',
		width : 400

	});
	return this.bufferCombo;
};

StockSolutionForm.prototype.getMacromoleculeCombo = function() {
	this.macromoleculeCombo = BIOSAXS_COMBOMANAGER.getComboMacromoleculeByMacromolecules(EXI.proposalManager.getMacromolecules(), {
		labelWidth : 150,
		margin : '0 0 10 0',
		width : 400

	});
	return this.macromoleculeCombo;
};

StockSolutionForm.prototype.refresh = function() {
};

StockSolutionForm.prototype._getTopPanel = function() {
	
	this.storageLocationComboBox =  BIOSAXS_COMBOMANAGER.getComboStorageTemperature({labelWidth : 150, width : 400});
	return {
		xtype : 'container',
		layout : 'hbox',
		border : 0,
		buttons : this._getButtons(),
		items : [ {
			xtype : 'container',
			layout : 'hbox',
			items : [ {
				xtype : 'container',
				flex : 1,
				border : false,
				layout : 'anchor',
				defaultType : 'textfield',
				items : [
				BIOSAXS_COMBOMANAGER.getComboProposal({labelWidth : 150, width : 400}),
				this.getMacromoleculeCombo(), 
				this.getBufferCombo(),
				{
					xtype: 'requiredtextfield',
					id : this.id + 'stockSolution_name',
					fieldLabel : 'Acronym',
					labelWidth : 150,
					width : 400
				}, {
					xtype: 'requiredtextfield',
					id : this.id + 'stockSolution_concentration',
					fieldLabel : 'Conc. (mg/ml)',
					labelWidth : 150,
					width : 400
				},
				this.storageLocationComboBox,
//				{
//					id : this.id + 'stockSolution_storageTemperature',
//					fieldLabel : 'Storage Temp.(C)',
//					labelWidth : 150,
//					width : 250
//				}, 
				{
					xtype: 'requiredtextfield',
					id : this.id + 'stockSolution_volume',
					fieldLabel : 'Volume (&#181l)',
					labelWidth : 150,
					width : 400
				} ]
			} ]
		} ]
	};

};


StockSolutionForm.prototype.getPanel = function() {
	this.panel =  Ext.create('Ext.panel.Panel', {
		padding : 0,
		buttons : this._getButtons(),
		cls : 'border-grid',
		items : [
		         {
		        	 	 xtype : 'container',
		        	 	 padding : 20,
				         items : [
							         this._getTopPanel(), 
							         {
							        	 id : this.id + 'stockSolution_comments',
							        	 xtype : 'textareafield',
							        	 name : 'comments',
							        	 fieldLabel : 'Comments',
							        	 labelWidth : 150,
							        	 width : '100%',
							        	 height : 100
							         }]
		         }]
	});
	return this.panel;
};

StockSolutionForm.prototype.input = function() {
	return {
		stock : {
			"stockSolutionId" : 6,
			"proposalId" : 3124,
			"macromoleculeId" : 5933,
			"bufferId" : 811,
			"instructionSet3VO" : null,
			"boxId" : 305861,
			"storageTemperature" : "20",
			"volume" : "300",
			"concentration" : "1.2",
			"comments" : "Buffer EDTA with A",
			"name" : "A_EDTA_1.2",
			"samples" : [],
			"buffer" : "EDTA",
			"macromolecule" : "A"
		},
		proposal : new MeasurementGrid().input().proposal
	};
};

StockSolutionForm.prototype.test = function(targetId) {
	var stockSolutionForm = new StockSolutionForm();
	BIOSAXS.proposal = new Proposal(stockSolutionForm.input().proposal);
	var panel = stockSolutionForm.getPanel(new Shipment(stockSolutionForm.input().stock));
	panel.render(targetId);
};







/**
 * Shows a list of stock solutions with macromolecule, buffer, storage temperature, concentration, shipment and comments
 * 
 * @multiselect allows multiple selection
 * @height 
 * @minHeight
 * @width
 * @tbar
 * @showTitle
 * @isPackedVisible shows is stock solution is in a box
 * @btnEditVisible shows edit button
 * @btnAddVisible
 * @btnAddExisting
 * @btnUnpackVisible allows to unpack a stock solution
 * @btnRemoveVisible allow to remove a stock solution
 */

function StockSolutionGrid(args) {
	this.id = BUI.id();
//	this.height = 100;
//	this.width = null;
//	this.minHeight = null;
	this.tbar = true;

	this.title = "Stock Solutions";

	/** Visible buttons and actions **/
	this.btnEditVisible = true;
	this.btnRemoveVisible = true;
	this.btnAddVisible = true;
	this.btnAddExisting = false;
	this.isPackedVisible = true;
	this.btnUnpackVisible = false;

	/** Selectors **/
	this.multiselect = false;
	this.selectedStockSolutions = [];

	if (args != null) {
		if (args.btnUnpackVisible != null) {
			this.btnUnpackVisible = args.btnUnpackVisible;
		}
		if (args.multiselect != null) {
			this.multiselect = args.multiselect;
		}
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.btnEditVisible != null) {
			this.btnEditVisible = args.btnEditVisible;
		}
		if (args.btnAddVisible != null) {
			this.btnAddVisible = args.btnAddVisible;
		}
		if (args.btnAddExisting != null) {
			this.btnAddExisting = args.btnAddExisting;
		}
		if (args.width != null) {
			this.width = args.width;
		}
		if (args.minHeight != null) {
			this.minHeight = args.minHeight;
		}
		if (args.tbar != null) {
			this.tbar = args.tbar;
		}
		if (args.btnRemoveVisible != null) {
			this.btnRemoveVisible = args.btnRemoveVisible;
		}
		if (args.isPackedVisible != null) {
			this.isPackedVisible = args.isPackedVisible;
		}
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
			if (this.showTitle == false) {
				this.title = null;
			}
		}

	}

	/** Events **/
//	this.onProposalChanged = new Event(this);
//	this.onStockSolutionSelected = new Event(this);
	this.onSaved = new Event(this);
	this.onUnpack = new Event(this);
	this.onPack = new Event(this);
}

StockSolutionGrid.prototype._getColumns = function() {
	var _this = this;
	var columns = [
	{
		header : 'Proposal',
		dataIndex : 'proposal',
		name : 'proposalId',
	//	type : 'string',
		flex : 1,
		hidden : false
	}, 
	{
		header : 'Macromolecule',
		dataIndex : 'macromolecule',
		id : _this.id + 'macromolecule',
		type : 'string',
		renderer : function(val, y, specimen) {
			if (val != null){
				return '<span style="color:blue;">' + val + '</span>';
			}
		},
		hidden : false,
		flex : 1
	}, {
		header : 'Buffer',
		dataIndex : 'buffer',
		name : 'buffer',
		hidden : false,
		renderer : function(val, y, specimen) {
			return '<span style="color:green;">' + val + '</span>';
		},
		type : 'string',
		flex : 1
	}, {
		header : 'Acronym',
		dataIndex : 'name',
		name : 'name',
		flex : 1,
		hidden : true
	},{
		header : 'Storage Temp. (C)',
		dataIndex : 'storageTemperature',
		name : 'storageTemperature',
		flex : 1,
		hidden : false
	}, {
		header : 'Volume (&#181l)',
		name : 'volume',
		dataIndex : 'volume',
		flex : 1,
		hidden : false
	}, {
			header : 'Concentration (mg/ml)',
			dataIndex : 'concentration',
			name : 'concentration',			
			flex : 1
	}, 
	{
		header : 'Packed',
		dataIndex : 'comments',
		id : _this.id + "box",
		type : 'string',
		width : 50,
		hidden : !this.isPackedVisible,
		renderer : function(val, cmp, a) {
			if (a.raw.boxId != null) {
				return "<div style='cursor: pointer;'><img height='15px' src='../images/plane.gif'></div>";
			}

		}
	}, 
	{
		header : 'Comments',
		dataIndex : 'comments',
		type : 'string',
		flex : 1
	} ];

	if (this.btnEditVisible) {
//		columns.push({
//			id : _this.id + 'buttonEdit',
//			width : 85,
//			sortable : false,
//			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
//				if (_this.btnEditVisible) {
//					return BUI.getGreenButton('EDIT');
//				}
//			}
//		});
		columns.push({
            xtype:'actioncolumn',
            width:40,
            text : 'Edit',
            items: [{
                icon: '../images/icon/edit.png',  // Use a URL in the icon config
                tooltip: 'Edit',
                handler: function(grid, rowIndex, colIndex) {
                    var rec = grid.getStore().getAt(rowIndex);
                    _this.edit(rec.get('stockSolutionId'));
                }
            }]
        });
	}

	if (this.btnRemoveVisible) {
		columns.push({
			id : _this.id + 'buttonRemove',
			width : 85,
			sortable : false,
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				if (_this.btnRemoveVisible) {
					return BUI.getRedButton('REMOVE');
				}
			}
		});
	}

	if (this.btnUnpackVisible) {
//		unpack
		columns.push({
            xtype:'actioncolumn',
            width:40,
            text : 'Unpack',
            items: [{
                icon: '../images/icon/ic_highlight_remove_black_24dp.png',  // Use a URL in the icon config
                tooltip: 'Unpack',
                handler: function(grid, rowIndex, colIndex) {
                    var stockSolution = grid.getStore().getAt(rowIndex).data;
                    _this.unpack(stockSolution);
                }
            }]
        });
	}
	return columns;
};

StockSolutionGrid.prototype._getTopButtons = function() {
	var _this = this;
	/** Actions buttons **/
	var actions = [];

	/** ADD BUTTON **/
	if (this.btnAddVisible) {
		actions.push(Ext.create('Ext.Action', {
			icon: '../images/icon/add.png',
			text : 'Add',
			tooltip : 'Will create a new stock solution',
			disabled : false,
			alwaysEnabled : true,
			handler : function(widget, event) {
				_this.edit();
			}
		}));
	}

	if (this.btnAddExisting) {
		actions.push(Ext.create('Ext.Action', {
			icon: 'images/icon/add.png',
			text : 'Add Existing',
			tooltip : 'Allows to select upacked stock solutions',
			disabled : false,
			alwaysEnabled : true,
			handler : function(widget, event) {
				var stockSolutionGrid = new StockSolutionGrid({
					btnAddVisible : false,
					btnEditVisible : false,
					btnRemoveVisible : false,
					btnAddExisting : false,
					isPackedVisible : false,
					multiselect : true
				});

				var window = Ext.create('Ext.window.Window', {
					title : 'Select',
					height : 800,
					width : 900,
					layout : 'fit',
					items : [ stockSolutionGrid.getPanel() ],
					buttons : [ {
						text : 'Pack',
						handler : function() {
							if (stockSolutionGrid.selectedStockSolutions.length > 0){
								_this.onPack.notify(stockSolutionGrid.selectedStockSolutions[0]);
							}
							window.close();
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]

				}).show();

				stockSolutionGrid.load(EXI.proposalManager.getUnpackedStockSolutions());
			}
		}));
	}

	return actions;
};

StockSolutionGrid.prototype.load = function(stockSolutions) {
	var data = [];
	for ( var i = 0; i < stockSolutions.length; i++) {
		var stockSolution = stockSolutions[i];
		if (EXI.proposalManager.getBufferById(stockSolution.bufferId) != null){
			stockSolution.buffer = EXI.proposalManager.getBufferById(stockSolution.bufferId).acronym;
		}
		stockSolution.proposal = EXI.proposalManager.getProposalById(stockSolution.proposalId).code + EXI.proposalManager.getProposalById(stockSolution.proposalId).number;
		if (EXI.proposalManager.getMacromoleculeById(stockSolution.macromoleculeId) != null){
			stockSolution.macromolecule = EXI.proposalManager.getMacromoleculeById(stockSolution.macromoleculeId).acronym;
		}
		data.push(stockSolution);
	}
	
	
	this.store.loadData(data, false);
};

StockSolutionGrid.prototype.getPanel = function() {
	return this._renderGrid();
};

StockSolutionGrid.prototype.edit = function(stockSolutionId) {
	var _this = this;
	var stockSolutionWindow = new StockSolutionWindow();
	/** On stock solution SAVED **/
	stockSolutionWindow.onSaved.attach(function(sender, stockSolution) {
		_this.onSaved.notify(stockSolution);
	});
	stockSolutionWindow.draw(EXI.proposalManager.getStockSolutionById(stockSolutionId));
};

StockSolutionGrid.prototype.unpack = function(stockSolution) {
	this.onUnpack.notify(stockSolution);
};

StockSolutionGrid.prototype._renderGrid = function() {
	var _this = this;

	/** Store **/
	this.store = Ext.create('Ext.data.Store', {
		fields :  ['proposalId',  'name', 'stockSolutionId', 'macromolecule', 'buffer', 'storageTemperature', 'volume', 'concentration', 'buffer', 'comments'],
		autoload : true
	});

	var filters = {
		ftype : 'filters',
		local : true,
		filters : this.filters
	};

	var selModel = null;

	if (this.multiselect) {
		selModel = Ext.create('Ext.selection.CheckboxModel', {
			mode : 'SINGLE',
			listeners : {
				selectionchange : function(sm, selections) {
					_this.selectedStockSolutions = [];
					for ( var i = 0; i < selections.length; i++) {
						_this.selectedStockSolutions.push(selections[i].data);
					}
				}
			}
		});
	} else {
		selModel = {
			mode : 'SINGLE'
		};
	}

	this.store.sort("stockSolutionId", "desc");

	this.grid = Ext.create('Ext.grid.Panel', {
//		style : {
//			padding : 5
//		},
		margin : 10,
		cls : 'defaultGridPanel',
		title : this.title,
//		height : this.height,
//		width : this.width,
//		minWidth : this.minWidth,
		selModel : selModel,
		store : this.store,
		columns : this._getColumns(),
		viewConfig : {
			stripeRows : true,
			listeners : {
				itemdblclick : function(dataview, record, item, e) {
					_this.edit(record.data.stockSolutionId);
				},
				cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					var adapter = null;
//					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonUnpack') {
//						_this.grid.setLoading("ISPyB: Unpacking stock solution");
//						adapter = new DataAdapter();
//						adapter.onSuccess.attach(function(sender) {
//							_this.onProposalChanged.notify();
//							_this.grid.setLoading(false);
//						});
//						adapter.onError.attach(function(sender) {
//							_this.onProposalChanged.notify();
//							_this.grid.setLoading(false);
//						});
//						record.raw.boxId = null;
//						adapter.saveStockSolution(record.raw);
//					}

					if (grid.getGridColumns()[cellIndex].getId() == _this.id + "box") {
						window.location = BUI.getShippingURL(BIOSAXS.proposal.getShipmentByDewarId(record.raw.boxId).shippingId);
					}
//					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonEdit') {
//						_this.edit(record.data.stockSolutionId);
//					}

					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonRemove') {
						_this.grid.setLoading("ISPyB: Removing stock solution");
						adapter = new BiosaxsDataAdapter();
						adapter.onSuccess.attach(function(sender) {
							_this.onProposalChanged.notify();
							_this.grid.setLoading(false);
						});
						adapter.onError.attach(function(sender) {
							_this.onProposalChanged.notify();
							_this.grid.setLoading(false);
						});
						adapter.removeStockSolution(record.data.stockSolutionId);
					}
				}
			}
		}

	});

	var actions = _this._getTopButtons();
//	this.grid.addDocked({
//		xtype : 'toolbar',
//		height : 50,
//		items : actions
//	});

	var i = null;
	this.grid.getSelectionModel().on({
		selectionchange : function(sm, selections) {
			if (selections.length) {
				for ( i = 0; i < actions.length; i++) {
					if (actions[i].enable) {
						actions[i].enable();
					}
				}
			} else {
				for ( i = 0; i < actions.length; i++) {
					if (actions[i].alwaysEnabled == false) {
						if (actions[i].disable) {
							actions[i].disable();
						}
					}
				}
			}
		}
	});
	return this.grid;
};

//StockSolutionGrid.prototype.input = function() {
//	return {
//		proposal : DATADOC.getProposal_10()
//	};
//};
//
//StockSolutionGrid.prototype.test = function(targetId) {
//	var stockSolutionGrid = new StockSolutionGrid({
//		height : 300,
//		width : 900
//	});
//	BIOSAXS.proposal = new Proposal(stockSolutionGrid.input().proposal);
//	var panel = stockSolutionGrid.getPanel();
//	stockSolutionGrid.load(BIOSAXS.proposal.getStockSolutions());
//	panel.render(targetId);
//};







































function TemplateGrid(args) {
	this.height = 500;
}




TemplateGrid.prototype.getTbar = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		icon: 'images/icon/add.png',
		text : 'Add',
		disabled : false,
		handler : function(widget, event) {
			var wizardWidget = new WizardWidget({
				windowMode : true,
				width : 1200
			});

			wizardWidget.onFinished.attach(function(sender, result) {
				var adapter = new DataAdapter();
				adapter.onSuccess.attach(function(sender, experiment) {
					wizardWidget.window.close();
					location.hash = "/experiment/experimentId/" + experiment.experimentId + "/main";
				});
				wizardWidget.current.setLoading();
				adapter.saveTemplate(result.name, "comments", result.data);
			});

			var manager = new ProposalUpdater(); 
			manager.onSuccess.attach(function(sender, proposals){
				wizardWidget.draw(this.targetId, new MeasurementCreatorStepWizardForm(ProposalManager.getMacromolecules(), ProposalManager.getBuffers()));
			});
			manager.get();
			
		}
	}));
	return actions;
};

TemplateGrid.prototype.deselectAll = function() {
	this.grid.getSelectionModel().deselectAll();
};

TemplateGrid.prototype.selectById = function(macromoleculeId) {
	this.grid.getSelectionModel().deselectAll();
	for ( var i = 0; i < this.grid.getStore().data.items.length; i++) {
		var item = this.grid.getStore().data.items[i].raw;
		if (item.macromoleculeId == macromoleculeId) {
			this.grid.getSelectionModel().select(i);
		}
	}
};

TemplateGrid.prototype.load = function(macromolecules) {
	this.store.loadData(macromolecules, false);
};

TemplateGrid.prototype.getColumns = function() {
	var _this = this;
	var columns = [
	{
		text : 'Name',
		dataIndex : 'name',
		id : this.id + "name",
		flex : 1,
		hidden : false
	},{
        xtype:'actioncolumn',
        width:40,
        text : 'Edit',
        items: [{
            icon: 'images/icon/edit.png',  // Use a URL in the icon config
            tooltip: 'Edit',
            handler: function(grid, rowIndex, colIndex) {
            	location.hash = "/experiment/experimentId/" + grid.getStore().getAt(rowIndex).get("experimentId") + "/main";
            }
        }]
    }, {
		id : _this.id + 'REMOVE',
		width : 100,
		sortable : false,
		renderer : function(value, metaData, record, rowIndex, colIndex, store) {
			return BUI.getRedButton('REMOVE');
		}
	}  ];

	if (this.btnRemoveVisible) {
		columns.push({
			id : _this.id + 'buttonRemoveMacromolecule',
			width : 85,
			sortable : false,
			renderer : function(value, metaData, record, rowIndex, colIndex, store) {
				if (_this.btnRemoveVisible) {
					return BUI.getRedButton('REMOVE');
				}
				return null;
			}
		});
	}

	return columns;
};

TemplateGrid.prototype._prepareData = function(macromolecules) {
	return macromolecules;
};

/** Returns the grid **/
TemplateGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'name',  'comments' ],
		data : [],
		sorters : [{property : 'experimentId', direction: 'desc'}]
	});


	this.grid = Ext.create('Ext.grid.Panel', {
		id : this.id,
		title : 'My Experiments',
		store : this.store,
		height : this.height,
		maxHeight : this.maxHeight,
		columns : this.getColumns(),
		width : this.width,
		viewConfig : {
			stripeRows : true,
			listeners : {
				'celldblclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
//					_this.edit(ProposalManager.getMacromoleculeById(record.data.macromoleculeId));
					location.hash = "/experiment/experimentId/" + record.data.experimentId + "/main";
				},
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
//					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonEditMacromolecule') {
//						_this.edit(ProposalManager.getMacromoleculeById(record.data.macromoleculeId));
//					}
//					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonRemoveMacromolecule') {
//						BUI.showBetaWarning();
//					}
				}

			}
		}
	});

	/** Adding the tbar **/
	this.grid.addDocked({
		xtype : 'toolbar',
		height : 50,
		items : this.getTbar()
	});
	return this.grid;
};

TemplateGrid.prototype.input = function() {
	return {
		proposal : DATADOC.getProposal_10()
	};
};

TemplateGrid.prototype.test = function(targetId) {
	var TemplateGrid = new TemplateGrid({
		width : 800,
		height : 350,
		collapsed : false,
		tbar : true
	});

	BIOSAXS.proposal = new Proposal(TemplateGrid.input().proposal);
	var panel = TemplateGrid.getPanel(BIOSAXS.proposal.macromolecules);
	panel.render(targetId);
};

function VolumeGrid() {
	this.id = BUI.id();
}

VolumeGrid.prototype.load= function(experiment) {
	this.experiment = experiment;
	this.store.loadData(this._prepareData(experiment));
};

VolumeGrid.prototype.getPanel = function(data, title) {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'name', 'volume', 'macromoleculeId', 'bufferId' ]
//		data : data
	});
	this.store.sort([ {
		property : 'name',
		direction : 'ASC'
	} ]);

	var grid = Ext.create('Ext.grid.Panel', {
		title : "Sample Requirements and existing stock solutions",
		cls : 'border-grid',
		height : 400,
		maxHeight : 400,
		width : 900,
		store : this.store,
		margin : '10 0 50 10',
//		tbar : [ 
//         {
//			text : 'Go to Shipment',
//			icon : '../images/plane-small.gif',
//			handler : function() {
//				window.location = BUI.getCreateShipmentList();
//			}
//		} ],
		viewConfig : {
			stripeRows : true,
			listeners : {
				cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonCreate') {
						var stockSolutionWindow = new StockSolutionWindow();
						/** On stock solution SAVED **/
						stockSolutionWindow.onSaved.attach(function(sender) {
							/** Proposal should be refreshed **/
							
						});
						var acronym = "ST";
						if (record.data.macromoleculeId != null) {
							acronym = acronym + "_" + EXI.proposalManager.getMacromoleculeById(record.data.macromoleculeId).acronym;
						}
						if (record.data.bufferId != null) {
							acronym = acronym + "_" + EXI.proposalManager.getBufferById(record.data.bufferId).acronym;
						}
						stockSolutionWindow.draw({
							concentration : record.data.concentration,
							macromoleculeId : record.data.macromoleculeId,
							bufferId : record.data.bufferId,
							name : acronym,
							volume : record.data.volume
						});
					}

					if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonStockSolutions') {
						var stockSolutionGrid = new StockSolutionGrid({
							btnAddVisible : false,
							btnEditVisible : false,
							btnRemoveVisible : false,
							btnAddExisting : false,
							isPackedVisible : true,
							multiselect : false
						});

						var window = Ext.create('Ext.window.Window', {
							title : 'Stock solutions by specimen',
							height : 400,
							width : 800,
							layout : 'fit',
							items : [ stockSolutionGrid.getPanel() ],
							buttons : [ {
								text : 'Close',
								handler : function() {
									window.close();
								}
							} ]

						}).show();
						stockSolutionGrid.refresh(EXI.proposalManager.getStockSolutionsBySpecimen(record.data.macromoleculeId, record.data.bufferId));
					}
				}
			}
		},
		columns : [
//			{
//				text : '',
//				dataIndex : 'macromoleculeId',
//				width : 20,
//				renderer : function(val, y, sample) {
//					if (val != null) {
////						return BUI.getRectangleColorDIV(BIOSAXS.proposal.macromoleculeColors[val], 10, 10);
//						return BUI.getRectangleColorDIV(_this.experiment.macromoleculeColors[val], 10, 10);
//					}
//				}
//			},
//			{
//				text : '',
//				dataIndex : 'bufferId',
//				width : 20,
//				renderer : function(val, y, sample) {
//					if (val != null) {
//						return BUI.getRectangleColorDIV(_this.experiment.getSpecimenColorByBufferId(val), 10, 10);
//					}
//				}
//			},
			{
				text : 'Specimen',
				dataIndex : 'name',
				flex : 0.5
			},
			{
				text : 'Estimated Volume',
				dataIndex : 'volume',
				tooltip : 'Estimation of the maximum volume needed for making this experiment',
				flex : 0.5,
				editor : {
					allowBlank : true
				},
				renderer : function(val, y, sample) {
					return BUI.formatValuesUnits(sample.data.volume, '&#181l', {
						fontSize : 16,
						decimals : 2,
						unitsFontSize : this.unitsFontSize
					});
				}
			},
			{
				text : 'Stock Solution',
//				id : _this.id + 'buttonStockSolutions',
//				dataIndex : 'name',
				flex : 0.5,
				tooltip : 'Stock Solutions containing this specimen in this proposal',
				renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					var macromoleculeId = record.data.macromoleculeId;
					var bufferId = record.data.bufferId;
					var stockSolutions = EXI.proposalManager.getStockSolutionsBySpecimen(macromoleculeId, bufferId);
					if (stockSolutions.length > 0) {
//						icon : 'images/icon/testtube.png',
						return "<div><span style='font-size:18px'>" + stockSolutions.length + "</span> x<img height='15px' src='images/icon/testtube.png'></div>";
					}

				}
			}, {
				id : _this.id + 'buttonCreate',
				text : '',
				hidden : true,
				tooltip : 'Create a new stock solution for shipping',
				width : 170,
				sortable : false,
				renderer : function(value, metaData, record, rowIndex, colIndex, store) {
					return BUI.getGreenButton('CREATE STOCK SOLUTION', {
						width : 160
					});
				}
			} ]
	});
	return grid;

};

VolumeGrid.prototype._prepareData = function(experiment) {
	var keys = {};
	for ( var i = 0; i < experiment.getSamples().length; i++) {
		var sample = experiment.getSamples()[i];
		var key = "";
		if (sample.macromoleculeId == null) {
			key = experiment.getBufferById(sample.bufferId).acronym;
			if (keys[key] == null) {
				keys[key] = {
					macromoleculeId : sample.macromoleculeId,
					name : key,
					bufferId : sample.bufferId,
					volume : 0
				};
			}
			keys[key].volume = Number(sample.volume) + Number(keys[key].volume);
		}

		if ((sample.macromolecule3VO != null) || (sample.macromoleculeId != null)) {
			macromoleculeId = sample.macromoleculeId;
			if (sample.macromoleculeId == null) {
				sample.macromoleculeId = sample.macromolecule3VO.macromoleculeId;
			}
			key = EXI.proposalManager.getMacromoleculeById(sample.macromoleculeId).acronym + " + " + experiment.getBufferById(sample.bufferId).acronym;
			if (keys[key] == null) {
				keys[key] = {
					macromoleculeId : sample.macromoleculeId,
					name : key,
					bufferId : sample.bufferId,
					volume : 0
				};
			}
			keys[key].volume = Number(sample.volume) + Number(keys[key].volume);
		}
	}
	var data = [];
	for (var keyId in keys) {
		data.push(keys[keyId]);
	}

	return data;
};

VolumeGrid.prototype.refresh = function(experiment) {
	this.experiment = experiment;
	this.macromoleculeGrid.getStore().loadData(this._prepareData(this.experiment), false);
};

VolumeGrid.prototype.render = function() {
	this.macromoleculeGrid = this.getPanel([], "Estimation of required Volume");

	return {
		xtype : 'container',
		layout : 'vbox',
		margin : "0, 0, 0, 5",
		items : [ {
			xtype : 'container',
			layout : 'hbox',
			margin : "0, 0, 0, 0",
			items : [ this.macromoleculeGrid ]
		} ]
	};
};

VolumeGrid.prototype.input = function(experiment) {
	return {
		experiment : DATADOC.getExperiment_10()
	};
};

VolumeGrid.prototype.test = function(targetId) {
	var volumeGrid = new VolumeGrid();
	BIOSAXS.proposal = new Proposal(new MeasurementGrid().input().proposal);
	var panel = volumeGrid.getPanel(new Experiment(new VolumeGrid().input().experiment));
	Ext.create('Ext.panel.Panel', {
		height : 500,
		width : 1000,
		renderTo : targetId,
		items : [ panel ]
	});
};

/**
 * It contains a set of form that we will communicate each other up to status finish is reached
 * 
 */
function WizardWidget(args) {
	this.targetId = null;
	this.width = 910;
	this.height = 400;
	this.windowMode = true;

	if (args != null) {
		if (args.windowMode != null) {
			this.windowMode = args.windowMode;
		}
		if (args.width != null) {
			this.width = args.width;
		}

	}

	this.step = 0;
	this.forms = [];

	this.onFinished = new Event(this);
}

WizardWidget.prototype.draw = function(targetId, form) {
	this.targetId = targetId;
	this.forms.push(form);
	this.renderMasterContainer();
};

WizardWidget.prototype.getButtons = function(step, onNext, onBack) {
	var _this = this;

	/** For the last step **/
	if (_this.forms[_this.step].onWizardFinished != null) {
		return [ {
			text : 'Back',
			handler : function() {
				_this.step = _this.step - 1;
				_this.renderMasterContainer();
				onBack();
				_this.forms[_this.step].reload();
			}
		}, "->", {
			text : 'Finish',
			handler : function() {
				_this.forms[_this.step].onWizardFinished.attach(function(sender, result) {
					_this.onFinished.notify(result);
				});
//				_this.step = _this.step + 1;
				onNext();
			}
		} ];
	}

	/** First **/
	if (step == 0) {
		return [ "->", {
			text : 'Next',
			handler : function() {
				_this.forms.push(_this.forms[_this.step].getNextForm());
				_this.step = _this.step + 1;
				_this.renderMasterContainer();
				onNext(_this.forms[_this.step - 1].data);
			}
		} ];
	}

	if ((this.step > 0) && (this.forms[_this.step].onWizardFinished == null)) {
		return [ {
			text : 'Back',
			handler : function() {
				_this.step = _this.step - 1;
				_this.renderMasterContainer();
				onBack();
				_this.forms[_this.step].reload();
			}
		}, "->", {
			text : 'Next',
			handler : function() {
				if (_this.forms[_this.step].onWizardFinished == null) {
					_this.forms.push(_this.forms[_this.step].getNextForm());
					_this.step = _this.step + 1;
					onNext(_this.forms[_this.step - 1].data);
					_this.renderMasterContainer();
				} else {
					_this.forms[_this.step].onWizardFinished.attach(function(sender, result) {
						_this.window.close();
						_this.onFinished.notify(result);
					});
					_this.step = _this.step + 1;
					onNext(_this.forms[_this.step - 1].data);
				}
			}
		} ];
	}

};


WizardWidget.prototype.getPanel = function(form) {
	this.forms.push(form);
	
	return Ext.create('Ext.form.Panel', {
		width : this.width,
		height : 800,
		items : [  this.forms[this.step].getForm() ],
		buttons : this.getButtons(this.step, this.forms[this.step].onNext, this.forms[this.step].onBack)
	});
};

WizardWidget.prototype.renderMasterContainer = function() {
	var _this = this;

	if (this.current != null) {
		this.current.destroy();
	}
	if (this.window != null) {
		this.window.destroy();
	}
	this.current = this.getPanel();

	if (this.windowMode == false) {
		this.current.render(this.targetId);
	} else {

		this.window = Ext.create('Ext.Window', {
			id : this.id,
			resizable : true,
			constrain : true,
			modal : true,
			frame : false,
			draggable : true,
			autoscroll : true,
			layout : {
				type : 'vbox',
				align : 'stretch'
			},
			items : this.current,
			width : this.width,
			title : "BIOSAXS Experiment Designer",
			listeners : {
				scope : this,
				minimize : function() {
					this.panel.hide();
				},
				destroy : function() {
					delete this.panel;
				}
			}
		});

		this.window.show();
	}
};
