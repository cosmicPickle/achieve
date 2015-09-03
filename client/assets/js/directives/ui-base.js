var uiBaseDirectives = angular.module('uiBaseDirectives',[]);

uiBaseDirectives.directive('achvListing', function(){
    return {
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            items : '=',
            type : '@',
            category : "="
        },
        templateUrl : 'assets/views/directives/listing.html',
        link : function(scope, element, attr) {
            
        }
    };
})
.directive('achvListItem', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=item',
            type : '=type',
            category : "="
        },
        templateUrl : 'assets/views/directives/listItem.html',
        link : function(scope, element, attr) {
            
            var color = scope.item.color || scope.category.color;
            var defColor = $(element).css('color');
            
            element.on('mouseenter', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : color || defColor
                },100);
            });
            
            element.on('mouseleave', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : defColor
                },200);
            });
        }
    } 
})
.directive('parseStyle', ["$interpolate", function($interpolate) {
    return function(scope, elem) {
        var exp = $interpolate(elem.html()),
            watchFunc = function () { return exp(scope); };

        scope.$watch(watchFunc, function (html) {
            elem.html(html);
        });
    };
}])
.directive('earned', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            color : '=',
            href : '@'
        },
        templateUrl : 'assets/views/directives/earned.html',
        link : function(scope, element, attr) {
            var defColor = $(element).css('color');
            
            element.on('mouseenter', function(){
                $(element).finish();
                $(element).animate({
                   color : scope.color
                },100);
            });
            
            element.on('mouseleave', function(){
                $(element).finish();
                $(element).animate({
                   color : defColor
                },200);
            });
        }
    } 
}).directive('profileNav', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            action : "=",
            uid : "="
        },
        templateUrl : 'assets/views/directives/profileNav.html',
        controller : ['$scope', '$location', function($scope, $location){
                //The profile actions
            $scope.actions = {
                general : {
                    title : 'general',
                    url : 'assets/views/partials/profileGeneral.html',
                    public : 1,
                },
                stats : {
                    title : 'stats',
                    url : 'assets/views/partials/profileStats.html',
                    public : 0,
                },
                history : {
                    title : 'history',
                    url : 'assets/views/partials/profileHistory.html',
                    public : 0,
                },
            } 

            //Determining whether all the actions wil be visible or not. If the user id 
            //is -1 it means we are looking at the current user. Then everething is visible.
            //If not only the public tabs are visible;
            angular.forEach($scope.actions, function(a, i){
               a.visible = + (a.public || (!a.public && $scope.uid == -1)); 
               a.active = + (a.visible && i == $scope.action);
            });

            //Modifies the route when the tab is changed
            $scope.changeAction = function(action, i) {

                if(i == $scope.action)
                    return; 

                var path = '/profile/' + i;
                if($scope.uid != -1)
                    path += "/" + $scope.uid;
                
                $location.path(path);
            }
        }]
    } 
}).directive('directiveGenerator', function($compile) {
    return {
        scope: {
            directive: '=',
            params: '='
        },
        link: function(scope, element) {
            
            var generatedTemplate = '<' + scope.directive + ' ';
            
            angular.forEach(scope.params, function(param, i){
                generatedTemplate += i + '="params.' + i + '" '
            })
            
            generatedTemplate += '></' + scope.directive + '>';
            element.append($compile(generatedTemplate)(scope));
        }
    };
});