
/**
* This main class deals with the creation and edition of shipments
*
* @class ShippingMainView
* @constructor
*/
function ShippingMainView_A() {
	MainView.call(this);
	var _this = this;

    /**
	* 
	* @property shipmentForm
	*/
    this.shipmentForm = new ShipmentForm({width : Ext.getBody().getWidth() - 200});
	this.shipmentForm.onSaved.attach(function(sender, shipment){
		location.hash = "#/proposal/shipping/nav?nomain";
	});

    /**
	* 
	* @property parcelGrid
	*/
	this.parcelGrid = new ParcelGrid({height : 580, width : Ext.getBody().getWidth() - 200});
	
}

ShippingMainView.prototype.getPanel = function() {
	
    this.panel =  Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'vbox',
            align: 'center'
        },
        cls : 'border-grid',
        items : [
                    this.shipmentForm.getPanel(),
                    this.parcelGrid.getPanel()
        ]
	});

    return this.panel;
};


ShippingMainView.prototype.load = function(shippingId) {
	var _this = this;
	this.shippingId = shippingId;
	
	this.panel.setTitle("Shipment");
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){
			_this.shipmentForm.load(shipment);
			_this.parcelGrid.load(shipment);
			_this.panel.setLoading(false);
		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
	}
};