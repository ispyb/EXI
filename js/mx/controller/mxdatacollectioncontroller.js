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
		var mainView = new DataCollectionMxMainView({sessionId : this.params['sessionId']});
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		EXI.setLoadingMainPanel(true);


		var onSuccessProposal = function (sender,proposal) {
			if (proposal && proposal.length > 0) {
				mainView.loadProposal(proposal[0]);
			}
		}

		EXI.getDataAdapter({onSuccess : onSuccessProposal}).proposal.proposal.getProposalBySessionId(this.params['sessionId']);


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
			var mainView = new DataCollectionMxMainView();
			EXI.addMainPanel(mainView);
			EXI.hideNavigationPanel();
			EXI.setLoadingMainPanel(true);
			var onSuccess = function(sender, data){
				debugger
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

	Path.map("#/mx/datacollectiongroup/:dataCollectionGroupId/step/:step/main").to(function() {
		var mainView = new PhasingGridMainView();
        EXI.hideNavigationPanel();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['dataCollectionGroupId'], this.params['step']);
	}).enter(this.setPageBackground);
};
