function DewarTrackingGrid(args) {
	this.id = BUI.id();

	this.templateData = {id : this.id};

    this.onLoaded = new Event(this);
}

DewarTrackingGrid.prototype.getPanel = function () {

    var html = '';
    dust.render('dewar.tracking.grid.template',this.templateData,function (err,out) {
        html = out;
    });

    return '<div id="' + this.id + '">' + html + '</div>';

}

DewarTrackingGrid.prototype.load = function (dewars) {
    if (dewars){
        this.templateData.dewars = dewars;
        var html = "";
        dust.render('dewar.tracking.grid.template',this.templateData,function (err,out) {
            html = out;
        });
        $("#" + this.id).html(html);
    } else {
        $("#" + this.id).html("");
    }
    this.onLoaded.notify();
}