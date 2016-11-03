/**
* This class renders the steps and panels of every class used in the prepare experiment tab
*
* @class PrepareMainViewTest
* @constructor
*/
function PrepareMainViewTest(args) {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];
    
	MainView.call(this);
    
    var _this = this;

    this.currentStep = 1;
    if (args) {
        if (args.currentStep) {
            this.currentStep = args.currentStep;
        }
    }

    this.steps = ["","/selectSampleChanger","/loadSampleChanger","/confirm"];

    this.height = 550;
    this.width = 1300;
    
    this.dewarListSelector = new DewarListSelectorGridTest({height : this.height - 12, width : this.width - 60});
    this.sampleChangerSelector = new SampleChangerSelector({height : this.height - 12, width : this.width - 0});
    this.loadSampleChangerView = new LoadSampleChangerView({height : this.height - 12, width : this.width - 0});
    this.confirmShipmentView = new ConfirmShipmentView();

    this.dewarListSelector.onSelect.attach(function(sender, dewar){  
            $('#step-3').attr("disabled", true);
            _this.loadSampleChangerView.sampleChangerName = "";
            _this.save("sampleChangerName","");     
            if (dewar.shippingStatus == "processing"){
                _this.updateStatus(dewar.shippingId, "at_ESRF");
            } 
            if (dewar.shippingStatus != "processing"){
                _this.updateStatus(dewar.shippingId, "processing");
            }      
     });
     
    this.dewarListSelector.onSelectionChange.attach(function(sender, dewars){
    });

    this.selectedContainerId = null;
    this.selectedContainerCapacity = null;
    this.selectedPuck = null;
    this.sampleChangerName = null;

    this.sampleChangerSelector.onSampleChangerSelected.attach(function(sender,changerName){
        $('#next-button').attr("disabled", false);
        $('#step-3').attr("disabled", false);
        _this.sampleChangerName = changerName;
        _this.save('sampleChangerName', changerName);
        if (typeof(Storage) != "undefined") {
            sessionStorage.removeItem('puckData');
        }
        _this.loadSampleChangerView.sampleChangerName = changerName;
    });

    this.loadSampleChangerView.onSelectRow.attach(function(sender, row){
        if (row) {
            if (_this.selectedPuck){
                _this.deselectPuck();
            }
            if (_this.selectedContainerId) {
                if (_this.selectedContainerId == row.get('containerId')){
                    _this.deselectRow();
                    _this.loadSampleChangerView.cleanPreviewPanel();
                } else {
                    _this.deselectRow();
                    _this.setSelectedRow(row);
                }
            } else {
                _this.setSelectedRow(row);
            }
        }
	});

    this.loadSampleChangerView.onPuckSelected.attach(function(sender, puck){
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

    this.loadSampleChangerView.onEmptyButtonClicked.attach(function(sender){
        if (_this.selectedPuck){
            _this.selectedPuck.emptyAll();
            _this.drawSelectedPuck(_this.selectedPuck);
        }
        _this.loadSampleChangerView.containerListEditor.updateSampleChangerLocation(_this.selectedContainerId," ");
        _this.returnToSelectionStatus();
    });
};

PrepareMainViewTest.prototype.setSelectedRow = function (row) {
    this.loadSampleChangerView.containerListEditor.panel.getSelectionModel().select(row);
    this.selectedContainerId = row.get('containerId');
    this.selectedContainerCapacity = row.get('capacity');
    this.drawSelectedPuckFromRecord(row);
    this.loadSampleChangerView.sampleChangerWidget.disablePucksOfDifferentCapacity(this.selectedContainerCapacity);

    if (!this.selectedPuck) {
        var puckId = this.loadSampleChangerView.sampleChangerWidget.convertSampleChangerLocationToId(Number(row.get('sampleChangerLocation')));
        if (puckId){
            var puck = this.loadSampleChangerView.sampleChangerWidget.findPuckById(puckId);
            this.setSelectedPuck(puck);
        }
    }
};

/**
* Method executed once a puck from the sample changer widget is clicked.
*
* @method setSelectedPuck
* @return 
*/
PrepareMainViewTest.prototype.setSelectedPuck = function (puck) {
    this.selectedPuck = puck;
    $("#" + puck.id).attr("class","puck-selected");
    if (puck.isEmpty){
        this.drawSelectedPuck(puck);
    } else if (!this.selectedContainerId) {
        for (var i = 0 ; i < this.loadSampleChangerView.containerListEditor.panel.store.data.length ; i++) {
            var record = this.loadSampleChangerView.containerListEditor.panel.store.getAt(i);
            if (record.get('containerId') == puck.containerId) {
                this.setSelectedRow(record);
            }
        }
    }
};


/**
* Stores on the DB the status given a shippingId
* Status may be : [at_ESRF, processing, opened, ready to go]
*
* @method updateStatus
* @return 
*/
PrepareMainViewTest.prototype.updateStatus = function(shippingId, status) {
    var _this = this;
    _this.dewarListSelector.panel.setLoading("Updating shipment Status");
    var onStatusSuccess = function(sender, dewar) {             
        EXI.mainStatusBar.showReady("Processing update successfully");
        _this.dewarListSelector.panel.setLoading(false);
        _this.load();
    };
    var onError = function(data){
            EXI.setError(data);
    };
    
    EXI.getDataAdapter({onSuccess : onStatusSuccess, onError : onError}).proposal.shipping.updateStatus(shippingId,status);
};

/**
* Manages the showing and hiding buttons
*
* @method manageButtons
* @return 
*/
PrepareMainViewTest.prototype.manageButtons = function () {
    if (this.currentStep == 1) {
        $('#previous-button-div').hide();
        $('#next-button').attr("disabled", false); 
    } else {
        $('#previous-button-div').show();
    }
    if (this.currentStep == 2) {
        $('#next-button').attr("disabled", true);
    }
    if (this.currentStep < 3) {
        $('#next-button-div').show();  
        $('#done-button-div').hide();
    }
    if (this.currentStep == 3) {
        $('#next-button-div').hide();
    }
};

/**
* Manages the step change when the buttons next or previous are clicked
*
* @method changeStep
* @param {Integer} direction An integer that is positive for the next button and negative for the previous button
* @return 
*/
PrepareMainViewTest.prototype.changeStep = function (direction) {
    this.currentStep += direction;
    location.href = "#/mx/prepare/main" + this.steps[this.currentStep-1];
};

/**
* Manages the disable state of the step buttons
*
* @method manageStepButtons
* @return 
*/
PrepareMainViewTest.prototype.manageStepButtons = function () {
    if (this.loadSampleChangerView.sampleChangerName == "") {
        $('#step-3').attr("disabled", true);
    } else {
        $('#step-3').attr("disabled", false);
    }
    for (var i = 1 ; i <= 4 ; i++){
        if (i == this.currentStep){
            $('#step-' + i).addClass('active-step');
        }
    }
};

/**
* Loads a Ext.panel.panel constaining a Ext.panel.Panel that will render the steps inside and sets the click events for the buttons
*
* @method getPanel
* @return 
*/
PrepareMainViewTest.prototype.getPanel = function() {
    var _this = this;

    /** Main container where the steps are rendered */
    this.container = Ext.create('Ext.panel.Panel' , {
        layout: {
            type: 'hbox',
            pack: 'center'
        }, 
        height : this.height,
        width : this.width,
        cls : 'border-grid',
        items : []}
    );

	this.panel =  Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        width : 100,
        height : this.height + 200,
        // cls : 'border-grid',
        items : [
                    this.getToolBar(), this.container,  this.getButtons()
        ]
	});

    this.panel.on('boxready', function() {
        $('#next-button').unbind('click').click(function (sender){
            if (_this.currentStep < 4) {
                _this.changeStep(1);
            }
        });
        $('#previous-button').unbind('click').click(function (sender){
            if (_this.currentStep > 0) {
                _this.changeStep(-1);             
            }
        });
        $('.step-btn').unbind('click').click(function (sender){
            if(sender.target.getAttribute("disabled") != "disabled"){
                if (_this.loadSampleChangerView.sampleChangerWidget){
                    _this.storeSampleChangerWidget(_this.loadSampleChangerView.sampleChangerWidget);
                }
                var direction = Number(sender.target.innerHTML) - _this.currentStep;
                _this.changeStep(direction);
            }
        });
        _this.manageStepButtons();
        _this.manageButtons();
    });
        

    return this.panel;
};

