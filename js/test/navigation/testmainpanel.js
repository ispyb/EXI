function TestMainPanel(){
	this.title = "Samples";
	ListView.call(this);
}

TestMainPanel.prototype.getPanel = ListView.prototype.getPanel;
TestMainPanel.prototype.load = ListView.prototype.load;
TestMainPanel.prototype.getFields = ListView.prototype.getFields;
TestMainPanel.prototype.getColumns = ListView.prototype.getColumns;

TestMainPanel.prototype.getRow = function(record){
	var html = "";
	dust.render("test.template.main", record.data, function(err, out){
        	html = out;
     	});
	return html;
};

TestMainPanel.prototype.getFilter = function(value){
	return [{property : "sampleName", value : value, anyMatch : true}];
};
