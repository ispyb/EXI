/**
* This class extends the SampleChangerWidget class for a RoboDiffWidget
*
* @class RoboDiffWidget
* @constructor
*/
function RoboDiffWidget (args) {
	
	SampleChangerWidget.call(this,args);
	
	this.name = 'RoboDiff';
	this.sampleChangerCapacity = 24;
	this.initAlpha = -7*2*Math.PI/16;
	this.data = {
        id : this.id,
		radius : this.radius,
		cells : 8,
		lines : [],
		text :[]
	};
	
	this.createStructure();
	this.createPucks("Spinepuck", this.data.cells, -7*Math.PI/8, this.data.radius/2, 0.5, {dAlpha : Math.PI/16, dist : 3*this.data.radius/4});
};

RoboDiffWidget.prototype.blink = SampleChangerWidget.prototype.blink;
RoboDiffWidget.prototype.getPuckIndexFromAngle = SampleChangerWidget.prototype.getPuckIndexFromAngle;
RoboDiffWidget.prototype.createPucks = SampleChangerWidget.prototype.createPucks;
RoboDiffWidget.prototype.getPanel = SampleChangerWidget.prototype.getPanel;
RoboDiffWidget.prototype.load = SampleChangerWidget.prototype.load;
RoboDiffWidget.prototype.getStructure = SampleChangerWidget.prototype.getStructure;
RoboDiffWidget.prototype.findPuckById = SampleChangerWidget.prototype.findPuckById;
RoboDiffWidget.prototype.getAllPucks = SampleChangerWidget.prototype.getAllPucks;
RoboDiffWidget.prototype.render = SampleChangerWidget.prototype.render;
RoboDiffWidget.prototype.setClickListeners = SampleChangerWidget.prototype.setClickListeners;
RoboDiffWidget.prototype.disablePucksOfDifferentCapacity = SampleChangerWidget.prototype.disablePucksOfDifferentCapacity;
RoboDiffWidget.prototype.allowAllPucks = SampleChangerWidget.prototype.allowAllPucks;
RoboDiffWidget.prototype.getPuckData = SampleChangerWidget.prototype.getPuckData;
RoboDiffWidget.prototype.getAllFilledPucks = SampleChangerWidget.prototype.getAllFilledPucks;
RoboDiffWidget.prototype.loadSamples = SampleChangerWidget.prototype.loadSamples;
RoboDiffWidget.prototype.emptyAllPucks = SampleChangerWidget.prototype.emptyAllPucks;
RoboDiffWidget.prototype.enableAllPucks = SampleChangerWidget.prototype.enableAllPucks;
RoboDiffWidget.prototype.disablePuck = SampleChangerWidget.prototype.disablePuck;
RoboDiffWidget.prototype.enablePuck = SampleChangerWidget.prototype.enablePuck;
RoboDiffWidget.prototype.removeClassToAllPucks = SampleChangerWidget.prototype.removeClassToAllPucks;
RoboDiffWidget.prototype.addClassToPuck = SampleChangerWidget.prototype.addClassToPuck;

/**
* Creates the particular structure of the FlexHCD
*
* @method createStructure
*/
RoboDiffWidget.prototype.createStructure = function () {
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

	var textR = this.data.radius*0.31;
	var textRBig = this.data.radius*0.94;
	var dAlpha = Math.PI/16;
	var currentNumber = 1;
	var textSize = Math.round((15-7)*(this.data.radius-100)/(200-100) + 7);
	for (var i = 0 ; i < this.data.cells ; i++){
		var ang = i*2*Math.PI/this.data.cells;
		this.data.text.push({
			text : currentNumber,
			x : textRBig*Math.sin(this.initAlpha + ang - dAlpha) + this.data.radius,
			y : -textRBig*Math.cos(this.initAlpha + ang - dAlpha) + this.data.radius,
			textSize : textSize
		});
		currentNumber++;
		this.data.text.push({
			text : currentNumber,
			x : textRBig*Math.sin(this.initAlpha + ang + dAlpha) + this.data.radius,
			y : -textRBig*Math.cos(this.initAlpha + ang + dAlpha) + this.data.radius,
			textSize : textSize
		});
		currentNumber++;
		this.data.text.push({
			text : currentNumber,
			x : textR*Math.sin(this.initAlpha + ang) + this.data.radius,
			y : -textR*Math.cos(this.initAlpha + ang) + this.data.radius,
			textSize : textSize
		});
		currentNumber++;
	}
};

/**
* Converts the idLocation to the corresponding location in the FlexHCD by convention
*
* @method convertIdToSampleChangerLocation
* @return The corresponding location in the FlexHCD by convention
*/
RoboDiffWidget.prototype.convertIdToSampleChangerLocation = function (idLocation) {
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
RoboDiffWidget.prototype.convertSampleChangerLocationToId = function (sampleChangerLocation) {
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