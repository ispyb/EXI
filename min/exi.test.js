
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




function SampleForm(id) {
	this.id = id;
}

SampleForm.prototype.load = function(sample) {
	this.sample = sample;

	if (sample != null) {
		Ext.getCmp("sampleName" + this.id).setValue(sample.sampleName);
		// Ext.getCmp(this.id + "proteinAcronym").setValue(sample.proteinAcronym);
		// Ext.getCmp(this.id + "code").setValue(sample.code);
		// Ext.getCmp(this.id + "sampleLocation").setValue(sample.sampleLocation);
	}
};

SampleForm.prototype.getSamplePanel = function() {
	this.samplePanel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		margin : '10',
		items : [ {
				padding : 10,
				xtype : 'container',
				layout : 'hbox',
				border : false,
				items : [ {
					xtype: 'displayfield',
					id : "sampleName" + this.id,
					fieldLabel: 'Sample Name',
					name: 'sampleName'
				} ] }
		] });
	return this.samplePanel;
};


SampleForm.prototype.getPanel = function() {
	this.panel = Ext.create('Ext.panel.Panel', {
		layout : 'vbox',
		title : 'Sample Card',
		cls : "border-grid",
		items : [  
		           this.getSamplePanel() 
		           ] });
	return this.panel;
};


function TestContainer() {
	this.container = Ext.create('Ext.container.Container', {
		layout: {
			type: 'hbox'
		},
		width: 400,
		border: 1,
		style: {borderColor:'#000000', borderStyle:'solid', borderWidth:'1px'},
		items: []
	});
}

TestContainer.prototype.getPanel = function () {
	return this.container;
}

TestContainer.prototype.add = function (item) {
	this.container.add(item);
}
function TestListView(){
	this.title = "Samples";
	ListView.call(this);
}

TestListView.prototype.getPanel = ListView.prototype.getPanel;
TestListView.prototype.load = ListView.prototype.load;
TestListView.prototype.getFields = ListView.prototype.getFields;
TestListView.prototype.getColumns = ListView.prototype.getColumns;

TestListView.prototype.getRow = function(record){
	var html = "";
	dust.render("test.template", record.data, function(err, out){
        	html = out;
     	});
	return html;
};

TestListView.prototype.getFilter = function(value){
	return [{property : "sampleName", value : value, anyMatch : true}];
};
function TestMainPanel(){
	this.title = "Samples";
	ListView.call(this);
}

TestMainPanel.prototype.getPanel = ListView.prototype.getPanel;
TestMainPanel.prototype.load = ListView.prototype.load;
TestMainPanel.prototype.getFields = ListView.prototype.getFields;
TestMainPanel.prototype.getColumns = ListView.prototype.getColumns;

TestMainPanel.prototype.getRow = function(record){
	var html = "";
	dust.render("test.template.main", record.data, function(err, out){
        	html = out;
     	});
	return html;
};

TestMainPanel.prototype.getFilter = function(value){
	return [{property : "sampleName", value : value, anyMatch : true}];
};

function TestMainWidgetPanel(){
	this.title = "Samples";
	ListView.call(this);
}

TestMainWidgetPanel.prototype.getPanel = ListView.prototype.getPanel;
TestMainWidgetPanel.prototype.load = ListView.prototype.load;
TestMainWidgetPanel.prototype.getFields = ListView.prototype.getFields;
TestMainWidgetPanel.prototype.getColumns = ListView.prototype.getColumns;


TestMainWidgetPanel.prototype.getRow = function(record){
	var html = "1";
	return html;
};

TestMainWidgetPanel.prototype.getFilter = function(value){
	return [{property : "sampleName", value : value, anyMatch : true}];
};
function ElectronDensityViewer (args) {
    this.id = BUI.id();
}



ElectronDensityViewer.prototype.getPanel = function(){
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        buttons : this.getToolBar(),
        items : [
            {
                html : '<div id="' + this.id + '" height="600px"></div>',
                height : 800,
            }
        ]
    });

    this.panel.on('boxready', function() {
        _this.load();
    });

    return this.panel;
};


ElectronDensityViewer.prototype.load = function(){
    var _this = this;

    var html = "";
    dust.render("electron.density.viewer.template", _this.sample, function(err, out) {                                                                       
        html = html + out;
    });
    debugger
    $(document.body).html(html);
    // $('#' + _this.id).hide().html(html).fadeIn('fast');

    init_gui();
    this.XV = new XtalViewer("Viewer", null, true, true);
    draw_selection_console(this.XV);
    this.XV.animate();
    if (!getQuery(this.XV)) {
        this.XV.load_pdb("data/1mru.pdb", "1mru");
        this.XV.load_dsn6_map("data/1mru.omap", "2mFo-Dfc", 0);
        this.XV.animate();
    }
    this.XV.enable_leap_motion();
};

