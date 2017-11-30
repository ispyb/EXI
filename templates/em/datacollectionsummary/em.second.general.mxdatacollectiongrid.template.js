<table class="table"> 
     <tr>
        <td></td>        
        <td>Movies</td>
        <td>Motion Correction</td>
        <td> CTF</td>
        <td> Img</td>
    </tr>               
    {#gridSquares}
    <tr>
        <td  class='column_parameter_value'><a href='#/em/datacollection/{.dataCollectionId}/main'>Grid Square #{.name}</a></td>        
        <td  class='column_parameter_value text-center'>{.movieCount}</td>
        <td  class='column_parameter_value text-center'>{.motionCorrectionCount}</td>
        <td  class='column_parameter_value text-center'>{.ctfCount}</td> 
        <td  class='column_parameter_value text-center'>         
            <a href="{.snapshot}" data-lightbox='{.snapshot}' data-title="{.name}">
                <img  src="{.snapshot}" class='img-thumbnail' data-src="{.snapshot}"/>                  
            </a> 
        </td> 
    </tr>
    {/gridSquares}   
</table> 

