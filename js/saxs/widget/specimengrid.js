function SpecimenGrid(args) {
	this.id = BUI.id();
	this.height = 500;
	this.unitsFontSize = 9;
	this.editEnabled = false;
	this.isPositionColumnHidden = false;
	this.removeBtnEnabled = false;

//	this.selectionMode = "MULTI";
	this.updateRowEnabled = false;
	this.grouped = true;
	this.width = 900;
	this.title = 'Specimens';
	
	this.margin = "0 0 0 0";
//	this.experimentColorBased = false;

	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}

		if (args.showTitle == false) {
			this.title = null;
		}
		
		if (args.margin == false) {
			this.margin = args.margin;
		}

		if (args.grouped == false) {
			this.grouped = null;
		}

		if (args.width != null) {
			this.width = args.width;
		}


		if (args.editEnabled != null) {
			this.editEnabled = args.editEnabled;
		}
		if (args.removeBtnEnabled != null) {
			this.removeBtnEnabled = args.removeBtnEnabled;
		}
		if (args.isPositionColumnHidden != null) {
			this.isPositionColumnHidden = args.isPositionColumnHidden;
		}
//		if (args.selectionMode != null) {
//			this.selectionMode = args.selectionMode;
//		}
		if (args.updateRowEnabled != null) {
			this.updateRowEnabled = args.updateRowEnabled;
		}

	}
	this.onClick = new Event(this);
	this.onSelected = new Event(this);
	this.onRemoved = new Event(this);
	this.onSpecimenChanged = new Event();
}

SpecimenGrid.prototype._prepareData = function(dataCollections) {
	var data = [];

	for ( var i = 0; i < dataCollections.length; i++) {
		var sample = dataCollections[i];
		if (sample.Macromolecule_macromoleculeId != null) {
			sample.macromolecule = sample.Macromolecule_acronym;
			sample.exposureTemperature = [];
			sample.macromoleculeId = sample.Macromolecule_macromoleculeId;
		}

		if (sample.SamplePlatePosition_samplePlatePositionId != null) {
			if (sample.SamplePlatePosition_samplePlateId != null) {
				sample.samplePlateId = sample.SamplePlatePosition_samplePlateId;
				sample.rowNumber = sample.SamplePlatePosition_rowNumber;
				sample.columnNumber = sample.SamplePlatePosition_columnNumber;
				// sample.plateGroupName = experiment.getSamplePlateById(sample.sampleplateposition3VO.samplePlateId).plategroup3VO.name;
				sample.samplePlateName = sample.SamplePlate_name;
				sample.slotPositionColumn = sample.SamplePlate_slotPositionColumn;
			}
		} else {
			sample.samplePlateName = "Unallocated Specimens";
		}

		/** For grouping, because sencha has not option for multiple grouping I add a field to your store with a convert function that concatenates these two fields and then group by that field.**/
		sample.groupIndex = sample.Buffer_bufferId + sample.Macromolecule_macromoleculeId;
		var macromolecule = EXI.proposalManager.getMacromoleculeById(sample.Macromolecule_macromoleculeId);

		sample.acronym = "Buffers";
		if (macromolecule != null) {
			sample.acronym = EXI.proposalManager.getMacromoleculeById(sample.Macromolecule_macromoleculeId).acronym;
		}

		sample.buffer = EXI.proposalManager.getBufferById(sample.Buffer_bufferId);

		sample.volumeToLoad = sample.Measurement_volumeToLoad;
		data.push(sample);
	}
	return data;
};

SpecimenGrid.prototype.deselectAll = function() {
	this.grid.getSelectionModel().deselectAll();
};

SpecimenGrid.prototype.selectById = function(specimenId) {
	this.grid.getSelectionModel().deselectAll();
	for ( var i = 0; i < this.grid.getStore().data.items.length; i++) {
		var item = this.grid.getStore().data.items[i].data;
		if (item.Specimen_specimenId == specimenId) {
			this.grid.getSelectionModel().select(i);
		}
	}
};

SpecimenGrid.prototype.getStore = function() {
	return this.store;
};

