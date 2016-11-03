/**
* This is the description for routing all the puck actions. It means url= #/autoprocintegration/*
*
* @class AutoprocIntegrationController
* @constructor
*/
function AutoprocIntegrationController() {
	this.init();
}

AutoprocIntegrationController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
AutoprocIntegrationController.prototype.notFound = ExiGenericController.prototype.notFound;

AutoprocIntegrationController.prototype.openFiles = function(dataCollectionIds) {
    var autoProcessingFileManager = new AutoProcessingFileManager();
    autoProcessingFileManager.show();
	autoProcessingFileManager.load(dataCollectionIds);
};


/**
* Inits the controller for the AutoprocIntegrationController related objects
* Paths accepted:
* #/autoprocintegration/datacollection/:datacollectionId/main
* #/autoprocintegration/datacollection/:datacollectionId/files
* #/autoprocintegration/datacollection/:datacollectionId/phasingviewer/main
* @method init
*/
AutoprocIntegrationController.prototype.init = function() {
	var _this = this;
	var listView;	
    
	Path.map("#/autoprocintegration/datacollection/:datacollectionId/main").to(function() {        
		var mainView = new AutoProcIntegrationMainView();
		EXI.addMainPanel(mainView);
		mainView.panel.setLoading(true);
        
        var listPanel = new AutoProcIntegrationListView();        
        EXI.addNavigationPanel(listPanel);
        
        listPanel.onSelect.attach(function(sender, selected){           
            mainView.load(selected);            
        });
         /** Load view for autoprocessing */
        var onSuccess2 = function(sender, data){
            mainView.load(data[0]);
            console.log(data[0]);
            mainView.panel.setLoading(false);            
            listPanel.load(data[0]);
        };
        EXI.getDataAdapter({onSuccess : onSuccess2}).mx.autoproc.getViewByDataCollectionId(this.params['datacollectionId']);
    
    
    
	}).enter(this.setPageBackground);

	Path.map("#/autoprocintegration/datacollection/:datacollectionId/files").to(function() {
		_this.openFiles(this.params['datacollectionId']);
	}).enter(this.setPageBackground);

	Path.map("#/autoprocintegration/datacollection/:datacollectionId/phasingviewer/main").to(function() {
		var mainView = new PhasingViewerMainView();		
		EXI.addMainPanel(mainView);
		mainView.load(this.params['datacollectionId']);
	}).enter(this.setPageBackground);

};

/**
* This is the description for routing all the puck actions. It means url= #/mx/datacollection/*
*
* @class BeamlineParameterController
* @constructor
*/
function BeamlineParameterController() {
	this.init();
}

BeamlineParameterController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
BeamlineParameterController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the puck related objects
* Paths accepted:
* #/mx/datacollection/protein_acronym/:acronmys/main
* #/mx/datacollection/session/:sessionId/main
*
* @method init
*/
BeamlineParameterController.prototype.init = function() {
	var _this = this;
	var listView;	

	
                
	Path.map("#/mx/beamlineparameter/datacollection/:dataCollectionId/main").to(function() {
        
		var mainView = new BeamlineParameterMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['dataCollectionId']);

	}).enter(this.setPageBackground);
};

/**
* This is the description for routing all the crystal actions. It means url= #/crystal/*
*
* @class CrystalController
* @constructor
*/
function CrystalController() {
	this.init();
}

CrystalController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
CrystalController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the crystal related objects
* Paths accepted:
* #/crystal/nav
* #/mx/crystal/:crystalId/main
*
* @method init
*/
CrystalController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/crystal/nav").to(function() {
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new CrystalListView();
			listView.onSelect.attach(function(sender, selected) {	
				location.hash = "/mx/crystal/" + selected[0].crystalId + "/main";
			});

			EXI.addNavigationPanel(listView);
			var onSuccess = function(sender, crystals) {
				listView.load(crystals);
				EXI.setLoadingNavigationPanel(false);
			};
			EXI.getDataAdapter({onSuccess : onSuccess}).mx.crystal.getCrystalsByProposalId();
	}).enter(this.setPageBackground);

	Path.map("#/mx/crystal/:crystalId/main").to(function() {
		var mainView = new CrystalMainView();
		EXI.addMainPanel(mainView);
		EXI.setLoadingMainPanel(true);
		var onSuccess = function(sender, crystal){
			mainView.load(crystal);
			EXI.setLoadingMainPanel(false);
			
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).mx.crystal.getCrystalById(this.params['crystalId']);

	}).enter(this.setPageBackground);
};

/**
* This is the description for routing all the crystal actions. It means url= #/mx/image/*
*
* @class ImageController
* @constructor
*/
function ImageController() {
	this.init();
}

ImageController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
ImageController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the crystal related objects
* Paths accepted:
* #/mx/image/:imageId/main
*
* @method init
*/
ImageController.prototype.init = function() {
	var _this = this;
	/*var listView;	

	Path.map("#/mx/image/:imageId/main").to(function() {
		var mainView = new ImageMainView();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['imageId']);

	}).enter(this.setPageBackground);*/
};

/**
* This is the description for routing all the puck actions. It means url= #/mx/datacollection/*
*
* @class MxDataCollectionController
* @constructor
*/
function MxDataCollectionController() {
	this.init();
}

MxDataCollectionController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
MxDataCollectionController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the puck related objects
* Paths accepted:
* #/mx/datacollection/protein_acronym/:acronmys/main
* #/mx/datacollection/session/:sessionId/main
*
* @method init
*/
MxDataCollectionController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/mx/datacollection/protein_acronym/:acronmys/main").to(function() {
		var mainView = new DataCollectionMxMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		var onSuccess = function(sender, data){
			mainView.loadCollections(data);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.getByAcronymList(this.params['acronmys']);
	}).enter(this.setPageBackground);
    
	Path.map("#/mx/datacollection/session/:sessionId/main").to(function() {
		var mainView = new DataCollectionMxMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		EXI.setLoadingMainPanel(true);
		var onSuccess = function(sender, data){            
		    mainView.loadCollections(data);
			EXI.setLoadingMainPanel(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.getDataCollectionViewBySessionId(this.params['sessionId']);


		var onSuccessEnergy = function(sender, data){
			mainView.loadEnergyScans(data);
			
		};
		/** retrieving energy scans */
		EXI.getDataAdapter({onSuccess : onSuccessEnergy}).mx.energyscan.getEnergyScanListBySessionId(this.params['sessionId']);

		var onSuccessXFE = function(sender, data){
			mainView.loadFXEScans(data);
			
		};
		/** retrieving XFE scans */
		EXI.getDataAdapter({onSuccess : onSuccessXFE}).mx.xfescan.getXFEScanListBySessionId(this.params['sessionId']);
        
	}).enter(this.setPageBackground);
	
    
    	Path.map("#/mx/datacollection/datacollectionid/:datacollectionid/main").to(function() {
            //1507842
		var mainView = new DataCollectionMxMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		EXI.setLoadingMainPanel(true);
		var onSuccess = function(sender, data){
		    mainView.loadCollections(data);
			EXI.setLoadingMainPanel(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.getByDataCollectionId(this.params['datacollectionid']);


		
        
	}).enter(this.setPageBackground);
    
    
	Path.map("#/mx/datacollection/:dataCollectionId/image/:imageId/main").to(function() {
		var mainView = new ImageMainView();
        EXI.hideNavigationPanel();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['imageId'], this.params['dataCollectionId']);
	}).enter(this.setPageBackground);
};

/**
* This is the description for routing all the puck actions. It means url= #/mx/prepare/*
*
* @class MxPrepare
* @constructor
*/
function MxPrepare() {
	this.init();
}

MxPrepare.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
MxPrepare.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the preparation related objects
* Paths accepted:
* #/mx/prepare/:dewarIds/main
* #/mx/prepare/main
*
* @method init
*/
MxPrepare.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/mx/prepare/main").to(function() {
		EXI.clearNavigationPanel();
	    var mainView = new PrepareMainViewTest({currentStep : 1});
		EXI.addMainPanel(mainView);
	    mainView.load();
	}).enter(this.setPageBackground);

	Path.map("#/mx/prepare/main/selectSampleChanger").to(function() {
		EXI.clearNavigationPanel();
	    var mainView = new PrepareMainViewTest({currentStep : 2});
		EXI.addMainPanel(mainView);
	    mainView.load();
	}).enter(this.setPageBackground);

	Path.map("#/mx/prepare/main/loadSampleChanger").to(function() {
		EXI.clearNavigationPanel();
	    var mainView = new PrepareMainViewTest({currentStep : 3});
		EXI.addMainPanel(mainView);
	    mainView.load();
	}).enter(this.setPageBackground);

	Path.map("#/mx/prepare/:dewarIds/main").to(function() {
		var mainView = new PrepareMainView();
		var ids = this.params['dewarIds'].split(",");
		EXI.addMainPanel(mainView);
		EXI.setLoadingMainPanel();
		var onSuccessProposal = function(sender, dewars) {
			var filtered = [];
			for(var i = 0; i< ids.length; i++){
				filtered.push(_.find(dewars, {dewarId : Number(ids[i]) }));
			}
			EXI.setLoadingMainPanel(false);
			mainView.load(filtered);
			EXI.setLoadingNavigationPanel(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccessProposal}).proposal.dewar.getDewarsByProposal();
	}).enter(this.setPageBackground);
	
};
/**
* This is the description for routing all the puck actions. It means url= #/autoprocintegration/*
*
* @class PhasingController
* @constructor
*/
function PhasingController() {
	this.init();
}

PhasingController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
PhasingController.prototype.notFound = ExiGenericController.prototype.notFound;

PhasingController.prototype.getChilds = function(node, data) {
    /** Looking for children */   
    var children = _.filter(data, function(b){ return b.previousPhasingStepId == node.phasingStepId;});
    for(var i =0; i < children.length; i++){
        children[i].children = this.getChilds(children[i], data);
    }
    return children;
};

PhasingController.prototype.tableToTree = function(data, phasingStepId) {
    var parents = _.filter(data, function(b){ return b.previousPhasingStepId == null;});

        
    for(var i =0; i < parents.length; i++){    
        parents[i].children = this.getChilds(parents[i], data);    
    }
    
    if (phasingStepId){
        parents = _.filter(parents, function(b){return b.phasingStepId == phasingStepId; });
    }
    return (parents);
    
};

/**
* Inits the controller for the PhasingController related objects
* Paths accepted:
* #/phasing/autoprocintegrationId/:autoprocintegrationId/main
* @method init
*/
PhasingController.prototype.init = function() {
	var _this = this;
	this.phasingSteps = [];

    function openNav(autoprocintegrationId){
            var listView = new PhasingListView();
			

			EXI.addNavigationPanel(listView);
			var onSuccess = function(sender, data) {
				 var tree = _this.tableToTree(_.flatten(data));               
                EXI.setLoadingNavigationPanel(false);
	            listView.load(tree);
			};
			EXI.getDataAdapter({onSuccess : onSuccess}).mx.phasing.getPhasingViewByAutoProcIntegrationId(autoprocintegrationId);
            return listView;
    }
    
	Path.map("#/phasing/autoprocintegrationId/:autoprocintegrationId/main").to(function() {
        var autoprocintegrationId = this.params['autoprocintegrationId'];
        
        EXI.clearNavigationPanel();
        /** Loading Main Panel */
		var mainView = new PhasingViewerMainView();
        
        /** Attaching events from listview */
        var listView = openNav(autoprocintegrationId);
        listView.onSelect.attach(function(sender, selected) {
				if (selected.length == 0){
                    mainView.load(_this.phasingSteps);
                }
                else{                    
                 
                    mainView.load(_this.phasingSteps, selected[0].prepare.phasingStepId);
                }
	    });
        
		EXI.addMainPanel(mainView);
        EXI.setLoadingMainPanel();
        var onSuccess = function(sender, data){
            _this.phasingSteps =   _.flatten(data);             
            EXI.setLoadingMainPanel(false);            
            mainView.load( _this.phasingSteps);//, _this.tableToTree(_.flatten(_.clone(data))));
	        //mainView.load(_.clone(data), _this.tableToTree(_.flatten(_.clone(data))));
	    };
    
	    EXI.getDataAdapter({onSuccess : onSuccess}).mx.phasing.getPhasingViewByAutoProcIntegrationId(autoprocintegrationId);
	
    
    
		
	}).enter(this.setPageBackground);

    /*
    Path.map("#/phasing/autoprocintegrationId/:autoprocintegrationId/nav").to(function() {
		  OpenNav(this.params['autoprocintegrationId']);
	}).enter(this.setPageBackground);
    */
    //http://lindemaria:8082/EXI/mx/dev.html#/phasing/autoprocintegrationId/1187809/main
};

/**
* This is the description for routing all the puck actions. It means url= #/protein/*
*
* @class ProteinController
* @constructor
*/
function ProteinController() {
	this.init();
}

ProteinController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
ProteinController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the protein related objects
* Paths accepted:
* #/protein/nav
* 
*
* @method init
*/
ProteinController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/protein/nav").to(function() {
		EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new ProteinListView();
			listView.onSelect.attach(function(sender, selected) {	
			});

			EXI.addNavigationPanel(listView);
			var onSuccessProtein = function(sender, proteins) {
				console.log(proteins);
				listView.load(proteins);
				EXI.setLoadingNavigationPanel(false);
			};
			EXI.getDataAdapter({onSuccess : onSuccessProtein}).mx.protein.getProteinByProposalId();
	}).enter(this.setPageBackground);
	Path.rescue(this.notFound);
};

/**
* This is the description for routing all the puck actions. It means url= #/puck/*
*
* @class PuckController
* @constructor
*/
function PuckController() {
	this.init();
}

PuckController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
PuckController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the puck related objects
* Paths accepted:
* #/puck/nav
* #/mx/puck/:containerId/main
* #/mx/puck/add
*
* @method init
*/
PuckController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/puck/nav").to(function() {
			EXI.addMainPanel(new PuckWelcomeMainView());
			EXI.clearNavigationPanel();
			EXI.setLoadingNavigationPanel(true);
			listView = new PuckListView();
			listView.onSelect.attach(function(sender, selected) {
				location.hash = "/mx/puck/" + selected[0].Container_containerId+ "/main";
			});

			EXI.addNavigationPanel(listView);
			var onSuccessProposal = function(sender, pucks) {
				listView.load(pucks.slice(0, 100));
				EXI.setLoadingNavigationPanel(false);
			};
			EXI.getDataAdapter({onSuccess : onSuccessProposal}).proposal.proposal.getDewarByProposalId();
	}).enter(this.setPageBackground);
	
	Path.map("#/mx/puck/:containerId/main").to(function() {
		EXI.setLoadingMainPanel(true);
		var onSuccess = function(sender, puck){
			try{
				var mainView = new PuckMainView();
				EXI.addMainPanel(mainView);
				mainView.load(puck);
			}
			catch(e){
				EXI.setError(e.message);
			}
			EXI.setLoadingMainPanel(false);	
		};
		EXI.getDataAdapter({onSuccess: onSuccess}).proposal.shipping.getContainerById(this.params['containerId'],this.params['containerId'],this.params['containerId']);
		
	}).enter(this.setPageBackground);

	Path.map("#/mx/puck/add").to(function() {
		var mainView = new PuckMainView();
		EXI.addMainPanel(mainView);
		var emptyPuck = {"containerId":"","code":null,"containerType":"Puck","capacity":16,"beamlineLocation":null,"sampleChangerLocation":null,"containerStatus":null,"timeStamp":"Jan 15, 2016 2:29:39 PM","sampleVOs":[]};
		mainView.load(emptyPuck);
	}).enter(this.setPageBackground);
};

/**
* This is the description for routing all the crystal actions. It means url= #/workflow/*
*
* @class WorkflowController
* @constructor
*/
function WorkflowController() {
	this.init();
}

WorkflowController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
WorkflowController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the crystal related objects
* Paths accepted:
* #/crystal/nav
* #/mx/crystal/:crystalId/main
*
* @method init
*/
WorkflowController.prototype.init = function() {
	var _this = this;
	var listView;	

	Path.map("#/mx/workflow/step/:workflowStepIdList/main").to(function() {
		EXI.clearNavigationPanel();
		EXI.setLoadingNavigationPanel(true);
		listView = new WorkflowStepListView();
		listView.onSelect.attach(function(sender, selected) {
			if (selected != null){
				mainView.load(selected[0]);
			}
		});
		EXI.addNavigationPanel(listView);    

		var mainView = new WorkflowStepMainView();
		EXI.addMainPanel(mainView);
		var onSuccess = function(sender, data){
			listView.load(JSON.parse(data));
			EXI.setLoadingNavigationPanel(false);
		};

		EXI.getDataAdapter({onSuccess : onSuccess}).mx.workflowstep.getWorkflowstepByIdList(this.params['workflowStepIdList']);
	}).enter(this.setPageBackground);
};

/**
* This is the description for routing all the crystal actions. It means url= #/crystal/*
*
* @class XfeController
* @constructor
*/
function XfeController() {
	this.init();
}

XfeController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
XfeController.prototype.notFound = ExiGenericController.prototype.notFound;

/**
* Inits the controller for the crystal related objects
* Paths accepted:
* #/crystal/nav
* #/mx/crystal/:crystalId/main
*
* @method init
*/
XfeController.prototype.init = function() {
	var _this = this;
	var listView;	

	

	Path.map("#/mx/xfe/:xfeFluorescenceSpectrumId/main").to(function() {
		var mainView = new XfeViewerMainView();
		EXI.addMainPanel(mainView);

		mainView.load(this.params['xfeFluorescenceSpectrumId']);

	}).enter(this.setPageBackground);
};

function ExiMX() {
	 Exi.call(this, {
		 					menu: new MXMainMenu(),
		 					anonymousMenu: new MainMenu(),
		 					controllers : [									
									new SessionController(), 									
									new OfflineExiController(), 
									new ProposalExiController(), 
									new LabContactExiController(),
									new PuckController(),
									new CrystalController(),
									new ProteinController(),
									new AutoprocIntegrationController(),
									new MxDataCollectionController(),
									new WorkflowController(),
									new MxPrepare(),
									new ImageController(),
                                    new PhasingController(),
                                    new XfeController(),
                                    new BeamlineParameterController()
									
							],
		 					headerCssClass : 'mxTitlePanel'

	 });
}

ExiMX.prototype.loadSelected = Exi.prototype.loadSelected;
ExiMX.prototype.addMainPanel = Exi.prototype.addMainPanel;
ExiMX.prototype.getSelectedDataCollections = Exi.prototype.getSelectedDataCollections;
ExiMX.prototype.addNavigationPanel = Exi.prototype.addNavigationPanel;
ExiMX.prototype.clearNavigationPanel = Exi.prototype.clearNavigationPanel;
ExiMX.prototype.clearMainPanel = Exi.prototype.clearMainPanel;
ExiMX.prototype.setLoadingNavigationPanel = Exi.prototype.setLoadingNavigationPanel;
ExiMX.prototype.setLoadingMainPanel = Exi.prototype.setLoadingMainPanel;
ExiMX.prototype.setError = Exi.prototype.setError;
ExiMX.prototype.setLoading = Exi.prototype.setLoading;
ExiMX.prototype.show = Exi.prototype.show;
ExiMX.prototype.setAnonymousMenu = Exi.prototype.setAnonymousMenu;
ExiMX.prototype.setUserMenu = Exi.prototype.setUserMenu;
ExiMX.prototype.appendDataAdapterParameters = Exi.prototype.appendDataAdapterParameters;
ExiMX.prototype.hideNavigationPanel = Exi.prototype.hideNavigationPanel;
ExiMX.prototype.showNavigationPanel = Exi.prototype.showNavigationPanel;
 

ExiMX.prototype.getHeader = function(){
    var html = "";
    var data = {
        version         : ExtISPyB.version,
        release_date    : ExtISPyB.release_date
       
        
    };
    dust.render("mxheader", data, function(err, out){
		html = out;
     });
    return html;	
};

ExiMX.prototype.getDataAdapter = function(args){
	return  new MxDataAdapterFactory(this.appendDataAdapterParameters(args));
};

function MXMainMenu() {
	this.id = BUI.id();
	 MainMenu.call(this, {cssClass : 'mxMainMenu'});
}

MXMainMenu.prototype.populateCredentialsMenu = MainMenu.prototype.populateCredentialsMenu;
MXMainMenu.prototype.init = MainMenu.prototype.init;
MXMainMenu.prototype.getPanel = MainMenu.prototype.getPanel;
MXMainMenu.prototype._convertToHTMLWhiteSpan = MainMenu.prototype._convertToHTMLWhiteSpan;
MXMainMenu.prototype.getAddCredentialMenu = MainMenu.prototype.getAddCredentialMenu;
MXMainMenu.prototype.getLoginButton = MainMenu.prototype.getLoginButton;
MXMainMenu.prototype.setText = MainMenu.prototype.setText;
MXMainMenu.prototype.getHomeItem = MainMenu.prototype.getHomeItem;
MXMainMenu.prototype.getHelpMenu = MainMenu.prototype.getHelpMenu;
MXMainMenu.prototype.getShipmentItem = MainMenu.prototype.getShipmentItem;

MXMainMenu.prototype.getMenuItems = function() {
	return [
		this.getHomeItem(),
		this.getShipmentItem(),
		{
                text : this._convertToHTMLWhiteSpan("Proteins and Crystals"),
                cls : 'ExiSAXSMenuToolBar',
                disabled : true,
                menu : this.getProteinCrystalsMenu() 
	    	},
	    	{
                text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
                cls : 'ExiSAXSMenuToolBar',
                disabled : false,
                handler : function(){
                    location.hash = "/mx/prepare/main";
                }
	    	},
        	{
			text : this._convertToHTMLWhiteSpan("Data Explorer"),
			cls : 'ExiSAXSMenuToolBar',
			menu : this.getDataExplorerMenu() 
		},
		{
			text : this._convertToHTMLWhiteSpan("Offline Data Analysis"),
			cls : 'ExiSAXSMenuToolBar',
            disabled : true,
			menu : this.getOnlineDataAnalisysMenu() 
		}, 
		{
			text : this._convertToHTMLWhiteSpan("Help"),
			cls : 'ExiSAXSMenuToolBar',
             disabled : true,
			menu : this.getHelpMenu() 
		}, 
		'->',
		{
			xtype : 'textfield',
			name : 'field1',
			value : '',
			emptyText : 'search by protein acronym',
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == e.ENTER) {
						location.hash = "/mx/datacollection/protein_acronym/" + field.getValue() + "/main";
					}
				} 
			} 
		}
	];
};



MXMainMenu.prototype.getOnlineDataAnalisysMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Dimple") {
			location.hash = "/tool/dimple/main";
		}
		if (item.text == "Job list") {
			location.hash = "/tool/list";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [
//		{
//		    text: 'Radio Options',
//		    menu: {        // <-- submenu by nested config object
//		        items: [
//		            // stick any markup in a menu
//		            '<b class="menu-title">Choose a Theme</b>',
//		            {
//		                text: 'Aero Glass',
//		                checked: true,
//		                group: 'theme',
//		                checkHandler: onItemCheck
//		            }, {
//		                text: 'Vista Black',
//		                checked: false,
//		                group: 'theme',
//		                checkHandler: onItemCheck
//		            }, {
//		                text: 'Gray Theme',
//		                checked: false,
//		                group: 'theme',
//		                checkHandler: onItemCheck
//		            }, {
//		                text: 'Default Theme',
//		                checked: false,
//		                group: 'theme',
//		                checkHandler: onItemCheck
//		            }
//		        ]
//		    }
//		},
		{
			text : 'Dimple',
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
 

MXMainMenu.prototype.getProteinCrystalsMenu = function() {
	function onItemCheck(item, checked) {
		if (item.text == "My Crystals") {
			location.hash = "/crystal/nav";
		}
		if (item.text == "My Proteins") {
			location.hash = "/protein/nav";
		}
		if (item.text == "Puck") {
			location.hash = "/puck/nav";
		}
	}
	return Ext.create('Ext.menu.Menu', {
		items : [ 
			{
				text : 'My Crystals',
				icon : '../images/icon/macromolecule.png',
				handler : onItemCheck 
			},
			{
				text : 'My Proteins',
				icon : '../images/icon/testtube.png',
				handler : onItemCheck 
			},
			{
				text : 'Puck',
				icon : '../images/icon/testtube.png',
				handler : onItemCheck 
			}
		] 
	});
};

MXMainMenu.prototype.getDataExplorerMenu = function() {
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


/**
* AutoProcIntegrationListView displays the crystal as list on the navigation panels
*
* @class PuckListView
* @constructor
*/
function AutoProcIntegrationListView(){
	ListView.call(this);
}


AutoProcIntegrationListView.prototype.getPanel = ListView.prototype.getPanel;
AutoProcIntegrationListView.prototype.load = ListView.prototype.load;
AutoProcIntegrationListView.prototype.getFilter = ListView.prototype.getFilter;
AutoProcIntegrationListView.prototype.getFields = ListView.prototype.getFields;
AutoProcIntegrationListView.prototype.getColumns = ListView.prototype.getColumns;


AutoProcIntegrationListView.prototype.getRow = function(record){
	var html = "";
	dust.render("autoprocintegration.listview", record.data, function(err, out){
        
        	html = out;
    });
	return html;
};



/**
* CrystalListView displays the crystal as list on the navigation panels
*
* @class PuckListView
* @constructor
*/
function CrystalListView(){
	ListView.call(this);
}


CrystalListView.prototype.getPanel = ListView.prototype.getPanel;
CrystalListView.prototype.load = ListView.prototype.load;
CrystalListView.prototype.getFilter = ListView.prototype.getFilter;
CrystalListView.prototype.getFields = ListView.prototype.getFields;
CrystalListView.prototype.getColumns = ListView.prototype.getColumns;


CrystalListView.prototype.getRow = function(record){
	var html = "";
	dust.render("crystal.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};



/**
* DewarListView displays the dewars as list on the navigation panels
*
* @class DewarListView
* @constructor
*/
function DewarListView(){
	this.title = "Dewars";
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
}


DewarListView.prototype.getPanel = ListView.prototype.getPanel;
DewarListView.prototype.load = ListView.prototype.load;
DewarListView.prototype.getFields = ListView.prototype.getFields;
DewarListView.prototype.getColumns = ListView.prototype.getColumns;

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
DewarListView.prototype.getRow = function(record){
    var html = "";
    dust.render("dewarlistview", record.data, function(err, out){
        html = out;
     });
    return html;
};


/**
* PhasingListView displays the phasing steps as list on the navigation panels
*
* @class PhasingListView
* @constructor
*/
function PhasingListView(){
	this.title = "Space Groups";
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
}


PhasingListView.prototype.getPanel = ListView.prototype.getPanel;
PhasingListView.prototype.load = ListView.prototype.load;
PhasingListView.prototype.getFields = ListView.prototype.getFields;
PhasingListView.prototype.getColumns = ListView.prototype.getColumns;
PhasingListView.prototype.getFilter = ListView.prototype.getFilter;
/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
PhasingListView.prototype.getRow = function(record){
    
    
    var html = "";
    dust.render("phasinglistview", record.data, function(err, out){
        html = out;
     }); 
    return html;
};

PhasingListView.prototype.analysizeStep = function(step){
        console.log(step);
        return {
            type : step.phasingStepType
            
        };
};


PhasingListView.prototype.parsePrepareNode = function(node){
    
    return  {
                    type : "PREPARE",
                    spaceGroupShortName : node.spaceGroupShortName,
                    spaceGroup          : node.spaceGroup,
                    status              : "Success" ,
                    phasingStepId       : node.phasingStepId
                     
                };
};

PhasingListView.prototype.parseSubstructureNode = function(node){
   if (node){
       if (node.children){
            var status = "Failure";
            if (node.children.length > 0){
                status = "Success";                
            }
            
             if (node.children.length == 0){
                status = "Not found";                
            }
            
            return  {
                    type : "SUBS. DETERMINATION",
                    spaceGroupShortName : node.spaceGroupShortName,
                    spaceGroup          : node.spaceGroup,  
                    runs                : node.children.length,
                    status              : status  
                };
       }
   }
};


PhasingListView.prototype.getSubstructureStep = function(node){
     if (node){
       if (node.children){
          return node.children;
       }
   }
   return [];
};

PhasingListView.prototype.getPhasingSteps = function(node){
    var phasing = [];
     if (node){
      var subtructures = this.getSubstructureStep(node);
     
      for(var i = 0; i < subtructures.length; i++){
         
          phasing = _.concat(phasing, subtructures[i].children);
      }
   }
   return phasing;
};

PhasingListView.prototype.getModelSteps = function(node){
    var models = [];
   var phasingSteps = this.getPhasingSteps(node); 
  
   for(var i = 0; i < phasingSteps.length; i++){
        if (phasingSteps[i].children){ 
            models = _.concat(models, phasingSteps[i].children);    
        }
   } 
   return models;
};

PhasingListView.prototype.decideGoodStatus = function(metrics, stats){
    var ccPartial = false;
    var pseudo = false;
         
    for(var i =0; i< metrics.length; i++){     
        if (metrics[i].indexOf("CC of partial") != -1){
            if (Number(stats[i]) > 24){
                ccPartial = true;                
            }
        }  
        
         if (metrics[i].indexOf("Pseudo_free_CC") != -1){
            if (Number(stats[i]) > 65){
                
                pseudo = true;
            }
        } 
        
    }
    
    if (pseudo && ccPartial){
            return 1;
    } 
        
    return 0;
};

PhasingListView.prototype.analizePhasingNodes = function(phasingNodes){
    var records = {
      withStatistics : 0,
      withoutStatistics : 0,
      successCondition : 0  
        
        
    };
    for(var i = 0; i < phasingNodes.length; i++){
     
        if (phasingNodes[i].statisticsValue != null){
            records.withStatistics = records.withStatistics + 1;
            /** Parsing status */
            try{
            
                var statistics = phasingNodes[i].statisticsValue.split(",");
                var metrics = phasingNodes[i].metric.split(",");
                
                records.successCondition = records.successCondition + this.decideGoodStatus(metrics, statistics);
             
            }
            catch(e){
                
                console.log(e);
            }
        }
        else{
             records.withoutStatistics = records.withoutStatistics + 1;
        }
       
        
    }
    return records;
};
PhasingListView.prototype.parsePhasingNode = function(node){
   if (node){
       if (node.children){
           
           var phasingSteps = this.getPhasingSteps(node); 
           
            var status = "Failure";
            if (phasingSteps.length > 0){
                status = "Success";                
            }
            
             if (phasingSteps.length == 0){
                status = "Not found";                
            }
                    
            return  {
                    type : "PHASING",
                    runs                : phasingSteps.length ,
                    status              : status,
                    stats              : this.analizePhasingNodes(phasingSteps)
                };
       }
   }
};

PhasingListView.prototype.parseModelNode = function(node){
    
    var models = this.getModelSteps(node);   
    
     var status = "Failure";
    if (models.length > 0){
        status = "Success";                
    }
    
        if (models.length == 0){
        status = "Not found";                
    }
                   
    return  {
            type : "MODEL BUILDING",
            //spaceGroupShortName : node.spaceGroupShortName,
            // spaceGroup          : node.spaceGroup,  
            runs                : models.length ,
             status              : status
        };
     
   
};


PhasingListView.prototype.formatData = function(data){
    
   
    var records = [];
    if (data){
        for(var i =0; i < data.length; i++){
            
            records.push({
                prepare        : this.parsePrepareNode(data[i]),
                substructure   : this.parseSubstructureNode(data[i]), 
                phasing        : this.parsePhasingNode(data[i]), 
                models         : this.parseModelNode(data[i]),   
            });
            
        }
    
    }
    return records;
};
function ProteinListView(){
	ListView.call(this);
}

ProteinListView.prototype.getPanel = ListView.prototype.getPanel;
ProteinListView.prototype.load = ListView.prototype.load;


ProteinListView.prototype.getRow = function(record){
	var html = "<table class='listView'>";
		html = html + "<tr><td>Acronym:</td><td style='color:#207a7a;font-weight:bold;'>" + record.data.acronym+ "</td></tr>";
		html = html + "<tr><td>Name:</td><td>" + record.data.name+ "</td></tr>";
	return html + "</table>";
};

ProteinListView.prototype.getFilter = function(value){
	return [{property : "acronym", value : value, anyMacth : true}];
};

ProteinListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Proteins',  flex: 1, dataIndex: 'bufferId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

ProteinListView.prototype.getFields = function(){
	return  ['acronym', 'name'];
};


/**
* PuckListView displays the pucks as list on the navigation panels
*
* @class PuckListView
* @constructor
*/
function PuckListView(){
	this.title = "Pucks";
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
}

PuckListView.prototype.getPanel = ListView.prototype.getPanel;
PuckListView.prototype.load = ListView.prototype.load;
PuckListView.prototype.getFilter = ListView.prototype.getFilter;
PuckListView.prototype.getFields = ListView.prototype.getFields;
PuckListView.prototype.getColumns = ListView.prototype.getColumns;

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
PuckListView.prototype.getRow = function(record){
	var html = "";
	dust.render("puck.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};






function WorkflowStepListView(){
	ListView.call(this);
}

WorkflowStepListView.prototype.getPanel = ListView.prototype.getPanel;
WorkflowStepListView.prototype.load = ListView.prototype.load;


WorkflowStepListView.prototype.getRow = function(record){
    var html = "";
    record.data.imageURL = EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(record.data.workflowStepId);
    dust.render("workflowstepmain_steps", record.data, function(err, out){
		html = out;
     });
     return html;

};

WorkflowStepListView.prototype.getFilter = function(value){
	return [{property : "acronym", value : value, anyMacth : true}];
};

WorkflowStepListView.prototype.getColumns = function(){
	var _this = this;
	return  [
		        { text: 'Workflows',  flex: 1, dataIndex: 'bufferId', 
		        	renderer : function(list, token, record){
		        		return _this.getRow(record);
		        } }
		    ];
};

WorkflowStepListView.prototype.getFields = function(){
	return  ['acronym', 'name'];
};


function AutoprocessingRanker(){
    
    
}

/**
 * Filter by space group and lower rMerge
 * 
 */
AutoprocessingRanker.prototype.rank = function(array, spacegroudFieldName, rmergeFieldName){
    array = array.sort(function(a1, a2){        
         var spaceGroudTrimmed1 = a1[spacegroudFieldName].replace(/\s+/g, '');
         var spaceGroudTrimmed2 = a2[spacegroudFieldName].replace(/\s+/g, '');
        
         var space1 = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed1);
         var space2 = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed2);
        
         /** Sort by rmerge */
         if (space2 -  space1 == 0){
             var rmerge1 = a1["overall"]["rMerge"];
             var rmerge2 = a2["overall"]["rMerge"];
             
             if (rmerge1){
                 if (rmerge2){
                     return rmerge1 - rmerge2;
                 }
                 else{
                     return 1;
                 }
             }
             return -1;
             
         }
         return space2 -  space1;
      
    });
    for(var i =0; i < array.length; i++){            
            array[i].rank = i + 1;
    }
    return array;
};

AutoprocessingRanker.prototype.sortBySpaceGroup = function(array, spacegroudFieldName){
    try{
        for(var i =0; i < array.length; i++){
            var spaceGroudTrimmed = array[i][spacegroudFieldName].replace(/\s+/g, '');
            array[i].rank = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed);
        }
        
    }
    catch(e){
        return array;
    }
    return array;
};

AutoprocessingRanker.prototype.sortByRMergeLower = function(array, spacegroudFieldName){
    try{
        for(var i =0; i < array.length; i++){
            var spaceGroudTrimmed = array[i][spacegroudFieldName].replace(/\s+/g, '');
            array[i].rank = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed);
        }
        
    }
    catch(e){
        return array;
    }
    return array;
};

function AutoProcIntegrationAttachmentGrid(args) {
	this.id = BUI.id();	
	this.maxHeight = 300;
}

AutoProcIntegrationAttachmentGrid.prototype.load = function(data) {
    if (data){
	       this.store.loadData(data, false);
    }
};

AutoProcIntegrationAttachmentGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [  ]
	});
    	
	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Auto-Processing Files',
		store : this.store,
		cls : 'border-grid',
		margin : 5,
		overflow :'auto',
        height : 500,
		columns : [ 		
                    {
                        text : 'fileName',
                        dataIndex : 'fileName',
                        flex : 1,
                        renderer : function(grid, opt, val, val2, val3){
                            var url = EXI.getDataAdapter().mx.autoproc.getDownloadAttachmentUrl(val.data.autoProcProgramAttachmentId);
                            return '<a href="'+ url + '">'+ val.data.fileName + '</a>';				
                        }
                    }
		],
		flex : 1,
		viewConfig : {
			stripeRows : true
		}
	});
	return this.panel;
};

