/**
* This class extends the SampleChangerWidget class for a FlexHCD
*
* @class FlexHCDWidget
* @constructor
*/
function FlexHCDWidget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'FlexHCD';
	this.initAlpha = -7*2*Math.PI/16;
	this.data = {
		radius : this.radius,
		cells : 8,
		lines : [],
		text :[]
	};
	
	this.createStructure();
	this.createPucks(1, this.data.cells/2, -7*Math.PI/8, this.data.radius/2, 0.5, {dAlpha : Math.PI/16, dist : 3*this.data.radius/4});
	this.createPucks(2, this.data.cells/2, -5*Math.PI/8, this.data.radius/2, 0.5, {dAlpha : Math.PI/16, dist : 3*this.data.radius/4});
};

FlexHCDWidget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
FlexHCDWidget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
FlexHCDWidget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
FlexHCDWidget.prototype.load = SampleChangerWidget.prototype.load;
FlexHCDWidget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
FlexHCDWidget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
FlexHCDWidget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
FlexHCDWidget.prototype.render = SampleChangerWidget.prototype.render;
FlexHCDWidget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
FlexHCDWidget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
FlexHCDWidget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
FlexHCDWidget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
FlexHCDWidget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
FlexHCDWidget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
FlexHCDWidget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;

/**
* Creates the particular structure of the FlexHCD
*
* @method createStructure
*/
FlexHCDWidget.prototype.createStructure = function () {
	for (var i = 0 ; i < this.data.cells/2 ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		var line = {
			x1 : this.data.radius*Math.sin(ang) + this.data.radius,
			y1 : this.data.radius*Math.cos(ang) + this.data.radius,
			x2 : -this.data.radius*Math.sin(ang) + this.data.radius,
			y2 : -this.data.radius*Math.cos(ang) + this.data.radius
		};
		this.data.lines.push(line);
	}
	
	// var textR = this.data.radius/4;
	// for (var i = 0 ; i < this.data.cells ; i++){
	// 	var ang = i*2*Math.PI/this.data.cells;
	// 	var textNumber = {
	// 		text : i+1,
	// 		x : textR*Math.sin(this.initAlpha + ang) + this.data.radius,
	// 		y : -textR*Math.cos(this.initAlpha + ang) + this.data.radius
	// 	};
	// 	this.data.text.push(textNumber);
	// }
};

/**
* Converts the idLocation to the corresponding location in the FlexHCD by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the FlexHCD by convention
*/
FlexHCDWidget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
	var n = Number(idLocation.split("-")[1]);
	var i = Number(idLocation.split("-")[2]);
	return (n-1)*3 + i;
};

/**
* Converts the sample changer location in a FlexHCD to the id of the puck
*
* @method convertSampleChangerLocationToId
* @return The corresponding id of the puck in the given location
*/
FlexHCDWidget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
	if (sampleChangerLocation <= 24 && sampleChangerLocation > 0) {
		var n = Math.floor(sampleChangerLocation/3) + 1;
		var i = sampleChangerLocation % 3;
		if (i == 0){
			n--;
			i = 3;
		}
		return this.id + "-" + n + "-" + i;
	} else {
		return null;
	}
};