/**
* Returns the toolbar containing the steps of the prepare experiment process.
*
* @method getToolBar
* @return The toolbar html containing the steps of the prepare experiment process
*/
PrepareMainViewTest.prototype.getToolBar = function () {
    var html = "";
	dust.render("toolbar.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html};
};

/**
* Returns the buttons next and previous of the prepare experiment process.
*
* @method getButtons
* @return The buttons html of the prepare experiment process.
*/
PrepareMainViewTest.prototype.getButtons = function () {
    var html = "";
	dust.render("buttons.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html, margin : 10};
}

/**
* Loads the container according to the current step.
*
* @method load
* @return 
*/
PrepareMainViewTest.prototype.load = function() {
    var _this = this; 
    this.panel.setTitle("Prepare Experiment");
    this.container.removeAll();

    if (this.currentStep == 1) {
        _this.container.add(_this.dewarListSelector.getPanel());
        _this.dewarListSelector.panel.setLoading();
        var onSuccessProposal = function(sender, containers) {        
            _this.containers = containers;
            _this.dewarListSelector.load(containers);
            _this.dewarListSelector.panel.setLoading(false);
        };

        var onError = function(sender, error) {        
            EXI.setError("Ops, there was an error");
            _this.dewarListSelector.panel.setLoading(false);
        };
        
        EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
    } else if (this.currentStep == 2){
        this.container.add(this.sampleChangerSelector.getPanel());
        this.sampleChangerSelector.panel.setLoading();

        var onSuccessProposal = function(sender, containers) { 
            _this.containers = containers;
            var beamlinesSelected = _.uniq(_.map(_.filter(_this.containers, function(e){return e.shippingStatus == "processing";}),'beamlineName'));

            if (beamlinesSelected.length > 1) {
                $.notify("Warning: Multiple beamlines selected", "warn");
            } else if (beamlinesSelected.length == 1) {
                _this.sampleChangerSelector.selectRowByBeamlineName(beamlinesSelected[0]);
            }

            _this.sampleChangerSelector.panel.setLoading(false);
        };

        var onError = function(sender, error) {        
            EXI.setError("Ops, there was an error");
            _this.sampleChangerSelector.panel.setLoading(false);
        };
        
        EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
    } else if (this.currentStep == 3) {
        this.container.add(this.loadSampleChangerView.getPanel());
        this.loadSampleChangerView.containerListEditor.loadProcessingDewars();
    }
};

/**
* Takes care of deselecting a row in the loading step.
*
* @method deselectRow
* @return 
*/
PrepareMainViewTest.prototype.deselectRow = function () {
    this.loadSampleChangerView.containerListEditor.panel.getSelectionModel().deselectAll();
    this.selectedContainerId = null;
    this.selectedSampleCount = null;
    this.loadSampleChangerView.sampleChangerWidget.allowAllPucks();
}

/**
* Takes care of deselecting a puck in the loading step
*
* @method deselectPuck
* @return 
*/
PrepareMainViewTest.prototype.deselectPuck = function () {
    $("#" + this.selectedPuck.id).attr("class","puck");
    this.selectedPuck = null; 
};

/**
* Returns to the initial state
*
* @method returnToSelectionStatus
* @return 
*/
PrepareMainViewTest.prototype.returnToSelectionStatus = function () {
    this.deselectRow();
    if (this.selectedPuck) {
        this.deselectPuck();        
    }
    this.loadSampleChangerView.cleanPreviewPanel();
};

/**
* Draws the selected puck on the preview panel
*
* @method drawSelectedPuck
* @param {PuckWidget} puck The puck to be drawn
* @return 
*/
PrepareMainViewTest.prototype.drawSelectedPuck = function (puck) {
    var data = {
        puckType : 1,
        containerId : puck.containerId,
        mainRadius : 70,
        x : 130,
        y : 10,
        enableMouseOver : true
    };
    var puckContainer = new PuckWidgetContainer(data);
    if (puck.capacity == 10) {
        data.puckType = 2;
        puckContainer = new PuckWidgetContainer(data);
    }
    
    this.loadSampleChangerView.previewPuck(puckContainer, {
                info : [{
                    text : 'SC Location',
                    value : this.loadSampleChangerView.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id)
                }]
            }, "");
};

/**
* Draws the selected row in puck form on the preview panel
*
* @method drawSelectedPuckFromRecord
* @param {Integer} containerId The container Id of the container corresponding to the row selected
* @param {Integer} capacity The capacity of the container corresponding to the row selected
* @param {Integer} containerCode The container code of the row selected
* @return 
*/
PrepareMainViewTest.prototype.drawSelectedPuckFromRecord = function (record) {
    var _this = this;

    var containerId = record.get('containerId');
    var containerCode = record.get('containerCode');
    var capacity = record.get('capacity');
    var sampleChangerLocation = record.get('sampleChangerLocation');
    function onSuccess (sender, samples) {
        if (samples){
            var data = {
                puckType : 1,
                containerId : containerId,
                mainRadius : 70,
                x : 130,
                y : 10,
                enableMouseOver : true
            };
            var puckContainer = new PuckWidgetContainer(data);
            if (capacity == 10) {
                data.puckType = 2;
                puckContainer = new PuckWidgetContainer(data);
            }
            _this.loadSampleChangerView.previewPuck(puckContainer, {
                info : [{
                    text : 'Container',
                    value : containerCode
                },{
                    text : 'Container Id',
                    value : containerId
                },{
                    text : 'SC Location',
                    value : sampleChangerLocation
                }]
            }, "EMPTY");
            puckContainer.puckWidget.loadSamples(samples);
        }
    }

    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerId);
};

