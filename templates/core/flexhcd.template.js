<div id={.id}>
	<svg pointer-events="none" height="{@math key="{radius}" method="multiply" operand="2" /}" width="{@math key="{radius}" method="multiply" operand="2" /}">
		<circle cx="{radius}" cy="{radius}" r="{radius}" stroke="black" stroke-width="1" fill="#FFFFFF" pointer-events="none"/>
		{#lines}
			<line x1="{.x1}" y1="{.y1}" x2="{.x2}" y2="{.y2}" style="stroke:rgb(0,0,0);stroke-width:1" pointer-events="none"/>
		{/lines}
	</svg>
</div>