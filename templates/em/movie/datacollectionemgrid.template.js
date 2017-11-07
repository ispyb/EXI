

 {#.}  
   
   <div class="panel with-nav-tabs panel-default">
      <div class="panel-heading clearfix">
            <div class="pull-left">       
               <kbd style='background-color:#CCCCCC;color:blue;'>Movie #{.Movie_movieNumber}</kbd>  
               <span style='color:blue;'>{@formatDate date=.Movie_createdTimeStamp format="DD-MM-YYYY HH:mm:ss" /}</span>                       
            </div>
            <div class="pull-right">
                <a href='{.metadataXMLURL}' target='_blank'>{@getFileName key="Movie_xmlMetaDataFullPath" /}</a>
            </div>
       </div>
   

 <div class="tab-content">
<div class="container-fluid" >
   <div class="row">
          <div class="col-sm-2 text-center" > Movie
          </div>
           <div class="col-sm-6 text-center" >Motion Correction
          </div>
           <div class="col-sm-2 text-center"  >CTF
          </div>

   </div>
 
   <div class="row">
 
      <div class="col-sm-2">
         <table class="table">
            <tr>
               <td>Number</td>
               <td class='column_parameter_value'>{.Movie_movieNumber}</td>
            </tr>
            <tr>
               <td>X</td>
               <td class='column_parameter_value'>{@decimal key="Movie_positionX" decimals=3 /}</td>
            </tr>
           <tr>
               <td>Y</td>
               <td class='column_parameter_value'>{@decimal key="Movie_positionY" decimals=3 /}</td>
            </tr>
                    
            <tr>
               <td>Dose</td>
               <td class='column_parameter_value'>{@decimal key="Movie_dosePerImage" decimals=4 /}</td>
            </tr>                      
         </table> 
      </div>
       <div class="col-sm-1">
               <img  class="img-thumbnail img-responsive" data-src="{.micrographThumbnailURL}" data-zoom-image="{.micrographThumbnailURL}"  alt="Image not found">
       </div>
      
       
      <div class="col-sm-2">
        {?MotionCorrection_motionCorrectionId}
         <table class="table">
            <tr>
               <td>Total Motion</td>
               <td class='column_parameter_value'>{.MotionCorrection_totalMotion}</td>
            </tr>
            <tr>
               <td>Avg. Motion/frame</td>
               <td class='column_parameter_value'>{.MotionCorrection_averageMotionPerFrame}</td>
            </tr>
           <tr>
               <td>Frame Range</td>
               <td class='column_parameter_value'>{.MotionCorrection_firstFrame} - {.MotionCorrection_lastFrame}</td>
            </tr>
           
            <tr>
               <td>Dose Weight</td>
               <td class='column_parameter_value'>{.MotionCorrection_doseWeight}</td>
            </tr>
            <tr>
               <td>Dose</td>
               <td class='column_parameter_value'>{@decimal key="MotionCorrection_dosePerFrame" decimals=4 /}</td>
            </tr>
          
         </table>
          {/MotionCorrection_motionCorrectionId}
      </div>

       <div class="col-sm-1">
            {?MotionCorrection_motionCorrectionId}
               <img  class="img-thumbnail  img-responsive"  data-src="{.motionCorrectionDriftURL}" data-zoom-image="{.motionCorrectionDriftURL}"  alt="Image not found">
            {/MotionCorrection_motionCorrectionId}
                            
       </div>
        <div class="col-sm-1">              
            {?MotionCorrection_motionCorrectionId}
              
               <img  class="img-thumbnail"  data-src="{.motionCorrectionThumbnailURL}" data-zoom-image="{.motionCorrectionThumbnailURL}"  alt="Image not found">              
             {/MotionCorrection_motionCorrectionId}
       </div>

      <div class="col-sm-2">
        {?CTF_CTFid}
         <table class="table">
            <tr>
               <td>Angle</td>
               <td class='column_parameter_value'>{.CTF_angle}</td>
            </tr>
            <tr>
               <td>Correlation</td>
               <td class='column_parameter_value'>{.CTF_crossCorrelationCoefficient}</td>
            </tr>
           <tr>
               <td>Defocus U</td>
                 <td class='column_parameter_value'>{.CTF_defocusU}</td>
            </tr>
            <tr>
               <td>Defocus V</td>
                 <td class='column_parameter_value'>{.CTF_defocusV}</td>
            </tr>
            <tr>
               <td>Estimated B factor</td>
               <td class='column_parameter_value'>{.CTF_estimatedBfactor}</td>
            </tr>
            <tr>
               <td>Resolution Limit</td>
               <td class='column_parameter_value'>{.CTF_resolutionLimit}</td>
            </tr>
          
         </table>
          {/CTF_CTFid}
      </div>
      <div class="col-sm-1">
           {?CTF_CTFid}
               <img src="{.ctfSpectraURL}" class="img-thumbnail" >
            {/CTF_CTFid}
       </div>
      
   </div>
   </div>
   </div>

   </div>
   {/.} 

</div>
