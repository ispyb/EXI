
<div class="container-fluid containerWithScroll">
   <div class="row">
      <div class="col-xs-12 col-md-2">
         <table class="table table-striped table-hover">
            <thead>
               <tr>
                  {#.}
                        <th> <a href="#/mx/workflow/steps/{.workflowStepIds}/step/{.workflowStepId}/main" target='_blank'>{.name}</a></th>                 
                   {/.}
                  
               </tr>
            </thead>
            <tr> 
                {#.}
               <td  ><a href="#/mx/workflow/steps/{.workflowStepIds}/step/{.workflowStepId}/main" target='_blank' ><img style='height:150px;width:150px;' src='{.img}' /></a></td>
             
              
                {/.}
            </tr>
            
            </tr>
               <tr>
                {#.}
               <td  >{.status}</td>
             
                {/.}
            </tr>
            
            
            
         </table>
       
      </div>
   </div>
</div>

