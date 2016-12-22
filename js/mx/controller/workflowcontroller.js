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
    
    	Path.map("#/mx/workflow/steps/:workflowStepIdList/step/:workflowStepId/main").to(function() {
            
            var workflowStepId = this.params['workflowStepId'];
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
            mainView.load(_.find(JSON.parse(data), {'workflowStepId' :Number(workflowStepId) }));
		};

		EXI.getDataAdapter({onSuccess : onSuccess}).mx.workflowstep.getWorkflowstepByIdList(this.params['workflowStepIdList']);
	}).enter(this.setPageBackground);
};
