function DewarTrackingView(args) {
	this.id = BUI.id();
	this.width = 600;

	this.templateData = {id : this.id};

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
	}

	var _this = this;

	this.dewarTrackingGrid = new DewarTrackingGrid();
	this.dewarTrackingGrid.onLoaded.attach(function(sender) {
		_this.onLoaded.notify();
	});

	this.onLoaded = new Event(this);
	
}

DewarTrackingView.prototype.getPanel = function () {

    var html = '';
    dust.render('dewar.tracking.view.template',[],function (err,out) {
        html = out;
    });

    return '<div id="' + this.id + '">' + html + '</div>';

}

DewarTrackingView.prototype.load = function (shipment) {
	var _this = this;
	this.templateData.shipment = shipment;

    var html = '';
    dust.render('dewar.tracking.view.template',this.templateData,function (err,out) {
        html = out;
    });

	$("#" + this.id).html(html);
	$("#" + this.id + "-dewars").multiselect({
													enableFiltering: true,
													enableCaseInsensitiveFiltering: true,
													includeSelectAllOption: true,
													onChange: function(option, checked, select) {
														_this.loadGrid(_this.getSelectedDewarIds());
													}
												});
	$("#" + this.id + "-tracking-grid").html(this.dewarTrackingGrid.getPanel());

	this.loadGrid(this.getSelectedDewarIds());
}

DewarTrackingView.prototype.getSelectedDewarIds = function() {
	return multiselect = $("#" + this.id + "-dewars").val();
}

DewarTrackingView.prototype.loadGrid = function(dewarIds) {
	var _this = this;
	if (dewarIds && dewarIds.length > 0) {
		var onSuccess = function (sender, tracking) {
			var grouped = _.groupBy(_.filter(tracking, function (o) {return dewarIds.indexOf(o.Dewar_dewarId.toString()) >= 0}),"Dewar_dewarId");
			var filteredDewars = _.filter(_this.templateData.shipment.dewarVOs,function (o) {return dewarIds.indexOf(o.dewarId.toString()) >= 0});
			_.map(filteredDewars,function (d) {
				d.trackingData = grouped[d.dewarId];
				d.nTracking = grouped[d.dewarId].length + 1;
				d.returnCourier = grouped[d.dewarId][0].Shipping_returnCourier;
			});
			_this.dewarTrackingGrid.load(filteredDewars);
		}

		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getDewarTrackingHistory(this.templateData.shipment.shippingId);
	} else {
		this.dewarTrackingGrid.load();
	}
}