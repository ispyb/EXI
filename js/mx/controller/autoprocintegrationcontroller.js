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
            mainView.panel.setLoading(false);
            // Get the data sorted as in the AutoProcIntegrationGrid
            var sortedData = mainView.autoProcIntegrationGrid.panel.getStore().data.items[0].data.items;
            listPanel.load(sortedData);
            listPanel.panel.getSelectionModel().selectAll();
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

	Path.map("#/autoprocintegration/datacollection/:datacollectionId/autoprocIntegration/:autoprocIntegrationId/main").to(function() {
		var _this = this;
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
			results = _.filter(data[0],function (r) {return r.AutoProcIntegration_autoProcIntegrationId == _this.params['autoprocIntegrationId']})
            // mainView.load(results);
            mainView.panel.setLoading(false);            
            listPanel.load((new AutoProcIntegrationGrid).parseData(data[0]));
            listPanel.selectRow("AutoProcIntegration_autoProcIntegrationId",_this.params['autoprocIntegrationId']);
        };
        EXI.getDataAdapter({onSuccess : onSuccess2}).mx.autoproc.getViewByDataCollectionId(this.params['datacollectionId']);
	}).enter(this.setPageBackground);

};
