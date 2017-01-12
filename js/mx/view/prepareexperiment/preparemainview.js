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

    this.steps = ["","/loadSampleChanger"];

    this.height = 550;
    this.width = 1300;
    
    this.dewarListSelector = new DewarListSelectorGrid({height : this.height - 12, width : this.width - 60});
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
        Ext.getCmp("previous-button").hide();
        Ext.getCmp("next-button").enable(); 
    } else {
        Ext.getCmp("previous-button").show();
        Ext.getCmp("next-button").hide();
    }
    for (var i = 1 ; i <= 2 ; i++){
        if (i == this.currentStep) {
            $('#step-' + i).addClass('active-step');
        } else {
            $('#step-' + i).removeClass('active-step');
        }
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
        autoScroll : true,
        buttons : this.getButtons(),
        layout: {
            type: 'vbox',
            align: 'center'
        },
        width : 100,
        height : this.height + 200,
        // cls : 'border-grid',
        items : [
                    this.getToolBar(), this.container
        ]
	});

    this.panel.on('boxready', function() {
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
// PrepareMainView.prototype.getButtons = function () {
//     var html = "";
// 	dust.render("buttons.prepare.template", [], function(err, out){
// 		html = out;
// 	});

//     return {html : html, margin : 10};
// }

PrepareMainView.prototype.getButtons = function() {
	var _this = this;
    
	return [
			{
			    text: 'Previous',
			    cls : 'btn btn-lg btn-success',
                id : 'previous-button',
                margin : '0 0 0 300',
			    handler : function(){
			    	if (_this.currentStep > 0) {
                        _this.changeStep(-1);             
                    }
			    }
			},
	        "->",
	        {
			    text: 'Next',
			    cls : 'btn btn-lg btn-success',
                id : 'next-button',
                margin : '0 300 0 0',
			    handler : function(a,b,c){
			    	if (_this.currentStep < 4) {
                        _this.changeStep(1);
                    }
			    }
            }
	];
};

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
    } else if (this.currentStep == 2) {
        var onSuccessProposal = function(sender, containers) {     
            _this.containers = containers;
            var beamlinesSelected = _.uniq(_.map(_.filter(_this.containers, function(e){return e.shippingStatus == "processing";}),'beamlineLocation'));
            if (beamlinesSelected.length > 0) {
                var beamline = _.filter(EXI.credentialManager.getBeamlinesByTechnique("MX"),{"name":beamlinesSelected[0]});
                if (beamline.length > 0) {
                    _this.loadSampleChangerView.createSampleChangerWidget(beamline[0].sampleChangerType,beamline[0].name);
                } else {
                    $.notify("Warning: Unknown beamline " + beamlinesSelected[0], "warn");
                    _this.loadSampleChangerView.createSampleChangerWidget("FlexHCD",beamlinesSelected[0]);
                }
                for (var i = 1 ; i < beamlinesSelected.length ; i++){
                    var beamline = _.filter(EXI.credentialManager.getBeamlinesByTechnique("MX"),{"name":beamlinesSelected[i]});
                    if (beamline.length == 0) {
                        $.notify("Warning: Unknown beamline " + beamlinesSelected[i], "warn");
                    }
                }
            }
            _this.container.add(_this.loadSampleChangerView.getPanel());
            _this.loadSampleChangerView.load();
        };
        
        EXI.getDataAdapter({onSuccess : onSuccessProposal}).proposal.dewar.getDewarsByProposal();
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
* Removes a key-value pair on the session storage
*
* @method removeFromStorage
* @param {String} key The key of the key-value pair
* @return 
*/
PrepareMainView.prototype.removeFromStorage = function (key) {
    if (typeof(Storage) != 'undefined') {
        sessionStorage.removeItem(key);
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