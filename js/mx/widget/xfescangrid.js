/**
* XFEScanGrid displays the information fo a XFE
*
* @class XFEScanGrid
* @constructor
*/
function XFEScanGrid(args) {
    this.id = BUI.id();

    this.plots = {};
}

/**
* 
* @method getPanel
*/
XFEScanGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
        fields: ["dataCollectionGroup"]
    });
    this.panel = Ext.create('Ext.grid.Panel', {

        cls: 'borderGrid',
        height: 800,
        store: this.store,
        disableSelection: true,
        columns: this.getColumns(),
        viewConfig: {
            enableTextSelection: true,
            stripeRows: true
        },
        listeners: {
            boxready: function(component, eOpts) {

                for (var id in _this.plots) {
                    new Dygraph(document.getElementById(_this.plots[id].containerId),
                        _this.plots[id]["url"], {
                            legend: 'never',
                            title: '',
                            height: 150,
                            width: 400,
                            stackedGraph: true,
                            labelsDiv: document.getElementById(_this.plots[id].labelsContainerId),
                            labelsSeparateLines: true,
                            labelsDivWidth: 100,
                            labelsShowZeroValues: false,

                            highlightCircleSize: 2,
                            strokeWidth: 1,
                            strokeBorderWidth: 1,

                            highlightSeriesOpts: {
                                strokeWidth: 3,
                                strokeBorderWidth: 1,
                                highlightCircleSize: 5
                            },
                            ylabel: 'Count',
                        });
                }


            }
        }
    });

    return this.panel;
};

XFEScanGrid.prototype._getHTMLZoomImage = function(url, dataCollectionId, imageId) {
    return '<img style="width:400px;height:100;"  data-src=' + url + ' src=' + url + '>';
};

/**
* @method getColumns defines the columns of the grid and associates the data
*/
XFEScanGrid.prototype.getColumns = function() {
    var _this = this;
    var columns = [

        {
            header: 'Experiment Parameters',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            flex: 1,
            renderer: function(grid, e, record) {
                var containerId = _this.id + record.data.xfeFluorescenceSpectrumId;
                _this.plots[record.data.xfeFluorescenceSpectrumId] = {
                    containerId: containerId,
                    labelsContainerId: containerId + "labels",
                    url: EXI.getDataAdapter().mx.xfescan.getCSV(record.data.xfeFluorescenceSpectrumId)
                };


                var html = "";

                //MAXIV doesn't show the PyMCA page
                var showLink = true;
                if (!EXI.credentialManager.getSiteName().startsWith("MAXIV")){
                    showLink = false;
                }
                record.data["showLink"] = showLink;
                record.data["xfeFluorescenceSpectrumId"] = record.data.xfeFluorescenceSpectrumId;
                record.data["containerId"] = containerId;
                record.data["url"] = EXI.getDataAdapter().mx.xfescan.getXFEJpegByScanId(record.data.xfeFluorescenceSpectrumId);
                dust.render("xfescangrid.template", record.data, function(err, out) {
                    html = out;
                });
                return html;

            }
        }

       /* {
            header: '',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            hidden: true,
            flex: 2,
            renderer: function(grid, e, record) {

                return _this._getHTMLZoomImage();


            }
        }*/
        /* ,
        {
            header: 'PyMca Results',
            dataIndex: 'dataCollectionGroup',
            name: 'dataCollectionGroup',
            width: 600,
            hidden: true,
            renderer: function(grid, e, record) {
                var containerId = _this.id + record.data.xfeFluorescenceSpectrumId;
                _this.plots[record.data.xfeFluorescenceSpectrumId] = {
                    containerId: containerId,
                    labelsContainerId: containerId + "labels",
                    url: EXI.getDataAdapter().mx.xfescan.getCSV(record.data.xfeFluorescenceSpectrumId)
                };


                var html = "";
                dust.render("xfescangrid.plot", { xfeFluorescenceSpectrumId: record.data.xfeFluorescenceSpectrumId, containerId: containerId }, function(err, out) {
                    html = out;
                });
                return html;


                // return "<div id='" + containerId +"'></div>";


            }
        }
        {
             header: 'Labels',
             dataIndex: 'dataCollectionGroup',
             name: 'dataCollectionGroup',
             flex: 2,
             renderer: function(grid, e, record) {
                 var labelsContainerId =  _this.id + record.data.xfeFluorescenceSpectrumId + "labels";
                 return "<div  id='" + labelsContainerId +"'></div>";
          
 
             }
         }*/

    ];
    return columns;
};

/**
* @method receive a json with an array of energy as it is defined on the view 
* of ISPyB 
*/
XFEScanGrid.prototype.load = function(data) {
    this.data = data;
    this.store.loadData(data);
};
