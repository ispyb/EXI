<div class="container-fluid persist-header" >
    <div class="row text-center" style="border : 1px solid #ccc;">
        <div class="col-sm-7 " style="padding:0px;">
            <div class="container-fluid">
                <div class="row">
                    <div class="col-sm-1  queue-border-right-columns" style="width:4.166666666%; padding:0;">
                        <div>&nbsp;</div>
                        Run
                        <div>&nbsp;</div>
                    </div> 
                    <div class="col-sm-2  queue-border-right-columns" style="width:20.833333333%">
                        <div>&nbsp;</div>
                        Frames <span style='font-size:10px;'>(Average/Total)</span>
                        <div>&nbsp;</div>
                    </div>
                    <div class="col-sm-3  queue-border-right-columns">
                        <div>&nbsp;</div>
                        Guinier
                        <div class="row text-center">
                            <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                                Rg
                            </div>
                            <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                                Points
                            </div>
                            <div class="col-sm-4 queue-border-top-columns ">
                                I0
                            </div>
                        </div>
                    </div> 
                    <div class="col-sm-3 queue-border-right-columns">
                        <div>&nbsp;</div>
                        Gnom
                        <div class="row text-center">
                            <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                                Rg
                            </div>
                            <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                                Total
                            </div>
                            <div class="col-sm-4 queue-border-top-columns ">
                                D<sub>max</sub>
                            </div>
                        </div>
                    </div> 
                    <div class="col-sm-3 queue-border-right-columns">
                        <div>&nbsp;</div>
                        Porod
                        <div class="row text-center">
                            <div class="col-sm-6 queue-border-top-columns  queue-border-right-columns">
                                Volume
                            </div>
                            <div class="col-sm-6 queue-border-top-columns" style='font-size:7px;'>
                                MM Vol. est.
                            </div>
                        </div>
                    </div> 
                </div>
            </div>
        </div>

        <div class="col-sm-4"  style="padding:0px;">
            <div class="col-sm-3  queue-border-right-columns" >
                <div>&nbsp;</div>
                Scattering
                <div>&nbsp;</div>
            </div> 
            <div class="col-sm-3 queue-border-right-columns " >
                <div>&nbsp;</div>
                Kratky.
                <div>&nbsp;</div>
            </div> 
            <div class="col-sm-3  queue-border-right-columns " >
                <div>&nbsp;</div>
                Density 
                <div>&nbsp;</div>
            </div> 
            <div class="col-sm-3 queue-border-right-columns " >
                <div>&nbsp;</div>
                Guinier
                <div>&nbsp;</div>
            </div>
        </div>

        <div class="col-sm-1"  style="padding:0px;">
            <div>&nbsp;</div>
            Advanced
            <div>&nbsp;</div>
        </div>
    </div>
</div>  

