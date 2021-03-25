/**
 * Displays the data collections by session or acronym of the protein
 *
 * @class MXDataCollectionGrid
 * @constructor
 */
function MXDataCollectionGrid(args) {
    this.id = BUI.id();

    /** DATACOLLECTION, DATACOLLECTION_COLLAPSED, PLATES_VIEW */
    this.renderingType = 'DATACOLLECTION';
	this.hideSendReport = true;
	
    this.uncollapsedDataCollectionGrid = new UncollapsedDataCollectionGrid();
    this.collapsedDataCollectionGrid = new CollapsedDataCollectionGrid();
    this.containersDataCollectionGrid = new ContainersDataCollectionGrid();

    this.activePanel = this.uncollapsedDataCollectionGrid;	

	if (args) {
        if (args.proposal) {
            this.proposal = args.proposal;
			if (this.proposal.toString().substring(0,2).toLowerCase() == 'fx'){
				this.hideSendReport = false
			}
        }
	}
}

MXDataCollectionGrid.prototype.getPanel = function(dataCollectionGroup) {
    var _this = this;

    this.panel = Ext.create('Ext.panel.Panel', {
        id: this.id,
        minHeight: 900,
        tbar: this.getToolBar(),
        items: [_this.activePanel.getPanel(dataCollectionGroup)]
    });
	

    return this.panel;
};

