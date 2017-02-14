
/**
* EnergyScanGrid displays the information fo a energyscan
*
* @class EnergyScanGrid
* @constructor
*/
function EnergyScanGrid(args) {
  
}

/**
* @method returns the panel with no data
*/
EnergyScanGrid.prototype.getPanel = function(dataCollectionGroup) {

    this.store = Ext.create('Ext.data.Store', {
        fields: ["dataCollectionGroup"]
    });
    
      this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,
        padding : 5,
        store: this.store,
        disableSelection: true,
        columns: [
            {
                header: '',
                dataIndex: 'dataCollectionGroup',
                name: 'dataCollectionGroup',
                flex: 0.2,
                renderer: function(grid, e, record) {
                    var html = "";                
                    record.data.choochURL = EXI.getDataAdapter().mx.energyscan.getChoochJpegByEnergyScanId(record.data.energyScanId);

                    dust.render("energyscangrid.template", record.data, function(err, out) {  
                        html = out;
                    });
                    return html;
                }
            }                         
        ],       
        viewConfig: {
	        			 enableTextSelection: true,
                         stripeRows : true
        }

    });
    return this.panel;
};

EnergyScanGrid.prototype.load = function(energyScanList) {
    this.store.loadData(energyScanList);   
};