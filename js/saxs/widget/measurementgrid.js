/**
 * Macromolecule Grid showing macromolecules and adding anb updating buttons
 * 
 * @height
 * @maxHeight
 * @width
 * @cssFontStyle
 * @searchBar makes this grid as Ext.ux.LiveSearchGridPanel
 * @tbar top bar containing "Add" and "Update From SMIS" button 
 * @collapsed
 * @collapsible
 * @btnEditVisible
 * @btnRemoveVisible
 * @multiselect makes it multiselect using Ext.selection.CheckboxModel
 * 
 * #onSelected
 * #onMacromoleculesChanged
 */
function MeasurementGrid(args) {
	this.id = BUI.id();
}


MeasurementGrid.prototype.load = function(dataCollections) {
	dataCollections = _.orderBy(dataCollections, ['MeasurementToDataCollection_dataCollectionId', 'MeasurementToDataCollection_dataCollectionOrder'], ['desc', 'desc']);
	_.map(dataCollections, function(o){ 
											o.samplePlateLetter = BUI.getSamplePlateLetters()[o.SamplePlatePosition_rowNumber - 1];
										});
	var html = "";
	dust.render("measurement.grid.template", dataCollections, function(err, out) {                                                                                               
		html = html + out;
	});
	
	$('#' + this.id).html(html);
};

MeasurementGrid.prototype.getPanel = function(){
    var _this = this;

	return {
		html : '<div id="' + this.id + '"></div>',
		autoScroll : true
	}
};

// MeasurementGrid.prototype._prepareData = function(measurements, experiments) {
// 	var data = [];
	
// 	for (var i = 0; i < measurements.length; i++) {
// 		var measurement = measurements[i];
// 		var specimen = experiments.getSampleById(measurement.specimenId);
// 		var buffer = EXI.proposalManager.getBufferById(specimen.bufferId);
// 		measurement.buffer_acronym = buffer.acronym;
// 		measurement.bufferId = buffer.bufferId;
// 		measurement.volume = specimen.volume;
// 		if (specimen.macromolecule3VO != null) {
// 			measurement.acronym = specimen.macromolecule3VO.acronym;
// 			measurement.macromoleculeId = specimen.macromolecule3VO.macromoleculeId;
// 		}
// 		measurement.concentration = specimen.concentration;
// 		if (measurement.run3VO != null) {
// 			measurement.energy = measurement.run3VO.energy;
// 			measurement.expExposureTemperature = measurement.run3VO.exposureTemperature;
// 			measurement.storageTemperature = measurement.run3VO.storageTemperature;
// 			measurement.timePerFrame = measurement.run3VO.timePerFrame;
// 			measurement.radiationAbsolute = measurement.run3VO.radiationAbsolute;
// 			measurement.radiationRelative = measurement.run3VO.radiationRelative;
// 			measurement.status = "DONE";

// 			try {
				
// 				if (measurement.run3VO.timeStart != null) {
// 					if (measurement.run3VO.timeStart != "") {
// 						measurement.miliseconds = moment(measurement.run3VO.timeStart).format("X");
// 					}
// 				}
// 			} catch (E) {
// 				console.log(E);
// 			}
// 		}

// 		if (experiments.getDataCollectionByMeasurementId(measurement.measurementId).length > 0) {
// 			var measurementtodatacollection3VOs = experiments.getDataCollectionByMeasurementId(measurement.measurementId)[0].measurementtodatacollection3VOs;
// 			for (var k = 0; k < measurementtodatacollection3VOs.length; k++) {
// 				if (measurementtodatacollection3VOs[k].dataCollectionOrder == 1) {
// 					var specimenBuffer = experiments.getSampleById(experiments.getMeasurementById(measurementtodatacollection3VOs[k].measurementId).specimenId);
// 					if (specimenBuffer.sampleplateposition3VO != null) {
// 						measurement.bufferSampleplateposition3VO = specimenBuffer.sampleplateposition3VO;
// 						measurement.bufferSampleplate = (experiments.getSamplePlateById(specimenBuffer.sampleplateposition3VO.samplePlateId));
// 					}
// 				}
// 			}
// 		}

// 		if (this.collapsed) {
// 			/** If collapsed only the samples * */
// 			if (specimen.macromolecule3VO != null) {
// 				data.push(measurement);
// 			}
// 		} else {
// 			data.push(measurement);
// 		}

// 	}
// 	return data;
// };