/**
* It shows information from the autoprocessing like cells (a,b,c,alpha,beta,gamma) and also about phasing
*
* @class AutoProcIntegrationGrid
* @constructor
*/
function AutoProcIntegrationGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	
	this.preventSelection = false;
	this.maxHeight = 500;
	this.minHeight = 500;
    this.minHeight = 500;
      
    this.collapsed = true;
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
        
		if (args.maxHeight != null) {
			this.maxHeight = args.maxHeight;
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
	this.onSelected = new Event(this);
}

AutoProcIntegrationGrid.prototype.parseData = function(data) {
     /** Adding stats */
    for(var i = 0; i < data.length; i++){
         try{             
            data[i].statistics = this.getStatistics(data[i]);
            data[i].collapsed = this.getCollapseStatistics(data[i]);
            data[i].phasing = this.getPhasing(data[i]);    
                      
            data[i].downloadFilesUrl = EXI.getDataAdapter().mx.autoproc.downloadAttachmentListByautoProcProgramsIdList(data[i].v_datacollection_summary_phasing_autoProcProgramId);
            console.log(data[i].downloadFilesUrl);                                          
         }
         catch(e){
             
         }  
    }
    
    var anomalous = _.filter(data, function(o) { return o.v_datacollection_summary_phasing_anomalous; });
    var nonanomalous = _.filter(data, function(o) { return o.v_datacollection_summary_phasing_anomalous == false; });
    /**Set non anomalous first */
    data = new AutoprocessingRanker().rank(anomalous, "v_datacollection_summary_phasing_autoproc_space_group");    
    data = _.concat(new AutoprocessingRanker().rank(nonanomalous, "v_datacollection_summary_phasing_autoproc_space_group"),data);    
    return data;
};

AutoProcIntegrationGrid.prototype.load = function(data) {      
    this.data =this.parseData(data);
       
    if (this.collapsed){        
        this.loadCollapsed(this.data);
    }
    else{
       
	    this.store.loadData(this.data, false);
    }
};

AutoProcIntegrationGrid.prototype.loadCollapsed = function(data) {
	this.store.loadData([{ collapsed : true, items : data}], false);
};

AutoProcIntegrationGrid.prototype.selectRowByAutoProcIntegrationId = function(autoProcIntegrationId) {
	this.preventSelection = true;
	this.panel.getSelectionModel().select(this.store.find("v_datacollection_summary_phasing_autoProcIntegrationId", autoProcIntegrationId));
};

AutoProcIntegrationGrid.prototype.getPhasing = function(data) {      
    var phasing = [];
    
    if (data.spaceGroupShortName){        
        var spaceGroups = data.spaceGroupShortName.split(',');
        var steps = data.phasingStepType.split('PREPARE');        
        for(var i = 0; i < spaceGroups.length; i++){            
            phasing.push({
                spaceGroup              : spaceGroups[i],
                prepare                 : true,
                sub                     : steps[i+1].indexOf("SUBSTRUCTUREDETERMINATION") != -1,
                phasing                 : steps[i+1].indexOf("PHASING") != -1,
                model                   : steps[i+1].indexOf("MODEL") != -1,
                autoProcIntegrationId   : data.v_datacollection_summary_phasing_autoProcIntegrationId
            });
        }
        
        
    }
    return phasing;
};                 

AutoProcIntegrationGrid.prototype.getCollapseStatistics = function(data) {	                    
    var type = data.scalingStatisticsType.split(",");
    function getValue(attribute, i, decimals){
        
        if (attribute){
            var splitted = attribute.split(",");
            if (splitted[i]){
                if (decimals){
                    try{ 
                        return Number( splitted[i]).toFixed(decimals)
                    }
                    catch(e){
                        return "NaN";
                    }
                }
                return splitted[i];
            }
        }
        return "";        
     }      
    
     for (var i = 0; i < type.length; i++) {
        if (type[i]){           
                data[type[i]] = {
                                            type 					: type[i],
                                            resolutionLimitLow 		: getValue(data.resolutionLimitLow, i,1),
                                            resolutionLimitHigh 	: getValue(data.resolutionLimitHigh, i,1),
                                            multiplicity 			: getValue(data.multiplicity, i, 1),
                                            meanIOverSigI 			: getValue(data.meanIOverSigI, i, 1),
                                            completeness 			: getValue(data.completeness, i, 1),
                                            rMerge 			        : getValue(data.rMerge, i, 1),
                                            ccHalf 			        : getValue(data.ccHalf, i,1),
                                            rPimWithinIPlusIMinus 	: getValue(data.rPimWithinIPlusIMinus, i,1),
                                            rMeasAllIPlusIMinus 	: getValue(data.rMeasAllIPlusIMinus, i,1)
                                           
                                            
               };            
        }       
    }        
    return data;    				
};


AutoProcIntegrationGrid.prototype.getStatistics = function(data) {	                    
    var type = data.scalingStatisticsType.split(",");
    function getValue(attribute, i, decimals){        
        if (attribute){
            var splitted = attribute.split(",");
            if (splitted[i]){
                if (decimals){
                    try{ 
                        return Number( splitted[i]).toFixed(decimals)
                    }
                    catch(e){
                        return "NaN";
                    }
                }
                return splitted[i];
            }
        }
        return "";        
    }
    
    var parsed = [];
    for (var i = 0; i < type.length; i++) {       
        parsed.push({
            type 					: type[i],
            resolutionLimitLow 		: getValue(data.resolutionLimitLow, i),
            resolutionLimitHigh 	: getValue(data.resolutionLimitHigh, i),
            multiplicity 			: getValue(data.multiplicity, i),
            meanIOverSigI 			: getValue(data.meanIOverSigI, i),
            completeness 			: getValue(data.completeness, i),
            rMerge 			        : getValue(data.rMerge, i),
            ccHalf 			        : getValue(data.ccHalf, i),
            rPimWithinIPlusIMinus 	: getValue(data.rPimWithinIPlusIMinus, i),
            rMeasAllIPlusIMinus 	: getValue(data.rMeasAllIPlusIMinus, i)
            
        });
        
    }
            
    return parsed;    				
};

AutoProcIntegrationGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		
		fields : [ 'autoProcId',
		           'refinedCellA', 
                   'v_datacollection_summary_phasing_autoProcIntegrationId',
		           'autoProcIntegrationId',
		           'v_datacollection_summary_phasing_anomalous',
		           'v_datacollection_summary_phasing_processingPrograms',
		           'v_datacollection_summary_phasing_autoproc_space_group']
	});
  
	
	this.panel = Ext.create('Ext.grid.Panel', {		
		store : this.store,		
        //tbar: this.getToolBar(),
        margin : 10,
		//cls : 'border-grid',
        height : this.height,
        layout : 'fit',
		columns : [             
                    {
                        text : 'autoProcIntegrationId',
                        dataIndex : 'processingPrograms',
                        flex : 1,
                        hidden : true,
                        renderer : function(e, sample, record){
                            return record.data.v_datacollection_summary_phasing_autoProcIntegrationId;
                        }
                    },        
                    {
                        dataIndex: 'dataCollectionGroup',
                        name: 'dataCollectionGroup',
                        flex: 1.5,
                        hidden: false,
                        renderer: function(grid, e, record) {                            
                            var data = record.data;                            
                            var html = "";                                                                      
                            if (_this.collapsed){              
                                dust.render("collapsed.autoprocintegrationgrid.template", data.items, function(err, out) {
                                    html = html + out;
                                
                                });
                            }
                            else{
                                dust.render("autoprocintegrationgrid.template", data, function(err, out) {
                                    html = html + out;
                                
                                });
                                
                            }
                            return html;
                        }
                    }                        		
		],
		flex : 1,
          viewConfig : {
                preserveScrollOnRefresh : true,
                stripeRows              : false,                
	    	}
	});

    this.panel.on('boxready', function() {
        _this.attachCallBackAfterRender();
    });
	return this.panel;
};


/*
AutoProcIntegrationGrid.prototype.getToolBar = function() {
    var _this = this;
    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
        items: [
            {
                xtype: 'checkboxfield',
                boxLabel: 'Summary',
                checked : true,
                id: this.id + "_collapse",
                listeners: {
                    change: function(field, e) {
                        _this.collapsed = e;
                        _this.load(_this.data);
                        _this.attachCallBackAfterRender();
                     
                    }
                }
            }
          
        ]
    });
};*/
/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
AutoProcIntegrationGrid.prototype.attachCallBackAfterRender = function() {
    var _this = this;    
    var timer3 = setTimeout(function() {
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href"); // activated tab  
                var autoprocProgramId = null;              
                /** Activate tab of data collections */
                if (target.startsWith("#tab_files_")){
                    var onSuccess = function(sender, data){
                        var html = "";                                                
                        if (data){
                            for (var i = 0; i < data[0].length; i++) {
                                var element = data[0][i];    
                                                            
                                element.url =  EXI.getDataAdapter().mx.autoproc.getDownloadAttachmentUrl(data[0][i].autoProcProgramAttachmentId); 
                            }
                            dust.render("files.autoprocintegrationgrid.template", data[0], function(err, out) {                                                                                               
                                html = html + out;
                            });
                            $(target).html(html);
                        }
                    };
                    var onError = function(sender, data){
                        $(target).html("Error retrieving data");
                    };
                     /** Retrieve data collections */
                    autoprocProgramId = target.slice(11);
                    EXI.getDataAdapter({onSuccess:onSuccess, onError:onError}).mx.autoproc.getAttachmentListByautoProcProgramsIdList(autoprocProgramId);
                }
                
                
                 if (target.startsWith("#plots")){
                        /** Get autoprocIntegrationId */
                        autoprocProgramId = target.slice(6);
                        /** Rfactor */
                        var rFactorPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Rfactor vs Resolution",
		                    legend : 'never',
                            targetId : "rFactor_" + autoprocProgramId + "_plot"
	                    });                             
                        $("#rFactor_" + autoprocProgramId).html(rFactorPlotter.getHTML());                         
                        rFactorPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleRfactor(autoprocProgramId));
                        
                           /** Rfactor */
                        var completenessPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Completeness vs Resolution",
		                    legend : 'never',
                            targetId : " completeness_" + autoprocProgramId + "_plot"
	                    });                             
                        $("#completeness_" + autoprocProgramId).html(completenessPlotter.getHTML());                         
                        completenessPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCompleteness(autoprocProgramId));
	                  
                      	var isigmaPlotter = new AutoProcIntegrationCurvePlotter({
                            height :250,
                            title : "I/SigmaI vs Resolution",
                            legend : 'never',
                            targetId : " sigmaI_" + autoprocProgramId + "_plot"
                        });
                        $("#sigmaI_" + autoprocProgramId).html(isigmaPlotter.getHTML());                         
                        isigmaPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleISigma(autoprocProgramId));
	                  
                      
                       var cc2Plotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "CC/2 vs Resolution",
                            legend : 'never',
                            targetId : "cc2_" + autoprocProgramId + "_plot"
                        });
                         $("#cc2_" + autoprocProgramId).html(cc2Plotter.getHTML());                         
                        cc2Plotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCC2(autoprocProgramId));
	                  
                       var sigmaAnnoPlotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "SigAno vs Resolution",
                            legend : 'never',
                            targetId : "sigmaAnno_" + autoprocProgramId + "_plot"
                        });
                         $("#sigmaAnno_" + autoprocProgramId).html(sigmaAnnoPlotter.getHTML());                         
                        sigmaAnnoPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleSigmaAno(autoprocProgramId));
                        
                          var annoCorrPlotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "Anom Corr vs Resolution",
                            legend : 'never',
                            targetId : "anno_" + autoprocProgramId + "_plot"
                        });
                         $("#anno_" + autoprocProgramId).html(annoCorrPlotter.getHTML());                         
                        annoCorrPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleAnnoCorrection(autoprocProgramId));	                  
                 }                                
            });
    }, 1000);
};


/**
* Main view for autoprocessing. It displays a grid with a summary of the information of autoprocessing and phasing
* On the right it displays a panel with the plots: completeness, rfacor, cc2, etc.. as well as the list of attachments
*
* @class AutoProcIntegrationMainView
* @constructor
*/
function AutoProcIntegrationMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	var _this = this;
    this.id = BUI.id();
	
    /* _this.programAttachments = [];
     _this.programAttachmentsAutoProcProgramIds = [];
	
	this.slaveWidth = 450;
	*/
	this.autoProcIntegrationGrid = new AutoProcIntegrationGrid({height:300});
	
	/*this.autoProcIntegrationGrid.onSelected.attach(function(sender, records){
		var ids = [];        
		for (var i = 0; i < records.length; i++) {
			ids.push(records[i].v_datacollection_summary_phasing_autoProcIntegrationId);
		}		
		
		try{
			_this.loadPlots(ids);
		}
		catch(e){
            console.log("Error loading plots");    
        }	        			
	});*/

}

AutoProcIntegrationMainView.prototype.getPanel = MainView.prototype.getPanel;


AutoProcIntegrationMainView.prototype.getContainer = function() {
    var height = 200;
    var width = 300;
	this.panel = Ext.create('Ext.container.Container', {
            layout: {
                type: 'fit'
            },
            //margin :10,
            //cls : 'border-grid',         
            items: [
              this.autoProcIntegrationGrid.getPanel(),
              {
                  xtype: 'container',
                  layout : 'hbox',
                  margin : 20,
                  items : [{
                      
                      html : '<div id="rfactor">rfactor</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                     
                      html : '<div id="completeness">completeness</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                        html : '<div id="sigmaI">sigmaI</div>',
                    
                      width : width,
                      height :height                                            
                  }
                  ]                                    
              },
               {
                  xtype: 'container',
                  layout : 'hbox',
                  margin : 20,
                  items : [{
                     
                       html : '<div id="cc2">cc2</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                    
                      html : '<div id="sigmaAnno">sigmaAnno</div>',
                      width : width,
                      height :height                                            
                  },
                  {
                      html : '<div id="anno">anno</div>',
                      width : width,
                      height :height                                            
                  }
                  ]                                    
              }
              ]
        });
        return this.panel;
};

/**
* It loads the list of attachments and stores them into two class variables:
* _this.programAttachmentsAutoProcProgramIds with the ids of the autoprocprograms
* _this.programAttachments with a list of attachments
* @method loadAttachments
*/
/*
AutoProcIntegrationMainView.prototype.loadAttachments = function(autoProcessingIntegrationList) {
    var _this = this;
    
  
	var onSuccess = function(sender, data){
        _this.programAttachments = (data);
	};
    _this.programAttachmentsAutoProcProgramIds = _.map(autoProcessingIntegrationList, 'v_datacollection_summary_phasing_autoProcProgramId');
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getAttachmentListByautoProcProgramsIdList(_this.programAttachmentsAutoProcProgramIds);
};	
*/
/**
* It loads autoproc.getViewByDataCollectionId from autoprocessingdataadapter and call to loadAttachments
* @method load
*/
AutoProcIntegrationMainView.prototype.load = function(data) {
	var _this = this;
	this.panel.setTitle("Autoprocessing");
	
	
	this.autoProcIntegrationGrid.load(data);
    
    
    var autoprocProgramId = [];
    for (var i = 0; i < data.length; i++) {
        if (data[i].v_datacollection_summary_phasing_autoProcProgramId){
            autoprocProgramId.push(data[i].v_datacollection_summary_phasing_autoProcProgramId);
        }
        
    }
   
   
    var annoCorrPlotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "Anom Corr vs Resolution",
                          //  legend : 'never',
                            targetId : "anno"
    });
    $("#anno").html(annoCorrPlotter.getHTML());                         
    annoCorrPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleAnnoCorrection(autoprocProgramId));	                  
       
    var sigmaAnnoPlotter = new AutoProcIntegrationCurvePlotter({
        height : 250,
        title : "SigAno vs Resolution",
     //   legend : 'never',
        targetId : "sigmaAnno"
    });
        $("#sigmaAnno" + autoprocProgramId).html(sigmaAnnoPlotter.getHTML());                         
    sigmaAnnoPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleSigmaAno(autoprocProgramId));
                       
     var cc2Plotter = new AutoProcIntegrationCurvePlotter({
                            height : 250,
                            title : "CC/2 vs Resolution",
                         //   legend : 'never',
                            targetId : "cc2"
                        });
    $("#cc2").html(cc2Plotter.getHTML());                         
    cc2Plotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCC2(autoprocProgramId));
	                     
       
       
       
        var rFactorPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Rfactor vs Resolution",
		                  //  legend : 'never',
                            targetId : "rfactor"
	                    });                             
                        $("#rfactor").html(rFactorPlotter.getHTML());                         
                        rFactorPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleRfactor(autoprocProgramId));
                        
                           /** Rfactor */
                        var completenessPlotter = new AutoProcIntegrationCurvePlotter({
		                    height : 250,
		                    title : "Completeness vs Resolution",
		                   // legend : 'never',
                            targetId : " completeness"
	                    });                             
                        $("#completeness").html(completenessPlotter.getHTML());                         
                        completenessPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleCompleteness(autoprocProgramId));
	                  
                      	var isigmaPlotter = new AutoProcIntegrationCurvePlotter({
                            height :250,
                            title : "I/SigmaI vs Resolution",
                           // legend : 'never',
                            targetId : " sigmaI"
                        });
                        $("#sigmaI").html(isigmaPlotter.getHTML());                         
                        isigmaPlotter.loadUrl(EXI.getDataAdapter().mx.autoproc.getXScaleISigma(autoprocProgramId));
	                  
                      
                      
    //this.loadAttachments(data);
};



/*
function BeamlineParameterMainView() {
    this.icon = 'images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    this.imageViewer = new ImageResolutionViewer();

    this.detectorResolution = {
        pixelSize: {
            x: 1475,
            y: 1679
        },
        sensitiveArea: {
            x: 253.7,
            y: 288.8
        },
        pixelSizeHorizontal: 0.172

    };

    this.resolutionScatteringImageViewer = new ResolutionScatteringImageViewer({
       width    : 400,
       height   :400 

    });
    
    
    this.resolutionScatteringImageViewer.onResolutionCalculated.attach(function(sender, resolution) {
        if (document.getElementById(_this.id + 'resolution')){
            document.getElementById(_this.id + 'resolution').innerHTML =  Math.round(resolution * 100) / 100 + " &#8491;";
        }
        else{
            document.title = resolution
        }
    });
    
}

BeamlineParameterMainView.prototype.getPanel = MainView.prototype.getPanel;

BeamlineParameterMainView.prototype.getContainer = function() {
    return Ext.create('Ext.panel.Panel', 
                    {
                    xtype : 'container',
                    layout : 'hbox',
                    items : [
                                {
                                    xtype : 'container',
                                    layout : 'vbox',
                                    height : 800,
                                    items : [
                                                {
                                                    html: this.resolutionScatteringImageViewer.getPanel(),
                                                    margin: '10 0 0 5',                                            
                                                    autoScroll : true
                                                },
                                                {
                                                    html:  "<table style='width:400px;'><tr><td style='width:30px;'>Resolution</td><td style='font-size:15px;' class='datacollection_parameter_name' id='" + this.id + "resolution' >Select point on Image</td></tr></table",
                                                    margin: '10 0 0 5',                                            
                                                    flex : 1,
                                                    height : 50,
                                                    autoScroll : true
                                                }
                                            ] 
                                },       
                                {
                                    html: "<div  id='" + this.id + "detector' ></div>",
                                    height : '100%',
                                    margin : '10 0 0 20',
                                    autoScroll : true,
                                    flex : 0.4
                                }
                            ]                            
                    }                                                                                   
    );        
                
   
};




BeamlineParameterMainView.prototype.load = function(dataCollectionId) {

    var _this = this;
    
    //debugger
    //var url = EXI.getDataAdapter().mx.dataCollection.getImageById(imageId);

    
    var onSuccess = function(sender, dataCollections) {
        if (dataCollections){
            if (dataCollections.length > 0){
                var dataCollection = dataCollections[0];
                
                _this.panel.setTitle(dataCollection.DataCollection_imagePrefix);
  
                var wavelength = dataCollection.DataCollection_wavelength;
                var detectorDistance = dataCollection.DataCollection_detectorDistance;
                var xBeam = dataCollection.DataCollection_xBeam;
                var yBeam = dataCollection.DataCollection_yBeam;

                
                 if (ExtISPyB.detectors[dataCollection.detectorModel] != null) {
                    _this.detectorResolution = ExtISPyB.detectors[dataCollection.detectorModel];
                }
                else {
                    alert("Not detector loaded");
                }
                               
                dust.render('beamlineparameter', dataCollection, function(err, out) {
                            document.getElementById(_this.id + "detector").innerHTML = out;
                });
                
  
                _this.resolutionScatteringImageViewer.load(dataCollection.lastImageId,  wavelength, xBeam, yBeam, detectorDistance,  _this.detectorResolution.sensitiveArea);                
            }
        }
       
    };
    EXI.getDataAdapter({ onSuccess: onSuccess }).mx.dataCollection.getByDataCollectionId(dataCollectionId);


};


*/
function ImageMainView() {
    this.icon = 'images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    this.imageViewer = new ImageResolutionViewer();

    this.detectorResolution = {
        pixelSize: {
            x: 1475,
            y: 1679
        },
        sensitiveArea: {
            x: 253.7,
            y: 288.8
        },
        pixelSizeHorizontal: 0.172

    };

    //this.surfaceScatteringViewer = new SurfaceScatteringViewer();

    this.imageViewer.onImageRendered.attach(function(sender, data) {
        //_this.surfaceScatteringViewer.load(data);

    });
    
    this.imageViewer.onMouseOver.attach(function(sender, point) {
    
    });
    
}

ImageMainView.prototype.getPanel = MainView.prototype.getPanel;

ImageMainView.prototype.getContainer = function() {
    return Ext.createWidget('tabpanel',
        {
            plain: true,
            margin: '10 30 10 10',
            items: [

                {
                    tabConfig: {
                        title: '2D'
                    },
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        paddding: 5,
                        style: {
                            borderColor: 'gray',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            'background-color': 'white'
                        },
                        items: [
                            this.imageViewer.getPanel(),
                            {

                                html: "<div id='" + this.id + "detector' ></div>",
                                margin: '0 0 0 5',
                                height: 800
                            }

                        ]
                    }
                    ]
                },
                /*{
                    tabConfig : {
                        title : '3D'
                    },
                    items : [ {
                        xtype : 'container',
                        layout : 'hbox',
                        style : {
                            borderColor : 'gray',
                            borderStyle : 'solid',
                            borderWidth : '1px',
                            'background-color' : 'white' 
                        },
                        items : [ 
                            this.surfaceScatteringViewer.getPanel()
                        	
                        ]
                    }
                    ]
                    },
                {
                    tabConfig : {
                        title : 'Parameters'
                    },
                    items : [ {
                        xtype : 'container',
                        layout : 'fit',
                        style : {
                            borderColor : 'gray',
                            borderStyle : 'solid',
                            borderWidth : '1px',
                            'background-color' : 'white' 
                        },
                        items : [ 
                            this.getParametersGrid()
                        ]
                    }
                    ]
                    }*/




            ]
        });
};



