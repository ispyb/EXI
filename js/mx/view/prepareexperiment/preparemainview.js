/**
* This class renders the steps and panels of every class used in the prepare experiment tab
*
* @class PrepareMainView
* @constructor
*/
function PrepareMainView(args) {
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
    
    this.dewarListSelector = new DewarListSelectorGrid({height : this.height - 12, width : this.width - 60});
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

};


/**
* Stores on the DB the status given a shippingId
* Status may be : [at_ESRF, processing, opened, ready to go]
*
* @method updateStatus
* @return 
*/
PrepareMainView.prototype.updateStatus = function(shippingId, status) {
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
PrepareMainView.prototype.manageButtons = function () {
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
PrepareMainView.prototype.changeStep = function (direction) {
    this.currentStep += direction;
    location.href = "#/mx/prepare/main" + this.steps[this.currentStep-1];
};

/**
* Manages the disable state of the step buttons
*
* @method manageStepButtons
* @return 
*/
PrepareMainView.prototype.manageStepButtons = function () {
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
PrepareMainView.prototype.getPanel = function() {
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

	this.panel = Ext.create('Ext.panel.Panel', {
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
PrepareMainView.prototype.getToolBar = function () {
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
PrepareMainView.prototype.getButtons = function () {
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
PrepareMainView.prototype.load = function() {
    var _this = this; 
    $('.notifyjs-corner').empty();    
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
                if (EXI.credentialManager.getBeamlineNames().indexOf(beamlinesSelected[0]) >= 0){
                    _this.sampleChangerSelector.selectRowByBeamlineName(beamlinesSelected[0]);
                } else {
                    $.notify("Warning: Unknown beamline", "warn");
                }
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
        this.loadSampleChangerView.load();
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
PrepareMainView.prototype.save = function (key, value) {
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
PrepareMainView.prototype.storeSampleChangerWidget = function (sampleChangerWidget) {
    var puckData = sampleChangerWidget.getPuckData();
    this.save('puckData',JSON.stringify(puckData));
};