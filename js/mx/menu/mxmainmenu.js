function MXMainMenu() {
	this.id = BUI.id();
	 MainMenu.call(this, {cssClass : 'mxMainMenu'});
}

MXMainMenu.prototype.populateCredentialsMenu = MainMenu.prototype.populateCredentialsMenu;
MXMainMenu.prototype.init = MainMenu.prototype.init;
MXMainMenu.prototype.getPanel = MainMenu.prototype.getPanel;
MXMainMenu.prototype._convertToHTMLWhiteSpan = MainMenu.prototype._convertToHTMLWhiteSpan;
MXMainMenu.prototype.getAddCredentialMenu = MainMenu.prototype.getAddCredentialMenu;
MXMainMenu.prototype.getLoginButton = MainMenu.prototype.getLoginButton;
MXMainMenu.prototype.setText = MainMenu.prototype.setText;
MXMainMenu.prototype.getHomeItem = MainMenu.prototype.getHomeItem;
MXMainMenu.prototype.getHelpMenu = MainMenu.prototype.getHelpMenu;
MXMainMenu.prototype.getShipmentItem = MainMenu.prototype.getShipmentItem;
MXMainMenu.prototype.getProteinCrystalsMenu = MainMenu.prototype.getProteinCrystalsMenu;
MXMainMenu.prototype.getDataExplorerMenu = MainMenu.prototype.getDataExplorerMenu;



MXMainMenu.prototype.getMenuItems = function() {
    var synchTxt = "SMIS";
    var homeLabel = "Home";
    if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
        synchTxt = "DUO";
        var homeLabel = "Proposals";
    }
	return [
		this.getHomeItem(homeLabel),
		this.getShipmentItem(),

			{
                text : this._convertToHTMLWhiteSpan("Proteins and Crystals <sub style='font-size:10px;color:orange'>NEW</sub>"),
                cls : 'ExiSAXSMenuToolBar',
                disabled : false,
                menu : this.getProteinCrystalsMenu()
	    	},
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
			menu : this.getDataExplorerMenu()
		},
		{
			text : this._convertToHTMLWhiteSpan("Offline Data Analysis"),
			cls : 'ExiSAXSMenuToolBar',
            disabled : true,
			menu : this.getOnlineDataAnalisysMenu()
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

                if (EXI.credentialManager.hasActiveProposal()) {
                    EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.proposal.synchSMIS();
                } else {
                    if (EXI.credentialManager.getSiteName().startsWith("MAXIV")){
                        EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.proposal.synchSMISByUsername();
                    } else {
                        EXI.getDataAdapter({onSuccess : onSuccess, onError : onError}).proposal.proposal.synchSMIS();
                    }
                }


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



MXMainMenu.prototype.getOnlineDataAnalisysMenu = function() {
	var _this = this;
	function onItemCheck(item, checked) {
		if (item.text == "Dimple") {
			location.hash = "/tool/dimple/main";
		}
		if (item.text == "Job list") {
			location.hash = "/tool/list";
		}
	}

	return Ext.create('Ext.menu.Menu', {
		items : [

		{
			text : 'Dimple',
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


/*MXMainMenu.prototype.getProteinCrystalsMenu = function() {
	function onItemCheck(item, checked) {
		if (item.text == "My Crystals") {
			location.hash = "/crystal/nav";
		}
		if (item.text == "My Proteins") {
			location.hash = "/protein/list";
		}
		if (item.text == "Puck") {
			location.hash = "/puck/nav";
		}
	}
	return Ext.create('Ext.menu.Menu', {
		items : [
			{
				text : 'My Crystals',
				icon : '../images/icon/macromolecule.png',
				disabled : true,
				handler : onItemCheck
			},
			{
				text : 'My Proteins',
				icon : '../images/icon/testtube.png',
				handler : onItemCheck
			},
			{
				text : 'Puck',
				disabled : true,
				icon : '../images/icon/testtube.png',
				handler : onItemCheck
			}
		]
	});
};*/