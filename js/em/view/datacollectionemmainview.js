/**
* Landing page for where data collections are shown. It manages the DataCollectionSummaryGrid
*
* @class DataCollectionEmMainView
* @constructor
*/
function DataCollectionEmMainView(args) {
    this.icon = '../images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    if (args) {
        if (args.sessionId) {
            this.sessionId = args.sessionId;
        }
    }
}

DataCollectionEmMainView.prototype.getPanel =  function() {
    var _this = this;
    
    this.container = Ext.create('Ext.panel.Panel', {   
    layout : 'fit',    
    padding : "5 40 0 5",
    items: [ 
        {
             html : '<div style="overflow: auto;height:100%;" id="' + this.id +'_main"></div>'
        }
        ]
        
    });
    return this.container;
};


DataCollectionEmMainView.prototype.loadProposal = function (proposal) {
    this.panel.setTitle("");
    this.proposal = proposal;
    this.panel.setTitle(this.proposal.Proposal_proposalCode + this.proposal.Proposal_proposalNumber);
    this.panel.tab.on('click',function(){
        location.href = "#/welcome/manager/proposal/"+ proposal.Proposal_proposalCode + proposal.Proposal_proposalNumber +"/main";
    });
}

DataCollectionEmMainView.prototype.loadCollections = function(dataCollections) {
    var _this = this;
    dataCollections = _.orderBy(dataCollections, ['Movie_movieId'], ['desc']);
    for(var i = 0; i < dataCollections.length; i++){
       dataCollections[i].micrographThumbnailURL = EXI.getDataAdapter().em.dataCollection.getMicrographThumbnailURL(dataCollections[i].Movie_dataCollectionId, dataCollections[i].Movie_movieId);
       dataCollections[i].metadataXMLURL = EXI.getDataAdapter().em.dataCollection.getMovieMetadataXMLURL(dataCollections[i].Movie_dataCollectionId, dataCollections[i].Movie_movieId);
       dataCollections[i].motionCorrectionDriftURL = EXI.getDataAdapter().em.dataCollection.getMotionCorrectionDriftURL(dataCollections[i].Movie_dataCollectionId, dataCollections[i].Movie_movieId);
       dataCollections[i].motionCorrectionThumbnailURL = EXI.getDataAdapter().em.dataCollection.getMotionCorrectionThumbnailURL(dataCollections[i].Movie_dataCollectionId, dataCollections[i].Movie_movieId);
       dataCollections[i].ctfSpectraURL = EXI.getDataAdapter().em.dataCollection.geCTFThumbnailURL(dataCollections[i].Movie_dataCollectionId, dataCollections[i].Movie_movieId);       
       
    }
    dust.render("datacollectionemgrid.template", dataCollections,function(err,out){         
          $('#' + _this.id +'_main').html(out);
    });
    var node = document.getElementById(_this.id +'_main');
    console.log(node);
    var lazy = {
            bind: 'event',
            /** !!IMPORTANT this is the parent node which contains the scroll **/
            appendScroll: node,
            beforeLoad: function(element) {
                console.log('image "' + (element.data('src')) + '" is about to be loaded');
               
            },           
            onFinishedAll: function() {
                EXI.mainStatusBar.showReady();
            }
    };


    var timer1 = setTimeout(function() {  $('.img-responsive').lazy(lazy);}, 500);
    var timer2 = setTimeout(function() {  $('.smalllazy').lazy(lazy);}, 500);  
};
