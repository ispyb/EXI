function AutoprocessingRanker(){
    
    
}

/**
 * Filter by space group and lower rMerge
 * 
 */
AutoprocessingRanker.prototype.rank = function(array, spacegroudFieldName){
    
   /** First sorting autoprocessing with rMerge < 10 */
   var minus10Rmerge  = _.filter(array, function(o) {       
            if (o.innerShell){
                if (o.innerShell.rMerge){                    
                    if ((Number(o.innerShell.rMerge) <= 10) && (Number(o.innerShell.rMerge) > 0)){
                        return true;
                    }
                }
            }
            return false        
     }); 
     /** Second we get rMerge > 10 */
    var plus10Rmerge  = _.filter(array, function(o) {
        
            if (o.innerShell){
                if (o.innerShell.rMerge){                    
                    if (Number(o.innerShell.rMerge) > 10 || Number(o.innerShell.rMerge) <= 0){
                        return true;
                    }
                }
            }
            return false        
     }); 
   
    
     function sortByHighestSymmetry(a, b) {         
        var spaceGroupA = a[spacegroudFieldName].replace(/\s/g, "");        
        var spaceGroupB = b[spacegroudFieldName].replace(/\s/g, "");
        
        if ( _.indexOf(ExtISPyB.spaceGroups, spaceGroupA) ==  _.indexOf(ExtISPyB.spaceGroups, spaceGroupB)){                          
            return ( parseFloat(a.innerShell.rMerge) -  parseFloat(b.innerShell.rMerge));
        }
        return _.indexOf(ExtISPyB.spaceGroups, spaceGroupB) - _.indexOf(ExtISPyB.spaceGroups, spaceGroupA);                           
       
    }
    
    function sortByrMerge(a, b) {                                    
         return ( parseFloat(a.innerShell.rMerge) -  parseFloat(b.innerShell.rMerge));                                       
    }

    /** Sort rmerge < 10 by highest symmetry 
    for (var i = 0; i < minus10Rmerge.length; i++){
        console.log(minus10Rmerge[i][spacegroudFieldName]);
    }*/
   
    minus10Rmerge.sort(sortByHighestSymmetry); 
    plus10Rmerge.sort(sortByrMerge); 
    
    if (minus10Rmerge[0]){
        minus10Rmerge[0].label = "BEST";
    }
    
    /** Setting lables */
    if (plus10Rmerge){
        for(var i = 0; i < plus10Rmerge.length; i++){
            plus10Rmerge[i].label = "rMerge > 10";
        }
    }
       
    return _.concat(minus10Rmerge, plus10Rmerge);    
};

AutoprocessingRanker.prototype.sortBySpaceGroup = function(array, spacegroudFieldName){
    try{
        for(var i =0; i < array.length; i++){
            var spaceGroudTrimmed = array[i][spacegroudFieldName].replace(/\s+/g, '');
            array[i].rank = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed);
        }
        
    }
    catch(e){
        return array;
    }
    return array;
};

AutoprocessingRanker.prototype.sortByRMergeLower = function(array, spacegroudFieldName){
    try{
        for(var i =0; i < array.length; i++){
            var spaceGroudTrimmed = array[i][spacegroudFieldName].replace(/\s+/g, '');
            array[i].rank = _.indexOf(ExtISPyB.spaceGroups, spaceGroudTrimmed);
        }
        
    }
    catch(e){
        return array;
    }
    return array;
};
