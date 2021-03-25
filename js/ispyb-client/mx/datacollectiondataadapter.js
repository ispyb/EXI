/**
* @class DataCollectionDataAdapter
* @constructor
*/
function DataCollectionDataAdapter(args){
	DataAdapter.call(this, args);
}

DataCollectionDataAdapter.prototype.get = DataAdapter.prototype.get;
DataCollectionDataAdapter.prototype.post = DataAdapter.prototype.post;
DataCollectionDataAdapter.prototype.getUrl = DataAdapter.prototype.getUrl;


/**
* @method getBySessionsId
*/
DataCollectionDataAdapter.prototype.getBySessionsId= function(sessionsId){
	 this.get('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/list'.format( [sessionsId.toString()]));
};

/**
* @method getByDataCollectionId
*/
DataCollectionDataAdapter.prototype.getByDataCollectionId= function(dataColletionIds){
	 this.get('/{token}/proposal/{proposal}/mx/datacollection/{0}/list'.format( [dataColletionIds.toString()]));
};

/**
* @method getByAcronymList
*/
DataCollectionDataAdapter.prototype.getByAcronymList= function(acronymList){
	 this.get('/{token}/proposal/{proposal}/mx/datacollection/protein_acronym/{0}/list'.format( [acronymList.toString()]));
};

/**
* @method getBySampleId
*/
DataCollectionDataAdapter.prototype.getBySampleId= function(sampleId){
    this.get('/{token}/proposal/{proposal}/mx/datacollection/sample/{0}/list'.format( [sampleId]));
};

/**
* @method getByShippingId
*/
DataCollectionDataAdapter.prototype.getByShippingId= function(shippingId){
    this.get('/{token}/proposal/{proposal}/shipping/{0}/datacollections/list'.format( [shippingId]));
};

/**
* @method getDataCollectionViewBySessionId
*/
DataCollectionDataAdapter.prototype.getDataCollectionViewBySessionId= function(sessionId){
	 this.get('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/list'.format( [sessionId.toString()]));
};

/**
* @method getThumbNailById
*/
DataCollectionDataAdapter.prototype.getThumbNailById= function(imageId){
	return this.getUrl('/{token}/proposal/{proposal}/mx/image/{0}/thumbnail'.format([ imageId]));
};

/**
* @method getImageById
*/
DataCollectionDataAdapter.prototype.getImageById= function(imageId){
	return this.getUrl('/{token}/proposal/{proposal}/mx/image/{0}/get'.format([ imageId]));
};

/**
* @method getWilsonPlot
*/
DataCollectionDataAdapter.prototype.getWilsonPlot= function(dataCollectionId){
	return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/{0}/wilson'.format([ dataCollectionId]));
};

/**
* @method getWilsonPlot
*/
DataCollectionDataAdapter.prototype.getQualityIndicatorPlot= function(dataCollectionId){
	return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/{0}/qualityindicatorplot'.format([ dataCollectionId]));
};


/**
* @method getCrystalSnapshotByDataCollectionId
*/
DataCollectionDataAdapter.prototype.getCrystalSnapshotByDataCollectionId= function(dataCollectionId, id){
	return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/{0}/crystalsnaphot/{1}/get'.format([ dataCollectionId, id]));
};


/**
* @method getDataCollectionByDataCollectionGroupId 
*/
DataCollectionDataAdapter.prototype.getDataCollectionsByDataCollectionGroupId = function(datacollectiongroupid){	
    this.get('/{token}/proposal/{proposal}/mx/datacollection/datacollectiongroupid/{0}/list'.format([ datacollectiongroupid.toString()]));
};

/**
* This method updates the comments for a dataCollection
* @method saveComments
*/
DataCollectionDataAdapter.prototype.saveComments = function(dataCollectionId,comments){
    var url = ('/{token}/proposal/{proposal}/mx/datacollection/{0}/comments/save'.format([dataCollectionId]));
	this.post(url, {
		comments : comments
	});
};

/**
* This method downloads a PDF report for the session
* @method getReportURLBySessionId
*/
DataCollectionDataAdapter.prototype.getReportURLBySessionId = function(sessionId){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/report/pdf'.format([sessionId]));

};

/**
* This method sends by email the PDF report for the session
* @method sendPdfReport
*/
DataCollectionDataAdapter.prototype.sendPdfReport = function(sessionId){
    var url = ('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/report/send/pdf'.format([sessionId]));
	return this.getUrl(url);
};

/**
* This method downloads a RTF report for the session
* @method getRtfReportURLBySessionId
*/
DataCollectionDataAdapter.prototype.getRtfReportURLBySessionId = function(sessionId){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/report/rtf'.format([sessionId]));

};

/**
* This method downloads a PDF report for the session with analysis results
* @method getAnalysisReportURLBySessionId
*/
DataCollectionDataAdapter.prototype.getAnalysisReportURLBySessionId = function(sessionId){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/analysisreport/pdf'.format([sessionId]));

};

/**
* This method downloads a RTF report for the session with analysis results
* @method getRtfAnalysisReportURLBySessionId
*/
DataCollectionDataAdapter.prototype.getRtfAnalysisReportURLBySessionId = function(sessionId){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/session/{0}/analysisreport/rtf'.format([sessionId]));
};

/**
* This method downloads a PDF report for a filter parameter
* @method getReportURLByFilterParam
*/
DataCollectionDataAdapter.prototype.getReportURLByFilterParam = function(filterParam){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/filterParam/{0}/report/pdf'.format([filterParam]));

};

/**
* This method downloads a RTF report for a filter parameter
* @method getRtfReportURLByFilterParam
*/
DataCollectionDataAdapter.prototype.getRtfReportURLByFilterParam = function(filterParam){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/filterParam/{0}/report/rtf'.format([filterParam]));

};

/**
* This method downloads a CSV summary for a filter parameter
* @method getCSVReportURLByFilterParam
*/
DataCollectionDataAdapter.prototype.getCSVReportURLByFilterParam = function(filterParam){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/filterParam/{0}/report/csv'.format([filterParam]));

};

/**
* This method downloads a PDF report for a filter parameter with analysis results
* @method getAnalysisReportURLByFilterParam
*/
DataCollectionDataAdapter.prototype.getAnalysisReportURLByFilterParam = function(filterParam){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/filterParam/{0}/analysisreport/pdf'.format([filterParam]));

};

/**
* This method downloads a RTF report for a filter parameter with analysis results
* @method getRtfAnalysisReportURLByFilterParam
*/
DataCollectionDataAdapter.prototype.getRtfAnalysisReportURLByFilterParam = function(filterParam){
   return this.getUrl('/{token}/proposal/{proposal}/mx/datacollection/filterParam/{0}/analysisreport/rtf'.format([filterParam]));
};








