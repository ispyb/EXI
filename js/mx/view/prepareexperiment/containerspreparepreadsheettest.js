/**
* This class renders a grid containing container information
* @class ContainerPrepareSpreadSheetTest
* @constructor
*/
function ContainerPrepareSpreadSheetTest(args){
    this.id = BUI.id();

    this.height = 600;
    this.width = 600;
    if (args != null){
        if (args.height){
            this.height = args.height;
        }
        if (args.width){
            this.width = args.width;
        }
    }

    this.onSelectRow = new Event(this);
    this.onContainerListLoaded = new Event(this);
};

/**
* Returns a panel containing the grid of containers
*
* @method getPanel
* @return A panel containing the grid of containers
*/
ContainerPrepareSpreadSheetTest.prototype.getPanel = function() {
    var _this = this;

    this.store = Ext.create('Ext.data.Store', {
        storeId:'spreadSheedStore',
        fields:['shippingName', 'barCode', 'containerCode', 'containerType', 'sampleCount', 'beamlineName','sampleChangerLocation','dewarId','containerId','capacity'],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        title: 'Loaded or to be Loaded on MxCube',
        store: this.store,
        cls : 'border-grid',
        height  : this.height,
        width  : this.width,
        flex    : 0.5,
        columns: [
            {
                dataIndex: 'rowIndex',
                sortable : false,
                autoSizeColumn: true,
                // other config you need..
                renderer : function(value, metaData, record, rowIndex)
                {
                    return rowIndex+1;
                }
            },
            {
                header: 'Shipment',
                dataIndex: 'shippingName',
                type: 'text',
                flex: 1,
                readOnly: true
            },
             {
                header: 'DewarId',
                dataIndex: 'dewarId',
                type: 'text',
                flex: 1,
                readOnly: true
            },              
             {
                header: 'ContainerId',
                dataIndex: 'containerId',
                type: 'text',
                flex: 1,
                readOnly: true
            },   
            {
                header: 'Barcode',
                dataIndex: 'barCode',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Container',
                dataIndex: 'containerCode',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Container type',
                dataIndex: 'containerType',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            {
                header: 'Samples',
                dataIndex: 'sampleCount',
                type: 'text',
                flex: 1,
                readOnly: true
            },
            { 
                header : 'Beamline',
                dataIndex: 'beamlineName',
                type: 'dropdown',			        	 								
                flex: 1,
                source: EXI.credentialManager.getBeamlines()
            },
            {
                header: 'Sample Changer Location',
                dataIndex: 'sampleChangerLocation',
                flex: 1,
                type: 'text'
            }       
        ],
        viewConfig: {
            listeners: {
                refresh: function(dataview) {
                    dataview.panel.columns[0].autoSize();//works on the first colum
                }
            }
        },
        listeners: {
            itemclick: function(grid, record, item, index, e) {
                _this.onSelectRow.notify(record);             
            },
        },
        margin  : 5,
        items   : [
            {
                html : "<div style='height:700px;' id='" + this.id +"'></div>",
                flex : 1,
                height : 400                              
            }
            
        ]
    });

    //arrowUp and arrowDown listeners
    this.panel.view.addElListener('keyup', function(event,row) {
        if (event.keyCode == 38 || event.keyCode == 40) { 
            _this.onSelectRow.notify(_this.panel.store.getAt(Number(row.cells[0].innerText)-1));
        }
    });

    return this.panel;
};

/**
* Loads the processing dewars from the database
*
* @method loadProcessingDewars
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.loadProcessingDewars = function () {
    var _this = this;

    this.panel.setLoading();
    var onSuccessProposal = function(sender, containers) {
        _this.load(_.filter(containers, function(e){return e.shippingStatus == "processing";}));
        _this.panel.setLoading(false);
        _this.onContainerListLoaded.notify();
    };
    var onError = function(sender, error) {        
        EXI.setError("Ops, there was an error");
        _this.panel.setLoading(false);
    };
    EXI.getDataAdapter({onSuccess : onSuccessProposal, onError:onError}).proposal.dewar.getDewarsByProposal();
}

/**
* Loads an array of dewars to the store
*
* @method load
* @param dewars
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.load = function(dewars) {
   
    var data = [];
    //Parse data
    for (dewar in dewars) {
        if (dewars[dewar].sampleCount > 0){
            var containerType = "Unipuck";
            if (dewars[dewar].capacity){
                if (dewars[dewar].capacity == 10) {
                    containerType = "Spinepuck";
                }
            }
            data.push({
                shippingName : dewars[dewar].shippingName,
                barCode : dewars[dewar].barCode,
                containerCode : dewars[dewar].containerCode,
                containerType : containerType,
                sampleCount : dewars[dewar].sampleCount,
                beamlineName : dewars[dewar].beamlineName,
                sampleChangerLocation : dewars[dewar].sampleChangerLocation,
                dewarId : dewars[dewar].dewarId,
                containerId : dewars[dewar].containerId,
                capacity : dewars[dewar].capacity
            });
        }
    }
    this.store.loadData(data);
};

/**
* Updates the sample changer location cell of the record with the corresponding container Id
*
* @method updateSampleChangerLocation
* @param {Integer} containerId The container Id of the record to be updated
* @param {Integer} location The new value for the sample changer location cell in the grid
* @return
*/
ContainerPrepareSpreadSheetTest.prototype.updateSampleChangerLocation = function (containerId, location) {
    var _this = this;

    var recordsByContainerId = _.filter(_this.panel.store.data.items,function(o) {return o.data.containerId == containerId});

    for (var i = 0 ; i < recordsByContainerId.length ; i++) {
        var record = recordsByContainerId[i];
        if (record.get('containerId') == containerId) {
            var beamlineName = record.get('beamlineName');

            var onSuccess = function(sender, containers) {
                _this.loadProcessingDewars();
            };
            var onError = function(sender, error) {        
                EXI.setError("Ops, there was an error");
            };

            EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.dewar.updateSampleLocation([containerId], [beamlineName], [location]);
            return
        }
    }
};
