function PrepareMainViewTest() {
	this.icon = '../images/icon/contacts.png';
	this.queueGridList = [];
    
	MainView.call(this);
    
    var _this = this;
    
    this.dewarListSelector = new DewarListSelectorGridTest({height : 600});
    this.sampleChangerSelector = new SampleChangerSelector();
    this.loadShipmentView = new LoadShipmentView();
    this.confirmShipmentView = new ConfirmShipmentView();

    this.dewarListSelector.onSelect.attach(function(sender, dewar){                       
            if (dewar.shippingStatus == "processing"){
                _this.updateStatus(dewar.shippingId, "at_ESRF");
            } 
            if (dewar.shippingStatus != "processing"){
                _this.updateStatus(dewar.shippingId, "processing");
            }      
     });
     
    this.dewarListSelector.onSelectionChange.attach(function(sender, dewars){
    });
    
    this.currentStep = 1;
    if (typeof(Storage) != "undefined") {
        if (sessionStorage.getItem('currentStep')) {
            this.currentStep = Math.min(sessionStorage.getItem('currentStep'),3);
        }
    }
    

    this.selectedContainerId = null;
    this.selectedContainerCapacity = null;
    this.selectedPuck = null;
    this.sampleChangerName = null;

    this.sampleChangerSelector.onSampleChangerSelected.attach(function(sender,changerName){
        $('#next-button').attr("disabled", false);
        _this.sampleChangerName = changerName;
        _this.save('sampleChangerName', changerName);
        if (typeof(Storage) != "undefined") {
            sessionStorage.removeItem('puckData');
        }
        var data = {
            radius : 143,
            isLoading : false
        };
        if (changerName == "FlexHCD") {
            _this.loadShipmentView.sampleChangerWidget = new FlexHCDWidget(data);
        } else if (changerName == "SC3Widget") {
            _this.loadShipmentView.sampleChangerWidget = new SC3Widget(data);
        }
        _this.loadShipmentView.sampleChangerWidget.onPuckSelected.attach(function(sender, puck){
            _this.loadShipmentView.onPuckSelected.notify(puck);
        });
    });

    this.loadShipmentView.onSelectRow.attach(function(sender, row){
        if (row) {
            if (_this.selectedPuck){
                _this.deselectPuck();
            }
            if (_this.selectedContainerId) {
                if (_this.selectedContainerId == row.get('containerId')){
                    _this.deselectRow();
                    _this.loadShipmentView.previewPanelView.clean();
                } else {
                    _this.deselectRow();
                    _this.setSelectedRow(row);
                }
            } else {
                _this.setSelectedRow(row);
            }
        }
	});

    this.loadShipmentView.onPuckSelected.attach(function(sender, puck){
        if (_this.selectedPuck) {
            if (_this.selectedPuck == puck) {
                _this.deselectPuck();
                _this.loadShipmentView.previewPanelView.clean();
            } else {
                _this.deselectPuck();
                _this.setSelectedPuck(puck);
            }
        } else {
            _this.setSelectedPuck(puck);
        }
	});

    this.loadShipmentView.onLoadButtonClicked.attach(function(sender){
        _this.loadShipment(_this.selectedPuck, _this.selectedContainerId);
    });

    this.loadShipmentView.onEmptyButtonClicked.attach(function(sender){
        _this.selectedPuck.emptyAll();
        _this.drawSelectedPuck(_this.selectedPuck);
        _this.storeSampleChangerWidget(_this.loadShipmentView.sampleChangerWidget);
    });

}

PrepareMainViewTest.prototype.setSelectedRow = function (row) {
    this.loadShipmentView.containerListEditor.panel.getSelectionModel().select(this.loadShipmentView.containerListEditor.store.indexOf(row));
    this.selectedContainerId = row.get('containerId');
    this.selectedContainerCapacity = row.get('capacity');
    this.drawSelectedPuckFromRow(this.selectedContainerId, this.selectedContainerCapacity, row.get('containerCode'));
    this.loadShipmentView.sampleChangerWidget.disablePucksOfDifferentCapacity(this.selectedContainerCapacity);
}

