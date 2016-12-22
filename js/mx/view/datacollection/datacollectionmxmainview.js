/**
* Landing page for where data collections are shown. It manages the DataCollectionSummaryGrid
*
* @class DataCollectionMxMainView
* @constructor
*/
function DataCollectionMxMainView() {
	this.icon = '../images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);
	var _this = this;
	
	this.genericDataCollectionPanel = new MXDataCollectionGrid();
        this.energyScanGrid = new EnergyScanGrid();
        this.xfeScanGrid = new XFEScanGrid();
}

DataCollectionMxMainView.prototype.getPanel = MainView.prototype.getPanel;

DataCollectionMxMainView.prototype.getContainer = function() {
		this.container = Ext.create('Ext.tab.Panel', {   
        minHeight : 900,    
        padding : "5 40 0 5",
        items: [ {
                        title: 'Data Collections',
                        cls : 'border-grid',
                        id : this.id + "_dataCollectionTab",                        
                        items:[
                            this.genericDataCollectionPanel.getPanel()
                        ]
                }, 
              
                {
                        title: 'Energy Scans',
                        cls : 'border-grid',
                        id : this.id + "_energyTab",
                        items:[
                             this.energyScanGrid.getPanel()
                        ]
                },
                 {
                        title: 'Fluorescence Spectra',
                        id : this.id + "_xfeTab",
                        cls : 'border-grid',                         
                        items:[
                            this.xfeScanGrid.getPanel()
                        ]
                }
               ]
        });
	    return this.container;
	
};

DataCollectionMxMainView.prototype.loadEnergyScans = function(data) {
     if (data){
         if (data.length > 0){
            Ext.getCmp(this.id + "_energyTab").setTitle(data.length + " Energy Scans");  
            this.energyScanGrid.load(data);
            return;
         }
     }
     
     Ext.getCmp(this.id + "_energyTab").setDisabled(true);
};

DataCollectionMxMainView.prototype.loadFXEScans = function(data) {  
    if (data){
        if (data.length > 0){
            Ext.getCmp(this.id + "_xfeTab").setTitle(data.length + " Fluorescence Spectra");  
            this.xfeScanGrid.load(data);
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
                
                if (data[i].DataCollection_resolutionAtCorner != null){
                    data[i].DataCollection_resolutionAtCorner = _.ceil( data[i].DataCollection_resolutionAtCorner, 2);
                }
                if (data[i].DataCollection_resolution != null){
                    data[i].DataCollection_resolution = _.ceil( data[i].DataCollection_resolution, 2);
                }
                
                if (data[i].DataCollection_wavelength != null){
                    data[i].DataCollection_wavelength = _.ceil( data[i].DataCollection_wavelength, 3);
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
        Ext.getCmp(this.id + "_dataCollectionTab").setTitle(data.length + " Data Collections");
	    if (data){            
            this.genericDataCollectionPanel.load(data.reverse());
        }
        return;	
    }
     Ext.getCmp(this.id + "_dataCollectionTab").setDisabled(true);
};
