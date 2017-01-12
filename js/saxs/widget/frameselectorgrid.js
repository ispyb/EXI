function FrameSelectorGrid(args) {

	this.onSelectionChange = new Event(this);
}

/**
 * Fill the tree with information about the subtraction: samples, buffers,
 * averages and subtrated curve *
 */
FrameSelectorGrid.prototype.loadData = function(measurements, dataCollections) {
	var _this = this;
    
	/**
	 * Given a data collection return the run numbers, sample and buffer
	 * acronym *
	 */
	function getSubtractionTitleByDataCollection(dataCollection) {
        
		return  "DataCollection";
		/** Sorts datacollection by data collection order 
		dataCollection.measurementtodatacollection3VOs.sort(function(a, b) {
			return a.dataCollectionOrder - b.dataCollectionOrder;
		});
		for (var i = 0; i < dataCollection.measurementtodatacollection3VOs.length; i++) {
			function getMeasurementTitle(measurementId) {
				for (var i = 0; i < _this.measurements.length; i++) {
					if (_this.measurements[i].measurementId == measurementId) {
						if (_this.measurements[i].macromoleculeId != null) {
							return _this.measurements[i].macromoleculeAcronym + ":  " + _this.measurements[i].concentration + "mg/ml";
						}
						return "";
					};
				};
			};
			title = title + " " + getMeasurementTitle(dataCollection.measurementtodatacollection3VOs[i].measurementId);
		}
		return title;**/
	}

	/** Gets the sample and buffer frames * */
	function getChildren(dataCollection) {
		var children = [];
		function getTreeFromFrameList(OneDimensionalFiles) {
			var sampleFrames = [];
			if (OneDimensionalFiles.frametolist3VOs) {
				for (var j = 0; j < OneDimensionalFiles.frametolist3VOs.length; j++) {
					sampleFrames.push({
						text : OneDimensionalFiles.frametolist3VOs[j].frame3VO.filePath,
						type : "Frame",
						frameId : OneDimensionalFiles.frametolist3VOs[j].frame3VO.frameId,
						leaf : true });
				}
			}
			return sampleFrames;
		}

		if (dataCollection != null) {
			if (dataCollection.substraction3VOs != null) {
				dataCollection.substraction3VOs.sort(function(a, b) {
					return a.subtractionId - b.subtractionId
				});
				if (dataCollection.substraction3VOs.length > 0) {
					var lastSubtraction = dataCollection.substraction3VOs[dataCollection.substraction3VOs.length - 1];
					children.push({
						text : lastSubtraction.substractedFilePath,
						subtractionId : lastSubtraction.subtractionId,
						type : "Subtraction",
						leaf : true, }

					);
					children.push({
						text : lastSubtraction.sampleAverageFilePath,
						subtractionId : lastSubtraction.subtractionId,
						type : "SampleAverage",
						leaf : true, }

					);
					children.push({
						text : lastSubtraction.bufferAverageFilePath,
						subtractionId : lastSubtraction.subtractionId,
						type : "BufferAverage",
						leaf : true, }

					);

					if (lastSubtraction.sampleOneDimensionalFiles != null) {
						children.push({
							text : "Sample",
							leaf : false,
							type : 'Sample',
							children : getTreeFromFrameList(lastSubtraction.sampleOneDimensionalFiles, 'Sample') }

						);
					}
					if (lastSubtraction.bufferOneDimensionalFiles != null) {
						children.push({
							text : "Buffer",
							leaf : false,
							type : 'Buffer',
							children : getTreeFromFrameList(lastSubtraction.bufferOneDimensionalFiles, 'Buffer') }

						);
					}

				}
			}
		}
		return children;
	}

	var parsed = [];
	for (var i = 0; i < dataCollections.length; i++) {
		parsed.push({
			text : getSubtractionTitleByDataCollection(dataCollections[i]),
			leaf : false,
			children : getChildren(dataCollections[i]) });
	}

	_this.treePanel.setRootNode({
		expanded : true,
		children : parsed }
	);
};

FrameSelectorGrid.prototype.load = function(data) {
	var _this = this;
	this.measurements = data;
	this.subtractionIds = [];
	
	var dataCollectionIdList = [];
	if (this.measurements != null) {
		for (var i = 0; i < this.measurements.length; i++) {
			if (this.measurements[i].dataCollectionId != null) {
				dataCollectionIdList.push(this.measurements[i].dataCollectionId);
				this.subtractionIds.push(this.measurements[i].subtractionId);
			}
		}
	}
	this.subtractionIds = $.unique(this.subtractionIds);
	
	var onSuccess = (function(sender, data) {
		if (data != null) {
			_this.loadData(_this.measurements, data);
		}

	});
	EXI.getDataAdapter({onSuccess : onSuccess}).saxs.dataCollection.getDataCollectionsByDataCollectionId(dataCollectionIdList);

};

FrameSelectorGrid.prototype.getPanel = function() {
	var _this = this;
	this.store = Ext.create('Ext.data.TreeStore', {
		 proxy: {
		        type: 'memory'
		    },
		columns : [ {
			xtype : 'treecolumn', //this is so we know which column will show the tree
			text : 'Text',
			dataIndex : 'text' } ] });

	var selModel = Ext.create('Ext.selection.RowModel', {
		allowDeselect : true,
		mode : 'multi',
		listeners : {
			selectionchange : function(sm, selections) {
				var frameIds = [];
				var sampleAverages = [];
				var bufferAverages = [];
				var subtractions = [];
				if (selections != null) {
					for (var i = 0; i < selections.length; i++) {
						if (selections[i].data.type) {
							if (selections[i].data.type == "Frame") {
								frameIds.push(selections[i].data.frameId);
							}
							if (selections[i].data.type == "SampleAverage") {
								sampleAverages.push(selections[i].data.subtractionId);
							}
							if (selections[i].data.type == "BufferAverage") {
								bufferAverages.push(selections[i].data.subtractionId);
							}
							if (selections[i].data.type == "Subtraction") {
								subtractions.push(selections[i].data.subtractionId);
							}
						}
					}

					/** Event is only triggered if node is a leaf **/
					_this.onSelectionChange.notify({
						frame : frameIds,
						average : [],
						sampleaverage : sampleAverages,
						bufferaverage : bufferAverages,
						subtracted : subtractions });
				}

			}

		} });

	this.treePanel = Ext.create('Ext.tree.Panel', {
		title : 'Data Collections',
		selModel : selModel,
		store : this.store,
		rootVisible : false,
		buttons : [ {
			text : "Download",
			xtype : 'button',
			handler : function(sender) {
//				var params = _this.getParams();
				window.open(EXI.getDataAdapter().saxs.subtraction.getZip(_this.subtractionIds.toString()));
			}
		}],
		columns : [ {
			xtype : 'treecolumn',
			dataIndex : 'text',
			flex : 1,
			renderer : function(tree, opts, record) {
				if (record.data.leaf) {
					if (record.data.text.lastIndexOf("/") != -1) {
						return record.data.text.substr(record.data.text.lastIndexOf("/") + 1);
					}
				}
				return record.data.text;
			} } ]
//	,
//			dockedItems : [ {
//				dock : 'bottom',
//				xtype : 'toolbar',
//				height : 50,
//				items : [ {
//					glyph : 61,
//					xtype : 'button' }, '-', {
//					glyph : 88,
//					xtype : 'button' }, {
//					glyph : 70,
//					xtype : 'button' }, '-', {
//					text : 'Sent to idealized curve maker',
//					glyph : 1,
//					xtype : 'button' } ] } ] 
	});
	return this.treePanel;
};
