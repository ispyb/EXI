function PrimaryDataMainView() {
	this.title = "Primary Data View";
	this.icon = 'images/icon/ic_blur_on_black_18dp.png';

	MainView.call(this);
	
	this.onMeasurementSelectionChange = new Event(this);
	
	var _this = this;
	
	this.frameSelectorGrid = new FrameSelectorGrid();
	this.frameSelectorGrid.onSelectionChange.attach(function(sender, selections){
        debugger
		_this.plotter.load(selections);
	});

	this.framesGrid = new FramesGrid();
	this.framesGrid.onSelectionChange.attach(function(sender, selections){
		_this.plotter.load(selections);
	});
	
	/** Curve plotter * */
	this.plotter = new CurvePlotter({
	});

	this.grid = new OverviewQueueGrid({height : 220});
	
	
	/** Abinitio **/
	this.abinitioForm = new AbinitioForm({
		height : 700
	});
	
}



PrimaryDataMainView.prototype.getSlavePanel = function() {
	return {
		xtype : 'container',
		layout : 'hbox',
		cls 	: 'defaultGridPanel',
		margin : 5,
		border : 0,
		defaults : {
			height : 600 
		},
		items : [
		         {
		        	 xtype : 'panel',
		        	 layout: {
		        	        type: 'accordion',
		        	        titleCollapse: false,
		        	        animate: true,
		        	        activeOnTop: true
		        	    },
		        	    flex : 0.1,
		        		border : 1,
		        		style : {
		        			borderColor : '#000000',
		        			borderStyle : 'solid',
		        			borderWidth : '1px' },
		        	 items : [
		        	        //   this.frameSelectorGrid.getPanel()
		        	         this.framesGrid.getPanel()
		        	          ]
		         },
		         this.plotter.getPanel()
		        
		    ]
	};
};



PrimaryDataMainView.prototype.getPanel = function() {
	return Ext.createWidget('tabpanel',
			{
				plain : true,
				layout : 'fit',
				margin : '10 0 0 0',
				items : [
					{
						tabConfig : {
							title : 'Primary Data Reduction'
						},
						items : [ {
							xtype : 'container',
							autoScroll : true,
							height : 700,
							// layout : 'fit',
							padding : 20,
							style : {
								borderColor : 'gray',
								borderStyle : 'solid',
								borderWidth : '1px',
								'background-color' : 'white' 
							},
							items : [ 
										{
											xtype : 'container',
											items : [
											         	this.grid.getPanel(),
											        	this.getSlavePanel()         
											]
										}
							]
						}

						]
					},
					{
						tabConfig : {
							title : 'Abinitio Modeling'
						},
						items : [ {
							xtype : 'container',
							layout : 'fit',
							autoScroll : true,
							padding : 20,
							style : {
								borderColor : 'gray',
								borderStyle : 'solid',
								borderWidth : '1px',
								'background-color' : 'white' 
							},
							items : [ 
										{
											xtype : 'container',
											items : [
											         	this.abinitioForm.getPanel()
											]
										}
							]
						}

						]
					}
			]
			});
};

PrimaryDataMainView.prototype.load = function(dataCollectionId) {
	var _this = this;
	

	var onSuccessA = function (sender, dataCollections) {        
		_this.grid.load(dataCollections);
		console.log(dataCollections);
		

		var onSuccessFrames = function (sender, averages){
			var allFrames = _.map(_.flatten(_.map(_.map(JSON.parse(averages), 'framelist3VO'), 'frametolist3VOs')), 'frame3VO');
			/** Retrieve subtraction */

			 var onSuccessSubtractions = function(sender, data) {				 				 
				 if (data){
					 if (data[0].substraction3VOs){
						 var subtraction = data[0].substraction3VOs[0];						 
						 var frameFromSampleAveraged = _.map(subtraction.sampleOneDimensionalFiles.frametolist3VOs, 'frame3VO');
						 var frameFromBufferAveraged = _.map(subtraction.bufferOneDimensionalFiles.frametolist3VOs, 'frame3VO');
						
						/** Identify discarded frames */
						for (var frameId in allFrames){
							var frame = allFrames[frameId];
							if (_.find(_.concat(frameFromSampleAveraged, frameFromBufferAveraged), {filePath : frame.filePath})){
								frame.discarded = false;
							}
							else{
								frame.discarded = true;								
							}
							frame.type = 'Frame';
						}
						allFrames = _.orderBy(allFrames, ['filePath'], ['asc']);
						allFrames.unshift({
							filePath : subtraction.substractedFilePath,
							frameId : subtraction.subtractionId,
							type : 'Subtraction'
						});
						allFrames.unshift({
							filePath : subtraction.bufferAverageFilePath,
							frameId : subtraction.subtractionId,
							type : 'BufferAverage'
						});
						allFrames.unshift({
							filePath : subtraction.sampleAverageFilePath,
							frameId : subtraction.subtractionId,
							type : 'SampleAverage'
						});
						_this.framesGrid.load(allFrames);
						// _this.frameSelectorGrid.load(data);	
						if (subtraction.subtractionId){
							var onSuccessSubtraction = function(sender, subtractions) {                 
								_this.abinitioForm.load(subtractions);
							};			
							EXI.getDataAdapter({onSuccess : onSuccessSubtraction}).saxs.subtraction.getSubtractionsBySubtractionIdList([subtraction.subtractionId]);			
						}
					 }
				 }
			 };

 			EXI.getDataAdapter({onSuccess : onSuccessSubtractions}).saxs.dataCollection.getDataCollectionsByDataCollectionId(dataCollectionId);
		}
		
		EXI.getDataAdapter({onSuccess : onSuccessFrames}).saxs.frame.getFramesByAverageId(_.map(dataCollections, 'Merge_mergeId'));

	}
	EXI.getDataAdapter({onSuccess : onSuccessA}).saxs.dataCollection.getDataCollectionsById(dataCollectionId);
    
    
	//  var onSuccess = function(sender, data) { 	
	//  	// _this.frameSelectorGrid.load(data);	
	// 	// _this.framesGrid.load(data);		 	
	//  	if (data[0].substraction3VOs[0].subtractionId){             
	//  		var onSuccessSubtraction = function(sender, subtractions) {                 
	//  			_this.abinitioForm.load(subtractions);
	//  		};			
	//  		EXI.getDataAdapter({onSuccess : onSuccessSubtraction}).saxs.subtraction.getSubtractionsBySubtractionIdList([data[0].substraction3VOs[0].subtractionId]);			
	// 	}
	//  };	    
	
	
	
};

