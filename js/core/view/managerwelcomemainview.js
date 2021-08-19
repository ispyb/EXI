
/**
* Class for the manager landing page. It inherits from MainView
*
* @class ManagerWelcomeMainView
* @constructor
*/
function ManagerWelcomeMainView() {
	this.icon = '../images/icon/rsz_ic_home_black_24dp.png';

	MainView.call(this);
	this.title = "Home";
	this.closable = false;

    this.sessionGrid = new SessionGrid({
                    width : null,
                    height:600,
                    isHiddenTitle : true,
                    isHiddenPI : false,
                    isHiddenNumberOfShifts : false,
                    isHiddenLocalContact : false,                                        
                    margin : '10 10 10 10'
    });
    
    this.proposalGrid = new ProposalGrid({
                                            width: 900,
                                            height:600,
                                            margin : '10 10 10 10'

                                    });
}

ManagerWelcomeMainView.prototype.getPanel = MainView.prototype.getPanel;

/**
* This sets an active proposal into the credential Manager. It also retrieve all the information about the proposal: shipments, macromolecules, crystals, buffers, etc.. and store 
* them in a local storage
*
* @method activeProposal
* @param {Object} proposal Proposal object that should container at least: [code, number]
*/
ManagerWelcomeMainView.prototype.activeProposal = function(proposal) {
    
    //EXI.mainStatusBar.showBusy("Loading proposal " +proposal); 
    
	EXI.credentialManager.setActiveProposal(this.username, proposal);
    EXI.proposalManager.clear();
	/** I don't need this to be synchronous **/	
    /*EXI.proposalManager.onActiveProposalChanged = new Event();
    EXI.proposalManager.onActiveProposalChanged.attach(function(){
        EXI.mainStatusBar.showReady();
        
    });
    
	EXI.proposalManager.get();*/
};


ManagerWelcomeMainView.prototype.getContainer = function() {
    var _this = this;

    var panelToShow = this.sessionGrid.getPanel();
    if (EXI.credentialManager.getSiteName().startsWith("MAXIV")) {
        panelToShow = this.proposalGrid.getPanel()
    }
	this.container = Ext.create('Ext.panel.Panel', {
		autoScroll : true,
        margin : 20,
        cls : 'border-grid',
        tbar : this.getToolbar(),
            items :[
                panelToShow
        ]
	});

	return this.container;
};

/**
* It receives a list of proposals and display them in the main container
*
* @param {Object} proposals Arrays of Proposal objects
* @method displayProposals
*/
ManagerWelcomeMainView.prototype.displayProposals = function(proposals) {
    var _this = this;
    this.container.removeAll();
   
    this.proposalGrid.onSelected.attach(function(sender, proposal){
            _this.panel.setLoading(true);
            var proposalCode = proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber;
            function onSuccess(sender, sessions){
                _this.displaySessions(sessions," sessions for proposal " + proposalCode);
                _this.panel.setLoading(false);
            }
            EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposal(proposalCode);
                            
            /** Loading Proposal info */                 
            _this.activeProposal( proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber);
        
    });
    
    this.container.insert(this.proposalGrid.getPanel());
    this.proposalGrid.load(proposals);
};


/**
* It receives a local contact name and will load in the sessionGrid
*
* @param {String} beamlineOperator name or surname of the beamline operator
* @method displaySessionsByBeamlineOperator
*/
ManagerWelcomeMainView.prototype.displaySessionsByBeamlineOperator = function(beamlineOperator) {
    var _this = this;
    _this.panel.setLoading(true);
    var onSuccess = function(sender, sessions){
       _this.displaySessions(sessions," sessions are scheduled for local contact: " + beamlineOperator);
       _this.panel.setLoading(false);
    }
    
    var onError = function(sender, sessions){  
        _this.sessionGrid.panel.setTitle("No sessions are scheduled for local contact: " + beamlineOperator);             
       _this.panel.setLoading(false);
    }
    EXI.getDataAdapter({onSuccess : onSuccess, onError:onError}).proposal.session.getSessionsByBeamlineOperator(beamlineOperator);
};

