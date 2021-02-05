/**
 * @showTitle
 *
 * #onSaved
 * #onAddPlates
 * #onRemovePlates
 **/
function ReimbForm(args) {
	this.id = BUI.id();
	this.width = 800;
	this.showTitle = true;
	if (args != null) {
		if (args.showTitle != null) {
			this.showTitle = args.showTitle;
		}
	}
	this.fedexAccount = '388310561 ';	
	this.fedexCode = 'fedexCode';				
	this.boxLabel3 = 'I agree, please set this parcel to reimbursed';
	
	this.onSaved = new Event(this);				
}

ReimbForm.prototype.fillStores = function() {
	var _this = this;
	this.panel.setLoading("Loading Labcontacts from database");

	var proposal = BUI.getProposal();
	proposal.onDataRetrieved.attach(function(sender, data) {
		_this.labContactForSendingStore.loadData(data, false);
		_this.labContactForReturnStore.loadData(data, false);
		_this.panel.setLoading(false);
	});
	proposal.getLabContactsByProposalId();

};

ReimbForm.prototype.refresh = function(dewar) {
	this.setDewar(dewar);
};

ReimbForm.prototype.getDewar = function() {
	this.dewar.isReimbursed = Ext.getCmp(this.id + "dewar_isReimbursed").getValue();
	return this.dewar;
};

ReimbForm.prototype.setDewar = function(dewar) {
	dewar["sessionId"] = dewar.firstExperimentId;
	this.dewar = dewar;
	
	if (this.dewar == null){
		this.dewar={};
		this.dewar["isReimbursed"] = "";
	}
	
	Ext.getCmp(this.id + "dewar_isReimbursed").setValue(this.dewar.isReimbursed);
};

ReimbForm.prototype.getCurrentReimbursedDewars = function(dewars) {
	return _.filter(dewars, function(o){ return o.isReimbursed == true}).length;	
};

ReimbForm.prototype.hideReimbursedButton = function(shipment, dewar){
	this.maxReimb = 0;
	if (shipment) {
		if (shipment.sessions.length > 0){
			this.maxReimb = shipment.sessions[0].nbReimbDewars;
		}
	}	
	if (dewar.isReimbursed) 
		return false;
	if (this.getCurrentReimbursedDewars(shipment.dewarVOs) < this.maxReimb){
		return false;
	}
	return true;
}

ReimbForm.prototype.getBoxLabelText = function(shipment, dewar){
	
	boxLabelText = '<center>Declaration</center>';
	
	if (this.hideReimbursedButton(shipment, dewar) == true){
		boxLabelText = "<span style='color:orange'>You are not authorized to select another parcel to be reimbursed</span>";
	}
	return boxLabelText;
}

ReimbForm.prototype.getDeclarationText = function(shipment, dewar){
	if (this.hideReimbursedButton(shipment, dewar) == true){
		return ' ';
	}
	
	if (shipment){
		startDate = moment(shipment.sessions[0].startDate).format("DD-MM-YYYY");
		this.fedexCode = shipment.sessions[0].proposalVO.code + "-" + shipment.sessions[0].proposalVO.number + "/" 
		+ shipment.sessions[0].beamlineName + "/" + startDate;
	}
	boxLabel1 = '<br>By setting this parcel to reimbursed, the labels that will be generated for sending the parcel by courier will use the ESRF account. '
	+ '<br>You MUST NOT use this account to ship more than the allowed number of parcels, or any other equipment for this or any other experiment. '
	+ ' Any abuse of this account will immediately result in your proposal being refused access to the parcel reimbursement procedure, and eventually to the ESRF beamlines. '
	+ '<br><br>' ;
		
	var html = 	boxLabel1 + 'For ESRF reimbursement, you MUST: '
	+ '<br> * Copy and paste the following information into the courier service request form'
	+ '<br> &nbsp;&nbsp; - FedEx Account Number : '+ this.fedexAccount
	+ '<br> &nbsp;&nbsp; - Your Reference : '+ this.fedexCode
	+ '<br> * Tick \"the Include a return label\" box.'
	+ '<br> <br>Please click on the following checkbox if you agree with these conditions and you wish to have this parcel automatically reimbursed by the ESRF. '
	+ '<br><br>' ;
	
	return html;
}

ReimbForm.prototype.getPanel = function(dewar, shipment) {
	
		this.panel = Ext.create('Ext.form.Panel', {
			width : this.width - 10,
			title : this.getBoxLabelText(shipment, dewar),
			padding : 10,
			height : 500,
			items : [ 		
				{     													
					html: this.getDeclarationText(shipment, dewar),					
				},
				{           
					xtype: 'checkbox',
					fieldLabel : 'fieldlabel',
					boxLabel : this.boxLabel3,
					hideLabel: true,
					name : 'isReimbursed',
					id : this.id + 'dewar_isReimbursed',
					trueText: 'true',
					falseText: 'false' ,
					hidden : this.hideReimbursedButton(shipment, dewar)
				}
					
			]			
		});

	this.refresh(dewar);
	return this.panel;
};
