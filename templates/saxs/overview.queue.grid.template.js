<div class="container-fluid">
    <div class="row">
        <div class="col-xs-12 col-md-12">
            <table class="table small-padding-rows table-striped table-hover align-middle-header align-middle-rows valign-middle-header valign-middle-rows border-header">
                <thead>
                <tr>
                    <th rowspan="2">Run</th>
                    <th rowspan="2" colspan="2">Sample</th>
                    <th rowspan="2" colspan="2">Frames <br /> (Average/Total)</th>
                    <th colspan="3">Guinier</th>
                    <th colspan="3">Gnom</th>
                    <th colspan="2">Porod</th>
                    <th rowspan="2">Scattering</th>
                    <th rowspan="2">Kratky.</th>
                    <th rowspan="2">Density</th>
                    <th rowspan="2">Guinier</th>
                    <th rowspan="2">Advanced</th>
                </tr>
                <tr>
                    <th>Rg</th>
                    <th>Points</th>
                    <th>I0</th>
                    <th>Rg</th>
                    <th>Total</th>
                    <th>D<sub>max</sub></th>
                    <th>Volume</th>
                    <th>MM Vol. est.</th>
                </tr>
                </thead>
                
                {#.}
                <tr class={.rowClass}>
                    <td>
                        {?.Macromolecule_macromoleculeId}
                            <kbd style='background-color:#207a7a'>#{.Measurement_code}</kbd>
                        {:else}
                                <kbd style='background-color:gray'>#{.Measurement_code}</kbd>
                        {/.Macromolecule_macromoleculeId}
                    </td>
                    <td>
                        {?.Macromolecule_macromoleculeId}
                            <div>
                                <a href="{.urlDownload}">
                                    <span class="glyphicon glyphicon-download" style='font-size:14px;'></span>
                                </a>
                            </div>
                            <div>
                                <a href="#" data-toggle="modal" data-target="#myModal{.MeasurementToDataCollection_dataCollectionId}">
                                    <span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span>
                                </a>
                            </div>                            
                            <!-- Modal -->
                            <div class="modal fade" id="myModal{.MeasurementToDataCollection_dataCollectionId}" role="dialog">
                                <div class="modal-dialog">
                                
                                    <!-- Modal content-->
                                    <div class="modal-content">
                                    <div class="modal-header">
                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                        <h4 class="modal-title">Average file path</h4>
                                    </div>
                                    <div class="modal-body">
                                        <h4>{.Subtraction_sampleAverageFilePath}</h4>
                                    </div>
                                    <div class="modal-footer">
                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                    </div>
                                    </div>
                                    
                                </div>
                            </div>
                        {/.Macromolecule_macromoleculeId}
                    </td>
                    <td>
                        {?.Macromolecule_macromoleculeId}
                            <b>{.Macromolecule_acronym} </b>                                    
                            <br /> {@decimal key="Specimen_concentration" decimals=3 /} <span style='font-size:9px;color:gray'>  mg/ml</span>
                            <br /> {.Run_exposureTemperature} C 
                        {:else}
                            {.Buffer_acronym}
                        {/.Macromolecule_macromoleculeId}
                    </td>
                    <td>
                        <div  style="background-color:{@framesColor /};">
                            {?Merge_framesMerge}{.Merge_framesMerge}{:else}NA{/Merge_framesMerge} / {?Merge_framesCount}{.Merge_framesCount}{:else}NA{/Merge_framesCount}
                        </div>
                    </td>
                    <td>
                        <a href="{.urlSpecific}">
                            <span class="glyphicon glyphicon-download" style='font-size:14px;'></span>
                        </a>
                    </td>
                    {?.Macromolecule_macromoleculeId}
                        <td>
                            <span {^Subtraction_rg}class='notavailablefield'>NA</span>{:else}>{@decimal key="Subtraction_rg" decimals=3 /}</span><span style='font-size:10px;color:gray'>  nm</span>{/Subtraction_rg}
                        </td>
                        <td>
                            <span {^Subtraction_rg}class='notavailablefield'>NA{:else}>{.Subtraction_firstPointUsed} - {.Subtraction_lastPointUsed} ({@math key=Subtraction_lastPointUsed method="subtract" operand=.Subtraction_firstPointUsed/}){/Subtraction_rg}</span>
                        </td>
                        <td>
                            <span {^Subtraction_I0}class='notavailablefield'>NA</span>{:else}>{@decimal key="Subtraction_I0" decimals=1 /}</span><span style='font-size:10px'> &#177; {@exponential key="Subtraction_I0Stdev" decimals=3 /}</span>{/Subtraction_I0}
                        </td>
                        <td>
                            <span {^Subtraction_rgGnom}class='notavailablefield'>NA</span>{:else}>{@decimal key="Subtraction_rgGnom" decimals=3 /}</span><span style='font-size:10px;color:gray'>  nm</span>{/Subtraction_rgGnom}
                        </td>
                        <td>
                            <span {^Subtraction_total}class='notavailablefield'>NA{:else}>{@decimal key="Subtraction_total" decimals=3 /}{/Subtraction_total}</span>
                        </td>
                        <td>
                            <span {^Subtraction_dmax}class='notavailablefield'>NA</span>{:else}>{@decimal key="Subtraction_dmax" decimals=3 /}</span><span style='font-size:10px;color:gray'>  nm</span>{/Subtraction_dmax}
                        </td>
                        <td>
                            <span {^Subtraction_volume}class='notavailablefield'>NA</span>{:else}>{@decimal key="Subtraction_volume" decimals=3 /}</span><span style='font-size:8px;color:gray;'> nm<sub>3</sub></span>{/Subtraction_volume}
                        </td>
                        <td>
                            <span {^Subtraction_volume}class='notavailablefield'>NA</span>{:else}>{@mmVolTest /}</span><span style='font-size:8px;color:gray;'> kD</span>{/Subtraction_volume}
                        </td>
                    {:else}
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                        <td>
                        </td>
                    {/.Macromolecule_macromoleculeId}
                    {?.rowSpan}
                        <td rowspan="{.rowSpan}" class="blue-bottom-border-row" style="border-left:1px solid #ccc;">
                            <a href="{.scattering}" data-lightbox="{.scattering}" data-title="Scattering">
                                <center><img id="scattering-{.MeasurementToDataCollection_dataCollectionId}" alt="Image not found" class="img-responsive" data-src="{.scattering}" style="display: block;margin:0px;" height="150px" width="150px"/></center>
                            </a> 
                        </td>
                        <td rowspan="{.rowSpan}" class="blue-bottom-border-row">
                            <a href="{.kratky}" data-lightbox="{.kratky}" data-title="Kratky">
                                <center><img id="kratky-{.MeasurementToDataCollection_dataCollectionId}" alt="Image not found" class="img-responsive" data-src="{.kratky}" style="display: block;margin:0px;" height="150px" width="150px"/></center>
                            </a>  
                        </td>
                        <td rowspan="{.rowSpan}" class="blue-bottom-border-row">
                            <a href="{.density}" data-lightbox="{.density}" data-title="Density">
                                <center><img id="density-{.MeasurementToDataCollection_dataCollectionId}" alt="Image not found" class="img-responsive" data-src="{.density}" style="display: block;margin:0px;" height="150px" width="150px"/></center>
                            </a> 
                        </td>
                        <td rowspan="{.rowSpan}" class="blue-bottom-border-row">
                            <a href="{.guinier}" data-lightbox="{.guinier}" data-title="Guinier">
                                <center><img id="guinier-{.MeasurementToDataCollection_dataCollectionId}" alt="Image not found" class="img-responsive" data-src="{.guinier}" style="display: block;margin:0px;" height="150px" width="150px" /></center>
                            </a> 
                        </td>
                        <td rowspan="{.rowSpan}" class="blue-bottom-border-row">
                            <table class="table queue-small-padding-table table-queue-grid-borderless">
                                <tbody>
                                        <tr>
                                            <td>
                                                {?dataReduction}
                                                    <a onclick="window.open('#/saxs/datacollection/dataCollectionId/{.MeasurementToDataCollection_dataCollectionId}/primaryviewer','_blank');window.close();return false">
                                                    <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-ok" style="color:black;"></span>
                                                {:else}
                                                    <a>
                                                    <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-remove" style="color:black;"></span>
                                                {/dataReduction}
                                                    <span class="submit-text" style="color:black;"> Data Reduction</span>
                                                </button></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {?SubtractionToAbInitioModel_abinitioId}
                                                    <a href="#/saxs/datacollection/dataCollectionId/{.MeasurementToDataCollection_dataCollectionId}/abinitio" target='_blank' >
                                                        <button class="btn-green" style="font-size:9px;width:90px; height:15px">
                                                        <span class="glyphicon glyphicon-ok" style="color:black;"></span>
                                                        <span class="submit-text" style="color:black;"> Abinitio</span>
                                                    </a>
                                                {:else}
                                                    <a>
                                                        <button class="btn-blue" style="font-size:9px;width:90px; height:15px">
                                                        <span class="glyphicon glyphicon-remove" style="color:black;"></span>
                                                        <span class="submit-text" style="color:black;"> Abinitio</span>
                                                    </a>
                                                {/SubtractionToAbInitioModel_abinitioId}
                                                   
                                                </button></a> 
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {?fit}
                                                    <a>
                                                    <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-ok" style="color:black;"></span>
                                                {:else}
                                                    <a>
                                                    <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-remove" style="color:black;"></span>
                                                {/fit}
                                                    <span class="submit-text" style="color:black;"> Fit</span>
                                                </button></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {?superposition}
                                                    <a>
                                                    <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-ok" style="color:black;"></span>
                                                {:else}
                                                    <a>
                                                    <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-remove" style="color:black;"></span>
                                                {/superposition}
                                                    <span class="submit-text" style="color:black;"> Superposition</span>
                                                </button></a>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                {?rigidBody}
                                                    <a>
                                                    <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-ok" style="color:black;"></span>
                                                {:else}
                                                    <a>
                                                    <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                                    <span class="glyphicon glyphicon-remove" style="color:black;"></span>
                                                {/rigidBody}
                                                    <span class="submit-text" style="color:black;"> Rigid Body</span>
                                                </button></a>
                                            </td>
                                        </tr>
                                </tbody>
                            </table>
                        </td>
                    {/.rowSpan}
                </tr>
                {/.}
            </table>
        </div>
    </div>
</div>