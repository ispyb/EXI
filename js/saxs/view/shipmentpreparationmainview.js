

function ShipmentPreparationMainView() {
	
	MainView.call(this);
	
	var _this = this;
	this.shipmentForm = new ShipmentForm();

	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
		//_this.tabPanel.setActiveTab(1);
		
	});
	this.caseGrid = new CaseGrid({
		height : 300
	});
	
	this.caseGrid.onRemove.attach(function(sender, dewar){
		var onSuccess = function(sender){
			_this.load(_this.shippingId);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess:onSuccess}).proposal.dewar.removeDewar(_this.shippingId, dewar.dewarId );
	});
}

ShipmentPreparationMainView.prototype.getPanel = MainView.prototype.getPanel;


ShipmentPreparationMainView.prototype.getContainer = function() {
	this.tabPanel =  Ext.createWidget('tabpanel',
			{
				margin : 10,
				defaults : {
						anchor : '100%'
				},
				items : [
				     	{
							tabConfig : {
								title : 'Delivery Details'
							},
							items : [ 
							         	this.shipmentForm.getPanel()
							]
						},
						{
							tabConfig : {
								id : this.id + "grid",
								title : 'Parcels',
								icon : '../images/icon/shipping.png'
							},
							items : [ 
							         	this.caseGrid.getPanel()
							]
						}
					]
			});

	return this.tabPanel;

};


ShipmentPreparationMainView.prototype.load = function(shippingId) {
	this.shippingId = shippingId;
	
	if (shippingId == null){
		Ext.getCmp(this.id + "grid").disable(true);
	}
	this.panel.setTitle("Shipment");
	var _this = this;
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipmentForm.load(shipment);
			_this.caseGrid.load(shipment);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
	}
};