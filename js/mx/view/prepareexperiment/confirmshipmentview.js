function ConfirmShipmentView(args) {

    this.sampleChangerWidget = null;
    this.selectedPuck = null;

}

ConfirmShipmentView.prototype.getPanel = function () {

    this.pucksList = Ext.create('Ext.panel.Panel', {
        cls     : 'rounded-border',
        title: 'Sample Changer',
        width : 600,
        height : 490,
        margin : 5,
        autoScroll:true,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        height : 500,
        layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
        },
        margin : 5,
        items : [this.pucksList],
			
	});
	
	return this.panel;

}

ConfirmShipmentView.prototype.loadSampleChanger = function (sampleChangerName, puckData) {
    var _this = this;
    var data = {
        radius : 200,
        isLoading : false
    };
    var sampleChangerWidget = null;
    if (sampleChangerName == "FlexHCD") {
        sampleChangerWidget = new FlexHCDWidget(data);
    } else if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }
    this.sampleChangerWidget = sampleChangerWidget;
    this.panel.insert(0,sampleChangerWidget.getPanel());
    this.sampleChangerWidget.render();
    // this.sampleChangerWidget.setClickListeners();
    this.sampleChangerWidget.load(puckData);

    this.sampleChangerWidget.onPuckSelected.attach(function(sender,puck){
        _this.selectPuck(puck);
    });

    this.loadPucksList(this.sampleChangerWidget);
}

ConfirmShipmentView.prototype.loadPucksList = function (sampleChangerWidget) {
    var html = "";
	dust.render("confirm.table.prepare.template", {pucks : Object.values(sampleChangerWidget.getPuckData())}, function(err, out){
		html = out;
	});
    this.pucksList.add({html : html});
}

ConfirmShipmentView.prototype.updateSampleChangerLocation = function (containerId, location) {
    for (var i=0 ; i < this.panel.store.data ; i++){
        var record = this.panel.store.getAt(i);
        debugger
    }
}