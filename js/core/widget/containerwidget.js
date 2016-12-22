function ContainerWidget(args) {
    this.id = BUI.id();
	
    this.templateData = {
                            id          	: this.id,
                            xmargin     	: 0,
                            ymargin     	: 0,
                            mainRadius  	: 50,
                            width       	: 100,
                            height      	: 100,
                            r           	: 20,
							enableMainClick : false,
							enableMainMouseOver : false,
                        };
	this.containerId = 0;
    this.samples = null;

	if (args){
		if (args.xMargin){
			this.templateData.xMargin = args.xMargin;
		}
		if (args.yMargin){
			this.templateData.yMargin = args.yMargin;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
		if (args.enableMainMouseOver != null){
			this.templateData.enableMainMouseOver = args.enableMainMouseOver;
		}
        if (args.mainRadius){
			this.templateData.mainRadius = args.mainRadius;
			this.templateData.width = 2*args.mainRadius;
			this.templateData.height = 2*args.mainRadius;
			this.templateData.r = args.mainRadius/5;
		}
	}

	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

ContainerWidget.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
            id: this.id + "-container",
		    x: this.templateData.xMargin,
		    y: this.templateData.yMargin,
		    width : this.templateData.width + 1,
		    height : this.templateData.height + 1,
		//    cls:'border-grid',
		    frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						{
							html : this.getSVG(),
							width : this.templateData.width + 1,
							height : this.templateData.height + 1
						}
			],
			
	});

	this.panel.on('boxready', function() {
        if(_this.templateData.enableMainClick) {
			$("#" + _this.id).unbind('click').click(function(sender){
				_this.onClick.notify(sender.target.id);
			});
		}
		if(_this.templateData.enableMainMouseOver) {
			$("#" + _this.id).unbind('mouseover').mouseover(function(sender){
				_this.onMouseOver.notify(_this);
			});
			
			$("#" + _this.id).unbind('mouseout').mouseout(function(sender){
				_this.onMouseOut.notify(_this);
			});
		}
    });
	
	return this.panel;
	
};

ContainerWidget.prototype.loadSamples = function (samples) {
    this.samples = samples;
    if (samples){
		if (samples.length > 0){
			this.containerId = samples[0].Container_containerId; 
		}
	}
};

ContainerWidget.prototype.getSVG = function (samples) {
	var html = "";
	dust.render("container.widget.template", this.templateData, function(err, out){
		html = out;
	});
	
	return html;
};

ContainerWidget.prototype.focus = function (bool) {
	if (bool){
		$("#" + this.id).addClass("puck-selected");		
	} else {
		$("#" + this.id).removeClass("puck-selected");	
	}
};