/**
* Retrieves a list of sessions based on a start date and end date and loads them on the session grid
*
* @param {String} start Date should be in the format of YYYYMMDD
* @param {String} end Date should be in the format of YYYYMMDD
* @method loadByDate
*/
ManagerWelcomeMainView.prototype.loadByDate = function(username, start, end) {
          var _this = this;
          var title = " sessions scheduled on " + moment(start, 'YYYYMMDD').format('MMMM Do YYYY');
          if (start != end) {
              title = " sessions scheduled from " + moment(start, 'YYYYMMDD').format('DD-MM-YYYY') + " to " + moment(end, 'YYYYMMDD').format('DD-MM-YYYY');
          }
          this.panel.setLoading(true);
          function onSuccess(sender, data){              
        	  _this.displaySessions(data, title);
        	  _this.panel.setLoading(false);
          }
          /** Increasing one day */
          end = moment(end, "YYYYMMDD").add(1, 'days').format("YYYYMMDD");                    
          if (this.isUser(username)){
		        EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposalAndDate(start, end, username);
          }
          else{
                EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByDate(start, end);
          }
};

/**
* Removes oldest sessions up to get only 500
*
* @param {String} sessions List of sessions
* @method filterSessions
*/
ManagerWelcomeMainView.prototype.filterSessions = function(sessions) {    
        var realLength = sessions.length;
        data = _.slice(sessions, 0, 500);
        // Sorting by start date because sessionId does not sort by date
        _(sessions).forEach(function(value) {
                value['ms'] = moment(value.BLSession_startDate, 'MMM DD, YYYY h:mm:ss a').format('x');
        });
        sessions = _.orderBy(sessions, ['ms'], ['desc']);
        return sessions.slice(0, 300);
        
};
        
ManagerWelcomeMainView.prototype.displaySessions = function(sessions, title) {
    var _this = this;
    
    /** it loads the session panel */
    this.container.removeAll();   
    this.container.insert(this.sessionGrid.getPanel());

    /** Handling onSelected **/
   /* this.sessionGrid.onSelected.attach(function(sender, args){
        EXI.proposalManager.clear();
        _this.activeProposal(args.proposalCode + args.proposalNumber);
    });*/
    
    this.sessionGrid.load(this.filterSessions(sessions),title);
};

ManagerWelcomeMainView.prototype.getToolbar = function() {
   var _this = this;
   var dateMenu = Ext.create('Ext.menu.DatePicker', {
        handler: function(dp, date){            
            location.href = "#/welcome/manager/" + _this.username +"/date/"+ Ext.Date.format(date, 'Ymd') +"/" + Ext.Date.format(date, 'Ymd') +"/main";          
        }
    });

    return Ext.create('Ext.toolbar.Toolbar', {
        width   : 500,
        cls 	: 'exi-top-bar',
        items: [
            {
               text: 'Choose a Date',
               icon : '../images/icon/sessions.png',
               menu: dateMenu 
            },
            {
                xtype: 'button',
                icon : '../images/icon/sessions.png',
                text: 'Choose a period of time',
                handler: function () {
                    var dateRangePicker = new DateRangePicker();
                    dateRangePicker.onSelected.attach(function(sender,dates){
                        location.href = "#/welcome/manager/" + _this.username +"/date/"+ moment(dates.startDate,'DD-MM-YYYY').format("YYYYMMDD") +"/" + moment(dates.endDate,'DD-MM-YYYY').format("YYYYMMDD") +"/main";          
                    })
                    dateRangePicker.show();
                }
            },
            {
                xtype    : 'textfield',
                name     : 'field1',
                hidden   : !EXI.credentialManager.getCredentials()[0].isManager(),
                width    : 300,
                emptyText: 'enter search term (proposal or title)',
    			listeners : {
    				specialkey : function(field, e) {
    					if (e.getKey() == e.ENTER) {
    						var found = _this.searchProposalByTerm(field.getValue());
    						_this.displayProposals(found);
    					}
    				} 
    			} 
            },
            '->',
            {             
               icon     : '../images/icon/person.png',
               border : 0
            },
             {
                xtype    : 'textfield',
                name     : 'field1',
                width    : 300,               
                emptyText: 'search by local contact',
    			listeners : {
    				specialkey : function(field, e) {
    					if (e.getKey() == e.ENTER) {    						
    						_this.displaySessionsByBeamlineOperator(field.getValue());
    					}
    				} 
    			} 
            },
        ]
    });
};

