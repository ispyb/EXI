function TestMainView(crystalId) {
	// this.queueGridList = [];
	MainView.call(this);

	this.crystalId = crystalId;
	this.testMainPanel = new TestMainPanel();
	// this.sampleForm = new SampleForm(crystalId);
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

TestMainView.prototype.getPanel = MainView.prototype.getPanel;

TestMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    margin : 15,
	    border: 1,
	    defaults: {
	        labelWidth: 80,
	        flex: 1,
	    },
	    items: [this.testMainPanel.getPanel([])]
	});
};



TestMainView.prototype.load = function(sampleId) {
	this.panel.setTitle("Sample");
	var _this = this;
	var onSuccess = function(sender, data){
		_this.testMainPanel.load(data);
	};
	
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByCrystalId(_this.crystalId);
	
};