/**
* This class renders a panel containing a ContainerPrepareSpreadSheetTest, a PreviewPanelView and a sampleChangerWidget
* @class LoadSampleChangerView
* @constructor
*/
function LoadSampleChangerView (args) {
    var _this = this;

    this.id = BUI.id();
    this.showTip = true;
    this.height = 600;
    this.width = 600;
    this.widgetRadius = 170;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    };

    var data = {
        radius : this.widgetRadius,
        isLoading : false
    };
    this.sampleChangerWidget = new FlexHCDWidget(data);
    this.legend = new PuckLegend({
                                    width       : 60, 
                                    height      : 300, 
                                    cy          : "50%", 
                                    tOffset     : 30,
                                    style       : "vertical",
                                    fontSize    : "0.45vw"
                                });

    this.selectedRowItem = null;
    this.selectedContainerId = null;
    this.selectedContainerCapacity = null;
    this.selectedPuck = null;
    this.sampleChangerName = null;

    this.containerListEditor = new ContainerPrepareSpreadSheet({height : 507,width : 600});
    this.previewPanelView = new PreviewPanelView({
                                                        height : 100
                                                    });
    
    if (typeof(Storage) != "undefined"){
        var sampleChangerName = sessionStorage.getItem("sampleChangerName");
        if (sampleChangerName){
            this.sampleChangerName = sampleChangerName;
        }
    }

    this.containerListEditor.onSelectRow.attach(function(sender, data){
        var row = data.record;
        if (row) {
            if (_this.showTip){
                $.notify("Click on a sample changer location to place the container","info");
                _this.sampleChangerWidget.blink();
                _this.showTip = false;
            }
            // Check if the sampleChanger needs to be changed
            if (row.data.beamlineName != _this.sampleChangerWidget.beamlineName) {
                _this.changeSampleChangerWidgetByBeamline(row.data.beamlineName);
            }
            // Manage the selection/deselection of rows and cells
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

    this.containerListEditor.onBeamlineChanged.attach(function(sender,beamline) {
        _this.changeSampleChangerWidgetByBeamline(beamline);
    });

    this.containerListEditor.onLoaded.attach(function(sender, containers){
        // $('.notifyjs-corner').empty();  
        _this.load(containers);
    });

    this.containerListEditor.onUnloadAllButtonClicked.attach(function(sender){
        _this.returnToSelectionStatus();
    });

    this.previewPanelView.onUnloadButtonClicked.attach(function(sender){
        if (_this.selectedPuck){
            _this.selectedPuck.emptyAll();
            _this.previewPuck(_this.selectedPuck.containerId, _this.selectedPuck.capacity, {
                info : [{
                    text : 'SC Location',
                    value : _this.sampleChangerWidget.convertIdToSampleChangerLocation(_this.selectedPuck.id)
                }]
            }, "");
        }
        _this.containerListEditor.updateSampleChangerLocation(_this.selectedContainerId,"");
        _this.returnToSelectionStatus();
    });
};

LoadSampleChangerView.prototype.setSelectedRow = function (row) {
    this.containerListEditor.panel.getSelectionModel().select(row);
    this.selectedRowItem = $('.x-grid-item-selected')[0];
    this.selectedContainerId = -1;
    if (row.get('containerId')){
        this.selectedContainerId = row.get('containerId');
    }
    this.selectedContainerCapacity = row.get('capacity');
    this.sampleChangerWidget.disablePucksOfDifferentCapacity(this.selectedContainerCapacity);

    if (!this.selectedPuck) {
        var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(row.get('sampleChangerLocation')));
        if (puckId){
            var puck = this.sampleChangerWidget.findPuckById(puckId);
            this.setSelectedPuck(puck);
        }
    }
    var text = "<span style='font-size:12px;'>Click on a sample changer </br>location to place the container</span>";
    if (row.get('sampleChangerLocation') != null && row.get('sampleChangerLocation') !="") {
        text = "Unload #" + row.get('sampleChangerLocation');
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
        }, text);
    
    if (this.selectedPuck) {
        this.sampleChangerWidget.enablePuck(this.selectedPuck);
    }

    $("#" + this.selectedRowItem.id).addClass("selected-row");

    $("#" + this.containerListEditor.id + "-" + this.selectedContainerId).prop('disabled', false);
    $("#" + this.containerListEditor.id + "-" + this.selectedContainerId).css('pointer-events','auto');
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
        if (!this.selectedContainerId) {
            this.selectedContainerId = puck.containerId;
        }
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
    //disable beamline combobox
    $("#" + this.containerListEditor.id + "-" + this.selectedContainerId).prop('disabled', 'disabled');
    $("#" + this.containerListEditor.id + "-" + this.selectedContainerId).css('pointer-events','none');
    //deselect row and reinitialize values
    this.containerListEditor.panel.getSelectionModel().deselectAll();
    this.selectedContainerId = null;
    this.selectedSampleCount = null;
    this.sampleChangerWidget.enableAllPucks();
    if(this.selectedRowItem){
        $("#" + this.selectedRowItem.id).removeClass("selected-row");
    }
    this.selectedRowItem = null;
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
    if (this.previewPanelView){
        this.cleanPreviewPanel();
    }
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
* @method createSampleChangerWidget
* @param {String} sampleChangerName The name of the sampleChangerWidget to be generated
* @param {String} beamlineName The name of the beamline
* @return A sampleChangerWidget
*/
LoadSampleChangerView.prototype.createSampleChangerWidget = function (sampleChangerName, beamlineName) {
    var _this = this;
    var data = {
        radius : this.widgetRadius,
        isLoading : false,
        beamlineName : beamlineName
    };
    this.sampleChangerWidget = new FlexHCDWidget(data);
    if (sampleChangerName == "SC3") {
        this.sampleChangerWidget = new SC3Widget(data);
    } else if (sampleChangerName == "RoboDiff") {
        this.sampleChangerWidget = new RoboDiffWidget(data);
    }

    return this.sampleChangerWidget;
};

LoadSampleChangerView.prototype.changeSampleChangerWidgetByBeamline = function (beamlineName) {
    var newBeamline = _.filter(EXI.credentialManager.getBeamlinesByTechnique("MX"),{"name":beamlineName});
    if (newBeamline.length > 0) {
        this.createSampleChangerWidget(newBeamline[0].sampleChangerType,newBeamline[0].name);
    } else {
        this.createSampleChangerWidget("FlexHCD",beamlineName);
    }
    this.widgetContainer.removeAll();
    this.load(this.containers);
    this.widgetContainer.insert(this.sampleChangerWidget.getPanel());
    this.widgetContainer.insert(this.legend.getPanel());
    this.reloadSampleChangerWidget();
    this.sampleChangerWidget.blink();
    this.returnToSelectionStatus();
}


/**
* Loads the sampleChangerWidget
*
* @method load
* @return 
*/
LoadSampleChangerView.prototype.load = function (containers) {
    var _this = this;
    
    this.sampleChangerWidget.emptyAllPucks();
    var filledContainers = {};

    if (containers) {
        this.containers = containers;
        for (var i = 0 ; i < containers.length ; i++){
            var container = containers[i];
            if (container.beamlineLocation == this.sampleChangerWidget.beamlineName){
                var sampleChangerLocation = container.sampleChangerLocation;
                if (sampleChangerLocation != "" && sampleChangerLocation != null){
                    var puckId = this.sampleChangerWidget.convertSampleChangerLocationToId(Number(sampleChangerLocation));
                    if (puckId) {
                        var puck = this.sampleChangerWidget.findPuckById(puckId);
                        if (puck.capacity != container.capacity){
                        }
                        if (container.sampleCount == 0) {
                            puck.containerId = container.containerId;
                            puck.isEmpty = false;
                        } else {
                            filledContainers[container.containerId] = puckId;
                        }
                    }
                }
            }
        }
        if (!_.isEmpty(filledContainers)){
            var onSuccess = function (sender, samples) {
                var errorPucks = _this.sampleChangerWidget.loadSamples(samples,filledContainers);
                if (errorPucks.length == 0){
                    _this.sampleChangerWidget.removeClassToAllPucks("puck-error");
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

    this.widgetContainer = Ext.create('Ext.panel.Panel', {
        width : 400,
        height : 2*this.widgetRadius,
        margin : 8,
        layout: {
            type: 'hbox',
            pack: 'center'
        },  
        items : [this.sampleChangerWidget.getPanel(),
                this.legend.getPanel()]
    });

    this.verticalPanel = Ext.create('Ext.panel.Panel', {
        // layout : 'hbox',
        margin : 10,
        layout: {
            type: 'vbox',
            align: 'center',
            pack: 'center'
        },
        items : [{html : "<div id='" + this.id + "-notifications' class='container-fluid' align='center' ><div class='row' style='width:370px;'><div class='col-md-9'><span id='" + this.id + "-scw-label' class='" + this.id + "-lab' style='width:500px;font-size:20px;font-weight:100;'></span></div><div class='col-md-2'><button id='" + this.id + "-unloadSC-button' type='button' class='btn btn-default btn-xs' style='background:rgb(68, 68, 68);color: #ffffff;'><b>Unload SC</b></button></div></div></div>"},
                    this.widgetContainer    
        ]
    });

    this.panel = Ext.create('Ext.panel.Panel', {
        // title : 'Load the sample changer',
        autoScroll : true,
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
        _this.reloadSampleChangerWidget();
        $("#" + _this.id + "-unloadSC-button").unbind('click').click(function(sender){
                var containerIds = _.map(_.map(_this.sampleChangerWidget.getAllFilledPucks(),"puckWidget"),"containerId");
                if (containerIds.length > 0){
                    var onSuccess = function (sender,c) {
                        _this.returnToSelectionStatus();
                        _this.load();
                    }
                    EXI.getDataAdapter({onSuccess:onSuccess}).proposal.dewar.emptySampleLocation(containerIds);
                }
			});
    });

    return this.panel;
};

LoadSampleChangerView.prototype.reloadSampleChangerWidget = function () {
    var _this = this;
    this.sampleChangerWidget.setClickListeners();
    this.sampleChangerWidget.onPuckSelected.attach(function(sender, puck){
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
    this.sampleChangerWidget.render();
    $("#" + this.id + "-scw-label").html(this.sampleChangerWidget.beamlineName + " (" + this.sampleChangerWidget.name + ")");
    this.panel.doLayout();
}

/**
* Cleans and removes the previewPanelView
*
* @method cleanPreviewPanel
* @return
*/
LoadSampleChangerView.prototype.cleanPreviewPanel = function () {
    this.previewPanelView.clean();
    if (this.previewPanelView.panel){
        if(this.previewPanelView.panel.body){
            this.verticalPanel.remove(this.previewPanelView.panel);
        }
    }
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