ManagerWelcomeMainView.prototype.searchProposalByTerm = function(term) {
	var result = [];
	if (this.proposals != null){
		for (var i = 0; i < this.proposals.length; i++) {
			var proposalId = this.proposals[i]["Proposal_proposalCode"] +  this.proposals[i]["Proposal_proposalNumber"];
			var title = this.proposals[i]["Proposal_title"];
			if (title == null){
				title = "";
			}
			if ((proposalId.toUpperCase().match(term.toUpperCase())) ||(title.toUpperCase().match(term.toUpperCase()))){
				result.push(this.proposals[i]);
			}
		}
	}
	return result;
};

/**
* Retrieves all proposas on ISPyB and stores them on this.proposal 
* It is useful for fast search later on
*
* @method loadProposals
*/
ManagerWelcomeMainView.prototype.loadProposals = function(callback) {
	var _this = this;
	var onSuccess = function(sender, proposals){
		_this.proposals = proposals;
        if (callback){            
            callback();
        }
	};	
	EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

/**
* Retrieves all the sessions on ISPyB and stores them on this.sessions
* It is useful for fast search later on
*
* @method loadSessions
*/
ManagerWelcomeMainView.prototype.loadSessions = function(callback) {
	var _this = this;
	var onSuccess = function(sender, sessions){
		_this.sessions = sessions;
        if (callback){
            callback();
        }
	};
	EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

ManagerWelcomeMainView.prototype.isUser = function(username) {
       return (!EXI.credentialManager.getCredentialByUserName(username).isManager() && (!EXI.credentialManager.getCredentialByUserName(username).isLocalContact()));
};

ManagerWelcomeMainView.prototype.load = function(username) {

  this.username = username;  
  /** By default for users we load all the sessions and managers only sessions that occurs today */
  if (this.isUser(username)){
  if (EXI.credentialManager.getSiteName().startsWith("MAXIV")) {
    this.loadProposalsByUsername(username);
  } else {
    this.loadSessionsByUsername(username);
  }


    /** set active proposal */
    this.activeProposal(username);
  }
  else{
    var today = moment().format("YYYYMMDD");
    this.loadSessionsByDate(username, today, today);
  }    
  EXI.setLoadingMainPanel(false);
};

/**
* Retrieves all sessions for the proposal
*
* @method loadSessions
*/
ManagerWelcomeMainView.prototype.loadSessionsByUsername = function(username) {
    this.username = username;
    var _this = this;
    this.panel.setLoading(true);
    function onSuccess(sender, data){
       _this.displaySessions(data, " sessions for user " + username);
       _this.panel.setLoading(false);
    }
    //EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposal(username);
    EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByToken();
};

/**
* Retrieves all sessions for the proposal
*
* @method loadSessions
*/
ManagerWelcomeMainView.prototype.loadProposalsByUsername = function(username) {
    this.username = username;
    var _this = this;
    this.panel.setLoading(true);
    function onSuccess(sender, data){
       _this.displayProposals(data, " proposals for user " + username);
       _this.panel.setLoading(false);
    }
    //EXI.getDataAdapter({onSuccess:onSuccess}).proposal.session.getSessionsByProposal(username);
    EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};

ManagerWelcomeMainView.prototype.loadSessionsByDate = function(username, start, end) { 
  this.username = username;
  this.loadByDate(username, start, end);  
   /** This is need for quick searchs on proposals **/
  this.loadProposals(); 
};

ManagerWelcomeMainView.prototype.loadSessionsByTerm = function(username, term) {
  this.username = username;    
  /** This is need for quick searchs on proposals **/
  var _this = this;
  var onSuccess = function(sender, proposals){
		_this.proposals = proposals;
       _this.searchProposalByTerm(term);
  };
  EXI.getDataAdapter({onSuccess:onSuccess}).proposal.proposal.getProposals();
};
