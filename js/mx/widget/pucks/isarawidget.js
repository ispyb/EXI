/**
* This class extends the SampleChangerWidget class for a ISARA
*
* @class ISARAWidget
* @constructor
*/
function ISARAWidget (args) {
	
	SampleChangerWidget.call(this,args);
	this.name = 'ISARA';
	this.sampleChangerCapacity = 29;
	this.data = {
        id : this.id,
		radius : this.radius,
		cells : 1,
		lines : [],
		text :[]
	};
	
    this.createStructure(this.sampleChangerCapacity);
	//this.createPucks("Spinepuck", this.data.cells);
	this.createPucks("Unipuck", this.sampleChangerCapacity);
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
	//Disable the pucks 13, 14, 15 ,18 ,19 ,20 ,21, 24, 25, 26
	//var puckIds = [13, 14, 15 ,18 ,19 ,20 ,21, 24, 25, 26];
	var puckIds = [];
	for (i = 0; i < puckIds.length; i++) {
		var puck = this.findPuckById(this.id +"-" +puckIds[i] +"-1");
		this.addClassToPuck(puck,"puck-always-disabled");
		puck.addClassToCells("cell-always-disabled");
	}
	/*var puck24 = this.findPuckById(this.id + "-8-3");
	this.addClassToPuck(puck24,"puck-always-disabled");
	puck24.addClassToCells("cell-always-disabled");*/
}

/**
* Creates the particular structure of the FlexHCD
*
* @method createStructure
*/
ISARAWidget.prototype.createStructure = function (n) {
    var textSize = Math.round((15-7)*(this.data.radius-100)/(200-100) + 7);
	for (var i =0; i< n; i++){
	    var puckIndex = i + 1;
        var puckId = this.id + "-" + puckIndex + "-1";
        var cx = 0;
        var cy = 0;
        var init_x_odd = 35;
        var init_x_even = 15;
        var init_y = 40;
        var index = 0;
        if (puckIndex<=5) {
                index = puckIndex % 5;
                cy=init_y;
                if (index == 0){
                    cx = init_x_even +(45 * 5);
                } else {
                    cx = init_x_even +(45 * (index));
                }
        } else if (puckIndex >5 && puckIndex <= 11) {
                index = (puckIndex-5) % 6;
                cy=init_y + 50;
                if (index == 0){
                    cx = init_x_odd +(45 * 5);
                } else {
                    cx = init_x_odd +(45 * (index-1));
                }
        } else if (puckIndex >11 && puckIndex <= 16) {
                index = (puckIndex-11) % 5;
                cy=init_y + 100;
                if (index == 0){
                    cx = init_x_even +(45 * 5);
                } else {
                    cx = init_x_even +(45 * index);
                }
        } else if (puckIndex >16 && puckIndex <= 22) {
                index = (puckIndex-16) % 6;
                cy=init_y + 150;
                if (index == 0){
                    cx = init_x_odd +(45 * 5);
                } else {
                    cx = init_x_odd +(45 * (index-1));
                }
        } else if (puckIndex >22 && puckIndex <= 27) {
                index = (puckIndex-22) % 5;
                cy=init_y + 200;
                if (index == 0){
                    cx = init_x_even +(45 * 5);
                } else {
                    cx = init_x_even +(45 * index);
                }
        } else if (puckIndex >27 && puckIndex <= 29) {
                index = (puckIndex-27) % 2;
                cy=init_y + 250;
                if (index == 0){
                    cx = init_x_odd + 140;
                } else {
                    cx = init_x_odd +95;
                }
        }

        this.data.text.push({
            text : puckIndex,
            x : cx + 7,
            y : cy - 1,
            textSize : textSize - 5
        });
	}

};
