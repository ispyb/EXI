function SessionGrid(args) {
	this.height = 500;
	this.tbar = false;
	this.id = BUI.id();
	this.width = null;

	this.title = null;
	this.margin = 10;


	this.hiddenGoColumn = true;
    this.isHiddenTitle = true;
    this.isHiddenNumberOfShifts = true;
    
    this.isHiddenPI = true;
    this.isHiddenLocalContact = true;
    
    this.layout = 'fit';
    
    /** Array with the beamline selected to make the filter */
    this.beamlineFilter = [];
    
	if (args != null) {
         if (args.isHiddenLocalContact != null) {
			this.isHiddenLocalContact = args.isHiddenLocalContact;
		}
        

        if (args.isHiddenNumberOfShifts != null) {
			this.isHiddenNumberOfShifts = args.isHiddenNumberOfShifts;
		}
        if (args.width != null) {
			this.width = args.width;
		}
        if (args.isHiddenTitle != null) {
			this.isHiddenTitle = args.isHiddenTitle;
		}
        if (args.isHiddenPI != null) {
			this.isHiddenPI = args.isHiddenPI;
		}
        
		if (args.title != null) {
			this.title = args.title;
		}
		if (args.margin != null) {
			this.margin = args.margin;
		}

		if (args.height != null) {
			this.height = args.height;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}

		if (args.width != null) {
			this.width = args.width;
            this.layout = null;
		}
		if (args.hiddenGoColumn != null) {
			this.hiddenGoColumn = args.hiddenGoColumn;
		}
	}
	this.onSelected = new Event(this);
}



SessionGrid.prototype.load = function(sessions) {
    this.sessions = sessions;
	this.store.loadData(sessions, false);
};

SessionGrid.prototype.filterByBeamline = function(beamlines) {
    if (beamlines){
        if (beamlines.length > 0){
            var filtered = [];
            for(var i = 0; i < beamlines.length; i++){
                filtered = _.concat(filtered, (_.filter(this.sessions, {'beamLineName': beamlines[i]})));
            }
            this.store.loadData(filtered, false);
        }
        else{
            this.store.loadData(this.sessions, false);
        }
    }
};

SessionGrid.prototype.getToolbar = function(sessions) {
    var _this = this;
    var items = [];
    
    var myHandler = function(a,selected,c){                    
                    if (selected){
                        _this.beamlineFilter.push(a.boxLabel);
                    }
                    else{                        
                        _this.beamlineFilter =_.remove(_this.beamlineFilter,a.boxLabel );
                    }
                    _this.filterByBeamline(_this.beamlineFilter);
    };
            
    for (var i =0; i<EXI.credentialManager.getBeamlineNames().length; i++){
        items.push({           
                xtype: 'checkbox',
                boxLabel : EXI.credentialManager.getBeamlineNames()[i],
                name : EXI.credentialManager.getBeamlineNames()[i],
                handler : myHandler 
            
        });
    }
	 return Ext.create('Ext.toolbar.Toolbar', {  
        items: items
    });
};