/*MainView.prototype.getParametersGrid = function(imageId, dataCollectionId) {
	this.storeParameters = Ext.create('Ext.data.Store', {
	    fields:['key', 'value'],
            sorters : 'key'
	});

	this.parametersPanel = Ext.create('Ext.grid.Panel', {
	    title: 'Parameters',
	    store: this.storeParameters,
	    columns: [
		{ text: 'Key',  dataIndex: 'key', flex: 0.2 },
		{ text: 'Value', dataIndex: 'value', flex: 1 }
	    ],
	    height: 800,
	    viewConfig : {
			enableTextSelection : true
	    }
	});
	return this.parametersPanel;

};*/

ImageMainView.prototype.loadDetectorPanel = function(detector, dataCollection) {
    var dataHTML = this.makeHTMLTable("Detector", [
        ["Model", dataCollection.Detector_detectorModel],
        ["Manufacturer", dataCollection.Detector_detectorManufacturer],
        ["Mode", dataCollection.Detector_detectorMode],
        ["Pixel Size", detector.pixelSize.x + " x " + detector.pixelSize.y],
        ["sensitive Area", detector.sensitiveArea.x + " x " + detector.sensitiveArea.y]

    ], null, detector.img);

    var dataColletionHTML = this.makeHTMLTable("Data Collection", [
        ["Collected on", dataCollection.DataCollectionGroup_endTime],
        ["Experiment Type", dataCollection.DataCollectionGroup_experimentType],
        ["Centering", dataCollection.DataCollection_centeringMethod],
        ["Exposure Timee", dataCollection.DataCollection_exposureTime],
        ["Directory", dataCollection.DataCollection_imageDirectory],
        ["BeamLine", dataCollection.BLSession_beamLineName],
        ["Detector Distance", dataCollection.DataCollection_detectorDistance],
        ["Flux", dataCollection.DataCollection_flux],
        ["Resolution", dataCollection.DataCollection_resolution],
        ["Transmission", dataCollection.DataCollection_transmission],
        ["WaveLength", dataCollection.DataCollection_wavelength]


    ]);


    return "<span style='color:orange;font-weight:bold;'>WARNING: If image is not displayed please, refresh the page (F5)</span><br />" + dataColletionHTML + dataHTML;



};

ImageMainView.prototype.makeHTMLTable = function(title, data, args, img) {
    var width = 800;
    if (args != null) {
        if (args.with != null) {
            width = args.with;
        }
    }


    var html = "<table>";



    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            html = html + "<tr>";
            for (var j = 0; j < data[i].length; j++) {

                var css = "key_subgrid";
                if (j == 1) {
                    css = "value_subgrid";
                }
                html = html + "<td class='" + css + "'>" + data[i][j] + "</td>";

                if (img != null) {
                    if (i == 0) {
                        if (j == data[i].length - 1) {
                            html = html + '<td rowspan="' + data.length + '"><img src=' + img + '/></td>';
                        }

                    }

                }
            }
            html = html + "</tr>";

        }


    }
    html = html + "</table>";

    if (title != null) {
        html = '<div  class="header-component-table" >' + title + '</div><div  style="margin:0px 0px 0px 0px !important;width:' + width + 'px;">' + html + '</div>';
    }
    return html;
};


ImageMainView.prototype.load = function(imageId, dataCollectionId) {

    var _this = this;
    this.panel.setTitle("Image");
    var url = EXI.getDataAdapter().mx.dataCollection.getImageById(imageId);


    var onSuccess = function(sender, dataCollection) {

        var dc = (dataCollection[0]);
/*
        for (var key in dc) {
            
            _this.storeParameters.loadData([{ key: key, value: dc[key] }], true);
        }*/
        var waveLength = dataCollection[0].DataCollection_wavelength;
        var detectorDistance = dataCollection[0].DataCollection_detectorDistance;
        var xBeam = dataCollection[0].DataCollection_xBeam;
        var yBeam = dataCollection[0].DataCollection_yBeam;

        if (ExtISPyB.detectors[dataCollection[0].detectorModel] != null) {
            _this.detectorResolution = ExtISPyB.detectors[dataCollection[0].detectorModel];
        }
        else {
            alert("Not detector loaded");
        }


        _this.imageViewer.load(url, waveLength, detectorDistance, xBeam, yBeam, _this.detectorResolution);

        document.getElementById(_this.id + "detector").innerHTML = _this.loadDetectorPanel(_this.detectorResolution, dataCollection[0]);

        //_this.surfaceScatteringViewer.load();

    };
    EXI.getDataAdapter({ onSuccess: onSuccess }).mx.dataCollection.getByDataCollectionId(dataCollectionId);


};



/*function ResolutionScatteringImageViewer(args){

    this.id = BUI.id();
   
   var _this = this;
   this.scatteringImageViewer = new ScatteringImageViewer(args);
   this.scatteringImageViewer.onMouseOver.attach(function(sender, position){
     
      try{ 
            var r = _this.getR(_this.xbeam, _this.ybeam, position.x,  position.y);
            var resolution = _this.wavelength/(2*Math.sin(1/2*Math.atan(r/_this.detectorDistance)));
            _this.onResolutionCalculated.notify(resolution);
      }
      catch(e){
  
          console.log(e);
      }
   });
   
   this.onResolutionCalculated = new Event(this);
    
};

ResolutionScatteringImageViewer.prototype.getPanel = function(){
   return this.scatteringImageViewer.getPanel();
};

ResolutionScatteringImageViewer.prototype.getR = function(xbeam, ybeam, x, y){
  
   x = (x*this.sensitiveArea.x)/this.scatteringImageViewer.width;
   y = (y*this.sensitiveArea.y)/this.scatteringImageViewer.height; 
    
   var squareX = Math.pow((x-xbeam),2);
   var squareY = Math.pow((y-ybeam),2);
   return Math.sqrt(squareX + squareY);
   
};

ResolutionScatteringImageViewer.prototype.load = function(imageId, wavelength, xbeam, ybeam, detectorDistance, sensitiveArea){
    var url = EXI.getDataAdapter().mx.dataCollection.getImageById(imageId);    
   this.scatteringImageViewer.load(url);
   
   this.wavelength = wavelength;
   this.xbeam = xbeam;
   this.ybeam = ybeam;
   this.detectorDistance = detectorDistance;
   this.sensitiveArea = sensitiveArea;

};*/
/*function ScatteringImageViewer(args){
    this.width = 100;
    this.height = 100;
    this.id = BUI.id();
    
    if (args){
        if (args.height){
            this.height = args.height;
        }
          if (args.width){
            this.width = args.width;
        }
    }
    
    this.onMouseOver = new Event(this);
    
};

ScatteringImageViewer.prototype.getPanel = function(){
    return '<img id="' + this.id + '" style="background-color: green;width:' + this.width +'px; height:' + this.height +'px;" />'
};


ScatteringImageViewer.prototype.findPosition = function(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
	do {
	    curleft += obj.offsetLeft;
	    curtop += obj.offsetTop;
	} while (obj = obj.offsetParent);
	return { x: curleft, y: curtop };
    }
    return undefined;
};

ScatteringImageViewer.prototype.getCoordinates = function(obj, e) {
     	var pos = this.findPosition(obj);
    	var x = e.pageX - pos.x;
    	var y = e.pageY - pos.y;
        return {
                            x 	: x,
                            y 	: y
        };
};
ScatteringImageViewer.prototype.load = function(url){    
    var _this = this;  
    
    $('#' + _this.id).load(function() {        
        $('#' + _this.id).mousemove(function(e) {
           _this.onMouseOver.notify(_this.getCoordinates(this, e));
        });
    }).attr('src', url);
};*/
function CrystalMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	var _this = this;
	
	this.crystalForm = new CrystalForm();
	this.samplesGrid = new SamplesGrid();
}

CrystalMainView.prototype.getPanel = MainView.prototype.getPanel;

CrystalMainView.prototype.getContainer = function() {
	this.panel =  Ext.createWidget('tabpanel',
			{
				plain : true,
				margin : '10 30 10 10',
				items : [
					{
						tabConfig : {
							title : 'Samples list'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							style : {
								borderColor : 'gray',
								borderStyle : 'solid',
								borderWidth : '1px',
								'background-color' : 'white' 
							},
							items : 
								[
									this.samplesGrid.getPanel()
							]
						}
						]
				  },
				  {
						tabConfig : {
							title : 'Create a new CrystalForm'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							style : {
								borderColor : 'gray',
								borderStyle : 'solid',
								borderWidth : '1px',
								'background-color' : 'white' 
							},
							items : 
								[
							        this.crystalForm.getPanel()
							]
						}
						]
				  }]
		});
	return this.panel;	
};

CrystalMainView.prototype.load = function(crystal) {
	var _this = this;
	this.panel.setTitle(crystal.proteinVO.acronym);
	this.crystalForm.load(crystal);
	this.samplesGrid.load(crystal);
	
};

















/**
* Open a window with the files for all autoprocessing by datacollection
*
* @class AutoProcessingFileManager
* @constructor
*/
function AutoProcessingFileManager(){
    
    /** Grid */
    this.autoProcIntegrationAttachmentGrid = new AutoProcIntegrationAttachmentGrid({ margin: 5, height : 500});
}

AutoProcessingFileManager.prototype.show = function(dataCollectionIds){
       	var _this = this;
        /** We store an array with the autoProcIntegration Ids and other with their corresponding
         * attachments
         */
        var attachments = [];
        var autoProcProgramIds = [];
        
                
        
        /** Combo */
        this.autoProcStore = Ext.create('Ext.data.Store', {
            fields: ['v_datacollection_processingPrograms', 'v_datacollection_summary_phasing_autoproc_space_group', 'v_datacollection_summary_phasing_autoProcProgramId', 'text']
            
        });

        var combo = Ext.create('Ext.form.ComboBox', {
            fieldLabel: 'Choose',
            store: this.autoProcStore,
            queryMode: 'local',
            displayField: 'v_datacollection_processingPrograms',
            height : 25,
            valueField: 'v_datacollection_summary_phasing_autoProcProgramId',
            tpl : Ext.create('Ext.XTemplate', 
				'<tpl for=".">',
					'<div style="font-size:12px;" class="x-boundlist-item">{v_datacollection_processingPrograms}<span style="color:gray;font-size:10px;font-weight:bold"> {v_datacollection_summary_phasing_autoproc_space_group}</span></div>', '</tpl>'),
             listeners:{
                    scope: _this,
                    'select': function(a,record,c){
                        
                        _this.programId = record[0].data.v_datacollection_summary_phasing_autoProcProgramId;
                       if (_this.programId ){
                            _this.reloadData(_this.programId, _this.filtered  );
                           
                       }
                    }
                }
        });
 
	Ext.create('Ext.window.Window', {
		height: 600,
		title : 'Autoprocessing Files Explorer',
		width: 900,
		modal : true,
		items: [
                    {
                           xtype : 'container',
                           layout : 'hbox',
                           margin : '10 5 10 5',
                           items : [
                                      combo,
                                      {
                                          xtype      : 'checkboxfield',
                                          boxLabel   : 'Filter by MTZ files',
                                           margin   : '0 0 0 40',
                                          checked    : false,
                                          listeners:{
                                                    scope: _this,
                                                    'change': function(a,filtered,c){
                                                                 _this.reloadData(_this.programId,filtered);
                                                    }
                                                }
                                      }
                                               
                           ]
                    },
                       
                    this.autoProcIntegrationAttachmentGrid.getPanel()
        ]
	}).show();
};

/**
* Shows files from a list of  dataCollectionIds
*
* @method reloadData
* @param {Integer} programId if data should be filtered by programId
* @param {boolean} filtered if data should be filtered by mtz extension
*/
AutoProcessingFileManager.prototype.reloadData = function(programId, filtered){
    this.programId = programId;
    this.filtered = filtered;
    
    /** Get all attachments */
    var dataByProgram = _.flatten(this.attachments);
    
    /** Filter by programId */
    if (this.programId){
        dataByProgram = this.attachments[_.indexOf(this.autoProcProgramIds, this.programId)];
    }
    /** Filter by MTZ */
    if (this.filtered){
         dataByProgram = _.filter(dataByProgram, function(b){         
                return b.fileName.indexOf(".mtz") != -1;
        });
    }
   
    if (!dataByProgram){
        dataByProgram = [];
    }
    this.autoProcIntegrationAttachmentGrid.load(dataByProgram);
};

/**
* Shows files from a list of  dataCollectionIds
*
* @method load
* @param {[Integer]]} dataCollectionIds
*/
AutoProcessingFileManager.prototype.load = function(dataCollectionIds){
    
    var _this = this;
    var onSuccess2 = function(sender, data){      
		var onSuccess = function(sender, dataAttachments){
            
            if (dataAttachments.length != _this.autoProcProgramIds.length){
                /** Removing null */
                
                _this.autoProcProgramIds =  _.filter(_this.autoProcProgramIds, function(b){return b != null;});
                
            }
			_this.attachments = dataAttachments;
			_this.autoProcIntegrationAttachmentGrid.load(_.flatten(dataAttachments));
			_this.autoProcIntegrationAttachmentGrid.panel.setLoading(false);
		};
		_this.autoProcIntegrationAttachmentGrid.panel.setLoading("Retrieving files");
        
        /** Some autoProcProgramIds may be null */
		_this.autoProcProgramIds = _.map(data[0], 'v_datacollection_summary_phasing_autoProcProgramId');    
		  
		_this.autoProcStore.loadData(data[0]);
        if (_this.autoProcProgramIds){
            if (_this.autoProcProgramIds.length > 0){
		        EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getAttachmentListByautoProcProgramsIdList(_this.autoProcProgramIds);
                return;
            }
        }
        /** No Attachments */
        _this.autoProcIntegrationAttachmentGrid.panel.setLoading(false);
	};
	this.autoProcIntegrationAttachmentGrid.panel.setLoading();
    
	EXI.getDataAdapter({onSuccess : onSuccess2}).mx.autoproc.getViewByDataCollectionId(dataCollectionIds);
};
function DataCollectionGrid(args) {

    this.store = Ext.create('Ext.data.Store', {
            fields: ["dataCollectionGroup"]
     });
}
    
/**
* By using Jquery sets lazy loading of the thumbnails
*
* @method loadMagnifiers
* @return {dataCollectionGroup} Array of data collections
*/
DataCollectionGrid.prototype.loadMagnifiers = function(dataCollectionGroup){
     for (var i = 0; i < dataCollectionGroup.length; i++) {
            var elementId = dataCollectionGroup[i].DataCollection_dataCollectionId + "_thumb";
            $('#' + elementId).Lazy();
     }
};

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
DataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
        this.store.loadData(dataCollectionGroup);
        this.loadMagnifiers(dataCollectionGroup);
    }
    catch(e){
        console.log(e);
    }
};

DataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
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


/**
* Parses statistics and return the best one
*
* @method _getAutoprocessingStatistics
* @param {Object} data Record with all the information that it is stored in the store
* @return {Object} return all statistics sorted by best values
*/
DataCollectionGrid.prototype._getAutoprocessingStatistics = function(data) {
    /** This converts and array of comma separated value in a array */
    function getArrayValues(value) {
        /** It splits every value */
        return _.map(_.trim(value).split(","), function(singleValue) { return _.trim(singleValue); });
    }

    var autoProc_spaceGroups = getArrayValues(data.AutoProc_spaceGroups);
    var autoProcIds = getArrayValues(data.autoProcIds);
    var completenessList = getArrayValues(data.completenessList);
    var resolutionsLimitHigh = getArrayValues(data.resolutionsLimitHigh);
    var resolutionsLimitLow = getArrayValues(data.resolutionsLimitLow);
    var scalingStatisticsTypes = getArrayValues(data.scalingStatisticsTypes);
    var rMerges = getArrayValues(data.rMerges);
    var cell_a = getArrayValues(data.Autoprocessing_cell_a);
    var cell_b = getArrayValues(data.Autoprocessing_cell_b);
    var cell_c = getArrayValues(data.Autoprocessing_cell_c);

    var cell_alpha = getArrayValues(data.Autoprocessing_cell_alpha);
    var cell_beta = getArrayValues(data.Autoprocessing_cell_beta);
    var cell_gamma = getArrayValues(data.Autoprocessing_cell_gamma);

    data = {};
    /** Returning if no autoprocs */
    if (autoProcIds) {
        if (autoProcIds[0] == "") {
            return [];
        }
    }
    for (var i = 0; i < autoProcIds.length; i++) {
        if (data[autoProcIds[i]] == null) {
            data[autoProcIds[i]] = {
                autoProcId: autoProcIds[i],
                spaceGroup: autoProc_spaceGroups[i]
            };
        }

        data[autoProcIds[i]][scalingStatisticsTypes[i]] = ({
            autoProcId: autoProcIds[i],
            scalingStatisticsType: scalingStatisticsTypes[i],
            completeness: Number(completenessList[i]).toFixed(0),
            resolutionsLimitHigh: Number(resolutionsLimitHigh[i]).toFixed(1),
            resolutionsLimitLow: Number(resolutionsLimitLow[i]).toFixed(1),
            rMerge: Number(rMerges[i]).toFixed(1),
            spaceGroup: autoProc_spaceGroups[i],
            cell_a: cell_a[i],
            cell_b: cell_b[i],
            cell_c: cell_c[i],
            cell_alpha: cell_alpha[i],
            cell_beta: cell_beta[i],
            cell_gamma: cell_gamma[i]

        });

    }

    /** Convert from map to array */
    var ids = _.map(data, 'autoProcId');
    var result = [];
    for ( i = 0; i < ids.length; i++) {
        result.push(data[ids[i]]);
    }

    function sortByBest(a, b) {
        var spaceGroupA = a.spaceGroup.replace(/\s/g, "");
        var spaceGroupB = b.spaceGroup.replace(/\s/g, "");              
        return (_.indexOf(ExtISPyB.spaceGroups, spaceGroupA) > _.indexOf(ExtISPyB.spaceGroups, spaceGroupB));
    }

    var sorted = result.sort(sortByBest).reverse();    
    /** Add new attribute for ranking order */
    for ( i = 0; i < sorted.length; i++) {
        sorted[i]["rank"] = i + 1;
    }

    return sorted;
};



DataCollectionGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {

            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var data = record.data;                              
                var html = "";                               

                /** For thumbnail */
                data.urlThumbnail = EXI.getDataAdapter().mx.dataCollection.getThumbNailById(data.lastImageId);
                data.url = EXI.getDataAdapter().mx.dataCollection.getImageById(data.lastImageId);
                data.ref = '#/mx/beamlineparameter/datacollection/' + data.DataCollection_dataCollectionId + '/main';
                data.runNumber = data.DataCollection_dataCollectionNumber;
                data.prefix = data.DataCollection_imagePrefix;
                data.comments = data.DataCollectionGroup_comments;
                data.sample = data.BLSample_name;
                data.folder = data.DataCollection_imageDirectory;

                
                try{
                    if (data.autoProcIntegrationId){                        
                        data.resultsCount = _.uniq(data.autoProcIntegrationId.replace(/ /g,'').split(",")).length;
                    }
                }
                catch(e){}
                /** For Phasing */
                
                if (data.phasingStepType) {
                    var phasingSteps = data.phasingStepType.split(",");
                    data.phasingStepLength = phasingSteps.length;
                
                }
                
                /** For crystal */
                data.xtal1 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 1);
                data.xtal2 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 2);
                data.xtal3 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 3);
                data.xtal4 = EXI.getDataAdapter().mx.dataCollection.getCrystalSnapshotByDataCollectionId(record.data.DataCollection_dataCollectionId, 4);

                /** Image quality indicator **/
                data.indicator = EXI.getDataAdapter().mx.dataCollection.getQualityIndicatorPlot(record.data.DataCollection_dataCollectionId);              
                data.onlineresults = _this._getAutoprocessingStatistics(record.data);
                
                /** We dont show screen if there are results of autoprocessing */
                data.isScreeningVisible = true;
                if (data.onlineresults){
                    if (data.onlineresults.length > 0){
                        data.isScreeningVisible = false;
                    }                    
                }
                /** For the workflows **/
                if (record.data.WorkflowStep_workflowStepType) {
                    data.workflows = new WorkflowSectionDataCollection().parseWorkflow(record.data);
                }
                if (data.workflows == null) {
                    data.workflows = [];
                }
             
                dust.render(_this.template, data, function(err, out) {                                                                       
                    html = html + out;
                });
                
                return html;

            }
        },
        {
            header: 'IDs',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: true,
            renderer: function(grid, e, record) {
                var html = "";
                dust.render("ids.mxdatacollectiongrid.template", record.data, function(err, out) {
                    html = out;
                });
                return html;

            }
        }         
    ];

    return columns;
};

/**
* Landing page for where data collections are shown. It manages the DataCollectionSummaryGrid
*
* @class DataCollectionMxMainView
* @constructor
*/
function DataCollectionMxMainView() {
	this.icon = '../images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	var _this = this;
	
	this.genericDataCollectionPanel = new MXDataCollectionGrid();
        this.energyScanGrid = new EnergyScanGrid();
        this.xfeScanGrid = new XFEScanGrid();
}

DataCollectionMxMainView.prototype.getPanel = MainView.prototype.getPanel;

DataCollectionMxMainView.prototype.getContainer = function() {
		this.container = Ext.create('Ext.tab.Panel', {       
        padding : "5 40 0 5",
        items: [ {
                        title: 'Data Collections',
                        cls : 'border-grid',
                        id : this.id + "_dataCollectionTab",
                        items:[
                            this.genericDataCollectionPanel.getPanel()
                        ]
                }, 
              
                {
                        title: 'Energy Scans',
                        cls : 'border-grid',
                        id : this.id + "_energyTab",
                        items:[
                             this.energyScanGrid.getPanel()
                        ]
                },
                 {
                        title: 'Fluorescence Spectra',
                        id : this.id + "_xfeTab",
                        cls : 'border-grid',                         
                        items:[
                            this.xfeScanGrid.getPanel()
                        ]
                }
               ]
        });
	    return this.container;
	
};

DataCollectionMxMainView.prototype.loadEnergyScans = function(data) {
     if (data){
         if (data.length > 0){
            Ext.getCmp(this.id + "_energyTab").setTitle(data.length + " Energy Scans");  
            this.energyScanGrid.load(data);
            return;
         }
     }
     
     Ext.getCmp(this.id + "_energyTab").setDisabled(true);
};

DataCollectionMxMainView.prototype.loadFXEScans = function(data) {  
    if (data){
        if (data.length > 0){
            Ext.getCmp(this.id + "_xfeTab").setTitle(data.length + " Fluorescence Spectra");  
            this.xfeScanGrid.load(data);
            return;
         }
     }
     
     Ext.getCmp(this.id + "_xfeTab").setDisabled(true);
};

DataCollectionMxMainView.prototype.loadCollections = function(dataCollections) {
	var data = _.filter(dataCollections, function(u) {
        return u.DataCollection_dataCollectionId != null;
    });
    if (data){
        for (var i = 0; i < data.length; i++) {
            try{
                if (data[i].DataCollectionGroup_startTime != null){
                    data[i].time =  moment(data[i].DataCollectionGroup_startTime, "MMMM Do YYYY, h:mm:ss A").format("h:mm:ss A");
                }
                
                if (data[i].DataCollectionGroup_startTime != null){
                    data[i].date =  moment(data[i].DataCollectionGroup_startTime, "MMMM Do YYYY").format("MMMM Do YYYY");
                }
                
                if (data[i].DataCollection_resolutionAtCorner != null){
                    data[i].DataCollection_resolutionAtCorner = _.ceil( data[i].DataCollection_resolutionAtCorner, 2);
                }
                if (data[i].DataCollection_resolution != null){
                    data[i].DataCollection_resolution = _.ceil( data[i].DataCollection_resolution, 2);
                }
                
                if (data[i].DataCollection_wavelength != null){
                    data[i].DataCollection_wavelength = _.ceil( data[i].DataCollection_wavelength, 3);
                }
                /** Axis  **/
                if (data[i].DataCollection_axisEnd != null){
                    if (data[i].DataCollection_axisStart != null){
                        data[i].DataCollection_axisTotal = _.ceil(data[i].DataCollection_axisEnd - data[i].DataCollection_axisStart, 2);
                    }
                }
                
                if (data[i].DataCollection_flux_end != null){
                    data[i].DataCollection_flux_end = data[i].DataCollection_flux_end.toExponential();
                }
                
                if (data[i].DataCollection_flux != null){
                    data[i].DataCollection_flux = data[i].DataCollection_flux.toExponential();
                }
            }
            catch(err) {
                console.log(error);
            }
        }
        Ext.getCmp(this.id + "_dataCollectionTab").setTitle(data.length + " Data Collections");
	    if (data){            
            this.genericDataCollectionPanel.load(data.reverse());
        }
        return;	
    }
     Ext.getCmp(this.id + "_dataCollectionTab").setDisabled(true);
};

/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function CollapsedDataCollectionGrid(args) {
    this.template = "collapsed.mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

CollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
CollapsedDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
CollapsedDataCollectionGrid.prototype.load = DataCollectionGrid.prototype.load;
CollapsedDataCollectionGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;
CollapsedDataCollectionGrid.prototype.getPanel = DataCollectionGrid.prototype.getPanel;

function CustomSectionDataCollection(args) {
	this.noFoundClass = "summary_datacollection_noFound";
	this.failedClass = "summary_datacollection_failed";
	this.successClass = "summary_datacollection_success";
}




CustomSectionDataCollection.prototype.getMeshScan = function(dataCollectionGroup){
	
	var steps = [];
	var status = [];
	var ids = [];
	
	if ( dataCollectionGroup.WorkflowStep_workflowStepType != null){
		steps = dataCollectionGroup.WorkflowStep_workflowStepType.split(",");
		status = dataCollectionGroup.WorkflowStep_status.split(",");
		ids = dataCollectionGroup.WorkflowStep_workflowStepId.split(",");
	
	
		for (var i = 0; i < steps.length; i++){
			var step = {
					status : status[i],
					name   : steps[i],
					workflowStepId  : ids[i],
					img : EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(ids[i])
			};
			if (step.name == "Mesh"){
				return step;
			}
		}
	}
	return;
};


CustomSectionDataCollection.prototype.getHTML = function(dataCollectionGroup){
	
	var html = "";
	var items = [];
	/** Making the mesh **/
	try{
		var mesh = this.getMeshScan(dataCollectionGroup);
		if (mesh != null){
			items.push({
				img 	: EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(mesh.workflowStepId),
                id      : dataCollectionGroup.DataCollection_dataCollectionId				
			});
		}
		
		
	}
	catch(e){
		html = html + "There was an error parsing the mesh";
	}
	
	/** Making the wilson **/
	try{
		if (dataCollectionGroup.DataCollection_bestWilsonPlotPath != null){
			items.push({
				img 	: EXI.getDataAdapter().mx.dataCollection.getWilsonPlot(dataCollectionGroup.DataCollection_dataCollectionId),
				//title 	: "Wilson"
			});
			
		}
	}
	catch(e){
		html = html + "There was an error parsing the wilson";
	}
	
	dust.render("customsectiondatacollection", items, function(err, out){
		html = html + out;
     	});
	
	
	return html;
	
};




/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function MXDataCollectionGrid(args) {
    this.id = BUI.id();

    /** DATACOLLECTION, DATACOLLECTION_COLLAPSED, PLATES_VIEW */
    this.renderingType = 'DATACOLLECTION';

    this.uncollapsedDataCollectionGrid = new UncollapsedDataCollectionGrid();
    this.collapsedDataCollectionGrid = new CollapsedDataCollectionGrid();
    this.platesDataCollectionGrid = new PlatesDataCollectionGrid();  
                                                                    
    this.activePanel = this.uncollapsedDataCollectionGrid;
}

MXDataCollectionGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {  
        id: this.id,
        tbar: this.getToolBar(),        
        items: [_this.activePanel.getPanel(dataCollectionGroup)]
     });
   
    return this.panel;
};

MXDataCollectionGrid.prototype.getToolBar = function() {
    var _this = this;
    function onMenuClicked(widget){
        if (_this.activePanel != widget){
            _this.activePanel = widget;
            if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                _this.reloadData(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
            } else {
                _this.reloadData(_this.dataCollectionGroup);
            }
        }
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'Data Collection',
            handler: function(){
                _this.renderingType = "DATACOLLECTION";
                onMenuClicked(_this.uncollapsedDataCollectionGrid);
            }
        },{
            text: 'Summary',            
            handler: function(){
                _this.renderingType = "DATACOLLECTION_COLLAPSED";
                onMenuClicked(_this.collapsedDataCollectionGrid);
            }
        },{
            text: 'Plates',            
            handler: function(){
                _this.renderingType = "PLATES";
                
                if (_this.activePanel != _this.platesDataCollectionGrid){
                    _this.activePanel = _this.platesDataCollectionGrid;
                    _this.reloadData(_this.dataCollectionGroup);                 
                    if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                       _this.platesDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                    }
                }
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
            },
            '->', 
            {
                xtype: 'textfield',
                id: this.id + "_search",
                width: 400,
                emptyText: 'enter search prefix, sample or protein',
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            _this.filter = field.getValue();

                            if (_this.renderingType == "PLATES"){     
                                if (Ext.getCmp(_this.id + "_search").getValue() != "") {                        
                                    _this.platesDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                                } else {
                                    Ext.getCmp(_this.id + "_found").setText("");
                                    _this.reloadData(_this.dataCollectionGroup);
                                }
                            } else {
                                _this.reloadData(_this.filterBy(field.getValue()));
                            }
                        }
                    }
                }
            },
            { xtype: 'tbtext', text: '', id: this.id + "_found" }
        ]
    });
};

