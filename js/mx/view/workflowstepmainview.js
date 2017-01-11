function WorkflowStepMainView() {
	this.icon = 'images/icon/ic_satellite_black_18dp.png';
	MainView.call(this);	
	var _this = this;
	
}

WorkflowStepMainView.prototype.getPanel = MainView.prototype.getPanel;


WorkflowStepMainView.prototype.getContainer = function() {
	this.mainPanel = Ext.create('Ext.panel.Panel', {
	    cls : 'border-grid',	 
        autoScroll: true,
        title : "Workflow",
        margin : '10 0 0 10',
	    //height : 800,
	    flex : 1,
	    items: [
	    ]
	});
	return this.mainPanel;
};

WorkflowStepMainView.prototype.onBoxReady = function() {
	
};

WorkflowStepMainView.prototype.getGrid = function(title, columns, data) {
	var store = Ext.create('Ext.data.Store', {
        fields:columns,
        data:data
    });
    var gridColumns = [];
    for (var i = 0; i < columns.length; i++) {
         gridColumns.push({ text: columns[i],  dataIndex: columns[i], flex: 1 });
    }
    var panel = Ext.create('Ext.grid.Panel', {
        title: title,
        flex : 1,
        margin : '10 180 10 10',
        cls : 'border-grid',	 
        store: store,
        columns: gridColumns
    });
    
    panel.on('boxready', function() {
        
    });
    
    return panel;
};

WorkflowStepMainView.prototype.getImageResolution = function(imageItem) {  
    if (imageItem.xsize){
        var ratio = imageItem.xsize/1024;
        imageItem.xsize = imageItem.xsize*ratio;
        imageItem.ysize = imageItem.ysize*ratio;
    }
    return imageItem;
};

WorkflowStepMainView.prototype.getImagesResolution = function(imageItems) {  
    var resolution = 1024;   
    resolution = resolution/imageItems.length;
    for (var i = 0; i < imageItems.length; i++) {
        var imageItem = imageItems[i];        
         if (imageItem.xsize){
            var ratio = resolution/imageItem.xsize;
            imageItem.xsize = imageItem.xsize*ratio;
            imageItem.ysize = imageItem.ysize*ratio;
        } 
    }
    return imageItems;
};

WorkflowStepMainView.prototype.load = function(workflowStep) {
    var _this = this;
    this.panel.setTitle("Workflow");
    _this.mainPanel.removeAll();
     _this.mainPanel.setLoading();
     
    function onSuccess(sender, data){    
   
        var items = JSON.parse(data).items;
        _this.items = items;
        _this.panel.setTitle(JSON.parse(data).title);
        
        var insertContainer = function(err, out){                    
                _this.mainPanel.insert({
                        padding : 2,
                        html : out
                });
        };
        
        for (var i = 0; i < items.length; i++) {
            console.log(items[i]);
            var events = [];
            switch(items[i].type) {
                case "table":
                    //_this.mainPanel.insert(_this.getGrid(items[i].title,items[i].columns, items[i].data));
                    //continue;                    
                case "image":
                    items[i] = _this.getImageResolution(items[i]);
                    break;
                case "images":
                    items[i].items = _this.getImagesResolution(items[i].items);  
                    break;
                 case "logFile":
                    items[i].id = BUI.id(); 
                    events.push(function(){
                        $( "#" + items[i].id ).click(function() {
                            var item = _.find(_this.items, {id:this.id});
                            var filename = item.title.replace(/\s/g, ""); + ".log";
                            var text = item.logText;
                            var pom = document.createElement('a');
                            pom.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
                            pom.setAttribute('download', filename);

                            if (document.createEvent) {
                                var event = document.createEvent('MouseEvents');
                                event.initEvent('click', true, true);
                                pom.dispatchEvent(event);
                            }
                            else {
                                pom.click();
                            }
                            
                            
                            
                            
                        });       
                    }); 
                    break;
                default:
                   
            }
            
            dust.render("workflowmainview.template", items[i], insertContainer);
            
            for(var j =0; j< events.length; j++){
                events[j]();
            }
        }
      
        _this.mainPanel.setLoading(false);
    }
    
    EXI.getDataAdapter({onSuccess: onSuccess}).mx.workflowstep.getResultByWorkflowStepId(workflowStep.workflowStepId);
		
};


