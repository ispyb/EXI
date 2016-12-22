function SubtractionMainView() {
	this.title = "Experiment";
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	this.queueGridList = [];

	this.id = BUI.id();
	MainView.call(this);

	this.subtractionSelectorWindow = new SubtractionSelectorWindow();
	
	var _this = this;
	
	this.subtractionSelectorWindow.onSelect.attach(function(sender, selected){
		_this.grid.store.removeAll();
		_this.grid.load(selected);
		Ext.getCmp(_this.id + "hiddenSutractions").setValue(JSON.stringify(selected[0].subtractionId));
		
		
	}) ;
	
	
	this.grid = new QueueGrid({
		maxHeight : 120,
		minHeight : 120,
		title : false,
		collapsible : false
	});
}

SubtractionMainView.prototype.getPanel = MainView.prototype.getPanel;

SubtractionMainView.prototype.getToolDescription = function(name, description, reference) {
	return {
		html : "<span class='toolName'>" + name +"</span><span class='toolDescription'>" + description +"</span><br /><span class='toolReference'> " + reference + "</span>",
		bodyStyle:{"background-color":"#E6E6E6"},
		margin : 10
	};
};

SubtractionMainView.prototype.getFirstStepContainer = function() {
	var _this = this;
	return {
		xtype : 'container',
		height : 250,
		items : [
		         
		         {
		        	 xtype : 'container',
		        	 layout : 'hbox',
		        	 margin : 20,
		        	 
		        	 height : 50,
		        	 items : [
		        	          {
		        	        	  html : "<span class='toolPanelText'>1) Select a Data Collection</span>",
		        	        	  margin : "5 0 0 20",
		        	        	  bodyStyle:{"background-color":"#E6E6E6"}
		        	          },
		        	          {
		        	        	  xtype : "button",
		        	        	  text: 'Select',
		        	        	  width :  150,
		        	        	  margin : "0 0 0 20",
		        	        	  handler: function() {
		        	        	        _this.subtractionSelectorWindow.show();
		        	        	  }
		        	          }
		        	 ]
		         },
		         this.grid.getPanel()
		        
		]
	};
	
};


SubtractionMainView.prototype.getContainer = function() {
var _this = this;
return Ext.create('Ext.form.Panel', {
	height : 500,
	margin : 30,
	border : 1,
    bodyStyle:{"background-color":"#E6E6E6"},
    bodypadding : 10,
    items: [
	            {
		             xtype: 'hiddenfield',
		             id : _this.id + 'hiddenSutractions',
		             name: 'subtractionId',
		             value: ''
		         },
		         {
		             xtype: 'hiddenfield',
		             id : _this.id +'hiddenProject',
		             name: 'projectId',
		             value: ''
		         },
		         {
		             xtype: 'hiddenfield',
		             id : _this.id +'pdbFileName',
		             name: 'pdbFileName',
		             value: ''
		         },
				this.getToolDescription(
							"CRYSOL: ",
							"Evaluation of the solution scattering from macromolecules with known atomic structure and fitting to experimental data",
							"Written by D. Svergun, C. Barberato, M. Malfois, V. Volkov, P. Konarev1, M. Petoukhov & A. Shkumatov"
							
				),
				this.getFirstStepContainer(),
				{
					xtype : 'fileuploadfield',
					id : _this.id + 'fileupload',
					width: 600,
					labelWidth : 150,
					margin : 30,
					fieldLabel: '<span class="toolPanelText">2) Upload PDB</span>',
					cls : 'toolPanelText',
				    name: 'file',
				    hideLabel: false
				}
	],
    buttons: [{
        text: 'Run',
        handler: function(){
            var form = this.up('form').getForm();
            if(form.isValid()){
            	Ext.getCmp(_this.id + "hiddenProject").setValue(exiSAXS.localExtorage.userManager.getActiveProject().internalId);
            	var fileUploadFilePath = Ext.getCmp(_this.id + 'fileupload').value;
            	Ext.getCmp(_this.id + "pdbFileName").setValue(fileUploadFilePath.split("\\")[fileUploadFilePath.split("\\").length - 1]);
                form.submit({
                    url: new ExiDataAdapter().server +'/token/tool/crysol/run',
                    waitMsg: 'Sending job to server...',
                    success: function(fp, o) {
                        msg('Success', 'Processed file "' + o.result.file + '" on the server');
                    },
                    failure: function(fp, o) {
                    	
                        msg('Failure', 'Processed file "' + o.result.file + '" on the server');
                    }
                });
            }
        }
    }
    ]
});
};

SubtractionMainView.prototype.load = function() {
	this.panel.setTitle("Subtraction Tool");
};
