MXDataCollectionGrid.prototype.reloadData = function(dataCollections) {
    this.panel.removeAll();
    this.panel.add(this.activePanel.getPanel(this.dataCollectionGroup));
    this.activePanel.load(dataCollections);
};

MXDataCollectionGrid.prototype.load = function(dataCollectionGroup) {    
    this.dataCollectionGroup = dataCollectionGroup;  
    this.activePanel.load(this.dataCollectionGroup);
};


/**
* Filters data by prefix, protein acronym or sample
*
* @method filterBy
* @return {String} searchTerm prefix, protein acronym or sample to be searched
*/
MXDataCollectionGrid.prototype.filterBy = function(searchTerm) {  
    var filtered = _.filter(this.dataCollectionGroup, function(dataCollection) {
        var params = ["DataCollection_imagePrefix", "Protein_acronym", "BLSample_name"];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (dataCollection[param]) {
                if (dataCollection[param].indexOf(searchTerm) != -1) {
                    return dataCollection;
                }
            }
        }
    });
    Ext.getCmp(this.id + "_found").setText(filtered.length + " items found");
    return filtered;
};


function OnlineResultSectionDataCollection(args) {
	
	this.noFoundClass = "summary_datacollection_noFound";
	this.failedClass = "summary_datacollection_failed";
	this.successClass = "summary_datacollection_success";
}


OnlineResultSectionDataCollection.prototype.getScreeningData = function(dataCollectionGroup){
    var items = [];
     
	var parsed = [];
	if (dataCollectionGroup.Screening_screeningId != null){
		if (dataCollectionGroup.ScreeningOutput_indexingSuccess){
            items.push({
                name   : "Indexing",
                status : "Success",
                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                items  : [
                    {
                        name  : 'Mosaicity',
                        value : dataCollectionGroup.ScreeningOutput_mosaicity,
                        units : 'º'
                    }
                ]
            });

		}
		else{
			 items.push({
                name   : "Indexing",
                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                status : "Failure",
                items  : []
            });
		}
    }
   /* else{
        items.push({
                name   : "No indexing",
                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                status : "Not found",
                items  : []
            });
    }*/
    
    if (dataCollectionGroup.ScreeningOutput_strategySuccess){
           var subItems = [ {
                        name  : 'Ranking Res.',
                        value : dataCollectionGroup.ScreeningOutput_rankingResolution,
                        units : 'Å'
                    },                              
           ];
        if (dataCollectionGroup.ScreeningOutputLattice_spaceGroup){  
           subItems.push( {
                            name : 'Space Group',
                            value : dataCollectionGroup.ScreeningOutputLattice_spaceGroup,
                            units : ''
		   });
           subItems.push( {
                            name : 'a,b,c',
                            value : dataCollectionGroup.ScreeningOutputLattice_unitCell_a + ", " + dataCollectionGroup.ScreeningOutputLattice_unitCell_b + ", " + dataCollectionGroup.ScreeningOutputLattice_unitCell_c,
                            units : ''
		   });
           
           subItems.push( {
                            name : 'α β γ',
                            value : dataCollectionGroup.ScreeningOutputLattice_unitCell_alpha + ", " + dataCollectionGroup.ScreeningOutputLattice_unitCell_beta + ", " + dataCollectionGroup.ScreeningOutputLattice_unitCell_gamma,
                            units : ''
            });      		                     				
			                     
        }
         items.push({
                name   : "Strategy",
                status : "Success",
                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                items  : subItems 
         });	
    }
   /* else{
        items.push({
            name   : "No strategy",
            status : "Not found",
            datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
            items  : []
        });
    }*/
        
    
    /** No autprocessing */
   if (items.length == 0){
            return {
            name               :"Screening",
            status             : "Not found",
            items : []
                
        };
    }

    var status = "Failure";
    for (var i = 0; i < items.length; i++) {
        if (items[i].status == "Success"){
            status = "Success";
        }
        
    }
    return {
          name : "Screening",
          status :status,
          items : items  
    };           
};



OnlineResultSectionDataCollection.prototype.getAutoprocResults = function(dataCollectionGroup) {
   /** Paring autoprocessing */
    var autoprocessing = [];    
    var programs = dataCollectionGroup.processingPrograms; 
    var results = dataCollectionGroup.processingStatus;
    var spaceGroups = dataCollectionGroup.AutoProc_spaceGroups;
    
	if (programs != null){
		programs = programs.split(",");
		results = results.split(",");
        spaceGroups = spaceGroups.split(",");
		
        var aux = {};
		for (var i= 0; i < programs.length; i++){
			var name = programs[i].trim();
          
			if (aux[name] == null){
				aux[name] = {};
                aux[name]["spaceGroup"] = [];
				aux[name]["run"] = 0;
				aux[name]["success"] = 0;    
			}
            aux[name]["spaceGroup"].push(spaceGroups[i]);
			aux[name]["run"] =  aux[name]["run"] + 1;
			aux[name]["success"] =  aux[name]["success"]  + 1;
		}
        
        
            
        for (var key in aux){
            var status = "Failure";
            if (aux[key].success > 0){
                status = "Success";
            }
            
            autoprocessing.push({
               name     : key,
               dataCollectionId     : dataCollectionGroup.DataCollection_dataCollectionId,
               run      :  aux[key].run,
               success  :  aux[key].success,
               spaceGroup  :  aux[key].spaceGroup,
               status   : status,
               items   : [] 
            });
        }
	}
    
    /** Adding autoprocessing to results or add no autprocessing if any*/
    if (autoprocessing.length > 0){
       return {
                                name                : "Autoprocessing",
                                items               : autoprocessing,
                                status              : "Success",
                                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId
        };
    }
    else{
        return {
                                name                : "Autoprocessing",
                                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                                 status             : "Not found",
                                items : [
                                    /*{
                                       name     : "No autoprocessing",
                                       status   : "Not found",
                                       items    : []
                                }*/
                                ]
        };
    }
};

OnlineResultSectionDataCollection.prototype.getPhasingResults = function(dataCollectionGroup) {
    if (dataCollectionGroup!= null){
		if (dataCollectionGroup.Phasing_phasingStepType != null){
             return {
                                name : "Phasing",
                                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                                items : [{
                                       name     : "Phasing",
                                       status   : "Success",
                                       items    : []
                                }]
            };
        }
        else{
            return {
                                name : "Phasing",
                                datacollectionId    : dataCollectionGroup.DataCollection_dataCollectionId,
                                items : [{
                                       name     : "No phasing",
                                       status   : "Not found",
                                       items    : []
                                }]
            };
        }
    }
};
OnlineResultSectionDataCollection.prototype.parseData = function(dataCollectionGroup) {
	var resultParsed = [];
    resultParsed.push(this.getAutoprocResults(dataCollectionGroup));
    resultParsed.push(this.getScreeningData(dataCollectionGroup));
    //resultParsed.push(this.getPhasingResults(dataCollectionGroup));
	return resultParsed;
};


OnlineResultSectionDataCollection.prototype.getHTML = function(dataCollectionGroup, autoProcResults){
    var parseResults = this.parseData(dataCollectionGroup);

    parseResults[0].autoProcResults = autoProcResults;
    var html = "";
    dust.render("resultsection.autoprocessing", parseResults, function(err, out) {
        html = out;
        
    });
       
                                        
    return html;	
};


OnlineResultSectionDataCollection.prototype.getPhasingHTML = function(dataCollectionGroup){
	var html= "";
	if (dataCollectionGroup!= null){
		if (dataCollectionGroup.Phasing_phasingStepType != null){
			var steps = dataCollectionGroup.Phasing_phasingStepType.split(",");
			var parsed = [];
			for (var i = 0; i < steps.length; i++) {
				parsed.push({
					iconClass : "summary_datacollection_success",
					value : steps[i]
					
				});
			}
			html = html + this.getIconTable(parsed);
		}
		else{
			html = html + this.getIconTable([{
				iconClass : "summary_datacollection_noFound",
				value : "Phasing"
			}]);
		}
		
		if (dataCollectionGroup.Phasing_spaceGroup != null){
			html = html + this.getHTMLTable([{
            	key : 'Space Groups',
 				value : dataCollectionGroup.Phasing_spaceGroup 
             }]);
		}
	}
	return html;
};

/**
* Displays the plates of the data collections by session or acronym of the protein
*
* @class PlatesDataCollectionGrid
* @constructor
*/
function PlatesDataCollectionGrid(args) {
    
}

PlatesDataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
            fields: ["dataCollectionGroup"]
    });
        
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,            
        columns: this.getColumns()
    });
    return this.panel;
};

PlatesDataCollectionGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [
        {
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: false,
            renderer: function(grid, e, record) {

                var data = record.data;                              
                var html = "";               
                
                dust.render("plates.mxdatacollectiongrid.template", data, function(err, out) {                                                                       
                    html = html + out;
                }); 
                
                var onSuccess = function (sender, samples) {
                    if (samples){
                        var cells = {};
                        for (var i = 0; i < samples.length; i++) {
                            var sample = samples[i];
                            var selected = false;
                            if (!_.isEmpty(pucks[sample.Container_containerId].initSelected)){
                                selected = pucks[sample.Container_containerId].initSelected.includes(sample.BLSample_location);
                            }
                            var dataCollectionIds = pucks[sample.Container_containerId].dataCollectionIds[sample.BLSample_location];
                            var state = "FILLED";
                            if (dataCollectionIds != null && dataCollectionIds.length > 0){
                                state = "COLLECTED";
                            }
                            // Parse data
                            if (cells[sample.Container_containerId] == null){
                                cells[sample.Container_containerId] = [];
                            }
                            
                            cells[sample.Container_containerId].push({
                                location : sample.BLSample_location,
                                state : state,
                                selected : selected,
                                sample_name : sample.BLSample_name,
                                protein_acronym : sample.Protein_acronym,
                                protein_name : sample.Protein_name,
                                containerId : sample.Container_containerId,
                                container_code : sample.Container_code,
                                dewarId : sample.Dewar_dewarId,
                                dataCollectionIds : dataCollectionIds
                            });
                        }
                        
                        for (containerId in pucks){
                            pucks[containerId].load(cells[containerId]);
                            var infoHtml = "";
                            
                            dust.render("plates.info.mxdatacollectiongrid.template", cells[containerId][0], function(err, out) {                                                                       
                                infoHtml = infoHtml + out;
                            }); 
                            
                            $("#puck-panel-" + containerId + "-info").html(infoHtml);
                        }
                    }
                };
                
                if (data.containerIds.length > 0){
                    var pucksPanelHeight = 300;
                    var pucks = {};
                    var tree = $("<div ><div id='a' style='height:" + (pucksPanelHeight)+"px;'>" + html + "</div></div>");
                    for (id in data.containerIds){
                        var containerIdNumber = Number(data.containerIds[id]);
                        var container = _.filter(_this.dataCollectionGroup,{"Container_containerId" : containerIdNumber});
                        
                        if(container){
                            var dataCollectionIds = {};
                            for (var i = 1 ; i <= container[0].Container_capacity ; i++) {
                                var sampleByLocation = _.filter(container,{"BLSample_location":i.toString()});
                                if (sampleByLocation.length > 0) {
                                    var ids = [];
                                    for (sample in sampleByLocation){
                                        ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                                    }
                                    dataCollectionIds[i] = ids.toString();
                                }
                            }
                            
                            pucks[containerIdNumber] = new UniPuckWidget({mainRadius : pucksPanelHeight/4, 
                                                                        enableMouseOver : true, 
                                                                        enableClick : true, 
                                                                        containerId : containerIdNumber, 
                                                                        initSelected : data.selected[containerIdNumber],
                                                                        dataCollectionIds : dataCollectionIds
                                                                    });
                            if (container[0].Container_capacity == 10){
                                pucks[containerIdNumber] = new SpinePuckWidget({mainRadius :  pucksPanelHeight/4, 
                                                                                enableMouseOver : true, 
                                                                                enableClick : true, 
                                                                                containerId : containerIdNumber, 
                                                                                dataCollectionId : container.DataCollection_dataCollectionId, 
                                                                                initSelected : data.selected[containerIdNumber],
                                                                                dataCollectionIds : dataCollectionIds
                                                                            });
                            }
                            tree.find("#puck-panel-" + data.containerIds[id]).html(pucks[containerIdNumber].getPanel());
                        }
                    }
                    
                    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(data.containerIds);
                    html = tree.html();
                };

                return html;
            }
        },
        {
            header: 'IDs',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1.5,
            hidden: true,
            renderer: function(grid, e, record) {
                var html = "";
                dust.render("ids.mxdatacollectiongrid.template", record.data, function(err, out) {
                    html = out;
                });
                return html;

            }
        }
    ];
    return columns;
};

PlatesDataCollectionGrid.prototype.select = function(selectedDataCollectionGroup) {      
    var selected = {};   
    for (sample in selectedDataCollectionGroup){
        if (selected[selectedDataCollectionGroup[sample].Container_containerId] == null){
            selected[selectedDataCollectionGroup[sample].Container_containerId] = [selectedDataCollectionGroup[sample].BLSample_location];
        } else {
            selected[selectedDataCollectionGroup[sample].Container_containerId].push(selectedDataCollectionGroup[sample].BLSample_location);
        }
    }                                                                      
    this.store.loadData([{containerIds : this.getContainersId(this.dataCollectionGroup), selected : selected}]);
};

PlatesDataCollectionGrid.prototype.getContainersId = function(dataCollectionGroup) {         
   return _.filter(Object.keys(_.keyBy(dataCollectionGroup, "Container_containerId")), function(element){return isNumber(element);});                                                              
};

PlatesDataCollectionGrid.prototype.load = function(dataCollectionGroup) {
    this.dataCollectionGroup = dataCollectionGroup;    
    this.store.loadData([{containerIds:  this.getContainersId(this.dataCollectionGroup), selected :{}}]);
};

function ThumbnailSectionDatacollection(args) {
}

ThumbnailSectionDatacollection.prototype.getHTML = function(data) {    
    var html = "";
    
    dust.render("thumbnailsection", 
    [{
        urlThumbnail : EXI.getDataAdapter().mx.dataCollection.getThumbNailById(data.lastImageId),
        url         :  EXI.getDataAdapter().mx.dataCollection.getImageById(data.lastImageId),
        ref         : '#/mx/beamlineparameter/datacollection/' + data.DataCollection_dataCollectionId + '/main',
        runNumber : data.DataCollection_dataCollectionNumber,
        prefix : data.DataCollection_imagePrefix,
        comments : data.DataCollectionGroup_comments,        
        sample : data.BLSample_name,
        folder : data.DataCollection_imageDirectory
        
    }], function(err, out) {        
        html = out;
    });
    return html;  
};


/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class MXDataCollectionGrid
* @constructor
*/
function UncollapsedDataCollectionGrid(args) {
    this.id = BUI.id();
    this.template = "mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

UncollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
UncollapsedDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;
UncollapsedDataCollectionGrid.prototype.loadMagnifiers = DataCollectionGrid.prototype.loadMagnifiers;

/**
* Loads the store and load the maginifiers
*
* @method load
* @return {dataCollectionGroup} Array of data collections
*/
UncollapsedDataCollectionGrid.prototype.load = function(dataCollectionGroup){
    try{
        this.dataCollectionGroup = dataCollectionGroup;
        this.store.loadData(dataCollectionGroup);
        this.loadMagnifiers(dataCollectionGroup);
        this.attachCallBackAfterRender();
        
    }
    catch(e){
        console.log(e);
    }
};

UncollapsedDataCollectionGrid.prototype.getPanel = function(){
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,        
        store: this.store,  
        id: this.id,     
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        }
    });  
    return this.panel;
};


/**
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
UncollapsedDataCollectionGrid.prototype.displayDataCollectionTab = function(target, dataCollectionGroupId) {
    var onSuccess = function(sender, data){
        var html = "";
        dust.render("datacollections.mxdatacollectiongrid.template", data, function(err, out) {                                                                                               
            html = html + out;
        });
        $(target).html(html);
    };
    
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };
    /** Retrieve data collections */   
    EXI.getDataAdapter({onSuccess:onSuccess, onError:onError}).mx.dataCollection.getDataCollectionsByDataCollectionGroupId(dataCollectionGroupId);
};


/**
* Displays the data collection tab with all the data collection related to the data collection group
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionGroupId 
* @method displayDataCollectionTab
*/
UncollapsedDataCollectionGrid.prototype.displayResultAutoprocessingTab = function(target, dataCollectionId) {
    var onSuccess = function(sender, data){                       
        /** Parsing data */
        var html = "";     
        dust.render("collapsed.autoprocintegrationgrid.template",  new AutoProcIntegrationGrid().parseData(data[0]), function(err, out) {
                    html = html + out;
        });
        $(target).html(html);        
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.autoproc.getViewByDataCollectionId(dataCollectionId);  
};

/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayWorkflowsTab = function(target, dataCollectionId) {
   var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
    if (dc){
        var html = "";
        var items = (new WorkflowSectionDataCollection().parseWorkflow(dc));
        
        dust.render("workflows.mxdatacollectiongrid.template",  items, function(err, out) {
                        html = html + out;
        });
        $(target).html(html);
    }   
};


/**
* Displays the data worflows tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displayWorkflowsTab
*/
UncollapsedDataCollectionGrid.prototype.displayPhasingTab = function(target, dataCollectionId) {
  var onSuccess = function(sender, data){                       
        /** Parsing data */
       var spaceGroups = _.keyBy(data[0], "SpaceGroup_spaceGroupShortName");
       var parsed = [];
       for(var spaceGroup in spaceGroups){
           if (spaceGroup != "null"){               
               var stepsBySpaceGroup = _.filter(data[0],{"SpaceGroup_spaceGroupShortName": spaceGroup});
               function getStepId(stepsBySpaceGroup){
                   return _.keys(_.keyBy(stepsBySpaceGroup, "PhasingStep_phasingStepId")).toString();
               }
                 function getCSV(stepsBySpaceGroup){
                   var keys = _.keys(_.keyBy(stepsBySpaceGroup, "csv"));
                   return _.filter(keys, function(e){return e!= "null";});
               }
               var node = {};
               node = ({
                   spaceGroup      : spaceGroup,
                   prepare         : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PREPARE"}) != null,
                   sub             : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "SUBSTRUCTUREDETERMINATION"}) != null,
                   phasing         : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "PHASING"}) != null,
                   model           : _.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null,
                   downloadCSV     : EXI.getDataAdapter().mx.phasing.getCSVPhasingFilesByPhasingAttachmentIdURL(getCSV(stepsBySpaceGroup)),
                   downloadFilesUrl : EXI.getDataAdapter().mx.phasing.getDownloadFilesByPhasingStepIdURL(getStepId(stepsBySpaceGroup))
                   
               });
               
               
               if (_.find(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"}) != null){
                   var modelBuildingSteps = _.filter(stepsBySpaceGroup, {"PhasingStep_phasingStepType" : "MODELBUILDING"});
                   node["metrics"] = [];
                   if (modelBuildingSteps){
                       var metrics = _.map(modelBuildingSteps, "metric");
                       var statisticsValues = _.map(modelBuildingSteps, "statisticsValue");
                       debugger
                       for (var i=0; i < metrics.length; i++){
                           var singleMetric = metrics[i].split(",");
                           var values = statisticsValues[i].split(",");
                           var metricsPerModel = {};
                           
                           for (var j = 0; j < singleMetric.length; j++) {   
                                /* Spaces are replaced by _ to be used on the templates */                        
                                metricsPerModel[singleMetric[j].replace(/ /g, '_')] = values[i];                           
                           }
                           node["metrics"].push(metricsPerModel);
                       }
                       
                     
                   }     
                   node["phasingStepId"] = modelBuildingSteps[0].PhasingStep_phasingStepId;
                                                                             
                  
               }
               
               /** This will be used to sort */
               var count = 0;
               if (node.prepare){
                   count = count + 1;
               }
               if (node.sub){
                   count = count + 1;
               }
               if (node.phasing){
                   count = count + 1;
               }
               if (node.model){
                   count = count + 1;
               }
               
               node["count"] = count;
               
               parsed.push(node);
           }
       }
       
        parsed.sort(function(a,b){return a.count < b.count;});
        console.log(parsed);
        var html = "";     
        dust.render("phasing.mxdatacollectiongrid.template",  parsed, function(err, out) {
                    html = html + out;
        });
        $(target).html(html);        
    };
    var onError = function(sender, msg){
        $(target).html("Error retrieving data " + msg);        
    };                    
                    
    EXI.getDataAdapter({onSuccess : onSuccess}).mx.phasing.getPhasingViewByDataCollectionId(dataCollectionId);  
};

/**
* Displays the sample tab
*
* @param {Object} target HTML node where the content will be rendered
* @param {Integer} dataCollectionId 
* @method displaySampleTab
*/
UncollapsedDataCollectionGrid.prototype.displaySampleTab = function(target, dataCollectionId) {                 
    var dc =_.find(grid.dataCollectionGroup, {"DataCollection_dataCollectionId":Number(dataCollectionId)});
    if (dc){
        if ($("#sample_puck_layout_" +dataCollectionId)){
            
            if (dc.Container_containerId){
                var container =_.filter(grid.dataCollectionGroup, {"Container_containerId":Number(dc.Container_containerId)});
                if(container){
                    var dataCollectionIds = {};
                    for (var i = 1 ; i <= container[0].Container_capacity ; i++) {
                        var sampleByLocation = _.filter(container,{"BLSample_location":i.toString()});
                        if (sampleByLocation.length > 0) {
                            var ids = [];
                            for (sample in sampleByLocation){
                                ids.push(sampleByLocation[sample].DataCollection_dataCollectionId);
                            }
                            dataCollectionIds[i] = ids.toString();
                        }
                    }
                }
                var attributesContainerWidget = {
                                                mainRadius : 100, 
                                                enableMouseOver : false, 
                                                enableClick : false,
                                                dataCollectionIds : dataCollectionIds
                };
                                            
                var puck = new UniPuckWidget(attributesContainerWidget);
                
                if (dc.Container_capacity == 10){
                    puck = new SpinePuckWidget(attributesContainerWidget);
                }
                
                $("#sample_puck_layout_" + dataCollectionId).html(puck.getPanel());
                
                var onSuccess = function(sender, samples){
                    if (samples){
                        puck.loadSamples(samples,dc.BLSample_location);
                    }
                };
                
                EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(dc.Container_containerId);
            }
        }
    }
};

/**
* Attaches the events to lazy load to the images. Images concerned are with the class img-responsive and smalllazy
*
* @method attachCallBackAfterRender
*/
UncollapsedDataCollectionGrid.prototype.attachCallBackAfterRender = function() {
    
    var _this = this;
    
    var nodeWithScroll = document.getElementById(document.getElementById(_this.id).parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.id);
    
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
       
    var timer1 = setTimeout(function() {  $('.img-responsive').lazy(lazy);}, 500);
    var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500); 
    
    var tabsEvents = function(grid) {
            this.grid = grid;
            $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
                var target = $(e.target).attr("href"); 
                
                /** Activate tab of data collections */
                if (target.startsWith("#dc")){
                   var dataCollectionGroupId = target.slice(4);
                   _this.displayDataCollectionTab(target, dataCollectionGroupId);
                }
                
                if (target.startsWith("#re")){
                    var dataCollectionId = target.slice(4);  
                    _this.displayResultAutoprocessingTab(target, dataCollectionId);                                       
                }

                 if (target.startsWith("#sa")){                    
                    var dataCollectionId = target.slice(4);                        
                    _this.displaySampleTab(target, dataCollectionId);                   
                }
                
                if (target.startsWith("#wf")){      
                    var dataCollectionId = target.slice(4);
                    _this.displayWorkflowsTab(target, dataCollectionId);              
                   
                }
                
                  if (target.startsWith("#ph")){                           
                    var dataCollectionId = target.slice(4);
                    _this.displayPhasingTab(target, dataCollectionId);              
                   
                }
            });
    };
    var timer3 = setTimeout(tabsEvents, 500, _this);
};
function WorkflowSectionDataCollection(args) {
	this.noFoundClass = "summary_datacollection_noFound";
	this.failedClass = "summary_datacollection_failed";
	this.successClass = "summary_datacollection_success";
}





/**
 * 
Input: 	
wokflowSteps = "Snapshots,Automesh,Line,Mesh,Line,Line,Characterisation,Line,Line,Line,Characterisation,Line,Line,Line,Characterisation,Line,Line,Line,Characterisation,Line,Line,Line,Characterisation"
workflowStepStatus = "Success,Success,Success,Success,Success,Success,Failure,Success,Success,Success,Failure,Success,Success,Success,Failure,Success,Success,Success,Failure,Success,Success,Success,Failure"

Output:
[...{"step":"Line","count":3,"status":"Success"}...]
 * 
 */
WorkflowSectionDataCollection.prototype.parseWorkflow = function(dataCollectionGroup){
	var steps = [];
	var status = [];
	var ids = [];
    var cleaned = [];
	if ( dataCollectionGroup.WorkflowStep_workflowStepType != null){
		steps = dataCollectionGroup.WorkflowStep_workflowStepType.split(",");
		status = dataCollectionGroup.WorkflowStep_status.split(",");
		ids = dataCollectionGroup.WorkflowStep_workflowStepId.split(",");
		
		
		//var previous = null;
		for (var i = 0; i < steps.length; i++){
			var step = {
					status : status[i],
					name   : steps[i],
					workflowStepId  : ids[i],
					workflowStepIds : ids, 
					img : EXI.getDataAdapter().mx.workflowstep.getImageByWorkflowStepId(ids[i])
			};
			//if (previous != steps[i]){
				cleaned.push(step);
				
			//}
			//else{
			//	cleaned[cleaned.length - 1].push(step);
			//}
			//previous = steps[i];
		}
	}
	return cleaned;
	
};


WorkflowSectionDataCollection.prototype.getHTML = function(dataCollectionGroup){
	var parsed = [];
	var html = "";

	if (dataCollectionGroup.WorkflowStep_workflowStepType){
		parsed = this.parseWorkflow(dataCollectionGroup);
		
	}
	dust.render("workflowstepsection", parsed, function(err, out){
		html = out;
     });
	
	
	return html;
};



/**
* It shows a summary about the phasing steps. Basically, one line per space group 
*
* @class FileManagerPhasingGrid
* @constructor
*/
function FileManagerPhasingGrid(args) {	
    this.onSelect = new Event(this);
}

FileManagerPhasingGrid.prototype.load = function(data) {
    this.data = data;
	this.store.loadData(data);
};

FileManagerPhasingGrid.prototype.findPDBMatch = function(mapFilePath) {
    for (var i = 0; i < this.data.length; i++) {
        var element = this.data[i];
        if (element.fileName.endsWith(".pdb")){
            /*var name = element.fileName.substring(0,element.fileName.lastIndexOf("."));
            var nameMap = mapFilePath.substring(0,mapFilePath.lastIndexOf("."));
            if (name == nameMap){*/
                return element;
            //} 
            
        }
    }
	
};

FileManagerPhasingGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [  
                    'fileType',
                    'phasingProgramAttachmentId',
                    'filePath',
                    'phasingPrograms',
                    'fileName']
	});
    
   
        
    
	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Files',
		store : this.store,
        flex : 0.3,
        height : 600,
        cls : 'border-grid',
       	emptyText : "No files found",

		layout : 'fit',
        margin : "0 5 0 5",
        viewConfig : {
                stripeRows : true                   
            },
		columns : [ 
                    {
                        text : 'fileName',
                        flex : 1,
                        dataIndex : 'fileName'
                    },
                    {
                        text : 'Viewer',
                        flex : 1,                      
                        dataIndex : 'filePath',
                        renderer : function(grid, e, record){
                            var pdb = null;
                            var href= null;
                            if (record.data.fileName.endsWith(".map")){
                                pdb = _this.findPDBMatch(record.data.fileName);
                                if (pdb != null){
                                    
                                    pdb = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(pdb.phasingProgramAttachmentId);
                                    var map = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(record.data.phasingProgramAttachmentId);                                     
                                    href= "viewers/uglymol/1mru.html?pdb=" + pdb + "&map="+map;
                                    return "<a target='_blank' style='showme openGridButton' href='" + href+"'><div style='text-align:center;color:white;width:60px;background-color:#3892d3;'>VIEWER</div></a>";   
                                    
                                }
                            }
                            
                            if (record.data.fileName.endsWith(".pdb")){
                                pdb = _this.findPDBMatch(record.data.fileName);
                                if (pdb != null){                                    
                                    pdb = EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(pdb.phasingProgramAttachmentId);                                                                         
                                    href= "viewers/pv/index.html?pdb=" + pdb;
                                    return "<a target='_blank' style='showme openGridButton' href='" + href+"'><div style='text-align:center;color:white;width:60px;background-color:#3892d3;'>VIEWER</div></a>";   
                                    
                                }
                            }
                        }
                    },
                    {
                        text : 'filePath',
                        flex : 1,
                        hidden : true,
                        dataIndex : 'filePath'
                    },
                    {
                        xtype:'actioncolumn',
                        flex : 0.3,
                        text : 'Download',
                        items: [{
                            icon: '../images/icon/ic_get_app_black_24dp.png',  // Use a URL in the icon config
                            tooltip: 'Download',
                            handler: function(grid, rowIndex, colIndex) {
                                
                                  window.open(EXI.getDataAdapter().mx.phasing.downloadPhasingFilesByPhasingAttachmentId(grid.store.getAt(rowIndex).data.phasingProgramAttachmentId));
                                
                            }
                        }]
                    }
                ]
	});
	return this.panel;
};



