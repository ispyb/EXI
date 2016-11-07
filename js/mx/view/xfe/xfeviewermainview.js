

/**
* This view shows a main plot with the spectrum and a grid with the elements
*
* @class XfeViewerMainView
* @constructor
*/
function XfeViewerMainView() {
    this.id = BUI.id();
    MainView.call(this);

    //this.filters = ['channel', 'counts', 'Energy', 'fit', 'continuum', 'pileup'];
    this.filters = [];

    this.data = {
        labels : [], // labels = [{name: 'axisX', x: true, y, false},{name: 'axisXY', x: false, y, true}] 
        data   : [] 
    };
}

XfeViewerMainView.prototype.getPanel = MainView.prototype.getPanel;

/**
* Makes an store and a grid where the labels of the csv will be shown 
*
* @method getGrid
* @return {Grid} Retuns a Ext.panel.Grid
*/
XfeViewerMainView.prototype.getGrid = function() {
    var _this = this;
    /** Store for labels */
    this.store = Ext.create('Ext.data.Store', {
        fields: ['name', 'value', 'x', 'y'],
        sorters: [{ property: 'value', direction: 'DESC' }]
    });
    this.grid = Ext.create('Ext.grid.Panel', {
        title: 'Labels',
        store: this.store,
        cls: 'border-grid',        
        width: 300,
        height: 700,
        columns: [
            {
                text: 'name',
                dataIndex: 'name',
                flex: 1
            },
            {
                text: 'value',
                dataIndex: 'value',
                flex: 1
            },
            {
                text : 'x',
                dataIndex: '',
                id : this.id + 'x',
                flex: 0.5,
                renderer : function(grid, sample, record){
                    
                    var id = _this.id + "_" +record.data.name + "_X"; 
                    if (record.data.x){
                        return '<input disabled id="' + id+'" type="checkbox" name="x" value="bike" checked>';
                    }
                    else{
                        return '<input id="' + id+'" type="checkbox" name="x" value="bike">';
                    }
                }
            },{
                text : 'y',
                dataIndex: '',
                id : this.id + 'y',
                flex: 0.5,
                renderer : function(grid, sample, record){
                     var id = _this.id + "_" +record.data.name + "_Y"; 
                      if (record.data.y){
                        return '<input id="' + id+'" type="checkbox" name="y" value="bike" checked="' + record.data.y + '">';
                      }
                        else{
                         return '<input id="' + id+'" type="checkbox" name="y" value="bike">';
                    }
                }
            }
        ],
        listeners : {
            cellclick : function(grid, td, cellIndex, record, tr, rowIndex, e, eOpts ){
                /** This is X */
                if (cellIndex == 2){
                    _this.setXColumn(record.data.name, document.getElementById(_this.id + "_" + record.data.name + "_X").checked);
                }
                
                /** This is Y */
                if (cellIndex == 3){
                    _this.setYColumn(record.data.name, document.getElementById(_this.id + "_" + record.data.name + "_Y").checked);
                }
                _this.parseData();
            }
            
            
        }
    });
    return this.grid;
};

/**
* Sets as X axis the column labelName is selected is true. It sets to false all the other labels for the value X
*
* @method setXColumn
*/
XfeViewerMainView.prototype.setXColumn = function(labelName, selected) {
      
    var label = _.filter(this.data.labels, function(o){ return o.name == labelName;});
    if (label){
        /** As X only can be one we set all x to false */
        this.data.labels = _.map(this.data.labels,  function disable(o){o.x = false; return o;});
        if (label[0]){
            label[0].x = selected;
            label[0].y = !selected;
        }
    }
    this.store.loadData(this.data.labels);
 
};

/**
* Sets the value to selected of the attribute Y of a label
*
* @method setXColumn
*/
XfeViewerMainView.prototype.setYColumn = function(labelName, selected) {
    var label = _.filter(this.data.labels, function(o){ return o.name == labelName;});
    if (label){
        if (label[0]){
            label[0].y = selected;
        }
    }
    this.store.loadData(this.data.labels);
 
};

