/**
* Class used to manage the common points for a single or several proposals. It deals with methods to help the management of crystals, proteins, macromolecules, buffer, stockSolutions and labcontacts
*
* @class ProposalManager
* @constructor
*/
function ProposalManager() {
    this.onActiveProposalChanged = new Event(this);
}


/**
* It gets the information of the proposals that are found on the local Storage in the field called proposal. If it does not exist it will load form the server and store them on the local storage
* @method get
* @param {Boolean} forceUpdate if true the proposals information will be reloaded from the server asyncrhonously
*/
ProposalManager.prototype.get = function(forceUpdate) {
    var _this = this;
	if ((localStorage.getItem("proposals") == null)||(forceUpdate)){
       
		var onSuccess= function(sender, proposals){
			localStorage.setItem("proposals", JSON.stringify(proposals));
            _this.onActiveProposalChanged.notify();
		};
		EXI.getDataAdapter({async : true, onSuccess : onSuccess}).proposal.proposal.getProposalsInfo();
	}	
  
	return JSON.parse(localStorage.getItem("proposals"));
};

/**
* It removes the information from the local storage. It means it remove the proposals item
* @method clear
*/
ProposalManager.prototype.clear = function() {
	localStorage.removeItem('proposals');
};

/**
* It gets a list of sessions from the local storage or retrieve them from the server if the proposals have not been loaded yet. It is synchronous.
* @method getSessions
*/
ProposalManager.prototype.getSessions = function() {
	if (localStorage.getItem("sessions") == null){
		var onSuccess= function(sender, sessions){
			localStorage.setItem("sessions", JSON.stringify(sessions));
		};
		EXI.getDataAdapter({async : false, onSuccess : onSuccess}).proposal.session.getSessions();
	}
	return JSON.parse(localStorage.getItem("sessions"));
};

/**
* It gets a list of sessions which start date comes after today.
* @method getFutureSessions
*/
ProposalManager.prototype.getFutureSessions = function() {
	var sessions = this.getSessions();
	var today = moment();
	var futureSessions = [];
	for (var i = 0; i < sessions.length; i++) {        
		if (today.diff(sessions[i].BLSession_startDate) < 0){
			futureSessions.push(sessions[i]);
		}
	}
	return futureSessions;
};

/**
* It gets a list of colors
* @method getBufferColors
*/
ProposalManager.prototype.getBufferColors = function() {
	return [ "#ffffcc", "#c7e9b4", "#7fcdbb", "#41b6c4", "#2c7fb8", "#253494" ];
};

/**
* It gets a list of labcontacts from the current proposal
* @method getLabcontacts
*/
ProposalManager.prototype.getLabcontacts = function() {
	return this.get()[0].labcontacts;
};

/**
* @method getLabcontactById
*/
ProposalManager.prototype.getLabcontactById = function(labContactId) {
	return _.find(this.getLabcontacts(), function(o) { return o.labContactId == labContactId; });
};

/**
* @method getPlateTypeById
*/
ProposalManager.prototype.getPlateTypeById = function(plateTypeId) {
	return _.find(this.getPlateTypes(), function(o) { return o.plateTypeId == plateTypeId; });
};

/**
* @method getPlateTypes
*/
ProposalManager.prototype.getPlateTypes = function() {
	return this.get()[0].plateTypes;
};

/**
* This methods is supposed to retrieve the plate configuration by flavour. However, it is not used yet
* @method getPlateByFlavour
*/
ProposalManager.prototype.getPlateByFlavour = function(flavour) {
	return [ this.getPlateTypes()[0], this.getPlateTypes()[2], this.getPlateTypes()[3] ];
};

/**
* @method getBufferById
*/
ProposalManager.prototype.getBufferById = function(bufferId) {
	var proposals = this.get();
	var f = function(o) { return o.bufferId == bufferId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].buffers, f);
		if (found != null) {return found;}
	}
};

/**
* @method getMacromoleculeById
*/
ProposalManager.prototype.getMacromoleculeById = function(macromoleculeId) {
	var proposals = this.get();
	var f = function(o) { return o.macromoleculeId == macromoleculeId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].macromolecules, f);
		if (found != null) {return found;}
	}
	return null;
};