/**
 * It shows information about the phasing steps
 * 
 * @height
 * @searchBar
 * @collapsed
 * @width
 */
function PhasingGrid(args) {
}

/**
 * {"processingPrograms":"grenades_parallelproc",
 * "autoProcId":909816,
 * "phasingEndTime":"Feb 20, 2013 1:37:17 PM",
 * "autoProcIntegrationId":1010078,
 * "processingStatus":true,
 * "anomalous":false,
 * "name":"Thermo_2",
 * "proposalId":12,
 * "spaceGroupShortName":"C222",
 * "lowRes":"3.5",
 * "spaceGroup":" P 6 ",
 * "autoProcScalingId":909827,
 * "statisticsValue":null,
 * "enantiomorph":null,
 * "acronym":"MWB",
 * "blSampleId":525682,
 * "phasingStatus":null,
 * "code":"",
 * "phasingPrograms":"shelxc",
 * "dataCollectionId":1640501,
 * "phasingStepId":27742,
 * "solventContent":null,
 * "phasingAnalysisId":null,
 * "sessionId":43041,
 * "phasingStepType":"PREPARE",
 * "metric":null,
 * "proteinId":339373,
 * "phasingStartTime":"Feb 20, 2013 1:37:16 PM",
 * "method":"SAD",
 * "previousPhasingStepId":null,
 * "highRes":"50.0"}
 * 
 * 
 */
PhasingGrid.prototype.load = function(data) {
	this.store.loadData(data, false);
};

PhasingGrid.prototype._getTbar = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		text : 'Add',
		icon: 'images/icon/add.png',
		disabled : false,
		handler : function(widget, event) {
		
		}
	}));
	return actions;
};

PhasingGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'phasingStepId' ]
	});
    
    this.store.sort('phasingStepId');
	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Phasing steps',
		store : this.store,
        cls : 'border-grid',
		layout : 'fit',
		columns : [
             {
			text : 'phasingStepId',
            hidden : true,
			dataIndex : 'phasingStepId',
			flex : 1
		}, 
            {
			text : 'Space Group',
            hidden : true,
			dataIndex : 'spaceGroupShortName',
			flex : 1
		},
        {
			text : 'Prepare',
			dataIndex : 'phasingStepType',
			flex : 0.2,
            renderer : function(e, sample, record){
				var html  = "";
				try{              
                    dust.render("phasinggrid.prepare", record.data, function(err, out){
                        html = out;
                    });
				}
				catch(e){
					return "Parsing error";
				}
				return html;
			}
		},   
         {
			text : 'Substructure Determination',
			dataIndex : 'phasingStepType',
			flex : 0.4,
            renderer : function(e, sample, record){
				var html  = "";
				try{              
                    dust.render("phasinggrid.substructure", record.data.children, function(err, out){
                        html = out;
                    });
				}
				catch(e){
					return "Parsing error";
				}
				return html;
			}
		},    
         {
			text : 'Phasing',
			dataIndex : 'phasingStepType',
			flex : 1,
            renderer : function(e, sample, record){
				var html  = "";
                var output = function(err, out){
                            html = html + "<br />" + out;
                };
                                       
				try{   
                    var subs =  record.data.children;                    
                    for (var i = 0 ;i < subs.length; i++){ 
                        for (var j = 0 ;j < subs[i].children.length; j++){
                            var child =   subs[i].children[j];
                            if (child.metric){                                                                                              
                                  if (child.statisticsValue){                                       
                                        child.statistics = [];                                       
                                        for(k=0; k < child.metric.split(",").length; k++){
                                            child.statistics.push({
                                                name : child.metric.split(",")[k],
                                                value : child.statisticsValue.split(",")[k]
                                            });
                                       
                                    }
                                }
                            }
                        }         
                        dust.render("phasinggrid.stats", subs[i].children, output);
                    }
				}
				catch(e){
					return "Parsing error " + e;
				}
				return html;
			}
		}            
      

		],
		flex : 1
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






function PhasingViewerMainView() {
	MainView.call(this);	
	var _this = this;
	this.phasingNetworkWidget = new PhasingNetworkWidget({tbar : "MENU"});
    
   // this.phasingGrid = new PhasingGrid();
    this.summaryPhasingGrid = new SummaryPhasingGrid();
    this.fileManagerPhasingGrid = new FileManagerPhasingGrid();
    
    
    this.summaryPhasingGrid.onSelect.attach(function(sender, phasingStep){
       var onSuccess = function(sender, data){           
           if (data){
                data = _.flatten(data);
                var files = [];
                for (var i = 0; i < data.length; i++) {
                    if (data[i].fileName != null){
                        files.push(data[i]);
                    }
                    
                }           
                _this.fileManagerPhasingGrid.load(files);
                _this.fileManagerPhasingGrid.panel.setLoading(false);
           }
       };
       
       var onError = function(sender,error){
           alert(error);
           _this.fileManagerPhasingGrid.panel.setLoading(false);
       };
       _this.fileManagerPhasingGrid.panel.setLoading();    
       EXI.getDataAdapter({onSuccess : onSuccess,onError: onError }).mx.phasing.getPhasingFilesByPhasingStepId(phasingStep.phasingStepId);
	
    });
}

PhasingViewerMainView.prototype.getPanel = MainView.prototype.getPanel;


PhasingViewerMainView.prototype.getContainer = function() {
	this.tabPanel = Ext.create('Ext.tab.Panel', {
				margin : 10,
				cls : 'border-grid',
				defaults : {
						anchor : '100%'
				},
				items : [
                            
                            {
                                title: 'Summary',
                                bodyPadding: 10,
                                items : [{
                                    xtype: 'container',
                                    layout : 'hbox',
                                    items : [
                                                this.summaryPhasingGrid.getPanel(),
                                                this.fileManagerPhasingGrid.getPanel()
                                                                                    
                                    ]
                                
                                }]
                            },
                           /* {
                                title: 'Phasing Dataset',
                                bodyPadding: 10,
                                items : this.phasingGrid.getPanel()
                            },*/
                             {
                                title: 'Network',
                                bodyPadding: 10,
                                items : this.phasingNetworkWidget.getPanel()
                            }
                           
				         	
					]
			});

	return this.tabPanel;

};


PhasingViewerMainView.prototype.load = function(data, phasingStepId) {
	var _this = this;
	this.panel.setTitle("Phasing Viewer");
    
    /** filtering data */
    var phasingStepIdParantes = [];
    var aux = [];
    if (phasingStepId){
           var parent = _.find(data, function(b){return  b.phasingStepId == phasingStepId;});
          if (parent != null){ 
                aux.push(parent);
                phasingStepIdParantes.push(parent.phasingStepId);
            }
            
        var sortByPhasingId = function(b){return  b == data[i].previousPhasingStepId;};     
        for(var i =0; i< data.length; i++){            
            if (_.find(phasingStepIdParantes, sortByPhasingId(b)) != null){ 
                aux.push(data[i]);
                phasingStepIdParantes.push(data[i].phasingStepId);
            }
            
        }
        data =aux;
        
    }
    
    
    this.summaryPhasingGrid.load(data);
    _this.phasingNetworkWidget.load(data);
   
};

/**
* It shows a summary about the phasing steps. Basically, one line per space group 
*
* @class SummaryPhasingGrid
* @constructor
*/
function SummaryPhasingGrid(args) {
	
    this.pseudoFreeMin = 24;
    this.ccOfPartialModel = 60;    
    this.onSelect = new Event(this);
}

SummaryPhasingGrid.prototype.load = function(data) {
   
  /** Adding metrics as columns on the phasing Step */
   for (var i = 0; i < data.length; i++) {
       var element = data[i];
       if (element.metric){
           var metrics = element.metric.split(",");
           var statisticsValues = element.statisticsValue.split(",");
           if (metrics.length > 0){            
               for (var j = 0; j < metrics.length; j++) {                  
                   element[metrics[j]] = statisticsValues[j];
               }
               
           }
       }
   }
   this.data = data;
   this.store.loadData(data);
};


SummaryPhasingGrid.prototype.filter = function(data, metric, min, max) {        
    var filterFunction = function(b){             
        if (b){
            if(b[metric]){
                
                try{
                    if (Number(b[metric]) > min){
                        if (Number(b[metric]) < max){
                            return true;
                        }
                    }
                
                }   
                catch(e){
                    return false;
                }
            }
        }
        return false;
    };
    return _.filter(data, filterFunction);
};

SummaryPhasingGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [  
                    'phasingStepId',
                    'previousPhasingStepId',
                    'processingPrograms',
                    'processingStatus',
                    'proposalId',
                    'sessionId',
                    'solventContent',
                    'spaceGroup',
                    'spaceGroupShortName',
                    'statisticsValue',
                    'phasingStepType',
                    'method',
                    'lowRes',
                    'highRes',
                    'phasingPrograms',
                    'enantiomorph',
                    'anomalous',
                    'Pseudo_free_CC',
                    'CC of partial model',
                    'anomalous',
                    'acronym',
                    'Average Fragment Length']
	});
    
    var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
		//mode : 'multi',
		listeners : {
			select : function(sm, selection) {
               _this.onSelect.notify(selection.data);
						}

		} });
        
    this.pseudofreeCCSplitter =    Ext.create('Ext.slider.Multi', {
            width: 300,           
            hideLabel: false,
            fieldLabel : 'Pseudo Free CC',
            increment: 1,
            minValue: 0,
            maxValue: 120,
            values: [0, 100]
    });
    
    this.ccOfPartialModel =    Ext.create('Ext.slider.Multi', {
            width: 300,           
            hideLabel: false,
            fieldLabel : 'CC of Partial Model',
            increment: 1,
            minValue: 0,
            maxValue: 120,
            values: [0, 100]
    });
    
        
    this.tbar = Ext.create('Ext.toolbar.Toolbar', {
 
    width   : 500,
    items: [
       
         
         this.pseudofreeCCSplitter ,
         this.ccOfPartialModel,
     
        '-', // same as {xtype: 'tbseparator'} to create Ext.toolbar.Separator
        {
            // xtype: 'button', // default for Toolbars
            text: 'Apply filter',
            listeners : {
                click : function(){
                    var data = _this.filter(_this.data, 'Pseudo_free_CC',  _this.pseudofreeCCSplitter.getValues()[0],  _this.pseudofreeCCSplitter.getValues()[1]);
                    _this.store.loadData(_this.filter(data, 'CC of partial model',  _this.ccOfPartialModel.getValues()[0],  _this.ccOfPartialModel.getValues()[1]));
                }
                
            }
        },
          {
            // xtype: 'button', // default for Toolbars
            text: 'Clear filter',
            listeners : {
                click : function(){
                  
                    _this.store.loadData(_this.data);
                }
                
            }
        }
    ]
});

	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Phasing Steps',
		store : this.store,
        selModel : selModel,
        tbar :  this.tbar,
        height : 600,
        cls : 'border-grid',
		layout : 'fit',
        flex : 1,
         viewConfig : {
                    stripeRows : true,
                    getRowClass : function(record, rowIndex, rowParams, store){

                      /*  if (record.data.phasingStepType == "PREPARE"){
                            return "blue-grid-row";
                        }
                        if (record.data.phasingStepType == "SUBSTRUCTUREDETERMINATION"){
                            return "blue2-grid-row";
                        }
                        if (record.data.phasingStepType == "PHASING"){
                            return "blue3-grid-row";
                        }
                        if (record.data.phasingStepType == "MODELBUILDING"){
                            return "white-grid-row";
                        }
                        return "warning-grid-row";*/
                    }
                },
		columns : [ 
                         {
                            text : 'Space Group',
                            flex : 1,
                            dataIndex : 'spaceGroupShortName'
                        },
                        {
                            text : 'Steps',
                            columns : [     {
                                                text : 'Prepare',
                                                flex : 1,
                                                dataIndex : 'previousPhasingStepId',
                                                renderer : function(grid, e, record){
                                                    
                                                    if (record.data.phasingStepType == "PREPARE"){
                                                        return record.data.phasingPrograms.toUpperCase();
                                                    }
                                                }
                                            },
                                             {
                                                text : 'Subs. Deter.',
                                                flex : 1,
                                                dataIndex : 'previousPhasingStepId',
                                                renderer : function(grid, e, record){
                                                   
                                                    if (record.data.phasingStepType == "SUBSTRUCTUREDETERMINATION"){
                                                        return record.data.phasingPrograms.toUpperCase();
                                                    }
                                                }
                                            },
                                             {
                                                text : 'Phasing',
                                                flex : 1,
                                                dataIndex : 'previousPhasingStepId',
                                                renderer : function(grid, e, record){
                                                   
                                                    if (record.data.phasingStepType == "PHASING"){
                                                         return record.data.phasingPrograms.toUpperCase();
                                                    }
                                                }
                                            },
                                             {
                                                text : 'Model',
                                                flex : 1,
                                                dataIndex : 'previousPhasingStepId',
                                                renderer : function(grid, e, record){
                                                    if (record.data.phasingStepType == "MODELBUILDING"){
                                                         return record.data.phasingPrograms.toUpperCase();
                                                    }
                                                }
                                            },
                            ]
                        },
                         {
                            text : 'phasingStepId',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'phasingStepId'
                      
                        },
                         {
                            text : 'previousPhasingStepId',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'previousPhasingStepId'
                        },
                         {
                            text : 'phasingStepId',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'phasingStepId'
                        },
                        
                          {
                            text : 'Protein',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'acronym'
                        },
                         {
                            text : 'Method',
                            flex : 1,
                            dataIndex : 'method'
                        },
                         {
                            text : 'Low Resolution',
                            flex : 1,
                            dataIndex : 'lowRes',
                            renderer : function(grid, e, record){
                                                    if (record.data.phasingStepType == "MODELBUILDING"){
                                                         return record.data.lowRes + " - " + record.data.highRes ;
                                                    }
                                                }
                        },
                         {
                            text : 'High Resolution',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'highRes'
                        },
                         {
                            text : 'Enantiomorph',
                            flex : 1,
                            dataIndex : 'enantiomorph'
                        },
                         {
                            text : 'Anomalous',
                            flex : 1,
                            dataIndex : 'anomalous'
                        },
                         {
                            text : 'Solvent',
                            flex : 1,
                            dataIndex : 'solventContent'
                        },
                         {
                            text : ' Program',
                            flex : 1,
                            hidden : true,
                            dataIndex : 'phasingPrograms'
                        },
                         {
                            text : 'Pseudo Free <br />(CC)',
                            flex : 1,
                            dataIndex : 'Pseudo_free_CC'
                        },
                         {
                            text : 'Partial Model <br />(CC)',
                            flex : 1,
                            dataIndex : 'CC of partial model'
                        },
                          {
                            text : 'Avg. Fragment <br />Length',
                            flex : 1,
                            dataIndex : 'Average Fragment Length'
                        }
                        
                       
                        
                ]
	});
	return this.panel;
};



function ConfirmShipmentView(args) {

    this.sampleChangerName = "";
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
        }
    }

    this.sampleChangerWidget = null;
    this.selectedPuck = null;

}

ConfirmShipmentView.prototype.getPanel = function () {
    var _this = this;

    this.pucksList = Ext.create('Ext.panel.Panel', {
        cls     : 'rounded-border',
        title: 'Sample Changer',
        width : 600,
        height : 490,
        margin : 5,
        autoScroll:true,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        height : 500,
        layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
        },
        margin : 5,
        items : [this.pucksList],
			
	});

    this.panel.on('boxready', function(){
        if (_this.sampleChangerName) {
            _this.loadSampleChanger(_this.sampleChangerName)
        }
    });
    
	
	return this.panel;

}

ConfirmShipmentView.prototype.loadSampleChanger = function (sampleChangerName) {
    var _this = this;
    var data = {
        radius : 200,
        isLoading : false
    };
    var sampleChangerWidget = null;
    if (sampleChangerName == "FlexHCD") {
        sampleChangerWidget = new FlexHCDWidget(data);
    } else if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }
    this.sampleChangerWidget = sampleChangerWidget;
    this.panel.insert(0,sampleChangerWidget.getPanel());
    if (typeof(Storage) != "undefined"){
        var puckData = sessionStorage.getItem("puckData");
        if (puckData){
            this.sampleChangerWidget.load(JSON.parse(puckData));
        }
    }
    this.sampleChangerWidget.render();
    // this.sampleChangerWidget.setClickListeners();
    

    this.sampleChangerWidget.onPuckSelected.attach(function(sender,puck){
        _this.selectPuck(puck);
    });

    this.loadPucksList(this.sampleChangerWidget);
}

ConfirmShipmentView.prototype.loadPucksList = function (sampleChangerWidget) {
    var html = "";
	dust.render("confirm.table.prepare.template", {pucks : Object.values(sampleChangerWidget.getPuckData())}, function(err, out){
		html = out;
	});
    this.pucksList.add({html : html});
}
function ContainerPrepareSpreadSheet(){
    this.id = BUI.id();    
}


ContainerPrepareSpreadSheet.prototype.load = function(dewars){
    
  var hotSettings = {
    data: dewars,
    columns: [
        {
            data: 'shippingName',
            type: 'text',
            width: 40,
            readOnly: true
        },           
        {
            data: 'barCode',
            type: 'text',
            readOnly: true
        },
        {
            data: 'containerCode',
            type: 'text',
            readOnly: true
        },
        {
            data: 'sampleCount',
            type: 'text',
            readOnly: true
        },
        { 
            data : 'beamlineName',
            type: 'dropdown',			        	 								
            source: EXI.credentialManager.getBeamlineNames()
        },
        {
            data: 'sampleChangerLocation',
            type: 'text'
        }       
    ],
    stretchH: 'all',   
    autoWrapRow: true,      
    rowHeaders: true,
    colHeaders: [
        'Shipment',       
        'Barcode',
        'Container',
        'Samples',
        'Beamline',
        'Sample Changer Location'
    ]
};
    
  this.spreadSheet =  new Handsontable(document.getElementById(this.id), hotSettings);
};
ContainerPrepareSpreadSheet.prototype.getPanel = function(){
    var _this = this;    
    this.panel = Ext.create('Ext.panel.Panel', {
            title   : 'Loaded or to be Loaded on MxCube',            
            cls     : 'border-grid',            
            height  : 600,
            flex    : 0.5,  
            buttons : [{
                            text : 'Save',
                            scope : this,
                            handler : function() {
                               var data = this.spreadSheet.getData();
                               var containerIdList = [];
                               var beamlineList = [];
                               var sampleLocation = [];
                               for(var i = 0; i < data.length; i++){
                                   containerIdList.push(data[i].containerId);
                                   beamlineList.push(data[i].beamlineName);
                                   sampleLocation.push(data[i].sampleChangerLocation);
                                   
                               }
                               _this.panel.setLoading();
                               var onSuccess = function(sender){
                                   _this.panel.setLoading(false);
                               };
                               
                               var onError = function(sender, error){
                                   EXI.setError(error);                                   
                                   _this.panel.setLoading(false);
                               };
                               EXI.getDataAdapter({onSuccess:onSuccess, onError: onError}).proposal.dewar.updateSampleLocation(containerIdList, beamlineList, sampleLocation);
                            }
		    }],                     
            margin  : 5,
            items   : [
                {
                    html : "<div style='height:700px;' id='" + this.id +"'></div>",
                    flex : 1,
                    height : 700                              
                }
                
            ]
    });
    return this.panel;    
};
/**
* This class renders a grid containing container information
* @class ContainerPrepareSpreadSheetTest
* @constructor
*/
function ContainerPrepareSpreadSheetTest(args){
    this.id = BUI.id();

    this.height = 600;
    this.width = 600;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    this.onSelectRow = new Event(this);
    this.onContainerListLoaded = new Event(this);
};