MXDataCollectionGrid.prototype.getToolBar = function() {
    var _this = this;
	
	//var proposalCode = this.proposal.Proposal_proposalCode;

    function onMenuClicked(widget) {        
        if (_this.activePanel != widget) {
            _this.activePanel = widget;
            if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                _this.reloadData(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
            } else {
                _this.reloadData(_this.dataCollectionGroup);
            }
        }
    }   

    return Ext.create('Ext.toolbar.Toolbar', {
        width: 500,
        items: [
            {
                xtype: 'buttongroup',
                columns: 3,
                //style: 'background:white; padding:1px; border: 1px solid #ddd;',
                items: [{
                        xtype: 'button',
                        text: '<span class="glyphicon glyphicon-list-alt"></span>',
                        tooltip: 'Data Collection List View',
                        id: 'DataCollectionListViewBtn',
                        pressed: true,
                        margin: '2 0 2 5',
                        enableToggle: true,
                        handler: function() {
                            _this.renderingType = "DATACOLLECTION";
                            Ext.getCmp('DataCollectionSummaryViewBtn').toggle(false);
                            Ext.getCmp('ContainerViewBtn').toggle(false);
                            onMenuClicked(_this.uncollapsedDataCollectionGrid);
                        }

                    },
                    {
                        xtype: 'button',
                        text: '<span class="glyphicon glyphicon-th-list"></span>',
                        tooltip: 'Data Collection Summary View',
                        id: 'DataCollectionSummaryViewBtn',
                        pressed: false,
                        margin: '2 0 2 5',
                        enableToggle: true,
                        handler: function() {
                            _this.renderingType = "DATACOLLECTION_COLLAPSED";
                            Ext.getCmp('DataCollectionListViewBtn').toggle(false);
                            Ext.getCmp('ContainerViewBtn').toggle(false);                            
                            onMenuClicked(_this.collapsedDataCollectionGrid);
                        }

                    },
                    {
                        xtype: 'button',
                        text: '<span class="glyphicon glyphicon-cd"></span>',
                        tooltip: 'Container View',
                        id: 'ContainerViewBtn',
                        pressed: false,
                        margin: '2 5 2 5',
                        enableToggle: true,
                        handler: function() {
                            _this.renderingType = "CONTAINERS";
                            Ext.getCmp('DataCollectionListViewBtn').toggle(false);
                            Ext.getCmp('DataCollectionSummaryViewBtn').toggle(false);
                            if (_this.activePanel != _this.containersDataCollectionGrid) {
                                _this.activePanel = _this.containersDataCollectionGrid;
                                _this.reloadData(_this.dataCollectionGroup);
                                if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                                    _this.containersDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                                }
                            }
                        }

                    }
                ]
            },
            {
                xtype: 'tbseparator'
            },
             {                     
                        text: "<span class='glyphicon glyphicon-download-alt'> PDF summary</span>",
                        id : 'pdfBtn',
                        tooltip: 'Download Session Summary Report',                                              
                        margin: '2 0 2 5',
                        handler : function(){
                            if (_this.pdfUrl != null){
                                location.href = _this.pdfUrl;                             
                            }
                        }
                    },
					{                     
                        text: "<span class='glyphicon glyphicon-download-alt'> RTF summary</span>",
                        id : 'rtfBtn',
                        tooltip: 'Download Session Summary Report as RTF',                                              
                        margin: '2 0 2 5',
                        handler : function(){
                            if (_this.rtfUrl != null){
                                location.href = _this.rtfUrl;                             
                            }
                        }
                    },
                    {
                        text: "<span class='glyphicon glyphicon-download-alt'> CSV summary</span>",
                        id : 'xlsBtn',
                        tooltip: 'Download Session Summary as CSV',
                        margin: '2 0 2 5',
                        handler : function(){
                            debugger;
                            if (_this.csvUrl != null){
                                location.href = _this.csvUrl;
                            }
                        }
                    },
					{                     
                        text: "<span class='glyphicon glyphicon-download-alt'> PDF analysis</span>",
                        id : 'pdfBtn2',
                        tooltip: 'Download Session Analysis Report',                                              
                        margin: '2 0 2 5',
                        handler : function(){
                            if (_this.pdfAnalysisUrl != null){
                                location.href = _this.pdfAnalysisUrl;                             
                            }
                        }
                    },
             {                     
                        text: "<span class='glyphicon glyphicon-download-alt'> RTF analysis</span>",
                        id : 'rtfBtn2',
                        tooltip: 'Download Session Analysis Report as RTF',                                              
                        margin: '2 0 2 5',
                        handler : function(){
                            if (_this.rtfAnalysisUrl != null){
                                location.href = _this.rtfAnalysisUrl;                             
                            }
                        }
                },
					{                     
                        text: "<span class='glyphicon glyphicon-envelope'> Send Report </span>",
                        id : 'sendPdfBtn',
                        tooltip: 'Send Session Summary Report as PDF',                                              
                        margin: '1 0 1 2',
						hidden: _this.hideSendReport,
                        handler : function(){
                            if (_this.sendPdfUrl != null){
                                location.href = _this.sendPdfUrl;                             
                            }
                        }
                    },

            '->',
            {
                html: '<span class="glyphicon glyphicon-download-alt"></span> Best results',
                padding: '10px',
                hidden: true,
                handler: function(sender, target) {
                    data = _this.dataCollectionGroup;
                    if (_this.filter) {
                        data = _this.filterBy(_this.filter);
                    }
                    var dataCollectionsWithResults = _.filter(data, function(d) {
                        return d.resultsCount
                    });
                    if (dataCollectionsWithResults && dataCollectionsWithResults.length > 0) {
                        _this.panel.setLoading();
                        var onSuccess = function(sender, data) {
                            _this.panel.setLoading(false);
                            if (data) {
                                var parsedResults = [];
                                for (var i = 0; i < data.length; i++) {
                                    parsedResults.push(new AutoProcIntegrationGrid().parseData(data[i]))
                                }
                                var bestResults = _.filter(_.flatten(parsedResults), function(r) {
                                    return r.label == "BEST"
                                });
                                if (bestResults && bestResults.length > 0) {
                                    var url = EXI.getDataAdapter().mx.autoproc.downloadAttachmentListByautoProcProgramsIdList(_.map(bestResults, "v_datacollection_summary_phasing_autoProcProgramId").toString());
                                    window.open(url, "_blank");
                                }
                            }
                        }

                        EXI.getDataAdapter({
                            onSuccess: onSuccess
                        }).mx.autoproc.getViewByDataCollectionId(_.map(dataCollectionsWithResults, "DataCollection_dataCollectionId").toString());
                    }
                }
            },
            '->',
            {
                xtype: 'textfield',
                id: this.id + "_search",
                width: 400,
                emptyText: 'enter search prefix, sample, protein or filePath',
                listeners: {
                    specialkey: function(field, e) {
                        if (e.getKey() == e.ENTER) {
                            _this.filter = field.getValue();
                            if (_this.renderingType == "CONTAINERS") {
                                if (Ext.getCmp(_this.id + "_search").getValue() != "") {
                                    _this.containersDataCollectionGrid.select(_this.filterBy(Ext.getCmp(_this.id + "_search").getValue()));
                                } else {
                                    Ext.getCmp(_this.id + "_found").setText("");
                                    _this.reloadData(_this.dataCollectionGroup);
                                }
                            } else {
                                _this.reloadData(_this.filterBy(field.getValue()));
                            }
                        }
                    }
                }
            },
            {
                xtype: 'tbtext',
                text: '',
                id: this.id + "_found"
            }
        ]
    });
};

