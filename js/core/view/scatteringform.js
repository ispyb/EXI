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
					width : this.width
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

    var html = "";
    dust.render("scattering.form.template", this.data, function (err, out) {
        html = out;
    });

	$('#' + this.id).hide().html(html).fadeIn('fast');
	this.panel.doLayout();
}

ScatteringForm.prototype.plot = function() {
	var startDate= $("#" + this.id + "-startDate").val();
	var endDate = $("#" + this.id + "-endDate").val();
	var checkedValues = [];
	$('.scattering-checkbox:checked').each(function(i){
		checkedValues.push($(this).val());
	});
	var token = EXI.getDataAdapter().proposal.authentication.token;

	if (startDate != "" && endDate != "" && checkedValues.length > 0) {
		var urlParams = "url=http://ispyvalid.esrf.fr:8080/ispyb/ispyb-ws/rest/" + token + "/stats/autoprocstatistics/innerShell/" + startDate + "/" + endDate + "/csv&/&title=" + this.data.title + "&/&y=" + checkedValues.toString() + "&/&x=recordTimeStamp&";
		var url = '../viewer/scatter/index.html?' + urlParams;
		window.open(url,'_blank');
	}
}