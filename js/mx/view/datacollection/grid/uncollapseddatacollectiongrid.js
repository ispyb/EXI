/**
* Displays the data collections by session or acronym of the protein in a collapsed way
*
* @class MXDataCollectionGrid
* @constructor
*/
function UncollapsedDataCollectionGrid(args) {
    this.template = "mxdatacollectiongrid.template";
    DataCollectionGrid.call(this,args);
}

UncollapsedDataCollectionGrid.prototype._getAutoprocessingStatistics = DataCollectionGrid.prototype._getAutoprocessingStatistics;
UncollapsedDataCollectionGrid.prototype.getColumns = DataCollectionGrid.prototype.getColumns;

UncollapsedDataCollectionGrid.prototype.getPanel = function (dataCollectionGroup) {
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