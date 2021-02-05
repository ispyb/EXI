
{! this table is collapsed for results inline!}
<table class='table-sm table table-striped'>
    <thead>   
    <tr>
        <th style='padding:0 15px 0 15px;'>{.spaceGroup}</th>
        <th style='padding:0 15px 0 15px;'>Res.</th>
        <th style='padding:0 15px 0 15px;'>Completeness</th>
        <th style='padding:0 15px 0 15px;'>Rmerge</th>                    
    </tr>
    </thead>
    <tbody>

    <tr>
        <td  style='padding:0 15px 0 15px;'>Overall</td>
        <td style='padding:0 15px 0 15px;'>{@decimal key="overall.resolutionsLimitLow" decimals=2}{/decimal}-{@decimal key="overall.resolutionsLimitHigh" decimals=2}{/decimal}</td>        
        <td  style='padding:0 15px 0 15px;'>
            {@gte key=overall.completeness value=50} 
                {@gte key=overall.completeness value=90}
                    <div  style="background-repeat: repeat-x;border:1px solid gray;color:#fff;background-image:linear-gradient(to bottom,#337ab7 0,#286090 100%);width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>
                {:else}
                    <div  style="background-repeat: repeat-x;border:1px solid #f0ad4e;color:#fff;background-color:#f0ad4e;width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>
                {/gte}
            
            {:else}
                <div  style="background-repeat: repeat-x;border:1px solid #d9534f;color:#000;background-color:#d9534f;width:{.overall.completeness}%">{@decimal key="overall.completeness" decimals=1}{/decimal}%</div>                            
            {/gte}
        </td>    
        <td style='padding:0 15px 0 15px;'>{@decimal key="overall.rMerge" decimals=1}{/decimal}</td>
    </tr>

    <tr>
        <td  style='padding:0 15px 0 15px;'>Inner</td>
        <td style='padding:0 15px 0 15px;'>{@decimal key="innerShell.resolutionsLimitLow" decimals=2}{/decimal}-{@decimal key="innerShell.resolutionsLimitHigh" decimals=2}{/decimal}</td>
        <td  style='padding:0 15px 0 15px;'>
                {@gte key=innerShell.completeness value=50}
                    {@gte key=innerShell.completeness value=90}
                        <div  style="background-repeat: repeat-x;border:1px solid gray;color:#fff;background-image:linear-gradient(to bottom,#337ab7 0,#286090 100%);width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                    {:else}
                        <div  style="background-repeat: repeat-x;border:1px solid #f0ad4e;color:#fff;background-color:#f0ad4e;width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                    {/gte}               
                {:else}
                    <div  style="background-repeat: repeat-x;border:1px solid #d9534f;color:#000;background-color:#d9534f;width:{.innerShell.completeness}%">{@decimal key="innerShell.completeness" decimals=1}{/decimal}%</div>
                
                {/gte}
        </td>
        <td style='padding:0 15px 0 15px;'>{@decimal key="innerShell.rMerge" decimals=1}{/decimal}</td>
    </tr>

    <tr>
        <td  style='padding:0 15px 0 15px;'>Outer</td>
        <td style='padding:0 15px 0 15px;'>{@decimal key="outerShell.resolutionsLimitLow" decimals=2}{/decimal}-{@decimal key="outerShell.resolutionsLimitHigh" decimals=2}{/decimal}</td>
        <td  style='padding:0 15px 0 15px;'>  
            {@gte key=outerShell.completeness value=50}
                {@gte key=outerShell.completeness value=90}
                    <div  style="background-repeat: repeat-x;border:1px solid gray;color:#fff;background-image:linear-gradient(to bottom,#337ab7 0,#286090 100%);width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
                {:else}
                    <div  style="background-repeat: repeat-x;border:1px solid #f0ad4e;color:#fff;background-color:#f0ad4e;width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
                {/gte}
            {:else}    
                <div  style="background-repeat: repeat-x;border:1px solid #d9534f;color:#000;background-color:#d9534f;width:{.outerShell.completeness}%">{@decimal key="outerShell.completeness" decimals=1}{/decimal}%</div>
            {/gte}
            
        </td>
        <td style='padding:0 15px 0 15px;'>{@decimal key="outerShell.rMerge" decimals=1}{/decimal}</td>
    </tr>
    
        </tbody>
</table>
