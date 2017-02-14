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


