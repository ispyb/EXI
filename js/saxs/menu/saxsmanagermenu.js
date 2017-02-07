function SAXSManagerMenu() {
	this.id = BUI.id();
	ManagerMenu.call(this, {isHidden : false, cssClass : 'mainMenu'});
}

SAXSManagerMenu.prototype.populateCredentialsMenu = ManagerMenu.prototype.populateCredentialsMenu;
SAXSManagerMenu.prototype.init = ManagerMenu.prototype.init;
SAXSManagerMenu.prototype.getPanel = ManagerMenu.prototype.getPanel;
SAXSManagerMenu.prototype._convertToHTMLWhiteSpan = ManagerMenu.prototype._convertToHTMLWhiteSpan;
SAXSManagerMenu.prototype.getAddCredentialMenu = ManagerMenu.prototype.getAddCredentialMenu;
SAXSManagerMenu.prototype.getLoginButton = ManagerMenu.prototype.getLoginButton;
SAXSManagerMenu.prototype.setText = ManagerMenu.prototype.setText;
SAXSManagerMenu.prototype.getHelpMenu = ManagerMenu.prototype.getHelpMenu;
SAXSManagerMenu.prototype.getManagerMenu = ManagerMenu.prototype.getManagerMenu;
SAXSManagerMenu.prototype.getHomeItem = ManagerMenu.prototype.getHomeItem;
SAXSManagerMenu.prototype.getShipmentItem = ManagerMenu.prototype.getShipmentItem;
SAXSManagerMenu.prototype.getPreparationMenu = ManagerMenu.prototype.getPreparationMenu;
SAXSManagerMenu.prototype.getDataReductionMenu = ManagerMenu.prototype.getDataReductionMenu;
SAXSManagerMenu.prototype.getDataExplorerMenu = ManagerMenu.prototype.getDataExplorerMenu;
SAXSManagerMenu.prototype.getOnlineDataAnalisysMenu = ManagerMenu.prototype.getOnlineDataAnalisysMenu;

SAXSManagerMenu.prototype.getMenuItems = function() {	
    		
	return [	
    	this.getHomeItem(),
    	this.getShipmentItem(),
    	{
				text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
                 disabled : true,
				menu : this.getPreparationMenu() 
		}, {
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
			emptyText : 'search macromolecule',
			hidden : this.isHidden,
			listeners : {
				specialkey : function(field, e) {
					if (e.getKey() == e.ENTER) {                        
						location.hash = "/datacollection/macromoleculeAcronym/" + field.getValue() + "/main";
					}
				} 
			} 
	}
	];
};

SAXSManagerMenu.prototype.getManagerMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {

	}

	return Ext.create('Ext.menu.Menu', {
		items : [
					{
						text : 'Statistics',
						icon : '../images/icon/ic_insert_chart_black_36dp.png',
						menu : {       
								items: [
									{
										text: 'Substraction',
                                        disabled : true,
										icon : '../images/icon/ic_insert_chart_black_36dp.png',
										handler: onItemCheck
									}
								]
							}
					}
			] 
	});
};