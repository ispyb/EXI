function ProposalGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	this.margin = '0 0 0 0';
	if (args != null) {
		if (args.height != null) {
			this.height = args.height;
		}
		if (args.searchBar != null) {
			this.searchBar = args.searchBar;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}

		if (args.collapsed != null) {
			this.collapsed = args.collapsed;
		}

		if (args.width != null) {
			this.width = args.width;
		}
		
		if (args.margin != null) {
			this.margin = args.margin;
		}
	}
	this.onSelected = new Event(this);
};


ProposalGrid.prototype.load = function(proposals) {
	this.data = proposals;
	this.store.loadData(proposals, false);
};

ProposalGrid.prototype.getFilter = function(value){
	return [{property : "Proposal_proposalNumber", value : value, anyMacth : true}];
};

ProposalGrid.prototype.filter = function(value) {
	
};

ProposalGrid.prototype._getTbar = function() {
	var _this = this;
	var actions = [];
	actions.push({
		xtype : 'textfield',
		name : 'field1',
		emptyText : 'search by number',
		hidden : this.isHidden,
		  listeners : {
  			'change' : function(field, e) {
  						var value = field.getValue();
  						if (value != ""){
  							_this.store.filter(_this.getFilter(field.getValue()));
  						}
  						else{
  							_this.store.clearFilter(true);
  							_this.load(_this.data);
  						}
  					} 
          		} 
	    }
	);
	return actions;
};

ProposalGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'Proposal_proposalId', 'Proposal_title', 'Proposal_proposalCode', 'Proposal_proposalNumber', 'Proposal_proposalType' ]
	});

	this.store.sort(['Proposal_proposalCode', 'Proposal_proposalNumber']);

	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Proposals',
		store : this.store,
		tbar : this._getTbar(),
		layout : 'fit',
		cls : 'border-grid',
		height : this.height,
		margin : this.margin,
		emptyText : "No proposals",
		columns : [ 
		{
			text : 'Proposal',
			dataIndex : 'Proposal_code',
			width : 125,
			renderer : function(grid, a, record){
				return "<a href='#'>" + record.data.Proposal_proposalCode + record.data.Proposal_proposalNumber + "</a>"; 
			}
		}, 
		{
			text : 'Code',
			dataIndex : 'Proposal_number',
			width : 75,
			hidden : true
		}, 
		{
			text : 'Number',
			dataIndex : 'number',
			width : 75,
			hidden : true
		}, 
		{
			text : 'Title',
			dataIndex : 'Proposal_title',
			flex : 1
		}
		],
		flex : 1,
		viewConfig : {
			stripeRows : true,
			listeners : {
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {
					_this.onSelected.notify(record.data);
				}
			}
		}
	});

	/** Adding the tbar **/
	if (this.tbar) {
		this.panel.addDocked({
			xtype : 'toolbar',
			cls : 'toolBarGrid',
			height : 48,
			items : this._getTbar()
		});
	}
	return this.panel;
};




