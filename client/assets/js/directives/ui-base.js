var uiBaseDirectives = angular.module('uiBaseDirectives',[]);

uiBaseDirectives.directive('achvListItem', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            type : '@',
            colorDefault : "="
        },
        templateUrl : 'assets/views/directives/listItem.html',
        link : function(scope, element, attr) {
            
            var color = (scope.item && scope.item.color) || scope.colorDefault;
;            var defColor = $(element).css('color');
            
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
}).directive('stats', function(){
    return {
        restrict : 'E',
        transclude : true,
        replace : true,
        scope : {
            items : '=',
            linkType : '@',
        },
        templateUrl : 'assets/views/directives/stats.html',
    };
})
.directive('statsItem', function(){
    return {
        restict : 'E',
        transclude : true,
        replace : true,
        scope : {
            item : '=',
            linkType : '=',
        },
        templateUrl : 'assets/views/directives/statsItem.html',
        controller : ['$scope', function($scope){
           $scope.link = '#/' + $scope.linkType + '/';
           $scope.title = '';
           $scope.image = '';
           $scope.colors = {
               color : '',
               bg_color : '',
           }
           
           if($scope.linkType == 'achievement')
           {
               $scope.link += $scope.item.achievement.alias;
               $scope.title = $scope.item.achievement.locale[0].title || $scope.item.achievement.title;
               $scope.image = $scope.item.achievement.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.achievement.color || $scope.item.achievement.category.color,
                   bg_color : $scope.item.achievement.bg_color || $scope.item.achievement.category.bg_color
               }
           }
           if($scope.linkType == 'category')
           {
               $scope.link += $scope.item.achievement.category.alias;
               $scope.title = $scope.item.achievement.category.locale[0].title || $scope.item.achievement.category.title;
               $scope.image = $scope.item.achievement.category.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.achievement.category.color,
                   bg_color : $scope.item.achievement.category.bg_color
               }
           }
           
           if($scope.linkType == 'task')
           {
               $scope.link += $scope.item.task.alias;
               $scope.title = $scope.item.task.locale[0].title || $scope.item.task.title;
               $scope.image = $scope.item.task.image || 'fa-image';
               
               $scope.colors = {
                   color : $scope.item.task.color || $scope.item.task.category.color,
                   bg_color : $scope.item.task.bg_color || $scope.item.task.category.bg_color
               }
           }
        }],
        link : function(scope, element, attr) {
            
            var defColor = $(element).css('color');
            
            element.on('mouseenter', function(){
                $(element).children('a').finish();
                $(element).children('a').animate({
                   color : scope.colors.color || defColor
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
});