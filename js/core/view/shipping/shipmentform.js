/**
 * Same form as MX part
 * 
 * @creationMode if true a create button appears instead of save
 * @showTitle true or false
 */
function ShipmentForm(args) {
	this.id = BUI.id();
	this.width = 600;
	this.padding = 10;

	if (args != null) {
		if (args.creationMode != null) {
			this.creationMode = args.creationMode;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}

	var _this = this;

	this.dewarTrackingView = new DewarTrackingView();
	this.dewarTrackingView.onLoaded.attach(function(sender){
		_this.panel.doLayout();
	});
	
	this.fedexCode = "fedexCode";
	
	this.onSaved = new Event(this);
	this.refresh = new Event(this);
	this.openedStatus = "opened";
	this.sentToUserStatus = "sent to User";
	this.sentToUserStatus2 = "Sent_to_User"
	this.sentToFacilityStatus = "sent to " +EXI.credentialManager.getSiteName();
	this.sentToFacilityStatus2 = "Sent_to_" +EXI.credentialManager.getSiteName();
	this.atFacilityStatus = "at " +EXI.credentialManager.getSiteName();
	this.atFacilityStatus2 = "at_" +EXI.credentialManager.getSiteName();
	this.processingStatus = "processing";
}



ShipmentForm.prototype.hasDataCollections = function(shipment) {
    var _this = this;

    var onSuccess = function(sender, shipments) {
        if (shipments.length > 0){
            return true;
        } else {
            return false;
        }
    };
    var onError = function(data){
            EXI.setError(data);
            // cannot be deleted, an error occurred
            return true;
    };

    EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.shipping.getDataCollections(shipment.shippingId);
}

ShipmentForm.prototype.load = function(shipment,hasExportedData) {
	
	var _this = this;
	this.shipment = shipment;
	this.hasExportedData = hasExportedData;
	var toData = EXI.proposalManager.getLabcontacts();
	var fromData = $.extend(EXI.proposalManager.getLabcontacts(), [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);

    var html = "";
	var beamlineName = "";
	var startDate = "";
	var reimbText = "";
	var fedexCode = "";
	var nbReimbDewars = 0;	


	var hidePrintLabelWarning = !((shipment.dewarVOs.length == 0 || _.filter(shipment.dewarVOs, function(o){return o.dewarStatus == null}).length > 0));
	
	if (shipment){
		if (shipment.sessions.length > 0){
			beamlineName = shipment.sessions[0].beamlineName;
			nbReimbDewars = shipment.sessions[0].nbReimbDewars;
			startDate = moment(shipment.sessions[0].startDate).format("DD-MM-YYYY");			
			fedexCode = shipment.sessions[0].proposalVO.code + "-" + shipment.sessions[0].proposalVO.number + "/" + beamlineName+ "/" + startDate;
		}
	}

	/** It disables button Sent Shipment to facility if there is at least one dewar which dewarStatus is not "ready to go"  */	
	if (shipment.dewarVOs.length == 0 || _.filter(shipment.dewarVOs, function(o){return o.dewarStatus != "ready to go"}).length > 0){
		$("#" + _this.id + "-send-button").addClass("disabled");
	}
	else{
		$("#" + _this.id + "-send-button").removeClass("disabled");
	}
	var warningProcessingLabel = "";
	var statusButtonLabel = "Send shipment to the facility";
    if (EXI.credentialManager.getCredentials()[0].isManager() && shipment != null){
        if (shipment.shippingStatus == _this.sentToFacilityStatus || shipment.shippingStatus == _this.sentToFacilityStatus2){
            statusButtonLabel = "Mark shipment at facility";
        } else if (shipment.shippingStatus == _this.processingStatus){
            statusButtonLabel = "Mark shipment at facility";
            warningProcessingLabel = "The shipment and all its contents cannot be modified while it's in 'Processing' status";
        } else if (shipment.shippingStatus == _this.atFacilityStatus || shipment.shippingStatus == _this.atFacilityStatus2){
            statusButtonLabel = "Send shipment to the user";
        } /*else if (shipment.shippingStatus == _this.sentToUserStatus || shipment.shippingStatus == _this.sentToUserStatus2){
            $("#" + _this.id + "-send-button").addClass("disabled");
            $("#" + _this.id + "-send-button").removeClass("enabled");
        }*/
    }

    dust.render("shipping.form.template", {id : this.id, to : toData, 
		from : fromData, beamlineName : beamlineName, 
		startDate : startDate, shipment : shipment, 
		nbReimbDewars : nbReimbDewars, 
		reimbText : reimbText,
		hidePrintLabelWarning : hidePrintLabelWarning,
		statusButtonLabel: statusButtonLabel,
		warningProcessingLabel: warningProcessingLabel,
		fedexCode : fedexCode}, function(err, out){
		html = out;
	});
	
    $('#' + _this.id).hide().html(html).fadeIn('fast');
	if (shipment == null || shipment.shippingStatus != this.processingStatus){
		$("#" + _this.id + "-edit-button").removeClass("disabled");
		$("#" + _this.id + "-edit-button").unbind('click').click(function(sender){
			_this.edit();
		});

        // Only the manager can delete a shipment if is not processing or has datacollection associated to it
		$("#" + _this.id + "-delete-button").addClass("disabled");
		if (EXI.credentialManager.getSiteName().startsWith("MAXIV") && EXI.credentialManager.getCredentials()[0].isManager()){
		    if (!this.hasDataCollections(shipment) && shipment.shippingStatus != this.processingStatus){
		        $("#" + _this.id + "-delete-button").removeClass("disabled");
		    }
		}

		$("#" + _this.id + "-delete-button").unbind('click').click(function(sender){
            _this.delete();
        });
	
	}

	$("#" + _this.id + "-send-button").unbind('click').click(function(sender){

        if (_this.shipment != null){
            if (_this.shipment.shippingStatus == _this.openedStatus){
                _this.updateStatus(_this.shipment.shippingId, _this.sentToFacilityStatus);
            } else {
                if (EXI.credentialManager.getCredentials()[0].isManager()){
                    if (_this.shipment.shippingStatus == _this.sentToFacilityStatus || _this.shipment.shippingStatus == _this.sentToFacilityStatus2){
                        _this.updateStatus(_this.shipment.shippingId, _this.atFacilityStatus);
                    } else if (_this.shipment.shippingStatus == _this.processingStatus){
                        _this.updateStatus(_this.shipment.shippingId, _this.atFacilityStatus);
                    } else if (_this.shipment.shippingStatus == _this.atFacilityStatus || _this.shipment.shippingStatus == _this.atFacilityStatus2){
                        _this.updateStatus(_this.shipment.shippingId, _this.sentToUserStatus);
                    }
                }
            }
        }
	});

	/** It disables button Sent Shipment to facility if there is at least one dewar which dewarStatus is not "ready to go"  */
	if (!hidePrintLabelWarning){
		$("#" + _this.id + "-send-button").addClass("disabled");
	}/*
	else {
		$("#" + _this.id + "-send-button").removeClass("disabled");
	}*/



	$("#transport-history-" + this.id).html(this.dewarTrackingView.getPanel());

	this.panel.doLayout();
	this.attachCallBackAfterRender();
};

ShipmentForm.prototype.updateStatus = function(shippingId, status) {
    var _this = this;
    //_this.panel.setLoading("Updating shipment Status");
    var onStatusSuccess = function(sender, dewar) { 						
			_this.refresh.notify(_this.shipment.shippingId);
    };
    var onError = function(data){
            EXI.setError(data);
    };
    
    EXI.getDataAdapter({onSuccess : onStatusSuccess, onError : onError}).proposal.shipping.updateStatus(shippingId,status);
};

ShipmentForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		layout : 'fit',
		cls	: 'overflowed overflowed-cascade',

		items :	[{
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					// margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
};

ShipmentForm.prototype.delete = function() {

    var _this = this;
    var onDeleteSuccess = function() {
        if (EXI.credentialManager.getCredentials() != null){
            if (EXI.credentialManager.getCredentials().length > 0){
                var username = EXI.credentialManager.getCredentials()[0].username;
                var credential = EXI.credentialManager.getCredentialByUserName(username);
                if (credential.isManager()){
                    location.hash = "/welcome/manager/" + username + "/main";
                }
                else{
                    location.hash = "/welcome/user/" + username + "/main";
                }
            }
            else{
                BUI.showError("You should sign up");
            }
        }

    };
    var onError = function(data){
        EXI.setError(data);
    };
    if (_this.shipment){
        EXI.getDataAdapter({onSuccess : onDeleteSuccess, onError : onError}).proposal.shipping.removeShipment(_this.shipment);
    }

};

ShipmentForm.prototype.edit = function(dewar) {
	var _this = this;
	var shippingEditForm = new ShipmentEditForm();
	
	shippingEditForm.onSaved.attach(function (sender, shipment) {
		if (_this.shipment) {
			_this.load(shipment);
		} else {
			_this.onSaved.notify(shipment);
		}
		window.close();
	});

	var window = Ext.create('Ext.window.Window', {
		title : 'Shipment',
		height : 450,
		width : 600,
		modal : true,
		layout : 'fit',
		items : [ shippingEditForm.getPanel() ],
		buttons : [ {
				text : 'Save',
				handler : function() {
					shippingEditForm.saveShipment();
				}
			}, {
				text : 'Cancel',
				handler : function() {
					window.close();
				}
			} ]
	}).show();

	shippingEditForm.load(this.shipment);
};

ShipmentForm.prototype.attachCallBackAfterRender = function () {

	var _this = this;
	var tabsEvents = function(grid) {
		this.grid = grid;
		$('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
			var target = $(e.target).attr("href");
			if (target.startsWith("#tr")){
				_this.dewarTrackingView.load(_this.shipment);
			}
			_this.panel.doLayout();
		});
    };
    var timer3 = setTimeout(tabsEvents, 500, this);
}