/**
* Returns the containers. There are four container 2xHbox(2xvbox)
*
* @method getContainer
* @return {Grid} Retuns a Ext.panel.Grid
*/
XfeViewerMainView.prototype.getContainer = function() {
    var _this = this;

    return Ext.create('Ext.container.Container', {
        layout: {
            type: 'hbox'
        },
        margin: 10,
        items: [
            {
                xtype: 'container',
                margin: '5 0 0 5',
                width: 300,
                items: [
                    this.getGrid()
                 
                ]
            },
            {
                xtype: 'container',
                flex: 0.8,
                margin: '5 0 0 5',
                items: [
                    {
                        html: '<div style="width:100%"  id="plot' + _this.id + '"></div>',
                        cls: 'border-grid',
                        id: this.id + 'containerLayout',
                        height: 700,

                    },
                    {
                        html: 'Results produced by <a href="http://pymca.sourceforge.net/">PyMca</a>',
                        cls: 'border-grid',
                        margin: '2 0 0 0',
                        flex: 1,
                        height: 20
                    }
                ]

            }
        ]
    });
};

/**
* Convert the labels as array of string into json and load in the store
* labels = ["l1, "l1"]
* sum = [1, 2]
*
* 
* @method getSumForLabels
* @return {json} Retuns [{name:'l1', value:1}, {name:'l2', value:2}]
*/
XfeViewerMainView.prototype.getSumForLabels = function(labels, sum) {
    var _this = this;
    /** Loading grid of labels */
    try {
        var toJson = function(el) {
            return {
                name: el[0].name,
                x: el[0].x,
                y: el[0].y,
                value: el[1]
            };
        };
        /** This converts to arrays labels and sum in a single json array with name and value */
        var data = _.map(_.zip(labels, sum), toJson);
        data = _.reject(data, function(o) {
            return (_.indexOf(_this.filters, o.name) != -1);
        });
        return data;
    }
    catch (err) {
        console.log(err);
    }
};



/**
* Sums the values for each columns 
*
* 
* @method sumByColums
* @return {Array} Retuns the value of sum for each column in an array
*/
XfeViewerMainView.prototype.sumByColums = function(labels, data) {
    var sum = new Array( labels.length);
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < data[i].length; j++) {
            if (sum[j] == null) {
                sum[j] = 0;
            }
            sum[j] = sum[j] + data[i][j];
        }
    }
    return sum;
};

XfeViewerMainView.prototype.getDataColumn = function(data, indexes) {
    function reduceColumns(row){
        return  _.pullAt(row, indexes);
    }
    /** Using slice to make a copy by value */
   return _.map(data, reduceColumns);

};
XfeViewerMainView.prototype.parseData = function() {
    /** get X column */
   
    /** We need first to clone in order to not touch the original data */
    var duplicatedData = _.cloneDeep(this.data.data);
   
    /** Getting the label X and data X */
    var labelX = _.filter(this.data.labels, function(o){ return o.x;})[0];
    var dataX =  this.getDataColumn(duplicatedData, [_.indexOf(this.data.labels, labelX)]);
   
   /** Getting the labels Y and data Y */
    duplicatedData = _.cloneDeep(this.data.data);
    var labelsY = _.filter(this.data.labels.slice(), function(o){ return o.y;});
    /** Getting indexes for Y columns */
    var indexes = [];
    
    for (var i = 0; i < labelsY.length; i++){
        indexes.push(_.indexOf(this.data.labels, labelsY[i]));
    }
    
    var data =  this.getDataColumn(duplicatedData, indexes);
  
   
    for ( i = 0; i < dataX.length; i++) {
        data[i] = _.concat(dataX[i], data[i]);
    }
   
    this.renderPlot( _.concat(labelX, labelsY), data);
};

