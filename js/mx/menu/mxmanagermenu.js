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
MXManagerMenu.prototype.getProteinCrystalsMenu = MainMenu.prototype.getProteinCrystalsMenu;

MXManagerMenu.prototype.getMenuItems = function() {

    var synchTxt = "SMIS";
    if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
        synchTxt = "DUO";
    }

	return [
    	this.getHomeItem(),
    	this.getShipmentItem(),
    	{
                text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
				cls : 'ExiSAXSMenuToolBar',
                handler : function(){
                    location.hash = "/mx/prepare/main";

				}
		},
		{
                text : this._convertToHTMLWhiteSpan("Proteins & Crystals <sub style='font-size:10px;color:orange'>NEW</sub>"),
                cls : 'ExiSAXSMenuToolBar',
				menu : this.getProteinCrystalsMenu()
                /*handler : function(){
                    location.hash = "#/protein/list";
                }*/
	    },
		{
				text : this._convertToHTMLWhiteSpan("Data Explorer"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
				menu : this.getDataExplorerMenu()
		},

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

		{
			text : this._convertToHTMLWhiteSpan("<button type='button' class='btn btn-default'> <span class='glyphicon glyphicon-refresh'></span> " +synchTxt +"</button>"),
			cls : 'ExiSAXSMenuToolBar',
			handler : function(){
				EXI.setLoadingMainPanel("Synch is running");
				var onSuccess = function(sender, data){
					EXI.setLoadingMainPanel(false);
				}
				var onError = function(sender,data){
					EXI.setLoadingMainPanel(false);
				}

				EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.proposal.synchSMIS();

			}
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
			var scatteringForm = new ScatteringForm();

			var keys = ["ISA", "rPimWithinIPlusIMinus","anomalousMultiplicity","multiplicity","resolutionLimitLow","ccHalf",
			"strategySubWedgeOrigId","completeness","rMerge","anomalous","meanIOverSigI","ccAno","autoProcScalingId",
			"nTotalObservations","sigAno","rMeasWithinIPlusIMinus","anomalousCompleteness","resolutionLimitHigh",
			"fractionalPartialBias","rMeasAllIPlusIMinus","nTotalUniqueObservations","rPimAllIPlusIMinus"];

			var scatteringData = {title : "AutoprocIntegrator", keys : keys};

			scatteringForm.load(scatteringData);
			scatteringForm.show();
		} else if (item.text == "Datacollection Statistics") {
            var datacollectionForm = new DatacollectionForm();

            var keys = ["Datasets", "Samples"];

            var datacollectionData = {title : "Datacollection", keys : keys};

            datacollectionForm.load(datacollectionData);
            datacollectionForm.show();
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
										//icon : '../images/icon/ic_insert_chart_black_36dp.png',
										handler: onItemCheck,
										disabled : false
									},
                                    {
                                         text: 'Datacollection Statistics',
                                         //icon : '../images/icon/ic_insert_chart_black_36dp.png',
                                         handler: onItemCheck,
                                         disabled : false
                                     }

								]
							}
					}
			]
	});
};
