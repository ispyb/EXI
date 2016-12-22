function DataCollectionMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';

	MainView.call(this);

	this.grid = new OverviewQueueGrid({
		positionColumnsHidden : true,
		maxHeight : Ext.getCmp("main_panel").getHeight() - 50,
		padding : 40,
		sorters : [ {
			property : 'macromoleculeAcronym',
			direction : 'ASC' } ] });
	
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

DataCollectionMainView.prototype.getPanel = MainView.prototype.getPanel;
DataCollectionMainView.prototype.getContainer = MainView.prototype.getContainer;

DataCollectionMainView.prototype.filter = function(macromoleculeAcronym, bufferAcronym) {
	this.grid.key = {};
	this.grid.filter("bufferAcronym",bufferAcronym);
};

DataCollectionMainView.prototype.load = function(selected) {
	var _this = this;
	

	this.grid.onSelectionChange.attach(function(sender, elements) {
		_this.onSelectionChange.notify(elements);
	});

	this.grid.onSelect.attach(function(sender, selected) {
		_this.onSelect.notify(selected);
	});
	this.grid.onDeselect.attach(function(sender, unselected) {
		_this.onDeselect.notify(unselected);
	});

	this.container.insert(0, this.grid.getPanel());

	//this.grid.panel.setLoading();
	this.grid.load(selected);
	//this.grid.panel.setLoading(false);
};
