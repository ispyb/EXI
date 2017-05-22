<div class="container-fluid {?hasScroll}containerWithScroll{/hasScroll}">       
     
      <div class="col-xs-12 col-md-12">  
            <table class="table table-striped table-hover">   
                <thead>   
                            <tr> 
                                <th>Phasing</th>
                                <th style='width:15px;'><abbr title="Prepare Step">PR</abbr></th>
                                <th style='width:15px;'><abbr title="Substructure Determination Step">SU</abbr></th>
                                <th  style='width:15px;'><abbr title="Phasing Step">PH</abbr></th>
                                <th  style='width:15px;'><abbr title="Model Building Step">MO</abbr></th>

                                <th style='width:20px;'><abbr title="DSIGMA_RESOLUTION"><span style='font-size:8px;'>DSIGMA<br />RESOLUCION</span></abbr></th>
                                <th style='width:20px;'> <abbr title="CCALL_CCWEAK"><span style='font-size:8px;'>CCALL <br /> CCWEAK</span></abbr></th>
                                <th style='width:20px;'><abbr title="OCCUPANCY_SITENUMBER"><span style='font-size:8px;'>OCCUPANCY <br />  SITENUMBER</span></abbr></th>                                
                                 <th style='width:20px;'><abbr title="OCCUPANCY_SITENUMBER"><span style='font-size:8px;'>CONTRAST <br />  CYCLE</span></abbr></th>
                               
                               
    
                                                                               
                                <th style='color:gray'>Program</th>
                                <th style='color:gray'>Method</th>
                                <th style='color:gray'>Resolution</th>
                                <th style='color:gray'>Solvent</th>                                                                
                                <th style='color:gray'>Chain Count</th>
                                <th style='color:gray'>Residues Count</th>
                                <th style='color:gray'>Average Fragment Length</th>
                                <th style='color:gray'>CC of partial model</th>                                                                                             
                                <th style='color:gray'><abbr title="UglyMol:  https://github.com/uglymol/uglymol">Electron Density</abbr></th>
                                <th style='color:gray; '>PDB</th>                               
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
                                                
                                                {.SpaceGroup_spaceGroupShortName}<br /> <kbd style="background-color:green">BEST</kbd>
                                            {:else}
                                                 <span style='color:gray'>{.SpaceGroup_spaceGroupShortName}</span>
                                            {/eq}                                        
                                        </td>

                                         <td  style='width:15px;'>
                                           {@eq key=hasPrepare type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}                                                                                             
                                        </td>    
                                        <td  style='width:15px;'>
                                            {@eq key=hasSub type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}                                                                                       
                                        </td> 
                                          <td  style='width:15px;'>
                                           {@eq key=hasPhasing type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}                                                                                        
                                        </td> 
                                          <td  style='width:15px;'>
                                             {@eq key=hasModel type="boolean" value="true"}                           
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>                          
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}                                                                                           
                                        </td>  

                                        <td>
                                            
                                            {?DSIGMA_RESOLUTION}
                                                    <a href={.DSIGMA_RESOLUTION} data-lightbox={.DSIGMA_RESOLUTION} >
                                                    <img src={.DSIGMA_RESOLUTION} height="50px" width="50px"/></a>
                                            {/DSIGMA_RESOLUTION}

                                        </td>
                                        <td>
                                         
                                             {?CCALL_CCWEAK}
                                                    <a href={.CCALL_CCWEAK} data-lightbox={.CCALL_CCWEAK} >
                                                    <img src={.CCALL_CCWEAK} height="50px" width="50px"/></a>
                                                {/CCALL_CCWEAK}
                                              

                                        </td>  
                                        <td>                                                                                   
                                                {?OCCUPANCY_SITENUMBER}
                                                    <a href={.OCCUPANCY_SITENUMBER} data-lightbox={.OCCUPANCY_SITENUMBER} >
                                                    <img src={.OCCUPANCY_SITENUMBER} height="50px" width="50px"/></a>
                                                {/OCCUPANCY_SITENUMBER}
                                        </td>  
                                       
                                        <td>                                            
                                            {?CONTRAST_CYCLE}
                                                <a href={.CONTRAST_CYCLE} data-lightbox={.CONTRAST_CYCLE} >
                                                <img src={.CONTRAST_CYCLE} height="50px" width="50px"/></a>
                                            {/CONTRAST_CYCLE}

                                        </td>
                                                                                                      
                                    
                           
                                      
                            
                                        <td>{.PhasingProgramRun_phasingPrograms}  
                                                                                          
                                                <br /><a href='{.downloadFilesUrl}' ><span style='font-size: 1.5em;' class="glyphicon glyphicon-download " ></span></a>                                         
                                        </td>
                                        <td>{.PhasingStep_method} </td>
                                        <td>{.PhasingStep_highRes} - {.PhasingStep_lowRes} </td>
                                        <td>{.PhasingStep_solventContent} </td>                                                               
                                        <td>{@decimal key="Chain_Count" decimals=0}{/decimal}  </td>
                                        <td>{@decimal key="_Residues_Count" decimals=0}{/decimal} </td>                     
                                        <td>{@decimal key="_Average_Fragment_Length" decimals=0}{/decimal} </td>
                                        <td>{@decimal key="_CC_of_partial_model" decimals=2}{/decimal}</td>                               
                                        <td>                                            
                                                {?uglymol}
                                                    <a><a target="_blank" href='{.uglymol}' ><span style='font-size: 1em;' class="glyphicon glyphicon-eye-open"  ></span></a> 
                                                {:else}                                                    
                                                {/uglymol}                                                                                        
                                        </td>
                                        <td >                                            
                                                {?pngURL}
                                                        <a href="{.pngURL}"  data-lightbox="{.PhasingStep_autoProcScalingId}" data-title="{.PhasingStep_phasingStepType} : {.SpaceGroup_spaceGroupShortName}">
                                                                <img id="{.PhasingStep_phasingStepId}" alt="Image not found" style='height:15px; width:15px;'  src='../images/icon/ic_search_black_48dp.png'/>
                                                        </a>
                                                {:else}                                                    
                                                {/pngURL}                                                                                       
                                        </td>         
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