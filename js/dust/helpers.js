dust.helpers.decimal = function(chunk, context, bodies, params) {
    if (params.key){            
        var value = context.current()[params.key];
        if (value){
            if (params.decimals != null){
                try{
                        chunk.write(Number(value).toFixed(params.decimals));
                }
                catch(e){
                    
                    /** There was an error, we leave same value */
                    chunk.write(context.current()[params.key]);    
                }
            }
            else{
                /** No decimals then same value */
                chunk.write(context.current()[params.key]);
            }
        }
        
    }
    else{
        chunk.write('WARN: NO KEY SET');
    }
        return chunk;
    
};

dust.helpers.sizeOf = function(chunk, context, bodies, params) {
  var value = this.size(chunk, context, bodies, params);
  return (bodies && bodies.block) ? chunk.render(bodies.block, context.push({ isSelect: true, isResolved: false, selectKey: value })) : value;
};

dust.helpers.exponential = function(chunk, context, bodies, params) {
    if (params.key){            
        var value = context.current()[params.key];
        if (value){
            if (params.decimals != null){
                try{
                        chunk.write(Number(Number(value).toFixed(params.decimals)).toExponential());
                }
                catch(e){
                    
                    /** There was an error, we leave same value */
                    chunk.write(context.current()[params.key]);    
                }
            }
            else{
                /** No decimals then same value */
                chunk.write(context.current()[params.key]);
            }
        }
        
    }
    else{
        chunk.write('WARN: NO KEY SET');
    }
        return chunk;
    
};

dust.helpers.mmVolTest = function(chunk, context, bodies, params) {         
    var value = context.current()["Subtraction_volumePorod"];
    if (value){
        try{
                chunk.write(Number(value / 2).toFixed(1) + " - " + Number(value / 1.5).toFixed(1));
        }
        catch(e){
            
            /** There was an error, we leave same value */
            chunk.write(context.current()[params.key]);    
        }
    }
    return chunk;
    
};


dust.helpers.framesColor = function(chunk, context, bodies, params) {          
    var merge = context.current()["Merge_framesMerge"];
    var count = context.current()["Merge_framesCount"];
    var color = "undefined";
    if (merge == null || count == null) {
        color = "orange";
    } else {
        if (merge/count >= 0.3) {
            color = "orange";
        }
        if (merge/count >= 0.7) {
            color = "undefined";
        }
        if (merge/count < 0.3) {
            color = "red"
        }
    }
    try{
            chunk.write(color);
    }
    catch(e){
        
        /** There was an error, we leave same value */
        chunk.write(context.current()[params.key]);    
    }
    return chunk;
    
};

dust.helpers.fileName = function (chunk, context, bodies, params) {
    var filePath = context.current()["filePath"];
    if (filePath) {
        try{
            var withExtension = filePath.substring(filePath.lastIndexOf('/')+1);
            chunk.write(withExtension.substring(0,withExtension.indexOf(".")));
        }
        catch(e){
            /** There was an error, we leave same value */
            chunk.write(context.current()[params.key]);    
        }
    }
    return chunk;
}