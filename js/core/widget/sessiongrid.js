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
    
    this.dataCollectionCountKey = ['energyScanCount', 'xrfSpectrumCount','testDataCollectionGroupCount','dataCollectionGroupCount',  'imagesCount', 'calibrationCount', 'hplcCount', 'sampleChangerCount']

    /** Array with the beamline selected to make the filter */
    this.beamlineFilter = [];
    // Term filter value
    this.termFilter = "";
    
	if (args != null) {
        
        if (args.width != null) {
			this.width = args.width;
		}
      
		if (args.height != null) {
			this.height = args.height;
		}

		if (args.tbar != null) {
			this.tbar = args.tbar;
		}
	
	}

};

SessionGrid.prototype.getDataCollectionURL = function(session) {   
     if (EXI.credentialManager.getTechniqueByBeamline(session.beamLineName) == "SAXS"){
         return "#/saxs/proposal/" + session.Proposal_proposalCode + session.Proposal_ProposalNumber +"/session/nav/" + session.sessionId + "/session";
     }           
     return "#/mx/proposal/" + session.Proposal_proposalCode + session.Proposal_ProposalNumber +"/datacollection/session/" + session.sessionId + "/main";     
};


SessionGrid.prototype.renderHTML = function(sessions) {              
    var _this = this;
    dust.render("session.grid.mx.datacollection.template", sessions,function(err,out){ 
          $('#' + _this.id +'_main').html(out);
    });      
};

SessionGrid.prototype.getSumDataCollections = function(session) {   
    var sum = 0;
    for (var i in this.dataCollectionCountKey){        
        var key = this.dataCollectionCountKey[i];
        if (session[key]){
            sum = sum + parseInt(session[key]);
        }
    }
    return sum;
};

SessionGrid.prototype.load = function(sessions) {    
    var _this = this;

    /** Filtering session by the beamlines of the configuration file */        
    this.sessions = _.filter(sessions, function(o){ return _.includes(EXI.credentialManager.getBeamlineNames(), o.beamLineName); });

    /** Parsing data */
    for(var i=0; i < this.sessions.length; i++){
        this.sessions[i].dataCollectionURL = this.getDataCollectionURL(this.sessions[i]);
        this.sessions[i].totalDataCollectionCount = this.getSumDataCollections(this.sessions[i]);
    }
   

    this.sessions = this.sessions.sort(function(a,b){return new Date(a.BLSession_startDate) - new Date(a.BLSession_startDate);});
    this.renderHTML(this.sessions);

    // Attach listener to edit the session comments
    var attachListeners = function(grid) {
        $("span.session-comment-edit").click(function(sender){
            var sessionId = sender.target.id.split("-")[0];
            _this.editComments(sessionId);
        });
    };
    
    var timer = setTimeout(attachListeners, 500, _this);
};

SessionGrid.prototype.filterByBeamline = function(sessions, beamlines) {
    if (beamlines){
        if (beamlines.length > 0){
            var filtered = [];
            for(var i = 0; i < beamlines.length; i++){
                filtered = _.concat(filtered, (_.filter(sessions, {'beamLineName': beamlines[i]})));
            }
            return filtered;
        }
        else{
            return sessions;
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
                        _this.beamlineFilter =_.remove(_this.beamlineFilter, function(n) {                            
                                return n  != a.boxLabel;
                        });
                    }

                    var filtered = _this.filterByBeamline(_this.sessions,_this.beamlineFilter);
                    if (_this.termFilter != ""){
                        filtered = _this.filterByTerm(filtered,_this.termFilter);
                    }
                    _this.store.loadData([{ sessions: filtered}],false);
                    //_this.panel.setTitle(filtered.length + " sessions");
                    
                     _this.renderHTML(filtered);
    };
    
    for (var i =0; i<EXI.credentialManager.getBeamlines().length; i++){        
        items.push({           
                xtype: 'checkbox',
                boxLabel : EXI.credentialManager.getBeamlines()[i].name,
                name : EXI.credentialManager.getBeamlines()[i].name,
                handler : myHandler 
            
        });
    }

    items.push("->",
                {
                    xtype    : 'textfield',
                    name     : 'proposalFilter',
                    width    : 300,
                    emptyText: 'Filter by term (proposal or title) or comment',
                    listeners : {
                        specialkey : function(field, e) {
                            if (e.getKey() == e.ENTER) {
                                _this.termFilter = field.getValue();
                                var filtered = _this.filterByTerm(_this.sessions, _this.termFilter);
                                if (_this.beamlineFilter.length > 0) {
                                    filtered = _this.filterByBeamline(filtered,_this.beamlineFilter);
                                }
                                _this.store.loadData(filtered,false);
                                _this.panel.setTitle(filtered.length + " sessions");
                            }
                        } 
                    } 
                }
    );

    return Ext.create('Ext.toolbar.Toolbar', {  
        items: items
    });
};

SessionGrid.prototype.filterByTerm = function (sessions,term) {
    if (term == ""){
        return sessions;
    } else {
        var result = [];
        for (var i = 0 ; i < sessions.length ; i++){
            var proposalId = sessions[i]["Proposal_proposalCode"] +  sessions[i]["Proposal_ProposalNumber"];
            var title = sessions[i]["Proposal_title"];
            var comments = sessions[i].comments;
            if (title == null){
                title = "";
            }
            if (comments == null){
                comments = "";
            }
            if ((comments.toUpperCase().match(term.toUpperCase())) || (proposalId.toUpperCase().match(term.toUpperCase())) ||(title.toUpperCase().match(term.toUpperCase()))){
                result.push(sessions[i]);
            }
        }
        return result;
    }
}

SessionGrid.prototype.getPanel = function() {
	var _this = this;

    var labContacts = EXI.proposalManager.getLabcontacts();
    
  
   
    this.store = Ext.create('Ext.data.Store', {
		fields : [ 'comments'],
		emptyText : "No sessions",
		data : []
	});    

    
   
	this.panel = Ext.create('Ext.panel.Panel', {				
        tbar : this.getToolbar(),				
		cls : 'border-grid',
		minHeight: 300,                
        width : this.width,
        height : this.height,
		margin : this.margin,     
		layout : this.layout,
		items : [   
                  {
                       html : '<div style="overflow: auto;height:100%;" id="' + this.id +'_main"></div>'

                  }
           ]			
	});

	return this.panel;
};

/**
* Opens a modal to edit a comment
* @method editComments
* @param Integer id The id
*/
SessionGrid.prototype.editComments = function (id) {
    var comment = $("#comments_" + id).html().trim();
    var commentEditForm = new CommentEditForm({mode : "SESSION"});
    commentEditForm.onSave.attach(function(sender,comment) {
        $("#comments_" + id).html(comment);
    });
    commentEditForm.load(id,comment);
    commentEditForm.show();
};