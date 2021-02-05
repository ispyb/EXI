

<table class='table-sm table table-striped'>
    <thead>
        <tr>
        <th style='padding:0 15px 0 15px;'>Data Range</th>
        <th style='padding:0 15px 0 15px;'>Resolution</th>
        <th style='padding:0 15px 0 15px;'>Multiplicity</th>
        <th style='padding:0 15px 0 15px;'>Completeness</th>
        <th style='padding:0 15px 0 15px;'>I/Sigmal</th>
        <th style='padding:0 15px 0 15px;'>Rmeas</th>
        <th style='padding:0 15px 0 15px;'>Rmerge</th>
        <th style='padding:0 15px 0 15px;'>Rpim</th>
        <th style='padding:0 15px 0 15px;'>cc(1/2)</th>
        </tr>
    </thead>
<tbody>
{#.statistics}
	<tr>
			<td>
				{.type}
			</td>
			<td >
                {@decimal key="resolutionLimitLow" decimals=1}{/decimal} - {@decimal key="resolutionLimitHigh" decimals=1}{/decimal}
			</td>
			<td >
				
                {@decimal key="multiplicity" decimals=1}{/decimal}
			</td>
			<td > 
                
                {@gt key=completeness value=20}
                    {@gt key=completeness value=60}
                        <div  style="background-repeat: repeat-x;border:1px solid gray;color:#fff;background-image:linear-gradient(to bottom,#337ab7 0,#286090 100%);width:{.completeness}%">
                        {@decimal key="completeness" decimals=0}{/decimal}%
                        </div>
                    {:else}
                        <div  style="background-repeat: repeat-x;border:1px solid #f0ad4e;color:#fff;background-color:#f0ad4e;width:{.completeness}%">                        
                        {@decimal key="completeness" decimals=0}{/decimal}%
                        </div>
                    {/gt}
                {/gt}
                {@lte key=completeness value=20}
                    <div  style="background-repeat: repeat-x;border:1px solid #d9534f;color:#fff;background-color:#d9534f;width:{.completeness}%">
                    {@decimal key="completeness" decimals=0}{/decimal}%
                    </div>
                
                {/lte}
           
				
			</td>
            <td > 
                {@decimal key="meanIOverSigI" decimals=1}{/decimal}
				
			</td>
            <td > 
				{@decimal key="rMeasAllIPlusIMinus" decimals=1}{/decimal}
			</td>
            <td > 
                {@decimal key="rMerge" decimals=1}{/decimal}
				
			</td>
             <td > 
                {@decimal key="rPimWithinIPlusIMinus" decimals=1}{/decimal}
				
			</td>
             <td > 
                {@decimal key="ccHalf" decimals=1}{/decimal}
				
			</td>
			
	</tr>	
{/.statistics}
<tbody>
</table>