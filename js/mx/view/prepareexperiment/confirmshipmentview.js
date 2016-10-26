function ConfirmShipmentView(args) {

    this.sampleChangerWidget = null;
    this.selectedPuck = null;

}

ConfirmShipmentView.prototype.getPanel = function () {

    this.puckPreviewPanel = Ext.create('Ext.panel.Panel', {
        cls     : 'border-grid',
        title: 'Selected Puck',
        width : 300,
        height : 265,
        margin : 60,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'hbox',
            align: 'center',
            pack: 'center'
        },
        margin : 20,
        items : [this.puckPreviewPanel],
			
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
    } else if (sampleChangerName == "SC3Widget") {
        sampleChangerWidget = new SC3Widget(data);
    }
    this.sampleChangerWidget = sampleChangerWidget;
    this.panel.insert(0,sampleChangerWidget.getPanel());
    this.sampleChangerWidget.render();
    this.sampleChangerWidget.setClickListeners();
    this.sampleChangerWidget.load(puckData);

    this.sampleChangerWidget.onPuckSelected.attach(function(sender,puck){
        _this.selectPuck(puck);
    });
}

// ConfirmShipmentView.prototype.setClickListeners = function () {
//     var _this = this;
// 	for (puckType in this.sampleChangerWidget.pucks) {
// 		for (puckIndex in this.sampleChangerWidget.pucks[puckType]){
// 			var puck = this.sampleChangerWidget.pucks[puckType][puckIndex];
// 			$("#" + puck.puckWidget.id).css('cursor','pointer');
// 			$("#" + puck.puckWidget.id).unbind('click').click(function(sender){
//                 _this.selectPuck(_this.sampleChangerWidget.findPuckById(sender.target.id));
// 			});
// 		}
// 	}
// }

ConfirmShipmentView.prototype.selectPuck = function (puck) {
    if (this.selectedPuck) {
        if (this.selectedPuck == puck) {
            $("#" + this.selectedPuck.id).attr("class","puck");
            this.puckPreviewPanel.removeAll();
            this.selectedPuck = null;
        } else {
            $("#" + this.selectedPuck.id).attr("class","puck");
            this.puckPreviewPanel.removeAll();
            this.selectedPuck = puck;
            $("#" + this.selectedPuck.id).attr("class","puck-selected");
        this.drawSelectedPuck(puck);
        }
    } else {
        this.selectedPuck = puck;
        $("#" + this.selectedPuck.id).attr("class","puck-selected");
        this.drawSelectedPuck(puck);
    }
}

ConfirmShipmentView.prototype.drawSelectedPuck = function (puck) {
    var data = {
        puckType : 1,
        containerId : puck.containerId,
        mainRadius : 100,
        x : 50,
        y : 10,
        enableMouseOver : true
    };
    var puckContainer = new PuckWidgetContainer(data);
    if (puck.capacity == 10) {
        data.puckType = 2;
        puckContainer = new PuckWidgetContainer(data);
    }
    this.puckPreviewPanel.add(puckContainer.getPanel());
    puckContainer.puckWidget.load(puck.data.cells);
}