/**
* This class renders a sample changer widget
*
* @class SampleChangerWidget
* @constructor
*/
function SampleChangerWidget (args) {
	this.id = BUI.id();
	this.pucks = {};
	this.clockwise = 1;
	this.initAlpha = 0;
	this.isLoading = true;
	this.radius = 200;
	this.name = '';
	this.onPuckSelected = new Event(this);
	this.sampleChangerCapacity = 0; //This is set in each sample changer type

	if (args) {
		if (args.radius){
			this.radius = args.radius;
		}
		if (args.isLoading != null){
			this.isLoading = args.isLoading;
		}
	}
};

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
		this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : puckId, mainRadius : rad, xMargin : cx , yMargin : cy, isLoading : this.isLoading}));
		
		if (args) {
			if (args.dAlpha != null && args.dist != null){
				cx = args.dist*Math.sin(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang + args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-2", mainRadius : rad, xMargin : cx , yMargin : cy, isLoading : this.isLoading}));
				
				cx = args.dist*Math.sin(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				cy = -args.dist*Math.cos(initAlpha + ang - args.dAlpha) + this.data.radius - rad;
				this.pucks[puckType].push(new PuckWidgetContainer({puckType : puckType, id : this.id + "-" + puckIndex + "-1", mainRadius : rad, xMargin : cx , yMargin : cy, isLoading : this.isLoading}));
			}
		}
	}
};

/**
* Returns the index used in the id of each puck using a linear equation given two points
*
* @method getPuckIndexFromAngle
* @param {Double} x0 The x value of the linear equation for the first point
* @param {Double} y0 The y value of the linear equation for the first point
* @param {Double} x1 The x value of the linear equation for the second point
* @param {Double} y1 The y value of the linear equation for the second point
* @param {Double} angle The x value of the point where you want to get the corresponding y value
* @return {Integer} The rounded y value of the returning point
*/
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
	
};

/**
* Load the pucks using the array of samples and a map of containerId to puckId and returns an array of pucks that couldn't be loaded
*
* @method loadSamples
* @param {Object} samples An array of samples returned by the query to the database
* @param {Object} containerIdsMap A map of the form containerId -> puckId
* @return {Array} An array of the pucks that couldn't be loaded
*/
SampleChangerWidget.prototype.loadSamples = function (samples, containerIdsMap) {
	var pucksToBeLoaded = {};
	var errorPucks = [];
	for (sampleIndex in samples) {
		var sample = samples[sampleIndex];
		var puckId = containerIdsMap[sample.Container_containerId];
		if (pucksToBeLoaded[puckId]) {
			pucksToBeLoaded[puckId].push(sample);
		} else {
			pucksToBeLoaded[puckId] = [sample];
		}
	}
	for (puckIndex in _.keys(pucksToBeLoaded)) {
		var puck = this.findPuckById(_.keys(pucksToBeLoaded)[puckIndex]);
		if (pucksToBeLoaded[puck.id].length <= puck.capacity){
			var errorSamples = [];
			var currentDewar = pucksToBeLoaded[puck.id][0].Dewar_dewarId;
			for (var i = 0 ; i < pucksToBeLoaded[puck.id].length ; i++) {
				var sample = pucksToBeLoaded[puck.id][i];
				if (Number(sample.BLSample_location) > puck.capacity) {
					errorSamples.push(sample);
					errorPucks = _.union(errorPucks,[puck]);
				}
				if (sample.Dewar_dewarId != currentDewar) {
					errorPucks = _.union(errorPucks,[puck]);
				}
			}
			_.remove(pucksToBeLoaded[puck.id], function (o) {return errorSamples.indexOf(o) >= 0});
			puck.loadSamples(pucksToBeLoaded[puck.id]);
		} else {
			$.notify("Capacity Error: Couldn't load correctly the puck at location " + this.convertIdToSampleChangerLocation(puck.id) + ".", "error");
			puck.containerId = pucksToBeLoaded[puck.id][0].Container_containerId;
			errorPucks.push(puck);
		}
	}
	return errorPucks;
};

/**
* Load the pucks using correctly parsed data
*
* @method load
* @param {Object} data Keys are the ids and the values are puckWidget data 
*/
SampleChangerWidget.prototype.load = function (data) {
	for (i in _.keys(data)){
		var location = _.keys(data)[i].substring(_.keys(data)[i].indexOf('-')+1);
		var puck = this.findPuckById(this.id + "-" + location);
		puck.load(data[_.keys(data)[i]].cells);
	}
};

