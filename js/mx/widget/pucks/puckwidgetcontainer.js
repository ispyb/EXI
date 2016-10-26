function PuckWidgetContainer(args) {
	var _this = this;
	
	this.mouseOverCell = new Event(this);
	this.mouseOutCell = new Event(this);
	
	this.x = 0;
	this.y = 0;
	
	if (args){
		if (args.puckType) {
			switch (args.puckType) {
				case 1:
					this.puckWidget = new UniPuckWidget(args);
					this.capacity = 16;
					break;
				case 2:
					this.puckWidget = new SpinePuckWidget(args);
					this.capacity = 10;
					break;
			}
		}
		if (args.x){
			this.x = args.x;
		}
		if (args.y){
			this.y = args.y;
		}
	}
	
	if(!this.puckWidget) {
		this.puckWidget = new SpineCellWidget(args);
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
		   x: this.x,
		   y: this.y,
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

PuckWidgetContainer.prototype.focus = function (location, bool) {
	this.puckWidget.focus(location, bool);
}