MXDataCollectionGrid.prototype.reloadData = function(dataCollections) {
    this.panel.removeAll();
    this.panel.add(this.activePanel.getPanel(this.dataCollectionGroup));
    this.activePanel.load(dataCollections);
};

MXDataCollectionGrid.prototype.load = function(dataCollectionGroup) {
    this.dataCollectionGroup = dataCollectionGroup;
    this.activePanel.load(this.dataCollectionGroup);

    /** Download PDF by session */
    var sessionsId = _.keyBy(this.dataCollectionGroup, "BLSession_sessionId" );    
    for (sessionId in sessionsId){
        this.pdfUrl = EXI.getDataAdapter().mx.dataCollection.getReportURLBySessionId(sessionId);
        this.rtfUrl = EXI.getDataAdapter().mx.dataCollection.getRtfReportURLBySessionId(sessionId);
        this.csvUrl = EXI.getDataAdapter().mx.dataCollection.getCSVReportURLByFilterParam(sessionId);
		this.pdfAnalysisUrl = EXI.getDataAdapter().mx.dataCollection.getAnalysisReportURLBySessionId(sessionId);
        this.rtfAnalysisUrl = EXI.getDataAdapter().mx.dataCollection.getRtfAnalysisReportURLBySessionId(sessionId);
		this.sendPdfUrl = EXI.getDataAdapter().mx.dataCollection.sendPdfReport(sessionId);
    }
		
};

/**
 * Filters data by prefix, protein acronym, sample or image directory
 *
 * @method filterBy
 * @return {String} searchTerm prefix, protein acronym, sample or image directory to be searched
 */
MXDataCollectionGrid.prototype.filterBy = function(searchTerm) {
    var filtered = _.filter(this.dataCollectionGroup, function(dataCollection) {
        var params = ["DataCollection_imagePrefix", "Protein_acronym", "BLSample_name", "DataCollection_imageDirectory"];
        for (var i = 0; i < params.length; i++) {
            var param = params[i];
            if (dataCollection[param]) {
                if (dataCollection[param].indexOf(searchTerm) != -1) {
                    return dataCollection;
                }
            }
        }
    });
    Ext.getCmp(this.id + "_found").setText(filtered.length + " items found");
	this.pdfUrl = EXI.getDataAdapter().mx.dataCollection.getReportURLByFilterParam(searchTerm);
	this.rtfUrl = EXI.getDataAdapter().mx.dataCollection.getRtfReportURLByFilterParam(searchTerm);
	this.csvUrl = EXI.getDataAdapter().mx.dataCollection.getCSVReportURLByFilterParam(searchTerm);
	this.pdfAnalysisUrl = EXI.getDataAdapter().mx.dataCollection.getAnalysisReportURLByFilterParam(searchTerm);
    this.rtfAnalysisUrl = EXI.getDataAdapter().mx.dataCollection.getRtfAnalysisReportURLByFilterParam(searchTerm);
    return filtered;
};