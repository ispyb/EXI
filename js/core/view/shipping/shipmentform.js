/**
 * Same form as MX part
 * 
 * @creationMode if true a create button appears instead of save
 * @showTitle true or false
 */
function ShipmentForm(args) {
	this.id = BUI.id();
	this.width = 600;

	if (args != null) {
		if (args.creationMode != null) {
			this.creationMode = args.creationMode;
		}
		if (args.width != null) {
			this.width = args.width;
		}
	}
	
	this.onSaved = new Event(this);
}

ShipmentForm.prototype.fillStores = function() {
	this.panel.setLoading("Loading Labcontacts from database");
	var labContacts = EXI.proposalManager.getLabcontacts();

	this.labContactForSendingStore.loadData(labContacts, false);

	labContacts.sort(function(a, b){
	    if(a.cardName < b.cardName) {return -1;}
	    if(a.cardName > b.cardName) {return 1;}
	    return 0;
	});
	
	$.extend(labContacts, [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);
	this.labContactForReturnStore.loadData(labContacts, false);

	this.labContactsReturnCombo.setValue(-1);

	this.panel.setLoading(false);
	if (this.shipment != null) {
		this.setShipment(this.shipment);
	}
};

ShipmentForm.prototype.draw = function(targetId) {
	this.getPanel().render(targetId);
};

ShipmentForm.prototype.load = function(shipment) {
	this.shipment = shipment;
	var _this = this;
	Ext.getCmp(_this.id + "shippingName").setValue(shipment.shippingName);
	Ext.getCmp(_this.id + "comments").setValue(shipment.comments);
	if (shipment.sendingLabContactVO != null) {
		this.labContactsSendingCombo.setValue(shipment.sendingLabContactVO.labContactId);
	}

	
	if (shipment.returnLabContactVO == null) {
		this.labContactsReturnCombo.setValue(0);
	}
	else{
		if (shipment.returnLabContactVO.labContactId == shipment.sendingLabContactVO.labContactId){
			this.labContactsReturnCombo.setValue(-1);
		}
		else{
			this.labContactsReturnCombo.setValue(shipment.returnLabContactVO.labContactId);
		}
	}
	
	if (shipment.sessions != null){
		if (shipment.sessions.length > 0){
			var session = shipment.sessions[0];
			this.sessionComboBox.setValue(session.sessionId);
		}
	}

};

ShipmentForm.prototype._saveShipment = function() {
	var _this = this;
	var shippingId = null;
	
	if (this.shipment != null) {
		shippingId = this.shipment.shippingId;
	}
	
	var sendingAddressId = this.labContactsSendingCombo.getValue();
	var returnAddressId = this.labContactsReturnCombo.getValue();
	
	if (sendingAddressId == null) {
		BUI.showError("User contact information for shipping to beamline is mandatory");
		return;
	}

		
	/** No return requested **/
	if (this.labContactsReturnCombo.getValue() == 0){
		returnAddressId = 0;
	}
	
	/** Same sender **/
	if (this.labContactsReturnCombo.getValue() == -1){
		returnAddressId = -1;
	}

	var sendingAddress = (EXI.proposalManager.getLabcontactById(sendingAddressId));
	var json = {
		shippingId : shippingId,
		name : Ext.getCmp(_this.id + "shippingName").getValue(),
		status : "Not set",
		sendingLabContactId : sendingAddressId,
		returnLabContactId : returnAddressId, 
		returnCourier : returnAddressId,
		courierAccount : sendingAddress.courierAccount,
		billingReference : sendingAddress.billingReference,
		dewarAvgCustomsValue : sendingAddress.dewarAvgCustomsValue,
		dewarAvgTransportValue :sendingAddress.dewarAvgTransportValue,
		comments : Ext.getCmp(_this.id + "comments").getValue(),
		sessionId : this.sessionComboBox.getValue()
	};

	var onSuccess = function(sender, shipment) {
		location.hash = "#/shipping/" + shipment.shippingId + "/main";
		_this.panel.setLoading(false);
		_this.onSaved.notify(shipment);
	};


	/** Cheking params **/
	if (json.name == "") {
		BUI.showError("Name field is mandatory");
		return;
	}

	if (json.sendingLabContactId == null) {
		BUI.showError("Lab contact for sending field is mandatory");
		return;
	}

	
	this.panel.setLoading();
	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.saveShipment(json);
	
	
};

ShipmentForm.prototype.getPanel = function() {
	var _this = this;
	var required = '<span style="color:red;font-weight:bold" data-qtip="Required">*</span>';
	var buttons = [];

	if (_this.creationMode) {
		buttons.push({
			text : 'Create',
			scope : this,
			handler : function() {
				_this._saveShipment();
			}
		});
	} else {
		buttons.push({
			text : 'Save',
			scope : this,
			handler : function() {
				_this._saveShipment();
			}
		});

	}

	this.labContactForSendingStore = Ext.create('Ext.data.Store', {
		fields : [ 'cardName', 'labContactId' ],
		sorters : 'cardName'
	});

	this.labContactForReturnStore = Ext.create('Ext.data.Store', {
		fields : [ 'cardName', 'labContactId' ]
		
	});

	this.labContactsSendingCombo = Ext.create('Ext.form.ComboBox', {
		id : _this.id + "shipmentform_sendingLabContactId",
		fieldLabel : 'Shipping Card to ESRF',
		afterLabelTextTpl : required,
		store : this.labContactForSendingStore,
		queryMode : 'local',
		labelWidth : 200,
		width : 600,
		margin : '10 0 0 10',
		displayField : 'cardName',
		valueField : 'labContactId'
	});

	this.labContactsReturnCombo = Ext.create('Ext.form.ComboBox', {
		id : _this.id + "returnLabContactId",
		fieldLabel : 'Shipping Card to HOME',
		afterLabelTextTpl : required,
		store : this.labContactForReturnStore,
		queryMode : 'local',
		margin : '10 0 0 10',
		labelWidth : 200,
		width : 600,
		displayField : 'cardName',
		valueField : 'labContactId'
	});

	
    this.sessionComboBox =  BIOSAXS_COMBOMANAGER.getComboSessions(EXI.proposalManager.getSessions(), {margin: '10 0 0 10', width: 400, labelWidth: 200});

	if (this.panel == null) {
		this.panel = Ext.create('Ext.form.Panel', {
			layout: 'hbox',
			width : this.width,
			margin : 10,
			bodyPadding : 5,
			cls : 'border-grid',
			buttons : buttons,
			items : [ 
						{
							xtype : 'container',
							layout: 'vbox',
							items: [
										{
												xtype : 'requiredtextfield',
												fieldLabel : 'Name',
												allowBlank : false,
												labelWidth : 200,
												width : 400,
												margin : "10 20 0 10",
												name : 'shippingName',
												id : _this.id + 'shippingName',
												value : '',
										},
										this.sessionComboBox
							]
						},
					    {
		    					xtype : 'textareafield',
		    					name : 'comments',
		    					id : _this.id + 'comments',
		    					fieldLabel : 'Comments',
		    					value : '',
		    					labelWidth : 200,
		    					margin : "10 20 0 10",
		    					width : 500,
						},
						{
							xtype : 'container',
							layout: 'vbox',
							items: [
										this.labContactsSendingCombo,
										this.labContactsReturnCombo
							]
						}
		]
		});
	}
	this.fillStores();
	return this.panel;
};

