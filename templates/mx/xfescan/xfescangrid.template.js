

<div class="container-fluid">
    <div class="panel with-nav-tabs panel-default">
        <div class="panel-heading clearfix">
            <div class="pull-left">

              <span style='font-size:12px;color:blue;' >
                        <kbd style='background-color:#CCCCCC;color:blue;'>
                            Fluorescence Spectra
                        </kbd> 
                        <span style='color:blue;'>
                        {@formatDate date=.startTime format="DD-MM-YYYY HH:mm:ss" /}
                        </span>                                   
                    </span>
                <p><b>{.scanFileFullPath}</b></p>
               


               
            </h1>
            </div>
            <div class="pull-right">
                <ul class="nav nav-tabs">
                    <li class="active"><a data-toggle="tab" href="#datacollection_{DataCollection_dataCollectionId}">Summary </a>
                    </li>

                </ul>
            </div>
        </div>
        <br />
        <div class="tab-content">
            <div id="datacollection_{DataCollection_dataCollectionId}" class="tab-pane fade in active">
                <div class="container-fluid">
                    <div class="row">
                      
                        <div class="col-xs-6 col-md-6">
                            <table class="table table-condensed">

                              
                                 <tr>
                                    <td>Protein</td>
                                    <td class='column_parameter_value'>{.acronym}</td>
                                </tr>
                                <tr>
                                    <td>Sample</td>
                                    <td class='column_parameter_value'>{.name}</td>
                                </tr>

                               
                                
                                <tr>
                                    <td >Filename</td>
                                    <td class='column_parameter_value'>{.filename}</td>
                                </tr>
                                
                               

                                <tr>
                                    <td >Fluorescence Detector</td>
                                    <td class='column_parameter_value'></td>
                                </tr>
                                <tr>
                                    <td >Energy</td>
                                    <td class='column_parameter_value'>{@decimal key="energy" decimals=3 /} keV</td>

                                </tr>
                                
                                <tr>
                                    <td >Flux @100%</td>
                                    <td class='column_parameter_value'>{@exponential key="flux" decimals=2 /} ph/s</td>    
                                </tr>
                                
                                <tr>      
                                    <td >Transmission</td>
                                    <td class='column_parameter_value'>{@decimal key="beamTransmission" decimals=1 /} %</td>
                                </tr>
                                
                                <tr>       
                                    <td style='width:150px;' >Beam Size Hor</td>
                                    <td class='column_parameter_value'>{.beamSizeHorizontal} &#956;m</td>
                                </tr>
                                                               
                                <tr>                            
                                    <td >Beam Size Vert</td>
                                    <td class='column_parameter_value'>{.beamSizeVertical} &#956;m</td>
                                </tr>

                                <tr>                                
                                    <td >Exposure Time</td>
                                    <td class='column_parameter_value'>{.exposureTime} s</td>                                    
                                </tr>
                               
                            </table>
                            
                    </div>
                    <div class="col-xs-2 col-md-2">
                        {@eq key=showLink value=true}
                            <a href="#/mx/xfe/{.xfeFluorescenceSpectrumId}/main" target="_blank" data-title="">
                        {/eq}
                               <img alt="Image not found"  src="{.url}" />
                        {@eq key=showLink value=true}
                            </a>
                        {/eq}
                    </div>        
                </div>
            </div>



        </div>
        
    </div>
</div>
 
