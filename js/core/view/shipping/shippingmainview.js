
/**
* This main class deals with the creation and edition of shipments
*
* @class ShippingMainViewTest
* @constructor
*/
function ShippingMainView() {
	MainView.call(this);
	var _this = this;

    /**
	* 
	* @property shipmentForm
	*/
    this.shipmentForm = new ShipmentForm({width : Ext.getBody().getWidth() - 200});
	this.shipmentForm.onSaved.attach(function(sender, shipment){
		// location.hash = "#/proposal/shipping/nav?nomain";
		location.hash = "#/shipping/" + shipment.shippingId + "/main";
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
		autoScroll : true,
        cls : 'border-grid',
        items : [
                    this.shipmentForm.getPanel(),
                    this.parcelGrid.getPanel()
        ]
	});

    return this.panel;

	// return Ext.create('Ext.panel.Panel', {   
	// 				margin : 0,
	// 				// minHeight : 900,
	// 				layout : 'fit',
	// 				minHeight : 600,
	// 				items: [this.panel]
	// 			});
};


ShippingMainView.prototype.load = function(shippingId) {
	var _this = this;
	this.shippingId = shippingId;
	this.panel.setTitle("Shipment");
	if (shippingId != null){
		this.panel.setLoading();
		var onSuccess = function(sender, shipment){

			//Check if samples have exported data in order to know if the remove button should be enabled

			var containerIds = _.map(_.union(_.flatten(_.map(shipment.dewarVOs,"containerVOs"))),"containerId");
			if (containerIds.length > 0) {
				var onSuccessSamples = function(sender,samples) {
					var hasExportedData = false;
					if (samples) {
						var withoutCollection = _.filter(samples,{DataCollectionGroup_dataCollectionGroupId : null});
						hasExportedData = !(withoutCollection.length == samples.length);
					}

					_this.shipmentForm.load(shipment,hasExportedData);
					_this.parcelGrid.load(shipment,hasExportedData);
					_this.panel.setLoading(false);

				}
				EXI.getDataAdapter({onSuccess : onSuccessSamples}).mx.sample.getSamplesByContainerId(containerIds);
			} else {
				_this.shipmentForm.load(shipment,false);
				_this.parcelGrid.load(shipment,false);
				_this.panel.setLoading(false);
			}

		};
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getShipment(shippingId);
    }	
    else{
        
        _this.shipmentForm.load();	
		_this.panel.setLoading(false);
    }
};