/**
* Takes care of the process when a puck is selected after clicking a row, loading that puck with the selected container
*
* @method loadSampleChangerPuck
* @param {PuckWidget} puck The puck of the sample changer widget to be loaded
* @param {Integer} containerId The container Id of the container to be loaded
* @return 
*/
PrepareMainViewTest.prototype.loadSampleChangerPuck = function (puck, containerId) {
    if (puck.isEmpty){
        this.returnToSelectionStatus();
        var location = this.loadSampleChangerView.sampleChangerWidget.convertIdToSampleChangerLocation(puck.id);
        this.loadSampleChangerView.containerListEditor.updateSampleChangerLocation(containerId,location);
    } else {
        $.notify("Error: choose an empty puck", "error");
    }
};

/**
* Saves a key-value pair on the session storage
*
* @method save
* @param {String} key The key of the key-value pair
* @param {String} value The value of the key-value pair
* @return 
*/
PrepareMainViewTest.prototype.save = function (key, value) {
    if (typeof(Storage) != 'undefined') {
        sessionStorage.setItem(key,value);
    }
}

/**
* Saves the puck data of a given sampleChangerWidget
*
* @method storeSampleChangerWidget
* @param sampleChangerWidget The sample changer to be stored
* @return 
*/
PrepareMainViewTest.prototype.storeSampleChangerWidget = function (sampleChangerWidget) {
    var puckData = sampleChangerWidget.getPuckData();
    this.save('puckData',JSON.stringify(puckData));
};