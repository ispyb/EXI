<div id="{.id}-div">
	<svg id="{.id}-svg"  height="{@math key="{mainRadius}" method="multiply" operand="2.2" /}" width="{@math key="{mainRadius}" method="multiply" operand="2.2" /}">
		<defs>
		
			<radialGradient id="errorGradient" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop offset="0%" style="stop-color:rgb(255,255,0); stop-opacity:1" />
				<stop offset="100%" style="stop-color:rgb(255,0,0); stop-opacity:1" />
			</radialGradient>

			<radialGradient id="errorGradientSelected" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
				<stop offset="0%" style="stop-color:#66ff66; stop-opacity:1" />
				<stop offset="100%" style="stop-color:rgb(255,0,0); stop-opacity:1" />
			</radialGradient>

			<clipPath id="unipuckShape">
				<circle cx="{mainRadius}" cy="{@math key="{mainRadius}" method="add" operand="{shapeRadiusY}" /}" r="{shapeRadiusX}" />
				<circle cx="{@math key="{mainRadius}" method="subtract" operand="{shapeRadiusX}" /}" cy="{@math key="{mainRadius}" method="subtract" operand="{shapeRadiusY}" /}" r="{shapeRadiusY}" stroke="black" stroke-width="1" />
				<circle cx="{@math key="{mainRadius}" method="add" operand="{shapeRadiusX}" /}" cy="{@math key="{mainRadius}" method="subtract" operand="{shapeRadiusY}" /}" r="{shapeRadiusY}" stroke="black" stroke-width="1" />
			</clipPath>
		
	  </defs>
		<circle  id="{.id}" cx="{mainRadius}" cy="{mainRadius}" r="{mainRadius}" fill="#CCCCCC" class='puck' />
		{?isUnipuck}
		<g>
			<rect width="100%" height="100%" fill="#888888" stroke="black" stroke-width="1" clip-path="url(#unipuckShape)" pointer-events="none"/>
			<circle cx="{mainRadius}" cy="{@math key="{mainRadius}" method="multiply" operand="1.5" /}" r="{shapeRadiusX}" fill="#888888" pointer-events="none" />
		</g>
		{/isUnipuck}
		<?isLoading}
		<text id="{.id}-loading-text" x="{mainRadius}" y="{mainRadius}" fill="white" font-size="{@math key="{shapeRadiusX}" method="multiply" operand="1.5" /}" text-anchor="middle" pointer-events="none">
				<tspan dx="0" dy="0">LOADING...</tspan>
		</text>
		</isLoading>
		{#cells}
				{?enableClick}{?.dataCollectionIds}<a id="{.id}-anchor" onclick="window.open('#/mx/datacollection/datacollectionid/{.dataCollectionIds}/main','_blank');window.close();return false" href='#/mx/datacollection/datacollectionid/{.dataCollectionIds}/main' target="_blank" style="target-new: tab;">{/.dataCollectionIds}{/enableClick}
				<circle id="{.id}" cx="{.x}" cy="{.y}" r="{.radius}" {?enableClick}{?.dataCollectionIds}style="cursor:pointer"{/.dataCollectionIds}{/enableClick} {^enableMouseOver} pointer-events="none" {/enableMouseOver} class="cell_empty"></circle>
					<circle id="{.id}-inner" visibility="hidden" fill="none" stroke="yellow" stroke-width="2" cx="{.x}" cy="{.y}" r="{@math key="{.radius}" method="multiply" operand="0.7" /}" pointer-events="none"></circle>
				{?enableClick}{?.dataCollectionIds}</a>{/.dataCollectionIds}{/enableClick}						
				{@gt key=radius value=10}
					<text id="{.id}-label" x="{.x}" y="{.y}" fill="black" font-size="{@math key="{shapeRadiusX}" method="multiply" operand="1.1" /}" text-anchor="middle" pointer-events="none">
						<tspan dx="0" dy="{@math key="{shapeRadiusX}" method="multiply" operand="0.4" /}" pointer-events="none">{@math key="{$idx}" method="add" operand="1" /}</tspan>
						<tspan x="{.x}" dy="12"></tspan>
					</text>
				{/gt}
		{/cells}
	</svg>
</div>