SessionGrid.prototype.getPanel = function() {
	var _this = this;
   
    this.store = Ext.create('Ext.data.Store', {
		fields : ['Proposal_ProposalNumber', 'beamLineName', 'beamLineOperator', 'Proposal_title', 'Person_emailAddress', 'Person_familyName', 'Person_givenName', 'nbShifts', 'comments'],
		emptyText : "No sessions",
		data : []
	});    


	this.panel = Ext.create('Ext.grid.Panel', {
		title : this.title,
		store : this.store,
        tbar : this.getToolbar(),		
		icon : '../images/icon/sessions.png',
		cls : 'border-grid',
		minHeight: 300,
        width : this.width,
        height : this.height,
		margin : this.margin,
		layout : this.layout,
		columns : [
              {
                    text              : '',
                    dataIndex         : 'BLSession_startDate',
                    flex             : 1,
                    hidden              : true,
                    renderer          : function(grid, a, record){                                    
                                               var html = "";
                                               if (record.data.BLSession_startDate){
                                                    record.data.start =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY');
                                                    record.data.day =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('Do');
                                                    record.data.month =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM');
                                                    record.data.year =  moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('YYYY');
                                               }
                                               dust.render("session.grid", record.data, function(err, out){
                                                    html = html + out;
                                               });
                                               return html;
                    }
              },
              {
                            text              : 'Start',
                            dataIndex         : 'BLSession_startDate',
                            flex              : 2,
                            hidden            : false,
                            renderer          : function(grid, a, record){                                 
                                                     
                                                    var location = "#";
                                                    if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                                                        location = "#/session/nav/" + record.data.sessionId + "/session";
                                                    }
                                                    else{
                                                        location = "#/mx/datacollection/session/" + record.data.sessionId + "/main";
                                                    }
                                                    if (record.data.BLSession_startDate){                 
                                                         return "<a href='" +  location +"'>" + moment(record.data.BLSession_startDate, 'MMMM Do YYYY, h:mm:ss a').format('MMMM Do YYYY') + "</a>"; 
                                                    }
                            }
		     },
             {
                    text : 'Beamline',
                    dataIndex : 'beamLineName',
                    width : 125,
                    hidden : false,
                    renderer : function(grid, a, record){
                            var location = "#";
                            if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                                location = "#/session/nav/" + record.data.sessionId + "/session";
                            }
                            else{
                                location = "#/mx/datacollection/session/" + record.data.sessionId + "/main";
                            }
                        return "<a href='" +  location +"'>" + record.data.beamLineName + "</a>"; 
                    }
		    }, 
            {
                text : 'Proposal',
                dataIndex : 'Proposal_ProposalNumber',
                flex : 1,
                hidden : false,
                renderer : function(grid, a, record){
                    var proposal = record.data.Proposal_proposalCode + record.data.Proposal_ProposalNumber;
                    return "<a href='#/session/nav' data-toggle='tooltip' title='Open proposal " + proposal +"'>" + proposal + "</a>"; 
                }
          },       
          {
			    text                : 'Shifts',
			    dataIndex           : 'nbShifts',
                hidden              : this.isHiddenNumberOfShifts,
                flex                : 1
		    },
           {
			    text                : 'Local Contact',
			    dataIndex           : 'beamLineOperator',
			    width               : 200,
                hidden              : this.isHiddenLocalContact,
                flex                : 1
		    },
            {
			    text                : 'Title',
			    dataIndex           : 'Proposal_title',
			    width               : 200,
                hidden              : this.isHiddenTitle,
                flex               : 4
		    },
            {
			    text                : 'PI',
			    dataIndex           : 'Proposal_title',
			    width               : 200,
              
                 hidden              : this.isHiddenPI,
                renderer : function(grid, a, record){                        
                        return record.data.Person_familyName + ", " + record.data.Person_givenName;
                    }
		    },
             {
			    text                : 'e-mail',
			    dataIndex           : 'Person_emailAddress',
			    width               : 200,
                hidden              : true,
                flex               : 1
		    },
           {
                text                : 'Data Collections',
			    dataIndex           : 'Person_emailAddress',
                 width               : 200,
                renderer : function(grid, a, record){ 
                    function getBadge(title, count) {
                        if (count){
                            if (count != 0){
                                return '<tr><td><span style="margin-left:10px;margin-top:2px;background-color:#207a7a;" class="badge">' + count +'</span></td><td style="padding-left:10px;">' + title + '</td></tr>';
                            }
                        }
                        return "";
                    }
                    function getTable(record){
                        var html = "<table>";
                        html =   html = html + getBadge("Energy", record.data.energyScanCount);
                        html = html + getBadge("XRF", record.data.xrfSpectrumCount);
                        html = html + getBadge("Samples", record.data.sampleCount);
                        html = html + getBadge("Test", record.data.testDataCollectionGroupCount);
                        html = html + getBadge("Collects", record.data.dataCollectionGroupCount);
                        html = html + getBadge("Calibration", record.data.calibrationCount);
                        html = html + getBadge("Sample Changer", record.data.sampleChangerCount);
                        html = html + getBadge("HPLC", record.data.hplcCount);
                        return html + "</table>";  
                    }                                                          
                    return getTable(record);
                 }
               
           },
     
            {
                text              : 'End',
                dataIndex         : 'BLSession_endDate',
                hidden              : true,
                flex             : 1,                
                renderer          : function(grid, a, record){                    
                                        return record.data.BLSession_endDate;
                }
		   },
           {
			    text                : 'Comments',
			    dataIndex           : 'comments',
                hidden              : false,
                flex                : 3,
                renderer            : function(grid, a, record){    
                                        if (record.data.comments){                
                                            return "<div style='width:50px; wordWrap: break-word;'>" + record.data.comments + "</div>";
                                        }
                }
                


		    },
           ], 
      	   viewConfig : {
                stripeRows : true,
                getRowClass : function(record, rowIndex, rowParams, store){
                    /*
                    if (record.data.beamLineName != null){
                        
                        if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "SAXS"){
                            return ((rowIndex % 2) == 0) ? "saxs-grid-row-light" : "saxs-grid-row-dark";
                        }
                        if (EXI.credentialManager.getTechniqueByBeamline(record.data.beamLineName) == "MX"){
                            return ((rowIndex % 2) == 0) ? "mx-grid-row-light" : "mx-grid-row-dark";
                        }
                    }
                    return "mx-grid-row-dark";*/
                }
	    	},
            listeners : {
				'cellclick' : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts) {                    
					_this.onSelected.notify({
                       proposalCode   : record.data.Proposal_proposalCode,
                       proposalNumber : record.data.Proposal_ProposalNumber
                        
                    });
				}			
			}				
	});	
	return this.panel;
};




