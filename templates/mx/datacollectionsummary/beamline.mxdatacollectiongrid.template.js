<table class="table">  
    <tr>
        <td>Beamline name</td>
        <td  class='column_parameter_value'>{.BLSession_beamLineName}</td>
    </tr>                  
    {!<tr>
        <td>Number of passes</td>
        <td  class='column_parameter_value'> 
            {.DataCollection_numberOfPasses}
        </td>
    </tr>!}
    <tr>
        <td>Detector Distance</td>
        <td  class='column_parameter_value'>{@decimal key="DataCollection_detectorDistance" decimals=2 /} mm</td>
    </tr>
   
    <tr>
        <td>X Beam</td>
        <td  class='column_parameter_value'>{@decimal key="DataCollection_xBeam" decimals=2 /} mm</td>
    </tr>
    <tr>
        <td>Y Beam</td>
        <td  class='column_parameter_value'>{@decimal key="DataCollection_yBeam" decimals=2 /} mm</td>
    </tr>
     <tr>
        <td>Kappa</td>
        <td  class='column_parameter_value'>
            {@decimal key="DataCollection_kappaStart" decimals=2 /}                      
        </td>
    </tr>
     <tr>
        <td>Phi</td>
        <td  class='column_parameter_value'>
         {@decimal key="DataCollection_phiStart" decimals=2 /}     
        </td>
    </tr>
</table>       
              