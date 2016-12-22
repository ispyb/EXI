<svg id="{id}-svg"  height="{formatter.height}" width="{formatter.width}">
    <rect x="0" y="0" width="{formatter.width}" height="{formatter.height}" fill="{formatter.backgroundColor}"/>
    {#nodes}
        <rect id="{.squareId}" visibility="hidden" x="{.xSquare}" y="{.ySquare}" width="{.squareSide}" height="{squareSide}" fill="#d2d2d2" class="plate-square" pointer-events="none"/>
        <circle id="{.nodeId}" cx="{.x}" cy="{.y}" r="{.radius}" fill="{formatter.fill}" stroke="{formatter.stroke}" stroke-width="{formatter.stroke-width}" {?enableClick}cursor="pointer"{/enableClick}></circle>
    {/nodes}
    {#text}
        <text x="{.x}" y="{.y}" fill="{formatter.title.fill}" font-size="{formatter.title.fontSize}" text-anchor="middle" pointer-events="none">
            <tspan dx="0" dy="0" pointer-events="none">{.text}</tspan>
        </text>
    {/text}
</svg>