/**
* This class renders a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
* @class LoadSampleChangerView
* @constructor
*/
function LoadSampleChangerView (args) {
    var _this = this;

    this.height = 600;
    this.width = 600;
    this.widgetRadius = 185;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    };

    this.warningRows = [];
    this.selectedContainerId = null;
    this.selectedContainerCapacity = null;
    this.selectedPuck = null;
    this.sampleChangerName = null;

    this.containerListEditor = new ContainerPrepareSpreadSheet({height : 480,width : 600});
    this.previewPanelView = new PreviewPanelView({
                                                        height : 100
                                                    });
    this.sampleChangerName = "";
    
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
        }
    }

    this.containerListEditor.onSelectRow.attach(function(sender, row){
        if (row) {
            if (_this.selectedPuck){
                _this.deselectPuck();
            }
            if (_this.selectedContainerId) {
                if (_this.selectedContainerId == row.get('containerId')){
                    _this.deselectRow();
                    _this.cleanPreviewPanel();
                } else {
                    _this.deselectRow();
                    _this.setSelectedRow(row);
                }
            } else {
                _this.setSelectedRow(row);
            }
        }
	});

    this.containerListEditor.onLoaded.attach(function(sender, containers){
        $('.notifyjs-corner').empty();        
        _this.load(containers);
    });

    this.previewPanelView.onEmptyButtonClicked.attach(function(sender){
        if (_this.selectedPuck){
            _this.selectedPuck.emptyAll();
            _this.previewPuck(_this.selectedPuck.containerId, _this.selectedPuck.capacity, {
                info : [{
                    text : 'SC Location',
                    value : _this.sampleChangerWidget.convertIdToSampleChangerLocation(_this.selectedPuck.id)
                }]
            }, "");
        }
        _this.containerListEditor.updateSampleChangerLocation(_this.selectedContainerId," ");
        _this.returnToSelectionStatus();
    });
};

LoadSampleChangerView.prototype.setSelectedRow = function (row) {
    this.containerListEditor.panel.getSelectionModel().select(row);
    this.selectedContainerId = row.get('containerId');
    this.selectedContainerCapacity = row.get('capacity');
    this.sampleChangerWidget.disablePucksOfDifferentCapacity(this.selectedContainerCapacity);

    if (!this.selectedPuck) {
        var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(row.get('sampleChangerLocation')));
        if (puckId){
            var puck = this.sampleChangerWidget.findPuckById(puckId);
            this.setSelectedPuck(puck);
        }
    }

    this.previewPuck(row.get('containerId'), 
                        row.get('capacity'), {
                                info : [{
                                    text : 'Container',
                                    value : row.get('containerCode')
                                },{
                                    text : 'SC Location',
                                    value : row.get('sampleChangerLocation')
                                }]
        }, "EMPTY");
};

/**
* Method executed once a puck from the sample changer widget is clicked.
*
* @method setSelectedPuck
* @return 
*/
LoadSampleChangerView.prototype.setSelectedPuck = function (puck) {
    this.selectedPuck = puck;
    $("#" + puck.id).addClass("puck-selected");
    if (puck.isEmpty){
        this.previewPuck(puck.containerId, puck.capacity, {
        info : [{
            text : 'SC Location',
            value : this.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id)
        }]
    }, "EMPTY");
    } else if (!this.selectedContainerId) {
        var rowsByContainerId = this.containerListEditor.getRowsByContainerId(puck.containerId);
        this.setSelectedRow(rowsByContainerId[0]);
    }
};

/**
* Takes care of deselecting a row in the loading step.
*
* @method deselectRow
* @return 
*/
LoadSampleChangerView.prototype.deselectRow = function () {
    this.containerListEditor.panel.getSelectionModel().deselectAll();
    this.selectedContainerId = null;
    this.selectedSampleCount = null;
    this.sampleChangerWidget.allowAllPucks();
}

/**
* Takes care of deselecting a puck in the loading step
*
* @method deselectPuck
* @return 
*/
LoadSampleChangerView.prototype.deselectPuck = function () {
    $("#" + this.selectedPuck.id).removeClass("puck-selected");
    this.selectedPuck = null; 
};

