function PrimaryDataMainView() {
	this.title = "Primary Data View";
	this.icon = 'images/icon/ic_blur_on_black_18dp.png';

	MainView.call(this);
	
	this.onMeasurementSelectionChange = new Event(this);
	
	var _this = this;

	this.framesGrid = new FramesGrid();
	this.framesGrid.onSelectionChange.attach(function(sender, selections){
		_this.plotter.load(selections);
	});
	
	/** Curve plotter * */
	this.plotter = new CurvePlotter({
	});

	this.grid = new OverviewQueueGrid({height : 220});				
}



PrimaryDataMainView.prototype.getSlavePanel = function() {
	return {
		xtype : 'container',
		layout : 'hbox',
		cls 	: 'defaultGridPanel',
		margin : 5,
		border : 0,
		defaults : {
			height : 400 
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
		        	    flex : 0.2,
		        		border : 1,
		        		style : {
		        			borderColor : '#000000',
		        			borderStyle : 'solid',
		        			borderWidth : '1px' },
		        	 items : [		        	        
		        	                this.framesGrid.getPanel()
		        	          ]
		         },
		         this.plotter.getPanel()		        
		    ]
	};
};

PrimaryDataMainView.prototype.getPanel = function() {
	return {
            xtype : 'container',
            autoScroll : true,							
            layout : 'fit',
            padding : 10,
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
        };
};

PrimaryDataMainView.prototype.load = function(dataCollectionId) {
	var _this = this;
	

	var onSuccessA = function (sender, dataCollections) {        
		_this.grid.load(dataCollections);
				
		var onSuccessFrames = function (sender, averages){
			var allFrames = _.map(_.flatten(_.map(_.map(JSON.parse(averages), 'framelist3VO'), 'frametolist3VOs')), 'frame3VO');
			/** Retrieve subtraction */

			 var onSuccessSubtractions = function(sender, data) {				 				 
				 if (data){
					 if (data[0].substraction3VOs){
						 var subtraction = data[0].substraction3VOs[0];
						 if (subtraction.sampleOneDimensionalFiles){			 
							var frameFromSampleAveraged = _.map(subtraction.sampleOneDimensionalFiles.frametolist3VOs, 'frame3VO');
							var frameFromBufferAveraged = _.map(subtraction.bufferOneDimensionalFiles.frametolist3VOs, 'frame3VO');
						 
							/** Identify discarded frames */
							for (var i in allFrames){
								var frame = allFrames[i];
								if (_.find(_.concat(frameFromSampleAveraged, frameFromBufferAveraged), {filePath : frame.filePath})){
									frame.discarded = false;
								}
								else{
									frame.discarded = true;								
								}
								frame.type = 'Frame';
								frame.domId = frame.frameId;
							}
						
							allFrames = _.orderBy(allFrames, ['filePath'], ['asc']);
							allFrames.unshift({
								filePath : subtraction.substractedFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'Subtraction',
								type : 'Subtraction'
							});
							allFrames.unshift({
								filePath : subtraction.bufferAverageFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'BufferAverage',
								type : 'BufferAverage'
							});
							allFrames.unshift({
								filePath : subtraction.sampleAverageFilePath,
								frameId : subtraction.subtractionId,
								domId : subtraction.subtractionId + 'SampleAverage',
								type : 'SampleAverage'
							});
							_this.framesGrid.load(allFrames);	
							// if (subtraction.subtractionId){
							// 	var onSuccessSubtraction = function(sender, subtractions) {                 
							// 		_this.abinitioForm.load(subtractions);
							// 	};			
							// 	EXI.getDataAdapter({onSuccess : onSuccessSubtraction}).saxs.subtraction.getSubtractionsBySubtractionIdList([subtraction.subtractionId]);			
							// }
						} else {
							_this.framesGrid.load(null);
						}
					 }
				 }
			 };
 			EXI.getDataAdapter({onSuccess : onSuccessSubtractions}).saxs.dataCollection.getDataCollectionsByDataCollectionId(dataCollectionId);
		}		
		EXI.getDataAdapter({onSuccess : onSuccessFrames}).saxs.frame.getFramesByAverageId(_.map(dataCollections, 'Merge_mergeId'));
	}
	EXI.getDataAdapter({onSuccess : onSuccessA}).saxs.dataCollection.getDataCollectionsById(dataCollectionId);
};

