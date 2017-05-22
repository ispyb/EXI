<table class="table">                    
    <tr>
        <td>Synchrotron name</td>
        <td  class='column_parameter_value'>{BeamLineSetup_synchrotronName}</td>
    </tr>
    <tr>
        <td>Synchrotron filling mode</td>
        <td  class='column_parameter_value'>{BeamLineSetup_synchrotronMode}</td>
    </tr>
    <tr>
        <td>Synchrotron Current</td>
        <td  class='column_parameter_value'>
            {?synchrotronCurrent} 
                
                
                    {@getIndexByCommaSeparator key="synchrotronCurrent" index=0 decimals=1 /} mA 
                    
                
            {/synchrotronCurrent}
        </td>
    </tr>   
    <tr>
        <td>Undulator types</td>
        <td  class='column_parameter_value'>{BeamLineSetup_undulatorType1} {BeamLineSetup_undulatorType2} {BeamLineSetup_undulatorType3}</td>
    </tr>
     <tr>
        <td>Undulator gaps</td>
        <td  class='column_parameter_value'>{?DataCollection_undulatorGap1}{@decimal key="DataCollection_undulatorGap1" decimals=2 /} mm {/DataCollection_undulatorGap1}
                                            {?DataCollection_undulatorGap2}{@decimal key="DataCollection_undulatorGap2" decimals=2 /} mm {/DataCollection_undulatorGap2}
                                            {?DataCollection_undulatorGap3}{@decimal key="DataCollection_undulatorGap3" decimals=2 /} mm {/DataCollection_undulatorGap3}
        </td>
    </tr>
    {!<tr>
        <td>Slit gap Hor</td>
        <td  class='column_parameter_value'>{?DataCollection_slitGapHorizontal}{DataCollection_slitGapHorizontal} &mu;m{/DataCollection_slitGapHorizontal}</td>
    </tr>
    <tr>
        <td>Slit gap Vert</td>
        <td  class='column_parameter_value'>{?DataCollection_slitGapVertical}{DataCollection_slitGapVertical} &mu;m{/DataCollection_slitGapVertical}</td>
    </tr>!}
</table>    