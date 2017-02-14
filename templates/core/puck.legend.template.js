<svg id="{id}-svg" style="width:100%;height:100%;" style="overflow:visible">
    {#circles}
        <circle id="{id}-legend-{.cls}" cx="{.cx}" cy="{.cy}" r="{.r}" class="{.cls}"/>
        <text text-anchor="middle" x="{.cx}" y="{.cy}" dy="{tOffset}" font-size="{fontSize}">{.text}</text>
    {/circles}
</svg>