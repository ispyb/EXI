function ElectronDensityViewer (args) {
    this.id = BUI.id();
}



ElectronDensityViewer.prototype.getPanel = function(){
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        buttons : this.getToolBar(),
        items : [
            {
                html : '<div id="' + this.id + '" height="600px"></div>',
                height : 800,
            }
        ]
    });

    this.panel.on('boxready', function() {
        _this.load();
    });

    return this.panel;
};


ElectronDensityViewer.prototype.load = function(){
    var _this = this;

    var html = "";
    dust.render("electron.density.viewer.template", _this.sample, function(err, out) {                                                                       
        html = html + out;
    });
    debugger
    $(document.body).html(html);
    // $('#' + _this.id).hide().html(html).fadeIn('fast');

    init_gui();
    this.XV = new XtalViewer("Viewer", null, true, true);
    draw_selection_console(this.XV);
    this.XV.animate();
    if (!getQuery(this.XV)) {
        this.XV.load_pdb("data/1mru.pdb", "1mru");
        this.XV.load_dsn6_map("data/1mru.omap", "2mFo-Dfc", 0);
        this.XV.animate();
    }
    this.XV.enable_leap_motion();
};

ElectronDensityViewer.prototype.getToolBar = function() {
	var _this = this;
	return [
			{
                xtype : 'button',
                text: 'Debugger',
                handler: function() {
                    _this.XV;
                    debugger;
                }
            }
	];
};