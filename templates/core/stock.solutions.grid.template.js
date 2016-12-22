<div class="container-fluid persist-header">
    <div class="row text-center" style="border : 1px solid #ccc;">
        <div class="col-sm-3 queue-border-right-columns ">
            Acronym
        </div> 
        <div class="col-sm-3 queue-border-right-columns">
            Buffer
        </div> 
        <div class="col-sm-3 queue-border-right-columns" >
            Concentration (mg/ml)
        </div>
        <div class="col-sm-3 queue-border-right-columns" >
            Volume (&#956l)
        </div>
    </div>  
</div>  

<div id="{id}-scrollable" style="display: block; height: {height}px; overflow-y: auto">
    {#stockSolutions}
    <div class="container-fluid persist-header">
        <div class="row queue-border-bottom-columns">
                <div class="col-sm-3 queue-border-right-columns ">
                    {.acronym}
                </div> 
                <div class="col-sm-3 queue-border-right-columns">
                    {.buffer}
                </div> 
                <div class="col-sm-3 queue-border-right-columns" >
                    {.concentration}
                </div>
                <div class="col-sm-3 queue-border-right-columns" >
                    {.volume}
                </div>
        </div>  
    </div>
    {/stockSolutions}
</div>