function ShipmentEditForm(args) {
    this.id = BUI.id();

    this.width = 600;
    this.height = 200;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.height != null) {
			this.height = args.height;
		}
	}

	this.onSaved = new Event(this);
}

ShipmentEditForm.prototype.load = function(shipment) {

	this.shipment = shipment;
	var html = "";
	try{
		var fromData = EXI.proposalManager.getLabcontacts();
		var toData = $.extend(EXI.proposalManager.getLabcontacts(), [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);

		var beamlineName = "";
		var startDate = "";
		if (shipment){
			if (shipment.sessions.length > 0){
				beamlineName = shipment.sessions[0].beamlineName;
				startDate = (new Date(shipment.sessions[0].startDate)).toLocaleDateString();
			}
		}

		var sessionSort = function(o1,o2) {
			var d1 = new Date(o1.BLSession_startDate);
			var d2 = new Date(o2.BLSession_startDate);
			if (d1 === d2) {
				return 0;
			} else {
				return (d1 < d2) ? 1 : -1;
			}
		}
		var sessions = EXI.proposalManager.getSessions();
		sessions.sort(sessionSort);
		var sessionsSelectData = [];
		var currentDay = new Date((new Date()).toDateString());
		for (var i = 0 ; i < sessions.length ; i++){
			var session = sessions[i];
			var sessionStartDate = (new Date(session.BLSession_startDate));
			if (currentDay <= (new Date(sessionStartDate.toDateString())) ){
				var dd = sessionStartDate.getDate();
				var mm = sessionStartDate.getMonth()+1; //January is 0!
				var yyyy = sessionStartDate.getFullYear();
				if(dd<10){
					dd='0'+dd;
				} 
				if(mm<10){
					mm='0'+mm;
				} 
				var formattedDate = dd+'/'+mm+'/'+yyyy;
				sessionsSelectData.push({sessionId : session.sessionId, date : sessionStartDate.toLocaleDateString(), formattedDate : formattedDate, beamLineName : session.beamLineName});
			}
		}
		
		
		dust.render("shipping.edit.form.template", {id : this.id, sessions : sessionsSelectData, to : toData, from : fromData, beamlineName : beamlineName, startDate : startDate, shipment : shipment}, function(err, out){
			html = out;
		});
	} catch (e) {
		html = "There was an error loading the lab contacts.";
	}
	
	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
};

ShipmentEditForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					width : this.width
				}]
	});

	return this.panel;
};

ShipmentEditForm.prototype.saveShipment = function() {
	var _this = this;

	var sendingAddressId = $("#" + this.id + "-to").val();
	var returnAddressId = $("#" + this.id + "-from").val();

	var shippingId = null;
	if (this.shipment) {
		shippingId = this.shipment.shippingId;
	}
	
	if (sendingAddressId == null) {
		BUI.showError("User contact information for shipping to beamline is mandatory");
		return;
	}

	/** No return requested **/
	if (returnAddressId == "No return requested"){
		returnAddressId = 0;
	}
	
	/** Same sender **/
	if (returnAddressId == "Same as for shipping to beamline"){
		returnAddressId = -1;
	}
	
	var sendingAddress = (EXI.proposalManager.getLabcontactById(sendingAddressId));
	var json = {
		shippingId : shippingId,
		name : $("#" + this.id + "-name").val(),
		status : "Not set",
		sendingLabContactId : sendingAddressId,
		returnLabContactId : returnAddressId, 
		returnCourier : returnAddressId,
		courierAccount : sendingAddress.courierAccount,
		billingReference : sendingAddress.billingReference,
		dewarAvgCustomsValue : sendingAddress.dewarAvgCustomsValue,
		dewarAvgTransportValue :sendingAddress.dewarAvgTransportValue,
		comments : $("#" + this.id + "-comments").val(),
		sessionId : $("#" + this.id + "-date").val()
	};

	var onSuccess = function(sender, shipment) {
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
}