/**
* Returns to the initial state
*
* @method returnToSelectionStatus
* @return 
*/
LoadSampleChangerView.prototype.returnToSelectionStatus = function () {
    this.deselectRow();
    if (this.selectedPuck) {
        this.deselectPuck();        
    }
    this.cleanPreviewPanel();
};

/**
* Takes care of the process when a puck is selected after clicking a row, loading that puck with the selected container
*
* @method loadSampleChangerPuck
* @param {PuckWidget} puck The puck of the sample changer widget to be loaded
* @param {Integer} containerId The container Id of the container to be loaded
* @return 
*/
LoadSampleChangerView.prototype.loadSampleChangerPuck = function (puck, containerId) {
    if (puck.isEmpty){
        this.returnToSelectionStatus();
        var location = this.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id);
        this.containerListEditor.updateSampleChangerLocation(containerId,location);
    } else {
        $.notify("Error: choose an empty puck", "error");
    }
};

/**
* Generates a sampleChangerWidget given its name. It also checks for puck data on the sessionStorage
*
* @method getSampleChangerWidget
* @param {String} sampleChangerName The name of the sampleChangerWidget to be generated
* @return A sampleChangerWidget
*/
LoadSampleChangerView.prototype.getSampleChangerWidget = function (sampleChangerName) {
    var _this = this;
    var data = {
        radius : this.widgetRadius,
        isLoading : false
    };
    var sampleChangerWidget = new FlexHCDWidget(data);
    if (sampleChangerName == "SC3") {
        sampleChangerWidget = new SC3Widget(data);
    } else if (sampleChangerName == "RoboDiff") {
        sampleChangerWidget = new RoboDiffWidget(data);
    }

    return sampleChangerWidget;
};

/**
* Loads the sampleChangerWidget
*
* @method load
* @return 
*/
LoadSampleChangerView.prototype.load = function (containers) {
    var _this = this;

    this.sampleChangerWidget.emptyAllPucks();
    this.warningRows = [];
    var filledContainers = {};

    if (containers) {
        for (var i = 0 ; i < containers.length ; i++){
            var container = containers[i];
            if (container.sampleCount > 0){
                if (container.sampleChangerLocation != " "){
                    var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(container.sampleChangerLocation));
                    if (puckId) {
                        filledContainers[container.containerId] = puckId;
                        var puck = this.sampleChangerWidget.findPuckById(puckId);
                        if (puck.capacity != container.capacity){
                            this.warningRows.push(container.containerId);
                        }
                    } else {
                        this.warningRows.push(container.containerId);
                    }
                } else {
                    this.warningRows.push(container.containerId);
                }
            }
        }
        
        
        if (!_.isEmpty(filledContainers)){
            var onSuccess = function (sender, samples) {
                var errorPucks = _this.sampleChangerWidget.loadSamples(samples,filledContainers);
                if (errorPucks.length > 0){
                    for (index in errorPucks) {
                        var puck = errorPucks[index];
                        $("#" + puck.id).addClass("puck-error");
                    }
                }
            }

            EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(_.keys(filledContainers));
        }
    } else {
        this.containerListEditor.loadProcessingDewars(this.sampleChangerWidget);
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

    this.sampleChangerWidget = this.getSampleChangerWidget(this.sampleChangerName);

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
            if (_this.selectedContainerId) {
                if (_this.selectedPuck) {
                    if (_this.selectedPuck == puck) {
                        _this.returnToSelectionStatus();
                    } else {
                        _this.loadSampleChangerPuck(puck, _this.selectedContainerId);
                    }
                } else {
                    _this.loadSampleChangerPuck(puck, _this.selectedContainerId);
                }
            } else {
                if (_this.selectedPuck) {
                    if (_this.selectedPuck == puck) {
                        _this.returnToSelectionStatus();
                    } else {
                        _this.deselectRow();
                        _this.deselectPuck();
                        _this.setSelectedPuck(puck);
                    }
                } else {
                    _this.setSelectedPuck(puck);
                }
            }
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
LoadSampleChangerView.prototype.previewPuck = function (containerId, capacity, data, instructionsButtonText) {
    if (this.previewPanelView.previewPanel){
        this.cleanPreviewPanel();
    }
    this.verticalPanel.add(this.previewPanelView.getPanel());
    this.previewPanelView.load(containerId, capacity, data, instructionsButtonText);
};