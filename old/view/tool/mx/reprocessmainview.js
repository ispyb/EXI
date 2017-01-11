function ReprocessMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	this.id = BUI.id();
	
	MainView.call(this);

	

	var _this = this;
}

ReprocessMainView.prototype.getToolDescription = function(name, description, reference) {
	return {
		html : "<span class='toolName'>" + name + "</span><span class='toolDescription'>" + description +
			"</span><br /><span class='toolReference'> " + reference + "</span>", 
		bodyStyle : {
			"background-color" : "#E6E6E6" },
		margin : 10 };
};


ReprocessMainView.prototype.getContainer = function() {
	var _this = this;
    
	return Ext.create(
					'Ext.form.Panel',
					{
						url : EXI.getDataAdapter().exi.offline.getToolUrl() + "/reprocess/run",
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
									value : '' 
                                },
                                {
									xtype : 'hiddenfield',
									id : _this.id + 'hiddenispyb',
									name : 'ispyb',
									value : ''
                                },    
                                    
								{
									xtype : 'hiddenfield',
									id : _this.id + 'pdbFileName',
									name : 'pdbFileName',
									value : '' },
									{
										xtype : 'hiddenfield',
										id : _this.id + 'mtzFileName',
										name : 'mtzFileName',
										value : '' },
								this.getToolDescription(
												"Reprocess : ",
												"This tool will reprocess the data collection and will integrate the images based in a given range of images",
												"Svensson, O., Monaco, S., Popov, A. N., Nurizzo, D. & Bowler, M. W. (2015). Fully automatic characterization and data collection from crystals of biological macromolecules, Acta Cryst. D71, 1757-1767"

										), 
										
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
                                    {
									    xtype: 'textfield',
									    name: 'start',
									    fieldLabel: 'start',
                                        id :  _this.id + 'start',
									    margin : 30,
									    allowBlank: false  
									},
                                    {
									    xtype: 'textfield',
									    name: 'end',
                                        id : _this.id + 'end',
									    fieldLabel: 'end',
									    margin : 30,
									    allowBlank: false  
									},
                                       {
									    xtype: 'textfield',
									    name: 'cutoff',
									    fieldLabel: 'cutoff',
									    margin : 30,
									    allowBlank: false  
									},
//									this.getFirstStepContainer(), 
								   /* {
										xtype : 'fileuploadfield',
										id : _this.id + 'mtzfileupload',
										width : 600,
										labelWidth : 150,
										margin : 30,
										fieldLabel : '<span class="toolPanelText">1) Upload MTZ</span>',
										cls : 'toolPanelText',
										name : 'mtz',
										hideLabel : false 
									}*/
									{
										xtype : 'fileuploadfield',
										id : _this.id + 'fileupload',
										width : 600,
										labelWidth : 150,
										margin : 30,
                                        hidden : true,
										fieldLabel : '<span class="toolPanelText">2) Upload PDB</span>',
										cls : 'toolPanelText',
										name : 'pdb',
										hideLabel : false 
									} 
                                    ],
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
										/*
										var mtzFileUploadFilePath = Ext.getCmp(_this.id + 'mtzfileupload').value;
										Ext.getCmp(_this.id + "mtzFileName").setValue(mtzFileUploadFilePath.split("\\")[mtzFileUploadFilePath.split("\\").length - 1]);
										*/
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

ReprocessMainView.prototype.getPanel = MainView.prototype.getPanel;


ReprocessMainView.prototype.load = function(dataCollectionId, start, end) {
	this.panel.setTitle("Reprocess");
    Ext.getCmp("dataCollectionId").setValue(dataCollectionId);
    
    Ext.getCmp(this.id + 'start').setValue(start);
    Ext.getCmp(this.id + 'end').setValue(Number(start)+Number(end) -1);
};
