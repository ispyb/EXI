/**
* Landing page for where data collections are shown. It manages the DataCollectionSummaryGrid
*
* @class DataCollectionMxMainView
* @constructor
*/
function DataCollectionMxMainView(args) {
    this.icon = '../images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    if (args) {
        if (args.sessionId) {
            this.sessionId = args.sessionId;
        }
         if (args.technique) {
            this.technique = args.technique;
        }
		if (args.proposal) {
            this.proposal = args.proposal;
        }
    }
	
    this.genericDataCollectionPanel = new MXDataCollectionGrid({proposal : this.proposal});
    this.energyScanGrid = new EnergyScanGrid();
    this.xfeScanGrid = new XFEScanGrid();
    this.emStats = new EMSessionStats({sessionId: this.sessionId});
   
}

DataCollectionMxMainView.prototype.getPanel = MainView.prototype.getPanel;

DataCollectionMxMainView.prototype.getContainer = function() {
    var _this = this;
    
    var items = [
        {
                    title: 'Data Collections',
                    cls : 'border-grid',
                    id : this.id + "_dataCollectionTab",                        
                    items:[
                        
                        this.genericDataCollectionPanel.getPanel()
                    ]
         }
    ];
    if (this.technique == 'EM'){        
        items.push({
                    title: 'Stats',
                    cls : 'border-grid',
                    id : this.id + "_statsTab",
                    items:[
                            this.emStats.getPanel()
                    ]

        });
    }
    else{
        items.push({
                    title: 'Energy Scans',
                    cls : 'border-grid',
                    id : this.id + "_energyTab",
                    items:[
                            this.energyScanGrid.getPanel()
                    ]

        });
        items.push({
                    title: 'Fluorescence Spectra',
                    id : this.id + "_xfeTab",
                    cls : 'border-grid',                         
                    items:[
                        this.xfeScanGrid.getPanel()
                    ]

        });


    }
    
    this.container = Ext.create('Ext.tab.Panel', {   
    minHeight : 900,    
    padding : "5 40 0 5",
    items:  items,
        listeners: {
            afterrender: function(panel){
                var bar = panel.tabBar;
                bar.insert(3,[
                    {
                        xtype: 'component',
                        flex: 1
                    },
                    {
                        html: '<span class="glyphicon glyphicon-download-alt"></span> Reports',
                        padding: '10px',
                        hidden : true,
                        closable : false,
                        handler : function (sender,target) {
                            var reportsForm = new ReportsForm();
                            reportsForm.load(_this.sessionId,_this.proposal,_this.genericDataCollectionPanel.dataCollectionGroup,_this.energyScanGrid.energyScanList,_this.xfeScanGrid.data);
                            reportsForm.show();
                        }
                    },               
                ]);
            }
        }
    });
    return this.container;
};

DataCollectionMxMainView.prototype.loadEnergyScans = function(data) {
    if (data){
        if (data.length > 0){
            Ext.getCmp(this.id + "_energyTab").setTitle(data.length + " Energy Scans");              
            this.energyScanGrid.load(data.reverse());
            return;
        }
    }
    
    Ext.getCmp(this.id + "_energyTab").setDisabled(true);
};

DataCollectionMxMainView.prototype.loadFXEScans = function(data) {  
    if (data){
        if (data.length > 0){
            Ext.getCmp(this.id + "_xfeTab").setTitle(data.length + " Fluorescence Spectra");  
            this.xfeScanGrid.load(data.reverse());
            return;
            }
        }
        
    Ext.getCmp(this.id + "_xfeTab").setDisabled(true);
};

DataCollectionMxMainView.prototype.loadProposal = function (proposal) {
    this.panel.setTitle("");
    this.proposal = proposal;
    this.panel.setTitle(this.proposal.Proposal_proposalCode + this.proposal.Proposal_proposalNumber);
    this.panel.tab.on('click',function(){
        location.href = "#/welcome/manager/proposal/"+ proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber +"/main";
    });
}

DataCollectionMxMainView.prototype.loadEMStats = function(data) {  
    if (data){
        if (data.length > 0){            
            this.emStats.load(data);
            return;
            }
        }
        
    Ext.getCmp(this.id + "_xfeTab").setDisabled(true);
};


DataCollectionMxMainView.prototype.loadCollections = function(dataCollections) {
	var data = _.filter(dataCollections, function(u) {
        return u.DataCollection_dataCollectionId != null;
    });
    if (data){
        for (var i = 0; i < data.length; i++) {
            try{
                if (data[i].DataCollectionGroup_startTime != null){
                    data[i].time =  moment(data[i].DataCollectionGroup_startTime, "MMMM Do YYYY, h:mm:ss A").format("h:mm:ss A");
                }
                
                if (data[i].DataCollectionGroup_startTime != null){
                    data[i].date =  moment(data[i].DataCollectionGroup_startTime, "MMMM Do YYYY").format("MMMM Do YYYY");
                }
                               
                /** Axis  **/
                if (data[i].DataCollection_axisEnd != null){
                    if (data[i].DataCollection_axisStart != null){                        
                        data[i].DataCollection_axisTotal = _.ceil(data[i].DataCollection_axisEnd - data[i].DataCollection_axisStart, 2);
                    }
                }
                
                if (data[i].DataCollection_flux_end != null){
                    data[i].DataCollection_flux_end = data[i].DataCollection_flux_end.toExponential(2);
                }
                
                if (data[i].DataCollection_flux != null){
                    data[i].DataCollection_flux = data[i].DataCollection_flux.toExponential(2);
                }
            }
            catch(err) {
                console.log(error);
            }
        }
        Ext.getCmp(this.id + "_dataCollectionTab").setTitle(data.length + " Data Collections");
	    if (data){            
            this.genericDataCollectionPanel.load(data);
        }
        return;	
    }
     Ext.getCmp(this.id + "_dataCollectionTab").setDisabled(true);
};
