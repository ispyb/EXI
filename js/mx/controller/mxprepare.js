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
	    var mainView = new PrepareMainView({currentStep : 1});
		EXI.addMainPanel(mainView);
	    mainView.load();
	}).enter(this.setPageBackground);

	// Path.map("#/mx/prepare/main/selectSampleChanger").to(function() {
	// 	EXI.clearNavigationPanel();
	//     var mainView = new PrepareMainView({currentStep : 2});
	// 	EXI.addMainPanel(mainView);
	//     mainView.load();
	// }).enter(this.setPageBackground);

	Path.map("#/mx/prepare/main/loadSampleChanger").to(function() {
		EXI.clearNavigationPanel();
	    var mainView = new PrepareMainView({currentStep : 2});
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