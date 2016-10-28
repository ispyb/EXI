/**
* This class renders a grid for selecting a sample changer and a panel containing the sample changer widget
*
* @class SampleChangerSelector
* @constructor
*/
function SampleChangerSelector (args) {
    var _this = this;

    this.height = 600;
    this.width = 1000;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    var SCtypes = {
        header : "Type (Sample Changer)",
        values : ["FlexHCD","SC3"]
    };
    var beamlines = {
        header : "Beamlines",
        values : EXI.credentialManager.getBeamlines()
    };

    this.sampleChangerGrid = new BootstrapGrid({template : "bootstrap.grid.template"});
    this.sampleChangerGrid.load(SCtypes);
    this.beamlinesGrid = new BootstrapGrid({template : "bootstrap.grid.template"});
    this.beamlinesGrid.load(beamlines);

    this.sampleChangerWidget = null;

    this.sampleChangerGrid.rowSelected.attach(function(sender,text){
        _this.beamlinesGrid.deselectAll();
        _this.sampleChangerWidget = _this.createSampleChanger(text);
        _this.addSampleChanger(_this.sampleChangerWidget);
    });
    this.beamlinesGrid.rowSelected.attach(function(sender,text){
        _this.sampleChangerGrid.deselectAll();
        _this.sampleChangerWidget = _this.createSampleChanger(text);
        _this.addSampleChanger(_this.sampleChangerWidget);
    });
    this.onSampleChangerSelected = new Event(this);
};

/**
* Loads a Ext.panel.panel containing a bootstrap grid and a sample changer widget
*
* @method getPanel
* @return 
*/
SampleChangerSelector.prototype.getPanel = function() {

    this.sampleChangerPanel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'hbox',
            pack: 'center'
        }, 
        width: 410,
        height: 410,
        margin : 50,
        items : []
    });

    this.panel = Ext.create('Ext.panel.Panel', {
         layout: {
            type: 'hbox',
            pack: 'left'
        },     
        // cls : 'border-grid',  
        height : this.height, 
        width : this.width,
        title : 'Select a sample changer type or a beamline',
        items : [
                    {
                        xtype : 'container',
                        layout: 'vbox',  
                        cls : 'rounded-border',
                        margin : 20,
                        items: [
                                    this.sampleChangerGrid.getPanel(),
                                    this.beamlinesGrid.getPanel()
                        ]
                    },
                    this.sampleChangerPanel
             ]
    });

    return this.panel;
};


/**
* Returns a sampleChangerWidget given its name
*
* @method createSampleChanger
* @param changerName The name of the sample changer widget
* @return A Sample Changer Widget
*/
SampleChangerSelector.prototype.createSampleChanger = function (changerName) {
    var data = {
        radius : 200,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (changerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }
    sampleChangerWidget.render();
    return sampleChangerWidget;
};

/**
* Adds a sample changer widget to the sample changer panel
*
* @method addSampleChanger
* @param sampleChangerWidget The sample changer widget to be added
* @return
*/
SampleChangerSelector.prototype.addSampleChanger = function (sampleChangerWidget) {
    this.sampleChangerPanel.removeAll();
    this.sampleChangerPanel.add(sampleChangerWidget.getPanel());
    this.onSampleChangerSelected.notify(sampleChangerWidget.name);
};

/**
* Selects a row from the beamline grid given a beamline name
*
* @method selectRowByBeamlineName
* @param beamlineName The name of the beamline selected
* @return
*/
SampleChangerSelector.prototype.selectRowByBeamlineName = function (beamlineName) {
    this.beamlinesGrid.selectRowByValue(beamlineName);
};