/**
* Returns a panel containing the grid of containers
*
* @method getPanel
* @return A panel containing the grid of containers
*/
ContainerPrepareSpreadSheetTest.prototype.getPanel = function() {
    var _this = this;

    this.store = Ext.create('Ext.data.Store', {
        storeId:'spreadSheedStore',
        fields:['shippingName', 'barCode', 'containerCode', 'containerType', 'sampleCount', 'beamlineName','sampleChangerLocation','dewarId','containerId','capacity'],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Loaded or to be Loaded on MxCube',
        store: this.store,
        cls : 'border-grid',
        height  : this.height,
        width  : this.width,
        flex    : 0.5,
        columns: [
            {
                dataIndex: 'rowIndex',
                sortable : false,
                autoSizeColumn: true,
                // other config you need..
                renderer : function(value, metaData, record, rowIndex)
                {
                    return rowIndex+1;
                }
            },
            {
                header: 'Shipment',
                dataIndex: 'shippingName',
                type: 'text',
                flex: 1,
                readOnly: true
            },
             {
                header: 'DewarId',
                dataIndex: 'dewarId',
                type: 'text',
                flex: 1,
                readOnly: true
            },              
             {
                header: 'ContainerId',
                dataIndex: 'containerId',
                type: 'text',
                flex: 1,
                readOnly: true
            },   
            {
                header: 'Barcode',
                dataIndex: 'barCode',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Container',
                dataIndex: 'containerCode',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Container type',
                dataIndex: 'containerType',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Samples',
                dataIndex: 'sampleCount',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            { 
                header : 'Beamline',
                dataIndex: 'beamlineName',
                type: 'dropdown',			        	 								
                flex: 1,
                source: EXI.credentialManager.getBeamlineNames()
            },
            {
                header: 'Sample Changer Location',
                dataIndex: 'sampleChangerLocation',
                flex: 1,
                type: 'text'
            }       
        ],
        viewConfig: {
            listeners: {
                refresh: function(dataview) {
                    dataview.panel.columns[0].autoSize();//works on the first colum
                }
            }
        },
        listeners: {
            itemclick: function(grid, record, item, index, e) {
                _this.onSelectRow.notify(record);             
            },
        },
        margin  : 5,
        items   : [
            {
                html : "<div style='height:700px;' id='" + this.id +"'></div>",
                flex : 1,
                height : 400                              
            }
            
        ]
    });

    //arrowUp and arrowDown listeners
    this.panel.view.addElListener('keyup', function(event,row) {
        if (event.keyCode == 38 || event.keyCode == 40) { 
            _this.onSelectRow.notify(_this.panel.store.getAt(Number(row.cells[0].innerText)-1));
        }
    });

    return this.panel;
};

/**
* Loads the processing dewars from the database
*
* @method loadProcessingDewars
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.loadProcessingDewars = function () {
    var _this = this;

    this.panel.setLoading();
    var onSuccessProposal = function(sender, containers) {
        _this.load(_.filter(containers, function(e){return e.shippingStatus == "processing";}));
        _this.panel.setLoading(false);
        _this.onContainerListLoaded.notify();
    };
    var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
        _this.panel.setLoading(false);
    };
    EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
}

/**
* Loads an array of dewars to the store
*
* @method load
* @param dewars
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.load = function(dewars) {
   
    var data = [];
    //Parse data
    for (dewar in dewars) {
        if (dewars[dewar].sampleCount > 0){
            var containerType = "Unipuck";
            if (dewars[dewar].capacity){
                if (dewars[dewar].capacity == 10) {
                    containerType = "Spinepuck";
                }
            }
            data.push({
                shippingName : dewars[dewar].shippingName,
                barCode : dewars[dewar].barCode,
                containerCode : dewars[dewar].containerCode,
                containerType : containerType,
                sampleCount : dewars[dewar].sampleCount,
                beamlineName : dewars[dewar].beamlineName,
                sampleChangerLocation : dewars[dewar].sampleChangerLocation,
                dewarId : dewars[dewar].dewarId,
                containerId : dewars[dewar].containerId,
                capacity : dewars[dewar].capacity
            });
        }
    }
    this.store.loadData(data);
};

/**
* Updates the sample changer location cell of the record with the corresponding container Id
*
* @method updateSampleChangerLocation
* @param {Integer} containerId The container Id of the record to be updated
* @param {Integer} location The new value for the sample changer location cell in the grid
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.updateSampleChangerLocation = function (containerId, location) {
    var _this = this;

    var recordsByContainerId = _.filter(_this.panel.store.data.items,function(o) {return o.data.containerId == containerId});

    for (var i = 0 ; i < recordsByContainerId.length ; i++) {
        var record = recordsByContainerId[i];
        if (record.get('containerId') == containerId) {
            var beamlineName = record.get('beamlineName');

            var onSuccess = function(sender, containers) {
                _this.loadProcessingDewars();
            };
            var onError = function(sender, error) {        
                EXI.setError("Ops, there was an error");
            };

            EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.dewar.updateSampleLocation([containerId], [beamlineName], [location]);
            return
        }
    }
};

/**
* This class renders a grid that allows user to select the dewars from a list.
*
* @class DewarListSelectorGrid
* @constructor
*/
function DewarListSelectorGrid(args){
    this.height = 600;
    if (args != null){
        if (args.height  != null){
            this.height = args.height;
            
        }
    }
    
    this.filterByDate = true;
    
    this.onSelect = new Event(this);
    this.onDeselect = new Event(this);
    this.onSelectionChange = new Event(this);
}


/**
* My method description.  Like other pieces of your comment blocks, 
* this can span multiple lines.
*
* @method load
* @param {Object} dewars Array of containers
*/
DewarListSelectorGrid.prototype.load = function(dewars){
    var _this = this;
    this.dewars = dewars;
    /** Filter by Dewars */ 
      
    var filtered = _.keyBy(dewars, "shippingId");
    var data = [];
    _(filtered).forEach(function(value) {
        if (_this.filterByDate){
            if (value.shippingStatus){
                if (value.shippingStatus.toUpperCase() == "PROCESSING"){
                    data.push(value);
                    return;
                }                        
            }       
        
            /** Filtering only future sessions */            
            if (value.sessionStartDate){
                if (moment().diff(moment(value.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'")) <= 0){
                    data.push(value);
                }
            }
            else{
                /** No session or not parseable */
                data.push(value);
            }
        }
        else{
                data.push(value);
        }
        
    });
        
    this.panel.setTitle(data.length + " shipments candidates for " + EXI.proposalManager.getProposals()[0].code + EXI.proposalManager.getProposals()[0].number);    
    this.store.loadData(data);

};

/**
* Return the number of containers and samples for a given dewar 
*
* @method getStatsByDewarId
* @param {Integer} dewarId DewarId
*/
DewarListSelectorGrid.prototype.getStatsByDewarId = function(shippingId){ 
    var _this = this;
    var containers = _.filter(this.dewars, function(e){return e.shippingId == shippingId;});
    var sampleCount = 0;
    _(containers).forEach(function(value) {
        sampleCount = sampleCount + value.sampleCount;
    });      
    return {
                samples     : sampleCount,
                dewars      : Object.keys(_.groupBy(containers, "dewarId")).length,
                containers   : containers.length
        
    };
};

DewarListSelectorGrid.prototype.getSelectedData = function() {
	var elements = this.panel.getSelectionModel().selected.items;
	var data = [];
	for (var i = 0; i < elements.length; i++) {
		data.push(elements[i].data);
	}
	return data;
};

DewarListSelectorGrid.prototype.getStore = function(){
    this.store = Ext.create('Ext.data.Store', {
        fields:['beamlineLocation', 'storageLocation','containerStatus','containerType','sessionStartDate','creationDate','beamLineOperator','shippingStatus','shippingName', 'barCode', 'beamlineName', 'dewarCode', 'dewarStatus', 'sampleChangerLocation', 'sampleCount', 'sessionStartDate', 'type']
    });
    return this.store;
};
DewarListSelectorGrid.prototype.getPanel = function(){
    var _this = this;
   
    this.tbar = Ext.create('Ext.toolbar.Toolbar', {
    
    items: [
       
        {
            xtype       : 'checkboxfield',
            boxLabel    : 'Display only shipments scheduled for future sessions',
            checked     : this.filterByDate,
            listeners : {
                change : function( cb, newValue, oldValue, eOpts ){
                    _this.filterByDate = newValue;
                    _this.load(_this.dewars);
                }
                
            }
        }
    ]
    });

    this.panel = Ext.create('Ext.grid.Panel', {
            title: 'Select dewars',
            store: this.getStore(),
            cls : 'border-grid',           
            height : this.height, 
            flex : 0.5, 
            tbar : this.tbar,                 
            margin : 5,
            columns: [ 
                {
                    text    : 'Shipment',
                    columns : [
                         { text: 'Name',  dataIndex: 'shippingName', width: 150 },
                         { text: 'Status',  dataIndex: 'shippingStatus', flex: 1 },
                         { text: 'Created on',  dataIndex: 'creationDate', flex: 1,   hidden : true,
                            renderer : function(grid, a, record){
                                if (record.data.creationDate){
                                    return moment(record.data.creationDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },
                                                 
                    ]                                         
                },
                {
                    text    : 'Experiment',
                    columns : [
                            { text: 'Start on',  dataIndex: 'sessionStartDate', flex: 2, 
                            renderer : function(grid, a, record){
                                if (record.data.sessionStartDate){
                                    return moment(record.data.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },
                            { text: 'beamline', dataIndex: 'beamlineName', flex: 1 },     
                            { text: 'Local contact',  dataIndex: 'beamLineOperator', flex: 2, hidden : true  }                 
                    ]                                         
                },              
                 {      
                        text: '#Dewars/#Parcels (#Samples)',     
                        flex: 1,
                        renderer : function(grid, e, record){
                            var stats =  _this.getStatsByDewarId(record.data.shippingId);
                            return stats.dewars + " / " + stats.containers + " (" +  stats.samples + ")";
                            
                        }
                },
                {
                    xtype: 'actioncolumn',
                    flex : 0.3,
                    items: [
                               
                                 {
                                    icon: '../images/icon/add.png',
                                    handler: function (grid, rowIndex, colIndex) {
                                        
                                            grid.getSelectionModel().select(rowIndex);
                                            
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {
                                            // Returns true if 'editable' is false (, null, or undefined)
                                            return record.data.shippingStatus == "processing";
                                    }
                                 }
                                   
                            
                    ]
                },
                  {
                    xtype: 'actioncolumn',
                     flex : 0.3,
                    items: [
                              
                                 {
                                    icon: '../images/icon/ic_highlight_remove_black_48dp.png',
                                    handler: function (grid, rowIndex, colIndex) {
                                        
                                            grid.getSelectionModel().select(rowIndex);
                                            
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {
                                            // Returns true if 'editable' is false (, null, or undefined)
                                            return record.data.shippingStatus != "processing";
                                    }
                                 }
                                   
                            
                    ]
                }
            ],
             viewConfig : {
                stripeRows : true,
                getRowClass : function(record, rowIndex, rowParams, store){

                    if (record.data.shippingStatus == "processing"){
                         return "warning-grid-row";                       
                    }
                   
                }
	    	},
    });
    return this.panel;
    
};

/**
* This class renders a grid that allows user to select the dewars from a list.
*
* @class DewarListSelectorGrid
* @constructor
*/
function DewarListSelectorGridTest(args){
    this.height = 600;
    this.width = 1000;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    this.filterByDate = true;
    
    this.onSelect = new Event(this);
    this.onDeselect = new Event(this);
    this.onSelectionChange = new Event(this);
}


/**
* Loads a set if shipments
*
* @method load
* @param {Object} dewars Array of containers
*/
DewarListSelectorGridTest.prototype.load = function(dewars){
    var _this = this;
    this.dewars = dewars;
    /** Filter by Dewars */ 
      
    var filtered = _.keyBy(dewars, "shippingId");
    var data = [];
    _(filtered).forEach(function(value) {
        if (_this.filterByDate){
            if (value.shippingStatus){
                if (value.shippingStatus.toUpperCase() == "PROCESSING"){
                    data.push(value);
                    return;
                }                        
            }       
        
            /** Filtering only future sessions */            
            if (value.sessionStartDate){
                if (moment().diff(moment(value.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'")) <= 0){
                    data.push(value);
                }
            }
            else{
                /** No session or not parseable */
                data.push(value);
            }
        }
        else{
                data.push(value);
        }
        
    });
        
    this.panel.setTitle(data.length + " shipments candidates for " + EXI.proposalManager.getProposals()[0].code + EXI.proposalManager.getProposals()[0].number);    
    this.store.loadData(data);

};

/**
* Return the number of containers and samples for a given dewar 
*
* @method getStatsByDewarId
* @param {Integer} dewarId DewarId
*/
DewarListSelectorGridTest.prototype.getStatsByDewarId = function(shippingId){ 
    var _this = this;
    var containers = _.filter(this.dewars, function(e){return e.shippingId == shippingId;});
    var sampleCount = 0;
    _(containers).forEach(function(value) {
        sampleCount = sampleCount + value.sampleCount;
    });      
    return {
                samples     : sampleCount,
                dewars      : Object.keys(_.groupBy(containers, "dewarId")).length,
                containers   : containers.length
        
    };
};

DewarListSelectorGridTest.prototype.getSelectedData = function() {
	var elements = this.panel.getSelectionModel().selected.items;
	var data = [];
	for (var i = 0; i < elements.length; i++) {
		data.push(elements[i].data);
	}
	return data;
};

DewarListSelectorGridTest.prototype.getStore = function(){
    this.store = Ext.create('Ext.data.Store', {
        fields:['beamlineLocation', 'storageLocation','containerStatus','containerType','sessionStartDate','creationDate','beamLineOperator','shippingStatus','shippingName', 'barCode', 'beamlineName', 'dewarCode', 'dewarStatus', 'sampleChangerLocation', 'sampleCount', 'sessionStartDate', 'type']
    });
    return this.store;
};
DewarListSelectorGridTest.prototype.getPanel = function(){
    var _this = this;
   
    this.tbar = Ext.create('Ext.toolbar.Toolbar', {
        items: [
            {
                xtype       : 'checkboxfield',
                boxLabel    : 'Display only shipments scheduled for future sessions',
                checked     : this.filterByDate,
                listeners : {
                    change : function( cb, newValue, oldValue, eOpts ){
                        _this.filterByDate = newValue;
                        _this.load(_this.dewars);
                    }
                    
                }
            }
        ]
    });

    this.panel = Ext.create('Ext.grid.Panel', {
            title: 'Select dewars',
            store: this.getStore(),
            // cls : 'border-grid',           
            height : this.height, 
            width : this.width,  
            flex : 0.5, 
            tbar : this.tbar,                 
            margin : 5,
            columns: [ 
                {
                    text    : 'Shipment',
                    columns : [
                         { text: 'Name',  dataIndex: 'shippingName', flex : 1 },
                         { text: 'Status',  dataIndex: 'shippingStatus', flex: 1 },
                         { text: 'Created on',  dataIndex: 'creationDate', flex: 1,   hidden : true,
                            renderer : function(grid, a, record){
                                if (record.data.creationDate){
                                    return moment(record.data.creationDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },                     
                    ]                                         
                },
                {
                    text    : 'Experiment',
                    columns : [
                            { text: 'Start on',  dataIndex: 'sessionStartDate', flex: 2, 
                            renderer : function(grid, a, record){
                                if (record.data.sessionStartDate){
                                    return moment(record.data.sessionStartDate, "'MMMM Do YYYY, h:mm:ss a'").format("DD/MM/YYYY");
                                }     
                                
                            } 
                        },
                            { text: 'beamline', dataIndex: 'beamlineName', flex: 1 },     
                            { text: 'Local contact',  dataIndex: 'beamLineOperator', flex: 2, hidden : true  }                 
                    ]                                         
                },              
                 {      
                        text: '#Dewars/#Parcels (#Samples)',     
                        flex: 1,
                        renderer : function(grid, e, record){
                            var stats =  _this.getStatsByDewarId(record.data.shippingId);
                            return stats.dewars + " / " + stats.containers + " (" +  stats.samples + ")";
                            
                        }
                },
                {
                    xtype: 'actioncolumn',
                    flex : 0.3,
                    items: [                               
                                 {
                                    icon: '../images/icon/add.png',
                                    handler: function (grid, rowIndex, colIndex) {
                                            grid.getSelectionModel().select(rowIndex);
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {
                                            return record.data.shippingStatus == "processing";
                                    }
                                 }                                                               
                    ]
                },
                  {
                    xtype: 'actioncolumn',
                     flex : 0.3,
                    items: [                              
                                 {
                                    icon: '../images/icon/ic_highlight_remove_black_48dp.png',
                                    handler: function (grid, rowIndex, colIndex) {                                        
                                            grid.getSelectionModel().select(rowIndex);                                            
                                            _this.onSelect.notify(_this.store.getAt(rowIndex).data);
                                    },
                                     isDisabled : function(view, rowIndex, colIndex, item, record) {                                            
                                            return record.data.shippingStatus != "processing";
                                    }
                                 }
                    ]
                }
            ],
             viewConfig : {
                stripeRows : true,
                getRowClass : function(record, rowIndex, rowParams, store){

                    if (record.data.shippingStatus == "processing"){
                         return "warning-grid-row";                       
                    }
                   
                }
	    	},
    });
    return this.panel;    
};

/**
* This class renders a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
* @class LoadSampleChangerView
* @constructor
*/
function LoadSampleChangerView (args) {
    var _this = this;

    this.height = 600;
    this.width = 600;
    this.widgetRadius = 110;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    };

    this.containerListEditor = new ContainerPrepareSpreadSheetTest({height : 480,width : 600});
    this.previewPanelView = new PreviewPanelView({height : 200});
    this.sampleChangerName = "";
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
        }
    }

    this.onSelectRow = new Event(this);
    this.onPuckSelected = new Event(this);
    this.onSampleChangerSelected = new Event(this);
    this.onEmptyButtonClicked = new Event(this);

    this.containerListEditor.onSelectRow.attach(function(sender, row){
		_this.onSelectRow.notify(row);
	});

    this.containerListEditor.onContainerListLoaded.attach(function(sender){
        _this.loadSampleChangerWidgetFromContainersList();
    });

    this.previewPanelView.onEmptyButtonClicked.attach(function(sender){
        _this.onEmptyButtonClicked.notify();
    });
};

/**
* Generates a sampleChangerWidget given its name. It also checks for puck data on the sessionStorage
*
* @method generateSampleChangerWidget
* @param {String} sampleChangerName The name of the sampleChangerWidget to be generated
* @return A sampleChangerWidget
*/
LoadSampleChangerView.prototype.generateSampleChangerWidget = function (sampleChangerName) {
    var _this = this;
    var data = {
        radius : this.widgetRadius,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }

    return sampleChangerWidget;
};

/**
* Loads the sampleChangerWidget using the containerListEditor
*
* @method loadSampleChangerWidgetFromContainersList
* @return 
*/
LoadSampleChangerView.prototype.loadSampleChangerWidgetFromContainersList = function () {
    var _this = this;
    
    this.sampleChangerWidget.emptyAllPucks();
    var filledContainers = {};
    for (var i = 0 ; i < this.containerListEditor.panel.store.data.length ; i++){
        var record = this.containerListEditor.panel.store.getAt(i);
        if (record.get('sampleChangerLocation') != " "){
            var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(record.get('sampleChangerLocation')));
            if (puckId) {
                filledContainers[record.get('containerId')] = puckId;
                var puck = this.sampleChangerWidget.findPuckById(puckId);
                if (puck.capacity != record.get('capacity')){
                    $.notify("Warning: The container type of the container " + record.get('containerCode') + " does not match with the container on that location.", "warn");
                    Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
                }
            } else {
                $.notify("Warning: The sample in the container " + record.get('containerCode') + " has an incorrect location value for this type of sample changer.", "warn");
                Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
            }
        } else {
            $.notify("Warning: The container " + record.get('containerCode') + " has no sample changer location value.", "warn");
            Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
        }
    }
        
    if (!_.isEmpty(filledContainers)){
        var onSuccess = function (sender, samples) {
            var errorPucks = _this.sampleChangerWidget.loadSamples(samples,filledContainers);
            if (errorPucks.length > 0){
                for (index in errorPucks) {
                    var puck = errorPucks[index];
                    var recordsByLocation = _.filter(_this.containerListEditor.panel.store.data.items,function(o) {return o.data.sampleChangerLocation == _this.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id)});
                    for (i in recordsByLocation) {
                        var record = recordsByLocation[i];
                        Ext.fly(_this.containerListEditor.panel.getView().getNode(record)).addCls("error-row");
                    }
                }
            }
        }

        EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(_.keys(filledContainers));
    }
};

/**
* Returns a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
*
* @method getPanel
* @return A panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
*/
LoadSampleChangerView.prototype.getPanel = function () {
    var _this = this;

    this.sampleChangerWidget = this.generateSampleChangerWidget(this.sampleChangerName);

    this.widgetContainer = Ext.create('Ext.panel.Panel', {
        width : 400,
        height : 2*this.widgetRadius,
        margin : 8,
        layout: {
            type: 'hbox',
            pack: 'center'
        },  
        items : [this.sampleChangerWidget.getPanel()]
    });

    this.verticalPanel = Ext.create('Ext.panel.Panel', {
        // layout : 'hbox',
            items : [
                        this.widgetContainer    
            ]
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        // title : 'Load the sample changer',
        layout : 'hbox',
        height : this.height,
        width : this.width,
        margin : 5,
        items : [
                    this.containerListEditor.getPanel(),
                    this.verticalPanel  
        ]
    });

    this.panel.on('boxready', function() {
        _this.sampleChangerWidget.setClickListeners();
        _this.sampleChangerWidget.onPuckSelected.attach(function(sender, puck){
            _this.onPuckSelected.notify(puck);
        });
        _this.sampleChangerWidget.render();
    });

    return this.panel;
};

/**
* Cleans and removes the previewPanelView
*
* @method cleanPreviewPanel
* @return
*/
LoadSampleChangerView.prototype.cleanPreviewPanel = function () {
    this.previewPanelView.clean();
    this.verticalPanel.remove(this.previewPanelView.panel);
};

/**
* Cleans and removes the previewPanelView
*
* @method cleanPreviewPanel
* @return
*/
LoadSampleChangerView.prototype.previewPuck = function (puckContainer, data, instructionsButtonText) {
    if (this.previewPanelView.previewPanel){
        this.cleanPreviewPanel();
    }
    this.verticalPanel.add(this.previewPanelView.getPanel());
    this.previewPanelView.loadPuck(puckContainer, data, instructionsButtonText);
};
function PrepareMainView() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];

	MainView.call(this);

    var _this = this;
    
    this.dewarListSelector = new DewarListSelectorGrid({height : 600});
    this.dewarListSelector.onSelect.attach(function(sender, dewar){                     
            if (dewar.shippingStatus == "processing"){
                _this.updateStatus(dewar.shippingId, "at_ESRF");
            } 
            if (dewar.shippingStatus != "processing"){
                _this.updateStatus(dewar.shippingId, "processing");
            }      
     });
     
    this.dewarListSelector.onSelectionChange.attach(function(sender, dewars){
    });
    
	this.containerListEditor = new ContainerPrepareSpreadSheet({height : 600});
}

PrepareMainView.prototype.updateStatus = function(shippingId, status) {
    var _this = this;
    _this.dewarListSelector.panel.setLoading("Updating shipment Status");
    var onStatusSuccess = function(sender, dewar) {     
        EXI.mainStatusBar.showReady("Processing update successfully");
        _this.dewarListSelector.panel.setLoading(false);
        _this.load();
    };
    var onError = function(data){
            EXI.setError(data);
    };
    
    EXI.getDataAdapter({onSuccess : onStatusSuccess, onError : onError}).proposal.shipping.updateStatus(shippingId,status);
};

PrepareMainView.prototype.getPanel = function() {
	this.panel =  Ext.create('Ext.panel.Panel', {
           layout : 'hbox',
            items : [
                        this.dewarListSelector.getPanel(), 
                        this.containerListEditor.getPanel()        
            ]
	});    
    return this.panel;
};

PrepareMainView.prototype.load = function() {
    var _this = this;
    _this.panel.setTitle("Prepare Experiment");
    _this.dewarListSelector.panel.setLoading();
    var onSuccessProposal = function(sender, containers) {        
        _this.containers = containers;
        
        _this.dewarListSelector.load(containers);
        _this.dewarListSelector.panel.setLoading(false);
        
        /** Selecting containers that are processing */
        _this.containerListEditor.load(_.filter(containers, function(e){return e.shippingStatus == "processing";}));
        
    };
     var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
        _this.dewarListSelector.panel.setLoading(false);
    };
    
    EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
};

/**
* This class renders the steps and panels of every class used in the prepare experiment tab
*
* @class PrepareMainViewTest
* @constructor
*/
function PrepareMainViewTest(args) {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];
    
	MainView.call(this);
    
    var _this = this;

    this.currentStep = 1;
    if (args) {
        if (args.currentStep) {
            this.currentStep = args.currentStep;
        }
    }

    this.steps = ["","/selectSampleChanger","/loadSampleChanger","/confirm"];

    this.height = 550;
    this.width = 1300;
    
    this.dewarListSelector = new DewarListSelectorGridTest({height : this.height - 12, width : this.width - 60});
    this.sampleChangerSelector = new SampleChangerSelector({height : this.height - 12, width : this.width - 0});
    this.loadSampleChangerView = new LoadSampleChangerView({height : this.height - 12, width : this.width - 0});
    this.confirmShipmentView = new ConfirmShipmentView();

    this.dewarListSelector.onSelect.attach(function(sender, dewar){  
            $('#step-3').attr("disabled", true);
            _this.loadSampleChangerView.sampleChangerName = "";
            _this.save("sampleChangerName","");     
            if (dewar.shippingStatus == "processing"){
                _this.updateStatus(dewar.shippingId, "at_ESRF");
            } 
            if (dewar.shippingStatus != "processing"){
                _this.updateStatus(dewar.shippingId, "processing");
            }      
     });
     
    this.dewarListSelector.onSelectionChange.attach(function(sender, dewars){
    });

    this.selectedContainerId = null;
    this.selectedContainerCapacity = null;
    this.selectedPuck = null;
    this.sampleChangerName = null;

    this.sampleChangerSelector.onSampleChangerSelected.attach(function(sender,changerName){
        $('#next-button').attr("disabled", false);
        $('#step-3').attr("disabled", false);
        _this.sampleChangerName = changerName;
        _this.save('sampleChangerName', changerName);
        if (typeof(Storage) != "undefined") {
            sessionStorage.removeItem('puckData');
        }
        _this.loadSampleChangerView.sampleChangerName = changerName;
    });

    this.loadSampleChangerView.onSelectRow.attach(function(sender, row){
        if (row) {
            if (_this.selectedPuck){
                _this.deselectPuck();
            }
            if (_this.selectedContainerId) {
                if (_this.selectedContainerId == row.get('containerId')){
                    _this.deselectRow();
                    _this.loadSampleChangerView.cleanPreviewPanel();
                } else {
                    _this.deselectRow();
                    _this.setSelectedRow(row);
                }
            } else {
                _this.setSelectedRow(row);
            }
        }
	});

    this.loadSampleChangerView.onPuckSelected.attach(function(sender, puck){
        if (_this.selectedContainerId) {
            if (_this.selectedPuck) {
                if (_this.selectedPuck == puck) {
                    _this.returnToSelectionStatus();
                } else {
                    _this.loadSampleChangerPuck(puck, _this.selectedContainerId);
                }
            } else {
                _this.loadSampleChangerPuck(puck, _this.selectedContainerId);
            }
        } else {
            if (_this.selectedPuck) {
                if (_this.selectedPuck == puck) {
                    _this.returnToSelectionStatus();
                } else {
                    _this.deselectRow();
                    _this.deselectPuck();
                    _this.setSelectedPuck(puck);
                }
            } else {
                _this.setSelectedPuck(puck);
            }
        }
	});

    this.loadSampleChangerView.onEmptyButtonClicked.attach(function(sender){
        if (_this.selectedPuck){
            _this.selectedPuck.emptyAll();
            _this.drawSelectedPuck(_this.selectedPuck);
        }
        _this.loadSampleChangerView.containerListEditor.updateSampleChangerLocation(_this.selectedContainerId," ");
        _this.returnToSelectionStatus();
    });
};

PrepareMainViewTest.prototype.setSelectedRow = function (row) {
    this.loadSampleChangerView.containerListEditor.panel.getSelectionModel().select(row);
    this.selectedContainerId = row.get('containerId');
    this.selectedContainerCapacity = row.get('capacity');
    this.drawSelectedPuckFromRecord(row);
    this.loadSampleChangerView.sampleChangerWidget.disablePucksOfDifferentCapacity(this.selectedContainerCapacity);

    if (!this.selectedPuck) {
        var puckId = this.loadSampleChangerView.sampleChangerWidget.convertSampleChangerLocationToId(Number(row.get('sampleChangerLocation')));
        if (puckId){
            var puck = this.loadSampleChangerView.sampleChangerWidget.findPuckById(puckId);
            this.setSelectedPuck(puck);
        }
    }
};

/**
* Method executed once a puck from the sample changer widget is clicked.
*
* @method setSelectedPuck
* @return 
*/
PrepareMainViewTest.prototype.setSelectedPuck = function (puck) {
    this.selectedPuck = puck;
    $("#" + puck.id).attr("class","puck-selected");
    if (puck.isEmpty){
        this.drawSelectedPuck(puck);
    } else if (!this.selectedContainerId) {
        for (var i = 0 ; i < this.loadSampleChangerView.containerListEditor.panel.store.data.length ; i++) {
            var record = this.loadSampleChangerView.containerListEditor.panel.store.getAt(i);
            if (record.get('containerId') == puck.containerId) {
                this.setSelectedRow(record);
            }
        }
    }
};


/**
* Stores on the DB the status given a shippingId
* Status may be : [at_ESRF, processing, opened, ready to go]
*
* @method updateStatus
* @return 
*/
PrepareMainViewTest.prototype.updateStatus = function(shippingId, status) {
    var _this = this;
    _this.dewarListSelector.panel.setLoading("Updating shipment Status");
    var onStatusSuccess = function(sender, dewar) {             
        EXI.mainStatusBar.showReady("Processing update successfully");
        _this.dewarListSelector.panel.setLoading(false);
        _this.load();
    };
    var onError = function(data){
            EXI.setError(data);
    };
    
    EXI.getDataAdapter({onSuccess : onStatusSuccess, onError : onError}).proposal.shipping.updateStatus(shippingId,status);
};

/**
* Manages the showing and hiding buttons
*
* @method manageButtons
* @return 
*/
PrepareMainViewTest.prototype.manageButtons = function () {
    if (this.currentStep == 1) {
        $('#previous-button-div').hide();
        $('#next-button').attr("disabled", false); 
    } else {
        $('#previous-button-div').show();
    }
    if (this.currentStep == 2) {
        $('#next-button').attr("disabled", true);
    }
    if (this.currentStep < 3) {
        $('#next-button-div').show();  
        $('#done-button-div').hide();
    }
    if (this.currentStep == 3) {
        $('#next-button-div').hide();
    }
};

/**
* Manages the step change when the buttons next or previous are clicked
*
* @method changeStep
* @param {Integer} direction An integer that is positive for the next button and negative for the previous button
* @return 
*/
PrepareMainViewTest.prototype.changeStep = function (direction) {
    this.currentStep += direction;
    location.href = "#/mx/prepare/main" + this.steps[this.currentStep-1];
};

/**
* Manages the disable state of the step buttons
*
* @method manageStepButtons
* @return 
*/
PrepareMainViewTest.prototype.manageStepButtons = function () {
    if (this.loadSampleChangerView.sampleChangerName == "") {
        $('#step-3').attr("disabled", true);
    } else {
        $('#step-3').attr("disabled", false);
    }
    for (var i = 1 ; i <= 4 ; i++){
        if (i == this.currentStep){
            $('#step-' + i).addClass('active-step');
        }
    }
};

/**
* Loads a Ext.panel.panel constaining a Ext.panel.Panel that will render the steps inside and sets the click events for the buttons
*
* @method getPanel
* @return 
*/
PrepareMainViewTest.prototype.getPanel = function() {
    var _this = this;

    /** Main container where the steps are rendered */
    this.container = Ext.create('Ext.panel.Panel' , {
        layout: {
            type: 'hbox',
            pack: 'center'
        }, 
        height : this.height,
        width : this.width,
        cls : 'border-grid',
        items : []}
    );

	this.panel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        width : 100,
        height : this.height + 200,
        // cls : 'border-grid',
        items : [
                    this.getToolBar(), this.container,  this.getButtons()
        ]
	});

    this.panel.on('boxready', function() {
        $('#next-button').unbind('click').click(function (sender){
            if (_this.currentStep < 4) {
                _this.changeStep(1);
            }
        });
        $('#previous-button').unbind('click').click(function (sender){
            if (_this.currentStep > 0) {
                _this.changeStep(-1);             
            }
        });
        $('.step-btn').unbind('click').click(function (sender){
            if(sender.target.getAttribute("disabled") != "disabled"){
                if (_this.loadSampleChangerView.sampleChangerWidget){
                    _this.storeSampleChangerWidget(_this.loadSampleChangerView.sampleChangerWidget);
                }
                var direction = Number(sender.target.innerHTML) - _this.currentStep;
                _this.changeStep(direction);
            }
        });
        _this.manageStepButtons();
        _this.manageButtons();
    });
        

    return this.panel;
};

/**
* Returns the toolbar containing the steps of the prepare experiment process.
*
* @method getToolBar
* @return The toolbar html containing the steps of the prepare experiment process
*/
PrepareMainViewTest.prototype.getToolBar = function () {
    var html = "";
	dust.render("toolbar.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html};
};

/**
* Returns the buttons next and previous of the prepare experiment process.
*
* @method getButtons
* @return The buttons html of the prepare experiment process.
*/
PrepareMainViewTest.prototype.getButtons = function () {
    var html = "";
	dust.render("buttons.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html, margin : 10};
}

/**
* Loads the container according to the current step.
*
* @method load
* @return 
*/
PrepareMainViewTest.prototype.load = function() {
    var _this = this; 
    this.panel.setTitle("Prepare Experiment");
    this.container.removeAll();

    if (this.currentStep == 1) {
        _this.container.add(_this.dewarListSelector.getPanel());
        _this.dewarListSelector.panel.setLoading();
        var onSuccessProposal = function(sender, containers) {        
            _this.containers = containers;
            _this.dewarListSelector.load(containers);
            _this.dewarListSelector.panel.setLoading(false);
        };

        var onError = function(sender, error) {        
            EXI.setError("Ops, there was an error");
            _this.dewarListSelector.panel.setLoading(false);
        };
        
        EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
    } else if (this.currentStep == 2){
        this.container.add(this.sampleChangerSelector.getPanel());
        this.sampleChangerSelector.panel.setLoading();

        var onSuccessProposal = function(sender, containers) { 
            _this.containers = containers;
            var beamlinesSelected = _.uniq(_.map(_.filter(_this.containers, function(e){return e.shippingStatus == "processing";}),'beamlineName'));

            if (beamlinesSelected.length > 1) {
                $.notify("Warning: Multiple beamlines selected", "warn");
            } else if (beamlinesSelected.length == 1) {
                _this.sampleChangerSelector.selectRowByBeamlineName(beamlinesSelected[0]);
            }

            _this.sampleChangerSelector.panel.setLoading(false);
        };

        var onError = function(sender, error) {        
            EXI.setError("Ops, there was an error");
            _this.sampleChangerSelector.panel.setLoading(false);
        };
        
        EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
    } else if (this.currentStep == 3) {
        this.container.add(this.loadSampleChangerView.getPanel());
        this.loadSampleChangerView.containerListEditor.loadProcessingDewars();
    }
};

/**
* Takes care of deselecting a row in the loading step.
*
* @method deselectRow
* @return 
*/
PrepareMainViewTest.prototype.deselectRow = function () {
    this.loadSampleChangerView.containerListEditor.panel.getSelectionModel().deselectAll();
    this.selectedContainerId = null;
    this.selectedSampleCount = null;
    this.loadSampleChangerView.sampleChangerWidget.allowAllPucks();
}

/**
* Takes care of deselecting a puck in the loading step
*
* @method deselectPuck
* @return 
*/
PrepareMainViewTest.prototype.deselectPuck = function () {
    $("#" + this.selectedPuck.id).attr("class","puck");
    this.selectedPuck = null; 
};

/**
* Returns to the initial state
*
* @method returnToSelectionStatus
* @return 
*/
PrepareMainViewTest.prototype.returnToSelectionStatus = function () {
    this.deselectRow();
    if (this.selectedPuck) {
        this.deselectPuck();        
    }
    this.loadSampleChangerView.cleanPreviewPanel();
};

/**
* Draws the selected puck on the preview panel
*
* @method drawSelectedPuck
* @param {PuckWidget} puck The puck to be drawn
* @return 
*/
PrepareMainViewTest.prototype.drawSelectedPuck = function (puck) {
    var data = {
        puckType : 1,
        containerId : puck.containerId,
        mainRadius : 70,
        x : 130,
        y : 10,
        enableMouseOver : true
    };
    var puckContainer = new PuckWidgetContainer(data);
    if (puck.capacity == 10) {
        data.puckType = 2;
        puckContainer = new PuckWidgetContainer(data);
    }
    
    this.loadSampleChangerView.previewPuck(puckContainer, {
                info : [{
                    text : 'SC Location',
                    value : this.loadSampleChangerView.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id)
                }]
            }, "");
};

/**
* Draws the selected row in puck form on the preview panel
*
* @method drawSelectedPuckFromRecord
* @param {Integer} containerId The container Id of the container corresponding to the row selected
* @param {Integer} capacity The capacity of the container corresponding to the row selected
* @param {Integer} containerCode The container code of the row selected
* @return 
*/
PrepareMainViewTest.prototype.drawSelectedPuckFromRecord = function (record) {
    var _this = this;

    var containerId = record.get('containerId');
    var containerCode = record.get('containerCode');
    var capacity = record.get('capacity');
    var sampleChangerLocation = record.get('sampleChangerLocation');
    function onSuccess (sender, samples) {
        if (samples){
            var data = {
                puckType : 1,
                containerId : containerId,
                mainRadius : 70,
                x : 130,
                y : 10,
                enableMouseOver : true
            };
            var puckContainer = new PuckWidgetContainer(data);
            if (capacity == 10) {
                data.puckType = 2;
                puckContainer = new PuckWidgetContainer(data);
            }
            _this.loadSampleChangerView.previewPuck(puckContainer, {
                info : [{
                    text : 'Container',
                    value : containerCode
                },{
                    text : 'Container Id',
                    value : containerId
                },{
                    text : 'SC Location',
                    value : sampleChangerLocation
                }]
            }, "EMPTY");
            puckContainer.puckWidget.loadSamples(samples);
        }
    }

    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerId);
};

/**
* Takes care of the process when a puck is selected after clicking a row, loading that puck with the selected container
*
* @method loadSampleChangerPuck
* @param {PuckWidget} puck The puck of the sample changer widget to be loaded
* @param {Integer} containerId The container Id of the container to be loaded
* @return 
*/
PrepareMainViewTest.prototype.loadSampleChangerPuck = function (puck, containerId) {
    if (puck.isEmpty){
        this.returnToSelectionStatus();
        var location = this.loadSampleChangerView.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id);
        this.loadSampleChangerView.containerListEditor.updateSampleChangerLocation(containerId,location);
    } else {
        $.notify("Error: choose an empty puck", "error");
    }
};

/**
* Saves a key-value pair on the session storage
*
* @method save
* @param {String} key The key of the key-value pair
* @param {String} value The value of the key-value pair
* @return 
*/
PrepareMainViewTest.prototype.save = function (key, value) {
    if (typeof(Storage) != 'undefined') {
        sessionStorage.setItem(key,value);
    }
}

/**
* Saves the puck data of a given sampleChangerWidget
*
* @method storeSampleChangerWidget
* @param sampleChangerWidget The sample changer to be stored
* @return 
*/
PrepareMainViewTest.prototype.storeSampleChangerWidget = function (sampleChangerWidget) {
    var puckData = sampleChangerWidget.getPuckData();
    this.save('puckData',JSON.stringify(puckData));
};
/**
* This class renders a panel with a puck widget and some information tabs
*
* @class PreviewPanelView
* @constructor
*/
function PreviewPanelView (args) {
    this.width = 400;
    this.height = 265;

    if (args) {
        if (args.width) {
            this.width = args.width;
        }
        if (args.height) {
            this.height = args.height;
        }
    }

    this.onEmptyButtonClicked = new Event(this);
};

/**
* Returns an Ext.panel.Panel containing a puck widget, an info tab and a button.
*
* @method getPanel
* @return An Ext.panel.Panel containing a puck widget, an info tab and a button.
*/
PreviewPanelView.prototype.getPanel = function () {
    var _this = this;

    this.infoPanel = Ext.create('Ext.panel.Panel', {
        // cls     : 'border-grid',
        width : this.width/2,
        height : 50,
        items : []
    });

    this.instructionsButton = Ext.create('Ext.Button', {
        text: '',
        width: this.width/2,
        height: 50,
        scale: 'large',
        style: {
            background: '#444444'
        },
        listeners: {
            click: function(button) {
                if (button.text == "EMPTY") {
                    _this.onEmptyButtonClicked.notify();
                }
            }
        }
    });

    var infoContainer = Ext.create('Ext.panel.Panel', {
        layout : 'hbox',
        width : this.width,
        height : 50,
        items : [this.infoPanel,this.instructionsButton]
    });

    this.previewPanel = Ext.create('Ext.panel.Panel', {
        // cls     : 'border-grid',
        title: 'Selected Puck',
        width : this.width,
        height : this.height,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        margin : 5,
        cls : 'border-grid',
        width : this.width,
        height : this.height + 50,
        items : [this.previewPanel,infoContainer]
    });

    return this.panel;
};

/**
* Loads a puck to the preview panel and some information about the puck to the info tab. It also sets the text of the button.
*
* @method loadPuck
* @param puckContainer The puck widget container to be loaded
* @param {Object} data The data to be displayed on the info tab
* @param {String} instructionsButtonText The text to be set on the button
* @return
*/
PreviewPanelView.prototype.loadPuck = function (puckContainer, data, instructionsButtonText) {
    this.clean();
    this.previewPanel.add(puckContainer.getPanel());
    var html = "";
	dust.render("info.grid.template", data, function(err, out){
		html = out;
	});
    this.infoPanel.removeAll();
    this.infoPanel.add({
                            html : html,
                            margin:6
                    });

    this.instructionsButton.setText(instructionsButtonText);
};

/**
* Takes care of cleaning the panel
*
* @method clean
* @return
*/
PreviewPanelView.prototype.clean = function () {
    this.previewPanel.removeAll();
    this.infoPanel.removeAll();
    this.instructionsButton.setText("");
};
function WorkflowStepMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	
	var _this = this;
	
}

WorkflowStepMainView.prototype.getPanel = MainView.prototype.getPanel;


WorkflowStepMainView.prototype.getContainer = function() {
	this.mainPanel = Ext.create('Ext.panel.Panel', {
	    cls : 'border-grid',	 
        autoScroll: true,
        title : "Workflow",
        margin : '10 0 0 10',
	    //height : 800,
	    flex : 1,
	    items: [
	    ]
	});
	return this.mainPanel;
};


WorkflowStepMainView.prototype.getGrid = function(title, columns, data) {
	var store = Ext.create('Ext.data.Store', {
        fields:columns,
        data:data
    });
    var gridColumns = [];
    for (var i = 0; i < columns.length; i++) {
         gridColumns.push({ text: columns[i],  dataIndex: columns[i], flex: 1 });
    }
    return Ext.create('Ext.grid.Panel', {
        title: title,
        flex : 1,
        margin : '10 180 10 10',
        cls : 'border-grid',	 
        store: store,
        columns: gridColumns
    });
};

WorkflowStepMainView.prototype.getImageResolution = function(imageItem) {  
    if (imageItem.xsize){
        var ratio = imageItem.xsize/1024;
        imageItem.xsize = imageItem.xsize*ratio;
        imageItem.ysize = imageItem.ysize*ratio;
    }
    return imageItem;
};

WorkflowStepMainView.prototype.getImagesResolution = function(imageItems) {  
    var resolution = 1024;
   
    resolution = resolution/imageItems.length;
    for (var i = 0; i < imageItems.length; i++) {
        var imageItem = imageItems[i];        
         if (imageItem.xsize){
            var ratio = resolution/imageItem.xsize;
            imageItem.xsize = imageItem.xsize*ratio;
            imageItem.ysize = imageItem.ysize*ratio;
        } 
    }
    return imageItems;
};

WorkflowStepMainView.prototype.load = function(workflowStep) {
    var _this = this;
    this.panel.setTitle("Workflow");
    _this.mainPanel.removeAll();
     _this.mainPanel.setLoading();
     
    function onSuccess(sender, data){    
   
        var items = JSON.parse(data).items;
        _this.panel.setTitle(JSON.parse(data).title);
        
        var insertContainer = function(err, out){    
                
                    _this.mainPanel.insert({
                            padding : 2,
                           
                            html : out
                    });
        };
        
        for (var i = 0; i < items.length; i++) {
            console.log(items[i]);
            if (items[i].type == "table"){
                  _this.mainPanel.insert(_this.getGrid(items[i].title,items[i].columns, items[i].data));
            }
            else{
                if (items[i].type == "image"){
                    
                    items[i] = _this.getImageResolution(items[i]);
                }
                
                 if (items[i].type == "images"){
                     
                    items[i].items = _this.getImagesResolution(items[i].items);
                   
                }
               
                dust.render("workflowmainview.template", items[i], insertContainer);
            }
        }
      
        _this.mainPanel.setLoading(false);
    }
    
    EXI.getDataAdapter({onSuccess: onSuccess}).mx.workflowstep.getResultByWorkflowStepId(workflowStep.workflowStepId);
		
};





/**
* This view shows a main plot with the spectrum and a grid with the elements
*
* @class XfeViewerMainView
* @constructor
*/
function XfeViewerMainView() {
    this.id = BUI.id();
    MainView.call(this);

    //this.filters = ['channel', 'counts', 'Energy', 'fit', 'continuum', 'pileup'];
    this.filters = [];

    this.data = {
        labels : [], // labels = [{name: 'axisX', x: true, y, false},{name: 'axisXY', x: false, y, true}] 
        data   : [] 
    };
}

XfeViewerMainView.prototype.getPanel = MainView.prototype.getPanel;

/**
* Makes an store and a grid where the labels of the csv will be shown 
*
* @method getGrid
* @return {Grid} Retuns a Ext.panel.Grid
*/
XfeViewerMainView.prototype.getGrid = function() {
    var _this = this;
    /** Store for labels */
    this.store = Ext.create('Ext.data.Store', {
        fields: ['name', 'value', 'x', 'y'],
        sorters: [{ property: 'value', direction: 'DESC' }]
    });
    this.grid = Ext.create('Ext.grid.Panel', {
        title: 'Labels',
        store: this.store,
        cls: 'border-grid',        
        width: 300,
        height: 700,
        columns: [
            {
                text: 'name',
                dataIndex: 'name',
                flex: 1
            },
            {
                text: 'value',
                dataIndex: 'value',
                flex: 1
            },
            {
                text : 'x',
                dataIndex: '',
                id : this.id + 'x',
                flex: 0.5,
                renderer : function(grid, sample, record){
                    
                    var id = _this.id + "_" +record.data.name + "_X"; 
                    if (record.data.x){
                        return '<input disabled id="' + id+'" type="checkbox" name="x" value="bike" checked>';
                    }
                    else{
                        return '<input id="' + id+'" type="checkbox" name="x" value="bike">';
                    }
                }
            },{
                text : 'y',
                dataIndex: '',
                id : this.id + 'y',
                flex: 0.5,
                renderer : function(grid, sample, record){
                     var id = _this.id + "_" +record.data.name + "_Y"; 
                      if (record.data.y){
                        return '<input id="' + id+'" type="checkbox" name="y" value="bike" checked="' + record.data.y + '">';
                      }
                        else{
                         return '<input id="' + id+'" type="checkbox" name="y" value="bike">';
                    }
                }
            }
        ],
        listeners : {
            cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                /** This is X */
                if (cellIndex == 2){
                    _this.setXColumn(record.data.name, document.getElementById(_this.id + "_" + record.data.name + "_X").checked);
                }
                
                /** This is Y */
                if (cellIndex == 3){
                    _this.setYColumn(record.data.name, document.getElementById(_this.id + "_" + record.data.name + "_Y").checked);
                }
                _this.parseData();
            }
            
            
        }
    });
    return this.grid;
};

/**
* Sets as X axis the column labelName is selected is true. It sets to false all the other labels for the value X
*
* @method setXColumn
*/
XfeViewerMainView.prototype.setXColumn = function(labelName, selected) {
      
    var label = _.filter(this.data.labels, function(o){ return o.name == labelName;});
    if (label){
        /** As X only can be one we set all x to false */
        this.data.labels = _.map(this.data.labels,  function disable(o){o.x = false; return o;});
        if (label[0]){
            label[0].x = selected;
            label[0].y = !selected;
        }
    }
    this.store.loadData(this.data.labels);
 
};

/**
* Sets the value to selected of the attribute Y of a label
*
* @method setXColumn
*/
XfeViewerMainView.prototype.setYColumn = function(labelName, selected) {
    var label = _.filter(this.data.labels, function(o){ return o.name == labelName;});
    if (label){
        if (label[0]){
            label[0].y = selected;
        }
    }
    this.store.loadData(this.data.labels);
 
};

/**
* Returns the containers. There are four container 2xHbox(2xvbox)
*
* @method getContainer
* @return {Grid} Retuns a Ext.panel.Grid
*/
XfeViewerMainView.prototype.getContainer = function() {
    var _this = this;

    return Ext.create('Ext.container.Container', {
        layout: {
            type: 'hbox'
        },
        margin: 10,
        items: [
            {
                xtype: 'container',
                margin: '5 0 0 5',
                width: 300,
                items: [
                    this.getGrid()
                 
                ]
            },
            {
                xtype: 'container',
                flex: 0.8,
                margin: '5 0 0 5',
                items: [
                    {
                        html: '<div style="width:100%"  id="plot' + _this.id + '"></div>',
                        cls: 'border-grid',
                        id: this.id + 'containerLayout',
                        height: 700,

                    },
                    {
                        html: 'Results produced by <a href="http://pymca.sourceforge.net/">PyMca</a>',
                        cls: 'border-grid',
                        margin: '2 0 0 0',
                        flex: 1,
                        height: 20
                    }
                ]

            }
        ]
    });
};

/**
* Convert the labels as array of string into json and load in the store
* labels = ["l1, "l1"]
* sum = [1, 2]
*
* 
* @method getSumForLabels
* @return {json} Retuns [{name:'l1', value:1}, {name:'l2', value:2}]
*/
XfeViewerMainView.prototype.getSumForLabels = function(labels, sum) {
    var _this = this;
    /** Loading grid of labels */
    try {
        var toJson = function(el) {
            return {
                name: el[0].name,
                x: el[0].x,
                y: el[0].y,
                value: el[1]
            };
        };
        /** This converts to arrays labels and sum in a single json array with name and value */
        var data = _.map(_.zip(labels, sum), toJson);
        data = _.reject(data, function(o) {
            return (_.indexOf(_this.filters, o.name) != -1);
        });
        return data;
    }
    catch (err) {
        console.log(err);
    }
};



/**
* Sums the values for each columns 
*
* 
* @method sumByColums
* @return {Array} Retuns the value of sum for each column in an array
*/
XfeViewerMainView.prototype.sumByColums = function(labels, data) {
    var sum = new Array( labels.length);
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (sum[j] == null) {
                sum[j] = 0;
            }
            sum[j] = sum[j] + data[i][j];
        }
    }
    return sum;
};

XfeViewerMainView.prototype.getDataColumn = function(data, indexes) {
    function reduceColumns(row){
        return  _.pullAt(row, indexes);
    }
    /** Using slice to make a copy by value */
   return _.map(data, reduceColumns);

};
XfeViewerMainView.prototype.parseData = function() {
    /** get X column */
   
    /** We need first to clone in order to not touch the original data */
    var duplicatedData = _.cloneDeep(this.data.data);
   
    /** Getting the label X and data X */
    var labelX = _.filter(this.data.labels, function(o){ return o.x;})[0];
    var dataX =  this.getDataColumn(duplicatedData, [_.indexOf(this.data.labels, labelX)]);
   
   /** Getting the labels Y and data Y */
    duplicatedData = _.cloneDeep(this.data.data);
    var labelsY = _.filter(this.data.labels.slice(), function(o){ return o.y;});
    /** Getting indexes for Y columns */
    var indexes = [];
    
    for (var i = 0; i < labelsY.length; i++){
        indexes.push(_.indexOf(this.data.labels, labelsY[i]));
    }
    
    var data =  this.getDataColumn(duplicatedData, indexes);
  
   
    for ( i = 0; i < dataX.length; i++) {
        data[i] = _.concat(dataX[i], data[i]);
    }
   
    this.renderPlot( _.concat(labelX, labelsY), data);
};

/**
* It transposes the data in order to calculate the max value of Y for each statistic then it create the annotation by getting the index X
*
* 
* @method getAnnotations
*/
XfeViewerMainView.prototype.getAnnotations = function(data, labels) {
    var annotations = [];
    if (data){
        /**  First, we transpose the matrix **/
        var transposed = data[0].map(function(col, i) { 
            return data.map(function(row) { 
                return row[i]; 
            });
        });
       
        var findByMax = function(o) { return o == max; };
        for (var i = 0; i < labels.length; i++) {
                var max = _.max(transposed[i]);
                var index = _.findIndex(transposed[i], findByMax);
                annotations.push({
                            x           : data[index][0],
                            shortText   : labels[i].name,//this.data.labels[i].name,
                            text        : labels[i].name,
                            series      : labels[i].name,
                            width       : 100,
                            height      : 25
                    }
                );
        }
    }
    return annotations;
};
/**
* Render the dygraph widget on a container that should exists with id = this.id
*
* 
* @method renderPlot
*/
XfeViewerMainView.prototype.renderPlot = function(labels, data) {
    var _this = this;
  
    /** Plotting */
    var g = new Dygraph(
        document.getElementById("plot" + this.id),
        data,
        {
            legend: 'always',
            title: 'XRF',
            labels :   _.map(labels, 'name'),
            height: 600,
            width: 800,
            displayAnnotations : true,
            //sigFigs : false,
            //stackedGraph: false,
            labelsSeparateLines : true,
            labelsShowZeroValues : false,
            logscale : false,
            ylabel: 'Count'
        }
    );
  
     g.ready(function() { 
        g.setAnnotations(_this.getAnnotations(data, labels));
    });
    
};

/**
* Parser the first line of the csv file
*
* 
* @method parseHeaders
*/
XfeViewerMainView.prototype.parseHeaders = function(line) {
    /** Only first is used as X */
    var counter = 0;
    function remove(element) {
        counter = counter + 1;
        return {
                    name : element.replace(new RegExp("\"", 'g'), ""),
                    x    : counter == 1,
                    y    :  counter != 1
        };
     }
     return _.map(line.split(","), remove);
};
/**
* Gets the csv data, parses it and plot it
*
* 
* @method plot
*/
XfeViewerMainView.prototype.plot = function() {
    var _this = this;
    $.ajax({
        url: EXI.getDataAdapter().mx.xfescan.getCSV(this.xfeFluorescenceSpectrumId),
        context: this

    }).done(function(csv) {
        if (csv) {
            var lines = csv.split("\n");
            var labelsHeader = [];
            if (lines) {
                if (lines[0]) {
                   this.data.labels = this.parseHeaders(lines[0]);
                   
                }
                else {
                    /** No Lines */
                    EXI.setError("No labels on csv");
                    return;
                }

                var convertToNumber = function (element) {
                    var elements = element.split(',');
                    function toNumber(el) {
                        return parseFloat(el);
                    }
                    elements = _.map(elements, toNumber);
                    return elements;
                };
                /** Parsing data it means remove labels, split by , and convert to number */
                this.data.data = _.map(_.slice(lines, 1, lines.length - 1), convertToNumber);
                debugger
                /** Fills the labels grid */
                try {
                    
                    this.data.labels = this.getSumForLabels(this.data.labels, this.sumByColums( _this.data.labels, _this.data.data));
                    this.store.loadData(this.data.labels);
                }
                catch (e) {
                    EXI.setError(e.message);
                }
                try {
                    
                    this.renderPlot( this.data.labels,  this.data.data);
                  
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



XfeViewerMainView.prototype.load = function(xfeFluorescenceSpectrumId) {
    var _this = this;
    this.panel.setTitle("XRF Viewer");
    this.xfeFluorescenceSpectrumId = xfeFluorescenceSpectrumId;
  
    this.plot();


};

/**
* It shows information from the autoprocessing like cells (a,b,c,alpha,beta,gamma) and also about phasing
*
* @class AutoProcIntegrationFileExplorerGrid
* @constructor
*/
/*
function AutoProcIntegrationFileExplorerGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	
	this.preventSelection = false;
	this.maxHeight = 500;
	this.minHeight = 500;
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.maxHeight != null) {
			this.maxHeight = args.maxHeight;
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
	
	this.onSelected = new Event(this);
	
};

AutoProcIntegrationFileExplorerGrid.prototype.load = function(data) {
	this.store.loadData(data, false);
};

AutoProcIntegrationFileExplorerGrid.prototype.selectRowByAutoProcIntegrationId = function(autoProcIntegrationId) {
	this.preventSelection = true;
	this.panel.getSelectionModel().select(this.store.find("v_datacollection_summary_phasing_autoProcIntegrationId", autoProcIntegrationId));
};

AutoProcIntegrationFileExplorerGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		sorters : 'spaceGroup',
		fields : [ 'autoProcId',
		           'refinedCellA', 
                   'v_datacollection_summary_phasing_autoProcIntegrationId',
		           'autoProcIntegrationId',
		           'v_datacollection_summary_phasing_anomalous',
		           'v_datacollection_summary_phasing_processingPrograms',
		           'v_datacollection_summary_phasing_autoproc_space_group']
	});
    
	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
		mode : 'multi',
		listeners : {
			selectionchange : function(sm, selections) {
				var records = [];
				if (selections != null) {
					for (var i = 0; i < selections.length; i++) {
						records.push(selections[i].data);
					}

				
					if (!_this.preventSelection){
						_this.onSelected.notify(records);
					}
					else{
						_this.preventSelection = false;
					}
				}
			}

		} });
	
	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Auto-Processing Integration',
		store : this.store,
		selModel : selModel,
		cls : 'border-grid',
        layout : 'fit',
		//maxHeight : this.maxHeight,
		//minHeight : this.maxHeight,
		columns : [ 
            
            {
			text : 'autoProcIntegrationId',
			dataIndex : 'processingPrograms',
            flex : 1,
            hidden : true,
			renderer : function(e, sample, record){
                return record.data.v_datacollection_summary_phasing_autoProcIntegrationId;
			}
		},
        {
			text : 'Autoprocessing',
			dataIndex : 'processingPrograms',
            flex : 1,
			renderer : function(e, sample, record){
				return record.data.v_datacollection_summary_phasing_processingPrograms;
			}
		},
        {
			text : 'Space Group',
            flex : 0.75,
			dataIndex : 'v_datacollection_summary_phasing_autoproc_space_group',
			renderer : function(e, sample, record){
				return record.data.v_datacollection_summary_phasing_autoproc_space_group;
			}
		},
		{
			text : 'Unit cell',
			dataIndex : 'processingPrograms',
			flex : 1.5,
			renderer : function(e, sample, record){
				var html  = "";
				try{
					dust.render("AutoProcIntegrationFileExplorerGrid_autoprocolumn", record.data, function(err, out){
						html = out;
					});
				}
				catch(e){
					return "Parsing error";
				}
				return html;
			}
		},
		{
			text : 'Statistics',
			dataIndex : 'processingPrograms',
			flex : 3,
			renderer : function(e, sample, record){
				try{
					var type = record.data.scalingStatisticsType.split(",");
					var resolutionLimitLow = record.data.resolutionLimitLow.split(",");
					var resolutionLimitHigh = record.data.resolutionLimitHigh.split(",");
					var multiplicity = record.data.multiplicity.split(",");
					var meanIOverSigI = record.data.meanIOverSigI.split(",");
					var completeness = record.data.completeness.split(",");
					
					var parsed = [];
					for (var i = 0; i < type.length; i++) {
						parsed.push({
							type 					: type[i],
							resolutionLimitLow 		: resolutionLimitLow[i],
							resolutionLimitHigh 	: resolutionLimitHigh[i],
							multiplicity 			: multiplicity[i],
							meanIOverSigI 			: meanIOverSigI[i],
							completeness 			: completeness[i]
							
						});
					}
					var html  = "";
					dust.render("AutoProcIntegrationFileExplorerGrid_statistics", parsed, function(err, out){
						html = out;
					});
				}
				catch(e){
					return "<span class='summary_datacollection_parameter_name'>Not found</span>";
				}
				return html;
			}
		},
		{
			text : 'Phasing',
			dataIndex : 'processingPrograms',
            hidden : true,
			flex : 1.5,
			renderer : function(e, sample, record){
				var html  = "";
				if (record.data.phasingStepType){			
					try{
						dust.render("AutoProcIntegrationFileExplorerGrid_phasing", record.data, function(err, out){
							html = out;
						});
					}
					catch(e){
						return "Parsing error";
					}
				}
				return html;
			}
		}
		
		],
		flex : 1,
		viewConfig : {
			//stripeRows : true,
			preserveScrollOnRefresh: true,
			listeners : {
			}
		}
	});

	return this.panel;
};


*/


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

                //legend: this.legend,
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
* EnergyScanGrid displays the information fo a energyscan
*
* @class EnergyScanGrid
* @constructor
*/
function EnergyScanGrid(args) {
  
}

/**
* @method returns the panel with no data
*/
EnergyScanGrid.prototype.getPanel = function(dataCollectionGroup) {

    this.store = Ext.create('Ext.data.Store', {
        fields: ["dataCollectionGroup"]
    });
    
      this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,
        padding : 5,
        store: this.store,
        disableSelection: true,
        columns: [
            {
                header: '',
                dataIndex: 'dataCollectionGroup',
                name: 'dataCollectionGroup',
                flex: 0.2,
                renderer: function(grid, e, record) {
                    var html = "";                
                    record.data.choochURL = EXI.getDataAdapter().mx.energyscan.getChoochJpegByEnergyScanId(record.data.energyScanId);
                    dust.render("energyscangrid.template", record.data, function(err, out) {  
                        html = out;
                    });
                    return html;
                }
            }                         
        ],       
        viewConfig: {
	        			 enableTextSelection: true,
                         stripeRows : true
        }

    });
    return this.panel;
};

EnergyScanGrid.prototype.load = function(energyScanList) {
    this.store.loadData(energyScanList);   
};
/**
* This class renders a sample changer widget
*
* @class SampleChangerWidget
* @constructor
*/
function SampleChangerWidget (args) {
	this.id = BUI.id();
	this.pucks = {};
	this.clockwise = 1;
	this.initAlpha = 0;
	this.isLoading = true;
	this.radius = 200;
	this.name = '';
	this.onPuckSelected = new Event(this);

	if (args) {
		if (args.radius){
			this.radius = args.radius;
		}
		if (args.isLoading != null){
			this.isLoading = args.isLoading;
		}
	}
};

/**
* Create certain types of pucks following a circular path
*
* @method createPucks
* @param {Integer} puckType The type of puck (1 is Uni, 2 is Spine)
* @param {Integer} n The number of pucks
* @param {Double} initAlpha Initial angle where to start to add pucks
* @param {Double} dist The distance to the center of the puck where the cells are positioned
* @param {Double} marginPercent Factor to control the separation between cells
* @param {Object} args Extra information for add pucks like a second row of pucks by defining a dAlpha and a new dist
*/
SampleChangerWidget.prototype.createPucks = function (puckType, n, initAlpha, dist, marginPercent, args) {
	var rad = dist*Math.sin((Math.PI/this.data.cells)*marginPercent);
	this.pucks[puckType] = [];
	for (var i = 0 ; Math.abs(i) < n ; i += this.clockwise) {
		var ang = i*2*Math.PI/n;
		var puckIndex = this.getPuckIndexFromAngle(this.initAlpha, 1, this.initAlpha + this.clockwise*(2*Math.PI*(1 - 1/this.data.cells)), this.data.cells, initAlpha + ang);		
		var puckId = this.id + "-" + puckIndex + "-1";
		if (args) {
			puckId = this.id + "-" + puckIndex + "-3";
		}
		var cx = dist*Math.sin(initAlpha + ang) + this.data.radius - rad;
		var cy = -dist*Math.cos(initAlpha + ang) + this.data.radius - rad;
		this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : puckId, mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
		
		if (args) {
			if (args.dAlpha != null && args.dist != null){
				cx = args.dist*Math.sin(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-2", mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
				
				cx = args.dist*Math.sin(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-1", mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
			}
		}
	}
};

/**
* Returns the index used in the id of each puck using a linear equation given two points
*
* @method getPuckIndexFromAngle
* @param {Double} x0 The x value of the linear equation for the first point
* @param {Double} y0 The y value of the linear equation for the first point
* @param {Double} x1 The x value of the linear equation for the second point
* @param {Double} y1 The y value of the linear equation for the second point
* @param {Double} angle The x value of the point where you want to get the corresponding y value
* @return {Integer} The rounded y value of the returning point
*/
SampleChangerWidget.prototype.getPuckIndexFromAngle = function (x0,y0,x1,y1,angle) {
	return Math.round((y1-y0)*(angle-x0)/(x1-x0) + y0);
}

SampleChangerWidget.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			
		   // cls:'border-grid',
		    layout:'absolute',
            items : [
						{
							html : this.getStructure(),
							frame: false,
							border: false,
							bodyStyle: 'background:transparent;'
						}
			],
			
	});

	for (puckType in this.pucks) {
		for (puck in this.pucks[puckType]){
			var puck = this.pucks[puckType][puck];
			this.panel.add(puck.getPanel());
		}
	}
	
	return this.panel;
	
};

/**
* Load the pucks using the array of samples and a map of containerId to puckId and returns an array of pucks that couldn't be loaded
*
* @method loadSamples
* @param {Object} samples An array of samples returned by the query to the database
* @param {Object} containerIdsMap A map of the form containerId -> puckId
* @return {Array} An array of the pucks that couldn't be loaded
*/
SampleChangerWidget.prototype.loadSamples = function (samples, containerIdsMap) {
	var pucksToBeLoaded = {};
	var errorPucks = [];
	for (sampleIndex in samples) {
		var sample = samples[sampleIndex];
		var puckId = containerIdsMap[sample.Container_containerId];
		if (pucksToBeLoaded[puckId]) {
			pucksToBeLoaded[puckId].push(sample);
		} else {
			pucksToBeLoaded[puckId] = [sample];
		}
	}
	for (puckIndex in _.keys(pucksToBeLoaded)) {
		var puck = this.findPuckById(_.keys(pucksToBeLoaded)[puckIndex]);
		if (pucksToBeLoaded[puck.id].length <= puck.capacity){
			puck.loadSamples(pucksToBeLoaded[puck.id]);
		} else {
			$.notify("Capacity Error: Couldn't load the puck at location " + this.convertIdToSampleChangerLocation(puck.id) + ".", "error");
			errorPucks.push(puck);
		}
	}
	return errorPucks;
};

/**
* Load the pucks using correctly parsed data
*
* @method load
* @param {Object} data Keys are the ids and the values are puckWidget data 
*/
SampleChangerWidget.prototype.load = function (data) {
	for (i in _.keys(data)){
		var location = _.keys(data)[i].substring(_.keys(data)[i].indexOf('-')+1);
		var puck = this.findPuckById(this.id + "-" + location);
		puck.load(data[_.keys(data)[i]].cells);
	}
};

/**
* Returns the html of the basic structure of the puck using a dustjs template and the data
*
* @method getStructure
*/
SampleChangerWidget.prototype.getStructure = function () {
	var html = "";
	dust.render("structure.sampleChanger.template", this.data, function(err, out){
		html = out;
	});
	
	return html;
};

/**
* Returns a certain puck given its id
*
* @method findPuckById
* @return The puck with the corresponding id
*/
SampleChangerWidget.prototype.findPuckById = function (id) {
	var allPucks = this.getAllPucks();
	return _.find(allPucks, function(o) {return o.puckWidget.id == id}).puckWidget;
};

/**
* Returns an array of all the pucks of the sample changer
*
* @method getAllPucks
* @return An array of all the pucks of the sample changer
*/
SampleChangerWidget.prototype.getAllPucks = function () {
	var allPucks = [];
	for (puckType in this.pucks) {
		allPucks = allPucks.concat(this.pucks[puckType]);
	}
	return allPucks;
};

/**
* Returns an array of all the filled pucks of the sample changer
*
* @method getAllFilledPucks
* @return An array of all the filled pucks of the sample changer
*/
SampleChangerWidget.prototype.getAllFilledPucks = function () {
	var allPucks = this.getAllPucks();
	return _.filter(allPucks, function (o) {return !o.puckWidget.isEmpty;})
};

/**
* Updates the pucks styles
*
* @method render
*/
SampleChangerWidget.prototype.render = function () {
    var allPucks = this.getAllPucks();
    for (puck in allPucks){
        var puck = allPucks[puck].puckWidget;
        for (cell in puck.data.cells){
            puck.render(puck.data.cells[cell].location);
        }
    }
};

/**
* Sets the click listeners of the pucks to notify on the onPuckSelected Event
*
* @method setClickListeners
*/
SampleChangerWidget.prototype.setClickListeners = function () {
    var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).css('cursor','pointer');
		$("#" + puck.puckWidget.id).unbind('click').click(function(sender){
			if (!sender.target.classList.contains('disabled')){
				_this.onPuckSelected.notify(_this.findPuckById(sender.target.id));
			}
		});
	}
};

/**
* Adds the disabled style class to the pucks with different given capacity
*
* @method disablePucksOfDifferentCapacity
* @param {Integer} capacity The capacity of the allowed pucks
*/
SampleChangerWidget.prototype.disablePucksOfDifferentCapacity = function (capacity) {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		if (puck.capacity != capacity) {
			$("#" + puck.puckWidget.id).addClass("disabled");
		}
	}
};

/**
* Removes the disabled style class to all pucks
*
* @method allowAllPucks
*/
SampleChangerWidget.prototype.allowAllPucks = function () {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).removeClass("disabled");
	}
};

