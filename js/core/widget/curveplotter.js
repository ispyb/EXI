function CurvePlotter(args) {
    this.id = BUI.id();

    this.backgroundColor = "#FFFFFF";

    this.margin = 10;
    this.ruleColor = "black";
    this.targetId = "plotCanvas" + BUI.id();
    this.legend = 'onmouseover';

    if (args != null) {
        if (args.margin != null) {
            this.margin = args.margin;
        }
        if (args.legend != null) {
            this.legend = args.legend;
        }
        if (args.targetId != null) {
            this.targetId = args.targetId;
        }
        
    }

    this.onRendered = new Event(this);
    this.onPointClickCallback = new Event();

}

CurvePlotter.prototype.getPanel = function() {
    this.plotPanel = Ext.create('Ext.container.Container', {       
        flex: 1,
        margin: this.margin,
        items: [{
            html: '<div id="' + this.targetId + '"></div>',
            id: this.id,
        }]
    });

    this.plotPanel.on("afterrender", function() {
    });

    this.plotPanel.on("resize", function() {
    });
    return this.plotPanel;
};

CurvePlotter.prototype.getPointCount = function() {
    return this.dygraph.rawData_.length;
};

CurvePlotter.prototype.getColors = function() {
    return this.dygraph.getColors();
};

CurvePlotter.prototype.getLabels = function() {
    return this.dygraph.getLabels();
};

CurvePlotter.prototype.render = function(url) {
    var _this = this;
    if (document.getElementById(this.targetId) != null) {
        document.getElementById(this.targetId).innerHTML = "";

        this.width = this.plotPanel.getWidth();
        this.height = this.plotPanel.getHeight();

        document.getElementById(this.targetId).setAttribute("style", "border: 1px solid #000000; height:" + (this.plotPanel.getHeight() - 1) + "px;width:" + (this.plotPanel.getWidth() - 2) + "px;");

        Ext.getCmp(this.id).setHeight(this.plotPanel.getHeight());
        Ext.getCmp(this.id).setWidth(this.plotPanel.getWidth());


        this.dygraph = new Dygraph(
            document.getElementById(this.targetId),
            url,
            {
                title: this.title,
                titleHeight: 20,

                //legend: this.legend,
                labelsSeparateLines: true,
                errorBars: true,
                connectSeparatedPoints: true,
                pointClickCallback: function(e, p) {
                    _this.onPointClickCallback.notify(p.name);
                }
            }

        );
      
        this.dygraph.ready(function() {
            _this.onRendered.notify();
        });
    }
};

CurvePlotter.prototype.loadMerge = function(subtractionIdList, from, to, scale) {
    this.render(EXI.getDataAdapter().saxs.hplc.getFramesMergeURL(subtractionIdList, from, to, scale));
};

CurvePlotter.prototype.loadHPLCFrame = function(experimentId, frameNumber) {
    this.render(EXI.getDataAdapter().saxs.hplc.getHPLCFramesScatteringURL(experimentId, frameNumber));
};

CurvePlotter.prototype.loadUrl = function(url) {
    this.render(url);
};


CurvePlotter.prototype.load = function(selections) {
    this.render(EXI.getDataAdapter().saxs.frame.getFramesURL(selections.frame, selections.average, selections.subtracted, selections.sampleaverage, selections.bufferaverage, null, selections.operation));
};


function AutoProcIntegrationCurvePlotter(args) {
    CurvePlotter.call(this, args);

    this.margin = '10 0 0 0';
    this.height = null;
    this.valueRange = null;
    this.title = "";
    this.labelsDiv = null;
    this.strokeWidth = 1.0;
    this.labelsSeparateLines = false;
    this.useHighlightCallback = false;

    this.data = {
        labels: [], // labels = [{name: 'axisX', x: true, y, false},{name: 'axisXY', x: false, y, true}] 
        data: []
    };

    this.xLabels = [];

    if (args != null) {
        if (args.height != null) {
            this.height = args.height;
        }
        if (args.title != null) {
            this.title = args.title;
        }
        if (args.valueRange != null) {
            this.valueRange = args.valueRange;
        }
        if (args.labels != null) {
            this.data.labels = args.labels;
        }
        if (args.labelsDiv) {
            this.labelsDiv = args.labelsDiv;
        }
        if (args.strokeWidth) {
            this.strokeWidth = args.strokeWidth;
        }
        if (args.labelsSeparateLines != null) {
            this.labelsSeparateLines = args.labelsSeparateLines;
        }
        if (args.useHighlightCallback != null) {
            this.useHighlightCallback = args.useHighlightCallback;
        }
    }

}


