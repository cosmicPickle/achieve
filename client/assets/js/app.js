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
    'ui.bootstrap',
    'pascalprecht.translate']);

achieveApp.config(['$routeProvider', '$translateProvider', function($routeProvider, $translateProvider) {
        
    $routeProvider
        .when('/category/:type/:alias?', {
            templateUrl : 'assets/views/partials/category.html',
            controller : 'CategoryMainCtrl',
            menu : {
                icon : 'fa-folder',
                lable : 'categories',
                link : '#category/achievements/',
                nested : false,
                items : {
                    '/category/achievements/' : {
                        link : '#category/achievements/',
                        icon : 'fa-calendar-check-o',
                        lable : 'categoryAchievements'
                    },
                    '/category/tasks/' : {
                        link : '#category/tasks/',
                        icon : 'fa-tasks',
                        lable : 'categoryTasks'
                    }
                }
            }
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
            controller : 'ProfileMainCtrl',
            menu : {
                icon : 'fa-cog',
                lable : 'profile',
                nested : true,
                items : {
                    '/profile/general/' : {
                        link : '#profile/general/',
                        icon : 'fa-user',
                        lable : 'generalProfile'
                    },
                    '/profile/stat/' : {
                        link : '#profile/stats/',
                        icon : 'fa-line-chart',
                        lable : 'statProfile'
                    },
                    '/profile/history/' : {
                        link : '#profile/history/',
                        icon : 'fa-calendar',
                        lable : 'historyProfile'
                    }
                }
            }
        })
        .when('/404', {
            templateUrl : 'assets/views/partials/404.html',
        })
        .otherwise({
            redirectTo : '/404'   
        });
    
    $translateProvider.useLoader('$translatePartialLoader', {
        urlTemplate: 'assets/lang/{lang}/{part}.json'
    });
    
    $translateProvider.preferredLanguage('en');
}]);