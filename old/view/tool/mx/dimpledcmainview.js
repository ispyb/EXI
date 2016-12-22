function DimpleDCMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	this.id = BUI.id();
	
	MainView.call(this);

	

	var _this = this;
}

DimpleDCMainView.prototype.getToolDescription = function(name, description, reference) {
	return {
		html : "<span class='toolName'>" + name + "</span><span class='toolDescription'>" + description +
			"</span><br /><span class='toolReference'> " + reference + "</span>", 
		bodyStyle : {
			"background-color" : "#E6E6E6" },
		margin : 10 };
};


DimpleDCMainView.prototype.getContainer = function() {
	var _this = this;
    
	return Ext.create(
					'Ext.form.Panel',
					{
						url : EXI.getDataAdapter().exi.offline.getToolUrl() + "/dimpledc/run",
						height : 800,
						margin : 30,
						border : 1,
						bodyStyle : {
							"background-color" : "#E6E6E6" },
						style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
						bodypadding : 10,
						items : [
								
								{
									xtype : 'hiddenfield',
									id : _this.id + 'hiddenProject',
									name : 'projectId',
									value : '' },
								{
									xtype : 'hiddenfield',
									id : _this.id + 'pdbFileName',
									name : 'pdbFileName',
									value : '' },
								{
									xtype : 'hiddenfield',
									id : _this.id + 'autoprocintegrationURL',
									name : 'autoprocintegrationURL',
									value : '' },
                                {
									xtype : 'hiddenfield',
									id : _this.id + 'autoProcAttachmentURL',
									name : 'autoProcAttachmentURL',
									value : '' },	
                                 {
									xtype : 'hiddenfield',
									id : _this.id + 'downloadAutoProcProgramAttachementURL',
									name : 'downloadAutoProcProgramAttachementURL',
									value : '' },	
								this.getToolDescription(
												"DIMPLE (DIfference Map PipeLinE) : ",
												"DIMPLE is an automated software pipeline for rapidly processing crystals that contain a known protein and possibly a ligand bound to this protein. The main goal is to present a user with a quick answer to the question of whether or not they have a bound ligand or drug candidate in their crystal. The software is developed primarily for use at synchrotron beamlines, but can be used also for in-house automation. DIMPLE takes the already known \"apo\" structure for the target protein and compares it with the electron density map for the same, crystallised structure (and possibly bound ligand) interpreted from the X-ray diffraction images. It then presents the user with a set of snapshot images illustrating the regions where there are large areas of electron density unaccounted for by the protein structure model. Within a few seconds, an experienced user can decipher from these images if any of this unaccounted for density indicates a bound ligand. A positive result can mean that the rest of the batch of crystals for this particular ligand can be discarded allowing for a more efficient use of the beam time and saving the user from lots of potentially unnecessary processing.",
												"Current version: Ronan Keegan, Marcin Wojdyr. Previous versions: Graeme Winter, George Pelios "

										), 
									 {
									xtype : 'hiddenfield',
									id : _this.id + 'hiddenispyb',
									name : 'ispyb',
									value : ''
                                    },   	
									{
									    xtype: 'textfield',
									    name: 'name',
									    fieldLabel: 'Name',
									    margin : 30,
									    allowBlank: false  
									},
									{
								        xtype     : 'textareafield',
								        grow      : true,
								        margin : 30,
									    allowBlank: false , 
								        name      : 'message',
								        fieldLabel: 'Description',
								        anchor    : '100%'
								    },
                                     {
									    xtype: 'textfield',
									    name: 'dataCollectionId',
									    fieldLabel: 'dataCollectionId',
                                         id: 'dataCollectionId',
									    margin : 30,
									    allowBlank: false  
									},
//									this.getFirstStepContainer(), 

									{
										xtype : 'fileuploadfield',
										id : _this.id + 'fileupload',
										width : 600,
										labelWidth : 150,
										margin : 30,
										fieldLabel : '<span class="toolPanelText">2) Upload PDB</span>',
										cls : 'toolPanelText',
										name : 'pdb',
										hideLabel : false 
									} ],
						buttons : [ {
							text : 'Run',
							handler : function() {
								var form = this.up('form').getForm();
								if (form.isValid()) {
									
									var onSuccess = function(sender, projects){
										
										Ext.getCmp(_this.id + "hiddenProject").setValue(projects[0].internalId);
                                        Ext.getCmp(_this.id + "hiddenispyb").setValue(EXI.credentialManager.getConnections()[0].url);
										
										var fileUploadFilePath = Ext.getCmp(_this.id + 'fileupload').value;
										Ext.getCmp(_this.id + "pdbFileName").setValue(fileUploadFilePath.split("\\")[fileUploadFilePath.split("\\").length - 1]);
                                        Ext.getCmp(_this.id + "autoprocintegrationURL").setValue( EXI.getDataAdapter().mx.autoproc.getViewByDataCollectionURL(Ext.getCmp("dataCollectionId").getValue()));
                                        
                                        Ext.getCmp(_this.id + "autoProcAttachmentURL").setValue(EXI.getDataAdapter().mx.autoproc.getAttachmentListByautoProcProgramsIdListURL("%autoprocprogramIds%"));
                                        Ext.getCmp(_this.id + "downloadAutoProcProgramAttachementURL").setValue(EXI.getDataAdapter().mx.autoproc.getDownloadAttachmentUrl("%autoProcAttachmentId%"));
                                        
                                       
										debugger
										
										function onSubmitted(){
											location.hash = "/tool/list";
										}
										
										form.submit({
											waitMsg : 'Sending job to server...',
											success : function(form, action) {
												 onSubmitted();
											},
											failure : function(form, action) {
												 onSubmitted();
											} });
									
									};
									var onError = function(sender, error){
									
									};
                                    
									EXI.getDataAdapter({onSuccess : onSuccess, onError :onError}).exi.offline.getProject();
								}
							} }
						] });
};

DimpleDCMainView.prototype.getPanel = MainView.prototype.getPanel;


DimpleDCMainView.prototype.load = function(dataCollectionId) {
	this.panel.setTitle("Dimple");
    
    Ext.getCmp("dataCollectionId").setValue(dataCollectionId);
};
