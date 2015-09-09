var achieveWizard = angular.module('achieveWizard',[]);

achieveWizard.factory('createWizard', ["objArr", function(objArr){
    
    return (function() {
        
        var steps;
        var type;
        var current;
        var currentNum; 
        
        var getStep = function(step) {
            return $('.wizard-step-' + step);
        }
        
        
        var changeStep = function(toStep) {
            if(angular.isDefined(current) && angular.isDefined(current.onsubmit))
            {
                current.onsubmit();
            }
            
            current = steps[type][toStep];
            currentNum = toStep;
            
            angular.forEach(steps[type],function(s,i) {
                getStep(s.alias).css({ display : 'none'});
            });
            
            if(angular.isDefined(current.onload))
                current.onload();

            getStep(current.alias).fadeIn(600);
        }
        
        this.init = function(stepsInit, typeInit) {
            steps = stepsInit; 
            type = typeInit;
            
            changeStep(0);
        };
        
        this.next = function() {
            if(steps[type][currentNum + 1])
            {
                changeStep(currentNum + 1);
                return 1;
            }
            
            return 0;
        }
        
        this.previous = function() {
            if(currentNum - 1 >= 0)
            {
                changeStep(currentNum - 1);
                return 1;
            }
            
            return 0;
        }

        return this;
    })();
}]);