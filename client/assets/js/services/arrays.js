var achieveArrays = angular.module('achieveArrays',[]);

achieveArrays.factory('objArr', function(){
    return (function() {
        var getDeepVal = function(arr, pathArr) {
            
            var path = pathArr.split('.');
            if(path.length > 1)
            {
                var deepVal = arr;
                angular.forEach(path, function(pathPart, j){
                    if(angular.isDefined(deepVal[pathPart]))
                        deepVal = deepVal[pathPart];
                    else
                    {
                        deepVal = null;
                        return false;
                    }
                });
            }
            else
                deepVal = arr[pathArr];
            
            return deepVal;
        }
        
        this.max = function(arr, maxBy) {
            var max = null;
                    
            angular.forEach(arr, function(val, i){
                
                var deepVal = getDeepVal(val, maxBy);
                if(angular.isDefined(deepVal) && max == null )
                    max = i;
                else if(angular.isDefined(deepVal) && deepVal > max)
                    max = i;
            })
            
            if(max != null)
                return arr[max];
            return null;
        };
        
        this.min = function(arr, minBy) {
            var min = null;
                    
            angular.forEach(arr, function(val, i){
                
                var deepVal = getDeepVal(val, minBy);
                if(angular.isDefined(deepVal) && min == null )
                    min = i;
                else if(angular.isDefined(deepVal) && deepVal < min)
                {
                    min = i;
                }
            });
            
            if(min != null)
                return arr[min];
            return null;
        };
        
        this.search = function(arr, searchBy, search) {
            var found = null;
            angular.forEach(arr, function(val, i){
                
                var deepVal = getDeepVal(val, searchBy);
                if(angular.isDefined(deepVal) && deepVal == search)
                {
                    found = val;
                    return false;
                }
            });
            return found;
        };
        
        this.merge = function(arr1, arr2, arr1col, arr2col, as) {
            angular.forEach(arr1, function(val1, i1){
                if(angular.isDefined(val1[arr1col]))
                    val1[as] = search(arr2, arr2col, val1[arr1col])
            });
            
            return arr1;
        };
        
        this.sum = function(arr, sumBy)
        {
            var sum = 0;
            angular.forEach(arr, function(val, i){
                var deepVal = getDeepVal(val, sumBy);
                if(angular.isDefined(deepVal))
                    sum += deepVal;
            });
            
            return sum;
        }
        
        return this;
    })();
});