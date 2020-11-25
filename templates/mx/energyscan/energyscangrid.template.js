<div class="container-fluid">
    <div class="panel with-nav-tabs panel-default">
        <div class="panel-heading clearfix">
            <div class="pull-left">

                <span style='font-size:12px;color:blue;' >
                        <kbd style='background-color:#CCCCCC;color:blue;'>
                            Energy Scan
                        </kbd> 
                        <span style='color:blue;'>
                        {@formatDate date=.startTime format="DD-MM-YYYY HH:mm:ss" /}
                        </span>                                   
                    </span>
                <p><b>{.scanFileFullPath}</b></p>   
               
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
                        <div class="col-xs-1 col-md-1">
                            <div class="well" style='font-size:30px;'>{.element}</div>
                        </div>
                        <div class="col-xs-3 col-md-5">
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
                                    <td>Fluorescence Detector</td>
                                    <td class='column_parameter_value'>{.fluorescenceDetector}</td>
                                </tr>
                                <tr>
                                    <td style='width:150px;'>Energy Scan Range</td>
                                    <td class='column_parameter_value'>{.startEnergy} keV - {.endEnergy} keV</td>
                                </tr>
                                <tr>
                                    <td>Edge Energy (theoretical)</td>
                                    <td class='column_parameter_value'>{.edgeEnergy} keV</td>
                                </tr>
                                <tr>
                                    <td>Flux @100%</td>
                                    <td class='column_parameter_value'>{.flux} ph/sec</td>
                                </tr>
                                <tr>
                                    <td>Transmission</td>
                                    <td class='column_parameter_value'>{@decimal key="transmissionFactor" decimals=1 /} %</td>
                                </tr>

                                <tr>
                                    <td style='width:150px;'>Beam Size Hor</td>
                                    <td class='column_parameter_value'>{.beamSizeHorizontal} &#956;m</td>
                                </tr>
                                <tr>
                                    <td>Beam Size Vert</td>
                                    <td class='column_parameter_value'>{.beamSizeVertical} &#956;m</td>
                                </tr>
                                <tr>
                                    <td>Exposure Time</td>
                                    <td class='column_parameter_value'>{@decimal key="exposureTime" decimals=3 /} s</td>
                                </tr>

                            </table>
                        </div>


                        <div class="col-xs-3 col-md-3">
                            <table class="table table-condensed">
                                <tr>
                                    <td >Peak Energy</td>
                                    {@eq key=decimals value=3}
                                    <td class='column_parameter_value'>{@decimal key="peakEnergy" decimals=3 /} keV</td>
                                    {:else}
                                    <td class='column_parameter_value'>{@decimal key="peakEnergy" decimals=2 /} keV</td>
                                    {/eq}
                                </tr>
                                <tr>
                                    <td >Pk f'</td>
                                    {@eq key=decimals value=3}
                                    <td class='column_parameter_value'>{@decimal key="peakFPrime" decimals=3 /} e<sup>-</sup></td>
                                    {:else}
                                    <td class='column_parameter_value'>{@decimal key="peakFPrime" decimals=2 /} e<sup>-</sup></td>
                                    {/eq}
                                </tr>

                                <tr>
                                    <td >Pk f''</td>
                                    {@eq key=decimals value=3}
                                    <td class='column_parameter_value'>{@decimal key="peakFDoublePrime" decimals=3 /} e<sup>-</sup></td>
                                    {:else}
                                    <td class='column_parameter_value'>{@decimal key="peakFDoublePrime" decimals=2 /} e<sup>-</sup></td>
                                    {/eq}
                                </tr>

                                <tr>
                                    <td >Inflection Energy</td>
                                    {@eq key=decimals value=3}
                                        <td class='column_parameter_value'>{@decimal key="inflectionEnergy" decimals=3 /} keV</td>
                                    {:else}
                                        <td class='column_parameter_value'>{@decimal key="inflectionEnergy" decimals=2 /} keV</td>
                                    {/eq}
                                </tr>
                                <tr>
                                    <td >Ip f'</td>
                                    {@eq key=decimals value=3}
                                        <td class='column_parameter_value'>{@decimal key="inflectionFPrime" decimals=3 /} e<sup>-</sup> </td>
                                    {:else}
                                        <td class='column_parameter_value'>{@decimal key="inflectionFPrime" decimals=2 /} e<sup>-</sup> </td>
                                    {/eq}
                                </tr>
                                <tr>
                                    <td >Ip f''</td>
                                    {@eq key=decimals value=3}
                                        <td class='column_parameter_value'>{@decimal key="inflectionFDoublePrime" decimals=3 /} e<sup>-</sup></td>
                                    {:else}
                                        <td class='column_parameter_value'>{@decimal key="inflectionFDoublePrime" decimals=2 /} e<sup>-</sup></td>
                                    {/eq}
                                </tr>

                                <tr>
                                    <td >Remote Energy</td>
                                    <td class='column_parameter_value'>{@decimal key="remoteEnergy" decimals=2 /} keV</td>
                                </tr>
                                <tr>
                                    <td >Remote f'</td>
                                    <td class='column_parameter_value'>{@decimal key="remoteFPrime" decimals=2 /} e<sup>-</sup> </td>
                                </tr>
                                <tr>
                                    <td >Remote f''</td>
                                    <td class='column_parameter_value'>{@decimal key="remoteFDoublePrime" decimals=2 /} e<sup>-</sup></td>
                                </tr>


                            </table>
                        </div>

                        <div class="col-xs-3 col-md-3">
                            <a href='{.choochURL}' data-lightbox='{.choochURL}' data-title="Chooch"><img class="lazy" data-src='{.choochURL}' src='{.choochURL}' /> </a>
                        </div>


                    </div>
                </div>
            </div>



        </div>
    </div>
</div>

