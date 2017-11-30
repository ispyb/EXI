
   /**
* Landing page for where data collections are shown. It manages the DataCollectionSummaryGrid
*
* @class DataCollectionEmMainView
* @constructor
*/
function DataCollectionEmMainView(args) {
    this.icon = '../images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    if (args) {
        if (args.sessionId) {
            this.sessionId = args.sessionId;
        }
    }

    this.emDataCollectionGrid = new EMDataCollectionGrid();
   
   
}

DataCollectionEmMainView.prototype.getPanel = MainView.prototype.getPanel;

DataCollectionEmMainView.prototype.getContainer = function() {
   this.container = Ext.create('Ext.tab.Panel', {   
    minHeight : 900,    
    padding : "5 40 0 5",
    items: [ {
                    title: 'Grid',
                    cls : 'border-grid',
                    id : this.id + "_dataCollectionTab",                        
                    items:[
                        
                        this.emDataCollectionGrid.getPanel()
                    ]
            }
        ]
    });
    return this.container;
};


DataCollectionEmMainView.prototype.loadProposal = function (proposal) {
    this.panel.setTitle("");
    this.proposal = proposal;
    this.panel.setTitle(this.proposal.Proposal_proposalCode + this.proposal.Proposal_proposalNumber);
    this.panel.tab.on('click',function(){
        location.href = "#/welcome/manager/proposal/"+ proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber +"/main";
    });
}

DataCollectionEmMainView.prototype.loadCollections = function(dataCollections) {
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
                    data[i].DataCollection_flux_end = data[i].DataCollection_flux_end.toExponential();
                }
                
                if (data[i].DataCollection_flux != null){
                    data[i].DataCollection_flux = data[i].DataCollection_flux.toExponential();
                }
            }
            catch(err) {
                console.log(error);
            }
        }
       
	    if (data){            
            this.emDataCollectionGrid.load(data);
        }
        return;	
    }
     Ext.getCmp(this.id + "_dataCollectionTab").setDisabled(true);
};