/**
* Returns an object containing the puckData of the filled pucks indexed by the idLocation
*
* @method getPuckData
* @return An object containing the puckData of the filled pucks indexed by the idLocation
*/
SampleChangerWidget.prototype.getPuckData = function () {
	var filledPucks = this.getAllFilledPucks();
	var puckData = {};
    for (puckContainerIndex in filledPucks) {
        var puckContainer = filledPucks[puckContainerIndex];
        var location = puckContainer.puckWidget.id;
		puckContainer.puckWidget.sampleChangerLocation = this.convertIdToSampleChangerLocation(location);
		puckContainer.puckWidget.data.sampleChangerLocation = this.convertIdToSampleChangerLocation(location);
        puckData[location] = puckContainer.puckWidget.data;
    }
	return puckData;
}

/**
* Empties all of the pucks
*
* @method emptyAllPucks
* @return 
*/
SampleChangerWidget.prototype.emptyAllPucks = function () {
	var allFilledPucks = this.getAllFilledPucks();
	for (puckIndex in allFilledPucks) {
		var puck = allFilledPucks[puckIndex];
		puck.puckWidget.emptyAll();
	}
}
/**
* This class extends the SampleChangerWidget class for a FlexHCD
*
* @class FlexHCDWidget
* @constructor
*/
function FlexHCDWidget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'FlexHCD';
	this.initAlpha = -7*2*Math.PI/16;
	this.data = {
		radius : this.radius,
		cells : 8,
		lines : [],
		text :[]
	};
	
	this.createStructure();
	this.createPucks(1, this.data.cells/2, -7*Math.PI/8, this.data.radius/2, 0.5, {dAlpha : Math.PI/16, dist : 3*this.data.radius/4});
	this.createPucks(2, this.data.cells/2, -5*Math.PI/8, this.data.radius/2, 0.5, {dAlpha : Math.PI/16, dist : 3*this.data.radius/4});
};