SpecimenGrid.prototype.getPlugins = function() {
	var _this = this;

	var plugins = [];

	if (this.updateRowEnabled) {
		plugins.push(Ext.create('Ext.grid.plugin.RowEditing', {
			clicksToEdit : 1,
			listeners : {
				validateedit : function(grid, e) {
					var measurements = [];

					if (e.newValues.bufferId != e.record.data.bufferId) {
						/** If buffer has changed we have to change all the specimens sharing same datacollection **/
						var dataCollections = [];
						if (e.record.data.macromoleculeId == null) {
							dataCollections = dataCollections.concat(_this.experiment.getDataCollectionsBySpecimenId(e.record.data.specimenId));
						} else {
							var sampleDataCollections = _this.experiment.getDataCollectionsBySpecimenId(e.record.data.specimenId);
							for ( var i = 0; i < sampleDataCollections.length; i++) {
								var sampleDataCollection = sampleDataCollections[i];
								if (sampleDataCollection != null) {
									for ( var j = 0; j < sampleDataCollection.measurementtodatacollection3VOs.length; j++) {
										var measurementTODc = sampleDataCollection.measurementtodatacollection3VOs[j];
										if (measurementTODc.dataCollectionOrder == 1) {
											dataCollections = dataCollections.concat(_this.experiment.getDataCollectionsBySpecimenId(_this.experiment
													.getMeasurementById(measurementTODc.measurementId).specimenId));
										}
									}
								}
							}
						}
						var i = null;
						for ( i = 0; i < dataCollections.length; i++) {
							var dataCollection = dataCollections[i];
							var specimens = _this.experiment.getSpecimenByDataCollectionId(dataCollection.dataCollectionId);
							measurements = measurements.concat(specimens);
						}

						for ( i = 0; i < measurements.length; i++) {
							var measurement = measurements[i];
							var specimen = _this.experiment.getSpecimenById(measurement.specimenId);
							specimen.bufferId = e.newValues.bufferId;
							new DataAdapter().saveSpecimen(specimen, _this.experiment);
						}
					}

					/** Setting values **/
					e.record.data.concentration = e.newValues.concentration;
					e.record.data.volume = e.newValues.volume;

					/** Position **/
					if (e.record.data.sampleplateposition3VO != null) {
						var samplePlate = _this.experiment.getSamplePlateBySlotPositionColumn(e.newValues.slotPositionColumn);
						if (samplePlate != null) {
							e.record.data.sampleplateposition3VO = {
								columnNumber : e.newValues.columnNumber,
								rowNumber : e.newValues.rowNumber,
								samplePlateId : samplePlate.samplePlateId
							};
						}
					} else {
						if (e.newValues.slotPositionColumn != null) {
							var samplePlate = _this.experiment.getSamplePlateBySlotPositionColumn(e.newValues.slotPositionColumn);
							if (samplePlate != null) {
								e.record.data.sampleplateposition3VO = {
									columnNumber : e.newValues.columnNumber,
									rowNumber : e.newValues.rowNumber,
									samplePlateId : samplePlate.samplePlateId
								};
							}
						}
					}

					var macromoleculeId = e.record.data.macromoleculeId;
					
					var onSuccess = (function(sender, specimen) {
						/** Because macromolecule3VO is fecthed LAZY **/
						if (macromoleculeId != null) {
							specimen.macromolecule3VO = EXI.proposalManager.getMacromoleculeById(macromoleculeId);
						}
						_this.onSpecimenChanged.notify(specimen);
						_this.grid.setLoading(false);
					});
					
					_this.grid.setLoading();
					EXI.getDataAdapter({onSuccess: onSuccess}).saxs.specimen.saveSpecimen(e.record.data);
				}
			}
		}));
	}
	return plugins;
};

SpecimenGrid.prototype._getRowCombo = function() {
	var data = [];
	for ( var i = 1; i <= 8; i++) {
		data.push({
			rowNumber : i,
			name : BUI.getSamplePlateLetters()[i - 1]
		});
	}

	var positionsStore = Ext.create('Ext.data.Store', {
		fields : [ 'rowNumber', 'name' ],
		data : data
	});

	return Ext.create('Ext.form.ComboBox', {
		store : positionsStore,
		queryMode : 'local',
		displayField : 'name',
		valueField : 'rowNumber'
	});
};

SpecimenGrid.prototype._getColumnCombo = function() {
	var data = [];
	for ( var i = 1; i <= 12; i++) {
		data.push({
			columnNumber : i
		});
	}

	var positionsStore = Ext.create('Ext.data.Store', {
		fields : [ 'columnNumber' ],
		data : data
	});

	return Ext.create('Ext.form.ComboBox', {
		store : positionsStore,
		queryMode : 'local',
		displayField : 'columnNumber',
		valueField : 'columnNumber'
	});
};