<div id="{id}-scrollable" style="display: block; height: {height}px; overflow-y: scroll">
    {#rows}
    <div class="container-fluid queue-border-bottom-columns" style="padding-top:10px; padding-bottom:10px;">
        <div class="row">
            <div class="col-sm-7"  style="padding-left:0px;padding-right:0px;padding-bottom:0px;padding-top:10px;">
                <div class="container-fluid">
                    <div class="row text-center">
                        <div class="col-sm-1 " style="width:4.166666666%; padding:0;">
                            <div class="row">
                                <div class="col-sm-12">
                                    <table class="table queue-small-padding-table table-queue-grid-borderless">
                                        <tbody>
                                            {#.codes}
                                                <tr><td># {.}</td></tr>
                                            {/.codes}
                                        </tbody>
                                    </table>
                                </div> 
                            </div> 
                        </div> 
                        <div class="col-sm-2 " style="width:20.833333333%">
                            <div class="row">
                                <div class="col-sm-8">
                                    <table class="table  queue-small-padding-table table-queue-grid-borderless">
                                        <tbody>
                                            <tr><td><b>{.macromoleculeAcronym}</b></td></tr>
                                            <tr><td>{.concentration} <span style='font-size:9px;color:gray'>  mg/ml</span></td></tr>
                                            <tr><td>{.expTemp} C</td></tr>
                                        </tbody>
                                    </table>
                                </div> 
                                <div class="col-sm-4">
                                    <table class="table  queue-small-padding-table table-queue-grid-borderless">
                                        <tbody>
                                            {#.averages}
                                                <tr><td style="background-color:{.color};">{.text}</td></tr>
                                            {/.averages}
                                        </tbody>
                                    </table>
                                </div> 
                            </div>
                        </div>
                        <div class="col-sm-3">
                            <div class="row text-center">
                                <div class="col-sm-4" >
                                    <span {@eq key=rg value="NA"}class='notavailablefield'>NA</span>{:else}>{.rg}</span><span style='font-size:10px;color:gray'>  nm</span>{/eq}
                                </div>
                                <div class="col-sm-4" >
                                    <span {@eq key=points value="NA"}class='notavailablefield'>NA{:else}>{.points}{/eq}</span>
                                </div>
                                <div class="col-sm-4">
                                    <span {@eq key=I0 value="NA"}class='notavailablefield'>NA</span>{:else}>{.I0}</span><span style='font-size:10px'> &#177; {.I0Stdev}</span>{/eq}
                                </div>
                            </div>
                        </div> 
                        <div class="col-sm-3">
                            <div class="row text-center">
                                <div class="col-sm-4" >
                                    <span {@eq key=rgGnom value="NA"}class='notavailablefield'>NA</span>{:else}>{.rgGnom}</span><span style='font-size:10px;color:gray'>  nm</span>{/eq}
                                </div>
                                <div class="col-sm-4" >
                                    <span {@eq key=total value="NA"}class='notavailablefield'>NA{:else}>{.total}{/eq}</span>
                                </div>
                                <div class="col-sm-4" >
                                    <span {@eq key=dmax value="NA"}class='notavailablefield'>NA</span>{:else}>{.dmax}</span><span style='font-size:10px;color:gray'>  nm</span>{/eq}
                                </div>
                            </div>
                        </div> 
                        <div class="col-sm-3">
                            <div class="row text-center">
                                <div class="col-sm-6">
                                    <span {@eq key=volumePorod value="NA"}class='notavailablefield'>NA</span>{:else}>{.volumePorod}</span><span style='font-size:8px;color:gray;'> nm<sub>3</sub></span>{/eq}
                                </div>
                                <div class="col-sm-6">
                                    <span {@eq key=volumePorod value="NA"}class='notavailablefield'>NA</span>{:else}>{.mmvolest}</span><span style='font-size:8px;color:gray;'> kD</span>{/eq}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="col-sm-4"  style="padding:0px;">
                <div class="container-fluid">
                    <div class="row ">
                        <div class="col-sm-3 ">
                            <a href="{.scattering}" data-lightbox="{.scattering}" data-title="Scattering">
                                <center><img alt="Image not found" class="img-responsive queue-img" src="{.scattering}" style="display: block;"  height="{.imgWidth}px" width="{.imgWidth}px"/></center>
                            </a>  
                        </div> 
                        <div class="col-sm-3" >
                            <a href="{.kratky}" data-lightbox="{.kratky}" data-title="Kratky">
                                <center><img alt="Image not found" class="img-responsive queue-img" src="{.kratky}" style="display: block;"  height="{.imgWidth}px" width="{.imgWidth}px"/></center>
                            </a>                           
                        </div> 
                        <div class="col-sm-3">
                            <a href="{.density}" data-lightbox="{.density}" data-title="Density">
                                <center><img alt="Image not found" class="img-responsive queue-img" src="{.density}" style="display: block;" height="{.imgWidth}px" width="{.imgWidth}px"/></center>
                            </a>                           
                        </div> 
                        <div class="col-sm-3">
                            <a href="{.guinier}" data-lightbox="{.guinier}" data-title="Guinier">
                                <center><img alt="Image not found" class="img-responsive queue-img" src="{.guinier}" style="display: block;" height="{.imgWidth}px" width="{.imgWidth}px" /></center>
                            </a>                           
                        </div> 
                    </div>
                </div>
            </div>
            <div class="col-sm-1 text-center"  style="padding:0px;">
                <table class="table queue-small-padding-table table-queue-grid-borderless">
                    <tbody>
                            <tr>
                                <td>
                                    {?dataReduction}
                                        <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-ok"></span>
                                    {:else}
                                        <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    {/dataReduction}
                                        <span class="submit-text"> Data Reduction</span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {?abinitio}
                                        <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-ok"></span>
                                    {:else}
                                        <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    {/abinitio}
                                        <span class="submit-text"> Abinitio</span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {?fit}
                                        <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-ok"></span>
                                    {:else}
                                        <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    {/fit}
                                        <span class="submit-text"> Fit</span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {?superposition}
                                        <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-ok"></span>
                                    {:else}
                                        <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    {/superposition}
                                        <span class="submit-text"> Superposition</span>
                                    </button>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    {?rigidBody}
                                        <button class="btn-green" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-ok"></span>
                                    {:else}
                                        <button class="btn-blue" type="submit" style="font-size:9px;width:90px; height:15px">
                                        <span class="glyphicon glyphicon-remove"></span>
                                    {/rigidBody}
                                        <span class="submit-text"> Rigid Body</span>
                                    </button>
                                </td>
                            </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
    {/rows}
</div>