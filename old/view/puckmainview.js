function PuckMainView() {
	
	this.icon = '../images/BasketView_24x24_01.png';
	MainView.call(this);
	
	var _this = this;
	this.puckForm = new PuckForm({width : 1500});
}

PuckMainView.prototype.getPanel = MainView.prototype.getPanel;

PuckMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'anchor'
	    },
	    cls : 'border-grid',
	    defaults : {
			anchor : '100%',
			hideEmptyLabel : false },
	    margin : 0,
		bodyStyle : {
			"background-color" : "#E6E6E6" 
		},
		 items: [ this.puckForm.getPanel()]
	});

};


PuckMainView.prototype.load = function(puck) {
	var _this = this;
	this.puckForm.load(puck, null);
};