SpecimenGrid.prototype._getSlotColumBombo = function() {
	if (this.experiment){
		var length = this.experiment.getSamplePlates().length;
	
		var data = [];
		for ( var i = 1; i <= length; i++) {
			data.push({
				slotPositionColumn : i
			});
		}
	
		var positionsStore = Ext.create('Ext.data.Store', {
			fields : [ 'slotPositionColumn' ],
			data : data
		});
	
		return Ext.create('Ext.form.ComboBox', {
			store : positionsStore,
			queryMode : 'local',
			displayField : 'slotPositionColumn',
			valueField : 'slotPositionColumn'
		});
	}
};

SpecimenGrid.prototype.getPanelByExperiment = function(experiment) {
	this.experiment = experiment;
	var data = this._prepareData(experiment);
	return this.getPanel(data);
};

SpecimenGrid.prototype.refresh = function(dataCollections) {
	// debugger
	this.dataCollections = dataCollections;
	_.map(dataCollections, function(o){ 
        if(o.Macromolecule_macromoleculeId){
		    o.acronym = EXI.proposalManager.getMacromoleculeById(o.Macromolecule_macromoleculeId).acronym;
        } else {
			o.acronym = "Buffers";
		}
		o.groupIndex = o.Buffer_bufferId + o.Macromolecule_macromoleculeId;
	});
	// var data = this._prepareData(dataCollections);

	this.store.loadData(dataCollections);
};

