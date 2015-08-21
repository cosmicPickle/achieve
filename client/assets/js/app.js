var achieveApp = angular.module('achieveApp', [
    'ngRoute', 
    'achieveApi',
    'achieveArrays',
    'uiBaseDirectives',
    'achievementControllers',
    'categoryControllers',
    'profileControllers',
    'utilsControllers',
    'taskControllers',
    'angular-svg-round-progress',
    'ui.bootstrap']);

achieveApp.config(['$routeProvider', function($routeProvider) {
        
    $routeProvider
        .when('/category/:type/:alias?', {
            templateUrl : 'assets/views/partials/category.html',
            controller : 'CategoryMainCtrl'
        })
        .when('/achievement/:alias', {
            templateUrl : 'assets/views/partials/achievement.html',
            controller : 'AchievementMainCtrl'
        })
        .when('/task/:alias', {
            templateUrl : 'assets/views/partials/task.html',
            controller : 'TaskMainCtrl'
        })
        .when('/profile/:action/:user?', {
            templateUrl : 'assets/views/partials/profile.html',
            controller : 'ProfileMainCtrl'
        })
        .when('/404', {
            templateUrl : 'assets/views/partials/404.html',
        })
        .otherwise({
            redirectTo : '/404'   
        });
}]);