function PuckWidgetContainer(args) {
	var _this = this;
	
	this.mouseOverCell = new Event(this);
	this.mouseOutCell = new Event(this);
	
	this.xMargin = 0;
	this.yMargin = 0;
	if (args){
		if (args.puckType) {
			if (args.puckType == "UniPuck" || args.puckType == "SpinePuck") {
				debugger
			}
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
		if (args.x) {
			debugger
		}
	}
	
	if(!this.puckWidget) {
		this.puckWidget = new SpinePuckWidget(args);
	}
	
	this.puckWidget.onClick.attach(function(sender, cell){
		
		
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
						{
							html : this.puckWidget.getPanel(),
							width : 2*this.puckWidget.data.mainRadius + 1,
							height : 2*this.puckWidget.data.mainRadius + 1
						}
			],
			
	});
	
	return this.panel;
	
}

PuckWidgetContainer.prototype.load = function (data) {
	this.puckWidget.load(data);
}

PuckWidgetContainer.prototype.loadSamples = function (samples) {
	this.puckWidget.loadSamples(samples);
}

PuckWidgetContainer.prototype.focus = function (location, bool) {
	this.puckWidget.focus(location, bool);
}


