function MXManagerMenu() {
	this.id = BUI.id();
	ManagerMenu.call(this, {isHidden : false, cssClass : 'mainMenu'});
}

MXManagerMenu.prototype.populateCredentialsMenu = ManagerMenu.prototype.populateCredentialsMenu;
MXManagerMenu.prototype.init = ManagerMenu.prototype.init;
MXManagerMenu.prototype.getPanel = ManagerMenu.prototype.getPanel;
MXManagerMenu.prototype._convertToHTMLWhiteSpan = ManagerMenu.prototype._convertToHTMLWhiteSpan;
MXManagerMenu.prototype.getAddCredentialMenu = ManagerMenu.prototype.getAddCredentialMenu;
MXManagerMenu.prototype.getLoginButton = ManagerMenu.prototype.getLoginButton;
MXManagerMenu.prototype.setText = ManagerMenu.prototype.setText;
MXManagerMenu.prototype.getHelpMenu = ManagerMenu.prototype.getHelpMenu;
MXManagerMenu.prototype.getHomeItem = ManagerMenu.prototype.getHomeItem;
MXManagerMenu.prototype.getShipmentItem = ManagerMenu.prototype.getShipmentItem;
MXManagerMenu.prototype.getPreparationMenu = ManagerMenu.prototype.getPreparationMenu;
MXManagerMenu.prototype.getDataReductionMenu = ManagerMenu.prototype.getDataReductionMenu;
MXManagerMenu.prototype.getDataExplorerMenu = ManagerMenu.prototype.getDataExplorerMenu;
MXManagerMenu.prototype.getOnlineDataAnalisysMenu = ManagerMenu.prototype.getOnlineDataAnalisysMenu;

MXManagerMenu.prototype.getMenuItems = function() {	
    		
	return [	
    	this.getHomeItem(),
    	this.getShipmentItem(),
    	{
                text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
                cls : 'ExiSAXSMenuToolBar',
                disabled : false,
                handler : function(){
                    location.hash = "/mx/prepare/main";
                
				}
		},
		{
				text : this._convertToHTMLWhiteSpan("Data Explorer"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
				menu : this.getDataExplorerMenu() 
		},
//		{
//			text : '<span style="color:white">Offline Data Analysis</span>',
//			cls : 'ExiSAXSMenuToolBar',
//			hidden : this.isHidden,
//			menu : this.getOnlineDataAnalisysMenu() 
//		}, 
        {
			text : this._convertToHTMLWhiteSpan("Manager"),
			cls : 'ExiSAXSMenuToolBar',
			menu : this.getManagerMenu() 
		},
		{
			text : this._convertToHTMLWhiteSpan("Help"),
			cls : 'ExiSAXSMenuToolBar',
			menu : this.getHelpMenu() 
		}, 
		'->', 
		{
			xtype : 'textfield',
			name : 'field1',
			value : '',
			emptyText : 'search by protein acronym',
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == e.ENTER) {
						location.hash = "/mx/datacollection/protein_acronym/" + field.getValue() + "/main";
					}
				} 
			} 
		}
	];
};

MXManagerMenu.prototype.getManagerMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Autoproc Scaling Statistics") {
			var scatteringForm = new ScatteringForm({width : 650, height : 560});

			var window = Ext.create('Ext.window.Window', {
				title: "Plot autoprocessing values for last week",
				height : 560,
				width : 650,
				modal : true,
				layout : 'fit',
				items : [ scatteringForm.getPanel() ],
				buttons : [ {
						text : 'Plot (last 7 days)',
						handler : function() {
							scatteringForm.plot();
						}
					}, {
						text : 'Cancel',
						handler : function() {
							window.close();
						}
					} ]
			}).show();

			var keys = ["ISA", "rPimWithinIPlusIMinus","anomalousMultiplicity","multiplicity","resolutionLimitLow","ccHalf",
			"strategySubWedgeOrigId","completeness","rMerge","anomalous","meanIOverSigI","ccAno","autoProcScalingId",
			"nTotalObservations","sigAno","rMeasWithinIPlusIMinus","anomalousCompleteness","resolutionLimitHigh",
			"fractionalPartialBias","rMeasAllIPlusIMinus","nTotalUniqueObservations","rPimAllIPlusIMinus"];

			var scatteringData = {title : "AutoprocIntegrator", keys : keys};

			scatteringForm.load(scatteringData);
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [
					{
						text : 'Statistics',
						icon : '../images/icon/ic_insert_chart_black_36dp.png',
						menu : {       
								items: [
									{
										text: 'Autoproc Scaling Statistics',
										icon : '../images/icon/ic_insert_chart_black_36dp.png',
										handler: onItemCheck,
										disabled : false
									}
								]
							}
					}
			] 
	});
};
