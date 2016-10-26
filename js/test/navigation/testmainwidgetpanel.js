function TestMainWidgetPanel(){
	this.title = "Samples";
	ListView.call(this);
}

TestMainWidgetPanel.prototype.getPanel = ListView.prototype.getPanel;
TestMainWidgetPanel.prototype.load = ListView.prototype.load;
TestMainWidgetPanel.prototype.getFields = ListView.prototype.getFields;
TestMainWidgetPanel.prototype.getColumns = ListView.prototype.getColumns;


TestMainWidgetPanel.prototype.getRow = function(record){
	var html = "1";
	return html;
};

TestMainWidgetPanel.prototype.getFilter = function(value){
	return [{property : "sampleName", value : value, anyMatch : true}];
};