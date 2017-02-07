function ExiSAXS() {
	 Exi.call(this, {
		 					menu: new SAXSMainMenu(),
                            managerMenu : new SAXSManagerMenu(),
		 					anonymousMenu: new MainMenu(),
		 					controllers : [new SAXSExiController(),  new OfflineExiController(), new ProposalExiController(), new SessionController(), new LabContactExiController()]
	 });
}

ExiSAXS.prototype.loadSelected = Exi.prototype.loadSelected;
ExiSAXS.prototype.addMainPanel = Exi.prototype.addMainPanel;
ExiSAXS.prototype.getSelectedDataCollections = Exi.prototype.getSelectedDataCollections;
ExiSAXS.prototype.addNavigationPanel = Exi.prototype.addNavigationPanel;
ExiSAXS.prototype.clearNavigationPanel = Exi.prototype.clearNavigationPanel;
ExiSAXS.prototype.clearMainPanel = Exi.prototype.clearMainPanel;
ExiSAXS.prototype.setLoadingNavigationPanel = Exi.prototype.setLoadingNavigationPanel;
ExiSAXS.prototype.setError = Exi.prototype.setError;
ExiSAXS.prototype.setLoading = Exi.prototype.setLoading;
ExiSAXS.prototype.setLoadingMainPanel = Exi.prototype.setLoadingMainPanel;
ExiSAXS.prototype.show = Exi.prototype.show;
ExiSAXS.prototype.setAnonymousMenu = Exi.prototype.setAnonymousMenu;
ExiSAXS.prototype.setUserMenu = Exi.prototype.setUserMenu;
ExiSAXS.prototype.setManagerMenu = Exi.prototype.setManagerMenu;
ExiSAXS.prototype.manageMenu = Exi.prototype.manageMenu;
ExiSAXS.prototype.appendDataAdapterParameters = Exi.prototype.appendDataAdapterParameters;
ExiSAXS.prototype.hideNavigationPanel = Exi.prototype.hideNavigationPanel;
ExiSAXS.prototype.showNavigationPanel = Exi.prototype.showNavigationPanel;

ExiSAXS.prototype.getHeader = function(){
    var html = "";
    var data = {
        version         : ExtISPyB.version,
        release_date    : ExtISPyB.release_date
       
        
    };
    dust.render("saxsheader", data, function(err, out){
		html = out;
     });
    return html;	
};


ExiSAXS.prototype.getDataAdapter = function(args){
	return new SaxsDataAdapterFactory(this.appendDataAdapterParameters(args));
};

