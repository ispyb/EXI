function ScatteringForm(args) {
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
}

ScatteringForm.prototype.getPanel = function() {
    var _this = this;

	this.panel = Ext.create("Ext.panel.Panel",{
		items :	[{
					html : '<div id="' + this.id + '"></div>',
					autoScroll : false,
					width : this.width,
					height : this.height
				}]
	});

    // this.panel.on('boxready', function() {
    //     _this.load();
    // });

	return this.panel;
};

ScatteringForm.prototype.load = function(data) {
	this.data = data;
    if (!this.data) {
        this.data = {};
    }
    this.data.id = this.id;

	if (this.data.keys) {
		this.data.chunkedKeys = _.chunk(this.data.keys,Math.ceil(this.data.keys.length/3.0));
	}

	if (!this.data.types){
		this.data.types = [
								{display : "Overall", value : "overall"},
								{display : "InnerShell", value : "innerShell"},
								{display : "OutShell", value : "outShell"}
							]
	}

	if (!this.data.beamlines) {
		this.data.beamlines = EXI.credentialManager.getBeamlinesByTechnique("MX");
	}

    var html = "";
    dust.render("scattering.form.template", this.data, function (err, out) {
        html = out;
    });

	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();

	$('#' + this.id + '-datepicker').datetimepicker({
		defaultDate : new Date(),
		format : "DD-MM-YYYY"
	});
}

ScatteringForm.prototype.plot = function() {
	var endDate= moment($("#" + this.id + "-date").val(),"DD-MM-YYYY").format("YYYY-MM-DD");
	var checkedValues = [];
	$('.scattering-checkbox:checked').each(function(i){
		checkedValues.push($(this).val());
	});
	var type = $("#" + this.id + "-type").val();
	var beamline = $("#" + this.id + "-beamline").val();
	
	if (endDate != "Invalid date" && checkedValues.length > 0) {
		var startDate = moment(endDate,"YYYY-MM-DD").subtract(7,'d').format("YYYY-MM-DD");
		url = "";
		if (beamline != ""){
			url = EXI.getDataAdapter().mx.stats.getStatisticsByDateAndBeamline(type,startDate,endDate,beamline);
		} else {
			url = EXI.getDataAdapter().mx.stats.getStatisticsByDate(type,startDate,endDate);
		}
		var urlParams = "url=" + url + "&/&title=" + this.data.title + "&/&y=" + checkedValues.toString() + "&/&x=recordTimeStamp&";
		window.open("../viewer/scatter/index.html?" + urlParams,"_blank");
	} else {
		$("#" + this.id + "-checkox-div").notify("Set the dates correctly and select the values to plot.", { className : "error",elementPosition: 'top left'});
	}
}