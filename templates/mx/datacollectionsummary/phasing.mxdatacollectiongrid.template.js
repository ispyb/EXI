<div class="container-fluid containerWithScroll">       
     
      <div class="col-xs-12 col-md-12">  
            <table class="table table-striped table-hover">   
                <thead>   
                            <tr> 
                                <th>Phasing</th>
                                <th><abbr title="Prepare Step">PREPARE</abbr></th>
                                <th><abbr title="Substructure Determination Step">SUBSTRUCTURE</abbr></th>
                                <th><abbr title="Phasing Step">PHASING</abbr></th>
                                <th><abbr title="Model Building Step">MODEL</abbr></th>
                                <th>Download</th>       
                                <th style='color:gray'></th>                                                       
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
                
                            {#.}
                                {#metrics}                                 
                                 {@eq key=$idx value=0}
                                        <tr style='background-color:#e6ffe6;'>                                 
                                 {:else}
                                        <tr> 
                                 {/eq}                                                                   
                                        <td>
                                            {@eq key=$idx value=0}
                                                <a href='#/phasing/autoprocintegrationId/{.autoProcIntegrationId}/main'> {.spaceGroup}</a>
                                            {/eq}                                        
                                        </td>
                                        <td>
                                            {@eq key=$idx value=0}
                                                {@eq key=prepare type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}
                                            {/eq} 
                                        </td>
                                        <td>
                                            {@eq key=$idx value=0}
                                                {@eq key=sub type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq} 
                                            {/eq}
                                        </td>  
                                        <td> 
                                            {@eq key=$idx value=0}
                                                {@eq key=phasing type="boolean" value="true"}
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}
                                            {/eq}
                                        </td>
                                        <td> 
                                            {@eq key=$idx value=0}
                                                {@eq key=model type="boolean" value="true"}                           
                                                    <span style='color:green;' class="glyphicon glyphicon-ok"></span>                          
                                                {:else}
                                                    <span style='color:red;' class="glyphicon glyphicon-remove"></span>
                                                {/eq}
                                            {/eq}
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
                            {/.} 
                             
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