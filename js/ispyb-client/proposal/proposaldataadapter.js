function ProposalDataAdapter(args){
	DataAdapter.call(this, args);
}

ProposalDataAdapter.prototype.get = DataAdapter.prototype.get;
ProposalDataAdapter.prototype.post = DataAdapter.prototype.post;
ProposalDataAdapter.prototype.getUrl = DataAdapter.prototype.getUrl;

ProposalDataAdapter.prototype.getProposals= function(){
	this.get('/{token}/proposal/list');
};

ProposalDataAdapter.prototype.getDewarByProposalId= function(){
	this.get('/{token}/proposal/{proposal}/shipping/dewar/list');
};

ProposalDataAdapter.prototype.getProposalsInfo= function(){
	// this.get('/{token}/proposal/{proposal}/technique/saxs/get');
	this.get('/{token}/proposal/{proposal}/info/get');
};


ProposalDataAdapter.prototype.getProposalBySessionId= function(sessionId){
	this.get('/{token}/proposal/session/{0}/list'.format([sessionId]));
};

ProposalDataAdapter.prototype.synchSMIS= function(){
	this.get('/{token}/proposal/{proposal}/update'.format([]));
};

ProposalDataAdapter.prototype.synchSMISByUsername= function(){
	this.get('/{token}/proposal/updateProposalsByToken');
};

ProposalDataAdapter.prototype.getLigandsByProposalId= function(){
	this.get('/{token}/proposal/{proposal}/ligands/list');
};

ProposalDataAdapter.prototype.saveStructure= function(){
	return this.getUrl('/{token}/proposal/{proposal}/structure/save');
};

ProposalDataAdapter.prototype.update= function(){
	if (EXI != null){
		if (EXI.proposalManager != null){
			this.onSuccess.attach(function(sender, proposals){
				localStorage.setItem("proposals", JSON.stringify(proposals));
			});
			/** This makes that this attach will be executed in first position **/
			this.onSuccess._listeners.reverse();
		}
	}
	this.getProposalsInfo();
};

