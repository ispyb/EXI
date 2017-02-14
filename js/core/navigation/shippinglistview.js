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

ShippingListView.prototype.loadDewars = function (dewars) {
	this.dewars = dewars;
};

/**
* Return the number of containers and samples for a given shipment 
*
* @method getStatsByShippingId
* @param {Integer} shippingId ShippingId
*/
ShippingListView.prototype.getStatsByShippingId = function(shippingId){
	var _this = this;
	if (this.dewars){
		var _this = this;
		var dewars = _.filter(this.dewars, function(e){return e.shippingId == shippingId;});
		return this.getStatsFromDewars(dewars);
	} else {
		return null;
	}
};

ShippingListView.prototype.getStatsFromDewars = function (dewars) {
	var sampleCount = 0;
	_(dewars).forEach(function(value) {
		sampleCount = sampleCount + value.sampleCount;
	});
	return {
				samples     : sampleCount,
				dewars      : Object.keys(_.groupBy(dewars, "dewarId")).length,
				containers   : dewars.length
		
	};
}

/**
* Calls to the dust template in order to render to puck in HTML
*
* @class getRow
* @constructor
*/
ShippingListView.prototype.getRow = function(record){
	var html = "";

	record.data.formattedCreationDate = moment(new Date(record.data.Shipping_creationDate)).format("DD-MM-YYYY");
	if (record.data.Container_beamlineLocation){ //Has session attached
		record.data.stats = this.getStatsByShippingId(record.data.Shipping_shippingId);
	} else {
		record.data.stats = {
										samples     : "?",
										dewars      : "?",
										containers   : "?"
							};
	}

	dust.render("shipping.listview", record.data, function(err, out){
		html = out;
	});
	return html;
};

