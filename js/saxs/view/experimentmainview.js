function ExperimentMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	// this.experimentHeaderForm = new ExperimentHeaderForm();
	var _this = this;
	/** Viscosity **/
	var storeViscosity = Ext.create('Ext.data.Store', {
		fields : [ 'name' ],
		data : [ {
			"name" : "low"
		}, {
			"name" : "medium"
		}, {
			"name" : "high"
		} ]
	});

		
	/** Specimen Widget contains a specimenGrid and a sampleChangerWidget than can be displayed with are vertical or horizontal layout **/
	this.specimenWidget = new SpecimenWidget({
		height : this.height,
		width : 1200
	});
	
	this.measurementGrid = new MeasurementGrid();
	
	this.queueGrid = new OverviewQueueGrid({
		positionColumnsHidden : true,

		sorters : [ {
			property : 'macromoleculeAcronym',
			direction : 'ASC'
		} ]
	});

	this.activePanel = this.queueGrid;
	
}


ExperimentMainView.prototype.getToolBar = function() {
    var _this = this;
    function onMenuClicked(widget){
        if (_this.activePanel != widget){
            _this.activePanel = widget;
			_this.load(_this.dataCollections);
        }
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'Online Data Analysis',
            handler: function(){
                onMenuClicked(_this.queueGrid);
            }
        },{
            text: 'Measurements',            
            handler: function(){
                onMenuClicked(_this.measurementGrid);
            }
        },{
            text: 'Sample Plate Setup',            
            handler: function(){
                onMenuClicked(_this.specimenWidget);
            }
        }]
   });
    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
		
        items: [
           {
                text:'View',
                iconCls: 'bmenu',  // <-- icon
                menu : menu  // assign menu by instance
            }
        ]
    });
};

ExperimentMainView.prototype.getPanel = function() {

	this.panel = Ext.create('Ext.panel.Panel', {   
		margin : 10,
		// minHeight : 900,
		layout : 'fit',
		minHeight : 600,
		tbar : this.getToolBar(),
		items: []
	});
	return this.panel;
};

ExperimentMainView.prototype.load = function(dataCollections) {
	this.dataCollections = dataCollections;
	this.panel.removeAll();
	this.panel.insert(this.activePanel.getPanel());
	this.activePanel.load(dataCollections);	
};
