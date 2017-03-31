function CurveViewer(args) {
    this.id = BUI.id();

    this.templateData = {id : this.id};

    this.valueRange = null;

    if (args) {
        if (args.valueRange) {
            this.valueRange = args.valueRange;
        }
    }
};

CurveViewer.prototype.show = function(){
    var _this = this;
    
    var html = "";
    dust.render("curve.viewer.template", this.templateData, function(err,out){
        html = out;
    });

    $("body").append(html);

    $("#" + this.id + "-modal").on('hidden.bs.modal', function(){
        $(this).remove();
    });
    
    $("#" + this.id + "-modal").modal();
};

CurveViewer.prototype.load = function (autoProcIntegrationId, url, title,labels) {
    this.autoProcIntegrationId = autoProcIntegrationId;
    // $("#" + this.id + "-title").html(title);
    
    this.curvePlotter = new AutoProcIntegrationCurvePlotter({
                                                                height : 600,
                                                                targetId : this.id + "-plot",
                                                                labels : labels,
                                                                valueRange : this.valueRange,
                                                                labelsSeparateLines : true,
                                                                useHighlightCallback : true,
                                                                title : title,
                                                            });
    this.curvePlotter.loadUrl(url);

    // Redraw modal
    var modal = document.getElementById(this.id + "-modal");
    modal.style.display='none';
    modal.offsetHeight; // no need to store this anywhere, the reference is enough
    modal.style.display='block';

};