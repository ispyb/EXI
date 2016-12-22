function PuckWidgetContainer(args) {
	var _this = this;
	
	this.onClick = new Event(this);
	this.mouseOverCell = new Event(this);
	this.mouseOutCell = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
	
	this.xMargin = 0;
	this.yMargin = 0;
	this.containerId = 0;
	this.enableMainClick = false;
	this.enableMainMouseOver = false;
	if (args){
		if (args.puckType) {
			switch (args.puckType) {
				case "Unipuck":
					this.puckWidget = new UniPuckWidget(args);
					this.capacity = 16;
					break;
				case "Spinepuck":
					this.puckWidget = new SpinePuckWidget(args);
					this.capacity = 10;
					break;
			}
		}
		if (args.xMargin){
			this.xMargin = args.xMargin;
		}
		if (args.yMargin){
			this.yMargin = args.yMargin;
		}
		if (args.enableMainClick != null){
			this.enableMainClick = args.enableMainClick;
		}
		if (args.enableMainMouseOver != null){
			this.enableMainMouseOver = args.enableMainMouseOver;
		}
	}
	
	if(!this.puckWidget) {
		this.puckWidget = new SpinePuckWidget(args);
	}
	
	this.puckWidget.onClick.attach(function(sender, id){
		_this.onClick.notify(id);
	});
	
	this.puckWidget.onMouseOver.attach(function(sender, location){
		_this.mouseOverCell.notify(location);
	});
	
	this.puckWidget.onMouseOut.attach(function(sender){
		_this.mouseOutCell.notify();
	});
}

PuckWidgetContainer.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			id: this.puckWidget.id + "-container",
		   x: this.xMargin,
		   y: this.yMargin,
		   width : 2*this.puckWidget.data.mainRadius + 1,
		   height : 2*this.puckWidget.data.mainRadius + 1,
		//    cls:'border-grid',
		   frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						this.puckWidget.getPanel()
			],
			
	});

	this.panel.on('boxready', function() {
        if(_this.enableMainClick) {
			$("#" + this.id).unbind('click').click(function(sender){
				_this.onClick.notify(sender.target.id);
			});
		}
		if(_this.enableMainMouseOver) {
			$("#" + this.id).unbind('mouseover').mouseover(function(sender){
				_this.onMouseOver.notify(_this.puckWidget);
			});
			
			$("#" + this.id).unbind('mouseout').mouseout(function(sender){
				_this.onMouseOut.notify(_this.puckWidget);
			});
		}
    });
	
	return this.panel;
	
}

PuckWidgetContainer.prototype.load = function (data) {
	this.puckWidget.load(data);
}

PuckWidgetContainer.prototype.loadSamples = function (samples) {
	if (samples){
		if (samples.length > 0){
			this.containerId = samples[0].Container_containerId; 
			this.puckWidget.loadSamples(samples);
		}
	}
}

PuckWidgetContainer.prototype.focus = function (location, bool) {
	this.puckWidget.focus(location, bool);
}

/**
* It blinks the sample changer by fading IN and OUT
*
* @method blink` 
*/
PuckWidgetContainer.prototype.blink = function () {
    this.puckWidget.blink();
}