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
        templateUrl : 'assets/views/directives/list-item.html',
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
});