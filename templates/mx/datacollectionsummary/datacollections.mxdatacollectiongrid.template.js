{!<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css">
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.1/jquery.min.js"></script>!}
<div class="container-fluid containerWithScroll" >
    <div class="row">
        <div class="col-xs-12 col-md-12">        
            <table class="table table-striped table-hover">
              <thead>
                <tr>
                    <th>Prefix</th>
                    <th>Run</th>
                    <th>#Images</th>
                    <th>Exposure<br/>Time</th>
                    <th>Res. (corner)</th>
                    <th>Wavelength</th>
                    <th>Transmission</th>
                    <th>Directory and<br/>image template</th>
                    <th>Time</th>
                    <th>Run status</th>
                    <th>Indicators</th>
                    <th>View<br/>Results</th>
                    <th>Phasing</th>
                    <th>Comments</th>
                    <th></th>
                </tr>
                </thead>
                
            {#.}
                {@eq key=runStatus value="failed"}
                <tr class="danger">
                {:else}
                 <tr>
                {/eq}    
                    <td>{.imagePrefix}</td>
                    <td>{.dataCollectionNumber}</td>
                    <td ><span class="badge" style='background-color:#337ab7;'>{.numberOfImages}</span></td>
                    <td >{.exposureTime} s</td>
                    <td >{@decimal key="resolution" decimals=1}{/decimal} &#8491; ({@decimal key="resolutionAtCorner" decimals=1}{/decimal} &#8491;)</td>
                    <td > {@decimal key="wavelength" decimals=4}{/decimal} &#8491;</td>
                    <td>{@decimal key="transmission" decimals=2 intIfPossible="true" /}%</td>
                    <td>
                        <button type="button" class="btn btn-sm" data-toggle="modal" data-target="#myModal{.dataCollectionId}"><span class="glyphicon glyphicon-folder-close" aria-hidden="true"></span></button>
                        <!-- Modal -->
                        <div class="modal fade" id="myModal{.dataCollectionId}" role="dialog">
                          <div class="modal-dialog">
                          
                            <!-- Modal content-->
                            <div class="modal-content">
                              <div class="modal-header">
                                <button type="button" class="close" data-dismiss="modal">&times;</button>
                                <h4 class="modal-title">Image directory and template</h4>
                              </div>
                              <div class="modal-body">
                                <p>{.imageDirectory}</p>
                                <p>{.formattedFileTemplate}</p>
                                <p>{.imageDirectory}/{.formattedFileTemplate}</p>
                              </div>
                              <div class="modal-footer">
                                <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
                              </div>
                            </div>
                            
                          </div>
                        </div>
                    </td>
                    <td>{@formatDate date=.startTime format="HH:mm:ss" /}</td>
                    <td>{.runStatus}</td>
                    <td>
                    {@eq key=showQILink value="true" type="boolean"}
                    <a href={.urlImageQualityIndicators} data-lightbox={.urlImageQualityIndicators} >
                        <img src={.urlImageQualityIndicators} height="35px" width="35px"/></a>
                    {:else}
                        <img src={.urlImageQualityIndicators} height="35px" width="35px"/>
                    {/eq}
                    </td>


                    <td>{@gt key=hasAutoProcessing value=0}
                          <a target='blank' href="#/autoprocintegration/datacollection/{.dataCollectionId}/main">
                            <span style='font-size: 1em;' class="glyphicon glyphicon-eye-open"  ></span>
                        </a>
                        {/gt}</td>
                    <td>{@gt key=hasPhasing value=0}<div class='summary_datacollection_success'></div>{/gt}</td>
                    <td>
                        {#.onlineresults[0]}
                            <div>
                                {>"sm.completeness.autoproc.mxdatacollectiongrid.template"  /}
                            </div>
                        {/.onlineresults[0]}
                        <div class="wordwrap">
                            <a class="btn btn-xs">
                                <span id="{.dataCollectionId}-edit-comments" class="glyphicon glyphicon-edit dataCollection-edit"></span>
                            </a>
                            <span id="comments_{.dataCollectionId}">{.comments}</span>
                        </div>
                    </td>
                </tr>
                    
                   
             {/.}    
             </table>
        </div>
    </div>
</div>