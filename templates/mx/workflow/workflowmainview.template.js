

   
     {@eq key=type value="images"}
        <table align="center">
            <tr>
                {#items}
                        <td>
                            <a href="data:image/png;base64,{.value}" data-lightbox='a' data-title="{.title}">
                                <img height="{.ysize}" width="{.xsize}" src="data:image/png;base64,{.value}" />
                            </a>
                            <br />
                            <span class='summary_datacollection_parameter'>{.title}</span>
                        </td>
                    </div>	
                {/items}
            </tr>	
        </table>	
	{/eq}
    
    {@eq key=type value="image"}
	    <div align="center">
            
                <img height="200" width="200" src="data:image/png;base64,{.value}" />
          
            <br />
            <span class='summary_datacollection_parameter'>{.title}</span>
        </div>			
	{/eq}
    
    
     
    {@eq key=type value="logFile"}
        <div class="container">
            <button id={.id} style='margin:10px;'  type="button" class="btn btn-default">
                    <span class="glyphicon glyphicon-download-alt"></span> {.title}
            </button>
        </div>	
	    {!<div  style='border:1px solid gray;background-color:#FAFAFA;margin:10px;'>
            <span  style='color: #157fcc;font-size: 17px;   font-weight: 300;'>{.title}</span>
            <textarea style='margin:10px;' rows="10" cols="150">
                {.logText} 
            </textarea>
        </div>!}			
	{/eq}
     
    
    
    {@eq key=type value="title"}
	    <div>
            <h1 >{.value}</h1>
        </div>			
	{/eq}
    
    {@eq key=type value="info"}
        <div class="container">
            <div class="alert alert-info">
                    {.value}
            </div>
        </div>
	   		
	{/eq}
     
    {@eq key=type value="table"}
        <div class="container">
           
            <table class="table table-hover table-striped table-bordered"> 
                <tr>                    
                        <th style='background-color:#3892d3;color:white;font-size:14px;' colspan={.columns.length}>{.title}</th>                   
                </tr>                    
                <tr>
                    {#columns}
                        <th>{.}</th>
                    {/columns}
                </tr>	
            
                    {#data}
                        <tr>
                            {#.}
                                <td>{.}</td>
                            {/.}
                        </tr> 
                    {/data}
            </table> 
         </div>                                  		
	{/eq}  
     
    
    	

	