SpecimenGrid.prototype.getPanel = function() {
	
	var _this = this;
	this.store = Ext.create('Ext.data.Store', {
		fields : [
			'Buffer_acronym', 'Buffer_bufferId', 'Measurement_code', 'Macromolecule_acronym', 'acronym', 'Macromolecule_macromoleculeId', 'Specimen_concentration', 'Specimen_volume', 'SamplePlatePosition_samplePlateId',
			'SamplePlate_slotPositionColumn', 'SamplePlatePosition_rowNumber', 'SamplePlatePosition_columnNumber', 'groupIndex' ],
		data : [],
		groupField : 'acronym'
	});
	this.store.sort([ {
		property : 'Specimen_concentration',
		direction : 'ASC'
	}, {
		property : 'Buffer_acronym',
		direction : 'ASC'
	} ]);

	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
//		mode : this.selectionMode,
		listeners : {
			select : function(sm, record, index, eOpts ) {
				_this.onSelected.notify([record.data]);
			},
			deselect : function(sm, record, index, eOpts ) {
				_this.onSelected.notify([]);
			}
		}
	});

	var features = [];

	if (this.grouped) {
		features.push({
			ftype : 'grouping',
			groupHeaderTpl : '{name}',
			hideGroupedHeader : false,
			startCollapsed : false,
			id : 'myGroupedStore'
		});
	}
	this.grid = Ext.create(
					'Ext.grid.Panel',
					{
						title 		: this.title,
						height 		: this.height,
						width 		: this.width,
//						layout : 'fit',
						selModel 	: selModel,
						store 		: this.store,
						features 	: features,
						margin 		: this.margin,
						plugins	 	: this.getPlugins(),
						cls 		: 'border-grid',
						columns : [
							{
								text : '',
								dataIndex : 'Macromolecule_acronym',
								width : 20,
								renderer : function(val, y, sample) {
									var macromoleculeId = sample.data.Macromolecule_macromoleculeId;
									if (macromoleculeId == null) return; 
									// return BUI.getRectangleColorDIV(_this.experiment.macromoleculeColors[macromoleculeId], 10, 10);
									return BUI.getRectangleColorDIV("red", 10, 10);
								}
							},
							{
								text : 'Macromolecule',
								dataIndex : 'Macromolecule_acronym',
								width : 100
							},
							{
								text : '',
								dataIndex : 'Buffer_acronym',
								width : 20,
								renderer : function(val, y, sample) {
									var color = "black";
									if (sample.data.Buffer_bufferId != null) {
										// if (_this.experiment.getDataCollectionsBySpecimenId(sample.data.Specimen_specimenId)[0] != null){
										// 	color = _this.experiment.getSpecimenColorByBufferId(_this.experiment.getMeasurementById(_this.experiment.getDataCollectionsBySpecimenId(sample.data.Specimen_specimenId)[0].measurementtodatacollection3VOs[0].measurementId).specimenId);
										// }
										return BUI.getRectangleColorDIV(color, 10, 10);
									}
								}
							}
							, {
								text : 'Buffer',
								dataIndex : 'Buffer_bufferId',
								width : 140,
								editor : BIOSAXS_COMBOMANAGER.getComboBuffers(EXI.proposalManager.getBuffers(), {
									noLabel : true,
									width : 300
								}),
								renderer : function(val, y, sample) {
									if (sample.data.bufferId != null) {
										return EXI.proposalManager.getBufferById(val).acronym;
									}
								}
							}, 
							{
								text : 'Conc.',
								dataIndex : 'Specimen_concentration',
								width : 100,
								editor : {
									allowBlank : false
								},
								renderer : function(val, meta, sample) {
									if (isNaN(val)) {
										meta.tdCls = 'yellow-cell';
										return val;
									} else {
										if (val != 0) {
											return BUI.formatValuesUnits(val, 'mg/ml', {
												fontSize : 16,
												decimals : 3,
												unitsFontSize : this.unitsFontSize
											});
										} else {
											return;
										}
									}
								}
							},
							{
								text : 'Vol. Well',
								dataIndex : 'Specimen_volume',
								width : 70,
								editor : {
									allowBlank : true
								},
								renderer : function(val, y, sample) {
									return BUI.formatValuesUnits(sample.data.Specimen_volume, '&#181l', {
										fontSize : 12,
										decimals : 2,
										unitsFontSize : this.unitsFontSize
									});
								}
							}, 
							// {
							// 	text : 'Position',
							// 	hidden : true,
							// 	flex : 1,
							// 	renderer : function(val, y, sample) {
							// 		return BUI.getSamplePositionHTML(sample.data, _this.experiment);
							// 	}
							// }, 
							{
								text : 'samplePlateId',
								dataIndex : 'SamplePlatePosition_samplePlateId',
								hidden : true
							}, 
							{
								text : 'Plate',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlate_slotPositionColumn',
								editor : _this._getSlotColumBombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) & (val != "")) {
										return val;
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								text : 'Row',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlatePosition_rowNumber',
								editor : this._getRowCombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) && (val != "")) {
										return BUI.getSamplePlateLetters()[val - 1];
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								text : 'Well',
								hidden : this.isPositionColumnHidden,
								dataIndex : 'SamplePlatePosition_columnNumber',
								editor : this._getColumnCombo(),
								flex : 1,
								renderer : function(val, meta, sample) {
									if ((val != null) && (val != "")) {
										return val;
									} else {
										meta.tdCls = 'yellow-cell';
									}
								}
							}, {
								id : _this.id + 'buttonEditSample',
								text : 'Edit',
								width : 80,
								sortable : false,
								hidden : !_this.editEnabled,
								renderer : function(value, metaData, record, rowIndex, colIndex, store) {
									if (_this.editEnabled) {
										return BUI.getGreenButton('EDIT');
									}
								}
							}, {
								id : _this.id + 'buttonRemoveSample',
								text : '',
								hidden : !_this.removeBtnEnabled,
								width : 100,
								sortable : false,
								renderer : function(value, metaData, record, rowIndex, colIndex, store) {
									if (_this.removeBtnEnabled) {
										return BUI.getRedButton('REMOVE');
									}
								}
							}

						],
						viewConfig : {
							preserveScrollOnRefresh : true,
							stripeRows : true,
							getRowClass : function(record) {
								var specimens = _.filter(_this.dataCollections,{"SamplePlatePosition_rowNumber":record.data.SamplePlatePosition_rowNumber,
																				"SamplePlatePosition_columnNumber":record.data.SamplePlatePosition_columnNumber,
																				"SamplePlatePosition_samplePlateId":record.data.SamplePlatePosition_samplePlateId});
								if (specimens.length > 1) {
									return 'red-row';

								}
							},
							listeners : {
								selectionchange : function(grid, selected) {
									_this.onClick.notify(record.data);
								},
								cellclick : function(grid, td, cellIndex, record, tr) {
									if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonEditSample') {
									}
									if (grid.getGridColumns()[cellIndex].getId() == _this.id + 'buttonRemoveSample') {
										grid.getStore().removeAt(rowIndex);
										_this.onRemoved.notify();
									}

								}

							}
						}
					});
	return this.grid;
};

SpecimenGrid.prototype.input = function() {
	return {
		experiment : DATADOC.getExperiment_10(),
		proposal : DATADOC.getProposal_10()
	};
};

SpecimenGrid.prototype.test = function(targetId) {
	var specimenGrid = new SpecimenGrid({
		height : 400,
		maxHeight : 400,
		width : 1000
	});
	BIOSAXS.proposal = new Proposal(specimenGrid.input().proposal);

	var experiment = new Experiment(specimenGrid.input().experiment);
	var panel = specimenGrid.getPanelByExperiment(experiment);
	panel.render(targetId);

};
