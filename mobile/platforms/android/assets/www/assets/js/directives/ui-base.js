var uiBaseDirectives = angular.module('uiBaseDirectives',[]);

uiBaseDirectives.directive('achvTutorial', ['$rootScope', '$window', '$state', '$translate', function($rootScope, $window, $state, $translate){
    return {
        restict : 'E',
        scope : {
            achvTutorial : '=',
            atStartOn: '=',
            atIf : '=',
            atSref: '@',
            atSrefParams: '=',
            atVoid: '=',
            atText: '@'
        },
        template : '',
        controller : ['$scope', function($scope){
            
            $scope.refocus = function(element, attrs) {

                $scope.focused.height(element.outerHeight());
                $scope.focused.width(element.outerWidth());
                $scope.focused.css({
                    'position' : 'absolute',
                    'top' : element.offset().top,
                    'left' : element.offset().left,
                    'box-shadow' : '0 0 0 99999px rgba(0, 0, 0, .8)',
                    'z-index' : 9000
                });        
                
                $scope.tip.css({
                    'position' : 'absolute',
                    'top' : element.offset().top + element.outerHeight() + 10,
                    'left' : element.offset().left,
                    'z-index' : 9000
                });  
                
                $scope.focused.addClass('pointer');
                if($scope.atVoid)
                {
                    $scope.tip.addClass('pointer');
                    $scope.backdrop.addClass('pointer');
                }
            }
                
            $scope.run = function(element, attrs){
                
                //The window  object
                var w = angular.element($window);

                //We watch the window dimentions for change
                $rootScope.$watch(function(){
                    return {
                        h : w.height(),
                        w : w.width()
                    };
                }, function(window){
                    if(!$scope.focused)
                        return;
                    
                    $scope.refocus(element, attrs);
                }, true);
                
                //Adding the backdrop
                $scope.backdrop = angular.element('<div></div>');
                $scope.backdrop.css({
                    'position' : 'fixed',
                    'top' : 0,
                    'left' : 0,
                    'right' : 0,
                    'bottom' : 0,
                    'z-index' : 8000
                });
                
                //Adding the focused element
                $scope.focused = angular.element('<div></div>');
                $scope.tip = angular.element('<div class="tutorial-tip"></div>');
                $scope.tip.text($translate.instant($scope.atText));
          
                $scope.refocus(element, attrs);
                
                $scope.backdrop.appendTo(angular.element('body'));
                $scope.focused.appendTo(angular.element('body'));
                $scope.tip.appendTo(angular.element('body'));
                
                $scope.focused.on('click', function(){
                    $scope.close();
                    if($scope.atSref)
                    {
                        var params = $scope.atSrefParams ? $scope.atSrefParams : {};
                        $state.go($scope.atSref, params);
                    }
                });

                if($scope.atVoid)
                {
                    $scope.backdrop.on('click', function(){
                        $scope.close();
                    });
                    
                    $scope.tip.on('click', function(){
                        $scope.close();
                    });
                }
            };
            
            $scope.close = function(){
                $scope.focused.remove();
                $scope.backdrop.remove();
                $scope.tip.remove();
                
                $rootScope.$emit('startTutorialStep' + ($scope.achvTutorial + 1));
            };
        }],
        link : function(scope, element, attrs) {
            
            if(scope.atStartOn)
                scope.run(element, attrs);
            else
            {
                if(!scope.atIf)
                    return;
            
                $rootScope.$$listeners['startTutorialStep' + scope.achvTutorial] = []
                $rootScope.$on('startTutorialStep' + scope.achvTutorial, function(event){
                    scope.run(element, attrs);
                });
            }
        }
    };
}]);
