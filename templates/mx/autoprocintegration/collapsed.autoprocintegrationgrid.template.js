<div class="container-fluid">
   <div class="row">
      <div class="col-xs-12 col-md-2">

         <table class="table table-striped table-hover">
            <thead>
               <tr>
                  {!<th  ><a href="#"  data-toggle="tooltip" title="Rank is done based on the space group and lower rMerge">Rank</a></th>!}
                  <th></th>
                  <th></th>
                  <th>Pipeline</th>
                  <th>SpaceGroup</th>
                  <th>a (&#197;)</th>
                  <th> b (&#197;)</th>
                  <th> c (&#197;)</th>
                  <th>&#x3B1; (&deg)</th>
                  <th>&beta; (&deg)</th>
                  <th>&gamma; (&deg)</th>
                  <th>Shell</th>
                  <th>Resolution (&#197;)</th>
                  <th>Multiplicity</th>
                  <th>Completeness %</th>
                  <th>&#60;I/Sigma&#62;</th>
                  <th>Rmeas</th> 
                  <th>Rmerge</th>
                  <th>Rpim</th>
                  <th>cc(1/2)</th>
                  <th>ccAno</th>
                  <th>sigAno</th>
                  <th>ISA</th>
                  <th>Download</th>
               </tr>
            </thead>
            {#.}
            {@lt key=innerShell.rMerge value=10}
                {?label}
                    {@eq key=label value="BEST"}
                        <tr id="{.AutoProcIntegration_dataCollectionId}-{.AutoProcIntegration_autoProcIntegrationId}" style='background-color:#e6ffe6;' class='autoprocintegrationrow'>
                    {:else} 
                        <tr id="{.AutoProcIntegration_dataCollectionId}-{.AutoProcIntegration_autoProcIntegrationId}" style='background-color:#ffffff;' class='autoprocintegrationrow'>
                    {/eq}
                {:else}    
                    <tr id="{.AutoProcIntegration_dataCollectionId}-{.AutoProcIntegration_autoProcIntegrationId}" class='autoprocintegrationrow'>
                {/label}  
            {:else}
                <tr id="{.AutoProcIntegration_dataCollectionId}-{.AutoProcIntegration_autoProcIntegrationId}" style='background-color:#ffddcc;' class='autoprocintegrationrow'>
            {/lt}
                <td >
                  {@eq key=v_datacollection_summary_phasing_anomalous type="boolean" value="true"}
                        <kbd style="FONT-FAMILY:helvetica, arial, verdana, sans-serif;background-color:#337ab7">ANOM</kbd>
                  {:else}
                        
                  {/eq}
               </td>
               
               
                {?label}
                    {@eq key=label value="BEST"}
                        <td >  <kbd style="background-color:green">{.label}</kbd></td>
                    {:else}
                        <td  > <kbd style="background-color:orange">{.label}</kbd></td>
                    {/eq}
               {:else}
                    <td  >{.rank}</td>
               {/label}
               <td >{.v_datacollection_processingPrograms}</td>
               <td >{.v_datacollection_summary_phasing_autoproc_space_group}</td>
              
               <td >{@decimal key="v_datacollection_summary_phasing_cell_a" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_b" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_c" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_alpha" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_beta" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_gamma" decimals=1}{/decimal}</td>
               <td>
                  <span class='overallshell'>Overall</span><br />
                  <span class='innershell'>Inner</span><br />
                  <span class='outershell'>Outer</span>
               </td>
               <td >
                  <span class='overallshell'>{.overall.resolutionLimitLow}-{.overall.resolutionLimitHigh} </span><br />
                  <span class='innershell'>{.innerShell.resolutionLimitLow}-{.innerShell.resolutionLimitHigh} </span><br />
                  <span class='outershell'>{.outerShell.resolutionLimitLow}-{.outerShell.resolutionLimitHigh}</span>
               </td>
               <td >               
                  <span class='overallshell'>{.overall.multiplicity}</span><br />
                  <span class='innershell'>{.innerShell.multiplicity} </span><br />
                  <span class='outershell'>{.outerShell.multiplicity}</span>
               </td>
               <td > 
                  <span class='overallshell'>{.overall.completeness}</span><br />
                  <span class='innershell'>{.innerShell.completeness} </span><br />
                  <span class='outershell'>{.outerShell.completeness}</span>
                </td>
               <td >
                    <span class='overallshell'>{.overall.meanIOverSigI}</span><br />
                    <span class='innershell'>{.innerShell.meanIOverSigI} </span><br />
                    <span class='outershell'>{.outerShell.meanIOverSigI}</span>
                </td>
               <td >
                    <span class='overallshell'>{.overall.rMeasAllIPlusIMinus}</span><br />
                    <span class='innershell'>{.innerShell.rMeasAllIPlusIMinus} </span><br />
                    <span class='outershell'>{.outerShell.rMeasAllIPlusIMinus}</span>
                </td>
               <td >
                    <span class='overallshell'>{.overall.rMerge}</span><br />
                    {@lt key=innerShell.rMerge value=10}
                        <span class='innershell'>{.innerShell.rMerge} </span><br />
                    {:else}
                        <span class='innershell' style='font-weight:700;color:red;'>{.innerShell.rMerge} </span><br />
                    {/lt}
                    <span class='outershell'>{.outerShell.rMerge}</span>
               </td>
               <td >
                    <span class='overallshell'>{.overall.rPimWithinIPlusIMinus}</span><br />
                    <span class='innershell'>{.innerShell.rPimWithinIPlusIMinus} </span><br />
                    <span class='outershell'>{.outerShell.rPimWithinIPlusIMinus}</span>
                </td>
               <td >
                    {?overall.ccHalf}
                        <span class='overallshell'>{@math key=100 method="multiply" operand=overall.ccHalf/}  </span><br />
                    {/overall.ccHalf}

                    {?innerShell.ccHalf}
                        <span class='innershell'>{@math key=100 method="multiply" operand=innerShell.ccHalf/}  </span><br />
                    {/innerShell.ccHalf}

                    {?outerShell.ccHalf}
                        <span class='outershell'>{@math key=100 method="multiply" operand=outerShell.ccHalf/}  </span>
                    {/outerShell.ccHalf}
               </td>
               
               <td>
                    <span class='overallshell'>{.overall.ccAno}</span> <br />
                    <span class='innershell'>{.innerShell.ccAno} </span><br />
                    <span class='outershell'>{.outerShell.ccAno}</span>
               </td>
               <td>
                    <span class='overallshell'>{.overall.sigAno}</span><br />
                    <span class='innershell'>{.innerShell.sigAno} </span><br />
                    <span class='outershell'>{.outerShell.sigAno}</span>    
               </td>
                <td  >{.isa}</td>
               <td ><a href='{.downloadFilesUrl}' ><span style='font-size: 1.5em;' class="glyphicon glyphicon-download " ></span></a></td>
            </tr>
            {/.}
         </table> 
        
      </div>
   </div>
</div>