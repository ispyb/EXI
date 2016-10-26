function PuckWidgetView() {
	this.queueGridList = [];
    this.widget = new FlexHCDWidget();
    // this.widget = new SC3Widget();
    // this.widget = new PuckWidgetContainer({puckType : 1});
	this.title = 'Samples';
	
	MainView.call(this);

    var _this = this;
	
	// this.widget.mouseOverCell.attach(function(sender, location){
	// 	for (row in _this.grid.getStore().data.items) {
	// 		if (_this.grid.getStore().data.items[row].data.location == location){
	// 			_this.grid.getSelectionModel().select(Number(row));
	// 		}
	// 	}
	// });
	
	// this.widget.mouseOutCell.attach(function(sender){
	// 	_this.grid.getSelectionModel().deselectAll();
	// });
}
	
PuckWidgetView.prototype.getPanel = function() {
	
	var _this = this;
	
	this.store = Ext.create('Ext.data.Store', {
		storeId:'samplePanelId',
		fields:['acronym','state', 'code', 'type', 'name', 'location', 'holder', 'looptype'],
		data:[],
	});

	this.grid = Ext.create('Ext.grid.Panel', {
		margin : 20,
		title: 'Samples',
		store: Ext.data.StoreManager.lookup('samplePanelId'),
		columns: [
			{ text: 'Crystal protein acronym',  dataIndex: 'acronym'},
			{ text: 'State',  dataIndex: 'state'},
			{ text: 'Code', dataIndex: 'code'},
			{ text: 'Container type', dataIndex: 'type' },
			{ text: 'Name', dataIndex: 'name' },
			{ text: 'Location', dataIndex: 'location' },
			{ text: 'Holder', dataIndex: 'holder' },
			{ text: 'Looptype', dataIndex: 'looptype' },
		],
		height: 200,
		width: 700,
		listeners: {
			itemmouseenter: function (view, record, item) {
                        _this.widget.focus(record.data.location,true);
                    },
			itemmouseleave: function (view, record, item) {
                        _this.widget.focus(record.data.location,false);
                    }
		}
	});
	
	
	
	
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			
           layout : 'hbox',
		  
		   // cls : 'border-grid',
            items : [
                        this.grid ,this.widget.getPanel()      
            ]
	});    
	
    return this.panel;
};

PuckWidgetView.prototype.load = function(data) {
    var _this = this;
    _this.panel.setTitle("Test Widget");
	
	var sampleData = [];
	var stateTest = ["Filled","Collected","Results","Collected"];
	for (sample in data.sampleVOs){
		sampleData.push({'acronym' : data.sampleVOs[sample].crystalVO.proteinVO.acronym,
						'code' : data.code, 
						'type' : data.containerType, 
						'name' : data.sampleVOs[sample].crystalVO.proteinVO.name, 
						'location' : data.sampleVOs[sample].location, 
						'holder' : data.sampleVOs[sample].holderLength, 
						'looptype' : data.sampleVOs[sample].loopType,
						'state' : stateTest[sample]
					});
	}
	this.store.loadData(sampleData);
	
	this.widget.load(sampleData);
    
};
