<div class="container-fluid">
   <table class="table">
      <thead class="table-fixed ">
       <tr>
            <td colspan='5' style="text-align:center;" class="sessiogridtechnique">
               
            </td>
            <td colspan='5' style="text-align:center;" class="sessiogridtechnique">
               MX
            </td>
            <td colspan='3' style="text-align:center;" class="sessiogridtechnique">
               BIOSAXS
            </td>
             <td colspan='2' style="text-align:center;" class="sessiogridtechnique">
               EM
            </td>
             <td style='width:400px'>
               
            </td>
            </tr>
         <tr>
            <td>
               Start
            </td>
            <td>
               Beamline
            </td>
            <td >A-form</td>{!a-form!}
            <td>
               Proposal
            </td>
            <td>
               Local Contact
            </td>
            <td style="text-align:center;" class="mxsessiongridheader">
               En. Scans
            </td>
            <td style="text-align:center;" class="mxsessiongridheader">
               XRF
            </td>
            <td style="text-align:center;" class="mxsessiongridheader">
               Samples
            </td>
            <td style="text-align:center;" class="mxsessiongridheader">
               Tests
            </td>
            <td style="text-align:center;" class="mxsessiongridheader">
               Collects
            </td>
            <td style="text-align:center;" class="saxssessiongridheader">
               Calibration
            </td>
            <td style="text-align:center;" class="saxssessiongridheader">
               SC
            </td>
            <td style="text-align:center;" class="saxssessiongridheader">
               HPLC
            </td>
            <td style="text-align:center;" class="emsessiongridheader">
               Grid
            </td>
            <td style="text-align:center;" class="emsessiongridheader">
               Movie
            </td>
            <td style='width:400px;' > 
               Comments
            </td>
         </tr>
      </thead>
      <tbody class="table-fixed">
         {#.}         
         {@gt key=totalDataCollectionCount value=0} 
             <tr>
         {:else}
             <tr class='sessiongrid-no-data-collections'>
         {/gt}
            <td> <a href='{.dataCollectionURL}'>{@formatDate date=BLSession_startDate format="DD-MM-YYYY" /}</a></td>
            <td> <a href='{.dataCollectionURL}'>{.beamLineName}</a></td>
            <td>
                 {?expSessionPk}
                    <a  target="_blank" href="https://wwws.esrf.fr/misapps/SMISWebClient/protected/aform/manageAForm.do?action=view&currentTab=howtoTab&expSessionVO.pk={.expSessionPk}" class='btn btn-xs'><span class='glyphicon glyphicon-list-alt'></span></a>
                  {/expSessionPk}            
            </td>
            <td> <a href='{.dataCollectionURL}'>              
               <a href='{.dataCollectionURL}'>{.Proposal_proposalCode}{.Proposal_ProposalNumber}</a>
            </td>
            <td> {.beamLineOperator}</td>
            <td class="mxsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=energyScanCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.energyScanCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="mxsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=xrfSpectrumCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.xrfSpectrumCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="mxsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=sampleCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.sampleCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="mxsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=testDataCollectionGroupCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.testDataCollectionGroupCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="mxsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=dataCollectionGroupCount value=0} 
                              
                  <span style="background-color:#207a7a;" class="badge">{.dataCollectionGroupCount}</span>
                  
                  {/gt}
               </div>
            </td>
            <td class="saxssessiongridcell">
               <div style="text-align:center;">
                  {@gt key=calibrationCount value=0}                                  
                  <span style="background-color:#207a7a;" class="badge">{.calibrationCount}</span>                       
                  {/gt}
               </div>
            </td>
            <td class="saxssessiongridcell">
               <div style="text-align:center;">
                  {@gt key=sampleChangerCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.sampleChangerCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="saxssessiongridcell">
               <div style="text-align:center;">
                  {@gt key=hplcCount value=0} 
                  <span style="background-color:#207a7a;" class="badge">{.hplcCount}</span>
                  {/gt}
               </div>
            </td>
            <td class="emsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=EMdataCollectionGroupCount value=0}                               
                  <span style="background-color:#207a7a;" class="badge">{.EMdataCollectionGroupCount}</span>                        
                  {/gt}
               </div>
               </a>
            </td>
            <td  class="emsessiongridcell">
               <div style="text-align:center;">
                  {@gt key=EMdataCollectionGroupCount value=0}                               
                  <span style="background-color:#207a7a;" class="badge">{.imagesCount}</span>                        
                  {/gt}
               </div>
               </a>
            </td>
            <td style='width:400px;' > 
               <div style="width:390px; wordWrap: break-word;">
                  <a class="btn btn-xs"><span id="{.sessionId}-edit-comments" class="glyphicon glyphicon-edit session-comment-edit"></span></a>
                  <span id="comments_{.sessionId}">{.comments}</span>
               </div>
            </td>
         </tr>
         {/.} 
      </tbody>
   </table>
</div>