AutoProcIntegrationCurvePlotter.prototype.getPointCount = CurvePlotter.prototype.getPointCount;
AutoProcIntegrationCurvePlotter.prototype.getLabels = CurvePlotter.prototype.getLabels;


AutoProcIntegrationCurvePlotter.prototype.toCSV = function(labels, data) {
    var csv = labels.toString() + "\n";
    for (var i = 0; i< data.length; i++){
        for (var j = 0; j< data[i].length; j++){
            csv = csv +  data[i][j] + "," ;
        }
        /** Removing last , */
        csv = csv.substring(0, csv.length - 1);
        csv = csv + "\n";
        
    }
    return csv;
};
/**
* Render the dygraph widget on a container that should exists with id = this.id
*
* 
* @method render
*/
AutoProcIntegrationCurvePlotter.prototype.render = function(labels, data) {
    var _this = this;
    var colors = ["#008800","#000088","#880000","#DD8800","#AA00AA","#FF3300","#6600FF","#880088","#88808","#808080","#008A0A","#F0880F","#0088FF","#FF00FF","#000000","#0AAAA0"];
    var highlightCallback = null;
    if (this.useHighlightCallback) {
        highlightCallback = function(event, x, points, row, seriesName) {
            var html = "";
            for (var i = 1 ; i < _this.data.labels.length ; i++) {
                html += '<span style="font-weight: bold; font-size:8pt; color: ' + colors[i-1] + ';">';
                html += '<div style="display: inline-block; position: relative; bottom: .5ex; padding-left: 1em; height: 1px; border-bottom: 2px solid ' + colors[i-1] + ';"></div> ';
                html += _this.data.labels[i] + "</span><br/>";
            }
            html += "<hr style='margin:5px;border-color:#000000' />";
            html += "Resolution " + Number(_this.xRange[0] + _this.xRange[1] - x).toFixed(2) + "<br/>";
            var yLabel = _this.title.split(" vs ")[0];
            for (var i = 0 ; i < points.length ; i++) {
                html += "<span style='font-weight: bold;color: " + colors[_this.data.labels.indexOf(points[i].name)-1] + "'>" + yLabel + " " + points[i].yval + "</span><br/>";
            }
            $(".dygraph-legend").html(html);
        } 
    }

    /** Plotting */
    var g = new Dygraph(
        document.getElementById(this.targetId),
        this.toCSV(labels, data),
        {
            title: this.title,
            titleHeight: 20,
            legend : 'always',
            height: this.height - 100,
            hideOverlayOnMouseOut :true,
            labelsSeparateLines: this.labelsSeparateLines,
            labelsDiv : this.labelsDiv,
            labelsDivStyles : " { 'fontSize': 6 } ",
            strokeWidth : this.strokeWidth,
            valueRange : this.valueRange,
            highlightCallback : highlightCallback,
            colors : colors,
            
            connectSeparatedPoints: true,
            pointClickCallback: function(e, p) {
                _this.onPointClickCallback.notify(p.name);
            },
            axes : {
                x: {
                    axisLabelFormatter: function(d, gran, opts) {
                        return Number(_this.xRange[0] + _this.xRange[1] - d).toFixed(2);                        
                    },
                    valueFormatter: function (x, opts, seriesName, g, row, col) {
                        return seriesName + " " + Number(_this.xRange[0] + _this.xRange[1] - x).toFixed(2);
                    }
                },
                y : {
                    valueFormatter: function (y, opts, seriesName, g, row, col) {
                        return y;
                    }
                }
            }
        }

    );

    g.ready(function() {
        //g.setAnnotations(_this.getAnnotations(data, labels));
    });

};