PrepareMainViewTest.prototype.setSelectedPuck = function (puck) {
    this.selectedPuck = puck;
    if (this.selectedContainerId){
        this.loadShipment(puck, this.selectedContainerId);
    } else {
        $("#" + puck.id).attr("class","puck-selected");
        this.drawSelectedPuck(puck);
    }
}

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

PrepareMainViewTest.prototype.getPanel = function() {
    var _this = this;

    this.container = Ext.create('Ext.panel.Panel' , {
        items : []
    });

	this.panel =  Ext.create('Ext.panel.Panel', {
            items : [
                        this.getToolBar(), this.container,  this.getButtons()
            ]
	});

    this.panel.on('boxready', function() {
        if (_this.currentStep == 1) {
            $('#previous-button-div').hide();
        }
        if (_this.currentStep == 2) {
            $('#next-button').attr("disabled", true);
        }
        if (_this.currentStep < 4) {        
            $('#done-button-div').hide();
        }
        if (_this.currentStep == 4) {
            $('#next-button-div').hide();
        }
        $('#next-button').unbind('click').click(function (sender){
            if (_this.currentStep < 4) {
                $('#step-' + _this.currentStep).removeClass('active-step');
                $('#step-' + _this.currentStep).attr("disabled", "disabled");
                if (_this.currentStep == 1) {
                    _this.save('containers',JSON.stringify(_this.containers));
                    $('#next-button').attr("disabled", true);
                }
                _this.currentStep++;
                if (_this.currentStep > 1) {
                    $('#previous-button-div').show();
                }
                if (_this.currentStep == 4) {
                    $('#next-button-div').hide();
                    $('#done-button-div').show();
                }
                $('#step-' + _this.currentStep).addClass('active-step');
                $('#step-' + _this.currentStep).attr("disabled", false);
                _this.container.removeAll();
                _this.reload();
                _this.save('currentStep',_this.currentStep);
            }
        });
        $('#previous-button').unbind('click').click(function (sender){
            if (_this.currentStep > 0) {
                $('#step-' + _this.currentStep).removeClass('active-step');
                $('#step-' + _this.currentStep).attr("disabled", "disabled");
                _this.currentStep--;
                if (_this.currentStep < 4) {
                    $('#next-button-div').show();
                    $('#done-button-div').hide();
                }
                if (_this.currentStep == 1) {
                    $('#previous-button-div').hide();
                    $('#next-button').attr("disabled", false);                        
                }
                if (_this.currentStep == 2) {
                    $('#next-button').attr("disabled", true);                        
                }
                $('#step-' + _this.currentStep).addClass('active-step');
                $('#step-' + _this.currentStep).attr("disabled", false);
                _this.container.removeAll();
                _this.reload();
                _this.save('currentStep',_this.currentStep);   
                if (_this.currentStep == 3) {
                    _this.storeSampleChangerWidget(_this.confirmShipmentView.sampleChangerWidget);
                    _this.checkStoreData();                    
                }             
            }
        });
        $('#done-button').unbind('click').click(function (sender){
            _this.confirmShipmentView;
            debugger
        });
        for (var i = 1 ; i <= 4 ; i++){
            if (i == _this.currentStep){
                $('#step-' + i).addClass('active-step');
            } else {
                $('#step-' + i).attr("disabled", true);
            }
        }
        _this.reload();
        _this.checkStoreData();
    });
        

    return this.panel;
};

PrepareMainViewTest.prototype.getToolBar = function () {
    var html = "";
	dust.render("toolbar.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html};
}

PrepareMainViewTest.prototype.getButtons = function () {
    var html = "";
	dust.render("buttons.prepare.template", [], function(err, out){
		html = out;
	});

    return {html : html};
}


PrepareMainViewTest.prototype.load = function() {
    var _this = this;
    _this.panel.setTitle("Prepare Experiment");
};

PrepareMainViewTest.prototype.reload = function() {
    var _this = this;
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
    } else if (this.currentStep == 3) {
        this.container.add(this.loadShipmentView.getPanel());
        if (this.containers == null) {
            if (typeof(Storage) != "undefined"){
                this.containers = JSON.parse(sessionStorage.getItem('containers'));
            }
        }
        this.loadShipmentView.containerListEditor.load(_.filter(this.containers, function(e){return e.shippingStatus == "processing";}));        
    } else if (this.currentStep == 4) {
        this.container.add(this.confirmShipmentView.getPanel());
        if (this.loadShipmentView.sampleChangerWidget) {
            this.confirmShipmentView.loadSampleChanger(this.loadShipmentView.sampleChangerWidget.name,this.loadShipmentView.sampleChangerWidget.getPuckData());
        }
    }
}

