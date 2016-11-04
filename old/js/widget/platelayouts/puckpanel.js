function PuckPanel(args) {
	this.id = BUI.id();
	this.height = 100;
	this.width = this.height;
	this.tbar = true;
	
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
			this.width = args.height;
		}
		if (args.width != null) {
			this.width = args.width;
			this.height = args.width;
		}
		if (args.tbar != null) {
			this.tbar = args.tbar;
		}
	}
}

PuckPanel.prototype.load = function(puck) {
	this.puck = puck;
};

PuckPanel.prototype.getWells = function(puck) {
	var wells = [];
	for ( var i = 0; i < puck.sampleVOs.length; i++) {
		wells.push({
			name 		: puck.sampleVOs[i].name,
			position 	: Number(puck.sampleVOs[i].location),
			id	 		: puck.sampleVOs[i].blSampleId
		});
	}
	return wells;
};

PuckPanel.prototype.render = function(puck) {
	if (this.puck != null){
		/** Unipuck **/
		if (this.puck.capacity == 16){
			var puckLayout = new UnipuckLayout({
				width  		:  this.width,
				height 		:  this.height,
				fontSize	: 10, 
				fill		:"#2E2E2E",
				fontColor 	: '#FFFFFF'
			});
			
			puckLayout.render(this.id);
			puckLayout.load(this.getWells(this.puck));
		}
		
		/** Spine **/
		if (this.puck.capacity == 10){
			var puckLayout = new SpineLayout({
				width  		:  this.width,
				height 		:  this.height,
				fontSize	: 10, 
				fill		:"#2E2E2E",
				fontColor 	: '#FFFFFF'
			});
			
			puckLayout.render(this.id);
			puckLayout.load(this.getWells(this.puck));
		}
		
		/** Spine **/
		if (this.puck.capacity == 96){
			var puckLayout = new SamplePlateLayout({
				width  		:  this.width,
				height 		:  this.height,
				fontSize	: 10, 
				fill		:"#2E2E2E",
				fontColor 	: '#FFFFFF'
			});
			
			puckLayout.render(this.id);
			puckLayout.load(this.getWells(this.puck));
		}
	}
	

};

PuckPanel.prototype.getPanel = function() {
	var _this = this;
	this.panel = Ext.create('Ext.panel.Panel', {
		margin : 10,
		items : [ 
		         {
						html : '<div style="width:' + (this.width + 2) +'px;height:' + (this.height +2) +'px;" id=' + this.id +'></div>'
				 }
		],		
		listeners : {
			afterrender : function(component, eOpts) {
				_this.render();
			}
	    }
	});
	
	
	this.panel.addDocked({
		height : 45,
		xtype : 'toolbar',
		dock: 'bottom',
		items : _this._getTopButtons()
	});
	
	
	
	return this.panel;
};




PuckPanel.prototype._getTopButtons = function() {
	var _this = this;
	var actions = [];
	if (this.tbar){
		actions.push(Ext.create('Ext.Action', {
			icon : '../images/icon/edit.png',
			text : 'Edit',
			disabled : false,
			handler : function(widget, e) {
				location.hash = '#/mx/puck/' + _this.puck.containerId + '/main'; 
			}
		}));
		actions.push(Ext.create('Ext.Action', {
			icon : '../images/icon/ic_highlight_remove_black_24dp.png',
			text : 'Remove',
			disabled : false,
			handler : function(widget, e) {
				alert("Not implemented yet")
			}
		}));
	}
	
	

	return actions;
};

