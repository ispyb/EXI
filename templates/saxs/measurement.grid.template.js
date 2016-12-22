<div class="container-fluid persist-header" align="center">
    <div class="row text-center" style="border : 1px solid #ccc;">
        <div class="col-sm-3 queue-border-right-columns ">
            <div>&nbsp;</div>
            Specimen
            <div class="row text-center">
                <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                    Macromolecule
                </div>
                <div class="col-sm-4 queue-border-top-columns queue-border-right-columns">
                    Conc.
                </div>
                <div class="col-sm-4 queue-border-top-columns">
                    Buffer
                </div>
            </div>
        </div> 
        <div class="col-sm-5 queue-border-right-columns">
            <div>&nbsp;</div>
            Parameters
            <div class="row text-center">
                <div class="col-sm-2 queue-border-top-columns queue-border-right-columns">
                    Exp. Temp.
                </div>
                <div class="col-sm-2 queue-border-top-columns queue-border-right-columns">
                    Vol. Load
                </div>
                <div class="col-sm-2 queue-border-top-columns queue-border-right-columns">
                    Trans.
                </div>
                <div class="col-sm-2 queue-border-top-columns queue-border-right-columns">
                    wait T.
                </div>
                <div class="col-sm-2 queue-border-top-columns queue-border-right-columns">
                    Flow
                </div>
                <div class="col-sm-2 queue-border-top-columns">
                    Viscosity
                </div>
            </div>
        </div> 
        <div class="col-sm-2 queue-border-right-columns" >
            <div>&nbsp;</div>
            Status
            <div>&nbsp;</div>
        </div>
        <div class="col-sm-2 queue-border-right-columns" >
            <div>&nbsp;</div>
            Time
            <div>&nbsp;</div>
        </div>
    </div>  
</div>  

<div id="{id}-scrollable" style="display: block;">
    {#.}
    <div class="container-fluid persist-header">
        <div class="row queue-border-bottom-columns" {?Run_runId}style="background:rgb(188,245,169);"{/Run_runId}>
            <div class="col-sm-3 ">
                <div class="row">
                    <div class="col-sm-4">
                        {.Macromolecule_acronym}
                    </div>
                    <div class="col-sm-4">
                        {.Specimen_concentration}
                    </div>
                    <div class="col-sm-4 ">
                        {.Buffer_acronym}<span style='font-style:oblique;'> Plate: [{.SamplePlate_slotPositionColumn},{.samplePlateLetter}-{.SamplePlatePosition_columnNumber}]</span>
                    </div>
                </div>
            </div> 
            <div class="col-sm-5 ">
                <div class="row">
                    <div class="col-sm-2 ">
                        {.Run_exposureTemperature}
                    </div>
                    <div class="col-sm-2 ">
                        {.Measurement_volumeToLoad}
                    </div>
                    <div class="col-sm-2 ">
                        {.Measurement_transmission}
                    </div>
                    <div class="col-sm-2 ">
                        {.Measurement_waitTime}
                    </div>
                    <div class="col-sm-2 ">
                        {.Measurement_flow}
                    </div>
                    <div class="col-sm-2 ">
                        {.Measurement_viscosity}
                    </div>
                </div>
            </div> 
            <div class="col-sm-2 ">
                <span style='font-weight: bold;'>{?Run_runId}DONE{/Run_runId}</span>
            </div>
            <div class="col-sm-2 ">
                
            </div>
        </div>  
    </div>
    {/.}
</div>