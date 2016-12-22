function StockSolutionContainer(args) {
    this.id = BUI.id();
	
    this.templateData = {
                            id          	: this.id,
                            xmargin     	: 0,
                            ymargin     	: 0,
                            mainRadius  	: 50,
                            width       	: 100,
                            height      	: 100,
                            imgH			: 42,
                            imgW			: 42,
							margin			: 15,
							stockId			: 0,
							// rInner			: 10,
							enableMainClick : false,
                            code            : "",
                            enableClick     : false,
							enableMainMouseOver : false
                        };

	this.stockSolutionId = 0;
    this.samples = null;

	if (args){
		if (args.xMargin){
			this.templateData.xMargin = args.xMargin;
		}
		if (args.yMargin){
			this.templateData.yMargin = args.yMargin;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
		if (args.enableMainClick != null){
			this.templateData.enableMainClick = args.enableMainClick;
		}
        if (args.mainRadius){
			this.templateData.mainRadius = args.mainRadius;
			this.templateData.width = 2*args.mainRadius;
			this.templateData.height = 2*args.mainRadius;
			this.templateData.imgH = this.templateData.height*0.7;
			this.templateData.imgW = this.templateData.width*0.7;
			this.templateData.margin = (this.templateData.width - this.templateData.imgW)*0.5;
		}
        if (args.code) {
            this.templateData.code = args.code;
        }
        if (args.enableClick != null) {
            this.templateData.enableClick = args.enableClick;
        }
        if (args.stockSolutionId) {
            this.stockSolutionId = args.stockSolutionId;
            var stockSolution = EXI.proposalManager.getStockSolutionById(this.stockSolutionId);
            this.templateData.macromoleculeAcronym = EXI.proposalManager.getMacromoleculeById(stockSolution.macromoleculeId).acronym;
            this.templateData.buffer = EXI.proposalManager.getBufferById(stockSolution.bufferId).acronym;
            this.templateData.stockId = this.stockSolutionId;
        }
	}

	this.onClick = new Event(this);
	this.onMouseOver = new Event(this);
	this.onMouseOut = new Event(this);
};

StockSolutionContainer.prototype.getPanel = function () {
	
	var _this = this;
	
	this.panel =  Ext.create('Ext.panel.Panel', {
            id: this.id + "-container",
		    x: this.templateData.xMargin,
		    y: this.templateData.yMargin,
		    width : this.templateData.width + 1,
		    height : this.templateData.height + 1,
		//    cls:'border-grid',
		    frame: false,
			border: false,
			bodyStyle: 'background:transparent;',
		    
            items : [
						{
							html : this.getHTML(),
							width : this.templateData.width + 1,
							height : this.templateData.height + 1
						}
			],
			
	});

	this.panel.on('boxready', function() {
        if(_this.templateData.enableMainClick) {
			$("#" + _this.id).unbind('click').click(function(sender){
				_this.onClick.notify(sender.target.id);
			});
		}
		_this.setOnMouseOverEvent();
    });
	
	return this.panel;
	
};

StockSolutionContainer.prototype.loadSamples = function (samples) {
    this.samples = samples;
    if (samples){
		if (samples.length > 0){
			this.containerId = samples[0].Container_containerId; 
		}
	}
};

StockSolutionContainer.prototype.getHTML = function (samples) {
	var html = "";
	if (this.templateData.height < 40) {
		this.templateData.fillPanel = false;
	} else {
		this.templateData.fillPanel = true;
	}
	dust.render("stock.solution.container.template", this.templateData, function(err, out){
		html = out;
	});
	
	return html;
};

StockSolutionContainer.prototype.setOnMouseOverEvent = function () {
	var _this = this;
	
	$("#" + this.id).unbind('mouseover').mouseover(function(sender){
		_this.onMouseOver.notify(_this);
		if (_this.templateData.height < 40){
			var id = sender.currentTarget.id;
			$("#" + id).addClass("stock-solution-focus");
			
			// TOOLTIP
			var tooltipHtml = "";
			dust.render("stock.solution.tooltip.template", _this.templateData, function(err, out) {
				tooltipHtml = out;
			});
			$('body').append(tooltipHtml);
			$('#hoveringTooltipDiv-' + _this.stockSolutionId).css({
				"top" : $(this).offset().top,
				"left" : $(this).offset().left + _this.templateData.width
			});
		}
	});
	
	$("#" + this.id).unbind('mouseout').mouseout(function(sender){
		_this.onMouseOut.notify(_this);
		if (_this.templateData.height < 40){
			var stockId = sender.currentTarget.id;
			$("#" + stockId).removeClass("stock-solution-focus");

			// TOOLTIP
			$('#hoveringTooltipDiv-' + _this.stockSolutionId).remove();
		}
	});

}

StockSolutionContainer.prototype.focus = function (bool) {
	if (bool){
		$("#" + this.id + "-img").addClass("stock-solution-selected");		
	} else {
		$("#" + this.id + "-img").removeClass("stock-solution-selected");	
	}
};