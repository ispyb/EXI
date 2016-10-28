/**
* This class renders a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
* @class LoadSampleChangerView
* @constructor
*/
function LoadSampleChangerView (args) {
    var _this = this;

    this.height = 600;
    this.width = 600;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    };

    this.containerListEditor = new ContainerPrepareSpreadSheetTest({height : 480,width : 600});
    this.previewPanelView = new PreviewPanelView({height : 200});
    this.sampleChangerName = "";
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
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

    this.previewPanelView.onEmptyButtonClicked.attach(function(sender){
        _this.onEmptyButtonClicked.notify();
    });
};

/**
* Generates a sampleChangerWidget given its name. It also checks for puck data on the sessionStorage
*
* @method generateSampleChangerWidget
* @param {String} sampleChangerName The name of the sampleChangerWidget to be generated
* @return A sampleChangerWidget
*/
LoadSampleChangerView.prototype.generateSampleChangerWidget = function (sampleChangerName) {
    var _this = this;
    var data = {
        radius : 110,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }
    if (typeof(Storage) != "undefined"){
        var puckData = JSON.parse(sessionStorage.getItem('puckData'));
        if (puckData) {
            sampleChangerWidget.load(puckData);
        }
    }

    return sampleChangerWidget;
};

/**
* Returns a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
*
* @method getPanel
* @return A panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
*/
LoadSampleChangerView.prototype.getPanel = function () {
    var _this = this;

    this.sampleChangerWidget = this.generateSampleChangerWidget(this.sampleChangerName);

    this.widgetContainer = Ext.create('Ext.panel.Panel', {
        width : 400,
        height : 400,
        margin : 10,
        layout: {
            type: 'hbox',
            pack: 'center'
        },  
        items : [this.sampleChangerWidget.getPanel()]
    });

    var verticalPanel = Ext.create('Ext.panel.Panel', {
        // layout : 'hbox',
            items : [
                        this.previewPanelView.getPanel(),
                        this.widgetContainer    
            ]
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        title : 'Load the sample changer',
        layout : 'hbox',
        height : this.height,
        width : this.width,
        margin : 5,
        items : [
                    this.containerListEditor.getPanel(),
                    verticalPanel  
        ]
    });

    this.panel.on('boxready', function() {
        _this.sampleChangerWidget.setClickListeners();
        _this.sampleChangerWidget.onPuckSelected.attach(function(sender, puck){
            _this.onPuckSelected.notify(puck);
        });
        _this.sampleChangerWidget.render();
    });

    return this.panel;
};