/**
* It transposes the data in order to calculate the max value of Y for each statistic then it create the annotation by getting the index X
*
* 
* @method getAnnotations
*/
XfeViewerMainView.prototype.getAnnotations = function(data, labels) {
    var annotations = [];
    if (data){
        /**  First, we transpose the matrix **/
        var transposed = data[0].map(function(col, i) { 
            return data.map(function(row) { 
                return row[i]; 
            });
        });
       
        var findByMax = function(o) { return o == max; };
        for (var i = 0; i < labels.length; i++) {
                var max = _.max(transposed[i]);
                var index = _.findIndex(transposed[i], findByMax);
                annotations.push({
                            x           : data[index][0],
                            shortText   : labels[i].name,//this.data.labels[i].name,
                            text        : labels[i].name,
                            series      : labels[i].name,
                            width       : 100,
                            height      : 25
                    }
                );
        }
    }
    return annotations;
};
/**
* Render the dygraph widget on a container that should exists with id = this.id
*
* 
* @method renderPlot
*/
XfeViewerMainView.prototype.renderPlot = function(labels, data) {
    var _this = this;
  
    /** Plotting */
    var g = new Dygraph(
        document.getElementById("plot" + this.id),
        data,
        {
            legend: 'always',
            title: 'XRF',
            labels :   _.map(labels, 'name'),
            height: 600,
            width: 800,
            displayAnnotations : true,
            //sigFigs : false,
            //stackedGraph: false,
            labelsSeparateLines : true,
            labelsShowZeroValues : false,
            logscale : false,
            ylabel: 'Count'
        }
    );
  
     g.ready(function() { 
        g.setAnnotations(_this.getAnnotations(data, labels));
    });
    
};

/**
* Parser the first line of the csv file
*
* 
* @method parseHeaders
*/
XfeViewerMainView.prototype.parseHeaders = function(line) {
    /** Only first is used as X */
    var counter = 0;
    function remove(element) {
        counter = counter + 1;
        return {
                    name : element.replace(new RegExp("\"", 'g'), ""),
                    x    : counter == 1,
                    y    :  counter != 1
        };
     }
     return _.map(line.split(","), remove);
};
/**
* Gets the csv data, parses it and plot it
*
* 
* @method plot
*/
XfeViewerMainView.prototype.plot = function() {
    var _this = this;
    $.ajax({
        url: EXI.getDataAdapter().mx.xfescan.getCSV(this.xfeFluorescenceSpectrumId),
        context: this

    }).done(function(csv) {
        if (csv) {
            var lines = csv.split("\n");
            var labelsHeader = [];
            if (lines) {
                if (lines[0]) {
                   this.data.labels = this.parseHeaders(lines[0]);
                   
                }
                else {
                    /** No Lines */
                    EXI.setError("No labels on csv");
                    return;
                }

                var convertToNumber = function (element) {
                    var elements = element.split(',');
                    function toNumber(el) {
                        return parseFloat(el);
                    }
                    elements = _.map(elements, toNumber);
                    return elements;
                };
                /** Parsing data it means remove labels, split by , and convert to number */
                this.data.data = _.map(_.slice(lines, 1, lines.length - 1), convertToNumber);
                debugger
                /** Fills the labels grid */
                try {
                    
                    this.data.labels = this.getSumForLabels(this.data.labels, this.sumByColums( _this.data.labels, _this.data.data));
                    this.store.loadData(this.data.labels);
                }
                catch (e) {
                    EXI.setError(e.message);
                }
                try {
                    
                    this.renderPlot( this.data.labels,  this.data.data);
                  
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



XfeViewerMainView.prototype.load = function(xfeFluorescenceSpectrumId) {
    var _this = this;
    this.panel.setTitle("XRF Viewer");
    this.xfeFluorescenceSpectrumId = xfeFluorescenceSpectrumId;
  
    this.plot();


};