/**
 * Example csv
Resolution,11259175,11259180,11259326
2.4,143.9,0,143.9,0,,0
2.57,99.2,0,99.2,0,,0
2.77,62.7,0,62.7,0,,0
3.04,41.4,0,41.4,0,,0
3.39,24.0,0,24.0,0,,0
3.74,,0,,0,56.0,0
3.87,,0,,0,55.0,0
3.91,18.2,0,18.2,0,,0
4.03,,0,,0,53.0,0
4.21,,0,,0,53.6,0
4.43,,0,,0,54.6,0
4.71,,0,,0,53.9,0
4.78,19.1,0,19.1,0,,0
5.07,,0,,0,49.2,0
5.59,,0,,0,52.2,0
6.39,,0,,0,45.5,0
6.73,16.4,0,16.4,0,,0
8.05,,0,,0,38.1,0
 */
AutoProcIntegrationCurvePlotter.prototype.loadUrl = function(url) {

    var _this = this;
    $.ajax({
        url: url,
        context: this

    }).done(function(csv) {
        var index = 0;
        var _this = this;
        _this.xLabels = [];
        if (csv) {
            var lines = csv.split("\n");
            var labelsHeader = [];

            if (lines) {
                if (this.data.labels.length == 0) {
                    if (lines[0]) {
                        this.data.labels = lines[0].split(",");
                    }
                    else {
                        /** No Lines */
                        EXI.setError("No labels on csv");
                        return;
                    }
                }

                var toNumber = function toNumber(el) {
                        if (el) {
                            if (el != "") {
                                return parseFloat(el);
                            }
                            else {
                                return "";
                            }
                        }
                        else {
                            return "";
                        }
                };
                    
                var convertToNumber = function (element) {
                    var noError = [];
                    var index = lines.indexOf(element);
                    var elements = element.split(',');                                  
                    elements = _.map(elements, toNumber);               
                    // noError.push(index);
                    noError.push(elements[0]);
                    _this.xLabels.push(elements[0]);
                    var valueElements = [];
                    for (var i = 0 ; i < elements.length ; i++){
                        if (i % 2 != 0) {
                            valueElements.push(elements[i]);
                        }
                    }
                    noError = noError.concat(valueElements);
                    index = index + 1;
                    return noError;
                };

                lines = lines.reverse();
                /** Parsing data it means remove labels, split by , and convert to number */
                this.data.data = _.map(_.slice(lines, 1, lines.length - 1), convertToNumber);
                this.xRange = [_.min(this.xLabels),_.max(this.xLabels)];
                // Mirror the x-axis
                for (var i = 0 ; i < this.data.data.length ; i++) {
                    var data = this.data.data[i];
                    data[0] = Number(_this.xRange[0] + _this.xRange[1] - data[0]).toFixed(2);
                }
                try {
                    if (this.data.data.length > 0){
                        // Manage the case when there are more values than labels
                        if (this.data.labels.length < this.data.data[0].length) {
                            _.map(this.data.data,function(d){
                                _this.data.data[_this.data.data.indexOf(d)] = d.slice(0,_this.data.labels.length);
                            });
                        }
                        this.render(this.data.labels, this.data.data);
                    }
                }
                catch (e) {
                    EXI.setError(e.message);
                }
            }
        }
        else {
            /** No Lines */
            EXI.setError("CSV is empty");
            return;
        }
    });

};

AutoProcIntegrationCurvePlotter.prototype.getHTML = function() {
    return '<div  id="' + this.targetId + '"></div><div  style="height:20px" id="' + this.targetId + '_legend"></div>';
};

AutoProcIntegrationCurvePlotter.prototype.getPanel = function() {
    
    this.plotPanel = Ext.create('Ext.panel.Panel', {
        layout: {
            type: 'fit'
        },
        height: this.height,
        margin: this.margin,
        items: [{
                    html: this.getHTML(),
                    id: this.id,
                    style: {
                      border: "1px solid black"  
                    },
                    height : this.height,
                    border : 1
        }
       
        ]
    });   
    return this.plotPanel;
};