ElectronDensityViewer.prototype.getToolBar = function() {
	var _this = this;
	return [
			{
                xtype : 'button',
                text: 'Debugger',
                handler: function() {
                    _this.XV;
                    debugger;
                }
            }
	];
};
function PuckWidgetView() {
	this.queueGridList = [];
    this.widget = new FlexHCDWidget();
    // this.widget = new SC3Widget();
    // this.widget = new PuckWidgetContainer({puckType : 1});
	this.title = 'Samples';
	
	MainView.call(this);

    var _this = this;
	
	// this.widget.mouseOverCell.attach(function(sender, location){
	// 	for (row in _this.grid.getStore().data.items) {
	// 		if (_this.grid.getStore().data.items[row].data.location == location){
	// 			_this.grid.getSelectionModel().select(Number(row));
	// 		}
	// 	}
	// });
	
	// this.widget.mouseOutCell.attach(function(sender){
	// 	_this.grid.getSelectionModel().deselectAll();
	// });
}
	
PuckWidgetView.prototype.getPanel = function() {
	
	var _this = this;
	
	this.store = Ext.create('Ext.data.Store', {
		storeId:'samplePanelId',
		fields:['acronym','state', 'code', 'type', 'name', 'location', 'holder', 'looptype'],
		data:[],
	});

	this.grid = Ext.create('Ext.grid.Panel', {
		margin : 20,
		title: 'Samples',
		store: Ext.data.StoreManager.lookup('samplePanelId'),
		columns: [
			{ text: 'Crystal protein acronym',  dataIndex: 'acronym'},
			{ text: 'State',  dataIndex: 'state'},
			{ text: 'Code', dataIndex: 'code'},
			{ text: 'Container type', dataIndex: 'type' },
			{ text: 'Name', dataIndex: 'name' },
			{ text: 'Location', dataIndex: 'location' },
			{ text: 'Holder', dataIndex: 'holder' },
			{ text: 'Looptype', dataIndex: 'looptype' },
		],
		height: 200,
		width: 700,
		listeners: {
			itemmouseenter: function (view, record, item) {
                        _this.widget.focus(record.data.location,true);
                    },
			itemmouseleave: function (view, record, item) {
                        _this.widget.focus(record.data.location,false);
                    }
		}
	});
	
	
	
	
	
	this.panel =  Ext.create('Ext.panel.Panel', {
			
           layout : 'hbox',
		  
		   // cls : 'border-grid',
            items : [
                        this.grid ,this.widget.getPanel()      
            ]
	});    
	
    return this.panel;
};

PuckWidgetView.prototype.load = function(data) {
    var _this = this;
    _this.panel.setTitle("Test Widget");
	
	var sampleData = [];
	var stateTest = ["Filled","Collected","Results","Collected"];
	for (sample in data.sampleVOs){
		sampleData.push({'acronym' : data.sampleVOs[sample].crystalVO.proteinVO.acronym,
						'code' : data.code, 
						'type' : data.containerType, 
						'name' : data.sampleVOs[sample].crystalVO.proteinVO.name, 
						'location' : data.sampleVOs[sample].location, 
						'holder' : data.sampleVOs[sample].holderLength, 
						'looptype' : data.sampleVOs[sample].loopType,
						'state' : stateTest[sample]
					});
	}
	this.store.loadData(sampleData);
	
	this.widget.load(sampleData);
    
};

function TestMainView(crystalId) {
	// this.queueGridList = [];
	MainView.call(this);

	this.crystalId = crystalId;
	this.testMainPanel = new TestMainPanel();
	// this.sampleForm = new SampleForm(crystalId);
	
	this.onSelect = new Event(this);
	this.onDeselect = new Event(this);
}

TestMainView.prototype.getPanel = MainView.prototype.getPanel;

TestMainView.prototype.getContainer = function() {
	return Ext.create('Ext.container.Container', {
	    layout: {
	        type: 'hbox'
	    },
	    margin : 15,
	    border: 1,
	    defaults: {
	        labelWidth: 80,
	        flex: 1,
	    },
	    items: [this.testMainPanel.getPanel([])]
	});
};



TestMainView.prototype.load = function(sampleId) {
	this.panel.setTitle("Sample");
	var _this = this;
	var onSuccess = function(sender, data){
		_this.testMainPanel.load(data);
	};
	
	EXI.getDataAdapter({onSuccess : onSuccess}).mx.sample.getSamplesByCrystalId(_this.crystalId);
	
};