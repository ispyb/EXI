/**
* Interface implementing the API for phasing
*
* @class StatisticsDataAdapter
* @constructor
*/
function StatisticsDataAdapter(args){
	DataAdapter.call(this, args);
}

StatisticsDataAdapter.prototype.get = DataAdapter.prototype.get;
StatisticsDataAdapter.prototype.post = DataAdapter.prototype.post;
StatisticsDataAdapter.prototype.getUrl = DataAdapter.prototype.getUrl;


/**
* It retrieves the statistics url between the given dates
* @method getPhasingFilesByPhasingProgramAttachmentIdAsImage
* @param {String} type
* @param {String} startDate
* @param {String} endDate
*/
StatisticsDataAdapter.prototype.getStatisticsByDate = function(type,startDate,endDate){
	return this.getUrl('/{token}/stats/autoprocstatistics/{0}/{1}/{2}/csv'.format( [type,startDate,endDate]));                                                    
};

/**
* It retrieves the statistics url between the given dates for the given beamline
* @method getPhasingFilesByPhasingProgramAttachmentIdAsImage
* @param {String} type
* @param {String} startDate
* @param {String} endDate
* @param {String} beamline
*/
StatisticsDataAdapter.prototype.getStatisticsByDateAndBeamline = function(type,startDate,endDate,beamline){
	return this.getUrl('/{token}/stats/autoprocstatistics/{0}/{1}/{2}/csv?beamlinenames={3}'.format( [type,startDate,endDate,beamline]));                                                    
};


/**
* It retrieves the statistics url between the given dates
* @method getDatacollectionStatisticsByDate
* @param {String} imageslimit
* @param {String} startDate
* @param {String} endDate
* @param {String} testproposals
*/
StatisticsDataAdapter.prototype.getDatacollectionStatisticsByDate = function(imageslimit,startDate,endDate,testproposals){
	return this.getUrl('/{token}/stats/datacollectionstatistics/{0}/{1}/{2}/0/csv?testproposals={3}'.format( [imageslimit,startDate,endDate,testproposals]));
};

/**
* It retrieves the statistics url between the given dates for the given beamline
* @method getDatacollectionStatisticsByDateAndBeamline
* @param {String} imageslimit
* @param {String} startDate
* @param {String} endDate
* @param {String} testproposals
* @param {String} beamline
*/
StatisticsDataAdapter.prototype.getDatacollectionStatisticsByDateAndBeamline = function(imageslimit,startDate,endDate,testproposals,beamline){
	return this.getUrl('/{token}/stats/datacollectionstatistics/{0}/{1}/{2}/{3}/csv?testproposals={4}'.format( [imageslimit,startDate,endDate,beamline,testproposals]));
};


/**
* It retrieves the statistics url between the given dates
* @method getExperimentsStatisticsByDate
* @param {String} startDate
* @param {String} endDate
* @param {String} testproposals
*/
StatisticsDataAdapter.prototype.getExperimentsStatisticsByDate = function(startDate,endDate,testproposals){
	return this.getUrl('/{token}/stats/experimentstatistics/{0}/{1}/0/csv?testproposals={2}'.format( [startDate,endDate,testproposals]));
};

/**
* It retrieves the experiments statistics url between the given dates for the given beamline
* @method getExperimentsStatisticsByDateAndBeamline
* @param {String} startDate
* @param {String} endDate
* @param {String} testproposals
* @param {String} beamline
*/
StatisticsDataAdapter.prototype.getExperimentsStatisticsByDateAndBeamline = function(startDate,endDate,testproposals,beamline){
	return this.getUrl('/{token}/stats/experimentstatistics/{0}/{1}/{2}/csv?testproposals={3}'.format( [startDate,endDate,beamline,testproposals]));
};