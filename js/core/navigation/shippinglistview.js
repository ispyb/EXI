function ShippingListView(){
	this.sorters = [{property : 'sessionId', direction: 'DESC'}];
	ListView.call(this);
	this.dewars = null;
}

ShippingListView.prototype.getPanel = ListView.prototype.getPanel;
ShippingListView.prototype.load = ListView.prototype.load;
ShippingListView.prototype.getFilter = ListView.prototype.getFilter;
ShippingListView.prototype.getFields = ListView.prototype.getFields;
ShippingListView.prototype.getColumns = ListView.prototype.getColumns;

/**
* Return the number of containers and samples for a given shipment 
*
* @method getStatsByShippingId
* @param {Integer} shippingId ShippingId
*/
ShippingListView.prototype.getStatsByShippingId = function(shippingId){
	if (this.dewars){
		var _this = this;
		var containers = _.filter(this.dewars, function(e){return e.shippingId == shippingId;});
		var sampleCount = 0;
		_(containers).forEach(function(value) {
			sampleCount = sampleCount + value.sampleCount;
		});      
		return {
					samples     : sampleCount,
					dewars      : Object.keys(_.groupBy(containers, "dewarId")).length,
					containers   : containers.length
			
		};
	} else {
		return null;
	}
};

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
ShippingListView.prototype.getRow = function(record){
	var html = "";
    
	record.data.formattedCreationDate = moment(new Date(record.data.Shipping_creationDate)).format("DD-MM-YYYY");
	record.data.stats = this.getStatsByShippingId(record.data.Shipping_shippingId);

	dust.render("shipping.listview", record.data, function(err, out){
        	html = out;
     	});
	return html;
};