FlexHCDWidget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
FlexHCDWidget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
FlexHCDWidget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
FlexHCDWidget.prototype.load = SampleChangerWidget.prototype.load;
FlexHCDWidget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
FlexHCDWidget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
FlexHCDWidget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
FlexHCDWidget.prototype.render = SampleChangerWidget.prototype.render;
FlexHCDWidget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
FlexHCDWidget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
FlexHCDWidget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
FlexHCDWidget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
FlexHCDWidget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
FlexHCDWidget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
FlexHCDWidget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;

/**
* Creates the particular structure of the FlexHCD
*
* @method createStructure
*/
FlexHCDWidget.prototype.createStructure = function () {
	for (var i = 0 ; i < this.data.cells/2 ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		var line = {
			x1 : this.data.radius*Math.sin(ang) + this.data.radius,
			y1 : this.data.radius*Math.cos(ang) + this.data.radius,
			x2 : -this.data.radius*Math.sin(ang) + this.data.radius,
			y2 : -this.data.radius*Math.cos(ang) + this.data.radius
		};
		this.data.lines.push(line);
	}
	
	// var textR = this.data.radius/4;
	// for (var i = 0 ; i < this.data.cells ; i++){
	// 	var ang = i*2*Math.PI/this.data.cells;
	// 	var textNumber = {
	// 		text : i+1,
	// 		x : textR*Math.sin(this.initAlpha + ang) + this.data.radius,
	// 		y : -textR*Math.cos(this.initAlpha + ang) + this.data.radius
	// 	};
	// 	this.data.text.push(textNumber);
	// }
};

/**
* Converts the idLocation to the corresponding location in the FlexHCD by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the FlexHCD by convention
*/
FlexHCDWidget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
	var n = Number(idLocation.split("-")[1]);
	var i = Number(idLocation.split("-")[2]);
	return (n-1)*3 + i;
};

/**
* Converts the sample changer location in a FlexHCD to the id of the puck
*
* @method convertSampleChangerLocationToId
* @return The corresponding id of the puck in the given location
*/
FlexHCDWidget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
	if (sampleChangerLocation <= 24 && sampleChangerLocation > 0) {
		var n = Math.floor(sampleChangerLocation/3) + 1;
		var i = sampleChangerLocation % 3;
		if (i == 0){
			n--;
			i = 3;
		}
		return this.id + "-" + n + "-" + i;
	} else {
		return null;
	}
};
/**
* Abstract class for creating a puck widget
*
* @class PuckWidget
* @constructor
*/
function PuckWidget(args){
	this.id = BUI.id();
	
	this.mainRadius = 150;
	this.dataCollectionIds = {};
	this.containerId = 0;
	this.containerCode = "";
	this.enableMouseOver = false;
	this.enableClick = false;
	this.initSelected = {};
	this.isLoading = true;
	this.capacity = 10;
	
	this.isUnipuck = false;
	this.isEmpty = true;
	
	if (args){
		if (args.id) {
			this.id = args.id;
		}
		if (args.mainRadius){
			this.mainRadius = args.mainRadius;
		}
		if (args.isUnipuck){
			this.isUnipuck = args.isUnipuck;			
		}
		if (args.dataCollectionIds){
			this.dataCollectionIds = args.dataCollectionIds;
		}
		if (args.containerIds){
			this.containerIds = args.containerIds;
		}
		if (args.enableMouseOver != null){
			this.enableMouseOver = args.enableMouseOver;
		}
		if (args.enableClick != null){
			this.enableClick = args.enableClick;
		}
		if (args.initSelected){
			this.initSelected = args.initSelected;
		}
		if (args.isLoading != null){
			this.isLoading = args.isLoading;
		}
	}
	
	this.shapeRadiusX = this.mainRadius/10;
	this.shapeRadiusY = this.mainRadius/20;
	
	this.data = {
				mainRadius : this.mainRadius,
				cells : [],
				id : this.id,
				isUnipuck : this.isUnipuck,
				shapeRadiusX : this.shapeRadiusX,
				shapeRadiusY : this.shapeRadiusY,
				containerId : this.containerId,
				containerCode : this.containerCode,
				enableClick : this.enableClick,
				enableMouseOver : this.enableMouseOver,
				dataCollectionIds : this.dataCollectionIds,
				isLoading : this.isLoading
	};
	
	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

/**
* Add a certain number of cell objects to the data following a circle.
*
* @method addCirclePathCells
* @param {Object} data The data of the puck
* @param {Integer} n The number of cells to add
* @param {Double} marginPercent Factor to control the separation between cells
* @param {Double} dist The distance to the center of the puck where the cells are positioned
*/
PuckWidget.prototype.addCirclePathCells = function (data, n, marginPercent, dist) {
	var rad = Math.min(dist*Math.sin((Math.PI/n)*marginPercent), 
						(data.mainRadius - dist)*marginPercent);
	
	for (var i = 0 ; i < n ; i++){
		var ang = i*2*Math.PI/n;
		var newCell = 		{
								x :-dist*Math.sin(ang) + data.mainRadius,
								y :-dist*Math.cos(ang) + data.mainRadius,
								color :'#FFFFFF', 
								radius : rad,								
								id : this.id + "-" + Number(data.cells.length + 1),
								state : "EMPTY",
								location : Number(data.cells.length + 1),
								selected : false,
								dataCollectionIds : data.dataCollectionIds[Number(data.cells.length + 1)]
							};
		data.cells.push(newCell);
	}
	return data;
};

PuckWidget.prototype.getPanel = function () {
	var html = "";
	dust.render("puck.template", this.data, function(err, out){
		html = out;
	});
	
	return html;
};

/**
* Set all the cells of the puck as EMPTY
*
* @method load
*/
PuckWidget.prototype.emptyAll = function () {
	for (cellIndex in this.data.cells) {
		this.data.cells[cellIndex].state = "EMPTY";
		this.render(this.data.cells[cellIndex].location,true);
	}
	this.isEmpty = true;
};

/**
* Load sample data to the puck given the result of sample query by containerId
*
* @method loadSamples
* @param {Object} samples Result of the sample query by containerId
* @param {Integer} selectedLocation Optional parameter for having a selected cell
*/
PuckWidget.prototype.loadSamples = function (samples, selectedLocation) {
	var cells = [];
	for (var i = 0; i < samples.length; i++) {
		var sample = samples[i];
		var dataCollectionIds = this.dataCollectionIds[sample.BLSample_location];
		var state = "FILLED";
		if (dataCollectionIds != null && dataCollectionIds.length > 0){
			state = "COLLECTED";
		}
		var selected = false;
		if (selectedLocation != null){
			selected = sample.BLSample_location == selectedLocation;
		}
		
		// Parse data
		cells.push({
			location : sample.BLSample_location,
			state : state,
			selected : selected,
			sample_name : sample.BLSample_name,
			protein_acronym : sample.Protein_acronym,
			protein_name : sample.Protein_name,
			dataCollectionIds : dataCollectionIds,
			containerId : sample.Container_containerId,
			containerCode : sample.Container_code
		});
	}
	this.load(cells);
};

/**
* Load sample data to the puck given that the data is correctly parsed
*
* @method load
* @param {Object} data Data correctly parsed
*/
PuckWidget.prototype.load = function (data) {
	var _this = this;
	$("#" + _this.data.id + "-loading-text").remove();

	for (sampleIndex in data){
		var sample = data[sampleIndex];
		var id = this.id + "-" + sample.location;
		var cellIndex = this.findCellIndexById(id);
		this.data.cells[cellIndex].state = sample.state;
		this.data.cells[cellIndex].selected = sample.selected;
		this.data.cells[cellIndex].sample_name = sample.sample_name;
		this.data.cells[cellIndex].protein_acronym = sample.protein_acronym;
		this.data.cells[cellIndex].protein_name = sample.protein_name;
		this.data.cells[cellIndex].containerId = sample.containerId;
		this.data.cells[cellIndex].containerCode = sample.containerCode;
		if (sample.state != "EMPTY"){
			this.containerId = sample.containerId;
			this.containerCode = sample.containerCode;
			this.data.containerId = this.containerId;
			this.data.containerCode = this.containerCode;
			this.isEmpty = false;
		}
	}

	for (i in this.data.cells){
		var currentId = this.id + "-" + Number(Number(i) + 1);

		if (this.enableMouseOver){
			$("#" + currentId).unbind('mouseover').mouseover(function(sender){
				var cellIndex = _this.findCellIndexById(sender.target.id);
				
				_this.onMouseOver.notify(sender.target.id.split("-")[1]);
				_this.focus(sender.target.id.split("-")[1],true);
				
				// TOOLTIP
				if (_this.data.cells[cellIndex].sample_name){
	
					var tooltipHtml = "";
					dust.render("plates.tooltip.mxdatacollectiongrid.template", _this.data.cells[cellIndex], function(err, out) {
						tooltipHtml = out;
					});
					$('body').append(tooltipHtml);
					$('#hoveringTooltipDiv').css({
						"top" : $(this).offset().top - 3*_this.data.cells[i].radius,
						"left" : $(this).offset().left + 1.5*_this.data.cells[i].radius
					});
					if (_this.data.cells[cellIndex].y - _this.data.mainRadius < 0) {
						$('#hoveringTooltipDiv').css({
							"top" : $(this).offset().top + 2*_this.data.cells[i].radius,
							"left" : $(this).offset().left + _this.data.cells[i].radius
						});
					}
				}

			});
			
			$("#" + currentId).unbind('mouseout').mouseout(function(sender){
				_this.onMouseOut.notify();
				_this.focus(sender.target.id.split("-")[1],false);

				// TOOLTIP
				$('#hoveringTooltipDiv').remove();
				
			});

		}
		
		if (this.enableClick) {
			$("#" + currentId).unbind('click').click(function(sender){
				var cellIndex = _this.findCellIndexById(sender.target.id);
				_this.render(_this.data.cells[cellIndex].location,true);
				// TOOLTIP
				$('#hoveringTooltipDiv').remove();
			});
		}
		
		this.render(this.data.cells[i].location,true);
	}
};

/**
* Focus or unfocus one cell according to a boolean and its location 
*
* @method focus
* @param {Integer} location The location of the cell on the puck
* @param {Boolean} bool Whether or not to focus the cell
*/
PuckWidget.prototype.focus = function (location, bool) {
	if (bool){
		$("#" + this.id + "-" + location).attr("class", "cell_focus");
		$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_hidden");		
	} else {
		this.render(location,true);
	}
};

/**
* Sets the style classes of the cell on a given location
*
* @method render
* @param {Integer} location The location of the cell on the puck
*/
PuckWidget.prototype.render = function (location) {
	var cellIndex = this.findCellIndexById(this.id + "-" + location);
	switch (this.data.cells[cellIndex].state) {
		case "FILLED":
			$("#" + this.id + "-" + location).attr("class","cell_filled");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_filled");
			break;
		case "COLLECTED":
			$("#" + this.id + "-" + location).attr("class","cell_collected");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class","cell_inner_filled");
			break;
		case "RESULTS":
			$("#" + this.id + "-" + location).attr("class","cell_results");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			$("#" + this.id + "-" + location + "-inner").attr("class","cell_inner_filled");
			break;
		case "ERROR":
			$("#" + this.id + "-" + location).attr("class","cell_error");
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_filled");
			$("#" + this.id + "-" + location + "-label").attr("fill", "white");		
			break;
		case "EMPTY":
			$("#" + this.id + "-" + location).attr("class", "cell_empty");
			$("#" + this.id + "-" + location + "-inner").attr("class", "cell_inner_hidden");
			$("#" + this.id + "-" + location + "-label").attr("fill", "black");
			break;
	}
	if (this.data.cells[cellIndex].selected) {
		$("#" + this.id + "-" + location + "-inner").addClass("cell_selected");
	}
};

/**
* Returns the cell Index in the data of the puck given its id
*
* @method findCellIndexById
* @param {Integer} id The id of the cell
* @return The cell Index in the data of the puck
*/
PuckWidget.prototype.findCellIndexById = function (id) {
	for (cellIndex in this.data.cells) {
		if (this.data.cells[cellIndex].id == id){
			return cellIndex;
		}
	}
};
function PuckWidgetContainer(args) {
	var _this = this;
	
	this.mouseOverCell = new Event(this);
	this.mouseOutCell = new Event(this);
	
	this.x = 0;
	this.y = 0;
	
	if (args){
		if (args.puckType) {
			switch (args.puckType) {
				case 1:
					this.puckWidget = new UniPuckWidget(args);
					this.capacity = 16;
					break;
				case 2:
					this.puckWidget = new SpinePuckWidget(args);
					this.capacity = 10;
					break;
			}
		}
		if (args.x){
			this.x = args.x;
		}
		if (args.y){
			this.y = args.y;
		}
	}
	
	if(!this.puckWidget) {
		this.puckWidget = new SpineCellWidget(args);
	}
	
	this.puckWidget.onClick.attach(function(sender, cell){
		
		
	});
	
	this.puckWidget.onMouseOver.attach(function(sender, location){
		_this.mouseOverCell.notify(location);
	});
	
	this.puckWidget.onMouseOut.attach(function(sender){
		_this.mouseOutCell.notify();
	});
}

PuckWidgetContainer.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			id: this.puckWidget.id + "-container",
		   x: this.x,
		   y: this.y,
		   width : 2*this.puckWidget.data.mainRadius + 1,
		   height : 2*this.puckWidget.data.mainRadius + 1,
		//    cls:'border-grid',
		   frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						{
							html : this.puckWidget.getPanel(),
							width : 2*this.puckWidget.data.mainRadius + 1,
							height : 2*this.puckWidget.data.mainRadius + 1
						}
			],
			
	});
	
	return this.panel;
	
}

PuckWidgetContainer.prototype.load = function (data) {
	this.puckWidget.load(data);
}

PuckWidgetContainer.prototype.loadSamples = function (samples) {
	this.puckWidget.loadSamples(samples);
}

PuckWidgetContainer.prototype.focus = function (location, bool) {
	this.puckWidget.focus(location, bool);
}



/**
* This class renders a grid for selecting a sample changer and a panel containing the sample changer widget
*
* @class SampleChangerSelector
* @constructor
*/
function SampleChangerSelector (args) {
    var _this = this;

    this.height = 600;
    this.width = 1000;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    var SCtypes = {
        header : "Type (Sample Changer)",
        values : ["FlexHCD","SC3"]
    };
    var beamlines = {
        header : "Beamlines",
        values : EXI.credentialManager.getBeamlineNames()
    };

    this.sampleChangerGrid = new BootstrapGrid({template : "bootstrap.grid.template"});
    this.sampleChangerGrid.load(SCtypes);
    this.beamlinesGrid = new BootstrapGrid({template : "bootstrap.grid.template"});
    this.beamlinesGrid.load(beamlines);

    this.sampleChangerWidget = null;

    this.sampleChangerGrid.rowSelected.attach(function(sender,text){
        _this.beamlinesGrid.deselectAll();
        _this.sampleChangerWidget = _this.createSampleChanger(text);
        _this.addSampleChanger(_this.sampleChangerWidget);
    });
    this.beamlinesGrid.rowSelected.attach(function(sender,text){
        _this.sampleChangerGrid.deselectAll();
        _this.sampleChangerWidget = _this.createSampleChanger(text);
        _this.addSampleChanger(_this.sampleChangerWidget);
    });
    this.onSampleChangerSelected = new Event(this);
};

/**
* Loads a Ext.panel.panel containing a bootstrap grid and a sample changer widget
*
* @method getPanel
* @return 
*/
SampleChangerSelector.prototype.getPanel = function() {

    this.sampleChangerPanel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'hbox',
            pack: 'center'
        }, 
        width: 410,
        height: 410,
        margin : 50,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
         layout: {
            type: 'hbox',
            pack: 'left'
        },     
        // cls : 'border-grid',  
        height : this.height, 
        width : this.width,
        title : 'Select a sample changer type or a beamline',
        items : [
                    {
                        xtype : 'container',
                        layout: 'vbox',  
                        cls : 'border-grid',
                        margin : 20,
                        items: [
                                    this.sampleChangerGrid.getPanel(),
                                    this.beamlinesGrid.getPanel()
                        ]
                    },
                    this.sampleChangerPanel
             ]
    });

    return this.panel;
};


/**
* Returns a sampleChangerWidget given its name
*
* @method createSampleChanger
* @param changerName The name of the sample changer widget
* @return A Sample Changer Widget
*/
SampleChangerSelector.prototype.createSampleChanger = function (changerName) {
    var data = {
        radius : 200,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (changerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }
    sampleChangerWidget.render();
    return sampleChangerWidget;
};

/**
* Adds a sample changer widget to the sample changer panel
*
* @method addSampleChanger
* @param sampleChangerWidget The sample changer widget to be added
* @return
*/
SampleChangerSelector.prototype.addSampleChanger = function (sampleChangerWidget) {
    this.sampleChangerPanel.removeAll();
    this.sampleChangerPanel.add(sampleChangerWidget.getPanel());
    this.onSampleChangerSelected.notify(sampleChangerWidget.name);
};

/**
* Selects a row from the beamline grid given a beamline name
*
* @method selectRowByBeamlineName
* @param beamlineName The name of the beamline selected
* @return
*/
SampleChangerSelector.prototype.selectRowByBeamlineName = function (beamlineName) {
    this.beamlinesGrid.selectRowByValue(beamlineName);
};
/**
* This class extends the SampleChangerWidget class for a SC3
*
* @class FlexHCDWidget
* @constructor
*/
function SC3Widget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'SC3';
	this.clockwise = -1;

	this.data = {
		radius : this.radius,
		cells : 5,
		text : []
	};
	
	this.createStructure();
	this.createPucks(2, this.data.cells, 0, this.data.radius/2, 0.8);
};

SC3Widget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
SC3Widget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
SC3Widget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
SC3Widget.prototype.load = SampleChangerWidget.prototype.load;
SC3Widget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
SC3Widget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
SC3Widget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
SC3Widget.prototype.render = SampleChangerWidget.prototype.render;
SC3Widget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
SC3Widget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
SC3Widget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
SC3Widget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
SC3Widget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
SC3Widget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
SC3Widget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;

/**
* Creates the particular structure of the SC3
*
* @method createStructure
*/
SC3Widget.prototype.createStructure = function () {
	var textR = this.data.radius*0.9;
	for (var i = 0 ; i < this.data.cells ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		var textNumber = {
			text : i+1,
			x : -textR*Math.sin(ang) + this.data.radius,
			y : -textR*Math.cos(ang) + this.data.radius
		};
		this.data.text.push(textNumber);
	}
};

/**
* Converts the idLocation to the corresponding location in the SC3 by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the SC3 by convention
*/
SC3Widget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
	return Number(idLocation.split("-")[1]);
};

/**
* Converts the sample changer location in a SC3 to the id of the puck
*
* @method convertSampleChangerLocationToId
* @return The corresponding id of the puck in the given location
*/
SC3Widget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
	if (sampleChangerLocation <= 5 && sampleChangerLocation > 0) {
		return this.id + "-" + sampleChangerLocation + "-1";
	} else {
		return null;
	}
};
/**
* Extends the PuckWidget class for a SpinePuck
*
* @class UniPuckWidget
* @constructor
*/
function SpinePuckWidget(args){
	if (args == null){
		args = {};
	}
	args.isUnipuck = false;
	PuckWidget.call(this, args);
	this.data = this.parseData(this.data);	
	this.capacity = 10;

}

SpinePuckWidget.prototype.getPanel = PuckWidget.prototype.getPanel;
SpinePuckWidget.prototype.load = PuckWidget.prototype.load;
SpinePuckWidget.prototype.addCirclePathCells = PuckWidget.prototype.addCirclePathCells;
SpinePuckWidget.prototype.focus = PuckWidget.prototype.focus;
SpinePuckWidget.prototype.render = PuckWidget.prototype.render;
SpinePuckWidget.prototype.findCellIndexById = PuckWidget.prototype.findCellIndexById;
SpinePuckWidget.prototype.loadSamples = PuckWidget.prototype.loadSamples;
SpinePuckWidget.prototype.emptyAll = PuckWidget.prototype.emptyAll;

/**
* Parses the data
*
* @method parseData
* @return {Object} data The data correctly parsed
*/
SpinePuckWidget.prototype.parseData = function (data) {
	var n = 10;
	var marginPercent = 0.8;
	var dist = 3*data.mainRadius/4;
	
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	return data;
};
/**
* Extends the PuckWidget class for a UniPuck
*
* @class UniPuckWidget
* @constructor
*/
function UniPuckWidget(args){
	if (args == null){
		args = {};
	}
	args.isUnipuck = true;
	PuckWidget.call(this, args);

	this.data = this.parseData(this.data);
	this.capacity = 16;
};

UniPuckWidget.prototype.getPanel = PuckWidget.prototype.getPanel;
UniPuckWidget.prototype.load = PuckWidget.prototype.load;
UniPuckWidget.prototype.addCirclePathCells = PuckWidget.prototype.addCirclePathCells;
UniPuckWidget.prototype.focus = PuckWidget.prototype.focus;
UniPuckWidget.prototype.render = PuckWidget.prototype.render;
UniPuckWidget.prototype.findCellIndexById = PuckWidget.prototype.findCellIndexById;
UniPuckWidget.prototype.loadSamples = PuckWidget.prototype.loadSamples;
UniPuckWidget.prototype.emptyAll = PuckWidget.prototype.emptyAll;

/**
* Parses the data
*
* @method parseData
* @return {Object} data The data correctly parsed
*/
UniPuckWidget.prototype.parseData = function (data) {
	var n = 5;
	var marginPercent = 0.8;
	/** distance between center point and the well/cell */
	var dist = 4*data.mainRadius/11;
	
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	n = 11;
	marginPercent = 0.8;
	dist = 3*data.mainRadius/4;
	data = this.addCirclePathCells(data,n,marginPercent,dist);
	
	return data;
};

/**
* XFEScanGrid displays the information fo a XFE
*
* @class XFEScanGrid
* @constructor
*/
function XFEScanGrid(args) {
    this.id = BUI.id();

    this.plots = {};
}

/**
* 
* @method getPanel
*/
XFEScanGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
        fields: ["dataCollectionGroup"]
    });
    this.panel = Ext.create('Ext.grid.Panel', {

        cls: 'borderGrid',
        height: 800,
        store: this.store,
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: true
        },
        listeners: {
            boxready: function(component, eOpts) {

                for (var id in _this.plots) {
                    new Dygraph(document.getElementById(_this.plots[id].containerId),
                        _this.plots[id]["url"], {
                            legend: 'never',
                            title: '',
                            height: 150,
                            width: 400,
                            stackedGraph: true,
                            labelsDiv: document.getElementById(_this.plots[id].labelsContainerId),
                            labelsSeparateLines: true,
                            labelsDivWidth: 100,
                            labelsShowZeroValues: false,


                            highlightCircleSize: 2,
                            strokeWidth: 1,
                            strokeBorderWidth: 1,

                            highlightSeriesOpts: {
                                strokeWidth: 3,
                                strokeBorderWidth: 1,
                                highlightCircleSize: 5
                            },
                            ylabel: 'Count',
                        });
                }


            }
        }
    });


    return this.panel;
};

XFEScanGrid.prototype._getHTMLZoomImage = function(url, dataCollectionId, imageId) {
    return '<img style="width:400px;height:100;"  data-src=' + url + ' src=' + url + '>';
};


/**
* @method getColumns defines the columns of the grid and associates the data
*/
XFEScanGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [

        {
            header: 'Experiment Parameters',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1,
            renderer: function(grid, e, record) {
                var containerId = _this.id + record.data.xfeFluorescenceSpectrumId;
                _this.plots[record.data.xfeFluorescenceSpectrumId] = {
                    containerId: containerId,
                    labelsContainerId: containerId + "labels",
                    url: EXI.getDataAdapter().mx.xfescan.getCSV(record.data.xfeFluorescenceSpectrumId)
                };


                var html = "";

                record.data["xfeFluorescenceSpectrumId"] = record.data.xfeFluorescenceSpectrumId;
                record.data["containerId"] = containerId;


                dust.render("xfescangrid.template", record.data, function(err, out) {
                    html = out;
                });
                return html;

            }
        },

        {
            header: '',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            hidden: true,
            flex: 2,
            renderer: function(grid, e, record) {

                return _this._getHTMLZoomImage(EXI.getDataAdapter().mx.xfescan.getXFEJpegByScanId(record.data.xfeFluorescenceSpectrumId));


            }
        }
        /* ,
        {
            header: 'PyMca Results',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            width: 600,
            hidden: true,
            renderer: function(grid, e, record) {
                var containerId = _this.id + record.data.xfeFluorescenceSpectrumId;
                _this.plots[record.data.xfeFluorescenceSpectrumId] = {
                    containerId: containerId,
                    labelsContainerId: containerId + "labels",
                    url: EXI.getDataAdapter().mx.xfescan.getCSV(record.data.xfeFluorescenceSpectrumId)
                };


                var html = "";
                dust.render("xfescangrid.plot", { xfeFluorescenceSpectrumId: record.data.xfeFluorescenceSpectrumId, containerId: containerId }, function(err, out) {
                    html = out;
                });
                return html;


                // return "<div id='" + containerId +"'></div>";


            }
        }
        {
             header: 'Labels',
             dataIndex: 'dataCollectionGroup',
             name: 'dataCollectionGroup',
             flex: 2,
             renderer: function(grid, e, record) {
                 var labelsContainerId =  _this.id + record.data.xfeFluorescenceSpectrumId + "labels";
                 return "<div  id='" + labelsContainerId +"'></div>";
          
 
             }
         }*/

    ];
    return columns;
};

/**
* @method receive a json with an array of energy as it is defined on the view 
* of ISPyB 
*/
XFEScanGrid.prototype.load = function(data) {
    this.store.loadData(data);
};