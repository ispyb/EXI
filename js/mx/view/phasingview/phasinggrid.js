/**
 * It shows information about the phasing steps
 * 
 * @height
 * @searchBar
 * @collapsed
 * @width
 */
function PhasingGrid(args) {
}

/**
 * {"processingPrograms":"grenades_parallelproc",
 * "autoProcId":909816,
 * "phasingEndTime":"Feb 20, 2013 1:37:17 PM",
 * "autoProcIntegrationId":1010078,
 * "processingStatus":true,
 * "anomalous":false,
 * "name":"Thermo_2",
 * "proposalId":12,
 * "spaceGroupShortName":"C222",
 * "lowRes":"3.5",
 * "spaceGroup":" P 6 ",
 * "autoProcScalingId":909827,
 * "statisticsValue":null,
 * "enantiomorph":null,
 * "acronym":"MWB",
 * "blSampleId":525682,
 * "phasingStatus":null,
 * "code":"",
 * "phasingPrograms":"shelxc",
 * "dataCollectionId":1640501,
 * "phasingStepId":27742,
 * "solventContent":null,
 * "phasingAnalysisId":null,
 * "sessionId":43041,
 * "phasingStepType":"PREPARE",
 * "metric":null,
 * "proteinId":339373,
 * "phasingStartTime":"Feb 20, 2013 1:37:16 PM",
 * "method":"SAD",
 * "previousPhasingStepId":null,
 * "highRes":"50.0"}
 * 
 * 
 */
PhasingGrid.prototype.load = function(data) {	
	this.store.loadData(data, false);
};

PhasingGrid.prototype._getTbar = function() {
	var _this = this;
	var actions = [];

	actions.push(Ext.create('Ext.Action', {
		text : 'Add',
		icon: 'images/icon/add.png',
		disabled : false,
		handler : function(widget, event) {
		
		}
	}));
	return actions;
};

PhasingGrid.prototype.getPanel = function() {
	var _this = this;

	this.store = Ext.create('Ext.data.Store', {
		fields : [ 'phasingStepId' ]
	});
    
    this.store.sort('phasingStepId');
	this.panel = Ext.create('Ext.grid.Panel', {
		title : 'Phasing steps',
		store : this.store,
        cls : 'border-grid',
		layout : 'fit',
		columns : [
             {
			text : 'phasingStepId',
            hidden : true,
			dataIndex : 'phasingStepId',
			flex : 1
		}, 
            {
			text : 'Space Group',
            hidden : true,
			dataIndex : 'spaceGroupShortName',
			flex : 1
		},
        {
			text : 'Prepare',
			dataIndex : 'phasingStepType',
			flex : 0.2,
            renderer : function(e, sample, record){
				var html  = "";
				try{              
                    dust.render("phasinggrid.prepare", record.data, function(err, out){
                        html = out;
                    });
				}
				catch(e){
					return "Parsing error";
				}
				return html;
			}
		},   
         {
			text : 'Substructure Determination',
			dataIndex : 'phasingStepType',
			flex : 0.4,
            renderer : function(e, sample, record){
				var html  = "";
				try{              
                    dust.render("phasinggrid.substructure", record.data.children, function(err, out){
                        html = out;
                    });
				}
				catch(e){
					return "Parsing error";
				}
				return html;
			}
		},    
         {
			text : 'Phasing',
			dataIndex : 'phasingStepType',
			flex : 1,
            renderer : function(e, sample, record){
				var html  = "";
                var output = function(err, out){
                            html = html + "<br />" + out;
                };
                                       
				try{   
                    var subs =  record.data.children;                    
                    for (var i = 0 ;i < subs.length; i++){ 
                        for (var j = 0 ;j < subs[i].children.length; j++){
                            var child =   subs[i].children[j];
                            if (child.metric){                                                                                              
                                  if (child.statisticsValue){                                       
                                        child.statistics = [];                                       
                                        for(k=0; k < child.metric.split(",").length; k++){
                                            child.statistics.push({
                                                name : child.metric.split(",")[k],
                                                value : child.statisticsValue.split(",")[k]
                                            });
                                       
                                    }
                                }
                            }
                        }         
                        dust.render("phasinggrid.stats", subs[i].children, output);
                    }
				}
				catch(e){
					return "Parsing error " + e;
				}
				return html;
			}
		}            
      

		],
		flex : 1
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