/**
* @method getMacromoleculeByAcronym
*/
ProposalManager.prototype.getMacromoleculeByAcronym = function(acronym) {
	var proposals = this.get();
	var f = function(o) { return o.acronym == acronym; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].macromolecules, f);
		if (found != null) {return found;}
	}
	return null;
};

/**
* @method getStockSolutionById
*/
ProposalManager.prototype.getStockSolutionById = function(stockSolutionId) {
	var proposals = this.get();
	var f = function(o) { return o.stockSolutionId == stockSolutionId; };
	for (var i = 0; i < proposals.length; i++) {
		var found = _.find(proposals[i].stockSolutions, f);
		if (found != null) {return found;}
	}
};

/**
* @method getBuffers
*/
ProposalManager.prototype.getBuffers = function() {
	var proposals = this.get();
	var buffers = [];
	for (var i = 0; i < proposals.length; i++) {
		buffers = buffers.concat(proposals[i].buffers);
	}
	return buffers;
};

/**
* @method getMacromolecules
*/
ProposalManager.prototype.getMacromolecules = function() {
	var proposals = this.get();
	var macromolecules = [];
	for (var i = 0; i < proposals.length; i++) {
		macromolecules = macromolecules.concat(proposals[i].macromolecules);
	}
	return macromolecules;
};

/**
* @method getProposals
*/
ProposalManager.prototype.getProposals = function() {
	var proposals = this.get();
	var result = [];
	for (var i = 0; i < proposals.length; i++) {
		proposals[i].proposal[0]["proposal"] = proposals[i].proposal[0].code + proposals[i].proposal[0].number;
		result = result.concat(proposals[i].proposal);
	}
	return result;
};

/**
* @method getProposalById
*/
ProposalManager.prototype.getProposalById = function(proposalId) {
	var proposals = this.get();
	var result = [];
	for (var i = 0; i < proposals.length; i++) {
		if (proposals[i].proposal[0].proposalId == proposalId){
			return proposals[i].proposal[0];
		}
	}
	return result;
};

/**
* @method getStockSolutions
*/
ProposalManager.prototype.getStockSolutions = function() {
	return this.get()[0].stockSolutions;
};

/**
* @method getProteins
*/
ProposalManager.prototype.getProteins = function() {
	return this.get()[0].proteins;
};

/**
* @method getCrystals
*/
ProposalManager.prototype.getCrystals = function() {
	return this.get()[0].crystals;
};

/**
* @method getProteinByAcronym
*/
ProposalManager.prototype.getProteinByAcronym = function(acronym) {
	return _.filter(this.getProteins(), function(o) { return o.acronym == acronym; });
};

/**
* @method getCrystalsByAcronym
*/
ProposalManager.prototype.getCrystalsByAcronym = function(acronym) {
	return _.filter(this.getCrystals(), 
						function(o) { 
								if (o.proteinVO == null) {return false;} 
								else {return o.proteinVO.acronym == acronym;} 
						}
	);
};

/**
* @method getStockSolutionsBySpecimen
*/
ProposalManager.prototype.getStockSolutionsBySpecimen = function(macromoleculeId, bufferId) {
	var aux = _.filter(this.getStockSolutions(), function(o) { return o.macromoleculeId == macromoleculeId; });
	return _.filter(aux, function(o) { return o.bufferId == bufferId; });
};

/**
* @method getUnpackedStockSolutions
*/
ProposalManager.prototype.getUnpackedStockSolutions = function() {
	var stockSolutions = this.getStockSolutions();
	var result = [];
	for (var i = 0; i < stockSolutions.length; i++) {
		if (stockSolutions[i].boxId == null) {
			result.push(stockSolutions[i]);
		}
	}
	return result;
};

/**
* @method getStockSolutionsByDewarId
*/
ProposalManager.prototype.getStockSolutionsByDewarId = function(dewarId) {
	return _.filter(this.getStockSolutions(), function(o) { return o.boxId == dewarId; });
};
