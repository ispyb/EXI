

<div class="container-fluid">
    <div class="row">
        <div class="col-sm-1"></div>
        <div class="col-sm-1">Movies</div> 
        <div class="col-sm-1">Motion Correction</div> 
        <div class="col-sm-1">CTF</div> 
        <div class="col-sm-1">Img</div> 
    </div> 
     {#gridSquares} 
     <div class="row">
        <div class="col-sm-1"><a href='#/em/datacollection/{.dataCollectionId}/main'>Grid Square #{.name}</a></div>
        <div class="col-sm-1">{.movieCount}</div> 
        <div class="col-sm-1">{.motionCorrectionCount}</div> 
        <div class="col-sm-1">{.ctfCount}</div> 
        <div class="col-sm-1">
            <a href="{.snapshot}" data-lightbox='{.snapshot}' data-title="{.name}">
                <img  src="{.snapshot}" class='img-thumbnail' style='height:50px;width:250px;' data-src="{.snapshot}"/>                  
            </a>                 
        </div> 
{.snapshot}
      </div>

      {/gridSquares}   
</div> 



