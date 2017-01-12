/**
 * Grid rendering the stock solutions
 * 
 */
function StockSolutionsGrid(args) {
	this.id = BUI.id();
	this.width = 600;
    this.padding = 0;

	if (args != null) {
		if (args.width != null) {
			this.width = args.width;
		}
        if (args.width != null) {
			this.padding = args.padding;
		}
	}
	
    this.onSelected = new Event(this);
}

StockSolutionsGrid.prototype.getPanel = function () {
    var _this = this;
    this.store = Ext.create('Ext.data.Store', {
        storeId:'stockSolutionsGridStore',
        fields: ["acronym","buffer","concentration","volume"],
        data: []
    });

    this.panel = Ext.create('Ext.grid.Panel', {
        width: this.width,
        border: 1,        
        store: this.store,       
        disableSelection: false,
        flex:0.5,
        columns: [
                    {
                        header: 'Acronym',
                        dataIndex: 'acronym',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Buffer',
                        dataIndex: 'buffer',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Concentration (mg/ml)',
                        dataIndex: 'concentration',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    },
                    {
                        header: 'Volume (&#956l)',
                        dataIndex: 'volume',
                        type: 'text',
                        flex: 1,
                        readOnly: true
                    }
        ],
        listeners : {
            itemclick: function(grid, record, item, index, e) {
                _this.onSelected.notify(record);
            }
        }
    });

    return this.panel;
}

StockSolutionsGrid.prototype.load = function (stockSolutions) {
    this.stockSolutions = stockSolutions;
    var data = [];
    for (var i=0 ; i < stockSolutions.length ; i++) {
        data.push({
            acronym         : EXI.proposalManager.getMacromoleculeById(stockSolutions[i].macromoleculeId).acronym,
            buffer          : EXI.proposalManager.getBufferById(stockSolutions[i].bufferId).acronym,
            concentration   : stockSolutions[i].concentration,
            volume          : stockSolutions[i].volume,
            stockSolutionId : stockSolutions[i].stockSolutionId
        });
    }
    this.store.loadData(data);
}
