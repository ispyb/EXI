<div class="container-fluid {?hasScroll}containerWithScroll{/hasScroll}">       
     
      <div class="col-xs-12 col-md-12">  
            <table class="table table-striped table-hover">   
                <thead>   
                            <tr> 
                                <th>Phasing</th>
                                
                                <th><abbr title="Phasing Step">PHASING</abbr></th>
                                <th><abbr title="Model Building Step">REFINEMENT</abbr></th>
                                <th><abbr title="Ligand Fit Step">LIGAND_FIT</abbr></th>
                                <th>MR directory<br>(< 30 days)</th>       
                                <th>Download</th>       
                                <th style='color:gray'></th>                                                       
                                <th style='color:gray'>Program</th>
                                <th style='color:gray'>Method</th>
                                <th style='color:gray'>Resolution</th>
                                <th style='color:gray'>Start Rw / Rf</th>
                                <th style='color:gray'>Final Rw / Rf</th>
                                <th style='color:gray'>Electron density MR</th>
                                <th style='color:gray'>Electron density REFINE</th>
                            </tr>
                </thead> 
                <tbody>
                
                            {#.parsed}
                                {#metrics}                                 
                                 {@eq key=$idx value=0}
                                        <tr style='background-color:#e6ffe6;'>                                 
                                 {:else}
                                        <tr> 
                                 {/eq}                                                                   
                                        <td>
                                            {@eq key=$idx value=0}
                                                <a href='#/phasing/autoprocintegrationId/{.autoProcIntegrationId}/main'> {.SpaceGroup_spaceGroupShortName}</a>
                                            {/eq}                                        
                                        </td>
                                       
                                        <td> 
                                            {@eq key=$idx value=0}
                                                {@eq key=hasPhasing type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}
                                            {/eq}
                                        </td>
                                      
                                         <td> 
                                            {@eq key=$idx value=0}
                                                {@eq key=hasRefinement type="boolean" value="true"}                           
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>                          
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}
                                            {/eq}
                                        </td>
                                        <td> 
                                        {@eq key=$idx value=0}
                                            {@eq key=hasLigandFit type="boolean" value="true"}                           
                                                <span style='color:green;' class="glyphicon glyphicon-ok"></span>                          
                                            {:else}
                                                <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                            {/eq}
                                        {/eq}
                                    </td>
                                        <td>
                                            <button type="button" class="btn btn-sm" data-toggle="modal" data-target="#myModal{.dataCollectionId}"><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span></button>
                                            <!-- Modal -->
                                            <div class="modal fade" id="myModal{.dataCollectionId}" role="dialog">
                                                <div class="modal-dialog">
                                                    <!-- Modal content-->
                                                    <div class="modal-content">
                                                        <div class="modal-header">
                                                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                                                        <h4 class="modal-title">MR directory - available up to 30 days</h4>
                                                    </div>
                                                    <div class="modal-body">
                                                        <p>{.PhasingProgramRun_phasingDirectory}</p>
                                                    </div>
                                                    <div class="modal-footer">
                                                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td >   
                                            {@eq key=$idx value=0}                     
                                                <a href='{.downloadFilesUrl}' ><span style='font-size: 1.5em;' class="glyphicon glyphicon-download " ></span></a>
                                             {/eq}                                                                                                                
                                        </td>                                                                 
                                    
                           
                                        <td>
                                            {@eq key=$idx value=0}
                                                <kbd style="background-color:green">BEST</kbd>
                                            {/eq}  
                                        </td>
                            
                                        <td>{.PhasingProgramRun_phasingPrograms} </td>
                                        <td>{.PhasingStep_method} </td>
                                        <td>{@decimal key="PhasingStep_highRes" decimals=1}{/decimal} - {@decimal key="PhasingStep_lowRes" decimals=1}{/decimal}</td>
                                        <td>{@decimal key="Start_R-work" decimals=2}{/decimal} / {@decimal key="Start_R-free" decimals=2}{/decimal}</td>                               
                                        <td>{@decimal key="Final_R-work" decimals=2}{/decimal} / {@decimal key="Final_R-free" decimals=2}{/decimal}</td>                               
                                        {#listUglyMol}
                                        {@eq key="{.}" value=""}
                                        <td></td>
                                        {:else}
                                        <td>                                            
                                             <a><a target="_blank" href='{.}' ><span style='font-size: 1em;' class="glyphicon glyphicon-eye-open"  ></span></a> 
                                        </td>
                                        {/eq}
                                        {/listUglyMol}                                                                                        

                                    </tr> 
                                 {/metrics}
                            {/.parsed} 
                             
                </tbody> 
           </table>  
      </div>
      
      
      
      
       <div class="col-xs-12 col-md-12" style='background-color:#FAFAFA;border:1px gray solid;'>
            <span>Automatic processing of macromolecular crystallography X-ray diffraction data at the ESRF.<br /></span>
            <span style='color:rgb(119,119,119); font-weight:italic;'>Monaco S, Gordon E, Bowler MW, Delageniere S, Guijarro M, Spruce D, Svensson O, McSweeney SM, McCarthy AA, Leonard G, Nanao MH.<br /></span>
            <span style='color:rgb(119,119,119);'>J Appl Crystallogr. 2013 Jun 1;46(Pt 3):804-810.<br /></span>
            <a href='https://www.ncbi.nlm.nih.gov/pubmed/?term=monaco+ESRF '>https://www.ncbi.nlm.nih.gov/pubmed/?term=monaco+ESRF</a> 
        </div>  
        
        
         <div class="col-xs-12 col-md-12" style='background-color:#FAFAFA;margin-top:10px;border:1px gray solid;'>
            <span>Experimental phasing with SHELXC/D/E: combining chain tracing with density modification.<br /></span>
            <span style='color:rgb(119,119,119); font-weight:italic;'>Sheldrick GM.<br /></span>
            <span style='color:rgb(119,119,119);'>Acta Crystallogr D Biol Crystallogr. 2010 Apr;66(Pt 4):479-85. doi: 10.1107/S0907444909038360.<br /></span>
            <a href='https://www.ncbi.nlm.nih.gov/pubmed/20383001'>https://www.ncbi.nlm.nih.gov/pubmed/20383001</a> 
        </div> 
        
            <div class="col-xs-12 col-md-12" style='background-color:#FAFAFA;margin-top:10px;margin-bottom:30px;border:1px gray solid;'>
            <span>UglyMol: Electron Density Viewer<br /></span>                       
            <a href='https://github.com/uglymol/uglymol'>https://github.com/uglymol/uglymol</a> 
        </div> 
   </div>
   
</div>