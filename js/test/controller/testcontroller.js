
/**
* This is the description for routing all the session actions. It means url= #/session/*
*
* @class TestController
* @constructor
*/
function TestController() {
	this.init();
}


TestController.prototype.loadNavigationPanel = ExiController.prototype.loadNavigationPanel;


TestController.prototype.setPageBackground = function() {
};

TestController.prototype.notFound = function() {
};

/**
* Inits the controller for the session related objects
* Paths accepted:
* #/session/nav
* #/session/nav/:sessionId/session
*
* @method init
*/
TestController.prototype.init = function() {
	var _this = this;
	var listView;	
	
	function setPageBackground() {
		_this.setPageBackground();
	}
	function notFound() {
		_this.notFound();
	}

	Path.map("#/test/test1").to(function() {
		EXI.clearNavigationPanel();
		EXI.hideNavigationPanel();
        /** Creates an instance of a Test Panel **/		
		var panel = new TestListView();
		/** Add panel to the left navigation panel **/		
		EXI.addNavigationPanel(panel);
		EXI.setLoadingNavigationPanel("Loading my data");
		/** Loads data into the panel **/		
		panel.load([
			{ 'name': 'Lisa',  "email":"lisa@simpsons.com",  "phone":"555-111-1224"  },
			{ 'name': 'Bart',  "email":"bart@simpsons.com",  "phone":"555-222-1234" },
			{ 'name': 'Homer', "email":"homer@simpsons.com",  "phone":"555-222-1244"  },
			{ 'name': 'Marge', "email":"marge@simpsons.com", "phone":"555-222-1254"  }
			]);
		EXI.setLoadingNavigationPanel(false);
	}).enter(this.setPageBackground);
	
		
	Path.map("#/test/test2").to(function() {
		EXI.clearNavigationPanel();
		EXI.clearMainPanel();
		EXI.setLoadingNavigationPanel(true);
		listView = new TestListView();
		listView.onSelect.attach(function(sender, selected) {
			location.hash = "/test/test3/" + selected[0].BLSample_crystalId + "/main";
		});
		
		EXI.addNavigationPanel(listView);
		adapter = _this.loadNavigationPanel(listView);
		adapter.mx.sample.getSampleInfoByProposalId();
	
	
		
	}).enter(this.setPageBackground);
		
	Path.map("#/test/test3/:crystalId/main").to(function() {
		var mainView = new TestMainView(this.params['crystalId']);
		EXI.addMainPanel(mainView);
		console.log(this.params['crystalId']);
		mainView.load(this.params['crystalId']);
	}).enter(this.setPageBackground);
	
	Path.map("#/test/test4").to(function() {		
		EXI.clearNavigationPanel();
	    var mainView = new PuckWidgetView();
		EXI.addMainPanel(mainView);
		
		var onSuccess = function(sender, data){
			mainView.load(data);
		};		
		EXI.getDataAdapter({onSuccess : onSuccess}).proposal.shipping.getContainerById(333486,333486,333486);
	}).enter(this.setPageBackground);
	
	

	Path.rescue(this.notFound);
};


