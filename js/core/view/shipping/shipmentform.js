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
	
	this.onSaved = new Event(this);
}

ShipmentForm.prototype.load = function(shipment,hasExportedData) {
	this.shipment = shipment;
	this.hasExportedData = hasExportedData;
	var _this = this;
	
	var toData = EXI.proposalManager.getLabcontacts();
	var fromData = $.extend(EXI.proposalManager.getLabcontacts(), [{ cardName : 'Same as for shipping to beamline', labContactId : -1}, { cardName : 'No return requested', labContactId : 0}]);

    var html = "";
	var beamlineName = "";
	var startDate = "";
	if (shipment){
		if (shipment.sessions.length > 0){
			beamlineName = shipment.sessions[0].beamlineName;
			startDate = moment(shipment.sessions[0].startDate).format("DD/MM/YYYY");
		}
	}
	
    dust.render("shipping.form.template", {id : this.id, to : toData, from : fromData, beamlineName : beamlineName, startDate : startDate, shipment : shipment}, function(err, out){
		html = out;
	});
	
    $('#' + _this.id).hide().html(html).fadeIn('fast');
	if (shipment == null || shipment.shippingStatus != "processing"){
		$("#" + _this.id + "-edit-button").prop('disabled',false);
		$("#" + _this.id + "-edit-button").unbind('click').click(function(sender){
			_this.edit();
		});
		if (!this.hasExportedData){
			$("#" + _this.id + "-remove-button").removeClass('disabled');
			$("#" + _this.id + "-remove-button").unbind('click').click(function(sender){
				alert("Not implemented");
			});
		}
	}

	this.panel.doLayout();

	this.attachCallBackAfterRender();

};

ShipmentForm.prototype.getPanel = function() {

	this.panel = Ext.create("Ext.panel.Panel",{
		layout : 'fit',
		items :	[{
					// cls	: 'border-grid',
                    html : '<div id="' + this.id + '"></div>',
                    autoScroll : false,
					// margin : 10,
					padding : this.padding,
					width : this.width
                }]
	});

	return this.panel;
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
			_this.panel.doLayout();
		});
    };
    var timer3 = setTimeout(tabsEvents, 500, this);
}