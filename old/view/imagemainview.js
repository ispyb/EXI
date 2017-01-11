function ImageMainView() {
    this.icon = 'images/icon/ic_satellite_black_18dp.png';
    MainView.call(this);
    var _this = this;

    this.imageViewer = new ImageResolutionViewer();

    this.detectorResolution = {
        pixelSize: {
            x: 1475,
            y: 1679
        },
        sensitiveArea: {
            x: 253.7,
            y: 288.8
        },
        pixelSizeHorizontal: 0.172

    };

    //this.surfaceScatteringViewer = new SurfaceScatteringViewer();

    this.imageViewer.onImageRendered.attach(function(sender, data) {
        //_this.surfaceScatteringViewer.load(data);

    });
    
    this.imageViewer.onMouseOver.attach(function(sender, point) {
       console.log(point);

    });
    
}

ImageMainView.prototype.getPanel = MainView.prototype.getPanel;

ImageMainView.prototype.getContainer = function() {
    return Ext.createWidget('tabpanel',
        {
            plain: true,
            margin: '10 30 10 10',
            items: [

                {
                    tabConfig: {
                        title: '2D'
                    },
                    items: [{
                        xtype: 'container',
                        layout: 'hbox',
                        paddding: 5,
                        style: {
                            borderColor: 'gray',
                            borderStyle: 'solid',
                            borderWidth: '1px',
                            'background-color': 'white'
                        },
                        items: [
                            this.imageViewer.getPanel(),
                            {

                                html: "<div id='" + this.id + "detector' ></div>",
                                margin: '0 0 0 5',
                                height: 800
                            }

                        ]
                    }
                    ]
                },
                /*{
                    tabConfig : {
                        title : '3D'
                    },
                    items : [ {
                        xtype : 'container',
                        layout : 'hbox',
                        style : {
                            borderColor : 'gray',
                            borderStyle : 'solid',
                            borderWidth : '1px',
                            'background-color' : 'white' 
                        },
                        items : [ 
                            this.surfaceScatteringViewer.getPanel()
                        	
                        ]
                    }
                    ]
                    },
                {
                    tabConfig : {
                        title : 'Parameters'
                    },
                    items : [ {
                        xtype : 'container',
                        layout : 'fit',
                        style : {
                            borderColor : 'gray',
                            borderStyle : 'solid',
                            borderWidth : '1px',
                            'background-color' : 'white' 
                        },
                        items : [ 
                            this.getParametersGrid()
                        ]
                    }
                    ]
                    }*/




            ]
        });
};



/*MainView.prototype.getParametersGrid = function(imageId, dataCollectionId) {
	this.storeParameters = Ext.create('Ext.data.Store', {
	    fields:['key', 'value'],
            sorters : 'key'
	});

	this.parametersPanel = Ext.create('Ext.grid.Panel', {
	    title: 'Parameters',
	    store: this.storeParameters,
	    columns: [
		{ text: 'Key',  dataIndex: 'key', flex: 0.2 },
		{ text: 'Value', dataIndex: 'value', flex: 1 }
	    ],
	    height: 800,
	    viewConfig : {
			enableTextSelection : true
	    }
	});
	return this.parametersPanel;

};*/

ImageMainView.prototype.loadDetectorPanel = function(detector, dataCollection) {
    var dataHTML = this.makeHTMLTable("Detector", [
        ["Model", dataCollection.Detector_detectorModel],
        ["Manufacturer", dataCollection.Detector_detectorManufacturer],
        ["Mode", dataCollection.Detector_detectorMode],
        ["Pixel Size", detector.pixelSize.x + " x " + detector.pixelSize.y],
        ["sensitive Area", detector.sensitiveArea.x + " x " + detector.sensitiveArea.y]

    ], null, detector.img);

    var dataColletionHTML = this.makeHTMLTable("Data Collection", [
        ["Collected on", dataCollection.DataCollectionGroup_endTime],
        ["Experiment Type", dataCollection.DataCollectionGroup_experimentType],
        ["Centering", dataCollection.DataCollection_centeringMethod],
        ["Exposure Timee", dataCollection.DataCollection_exposureTime],
        ["Directory", dataCollection.DataCollection_imageDirectory],
        ["BeamLine", dataCollection.BLSession_beamLineName],
        ["Detector Distance", dataCollection.DataCollection_detectorDistance],
        ["Flux", dataCollection.DataCollection_flux],
        ["Resolution", dataCollection.DataCollection_resolution],
        ["Transmission", dataCollection.DataCollection_transmission],
        ["WaveLength", dataCollection.DataCollection_wavelength]


    ]);


    return "<span style='color:orange;font-weight:bold;'>WARNING: If image is not displayed please, refresh the page (F5)</span><br />" + dataColletionHTML + dataHTML;



};

ImageMainView.prototype.makeHTMLTable = function(title, data, args, img) {
    var width = 800;
    if (args != null) {
        if (args.with != null) {
            width = args.with;
        }
    }


    var html = "<table>";



    if (data != null) {
        for (var i = 0; i < data.length; i++) {
            html = html + "<tr>";
            for (var j = 0; j < data[i].length; j++) {

                var css = "key_subgrid";
                if (j == 1) {
                    css = "value_subgrid";
                }
                html = html + "<td class='" + css + "'>" + data[i][j] + "</td>";

                if (img != null) {
                    if (i == 0) {
                        if (j == data[i].length - 1) {
                            html = html + '<td rowspan="' + data.length + '"><img src=' + img + '/></td>';
                        }

                    }

                }
            }
            html = html + "</tr>";

        }


    }
    html = html + "</table>";

    if (title != null) {
        html = '<div  class="header-component-table" >' + title + '</div><div  style="margin:0px 0px 0px 0px !important;width:' + width + 'px;">' + html + '</div>';
    }
    return html;
};


ImageMainView.prototype.load = function(imageId, dataCollectionId) {

    var _this = this;
    this.panel.setTitle("Image");
    var url = EXI.getDataAdapter().mx.dataCollection.getImageById(imageId);


    var onSuccess = function(sender, dataCollection) {

        var dc = (dataCollection[0]);
/*
        for (var key in dc) {
            
            _this.storeParameters.loadData([{ key: key, value: dc[key] }], true);
        }*/
        var waveLength = dataCollection[0].DataCollection_wavelength;
        var detectorDistance = dataCollection[0].DataCollection_detectorDistance;
        var xBeam = dataCollection[0].DataCollection_xBeam;
        var yBeam = dataCollection[0].DataCollection_yBeam;

        if (ExtISPyB.detectors[dataCollection[0].detectorModel] != null) {
            _this.detectorResolution = ExtISPyB.detectors[dataCollection[0].detectorModel];
        }
        else {
            alert("Not detector loaded");
        }


        _this.imageViewer.load(url, waveLength, detectorDistance, xBeam, yBeam, _this.detectorResolution);

        document.getElementById(_this.id + "detector").innerHTML = _this.loadDetectorPanel(_this.detectorResolution, dataCollection[0]);

        //_this.surfaceScatteringViewer.load();

    };
    EXI.getDataAdapter({ onSuccess: onSuccess }).mx.dataCollection.getByDataCollectionId(dataCollectionId);


};


