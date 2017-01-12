<svg id="{id}-svg" style="width:100%;height:100%;" style="overflow:visible">
    {#circles}
        <circle id="{id}-legend-{.cls}" cx="{.cx}" cy="{.cy}" r="{.r}" class="{.cls}"/>
        <text text-anchor="middle" x="{.cx}" y="{@math key="{.cy}" method="add" operand="{.r}"/}" dy="{tOffset}" font-size="{fontSize}">{.text}</text>
    {/circles}
</svg>