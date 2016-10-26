/**
* Displays the data collections by session or acronym of the protein
*
* @class MXDataCollectionGrid
* @constructor
*/
function CollapsedDataCollectionGrid(args) {
    this.template = "collapsed.mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

CollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
CollapsedDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;

CollapsedDataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
    var _this = this;
    this.panel = Ext.create('Ext.grid.Panel', {
        border: 1,
        
        store: this.store,
       
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: false
        },
        listeners: {
            viewready: function() {
                function loadMagnifiers() {
                    for (var i = 0; i < _this.mxDataCollectionGrid.dataCollectionGroup.length; i++) {
                        var elementId = _this.mxDataCollectionGrid.dataCollectionGroup[i].DataCollection_dataCollectionId + "_thumb";
                        $('#' + elementId).Lazy();

                    }
                }
            }
        }

    });

    return this.panel;
}