function ContainerPrepareSpreadSheetTest(){
    this.id = BUI.id();

    this.onSelectRow = new Event(this);
    // this.allowedCapacity = null;

}

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
        cls     : 'border-grid',
        height  :600,
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
            // beforeselect: function (selModel, record) {
            //     if (_this.allowedCapacity) {
            //         return record.get('capacity') == _this.allowedCapacity;
            //     }
            // },
            itemclick: function(grid, record, item, index, e) {
                _this.onSelectRow.notify(grid.getSelectionModel().getSelection()[0]);             
            }
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

    return this.panel;

}

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
}