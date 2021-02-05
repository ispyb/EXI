<table class='table-sm' >
    <thead>
        <tr>
            <th>             
            {.spaceGroup}             
            </th>
            <th style='padding:0 15px 0 15px;'>Res.</th>
            <th style='padding:0 15px 0 15px;'>Compl.</th>
            <th>Rmerge</th>
        </tr>
        
        <tr>
        <td valign="top">Overall</td> 
        <td> 
                <div class="progress">
                         

                                {@gte key=overall.completeness value=50}
                                    {@gte key=overall.completeness value=90}                            
                                        <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.overall.completeness}" aria-valuemin="0" aria-valuemax="100" style="width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>
                                    {:else}
                                        <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.overall.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#f0ad4e;width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>
                                    {/gte}
                                {:else}    
                                    <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.overall.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#d9534f;width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>
                                {/gte}
                          
                    
                </div>
        </td>
        <td valign="top"  style='padding:0 15px 0 15px;'>{@decimal key="overall.resolutionsLimitLow" decimals=1}{/decimal}-{@decimal key="overall.resolutionsLimitHigh" decimals=1}{/decimal}</td> 
        <td valign="top">{@decimal key="overall.rMerge" decimals=1}{/decimal} </td>
        </tr>

        <tr>
            <td valign="top">Inner</td>
            <td>
                    <div class="progress">
                           
                                {@gte key=innerShell.completeness value=50}
                                    {@gte key=innerShell.completeness value=90}                            
                                        <div class="progress-bar progress-bar"  role="progressbar" aria-valuenow="{.innerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                                    {:else}
                                        <div class="progress-bar progress-bar"  role="progressbar" aria-valuenow="{.innerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#f0ad4e;width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                                    {/gte}
                                {:else}    
                                    <div class="progress-bar progress-bar"  role="progressbar" aria-valuenow="{.innerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#d9534f;width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                                {/gte}
                                                   
                    </div>
            </td>
            <td valign="top" style='padding:0 15px 0 15px;'>{@decimal key="innerShell.resolutionsLimitLow" decimals=1}{/decimal}-{@decimal key="innerShell.resolutionsLimitHigh" decimals=1}{/decimal}</td>          
                {@gte key=innerShell.rMerge value=10} 
                    <td valign="top" style='font-weight: bold;'>{@decimal key="innerShell.rMerge" decimals=1}{/decimal}  <span style='color:red;' class="glyphicon glyphicon-warning-sign"></span></td>
                {:else}
                    <td valign="top" >{@decimal key="innerShell.rMerge" decimals=1}{/decimal} </td>
                {/gte}  
        </tr> 
        <tr>
            <td valign="top">Outer</td>
            <td>
                    <div class="progress">
                            
                                {@gte key=outerShell.completeness value=50}
                                    {@gte key=outerShell.completeness value=90}                            
                                    <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.outerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
                                    {:else}
                                        <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.outerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#f0ad4e;width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
                                    {/gte}
                                {:else}    
                                    <div class="progress-bar progress-bar"   role="progressbar" aria-valuenow="{.outerShell.completeness}" aria-valuemin="0" aria-valuemax="100" style="background-color:#d9534f;width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
                                {/gte}
                        


                        
                    </div>
            </td>
             <td valign="top" style='padding:0 15px 0 15px;'>{@decimal key="outerShell.resolutionsLimitLow" decimals=2}{/decimal}-{@decimal key="outerShell.resolutionsLimitHigh" decimals=2}{/decimal}</td>            
             <td valign="top">{@decimal key="outerShell.rMerge" decimals=1}{/decimal} </td>
        </tr>
        
    </thead>
</table>