/**
* Returns the html of the basic structure of the puck using a dustjs template and the data
*
* @method getStructure
*/
SampleChangerWidget.prototype.getStructure = function () {
	var html = "";
	dust.render("structure.sampleChanger.template", this.data, function(err, out){
		html = out;
	});
	
	return html;
};

/**
* Returns a certain puck given its id
*
* @method findPuckById
* @return The puck with the corresponding id
*/
SampleChangerWidget.prototype.findPuckById = function (id) {
	var allPucks = this.getAllPucks();
	return _.find(allPucks, function(o) {return o.puckWidget.id == id}).puckWidget;
};

/**
* Returns an array of all the pucks of the sample changer
*
* @method getAllPucks
* @return An array of all the pucks of the sample changer
*/
SampleChangerWidget.prototype.getAllPucks = function () {
	var allPucks = [];
	for (puckType in this.pucks) {
		allPucks = allPucks.concat(this.pucks[puckType]);
	}
	return allPucks;
};

/**
* Returns an array of all the filled pucks of the sample changer
*
* @method getAllFilledPucks
* @return An array of all the filled pucks of the sample changer
*/
SampleChangerWidget.prototype.getAllFilledPucks = function () {
	var allPucks = this.getAllPucks();
	return _.filter(allPucks, function (o) {return !o.puckWidget.isEmpty;})
};

/**
* Updates the pucks styles
*
* @method render
*/
SampleChangerWidget.prototype.render = function () {
    var allPucks = this.getAllPucks();
    for (puck in allPucks){
        var puck = allPucks[puck].puckWidget;
        for (cell in puck.data.cells){
            puck.render(puck.data.cells[cell].location);
        }
    }
};

/**
* Sets the click listeners of the pucks to notify on the onPuckSelected Event
*
* @method setClickListeners
*/
SampleChangerWidget.prototype.setClickListeners = function () {
    var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).css('cursor','pointer');
		$("#" + puck.puckWidget.id).unbind('click').click(function(sender){
			if (!sender.target.classList.contains('puck-disabled')){
				_this.onPuckSelected.notify(_this.findPuckById(sender.target.id));
			}
		});
	}
};

/**
* Adds the disabled style class to the pucks with different given capacity
*
* @method disablePucksOfDifferentCapacity
* @param {Integer} capacity The capacity of the allowed pucks
*/
SampleChangerWidget.prototype.disablePucksOfDifferentCapacity = function (capacity) {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		if (puck.capacity != capacity) {
			$("#" + puck.puckWidget.id).addClass("puck-disabled");
			puck.puckWidget.disableAllCells();
		}
	}
};

/**
* Removes the disabled style class to all pucks
*
* @method allowAllPucks
*/
SampleChangerWidget.prototype.allowAllPucks = function () {
	var _this = this;
	var allPucks = this.getAllPucks();
	for (puckIndex in allPucks) {
		var puck = allPucks[puckIndex];
		$("#" + puck.puckWidget.id).removeClass("puck-disabled");
		puck.puckWidget.allowAllCells();
	}
};

/**
* Returns an object containing the puckData of the filled pucks indexed by the idLocation
*
* @method getPuckData
* @return An object containing the puckData of the filled pucks indexed by the idLocation
*/
SampleChangerWidget.prototype.getPuckData = function () {
	var filledPucks = this.getAllFilledPucks();
	var puckData = {};
    for (puckContainerIndex in filledPucks) {
        var puckContainer = filledPucks[puckContainerIndex];
        var location = puckContainer.puckWidget.id;
		puckContainer.puckWidget.sampleChangerLocation = this.convertIdToSampleChangerLocation(location);
		puckContainer.puckWidget.data.sampleChangerLocation = this.convertIdToSampleChangerLocation(location);
        puckData[location] = puckContainer.puckWidget.data;
    }
	return puckData;
}

/**
* Empties all of the pucks
*
* @method emptyAllPucks
* @return 
*/
SampleChangerWidget.prototype.emptyAllPucks = function () {
	var allFilledPucks = this.getAllFilledPucks();
	for (puckIndex in allFilledPucks) {
		var puck = allFilledPucks[puckIndex];
		puck.puckWidget.emptyAll();
	}
}