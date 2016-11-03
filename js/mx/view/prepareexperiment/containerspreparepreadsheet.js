function ContainerPrepareSpreadSheet(){
    this.id = BUI.id();    
}


ContainerPrepareSpreadSheet.prototype.load = function(dewars){
    
  var hotSettings = {
    data: dewars,
    columns: [
        {
            data: 'shippingName',
            type: 'text',
            width: 40,
            readOnly: true
        },           
        {
            data: 'barCode',
            type: 'text',
            readOnly: true
        },
        {
            data: 'containerCode',
            type: 'text',
            readOnly: true
        },
        {
            data: 'sampleCount',
            type: 'text',
            readOnly: true
        },
        { 
            data : 'beamlineName',
            type: 'dropdown',			        	 								
            source: EXI.credentialManager.getBeamlineNames()
        },
        {
            data: 'sampleChangerLocation',
            type: 'text'
        }       
    ],
    stretchH: 'all',   
    autoWrapRow: true,      
    rowHeaders: true,
    colHeaders: [
        'Shipment',       
        'Barcode',
        'Container',
        'Samples',
        'Beamline',
        'Sample Changer Location'
    ]
};
    
  this.spreadSheet =  new Handsontable(document.getElementById(this.id), hotSettings);
};
ContainerPrepareSpreadSheet.prototype.getPanel = function(){
    var _this = this;    
    this.panel = Ext.create('Ext.panel.Panel', {
            title   : 'Loaded or to be Loaded on MxCube',            
            cls     : 'border-grid',            
            height  : 600,
            flex    : 0.5,  
            buttons : [{
                            text : 'Save',
                            scope : this,
                            handler : function() {
                               var data = this.spreadSheet.getData();
                               var containerIdList = [];
                               var beamlineList = [];
                               var sampleLocation = [];
                               for(var i = 0; i < data.length; i++){
                                   containerIdList.push(data[i].containerId);
                                   beamlineList.push(data[i].beamlineName);
                                   sampleLocation.push(data[i].sampleChangerLocation);
                                   
                               }
                               _this.panel.setLoading();
                               var onSuccess = function(sender){
                                   _this.panel.setLoading(false);
                               };
                               
                               var onError = function(sender, error){
                                   EXI.setError(error);                                   
                                   _this.panel.setLoading(false);
                               };
                               EXI.getDataAdapter({onSuccess:onSuccess, onError: onError}).proposal.dewar.updateSampleLocation(containerIdList, beamlineList, sampleLocation);
                            }
		    }],                     
            margin  : 5,
            items   : [
                {
                    html : "<div style='height:700px;' id='" + this.id +"'></div>",
                    flex : 1,
                    height : 700                              
                }
                
            ]
    });
    return this.panel;    
};