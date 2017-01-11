<div class="container-fluid containerWithScroll">
   <div class="row">
      <div class="col-xs-12 col-md-2">
               
         <table style='width: 100px;font-size:10px' class='table'>
            <tbody>
               <tr>
                  <th class='innershell' >InnerShell</th>
                  <th class='overallshell' >Overall</th>
                  <th class='outershell' >OuterShell</th>
               </tr>
            </tbody>
         </table>
        
         <table class="table table-striped table-hover">
            <thead>
               <tr>
                  {!<th  ><a href="#"  data-toggle="tooltip" title="Rank is done based on the space group and lower rMerge">Rank</a></th>!}
                  <th  ></th>
                  <th  ></th>
                  <th  >Pipeline</th>
                  <th  >SpaceGroup</th>
                  <th  >A</th>
                  <th > B</th>
                  <th > C</th>
                  <th  >&#x3B1;</th>
                  <th >&beta;</th>
                  <th >&gamma;</th>
                  <th >Resolution</th>
                  <th >Multiplicity</th>
                  <th >Completeness</th>
                  <th >I/Sigma</th>
                  <th >Rmeas</th> 
                  <th >Rmerge</th>
                  <th >Rpim</th>
                  <th >cc(1/2)</th>
                  <th >Download</th>
               </tr>
            </thead>
            {#.}
           
            {@lt key=innerShell.rMerge value=10}
                 {?label}
                    {@eq key=label value="BEST"}
                        <tr style='background-color:#e6ffe6;'>
                    {:else} 
                        <tr style='background-color:#ffffff;'>
                    {/eq} 
                  {/label}  
            {:else}
                <tr style='background-color:#ffddcc;'>
            {/lt}
                <td  >
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
               <td  ><a target="_blank" href='#/autoprocintegration/datacollection/{.AutoProcIntegration_dataCollectionId}/main'>{.v_datacollection_processingPrograms}</a></td>
               <td  >{.v_datacollection_summary_phasing_autoproc_space_group}</td>
              
               <td  >{@decimal key="v_datacollection_summary_phasing_cell_a" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_b" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_c" decimals=1}{/decimal}</td>
               <td  >{@decimal key="v_datacollection_summary_phasing_cell_alpha" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_beta" decimals=1}{/decimal}</td>
               <td >{@decimal key="v_datacollection_summary_phasing_cell_gamma" decimals=1}{/decimal}</td>
               <td >
                  <span class='innershell'>{.innerShell.resolutionLimitLow}-{.innerShell.resolutionLimitHigh} </span>
                  <span class='overallshell'>{.overall.resolutionLimitLow}-{.overall.resolutionLimitHigh} </span> 
                  <span class='outershell'>{.outerShell.resolutionLimitLow}-{.outerShell.resolutionLimitHigh}</span>
               </td>
               <td >               
                  <span class='innershell'>{.innerShell.multiplicity} </span>
                  <span class='overallshell'>{.overall.multiplicity}</span> 
                  <span class='outershell'>{.outerShell.multiplicity}</span>
               </td>
               <td ><span class='innershell'>{.innerShell.completeness} </span><span class='overallshell'>{.overall.completeness}</span> <span class='outershell'>{.outerShell.completeness}</span></td>
               <td ><span class='innershell'>{.innerShell.meanIOverSigI} </span><span class='overallshell'>{.overall.meanIOverSigI}</span> <span class='outershell'>{.outerShell.meanIOverSigI}</span></td>
               <td ><span class='innershell'>{.innerShell.rMeasAllIPlusIMinus} </span><span class='overallshell'>{.overall.rMeasAllIPlusIMinus}</span> <span class='outershell'>{.outerShell.rMeasAllIPlusIMinus}</span></td>
               <td >
               {@lt key=innerShell.rMerge value=10}
                    <span class='innershell'>{.innerShell.rMerge} </span>
                {:else}
                    <span class='innershell' style='font-weight:700;color:red;'>{.innerShell.rMerge} </span>
                {/lt}
               <span class='overallshell'>{.overall.rMerge}</span> <span class='outershell'>{.outerShell.rMerge}</span></td>
               <td ><span class='innershell'>{.innerShell.rPimWithinIPlusIMinus} </span><span class='overallshell'>{.overall.rPimWithinIPlusIMinus}</span> <span class='outershell'>{.outerShell.rPimWithinIPlusIMinus}</span></td>
               <td ><span class='innershell'>{.innerShell.ccHalf} </span><span class='overallshell'>{.overall.ccHalf}</span> <span class='outershell'>{.outerShell.ccHalf}</span></td>
               <td ><a href='{.downloadFilesUrl}' ><span style='font-size: 1.5em;' class="glyphicon glyphicon-download " ></span></a></td>
            </tr>
            {/.}
         </table>
        
      </div>
   </div>
</div>