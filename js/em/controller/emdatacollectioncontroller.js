/**
* This is the description for routing all the puck actions. It means url= #/mx/datacollection/*
*
* @class EMDataCollectionController
* @constructor
*/
function EMDataCollectionController() {	
	this.init();
}

EMDataCollectionController.prototype.setPageBackground = ExiGenericController.prototype.setPageBackground;
EMDataCollectionController.prototype.notFound = ExiGenericController.prototype.notFound;


/**
* Inits the controller for the puck related objects
* Paths accepted:
* #/mx/datacollection/protein_acronym/:acronmys/main
* #/mx/datacollection/session/:sessionId/main
*
* @method init
*/
EMDataCollectionController.prototype.init = function() {
	var _this = this;
	var listView;
	
    
	Path.map("#/em/datacollection/:datacollectionId/main").to(function() {
		var mainView = new DataCollectionEmMainView();
		EXI.addMainPanel(mainView);
        EXI.hideNavigationPanel();
		var onSuccess = function(sender, data){
			
			mainView.loadCollections(data);
		};
		
		EXI.getDataAdapter({onSuccess : onSuccess}).em.dataCollection.getMoviesDataByDataCollectionId(this.params['datacollectionId']);
	}).enter(this.setPageBackground);
    
	

   Path.map("#/em/proposal/:proposal/datacollection/session/:sessionId/main").to(function() {		
			
		var redirection = "#/em/datacollection/session/" + this.params['sessionId'] +"/main";				
		/** Are we logged in yet? */
		if (EXI.credentialManager.getConnections().length > 0){			
			ExiGenericController.prototype.redirect( this.params['proposal'], redirection);
		}
		else{			
			ExiGenericController.prototype.authenticateAndRedirect(this.params['proposal'], redirection);
		}

	}).enter(this.setPageBackground);


	Path.map("#/em/datacollection/session/:sessionId/main").to(function() {				
		var mainView = new DataCollectionEmMainView({sessionId : this.params['sessionId']});
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

	
        
	}).enter(this.setPageBackground);
	


};
