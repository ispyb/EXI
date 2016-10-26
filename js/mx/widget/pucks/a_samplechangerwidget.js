function SampleChangerWidget (args) {
	this.id = BUI.id();
	this.pucks = {};
	this.clockwise = 1;
	this.initAlpha = 0;
	this.isLoading = true;
	this.radius = 200;
	this.name = '';
	this.onPuckSelected = new Event(this);

	if (args) {
		if (args.radius){
			this.radius = args.radius;
		}
		if (args.isLoading != null){
			this.isLoading = args.isLoading;
		}
	}
}

/**
* Create certain types of pucks following a circular path
*
* @method createPucks
* @param {Integer} puckType The type of puck (1 is Uni, 2 is Spine)
* @param {Integer} n The number of pucks
* @param {Double} initAlpha Initial angle where to start to add pucks
* @param {Double} dist The distance to the center of the puck where the cells are positioned
* @param {Double} marginPercent Factor to control the separation between cells
* @param {Object} args Extra information for add pucks like a second row of pucks by defining a dAlpha and a new dist
*/
SampleChangerWidget.prototype.createPucks = function (puckType, n, initAlpha, dist, marginPercent, args) {
	var rad = dist*Math.sin((Math.PI/this.data.cells)*marginPercent);
	this.pucks[puckType] = [];
	for (var i = 0 ; Math.abs(i) < n ; i += this.clockwise) {
		var ang = i*2*Math.PI/n;
		var puckIndex = this.getPuckIndexFromAngle(this.initAlpha, 1, this.initAlpha + this.clockwise*(2*Math.PI*(1 - 1/this.data.cells)), this.data.cells, initAlpha + ang);		
		var puckId = this.id + "-" + puckIndex + "-1";
		if (args) {
			puckId = this.id + "-" + puckIndex + "-3";
		}
		var cx = dist*Math.sin(initAlpha + ang) + this.data.radius - rad;
		var cy = -dist*Math.cos(initAlpha + ang) + this.data.radius - rad;
		this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : puckId, mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
		
		if (args) {
			if (args.dAlpha != null && args.dist != null){
				cx = args.dist*Math.sin(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-2", mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
				
				cx = args.dist*Math.sin(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-1", mainRadius : rad, x : cx , y : cy, isLoading : this.isLoading}));
			}
		}
	}
}

SampleChangerWidget.prototype.getPuckIndexFromAngle = function (x0,y0,x1,y1,angle) {
	return Math.round((y1-y0)*(angle-x0)/(x1-x0) + y0);
}

SampleChangerWidget.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			
		   // cls:'border-grid',
		    layout:'absolute',
            items : [
						{
							html : this.getStructure(),
							frame: false,
							border: false,
							bodyStyle: 'background:transparent;'
						}
			],
			
	});

	for (puckType in this.pucks) {
		for (puck in this.pucks[puckType]){
			var puck = this.pucks[puckType][puck];
			this.panel.add(puck.getPanel());
		}
	}
	
	return this.panel;
	
}

/**
* Load the pucks using correctly parsed data
*
* @method load
* @param {Object} data Keys are the locations and the values are puckWidget data 
*/
SampleChangerWidget.prototype.load = function (data) {
	for (i in Object.keys(data)){
		var location = Object.keys(data)[i];
		var puck = this.findPuckById(this.id + "-" + location);
		puck.load(data[location].cells);
	}
}


SampleChangerWidget.prototype.getStructure = function () {
	var html = "";
	dust.render("structure.sampleChanger.template", this.data, function(err, out){
		html = out;
	});
	
	return html;
}

SampleChangerWidget.prototype.findPuckById = function (id) {
	var allPucks = this.getAllPucks();
	return _.find(allPucks, function(o) {return o.puckWidget.id == id}).puckWidget;
}

SampleChangerWidget.prototype.getAllPucks = function () {
	var allPucks = [];
	for (puckType in this.pucks) {
		allPucks = allPucks.concat(this.pucks[puckType]);
	}
	return allPucks;
}

SampleChangerWidget.prototype.render = function () {
    var allPucks = this.getAllPucks();
    for (puck in allPucks){
        var puck = allPucks[puck].puckWidget;
        for (cell in puck.data.cells){
            puck.render(puck.data.cells[cell].location);
        }
    }
}

SampleChangerWidget.prototype.setClickListeners = function () {
    var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).css('cursor','pointer');
		$("#" + puck.puckWidget.id).unbind('click').click(function(sender){
			if (!sender.target.classList.contains('disabled')){
				_this.onPuckSelected.notify(_this.findPuckById(sender.target.id));
			}
		});
	}
}

SampleChangerWidget.prototype.disablePucksOfDifferentCapacity = function (capacity) {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		if (puck.capacity != capacity) {
			$("#" + puck.puckWidget.id).addClass("disabled");
		}
	}
}

SampleChangerWidget.prototype.allowAllPucks = function () {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).removeClass("disabled");
	}
}

SampleChangerWidget.prototype.getPuckData = function () {
	var allPucks = this.getAllPucks();
	var puckData = {};
    for (puckContainerIndex in allPucks) {
        var puckContainer = allPucks[puckContainerIndex];
        var location = puckContainer.puckWidget.id.substring(puckContainer.puckWidget.id.indexOf('-')+1);
        puckData[location] = puckContainer.puckWidget.data;
    }
	return puckData;
}