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

    Path.map("#/mx/proposal/:proposal/datacollection/sample/:sampleId/main").to(function() {

        var redirection = "#/mx/datacollection/sample/" + this.params['sampleId'] +"/main";
        var proposal = this.params['proposal'];
        if (EXI.credentialManager.getConnections().length > 0){
            ExiGenericController.prototype.redirect( this.params['proposal'], redirection);
        }
        else{
            ExiGenericController.prototype.authenticateAndRedirect(this.params['proposal'], redirection);
        }
    }).enter(this.setPageBackground);

	Path.map("#/mx/datacollection/sample/:sampleId/main").to(function() {

	    var proposals = EXI.credentialManager.getCredentials()[0].activeProposals;
        var mainView = new DataCollectionMxMainView({sampleId: this.params['sampleId'], proposal : proposals[0]});
        EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
        var onSuccess = function(sender, data){
            mainView.loadCollections(data);
        };
        EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.getBySampleId(this.params['sampleId']);
    }).enter(this.setPageBackground);

    Path.map("#/mx/datacollection/proposal/:proposal/shipping/:shippingId/main").to(function() {

        var redirection = "#/mx/datacollection/shipping/" + this.params['shippingId'] +"/main";
        var proposal = this.params['proposal'];
        if (EXI.credentialManager.getConnections().length > 0){
            ExiGenericController.prototype.redirect( this.params['proposal'], redirection);
        }
        else{
            ExiGenericController.prototype.authenticateAndRedirect(this.params['proposal'], redirection);
        }
    }).enter(this.setPageBackground);

    Path.map("#/mx/datacollection/shipping/:shippingId/main").to(function() {

        var proposals = EXI.credentialManager.getCredentials()[0].activeProposals;
        var mainView = new DataCollectionMxMainView({shippingId: this.params['shippingId'], proposal : proposals[0]});
        EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
        var onSuccess = function(sender, data){
            mainView.loadCollections(data);
        };

        EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getDataCollections(this.params['shippingId']);
    }).enter(this.setPageBackground);


	Path.map("#/mx/proposal/:proposal/datacollection/session/:sessionId/main").to(function() {

		var redirection = "#/mx/datacollection/session/" + this.params['sessionId'] +"/main";
		this.proposal = this.params['proposal'];	
		/** Are we logged in yet? */
		if (EXI.credentialManager.getConnections().length > 0){			
			ExiGenericController.prototype.redirect( this.params['proposal'], redirection);
		}
		else{			
			ExiGenericController.prototype.authenticateAndRedirect(this.params['proposal'], redirection);
		}

	}).enter(this.setPageBackground);


	Path.map("#/mx/datacollection/session/:sessionId/main").to(function() {	
	
		var proposals = EXI.credentialManager.getCredentials()[0].activeProposals;		
		var mainView = new DataCollectionMxMainView({sessionId : this.params['sessionId'], proposal : proposals[0]});
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

   	Path.map("#/mx/datacollection/proposal/:proposal/dcid/:datacollectionid/main").to(function() {
        var redirection = "#/mx/datacollection/dcid/" + this.params['datacollectionid'] + "/main";
        this.proposal = this.params['proposal'];
        /** Are we logged in yet? */
        if (EXI.credentialManager.getConnections().length > 0){
            ExiGenericController.prototype.redirect( this.params['proposal'], redirection);
        }
        else{
            ExiGenericController.prototype.authenticateAndRedirect(this.params['proposal'], redirection);
        }

    }).enter(this.setPageBackground);

    Path.map("#/mx/datacollection/dcid/:datacollectionid/main").to(function() {
        var proposalId = EXI.credentialManager.getActiveProposal();
        var mainView = new DataCollectionMxMainView({sessionId : null, proposal : proposalId});
        EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
        EXI.setLoadingMainPanel(true);
        var onSuccess = function(sender, data){
            mainView.loadCollections(data);
            EXI.setLoadingMainPanel(false);
        };
        EXI.getDataAdapter({onSuccess : onSuccess}).mx.dataCollection.getByDataCollectionId(this.params['datacollectionid']);

    }).enter(this.setPageBackground);

    Path.map("#/mx/datacollection/datacollectionid/:datacollectionid/main").to(function() {
        var mainView = new DataCollectionMxMainView({sessionId : this.params['sessionId'], proposal : this.params['proposal']});
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

	Path.map("#/mx/datacollectiongroup/:dataCollectionGroupId/step/:step/main").to(function() {
		var mainView = new PhasingGridMainView();
        EXI.hideNavigationPanel();
		EXI.addMainPanel(mainView);
		mainView.load(this.params['dataCollectionGroupId'], this.params['step']);
	}).enter(this.setPageBackground);
};