PrepareMainViewTest.prototype.checkStoreData = function () {
    if (typeof(Storage) != "undefined"){
            var sampleChangerName = sessionStorage.getItem('sampleChangerName');
            if (sampleChangerName) {
                var puckData = JSON.parse(sessionStorage.getItem('puckData'));
                if (puckData) {
                    this.loadShipmentView.sampleChangerWidget.load(puckData);
                }
            }
            if (this.currentStep == 3){
                this.loadShipmentView.containerListEditor.load(_.filter(this.containers, function(e){return e.shippingStatus == "processing";}));
            }
    }
}

PrepareMainViewTest.prototype.deselectRow = function () {
    this.loadShipmentView.containerListEditor.panel.getSelectionModel().deselectAll();
    this.selectedContainerId = null;
    this.selectedSampleCount = null;
    this.loadShipmentView.sampleChangerWidget.allowAllPucks();
}

PrepareMainViewTest.prototype.deselectPuck = function () {
    $("#" + this.selectedPuck.id).attr("class","puck");
    this.selectedPuck = null; 
}

PrepareMainViewTest.prototype.returnToSelectionStatus = function () {
    this.deselectRow();
    if (this.selectedPuck) {
        this.deselectPuck();        
    }
}

PrepareMainViewTest.prototype.drawSelectedPuck = function (puck) {
    var data = {
        puckType : 1,
        containerId : puck.containerId,
        mainRadius : 100,
        x : 100,
        y : 10,
        enableMouseOver : true
    };
    var puckContainer = new PuckWidgetContainer(data);
    if (puck.capacity == 10) {
        data.puckType = 2;
        puckContainer = new PuckWidgetContainer(data);
    }
    
    this.loadShipmentView.previewPanelView.loadPuck(puckContainer, {
                info : [{
                    text : 'SC Location',
                    value : puck.id.substring(puck.id.indexOf('-')+1)
                }]
            }, false, puck.isEmpty);

    puckContainer.puckWidget.load(puck.data.cells);
}

PrepareMainViewTest.prototype.drawSelectedPuckFromRow = function (containerId, capacity, containerCode) {
    var _this = this;
    function onSuccess (sender, samples) {
        if (samples){
            var data = {
                puckType : 1,
                containerId : containerId,
                mainRadius : 100,
                x : 100,
                y : 10,
                enableMouseOver : true
            };
            var puckContainer = new PuckWidgetContainer(data);
            if (capacity == 10) {
                data.puckType = 2;
                puckContainer = new PuckWidgetContainer(data);
            }
            _this.loadShipmentView.previewPanelView.loadPuck(puckContainer, {
                info : [{
                    text : 'Container',
                    value : containerCode
                },{
                    text : 'Container Id',
                    value : containerId
                }]
            }, true);
            puckContainer.puckWidget.loadSamples(samples);
        }
    }

    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerId);
}

PrepareMainViewTest.prototype.loadShipment = function (puck, containerId) {
    var _this = this;
    function onSuccess (sender, samples) {
        if (samples) {
            puck.emptyAll();
            puck.loadSamples(samples);
        }
        _this.returnToSelectionStatus();
        _this.setSelectedPuck(puck);
        // _this.loadShipmentView.previewPanelView.setEmptyButton();
        _this.storeSampleChangerWidget(_this.loadShipmentView.sampleChangerWidget);
    }

    EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByContainerId(containerId);
}

PrepareMainViewTest.prototype.save = function (key, value) {
    if (typeof(Storage) != 'undefined') {
        sessionStorage.setItem(key,value);
    }
}

PrepareMainViewTest.prototype.storeSampleChangerWidget = function (sampleChangerWidget) {
    var puckData = sampleChangerWidget.getPuckData();
    this.save('puckData',JSON.stringify(puckData));
}