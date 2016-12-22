function CrystalFormView (args) {
    this.id = BUI.id();
    this.padding = 20;
    this.containerId = 0;
	
	if (args != null) {
        if (args.padding != null) {
			this.padding = args.padding;
		}
        if (args.containerId != null) {
			this.containerId = args.containerId;
		}
	}

    this.uploaderWidget = new UploaderWidget();
}



CrystalFormView.prototype.getPanel = function(){
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        buttons : this.getToolBar(),
        items : [
            {
                html : '<div id="' + this.id + '" ></div>',
            },
            this.uploaderWidget.getForm(),
            {
                xtype : 'button',
                margin: '0 0 0 2',
                text: 'Test',
                handler: function() {
                    window.open('#/shipping/edv','_newtab');
                    // var edv = new ElectronDensityViewer();
                    // var window = Ext.create('Ext.window.Window', {
                    //         title: 'Elecyton Density Viewer',
                    //         height: Ext.getBody().getHeight() - 100,
                    //         width: Ext.getBody().getWidth() - 100,
                    //         modal : true,
                    //         resizable : true,
                    //         layout: 'fit',
                    //         items: edv.getPanel()
                    // }).show();
                }
            }
        ]
    });

    return this.panel;
};

CrystalFormView.prototype.getToolBar = function() {
	var _this = this;
	return [
            {
	            text: 'Return to shipment',
	            width : 200,
	            height : 30,
	            handler : function () {
                    location.href = "#/shipping/" + _this.shippingId + "/main";
                }
	        }
	];
};

CrystalFormView.prototype.load = function(containerId, sampleId, shippingId){
    var _this = this;
    this.containerId = containerId;
    this.sampleId = sampleId;
    this.shippingId = shippingId;
    this.panel.setTitle("Shipment");

    var onSuccess = function (sender, puck) {
        if (puck){
            var filtered = _.filter(puck.sampleVOs,function (o) {return o.blSampleId == _this.sampleId});
            if (filtered.length > 0) {
                _this.sample = filtered[0];
                
                var html = "";
                dust.render("crystal.form.template", _this.sample, function(err, out) {                                                                       
                    html = html + out;
                });
                
                $('#' + _this.id).hide().html(html).fadeIn('fast');
                $('#' + _this.id).css("padding",_this.padding);
                _this.panel.doLayout();
            }
        }
    }

	EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(this.containerId,this.containerId,this.containerId);
};