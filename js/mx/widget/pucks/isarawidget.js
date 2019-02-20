/**
* This class extends the SampleChangerWidget class for a ISARA
*
* @class ISARAWidget
* @constructor
*/
function ISARAWidget (args) {
	
	SampleChangerWidget.call(this,args);
	debugger;
	this.name = 'ISARA';
	this.sampleChangerCapacity = 29;
	this.data = {
        id : this.id,
		radius : this.radius,
		cells : this.sampleChangerCapacity,
		lines : [],
		text :[]
	};
	

	this.createPucks("Spinepuck", this.data.cells);
	//this.createPucks("Unipuck", this.data.cells);
};


ISARAWidget.prototype.blink = SampleChangerWidget.prototype.blink;
ISARAWidget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
ISARAWidget.prototype.createPucks = SampleChangerWidget.prototype.createPucksISARA;
ISARAWidget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
ISARAWidget.prototype.load = SampleChangerWidget.prototype.load;
ISARAWidget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
ISARAWidget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
ISARAWidget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
ISARAWidget.prototype.render = SampleChangerWidget.prototype.render;
ISARAWidget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
ISARAWidget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
ISARAWidget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
ISARAWidget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
ISARAWidget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
ISARAWidget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
ISARAWidget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;
ISARAWidget.prototype.enableAllPucks = SampleChangerWidget.prototype.enableAllPucks;
ISARAWidget.prototype.disablePuck = SampleChangerWidget.prototype.disablePuck;
ISARAWidget.prototype.enablePuck = SampleChangerWidget.prototype.enablePuck;
ISARAWidget.prototype.removeClassToAllPucks = SampleChangerWidget.prototype.removeClassToAllPucks;
ISARAWidget.prototype.addClassToPuck = SampleChangerWidget.prototype.addClassToPuck;


/**
* Converts the idLocation to the corresponding location in the ISARA by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the ISARA by convention
*/
ISARAWidget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
	var n = Number(idLocation.split("-")[1]);
	return n;
};

/**
* Converts the sample changer location in a ISARA to the id of the puck
*
* @method convertSampleChangerLocationToId
* @return The corresponding id of the puck in the given location
*/
ISARAWidget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
	if (sampleChangerLocation <= 29 && sampleChangerLocation > 0) {
		var n = sampleChangerLocation;
		return this.id + "-" + n + "-1";
	} else {
		return null;
	}
};

ISARAWidget.prototype.onRender = function () {
	//Disable the 24th puck
	/*var puck24 = this.findPuckById(this.id + "-8-3");
	this.addClassToPuck(puck24,"puck-always-disabled");
	puck24.addClassToCells("cell-always-disabled");*/
}
