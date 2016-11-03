/**
* This class renders a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
* @class LoadSampleChangerView
* @constructor
*/
function LoadSampleChangerView (args) {
    var _this = this;

    this.height = 600;
    this.width = 600;
    this.widgetRadius = 110;
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
    this.onEmptyButtonClicked = new Event(this);

    this.containerListEditor.onSelectRow.attach(function(sender, row){
		_this.onSelectRow.notify(row);
	});

    this.containerListEditor.onContainerListLoaded.attach(function(sender){
        _this.loadSampleChangerWidgetFromContainersList();
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
        radius : this.widgetRadius,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    }

    return sampleChangerWidget;
};

/**
* Loads the sampleChangerWidget using the containerListEditor
*
* @method loadSampleChangerWidgetFromContainersList
* @return 
*/
LoadSampleChangerView.prototype.loadSampleChangerWidgetFromContainersList = function () {
    var _this = this;
    
    this.sampleChangerWidget.emptyAllPucks();
    var filledContainers = {};
    for (var i = 0 ; i < this.containerListEditor.panel.store.data.length ; i++){
        var record = this.containerListEditor.panel.store.getAt(i);
        if (record.get('sampleChangerLocation') != " "){
            var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(record.get('sampleChangerLocation')));
            if (puckId) {
                filledContainers[record.get('containerId')] = puckId;
                var puck = this.sampleChangerWidget.findPuckById(puckId);
                if (puck.capacity != record.get('capacity')){
                    $.notify("Warning: The container type of the container " + record.get('containerCode') + " does not match with the container on that location.", "warn");
                    Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
                }
            } else {
                $.notify("Warning: The sample in the container " + record.get('containerCode') + " has an incorrect location value for this type of sample changer.", "warn");
                Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
            }
        } else {
            $.notify("Warning: The container " + record.get('containerCode') + " has no sample changer location value.", "warn");
            Ext.fly(this.containerListEditor.panel.getView().getNode(record)).addCls("warning-row");
        }
    }
        
    if (!_.isEmpty(filledContainers)){
        var onSuccess = function (sender, samples) {
            var errorPucks = _this.sampleChangerWidget.loadSamples(samples,filledContainers);
            if (errorPucks.length > 0){
                for (index in errorPucks) {
                    var puck = errorPucks[index];
                    var recordsByLocation = _.filter(_this.containerListEditor.panel.store.data.items,function(o) {return o.data.sampleChangerLocation == _this.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id)});
                    for (i in recordsByLocation) {
                        var record = recordsByLocation[i];
                        Ext.fly(_this.containerListEditor.panel.getView().getNode(record)).addCls("error-row");
                    }
                }
            }
        }

        EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(_.keys(filledContainers));
    }
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
        height : 2*this.widgetRadius,
        margin : 8,
        layout: {
            type: 'hbox',
            pack: 'center'
        },  
        items : [this.sampleChangerWidget.getPanel()]
    });

    this.verticalPanel = Ext.create('Ext.panel.Panel', {
        // layout : 'hbox',
            items : [
                        this.widgetContainer    
            ]
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        // title : 'Load the sample changer',
        layout : 'hbox',
        height : this.height,
        width : this.width,
        margin : 5,
        items : [
                    this.containerListEditor.getPanel(),
                    this.verticalPanel  
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

/**
* Cleans and removes the previewPanelView
*
* @method cleanPreviewPanel
* @return
*/
LoadSampleChangerView.prototype.cleanPreviewPanel = function () {
    this.previewPanelView.clean();
    this.verticalPanel.remove(this.previewPanelView.panel);
};

/**
* Cleans and removes the previewPanelView
*
* @method cleanPreviewPanel
* @return
*/
LoadSampleChangerView.prototype.previewPuck = function (puckContainer, data, instructionsButtonText) {
    if (this.previewPanelView.previewPanel){
        this.cleanPreviewPanel();
    }
    this.verticalPanel.add(this.previewPanelView.getPanel());
    this.previewPanelView.loadPuck(puckContainer, data, instructionsButtonText);
};