function LoadShipmentView () {
    var _this = this;

    var data = {
        radius : 143,
        isLoading : false
    };

    this.containerListEditor = new ContainerPrepareSpreadSheetTest({height : 600});
    this.previewPanelView = new PreviewPanelView();
    this.sampleChangerWidget = new FlexHCDWidget(data);
    if (typeof(Storage) != "undefined") {
        var sampleChangerName = sessionStorage.getItem('sampleChangerName');
        if (sampleChangerName) {
            if (sampleChangerName == "FlexHCD") {
                this.sampleChangerWidget = new FlexHCDWidget(data);
            } else if (sampleChangerName == "SC3Widget") {
                this.sampleChangerWidget = new SC3Widget(data);
            }
        }
    }
    // this.sampleChangerSelector = new SampleChangerSelector();

    this.onSelectRow = new Event(this);
    this.onPuckSelected = new Event(this);
    this.onSampleChangerSelected = new Event(this);
    this.onLoadButtonClicked = new Event(this);
    this.onEmptyButtonClicked = new Event(this);

    this.containerListEditor.onSelectRow.attach(function(sender, row){
		_this.onSelectRow.notify(row);
	});

    this.sampleChangerWidget.onPuckSelected.attach(function(sender, puck){
		_this.onPuckSelected.notify(puck);
	});

    this.previewPanelView.onEmptyButtonClicked.attach(function(sender){
        _this.onEmptyButtonClicked.notify();
    });

    // this.sampleChangerSelector.onSampleChangerSelected.attach(function(sender, changerName){
	// 	_this.onSampleChangerSelected.notify(changerName);
	// });

}

LoadShipmentView.prototype.getPanel = function () {
    var _this = this;

    // this.rowPreviewPanel = Ext.create('Ext.panel.Panel', {
    //     cls     : 'border-grid',
    //     title : 'Selected Sample',
    //     width : 300,
    //     height : 265,
    //     items : []
    // });

    // this.puckPreviewPanel = Ext.create('Ext.panel.Panel', {
    //     cls     : 'border-grid',
    //     title: 'Selected Puck',
    //     width : 300,
    //     height : 265,
    //     items : []
    // });

    // this.loadButton = Ext.create('Ext.Button', {
    //     text: 'Load shipment',
    //     width: 300,
    //     height: 40,
    //     disabled : true,
    //     listeners: {
    //         click: function() {
    //             _this.onLoadButtonClicked.notify();
    //         }
    //     }
    // });

    // this.emptyButton = Ext.create('Ext.Button', {
    //     text: 'Empty puck',
    //     width: 300,
    //     height: 30,
    //     disabled : true,
    //     style: {
    //         background: '#444444'
    //     },
    //     listeners: {
    //         click: function() {
    //             _this.onEmptyButtonClicked.notify();
    //         }
    //     }
    // });

    // this.previewPanel = Ext.create('Ext.panel.Panel', {
    //     width : 300,
    //     height : 600,
    //     margin  : 5,
    //     items : [this.rowPreviewPanel,this.loadButton,this.puckPreviewPanel,this.emptyButton]
    // });

    var widgetContainer = Ext.create('Ext.panel.Panel', {
        width : 400,
        height : 400,
        margin : 20,
        items : [
                    this.sampleChangerWidget.getPanel()     
        ]
    });

    var verticalPanel = Ext.create('Ext.panel.Panel', {
        // layout : 'hbox',
            items : [
                        this.previewPanelView.getPanel(),
                        widgetContainer    
            ]
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        layout : 'hbox',
            items : [
                        this.containerListEditor.getPanel(),
                        verticalPanel  
            ]
    });

    this.panel.on('boxready', function() {
        _this.sampleChangerWidget.setClickListeners();
    });

    return this.panel;
}