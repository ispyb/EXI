function ConfirmShipmentView(args) {

    this.sampleChangerName = "";
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
        }
    }

    this.sampleChangerWidget = null;
    this.selectedPuck = null;

}

ConfirmShipmentView.prototype.getPanel = function () {
    var _this = this;

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

    this.panel.on('boxready', function(){
        if (_this.sampleChangerName) {
            _this.loadSampleChanger(_this.sampleChangerName)
        }
    });
    
	
	return this.panel;

}

ConfirmShipmentView.prototype.loadSampleChanger = function (sampleChangerName) {
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
    if (typeof(Storage) != "undefined"){
        var puckData = sessionStorage.getItem("puckData");
        if (puckData){
            this.sampleChangerWidget.load(JSON.parse(puckData));
        }
    }
    this.sampleChangerWidget.render();
    // this.sampleChangerWidget.setClickListeners();
    

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