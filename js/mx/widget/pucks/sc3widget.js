/**
* This class extends the SampleChangerWidget class for a SC3
*
* @class FlexHCDWidget
* @constructor
*/
function SC3Widget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'SC3';
	this.sampleChangerCapacity = 5;
	this.clockwise = -1;

	this.data = {
        id : this.id,
		radius : this.radius,
		cells : 5,
		text : []
	};
	
	this.createStructure();
	this.createPucks("Spinepuck", this.data.cells, 0, this.data.radius/2, 0.8);
};

SC3Widget.prototype.blink = SampleChangerWidget.prototype.blink;
SC3Widget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
SC3Widget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
SC3Widget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
SC3Widget.prototype.load = SampleChangerWidget.prototype.load;
SC3Widget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
SC3Widget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
SC3Widget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
SC3Widget.prototype.render = SampleChangerWidget.prototype.render;
SC3Widget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
SC3Widget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
SC3Widget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
SC3Widget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
SC3Widget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
SC3Widget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
SC3Widget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;
SC3Widget.prototype.enableAllPucks = SampleChangerWidget.prototype.enableAllPucks;
SC3Widget.prototype.disablePuck = SampleChangerWidget.prototype.disablePuck;
SC3Widget.prototype.enablePuck = SampleChangerWidget.prototype.enablePuck;
SC3Widget.prototype.removeClassToAllPucks = SampleChangerWidget.prototype.removeClassToAllPucks;
SC3Widget.prototype.addClassToPuck = SampleChangerWidget.prototype.addClassToPuck;

/**
* Creates the particular structure of the SC3
*
* @method createStructure
*/
SC3Widget.prototype.createStructure = function () {
	var textR = this.data.radius*0.9;
	for (var i = 0 ; i < this.data.cells ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		var textNumber = {
			text : i+1,
			x : -textR*Math.sin(ang) + this.data.radius,
			y : -textR*Math.cos(ang) + this.data.radius
		};
		this.data.text.push(textNumber);
	}
};

/**
* Converts the idLocation to the corresponding location in the SC3 by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the SC3 by convention
*/
SC3Widget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
	return Number(idLocation.split("-")[1]);
};

/**
* Converts the sample changer location in a SC3 to the id of the puck
*
* @method convertSampleChangerLocationToId
* @return The corresponding id of the puck in the given location
*/
SC3Widget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
	if (sampleChangerLocation <= 5 && sampleChangerLocation > 0) {
		return this.id + "-" + sampleChangerLocation + "-1";
	} else {
		return null;
	}
};