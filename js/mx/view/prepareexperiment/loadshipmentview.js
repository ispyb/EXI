function LoadShipmentView () {
    var _this = this;

    var data = {
        radius : 115,
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

}

LoadShipmentView.prototype.getPanel = function () {
    var _this = this;

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
        height : 600,
        margin : 5,
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