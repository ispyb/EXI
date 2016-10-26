function SampleChangerSelector () {
    this.sampleChangerWidget = null;

    // this.onPuckSelected = new Event(this);
    this.onSampleChangerSelected = new Event(this);
}

SampleChangerSelector.prototype.getPanel = function() {

    this.panel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        width: 500,
        height: 600,
        tbar : this.getToolbar(),
        items : []
    });

    this.container = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        margin: 5,
        items : [this.panel]
    });
    return this.container;
}

// SampleChangerSelector.prototype.loadSampleChanger = function (sampleChangerWidget) {
//     this.sampleChangerWidget = sampleChangerWidget;
//     this.panel.insert(0,sampleChangerWidget.getPanel());
//     this.sampleChangerWidget.render();
//     this.setClickListeners();
// }

SampleChangerSelector.prototype.createSampleChanger = function (changerName) {
    var data = {
        radius : 200,
        isLoading : false
    };
    if (changerName == "FlexHCD") {
        this.sampleChangerWidget = new FlexHCDWidget(data);
    } else if (changerName == "SC3Widget") {
        this.sampleChangerWidget = new SC3Widget(data);
    }
    this.panel.removeAll();
    this.panel.add(this.sampleChangerWidget.getPanel());
    this.sampleChangerWidget.render();
    // this.setClickListeners();
}

SampleChangerSelector.prototype.getToolbar = function() {
    var _this = this;
    function changerSelected (changer) {
        _this.createSampleChanger(changer.text);
        _this.onSampleChangerSelected.notify(changer.text);
    }

    var menu =  Ext.create('Ext.menu.Menu', {     
        items: [{
            text: 'FlexHCD',
            handler: changerSelected
        },{
            text: 'SC3Widget',            
            handler: changerSelected
        }]
   });

   return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
        items: [
           {
                text:'Sample Changer',
                menu : menu  // assign menu by instance
            }
        ]
    });
}

// SampleChangerSelector.prototype.setClickListeners = function () {
//     var _this = this;
// 	for (puckType in this.sampleChangerWidget.pucks) {
// 		for (puckIndex in this.sampleChangerWidget.pucks[puckType]){
// 			var puck = this.sampleChangerWidget.pucks[puckType][puckIndex];
// 			$("#" + puck.puckWidget.id).css('cursor','pointer');
// 			$("#" + puck.puckWidget.id).unbind('click').click(function(sender){
// 				_this.onPuckSelected.notify(_this.sampleChangerWidget.findPuckById(sender.target.id));
// 			});
// 		}
// 	}
// }