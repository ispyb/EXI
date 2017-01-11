function SAXSMainMenu() {
	this.id = BUI.id();
	MainMenu.call(this, {isHidden : false, cssClass : 'mainMenu'});
}

SAXSMainMenu.prototype.populateCredentialsMenu = MainMenu.prototype.populateCredentialsMenu;
SAXSMainMenu.prototype.init = MainMenu.prototype.init;
SAXSMainMenu.prototype.getPanel = MainMenu.prototype.getPanel;
SAXSMainMenu.prototype._convertToHTMLWhiteSpan = MainMenu.prototype._convertToHTMLWhiteSpan;
SAXSMainMenu.prototype.getAddCredentialMenu = MainMenu.prototype.getAddCredentialMenu;
SAXSMainMenu.prototype.getLoginButton = MainMenu.prototype.getLoginButton;
SAXSMainMenu.prototype.setText = MainMenu.prototype.setText;
SAXSMainMenu.prototype.getHelpMenu = MainMenu.prototype.getHelpMenu;
SAXSMainMenu.prototype.getHomeItem = MainMenu.prototype.getHomeItem;
SAXSMainMenu.prototype.getShipmentItem = MainMenu.prototype.getShipmentItem;


SAXSMainMenu.prototype.getMenuItems = function() {
	
	
	
	return [	
    	this.getHomeItem(),
    	this.getShipmentItem(),
    	{
				text : this._convertToHTMLWhiteSpan("Prepare Experiment"),
				cls : 'ExiSAXSMenuToolBar',
				hidden : this.isHidden,
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




SAXSMainMenu.prototype.getPreparationMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Macromolecules") {
			location.hash = "/saxs/macromolecule/nav";
		}
		if (item.text == "Buffers") {
			location.hash = "/saxs/buffer/nav";
		}

		if (item.text == "Sample Tracking") {
			location.hash = "/saxs/shipping/nav";
		}

		if (item.text == "My Experiments") {
			location.hash = "/saxs/template/nav";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [ 
	          {
				text : 'Macromolecules',
				icon : '../images/icon/macromolecule.png',
				handler : onItemCheck 
			}, 
			{
				text : 'Buffers',
				icon : '../images/icon/buffer.jpg',
				handler : onItemCheck 
			}, 
//			"-", 
//			{
//				text : 'Stock Solutions',
//				icon : '../images/icon/testtube.png',
//				handler : onItemCheck 
//			}, 
//			{
//				text : 'Sample Tracking',
//				icon : '../images/icon/shipping.png',
//				menu:this.getSampleTrackingMenu()
//			}, 
			"-", 
			{
				text : 'My Experiments',
				icon : '../images/icon/edit.png',
				handler : onItemCheck 
			}

		] });
};


SAXSMainMenu.prototype.getDataReductionMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Sessions") {
			_this.onSessionClicked.notify();
		}
		if (item.text == "Subtraction") {
			location.hash = "/tool/subtraction/main";
		}
		if (item.text == "Experiments") {
			_this.onExperimentClicked.notify();
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [ {
			text : '<span class="menuCategoryItem">SEC</span>' }, "-", {
			text : 'Background Test' }, {
			text : 'Baseline Checker' }, {
			text : 'Frame Merge' }, "-", {
			text : '<span class="menuCategoryItem">INDIVIDUAL CONCENTRATION</span>' }, "-", {
			text : 'Subtraction',
			checked : false,
			group : 'theme',
			checkHandler : onItemCheck }, {
			text : 'Average' }, "-", {
			text : '<span class="menuCategoryItem">COMBINING</span>' }, "-", {
			text : 'Merging tool' } ] });
};



SAXSMainMenu.prototype.getDataExplorerMenu = function() {
	function onItemCheck(item, checked) {
		if (item.text == "Calendar") {
			location.hash = "/session/nav";
		}
		if (item.text == "Experiments") {
			location.hash = "/experiment/nav";
		}
	}
	return Ext.create('Ext.menu.Menu', {
		items : [ 
			{
				text : 'Calendar',
				icon : '../images/icon/sessions.png',
				handler : onItemCheck 
			}
		] 
	});
};

SAXSMainMenu.prototype.getOnlineDataAnalisysMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Structure Validation") {
			location.hash = "/tool/crysol/main";
		}
		if (item.text == "Job list") {
			location.hash = "/tool/list";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [
		{
			text : 'Structure Validation',
			checked : false,
			group : 'theme',
			handler : onItemCheck },
			"-",
			{
				text : 'Job list',
				checked : false,
				group : 'theme',
				handler : onItemCheck }
		] });
};

