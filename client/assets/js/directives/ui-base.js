var uiBaseDirectives = angular.module('uiBaseDirectives',[]);

uiBaseDirectives.directive('achvTutorial', ['$rootScope', '$window', '$state', '$translate', function($rootScope, $window, $state, $translate){
    return {
        restict : 'E',
        scope : {
            //The number of the step
            achvTutorial : '=',
            //If this is true the step will start. Used for first steps of tutorials
            atStartOn: '=',
            //If this is false this step will not execute even by event
            atIf : '=',
            //Used in combination with atIf. Shows whether or not we should continue to next step
            atToNext : '=',
            //This shows which state the tutorial is bound to
            atState : '@',
            //If this is true clicking anywhere dismisses the step and calls the event for next step.
            //If set to false click propagates to the element
            atVoid: '=',
            //The text of the tip
            atText: '@',
            //The position of the tip. (Default 'bottom')
            atTipPosition: '@',
        },
        template : '',
        controller : ['$scope', function($scope){
            
            $scope.refocus = function(element, attrs) {
                
                $scope.focused.height(element.outerHeight() - 4);
                $scope.focused.width(element.outerWidth() - 4);
                $scope.focused.css({
                    'position' : 'absolute',
                    'top' : element.offset().top,
                    'left' : element.offset().left,
                    'box-shadow' : '0 0 0 99999px rgba(0, 0, 0, .8)',
                    'border' : '2px solid #eeaf28',
                    'z-index' : 9000
                });      
                
                $scope.tip.css({
                    'position' : 'absolute',
                    'z-index' : 9000
                }); 
                //Positioning tip
                var tipPos = {};
                if(!$scope.atTipPosition)
                    $scope.atTipPosition = 'bottom'
                
                if($scope.atTipPosition == 'bottom')
                    tipPos = {
                        'top' : element.offset().top + element.outerHeight() + 10,
                        'left' : element.offset().left,
                    }
                
                if($scope.atTipPosition == 'top')
                {
                    tipPos = {
                        'bottom' : angular.element('body').height() - element.offset().top,
                        'left' : element.offset().left,
                    }
                }
                
                if($scope.atTipPosition == 'left')
                    tipPos = {
                        'top' : element.offset().top,
                        'right' : element.offset().left + 10,
                    }
                
                if($scope.atTipPosition == 'right')
                    tipPos = {
                        'top' : element.offset().top,
                        'left' : element.offset().left + element.outerWidth() + 10,
                    }
                
                if($scope.atTipPosition == 'in')
                {
                    tipPos = {
                        'bottom' : angular.element('body').height() - (element.offset().top + element.outerHeight() - 10),
                        'left' : element.offset().left,
                    }
                }
                
                $scope.tip.css(tipPos);
                
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
                
                $scope.$watch(function(){
                    return {
                        height : element.height(),
                        width : element.width(),
                        top : element.offset().top,
                        left : element.offset().left,
                        display : element.css('display'),
                        visibility : element.css('visibility')
                    };
                },function(){
                    $scope.refocus(element,attrs);
                }, true)
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
                    
                    if(!$scope.atVoid)
                        element.trigger('click');
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
            
            //This function is essentially same as close, but doesn't trigger a next event
            //Also removes current event listeners
            $scope.destroy = function() {
                $scope.focused.remove();
                $scope.backdrop.remove();
                $scope.tip.remove();
                
                //Removing event listeners
                angular.forEach($rootScope.$$listeners, function(listener, key){
                   if(key.match(/^startTutorialStep/))
                   {
                       $rootScope.$$listeners[key] = [];
                   }
                });
            }
        }],
        link : function(scope, element, attrs) {
            //Lets add a listener for state change event to remove all tutorials
            $rootScope.$on('$stateChangeSuccess', function(event, currentRoute, previousRoute) {
                if(scope.focused)
                    scope.destroy();
            });
            
            //First we need to see if this tutorial is bound to a specific state
            if(scope.atState)
            {
                //Yes it is. We need to watch the current state for change
                scope.$watch(function(){
                    return $state.current;
                }, function(state){
                    //If we are on the right state we can go on
                    if(scope.atState == state.name)
                    {
                        
                        if(scope.atStartOn)
                            //If this is a first step of a tutorial it needs to be exeduted by a condition
                            scope.run(element, attrs);
                        else
                        {
                            
                            scope.$watch('atStartOn', function(start){
                                if(start)
                                {
                                    //We want to watch the startOn attr in case it changes
                                    scope.run(element, attrs);
                                    //Oh and we don't want this to be executed again by a listener
                                    return;
                                }
                                
                            });
                            
                            //Lets put an event listener that waits for the previous step to end
                            $rootScope.$on('startTutorialStep' + scope.achvTutorial, function(event){
                                
                                //This is not a first step it will be executed by event
                                if(angular.isDefined(scope.atIf) && !scope.atIf)
                                {
                                    //... well not really because it doesn't match the condition. 
                                    //Do we want to continue? Go to next
                                    if(scope.atToNext)
                                        $rootScope.$emit('startTutorialStep' + (scope.achvTutorial + 1));
                                    
                                    return;
                                }
                                
                                //We want the listener to execute only once so we remove it
                                $rootScope.$$listeners['startTutorialStep' + scope.achvTutorial] = [];
                                scope.run(element, attrs);
                            });
                        }
                    }
                });
            }
            //No state was specified the tutorial will not run
        }
    };
}]);
