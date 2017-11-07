<table class="table"> 
        <tr>
        <td>Name</td>
        
        <td>Movies</td>
        <td>Motion Correction</td>
        <td> CTF</td>
    </tr>               
    {#gridSquares}
    <tr>
        <td  class='column_parameter_value'><a href='#/em/datacollection/{.DataCollection_dataCollectionId}/main'>{.name}</a></td>        
        <td  class='column_parameter_value'>{.movieCount}</td>
        <td  class='column_parameter_value'>{.motionCorrectionCount}</td>
        <td  class='column_parameter_value'>{.ctfCount}</td>
    </tr>
    {/gridSquares}
   
</table> 